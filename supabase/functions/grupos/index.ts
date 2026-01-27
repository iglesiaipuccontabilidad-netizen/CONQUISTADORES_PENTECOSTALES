// supabase/functions/grupos/index.ts - Edge Function básica para Grupos
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

const supabase = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  })
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message, status: 'error' }, status)
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)
  const path = url.pathname

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    // GET /grupos/:id
    const grupoMatch = path.match(/^\/grupos\/(.+)$/)
    if (grupoMatch && req.method === 'GET') {
      const grupoId = grupoMatch[1]

      const { data: grupo, error } = await supabase
        .from('grupos')
        .select(`
          id,
          nombre,
          descripcion,
          lider_id,
          estado,
          created_at,
          updated_at,
          lider:users!grupos_lider_id_fkey (
            id,
            nombre_completo,
            email
          )
        `)
        .eq('id', grupoId)
        .single()

      if (error) {
        return errorResponse('Grupo no encontrado', 404)
      }

      return jsonResponse({ status: 'success', grupo })
    }

    // GET /grupos
    if (path === '/grupos' && req.method === 'GET') {
      const { data: grupos, error } = await supabase
        .from('grupos')
        .select(`
          id,
          nombre,
          descripcion,
          lider_id,
          estado,
          created_at,
          updated_at,
          lider:users!grupos_lider_id_fkey (
            id,
            nombre_completo,
            email
          )
        `)

      if (error) {
        return errorResponse('Error al obtener grupos', 500)
      }

      return jsonResponse({ status: 'success', grupos: grupos || [] })
    }

    return errorResponse('Ruta no encontrada', 404)

  } catch (_error) {
    return errorResponse('Error interno del servidor', 500)
  }
})