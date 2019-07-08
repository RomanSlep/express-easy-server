const log = require('../helpers/log');
const sha256 = require('sha256');
const {usersDb, gameTransDb, gamesDb, depositsDb} = require('./DB');
const startGame = require('./startGame');
const checkGame = require('./checkGame');
const $u = require('../helpers/utils');
const publicApi = require('./publicApi');
const Store = require('../helpers/Store');
const config = require('../helpers/configReader');

module.exports = (app) => {
    app.get('/api', async (req, res) => {
        let checkUser;
        try {
            // console.log(req.query);
            const action = req.query.action;
            const GET = JSON.parse(req.query.data);
            const User = await getUserFromToken(GET.token);
            // роуты
            switch (action) {
            case ('getUser'):
                if (User) {
                    //TODO: приделать время жизни токена
                    User.isLogged = true;
                    delete User.password;
                    delete User._id;
                    success(User, res);
                } else {
                    error(null, res);
                }
                break;

            case ('login'):
                checkUser = await usersDb.findOne({$and: [{login: GET.login}, {password: sha256(GET.password.toString())}]});
                if (!checkUser){
                    error('This login and password not found', res);
                    return;
                }
                checkUser.rating = Store.getRatingFromLogin(checkUser.login);
                success(await assignUser(checkUser), res);
                break;

            case ('registration'):
                const {login, password, address} = GET;
                if (!login.length || !password.length || !address.length) {
                    error('No full data', res);
                    return;
                }
                checkUser = await usersDb.findOne({
                    $or: [{ address }, { login }]
                });
                if (checkUser){
                    error('Login or address already exists!', res);
                    return;
                }
                let newUser = new usersDb({
                    address,
                    login,
                    password: sha256(password.toString()),
                    deposit: 0,
                    score: 0,
                    lvl: 1,
                    exp: 0,
                    leftStatPoints: 0, // очки статистики
                    stats: config.defaultStatPers
                });
                success(await assignUser(newUser), res);
                break;

            case ('testDeposit'):
                await depositsDb.db.syncInsert({user_id: User._id, amount: 1, type: 'deposit'});
                User.updateData(()=>{
                    success('Success add!', res);
                });
                break;

            case ('getNoFinished'):
                success($u.filterGame(await $u.getNofinishGame(User)), res);
                break;

            case ('startGame'):
                const start = await startGame(User, GET);
                if (start.res) {
                    success($u.filterGame(start.game), res);
                } else {
                    error(start.msg, res);
                }
                break;

            case ('choice'):
                GET.isStep = true;
                const check = await checkGame(User, GET);
                if (check.res) {
                    success(check.game, res);
                } else {
                    error(check.msg, res);
                }
                break;

            case ('pickUpWinnings'):
                GET.isPickUpWinnings = true;
                const checkg = await checkGame(User, GET);
                if (checkg.res) {
                    success(checkg.game, res);
                } else {
                    error(checkg.msg, res);
                }
                break;
            }

        } catch (e) {
            console.log({e});
            error('Error api code 1', res);
        }
    });
    app.get('/public', async (req, res) => {
        publicApi(req, res);
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
    const user = await usersDb.findOne({token});
    if (user){
        user.updateData = updateData;
        user.rating = Store.getRatingFromLogin(user.login);
    }
    return user;
}

async function updateData(cb) {
    const user = this;

    try {
        let {deposit, score} = await $u.getGamesDepositAndScore(user._id);
        deposit += await $u.getUserDeposits(user._id);
        score += await $u.getDropsScores(user._id);
        score *= config.scoreMult;

        deposit = Number(deposit.toFixed(8)) || 0;
        score = Number(score.toFixed(0)) || 0;
        if (!deposit || !score) {
            return;
        }
        await user.update({deposit, score}, true);
        cb && cb();
    } catch (e) {
        log.error('updateData ' + e);
    }
}
