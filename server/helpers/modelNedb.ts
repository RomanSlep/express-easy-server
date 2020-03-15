import * as nedb from 'nedb';

interface IModelCreatedDb {
    filename: string,
    compact: number
}

interface IModel {
   _id?:boolean|string
}

export default (dbParams: IModelCreatedDb) => {
    const {filename, compact} = dbParams;
   
    const db = new syncNeDb({
            filename,
            autoload: true
        });
        
    if (compact) {
        db.persistence.setAutocompactionInterval(compact * 1000 * 60);
    }

    return class NedbModel implements IModel{
        
        static db:syncNeDb = db;
        _id:boolean|string = false;

        constructor (data = {}, isSave:Boolean = false) {
            Object.assign(this, data);
            if (isSave){
                this.save();
            }
        }
        // static get db () {
        //     return db;
        // }
         /**
         * @returns {Array<NedbModel>}
         */
        static async find(q: IObject):Promise<NedbModel[]> { // return Array
            const res = await db.syncFind(q);
            if (res) {
                return res.map((d: IObject) => new this(d));
            }
        }

        static async findOne(q: IObject):Promise<NedbModel|null> {
            const res = await db.syncFindOne(q);
            if (res) {
                return new this(res);
            } else {
                return null;
            }
        }
        async update (obj:IObject, isSave:Boolean = false) {
            Object.assign(this, obj);
            if (isSave) {
                await this.save();
            }
        }
        async save() {
            if (!this._id) {
                const doc: IModel = await db.syncInsert(this._data());
                doc && (this._id = doc._id);
            } else {
                await db.syncUpdate({ _id: this._id }, { $set: this._data() }, { upsert: true });
            }
        }
        private _data () {
            const data:IObject = {};
            for (let field in this) {
                if (!['db', '_id'].includes(field)) {
                    data[field] = this[field];
                }
            }
            return data;
        }
    };
};

class syncNeDb extends nedb {
    async syncInsert (q:IObject) {
        return new Promise(resolve => {
            this.insert(q, (err, res:null|IObject) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(res);
                }
            });
        });
    }
    
    async syncFind (q:IObject):Promise<IObject[]|false> {
        return new Promise(resolve => {
            this.find(q, (err:Error, res:IObject[]) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(res);
                }
            });
        });
    }

    async syncFindOne (q:IObject):Promise<IObject|false> {
        return new Promise(resolve => {
            this.findOne(q, (err, res:null|IObject) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(res);
                }
            });
        });
    }
    async syncUpdate (a:IObject, b:any, c = {}) {
        return new Promise(resolve => {
            this.update(a, b, c, (err:Error, res) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(res);
                }
            });
        });
    }
};
