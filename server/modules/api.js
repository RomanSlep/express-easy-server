const log = require('../helpers/log');
const sha256 = require('sha256');
const {usersDb} = require('./DB');

module.exports = (app) => {
    app.get('/api', async (req, res) => {
        try {
            const action = req.query.action.toLowerCase();
            const GET = JSON.parse(req.query.data);
            // роуты
            switch (action) {
            case ('login'):
                usersDb.findOne({$and: [{login: GET.login}, {password: GET.password}]}, (err, user)=>{
                    if (!user){
                        error('This login and password not found', res);
                        return;
                    }
                    success(assignUser(user), res);
                });
                break;
                
            case ('registration'):
                const { login, password, address } = GET;
                if (!login.length || !password.length || !address.length) {
                    error('No full data', res);
                    return;
                }
                const checUser = await usersDb.syncFindOne({
                    $or: [{ address }, { login }]
                });
               
                if (checUser){
                    error('Login or password already exists!', res);
                    return;
                }
                usersDb.insert({
                    address,
                    login,
                    password
                }, (err, newUser) => {
                    if (err){
                        error('Error create user', res);
                        return;
                    }
                    success(assignUser(newUser), res);
                });
                break;
            }
        } catch (e) {
            console.log({e});
            error('Error api code 1', res);
        }
    });
};

function error(msg, res) {
    try {
        log.error(msg);
        res.json({
            success: false,
            msg,
        });
    } catch (e) {
        console.log(e);
    }
}
function success(data, res) {
    try {
        res.json({
            success: true,
            result: data
        });
    } catch (e) {
        console.log(e);
    }
}

function assignUser(user){
    try {
        user.token = sha256(new Date().toString());
        delete user._id;
        delete user.password;
        return user;
    } catch (e){
        console.log('assignUser: ' + e);
    }
}