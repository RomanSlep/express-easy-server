const clone = require('clone');
import { usersDb, refsBonusDb } from '../../modules/DB';
const sha256 = require('sha256');

export default {
    clone,
    round(n: number): Number {
        return Number(n.toFixed(0));
    },
    unix(): Number {
        return new Date().getTime();
    },
    async getUserFromQ(q: IObject): Promise<IM_User> {
        return await usersDb.findOne(q);
    },

    /**
     * @param params параметры GET
     */
    async createUser(params: { login: string, password: string, refererId: string }): Promise<IResponse> {
        const {login, password, refererId} = params;
        if (!login.length || !password.length) {
            return {error: 'Неполные данные.'};
        }
        if (/[A-Za-z]/.test(login) && /[А-яф-я]/.test(login)){
            return { error: 'Запрещено мешать кириллицу и латиницу.' };
        }
        if (/^.*[^A-zА-яЁё].*$/.test(login)){
            return {error: 'Запрещено использовать знаки.'};
        }

        const checkUser: boolean = Boolean(await usersDb.findOne({
            $or: [{login}, {loginLowCase: login.toLowerCase()}]
        }));
        if (checkUser){
            return {error: 'Логин или адрес уже занят.'};
        }
        const user: IM_User = new usersDb({
            addresses: {},
            login,
            timestamp: this.unix(),
            loginLowCase: login.toLowerCase(),
            password: this.createPswd(password),
            deposits: {},
            refererId
        });
        // config.coins.forEach((c:string) => {
        //     user.deposits[c] = 0;
        //     user.addresses[c] = null;
        // });
        await user.save();
        await user.update({referalLink: user._id}, true);
        if (refererId) { // делаем запись в бд рефу
            const doc:IM_refsBonus = await refsBonusDb.findOne({refererId}) || new refsBonusDb({refererId, bonuses: {}});
            doc.bonuses[login] = {};
            await doc.save();
        }
        return { success: true, result: user };
    },
    createPswd(password: string): string {
        return sha256(password.toString());
    },
};
