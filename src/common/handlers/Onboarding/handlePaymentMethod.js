const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');
const userService = require('../../services/userService');
const handlePaymentPendient = require('../../handlers/Onboarding/handlePaymentPendient'); // Importar la función


const handlePaymentMethod = async (senderId, receivedMessage) => {
  console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

  // Verificar si el usuario seleccionó "Tarjeta de Crédito"
  if (receivedMessage !== 'tarjeta') {
    // Si no seleccionó "Tarjeta de Crédito", volver a enviar la tarjeta con opciones
    const buttons = [
      { id: 'tarjeta', title: 'Tarjeta de Crédito' },
      { id: 'oxxo', title: 'Oxxo' },
      { id: 'spei', title: 'SPEI' }
    ];
    const retryMessage = 'Por el momento solo contamos pago con Tarjerta de Crédito';
    await sendMessageTarget(senderId, retryMessage, buttons);
    return;
  }

  // Si seleccionó "Tarjeta de Crédito", proceder con el siguiente paso
  const paymentConfirmationMessage = '¡Excelente! Ahora procederemos con el pago mediante tarjeta de crédito.';
  
  await sendMessage(senderId, paymentConfirmationMessage);

  // Actualizar el estado a 'pagopendiente' para indicar que el pago está en proceso
  await userService.updateUser(senderId, { estado: 'pagopendiente' });
  console.log(`Estado actualizado a 'pagopendiente'`);

  await handlePaymentPendient(senderId);
};


module.exports = handlePaymentMethod;
