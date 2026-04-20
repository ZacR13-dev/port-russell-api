const mongoose = require('mongoose');

/**
 * Initialise la connexion a la base de donnees MongoDB.
 * @returns {Promise<void>}
 */
exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO, {
            dbName: 'port_russell'
        });
        console.log('Connecte a MongoDB');
    } catch (error) {
        console.log(error);
        throw error;
    }
};
