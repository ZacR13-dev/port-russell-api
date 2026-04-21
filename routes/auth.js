const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Determine si la requete doit recevoir une reponse JSON (API)
 * ou une reponse HTML (formulaire du navigateur).
 * @param {Object} req
 * @returns {Boolean}
 */
function wantsJson(req) {
    if (req.is('application/json')) {
        return true;
    }
    const accept = req.headers['accept'] || '';
    return accept.indexOf('application/json') !== -1 && accept.indexOf('text/html') === -1;
}

/**
 * Route de connexion.
 * Accepte le formulaire HTML (redirige vers /dashboard)
 * et les appels API JSON (renvoie un token).
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            if (wantsJson(req)) {
                return res.status(404).json({ message: 'Utilisateur non trouve' });
            }
            return res.render('index', {
                title: 'Port de plaisance Russell',
                error: 'Utilisateur non trouve'
            });
        }

        const valid = bcrypt.compareSync(password, user.password);

        if (!valid) {
            if (wantsJson(req)) {
                return res.status(403).json({ message: 'Mot de passe incorrect' });
            }
            return res.render('index', {
                title: 'Port de plaisance Russell',
                error: 'Mot de passe incorrect'
            });
        }

        const expireIn = 24 * 60 * 60;
        const token = jwt.sign(
            { user: { _id: user._id, username: user.username, email: user.email } },
            SECRET_KEY,
            { expiresIn: expireIn }
        );

        res.header('Authorization', 'Bearer ' + token);
        res.cookie('token', token, { httpOnly: true, maxAge: expireIn * 1000 });

        if (wantsJson(req)) {
            return res.status(200).json({
                message: 'Authentification reussie',
                token: token,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        }
        return res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        if (wantsJson(req)) {
            return res.status(501).json({ message: 'Erreur serveur' });
        }
        return res.render('index', {
            title: 'Port de plaisance Russell',
            error: 'Une erreur est survenue'
        });
    }
});

/**
 * Route de deconnexion.
 * Supprime le cookie et repond selon le type de requete.
 */
router.get('/logout', (req, res) => {
    res.clearCookie('token');

    if (wantsJson(req)) {
        return res.status(200).json({ message: 'Deconnexion reussie' });
    }
    return res.redirect('/');
});

module.exports = router;
