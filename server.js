const contentType = require('./middlewares/contentType');
const fs = require('fs');
const pages = fs.readdirSync('./src/pages');
const express = require('express');
const serveStatic = require('serve-static');
const compression = require('compression'); // Provides gzip compression for the HTTP response
const isProduction = process.env.NODE_ENV === 'production';
const app = express();
const port = process.env.PORT || 8080;
require('app-module-path').addPath(__dirname);
require('marko/express');
require('marko/node-require');

require('lasso').configure({
    plugins: [
        'lasso-marko' // Allow Marko templates to be compiled and transported to the browser
    ],
    outputDir: __dirname + '/static', // Place all generated JS/CSS/etc. files into the "static" dir
    bundlingEnabled: isProduction, // Only enable bundling in production
    minify: isProduction, // Only minify JS and CSS code in production
    fingerprintsEnabled: isProduction, // Only add fingerprints to URLs in production
});

app.use(require('lasso/middleware').serveStatic());

//set content-type html
app.use(contentType);

// Map the "/" route to the home page
app.get(`/`, require(`./src/pages/home`))

//map more routes to the router
pages.map(page => app.get(`/${page}`, require(`src/pages/${page}`)))
// Enable gzip compression for all HTTP responses
app.use(compression());

// Allow all of the generated files under "static" to be served up by Express
app.use(require('lasso/middleware').serveStatic());

// app.get('/', function(req, res) {
//     res.marko(indexTemplate, {
//             name: 'Frank',
//             count: 30,
//             colors: ['red', 'green', 'blue']
//         });
// });

app.listen(port, function() {
    if (process.send) {
        process.send('online');
    }
});
