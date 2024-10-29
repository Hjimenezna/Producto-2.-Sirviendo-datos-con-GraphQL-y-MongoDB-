const path = require('path');
const Task = require(path.resolve(__dirname, '../../models/Task.js')); // Importa el modelo Task
const Panel = require(path.resolve(__dirname, '../../models/Panel.js')); // Importa el modelo Panel

const taskResolver = {
    Query: {
        getTasks: async () => {
            try {
                return await Task.find();
            } catch (error) {
                console.error("Error fetching tasks:", error);
                throw new Error("Error fetching tasks");
            }
        },
        getTask: async (_, { id }) => {
            try {
                const task = await Task.findById(id);
                if (!task) throw new Error(`Task with ID ${id} not found`);
                return task;
            } catch (error) {
                console.error("Error fetching task:", error);
                throw new Error("Error fetching task");
            }
        }
    },

    Mutation: {
        createTask: async (_, { title, description, panelId }) => {
            try {
                const newTask = new Task({ title, description, panelId });
                await newTask.save();

                // Asegúrate de que Panel se ha importado y está disponible
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
                if (typeof completed !== 'undefined') updateData.completed = completed;

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
