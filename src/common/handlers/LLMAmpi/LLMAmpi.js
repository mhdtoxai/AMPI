const axios = require('axios');
const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const userService = require('../../services/userService'); // Importa el servicio para consultar el usuario

const LLMAmpi = async (senderId, receivedMessage) => {
  // Consultar el estado del usuario
  const userDoc = await userService.getUser(senderId);

  if (!userDoc.exists) {
    console.log(`Usuario no encontrado: ${senderId}`);
    return false;
  }

  const userData = userDoc.data();
  const estadoUsuario = userData.estado;

  // Lista de estados excluidos
  const estadosExcluidos = [
    'bienvenida',
    'solicitudcorreo',
    'confirmarsolicitudcodigo',
    'solicitudcodigo',
    'credencial',
    'aceptarayuda',
    'metodopago',
    'tdc',
    'pagopendiente',
    'pagado',
    'pagogracias',
    'beneficios',
    'eventos',
    'eventoseleccion',
    'metodopagoevento',
    'cantidadboletos',
    'pagopendienteevento',
    'pagoevconfirmado',
    'correoboleto',
    'confirmaragenda',
    'contactocard',


  ];

  // Si el estado está en la lista de estados excluidos, no ejecutamos la API
  if (estadosExcluidos.includes(estadoUsuario)) {
    console.log(`Estado ${estadoUsuario} excluido. No se ejecutará LLMOlya.`);
    return false;
  }

  const url = 'https://api-ampi.saptiva.com/ampi';
  const token = 'ampiQ5zaqnM1q8UqG4kyC-5vKwBQ/PtQZpm0hjLwh9QjGUrzzzvyfw.KMuQ!qbJNCrgyguPq8t1gVWPRW5QcjU?0dgEWET.1K35En?3S-3P8PX..s0GKj!1i2R7VwttxykX2D3TpnnJZ-kz5B0rknzBk.?5/KABVcvOFJvl0a1YhX6nVLN8f3kp-1Zh62O1I/0weAW?02N43!iEgpm1-7xP5jY58GuL80RYj.3cHhPnNid/fIo1qkVJYgXDL!b.0';

  const body = {
    from: senderId,
    query: receivedMessage,
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const botResponse = response.data.response;

    console.log('Respuesta de la API Olya:', botResponse);

    // Enviar el mensaje de respuesta al usuario
    await sendMessage(senderId, botResponse);
    return true;
  } catch (error) {
    console.error('Error al llamar a la API:', error);
    return false; // Retornar false en caso de error
  }
};

module.exports = LLMAmpi;

