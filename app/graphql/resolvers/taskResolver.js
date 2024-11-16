const path = require('path');
const Task = require(path.resolve(__dirname, '../../models/Task.js')); // Importa el modelo Task
const Panel = require(path.resolve(__dirname, '../../models/Panel.js')); // Importa el modelo Panel

const taskResolver = {
    Query: {
        // Consulta para obtener todas las tareas, convirtiendo las fechas a formato ISO
        getTasks: async () => {
            try {
                const tasks = await Task.find();
                // Formatea cada tarea y convierte las fechas antes de devolverlas
                return tasks.map(task => ({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    completed: task.completed,
                    responsible: task.responsible,
                    createdAt: task.createdAt.toISOString(),
                    updatedAt: task.updatedAt.toISOString(),
                    panelId: task.panelId
                }));
            } catch (error) {
                console.error("Error fetching tasks:", error);
                throw new Error("Error fetching tasks");
            }
        },
        
        // Consulta para obtener una tarea específica por ID, con las fechas en formato ISO
        getTask: async (_, { id }) => {
            try {
                const task = await Task.findById(id);
                if (!task) throw new Error(`Task with ID ${id} not found`);
                // Formatea la tarea y convierte las fechas antes de devolverla
                return {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    completed: task.completed,
                    responsible: task.responsible,
                    createdAt: task.createdAt.toISOString(),
                    updatedAt: task.updatedAt.toISOString(),
                    panelId: task.panelId
                };
            } catch (error) {
                console.error("Error fetching task:", error);
                throw new Error("Error fetching task");
            }
        }
    },

    Mutation: {
        // Mutación para crear una nueva tarea y añadirla al panel correspondiente
        createTask: async (_, { title, description, panelId, responsible }) => {
            try {
                const newTask = new Task({ title, description, panelId, responsible });
                await newTask.save();

                // Añade la tarea creada al array de tareas del panel correspondiente
                await Panel.findByIdAndUpdate(panelId, { $push: { tasks: newTask._id } });

                // Formatea la tarea y convierte las fechas antes de devolverla
                return {
                    id: newTask.id,
                    title: newTask.title,
                    description: newTask.description,
                    completed: newTask.completed,
                    responsible: newTask.responsible,
                    createdAt: newTask.createdAt.toISOString(),
                    updatedAt: newTask.updatedAt.toISOString(),
                    panelId: newTask.panelId
                };
            } catch (error) {
                console.error("Error creating task:", error);
                throw new Error("Error creating task");
            }
        },

        // Mutación para actualizar una tarea específica, permitiendo modificar varios campos
        updateTask: async (_, { id, title, description, completed, responsible }) => {
            try {
                const updateData = {};
                if (title) updateData.title = title;
                if (description) updateData.description = description;
                if (typeof completed !== 'undefined') updateData.completed = completed;
                if (responsible) updateData.responsible = responsible;

                const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });
                if (!updatedTask) throw new Error(`Task with ID ${id} not found`);

                // Formatea la tarea y convierte las fechas antes de devolverla
                return {
                    id: updatedTask.id,
                    title: updatedTask.title,
                    description: updatedTask.description,
                    completed: updatedTask.completed,
                    responsible: updatedTask.responsible,
                    createdAt: updatedTask.createdAt.toISOString(),
                    updatedAt: updatedTask.updatedAt.toISOString(),
                    panelId: updatedTask.panelId
                };
            } catch (error) {
                console.error("Error updating task:", error);
                throw new Error("Error updating task");
            }
        },

        // Mutación para eliminar una tarea específica por su ID
        deleteTask: async (_, { id }) => {
            try {
                const deletedTask = await Task.findByIdAndDelete(id);
                if (!deletedTask) throw new Error(`Task with ID ${id} not found`);
                return deletedTask; // Retorna la tarea eliminada si es necesario
            } catch (error) {
                console.error("Error deleting task:", error);
                throw new Error("Error deleting task");
            }
        }
    }
};

module.exports = taskResolver; // Exporta el resolver de tareas para integrarlo en el servidor Apollo
