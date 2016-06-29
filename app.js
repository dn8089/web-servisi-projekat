var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var userRouter = require(__dirname + '/app/userRouter');
var projectRouter = require(__dirname + '/app/projectRouter');
var taskRouter = require(__dirname + '/app/taskRouter');
var commentRouter = require(__dirname + '/app/commentRouter');
var reportRouter = require(__dirname + '/app/reportRouter');
var config = require(__dirname+'/config/database'); // get db config file

mongoose.connect(config.database);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8090;

app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/comments', commentRouter);
app.use('/api/reports', reportRouter);
app.use('/ticketingSystem', express.static(__dirname + '/client'));
app.use('/lib', express.static(__dirname + '/bower_components'));

app.use(function(err, req, res, next) {
  var message = err.message;
  var error = err.error || err;
  var status = err.status || 500;

  res.status(status).json({
    message: message,
    error: error
  });
});

app.listen(port);
console.log('Server radi na portu ' + port);
