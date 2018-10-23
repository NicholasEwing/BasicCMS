const express = require("express");
const router = express.Router();
const ejs_helpers = require("../public/js/ejs_helpers.js");

let User = require("../models/user");
let Blog = require("../models/blog");

router.get("/", function(req, res){
	res.render("users/index");
})

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