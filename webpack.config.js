/* eslint-disable*/
const path = require('path');
const {
    exec
} = require('child_process');
const Dist = path.resolve(__dirname, './server/public/dist');
const isDev = process.argv[3] === 'development';
let ls;

module.exports = {
    entry: {
        app: './app/app.js',
    },
    output: {
        path: Dist,
        filename: 'build.js'
    },
    devtool: isDev ? 'eval-source-map' : false,
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/
        }, {
            test: /\.(htm)$/,
            use: {
                loader: 'html-loader'
            }
        }]
    },
    resolve: {
        alias: {
            // Env: path.resolve(__dirname, "env/"),
            // Src: path.resolve(__dirname, "src/"),
        }
    },
    plugins: [],
    watchOptions: {
        ignored: ['node_modules']
    }
};

if (isDev) {
    ls = exec('node server');
    ls.stdout.on('data', data => console.log('\x1b[35m', 'Server:', data.replace('\n', '')));

}