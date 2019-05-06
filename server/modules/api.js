const log = require('../helpers/log');
const sha256 = require('sha256');
const {usersDb, transDb, gamesDb} = require('./DB');
const startGame = require('./startGame');
const checkGame = require('./checkGame');
const $u = require('../helpers/utils');

module.exports = (app) => {
    app.get('/api', async (req, res) => {
        try {
            console.log(req.query);
            const action = req.query.action;
            const GET = JSON.parse(req.query.data);
            const User = await getUser(GET.token);
            if (User) {
                User.__proto__.updateDeposit = updateDeposit;
            }
            // роуты
            switch (action) {
            case ('getUser'):
                if (User) {
                    //TODO: приделать время жизни токена
                    User.isLoged = true;
                    console.log(User)
                    success(User, res);
                } else {
                    error(null, res);
                }
                break;

            case ('login'):
                usersDb.findOne({$and: [{login: GET.login}, {password: sha256(GET.password.toString())}]}, (err, user)=>{
                    if (!user){
                        error('This login and password not found', res);
                        return;
                    }
                    success(assignUser(user), res);
                });
                break;
                
            case ('registration'):
                const {login, password, address} = GET;
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
                    password: sha256(password.toString()),
                    deposit: 0
                }, (err, newUser) => {
                    if (err){
                        error('Error create user', res);
                        return;
                    }
                    success(assignUser(newUser), res);
                });
                break;

            case ('testDeposit'):
                transDb.insert({user_id: User._id, amount: 1, isTest: true}, ()=>{
                    User.updateDeposit();
                });
                success('Success add!', res);
                break;

            case ('getNoFinished'):
                gamesDb.findOne({$and: [{user_id: User._id}, {isGame: true}]}, (err, game) =>{
                    if (err){
                        error('Error code 4', res);
                        return;
                    }
                    success($u.filterGame(game), res);
                });
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
                // проверяем начатую игру
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
        const token = sha256(new Date().toString());
        user.token = token;
        usersDb.update({address: user.address}, {$set: {token}});
        delete user._id;
        delete user.password;
        return user;
    } catch (e){
        console.log('assignUser: ' + e);
    }
}
async function getUser(token){
    return await usersDb.syncFindOne({token});
}
function updateDeposit() {
    const user = this;
    transDb.find({user_id: user._id}, (err, transes) => {
        if (err) {
            return;
        }
        try {
            let deposit = transes.reduce((s, t) => {
                return s + t.amount;
            }, 0);
            deposit = Number(deposit.toFixed(8)) || 0;
            usersDb.update({address: user.address}, {$set: {deposit}});
        } catch (e) {
            log.error('UpdateDeposit ' + e);
        }
    });
}