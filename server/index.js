const express = require('express');
const bodyParser = require('body-parser');
const {usersDb, depositsDb} = require('./modules/DB');
const app = express();
// const session = require('express-session');
const log = require('./helpers/log');
const DIR_NAME = __dirname + '/public/';

require('./modules/api')(app);
require('./modules/seasonFinish');
require('./modules/cron');
require('./modules/checkerTx');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
// Sessions
// app.use(session({ resave: true, secret: '123456', saveUninitialized: true}));
const port = 36669;

app.use('/', express.static(DIR_NAME));
app.get('/', (req, res) => res.sendFile(DIR_NAME + 'index.html'));

// Админка
app.get('/admin-data', async(req, res) => res.json({
    users: await usersDb.db.syncFind({}),
    deposits: await depositsDb.db.syncFind({}),
}));
app.get('/adminjhgjedkl', async(req, res) =>res.sendFile(DIR_NAME + 'admin.html'));


app.listen(port, () => log.info('Server listening on port ' + port + ' http://localhost:' + port));
