// Archivo: js/tasks.js

const apiUrl = 'http://localhost:4000/graphql'; // Cambia esto a la URL de tu servidor GraphQL



// Obtener todas las tareas desde el backend
async function fetchTasks() {
    const query = `
        query {
            getTasks {
                id
                title
                description
                completed
                panelId
            }
        }
    `;
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        const { data } = await response.json();
        return data.getTasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Crear una nueva tarea
async function createTask(title, description, panelId) {
    const mutation = `
        mutation {
            createTask(title: "${title}", description: "${description}", panelId: "${panelId}") {
                id
                title
                description
                completed
                panelId
            }
        }
    `;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: mutation }),
        });

        const { data } = await response.json();
        return data.createTask;
    } catch (error) {
        console.error('Error creating task:', error);
    }
}

// Eliminar una tarea
async function deleteTask(id) {
    const mutation = `
        mutation {
            deleteTask(id: "${id}") {
                id
            }
        }
    `;
    try {
        await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: mutation }),
        });
        displayTasks(); // Actualizar la visualización
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Función para mostrar tareas en las columnas
async function displayTasks() {
    const tasks = await fetchTasks();
    const porHacerCol = document.getElementById('porHacer');
    const enProcesoCol = document.getElementById('enProceso');
    const finalizadoCol = document.getElementById('finalizado');

    // Limpiar las columnas
    porHacerCol.innerHTML = '';
    enProcesoCol.innerHTML = '';
    finalizadoCol.innerHTML = '';

    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.classList.add('card', 'mb-3', 'draggable');
        taskCard.setAttribute('id', task.id);
        taskCard.setAttribute('draggable', 'true');
        taskCard.ondragstart = drag;

        taskCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.description}</p>
                <p class="card-text"><strong>Completado:</strong> ${task.completed ? 'Sí' : 'No'}</p>
                <button class="btn btn-danger btn-sm" onclick="deleteTask('${task.id}')">Eliminar</button>
                <button class="btn btn-primary btn-sm" onclick='openEditModal(${JSON.stringify(task)})'>Editar</button>
            </div>
        `;

        if (task.panelId === "613b6c867ff9e3a1d0801234") {
            porHacerCol.appendChild(taskCard);
        } else if (task.completed === true) {
            finalizadoCol.appendChild(taskCard);
        } else {
            enProcesoCol.appendChild(taskCard);
        }
    });
}
// Manejo de arrastrar y soltar (drag and drop)
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const taskId = ev.dataTransfer.getData("text");
    const targetColumn = ev.target.id;
    const taskElement = document.getElementById(taskId);
    ev.target.appendChild(taskElement);

    // Actualizar el estado de la tarea según la columna de destino
    updateTaskColumn(taskId, targetColumn);
}

// Actualizar una tarea
async function updateTask(id, title, description, completed) {
    const mutation = `
        mutation {
            updateTask(id: "${id}", title: "${title}", description: "${description}", completed: ${completed}) {
                id
                title
                description
                completed
                panelId
            }
        }
    `;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: mutation }),
        });

        const { data } = await response.json();
        return data.updateTask;
    } catch (error) {
        console.error('Error updating task:', error);
    }
}


// Abrir el modal en modo de edición
function openEditModal(task) {
    document.getElementById('newTaskTitle').value = task.title;
    document.getElementById('newTaskDescription').value = task.description;
    document.getElementById('panelId').value = task.panelId;

    // Configura el botón de guardar para actualizar la tarea existente
    const saveButton = document.getElementById('saveTaskButton');
    saveButton.dataset.taskId = task.id;
    saveButton.textContent = "Actualizar Tarea";

    const editModal = new bootstrap.Modal(document.getElementById('newTaskModal'));
    editModal.show();
}


// Guardar tarea o actualizar según el estado del botón
document.getElementById('saveTaskButton').addEventListener('click', async function () {
    const taskId = this.dataset.taskId;
    const title = document.getElementById('newTaskTitle').value;
    const description = document.getElementById('newTaskDescription').value;
    const panelId = document.getElementById('panelId').value;

    if (taskId) {
        // Actualizar la tarea
        await updateTask(taskId, title, description, false); // Cambia el estado según tus necesidades
        delete this.dataset.taskId;
        this.textContent = "Guardar";
    } else {
        // Crear una nueva tarea
        await createTask(title, description, panelId);
    }

    resetForm();
    displayTasks();

    const modal = bootstrap.Modal.getInstance(document.getElementById('newTaskModal'));
    modal.hide();
});

// Resetear formulario del modal
function resetForm() {
    document.getElementById('newTaskTitle').value = '';
    document.getElementById('newTaskDescription').value = '';
    document.getElementById('panelId').value = '613b6c867ff9e3a1d0801234';
}
// Inicializar el tablero con tareas
displayTasks();
