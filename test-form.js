const testFormData = {
  nombre_completo: "Juan Pérez García",
  celular: "3113678555", 
  fecha_nacimiento: "2000-05-15",
  direccion: "Calle 123 #45-67",
  bautizado: true,
  sellado: false,
  servidor: true,
  simpatizante: false,
  consentimiento_datos_personales: true
};

async function testRegistroJoven() {
  try {
    console.log('Probando el registro de joven con datos:', testFormData);
    
    const response = await fetch('http://localhost:3000/api/joven/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testFormData)
    });

    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Respuesta:', result);
    
    if (response.ok) {
      console.log('✅ Prueba exitosa: El joven se registró correctamente');
    } else {
      console.log('❌ Error en la prueba:', result.error);
    }
    
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }
}

// Test con celular inválido (menos de 10 dígitos)
async function testCelularInvalido() {
  const invalidData = { ...testFormData, celular: "31136785" };
  
  try {
    console.log('\nProbando con celular inválido:', invalidData.celular);
    
    const response = await fetch('http://localhost:3000/api/joven/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidData)
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Respuesta:', result);
    
    if (!response.ok && result.error.includes('10 dígitos')) {
      console.log('✅ Validación funcionando: El celular inválido fue rechazado');
    } else {
      console.log('❌ La validación no está funcionando correctamente');
    }
    
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }
}

// Ejecutar las pruebas
async function runTests() {
  await testRegistroJoven();
  await testCelularInvalido();
}

// Intentar conectar cada 3 segundos hasta que esté listo
async function waitForServer() {
  const maxAttempts = 20;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetch('http://localhost:3000/api/joven/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      console.log('🟢 Servidor disponible, ejecutando pruebas...\n');
      await runTests();
      return;
    } catch (error) {
      attempts++;
      console.log(`Intento ${attempts}/${maxAttempts}: Esperando que el servidor esté listo...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('❌ El servidor no está disponible después de', maxAttempts, 'intentos');
}

waitForServer();