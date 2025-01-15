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
  const confirmationMessage = '¡Perfecto! Los lugares son limitados, ¡asegura tu lugar!';

  // Enviar el mensaje de confirmación
  await sendMessage(senderId, confirmationMessage);

  // Enviar la pregunta de opciones de pago
  const paymentOptionsMessage = '¿Cómo deseas hacer el pago?';
  const paymentButtons = [
    { id: 'tarjeta', title: 'Tarjeta de Crédito' },
    { id: 'oxxo', title: 'Oxxo' },
    { id: 'spei', title: 'SPEI' }
  ];
  
  await sendMessageTarget(senderId, paymentOptionsMessage, paymentButtons);
  // Actualizar el estado a 'metodopagoevento'
  await userService.updateUser(senderId, { estado: 'metodopagoevento' });
  console.log(`Estado actualizado a metodopagoevento`);
};

// Función de retraso (si es necesario)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = handleEventSelect;
