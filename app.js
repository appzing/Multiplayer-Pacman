var express = require('express');
var path = require('path');

var users = require('./routes/users');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 4000)

app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);

var server = app.listen(app.get('port'), function(){
    console.log('listening');
})

var io = require('socket.io')(server);

require('./routes/index')(app,io);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
