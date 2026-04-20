const express = require('express');
const router = express.Router();

const service = require('../services/users');
const privateAccess = require('../middlewares/private');

router.get('/', privateAccess.checkJWT, service.getAll);
router.get('/:email', privateAccess.checkJWT, service.getByEmail);
router.post('/', privateAccess.checkJWT, service.add);
router.put('/:email', privateAccess.checkJWT, service.update);
router.delete('/:email', privateAccess.checkJWT, service.delete);

module.exports = router;
