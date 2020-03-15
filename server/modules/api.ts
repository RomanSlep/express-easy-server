import log from '../helpers/log';
import {Express, Response} from 'express';
import {usersDb} from './DB';
import $u from '../helpers/utils';
import publicApi from './publicApi';

const sha256 = require('sha256');

export default (app: Express) => {
    app.get('/api', async (req, res) => {
        let checkUser:IM_User;
        try {
            const action: string = req.query.action;
            const GET = JSON.parse(decodeURIComponent(req.query.data));
            const User:IM_User = await $u.getUserFromQ({token: GET.token});
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
                success(await assignUser(checkUser), res);
                break;

            case ('registration'):
                const resCreate:IResponse = await $u.createUser(GET);
                if(resCreate.error){
                    return error(resCreate.error, res);
                }
                success(await assignUser(resCreate.result), res);
                break;
                
            default:
                error('error endpoint', res);
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

function error(msg:string, res: Response) {
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
function success(data:IObject, res:Response) {
    try {
        res.json({
            success: true,
            result: data
        });
    } catch (e) {
        console.log(e);
    }
}

async function assignUser (user:IM_User){
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


