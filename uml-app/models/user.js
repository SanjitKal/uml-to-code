var mongoose = require('mongoose')

var methodSchema = new mongoose.Schema({
	name: { type: String },
	arity: { type: String },
	return_type: { type: String }
});

var fieldSchema = new mongoose.Schema({
	name: { type: String },
	type: { type: String }
});

var classSchema = new mongoose.Schema({
	name: { type: String },
	fields: { type: [fieldSchema]},
	methods: { type: [methodSchema]},
	dependencies: {type: [String] }
});

var umlSchema = new mongoose.Schema({
	name: { type: String },
	classes: { type: [classSchema] },
});

var userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  curr_diagram: { type: String },
  umlCreations: { type: [umlSchema] },
});

module.exports = mongoose.model('User', userSchema)
