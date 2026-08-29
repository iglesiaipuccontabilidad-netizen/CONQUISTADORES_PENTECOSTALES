import { createClient, User } from '@supabase/supabase-js'

let anonClient: ReturnType<typeof createClient> | null = null

function getAnonClient() {
  if (!anonClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return anonClient
}

// Verifica la firma de un JWT de usuario contra Supabase Auth usando el
// cliente con clave anon. Rutas que necesitan bypasear RLS deben seguir
// usando un cliente con service_role para sus consultas, pero deben
// verificar el token de acceso del usuario con esta función en vez de
// hacerlo a través de un cliente inicializado con service_role: en
// producción esa combinación (apikey de service_role + JWT de usuario en
// /auth/v1/user) puede ser rechazada por GoTrue, mientras que la misma
// verificación vía anon key funciona de forma consistente.
export async function verifyUserToken(token: string): Promise<{ user: User | null; error: Error | null }> {
  const { data: { user }, error } = await getAnonClient().auth.getUser(token)
  return { user, error }
}
