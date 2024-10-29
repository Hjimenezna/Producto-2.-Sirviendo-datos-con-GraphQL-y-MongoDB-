const apiUrl = 'http://localhost:4000/graphql'; // Cambia esto a la URL de tu servidor GraphQL

// Función para obtener todos los paneles
async function getPanels() {
    const query = `
        query {
            getPanels {
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
            body: JSON.stringify({ query }),
        });

        const { data } = await response.json();
        return data.getPanels;
    } catch (error) {
        console.error('Error fetching panels:', error);
    }
}

// Función para crear un nuevo panel
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

// Función para eliminar un panel
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
        await displayPanels(); // Actualizar la visualización
    } catch (error) {
        console.error('Error deleting panel:', error);
    }
}

// Función para mostrar los paneles
// Función para mostrar los paneles
async function displayPanels() {
    const panels = await getPanels(); // Obtener todos los paneles
    const proyectosContainer = document.getElementById('proyectosContainer');

    // Obtener los IDs de los paneles ya existentes para evitar duplicados
    const existingIds = Array.from(proyectosContainer.querySelectorAll('.proyecto-dinamico')).map(div => div.getAttribute('data-id'));

    if (panels && panels.length > 0) {
        panels.forEach(panel => {
            const proyectoHTML = `
                <div class="col-lg-6 proyecto-dinamico" data-id="${panel.id}">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">${panel.name}</h5>
                            <p class="card-text">${panel.description}</p>
                            <a href="tareas.html?id=${panel.id}" class="btn btn-primary">Ver Tareas</a>
                            <button class="btn btn-danger eliminar-proyecto" data-id="${panel.id}">Eliminar</button>
                        </div>
                    </div>
                </div>`;
            proyectosContainer.innerHTML += proyectoHTML; // Añadir el panel al contenedor
        });
        // Añadir event listener a los botones de eliminar
        document.querySelectorAll('.eliminar-proyecto').forEach(button => {
            button.addEventListener('click', async function () {
                const id = this.getAttribute('data-id');
                await deletePanel(id); // Llamar a la función para eliminar el panel

                // Eliminar el panel del DOM
                const panelDiv = document.querySelector(`.proyecto-dinamico[data-id="${id}"]`);
                if (panelDiv) {
                    panelDiv.remove(); // Eliminar el elemento del DOM
                }
            });
        });
    }
}

// Cargar los paneles al inicio
document.addEventListener('DOMContentLoaded', function () {
    displayPanels(); // Cargar los paneles de la base de datos
});


// Mostrar el modal para crear un nuevo panel
document.getElementById('nuevoProyectoBtn').addEventListener('click', function () {
    const modal = new bootstrap.Modal(document.getElementById('nuevoProyectoModal'));
    modal.show();
});

// Guardar el nuevo panel al hacer clic en el botón "Crear"
document.getElementById('crearPanelButton').addEventListener('click', async function () {
    const name = document.getElementById('nuevoPanelNombre').value;
    const description = document.getElementById('nuevoPanelDescripcion').value;

    const newPanel = await createPanel(name, description);
    if (newPanel) {
        await displayPanels(); // Actualizar la visualización con el nuevo panel
    }

    // Limpiar los campos del modal
    document.getElementById('nuevoPanelNombre').value = '';
    document.getElementById('nuevoPanelDescripcion').value = '';

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('nuevoProyectoModal'));
    modal.hide();
});

// Cargar los paneles al inicio
document.addEventListener('DOMContentLoaded', function () {
    displayPanels(); // Cargar los paneles de la base de datos
});
