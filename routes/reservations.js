const express = require('express');
const router = express.Router({ mergeParams: true });

const service = require('../services/reservations');
const privateAccess = require('../middlewares/private');

router.get('/', privateAccess.checkJWT, service.getAll);
router.get('/:idReservation', privateAccess.checkJWT, service.getById);
router.post('/', privateAccess.checkJWT, service.add);
router.put('/:idReservation', privateAccess.checkJWT, service.update);
router.delete('/:idReservation', privateAccess.checkJWT, service.delete);

module.exports = router;
