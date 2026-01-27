// Script para probar directamente la eliminación de jóvenes
// Ejecuta esto en la consola del navegador cuando estés en la app

async function testDeleteEndpoint() {
  try {
    console.log('🧪 Iniciando prueba de eliminación...');
    
    // 1. Verificar sesión actual
    const userResponse = await fetch('/api/users/me');
    if (!userResponse.ok) {
      console.log('❌ Error de autenticación:', await userResponse.text());
      return;
    }
    
    const userData = await userResponse.json();
    console.log('✅ Usuario autenticado:', userData.data);
    
    // 2. Obtener lista de jóvenes
    console.log('📋 Obteniendo lista de jóvenes...');
    const jovenesResponse = await fetch('/api/jovenes');
    if (!jovenesResponse.ok) {
      console.log('❌ Error obteniendo jóvenes:', await jovenesResponse.text());
      return;
    }
    
    const jovenesData = await jovenesResponse.json();
    const jovenes = jovenesData.data || [];
    console.log(`✅ Encontrados ${jovenes.length} jóvenes`);
    
    if (jovenes.length === 0) {
      console.log('ℹ️ No hay jóvenes para probar');
      return;
    }
    
    // 3. Intentar eliminar el último joven (solo para prueba)
    const jovenTest = jovenes[jovenes.length - 1];
    console.log('🎯 Probando eliminación del joven:', jovenTest.nombre_completo, '(ID:', jovenTest.id + ')');
    
    const deleteResponse = await fetch(`/api/jovenes/${jovenTest.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📤 Respuesta del DELETE:', deleteResponse.status, deleteResponse.statusText);
    
    if (deleteResponse.ok) {
      const result = await deleteResponse.json();
      console.log('🎉 ¡Eliminación exitosa!', result);
    } else {
      const error = await deleteResponse.text();
      console.log('❌ Error en la eliminación:', error);
    }
    
  } catch (error) {
    console.error('💥 Error en la prueba:', error);
  }
}

console.log('🧪 Para probar la eliminación, ejecuta: testDeleteEndpoint()');
// testDeleteEndpoint(); // Descomenta esta línea si quieres ejecutar automáticamente