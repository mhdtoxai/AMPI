const userService = require('../../../services/userService');
const sendMessageTarget = require('../../../services/Wp-Envio-Msj/sendMessageTarget');
const sendMessage = require('../../../services/Wp-Envio-Msj/sendMessage');

const handleInfomember = async (senderId, receivedMessage) => {
    console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

    if (receivedMessage !== 'si') {
        // Si el usuario no responde "Sí", se le pregunta si esta de acuerdo con el codigo
        const buttons = [
            { id: 'si', title: 'Sí' }
        ];
        await sendMessageTarget(senderId, '¿Te interesa afiliarte? Tenemos promociones para nuevos miembros :)', buttons);
        return;
    }

    // Actualizar el estado en la BD
    await userService.updateUser(senderId, { estado: 'no_member_name' });
    console.log(`Estado actualizado a 'no_member_name'`);
        

    const excelent = 'Excelente, sólo requiero algunos datos para que nuestra área de miembros te contacte.';
    const name = 'Indicame tu nombre completo';

    
    await sendMessage(senderId, excelent);
    await sendMessage(senderId, name);
};
module.exports = handleInfomember;