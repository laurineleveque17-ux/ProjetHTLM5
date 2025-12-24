// Importe les dépendances
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const commentsRoutes = require('./routes/comments');
const reactionsRoutes = require('./routes/reactions');
const articlesRoutes = require('./routes/articles');
const connectDB = require('./db');

// Charge les variables d'environnement du fichier .env
dotenv.config();

//Connexion à la base de données au démarrage du serveur
connectDB();

// Crée l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware : Permet à Express de lire le corps des requêtes en JSON
app.use(express.json());
app.use(cors());

// Middleware : Permet à Express d'utiliser les routes d'authentification
// Toutes les routes définies dans auth.js seront préfixées par '/api/auth'
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/reactions', reactionsRoutes);
app.use('/api/articles', articlesRoutes);

// Route de test simple (bien pour vérifier que le serveur tourne)
app.get('/', (req, res) => {
    res.send('Serveur Backend opérationnel.');
});

// Démarre le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;   