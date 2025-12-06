const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    // Référence à l'article par son ID MongoDB
    articleId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref : 'Article', // S'assure de lier avec le modèle 'Article'
        required: true 
    },
    // Référence à l'utilisateur qui a posté
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true // Un commentaire doit avoir un auteur
    },
    // Ajout du pseudo pour faciliter l'affichage (car il est stocké dans la route)
    pseudo: {
        type: String,
        required: true
    },
    text: { 
        type: String, 
        required: true 
    },
    // Correction : Le type pour les nombres est 'Number'
    nbReactions: {
        type : Number, 
        default: 0
    }
}, { timestamps: true }); // 💡 Ajout pour gérer la date de création/mise à jour automatiquement


module.exports = mongoose.model('Comment', CommentSchema);