const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// ==========================================================
// ROUTE D'INSCRIPTION : POST /api/auth/register
// ==========================================================
router.post('/register', async (req, res) => {
    const { nom, prenom, pseudo, email, password } = req.body;

    if (!nom || !prenom || !pseudo || !email || !password) {
        return res.status(400).json({ msg: 'Veuillez entrer le nom, prénom, pseudo, email et mot de passe.' });
    }
    
    try {
        let userExists = await User.findOne({ $or: [{ email: email }, { pseudo: pseudo }] });
        if (userExists) {
            return res.status(400).json({ msg: 'Cet email ou ce pseudo est déjà utilisé.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            nom, prenom, pseudo, email, 
            password: hashedPassword 
        });
        
        await newUser.save();

        console.log('Utilisateur enregistré dans MongoDB:', newUser.email);
        
        res.status(201).json({ msg: 'Utilisateur enregistré avec succès!' });

    } catch (err) {
        console.error('Erreur inscription:', err.message);
        res.status(500).send('Erreur Serveur lors de l\'inscription');
    }
});

// ==========================================================
// ROUTE DE CONNEXION : POST /api/auth/login
// ==========================================================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) { 
            return res.status(400).json({ msg: 'Identifiants invalides.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Identifiants invalides.' });
        }

        const payload = {
            user: {
                id: user._id, 
                pseudo: user.pseudo
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token,
                    userId: user._id,
                    pseudo: user.pseudo
                });
            }
        );

    } catch (err) {
        console.error('Erreur connexion:', err.message);
        res.status(500).send('Erreur Serveur lors de la connexion');
    }
});

const authMiddleware = require('../middleware/authMiddleware');

// ==========================================================
// ROUTE : GET /api/auth/me
// ==========================================================
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
});

// ==========================================================
// ROUTE : PUT /api/auth/update
// ==========================================================
router.put('/update', authMiddleware, async (req, res) => {
    const { password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

        res.json({ msg: "Mot de passe mis à jour avec succès" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
});


module.exports = router;