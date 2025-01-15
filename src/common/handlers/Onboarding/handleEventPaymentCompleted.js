const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');
const userService = require('../../services/userService');
const sendImageMessage = require('../../services/Wp-Envio-Msj/sendImageMessage');


const handleEventPaymentCompleted = async (senderId) => {
  // Confirmación del pago
  const paymentConfirmationMessage = 'Felicidades, estás confirmado en el evento.';

  const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/dtox-ai-a6f48.appspot.com/o/Boleto.JPG?alt=media&token=cbe42571-4771-4f40-a37e-60f60cad5cb2';
  // Enviar mensaje preguntando si necesita más ayuda
  await sendImageMessage(senderId, imageUrl); // Envía la URL de la imagen como un mensaje
  await delay(2000);


  // Mensaje con detalles sobre la membresía activa
  const membershipMessage = 'Quieres que te mande la factura de esta compra a tu correo electrónico??';

  // Tarjeta con botones
  const buttons = [
    { id: 'si', title: 'Si' },
  ];

  // Enviar el primer mensaje de confirmación
  await sendMessage(senderId, paymentConfirmationMessage);
  // Enviar la tarjeta con el botón "Gracias"
  await sendMessageTarget(senderId, membershipMessage, buttons);

  await userService.updateUser(senderId, { estado: 'correoboleto' });
  console.log(`Estado actualizado a correoboleto`);

};
// Función de retraso
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


module.exports = handleEventPaymentCompleted;
