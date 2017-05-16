require('marko/express'); //enable res.marko
require('marko/node-require').install();

require('lasso').configure({
    plugins: [
        'lasso-marko' // Allow Marko templates to be compiled and transported to the browser
    ],
    outputDir: __dirname + '/static', // Place all generated JS/CSS/etc. files into the "static" dir
    bundlingEnabled: isProduction, // Only enable bundling in production
    minify: isProduction, // Only minify JS and CSS code in production
    fingerprintsEnabled: isProduction, // Only add fingerprints to URLs in production
});

var express = require('express');
var serveStatic = require('serve-static');
var compression = require('compression'); // Provides gzip compression for the HTTP response
var isProduction = process.env.NODE_ENV === 'production';
var indexTemplate = require('./index.marko');
var app = express();
var port = process.env.PORT || 8080;

// Enable gzip compression for all HTTP responses
app.use(compression());

// Allow all of the generated files under "static" to be served up by Express
app.use(require('lasso/middleware').serveStatic());

app.get('/', function(req, res) {
    res.marko(indexTemplate, {
            name: 'Frank',
            count: 30,
            colors: ['red', 'green', 'blue']
        });
});

app.listen(port, function() {
    if (process.send) {
        process.send('online');
    }
});
