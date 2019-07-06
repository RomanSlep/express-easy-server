const fs = require('fs');
const configJson = fs.readFileSync(__dirname + '/../../config.js')
    .toString()
    .replace('export default', '')
    .replace(';', '');
const config = eval('(' + configJson + ')');
config.levels = mathLvl(config.levelsOpt);

function mathLvl(opts) {
    const lvls = {
        2: opts.first
    };
    for (let i = 3; i <= opts.maxLvl; i++) {
        let res = Math.floor(lvls[i - 1] + opts.martin * i);
        lvls[i] = res;
        console.log(res / i);
    };
    return lvls;
};

console.log('LVLV', config.levels);
module.exports = config;