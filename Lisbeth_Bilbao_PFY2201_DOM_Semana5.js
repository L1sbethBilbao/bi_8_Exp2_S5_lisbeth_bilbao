/* ============================================
   Kivo — JavaScript Semana 5
   Archivo externo (buena práctica de la clase).
   Se carga al final del body en cada página.
   Estilo de la clase: funciones reutilizables,
   let/const, addEventListener, createElement
   y appendChild.
   ============================================ */

const URL_CATALOGO = "https://fakestoreapi.com/products?limit=6";

/**
 * Punto de entrada.
 * Flujo: espera a que el DOM esté listo y configura
 * solo las funciones de la página actual.
 */
function iniciarSitio() {
    configurarOfertaInicio();
    configurarEfectoTarjetas();
    configurarCatalogo();
    configurarFormulario();
}

/**
 * Evento click en Inicio.
 * Flujo: busca el botón de oferta y, si existe,
 * escucha el clic para mostrar el aviso dinámico.
 */
function configurarOfertaInicio() {
    const botonOferta = document.getElementById("btn-oferta");

    if (!botonOferta) {
        return;
    }

    botonOferta.addEventListener("click", mostrarOferta);
}

/**
 * Manipula el DOM en Inicio (criterio 1 y evento click).
 * Flujo: cambia un texto con innerHTML (ejemplo index1/index4)
 * y crea un aviso nuevo con createElement + appendChild (index5).
 */
function mostrarOferta() {
    const textoOferta = document.getElementById("texto-oferta");
    const textoBienvenida = document.getElementById("texto-bienvenida");
    const avisoOferta = document.getElementById("aviso-oferta");

    if (textoOferta) {
        textoOferta.innerHTML = "Oferta activa: 20% de descuento en juegos destacados de la semana.";
    }

    if (textoBienvenida) {
        textoBienvenida.innerHTML = "Aprovecha la oferta de Kivo: el juego encuentra su lugar, ahora con descuento.";
    }

    if (!avisoOferta) {
        return;
    }

    limpiarContenedor(avisoOferta);

    const aviso = document.createElement("p");
    aviso.className = "aviso-dinamico aviso-exito mb-0";
    aviso.innerHTML = "Zelda: Echoes of Time, Cyber Racers 2099 y Pixel Quest Origins participan en la promoción.";
    avisoOferta.appendChild(aviso);
}

/**
 * Eventos mouseover y mouseout en las tarjetas.
 * Flujo: recorre las cards existentes y les aplica
 * el cambio de estilo que pidió la actividad.
 */
function configurarEfectoTarjetas() {
    const tarjetas = document.getElementsByClassName("kivo-card");
    let indice = 0;

    while (indice < tarjetas.length) {
        aplicarEfectoMouse(tarjetas[indice]);
        indice = indice + 1;
    }
}

/**
 * Cambia estilos al pasar el mouse (criterio 2: mouseover).
 * Flujo: guarda el borde original, lo cambia al entrar
 * y lo restaura al salir. No usa solo CSS :hover.
 */
function aplicarEfectoMouse(tarjeta) {
    if (!tarjeta) {
        return;
    }

    const bordeOriginal = tarjeta.style.borderColor;

    tarjeta.addEventListener("mouseover", function () {
        tarjeta.style.borderColor = "#ff7a18";
        tarjeta.style.boxShadow = "0 0 16px rgba(255, 122, 24, 0.55)";
        tarjeta.style.transform = "scale(1.03)";
    });

    tarjeta.addEventListener("mouseout", function () {
        tarjeta.style.borderColor = bordeOriginal;
        tarjeta.style.boxShadow = "";
        tarjeta.style.transform = "";
    });
}

/**
 * Evento click del catálogo en Productos.
 * Flujo: si existe el botón, al hacer clic llama a Fetch.
 */
function configurarCatalogo() {
    const botonCatalogo = document.getElementById("btn-cargar-catalogo");

    if (!botonCatalogo) {
        return;
    }

    botonCatalogo.addEventListener("click", cargarProductos);
}

/**
 * Fetch API + promesas (criterio 3).
 * Flujo: pide datos a Fake Store, convierte la respuesta
 * a JSON, pinta las cards y captura errores con catch.
 */
function cargarProductos() {
    const estado = document.getElementById("estado-catalogo");
    const catalogo = document.getElementById("catalogo-api");

    if (estado) {
        estado.innerHTML = "Cargando productos desde la API pública...";
        estado.className = "mt-3 mb-0 aviso-dinamico";
    }

    if (catalogo) {
        limpiarContenedor(catalogo);
    }

    fetch(URL_CATALOGO)
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error("No se pudo cargar el catálogo (código " + respuesta.status + ").");
            }
            return respuesta.json();
        })
        .then(function (productos) {
            mostrarProductos(productos);
        })
        .catch(function (error) {
            mostrarErrorCatalogo(error.message);
        });
}

/**
 * Recorre el arreglo de la API y agrega cada card al DOM.
 * Flujo: valida el arreglo y llama a crearTarjetaProducto
 * para no repetir código de creación.
 */
function mostrarProductos(productos) {
    const catalogo = document.getElementById("catalogo-api");
    const estado = document.getElementById("estado-catalogo");

    if (!catalogo) {
        return;
    }

    if (!Array.isArray(productos) || productos.length === 0) {
        mostrarErrorCatalogo("La API no devolvió productos.");
        return;
    }

    limpiarContenedor(catalogo);

    let indice = 0;
    while (indice < productos.length) {
        const tarjeta = crearTarjetaProducto(productos[indice]);
        catalogo.appendChild(tarjeta);
        indice = indice + 1;
    }

    if (estado) {
        estado.innerHTML = "Catálogo cargado: " + productos.length + " productos creados con createElement y appendChild.";
        estado.className = "mt-3 mb-0 aviso-dinamico aviso-exito";
    }
}

/**
 * Crea una tarjeta de producto (mismo patrón de index5).
 * Flujo: createElement de columna, article, imagen y textos;
 * luego appendChild de cada parte y mouseover en la card.
 */
function crearTarjetaProducto(producto) {
    const columna = document.createElement("div");
    columna.className = "col";

    const articulo = document.createElement("article");
    articulo.className = "card h-100 kivo-card";

    const imagen = document.createElement("img");
    imagen.className = "card-img-top";
    imagen.src = producto.image;
    imagen.alt = producto.title;

    const cuerpo = document.createElement("div");
    cuerpo.className = "card-body d-flex flex-column";

    const titulo = document.createElement("h3");
    titulo.className = "card-title h5";
    titulo.innerHTML = producto.title;

    const precio = document.createElement("p");
    precio.className = "card-text";
    precio.innerHTML = "Precio: USD " + producto.price;

    const categoria = document.createElement("p");
    categoria.className = "card-text flex-grow-1";
    categoria.innerHTML = "Categoría: " + producto.category;

    cuerpo.appendChild(titulo);
    cuerpo.appendChild(precio);
    cuerpo.appendChild(categoria);
    articulo.appendChild(imagen);
    articulo.appendChild(cuerpo);
    columna.appendChild(articulo);

    aplicarEfectoMouse(articulo);

    return columna;
}

/**
 * Manejo de error de Fetch (promesa rechazada).
 * Flujo: muestra el motivo en la página, no solo en consola.
 */
function mostrarErrorCatalogo(mensaje) {
    const estado = document.getElementById("estado-catalogo");

    if (!estado) {
        return;
    }

    estado.innerHTML = "Error al cargar el catálogo: " + mensaje;
    estado.className = "mt-3 mb-0 aviso-dinamico aviso-error";
}

/**
 * Evento submit del formulario de Contacto.
 * Flujo: si existe el form, escucha submit y evita
 * que la página se recargue (preventDefault de la guía).
 */
function configurarFormulario() {
    const formulario = document.getElementById("formulario-contacto");

    if (!formulario) {
        return;
    }

    formulario.addEventListener("submit", validarFormulario);
}

/**
 * Valida el formulario (criterio 2: submit + truthy/falsy).
 * Flujo: lee los campos, si alguno está vacío muestra error;
 * si todo está correcto crea un mensaje de éxito en el DOM.
 */
function validarFormulario(evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const mensaje = document.getElementById("mensaje");
    const novedadesSi = document.getElementById("novedades-si");
    const novedadesNo = document.getElementById("novedades-no");

    const valorNombre = nombre ? nombre.value.trim() : "";
    const valorEmail = email ? email.value.trim() : "";
    const valorMensaje = mensaje ? mensaje.value.trim() : "";
    const eligioNovedades = (novedadesSi && novedadesSi.checked) || (novedadesNo && novedadesNo.checked);

    if (!valorNombre) {
        mostrarMensajeFormulario("Escribe tu nombre para enviar el mensaje.", true);
        return;
    }

    if (!valorEmail || valorEmail.indexOf("@") === -1) {
        mostrarMensajeFormulario("Ingresa un correo electrónico válido.", true);
        return;
    }

    if (!eligioNovedades) {
        mostrarMensajeFormulario("Indica si deseas recibir novedades.", true);
        return;
    }

    if (!valorMensaje) {
        mostrarMensajeFormulario("El mensaje no puede quedar vacío.", true);
        return;
    }

    const textoExito = "Gracias, " + valorNombre + ". Recibimos tu mensaje y te responderemos a " + valorEmail + ".";
    mostrarMensajeFormulario(textoExito, false);
    evento.target.reset();
}

/**
 * Crea el aviso del formulario con createElement y appendChild.
 * Flujo: limpia el contenedor y agrega un párrafo de éxito o error.
 */
function mostrarMensajeFormulario(texto, esError) {
    const resultado = document.getElementById("resultado-envio");

    if (!resultado) {
        return;
    }

    limpiarContenedor(resultado);

    const aviso = document.createElement("p");
    aviso.className = esError ? "aviso-dinamico aviso-error mb-0" : "aviso-dinamico aviso-exito mb-0";
    aviso.innerHTML = texto;
    resultado.appendChild(aviso);
}

/**
 * Quita todos los hijos de un elemento.
 * Flujo: se reutiliza al limpiar avisos y el catálogo
 * antes de volver a pintar el DOM.
 */
function limpiarContenedor(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

document.addEventListener("DOMContentLoaded", iniciarSitio);
