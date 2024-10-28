const Task = require('../models/Task');
const Panel = require('../models/Panel');


const resolvers = {
    Query: {
        getPanels: async () => await Panel.find(),
        getPanel: async (_, { id }) => await Panel.findById(id),
        getTasks: async () => await Task.find(),
        getTask: async (_, { id }) => await Task.findById(id),
    },
    Mutation: {
        createTask: async (_, { title, description, panelId }) => {
            try {
                const newTask = new Task({
                    title,
                    description,
                    panelId
                });
                await newTask.save();

                // Agrega el ID de la tarea al panel correspondiente
                await Panel.findByIdAndUpdate(panelId, { $push: { tasks: newTask._id } });

                return newTask;
            } catch (error) {
                console.error("Error creating task:", error);
                throw new Error("Error creating task");
            }
        },
        // Otros resolvers de mutación como updateTask, deleteTask, etc.
    },
    Panel: {
        tasks: async (panel) => await Task.find({ panelId: panel._id })
    }
};

module.exports = resolvers;
