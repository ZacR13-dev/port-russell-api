const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Reservation = require('../models/reservation');
const Catway = require('../models/catway');
const User = require('../models/user');

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Middleware de verification du token pour les pages (redirige vers /).
 */
function checkAuth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/');
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.redirect('/');
        }
        req.user = decoded.user;
        next();
    });
}

/**
 * Page d'accueil avec formulaire de connexion.
 */
router.get('/', (req, res) => {
    res.render('index', { title: 'Port de plaisance Russell', error: null });
});

/**
 * Traitement du formulaire de connexion (depuis la page d'accueil).
 */
router.post('/login', async (req, res) => {
    const bcrypt = require('bcrypt');
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.render('index', {
                title: 'Port de plaisance Russell',
                error: 'Utilisateur non trouve'
            });
        }

        const valid = bcrypt.compareSync(password, user.password);

        if (!valid) {
            return res.render('index', {
                title: 'Port de plaisance Russell',
                error: 'Mot de passe incorrect'
            });
        }

        const expireIn = 24 * 60 * 60;
        const token = jwt.sign(
            { user: { _id: user._id, username: user.username, email: user.email } },
            SECRET_KEY,
            { expiresIn: expireIn }
        );

        res.cookie('token', token, { httpOnly: true, maxAge: expireIn * 1000 });
        return res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        return res.render('index', {
            title: 'Port de plaisance Russell',
            error: 'Une erreur est survenue'
        });
    }
});

/**
 * Deconnexion : supprime le cookie et redirige vers la page d'accueil.
 */
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.redirect('/');
});

/**
 * Tableau de bord (necessite d'etre connecte).
 */
router.get('/dashboard', checkAuth, async (req, res) => {
    try {
        const today = new Date();

        const reservations = await Reservation.find({
            startDate: { $lte: today },
            endDate: { $gte: today }
        });

        return res.render('dashboard', {
            title: 'Tableau de bord',
            user: req.user,
            today: today,
            reservations: reservations
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Erreur serveur');
    }
});

/**
 * Page de la documentation de l'API.
 */
router.get('/documentation', (req, res) => {
    res.render('documentation', { title: 'Documentation de l\'API' });
});

/**
 * Pages CRUD catways.
 */
router.get('/catways-page', checkAuth, async (req, res) => {
    const catways = await Catway.find({}).sort({ catwayNumber: 1 });
    res.render('catways/list', { title: 'Gestion des catways', catways: catways, user: req.user });
});

router.get('/catways-page/new', checkAuth, (req, res) => {
    res.render('catways/form', { title: 'Nouveau catway', catway: null, user: req.user });
});

router.post('/catways-page', checkAuth, async (req, res) => {
    try {
        await Catway.create({
            catwayNumber: req.body.catwayNumber,
            catwayType: req.body.catwayType,
            catwayState: req.body.catwayState
        });
        res.redirect('/catways-page');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/catways-page/:id', checkAuth, async (req, res) => {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    res.render('catways/detail', { title: 'Detail catway', catway: catway, user: req.user });
});

router.get('/catways-page/:id/edit', checkAuth, async (req, res) => {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    res.render('catways/form', { title: 'Modifier catway', catway: catway, user: req.user });
});

router.post('/catways-page/:id/edit', checkAuth, async (req, res) => {
    await Catway.updateOne(
        { catwayNumber: req.params.id },
        { catwayState: req.body.catwayState }
    );
    res.redirect('/catways-page');
});

router.post('/catways-page/:id/delete', checkAuth, async (req, res) => {
    await Catway.deleteOne({ catwayNumber: req.params.id });
    res.redirect('/catways-page');
});

/**
 * Pages CRUD reservations.
 */
router.get('/reservations-page', checkAuth, async (req, res) => {
    const reservations = await Reservation.find({});
    res.render('reservations/list', { title: 'Gestion des reservations', reservations: reservations, user: req.user });
});

router.get('/reservations-page/new', checkAuth, async (req, res) => {
    const catways = await Catway.find({}).sort({ catwayNumber: 1 });
    res.render('reservations/form', { title: 'Nouvelle reservation', reservation: null, catways: catways, user: req.user });
});

router.post('/reservations-page', checkAuth, async (req, res) => {
    try {
        await Reservation.create({
            catwayNumber: req.body.catwayNumber,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        });
        res.redirect('/reservations-page');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/reservations-page/:id', checkAuth, async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    res.render('reservations/detail', { title: 'Detail reservation', reservation: reservation, user: req.user });
});

router.get('/reservations-page/:id/edit', checkAuth, async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    const catways = await Catway.find({}).sort({ catwayNumber: 1 });
    res.render('reservations/form', { title: 'Modifier reservation', reservation: reservation, catways: catways, user: req.user });
});

router.post('/reservations-page/:id/edit', checkAuth, async (req, res) => {
    await Reservation.findByIdAndUpdate(req.params.id, {
        catwayNumber: req.body.catwayNumber,
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    });
    res.redirect('/reservations-page');
});

router.post('/reservations-page/:id/delete', checkAuth, async (req, res) => {
    await Reservation.findByIdAndDelete(req.params.id);
    res.redirect('/reservations-page');
});

/**
 * Pages CRUD utilisateurs.
 */
router.get('/users-page', checkAuth, async (req, res) => {
    const users = await User.find({}, '-password');
    res.render('users/list', { title: 'Gestion des utilisateurs', users: users, user: req.user });
});

router.get('/users-page/new', checkAuth, (req, res) => {
    res.render('users/form', { title: 'Nouvel utilisateur', userEdit: null, user: req.user });
});

router.post('/users-page', checkAuth, async (req, res) => {
    try {
        await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        res.redirect('/users-page');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/users-page/:email', checkAuth, async (req, res) => {
    const userEdit = await User.findOne({ email: req.params.email }, '-password');
    res.render('users/detail', { title: 'Detail utilisateur', userEdit: userEdit, user: req.user });
});

router.get('/users-page/:email/edit', checkAuth, async (req, res) => {
    const userEdit = await User.findOne({ email: req.params.email }, '-password');
    res.render('users/form', { title: 'Modifier utilisateur', userEdit: userEdit, user: req.user });
});

router.post('/users-page/:email/edit', checkAuth, async (req, res) => {
    const u = await User.findOne({ email: req.params.email });
    if (req.body.username) u.username = req.body.username;
    if (req.body.password) u.password = req.body.password;
    u.updatedAt = new Date();
    await u.save();
    res.redirect('/users-page');
});

router.post('/users-page/:email/delete', checkAuth, async (req, res) => {
    await User.deleteOne({ email: req.params.email });
    res.redirect('/users-page');
});

module.exports = router;
