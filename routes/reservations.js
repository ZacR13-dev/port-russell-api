const express = require('express');
// mergeParams permet de recuperer :id du catway depuis la route parente (/catways/:id)
const router = express.Router({ mergeParams: true });

const service = require('../services/reservations');
const privateAccess = require('../middlewares/private');

/**
 * Routes API REST pour la sous-ressource "reservation" d'un catway.
 * Montee depuis routes/catways.js sur /catways/:id/reservations.
 * Toutes les routes sont protegees par le middleware JWT (checkJWT).
 *
 * GET    /catways/:id/reservations                 - liste les reservations du catway
 * GET    /catways/:id/reservations/:idReservation  - detail d'une reservation
 * POST   /catways/:id/reservations                 - cree une reservation pour ce catway
 * PUT    /catways/:id/reservations/:idReservation  - met a jour une reservation
 * DELETE /catways/:id/reservations/:idReservation  - supprime une reservation
 */
router.get('/', privateAccess.checkJWT, service.getAll);
router.get('/:idReservation', privateAccess.checkJWT, service.getById);
router.post('/', privateAccess.checkJWT, service.add);
router.put('/:idReservation', privateAccess.checkJWT, service.update);
router.delete('/:idReservation', privateAccess.checkJWT, service.delete);

module.exports = router;
