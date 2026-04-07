'use strict';

const btnAdd = document.querySelector('.btn-add');
const list = document.querySelector('.list');
const input = document.querySelector('#input-box');
const savedRawData = localStorage.getItem('tasks');

let tasks = JSON.parse(savedRawData) || [];
render(tasks);


btnAdd.addEventListener('click', () => {
    let userText = input.value.trim();

    if (userText !== '') {
        let newTask = {
            id: Date.now(),
            text: userText,
            checked: false
        };
        tasks.push(newTask);
        render(tasks);
        input.value = '';
    }
    saveData(tasks);
});

list.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-close')) {
        let index = parseInt(e.target.parentElement.dataset.id);
        tasks = tasks.filter(task => task.id !== index);
        render(tasks);
    }
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle('checked');
        const index = parseInt(e.target.dataset.id);
        const clickedTask = tasks.find(item => item.id === index);
        clickedTask.checked = !clickedTask.checked;
    }
    saveData(tasks);
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        btnAdd.click();
    }
})

function render(arr) {
    list.innerHTML = '';
    arr.forEach((task, i) => {
        list.innerHTML += `<li class="${task.checked ? 'checked' : ''}" data-id="${task.id}">${i + 1}. ${task.text}<span class="btn-close"></span></li>`;
    });
}

function saveData(data) {
    const stringData = JSON.stringify(data);
    localStorage.setItem('tasks', stringData);
}