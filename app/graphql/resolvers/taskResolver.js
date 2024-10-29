const path = require('path');
const Task = require(path.resolve(__dirname, '../../models/Task.js')); // Corregido a Task

const taskResolver = {
    Query: {
        getTasks: async () => await Task.find(),
        getTask: async (_, { id }) => await Task.findById(id)
    },
    Mutation: {
        createTask: async (_, { title, description, panelId }) => {
            try {
                const newTask = new Task({ title, description, panelId });
                await newTask.save();

                // Agrega el ID de la nueva tarea al panel correspondiente
                await Panel.findByIdAndUpdate(panelId, { $push: { tasks: newTask._id } });

                return newTask;
            } catch (error) {
                console.error("Error creating task:", error);
                throw new Error("Error creating task");
            }
        },

        updateTask: async (_, { id, title, description, completed }) => {
            try {
                const updateData = {};
                if (title) updateData.title = title;
                if (description) updateData.description = description;
                if (typeof completed !== 'undefined') updateData.completed = completed; // Verificar si se proporciona

                const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });
                if (!updatedTask) throw new Error(`Task with ID ${id} not found`);
                return updatedTask;
            } catch (error) {
                console.error("Error updating task:", error);
                throw new Error("Error updating task");
            }
        },
        deleteTask: async (_, { id }) => {
            try {
                const deletedTask = await Task.findByIdAndDelete(id);
                if (!deletedTask) throw new Error(`Task with ID ${id} not found`);
                return deletedTask;
            } catch (error) {
                console.error("Error deleting task:", error);
                throw new Error("Error deleting task");
            }
        }
    }
};


module.exports = taskResolver;
