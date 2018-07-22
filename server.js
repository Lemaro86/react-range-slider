const express = require('express');
const compression = require('compression');
const colors = require('colors');

(async function() {
    const app = new (require('express'))();
    app.use(compression());

    const developerEnv = app.get('env') === 'development';
    const productionEnv = app.get('env') === 'production';

    //COMPILE
    if (developerEnv) {
        const webpack = require('webpack');
        const webpackDevMiddleware = require('webpack-dev-middleware');
        const webpackHotMiddleware = require('webpack-hot-middleware');
        const config = require('./webpack.config');

        const compiler = webpack(config);

        console.log("Server Running in Developer Environment".green.bold);

        app.use(webpackHotMiddleware(compiler));
        app.use(webpackDevMiddleware(compiler, {
            stats: { colors: true, progress: true },
            publicPath: config.output.publicPath
        }));
    }

    if (productionEnv) {
        console.log("Server Running in Production Environment".red.bold);
    }

    app.use("/dist", express.static('dist'));
    app.use("/favicons", express.static('favicons'));

    if (developerEnv) {
        app.get("/*", function(req, res) {
            res.sendFile(__dirname + '/index.html');
        });
    } else {
        app.get("/*", function(req, res) {
            res.sendFile(__dirname + '/dist/index.html');
        });
    }

    app.listen(3000, function (error) {
        if (error) {
            console.error(error);
        } else {
            console.info("Running on port %s.", 3000);
        }
    });
})();
