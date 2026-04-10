let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/* GUARDAR */
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

/* AGREGAR */
function agregarCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  guardarCarrito();
  actualizarContador();

  alert("Producto agregado al carrito");
}

/* CONTADOR (INDEX) */
function actualizarContador() {
  const contador = document.getElementById("contador");
  if (contador) {
    contador.textContent = carrito.length;
  }
}

/* MOSTRAR CARRITO (SOLO carrito.html) */
function mostrarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalTexto = document.getElementById("total");

  if (!lista || !totalTexto) return;

  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} - $${item.precio}
      <button class="eliminar" onclick="eliminarProducto(${index})">X</button>
    `;
    lista.appendChild(li);
    total += item.precio;
  });

  let descuento = 0;
  if (carrito.length >= 6) descuento = 0.10;
  else if (carrito.length >= 3) descuento = 0.05;

  let totalFinal = total - (total * descuento);

  totalTexto.textContent = `Total: $${totalFinal.toFixed(2)}`;

  if (descuento > 0) {
    totalTexto.textContent += " (Descuento aplicado)";
  }
}

/* ELIMINAR */
function eliminarProducto(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  mostrarCarrito();
  actualizarContador();
}

/* VACIAR */
function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
  actualizarContador();
}

/* PAGAR */
function pagar() {
  if (carrito.length === 0) {
    alert("Carrito vacío");
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

  mensaje += `\nTotal a pagar: $${totalFinal.toFixed(2)}`;
  mensaje += "\n¿Está disponible?";

  let url = `https://wa.me/5212201467666?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}

/* INICIALIZAR */
actualizarContador();
mostrarCarrito();
