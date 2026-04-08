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
        const index = parseInt(e.target.parentElement.dataset.id);
        tasks = tasks.filter(task => task.id !== index);
        render(tasks);
    } else if (e.target.classList.contains('check-box')) {
        const index = parseInt(e.target.parentElement.dataset.id);
        const clickedTask = tasks.find(item => item.id === index);
        clickedTask.checked = !clickedTask.checked;
        render(tasks);
    } else if (e.target.classList.contains('btn-edit') && !e.target.closest('LI').classList.contains('checked')) {
        const index = parseInt(e.target.parentElement.dataset.id);
        const newSpan = e.target.closest('li').querySelector('.task-text');
        const currText = newSpan.innerText.trim();
        newSpan.innerHTML = `
            <input type="text" id="${index}" value="${currText}">
        `;
        e.target.src = '/images/confirm.avif';
        e.target.classList.remove('btn-edit');
        e.target.classList.add('btn-save');
        const editInput = document.getElementById(index);
        editInput.focus();
        editInput.selectionStart = editInput.value.length;
        editInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                e.target.click();
            }
        });
    } else if (e.target.classList.contains('btn-save')) {
        const index = parseInt(e.target.parentElement.dataset.id);
        const editInput = document.getElementById(index);
        const taskToEdit = tasks.find(item => item.id === index);
        taskToEdit.text = editInput.value;
        saveData(tasks);
        render(tasks);
    }
    saveData(tasks);
});


input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        btnAdd.click();
    }
});

function render(arr) {
    list.innerHTML = '';
    if (arr.length !== 0) {
        arr.forEach((task, i) => {
            list.innerHTML += `<li class="${task.checked ? 'checked' : ''}" data-id="${task.id}">${i + 1}.<span class="check-box"></span><span class="task-text">${task.text}</span><img class="btn-edit" src="/images/edit-icon.png"><span class="btn-close"></span></li>`;
        });
    } else {
        list.innerHTML = `
            <div class="no-tasks__wrapper">
                <img class="no-tasks__img" src="images/no-tasks.png" alt="no-tasks">
                <p class="no-tasks__text">You have no tasks for now!</p>
            </div>
        `;
    }
}

function saveData(data) {
    const stringData = JSON.stringify(data);
    localStorage.setItem('tasks', stringData);
}