import { fetchtarea } from "./indexdos.js";
import { guardarPost } from "./indextres.js";
import { borrarTareas } from "./indexcuatro.js"; 
import { actualizarTarea } from "./indexcinco.js";
const apiUrl = "http://localhost:3000/api/todo"; //variable con la url de la api


let inputTarea = document.getElementById("inputTarea");
let botonTarea = document.getElementById("botonTarea");
let contenedortareas = document.getElementById("contenedortareas");
let numeroTareas = document.getElementById("numerotareas");
let botonEliminarCompletadas = document.getElementById("botonEliminarCompletadas"); //para eliminar las tareas completadas
let contadorCompletadas = 0;

const agregarTarea = async () => { //agrega una nueva tarea 
    const textoTarea = inputTarea.value.trim();
    if (textoTarea === '') {
        alert('Ingrese un texto'); //si presiono el boton y no hay una tarea entonces mostrará una alerta
        return;
    }

    //guardará las nuevas tareas en el server
    const nuevaTarea = await guardarPost("http://localhost:3000/api/todo", textoTarea);
    if (nuevaTarea) {
        const tareaItem = crearTareaItem(nuevaTarea);
        contenedortareas.appendChild(tareaItem); //agregara nueva tarea a contenedortareas
        inputTarea.value = '';
        if (contenedortareas.children.length === 1) {
            ocultarMensajeNoTareas();
        }
    }
    
};

//funcion para crear un elemento a las tareas
const crearTareaItem = (tarea) => {
    const tareaItem = document.createElement('div'); //contenedor para tarea
    tareaItem.classList.add('tareaitem');
    tareaItem.dataset.id = tarea.id; //guardar el id de la tarea
    const selectCheckbox = document.createElement('input');
    selectCheckbox.type = 'checkbox'; //checkbox para marcar cuando una tarea esta terminada
    selectCheckbox.addEventListener('change', async () => {
        const completed = selectCheckbox.checked;
        await actualizarTarea("http://localhost:3000/api/todo", tareaItem.dataset.id, completed);
        if (completed) {
            tareaItem.classList.add('completed'); //marcara la tarea como completada
            contadorCompletadas++;
            console.log(`Tarea completada: ${tareaItem.dataset.id}`); //mostrara la tarea y el id
        } else {
            tareaItem.classList.remove('completed');
            contadorCompletadas--; //para quitar la tarea como completada
        }
        actualizarContadorCompletadas();
    });
    
    const p = document.createElement('p'); //crear elemento p para el texto de la tarea
    p.textContent = tarea.task;
    p.id = tarea.id;
    const botonEliminar = document.createElement('button'); //boton para eliminar cada tarea
    botonEliminar.innerText = '🗑️';
    botonEliminar.classList.add('botoneliminar');
    botonEliminar.addEventListener('click', async () => {
        await borrarTareas("http://localhost:3000/api/todo", tareaItem.dataset.id); //elimina la tarea del server
        tareaItem.remove(); //elimina la tarea de la pagina
        if (contenedortareas.children.length === 0) {
            mostrarMensajeNoTareas();
        } 
    
    });

    tareaItem.append(selectCheckbox, p, botonEliminar); //agrega checkbox, la tarea y el boton de eliminar
    return tareaItem;

}


