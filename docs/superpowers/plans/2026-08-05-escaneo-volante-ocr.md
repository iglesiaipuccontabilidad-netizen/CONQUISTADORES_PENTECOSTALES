# Escaneo de volante con OCR — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Un líder autenticado fotografía un volante de papel con su celular y el formulario de `/dashboard/jovenes/nuevo` queda prellenado para que él revise, corrija y confirme.

**Architecture:** La foto se comprime en el navegador y viaja a una route handler de Next.js que verifica la sesión contra Supabase y llama a un único modelo multimodal (Gemini, capa gratuita; Groq como respaldo) que hace OCR y estructuración en una sola llamada. El servidor normaliza el resultado con funciones puras antes de devolverlo — nunca se confía en el formato del modelo. La IA solo prellena el formulario; jamás escribe en la base de datos.

**Tech Stack:** Next.js 16 (App Router, route handlers), React 19, React Hook Form 7 + Zod 4, Radix UI, TanStack Query 5, axios (`utils/api-client.ts`), Supabase JS 2, Vitest (nuevo), `fetch` nativo para Gemini y Groq (sin SDK).

**Spec:** `docs/superpowers/specs/2026-08-05-escaneo-volante-ocr-design.md`

## Global Constraints

- **Sin cambios de base de datos.** Los campos ya existen en la tabla `jovenes`.
- **`consentimiento_datos_personales` NUNCA se autocompleta.** No aparece en el tipo `DatosVolante`, no se pide en el prompt, no se envía al cliente. Lo marca el líder a mano (Ley 1581 de 2012).
- **Las claves de API viven solo en el servidor.** Jamás con prefijo `NEXT_PUBLIC_`.
- **La foto no se persiste nunca**: ni en disco, ni en Supabase, ni en logs. Solo memoria durante la petición.
- **El registro manual nunca se bloquea.** Si el escaneo falla por cualquier motivo, la pantalla sigue funcionando como hoy.
- **Idioma:** todo el texto visible al usuario en español. Nombres de funciones y variables nuevas en español, siguiendo el código existente (`nombreDuplicado`, `verificandoNombre`).
- **Alias de imports:** el proyecto usa `@/lib/*`, `@/components/*`, etc. Los archivos de prueba usan imports **relativos** para no depender de configuración extra de Vitest.
- **Base URL del cliente HTTP:** `NEXT_PUBLIC_API_URL=/api`, así que `apiClient.post('/ocr/volante')` llega a `app/api/ocr/volante/route.ts`. Usa siempre `apiClient`, nunca `fetch` directo desde el cliente.
- **Convención de respuesta de API:** `{ success, data?, error?, message? }`, vía los helpers de `utils/cors.ts`.

---

### Task 1: Vitest + normalización de datos

El módulo de normalización es puro (sin red, sin IA, sin React) y es lo que impide que un dato mal leído entre sucio a la base de datos. Se construye con TDD. Esta tarea también instala el runner de pruebas, porque es el primer código del proyecto que lo necesita.

**Files:**
- Modify: `package.json` (devDependencies + script `test`)
- Create: `vitest.config.ts`
- Create: `lib/ocr/normalize.ts`
- Test: `lib/ocr/normalize.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `DatosVolante` — interface con `nombre_completo: string`, `celular: string`, `fecha_nacimiento: string`, `direccion: string`, `bautizado: boolean`, `sellado: boolean`, `servidor: boolean`, `simpatizante: boolean`. **No incluye `consentimiento_datos_personales`.**
  - `ResultadoNormalizado` — `{ data: DatosVolante; campos_no_leidos: string[] }`
  - `normalizarCelular(raw: unknown): string | null`
  - `normalizarFecha(raw: unknown): string | null`
  - `normalizarResultado(crudo: unknown): ResultadoNormalizado`

- [ ] **Step 1: Instalar Vitest**

```bash
npm install --save-dev vitest@^3
```

- [ ] **Step 2: Crear la configuración de Vitest**

Crear `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['node_modules/**', '.next/**', 'supabase/**'],
  },
})
```

- [ ] **Step 3: Agregar el script de pruebas**

En `package.json`, dentro de `"scripts"`, agregar después de `"lint"`:

```json
"test": "vitest run"
```

- [ ] **Step 4: Escribir las pruebas que fallan**

Crear `lib/ocr/normalize.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { normalizarCelular, normalizarFecha, normalizarResultado } from './normalize'

describe('normalizarCelular', () => {
  it('acepta 10 dígitos limpios', () => {
    expect(normalizarCelular('3001234567')).toBe('3001234567')
  })

  it('quita el indicativo +57 y los espacios', () => {
    expect(normalizarCelular('+57 300 123 4567')).toBe('3001234567')
  })

  it('quita guiones y paréntesis', () => {
    expect(normalizarCelular('(300) 123-4567')).toBe('3001234567')
  })

  it('rechaza números cortos', () => {
    expect(normalizarCelular('300123456')).toBeNull()
  })

  it('rechaza números largos', () => {
    expect(normalizarCelular('30012345678')).toBeNull()
  })

  it('rechaza null y valores que no son texto', () => {
    expect(normalizarCelular(null)).toBeNull()
    expect(normalizarCelular(3001234567)).toBeNull()
  })
})

describe('normalizarFecha', () => {
  it('acepta una fecha válida en YYYY-MM-DD', () => {
    expect(normalizarFecha('2008-03-15')).toBe('2008-03-15')
  })

  it('rechaza fechas imposibles', () => {
    expect(normalizarFecha('2008-13-45')).toBeNull()
  })

  it('rechaza el 31 de febrero en vez de correrlo a marzo', () => {
    expect(normalizarFecha('2008-02-31')).toBeNull()
  })

  it('rechaza años fuera de un rango de edad razonable', () => {
    expect(normalizarFecha('1850-01-01')).toBeNull()
  })

  it('rechaza otros formatos', () => {
    expect(normalizarFecha('15/03/2008')).toBeNull()
    expect(normalizarFecha(null)).toBeNull()
  })
})

describe('normalizarResultado', () => {
  it('normaliza una respuesta completa y no reporta faltantes', () => {
    const r = normalizarResultado({
      nombre_completo: '  Juan Pérez  ',
      celular: '+57 300 123 4567',
      fecha_nacimiento: '2008-03-15',
      direccion: 'Calle 123 #45-67',
      bautizado: true,
      sellado: false,
      servidor: false,
      simpatizante: true,
    })

    expect(r.data.nombre_completo).toBe('Juan Pérez')
    expect(r.data.celular).toBe('3001234567')
    expect(r.data.fecha_nacimiento).toBe('2008-03-15')
    expect(r.data.bautizado).toBe(true)
    expect(r.data.simpatizante).toBe(true)
    expect(r.campos_no_leidos).toEqual([])
  })

  it('reporta los campos ilegibles y los deja vacíos en vez de sucios', () => {
    const r = normalizarResultado({
      nombre_completo: 'Ana Gómez',
      celular: 'ilegible',
      fecha_nacimiento: null,
      direccion: null,
    })

    expect(r.data.nombre_completo).toBe('Ana Gómez')
    expect(r.data.celular).toBe('')
    expect(r.data.fecha_nacimiento).toBe('')
    expect(r.data.direccion).toBe('')
    expect(r.campos_no_leidos).toContain('celular')
    expect(r.campos_no_leidos).toContain('fecha_nacimiento')
  })

  it('no reporta la dirección porque es opcional', () => {
    const r = normalizarResultado({
      nombre_completo: 'Ana Gómez',
      celular: '3001234567',
      fecha_nacimiento: '2008-03-15',
      direccion: null,
    })
    expect(r.campos_no_leidos).toEqual([])
  })

  it('trata como false cualquier casilla que no sea exactamente true', () => {
    const r = normalizarResultado({ bautizado: 'sí', sellado: 1, servidor: null })
    expect(r.data.bautizado).toBe(false)
    expect(r.data.sellado).toBe(false)
    expect(r.data.servidor).toBe(false)
  })

  it('nunca devuelve consentimiento, aunque el modelo lo mande', () => {
    const r = normalizarResultado({ consentimiento_datos_personales: true })
    expect('consentimiento_datos_personales' in r.data).toBe(false)
  })

  it('sobrevive a basura total sin lanzar excepción', () => {
    expect(() => normalizarResultado(null)).not.toThrow()
    expect(() => normalizarResultado('texto')).not.toThrow()
  })
})
```

- [ ] **Step 5: Correr las pruebas para verificar que fallan**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./normalize"`

- [ ] **Step 6: Implementar la normalización**

Crear `lib/ocr/normalize.ts`:

```typescript
/**
 * Normalización de los datos que devuelve el modelo multimodal.
 *
 * Funciones puras: sin red, sin IA, sin React. Es la capa que impide que un dato
 * mal leído entre sucio a la base de datos. Nunca se confía en el formato que
 * devuelva el modelo.
 */

/** Campos que la IA puede extraer del volante. */
export interface DatosVolante {
  nombre_completo: string
  celular: string
  fecha_nacimiento: string
  direccion: string
  bautizado: boolean
  sellado: boolean
  servidor: boolean
  simpatizante: boolean
}

export interface ResultadoNormalizado {
  data: DatosVolante
  campos_no_leidos: string[]
}

const EDAD_MINIMA_PLAUSIBLE = 5
const EDAD_MAXIMA_PLAUSIBLE = 100
const MS_POR_ANIO = 365.25 * 24 * 60 * 60 * 1000

/** Devuelve 10 dígitos o null. Tolera '+57', espacios, guiones y paréntesis. */
export function normalizarCelular(raw: unknown): string | null {
  if (typeof raw !== 'string') return null

  let digitos = raw.replace(/\D/g, '')
  // '+57 300 123 4567' -> '573001234567' -> '3001234567'
  if (digitos.length === 12 && digitos.startsWith('57')) {
    digitos = digitos.slice(2)
  }

  return /^\d{10}$/.test(digitos) ? digitos : null
}

/** Devuelve 'YYYY-MM-DD' o null. Rechaza fechas imposibles y edades absurdas. */
export function normalizarFecha(raw: unknown): string | null {
  if (typeof raw !== 'string') return null

  const match = raw.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null

  const [, anio, mes, dia] = match
  const fecha = new Date(`${anio}-${mes}-${dia}T00:00:00Z`)
  if (Number.isNaN(fecha.getTime())) return null

  // Date corre los desbordes ('2008-02-31' -> 2 de marzo). Eso no es una fecha válida.
  if (
    fecha.getUTCFullYear() !== Number(anio) ||
    fecha.getUTCMonth() + 1 !== Number(mes) ||
    fecha.getUTCDate() !== Number(dia)
  ) {
    return null
  }

  const edad = (Date.now() - fecha.getTime()) / MS_POR_ANIO
  if (edad < EDAD_MINIMA_PLAUSIBLE || edad > EDAD_MAXIMA_PLAUSIBLE) return null

  return `${anio}-${mes}-${dia}`
}

function texto(valor: unknown): string {
  return typeof valor === 'string' ? valor.trim() : ''
}

export function normalizarResultado(crudo: unknown): ResultadoNormalizado {
  const c: Record<string, unknown> =
    crudo !== null && typeof crudo === 'object' ? (crudo as Record<string, unknown>) : {}

  const campos_no_leidos: string[] = []

  const nombre = texto(c.nombre_completo)
  if (nombre.length < 3) campos_no_leidos.push('nombre_completo')

  const celular = normalizarCelular(c.celular)
  if (!celular) campos_no_leidos.push('celular')

  const fecha = normalizarFecha(c.fecha_nacimiento)
  if (!fecha) campos_no_leidos.push('fecha_nacimiento')

  // La dirección es opcional: si no se lee, no se reporta como faltante.
  const data: DatosVolante = {
    nombre_completo: nombre.length >= 3 ? nombre : '',
    celular: celular ?? '',
    fecha_nacimiento: fecha ?? '',
    direccion: texto(c.direccion),
    bautizado: c.bautizado === true,
    sellado: c.sellado === true,
    servidor: c.servidor === true,
    simpatizante: c.simpatizante === true,
  }

  return { data, campos_no_leidos }
}
```

- [ ] **Step 7: Correr las pruebas para verificar que pasan**

Run: `npm test`
Expected: PASS — 17 pruebas en verde.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts lib/ocr/normalize.ts lib/ocr/normalize.test.ts
git commit -m "feat: Add volante data normalization with Vitest setup"
```

---

### Task 2: Validación del data URL

Validar mimetype y tamaño **antes** de gastar cuota gratuita, y separar el base64 para enviarlo a los proveedores. Es entrada no confiable que viene del cliente, así que se prueba.

**Files:**
- Create: `lib/ocr/data-url.ts`
- Test: `lib/ocr/data-url.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `ImagenPayload` — `{ mime: string; base64: string; bytes: number }`
  - `parseDataUrl(valor: unknown): ImagenPayload | null`
  - `MAX_BYTES` — constante `4 * 1024 * 1024`

- [ ] **Step 1: Escribir las pruebas que fallan**

Crear `lib/ocr/data-url.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { parseDataUrl, MAX_BYTES } from './data-url'

// 1x1 JPEG mínimo en base64, suficiente para las pruebas de formato.
const B64 = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q=='

describe('parseDataUrl', () => {
  it('acepta un JPEG y separa mime y base64', () => {
    const r = parseDataUrl(`data:image/jpeg;base64,${B64}`)
    expect(r).not.toBeNull()
    expect(r!.mime).toBe('image/jpeg')
    expect(r!.base64).toBe(B64)
    expect(r!.bytes).toBeGreaterThan(0)
  })

  it('acepta PNG y WEBP', () => {
    expect(parseDataUrl(`data:image/png;base64,${B64}`)?.mime).toBe('image/png')
    expect(parseDataUrl(`data:image/webp;base64,${B64}`)?.mime).toBe('image/webp')
  })

  it('rechaza tipos que no son imagen permitida', () => {
    expect(parseDataUrl(`data:application/pdf;base64,${B64}`)).toBeNull()
    expect(parseDataUrl(`data:image/gif;base64,${B64}`)).toBeNull()
    expect(parseDataUrl(`data:text/html;base64,${B64}`)).toBeNull()
  })

  it('rechaza cadenas que no son data URL', () => {
    expect(parseDataUrl('https://ejemplo.com/foto.jpg')).toBeNull()
    expect(parseDataUrl('')).toBeNull()
    expect(parseDataUrl(null)).toBeNull()
    expect(parseDataUrl(123)).toBeNull()
  })

  it('rechaza base64 inválido', () => {
    expect(parseDataUrl('data:image/jpeg;base64,no-es-base64-válido!!')).toBeNull()
  })

  it('rechaza imágenes que superan el límite', () => {
    const grande = 'A'.repeat(Math.ceil((MAX_BYTES + 1024) / 3) * 4)
    expect(parseDataUrl(`data:image/jpeg;base64,${grande}`)).toBeNull()
  })
})
```

- [ ] **Step 2: Correr las pruebas para verificar que fallan**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./data-url"`

- [ ] **Step 3: Implementar el parser**

Crear `lib/ocr/data-url.ts`:

```typescript
/**
 * Validación del data URL que envía el cliente.
 *
 * Corre antes de llamar a cualquier proveedor: rechazar aquí evita gastar cuota
 * gratuita en algo que nunca iba a servir.
 */

export interface ImagenPayload {
  mime: string
  base64: string
  bytes: number
}

export const MAX_BYTES = 4 * 1024 * 1024

const MIMES_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp']
const BASE64_VALIDO = /^[A-Za-z0-9+/]+={0,2}$/

export function parseDataUrl(valor: unknown): ImagenPayload | null {
  if (typeof valor !== 'string') return null

  const match = valor.match(/^data:([a-z]+\/[a-z0-9+.-]+);base64,(.+)$/i)
  if (!match) return null

  const mime = match[1].toLowerCase()
  const base64 = match[2]

  if (!MIMES_PERMITIDOS.includes(mime)) return null
  if (!BASE64_VALIDO.test(base64)) return null

  // Cada 4 caracteres base64 son 3 bytes; el relleno '=' resta.
  const relleno = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0
  const bytes = Math.floor((base64.length * 3) / 4) - relleno

  if (bytes <= 0 || bytes > MAX_BYTES) return null

  return { mime, base64, bytes }
}
```

- [ ] **Step 4: Correr las pruebas para verificar que pasan**

Run: `npm test`
Expected: PASS — las 17 de la Task 1 más 6 nuevas.

- [ ] **Step 5: Commit**

```bash
git add lib/ocr/data-url.ts lib/ocr/data-url.test.ts
git commit -m "feat: Add data URL validation for volante images"
```

---

### Task 3: Extracción con Gemini y respaldo Groq

Una sola llamada multimodal que hace OCR y estructuración. Sin SDK: `fetch` nativo contra las APIs REST, para no agregar dependencias.

**Files:**
- Create: `lib/ocr/extract-volante.ts`

**Interfaces:**
- Consumes: nada de tareas anteriores.
- Produces:
  - `extraerDatosVolante(base64: string, mime: string): Promise<unknown>` — devuelve el JSON **crudo** del modelo. No normaliza; de eso se encarga `normalizarResultado`.
  - `ErrorOcr` — clase `Error` con propiedad `esTimeout: boolean`.

No lleva pruebas automáticas: es un envoltorio de red contra un servicio externo, y simular respuestas de Gemini probaría el simulacro, no el código. Se verifica en la Task 8 con volantes reales.

- [ ] **Step 1: Implementar el módulo de extracción**

Crear `lib/ocr/extract-volante.ts`:

```typescript
/**
 * Extracción de datos del volante con un modelo multimodal.
 *
 * Motor principal: Gemini (capa gratuita de AI Studio).
 * Respaldo: Groq, si Gemini agota cuota o falla.
 *
 * Devuelve el JSON crudo del modelo. La validación vive en normalize.ts.
 */

const TIMEOUT_MS = 20_000

const MODELO_GEMINI = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const MODELO_GROQ = process.env.GROQ_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct'

export class ErrorOcr extends Error {
  esTimeout: boolean
  constructor(mensaje: string, esTimeout = false) {
    super(mensaje)
    this.name = 'ErrorOcr'
    this.esTimeout = esTimeout
  }
}

const PROMPT = `Digitalizas volantes de inscripción de una iglesia en Colombia.

La imagen es un volante de papel: las ETIQUETAS ("Nombre:", "Celular:", "Dirección:") están IMPRESAS y las RESPUESTAS están escritas A MANO. Extrae únicamente las respuestas manuscritas, nunca el texto de las etiquetas.

Reglas estrictas:
- Si un campo está vacío, ilegible o no aparece en el volante, devuelve null. NUNCA inventes ni adivines un valor.
- "fecha_nacimiento" va en formato YYYY-MM-DD. Si el año está escrito con dos dígitos, interprétalo sabiendo que son jóvenes nacidos entre 1990 y hoy.
- "celular" son solo los dígitos, sin espacios, guiones ni indicativo de país.
- "bautizado", "sellado", "servidor" y "simpatizante" son casillas: true solo si la casilla está marcada de forma inequívoca; false si está vacía o si la marca es dudosa.
- No devuelvas ningún campo relacionado con consentimiento.`

const ESQUEMA_GEMINI = {
  type: 'object',
  properties: {
    nombre_completo: { type: 'string', nullable: true },
    celular: { type: 'string', nullable: true },
    fecha_nacimiento: { type: 'string', nullable: true },
    direccion: { type: 'string', nullable: true },
    bautizado: { type: 'boolean' },
    sellado: { type: 'boolean' },
    servidor: { type: 'boolean' },
    simpatizante: { type: 'boolean' },
  },
  required: ['bautizado', 'sellado', 'servidor', 'simpatizante'],
}

async function fetchConTimeout(url: string, init: RequestInit): Promise<Response> {
  const controlador = new AbortController()
  const temporizador = setTimeout(() => controlador.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { ...init, signal: controlador.signal })
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ErrorOcr('El proveedor tardó demasiado', true)
    }
    throw err
  } finally {
    clearTimeout(temporizador)
  }
}

async function llamarGemini(base64: string, mime: string): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new ErrorOcr('GEMINI_API_KEY no configurada')

  const res = await fetchConTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODELO_GEMINI}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: PROMPT }, { inline_data: { mime_type: mime, data: base64 } }] },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: ESQUEMA_GEMINI,
          temperature: 0,
        },
      }),
    }
  )

  if (!res.ok) throw new ErrorOcr(`Gemini respondió ${res.status}`)

  const json = await res.json()
  const texto = json?.candidates?.[0]?.content?.parts?.[0]?.text
  if (typeof texto !== 'string') throw new ErrorOcr('Gemini devolvió una respuesta vacía')

  return JSON.parse(texto)
}

async function llamarGroq(base64: string, mime: string): Promise<unknown> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new ErrorOcr('GROQ_API_KEY no configurada')

  const res = await fetchConTimeout('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODELO_GROQ,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `${PROMPT}\n\nDevuelve un objeto JSON con exactamente estas claves: nombre_completo, celular, fecha_nacimiento, direccion, bautizado, sellado, servidor, simpatizante.`,
            },
            { type: 'image_url', image_url: { url: `data:${mime};base64,${base64}` } },
          ],
        },
      ],
    }),
  })

  if (!res.ok) throw new ErrorOcr(`Groq respondió ${res.status}`)

  const json = await res.json()
  const texto = json?.choices?.[0]?.message?.content
  if (typeof texto !== 'string') throw new ErrorOcr('Groq devolvió una respuesta vacía')

  return JSON.parse(texto)
}

export async function extraerDatosVolante(base64: string, mime: string): Promise<unknown> {
  try {
    return await llamarGemini(base64, mime)
  } catch (err) {
    // Nunca registrar la imagen, solo el motivo del fallo.
    console.error('OCR: Gemini falló:', err instanceof Error ? err.message : err)

    if (!process.env.GROQ_API_KEY) throw err

    console.log('OCR: reintentando con Groq')
    return await llamarGroq(base64, mime)
  }
}
```

- [ ] **Step 2: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: sin errores en `lib/ocr/extract-volante.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/ocr/extract-volante.ts
git commit -m "feat: Add Gemini extraction with Groq fallback for volante OCR"
```

---

### Task 4: Route handler `/api/ocr/volante`

Une las tres piezas anteriores detrás de una sesión verificada.

**Files:**
- Create: `app/api/ocr/volante/route.ts`

**Interfaces:**
- Consumes: `parseDataUrl` (Task 2); `extraerDatosVolante`, `ErrorOcr` (Task 3); `normalizarResultado` (Task 1); `createCorsResponse`, `createCorsErrorResponse`, `createCorsOptionsResponse` de `utils/cors.ts`.
- Produces: `POST /api/ocr/volante`
  - Petición: `{ imagen: string }` (data URL) + header `Authorization: Bearer <token>`
  - Respuesta 200: `{ success: true, data: DatosVolante, campos_no_leidos: string[] }`
  - Errores: `{ error: string }` con 401 / 400 / 503 / 504 / 500

**Nota de seguridad:** a diferencia de otras rutas del proyecto, esta **verifica** el token con `supabase.auth.getUser(token)` en vez de solo decodificarlo con `jwtDecode`. Decodificar no valida la firma, y un token falsificado podría quemar la cuota gratuita.

- [ ] **Step 1: Implementar la route handler**

Crear `app/api/ocr/volante/route.ts`:

```typescript
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createCorsResponse, createCorsErrorResponse, createCorsOptionsResponse } from '@/utils/cors'
import { parseDataUrl } from '@/lib/ocr/data-url'
import { extraerDatosVolante, ErrorOcr } from '@/lib/ocr/extract-volante'
import { normalizarResultado } from '@/lib/ocr/normalize'

export async function OPTIONS() {
  return createCorsOptionsResponse()
}

export async function POST(request: NextRequest) {
  try {
    // 1. Sesión verificada (no basta con decodificar el JWT: gastaríamos cuota
    //    con tokens falsificados).
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createCorsErrorResponse('Token de autorización requerido', 401)
    }

    const token = authHeader.split('Bearer ')[1]
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: auth, error: errorAuth } = await supabase.auth.getUser(token)
    if (errorAuth || !auth?.user) {
      return createCorsErrorResponse('Token inválido', 401)
    }

    // 2. El escaneo es opcional: sin clave, la app sigue funcionando manual.
    if (!process.env.GEMINI_API_KEY) {
      return createCorsErrorResponse('El escaneo no está configurado en el servidor', 503)
    }

    // 3. Validar la imagen antes de gastar cuota.
    const body = await request.json().catch(() => null)
    const imagen = parseDataUrl(body?.imagen)
    if (!imagen) {
      return createCorsErrorResponse(
        'Usa una foto JPG, PNG o WEBP de menos de 4 MB',
        400
      )
    }

    // 4. Extraer. La imagen solo vive en memoria y nunca se registra en logs.
    let crudo: unknown
    try {
      crudo = await extraerDatosVolante(imagen.base64, imagen.mime)
    } catch (err) {
      const esTimeout = err instanceof ErrorOcr && err.esTimeout
      console.error('OCR: extracción fallida:', err instanceof Error ? err.message : err)

      return createCorsErrorResponse(
        esTimeout
          ? 'La foto tardó demasiado en procesarse, intenta de nuevo'
          : 'Servicio de escaneo no disponible, llena el formulario manual',
        esTimeout ? 504 : 503
      )
    }

    // 5. Normalizar: nunca se confía en el formato del modelo.
    const { data, campos_no_leidos } = normalizarResultado(crudo)

    return createCorsResponse({ success: true, data, campos_no_leidos })
  } catch (err) {
    console.error('OCR: error inesperado:', err instanceof Error ? err.message : err)
    return createCorsErrorResponse('Error procesando la imagen', 500)
  }
}
```

- [ ] **Step 2: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Verificar que la ruta rechaza peticiones sin token**

Levantar el servidor con `npm run dev` en otra terminal, luego:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/ocr/volante \
  -H "Content-Type: application/json" -d '{"imagen":"x"}'
```

Expected: `401`

- [ ] **Step 4: Commit**

```bash
git add app/api/ocr/volante/route.ts
git commit -m "feat: Add authenticated OCR endpoint for volante scanning"
```

---

### Task 5: Arreglar los checkboxes rotos

`app/dashboard/jovenes/nuevo/page.tsx` conecta los checkboxes con `{...register('bautizado')}`, pero `components/ui/checkbox.tsx` es un `Radix Checkbox.Root` — un `<button>`, no un `<input>`. Radix emite `onCheckedChange`, no `onChange`, así que React Hook Form nunca recibe el cambio y guarda `false`.

Esto bloquea la función: sin el arreglo, los estados que lea la IA no se reflejarían. Va **antes** de conectar el escaneo.

**Files:**
- Modify: `app/dashboard/jovenes/nuevo/page.tsx:38-56` (extraer `control` de `useForm`), `:210-260` (los cinco checkboxes)

**Interfaces:**
- Consumes: nada.
- Produces: los cinco booleanos (`bautizado`, `sellado`, `servidor`, `simpatizante`, `consentimiento_datos_personales`) quedan controlados y sí llegan al submit.

- [ ] **Step 1: Reproducir el bug antes de arreglarlo**

Con `npm run dev`, abrir `http://localhost:3000/dashboard/jovenes/nuevo`, llenar nombre, celular y fecha, marcar **Bautizado** y enviar. Revisar el registro creado en `/dashboard/jovenes`.

Expected: `bautizado` quedó en `false` pese a haberlo marcado. **Si el checkbox sí funciona, detente y reporta** — el diagnóstico estaba errado y el resto de la tarea no aplica.

- [ ] **Step 2: Importar `Controller` y extraer `control`**

En `app/dashboard/jovenes/nuevo/page.tsx`, cambiar la línea 13:

```typescript
import { useForm, Controller } from 'react-hook-form';
```

Y agregar `control` a lo que se extrae de `useForm` (línea ~39):

```typescript
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateJovenFormData>({
```

- [ ] **Step 3: Reemplazar los cinco checkboxes**

Sustituir el bloque completo de `{/* Estados */}` (líneas ~210-260) por:

```tsx
          {/* Estados */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-slate-900 mb-3">Estados</h3>
            <div className="space-y-3">
              {([
                { name: 'bautizado', label: 'Bautizado' },
                { name: 'sellado', label: 'Sellado' },
                { name: 'servidor', label: 'Servidor' },
                { name: 'simpatizante', label: 'Simpatizante' },
                {
                  name: 'consentimiento_datos_personales',
                  label: 'Consentimiento para el tratamiento de datos personales',
                },
              ] as const).map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <Controller
                    name={item.name}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={item.name}
                        checked={field.value}
                        onCheckedChange={(valor) => field.onChange(valor === true)}
                      />
                    )}
                  />
                  <label htmlFor={item.name} className="text-sm font-medium cursor-pointer">
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
```

- [ ] **Step 4: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 5: Verificar el arreglo en la app**

Repetir el Step 1: marcar **Bautizado** y **Servidor**, enviar, y confirmar en `/dashboard/jovenes` que el registro quedó con ambos en verdadero.

Expected: los estados sí se guardan.

- [ ] **Step 6: Commit**

```bash
git add app/dashboard/jovenes/nuevo/page.tsx
git commit -m "fix: Radix Checkbox not registering with react-hook-form

Checkbox is a Radix Checkbox.Root (a button), which emits
onCheckedChange rather than onChange, so register() never received
the change and every checkbox saved as false. Migrated the five
checkboxes to Controller."
```

---

### Task 6: Componente de escaneo

Botón, cámara, compresión, llamada al endpoint y manejo de errores. No conoce React Hook Form: entrega los datos por callback y la página decide qué hacer con ellos.

**Files:**
- Create: `lib/image-compress.ts`
- Create: `components/dashboard/EscanearVolante.tsx`

**Interfaces:**
- Consumes: `DatosVolante` (Task 1), `POST /api/ocr/volante` (Task 4), `apiClient` de `utils/api-client.ts`.
- Produces:
  - `comprimirImagen(file: File, maxLado?: number, calidad?: number): Promise<string>` — devuelve un data URL JPEG.
  - `<EscanearVolante onDatosExtraidos={(data: DatosVolante, camposNoLeidos: string[]) => void} disabled?: boolean />`

- [ ] **Step 1: Implementar la compresión de imagen**

Crear `lib/image-compress.ts`:

```typescript
/**
 * Compresión de la foto en el navegador antes de subirla.
 *
 * Reduce el tiempo de subida desde un celular con datos móviles y baja el consumo
 * de cuota del modelo. Sin dependencias: canvas nativo.
 */

const MAX_LADO_POR_DEFECTO = 1600
const CALIDAD_POR_DEFECTO = 0.8

export async function comprimirImagen(
  file: File,
  maxLado: number = MAX_LADO_POR_DEFECTO,
  calidad: number = CALIDAD_POR_DEFECTO
): Promise<string> {
  // createImageBitmap respeta la orientación EXIF de las fotos de celular.
  const bitmap = await createImageBitmap(file)

  try {
    const escala = Math.min(1, maxLado / Math.max(bitmap.width, bitmap.height))
    const ancho = Math.round(bitmap.width * escala)
    const alto = Math.round(bitmap.height * escala)

    const canvas = document.createElement('canvas')
    canvas.width = ancho
    canvas.height = alto

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('No se pudo procesar la imagen en este navegador')

    ctx.drawImage(bitmap, 0, 0, ancho, alto)
    return canvas.toDataURL('image/jpeg', calidad)
  } finally {
    bitmap.close()
  }
}
```

- [ ] **Step 2: Implementar el componente**

Crear `components/dashboard/EscanearVolante.tsx`:

```tsx
'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/utils/api-client';
import { comprimirImagen } from '@/lib/image-compress';
import type { DatosVolante } from '@/lib/ocr/normalize';

interface RespuestaOcr {
  success: boolean;
  data: DatosVolante;
  campos_no_leidos: string[];
}

interface EscanearVolanteProps {
  onDatosExtraidos: (data: DatosVolante, camposNoLeidos: string[]) => void;
  disabled?: boolean;
}

export function EscanearVolante({ onDatosExtraidos, disabled }: EscanearVolanteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [procesando, setProcesando] = useState(false);

  const manejarArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Permite volver a elegir la misma foto después de un error.
    e.target.value = '';
    if (!file) return;

    setProcesando(true);
    try {
      const imagen = await comprimirImagen(file);
      const res = await apiClient.post<RespuestaOcr>('/ocr/volante', { imagen });
      const { data, campos_no_leidos } = res.data;

      onDatosExtraidos(data, campos_no_leidos);

      const noSeLeyoNada = !data.nombre_completo && !data.celular && !data.fecha_nacimiento;

      if (noSeLeyoNada) {
        toast.error('No se pudieron leer datos. ¿La foto está enfocada y con buena luz?');
      } else if (campos_no_leidos.length > 0) {
        toast.warning(`No se pudo leer: ${campos_no_leidos.join(', ')}. Complétalo a mano.`);
      } else {
        toast.success('Datos extraídos. Revísalos antes de guardar.');
      }
    } catch (error: unknown) {
      let mensaje = 'No se pudo leer el volante. Intenta con mejor luz o llena el formulario manual.';
      if (error && typeof error === 'object' && 'response' in error) {
        const respuesta = (error as { response?: { data?: { error?: string } } }).response;
        if (respuesta?.data?.error) mensaje = respuesta.data.error;
      }
      toast.error(mensaje);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={manejarArchivo}
        className="hidden"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">Escanear volante</p>
          <p className="text-sm text-slate-500">
            Toma una foto del volante y los datos se llenan solos. Revísalos antes de guardar.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={disabled || procesando}
          onClick={() => inputRef.current?.click()}
        >
          {procesando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Leyendo…
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Tomar foto
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add lib/image-compress.ts components/dashboard/EscanearVolante.tsx
git commit -m "feat: Add EscanearVolante component with client-side compression"
```

---

### Task 7: Conectar el escaneo al formulario

**Files:**
- Modify: `app/dashboard/jovenes/nuevo/page.tsx`

**Interfaces:**
- Consumes: `<EscanearVolante>` (Task 6), `DatosVolante` (Task 1), `setValue` de React Hook Form.
- Produces: la pantalla completa y funcional.

- [ ] **Step 1: Agregar imports y `setValue`**

En `app/dashboard/jovenes/nuevo/page.tsx`, agregar junto a los demás imports:

```typescript
import { EscanearVolante } from '@/components/dashboard/EscanearVolante';
import type { DatosVolante } from '@/lib/ocr/normalize';
```

Y agregar `setValue` a lo que se extrae de `useForm`:

```typescript
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateJovenFormData>({
```

- [ ] **Step 2: Agregar el estado de campos rellenados por IA y el manejador**

Después de `const nombreCompleto = watch('nombre_completo');` (línea ~58), agregar:

```typescript
  // Campos que vienen de la IA: se resaltan hasta que el líder los revise.
  const [camposIA, setCamposIA] = useState<Set<string>>(new Set());

  const manejarDatosExtraidos = (data: DatosVolante) => {
    const rellenados = new Set<string>();

    // El consentimiento NO se autocompleta: es una declaración legal que
    // el líder marca a mano (Ley 1581 de 2012).
    (Object.keys(data) as (keyof DatosVolante)[]).forEach((campo) => {
      const valor = data[campo];
      if (valor === '' || valor === false) return;
      setValue(campo, valor as never, { shouldValidate: true });
      rellenados.add(campo);
    });

    setCamposIA(rellenados);
  };

  // Quita el resaltado en cuanto el líder toca el campo.
  const marcarRevisado = (campo: string) => {
    setCamposIA((previo) => {
      if (!previo.has(campo)) return previo;
      const siguiente = new Set(previo);
      siguiente.delete(campo);
      return siguiente;
    });
  };

  const claseIA = (campo: string) => (camposIA.has(campo) ? 'border-amber-500 bg-amber-50' : '');
```

- [ ] **Step 3: Montar el componente sobre el formulario**

Dentro de `<Card className="p-6">`, justo antes de `<form ...>` (línea ~129), agregar:

```tsx
        <div className="mb-6">
          <EscanearVolante
            onDatosExtraidos={manejarDatosExtraidos}
            disabled={isSubmitting}
          />
        </div>
```

- [ ] **Step 4: Resaltar los campos rellenados por IA**

En cada uno de los cuatro `<Input>`, agregar el resaltado y el limpiado al editar. Para `nombre_completo` (línea ~136), la `className` pasa a incluir `claseIA`:

```tsx
              <Input
                {...register('nombre_completo', {
                  onChange: () => marcarRevisado('nombre_completo'),
                })}
                placeholder="Ej: Juan Pérez"
                className={`${
                  errors.nombre_completo ? 'border-red-500' :
                  nombreDuplicado ? 'border-amber-500' : claseIA('nombre_completo')
                }`}
              />
```

Para `celular` (línea ~169):

```tsx
            <Input
              {...register('celular', { onChange: () => marcarRevisado('celular') })}
              placeholder="Ej: 3113678555"
              className={errors.celular ? 'border-red-500' : claseIA('celular')}
            />
```

Para `fecha_nacimiento` (línea ~184):

```tsx
            <Input
              {...register('fecha_nacimiento', {
                onChange: () => marcarRevisado('fecha_nacimiento'),
              })}
              type="date"
              className={errors.fecha_nacimiento ? 'border-red-500' : claseIA('fecha_nacimiento')}
            />
```

Para `direccion` (línea ~199):

```tsx
            <Input
              {...register('direccion', { onChange: () => marcarRevisado('direccion') })}
              placeholder="Ej: Calle 123 #45-67"
              className={errors.direccion ? 'border-red-500' : claseIA('direccion')}
            />
```

- [ ] **Step 5: Agregar el aviso de revisión**

Justo debajo del `<EscanearVolante>` del Step 3, agregar:

```tsx
        {camposIA.size > 0 && (
          <p className="mb-4 text-sm text-amber-700">
            Los campos resaltados los leyó la IA. Revísalos antes de guardar.
          </p>
        )}
```

- [ ] **Step 6: Verificar que compila y pasa el lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sin errores.

- [ ] **Step 7: Commit**

```bash
git add app/dashboard/jovenes/nuevo/page.tsx
git commit -m "feat: Wire volante scanning into the new joven form"
```

---

### Task 8: Configuración, documentación y verificación con volantes reales

**Files:**
- Modify: `.env.local.example`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: la función verificada de punta a punta.

- [ ] **Step 1: Documentar las variables de entorno**

Agregar al final de `.env.local.example`:

```
# OCR de volantes (Solo para servidor - NO EXPONER EN FRONTEND)
# Obtén la clave gratis, sin tarjeta, en: https://aistudio.google.com/apikey
# Sin GEMINI_API_KEY el escaneo se desactiva y el formulario funciona manual.
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Respaldo opcional si Gemini agota su cuota gratuita: https://console.groq.com/keys
GROQ_API_KEY=
GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
```

- [ ] **Step 2: Confirmar el modelo vigente de la capa gratuita**

Entrar a https://aistudio.google.com/ y revisar qué modelo con visión está disponible en la capa gratuita y con qué cuota. Si hay uno más nuevo que `gemini-2.5-flash`, actualizar `GEMINI_MODEL` en `.env.local` y en `.env.local.example`. No hay que tocar código.

- [ ] **Step 3: Configurar la clave real**

Agregar `GEMINI_API_KEY` a `.env.local` (que ya está en `.gitignore`) y reiniciar `npm run dev`.

- [ ] **Step 4: Verificar con un volante real, buena luz**

Fotografiar un volante lleno, con buena luz y letra clara, desde el celular en `/dashboard/jovenes/nuevo`.

Expected: nombre, celular, fecha y dirección correctos y resaltados en ámbar; los estados marcados coinciden con las casillas del volante.

- [ ] **Step 5: Verificar con luz pobre o foto torcida**

Expected: llena lo que puede, avisa qué campos no pudo leer, y **no inventa datos**. El formulario sigue usable.

- [ ] **Step 6: Verificar que el consentimiento nunca se autocompleta**

Fotografiar un volante que traiga la casilla de consentimiento marcada.

Expected: la casilla "Consentimiento para el tratamiento de datos personales" queda **sin marcar** en el formulario.

- [ ] **Step 7: Verificar que el registro manual no se bloquea**

Comentar temporalmente `GEMINI_API_KEY` en `.env.local`, reiniciar, e intentar escanear.

Expected: mensaje claro de que el escaneo no está configurado; el formulario se puede llenar y guardar a mano sin problema. Restaurar la clave al terminar.

- [ ] **Step 8: Verificar el guardado completo**

Escanear, corregir lo que haga falta, marcar el consentimiento a mano y guardar.

Expected: el registro aparece en `/dashboard/jovenes` con todos los campos correctos, incluidos los estados.

- [ ] **Step 9: Correr la suite completa**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: todo en verde.

- [ ] **Step 10: Documentar la función en CLAUDE.md**

En la sección `## Common Tasks`, agregar:

```markdown
### Escaneo de volantes (OCR)
- `/dashboard/jovenes/nuevo` permite fotografiar un volante de papel y autorrellenar el formulario
- La foto se comprime en el navegador (`lib/image-compress.ts`) y se procesa en `app/api/ocr/volante/route.ts`
- Motor: Gemini (capa gratuita); respaldo automático: Groq. Claves solo del lado del servidor
- `lib/ocr/normalize.ts` valida todo lo que devuelve el modelo — nunca se confía en su formato
- El consentimiento de datos personales NUNCA se autocompleta (Ley 1581); lo marca el líder
- La imagen no se persiste en ningún punto
- Sin `GEMINI_API_KEY`, el escaneo se desactiva y el formulario funciona manual
```

- [ ] **Step 11: Commit**

```bash
git add .env.local.example CLAUDE.md
git commit -m "docs: Document volante OCR configuration and behavior"
```

---

## Notas de implementación

**Desviación menor del spec:** el spec listaba cuatro archivos nuevos; el plan agrega un quinto, `lib/ocr/data-url.ts`. La validación de mimetype y tamaño es entrada no confiable y relevante para seguridad, así que merece ser pura y probada en vez de quedar embebida en la route handler.

**Orden de dependencias:** las tareas 1, 2 y 3 son independientes entre sí y podrían hacerse en paralelo. La 4 necesita las tres. La 5 es independiente de todo pero debe ir antes de la 7. La 6 necesita la 1 y la 4. La 7 necesita la 5 y la 6. La 8 va al final.
