const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Usar tu clave secreta de Stripe
const userService = require('../../services/userService');
const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');

const handlePaymentPendient = async (senderId) => {
  try {
    // Crear una sesión de pago con los detalles proporcionados
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Tipos de pago permitidos (en este caso tarjeta)
      line_items: [
        {
          price_data: {
            currency: 'mxn', // Moneda en pesos mexicanos
            product_data: {
              name: 'Suscribirse a Membresía AMPI 2025', // Nombre del producto
              description: 'Pago Anual', // Descripción del producto
              images: ['https://firebasestorage.googleapis.com/v0/b/dtox-ai-a6f48.appspot.com/o/pago.png?alt=media&token=7a0e7234-65a2-450c-a3fc-313ef2fe6ff4'], // URL de la nueva imagen del producto
            },
            unit_amount: 399000, // Precio en centavos (1500 MXN)
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: senderId, // ID del usuario para referencia
        paymentType: 'membership'  // 'membership' o 'event'
      },
      mode: 'payment', // Modo de pago
      success_url: 'https://wa.me/5214772912824', // URL para redirigir después de un pago exitoso
      cancel_url: 'https://wa.me/5214772912824', // URL para redirigir después de un pago cancelado
    });

    // Crear el mensaje con la URL de Stripe para el pago
    const paymentMessage = `💳 🔐 Tu liga única segura STRIPE para pagos: ${session.url}`;

    // Enviar el mensaje con el enlace de pago al usuario
    await sendMessage(senderId, paymentMessage);

    // Actualizar el estado del usuario y el estado de membresía
    await userService.updateUser(senderId, { membresia: 'inactiva' });

    console.log('Mensaje de pago enviado y estado de membresía actualizado');
  } catch (error) {
    console.error('Error al manejar el pago pendiente:', error);
  }
};

module.exports = handlePaymentPendient;
