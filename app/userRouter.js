var express = require('express');
var userRouter = express.Router();
var User = require('../app/model/user');
var config = require('../config/database');
var jwt = require('jwt-simple');

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
		if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.password) {
			res.json({success: false, msg: 'Please pass first_name, last_name, email and password.'});
		} else {
			var user = new User(req.body);
			user.save(function(err) {
				if (err) {
					return res.json({success: false, msg: 'Email already exists.'});
				}
				res.json({success: true, msg: 'Successful created new user.'});
			});
		}
	})
	.post('/authenticate', function(req, res, next) {
		User.findOne({
			email: req.body.email
		}, function(err, user) {
			if (err) throw err;
			
			if (!user) {
				res.send({success: false, msg: 'Authentication failed. User not found.'});
			} else {
				// proveri da li se password poklapa
				user.comparePassword(req.body.password, function (err, isMatch) {
					if (isMatch && !err) {
						// ako je pronadjen user i poklapa se password kreira token
						var userDetails = {
							"user_id" : user._id,
							"email" : user.email,
							"role" : user.role
						};
						var token = jwt.encode(userDetails, config.secret);
						// vraca informaciju kao JWT token
						var resObject = { success: true, token: 'JWT ' + token };
						res.json(resObject);
					} else {
						res.send({success: false, msg: 'Authentication failed. Wrong password.'});
					}
				});
			}
		});
	});
	
module.exports = userRouter;