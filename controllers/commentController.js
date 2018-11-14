const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");

module.exports = {
	newCommentForm : (req, res) => {
		Blog.findById(req.params.id, (err, blog) => {
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
	},
	createComment : (req, res) => {
		Blog.findById(req.params.id, (err, blog) => {
			if(err){
				req.flash("error toast", err.message);
				res.redirect("/blogs");
			} else {
				Comment.create(req.body.comment, (err, comment) => {
					if(err || !blog){
						req.flash("error toast", "That blog post does not exist.");
						res.redirect("/blogs");
					} else {
						// add username/id to comment
						comment.author.id = req.user._id;
						comment.author.username = req.user.username;
						comment.blog.id = req.params.id;
						comment.save();

						// add comment to user document
						User.findById(req.user._id, (err, user) => {
							if(err || !comment){
								req.flash("error toast", "Failed to post comment. Please try again.");
							}
							user.comments.push(comment);
							user.save();
						})
						// add comment to blog
						blog.comments.push(comment);
						blog.save();

						res.redirect("/blogs/" + blog._id);					
					}
				});
			}
		});
	},
	updateCommentForm : (req, res) => {
		console.log("Blog id: " + req.params.id);
		console.log("Comment id: " + req.params.comment_id);

		Comment.findById(req.params.comment_id, (err, foundComment) => {
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
	},
	updateComment : (req, res) => {
		Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment) => {
			if(err) {
				req.flash("error", "Could not update comment.");
			}

			if(!foundComment) {
				req.flash("error", "Comment does not exist.");
			}

			res.redirect("/blogs/" + req.params.id);
		});
	},
	deleteConfirm : (req, res) => {
		res.render("comments/delete", {blog_id: req.params.id, comment_id: req.params.comment_id});
	},
	deleteComment : (req, res) => {
			// Delete comment
		Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
			if(err){
				req.flash("error toast", "Could not delete comment.");
			}

			if(!comment){
				req.flash("error toast", "Comment does not exist.");
			}

			// Delete comment reference from author
			User.findByIdAndUpdate(comment.author.id, { $pull: {comments: {$in: req.params.comment_id}}}, (err, user) => {
				if(err){
					req.flash("error toast", "Comment could not be removed from user.");
				}

				if(!user){
					req.flash("error toast", "User does not exist, could not delete comment from profile.");
				}

				req.flash("success toast", "Comment deleted.");
			});

			Blog.update({$pull: {comments: {$in: comment._id}}}, (err) => {
				console.log(err);
			});

			res.redirect("/blogs/" + req.params.id);
		});
	}
}