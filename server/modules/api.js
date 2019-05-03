const log = require('../helpers/log');
const {
    usersDb
} = require('./DB');

module.exports = (app) => {
    app.get('/api', (req, res) => {
        try {
            const GET = req.query;
            success(null, res);
            usersDb.insert(GET); // save in DB
        } catch (e) {
            error(e, res);
        }
    });
};

function error (err, res) {
    log.error(err);
    res.json({
        success: false,
        error: err
    });
}

function success (data, res) {
    res.json({
        success: true,
        result: data
    });
}