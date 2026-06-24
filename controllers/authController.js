const User = require('../models/User');
const bcrypt = require('bcryptjs');

// REGISTRO DE USUARIOS
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        let userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ msg: 'El nombre de usuario ya está ocupado' });

        // Encriptar la contraseña de forma segura
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ msg: 'Usuario registrado con éxito', userId: newUser._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// INICIAR SESIÓN
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

        res.json({ msg: 'Acceso concedido', userId: user._id, username: user.username, avatar: user.avatar });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// BORRAR CUENTA PERMANENTEMENTE
exports.deleteAccount = async (req, res) => {
    try {
        const { userId } = req.body;
        await User.findByIdAndDelete(userId);
        res.json({ msg: 'Cuenta eliminada permanentemente del sistema' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
