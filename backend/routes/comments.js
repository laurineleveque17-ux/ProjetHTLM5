const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Comment = require('../models/Comments'); 
const Article = require('../models/Article'); 

// ==========================================================
// ROUTE : POST /api/comments/:articleId
// ==========================================================
router.post('/:articleId', authMiddleware, async (req, res) => {
    
    const articleId = req.params.articleId; 
    const { text } = req.body;

    const { id: userId, pseudo } = req.user; 

    if (!text || text.trim() === '') {
        return res.status(400).json({ msg: 'Le commentaire ne peut pas être vide.' });
    }

    try {
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ msg: 'Article non trouvé.' });
        }

        const newComment = new Comment({
            articleId,
            userId, 
            pseudo,
            text
        });

        await newComment.save(); 

        article.comment_count += 1;
        await article.save(); 
        
        res.status(201).json(newComment);
        
    } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire:", error.message);
        if (error.name === 'CastError') { 
            return res.status(400).json({ msg: 'ID d\'article invalide.' });
        }
        res.status(500).send('Erreur Serveur lors du commentaire');
    }
});


// ==========================================================
//  ROUTE : GET /api/comments/:articleId
// ==========================================================
router.get('/:articleId', async (req, res) => {
    const articleId = req.params.articleId;

    try {
        const articleComments = await Comment.find({ articleId: articleId }).sort({ createdAt: -1 });

        res.json(articleComments);
    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires:", error.message);
        res.status(500).send('Erreur Serveur');
    }
});


module.exports = router;