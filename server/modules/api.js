const log = require('../helpers/log');
const {
    usersDb
} = require('./DB');

module.exports = (app) => {
    app.get('/api', (req, res) => {
        try {
            const action = req.query.action.toLowerCase();
            const GET = JSON.parse(req.query.data);
            // роуты
            switch (action) {
            case ('login'):

                break;
            case ('register'):

                break;

            }

            success(GET, res);
        } catch (e) {
            error(e, res);
        }
    });
};

function error(err, res) {
    log.error(err);
    res.json({
        success: false,
        error: err
    });
}

function success(data, res) {
    res.json({
        success: true,
        result: data
    });
}