const log = require('../helpers/log');
const sha256 = require('sha256');
const {usersDb} = require('./DB');

module.exports = (app) => {
    app.get('/api', async (req, res) => {
        let checkUser;
        try {
            const action = req.query.action.toLowerCase();
            const GET = JSON.parse(req.query.data);
            const User = await getUserFromToken(GET.token);
            // роуты
            switch (action) {
            case ('getuser'):
                if (User) {
                    //TODO: приделать время жизни токена
                    success(User, res);
                } else {
                    error(null, res);
                }
                break;
            case ('login'):
                checkUser = await usersDb.findOne({$and: [{login: GET.login}, {password: GET.password}]});
                if (!checkUser){
                    error('This login and password not found', res);
                    return;
                }
                success(await assignUser(checkUser), res);

                break;

            case ('registration'):
                const { login, password, address } = GET;
                if (!login.length || !password.length || !address.length) {
                    error('No full data', res);
                    return;
                }
                checkUser = await usersDb.findOne({
                    $or: [{ address }, { login }]
                });
                if (checkUser){
                    error('Login or password already exists!', res);
                    return;
                }
                const newUser = new usersDb({
                    address,
                    login,
                    password
                }, true);
                success(await assignUser(newUser), res);
                break;
            }
        } catch (e) {
            console.log({e});
            error('Error api code 1', res);
        }
    });
};

function error (msg, res) {
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
function success (data, res) {
    try {
        res.json({
            success: true,
            result: data
        });
    } catch (e) {
        console.log(e);
    }
}

async function assignUser (user){
    try {
        const token = sha256(new Date().toString());
        user.token = token;
        await user.save();
        delete user._id;
        delete user.password;
        return user;
    } catch (e){
        console.log('assignUser: ' + e);
    }
}

async function getUserFromToken (token) {
    return await usersDb.findOne({
        token
    });
}
