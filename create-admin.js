const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://dcgkzuouqeznxtfzgdil.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZ2t6dW91cWV6bnh0ZnpnZGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NDg3ODcsImV4cCI6MjA4NDQyNDc4N30.ZFKcXa54jCIv5OTMdwBbsVQSqy6KwWlWbaIEHPt041M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
    try {
        console.log('🔧 Creando usuario administrador...');

        // 1. Crear usuario en auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: 'admin@conquistadores.org',
            password: 'Admin123456!',
        });

        if (authError) {
            console.error('❌ Error al crear usuario en auth:', authError.message);
            return;
        }

        console.log('✅ Usuario creado en auth:', authData.user?.email);
        console.log('📧 User ID:', authData.user?.id);

        // 2. Para completar el setup, necesitaríamos insertar en la tabla users,
        // pero eso requiere permisos especiales que no tenemos con anon key

        console.log('\n🔑 Para completar el setup:');
        console.log('1. Ve a la URL del email de confirmación');
        console.log('2. Confirma el email');
        console.log('3. Luego ejecuta el siguiente SQL en Supabase Dashboard:');
        console.log(`
INSERT INTO users (id, email, nombre_completo, telefono, rol, estado)
VALUES ('${authData.user?.id}', 'admin@conquistadores.org', 'Administrador Sistema', '', 'admin', 'activo');
    `);

    } catch (error) {
        console.error('💥 Error general:', error.message);
    }
}

createAdminUser();