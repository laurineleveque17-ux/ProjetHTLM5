const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Comment = require('../models/Comments'); // 💡 Import du modèle Comment
const Article = require('../models/Article'); // 💡 Import du modèle Article (pour vérification)

// ==========================================================
// ➡️ ROUTE : POST /api/comments/:articleId
// Ajout d'un commentaire (nécessite d'être connecté)
// ==========================================================
router.post('/:articleId', authMiddleware, async (req, res) => {
    
    // 💡 L'articleId est maintenant une chaîne de caractères (l'ID MongoDB)
    const articleId = req.params.articleId; 
    const { text } = req.body;
    
    // Les infos utilisateur viennent du JWT
    const { id: userId, pseudo } = req.user; 

    if (!text || text.trim() === '') {
        return res.status(400).json({ msg: 'Le commentaire ne peut pas être vide.' });
    }

    try {
        // 1. Vérification de l'existence de l'article (CRUCIAL)
        // Mongoose trouve l'article par son _id
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ msg: 'Article non trouvé.' });
        }

        // 2. Création du nouveau commentaire
        const newComment = new Comment({
            articleId,
            userId, 
            pseudo,
            text
        });

        await newComment.save(); // 🟢 Sauvegarde dans MongoDB

        // 3. Mise à jour du compteur de commentaires de l'article
        // C'est une bonne pratique pour ne pas recalculer le total à chaque chargement
        article.comment_count += 1;
        await article.save(); 
        
        // 4. Réponse
        // On renvoie le commentaire créé par la BDD
        res.status(201).json(newComment);
        
    } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire:", error.message);
        // Si l'articleId n'est pas un format valide d'ObjectId
        if (error.name === 'CastError') { 
            return res.status(400).json({ msg: 'ID d\'article invalide.' });
        }
        res.status(500).send('Erreur Serveur lors du commentaire');
    }
});


// ==========================================================
// ➡️ ROUTE : GET /api/comments/:articleId
// Affichage des commentaires d'un article
// ==========================================================
router.get('/:articleId', async (req, res) => {
    const articleId = req.params.articleId;

    try {
        // 1. Trouver les commentaires pour cet article
        // On trie par date de création (le plus récent en premier)
        const articleComments = await Comment.find({ articleId: articleId }).sort({ createdAt: -1 });

        // 2. Réponse
        res.json(articleComments);
    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires:", error.message);
        res.status(500).send('Erreur Serveur');
    }
});


module.exports = router;