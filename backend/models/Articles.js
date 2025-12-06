const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    // L'ID pourrait être une référence à l'ID de l'article source (ex: ID de l'API News)
    source_id: { 
        type: String, 
        required: true,
        unique: true // S'assure de ne pas enregistrer le même article deux fois
    },
    title: {
        type: String,
        required: true,
    },
    // Le résumé généré par l'API OpenAI
    resume: {
        type: String,
        required: true,
    },
    url_originale: {
        type: String,
        required: true,
    },
    source_nom: {
        type: String,
    },
    date_publication: {
        type: Date,
        required: true,
    },
    // Le compteur de commentaires peut être utile pour le tri
    comment_count: {
        type: Number,
        default: 0
    },
    // Le compteur de likes/réactions
    reaction_count: {
        type: Number,
        default: 0
    }
}, { timestamps: true }); // Mongoose ajoutera createdAt/updatedAt

module.exports = mongoose.model('Article', ArticleSchema);