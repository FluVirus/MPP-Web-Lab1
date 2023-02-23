const fs = require("fs-extra");
const dao = require("../model/db/dbdao");
const formatters = require('../model/formatters/formatters');

module.exports.about = function(request, response) {
	response.render("about.ejs");
}

module.exports.main = function(request, response) {
	dao.instance.getAllTasks(function(err, result, fields) {
		if (err) {
			response.render("error.ejs", {
				error: err
			});
		}
		response.render("main.ejs", {
			tasks: result,
			formateDate : formatters.formateDateMain
		});
	});
}

module.exports.new = function(request, response) {
	response.render("new.ejs", {formateDate:formatters.formateDateNew});
}

module.exports.notFound = function(request, response) {
	response.render("error.ejs", {
		error: new Error("Such page not found")
	})
}

module.exports.edit = function(request, response) {
	dao.instance.getTask(request.query.id, function(err, result, callback) {
		if (err) 
			return response.render("error.ejs", {error: err});
		response.render("edit.ejs", {
			task:result[0],
			formateDate: formatters.formateDateEdit
		});
	});
}

module.exports.updateContent =  function(request, response) {
	const id = request.query.id;
	const title = request.body.title ?? ' ';
	const description = request.body.description ?? ' ';
	const timeExpired = request.body.timeExpired ?? new Date().toISOString().slice(0, 19).replace('T',' ');
	const status = request.body.status ?? 'uncompleted';
	dao.instance.updateContent(id, title, description,  status, timeExpired, function(err, result, status) {
		if (err) {
			response.render("error.ejs", {
				error: err
			});
		} else {
			response.redirect("back");
		}
	});
}

module.exports.newTask = function(request, response) {
	const title = request.body.title ?? ' ';
	const description = request.body.description ?? ' ';
	const timeExpired = request.body.timeExpired ?? new Date().toISOString().slice(0, 19).replace('T',' ');
	const status = request.body.status ?? 'uncompleted';
	dao.instance.addTask(title, description, status, timeExpired, function(err, result, status) {
		if (err) {
			response.render("error.ejs", {
				error: err
			});
		} else {
			response.redirect("back");
		}
	});	
}

module.exports.deleteTask = function(request, response) {
	const id = request.query.id;
	dao.instance.deleteTask(id, function(err, result, callback) {
		if (err) {
			response.render("error.ejs", {
				error: err
			});
		} else {
			response.redirect("back");
		}	
	});
}
