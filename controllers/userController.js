const User = require("../models/user");
const Blog = require("../models/blog");
const Comments = require("../models/comment");
const ejs_helpers = require("../public/js/ejs_helpers.js");

module.exports = {
	getUsers : (req, res) => {
		User.find({}, (err, users) => {
		if(err){
			req.flash("error toast", "Unable to render blog posts. Please try again later.");
			res.redirect("/blogs");
		}

		res.render("users/index", {users: users});
		});
	},
	getUser : (req, res) => {
		User.findOne({username: req.params.id})
		.populate("blogs")
		.exec((err, results) => {
			if(err || !results){
				req.flash("error toast", "That user does not exist.");
				res.redirect("/blogs");
			}
			
			res.render("users/show", {helpers: ejs_helpers, results: results});
		});
	}
}