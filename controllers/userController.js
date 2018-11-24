const User = require("../models/user");
const Blog = require("../models/blog");
const Comments = require("../models/comment");
const ejs_helpers = require("../public/js/ejs_helpers.js");

module.exports = {
	getUsers : async (req, res) => {
		try {
			const users = await User.find({});
			return res.render("users/index", {users: users});
		} catch(err) {
			req.flash("error toast", "Unable to render users. Please try again later.");
			res.redirect("/");
		}
	},
	getUser : async (req, res) => {
		try {
			const results = await User.findById(req.params.id).populate("blogs");
			if(results) return res.render("user/show", {helpers: ejs_helpers, results: results});
			req.flash("error toast", "Unable to find this users. Please try again later.");
			res.redirect("/");
		} catch(err) {
			req.flash("error toast", "Unable to render users. Please try again later.");
			res.redirect("/");
		}
	}
}