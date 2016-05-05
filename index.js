/* libraries */

var mongoose = require('mongoose');

/* db connect and schema */

var DB_USERNAME = process.env.DB_USERNAME || require('./constants').DB_USERNAME;
var DB_PASSWORD = process.env.DB_PASSWORD || require('./constants').DB_PASSWORD;
var DB_URI = 'mongodb://'+ DB_USERNAME +':'+ DB_PASSWORD +'@ds013559.mlab.com:13559/tornament';
var db = mongoose.connect(DB_URI);

var app = require('./server/server');

app.listen(app.get('port'), function () {
    console.log('Example app listening on port ' + app.get('port') + '!');
});
