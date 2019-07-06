const config = require('../configReader');
const $u = require('./index');
module.exports = {
    dropExp(User, game) {
        const isDrop = $u.getProb(User.satats.probDropExp);
        if (!isDrop){
            return false;
        }
        // считаем размер
        const {lvl} = User;
        // const User

    }
    // 'dropExp', 'dropScore', 'dropBaff', 'dropArtefact'
};