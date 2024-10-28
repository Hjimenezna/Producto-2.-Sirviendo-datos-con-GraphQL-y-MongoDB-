const { gql } = require('apollo-server-express');

const taskSchema = gql`
    type Task {
        id: ID!
        title: String!
        description: String
        completed: Boolean
        createdAt: String
        updatedAt: String
        panelId: ID!
    }

    extend type Query {
        getTasks: [Task]
        getTask(id: ID!): Task
    }

    extend type Mutation {
        createTask(title: String!, description: String, panelId: ID!): Task
        updateTask(id: ID!, title: String, description: String, completed: Boolean): Task
        deleteTask(id: ID!): Task
    }
`;

module.exports = taskSchema;
