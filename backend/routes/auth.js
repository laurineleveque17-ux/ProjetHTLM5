const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// ==========================================================
// ➡️ ROUTE D'INSCRIPTION : POST /api/auth/register
// ==========================================================
router.post('/register', async (req, res) => {
    const { nom, prenom, pseudo, email, password } = req.body;

    if (!nom || !prenom || !pseudo || !email || !password) {
        return res.status(400).json({ msg: 'Veuillez entrer le nom, prénom, pseudo, email et mot de passe.' });
    }
    
    try {
        // 1. Vérification si l'utilisateur existe déjà (REQUÊTE MONGOOSE)
        let userExists = await User.findOne({ $or: [{ email: email }, { pseudo: pseudo }] });
        if (userExists) {
            return res.status(400).json({ msg: 'Cet email ou ce pseudo est déjà utilisé.' });
        }

        // 2. Hachage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Création du nouvel utilisateur (AVEC MONGOOSE)
        const newUser = new User({ 
            nom, prenom, pseudo, email, 
            password: hashedPassword // Mot de passe HACHÉ
        });
        
        await newUser.save(); // 🟢 Sauvegarde l'utilisateur dans la BDD MongoDB

        console.log('Utilisateur enregistré dans MongoDB:', newUser.email);
        
        res.status(201).json({ msg: 'Utilisateur enregistré avec succès!' });

    } catch (err) {
        console.error('Erreur inscription:', err.message);
        res.status(500).send('Erreur Serveur lors de l\'inscription');
    }
});

// ==========================================================
// ➡️ ROUTE DE CONNEXION : POST /api/auth/login
// ==========================================================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Trouver l'utilisateur (REQUÊTE MONGOOSE)
        const user = await User.findOne({ email });
        if (!user) { // user sera null si non trouvé
            return res.status(400).json({ msg: 'Identifiants invalides.' });
        }

        // 2. Comparer le mot de passe clair avec le hash stocké
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Identifiants invalides.' });
        }

        // 3. Création du JSON Web Token (JWT)
        const payload = {
            user: {
                // 🟢 MongoDB utilise '_id' et non 'id'
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
                // 4. Succès : Retourne le token au client
                res.json({ 
                    token,
                    // 🟢 Utilise user._id
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

// Import du middleware pour protéger ces routes
const authMiddleware = require('../middleware/authMiddleware');

// ==========================================================
// ➡️ ROUTE : GET /api/auth/me
// Récupérer les infos de l'utilisateur connecté
// ==========================================================
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // req.user.id vient du token décodé par le middleware
        // .select('-password') permet de NE PAS renvoyer le mot de passe
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
});

// ==========================================================
// ➡️ ROUTE : PUT /api/auth/update
// Mettre à jour le mot de passe
// ==========================================================
router.put('/update', authMiddleware, async (req, res) => {
    const { password } = req.body;

    try {
        // Hachage du nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Mise à jour dans la base de données
        await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

        res.json({ msg: "Mot de passe mis à jour avec succès" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
});


module.exports = router;