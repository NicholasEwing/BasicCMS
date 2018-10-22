const express = require("express");
// Look up what mergeParams does and study it!
const router = express.Router({mergeParams: true});

let Blog = require("../models/blog");
let Comment = require("../models/comment");
let middleware = require("../middleware");


// require login middleware for all routes
router.get("/new", middleware.isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {blog: blog});
		}
	});
});

router.post("/", middleware.isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
					res.redirect("/blogs");
				} else {
					// add username/id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					// add comment to blog
					blog.comments.push(comment);
					blog.save();
					res.redirect("/blogs/" + blog._id);					
				}
			});
		}
	});
});

module.exports = router;