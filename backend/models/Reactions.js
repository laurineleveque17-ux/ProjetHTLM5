const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
    articleId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Article',
        required: true 
    },
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
ReactionSchema.index({ articleId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', ReactionSchema);