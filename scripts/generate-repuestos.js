// scripts/generate-repuestos.js
import PocketBase from 'pocketbase';
import { faker } from '@faker-js/faker';

// Configuración
const PB_URL = 'http://127.0.0.1:8090';
const TOTAL_REGISTROS = 2000;

// Inicializar cliente de PocketBase
const pb = new PocketBase(PB_URL);

// Datos realistas para generar repuestos
const CATEGORIAS = [
  'Motor', 'Frenos', 'Suspensión', 'Transmisión', 
  'Eléctrico', 'Escape', 'Carrocería', 'Neumáticos', 
  'Filtros', 'Embrague', 'Dirección', 'Refrigeración'
];

const MARCAS = [
  'Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Ducati',
  'BMW', 'KTM', 'Harley-Davidson', 'Triumph', 'Bajaj',
  'Royal Enfield', 'Benelli', 'CFMoto', 'Hyosung'
];

const MODELOS_POR_MARCA = {
  'Honda': ['CBR600RR', 'CB500F', 'Africa Twin', 'PCX 125', 'Gold Wing'],
  'Yamaha': ['R1', 'MT-07', 'NMAX 155', 'Ténéré 700', 'YZF-R3'],
  'Suzuki': ['GSX-R750', 'V-Strom 650', 'Hayabusa', 'Burgman 400'],
  'Kawasaki': ['Ninja ZX-10R', 'Z900', 'Versys 650', 'KLX 300'],
  'Ducati': ['Panigale V4', 'Monster', 'Multistrada', 'Scrambler'],
  'KTM': ['Duke 390', 'Adventure 790', 'RC 390', 'Super Duke'],
  'BMW': ['R 1250 GS', 'S 1000 RR', 'F 900 R', 'G 310 R'],
  'Bajaj': ['Pulsar NS200', 'Dominar 400', 'Avenger Street'],
  'Royal Enfield': ['Interceptor 650', 'Himalayan', 'Classic 350'],
  // Puedes expandir según necesites
};

const NOMBRES_REPUESTOS = [
  'Filtro de aceite', 'Pastillas de freno delanteras', 'Pastillas de freno traseras',
  'Amortiguador trasero', 'Kit de empaque de culata', 'Bujía iridium',
  'Cadena de transmisión', 'Kit de retenes de horquilla', 'Disco de freno delantero',
  'Disco de freno trasero', 'Filtro de aire', 'Bomba de aceite',
  'Sensor de temperatura', 'Regulador de voltaje', 'Batería AGM',
  'Manija de embrague', 'Manguera de freno trenzada', 'Kit de juntas de motor',
  'Corona trasera', 'Piñón delantero', 'Tapa de balancines', 'Termostato',
  'Radiador', 'Ventilador de radiador', 'Cable de acelerador',
  'Espejo retrovisor', 'Faros LED', 'Claxon eléctrico'
];

// Función para obtener un modelo aleatorio según la marca
function getModeloAleatorio(marca) {
  const modelos = MODELOS_POR_MARCA[marca] || ['Modelo Genérico'];
  return faker.helpers.arrayElement(modelos);
}

// Función para generar un repuesto realista
function generarRepuesto() {
  const marca = faker.helpers.arrayElement(MARCAS);
  const nombre = faker.helpers.arrayElement(NOMBRES_REPUESTOS);
  const categoria = faker.helpers.arrayElement(CATEGORIAS);
  const modelo_moto = getModeloAleatorio(marca);
  const precio = parseFloat((faker.number.float({ min: 5.99, max: 499.99, precision: 0.01 })).toFixed(2));
  const stock = faker.number.int({ min: 0, max: 100 });
  const disponible = stock > 0;
  const referencia = `${marca.substring(0,3).toUpperCase()}-${categoria.substring(0,3).toUpperCase()}-${faker.string.alphanumeric(6).toUpperCase()}`;
  const descripcion = `Repuesto de alta calidad para ${marca} ${modelo_moto}. Compatible con modelos ${faker.number.int({ min: 2015, max: 2024 })}-${faker.number.int({ min: 2020, max: 2025 })}.`;

  return {
    nombre,
    descripcion,
    precio,
    stock,
    categoria,
    marca,
    modelo_moto,
    referencia,
    disponible,
    // Opcional: imagen placeholder
    imagen_url: `https://via.placeholder.com/150/92c952?text=${encodeURIComponent(nombre.substring(0, 15))}`
  };
}

// Función principal
async function poblarBaseDeDatos() {
  console.log(`🚀 Iniciando generación de ${TOTAL_REGISTROS} repuestos...`);

  // Verificar conexión con PocketBase
  try {
    await pb.health.check({ timeout: 5000 });
    console.log('✅ Conexión con PocketBase establecida.');
  } catch (err) {
    console.error('❌ No se pudo conectar a PocketBase. ¿Está ejecutándose?');
    console.error('Ejecuta: ./pocketbase serve');
    process.exit(1);
  }

  // Generar e insertar registros
  for (let i = 1; i <= TOTAL_REGISTROS; i++) {
    const repuesto = generarRepuesto();
    
    try {
      await pb.collection('repuestos').create(repuesto);
      if (i % 100 === 0) {
        console.log(`✅ ${i} repuestos creados...`);
      }
    } catch (err) {
      console.error(`❌ Error al crear el repuesto #${i}:`, err.message);
      // No detenemos el script por un error aislado
    }
  }

  console.log(`🎉 ¡${TOTAL_REGISTROS} repuestos generados exitosamente!`);
  console.log('👉 Ahora puedes abrir tu app SvelteKit y ver los datos.');
}

// Ejecutar el script
poblarBaseDeDatos().catch(console.error);