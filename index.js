const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const DIR_NAME = __dirname + '/public/';
require('./api')(app);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

const port = 36669;

app.use('/', express.static(DIR_NAME));
app.get('/', (req, res) => res.sendFile(DIR_NAME + 'index.html'));

app.listen(port, () => console.info('Server listening on port ' + port + ' http://localhost:' + port));