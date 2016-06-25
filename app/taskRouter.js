var express = require('express');
var taskRouter = express.Router();
var Project = require('../app/model/project');
var passport  = require('passport');
require('../config/passport')(passport);

taskRouter
	.get('/:proj_id/:task_id', passport.authenticate('jwt', { session: false}), function (req, res, next) {
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
	.post('/:proj_id', passport.authenticate('jwt', { session: false}), function (req, res, next) {
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
	})
	.delete('/:proj_id/:task_id', passport.authenticate('jwt', { session: false}), function (req, res, next) {
		Project.findOne({
			"_id": req.params.proj_id
		}, function (err, project) {
		 if (err) {
			return next(err);
		 } else if (!project) {
			return res.json({message: 'Ne postoji projekat sa id-jem: ' + req.params.proj_id});
		 }
		 
		 var task = project.tasks.id(req.params.task_id).remove();
		 
		 project.save(function (err, project) {
			if (err) return next(err);
			res.json(project);
		 });
		 
		});
	})
	.post('/:proj_id/:task_id', passport.authenticate('jwt', { session: false}), function (req, res, next) {
		Project.findOne({
			"_id": req.params.proj_id
		}, function (err, project) {
			if (err) {
				return next(err);
			} else if (!project) {
				return res.json({message: 'Ne postoji projekat sa id-jem: ' + req.params.proj_id});
			}
			
			var task = project.tasks.id(req.params.task_id);

			var newTask = req.body;
			task.task_name = newTask.task_name;
			task.task_status = newTask.task_status;
			task.task_priority = newTask.task_priority;
			task.task_description = newTask.task_description;
			task.assignedTo = newTask.assignedTo;

			project.save(function (err, project) {
				if (err) return next(err);
				res.json(project);
			});
		});
 });
	
module.exports = taskRouter;