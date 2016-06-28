var express = require('express');
var taskRouter = express.Router();
var Project = require('../app/model/project');
var passport  = require('passport');
var config = require('../config/database'); // get db config file
var jwt = require('jwt-simple');
require('../config/passport')(passport);

taskRouter
	.get('/', passport.authenticate('jwt', { session: false}), function (req, res, next) {
		var userId = req.query.id;
		var filter = {'tasks.assignedTo': userId};
		var status = req.query.status;
		var priority = req.query.priority;
		
		if (status && priority) {
			filter = {'tasks.assignedTo': userId, 'tasks.task_status' : status, 'tasks.task_priority': priority};
		} else if (status) {
			filter = {'tasks.assignedTo': userId, 'tasks.task_status' : status};
		} else if (priority) {
			filter = {'tasks.assignedTo': userId, 'tasks.task_priority': priority};
		}
		
		Project.find(filter, {'tasks': 1}).populate('tasks.author tasks.assignedTo tasks.comments.signedBy').exec(function (err, projects) {
			if (err) return next(err);
			
			res.json(getTasks(userId, projects, status, priority));
		});
	})
	.get('/:proj_id/:task_id', passport.authenticate('jwt', { session: false}), function (req, res, next) {
		Project.findOne({
			"_id": req.params.proj_id
		}).populate('tasks.author tasks.assignedTo tasks.comments.signedBy').exec(function (err, project) {
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
		var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if(!decoded.role||decoded.role!=='admin'){
      return res.status(403).send({success: false, msg: 'Not allowed.'});    
    }
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

var getTasks = function (userId, projects, status, priority) {
	var userTasks = [];
	if (status && priority) {
		projects.forEach(function (project) {
			project.tasks.forEach(function (task) {
				if (task.assignedTo && task.assignedTo._id == userId && task.task_status == status && task.task_priority == priority) {
					var t = task.toObject();
					t.proj_id = project._id;
					userTasks.push(t);
				} 
			});
		});
	} else if (status) {
		projects.forEach(function (project) {
			project.tasks.forEach(function (task) {
				if (task.assignedTo && task.assignedTo._id == userId && task.task_status == status) {
					var t = task.toObject();
					t.proj_id = project._id;
					userTasks.push(t);
				} 
			});
		});
	} else if (priority) {
		projects.forEach(function (project) {
			project.tasks.forEach(function (task) {
				if (task.assignedTo && task.assignedTo._id == userId && task.task_priority == priority) {
					var t = task.toObject();
					t.proj_id = project._id;
					userTasks.push(t);
				} 
			});
		});
	} else {
		projects.forEach(function (project) {
			project.tasks.forEach(function (task) {
				if (task.assignedTo && task.assignedTo._id == userId) {
					var t = task.toObject();
					t.proj_id = project._id;
					userTasks.push(t);
				} 
			});
		});
	}
	return userTasks;
}
 
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
	
module.exports = taskRouter;