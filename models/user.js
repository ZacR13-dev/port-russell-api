const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

/**
 * Schema Mongoose pour un utilisateur de la capitainerie.
 */
const User = new Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'Le nom d\'utilisateur est requis']
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, 'L\'email est requis']
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Le mot de passe est requis'],
        minLength: [6, 'Le mot de passe doit contenir au moins 6 caracteres']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Hash du mot de passe avant sauvegarde.
 */
User.pre('save', function (next) {
    if (this.password && this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', User);
