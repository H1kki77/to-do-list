'use strict';

const
    btnAdd = document.querySelector('.btn--add'),
    list = document.querySelector('.list'),
    input = document.querySelector('#input-box'),
    savedRawData = localStorage.getItem('tasks'),
    btnClear = document.querySelector('.btn--clear-completed');

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

    const
        target = e.target,
        listItem = target.closest('LI');
    if (!listItem) return;
    const index = parseInt(listItem.dataset.id);


    if (target.classList.contains('btn-close')) {
        deleteTask(index);
    } else if (target.classList.contains('btn-edit') && !listItem.classList.contains('checked')) {
        editTask(index, listItem, target);
    } else if (target.classList.contains('btn-save')) {
        saveTask(index);
    } else if (target.tagName !== 'INPUT') {
        toggleTask(index);
    }

});

btnClear.addEventListener('click', () => {
    clearCompleted(tasks);
});

function clearCompleted() {
    tasks = tasks.filter(task => task.checked === false);
    updateUI(tasks);
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    updateUI(tasks);
}

function toggleTask(id) {
    const clickedTask = tasks.find(item => item.id === id);
    clickedTask.checked = !clickedTask.checked;
    updateUI(tasks);
}

function editTask(id, listItem, target) {
    const newSpan = listItem.querySelector('.task-text');
    const currText = newSpan.innerText.trim();
    newSpan.innerHTML = `
            <input class="input-edited" type="text" id="${id}" value="${currText}">
        `;
    target.src = 'images/confirm.avif';
    target.classList.remove('btn-edit');
    target.classList.add('btn-save');
    const editInput = document.getElementById(id);
    editInput.focus();
    editInput.selectionStart = editInput.value.length;
    editInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            target.click();
        }
    });
}

function saveTask(id) {
    const editInput = document.getElementById(id);
    const taskToEdit = tasks.find(item => item.id === id);
    const newText = editInput.value.trim();
    if (newText.length > 0) {
        taskToEdit.text = newText;
        updateUI(tasks);
    } else if (newText.length <= 0) {
        deleteTask(id);
        updateUI(tasks);
    }
}

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        btnAdd.click();
    }
});


function updateUI(arr) {
    arr.sort((a, b) => {
        if (a.checked === b.checked)
            return a.id - b.id;
        return a.checked - b.checked;
    })
    saveData(arr);
    render(arr);
}

function render(arr) {

    list.innerHTML = '';
    const hasCompletedTasks = arr.some(task => task.checked === true);
    btnClear.disabled = !hasCompletedTasks;

    if (arr.length !== 0) {
        arr.forEach((task, i) => {
            list.innerHTML += `
                <li class="${task.checked ? 'checked' : ''}" data-id="${task.id}">
                    ${i + 1}.
                    <span class="check-box"></span>
                    <span class="task-text">${task.text}</span>
                    <img class="btn-edit" src="images/edit-icon.png">
                    <span class="btn-close"></span>
                </li>
            `;
        });
        btnClear.style.display = 'block';
    } else {
        list.innerHTML = `
            <div class="no-tasks__wrapper">
                <img class="no-tasks__img" src="images/no-tasks.png" alt="no-tasks">
                <p class="no-tasks__text">You have no tasks for now!</p>
            </div>
        `;
        btnClear.style.display = 'none';
    }
}

function saveData(data) {
    const stringData = JSON.stringify(data);
    localStorage.setItem('tasks', stringData);
}