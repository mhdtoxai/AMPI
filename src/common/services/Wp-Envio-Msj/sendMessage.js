// sendMessage.js

const axios = require('axios');

const GRAPH_API_TOKEN = process.env.GRAPH_API_TOKEN;

const sendMessage = async (recipientId, messageText) => {
  const requestBody = {
    messaging_product: "whatsapp",
    to: recipientId,
    text: { body: messageText }
  };

  try {
    const response = await axios.post(`https://graph.facebook.com/v22.0/567129353151182/messages`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GRAPH_API_TOKEN}`
      },
    });

    console.log('Mensaje enviado:', response.data);
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.message);
    console.error('Detalles del error:', error.response.data);
  }
};

module.exports = sendMessage;
