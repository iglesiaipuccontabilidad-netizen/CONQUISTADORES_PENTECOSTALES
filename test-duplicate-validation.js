#!/usr/bin/env node

/**
 * Script para probar la validación de nombres duplicados
 * Ejecutar con: node test-duplicate-validation.js
 */

const API_BASE_URL = 'http://localhost:3000/api';

async function testDuplicateValidation() {
  console.log('🧪 Probando validación de nombres duplicados...\n');
  
  const testJoven = {
    nombre_completo: 'Juan Prueba Duplicado',
    celular: '3001234567',
    fecha_nacimiento: '2000-05-15',
    direccion: 'Dirección de prueba',
    bautizado: true,
    sellado: false,
    servidor: false,
    simpatizante: false,
    consentimiento_datos_personales: true
  };
  
  try {
    // 1. Intentar crear el primer joven
    console.log('1️⃣ Creando primer joven...');
    const response1 = await fetch(`${API_BASE_URL}/joven/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testJoven)
    });
    
    const result1 = await response1.json();
    console.log('   Resultado:', response1.status, result1.message || result1.error || 'OK');
    
    if (response1.ok) {
      console.log('   ✅ Primer joven creado exitosamente\n');
      
      // 2. Intentar crear un joven con el mismo nombre
      console.log('2️⃣ Intentando crear joven duplicado (mismo nombre)...');
      const testJoven2 = { ...testJoven, celular: '3009876543' }; // Celular diferente
      
      const response2 = await fetch(`${API_BASE_URL}/joven/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testJoven2)
      });
      
      const result2 = await response2.json();
      console.log('   Resultado:', response2.status, result2.error || result2.message);
      
      if (!response2.ok && result2.error && result2.error.includes('Ya existe un joven')) {
        console.log('   ✅ Validación funcionando correctamente - duplicado detectado\n');
      } else {
        console.log('   ❌ Validación no funcionó como esperado\n');
      }
      
      // 3. Intentar crear joven con mismo celular pero nombre diferente
      console.log('3️⃣ Intentando crear joven con mismo celular...');
      const testJoven3 = { 
        ...testJoven, 
        nombre_completo: 'Pedro Prueba Celular',
        celular: testJoven.celular // Mismo celular del primer joven
      };
      
      const response3 = await fetch(`${API_BASE_URL}/joven/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testJoven3)
      });
      
      const result3 = await response3.json();
      console.log('   Resultado:', response3.status, result3.error || result3.message);
      
      if (!response3.ok && result3.error && result3.error.includes('celular')) {
        console.log('   ✅ Validación de celular funcionando correctamente\n');
      } else {
        console.log('   ❌ Validación de celular no funcionó como esperado\n');
      }
      
    } else {
      console.log('   ❌ No se pudo crear el primer joven para la prueba\n');
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
  }
}

// Función para limpiar datos de prueba
async function cleanupTestData() {
  console.log('🧹 Limpiando datos de prueba...');
  console.log('   (Esto requeriría acceso directo a la base de datos)');
  console.log('   Por favor, elimina manualmente los registros de prueba si es necesario.\n');
}

async function main() {
  await testDuplicateValidation();
  await cleanupTestData();
  
  console.log('✨ Prueba completada');
  console.log('📝 Resumen de validaciones implementadas:');
  console.log('   • Validación por nombre completo');
  console.log('   • Validación por número de celular');
  console.log('   • Mensajes de error específicos');
  console.log('   • Verificación en tiempo real en el frontend');
}

if (require.main === module) {
  main().catch(console.error);
}