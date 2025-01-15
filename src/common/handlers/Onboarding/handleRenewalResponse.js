const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');
const userService = require('../../services/userService');

const handleRenewalResponse = async (senderId, receivedMessage) => {
  console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

  // Verificar si el mensaje es exactamente 'si'
  if (receivedMessage !== 'si') {
    // Si el mensaje no es 'si', volver a enviar la tarjeta de "Sí"
    const buttons = [
      { id: 'si', title: 'Sí' }
    ];
    const retryMessage = '¿Quieres renovarla en este momento?';
    await sendMessageTarget(senderId, retryMessage, buttons);
    return;
  }


  // Enviar la pregunta de opciones de pago
  const paymentOptionsMessage = '¿Cómo deseas hacer el pago?';
  const paymentButtons = [
    { id: 'tarjeta', title: 'Tarjeta de Crédito' },
    { id: 'oxxo', title: 'Oxxo' },
    { id: 'spei', title: 'SPEI' }
  ];
  
  await sendMessageTarget(senderId, paymentOptionsMessage, paymentButtons);

  // Actualizar el estado a 'metodopago' para iniciar el proceso de pago
  await userService.updateUser(senderId, { estado: 'tdc' });
  console.log(`Estado actualizado a 'tdc'`);

};


module.exports = handleRenewalResponse;
