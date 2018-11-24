const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");

module.exports = {
	newCommentForm : async (req, res) => {
		try {
			const blog = await Blog.findById(req.params.id);
			if(blog) return res.render("comments/new", {blog: blog});
			res.redirect(`/blogs/${req.params.id}`);
		} catch(err) {
			req.flash("error toast", "Something went wrong! Please try again.");
			res.redirect("/blogs");
		}
	},
	createComment : async (req, res) => {
		try {
			const blog = await Blog.findById(req.params.id);
			const comment = await Comment.create(req.body.comment);
			await Blog.findByIdAndUpdate(req.params.id, {$push : {comments: comment}});
			await User.findByIdAndUpdate(req.user._id, {$push : {comments: comment}});
			comment.author.username = req.user.username;
			comment.author.id = req.user._id;
			comment.blog.id = req.params.id;
			comment.save();
			res.redirect(`/blogs/${req.params.id}`);
		} catch(err) {
			req.flash("error toast", "An error occurred. Please try again.");
			res.redirect(`/blogs/${req.params.id}`);
		}
	},
	updateCommentForm : async (req, res) => {
		try {
			const foundComment = await Comment.findById(req.params.comment_id);
			if(foundComment) return res.render("comments/edit", {blog_id: req.params.id, comment: foundComment});
			req.flash("error toast", "Comment no longer exists.");
			res.redirect(`/blogs/${req.params.id}`);
		} catch(err) {
			req.flash("error toast", "Couldn't open edit view for this comment. Please try again.");
			res.redirect(`/blogs/${req.params.id}`);
		}
	},
	updateComment : async (req, res) => {
		try {
			const foundComment = await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
			if(foundComment) return res.redirect(`/blogs/${req.params.id}`);
			req.flash("error toast", "Comment no longer exists.");
			res.redirect(`/blogs/${req.params.id}`); 
		} catch(err) {
			res.redirect(`/blogs/${req.params.id}`);
		}
	},
	deleteConfirm : (req, res) => {
		res.render("comments/delete", {blog_id: req.params.id, comment_id: req.params.comment_id});
	},
	deleteComment : async (req, res) => {
		try {
			const comment = await Comment.findByIdAndRemove(req.params.comment_id);
			await User.findByIdAndUpdate(comment.author.id, {$pull: {comments: {$in: comment._id}}});
			await Blog.findByIdAndUpdate(req.params.id, {$pull: {comments: {$in: comment._id}}});
			req.flash("success toast", "Comment deleted.");
			res.redirect(`/blogs/${req.params.id}`);
		} catch(err) {
			req.flash("error toast", "Couldn't delete comment. Please try again.");
			res.redirect(`/blogs/${req.params.id}`);
		}
	}
}