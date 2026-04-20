const Reservation = require('../models/reservation');
const Catway = require('../models/catway');

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
