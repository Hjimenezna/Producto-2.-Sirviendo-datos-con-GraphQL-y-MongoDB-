const apiUrl = 'http://localhost:4000/graphql'; // URL del servidor GraphQL
let panelToDeleteId = null; // Variable para almacenar el ID del panel a eliminar

// Obtener todos los paneles desde el backend
async function fetchPanels() {
    const query = `
        query {
            getPanels {
                id
                name
                description
                tasks {
                    id
                    title
                    description
                    completed
                }
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
        return data.getPanels;
    } catch (error) {
        console.error('Error fetching panels:', error);
    }
}

// Crear un nuevo panel
async function createPanel(name, description) {
    const mutation = `
        mutation {
            createPanel(name: "${name}", description: "${description}") {
                id
                name
                description
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
        return data.createPanel;
    } catch (error) {
        console.error('Error creating panel:', error);
    }
}

// Función para abrir el modal de confirmación y establecer el ID del panel a eliminar
function confirmDeletePanel(id) {
    panelToDeleteId = id; // Guardamos el ID del panel
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    confirmDeleteModal.show(); // Mostramos el modal de confirmación
}

async function deletePanel() {
    const mutation = `
        mutation {
            deletePanel(id: "${panelToDeleteId}") {
                id
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

        const result = await response.json();
        if (result.errors) {
            console.error('Error deleting panel:', result.errors);
            alert('Error al eliminar el panel.');
            return;
        }

        displayPanels(); // Actualizamos la visualización de paneles
    } catch (error) {
        console.error('Error deleting panel:', error);
        alert('Error al eliminar el panel.');
    } finally {
        panelToDeleteId = null; // Restablecer el ID del panel
        const confirmDeleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
        confirmDeleteModal.hide(); // Ocultar el modal de confirmación
    }
}

// Mostrar paneles en la interfaz
async function displayPanels() {
    const panels = await fetchPanels();
    const container = document.getElementById('proyectosContainer');

    // Limpiar contenedor pero mantener los paneles estáticos
    const staticPanels = Array.from(container.querySelectorAll('.static-panel')); // Solo seleccionamos los paneles estáticos
    container.innerHTML = ''; // Limpiar el contenedor

    // Agregar los paneles estáticos de nuevo
    staticPanels.forEach(panel => {
        container.appendChild(panel);
    });

    // Agregar paneles dinámicos
    panels.forEach(panel => {
        const panelElement = document.createElement('div');
        panelElement.classList.add('col-lg-6', 'panel-item');
        panelElement.innerHTML = `
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title">${panel.name}</h5>
                    <p class="card-text">${panel.description}</p>
                    <a href="tablero.html?panelId=${panel.id}" class="btn btn-primary">Ver Tareas</a>
                   <button class="btn btn-danger btn-sm" onclick="confirmDeletePanel('${panel.id}')">Eliminar</button>
                </div>
            </div>
        `;
        container.appendChild(panelElement);
    });
}

// Crear un nuevo panel desde el modal
document.getElementById('savePanelButton').addEventListener('click', async () => {
    const name = document.getElementById('newPanelName').value;
    const description = document.getElementById('newPanelDescription').value;
    
    await createPanel(name, description);
    document.getElementById('newPanelName').value = '';
    document.getElementById('newPanelDescription').value = '';
    
    displayPanels();

    const modal = bootstrap.Modal.getInstance(document.getElementById('newPanelModal'));
    modal.hide();
});

// Asignar el evento al botón de confirmación de eliminación en el modal
document.getElementById('confirmDeleteButton').addEventListener('click', deletePanel);


// Inicializar vista de paneles
displayPanels();
