window.onload = () => {
    const cajaTexto = document.getElementById("cajaTexto");
    const categoryButtons = document.querySelectorAll(".category-btn");

    cajaTexto.addEventListener("input", () => {
        if (cajaTexto.value.length >= 3) {
            peticionAJAXmoderna();
        }
    });

    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelector(".category-btn.selected").classList.remove("selected");
            button.classList.add("selected");
            peticionAJAXmoderna();
        });
    });

    window.addEventListener("scroll", () => {
        if (!peticion) autoScroll();
    });
};

let peliABuscar = "";
let cargaPaginas = 1;
let peticion = false;
const imagenPorDefecto = './logoPelis.png';
let peliculasGuardadas = [];

function mostrarSpinner() {
    document.getElementById("loadingSpinner").style.display = "block";
}

function ocultarSpinner() {
    document.getElementById("loadingSpinner").style.display = "none";
}

function peticionAJAXmoderna() {
    const cajaTexto = document.getElementById("cajaTexto");
    const tipoSeleccionado = document.querySelector(".category-btn.selected").getAttribute("data-type");

    peliABuscar = cajaTexto.value.trim();
    if (!peliABuscar) return;

    cargaPaginas = 1;
    peticion = true;
    mostrarSpinner();

    const url = `http://www.omdbapi.com/?apikey=9fe0718d&s=${peliABuscar}&type=${tipoSeleccionado}`;

    fetch(url, { method: "GET" })
        .then((res) => res.json())
        .then((datosRecibidos) => {
            ocultarSpinner();
            document.getElementById("numeroDeResultados").innerHTML =
                ` ${datosRecibidos.totalResults || 0} results have been found.`;

            const milista = document.getElementById("lista");
            milista.innerHTML = "";
            const ul = document.createElement("ul");
            milista.appendChild(ul);

            peliculasGuardadas = []; // Limpiar la lista de IDs

            datosRecibidos.Search?.forEach((pelicula) => {
                const li = document.createElement("li");
                ul.appendChild(li);

                const img = document.createElement("img");

                if (pelicula.Poster !== "N/A" && pelicula.Poster !== "") {
                    img.src = pelicula.Poster;
                } else {
                    img.src = imagenPorDefecto;
                }

                img.alt = pelicula.Title;
                img.style.cursor = "pointer";

                img.addEventListener("click", () => mostrarDetalles(pelicula.imdbID));
                li.appendChild(img);

                // Guardar el ID de la película cargada
                peliculasGuardadas.push(pelicula.imdbID);
            });
            peticion = false;
        })
        .catch((err) => {
            ocultarSpinner();
            console.log("Error: " + err);
        });
}

function cargaPelis() {
    const tipoSeleccionado = document.querySelector(".category-btn.selected").getAttribute("data-type");

    const url = `http://www.omdbapi.com/?apikey=9fe0718d&s=${peliABuscar}&type=${tipoSeleccionado}&page=${++cargaPaginas}`;

    mostrarSpinner();

    fetch(url, { method: "GET" })
        .then((res) => res.json())
        .then((datosRecibidos) => {
            ocultarSpinner();
            const milista = document.getElementById("lista");
            const ul = document.createElement("ul");
            milista.appendChild(ul);

            datosRecibidos.Search?.forEach((pelicula) => {
                const li = document.createElement("li");
                ul.appendChild(li);

                const img = document.createElement("img");

                if (pelicula.Poster !== "N/A" && pelicula.Poster !== "") {
                    img.src = pelicula.Poster;
                } else {
                    img.src = imagenPorDefecto;
                }

                img.alt = pelicula.Title;

                img.addEventListener("click", () => mostrarDetalles(pelicula.imdbID));
                li.appendChild(img);
            });
            peticion = false;
        })
        .catch((err) => {
            ocultarSpinner();
            console.log("Error: " + err);
        });
}

function mostrarDetalles(imdbID) {
    fetch(`http://www.omdbapi.com/?apikey=9fe0718d&i=${imdbID}`, { method: "GET" })
        .then((res) => res.json())
        .then((pelicula) => {
            const modal = document.getElementById("info");
            modal.innerHTML = "";
            const cerrarBtn = document.createElement("button");
            cerrarBtn.textContent = "Cerrar";
            cerrarBtn.id = "cerrarModal";

            const titulo = document.createElement("h2");
            titulo.textContent = pelicula.Title;

            const Año = document.createElement("p");
            Año.innerHTML = `<strong>Año:</strong> ${pelicula.Year}`;

            const director = document.createElement("p");
            director.innerHTML = `<strong>Director:</strong> ${pelicula.Director}`;

            const actores = document.createElement("p");
            actores.innerHTML = `<strong>Actores:</strong> ${pelicula.Actors}`;

            const genero = document.createElement("p");
            genero.innerHTML = `<strong>Género:</strong> ${pelicula.Genre}`;

            const sinopsis = document.createElement("p");
            sinopsis.innerHTML = `<strong>Sinopsis:</strong> ${pelicula.Plot}`;

            const duracion = document.createElement("p");
            duracion.innerHTML = `<strong>Duración:</strong> ${pelicula.Runtime}`;

            const idioma = document.createElement("p");
            idioma.innerHTML = `<strong>Idioma:</strong> ${pelicula.Language}`;

            const clasificacion = document.createElement("p");
            clasificacion.innerHTML = `<strong>Clasificación:</strong> ${pelicula.Rated}`;

            const premios = document.createElement("p");
            premios.innerHTML = `<strong>Premios:</strong> ${pelicula.Awards}`;

            const imagen = document.createElement("img");
            if (pelicula.Poster !== "N/A" && pelicula.Poster !== "") {
                imagen.src = pelicula.Poster;
            } else {
                imagen.src = "logoPelis.png";
            }
            imagen.alt = pelicula.Title;

            cerrarBtn.addEventListener("click", () => {
                modal.style.display = "none";
            });

            modal.appendChild(titulo);
            modal.appendChild(Año);
            modal.appendChild(director);
            modal.appendChild(actores);
            modal.appendChild(genero);
            modal.appendChild(sinopsis);
            modal.appendChild(duracion);
            modal.appendChild(idioma);
            modal.appendChild(clasificacion);
            modal.appendChild(premios);
            modal.appendChild(imagen);
            modal.appendChild(cerrarBtn);

            modal.style.display = "block";
        })
        .catch((err) => console.log("Error: " + err));
}

function autoScroll() {
    const ventana = window.innerHeight;
    const documento = document.body.offsetHeight;
    const scrollPos = window.pageYOffset;
    const umbralPrecarga = 1000;

    if (ventana + scrollPos >= documento - umbralPrecarga && !peticion) {
        peticion = true;
        cargaPelis();
    }
}

function crearBotonInforme(peliculas, ordenacion, modoordenacion) {
    if (document.getElementById("crearInformeBtn")) {
        return;
    }

    var btn = document.createElement("button");
    btn.id = "crearInformeBtn";
    btn.className = "filter-btn";
    btn.innerText = "Crear Informe";

    btn.addEventListener("click", function() {
        generarInforme(peliculas, ordenacion, modoordenacion);
        btn.parentNode.removeChild(btn);
    });

    var filterList = document.querySelector(".filter-list");
    var li = document.createElement("li");
    li.appendChild(btn);
    filterList.appendChild(li);
}

function generarInforme(peliculas, ordenacion, modoordenacion) {
    // Resto del código que me pasaste para el informe
}
function generarInforme(peliculas, ordenacion, modoordenacion) {
    const informeDiv = document.getElementById("informe");

    // Limpiar contenido anterior del informe
    informeDiv.innerHTML = "";

    // Ordenar las películas si es necesario
    if (ordenacion && modoordenacion) {
        peliculas.sort((a, b) => {
            if (modoordenacion === "asc") {
                return a[ordenacion] > b[ordenacion] ? 1 : -1;
            } else {
                return a[ordenacion] < b[ordenacion] ? 1 : -1;
            }
        });
    }

    // Crear contenido del informe
    peliculas.forEach((pelicula) => {
        const peliculaDiv = document.createElement("div");
        peliculaDiv.className = "informe-item";

        const titulo = document.createElement("h3");
        titulo.innerText = pelicula.Title;

        const año = document.createElement("p");
        año.innerHTML = `<strong>Año:</strong> ${pelicula.Year}`;

        const tipo = document.createElement("p");
        tipo.innerHTML = `<strong>Tipo:</strong> ${pelicula.Type}`;

        const poster = document.createElement("img");
        poster.src = pelicula.Poster !== "N/A" ? pelicula.Poster : imagenPorDefecto;
        poster.alt = pelicula.Title;

        peliculaDiv.appendChild(titulo);
        peliculaDiv.appendChild(año);
        peliculaDiv.appendChild(tipo);
        peliculaDiv.appendChild(poster);

        informeDiv.appendChild(peliculaDiv);
    });

    // Mostrar el informe
    informeDiv.style.display = "block";
}

// Función para manejar el cambio de categorías
function cambiarCategoria(tipo) {
    document.querySelectorAll(".category-btn").forEach((button) => {
        button.classList.remove("selected");
        if (button.getAttribute("data-type") === tipo) {
            button.classList.add("selected");
        }
    });

    peticionAJAXmoderna();
}

// Función para gestionar errores
function mostrarError(mensaje) {
    const errorDiv = document.getElementById("error");
    errorDiv.innerText = mensaje;
    errorDiv.style.display = "block";

    setTimeout(() => {
        errorDiv.style.display = "none";
    }, 3000);
}

// Estilo dinámico del botón "Crear Informe"
function estilizarBotonInforme() {
    const botonInforme = document.getElementById("crearInformeBtn");
    if (botonInforme) {
        botonInforme.style.backgroundColor = "#4CAF50";
        botonInforme.style.color = "#fff";
        botonInforme.style.border = "none";
        botonInforme.style.padding = "10px 20px";
        botonInforme.style.cursor = "pointer";
        botonInforme.addEventListener("mouseover", () => {
            botonInforme.style.backgroundColor = "#45a049";
        });
        botonInforme.addEventListener("mouseout", () => {
            botonInforme.style.backgroundColor = "#4CAF50";
        });
    }
}

// Función para manejar la inicialización de filtros dinámicos
function inicializarFiltros() {
    const filtros = document.querySelectorAll(".filter-btn");
    filtros.forEach((filtro) => {
        filtro.addEventListener("click", () => {
            const peliculasFiltradas = peliculasGuardadas.filter((pelicula) => {
                return pelicula.Type === filtro.getAttribute("data-filter");
            });

            generarInforme(peliculasFiltradas);
        });
    });
}

// Función para manejar errores globales de la aplicación
window.addEventListener("error", (event) => {
    console.error("Error detectado:", event.message);
    mostrarError("Ocurrió un error. Por favor, inténtalo de nuevo.");
});
