const LLMAmpi = require('../handlers/LLMAmpi/LLMAmpi'); // Con minúsculas
const handleUserByState = require('./handleUserByState');

exports.processMessage = async (body) => {
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  const senderId = message?.from;

  if (message?.type === "text" || message?.type === "interactive" || message?.type === "button") {
    const receivedMessage = message.text?.body.toLowerCase() || message.interactive?.button_reply?.id || message.button?.payload || message.button?.text.toLowerCase();

    // Manejar consultas generales que no están relacionadas
    await LLMAmpi(senderId, receivedMessage); // Usar la nueva función LLMOlya

    // Manejar al usuario según su estado
    await handleUserByState(senderId, receivedMessage);
  }
};
