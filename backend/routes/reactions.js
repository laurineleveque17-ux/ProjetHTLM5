const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Reaction = require('../models/Reactions'); 
const Article = require('../models/Article'); 

// ==========================================================
// ROUTE : POST /api/reactions/:articleId (Toggle Like/Unlike)
// ==========================================================
router.post('/:articleId', authMiddleware, async (req, res) => {
    const articleId = req.params.articleId; 
    const userId = req.user.id; 
    
    try {
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ msg: 'Article non trouvé.' });
        }

        const reaction = await Reaction.findOne({ articleId, userId });
        let action = '';

        if (reaction) {
            await Reaction.deleteOne({ _id: reaction._id });
            action = 'UNLIKED';
            article.reaction_count -= 1; 

        } else {
            const newReaction = new Reaction({ articleId, userId });
            await newReaction.save();
            action = 'LIKED';
            article.reaction_count += 1; 
        }

        await article.save();

        const newCount = await Reaction.countDocuments({ articleId });
        
        return res.json({ msg: `Réaction ${action}`, action: action, count: newCount });
        
    } catch (error) {
        console.error("Erreur lors de la bascule de réaction:", error.message);
        if (error.name === 'CastError') { 
            return res.status(400).json({ msg: 'ID d\'article invalide.' });
        }
        res.status(500).send('Erreur Serveur');
    }
});

// ==========================================================
// ROUTE : GET /api/reactions/:articleId
// ==========================================================
router.get('/:articleId', async (req, res) => {
    const articleId = req.params.articleId;

    try {
        const count = await Reaction.countDocuments({ articleId });

        res.json({ articleId, count });
    } catch (error) {
        console.error("Erreur lors du compte des réactions:", error.message);
        res.status(500).send('Erreur Serveur');
    }
});

module.exports = router;