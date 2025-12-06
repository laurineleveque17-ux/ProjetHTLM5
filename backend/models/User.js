const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    prenom: {
        type: String,
        required: true
    },
    nom: {
        type : String,
        required:true
    },
    // 💡 Pour ajouter un nouveau champ :
    pseudo: {
        type: String,
        required: true,
        unique : true
    },
    email: {
        type : String,
        required:true,
        unique: true
    },
    password: {
        type : String,
        required:true
    },
});

module.exports = mongoose.model('User', UserSchema);