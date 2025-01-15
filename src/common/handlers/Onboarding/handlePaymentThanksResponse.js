const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');
const userService = require('../../services/userService');

const handlePaymentThanksResponse = async (senderId, receivedMessage) => {
  console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

  // Verificar si el mensaje contiene "gracias" (ignorar mayúsculas/minúsculas)
  if (receivedMessage.toLowerCase() !== 'gracias') {
    // Si el mensaje no es "gracias", volver a enviar la tarjeta de "Gracias"
    const retryMessage = 'Por favor confirma.';
    const buttons = [
      { id: 'gracias', title: 'Gracias' }  // Botón de respuesta corto
    ];
    await sendMessageTarget(senderId, retryMessage, buttons);
    return;
  }

  // Enviar los mensajes indicados si el usuario seleccionó "Gracias"
  const responseMessage1 = 'Nada que agradecer, estoy para servirte.';
  const responseMessage2 = '¿Algo más en que te pueda ayudar?';

  await sendMessage(senderId, responseMessage1);
  await sendMessage(senderId, responseMessage2);

  // Esperar un breve momento antes de enviar el siguiente mensaje
  await delay(1000);

  // Enviar la tarjeta con el mensaje de beneficios
  const benefitsMessage = 'Puedes consultar tus beneficios como miembro';
  const buttons = [
    { id: 'beneficios', title: 'Beneficios' }  // Botón de respuesta corto
  ];

  await sendMessageTarget(senderId, benefitsMessage, buttons);

  // Actualizar el estado a 'beneficios'
  await userService.updateUser(senderId, { estado: 'beneficios' });
  console.log(`Estado actualizado a 'beneficios'`);
};

// Función de retraso
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = handlePaymentThanksResponse;
