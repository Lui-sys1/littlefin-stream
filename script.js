let carrito = [];

function agregarCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalTexto = document.getElementById("total");

  lista.innerHTML = "";

  let total = 0;

  carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;
    lista.appendChild(li);
    total += item.precio;
  });

  let descuento = 0;

  if (carrito.length >= 6) {
    descuento = 0.10;
  } else if (carrito.length >= 3) {
    descuento = 0.05;
  }

  let totalFinal = total - (total * descuento);

  totalTexto.textContent = `Total: $${totalFinal.toFixed(2)}`;

  if (descuento > 0) {
    totalTexto.textContent += ` (Descuento aplicado)`;
  }
}

function pagar() {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let mensaje = "Hola, quiero comprar:\n\n";

  carrito.forEach(item => {
    mensaje += `- ${item.nombre} $${item.precio}\n`;
  });

  let total = carrito.reduce((acc, item) => acc + item.precio, 0);

  let descuento = 0;
  if (carrito.length >= 6) descuento = 0.10;
  else if (carrito.length >= 3) descuento = 0.05;

  let totalFinal = total - (total * descuento);

  mensaje += `\nTotal: $${totalFinal.toFixed(2)}`;
  mensaje += "\n¿Está disponible?";

  let url = `https://wa.me/5212201467666?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}
