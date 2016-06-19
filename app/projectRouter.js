var express = require('express');
var projectRouter = express.Router();
var Project = require('../app/model/project');
var User = require('../app/model/user');

projectRouter
	.get('/', function (req, res, next) {
		Project.find({}, function (err, projects, next) {
      res.json(projects);
    });
	})
	.get('/:id', function(req, res, next) {
		Project.findOne({
			"_id": req.params.id
		}).populate('team').populate('tasks.author tasks.assignedTo').exec(function (err, project) {
			if (err) return next(err);
			res.json(project);
		});
	})
	.post('/', function (req, res, next) {
		var project = new Project(req.body);
		project.save(function (err, project) {
			if (err) return next(err);
			res.json(project);
		});
	})
	.put('/:proj_id/addUser/:user_id', function (req, res, next) {
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
	.put('/:proj_id/removeUser/:user_id', function (req, res, next) {
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
	})
	.post('/:proj_id/task', function (req, res, next) {
		Project.findOne({
			"_id": req.params.proj_id
		}, function (err, project) {
			if (err) {
				return next(err);
			} else if (!project) {
				return res.json({message: 'Ne postoji projekat sa id-jem: ' + req.params.proj_id});
			}
			
			var newTask = req.body;
			project.tasks.push(newTask);
			
			project.save(function (err, project) {
				if (err) return next(err);
				res.json(project);
			});
		});
	});
	
module.exports = projectRouter;