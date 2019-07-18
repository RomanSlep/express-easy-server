export default {
    min_bet: 10,
    max_bet: 10000,
    scoreMult: 10, // умножение очков
    percent_prize: 80,
    regDrop: 100,
    coinName: 'ARTS',
    // игровые настройки
    randoms: { // какие возможности дропа/эффектов доступны в режимах
        farm: ['dropExp', 'dropScore', 'dropBaff', 'dropArtifact'],
        pvp: ['']
    },
    defaultStatPers: {
        probDropScore: 1, // дроп очков
        probDropExp: 1, // дроп экспы
        probDropArtifact: 1, // дроп артефакта
        probDropBaff: 1, // дроп бафа
        escapeBomb: 1 // выжить при взрыве
    },
    multUpStats: 0.3,
    levelsOpt: {
        first: 5,
        martin: 1.5,
        maxLvl: 100
    },
    gameMinterAddress: 'Mxfdfc236848d445e754b6660bec98a046ac59b5cd',
    stepStat: 0.1, // шаг прокачки
    seasonPeriod: '1d'
};
