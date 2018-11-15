const User = require("../models/user");
const Blog = require("../models/blog");
const Comments = require("../models/comment");
const ejs_helpers = require("../public/js/ejs_helpers.js");

module.exports = {
	getUsers : (req, res) => {
		User.find({})
			.then((users) => res.render("users/index", {users: users}))
			.catch((err) => {
				console.log(err);
				req.flash("error toast", "Unable to render users. Please try again later.");
				res.render("users/index", {users: users});
			});
	},
	getUser : (req, res) => {
		User.findOne({username: req.params.id})
			.populate("blogs")
			.exec()
			.then((results) => {res.render("users/show", {helpers: ejs_helpers, results: results})})
			.catch((err) => {
				console.log(err);
				req.flash("error toast", "Unable to render user info. Please try again later.");
				res.render("users/show", {helpers: ejs_helpers, results: results});
			});
	}
}