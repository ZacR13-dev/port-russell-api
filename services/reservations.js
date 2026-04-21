const Reservation = require('../models/reservation');
const Catway = require('../models/catway');

/**
 * Verifie qu'une reservation est valide :
 * - dates coherentes (endDate > startDate)
 * - pas de chevauchement avec une autre reservation sur le meme catway
 * @param {Number|String} catwayNumber - numero du catway concerne
 * @param {Date|String} startDate - date de debut de la reservation
 * @param {Date|String} endDate - date de fin de la reservation
 * @param {String} [excludeId] - id d'une reservation a exclure (cas d'une modification)
 * @returns {Promise<Object>} objet de la forme { ok: boolean, message: string }
 */
exports.validateReservation = async (catwayNumber, startDate, endDate, excludeId) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return { ok: false, message: 'Dates invalides' };
    }

    if (end <= start) {
        return { ok: false, message: 'La date de fin doit etre posterieure a la date de debut' };
    }

    const query = {
        catwayNumber: Number(catwayNumber),
        startDate: { $lt: end },
        endDate: { $gt: start }
    };

    if (excludeId) {
        query._id = { $ne: excludeId };
    }

    const overlap = await Reservation.findOne(query);
    if (overlap) {
        return {
            ok: false,
            message: 'Ce catway est deja reserve sur cette periode (chevauchement avec une autre reservation)'
        };
    }

    return { ok: true };
};

/**
 * Liste toutes les reservations d'un catway.
 * @param {Object} req
 * @param {Object} res
 */
exports.getAll = async (req, res) => {
    const id = req.params.id;

    try {
        let reservations = await Reservation.find({ catwayNumber: id });
        return res.status(200).json(reservations);
    } catch (error) {
        return res.status(501).json(error);
    }
};

/**
 * Recupere les details d'une reservation par son id.
 * @param {Object} req
 * @param {Object} res
 */
exports.getById = async (req, res) => {
    const idReservation = req.params.idReservation;

    try {
        let reservation = await Reservation.findById(idReservation);

        if (reservation) {
            return res.status(200).json(reservation);
        }
        return res.status(404).json({ message: 'Reservation non trouvee' });
    } catch (error) {
        return res.status(501).json(error);
    }
};

/**
 * Ajoute une nouvelle reservation pour un catway.
 * @param {Object} req
 * @param {Object} res
 */
exports.add = async (req, res) => {
    const id = req.params.id;

    try {
        let catway = await Catway.findOne({ catwayNumber: id });

        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouve' });
        }

        const check = await exports.validateReservation(
            id,
            req.body.startDate,
            req.body.endDate
        );
        if (!check.ok) {
            return res.status(400).json({ message: check.message });
        }

        const temp = {
            catwayNumber: id,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        };

        let reservation = await Reservation.create(temp);
        return res.status(201).json(reservation);
    } catch (error) {
        return res.status(501).json(error);
    }
};

/**
 * Met a jour une reservation.
 * @param {Object} req
 * @param {Object} res
 */
exports.update = async (req, res) => {
    const idReservation = req.params.idReservation;
    const temp = ({ clientName, boatName, startDate, endDate } = req.body);

    try {
        let reservation = await Reservation.findById(idReservation);

        if (reservation) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    reservation[key] = temp[key];
                }
            });

            const check = await exports.validateReservation(
                reservation.catwayNumber,
                reservation.startDate,
                reservation.endDate,
                reservation._id
            );
            if (!check.ok) {
                return res.status(400).json({ message: check.message });
            }

            await reservation.save();
            return res.status(200).json(reservation);
        }
        return res.status(404).json({ message: 'Reservation non trouvee' });
    } catch (error) {
        return res.status(501).json(error);
    }
};

/**
 * Supprime une reservation.
 * @param {Object} req
 * @param {Object} res
 */
exports.delete = async (req, res) => {
    const idReservation = req.params.idReservation;

    try {
        await Reservation.deleteOne({ _id: idReservation });
        return res.status(204).end();
    } catch (error) {
        return res.status(501).json(error);
    }
};
