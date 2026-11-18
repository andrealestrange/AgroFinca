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

pintarCarrito();