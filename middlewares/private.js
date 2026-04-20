const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Middleware qui verifie la validite du token JWT.
 * Lit le token dans le header Authorization ou dans le cookie.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.checkJWT = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token && req.cookies) {
        token = req.cookies.token;
    }

    if (!!token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (!token) {
        return res.status(401).json({ message: 'token required' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'token invalid' });
        }

        req.decoded = decoded;

        const expireIn = 24 * 60 * 60;
        const newToken = jwt.sign(
            { user: decoded.user },
            SECRET_KEY,
            { expiresIn: expireIn }
        );

        res.header('Authorization', 'Bearer ' + newToken);
        next();
    });
};
