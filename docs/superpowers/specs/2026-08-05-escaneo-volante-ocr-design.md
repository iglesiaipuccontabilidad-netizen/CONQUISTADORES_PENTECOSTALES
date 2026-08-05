# Escaneo de volante con OCR para autorrellenar el registro de jóvenes

**Fecha:** 2026-08-05
**Estado:** Aprobado, pendiente de plan de implementación

## Problema

Registrar un joven hoy exige transcribir a mano los datos de un volante de papel al
formulario de `/dashboard/jovenes/nuevo`. Es lento y propenso a errores de digitación.

Los volantes son **mixtos**: las etiquetas ("Nombre:", "Celular:") vienen impresas y las
respuestas están **escritas a mano**. Cada volante corresponde a **un solo joven**.

## Objetivo

Un líder autenticado toma una foto del volante con su celular y el formulario queda
prellenado. El líder revisa, corrige y confirma.

## Decisión técnica de fondo

Se descarta el enfoque **Tesseract.js + IA estructuradora**. Tesseract está entrenado
para texto impreso; sobre letra manuscrita devuelve ruido. Leería las etiquetas impresas
y fallaría justo en los datos que se necesitan.

Se usa en cambio **un único modelo multimodal** que hace OCR y estructuración en una sola
llamada: lee manuscrito, entiende el contexto de cada campo y devuelve JSON.

**Motor principal:** Google Gemini, capa gratuita de AI Studio (sin tarjeta de crédito).
**Respaldo:** Groq (capa gratuita, sin tarjeta), si Gemini agota cuota o falla.

Riesgo aceptado explícitamente por el usuario: en la capa gratuita Google puede usar las
imágenes para mejorar sus productos. Se mitiga no almacenando la foto en ningún momento.

## Alcance

**Sin cambios de base de datos.** Los campos del volante ya calzan 1:1 con la tabla
`jovenes` y con el formulario existente.

Pantalla afectada: `app/dashboard/jovenes/nuevo/page.tsx`.

Campos que la IA extrae:

| Campo | Tipo destino | Notas |
|---|---|---|
| `nombre_completo` | string, mín. 3 | |
| `celular` | string, exactamente 10 dígitos | |
| `fecha_nacimiento` | string `YYYY-MM-DD` | input `type="date"` |
| `direccion` | string, opcional | |
| `bautizado` | boolean | casilla del volante |
| `sellado` | boolean | casilla del volante |
| `servidor` | boolean | casilla del volante |
| `simpatizante` | boolean | casilla del volante |

**`consentimiento_datos_personales` queda fuera del alcance de la IA.** Ver Reglas.

## Bug previo que bloquea la función

`app/dashboard/jovenes/nuevo/page.tsx:216-257` conecta los checkboxes con
`{...register('bautizado')}`, pero `components/ui/checkbox.tsx` es un
`Radix Checkbox.Root` — un `<button>`, no un `<input>`. Radix emite `onCheckedChange`,
no `onChange`, así que React Hook Form nunca recibe el cambio: marcar una casilla
guarda `false`.

Esto afecta directamente la función (la IA no podría reflejar los estados leídos), así
que se arregla como parte de este trabajo, migrando los cinco checkboxes a `Controller`
con `checked` / `onCheckedChange`.

Primer paso de la implementación: **reproducir el bug antes de arreglarlo**, para
confirmar el diagnóstico.

## Arquitectura

```
[Celular del líder]
  Botón "Escanear volante"
  → <input type="file" accept="image/*" capture="environment">
  → compresión en canvas (máx 1600px lado largo, JPEG 0.8)
  → POST /api/ocr/volante  { imagen: dataURL }  + Bearer token
      │
[Servidor Next.js]
  → verifica el token contra Supabase
  → valida mimetype y tamaño
  → llama a Gemini (fallback: Groq)
  → normaliza y valida cada campo
  → responde { success, data, campos_no_leidos[] }
      │
[Celular del líder]
  → setValue() por campo, con shouldValidate
  → campos rellenados por IA marcados en ámbar
  → el líder revisa, corrige y pulsa "Crear Joven"
  → submit normal por createJovenPublic (sin cambios)
```

## Componentes

Cada pieza tiene un propósito y se puede entender y probar por separado.

### `lib/image-compress.ts`
`comprimirImagen(file: File): Promise<string>` — redimensiona vía canvas a máximo
1600px en el lado largo y exporta JPEG calidad 0.8 como data URL.
Sin dependencias nuevas. No sabe nada de OCR.

### `lib/ocr/normalize.ts`
Funciones puras, sin red ni IA. El corazón de la robustez.

- `normalizarCelular(raw: string): string | null` — quita `+57`, espacios, guiones,
  paréntesis y puntos. Devuelve 10 dígitos o `null`.
- `normalizarFecha(raw: string): string | null` — acepta `YYYY-MM-DD`; rechaza fechas
  imposibles y las que impliquen una edad fuera de un rango razonable (5–100 años).
  Devuelve `YYYY-MM-DD` o `null`.
- `normalizarResultado(crudo: unknown): { data, campos_no_leidos }` — aplica lo anterior
  a la respuesta completa y arma la lista de campos que no se pudieron leer.

Es el módulo más fácil de probar y el que más errores evita, porque no confía en el
formato que devuelva el modelo.

### `lib/ocr/extract-volante.ts`
`extraerDatosVolante(imagenBase64: string): Promise<unknown>`

- Llama a Gemini vía `fetch` a la API REST
  (`generativelanguage.googleapis.com/v1beta/models/{modelo}:generateContent`,
  header `x-goog-api-key`), con `responseMimeType: "application/json"` y
  `responseSchema` para forzar salida estructurada.
- El modelo se lee de `GEMINI_MODEL`, con `gemini-2.5-flash` como valor por defecto en
  código. **Al implementar hay que confirmar en AI Studio cuál es el modelo vigente de la
  capa gratuita**, porque los nombres y las cuotas cambian; si hay uno más nuevo
  disponible gratis, basta cambiar la variable de entorno sin tocar código.
- Prompt: describe el volante (etiquetas impresas, respuestas manuscritas), exige
  `YYYY-MM-DD` para fechas, pide `null` en lugar de inventar cuando un campo esté
  ilegible o vacío, y le prohíbe explícitamente adivinar.
- Ante error de red, 429 o 5xx: reintenta una vez con Groq
  (`api.groq.com/openai/v1/chat/completions`, formato compatible con OpenAI, imagen como
  data URI, `response_format: json_object`).
- Timeout de 20 segundos por proveedor vía `AbortController`.
- Devuelve el JSON crudo. **No normaliza** — de eso se encarga `normalize.ts`.

### `app/api/ocr/volante/route.ts`
`POST`, más `OPTIONS` usando `createCorsOptionsResponse` de `utils/cors.ts`, siguiendo
el patrón de las rutas existentes.

1. Exige header `Authorization: Bearer <token>`.
2. **Verifica el token contra Supabase** con `supabase.auth.getUser(token)`.
   A diferencia de otras rutas del proyecto, aquí no basta `jwtDecode`: decodificar no
   valida la firma, y un token falsificado podría quemar la cuota gratuita.
3. Valida que el data URL sea `image/jpeg`, `image/png` o `image/webp` y que no supere
   ~4 MB. Rechaza antes de gastar cuota.
4. Llama a `extraerDatosVolante`, luego a `normalizarResultado`.
5. Responde `{ success: true, data, campos_no_leidos }`, siguiendo la convención del
   proyecto (`{ success, data?, error?, message? }`).
6. La imagen vive solo en memoria durante la petición. No se escribe a disco, ni a
   Supabase Storage, ni a logs.

La API key nunca sale del servidor.

### `components/dashboard/EscanearVolante.tsx`
Botón + input de cámara + estados de carga y error. Recibe un callback
`onDatosExtraidos(data, campos_no_leidos)` y no conoce React Hook Form: la página decide
qué hacer con los datos. Así el componente se puede reusar o probar aislado.

### Cambios en `app/dashboard/jovenes/nuevo/page.tsx`
- Monta `<EscanearVolante>` sobre el formulario.
- En el callback, `setValue(campo, valor, { shouldValidate: true })` por cada campo
  devuelto, y guarda en estado local qué campos vinieron de la IA.
- Los campos rellenados por IA se muestran con borde ámbar y la nota "Revisa este dato".
  La marca desaparece cuando el líder edita el campo.
- Toast al terminar: éxito con recordatorio de revisar, o aviso listando
  `campos_no_leidos`.
- Migración de los cinco checkboxes a `Controller`.

## Reglas de robustez

1. **El consentimiento nunca se autocompleta.** Es una declaración legal bajo la Ley 1581
   de 2012. Aunque el volante traiga la casilla marcada, la marca el líder a mano. La IA
   no firma consentimientos. Cuesta un clic por registro y es deliberado.
2. **No se confía en el formato del modelo.** Todo pasa por `normalize.ts`. Lo que no
   valide llega vacío y se reporta en `campos_no_leidos` en vez de entrar sucio.
3. **La foto no se persiste** en ningún punto: ni servidor, ni Supabase, ni logs.
4. **La IA no escribe en la base de datos.** Solo prellena el formulario; el líder
   confirma. Esta es la red de seguridad contra un dígito mal leído.
5. **El registro manual nunca se bloquea.** Si el escaneo falla por cualquier razón, la
   pantalla sigue funcionando exactamente como hoy.

## Manejo de errores

| Caso | Respuesta | UI |
|---|---|---|
| Sin token o token inválido | 401 | "Sesión expirada, vuelve a entrar" |
| Archivo no es imagen, o > 4 MB | 400 | "Usa una foto JPG o PNG de menos de 4 MB" |
| Gemini responde 429 (cuota) | fallback a Groq | transparente para el líder |
| Ambos proveedores fallan | 503 | "Servicio no disponible, llena el formulario manual" |
| Timeout de 20 s por proveedor | 504 | "La foto tardó demasiado, intenta de nuevo" |
| Foto legible pero sin datos | 200, `data` vacío | "No se pudieron leer datos, ¿la foto está enfocada?" |
| Algunos campos ilegibles | 200 parcial | Se llena lo leído; se listan los faltantes |

## Configuración

En `.env.local` (y documentado en `.env.local.example`), **sin prefijo `NEXT_PUBLIC_`**:

```
GEMINI_API_KEY=...                # https://aistudio.google.com/apikey (gratis, sin tarjeta)
GEMINI_MODEL=gemini-2.5-flash     # opcional; confirmar el vigente en AI Studio
GROQ_API_KEY=...                  # opcional; sin él, simplemente no hay fallback
```

Si falta `GEMINI_API_KEY`, el botón de escaneo no se muestra y el formulario funciona
manual. Sin errores en pantalla.

## Pruebas

**El proyecto no tiene runner de pruebas hoy** (`package.json` no incluye ninguno; el
`CLAUDE.md` describe la estrategia como manual). `normalize.ts` es puro y es exactamente
el tipo de código donde las pruebas automáticas pagan, así que este trabajo agrega
**Vitest** como `devDependency` y un script `npm test`. Es gratis, no toca el build de
producción y deja la base puesta para el resto del proyecto.

Si prefieres no agregar la dependencia, la alternativa es verificar `normalize.ts` con un
script suelto de Node; se pierde la regresión automática. Decisión pendiente de tu parte,
no bloquea el resto del plan.

`lib/ocr/normalize.ts` se prueba con casos concretos:
celulares como `+57 300 123 4567`, `300-123-4567`, `3001234567`, `300123456` (corto,
debe dar `null`); fechas como `2008-03-15` (válida), `2008-13-45` (imposible),
`1850-01-01` (fuera de rango).

Verificación manual, con volantes reales:
1. Buena luz, letra clara → todos los campos correctos.
2. Luz pobre o foto torcida → llena lo que puede, reporta el resto, no inventa.
3. Letra difícil → el líder corrige sobre lo prellenado.
4. **El consentimiento nunca queda marcado solo**, aunque el volante lo traiga marcado.
5. Los checkboxes de estados sí guardan después del arreglo con `Controller` —
   verificado en la base de datos, no solo en pantalla.
6. Sin `GEMINI_API_KEY`, la pantalla funciona manual sin errores.

## Fuera de alcance

- Planillas con varios jóvenes en una hoja (hoy cada volante es una persona).
- Escaneo desde el formulario público `/registro`.
- Guardar la imagen como respaldo o adjunto.
- Cambios de esquema en la base de datos.
