export default {
    min_bid: 0.1,
    percent_prize: 50,
    // игровые настройки
    randoms: { // какие возможности дропа/эффектов доступны в режимах
        farm: ['dropExp', 'dropScore', 'dropBaff', 'dropArtefact'],
        pvp: ['']
    },
    defaultStatPers: {
        probDropScore: 20, // дроп очков
        probDropExp: 20, // дроп экспы
        probDropArtefact: 0.1, // дроп артефакта
        probDropBaff: 0.1, // дроп бафа
        escapeBomb: 20 // выжить при взрыве
    },
    levelsOpt: {
        first: 5,
        martin: 1.5,
        maxLvl: 100
    }
};