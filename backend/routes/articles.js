const express = require('express');
const router = express.Router();
const Article = require('../models/Article'); 
const Comment = require('../models/Comments');
const Reaction = require('../models/Reactions');

// --- 1. ROUTES FIXES (Sans paramètres variables) ---

// Route pour TOUS les articles (Page d'accueil)
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find().sort({ date_publication: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
});

// --- 2. ROUTES THÉMATIQUES (Ex: /api/articles/theme/sport) ---
// On ajoute "/theme/" devant pour éviter la confusion avec les ID
router.get('/theme/:theme', async (req, res) => {
    try {
        const articles = await Article.find({ theme: req.params.theme }).sort({ date_publication: -1 });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur thème" });
    }
});

// --- 3. ROUTES PAR ID (Ex: /api/articles/id/65a1...) ---
// On ajoute "/id/" pour être totalement précis et sécurisé
router.get('/id/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ msg: "Article non trouvé" });

        // 1. On va chercher les commentaires liés à cet article
        const comments = await Comment.find({ articleId: req.params.id }).sort({ createdAt: -1 });

        // 2. On compte les réactions réelles
        const likes = await Reaction.countDocuments({ articleId: req.params.id, type: 'like' });
        const dislikes = await Reaction.countDocuments({ articleId: req.params.id, type: 'dislike' });

        // 3. On renvoie TOUT au frontend
        res.json({
            ...article._doc,
            comments: comments, // On remplace le champ vide par les vrais comms
            reaction_count: likes,
            dislike_count: dislikes
        });
    } catch (err) {
        res.status(500).send('Erreur serveur');
    }
});

// --- 4. INTERACTIONS (Likes/Commentaires) ---
/*
router.post('/id/:id/react', async (req, res) => {
    try {
        const { type } = req.body;
        let updateField = (type === 'like') ? { reaction_count: 1 } : { dislike_count: 1 };

        const article = await Article.findByIdAndUpdate(
            req.params.id, 
            { $inc: updateField }, 
            { new: true }
        );
        if (!article) return res.status(404).json({ msg: "Article introuvable" });
        res.json({ likes: article.reaction_count, dislikes: article.dislike_count });
    } catch (err) {
        res.status(500).json({ msg: "Erreur réaction" });
    }
});

router.post('/id/:id/comment', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ msg: "Commentaire vide" });

        const article = await Article.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: { text, date: new Date() } } },
            { new: true }
        );
        res.json(article.comments);
    } catch (err) {
        res.status(500).json({ msg: "Erreur commentaire" });
    }
});
*/

module.exports = router;