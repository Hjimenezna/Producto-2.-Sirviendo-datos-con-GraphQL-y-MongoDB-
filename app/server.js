const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs } = require('@graphql-tools/merge');

// Importa los esquemas
const rootSchema = require('./graphql/schemas/rootSchema');
const panelSchema = require('./graphql/schemas/panelSchema');
const taskSchema = require('./graphql/schemas/taskSchema');

// Une todos los esquemas en un solo esquema de GraphQL
const typeDefs = mergeTypeDefs([rootSchema, panelSchema, taskSchema]);
const schema = makeExecutableSchema({ typeDefs });

async function startServer() {
    const server = new ApolloServer({ schema });
    await server.start(); // Asegúrate de que el servidor Apollo esté iniciado antes de aplicar el middleware

    const app = express();
    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
}

startServer().catch(error => {
    console.error("Error starting the server:", error);
});
