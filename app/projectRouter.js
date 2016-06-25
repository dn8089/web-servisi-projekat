var express = require('express');
var projectRouter = express.Router();
var Project = require('../app/model/project');
var User = require('../app/model/user');
var passport  = require('passport');
var config = require('../config/database'); // get db config file
var jwt = require('jwt-simple');
require('../config/passport')(passport);

projectRouter
	.get('/', passport.authenticate('jwt', { session: false}), function (req, res, next) {
		Project.find({}, function (err, projects, next) {
      res.json(projects);
    });
	})
	.get('/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
		Project.findOne({
			"_id": req.params.id
		}).populate('team').populate('tasks.author tasks.assignedTo').exec(function (err, project) {
			if (err) return next(err);
			res.json(project);
		});
	})
	.post('/', passport.authenticate('jwt', { session: false}), function (req, res, next) {
		var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if(!decoded.role||decoded.role!=='admin'){
      return res.status(403).send({success: false, msg: 'Not allowed.'});    
    }
		var project = new Project(req.body);
		project.save(function (err, project) {
			if (err) return next(err);
			res.json(project);
		});
	})
	.put('/:proj_id/addUser/:user_id', passport.authenticate('jwt', { session: false}), function (req, res, next) {
		var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if(!decoded.role||decoded.role!=='admin'){
      return res.status(403).send({success: false, msg: 'Not allowed.'});    
    }
		User.findOne({
			"_id": req.params.user_id
		}, function (err, user) {
			if (err) {
				return next(err);
			} else if (!user) {
				return res.json({message: 'Ne postoji korisnik sa id-jem: ' + req.params.user_id});
			}
			
			Project.findByIdAndUpdate({
				"_id": req.params.proj_id
			}, {
				$addToSet: {"team": req.params.user_id}
			}, function (err, project) {
				if (err) {
					return next(err);
				} else if (!project) {
					return res.json({message: 'Ne postoji projekat sa id-jem: ' + req.params.proj_id});
				}
				
				res.json(project);
			});
		});
	})
	.put('/:proj_id/removeUser/:user_id', passport.authenticate('jwt', { session: false}), function (req, res, next) {
		var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if(!decoded.role||decoded.role!=='admin'){
      return res.status(403).send({success: false, msg: 'Not allowed.'});    
    }
		Project.findByIdAndUpdate({
			"_id": req.params.proj_id
		}, {
			$pull: {"team": req.params.user_id}
		}, function (err, project) {
			if (err) {
				return next(err);
			} else if (!project) {
				return res.json({message: 'Ne postoji projekat sa id-jem: ' + req.params.proj_id});
			}
			res.json(project);
		});
	});
	
var getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
	
module.exports = projectRouter;