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

    const url = `https://www.omdbapi.com/?apikey=9fe0718d&s=${peliABuscar}&type=${tipoSeleccionado}`;

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

    const url = `https://www.omdbapi.com/?apikey=9fe0718d&s=${peliABuscar}&type=${tipoSeleccionado}&page=${++cargaPaginas}`;

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
    fetch(`https://www.omdbapi.com/?apikey=9fe0718d&i=${imdbID}`, { method: "GET" })
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

