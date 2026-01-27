#!/bin/bash

echo "🧪 Testing Conquistadores API Local Endpoints"
echo "============================================="

BASE_URL="http://localhost:3000/api"

echo
echo "1. Testing GET /api/jovenes (should fail without auth)"
curl -s -X GET "$BASE_URL/jovenes" | jq '.' || echo "No jq installed, raw response:"

echo
echo "2. Testing POST /api/joven/registro (public endpoint)"
curl -s -X POST "$BASE_URL/joven/registro" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_completo": "Test User",
    "fecha_nacimiento": "2000-01-01",
    "celular": "+573001234567",
    "ciudad": "Bogotá",
    "direccion": "Calle 123 #45-67"
  }' | jq '.' 2>/dev/null || curl -s -X POST "$BASE_URL/joven/registro" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_completo": "Test User",
    "fecha_nacimiento": "2000-01-01",
    "celular": "+573001234567",
    "ciudad": "Bogotá",
    "direccion": "Calle 123 #45-67"
  }'

echo
echo "3. Testing GET /api/grupos (should fail without auth)"
curl -s -X GET "$BASE_URL/grupos" | jq '.' 2>/dev/null || curl -s -X GET "$BASE_URL/grupos"

echo
echo "🏁 API Test Complete"