import modelDb from '../helpers/modelNedb';

export const usersDb = modelDb({
    filename: 'db_/users',
    compact: 10
});

export const refsBonusDb = modelDb({
    filename: 'db_/refsBonuses',
    compact: 10
});
