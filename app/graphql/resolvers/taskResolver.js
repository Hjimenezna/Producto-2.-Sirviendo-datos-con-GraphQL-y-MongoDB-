const path = require('path');
const Panel = require(path.resolve(__dirname, '../../models/Task.js'));

const taskResolver = {
    Query: {
        getTasks: async () => await Task.find(),
        getTask: async (_, { id }) => await Task.findById(id)
    },
    Mutation: {
        createTask: async (_, { title, description, panelId }) => {
            const newTask = new Task({ title, description, panelId });
            return await newTask.save();
        },
        updateTask: async (_, { id, title, description, completed }) => {
            return await Task.findByIdAndUpdate(id, { title, description, completed }, { new: true });
        },
        deleteTask: async (_, { id }) => {
            return await Task.findByIdAndDelete(id);
        }
    }
};

module.exports = taskResolver;
