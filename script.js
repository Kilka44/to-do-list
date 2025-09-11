// анимация бекграунда
function createAnimatedBackground() {
    const background = document.getElementById('backgroundAnimation');
    const bubbleCount = 15;
    
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
         
        const size = Math.floor(Math.random() * 80) + 40;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.bottom = `-${size}px`;
        
        const duration = Math.floor(Math.random() * 10) + 15;
        bubble.style.animationDuration = `${duration}s`;
        
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        
        background.appendChild(bubble);
    }
}

// дом 
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const taskList = document.getElementById('taskList');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const confirmationModal = document.getElementById('confirmationModal');
const confirmClearBtn = document.getElementById('confirmClearBtn');
const cancelClearBtn = document.getElementById('cancelClearBtn');

//локал стораж
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

document.addEventListener('DOMContentLoaded', () => {
    createAnimatedBackground();
    renderTasks();
    updateProgress();
    
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    clearAllBtn.addEventListener('click', showClearModal);
    confirmClearBtn.addEventListener('click', clearAllTasks);
    cancelClearBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            closeModal();
        }
    });
});

// добавить задачу
function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) return;
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateProgress();
    showNotification('Task added successfully!');
    
    // отчистить поле ввода
    taskInput.value = '';
    taskInput.focus();
}

// отрисовка задач
function renderTasks() {
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-cloud"></i>
                <p>Your task list is empty
                 Add your first task!</p>
            </div> `;
        return;
    }
    
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        if (task.completed) taskItem.classList.add('completed');
        
        taskItem.innerHTML = `
            <div class="task-content">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}"></div>
                <span class="task-text">${task.text}</span>
            </div>
            <div class="task-controls">
                <div class="delete-btn">
                    <i class="fas fa-times"></i>
                </div>
            </div>
        `;
        
        // добавление обработчиков событий
        const checkbox = taskItem.querySelector('.task-checkbox');
        checkbox.addEventListener('click', () => toggleTask(task.id));
        
        const deleteBtn = taskItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        taskList.appendChild(taskItem);
    });
}

// тоггл задачи
function toggleTask(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return {...task, completed: !task.completed};
        }
        return task;
    });
    
    saveTasks();
    renderTasks();
    updateProgress();
    
    const task = tasks.find(t => t.id === taskId);
    showNotification(task.completed ? 'Task marked as completed!' : 'Task marked as active');
}

// удаление задачи
function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        const deletedTask = tasks.splice(taskIndex, 1)[0];
        saveTasks();
        renderTasks();
        updateProgress();
        showNotification(`Task "${deletedTask.text}" deleted`);
    }
}

// обновление прогресса
function updateProgress() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress}% complete`;
}

// сохранение задач в локальное хранилище
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// показать модальное окно подтверждения очистки
function showClearModal() {
    if (tasks.length === 0) {
        showNotification('Your task list is already empty!');
        return;
    }
    
    confirmationModal.style.display = 'flex';
}

// очистка всех задач
function clearAllTasks() {
    tasks = [];
    saveTasks();
    renderTasks();
    updateProgress();
    showNotification('All tasks have been cleared!');
    closeModal();
}

// закрытие модального окна
function closeModal() {
    confirmationModal.style.display = 'none';
}

// показать уведомление
function showNotification(message) {
    // удаление существующего уведомления
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // показать уведомление с небольшой задержкой для анимации
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // удаление уведомления через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 3000);
}