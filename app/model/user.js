var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	first_name : {
		type: String,
    required: true
	},
	last_name : {
		type: String,
    required: true
	},
	email : {
		type: String,
		required: true,
		unique: true
	},
	pass : {
		type: String,
		required: true
	},
	admin : {
		type: Boolean,
		required: true
	},
	projects : [{ type: Schema.Types.ObjectId, ref: 'Project' }]
});

var User = mongoose.model('User', userSchema);

module.exports = User;