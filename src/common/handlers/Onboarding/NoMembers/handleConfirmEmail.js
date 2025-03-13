const userService = require('../../../services/userService');
const sendMessageTarget = require('../../../services/Wp-Envio-Msj/sendMessageTarget');
const sendMessage = require('../../../services/Wp-Envio-Msj/sendMessage');

const handleConfirmEmail = async (senderId, receivedMessage) => {
    console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

    if (receivedMessage !== 'correcto') {
        // Si el usuario no responde "Sí", se le pregunta si esta de acuerdo con el codigo
        const buttons = [
            { id: 'correcto', title: 'Es Correcto' }
        ];
        await sendMessageTarget(senderId, 'Es Correcto?', buttons);
        return;
    }

    // Actualizar el estado en la BD
    await userService.updateUser(senderId, { estado: 'no_member_help' });
    console.log(`Estado actualizado a 'no_member_help'`);

    const info = '¡Muchas Gracias! En breve un miembro de nuestro equipo se comunicará contigo.';

    await sendMessage(senderId, info);
    
    const buttons = [
        { id: 'si', title: 'Sí' },
        { id: 'no', title: 'No' }
    ];
    const interested = '¿Hay algo más en lo que pueda ayudarte?';

    await sendMessageTarget(senderId, interested, buttons);
};


module.exports = handleConfirmEmail;