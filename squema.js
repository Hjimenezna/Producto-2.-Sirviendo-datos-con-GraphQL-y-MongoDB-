//utilizaremos un paquete gql para trabajar con GraphQL y graphql-tools

const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    hello: String
  }

  type Panel {
    _id: ID!
    title: String!
    subtitle: String
    description: String
    tasks: [Task]
  }

  type Task {
    _id: ID!
    title: String!
    status: String!
    panel: Panel
  }

  type Query {
    getPanels: [Panel]
    getPanelById(panelId: ID!): Panel
    getTasks: [Task]
    getTaskById(taskId: ID!): Task
  }
`;

module.exports = { typeDefs: typeDefs };
