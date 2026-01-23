#!/bin/bash

# Script de prueba para verificar conectividad del API

SUPABASE_URL="https://dcgkzuouqeznxtfzgdil.supabase.co/functions/v1"
JOVEN_ID="b593680f-23b4-4d45-a0f3-1cff7569a0df"

echo "🧪 Probando conectividad con API..."
echo ""
echo "URL que se probará:"
echo "$SUPABASE_URL/jovenes/$JOVEN_ID"
echo ""

# Necesitas un token válido para probar
# Puedes obtenerlo de las DevTools del navegador (Application > Cookies)
TOKEN="${SUPABASE_AUTH_TOKEN}"

if [ -z "$TOKEN" ]; then
    echo "⚠️  No se encontró token de autenticación."
    echo "Para obtener un token válido:"
    echo "1. Abre DevTools (F12) en el navegador"
    echo "2. Pestaña 'Application'"
    echo "3. Busca en Storage > localStorage > sb_* el campo que contiene 'access_token'"
    echo "4. Copia el valor completo"
    echo "5. Ejecuta: export SUPABASE_AUTH_TOKEN='tu_token_aqui' && bash test_api.sh"
    exit 1
fi

echo "📊 Enviando GET request..."
echo ""

curl -X GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$SUPABASE_URL/jovenes/$JOVEN_ID" \
  -v

echo ""
echo ""
echo "✅ Prueba completada"
