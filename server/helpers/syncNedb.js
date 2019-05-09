module.exports = (db, compact) => {
	
    db.__proto__.syncInsert = async function (q) {
        return new Promise((resolve) => {
            db.insert(q, (err, res) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(res);
                }
            });
        });
    }

    db.__proto__.syncFind = async function (q) {
        return new Promise((resolve) => {
            db.find(q, (err, res) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(res);
                }
            });
        });
    };

    db.__proto__.syncFindOne = async function (q) {
        return new Promise((resolve) => {
            db.findOne(q, (err, res) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(res);
                }
            });
        });
    };

    db.__proto__.syncUpdate = async function (a, b, c = {}) {
        return new Promise((resolve) => {
            db.update(a, b, c, (err, res) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(res);
                }
            });
        });
    };

    if (compact) {
        db.persistence.setAutocompactionInterval(compact * 1000 * 60);
    }

    return db;
}
