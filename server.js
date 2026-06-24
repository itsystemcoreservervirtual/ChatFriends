const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    maxHttpBufferSize: 1e8 // Permite el envío de imágenes pesadas sin restricciones
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MÓDULO DE WEBSOCKETS (Lógica en tiempo real)
io.on('connection', (socket) => {
    console.log('Usuario conectado al ecosistema de chat');

    // Registro de sesión activa del usuario
    socket.on('user-online', (userId) => {
        socket.userId = userId;
        socket.join(userId); // Sala privada para recibir alertas directas
    });

    // --- CHATS PRIVADOS, BLOQUEOS Y ELIMINACIONES ---
    socket.on('private-message', ({ to, text, image }) => {
        // Aquí se valida en la base de datos si el usuario 'to' tiene bloqueado a 'socket.userId'
        // Si no está bloqueado, se transmite el mensaje/imagen sin límites de caracteres
        io.to(to).to(socket.userId).emit('new-message', {
            sender: socket.userId,
            text,
            image,
            timestamp: new Date()
        });
    });

    socket.on('block-user', ({ targetUserId }) => {
        // Lógica para añadir targetUserId a la lista de bloqueados del emisor
        socket.emit('user-blocked-success', { targetUserId });
    });

    socket.on('delete-message', ({ messageId, mode }) => {
        if (mode === 'everyone') {
            // Elimina el mensaje físicamente de la base de datos y lo borra en ambos clientes
            io.emit('message-deleted-everyone', { messageId });
        } else {
            // 'for_me': Agrega el ID del usuario emisor a un arreglo de 'hiddenFor' en el registro del mensaje
            socket.emit('message-deleted-me', { messageId });
        }
    });

    // --- GESTIÓN DE GRUPOS PROFESIONALES ---
    socket.on('join-group', (groupId) => {
        socket.join(groupId);
    });

    socket.on('group-message', ({ groupId, text, image }) => {
        io.to(groupId).emit('new-group-message', {
            groupId,
            sender: socket.userId,
            text,
            image,
            timestamp: new Date()
        });
    });

    socket.on('add-member', ({ groupId, newMemberId }) => {
        // Validación en DB de que el emisor sea administrador del grupo
        io.to(groupId).emit('member-added', { groupId, newMemberId });
    });

    socket.on('kick-member', ({ groupId, targetMemberId }) => {
        // Remueve al integrante y le notifica que ya no pertenece al canal
        io.to(groupId).emit('member-kicked', { groupId, targetMemberId });
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// Cambiar por tu URI de MongoDB Atlas cuando la crees
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/chat_profesional";
mongoose.connect(MONGO_URI)
    .then(() => console.log('Base de Datos MongoDB Conectada exitosamente.'))
    .catch(err => console.error('Error de conexión a DB:', err));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor Profesional corriendo en el puerto ${PORT}`));