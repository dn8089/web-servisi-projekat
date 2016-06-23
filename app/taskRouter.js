var express = require('express');
var taskRouter = express.Router();
var Project = require('../app/model/project');

taskRouter
	.get('/:proj_id/:task_id', function (req, res, next) {
		Project.findOne({
			"_id": req.params.proj_id
		}).populate('tasks.author tasks.assignedTo').exec(function (err, project) {
			if (err) {
				return next(err);
			} else if (!project) {
				return res.json({message: 'Ne postoji projekat sa id-jem: ' + req.params.proj_id});
			}
			
			var task = project.tasks.id(req.params.task_id);
			res.json(task);
		});
	})
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