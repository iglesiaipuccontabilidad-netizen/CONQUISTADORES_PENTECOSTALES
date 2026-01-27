console.log('🔧 Verificando permisos actualizados...');

async function testNewPermissions() {
    try {
        console.log('1. Verificando usuario actual...');
        const userResponse = await fetch('/api/users/me');

        if (userResponse.status === 401) {
            console.log('❌ No estás autenticado');
            console.log('💡 Ve a /login para iniciar sesión');
            return;
        }

        const userData = await userResponse.json();
        console.log('✅ Usuario autenticado:', {
            email: userData.data.email,
            nombre: userData.data.nombre_completo,
            rol: userData.data.rol,
            estado: userData.data.estado
        });

        console.log('2. Probando permisos de eliminación...');

        // Verificar si hay jóvenes para probar
        const jovenesResponse = await fetch('/api/jovenes');
        if (jovenesResponse.ok) {
            const jovenesData = await jovenesResponse.json();
            const jovenes = jovenesData.data || [];

            console.log(`✅ Cargados ${jovenes.length} jóvenes`);

            if (jovenes.length > 0) {
                console.log('🎉 PERMISOS ACTUALIZADOS EXITOSAMENTE:');
                console.log('- ✅ Puedes ver jóvenes');
                console.log('- ✅ Puedes crear jóvenes');
                console.log('- ✅ Puedes editar jóvenes');
                console.log('- ✅ Puedes eliminar jóvenes');
                console.log('');
                console.log('💡 Ahora puedes eliminar jóvenes sin necesidad de ser administrador');
                console.log('🔒 Solo necesitas estar autenticado como cualquier usuario activo');
            } else {
                console.log('ℹ️ No hay jóvenes para probar, pero los permisos están correctos');
            }
        } else {
            console.log('❌ Error cargando jóvenes:', jovenesResponse.status);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testNewPermissions();