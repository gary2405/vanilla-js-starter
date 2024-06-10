import { fetchtarea } from "./indexdos.js";
import { guardarPost } from "./indextres.js";
import { borrarTareas } from "./indexcuatro.js"; 
import { actualizarTarea } from "./indexcinco.js";

const apiUrl = "http://localhost:3000/api/todo";
let inputTarea = document.getElementById("inputTarea");
let botonTarea = document.getElementById("botonTarea");
let contenedortareas = document.getElementById("contenedortareas");
const agregarTarea = async () => {
    const textoTarea = inputTarea.value.trim();
    if (textoTarea === '') {
        alert('Ingrese un texto');
        return;
    }
    const nuevaTarea = await guardarPost(apiUrl, textoTarea);
    if (nuevaTarea) {
        const tareaItem = crearTareaItem(nuevaTarea);
        contenedortareas.appendChild(tareaItem);
        inputTarea.value = '';
        if (contenedortareas.children.length === 1) {
            ocultarMensajeNoTareas();
        }
    }
};
const mostrarMensajeNoTareas = () => {
    const mensajeNoTareas = document.createElement('p');
    mensajeNoTareas.id = 'mensajeNoTareas';
    mensajeNoTareas.textContent = 'No existen tareas';
    contenedortareas.appendChild(mensajeNoTareas);
};
const ocultarMensajeNoTareas = () => {
    const mensajeNoTareas = document.getElementById('mensajeNoTareas');
    if (mensajeNoTareas) {
        mensajeNoTareas.remove();
    }
};
botonTarea.addEventListener('click', agregarTarea);
inputTarea.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        agregarTarea();
    }
});


