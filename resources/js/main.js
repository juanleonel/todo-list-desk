import { initConnection } from './sqljs-connection.js';
import { createTable, getAllTasks, insertTask, updateTaskStatus, removeTask } from './task.dao.js'
import { AppConstants } from './constants/app.constants.js';

Neutralino.init();

async function startApp() {
   try {
        const homePath = await Neutralino.os.getEnv("HOME");
        await initConnection({
            dbName: 'todolist.db',
            homePath: homePath
        });
        createTable();
        renderTasks(getAllTasks());
    } catch (error) {
        console.error('Error crítico al iniciar:', error);
    }
}

function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();

    if (taskText) {
        insertTask(taskText);
        input.value = AppConstants.stringEmpty;
        renderTasks(getAllTasks());
    }
}

function toggleTask(id) {
    updateTaskStatus(id);
    renderTasks(getAllTasks());
}

function deleteTask(id) {
    removeTask(id);
    renderTasks(getAllTasks());
}

function renderTasks(tasks) {
    const list = document.getElementById('taskList');
    list.innerHTML = AppConstants.stringEmpty;

    tasks.forEach(task => {
        const li = document.createElement('li');

        if (task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <input type='checkbox' 
                   ${task.completed ? 'checked' : ''} 
                   onchange='toggleTask(${task.id})'>
            <span>${task.text}</span>
            <button class='delete-btn' onclick='deleteTask(${task.id})'>Eliminar</button>
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

window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.addTask = addTask;

startApp();
