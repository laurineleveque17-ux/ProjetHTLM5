const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
    // 💡 ArticleId est maintenant une référence ObjectId
    articleId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Article',
        required: true 
    },
    // Référence à l'utilisateur
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    type: {
        type: String,
        enum: ['LIKE'],
        default: 'LIKE'
    }
});

// Clé : un seul utilisateur ne peut donner qu'une seule réaction par article
ReactionSchema.index({ articleId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', ReactionSchema);