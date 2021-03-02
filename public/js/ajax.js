window.onload = function() {
    read()
    modal = document.getElementById("addImage")
}

function objetoAjax() {
    var xmlhttp = false;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}


/* Muestra todos los registros de la base de datos (sin filtrar y filtrados) */
function read() {
    divResultado = document.getElementById('section-3');
    pokemon = document.getElementById('searchPokemon').value;
    var token = document.getElementById('token').getAttribute("content");
    var formData = new FormData();
    formData.append('_token', token);

    var ajax = objetoAjax();
    ajax.open("POST", "readRoute", true);
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            var respuesta = JSON.parse(this.responseText);

            var tabla = ''
            for (var i = 0; i < respuesta.length; i++) {
                tabla += '<div class="column-5">'
                if (respuesta[i].imagen != null) {
                    tabla += '<img src="data:image/png;base64,' + respuesta[i].imagen + '" alt="error">'
                    tabla += '<div>'

                    tabla += '<img src="images/catched.png" alt="error">'
                    if (respuesta[i].favorito == 1) {
                        tabla += '<a onclick="updateFav(' + respuesta[i].numero_pokedex + ',0)"><img src="images/fav.png" alt="error"></a>'

                    } else {
                        tabla += '<a onclick="updateFav(' + respuesta[i].numero_pokedex + ',1)"><img src="images/fav.png" style="opacity:.3" alt="error"></a>'

                    }
                    tabla += '</div>'

                } else {
                    tabla += '<img src="images/unown.png" style="opacity:.3" alt="error"></img>'
                    tabla += '<div><img src="images/up_image.png" alt="error" style="opacity:.3" onclick="openModal(&#039' + respuesta[i].nombre + '&#039,' + respuesta[i].numero_pokedex + ')"></div>'

                }

                tabla += '<h4>' + respuesta[i].nombre + '</h4>'
                tabla += '<h4>' + respuesta[i].numero_pokedex + '</h4>'
                tabla += '</div>';
            }
            divResultado.innerHTML = tabla;
        }
    }
    if (pokemon != '' || pokemon != null) {
        formData.append('q', pokemon);
    }
    ajax.send(formData)
}

/* Actualiza el campo favorito de un pokemon en la base de datos */
function updateFav(num, fav) {
    divMensaje = document.getElementById('mensaje');
    pokemon = document.getElementById('searchPokemon').value;
    var token = document.getElementById('token').getAttribute("content");
    var formData = new FormData();
    formData.append('favorito', fav);
    formData.append('numero_pokedex', num);
    formData.append('_token', token);
    var ajax = objetoAjax();
    ajax.open("POST", "updateFavRoute", true);
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            var respuesta = JSON.parse(this.responseText);
            if (respuesta.resultado == "OK") {
                if (fav == 1) {
                    divMensaje.innerHTML = "Pokémon #" + num + " agregado a favoritos."
                } else {
                    divMensaje.innerHTML = "Pokémon #" + num + " fuera de favoritos."
                }
            } else {
                console.log(respuesta);
                divMensaje.innerHTML = respuesta.resultado + "Ha habido un problema al actualizar el registro, inténtalo de nuevo más tarde."
            }
            /*Muestra registros de la base de datos*/
            read();
        }
    }
    ajax.send(formData)
}

/* Actualiza el campo imagen de un pokemon en la base de datos */
function addImage() {
    var divMensaje = document.getElementById('mensaje');
    var numero_pokedex = document.getElementById('pokemon_num').value;
    var img = document.getElementById('pokemon_image');
    var token = document.getElementById('token').getAttribute("content");

    var imagen = img.files[0];
    var formData = new FormData();
    formData.append('numero_pokedex', numero_pokedex);
    formData.append('img', imagen);
    formData.append('_token', token);

    var ajax = objetoAjax();
    ajax.open("POST", "updateImageRoute", true);
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            var respuesta = JSON.parse(this.responseText);
            if (respuesta.resultado == "OK") {
                divMensaje.innerHTML = "Pokémon #" + numero_pokedex + " registrado."

            } else {
                /* console.log(respuesta); */
                divMensaje.innerHTML = respuesta.resultado + "Ha habido un problema al actualizar el registro, inténtalo de nuevo más tarde."
            }

            modal.style.display = "none";
            /*Muestra registros de la base de datos*/
            read();
        }
    }
    ajax.send(formData);
}

function openModal(pokemon, num) {
    var msg = document.getElementById("msg")
    modal.style.display = "block";
    msg.innerHTML = 'Sube una imagen de un ' + pokemon + ' para registrarlo.<input id="pokemon_num" type="hidden" value="' + num + '">'
}

function closeModal() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/* Añadir comillas en envío de variables de JS: &#039 */