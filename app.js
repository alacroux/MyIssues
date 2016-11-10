var express     = require('express');
var app         = express();
var http        = require('http').Server(app);
var logger      = require('./components/logger').getSingleton();
var handler     = require('./components/handler').getSingleton(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});

http.listen(8080, function() {
    logger.log('Express server listening on port ' + http.address().port);
});