const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/database');
const typeDefs = [require('./graphql/schemas/panelSchema'), require('./graphql/schemas/taskSchema')];
const resolvers = [require('./graphql/resolvers/panelResolver'), require('./graphql/resolvers/taskResolver')];
const config = require('./config/config');

const app = express();

// Conectar a la base de datos
connectDB();

// Inicializar Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.applyMiddleware({ app });

// Iniciar el servidor
app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}${server.graphqlPath}`);
});
