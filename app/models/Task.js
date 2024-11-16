// models/Task.js
const mongoose = require('mongoose'); // Importa mongoose para definir el esquema de datos

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true         // Título de la tarea, campo obligatorio
    },
    description: {
        type: String,
        default: ''            // Descripción de la tarea, opcional con valor predeterminado vacío
    },
    completed: {
        type: Boolean,
        default: false         // Indica si la tarea está completada, con valor predeterminado en falso
    },
    responsible: {
        type: String,
        required: true         // Responsable de la tarea, campo obligatorio
    },
    createdAt: {
        type: Date,
        default: Date.now      // Fecha de creación de la tarea, por defecto la fecha actual
    },
    updatedAt: {
        type: Date,
        default: Date.now      // Fecha de última actualización de la tarea, por defecto la fecha actual
    },
    panelId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Panel',          // ID del panel al que pertenece la tarea, referencia al modelo Panel
        required: true
    }
});

module.exports = mongoose.model('Task', taskSchema); // Exporta el modelo Task para usarlo en la base de datos
