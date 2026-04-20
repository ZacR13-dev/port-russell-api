require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const mongodb = require('./db/mongo');

const dashboardRoute = require('./routes/dashboard');
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const catwaysRoute = require('./routes/catways');

const app = express();

mongodb.initClientDbConnection();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', dashboardRoute);
app.use('/', authRoute);
app.use('/users', usersRoute);
app.use('/catways', catwaysRoute);

/**
 * Gestion de l'erreur 404.
 */
app.use((req, res) => {
    res.status(404).json({ message: 'Ressource introuvable' });
});

module.exports = app;
