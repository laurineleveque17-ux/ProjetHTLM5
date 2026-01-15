const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        await mongoose.connect(mongoURI);

        console.log('MongoDB connecté avec succès !');

    } catch (err) {
        console.error("Échec de la connexion à MongoDB :", err.message);
        process.exit(1); 
    }
};

module.exports = connectDB;