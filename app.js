
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var config = require('./libs/config');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser({ uploadDir: __dirname + '/public/uploads'}));
app.use(express.methodOverride());
app.use(express.cookieParser('u$JeOIrBkuXotD5P'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.locals(config);

// database connection
var mongoose = require('mongoose');
mongoose.connect(config.DB.MongoDB);

var User = require('./models/user');
app.all('*', User.ValidateCookie);

// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./controllers/' + file);
      route.controller(app);
  }
});
fs.readdirSync('./controllers/admin').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./controllers/admin/' + file);
      route.controller(app);
  }
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    app.locals.pretty = true;
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
