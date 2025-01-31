const db = require('../database/firebaseConfig'); // Importa db desde tu archivo de configuración

// Función para borrar el registro del usuario
async function handleReset(senderId) {
  try {
    const userRef = db.collection('usuariosampi').doc(senderId); // Referencia al documento del usuario
    await userRef.delete(); // Borra solo el documento del usuario
    console.log(`Registro del usuario ${senderId} borrado correctamente.`);
  } catch (error) {
    console.error(`Error al borrar el registro del usuario ${senderId}:`, error);
  }
}

module.exports = handleReset;