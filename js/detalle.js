const botonComprar = document.querySelector('.boton--comprar');

botonComprar.addEventListener('click', async function (evento) {
  evento.preventDefault();
  try {
    const respuesta = await fetch('data/productos.json');
    if (!respuesta.ok) throw new Error('Error ' + respuesta.status);
    const lista = await respuesta.json();
    const producto = lista.find(function (p) { return p.id === 2; });
    agregarAlCarrito(producto);
    window.location.href = 'carrito.html';
  } catch (error) {
    mostrarAviso('No se pudo agregar el producto. Inténtalo de nuevo.');
  }
});