const express = require('express');
const router = express.Router();

const service = require('../services/users');

/**
 * Route de connexion.
 */
router.post('/login', service.authenticate);

/**
 * Route de deconnexion (suppression du cookie).
 */
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Deconnexion reussie' });
});

module.exports = router;
