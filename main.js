import { graficaChisteo, rankingChistes } from "./charts.js";

function cambiarColor(color) {
    if (color == localStorage.getItem("color")) return;
    document.body.removeAttribute("class");

    if (color != undefined) document.body.classList.add(color);
    localStorage.setItem("color", color);

    graficas.forEach((grafica) => {
        const datos = grafica.data.datasets;
        if (datos.length === 2) {
            datos[0].borderColor = getComputedStyle(document.body).getPropertyValue("--md-sys-color-primary");
            datos[1].borderColor = getComputedStyle(document.body).getPropertyValue("--md-sys-color-inverse-primary");
        } else {
            datos[0].backgroundColor = getComputedStyle(document.body).getPropertyValue("--md-sys-color-primary");
        }
        grafica.update();
    });
}

function chistesRecientes(datos, numeroChistes) {
    const contenedorChistes = document.querySelector(".contenedor-chistes");

    datos.slice(-numeroChistes).forEach((dato) => {
        const tarjeta = document.createElement("article");
        const autor = document.createElement("p");

        const contenido = document.createElement(dato.tipo);
        if (dato.tipo == "p") {
            contenido.innerHTML = dato.chiste;
        } else if (dato.tipo == "img") {
            contenido.src = "img/" + dato.chiste;
            contenido.alt = "Chiste";
            contenido.loading = "lazy";
        } else if (dato.tipo == "video") {
            contenido.src = "video/" + dato.chiste;
            contenido.controls = true;
        } else if (dato.tipo == "audio") {
            contenido.src = "audio/" + dato.chiste;
            contenido.controls = true;
        }

        autor.textContent = dato.autor;
        tarjeta.append(contenido, autor);
        contenedorChistes.prepend(tarjeta);
    });
}

async function datosChistes() {
    const respuesta = await fetch("data/chistes.json");
    const datos = await respuesta.json();

    chistesRecientes(datos, 10);
    graficas.push(rankingChistes(datos, 5));
}

// Frase célebre
const frases = [
    "Pienso, luego chisteo.",
    "Solo hay dos cosas infinitas: el universo y el chisteo. Y no estoy tan seguro de la primera.",
    "Detesto a la gente que lleva camisetas del Che sin haber escuchado nunca un disco suyo.",
    "Mirar una ventana es como mirar una pared, pero en vez de una pared es una ventana.",
    "Halcón lego.",
    "Existe un relación clara entre la topología algebraica y el código penal.",
    "Al final tuve que aceptar el resultado, al igual que las sentencias judiciales, ¿qué remedio?",
    "Me encantan las jeringas 💉👍",
];

const cita = document.querySelector("blockquote");
cita.textContent = frases[Math.floor(Math.random() * frases.length)];

// Diálogo
const botonTemas = document.querySelector("#temas");
const dialogo = document.querySelector("dialog");
const botonCerrar = document.querySelector("#cerrar");

botonTemas.addEventListener("click", () => {
    dialogo.showModal();
});

botonCerrar.addEventListener("click", () => {
    dialogo.close();
});

// Temas
const botonesColor = document.querySelectorAll(".color");
botonesColor.forEach((boton) => {
    boton.addEventListener("click", () => {
        if (boton.id === "verde") cambiarColor(undefined);
        else cambiarColor(boton.id);
    });
});

// Gráficas
const datosGraficas = [
    { archivo: "data/chisteo-inferido.json", elemento: "grafica-inferida" },
    { archivo: "data/chisteo-ampliado.json", elemento: "grafica-ampliada" },
    { archivo: "data/chisteo-multivariante.json", elemento: "grafica-multivariante" },
];

const graficas = [];
datosGraficas.forEach((dato) => {
    graficaChisteo(dato.archivo, dato.elemento).then((grafica) => {
        graficas.push(grafica);
    });
});

// Chistes
datosChistes();