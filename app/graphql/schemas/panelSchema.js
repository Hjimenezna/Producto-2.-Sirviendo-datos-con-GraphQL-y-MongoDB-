const { gql } = require('apollo-server-express'); // Importa gql para definir el esquema GraphQL

const panelSchema = gql`
    type Panel {
        id: ID!                 # ID único para cada panel
        name: String!           # Nombre del panel, obligatorio
        description: String     # Descripción del panel, opcional
        createdAt: String       # Fecha de creación del panel en formato de cadena
        updatedAt: String       # Fecha de actualización del panel en formato de cadena
        tasks: [Task]           # Lista de tareas asociadas al panel
    }

    extend type Query {
        getPanels: [Panel]      # Consulta para obtener todos los paneles
        getPanel(id: ID!): Panel # Consulta para obtener un panel específico por ID
    }

    extend type Mutation {
        createPanel(name: String!, description: String): Panel  # Mutación para crear un nuevo panel
        updatePanel(id: ID!, name: String, description: String): Panel # Mutación para actualizar un panel
        deletePanel(id: ID!): Panel  # Mutación para eliminar un panel por su ID
    }
`;

module.exports = panelSchema; // Exporta el esquema para integrarlo en el servidor Apollo
