const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // 1. Récupérer l'URI de connexion depuis le fichier .env
        const mongoURI = process.env.MONGO_URI;

        // 2. Tenter la connexion
        await mongoose.connect(mongoURI);

        console.log('MongoDB connecté avec succès !');

    } catch (err) {
        // Gérer les erreurs de connexion (mauvais mot de passe, adresse incorrecte, etc.)
        console.error("Échec de la connexion à MongoDB :", err.message);
        // Quitter l'application en cas d'échec de la connexion initiale
        process.exit(1); 
    }
};

module.exports = connectDB;