const log = require('../helpers/log');
const {usersDb} = require('./DB');

module.exports = (app) => {
    app.get('/api', (req, res) => {
        const GET = req.query;
        res.json({
            success: true,
            GET
        });
        usersDb.insert(GET); // save in DB
    });
};

function error (err, res) {
    log.error(err);
    res.json({
        success: false,
        error: err
    });
}