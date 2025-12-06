const jwt = require('jsonwebtoken');

// 💡 Explication : Cette fonction (middleware) vérifie si l'utilisateur est connecté.
function auth(req, res, next) {
    // On essaie de lire le token dans l'en-tête de la requête (header)
    const token = req.header('x-auth-token');

    // 1. Vérifier si un token existe
    if (!token) {
        // Code 401: Non autorisé. L'utilisateur n'a pas le droit d'accéder à la ressource.
        return res.status(401).json({ msg: 'Accès refusé. Pas de jeton fourni.' });
    }

    try {
        // 2. Vérifier la validité du token
        // jwt.verify() déchiffre le token en utilisant notre clé secrète.
        // Si la signature est mauvaise ou si le token est expiré, une erreur est lancée.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Ajouter l'utilisateur à l'objet de la requête
        // L'information de l'utilisateur (id, username) est maintenant accessible dans la route finale.
        req.user = decoded.user;
        
        // 4. Passer au middleware/à la route suivante
        next(); 

    } catch (e) {
        // Erreur si le token n'est pas valide (signature incorrecte, expiré, etc.)
        res.status(400).json({ msg: 'Le jeton n\'est pas valide.' });
    }
}

module.exports = auth;