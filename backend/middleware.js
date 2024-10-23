const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Token manquant ou non fourni' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expiré, veuillez vous reconnecter' });
            }
            return res.status(403).json({ message: 'Token invalide' });
        }

        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
