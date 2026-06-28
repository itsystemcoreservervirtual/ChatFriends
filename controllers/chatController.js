const Message = require('../models/Message');
const User = require('../models/User');


exports.blockUser = async (req, res) => {
    try {
        const { myUserId, targetUserId } = req.body;
        await User.findByIdAndUpdate(myUserId, { $addToSet: { blockedUsers: targetUserId } });
        res.json({ msg: 'Usuario bloqueado con éxito' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.unblockUser = async (req, res) => {
    try {
        const { myUserId, targetUserId } = req.body;
        await User.findByIdAndUpdate(myUserId, { $pull: { blockedUsers: targetUserId } });
        res.json({ msg: 'Usuario desbloqueado con éxito' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteMessage = async (req, res) => {
    try {
        const { messageId, userId, mode } = req.body;

        if (mode === 'everyone') {
          
            await Message.findByIdAndUpdate(messageId, { isDeletedEveryone: true, text: 'Este mensaje fue eliminado' });
        } else {
            await Message.findByIdAndUpdate(messageId, { $addToSet: { hiddenFor: userId } });
        }
        res.json({ msg: 'Proceso de borrado completado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
