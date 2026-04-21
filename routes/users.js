const express = require('express');
const router = express.Router();

const service = require('../services/users');
const privateAccess = require('../middlewares/private');

/**
 * Routes API REST pour la ressource "utilisateur".
 * Toutes les routes sont protegees par le middleware JWT (checkJWT).
 *
 * GET    /users           - liste tous les utilisateurs (sans le mot de passe)
 * GET    /users/:email    - detail d'un utilisateur identifie par son email
 * POST   /users           - cree un nouvel utilisateur (mot de passe hashe par bcrypt)
 * PUT    /users/:email    - met a jour un utilisateur
 * DELETE /users/:email    - supprime un utilisateur
 */
router.get('/', privateAccess.checkJWT, service.getAll);
router.get('/:email', privateAccess.checkJWT, service.getByEmail);
router.post('/', privateAccess.checkJWT, service.add);
router.put('/:email', privateAccess.checkJWT, service.update);
router.delete('/:email', privateAccess.checkJWT, service.delete);

module.exports = router;
