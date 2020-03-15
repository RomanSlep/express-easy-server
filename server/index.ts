require('source-map-support').install(); // soursemap 
import * as express from 'express';
import {Response, Express} from 'express';
import * as bodyParser from 'body-parser';
const app:Express = express();
// const session = require('express-session');
import log from './helpers/log';
const DIR_NAME:string = getDirName() + '/server/public';
import api from './modules/api';
api(app);
// require('./modules/cron');
// require('./modules/checkerTx');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
// Sessions
// app.use(session({ resave: true, secret: '123456', saveUninitialized: true}));
const port = 36669;

app.use('/', express.static(DIR_NAME));
app.get('/', (req, res: Response) => res.sendFile(DIR_NAME + 'index.html'));

app.listen(port, () => log.info('Server listening on port ' + port + ' http://localhost:' + port));

/**
 * Получаем dirName родительский
 */
function getDirName() {
    const sep = __dirname.includes('/') ? '/' : '\\';
    const dirs = __dirname.split(sep);
    dirs.pop();
    return dirs.join(sep);
}