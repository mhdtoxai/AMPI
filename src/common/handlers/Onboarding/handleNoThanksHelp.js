const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');
const userService = require('../../services/userService');

const handleNoThanksHelp = async (senderId, receivedMessage) => {
  console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

  // Verificar si el mensaje es exactamente 'no'
  if (receivedMessage !== 'no') {
    // Si el mensaje no es 'no', volver a enviar la tarjeta de "No, gracias"
    const buttons = [
      { id: 'no', title: 'No, gracias' }
    ];
    const retryMessage = '¿Quieres renovarla en este momento?';
    await sendMessageTarget(senderId, retryMessage, buttons);
    return;
  }

  // Enviar los mensajes indicados si el usuario seleccionó "No, gracias"
  const responseMessage1 = 'Estaré aquí por si me necesitas.';
  const responseMessage2 = 'Por cierto, te recuerdo que tu membresía está por vencer en 28 días.';
  const followUpMessage = '¿Quieres renovarla en este momento?';

  await sendMessage(senderId, responseMessage1);
  await sendMessage(senderId, responseMessage2);

  // Esperar un breve momento antes de enviar el siguiente mensaje
  await delay(2000);

  await sendMessageTarget(senderId, followUpMessage, [{ id: 'si', title: 'Sí' }]);

  // Actualizar el estado a 'metodopago'
  await userService.updateUser(senderId, { estado: 'metodopago' });
  console.log(`Estado actualizado a 'metodopago'`);
};

// Función de retraso
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = handleNoThanksHelp;
