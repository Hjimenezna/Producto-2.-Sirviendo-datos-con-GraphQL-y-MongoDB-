const { gql } = require('apollo-server-express'); // Importa gql para definir el esquema GraphQL
const panelSchema = require('./panelSchema'); // Importa el esquema del Panel
const taskSchema = require('./taskSchema');   // Importa el esquema de Task

const rootSchema = gql`
    type Query {
        _empty: String         # Tipo Query inicial vacío para ser extendido
    }

    type Mutation {
        _empty: String         # Tipo Mutation inicial vacío para ser extendido
    }

    # Fusiona los tipos de Panel y Task en el esquema raíz
    ${panelSchema}
    ${taskSchema}
`;

module.exports = rootSchema; // Exporta el esquema raíz para integrarlo en el servidor Apollo
