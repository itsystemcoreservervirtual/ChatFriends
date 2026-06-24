const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Quién envía el mensaje
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Quién lo recibe (si es chat privado)
        required: false
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group', // A qué grupo pertenece (si es chat grupal)
        required: false
    },
    text: {
        type: String, // Texto del mensaje sin límite de caracteres
        trim: true
    },
    image: {
        type: String, // Aquí se guarda la URL de la imagen si envían una
        required: false
    },
    hiddenFor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Lista de usuarios que borraron el mensaje "para mí"
    }],
    isDeletedEveryone: {
        type: Boolean,
        default: false // Cambia a true si borran el mensaje "para todos"
    }
}, {
    timestamps: true // Guarda la fecha y hora exacta del envío del mensaje o foto
});

module.exports = mongoose.model('Message', messageSchema);