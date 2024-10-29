const apiUrl = 'http://localhost:4000/graphql'; // URL del servidor GraphQL

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

// Eliminar un panel
async function deletePanel(id) {
    const mutation = `
        mutation {
            deletePanel(id: "${id}") {
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
        displayPanels(); // Actualizar visualización
    } catch (error) {
        console.error('Error deleting panel:', error);
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
                    <button class="btn btn-danger btn-sm" onclick="deletePanel('${panel.id}')">Eliminar</button>
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

// Inicializar vista de paneles
displayPanels();
