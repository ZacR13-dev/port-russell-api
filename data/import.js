require('dotenv').config();

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Catway = require('../models/catway');
const Reservation = require('../models/reservation');
const User = require('../models/user');

/**
 * Script d'import des donnees dans MongoDB.
 * Lance : npm run import
 */
async function importData() {
    try {
        await mongoose.connect(process.env.URL_MONGO, { dbName: 'port_russell' });
        console.log('Connecte a MongoDB');

        const catways = JSON.parse(fs.readFileSync(path.join(__dirname, 'catways.json'), 'utf-8'));
        const reservations = JSON.parse(fs.readFileSync(path.join(__dirname, 'reservations.json'), 'utf-8'));

        await Catway.deleteMany({});
        await Reservation.deleteMany({});

        await Catway.insertMany(catways);
        await Reservation.insertMany(reservations);

        const existing = await User.findOne({ email: 'admin@russell.com' });
        if (!existing) {
            await User.create({
                username: 'admin',
                email: 'admin@russell.com',
                password: 'admin1234'
            });
            console.log('Utilisateur admin cree : admin@russell.com / admin1234');
        }

        console.log('Import termine : ' + catways.length + ' catways, ' + reservations.length + ' reservations.');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

importData();
