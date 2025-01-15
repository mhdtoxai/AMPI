const userService = require('../../services/userService');
const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendContactMessage = require('../../services/Wp-Envio-Msj/sendContactMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');

const handleFinalOnborading = async (senderId, receivedMessage) => {
  console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

  if (receivedMessage.toLowerCase() !== 'no') {
    // Si el usuario no responde "No, gracias", se le vuelve a mostrar la opción
    const buttons = [
      { id: 'no', title: 'No, gracias' }
    ];
    const retryMessage = '¿Algo más en que te pueda ayudar?';

    await sendMessageTarget(senderId, retryMessage, buttons);
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

module.exports = handleFinalOnborading;
