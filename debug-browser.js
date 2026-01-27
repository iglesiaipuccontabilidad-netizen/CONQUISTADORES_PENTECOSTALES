console.log('🔍 Verificando sesión de Conquistadores App...');

// Ejecuta este código en la consola del navegador (F12 -> Console)
// cuando estés en la página del dashboard

async function debugSession() {
    try {
        console.log('1. Verificando localStorage...');
        const authToken = localStorage.getItem('sb-dcgkzuouqeznxtfzgdil-auth-token');
        console.log('Token en localStorage:', authToken ? '✅ Presente' : '❌ Ausente');

        console.log('2. Verificando sesión con API...');
        const response = await fetch('/api/users/me');

        if (response.status === 401) {
            console.log('❌ No estás autenticado');
            console.log('💡 Solución: Ve a /login y entra con: aquilarjuan123@gmail.com');
            return;
        }

        const result = await response.json();

        if (result.success) {
            console.log('✅ Usuario autenticado:');
            console.log('- Email:', result.data.email);
            console.log('- Nombre:', result.data.nombre_completo);
            console.log('- Rol:', result.data.rol);
            console.log('- Estado:', result.data.estado);

            if (result.data.rol === 'admin') {
                console.log('🎉 Tienes permisos de administrador');
                console.log('✅ Puedes eliminar jóvenes');
            } else {
                console.log('❌ No tienes permisos de administrador');
                console.log('🔄 Tu rol actual es:', result.data.rol);
            }
        } else {
            console.log('❌ Error:', result.error);
        }

    } catch (error) {
        console.error('❌ Error de conexión:', error);
        console.log('💡 Asegúrate de que el servidor esté ejecutándose (npm run dev)');
    }
}

debugSession();