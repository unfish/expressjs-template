
/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser')
var errorhandler = require('errorhandler')
var bodyParser = require('body-parser')
var serveStatic = require('serve-static')
var logger = require('morgan');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');

var http = require('http');
var path = require('path');
var fs = require('fs');
var config = require('./libs/config');
var gl = require('./libs/global');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('u$JeOIrBkuXotD5P'));
app.use(serveStatic(path.join(__dirname, 'public')));

//set Site and Func global to views
app.locals.Site = config.Site;
app.locals.Func = gl.Func;

// database connection
var mongoose = require('mongoose');
mongoose.connect(config.DB.DataDB);

var User = require('./models/user');
app.all('*', User.ValidateCookie);

// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./controllers/' + file);
      route.controller(app);
  }
});
fs.readdirSync('./controllers/api').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./controllers/api/' + file);
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
