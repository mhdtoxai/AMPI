const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');
const userService = require('../../services/userService');

const handleEventSelect = async (senderId, receivedMessage) => {
  console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

  // Verificar si el mensaje es exactamente "evento_carlos_slim"
  if (receivedMessage.toLowerCase() !== 'eventocslim') {
    // Si el mensaje no es "evento_carlos_slim", volver a enviar la tarjeta con el mismo botón
    const retryMessage = '¿Te gustaría asistir al evento de Carlos Slim?';
    const buttons = [
      { id: 'eventocslim', title: 'Evento Carlos Slim' }
    ];
    await sendMessageTarget(senderId, retryMessage, buttons);
    return;
  }

  // Mensaje de confirmación para el evento
  const confirmationMessage = 'Bien pensado, es un evento que vale la pena.';
  const price = 'Para precio de miembro y más beneficios ingresar a tu perfil de WeChamber en la siguiente liga:';
  const url = 'https://wechamber.mx/member/eventMicrosite/6791b6d768d9a974b01ef20f';

  
  

  // Enviar el mensaje de confirmación
  await sendMessage(senderId, confirmationMessage);
  await sendMessage(senderId, price);
  await sendMessage(senderId, url);

  // Enviar la pregunta de opciones de pago
  const help = '¿Algo más en que te pueda ayudar?';
  const helpButtons = [
    { id: 'no', title: 'No, gracias' },

  ];
  
  await sendMessageTarget(senderId, help, helpButtons);
  // Actualizar el estado a 'confirmarevento'
  await userService.updateUser(senderId, { estado: 'confirmarevento' });
  console.log(`Estado actualizado a confirmarevento`);
};

// Función de retraso (si es necesario)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = handleEventSelect;
