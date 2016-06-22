var express = require('express');
var taskRouter = express.Router();
var Project = require('../app/model/project');
//var User = require('../app/model/user');

taskRouter
	.post('/:proj_id', function (req, res, next) {
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
	
module.exports = taskRouter;