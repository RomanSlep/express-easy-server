import * as fs from 'fs';
if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}

let infoStr:fs.WriteStream = fs.createWriteStream('./logs/' + date() + '.log', {
    flags: "a"
});

infoStr.write(`
_________________${fullTime()}_________________

`);

export default {
    error (str:String) {
        infoStr.write(`
` + 'error|' + time() + '|' + str);
        console.log('\x1b[31m', 'error|' + time(), "\x1b[0m", str);
    },
    info (str:String) {
        console.log('\x1b[32m', 'info|' + time(), "\x1b[0m", str);

        infoStr.write(`
` + 'info|' + time() + '|' + str);
    },
    warn (str:String) {
        console.log('\x1b[33m', 'warn|' + time(), "\x1b[0m", str);

        infoStr.write(`
		` + 'warn|' + time() + '|' + str);
    },
};

function time () {
    var options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    return new Date().toLocaleString("en", options);
}

function date () {
    var options = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    };
    return (new Date().toLocaleString("en", options)).replace(/\//g, '-');
}

function fullTime () {
    return date() + ' ' + time();
}