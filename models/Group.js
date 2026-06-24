const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String, // URL de la foto de perfil del grupo
        default: 'https://via.placeholder.com/150' // Imagen por defecto
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // El usuario que creó el grupo y tiene los permisos de administración
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Lista de todos los amigos que pertenecen a este grupo
    }]
}, {
    timestamps: true // Registra la fecha exacta en la que se creó el grupo
});

module.exports = mongoose.model('Group', groupSchema);