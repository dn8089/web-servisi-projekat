var express = require('express');
var commentRouter = express.Router();
var Project = require('../app/model/project');
var passport  = require('passport');
require('../config/passport')(passport);

commentRouter
	.get('/:proj_id/:task_id/:comm_id', function (req, res, next) {
		Project.findOne({
			"_id": req.params.proj_id
		}, function (err, project) {
			if (err) {
				return next(err);
			} else if (!project) {
				return res.json({message: 'Ne postoji projekat sa id-jem: ' + req.params.proj_id});
			}
		 
			var task = project.tasks.id(req.params.task_id);
			var comment = task.comments.id(req.params.comm_id);
			res.json(comment);
		});
	})
	.post('/:task_id', passport.authenticate('jwt', { session: false}), function (req, res, next) {
		Project.find({'tasks._id': req.params.task_id}, function (err, project, next) {
			if (err) {
				return next(err);
			} else if (!project) {
				return res.json({message: 'Ne postoji zadatak sa id-jem: ' + req.params.task_id});
			}
			
			var task = project[0].tasks.id(req.params.task_id);
			var newComment = req.body;
			newComment.createdAt = new Date(); 
			task.comments.push(newComment);
			
			project[0].save(function (err, project) {
				if (err) return next(err);
				res.json({message: 'Komenatar je dodat.'});
			});
		});
	})
	.delete('/:proj_id/:task_id/:comm_id', function (req, res, next) {
		Project.findOne({
			"_id": req.params.proj_id
		}, function (err, project) {
			if (err) {
				return next(err);
			} else if (!project) {
				return res.json({message: 'Ne postoji projekat sa id-jem: ' + req.params.proj_id});
			}
		 
			var task = project.tasks.id(req.params.task_id);
			task.comments.id(req.params.comm_id).remove();
		 
			project.save(function (err, project) {
				if (err) return next(err);
				res.json({message: 'Komenatar sa id-jem ' + req.params.comm_id + ' je izbrisan.'});
			});
		});
	})
	.put('/:proj_id/:task_id/:comm_id', function (req, res, next) {
		Project.findOne({
			"_id": req.params.proj_id
		}, function (err, project) {
			if (err) {
				return next(err);
			} else if (!project) {
				return res.json({message: 'Ne postoji projekat sa id-jem: ' + req.params.proj_id});
			}
			
			var task = project.tasks.id(req.params.task_id);
			var comment = task.comments.id(req.params.comm_id);

			var newComment = req.body;
			comment.text = newComment.text;
			comment.createdAt = new Date();

			project.save(function (err, project) {
				if (err) return next(err);
				res.json({message: 'Komenatar sa id-jem ' + req.params.comm_id + ' je izmenjen.'});
			});
		});
	});
	
module.exports = commentRouter;