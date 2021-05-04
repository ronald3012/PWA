"use strict";

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}



// Variables y constantes **************************************************************
const colores = ['#FF6633', '#FF33FF', '#FFFF99', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',];

let contador = 1;

// Etiquetas
const etiquetas = ['clock','home','work','warning'];
const contenedoEtiquetas = document.querySelector('.select-etiquetas');

// Botones
const btnSave = document.querySelector('.btn-save');
const btnCancel = document.querySelector('.btn-cancel');
const btnAdd = document.querySelector('.btn-add');

// Forms
const formTask = document.getElementById('form-task');

// Almacenamiento
let list = [];

// Modal
const modal1 = document.querySelector('.modal');

// Tasks
const listDom = document.querySelector('.list');
  

// agregar selector de colores
const colors = document.querySelector('.colors');

colores.map(c=>{
    let color = document.createElement('div');
    color.classList.add('color');
    color.style.background = c;
    colors.appendChild(color)

    selectedColor(color)
})

// Agregar etiquetas al formulario del modal
etiquetas.map(e=>{
    let eq = document.createElement('div');
    eq.classList.add('eti');
    let img = document.createElement('img');
    img.src = `assets/img/${e}.png`
    eq.appendChild(img);

    // Agregar al dom
    contenedoEtiquetas.appendChild(eq);

    selectedEtiqueta(eq);
})

// Listener para cuando seleccionamos una etiqueta
function selectedEtiqueta(etiqueta){
    etiqueta.addEventListener('click',e=>{

        // Toggle
        if (e.target.style.border !== '2px solid rgb(34, 176, 176)') {
            e.target.style.border = '2px solid rgb(34, 176, 176)';            
        }else{
            e.target.style.border = 'none';            
        }
        etiquetasSelected();
    })
}
// Obtener las etiquetas seleccionadas
function etiquetasSelected(){
    let seleted = [];
    Array.from(document.querySelectorAll('.eti')).map(e=>{
        if (e.children[0].style.border == '2px solid rgb(34, 176, 176)') {
            seleted.push(e.children[0].src);
        }
    })
    // Asignar etiquetas eleccionda al input
    document.querySelector('input[name=etiquetas]').value = seleted;
}


// Listener para cuando seleccionamos un color
function selectedColor(color){

    color.addEventListener('click', e=>{
        eliminarSeleccion();
        e.target.style.border = '2px solid #22b0b0';

        // Agregar color seleccionado al input de color
        document.querySelector('input[name=color]').value = e.target.style.background;

    })
}

function eliminarSeleccion(){
        Array.from(document.querySelectorAll('.color')).map(c=>{
            c.style.border = 'none';
        })
}

// On submit
formTask.addEventListener('submit',e=>{
    e.preventDefault();
    let data = new FormData(formTask);
    if (data.get('color') == '') {
        data.set('color','#22b0b0')
    }
    // Create object
    let obj = {};
    for (const iterator of data.entries()) {
        obj[iterator[0]] = iterator[1]; 
    }
    obj['id'] = contador++;
    obj['completed'] = 0;
    console.log(list);
    // Save task
    list.push(obj);
    console.log(list);

    saveLocal(list);
   

    // Close modal and reset form
    closeModal();

    // Add to dom
    addToDom(obj);
})

// Save in localStorage
const saveLocal = data=>localStorage.setItem('list',JSON.stringify(data));

// Close modal
const closeModal = ()=>{
    modal1.style.display = 'none';
}

modal1.addEventListener('click',(e)=>{
    e.stopPropagation();
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
})

// Add task to dom
const addToDom = obj=>{

    let template = `
                <div class="header">
                    <span class="date">${obj.date} - ${obj.time}</span>
                    <label class="switch">
                        <input type="checkbox" ${obj.completed ? 'checked=true':''}>
                        <span class="slider round"></span>
                    </label>
                </div>
                <div class="body">
                    <h3 class="title">${obj.title}</h3>
                    <p class="descripcion">${obj.description}</p>
                </div>
                <div class="footer">
                    <div class="etiquetas">
                    </div>
                    <button class="btn-delete">
                        <img class="icon-delete" src="assets/img/delete.png" alt="">
                    </button>
                </div>`;

    let task = document.createElement('div');
    task.classList.add('task');
    task.id = obj.id;
    task.innerHTML = template;
    task.style.background = obj.color;

    // Add hashtag
    obj.etiquetas.split(',').map(eti => task.querySelector('.etiquetas').innerHTML += `<div class="etiqueta"><img class="icon-delete" src="${eti}" alt=""></img></div>`)

    task.querySelector('button.btn-delete').addEventListener('click',e=>deleteTask(e.target.parentElement.parentElement.parentElement.id));

    task.querySelector('input[type="checkbox"]').addEventListener('change',e=>completed(e.target.parentElement.parentElement.parentElement.id, e.target))
    
    if (list.length == 0) {
        listDom.appendChild(task)
    }else{
        listDom.insertBefore(task, listDom.children[0]);
    }


}
// Delete task
const deleteTask = id=>{

    const task = document.getElementById(id);
    task.style.animation = 'none';
    setTimeout(()=>task.style.animation = 'rubberBand 2s',100);
    
    setTimeout(()=>task.remove(),2100);

    let list2 = list.filter(t=> t.id !== Number(id));
    localStorage.setItem('list',JSON.stringify(list2));
}
// initialize app
const initialize = ()=>{

    let data = localStorage.getItem('list');

    if (data == null) {
        localStorage.setItem('list','[{"color":"#22b0b0","etiquetas":"https://pwa-rdl.surge.sh/assets/img/clock.png,https://pwa-rdl.surge.sh/assets/img/home.png,https://pwa-rdl.surge.sh/assets/img/work.png,https://pwa-rdl.surge.sh/assets/img/warning.png","title":"Task 1","date":"2021-05-20","time":"13:06","description":"Description 1","id":1,"completed":0}]');
        data = localStorage.getItem('list');
    }

    // Add to dom
    if (data !== null && data !== '[]') {
        list = JSON.parse(data);
        [...list].map(obj=>addToDom(obj));
        
        contador = Number([...list].pop().id)+1;
    }

    let nombre = localStorage.getItem('nombre');

    if (nombre !== null && nombre !== "") {
        document.querySelector('.name').textContent = nombre;
    }else{
        let nombre = prompt('Por favor, ingresa un nombre para comenzar');
        localStorage.setItem('nombre', nombre)
        document.querySelector('.name').textContent = nombre;
    }
}

addEventListener('load', ()=>{
    initialize();
})

// Add boton
btnAdd.addEventListener('click',()=>{
    modal1.style.display = 'flex';
})

// Cancel boton
btnCancel.addEventListener('click',e=>{
    e.preventDefault();
    modal1.style.display = 'none';
})

// Completed task
const completed =(id, input)=>{
    let completed;
    if (input.getAttribute('checked')) {
        input.removeAttribute('checked');
        completed = 0;
    }else{
        completed = 1;
        input.setAttribute('checked','true');
    }

    list.filter(t=>{
            if (t.id == Number(id)) {
                t.completed = completed;
            }
            return t;
    })

    localStorage.setItem('list',JSON.stringify(list));
}