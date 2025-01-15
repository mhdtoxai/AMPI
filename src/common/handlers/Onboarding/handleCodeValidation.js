const userService = require('../../services/userService');
const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');

const handleCodeValidation = async (senderId, receivedMessage) => {
  console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

  // Convertir el código recibido a mayúsculas
  const userCode = receivedMessage.toUpperCase();

  // Comparar el código recibido con el esperado (en mayúsculas)
  const validCode = "AAA123"; // El código correcto con mayúsculas y números

  if (userCode !== validCode) {
    // Si el código no es válido, se le pide que lo intente nuevamente
    const invalidCodeMessage = 'El código ingresado no es válido. Por favor, ingresa tu código correcto.';
    await sendMessage(senderId, invalidCodeMessage);
    return;
  }

  // Si el código es válido, actualizar el estado a 'credencial'
  await userService.updateUser(senderId, { estado: 'credencial' });
  console.log(`Estado actualizado a 'credencial'`);

  // Enviar mensaje confirmando que el estado fue actualizado
  const successMessage = 'Muchas gracias, tu cuenta ha sido validada exitosamente.';
  await sendMessage(senderId, successMessage);
  // Enviar mensaje confirmando que el estado fue actualizado
  const successHelpMessage = '¿En qué te puedo ayudar hoy Manuel?';
  await sendMessage(senderId, successHelpMessage);

};

module.exports = handleCodeValidation;
