import modelDb from '../helpers/modelNedb';

export const usersDb = modelDb({
    filename: 'db/users',
    compact: 10
});

export const refsBonusDb = modelDb({
    filename: 'db/refsBonuses',
    compact: 10
});
