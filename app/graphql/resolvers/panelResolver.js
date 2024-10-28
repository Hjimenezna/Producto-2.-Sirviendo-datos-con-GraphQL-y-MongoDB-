const path = require('path');
const Panel = require(path.resolve(__dirname, '../../models/Panel.js'));



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
            return await Panel.findByIdAndUpdate(id, { name, description }, { new: true });
        },
        deletePanel: async (_, { id }) => {
            return await Panel.findByIdAndDelete(id);
        }
    }
};

module.exports = panelResolver;
