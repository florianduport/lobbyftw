var express = require('express');
//var exphbs  = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var steamHelper = require('steam-login');

var app = express();



global.steam = steamHelper;

var routes = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
/*var exphbsInstance = exphbs.create({
  layoutsDir: path.join(app.settings.views, ""),
	defaultLayout: 'layout',
	extname: '.html'
});*/
//app.engine('html', exphbsInstance.engine);

app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({ secret: 'lobbyftw' }));
if (app.get('env') === 'development'){
  app.use(steamHelper.middleware({
      realm: 'http://localhost:3000/',
      verify: 'http://localhost:3000/verify',
      apiKey: "D7A77ED400EAC15C7D155DB457DC503C"}
  ));
} else {
  app.use(steamHelper.middleware({
      realm: 'http://need-last.com/',
      verify: 'http://need-last.com/verify',
      apiKey: "D7A77ED400EAC15C7D155DB457DC503C"}
  ));
}
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});


module.exports = app;
