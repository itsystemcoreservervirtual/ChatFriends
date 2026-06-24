const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Render usará la variable de entorno MONGO_URI. Si estás en local, usa la base de datos local.
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chat_profesional');
        console.log(`Base de Datos Conectada: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error de conexión a la DB: ${error.message}`);
        process.exit(1); // Detiene el servidor si no se puede conectar
    }
};

module.exports = connectDB;