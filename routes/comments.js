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
			req.flash("error toast", "Failed to lookup blog. Please try again.");
			res.redirect("/blogs");
		}

		if(!blog){
			req.flash("error toast", "That blog post no longer exists.");
			res.redirect("/blogs");
		}

		res.render("comments/new", {blog: blog});
	});
});

router.post("/", middleware.isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			req.flash("error toast", err.message);
			res.redirect("/blogs");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err || !blog){
					req.flash("error toast", "That blog post does not exist.");
					res.redirect("/blogs");
				} else {
					// add username/id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					// add comment to blog
					blog.comments.push(comment);
					blog.save();
					// res.redirect("/blogs/" + blog._id);
					res.redirect("/blogs/")					
				}
			});
		}
	});
});

module.exports = router;