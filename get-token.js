const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dcgkzuouqeznxtfzgdil.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZ2t6dW91cWV6bnh0ZnpnZGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NDg3ODcsImV4cCI6MjA4NDQyNDc4N30.ZFKcXa54jCIv5OTMdwBbsVQSqy6KwWlWbaIEHPt041M'
);

async function loginAndGetToken(password) {
  try {
    console.log('🔐 Iniciando sesión...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'aquilarjuan123@gmail.com',
      password: password
    });

    if (error) {
      console.error('❌ Error de login:', error.message);
      return;
    }

    console.log('✅ Login exitoso!');
    console.log('🎫 Token JWT:', data.session.access_token);
    console.log('');
    console.log('📅 Expira en:', new Date(data.session.expires_at * 1000).toLocaleString());
    console.log('');
    console.log('📋 Comandos curl para probar:');
    console.log('');
    console.log('1️⃣ LISTAR JÓVENES:');
    console.log(`curl -X GET "https://dcgkzuouqeznxtfzgdil.supabase.co/functions/v1/jovenes" \\\n  -H "Authorization: Bearer ${data.session.access_token}" \\\n  -H "Content-Type: application/json"`);
    console.log('');
    console.log('2️⃣ ELIMINAR JOVEN (reemplaza ID_REAL con un ID válido):');
    console.log(`curl -X DELETE "https://dcgkzuouqeznxtfzgdil.supabase.co/functions/v1/jovenes/ID_REAL" \\\n  -H "Authorization: Bearer ${data.session.access_token}" \\\n  -H "Content-Type: application/json"`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar con la contraseña como argumento
const password = process.argv[2];
if (!password) {
  console.log('❌ Uso: node get-token.js TU_PASSWORD');
  console.log('💡 Ejemplo: node get-token.js mipassword123');
  process.exit(1);
}

loginAndGetToken(password);