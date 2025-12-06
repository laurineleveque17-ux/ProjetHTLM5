const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Reaction = require('../models/Reactions'); 
const Article = require('../models/Articles'); 

// ==========================================================
// ➡️ ROUTE : POST /api/reactions/:articleId (Toggle Like/Unlike)
// ==========================================================
router.post('/:articleId', authMiddleware, async (req, res) => {
    const articleId = req.params.articleId; 
    const userId = req.user.id; 
    
    try {
        // 1. Vérification de l'existence de l'article
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ msg: 'Article non trouvé.' });
        }
        
        // 2. Chercher si la réaction existe (Requête Mongoose)
        // La méthode findOneAndUpdate est souvent utilisée, mais ici la logique toggle (créer/supprimer) est plus claire
        const reaction = await Reaction.findOne({ articleId, userId });
        let action = '';

        if (reaction) {
            // 3. Si la réaction existe : on la supprime (UNLIKE)
            await Reaction.deleteOne({ _id: reaction._id });
            action = 'UNLIKED';
            // Décrémenter le compteur de l'article
            article.reaction_count -= 1; 

        } else {
            // 4. Si la réaction n'existe pas : on la crée (LIKE)
            const newReaction = new Reaction({ articleId, userId });
            await newReaction.save();
            action = 'LIKED';
            // Incrémenter le compteur de l'article
            article.reaction_count += 1; 
        }

        // 5. Sauvegarde des changements de compteur sur l'article
        await article.save();

        // 6. Compter le nouveau total pour renvoi au Frontend
        const newCount = await Reaction.countDocuments({ articleId });
        
        // 7. Réponse
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
// ➡️ ROUTE : GET /api/reactions/:articleId
// Récupérer le nombre total de likes d'un article
// ==========================================================
router.get('/:articleId', async (req, res) => {
    const articleId = req.params.articleId;

    try {
        // 1. Compter le nombre de documents
        const count = await Reaction.countDocuments({ articleId });

        // 2. Réponse
        res.json({ articleId, count });
    } catch (error) {
        console.error("Erreur lors du compte des réactions:", error.message);
        res.status(500).send('Erreur Serveur');
    }
});

module.exports = router;