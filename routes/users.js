const express = require("express");
const router = express.Router();
const ejs_helpers = require("../public/js/ejs_helpers.js");

let User = require("../models/user");
let Blog = require("../models/blog");
let Comments = require("../models/comment");

router.get("/", function(req, res){
	User.find({}, function(err, users){
		if(err){
			req.flash("error toast", "Unable to render blog posts. Please try again later.");
			res.redirect("/blogs");
		}

		res.render("users/index", {users: users});
	});
});

router.get("/:id", function(req, res){
	// Find blogs where username == blog.author.username
	User.findOne({username: req.params.id})
	.populate("blogs")
	.exec(function(err, results){
		if(err || !results){
			req.flash("error toast", "That user does not exist.");
			res.redirect("/blogs");
		}
		
		res.render("users/show", {helpers: ejs_helpers, results: results});
	});


});

module.exports = router;