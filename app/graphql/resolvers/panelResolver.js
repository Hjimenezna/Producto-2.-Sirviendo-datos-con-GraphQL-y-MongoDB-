const path = require('path');
const Panel = require(path.resolve(__dirname, '../../models/Panel.js'));
const Task = require(path.resolve(__dirname, '../../models/Task.js')); // Importar Task para acceder a sus métodos

const panelResolver = {
    Query: {
        getPanels: async () => await Panel.find().populate('tasks'),
        getPanel: async (_, { id }) => await Panel.findById(id).populate('tasks')
    },
    Mutation: {
        createPanel: async (_, { name, description }) => {
            const newPanel = new Panel({ name, description });
            return await newPanel.save();
        },
        updatePanel: async (_, { id, name, description }) => {
            // Crea un objeto con los campos a actualizar
            const updateData = {};
            if (name) updateData.name = name;
            if (description) updateData.description = description;

            // Actualiza el panel y devuelve el nuevo panel
            return await Panel.findByIdAndUpdate(id, updateData, { new: true });
        },
        deletePanel: async (_, { id }) => {
            // Intenta eliminar el panel y devolverlo
            const deletedPanel = await Panel.findByIdAndDelete(id);
            if (!deletedPanel) {
                throw new Error(`Panel with ID ${id} not found`);
            }
            return deletedPanel; // Retorna el panel eliminado
        }
    },
    Panel: {
        tasks: async (panel) => await Task.find({ panelId: panel._id }) // Resolver para obtener las tareas
    }
};

module.exports = panelResolver;
