const mongoose = require('mongoose');

const panelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    tasks: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Task' 
    }]
});

// Exporta el modelo directamente
module.exports = mongoose.model('Panel', panelSchema);
