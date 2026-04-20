const Catway = require('../models/catway');

/**
 * Liste tous les catways.
 * @param {Object} req
 * @param {Object} res
 */
exports.getAll = async (req, res) => {
    try {
        let catways = await Catway.find({}).sort({ catwayNumber: 1 });
        return res.status(200).json(catways);
    } catch (error) {
        return res.status(501).json(error);
    }
};

/**
 * Recupere un catway par son numero.
 * @param {Object} req
 * @param {Object} res
 */
exports.getById = async (req, res) => {
    const id = req.params.id;

    try {
        let catway = await Catway.findOne({ catwayNumber: id });

        if (catway) {
            return res.status(200).json(catway);
        }
        return res.status(404).json({ message: 'Catway non trouve' });
    } catch (error) {
        return res.status(501).json(error);
    }
};

/**
 * Ajoute un nouveau catway.
 * @param {Object} req
 * @param {Object} res
 */
exports.add = async (req, res) => {
    const temp = {
        catwayNumber: req.body.catwayNumber,
        catwayType: req.body.catwayType,
        catwayState: req.body.catwayState
    };

    try {
        let catway = await Catway.create(temp);
        return res.status(201).json(catway);
    } catch (error) {
        return res.status(501).json(error);
    }
};

/**
 * Met a jour l'etat d'un catway (le numero et le type ne sont pas modifiables).
 * @param {Object} req
 * @param {Object} res
 */
exports.update = async (req, res) => {
    const id = req.params.id;
    const temp = {
        catwayState: req.body.catwayState
    };

    try {
        let catway = await Catway.findOne({ catwayNumber: id });

        if (catway) {
            if (temp.catwayState) {
                catway.catwayState = temp.catwayState;
            }
            await catway.save();
            return res.status(200).json(catway);
        }
        return res.status(404).json({ message: 'Catway non trouve' });
    } catch (error) {
        return res.status(501).json(error);
    }
};

/**
 * Supprime un catway.
 * @param {Object} req
 * @param {Object} res
 */
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        await Catway.deleteOne({ catwayNumber: id });
        return res.status(204).end();
    } catch (error) {
        return res.status(501).json(error);
    }
};
