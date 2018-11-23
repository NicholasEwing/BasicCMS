const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");
const mongoose = require("mongoose");

module.exports = {
	getBlogs : (req, res) => {
		Blog.find({})
			.exec()
			.then((blogs) => {
				res.render("blogs/index", {blogs: blogs});
			})
			.catch((err) => {
				req.flash("error toast", "Error retrieving blogs.");
				res.redirect("/");
			});
	},
	newBlogForm : (req, res) => {
		res.render("blogs/new");
	},
	createBlog : (req, res) => {
		req.body.blog.body = req.sanitize(req.body.blog.body);

		Blog.create(req.body.blog)
			.then((newBlog) => {
				newBlog.author.id = req.user._id;
				newBlog.author.username = req.user.username;
				return newBlog.save();
			})
			.then((createdBlog) => {
				User.findByIdAndUpdate(req.user._id, {$push: {blogs: createdBlog._id}})
					.exec();
			})
			.then(() => res.redirect("/blogs"))
			.catch((err) => {
				req.flash("error toast", "Whoops! Couldn't create new blog");
				res.redirect("/blogs");
			});
	},
	getBlog : (req, res) => {
		Blog.findById(req.params.id)
			.populate("comments")
			.exec()
			.then((foundBlog) => {
				if(foundBlog) {
					return res.render("blogs/show", {blog: foundBlog});
				}

				req.flash("error toast", "Couldn't find this blog post.");
				return res.redirect("/");
			});
	},
	updateBlogForm : (req, res) => {
		Blog.findById(req.params.id)
			.then(foundBlog => res.render("blogs/edit", {blog: foundBlog}))
			.catch((err) => {
				req.flash("error toast", "An error occurred. Please try again.")
				res.redirect("/blogs");
			});
	},
	updateBlog : (req, res) => {
		req.body.blog.body = req.sanitize(req.body.blog.body);

		Blog.findOneAndUpdate(req.params.id, req.body.blog)
			.then((updatedBlog) => {
				res.redirect("/blogs/" + req.params.id);
			})
			.catch((err) => {
				req.flash("error toast", "Failed to update blog. Please try again.");
				res.redirect("/blogs");
			});
	},
	deleteConfirm : (req, res) => {
		res.render("blogs/delete", {blog_id: req.params.id});
	},
	deleteBlog : (req, res) => {
		Blog.findById(req.params.id)
			.then((blog) => {
				blog.remove();
				User.findOneAndUpdate(blog.author.id, {$pull: {blogs: blog._id}}).exec();
				return Comment.find({_id: {$in: blog.comments}});
			})
			.then(comments => User.updateMany({$pull: {comments: {$in: comments}}}).exec())
			.then(() => Comment.deleteMany({blog: {id: mongoose.Types.ObjectId(req.params.id)}}).exec())
			.then(() => {
				req.flash("success toast", "Blog removed.");
				res.redirect("/");
			})
			.catch((err) => {
				console.log(err);
				req.flash("error toast", "Something went wrong!");
				res.redirect("/");
			});
	}
}