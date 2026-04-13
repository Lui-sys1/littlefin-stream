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

/* ================= CONTADOR (INDEX) ================= */
function actualizarContador() {
  const contador = document.getElementById("contador");
  if (contador) {
    contador.textContent = carrito.length;
  }
}

/* ================= MOSTRAR (CARRITO.HTML) ================= */
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
      <button class="btn-eliminar" onclick="eliminarProducto(${index})">X</button>
    `;

    lista.appendChild(div);
    subtotal += item.precio;
  });

  /* ===== DESCUENTO ===== */
  let descuento = 0;
  if (carrito.length >= 6) descuento = 0.10;
  else if (carrito.length >= 3) descuento = 0.05;

  let descuentoMonto = subtotal * descuento;
  let totalFinal = subtotal - descuentoMonto;

  /* ===== PINTAR DATOS ===== */
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
  const hoy = new Date();
  return hoy.toLocaleDateString("es-MX");
}

/* ================= PAGAR (PRO CON ANIMACIÓN) ================= */
function pagar() {
  if (carrito.length === 0) {
    alert("Carrito vacío");
    return;
  }

  let nombreCliente = localStorage.getItem("nombreCliente");

  if (!nombreCliente) {
    nombreCliente = prompt("Ingresa tu nombre:");
    
    if (!nombreCliente || nombreCliente.trim() === "") {
      alert("Por favor ingresa tu nombre");
      return;
    }

    localStorage.setItem("nombreCliente", nombreCliente);
  }

  let idPedido = generarID();
  let fecha = obtenerFecha();

  let mensaje = "🧾 *Nuevo Pedido - Littlefin Stream*\n\n";
  mensaje += `📦 *ID de pedido:* ${idPedido}\n`;
  mensaje += `📅 *Fecha:* ${fecha}\n\n`;

  mensaje += "👤 *Cliente:*\n";
  mensaje += `${nombreCliente}\n\n`;

  mensaje += "🛒 *Productos solicitados:*\n";

  carrito.forEach(item => {
    mensaje += `• ${item.nombre} - $${item.precio}\n`;
  });

  let subtotal = carrito.reduce((acc, item) => acc + item.precio, 0);

  let descuento = 0;
  if (carrito.length >= 6) descuento = 0.10;
  else if (carrito.length >= 3) descuento = 0.05;

  let descuentoMonto = subtotal * descuento;
  let totalFinal = subtotal - descuentoMonto;

  mensaje += `\n💰 *Resumen de pago:*`;
  mensaje += `\nSubtotal: $${subtotal.toFixed(2)}`;
  mensaje += `\nDescuento aplicado: -$${descuentoMonto.toFixed(2)}`;
  mensaje += `\nTotal a pagar: *$${totalFinal.toFixed(2)}*`;

  mensaje += `\n\n💳 *Método de pago:* Transferencia o link de pago`;

  mensaje += `\n\n📌 *Solicitud:*`;
  mensaje += `\n¿Me confirmas disponibilidad y datos para realizar el pago?`;

  mensaje += `\n\n🔒 Pedido generado automáticamente desde la web`;
  mensaje += `\nGracias 🙌`;

  // 🔥 OVERLAY PRO
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.85)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.color = "white";
  overlay.style.zIndex = "9999";
  overlay.innerHTML = `
    <div style="font-size:18px;margin-bottom:20px;">Procesando pedido...</div>
    <div class="loader"></div>
  `;
  document.body.appendChild(overlay);

  // 🔥 CSS loader
  const style = document.createElement("style");
  style.innerHTML = `
    .loader {
      border: 5px solid #1f2937;
      border-top: 5px solid #22c55e;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // 🔥 Paso 1: éxito visual
  setTimeout(() => {
    overlay.innerHTML = `
      <div style="font-size:40px;">✅</div>
      <div style="margin-top:10px;font-size:18px;">Pedido enviado</div>
    `;
  }, 1500);

  // 🔥 Paso 2: redirigir + limpiar carrito
  setTimeout(() => {
    const url = `https://wa.me/5212201467666?text=${encodeURIComponent(mensaje)}`;
    window.location.href = url;
    vaciarCarrito();
  }, 2600);
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
  toast.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
  toast.style.zIndex = "999";

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2000);
}

/* ================= INIT ================= */
actualizarContador();
mostrarCarrito();
