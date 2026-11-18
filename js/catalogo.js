const URL_DATOS = 'data/productos.json';

const contenedor = document.getElementById('lista-productos');
const buscador = document.getElementById('buscar');

let productos = [];

function mostrarCargando() {
  contenedor.innerHTML = '<p class="estado"><span class="spinner"></span>Cargando productos…</p>';
}

function mostrarError(mensaje) {
  contenedor.innerHTML = '';
  const caja = document.createElement('div');
  caja.className = 'estado estado--error';
  caja.setAttribute('role', 'alert');

  const texto = document.createElement('p');
  texto.textContent = mensaje;

  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'btn btn-pequeno';
  boton.textContent = 'Reintentar';
  boton.addEventListener('click', cargarProductos);

  caja.append(texto, boton);
  contenedor.append(caja);
}

function crearTarjeta(producto) {
  const tarjeta = document.createElement('article');
  tarjeta.className = 'card';

  const info = document.createElement('div');
  info.className = 'info';

  const titulo = document.createElement('h2');
  titulo.textContent = producto.nombre;

  const foto = document.createElement('img');
  foto.src = producto.imagen;
  foto.alt = producto.nombre;

  const presentacion = document.createElement('p');
  presentacion.textContent = producto.presentacion;

  const precio = document.createElement('p');
  precio.className = 'precio';
  precio.textContent = formatearPrecio(producto.precio);

  info.append(titulo, foto, presentacion, precio);

  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'btn btn-pequeno';
  boton.textContent = 'Agregar';
  boton.dataset.id = producto.id;

  tarjeta.append(info, boton);
  return tarjeta;
}

function pintar(lista) {
  contenedor.innerHTML = '';
  if (lista.length === 0) {
    contenedor.innerHTML = '<p class="estado">No encontramos productos con ese nombre.</p>';
    return;
  }
  lista.forEach(function (producto) {
    contenedor.append(crearTarjeta(producto));
  });
}

async function cargarProductos() {
    mostrarCargando();
    try {
      const respuesta = await fetch(URL_DATOS);
  
      if (!respuesta.ok) {
        if (respuesta.status === 404) {
          throw new Error('No se encontró el archivo de productos (error 404).');
        }
        if (respuesta.status >= 500) {
          throw new Error('El servidor tuvo un problema (error ' + respuesta.status + ').');
        }
        throw new Error('No se pudieron cargar los productos (código ' + respuesta.status + ').');
      }
  
      productos = await respuesta.json();
  
      if (!Array.isArray(productos)) {
        throw new Error('El archivo de productos no tiene el formato esperado.');
      }
  
      pintar(productos);
    } catch (error) {
      console.error('Error al cargar productos:', error);
  
      if (error instanceof TypeError && /fetch|network|load failed/i.test(error.message)) {
        mostrarError('No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.');
      } else {
        mostrarError(error.message);
      }
    }
  }

buscador.addEventListener('input', function () {
  const texto = buscador.value.toLowerCase().trim();
  const filtrados = productos.filter(function (p) {
    return p.nombre.toLowerCase().includes(texto);
  });
  pintar(filtrados);
});

// Clic en "Agregar": usamos delegación de eventos sobre el contenedor
contenedor.addEventListener('click', function (evento) {
    const boton = evento.target.closest('button[data-id]');
    if (!boton) return;
    const producto = productos.find(function (p) {
      return p.id === Number(boton.dataset.id);
    });
    if (producto) agregarAlCarrito(producto);
  });

// Al abrir la página, cargamos los productos
cargarProductos();