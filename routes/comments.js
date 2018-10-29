const express = require("express");
// Look up what mergeParams does and study it!
const router = express.Router({mergeParams: true});

let Blog = require("../models/blog");
let User = require("../models/user");
let Comment = require("../models/comment");
let middleware = require("../middleware");


// NEW ROUTE
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

// CREATE ROUTE
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
					// add comment to user document
					User.findById(req.user._id, function(err, user){
						if(err || !comment){
							req.flash("error toast", "Failed to post comment. Please try again.");
						}
						user.comments.push(comment);
						user.save();
					})
					// add comment to blog
					blog.comments.push(comment);
					blog.save();
					// res.redirect("/blogs/" + blog._id);
					res.redirect("/blogs/" + blog._id);					
				}
			});
		}
	});
});

// EDIT ROUTE
router.get("/:comment_id/edit", middleware.isLoggedIn, function(req, res){
	console.log("Blog id: " + req.params.id);
	console.log("Comment id: " + req.params.comment_id);

	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err) {
			req.flash("error toast", "Could not open edit view for this comment.");
			res.redirect("/blogs/:id");
		}

		if(!foundComment) {
			req.flash("error toast", "Comment no longer exists.");
			res.redirect("/blogs/:id");
		}

		res.render("comments/edit", {blog_id: req.params.id, comment: foundComment});
	});
});

// UPDATE ROUTE
router.put("/:comment_id", middleware.isLoggedIn, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
		if(err) {
			req.flash("error", "Could not update comment.");
		}

		if(!foundComment) {
			req.flash("error", "Comment does not exist.");
		}

		res.redirect("/blogs/" + req.params.id);
	});
});

// CONFIRM DELETE ROUTE
router.get("/:comment_id/delete", middleware.isLoggedIn, function(req, res){
	res.render("comments/delete", {blog_id: req.params.id, comment_id: req.params.comment_id});
})

// DELETE ROUTE
router.delete("/:comment_id", middleware.isLoggedIn, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
		if(err){
			req.flash("error", "Could not delete comment.");
		}

		if(!comment){
			req.flash("error", "Comment does not exist.");
		}

		res.redirect("/blogs/" + req.params.id);
	});
})

module.exports = router;