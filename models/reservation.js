const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Schema Mongoose pour une reservation de catway.
 */
const Reservation = new Schema({
    catwayNumber: {
        type: Number,
        required: [true, 'Le numero du catway est requis']
    },
    clientName: {
        type: String,
        trim: true,
        required: [true, 'Le nom du client est requis']
    },
    boatName: {
        type: String,
        trim: true,
        required: [true, 'Le nom du bateau est requis']
    },
    startDate: {
        type: Date,
        required: [true, 'La date de debut est requise']
    },
    endDate: {
        type: Date,
        required: [true, 'La date de fin est requise']
    }
});

module.exports = mongoose.model('Reservation', Reservation);
