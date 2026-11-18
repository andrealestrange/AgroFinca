const lista = document.getElementById('lista-carrito');
const totalEl = document.getElementById('total');

function pintarCarrito() {
  const carrito = leerCarrito();
  lista.innerHTML = '';

  if (carrito.length === 0) {
    lista.innerHTML = '<li class="estado">Tu carrito está vacío.</li>';
    totalEl.textContent = formatearPrecio(0);
    return;
  }

  let total = 0;

  carrito.forEach(function (item) {
    const li = document.createElement('li');
    li.textContent = item.nombre + ' (' + item.presentacion + ') x' + item.cantidad +
      ' — ' + formatearPrecio(item.precio * item.cantidad);
    lista.append(li);
    total += item.precio * item.cantidad;
  });

  totalEl.textContent = formatearPrecio(total);
}

const botonPagar = document.getElementById('pagar');
const mensajePago = document.getElementById('mensaje-pago');

botonPagar.addEventListener('click', function (evento) {
  evento.preventDefault();

  const carrito = leerCarrito();

  if (carrito.length === 0) {
    mensajePago.textContent = 'Tu carrito está vacío. Agrega productos antes de pagar.';
    mensajePago.className = 'alerta mostrar err';
    return;
  }

  guardarCarrito([]);
  pintarCarrito();
  mensajePago.textContent = '✅ ¡Gracias por tu compra! Tu pedido fue registrado.';
  mensajePago.className = 'alerta mostrar ok';
});

pintarCarrito();
