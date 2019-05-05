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
                const { login, password, address } = GET;
                if (!login.length || !password.length || !address.length) {
                    error('No full data', res);
                    return;
                }
                let user = usersDb.syncFind({
                    $or: [{ address }, { login }]
                });
                if (user){
                    error('Login or password already exists!', res);
                    return;
                }
                usersDb.insert({
                    address,
                    login,
                    password
                }, (err, newUser) => {
                    success(newUser, res);
                    console.log({
                        newUser
                    });
                });
                break;
            }

            success(GET, res);
        } catch (e) {
            error('Error api code 1', res);
        }
    });
};

function error(msg, res) {
    log.error(msg);
    res.json({
        success: false,
        msg,
    });
}

function success(data, res) {
    res.json({
        success: true,
        result: data
    });
}