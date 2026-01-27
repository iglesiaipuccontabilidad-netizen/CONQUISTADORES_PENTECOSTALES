// Script de depuración para verificar la sesión actual
// Ejecuta esto en la consola del navegador (F12 -> Console)

console.log('🔍 Verificando estado de sesión...');

async function checkSession() {
    try {
        // 1. Verificar sesión de Supabase
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        const { data: session, error } = await supabase.auth.getSession();

        if (error) {
            console.error('❌ Error obteniendo sesión:', error);
            return;
        }

        if (!session?.session) {
            console.log('❌ No hay sesión activa');
            console.log('💡 Solución: Ve a /login e inicia sesión con aquilarjuan123@gmail.com');
            return;
        }

        console.log('✅ Sesión activa:', {
            user_id: session.session.user.id,
            email: session.session.user.email,
            expires_at: new Date(session.session.expires_at * 1000).toLocaleString()
        });

        // 2. Verificar datos del usuario
        const response = await fetch('/api/users/me', {
            headers: {
                'Authorization': `Bearer ${session.session.access_token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const userData = await response.json();
            console.log('✅ Datos del usuario:', userData.data);

            if (userData.data.rol === 'admin') {
                console.log('🎉 Tienes permisos de administrador - puedes eliminar jóvenes');
            } else {
                console.log('❌ No tienes permisos de administrador');
                console.log('💡 Tu rol actual es:', userData.data.rol);
            }
        } else {
            console.error('❌ Error obteniendo datos del usuario:', await response.text());
        }

    } catch (error) {
        console.error('❌ Error general:', error);
        console.log('💡 Asegúrate de estar en la página del dashboard');
    }
}

checkSession();