const express = require("express");
const router = express.Router({mergeParams: true});
const Blog = require("../models/blog");
const Comment = require("../models/comment");

router.get("/new", function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {blog: blog});
		}
	});
});

router.post("/", function(req, res){
	// blog findbyid
	// create comment
		// push comments
		// save blog
		// redirect
});



module.exports = router;