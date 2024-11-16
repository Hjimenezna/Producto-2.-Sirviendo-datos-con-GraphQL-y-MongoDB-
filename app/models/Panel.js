// models/Panel.js
const mongoose = require('mongoose'); // Importa mongoose para definir el esquema de datos

const panelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true         // Nombre del panel, campo obligatorio
    },
    description: {
        type: String,
        default: ''            // Descripción del panel, opcional con valor predeterminado vacío
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'            // Array de IDs de tareas asociadas al panel, referenciando el modelo Task
    }]
}, {
    timestamps: true            // Activa automáticamente createdAt y updatedAt en el esquema
});

module.exports = mongoose.model('Panel', panelSchema); // Exporta el modelo Panel para usarlo en la base de datos
