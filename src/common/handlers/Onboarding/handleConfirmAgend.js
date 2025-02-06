const userService = require('../../services/userService');
const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');
const sendContactMessage = require('../../services/Wp-Envio-Msj/sendContactMessage');
const handleConfirmAgend = async (senderId, receivedMessage) => {
    console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

    if (receivedMessage.toLowerCase() !== 'no') {
        // Si el usuario no responde "no", se le vuelve a preguntar si desea agregarlo a la agenda
        const buttons = [
            { id: 'no', title: 'No gracias' }
        ];
        await sendMessageTarget(senderId, '¿Algo más en que te pueda ayudar?', buttons);
        return;
    }
    
// Enviar mensaje de agradecimiento final
const thankYouMessage1 = 'Gracias a ti, cualquier cosa que necesites estaré 24/7 a tu disposición.';
const thankYouMessage2 = 'No olvides compartir mi contacto con otros miembros AMPI para que sepan de mí.';

await sendMessage(senderId, thankYouMessage1);
await sendMessage(senderId, thankYouMessage2);
await sendContactMessage(senderId);


// Actualizar el estado en la BD a 'finalizado' si es necesario
await userService.updateUser(senderId, { estado: 'finalizado' });
console.log(`Estado actualizado a 'finalizado'`);
};


module.exports = handleConfirmAgend;
