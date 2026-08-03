# Supabase Session Closes Immediately After Login - Solution

## Problema
La sesión se cierra automáticamente ~1 segundo después del login exitoso. Esto es típicamente causado por:

1. **RLS Policies Rechazando Lecturas** — Después de autenticar, Supabase intenta leer la tabla `users` pero las políticas lo rechazan
2. **Refresh Token Failure** — El token de refresh está mal configurado
3. **getSession() Error** — El hook `useAuth` falla al recuperar la sesión

## Solución: Configurar RLS Policies Correctamente

### Paso 1: Verificar tabla `users` en Supabase

1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta esta consulta para verificar RLS:

```sql
-- Verificar que RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- Resultado esperado: rowsecurity = true
```

### Paso 2: Crear RLS Policies Necesarias

Si RLS es true pero no hay policies, ejecuta:

```sql
-- Política para que usuarios vean su propio perfil
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Política para que usuarios actualicen su propio perfil
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política para admins (ven todo)
CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );
```

### Paso 3: Verificar Email Verification

Supabase puede rechazar sesiones si el email no está verificado. Ve a:
- Dashboard → Authentication → Providers → Email
- Asegúrate de que "Require email confirmation" está APAGADO (para desarrollo)

### Paso 4: Verificar `getSession()` en useAuth

El problema también puede ser que `getSession()` falla. Actualiza `hooks/useAuth.ts`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { setApiToken } from '../utils/api-client'

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const initSession = async () => {
      try {
        console.log('🔐 Attempting to restore session from storage...')
        
        // Usar onAuthStateChange es más confiable que getSession()
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('🔐 Auth state changed:', event, { hasSession: !!session })
            
            if (mounted) {
              if (session) {
                console.log('✅ Session restored:', session.user.email)
                setSession(session)
                setApiToken(session.access_token)
              } else {
                console.log('❌ No session found')
                setSession(null)
                setApiToken(null)
              }
              setLoading(false)
            }
          }
        )

        return () => subscription?.unsubscribe()
      } catch (err) {
        console.error('❌ Session error:', err)
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Error loading session')
          setLoading(false)
        }
      }
    }

    const cleanup = await initSession()
    return () => {
      mounted = false
      cleanup?.()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔑 Attempting login for:', email)
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) throw loginError

      console.log('✅ Login successful:', data.user.email)
      setSession(data.session)
      setApiToken(data.session?.access_token || null)

      return { success: true, session: data.session }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error logging in'
      console.error('❌ Login error:', message)
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      console.log('👋 Logging out...')
      const { error: logoutError } = await supabase.auth.signOut()
      if (logoutError) throw logoutError
      setSession(null)
      setApiToken(null)
      console.log('✅ Logged out successfully')
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error logging out'
      console.error('❌ Logout error:', message)
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const getUser = () => session?.user

  return {
    session,
    loading,
    error,
    login,
    logout,
    getUser,
    isAuthenticated: !!session,
  }
}
```

### Paso 5: Verificar Supabase Client Initialization

En `lib/supabase.ts`, asegúrate de que la configuración es correcta:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,  // ✓ Importante
    autoRefreshToken: true,  // ✓ Importante
  },
})
```

## Checklist de Debugging

- [ ] RLS está habilitado en tabla `users`
- [ ] Existen RLS policies que permiten al usuario leer su propio registro
- [ ] Email verification NO es requerida (Supabase Dashboard → Auth)
- [ ] `persistSession: true` en Supabase client config
- [ ] `autoRefreshToken: true` en Supabase client config
- [ ] No hay errores en console del navegador (F12)
- [ ] Network tab muestra que requests incluyen Authorization header
- [ ] Supabase project URL y anon key son correctos en `.env.local`

## Referencias Supabase

- [Auth Session Management](https://supabase.com/docs/guides/auth/auth-handlers)
- [RLS Policies](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [onAuthStateChange](https://supabase.com/docs/reference/javascript/auth-onauthstatechange)
- [getSession() vs onAuthStateChange()](https://supabase.com/docs/guides/auth/sessions)

## Pasos Inmediatos

1. **Abre Supabase Dashboard** → Tu proyecto
2. **SQL Editor** → Ejecuta las queries de RLS arriba
3. **Authentication** → Verifica Email Confirmation está deshabilitado
4. **Actualiza `hooks/useAuth.ts`** con el código del Paso 4
5. **Restart app** con `npm run dev`
6. **Prueba login** nuevamente

Si aún falla, revisa la **Console** (F12) para ver mensajes de error específicos.
