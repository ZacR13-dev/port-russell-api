const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Schema Mongoose pour un catway (appontement).
 */
const Catway = new Schema({
    catwayNumber: {
        type: Number,
        unique: true,
        required: [true, 'Le numero du catway est requis']
    },
    catwayType: {
        type: String,
        enum: ['long', 'short'],
        required: [true, 'Le type du catway est requis']
    },
    catwayState: {
        type: String,
        required: [true, 'L\'etat du catway est requis']
    }
});

module.exports = mongoose.model('Catway', Catway);
