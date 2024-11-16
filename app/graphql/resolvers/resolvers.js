const Task = require('../../models/Task');
const Panel = require('../../models/Panel');

const taskResolver = require('./taskResolver'); // Asegúrate de la ruta correcta
const panelResolver = require('./panelResolver');

const resolvers = {
    Query: {
        ...panelResolver.Query, // Importa todas las queries definidas en panelResolver
        ...taskResolver.Query, // Importa todas las queries definidas en taskResolver
    },
    Mutation: {
        ...panelResolver.Mutation, // Importa todas las mutations definidas en panelResolver
        ...taskResolver.Mutation, // Importa todas las mutations definidas en taskResolver
    },
    Panel: panelResolver.Panel // Define resolvers personalizados para el tipo Panel, como obtener tareas asociadas
};

module.exports = resolvers;
