const { gql } = require('apollo-server-express'); // Importa gql para definir el esquema GraphQL

const taskSchema = gql`
    type Task {
        id: ID!                   # ID único para cada tarea
        title: String!            # Título de la tarea, obligatorio
        description: String       # Descripción de la tarea, opcional
        completed: Boolean        # Indica si la tarea está completada
        responsible: String       # Responsable de la tarea (campo agregado)
        createdAt: String         # Fecha de creación en formato de cadena
        updatedAt: String         # Fecha de actualización en formato de cadena
        panelId: ID!              # ID del panel al que pertenece la tarea
    }

    extend type Query {
        getTasks: [Task]          # Consulta para obtener todas las tareas
        getTask(id: ID!): Task    # Consulta para obtener una tarea específica por ID
    }

    extend type Mutation {
        createTask(title: String!, description: String, panelId: ID!, responsible: String!): Task # Mutación para crear una tarea, incluye responsable como campo obligatorio
        updateTask(id: ID!, title: String, description: String, completed: Boolean, responsible: String): Task # Mutación para actualizar una tarea
        deleteTask(id: ID!): Task # Mutación para eliminar una tarea por su ID
    }
`;

module.exports = taskSchema; // Exporta el esquema de Task para integrarlo en el servidor Apollo
