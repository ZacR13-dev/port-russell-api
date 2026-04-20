const express = require('express');
const router = express.Router();

const service = require('../services/catways');
const reservations = require('./reservations');
const privateAccess = require('../middlewares/private');

router.get('/', privateAccess.checkJWT, service.getAll);
router.get('/:id', privateAccess.checkJWT, service.getById);
router.post('/', privateAccess.checkJWT, service.add);
router.put('/:id', privateAccess.checkJWT, service.update);
router.delete('/:id', privateAccess.checkJWT, service.delete);

router.use('/:id/reservations', reservations);

module.exports = router;
