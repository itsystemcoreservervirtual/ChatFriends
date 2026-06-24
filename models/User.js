const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // No permite que dos amigos usen el mismo nombre
        trim: true
    },
    password: {
        type: String,
        required: true // Se guardará encriptada en la base de datos
    },
    avatar: {
        type: String, // Aquí se guarda la ruta o link de la foto de perfil
        default: 'https://via.placeholder.com/150' // Foto por defecto si no suben una
    },
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Lista de IDs de usuarios que este usuario ha bloqueado
    }]
}, {
    timestamps: true // Guarda automáticamente la fecha de creación de la cuenta
});

module.exports = mongoose.model('User', userSchema);