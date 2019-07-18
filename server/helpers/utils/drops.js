const config = require('../configReader');

module.exports = {
    dropExp(user, game) {
        const {probDropExp} = user.stats;
        if (!getProb(probDropExp + game.countBombs / 10)){
            return false;
        }
        // считаем размер
        // const lvlWeidth = (config.levelsOpt.maxLvl + 1 - user.lvl) / 10000; // поправка левела чем больше левел тем меньше значение
        // console.log('>', config.levels, user.lvl, config.levels[String(user.lvl]);
        const exp = Math.round(config.levels[user.lvl + 1] * 0.05 * Math.random());
        this.updateExp(user, exp);
        console.log('Drop exp!', exp, user.exp);
        return exp;
    },
    dropScore(user, game) {
        const {probDropScore} = user.stats;
        if (!getProb(probDropScore + game.countBombs / 10)){
            return false;
        }
        const scr = game.bet * Math.random();
        game.dropedScores += scr;
        console.log('Drop scores!', scr);
        return scr;
    }
    // 'dropExp', 'dropScore', 'dropBaff', 'dropArtifact'
};

/**
     * @description получение вероятности по заданному параметру
     * @argument {number} процент от 1 до 100
     * @returns {boolean}
     */
function getProb(proc) {
    return Math.random() * 100 < proc;
}

// probDropScore: 20, // дроп очков
// probDropExp: 20, // дроп экспы
// probDropArtifact: 0.1, // дроп артефакта
// probDropBaff: 0.1, // дроп бафа
// escapeBomb: 20 // выжить при взрыве

// levelsOpt: {
//     first: 5,
//     martin: 1.5,
//     maxLvl: 100
