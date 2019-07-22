
const db = require('./modules/DB');

function init() {
    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();
    const log = require('./helpers/log');
    const DIR_NAME = __dirname + '/public/';
    const $u = require('./helpers/utils');
    
    require('./modules/api')(app);
    require('./modules/serverIo');
    // require('./modules/cron');
    // require('./modules/checkerTx');

    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({
        extended: true
    })); // for parsing application/x-www-form-urlencoded
    const port = 3303;

    app.use('/', express.static(DIR_NAME));
    app.get('/', (req, res) => res.sendFile(DIR_NAME + 'index.html'));
    app.get('/db', async (req, res) => {
        res.json(await db[req.query.db].syncFind({}));
    });

    app.listen(port, () => log.info('Server listening on port ' + port + ' http://localhost:' + port));
}
setTimeout(init, 3000);