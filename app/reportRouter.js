var express = require('express');
var projectRouter = express.Router();
var Project = require('../app/model/project');
var passport  = require('passport');
var config = require('../config/database'); // get db config file
var jwt = require('jwt-simple');
require('../config/passport')(passport);

projectRouter
	.get('/:proj_id/:type', passport.authenticate('jwt', { session: false}), function(req, res, next) {
		var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if(!decoded.role||decoded.role!=='admin'){
      return res.status(403).send({success: false, msg: 'Not allowed.'});    
    }
		Project.findOne({
			"_id": req.params.proj_id
		}).populate('team tasks.assignedTo').exec(function (err, project) {
			if (err) {
				return next(err);
			} else if (!project) {
				return res.json({message: 'Ne postoji projekat sa id-jem: ' + req.params.proj_id});
			}
			
			var tasks = project.tasks;
			var team = project.team;
			var report = {};
			var labels = [];
			var data = [];
			var unassignedCount = 0;
			var doneTaskCount = 0;
			
			if (req.params.type === 'reportOne') {
				team.forEach(function (user) {
					var taskCount = 0;
					tasks.forEach(function (task) {
						if (task.assignedTo && user._id.toString() === task.assignedTo._id.toString()) {
							taskCount++;
						}
					});
					
					labels.push(user.first_name + ' ' + user.last_name);
					percent = taskCount * 100 / tasks.length;
					data.push(percent.toFixed(2));
				});
				
				tasks.forEach(function (task) {
					if (!task.assignedTo) {
						unassignedCount++;
					}
				});
				
				data.push(unassignedCount * 100 / tasks.length);
				if (unassignedCount > 0 ) {
					labels.push('Ne dodeljeni zadaci');
				}
			} else if (req.params.type === 'reportTwo') {
				tasks.forEach(function (task) {
					if (task.task_status === 'Done') {
							doneTaskCount++;
						}
				});
				
				team.forEach(function (user) {					
					var taskCount = 0;
					tasks.forEach(function (task) {
						if (task.task_status === 'Done' && task.assignedTo && user._id.toString() === task.assignedTo._id.toString()) {
							taskCount++;
						}
					});
					
					labels.push(user.first_name + ' ' + user.last_name);
					percent = taskCount * 100 / doneTaskCount;
					data.push(percent.toFixed(2));
				});
			}
			
			
			report.labels = labels;
			report.data = data;
			if (req.params.type === 'reportOne') {
				report.tasksNum = tasks.length;
			} else if (req.params.type === 'reportTwo') {
				report.tasksNum = doneTaskCount;
			}
			
			
			res.json(report);
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