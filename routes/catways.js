const express = require('express');
const router = express.Router();

const service = require('../services/catways');
const reservations = require('./reservations');
const privateAccess = require('../middlewares/private');

/**
 * Routes API REST pour la ressource "catway".
 * Toutes les routes sont protegees par le middleware JWT (checkJWT).
 *
 * GET    /catways          - liste tous les catways
 * GET    /catways/:id      - detail d'un catway (id = catwayNumber)
 * POST   /catways          - cree un nouveau catway
 * PUT    /catways/:id      - met a jour l'etat d'un catway
 * DELETE /catways/:id      - supprime un catway
 *
 * Les reservations d'un catway sont exposees comme sous-ressource :
 * /catways/:id/reservations (voir routes/reservations.js)
 */
router.get('/', privateAccess.checkJWT, service.getAll);
router.get('/:id', privateAccess.checkJWT, service.getById);
router.post('/', privateAccess.checkJWT, service.add);
router.put('/:id', privateAccess.checkJWT, service.update);
router.delete('/:id', privateAccess.checkJWT, service.delete);

router.use('/:id/reservations', reservations);

module.exports = router;
