
const template = require('./index.marko');

module.exports = function(req, res) {
    res.marko(template, {});
};