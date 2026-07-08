import { initDB, getTasks, addTask as dbAddTask, toggleTask as dbToggleTask, deleteTask as dbDeleteTask } from './database.js';

Neutralino.init();

async function startApp() {
   try {
        console.log("Iniciando aplicación...");
        await initDB(); // Espera a que la tabla se cree
        console.log("Cargando tareas...");
        renderTasks(getTasks());
    } catch (error) {
        console.error("Error crítico al iniciar:", error);
    }
}

function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();

    if (taskText) {
        dbAddTask(taskText);
        input.value = '';
        renderTasks(getTasks());
    }
}

function toggleTask(id) {
    dbToggleTask(id);
    renderTasks(getTasks());
}

function deleteTask(id) {
    dbDeleteTask(id);
    renderTasks(getTasks());
}

function renderTasks(tasks) {
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        li.innerHTML = `
            <input type="checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span>${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Eliminar</button>
        `;
        list.appendChild(li);
    });

    updateStats(tasks);
}

function updateStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    document.getElementById('totalCount').innerText = total;
    document.getElementById('pendingCount').innerText = total - completed;
    document.getElementById('completedCount').innerText = completed;
}

// Hacer las funciones globales para que el HTML pueda llamarlas
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.addTask = addTask;

// Iniciar la aplicación
startApp();