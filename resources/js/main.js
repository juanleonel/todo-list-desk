import { initI18n, translated as t, toggleLanguage } from './i18n.js';

import { AppConstants } from './constants/app.constants.js';
import { createTable, getAllTasks, insertTask, updateTaskStatus, removeTask } from './task.dao.js'
import { config } from './config.js'
import { initConnection } from './sqljs-connection.js';

Neutralino.init();

window.toggleLanguage = toggleLanguage;


async function startApp() {
   try {
        const homePath = await Neutralino.os.getEnv("HOME");
        await initConnection({
            dbName: config.dataBaseName,
            homePath: homePath
        });
        createTable();
        await initI18n(); 
        renderTasks(getAllTasks());
    } catch (error) {
        console.error('Error to start the application:', error);
    }
}

function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();

    if (taskText) {
        insertTask(taskText);
        input.value = AppConstants.stringEmpty;
        renderTasks(getAllTasks());
        Neutralino.os.showMessageBox(t('app.title'), t('msg.taskAdded'));
    }
}

function toggleTask(id) {
    updateTaskStatus(id);
    renderTasks(getAllTasks());
}

async function deleteTask(id) {
    const result = await Neutralino.os.showMessageBox(
        t('app.title'),
        t('msg.confirmDelete'),
        'YES_NO', 'QUESTION'
    );

    if (result == AppConstants.confirmResult.no) {
        return
    }

    removeTask(id);
    renderTasks(getAllTasks());
}

function renderTasks(tasks) {
    const list = document.getElementById('taskList');
    list.innerHTML = AppConstants.stringEmpty;
    const deleteLabel = t('btn.delete') || 'Eliminar'; 

    tasks.forEach(task => {
        const li = document.createElement('li');

        if (task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = buildElementsForLiTag(task, { deleteLabel: deleteLabel })
        list.appendChild(li);
    });

    updateStats(tasks);
}

function buildElementsForLiTag(task, options = { deleteLabel }) {
    return `<input type='checkbox' 
        ${task.completed ? 'checked' : AppConstants.stringEmpty} 
        onchange='toggleTask(${task.id})'>
        <span>${task.text}</span>
    <button class='delete-btn' onclick='deleteTask(${task.id})'>${ options.deleteLabel }</button>
    `
}

function updateStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(task => {
        return task.completed
    }).length;
    document.getElementById('totalCount').innerText = total;
    document.getElementById('pendingCount').innerText = total - completed;
    document.getElementById('completedCount').innerText = completed;
}

window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.addTask = addTask;

startApp();
