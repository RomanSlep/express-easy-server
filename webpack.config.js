/* eslint-disable*/
const path = require('path');
const {exec} = require('child_process');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const Dist = path.resolve(__dirname, './server/public/dist');
const isDev = process.argv[3] === 'development';
let ls;

module.exports = {
    entry: {
        app: './app/entry.js',
    },
    output: {
        path: Dist,
        filename: 'build.js'
    },
    devtool: isDev && 'eval-source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        }, {
            test: /\.(html)$/,
            use: {
                loader: 'html-loader'
            },

        },{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                hotReload: true
              }
          }]
    },
    resolve: {
        alias: {
            // Env: path.resolve(__dirname, "env/"),
            // Src: path.resolve(__dirname, "src/"),
        }
    },
    plugins: [
        new VueLoaderPlugin()
      ],
    watchOptions: {
        ignored: ['node_modules']
    }
};

if (isDev) {
    ls = exec('nodemon server --watch server --ignore server/public');
    ls.stdout.on('data', data => console.log('\x1b[35m', 'Server:', data.replace('\n', '')));
}