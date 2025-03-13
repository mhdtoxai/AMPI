const userService = require('../../../services/userService');
const sendMessageTarget = require('../../../services/Wp-Envio-Msj/sendMessageTarget');
const sendMessage = require('../../../services/Wp-Envio-Msj/sendMessage');

const handleMemberHelp = async (senderId, receivedMessage) => {
    console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

    if (receivedMessage.toLowerCase() === 'si' || receivedMessage.toLowerCase() === 'no') {
        // Si el usuario responde "Sí" o "No", actualizar estado a "member_pendient"
        await userService.updateUser(senderId, { estado: 'member_pendient' });
        console.log(`Estado actualizado a 'member_pendient'`);

        await sendMessage(senderId, 'Entendido, estaré aquí por si me necesitas.');
        return;
    }

    // Si el mensaje no es "Sí" ni "No", volver a preguntar
    const buttons = [
        { id: 'si', title: 'Sí' },
        { id: 'no', title: 'No' }
    ];
    await sendMessageTarget(senderId, '¿Hay algo más en lo que pueda ayudarte?', buttons);
};

module.exports = handleMemberHelp;
