const d = document,
  $vista = d.getElementById("vista"),
  $input = d.getElementById("input"),
  $guardar = d.getElementById("guardar"),
  converter = new showdown.Converter(),
  $ai = d.querySelector(".ai"),
  $notificaciones = d.querySelector(".notificacion"),
  $loaderEditor = d.getElementById("editor-md-loader"),
  $loader = d.getElementById("loader");
let interval;

//Convierte el codigo markdown a HTML y lo inserta en el elemento vista
function mdHtml(codigoMd) {
  let html = converter.makeHtml(codigoMd);
  $vista.innerHTML = html;
}
//Inserta el codigo markdown en input
function mdInner(codigoMd) {
  $input.value = codigoMd;
}
//al parámetro *elementoHtml* inserta una animación de error
function accionInvalida(elementoHtml) {
  elementoHtml.classList.add("error");
  setTimeout(() => {
    elementoHtml.classList.remove("error");
  }, 600);
}
// guarda en el localStorage el codigo markdown
function guardarMd(codigoMd) {
  if (codigoMd === localStorage.getItem("codeMd")) {
    accionInvalida($guardar);
    return;
  }
  localStorage.setItem("codeMd", codigoMd);
}
//elimina el codigo markdown del editor como de el localStorage
function eliminar() {
  localStorage.setItem("codeMd", "");
}
function notificar(notificacion) {
  $notificaciones.innerHTML = `
  <div class="contenido-notificacion">
    <p>${notificacion}</p>
  </div>`;

  interval = setInterval(() => {
    $notificaciones.innerHTML = "";
  }, 6000);
}
//copia el codigo markdown en el portapapeles
async function copiarCodigo(codigo) {
  clearInterval(interval);
  navigator.clipboard
    .writeText(codigo)
    .then(() => {
      notificar("Copied");
    })
    .catch(() => {
      console.log("codigo copiado incorrectamente intenta de nuevo");
    });
}

//copia el codigo html en el portapapeles
async function copiarCodigoHtml() {
  let codigoHtml = $vista.innerHTML;
  clearInterval(interval);
  navigator.clipboard
    .writeText(codigoHtml)
    .then(() => {
      notificar("Copied");
    })
    .catch(() => {
      console.error("codigo copiado incorrectamente intenta de nuevo");
    });
}
//activa el btn de guardado y llama a la función mdHtml
$input.addEventListener("keyup", (e) => {
  $ai.classList.add("ai-active");
  $guardar.classList.remove("deshabilitado");
  mdHtml($input.value);
});
//crea y imprime las variables en el localStorage
d.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("codeMd")) {
    localStorage.setItem("codeMd", "");
    mdHtml($input.value);
  } else {
    let mdLocal = localStorage.getItem("codeMd");
    mdInner(mdLocal);
    mdHtml(mdLocal);
  }
});
d.addEventListener("click", (e) => {
  //btn save change
  if (e.target.matches(".guardar")) {
    $guardar.classList.add("deshabilitado");
    $ai.classList.remove("ai-active");
    guardarMd($input.value);
  }
  //img portales
  if (e.target.matches("#borrar")) {
    eliminar();
    mdHtml("");
    mdInner("");
    $ai.classList.remove("ai-active");
  }
  if (e.target.matches(".copiar")) {
    copiarCodigo($input.value);
  }
  if (e.target.matches(".copiar-html")) {
    copiarCodigoHtml();
  }
});

window.addEventListener("beforeunload", (e) => {
  e.preventDefault;
  guardarMd($input.value);
});
