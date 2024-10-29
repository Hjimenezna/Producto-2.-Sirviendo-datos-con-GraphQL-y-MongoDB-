// tablero.js
const apiUrl = 'http://localhost:4000/graphql'; // Cambia esto a la URL de tu servidor GraphQL

// Obtener el ID del panel desde la URL
const urlParams = new URLSearchParams(window.location.search);
const panelId = urlParams.get('panelId');

// Establecer el ID del panel en el campo oculto
document.getElementById('panelId').value = panelId;

// Función para mostrar el título del panel
async function setPanelTitle() {
    const query = `
        query {
            getPanel(id: "${panelId}") {
                name
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
        document.getElementById('panelTitle').innerText = `Tablero - ${data.getPanel.name}`;
    } catch (error) {
        console.error('Error fetching panel title:', error);
    }
}

// Inicializar el tablero con tareas
async function displayTasks() {
    const tasks = await fetchTasks(panelId); // Asegúrate de que esta función esté bien definida
    const porHacerCol = document.getElementById('porHacer');
    const enProcesoCol = document.getElementById('enProceso');
    const finalizadoCol = document.getElementById('finalizado');

    // Limpiar las columnas
    porHacerCol.innerHTML = '';
    enProcesoCol.innerHTML = '';
    finalizadoCol.innerHTML = '';

    tasks.forEach(task => {
        if (task.panelId === panelId) { // Asegúrate de que el panelId sea correcto
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

            // Añadir a la columna correspondiente
            if (task.completed) {
                finalizadoCol.appendChild(taskCard);
            } else if (task.estado === 'enProceso') {
                enProcesoCol.appendChild(taskCard);
            } else {
                porHacerCol.appendChild(taskCard);
            }
        }
    });
}

// Almacenando la tarea al hacer clic en guardar
document.getElementById('saveTaskButton').onclick = async function() {
    const panelId = document.getElementById('panelId').value;
    const newTaskTitle = document.getElementById('newTaskTitle').value;
    const newTaskDescription = document.getElementById('newTaskDescription').value;
    const newTaskEstado = document.getElementById('newTaskEstado').value;

    // Crear la nueva tarea en el servidor
    const newTask = await createTask(newTaskTitle, newTaskDescription, panelId);

    // Limpiar el modal y cerrar
    document.getElementById('newTaskTitle').value = '';
    document.getElementById('newTaskDescription').value = '';
    document.getElementById('newTaskEstado').value = 'porHacer';
    $('#newTaskModal').modal('hide');

    // Recargar tareas para el panel
    displayTasks();
};
