const CLAVE_CARRITO = 'agrofinca_carrito';

function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
  } catch (error) {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function formatearPrecio(numero) {
  return '$' + numero.toLocaleString('es-CO');
}

function mostrarAviso(texto) {
  let aviso = document.getElementById('aviso');
  if (!aviso) {
    aviso = document.createElement('div');
    aviso.id = 'aviso';
    aviso.className = 'aviso';
    aviso.setAttribute('role', 'status');
    document.body.append(aviso);
  }
  aviso.textContent = texto;
  aviso.classList.add('visible');
  clearTimeout(aviso.temporizador);
  aviso.temporizador = setTimeout(function () {
    aviso.classList.remove('visible');
  }, 2200);
}

function agregarAlCarrito(producto) {
  const carrito = leerCarrito();
  const existente = carrito.find(function (item) { return item.id === producto.id; });

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      presentacion: producto.presentacion,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    });
  }
  guardarCarrito(carrito);
  mostrarAviso(producto.nombre + ' agregado al carrito ✔');
}