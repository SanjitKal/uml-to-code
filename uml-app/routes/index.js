var express = require('express');
var router = express.Router();
var User = require('../models/user.js')

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.session.user == '') {
		res.redirect('/account/login')
	} else {
		var username = req.session.user
		User.findOne({ username: username }, function(
    	err,
    	result
  	) {
    	if (!err && result != null) {
    		var creation_names = result.umlCreations.map(result => result.name)
      	res.render('index.html', {username: username, creation_names: creation_names})
    	} else {
      	next(new Error('invalid credentials'))
    	}
  	})
	}
});

router.post('/', function(req, res, next) {
	if (req.session.user == '') {
		res.redirect('/account/login')
	} else {
		var diagram_name = req.body.diagram_name
		var username = req.session.user
		User.findOne({ username: username }, function(err, result) {
    	if (!err && result != null) {
    		var umlCreation = {name: diagram_name}
    		result.umlCreations.push(umlCreation)
    		result.save(function(err) {
    			if (err) {
      			next(err)
    			}
    			if (!err) {
      			res.redirect('/')
    			}
    		})
    	}
  	})
	}
});

router.post('/delete', function(req, res, next) {
	if (req.session.user == '') {
		res.redirect('/account/login')
	} else {
		var diagram_name = req.body.name
		var username = req.session.user
		User.findOne({ username: username }, function(err, result) {
    	if (!err && result != null) {
    		var newUmlCreations = result.umlCreations.filter(function(value, index, arr){
    			return value.name != diagram_name;
				});
    		result.umlCreations = newUmlCreations
    		result.save(function(err) {
    			if (err) {
      			next(err)
    			}
    			if (!err) {
      			res.redirect('/')
    			}
    		})
    	}
  	})
	}
});

/* GET home page. */
router.post('/edit', function(req, res, next) {
	if (req.session.user == '') {
		res.redirect('/account/login')
	} else {
		var username = req.session.user
		var diagram_name = req.body.name
		User.findOne({ username: username }, function(
    	err,
    	result
  	) {
    	if (!err && result != null) {
    		result.curr_diagram = diagram_name
    		result.save(function(err) {
    		if (err) {
      		next(err)
    		}
    		if (!err) {
      		res.render('edit.html', {name: diagram_name})
    		}
    	})
    	} else {
      	next(new Error('invalid credentials'))
    	}
  	})
	}
});

router.post('/add_class', function(req, res, next) {
	if (req.session.user == '') {
		res.redirect('/account/login')
	} else {
		var username = req.session.user
		var class_name = req.body.class_name
		User.findOne({ username: username }, function(
    	err,
    	result
  	) {
    	if (!err && result != null) {
    		var diagram = result.umlCreations.filter(function(value, index, arr){
    			return value.name = result.curr_diagram;
				});

				var rest = result.umlCreations.filter(function(value, index, arr){
    			return value.name != result.curr_diagram;
				});
    		var diagram = diagram[0]
    		var new_class = {name: class_name, fields: [], methods: [], dependencies: []}
    		diagram.classes.push(new_class)
    		rest.push(diagram)
    		result.umlCreations = rest

    		result.save(function(err) {
    		if (err) {
      		next(err)
    		}
    		if (!err) {
      		res.render('edit.html', {name: result.curr_diagram})
    		}
    	})
    	} else {
      	next(new Error('invalid credentials'))
    	}
  	})
	}
});

router.post('/add_edge', function(req, res, next) {
	if (req.session.user == '') {
		res.redirect('/account/login')
	} else {
		var username = req.session.user
		var from = req.body.from
		var to = req.body.to
		User.findOne({ username: username }, function(
    	err,
    	result
  	) {
    	if (!err && result != null) {
    		var diagram = result.umlCreations.filter(function(value, index, arr){
    			return value.name = result.curr_diagram;
				});

				var rest_diagrams = result.umlCreations.filter(function(value, index, arr){
    			return value.name != result.curr_diagram;
				});
    		var diagram = diagram[0]

    		var from_class = diagram.classes.filter(function(value, index, arr){
    			return value.name == from
				});

				var rest_classes = diagram.classes.filter(function(value, index, arr){
    			return value.name != from
				});

				from_class = from_class[0]
				from_class.dependencies.push(to)
				rest_classes.push(from_class)
				diagram.classes = (rest_classes)
    		rest_diagrams.push(diagram)
    		result.umlCreations = rest_diagrams

    		result.save(function(err) {
    		if (err) {
      		next(err)
    		}
    		if (!err) {
      		res.render('edit.html', {name: result.curr_diagram})
    		}
    	})
    	} else {
      	next(new Error('invalid credentials'))
    	}
  	})
	}
});

router.post('/add_method', function(req, res, next) {
	if (req.session.user == '') {
		res.redirect('/account/login')
	} else {
		var username = req.session.user
		var class_name = req.body.class_name
		var method_name = req.body.method_name
		var return_type = req.body.return_type
		var arity = req.body.arity
		User.findOne({ username: username }, function(
    	err,
    	result
  	) {
    	if (!err && result != null) {
    		var diagram = result.umlCreations.filter(function(value, index, arr){
    			return value.name = result.curr_diagram;
				});

				var rest_diagrams = result.umlCreations.filter(function(value, index, arr){
    			return value.name != result.curr_diagram;
				});
    		var diagram = diagram[0]

    		var class_obj = diagram.classes.filter(function(value, index, arr){
    			return value.name == class_name
				});

				var rest_classes = diagram.classes.filter(function(value, index, arr){
    			return value.name != class_name
				});

				class_obj = class_obj[0]
				var method_obj = {name: method_name, arity: arity, return_type: return_type}
				class_obj.methods.push(method_obj)
				rest_classes.push(class_obj)
				diagram.classes = (rest_classes)
    		rest_diagrams.push(diagram)
    		result.umlCreations = rest_diagrams

    		result.save(function(err) {
    		if (err) {
      		next(err)
    		}
    		if (!err) {
      		res.render('edit.html', {name: result.curr_diagram})
    		}
    	})
    	} else {
      	next(new Error('invalid credentials'))
    	}
  	})
	}
});

router.post('/add_field', function(req, res, next) {
	if (req.session.user == '') {
		res.redirect('/account/login')
	} else {
		var username = req.session.user
		var class_name = req.body.class_name
		var field_name = req.body.field_name
		var field_type = req.body.field_type
		User.findOne({ username: username }, function(
    	err,
    	result
  	) {
    	if (!err && result != null) {
    		var diagram = result.umlCreations.filter(function(value, index, arr){
    			return value.name = result.curr_diagram;
				});

				var rest_diagrams = result.umlCreations.filter(function(value, index, arr){
    			return value.name != result.curr_diagram;
				});
    		var diagram = diagram[0]

    		var class_obj = diagram.classes.filter(function(value, index, arr){
    			return value.name == class_name
				});

				var rest_classes = diagram.classes.filter(function(value, index, arr){
    			return value.name != class_name
				});

				class_obj = class_obj[0]
				var field_obj = {name: field_name, type: field_type}
				class_obj.fields.push(field_obj)
				rest_classes.push(class_obj)
				diagram.classes = (rest_classes)
    		rest_diagrams.push(diagram)
    		result.umlCreations = rest_diagrams

    		result.save(function(err) {
    		if (err) {
      		next(err)
    		}
    		if (!err) {
      		res.render('edit.html', {name: result.curr_diagram})
    		}
    	})
    	} else {
      	next(new Error('invalid credentials'))
    	}
  	})
	}
});

/* GET home page. */
router.get('/get_diagrams', function(req, res, next) {
if (req.session.user == '') {
		res.redirect('/account/login')
	} else {
		var username = req.session.user
		User.findOne({ username: username }, function(
    	err,
    	result
  	) {
    	if (!err && result != null) {
    		var diagram = result.umlCreations.filter(function(value, index, arr){
    			return value.name = result.curr_diagram;
				});
    		var diagram = diagram[0]
    		var diagram = JSON.stringify(diagram)
      	res.send(diagram)
    	} else {
      	next(new Error('invalid credentials'))
    	}
  	})
	}
});


module.exports = router;
