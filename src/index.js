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
    
    const p = document.createElement('p'); //crear elemento p para el texto de tarea
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

};
const itsTime = async () => {
    try {
        let datos = await fetchtarea("http://localhost:3000/api/todo");
        console.log(datos);
        contenedortareas.innerHTML = ''; // Limpiar el contenedor de tareas antes de agregar las nuevas
        contadorCompletadas = 0; // Reiniciar el contador de tareas completadas
        if (datos.length === 0) {
            mostrarMensajeNoTareas(); //mensaje si no hay tareas
            return;
        }
        datos.forEach(dato => {
            const tareaItem = crearTareaItem(dato); //hace un elemento dom a cada tarea
            if (dato.completed) {
                tareaItem.querySelector('input[type="checkbox"]').checked;
                tareaItem.classList.add('completed');
                contadorCompletadas++;
            }
            contenedortareas.appendChild(tareaItem); //agrega las tareas al contenedor
        });
        actualizarContadorCompletadas();
    } catch (error) {
        console.error("Error al obtener los datos", error);
    }
    cargarTareas()
};


//aqui se contara y actualiza cada tarea que haya sido terminada
const actualizarContadorCompletadas = () => {
    numeroTareas.textContent = contadorCompletadas;
 if (contenedortareas.children.length === 0) 
    { mostrarMensajeNoTareas(); 

 } else { ocultarMensajeNoTareas(); } };

 //carga las tareas desde el server y muestra en la pagina
const cargarTareas = async () => {
    try {
        let datos = await fetchtarea("http://localhost:3000/api/todo");
        contenedortareas.innerHTML = ''; // Limpiar el contenedor de tareas antes de agregar las nuevas
        contadorCompletadas = 0; // Reiniciar el contador de tareas completadas
        
        if (datos.length === 0) {
            mostrarMensajeNoTareas();
            return;
        }
        datos.forEach(dato => {
            const tareaItem = crearTareaItem(dato); //hace elemento dom a cada tarea
            if (dato.completed) {
                tareaItem.querySelector('input[type="checkbox"]').checked = true;
                tareaItem.classList.add('completed');
                contadorCompletadas++;
            }
            contenedortareas.appendChild(tareaItem);
            
        });
        actualizarContadorCompletadas();
        if (contenedortareas.children.length === 0) {
            mostrarMensajeNoTareas();
        } else {
            ocultarMensajeNoTareas();
        }
    } catch (error) {
        console.error('Error al obtener los datos', error);
    }
};
// funcion elimina tareas que ya estan completadas
const eliminarTareasCompletadas = async () => {
    const tareasCompletadas = document.querySelectorAll('.completed'); //obtiene las tareas terminadas
    for (const tarea of tareasCompletadas) {
        const id = tarea.dataset.id;
        await borrarTareas("http://localhost:3000/api/todo", id); 
        tarea.remove();
    }
    if (contenedortareas.children.length === 0) {
        mostrarMensajeNoTareas();
    }
 
};

//mostrara el mensaje de "no existen tareas"
const mostrarMensajeNoTareas = () => {
    const mensajeNoTareas = document.createElement('p');
    mensajeNoTareas.id = 'mensajeNoTareas';
    mensajeNoTareas.textContent = 'No existen tareas';
    contenedortareas.appendChild(mensajeNoTareas); //pondra el mensaje en el contenedor
};

//funcion para ocultar el mensaje
const ocultarMensajeNoTareas = () => {
    const mensajeNoTareas = document.getElementById('mensajeNoTareas');
    if (mensajeNoTareas) {
        mensajeNoTareas.remove(); //quitara el mensaje de la pagina
    }
};

botonTarea.addEventListener('click', agregarTarea);
inputTarea.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') { //agrega tarea cuando con presionar enter
        agregarTarea();
    }
});
botonEliminarCompletadas.addEventListener('click', eliminarTareasCompletadas); //evento eliminar tareas terminadas
itsTime();
mostrarMensajeNoTareas();


