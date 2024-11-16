const path = require('path');
const Panel = require(path.resolve(__dirname, '../../models/Panel.js')); // Importa el modelo Panel para las operaciones CRUD
const Task = require(path.resolve(__dirname, '../../models/Task.js')); // Importa el modelo Task para manejar las tareas asociadas

const panelResolver = {
    Query: {
        // Consulta para obtener todos los paneles, incluyendo sus tareas asociadas
        getPanels: async () => await Panel.find().populate('tasks'),
        
        // Consulta para obtener un panel específico por su ID, incluyendo sus tareas asociadas
        getPanel: async (_, { id }) => await Panel.findById(id).populate('tasks')
    },
    Mutation: {
        // Mutación para crear un nuevo panel con nombre y descripción
        createPanel: async (_, { name, description }) => {
            const newPanel = new Panel({ name, description });
            return await newPanel.save();
        },

        // Mutación para actualizar un panel existente, permitiendo modificar nombre y descripción
        updatePanel: async (_, { id, name, description }) => {
            const updateData = {};
            if (name) updateData.name = name;
            if (description) updateData.description = description;

            return await Panel.findByIdAndUpdate(id, updateData, { new: true });
        },

        // Mutación para eliminar un panel por su ID, y eliminar todas las tareas asociadas a ese panel
        deletePanel: async (_, { id }) => {
            try {
                console.log(`Intentando eliminar el panel con ID: ${id}`);
                
                // Busca las tareas asociadas al panel antes de la eliminación
                const tasksBeforeDeletion = await Task.find({ panelId: id });
                console.log(`Tareas encontradas para el panel ${id} antes de la eliminación:`, tasksBeforeDeletion);
        
                // Elimina todas las tareas asociadas al panel
                const deleteTasksResult = await Task.deleteMany({ panelId: id });
                console.log(`Resultado de la eliminación de tareas para el panel ${id}:`, deleteTasksResult);
                
                // Confirma si se eliminaron tareas asociadas
                if (deleteTasksResult.deletedCount === 0) {
                    console.warn(`No se encontraron tareas asociadas al panel ${id}.`);
                } else {
                    console.log(`Se eliminaron ${deleteTasksResult.deletedCount} tareas asociadas al panel ${id}.`);
                }
        
                // Elimina el propio panel
                const deletedPanel = await Panel.findByIdAndDelete(id);
                if (!deletedPanel) throw new Error(`Panel con ID ${id} no encontrado`);
                console.log(`Panel eliminado con éxito:`, deletedPanel);
                
                return deletedPanel;
            } catch (error) {
                console.error("Error eliminando el panel y sus tareas:", error);
                throw new Error("Error eliminando el panel y sus tareas");
            }
        }
    },
    Panel: {
        // Resolver personalizado para obtener las tareas asociadas a un panel específico
        tasks: async (panel) => await Task.find({ panelId: panel._id })
    }
};

module.exports = panelResolver; // Exporta el resolver para integrarlo en el servidor Apollo
