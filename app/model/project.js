var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	
});

var taskSchema = new Schema({
	task_label : {
		type: String,
		required: true
	},
	task_name : {
		type: String,
    required: true
	},
	task_description: String,
	author: { 
		type: Schema.Types.ObjectId, 
		ref: 'User',
		required: true
	},
	assignedTo: { 
		type: Schema.Types.ObjectId, 
		ref: 'User' 
	},
	task_status: {
		type: String,
		required: true
	},
	task_priority: {
		type: String,
		required: true
	},
	comments: [commentSchema]
});

var projectSchema = new Schema({
	label : {
		type: String,
		required: true,
		unique: true
	},
	name : {
		type: String,
    required: true
	},
	description: String,
	team : [{ type: Schema.Types.ObjectId, ref: 'User'}],
	tasks : [taskSchema]
});

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;