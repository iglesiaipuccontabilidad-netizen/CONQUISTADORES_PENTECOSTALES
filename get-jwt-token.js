const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dcgkzuouqeznxtfzgdil.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZ2t6dW91cWV6bnh0ZnpnZGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NDg3ODcsImV4cCI6MjA4NDQyNDc4N30.ZFKcXa54jCIv5OTMdwBbsVQSqy6KwWlWbaIEHPt041M'
);

async function getToken() {
  try {
    // Reemplaza con tus credenciales
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'aquilarjuan123@gmail.com', // Tu email
      password: 'TU_PASSWORD_AQUI' // Reemplaza con tu contraseña real
    });

    if (error) {
      console.error('Error de login:', error.message);
      return;
    }

    console.log('=== TOKEN JWT PARA TESTING ===');
    console.log(data.session.access_token);
    console.log('');
    console.log('Expira en:', new Date(data.session.expires_at * 1000).toLocaleString());
    console.log('');
    console.log('Usa este token en el header Authorization: Bearer <token>');
  } catch (error) {
    console.error('Error:', error);
  }
}

getToken();