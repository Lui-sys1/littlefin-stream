let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/* ================= GUARDAR ================= */
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

/* ================= AGREGAR ================= */
function agregarCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  guardarCarrito();
  actualizarContador();
  mostrarToast("Producto agregado 🛒");
}

/* ================= CONTADOR ================= */
function actualizarContador() {
  const contador = document.getElementById("contador");
  if (contador) {
    contador.textContent = carrito.length;
  }
}

/* ================= MÉTODO DE PAGO (NUEVO) ================= */
function seleccionarPago(metodo) {
  localStorage.setItem("metodoPago", metodo);

  document.getElementById("btn-transferencia")?.classList.remove("activo");
  document.getElementById("btn-link")?.classList.remove("activo");

  if (metodo === "Transferencia") {
    document.getElementById("btn-transferencia")?.classList.add("activo");
  } else {
    document.getElementById("btn-link")?.classList.add("activo");
  }
}

/* ================= MOSTRAR ================= */
function mostrarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const subtotalTexto = document.getElementById("subtotal");
  const descuentoTexto = document.getElementById("descuento");
  const totalTexto = document.getElementById("total");

  if (!lista) return;

  lista.innerHTML = "";

  let subtotal = 0;

  carrito.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("item-carrito");

    div.innerHTML = `
      <div class="item-info">
        ${item.nombre}<br>
        <strong>$${item.precio}</strong>
      </div>
      <button onclick="eliminarProducto(${index})">X</button>
    `;

    lista.appendChild(div);
    subtotal += item.precio;
  });

  let descuento = 0;
  if (carrito.length >= 6) descuento = 0.10;
  else if (carrito.length >= 3) descuento = 0.05;

  let descuentoMonto = subtotal * descuento;
  let totalFinal = subtotal - descuentoMonto;

  if (subtotalTexto) subtotalTexto.textContent = `$${subtotal.toFixed(2)}`;
  if (descuentoTexto) descuentoTexto.textContent = `-$${descuentoMonto.toFixed(2)}`;
  if (totalTexto) totalTexto.textContent = `$${totalFinal.toFixed(2)}`;
}

/* ================= ELIMINAR ================= */
function eliminarProducto(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  mostrarCarrito();
  actualizarContador();
}

/* ================= VACIAR ================= */
function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
  actualizarContador();
}

/* ================= GENERAR ID ================= */
function generarID() {
  return "LF-" + Math.floor(10000 + Math.random() * 90000);
}

/* ================= FECHA ================= */
function obtenerFecha() {
  return new Date().toLocaleDateString("es-MX");
}

/* ================= PAGAR ================= */
function pagar() {
  if (carrito.length === 0) {
    alert("Carrito vacío");
    return;
  }

  let nombreCliente = localStorage.getItem("nombreCliente");

  if (!nombreCliente) {
    nombreCliente = prompt("Ingresa tu nombre:");
    if (!nombreCliente) return;
    localStorage.setItem("nombreCliente", nombreCliente);
  }

  // 🔥 método desde selector
  let metodoPago = localStorage.getItem("metodoPago");

  if (!metodoPago) {
    alert("Selecciona un método de pago");
    return;
  }

  let idPedido = generarID();
  let fecha = obtenerFecha();

  localStorage.setItem("ultimoPedido", idPedido);

  let mensaje = "🧾 *Nuevo Pedido - Littlefin Stream*\n\n";
  mensaje += `📦 *ID de pedido:* ${idPedido}\n`;
  mensaje += `📅 *Fecha:* ${fecha}\n\n`;

  mensaje += `👤 *Cliente:*\n${nombreCliente}\n\n`;

  mensaje += "🛒 *Productos:*\n";
  carrito.forEach(item => {
    mensaje += `• ${item.nombre} - $${item.precio}\n`;
  });

  let subtotal = carrito.reduce((a, b) => a + b.precio, 0);
  let descuento = carrito.length >= 6 ? 0.10 : carrito.length >= 3 ? 0.05 : 0;

  let descuentoMonto = subtotal * descuento;
  let totalFinal = subtotal - descuentoMonto;

  mensaje += `\n💰 Subtotal: $${subtotal.toFixed(2)}`;
  mensaje += `\nDescuento: -$${descuentoMonto.toFixed(2)}`;
  mensaje += `\nTotal: *$${totalFinal.toFixed(2)}*`;

  mensaje += `\n\n💳 Método de pago: ${metodoPago}`;

  mensaje += `\n\n📌 ¿Me confirmas disponibilidad?`;

  mensaje += `\n\n🌐 https://www.littlefinstream.com/gracias.html`;

  mensaje += `\n\n🙏 Gracias por tu pedido`;

  mostrarToast("Redirigiendo...");

  vaciarCarrito();

  const url = `https://wa.me/5212201467666?text=${encodeURIComponent(mensaje)}`;

  setTimeout(() => {
    window.location.href = url;
  }, 800);
}

/* ================= TOAST ================= */
function mostrarToast(texto) {
  const toast = document.createElement("div");
  toast.textContent = texto;

  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#22c55e";
  toast.style.color = "white";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "10px";
  toast.style.zIndex = "999";

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2000);
}

/* ================= INIT ================= */
actualizarContador();
mostrarCarrito();
