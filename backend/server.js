const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const commentsRoutes = require('./routes/comments');
const reactionsRoutes = require('./routes/reactions');
const articlesRoutes = require('./routes/articles');
const connectDB = require('./db');

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/reactions', reactionsRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/articles', require('./routes/articles'));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Serveur Backend opérationnel.');
});

// Démarre le serveur
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;   