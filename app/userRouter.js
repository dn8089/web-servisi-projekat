var express = require('express');
var userRouter = express.Router();
var User = require('../app/model/user');

userRouter
	.get('/:id', function(req, res, next) {
	    User.findOne({
	      "_id": req.params.id
	    }, function (err, user) {
	      if (err) return next(err);
	      res.json(user);
	    });
	})
  .get('/', function(req, res) {
    User.find({}, function (err, users, next) {
      res.json(users);
    });
  })
	.post('/', function (req, res, next) {
		var user = new User(req.body);
		user.save(function (err, user) {
			if (err) return next(err);
			res.json(user);
		});
	});
	
module.exports = userRouter;