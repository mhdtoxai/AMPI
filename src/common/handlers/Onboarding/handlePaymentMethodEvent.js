const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');
const userService = require('../../services/userService');


const handlePaymentMethodEvent = async (senderId, receivedMessage) => {
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

   // Enviar la pregunta de opciones de pago
   const ticketOptionsMessage = '¿Cuantos boletos requieres?';
   const boletosButtons = [
     { id: '1', title: '1' },
     { id: '2', title: '2' },
     { id: '3', title: '3 o mas' }
   ];
   
   await sendMessageTarget(senderId, ticketOptionsMessage, boletosButtons);

  // Actualizar el estado a 'cantidadboletos' para indicar que el pago está en proceso
  await userService.updateUser(senderId, { estado: 'cantidadboletos' });
  console.log(`Estado actualizado a 'cantidadboletos'`);


};


module.exports = handlePaymentMethodEvent;
