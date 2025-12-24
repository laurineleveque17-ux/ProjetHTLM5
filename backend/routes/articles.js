const cron = require('node-cron');
const express = require('express');
const router = express.Router();
// Assurez-vous que le nom du fichier correspond (Article.js ou Articles.js)
const Article = require('../models/Article'); 

router.get('/', async (req, res) => {
    try {
        // On récupère les articles et on les trie du plus récent au plus ancien (-1)
        const articles = await Article.find().sort({ date_publication: -1 });
        res.json(articles);
    } catch (error) {
        console.error("Erreur récupération articles:", error);
        res.status(500).json({ msg: "Erreur serveur" });
    }
});

module.exports = router;
