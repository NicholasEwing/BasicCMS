const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");

module.exports = {
	newCommentForm : (req, res) => {
		Blog.findById(req.params.id)
			.then((blog) => res.render("comments/new", {blog: blog}))
			.catch((err) => {
				console.log(err);
				req.flash("error toast", "Error occurred. Please try again!");
				res.redirect("/blogs");
			});
	},
	createComment : (req, res) => {
		Blog.findById(req.params.id)
			.then((blog) => {
				return Comment.create(req.body.comment);
			})
			.then((comment) => {
				Blog.findByIdAndUpdate(req.params.id, {$push : {comments: comment }}).exec();
				User.findByIdAndUpdate(req.user._id, {$push : {comments: comment }}).exec();
				comment.author.username = req.user.username;
				comment.author.id = req.user._id;
				comment.blog.id = req.params.id;
				comment.save();
				res.redirect("/blogs/" + req.params.id);
			})
			.catch((err) => {
				console.log(err);
				req.flash("error toast", "An error occurred. Please try again.");
				res.redirect("/blogs/" + req.params.id);
			});
	},
	updateCommentForm : (req, res) => {
		Comment.findById(req.params.comment_id)
			.then((foundComment) => {
				if(foundComment) {
					return res.render("comments/edit", {blog_id: req.params.id, comment: foundComment});					
				}

				req.flash("error toast", "Comment no longer exists."); 
				return res.redirect("/blogs/" + req.params.id);
			})
			.catch((err) => {
				console.log(err);
				req.flash("error toast", "Couldn't open edit view for this comment. Please try again.");
			});
	},
	updateComment : (req, res) => {
		Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
			.then((foundComment) => {
				if(foundComment) {
					return res.redirect("/blogs/" + req.params.id);
				}

				req.flash("error toast", "Comment no longer exists."); 
				return res.redirect("/blogs/" + req.params.id);
			});
	},
	deleteConfirm : (req, res) => {
		res.render("comments/delete", {blog_id: req.params.id, comment_id: req.params.comment_id});
	},
	deleteComment : (req, res) => {
		Comment.findByIdAndRemove(req.params.comment_id)
			.then((comment) => {
				User.findByIdAndUpdate(comment.author.id, {$pull: {comments: {$in: req.params.comment_id}}}).exec();
				Blog.findByIdAndUpdate(req.params.id, {$pull: {comments: {$in: comment._id}}}).exec();
				req.flash("success toast", "Comment deleted.");
				return res.redirect("/blogs/" + req.params.id);
			});
	}
}