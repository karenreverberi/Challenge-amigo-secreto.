let amigos = [];


function agregarAmigo() {
    const campoAmigo = document.getElementById('amigo');
    const nombreAmigo = campoAmigo.value.trim();
    
    // Validar la entrada
    if (nombreAmigo === '') {
        Alertas.campoVacio();
        return;
    }
    
    // Validar duplicados
    const existe = amigos.some(amigo => amigo.toLowerCase() === nombreAmigo.toLowerCase());
    if (existe) {
        Alertas.nombreDuplicado(nombreAmigo);
        campoAmigo.value = '';
        campoAmigo.focus();
        return;
    }
    
    amigos.push(nombreAmigo);
    campoAmigo.value = '';
    campoAmigo.focus();
    
    mostrarAmigos();
    actualizarBotonSortear();
    
}


function mostrarAmigos() {
    // Obtener el elemento de la lista
    const lista = document.getElementById('listaAmigos');
    
    lista.innerHTML = '';
    
    for (let i = 0; i < amigos.length; i++) {
     
        const elementoLi = document.createElement('li');
        elementoLi.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #ddd;';
        

        const spanNombre = document.createElement('span');
        spanNombre.textContent = `${i + 1}. ${amigos[i]}`;
        
        // Crear botón para eliminar
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.style.cssText = 'padding: 4px 8px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;';
        
        botonEliminar.addEventListener('click', () => eliminarAmigo(i));
        
        elementoLi.appendChild(spanNombre);
        elementoLi.appendChild(botonEliminar);
        
        // Agregar el elemento a la lista
        lista.appendChild(elementoLi);
    }
}

function eliminarAmigo(indice) {
    const nombreAmigo = amigos[indice];
    
    Alertas.confirmarEliminarAmigo(nombreAmigo).then((result) => {
        if (result.isConfirmed) {
            amigos.splice(indice, 1);
            
            // Actualizar
            mostrarAmigos();
            actualizarBotonSortear();
        
            limpiarResultado();
            
            // alerta
            Alertas.amigoEliminado(nombreAmigo);
        }
    });
}

function actualizarBotonSortear() {
    const botonSortear = document.querySelector('.button-draw');
    if (botonSortear) {
        if (amigos.length === 0) {
            botonSortear.disabled = true;
            botonSortear.style.opacity = '0.5';
            botonSortear.style.cursor = 'not-allowed';
        } else {
            botonSortear.disabled = false;
            botonSortear.style.opacity = '1';
            botonSortear.style.cursor = 'pointer';
        }
    }
}

// Función para limpiar el resultado
function limpiarResultado() {
    const elementoResultado = document.getElementById('resultado');
    elementoResultado.innerHTML = '';
}

// Función para sortear amigo 
function sortearAmigo() {
    // Validar que haya amigos disponibles
    if (amigos.length === 0) {
        Alertas.listaVaciaSortear();
        return;
    }

    const indiceAleatorio = Math.floor(Math.random() * amigos.length);
    
    const amigoSorteado = amigos[indiceAleatorio];
    
    // Mostrar el resultado
    const elementoResultado = document.getElementById('resultado');
    elementoResultado.innerHTML = `<li>🎉 El amigo secreto es: <strong>${amigoSorteado}</strong> 🎉</li>`;
    
    // Mostrar resultado con alerta
    Alertas.amigoSorteado(amigoSorteado);
}

// Función para verificar si hay contenido para reiniciar
function hayContenidoParaReiniciar() {
    const elementoResultado = document.getElementById('resultado');
    return amigos.length > 0 || elementoResultado.innerHTML !== '';
}

// Función para reiniciar el juego
function reiniciarJuego() {
    // Verifica
    if (!hayContenidoParaReiniciar()) {
        Alertas.nadaQueReiniciar();
        return;
    }
    
    Alertas.confirmarReinicio().then((result) => {
        if (result.isConfirmed) {
            amigos = [];
            
            mostrarAmigos();
            limpiarResultado();
            
            // Limpiar el campo de entrada
            const campoAmigo = document.getElementById('amigo');
            campoAmigo.value = '';
            campoAmigo.focus();
            
            // Actualizar estado del botón sortear
            actualizarBotonSortear();
            
            // Mostrar confirmación
            Alertas.reinicioExitoso();
        }
    });
}

// Función para configurar eventos del DOM
function configurarEventos() {
    // Event listener para el botón de reiniciar
    const botonReset = document.getElementById('btn-reset');
    if (botonReset) {
        botonReset.addEventListener('click', reiniciarJuego);
    }
    
    // Event listener para presionar Enter
    const campoAmigo = document.getElementById('amigo');
    if (campoAmigo) {
        campoAmigo.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                agregarAmigo();
            }
        });
        campoAmigo.focus();
    }
}

// Función para inicializar
function inicializar() {
    configurarEventos();
    actualizarBotonSortear();
}
document.addEventListener('DOMContentLoaded', inicializar);
