require('marko/node-require').install();
require('marko/express'); //enable res.marko

var express = require('express');
var serveStatic = require('serve-static');
var isProduction = process.env.NODE_ENV === 'production';
var indexTemplate = require('./index.marko');
var app = express();
var port = process.env.PORT || 8080;

app.use('/static', serveStatic(__dirname + '/static'));

require('lasso').configure({
  plugins: [
    'lasso-marko' // Allow Marko templates to be compiled and transported to the browser
  ],
  outputDir: __dirname + '/static', // Place all generated JS/CSS/etc. files into the "static" dir
  urlPrefix: __dirname + '/static', // Place all generated JS/CSS/etc. files into the "static" dir
  bundlingEnabled: isProduction, // Only enable bundling in production
  minify: isProduction, // Only minify JS and CSS code in production
  fingerprintsEnabled: isProduction, // Only add fingerprints to URLs in production
});

app.use(require('lasso/middleware').serveStatic({
  lasso: {
    config: {
      outputDir: __dirname + '/static',
      urlPrefix: __dirname + '/static'
    }
  }
}));

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
