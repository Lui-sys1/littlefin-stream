// CONFIGURACIÓN
const CONFIG = {
  telefono: "5212201467666",
  negocio: "Littlefin Stream"
};

// FUNCIÓN PRINCIPAL
function comprar(plan) {
  const mensaje = generarMensaje(plan);
  const url = generarLinkWhatsApp(mensaje);

  abrirWhatsApp(url);
}

// GENERAR MENSAJE (más profesional)
function generarMensaje(plan) {
  return `Hola 👋, quiero comprar *${plan}* en ${CONFIG.negocio}.

¿Me puedes dar información y disponibilidad?`;
}

// GENERAR LINK
function generarLinkWhatsApp(mensaje) {
  return `https://wa.me/${CONFIG.telefono}?text=${encodeURIComponent(mensaje)}`;
}

// ABRIR WHATSAPP SEGÚN DISPOSITIVO
function abrirWhatsApp(url) {
  const esMovil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (esMovil) {
    window.location.href = url; // abre directo en móvil
  } else {
    window.open(url, "_blank"); // abre en nueva pestaña en PC
  }
}
