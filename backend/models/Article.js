const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true,
    },
    resume: {
        type: String,
        required: false
    },
    content:{
        type: String,
        required: false
    },
    url_originale: {
        type: String,
        required: true,
        unique: true,
    },
    source_nom: {
        type: String,
    },
    date_publication: {
        type: Date,
        required: true,
    },
    reaction_count: {
        type: Number,
        default: 0
    }

}, { timestamps: true }); 

module.exports = mongoose.model('Article', ArticleSchema);