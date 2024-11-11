const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { mergeTypeDefs } = require("@graphql-tools/merge");

const config = require("./config/config"); // Asegúrate de importar tu archivo de configuración
const rootSchema = require("./graphql/schemas/rootSchema");
const panelSchema = require("./graphql/schemas/panelSchema");
const taskSchema = require("./graphql/schemas/taskSchema");
const resolvers = require("./graphql/resolvers/resolvers");

// Une todos los esquemas en un solo esquema de GraphQL
const typeDefs = mergeTypeDefs([rootSchema, panelSchema, taskSchema]);
const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startServer() {
  try {
    // Conecta a MongoDB
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado a MongoDB");

    const server = new ApolloServer({ schema });
    await server.start();

    const app = express();

    // Configura la carpeta de archivos estáticos
    app.use(express.static(path.join(__dirname, "Producto1-proyecto")));

    // Ruta para servir el archivo index.html cuando se accede a la raíz "/"
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "Producto1-proyecto", "index.html"));
    });

    // Configura Apollo Server con Express
    server.applyMiddleware({ app });

    // Inicia el servidor en el puerto configurado
    app.listen({ port: config.PORT }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${config.PORT}${server.graphqlPath}`
      )
    );
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

startServer();
