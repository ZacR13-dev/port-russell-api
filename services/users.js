const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Recupere un utilisateur par son email.
 * @param {Object} req
 * @param {Object} res
 */
exports.getByEmail = async (req, res) => {
    const email = req.params.email;

    try {
        let user = await User.findOne({ email: email }, '-password -__v');

        if (user) {
            return res.status(200).json(user);
        }
        return res.status(404).json({ message: 'Utilisateur non trouve' });
    } catch (error) {
        return res.status(501).json(error);
    }
};

/**
 * Liste tous les utilisateurs.
 * @param {Object} req
 * @param {Object} res
 */
exports.getAll = async (req, res) => {
    try {
        let users = await User.find({}, '-password -__v');
        return res.status(200).json(users);
    } catch (error) {
        return res.status(501).json(error);
    }
};

/**
 * Ajoute un nouvel utilisateur.
 * @param {Object} req
 * @param {Object} res
 */
exports.add = async (req, res) => {
    const temp = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    try {
        let user = await User.create(temp);
        return res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        return res.status(501).json(error);
    }
};

/**
 * Met a jour un utilisateur par son email.
 * @param {Object} req
 * @param {Object} res
 */
exports.update = async (req, res) => {
    const email = req.params.email;
    const temp = ({ username, password } = req.body);

    try {
        let user = await User.findOne({ email: email });

        if (user) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    user[key] = temp[key];
                }
            });

            user.updatedAt = new Date();
            await user.save();
            return res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email
            });
        }
        return res.status(404).json({ message: 'Utilisateur non trouve' });
    } catch (error) {
        return res.status(501).json(error);
    }
};

/**
 * Supprime un utilisateur par son email.
 * @param {Object} req
 * @param {Object} res
 */
exports.delete = async (req, res) => {
    const email = req.params.email;

    try {
        await User.deleteOne({ email: email });
        return res.status(204).end();
    } catch (error) {
        return res.status(501).json(error);
    }
};

/**
 * Authentifie un utilisateur et renvoie un token JWT.
 * @param {Object} req
 * @param {Object} res
 */
exports.authenticate = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email: email });

        if (user) {
            bcrypt.compare(password, user.password, function (err, response) {
                if (err) {
                    throw new Error(err);
                }

                if (response) {
                    delete user._doc.password;

                    const expireIn = 24 * 60 * 60;
                    const token = jwt.sign(
                        { user: user },
                        SECRET_KEY,
                        { expiresIn: expireIn }
                    );

                    res.header('Authorization', 'Bearer ' + token);
                    res.cookie('token', token, { httpOnly: true, maxAge: expireIn * 1000 });

                    return res.status(200).json({
                        message: 'Authentification reussie',
                        token: token,
                        user: {
                            _id: user._id,
                            username: user.username,
                            email: user.email
                        }
                    });
                }

                return res.status(403).json({ message: 'Mot de passe incorrect' });
            });
        } else {
            return res.status(404).json({ message: 'Utilisateur non trouve' });
        }
    } catch (error) {
        return res.status(501).json(error);
    }
};
