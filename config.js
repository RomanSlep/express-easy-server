export default {
    min_bid: 0.1,
    percent_prize: 50,
    // игровые настройки
    randoms: { // какие возможности дропа/эффектов доступны в режимах
        farm: ['dropExp', 'dropScore', 'dropBaff', 'dropArtefact'],
        pvp: ['']
    },
    defaultStatPers: {
        probDropScore: 1, // дроп очков
        probDropExp: 1, // дроп экспы
        probDropArtefact: 1, // дроп артефакта
        probDropBaff: 1, // дроп бафа
        escapeBomb: 1 // выжить при взрыве
    },
    multUpStats: 0.3,
    scoreMult: 1000, // умножение очков
    levelsOpt: {
        first: 5,
        martin: 1.5,
        maxLvl: 100
    }
};
