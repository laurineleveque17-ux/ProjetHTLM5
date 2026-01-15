const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    articleId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref : 'Article', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    pseudo: {
        type: String,
        required: true
    },
    text: { 
        type: String, 
        required: true 
    },
    nbReactions: {
        type : Number, 
        default: 0
    }
}, { timestamps: true }); 


module.exports = mongoose.model('Comment', CommentSchema);