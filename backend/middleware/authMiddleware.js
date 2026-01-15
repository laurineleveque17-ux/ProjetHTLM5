const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'Accès refusé. Pas de jeton fourni.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next(); 

    } catch (e) {
        res.status(400).json({ msg: 'Vous devez vous connecter pour intéragir.' });
    }
}

module.exports = auth;