document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Load tasks on startup
    window.electron.invoke('get-tasks').then(renderTasks);

    // Add task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const task = taskInput.value;
        if (task) {
            const tasks = await window.electron.invoke('add-task', task);
            renderTasks(tasks);
            taskInput.value = '';
        }
    });

    // Render tasks with delete and update buttons
    function renderTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.description;
            li.dataset.id = task.id;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                const tasks = await window.electron.invoke('delete-task', task.id);
                renderTasks(tasks);
            });

            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.addEventListener('click', async () => {
                const newDescription = prompt('Update task:', task.description);
                if (newDescription) {
                    const tasks = await window.electron.invoke('update-task', task.id, newDescription);
                    renderTasks(tasks);
                }
            });

            li.appendChild(updateButton);
            li.appendChild(deleteButton);
            taskList.appendChild(li);
        });
    }
});
