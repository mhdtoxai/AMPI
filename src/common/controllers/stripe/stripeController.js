const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const userService = require('../../services/userService');
const handlePaymentCompleted = require('../../handlers/Onboarding/handlePaymentCompleted');
const handleEventPaymentCompleted = require('../../handlers/Onboarding/handleEventPaymentCompleted'); // Función para el pago del evento

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Intenta verificar la firma del webhook
    event = await stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    res.send(event);
  } catch (err) {
    console.log('Error al verificar la firma del webhook:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;

      // Obtener el userId y sessionId del evento
      const userId = checkoutSessionCompleted.metadata.userId;
      const sessionId = checkoutSessionCompleted.id;
      const paymentType = checkoutSessionCompleted.metadata.paymentType; // 'membership' o 'event'

      console.log(checkoutSessionCompleted);

      try {
        // Verifica el pago y actualiza la base de datos según el tipo de pago
        if (paymentType === 'membership') {
          await handleMembershipPayment(userId, sessionId);
        } else if (paymentType === 'event') {
          await handleEventPayment(userId, sessionId);
        } else {
          console.log('Tipo de pago no reconocido:', paymentType);
        }

        console.log(`Pago verificado para el usuario ${userId}`);
      } catch (error) {
        console.error(`Error al verificar el pago del usuario ${userId}:`, error);
        res.status(500).send(`Error verificando y actualizando pago ${error.message}`);
        return;
      }

      break;

    default:
      console.log(`Tipo de evento no manejado ${event.type}`);
  }

  res.send();
}

// Función para manejar pagos de membresía
async function handleMembershipPayment(userId, sessionId) {
  try {
    const userDoc = await userService.getUser(userId);

    if (!userDoc.exists) {
      throw new Error(`Usuario con ID ${userId} no encontrado.`);
    }

    // Actualizar el estado del usuario para la membresía
    await userService.updateUser(userId, {
      estado: 'pagado',
      membresia: 'activa',
      ultimoPagoMembresia: {
        sessionId: sessionId,
        fecha: new Date(),
      },
    });

    console.log(`Estado de pago y membresía actualizados para el usuario ${userId}.`);
    // Llamar a la función handlePaymentCompleted para la membresía
    await handlePaymentCompleted(userId);
  } catch (error) {
    console.error('Error al actualizar el estado de pago de la membresía:', error);
    throw error;
  }
}

// Función para manejar pagos de evento
async function handleEventPayment(userId, sessionId) {
  try {
    const userDoc = await userService.getUser(userId);

    if (!userDoc.exists) {
      throw new Error(`Usuario con ID ${userId} no encontrado.`);
    }

    // Actualizar el estado del usuario para el evento
    await userService.updateUser(userId, {
      estado: 'pagoeventoconfirmado',
      evento: 'pagado',  // Estado específico del evento
      pagoevento: {
        sessionId: sessionId,
        fecha: new Date(),
      },
    });

    console.log(`Estado de pago y evento actualizado para el usuario ${userId}.`);
    // Llamar a la función handleEventPaymentCompleted para el evento
    await handleEventPaymentCompleted(userId);
  } catch (error) {
    console.error('Error al actualizar el estado de pago del evento:', error);
    throw error;
  }
}
