const express = require('express');
const router = express.Router();
const Article = require('../models/Article'); 

// 1. Route pour TOUS les articles (Page d'accueil)
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find().sort({ date_publication: -1 });
        res.json(articles);
    } catch (error) {
        console.error("Erreur récupération articles:", error);
        res.status(500).json({ msg: "Erreur serveur" });
    }
});

// 2. Route pour UN SEUL article (Ta mission : Page intermédiaire)
// Route pour un seul article
router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ msg: "Article non trouvé" });
        res.json(article);
    } catch (err) {
        res.status(500).json({ msg: "ID invalide" });
    }
});

// Ta route existante pour tous les articles
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find().sort({ date_publication: -1 });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
});

module.exports = router;

//Likes dislikes

router.post('/:id/react', async (req, res) => {
    try {
        const { type } = req.body;
        
        // On définit quel champ incrémenter selon le type reçu
        // Attention : On utilise bien reaction_count et dislike_count comme dans ton modèle
        let updateField = {};
        if (type === 'like') {
            updateField = { reaction_count: 1 };
        } else if (type === 'dislike') {
            updateField = { dislike_count: 1 };
        }

        const article = await Article.findByIdAndUpdate(
            req.params.id, 
            { $inc: updateField }, // $inc augmente la valeur actuelle
            { new: true } // Pour renvoyer l'article mis à jour
        );

        if (!article) return res.status(404).json({ msg: "Article introuvable" });

        // On renvoie les nouvelles valeurs au Front-end
        res.json({ 
            likes: article.reaction_count, 
            dislikes: article.dislike_count 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Erreur serveur lors de la réaction" });
    }
});

// Route pour ajouter un commentaire
router.post('/:id/comment', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ msg: "Le commentaire est vide" });

        const newComment = {
            text: text,
            date: new Date()
        };

        const article = await Article.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: newComment } }, // $push ajoute au tableau sans écraser le reste
            { new: true }
        );

        res.json(article.comments); // On renvoie la liste mise à jour
    } catch (err) {
        res.status(500).json({ msg: "Erreur lors de l'ajout du commentaire" });
    }
});

