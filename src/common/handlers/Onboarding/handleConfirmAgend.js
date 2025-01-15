const userService = require('../../services/userService');
const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');

const handleConfirmAgend = async (senderId, receivedMessage) => {
    console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

    if (receivedMessage.toLowerCase() !== 'si') {
        // Si el usuario no responde "Sí", se le vuelve a preguntar si desea agregarlo a la agenda
        const buttons = [
            { id: 'si', title: 'Sí' }
        ];
        await sendMessageTarget(senderId, '¿Gustas que lo agregue a tu agenda?', buttons);
        return;
    }
    const buttons = [
        { id: 'no', title: 'No, gracias' }
    ];

      // Enviar mensaje de confirmación y pregunta adicional
      const followUpMessage1 = 'Claro, te recordaré 5 días antes del evento.';

      await sendMessage(senderId, followUpMessage1);
  

    // Enviar mensaje de confirmación y pregunta adicional
    const followUpMessage = '¿Algo más en que te pueda ayudar?';

    await sendMessageTarget(senderId, followUpMessage, buttons);

    // Actualizar el estado en la BD
    await userService.updateUser(senderId, { estado: 'contactocard' });
    console.log(`Estado actualizado a 'contactocard'`);
};

module.exports = handleConfirmAgend;
