const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");
const mongoose = require("mongoose");

module.exports = {
	getBlogs : async (req, res) => {
		try {
			const blogs = await Blog.find({});	
			return res.render("blogs/index", {blogs: blogs});
		} catch(err) {
			req.flash("error toast", "Error retrieving blogs.");
		}
	},
	newBlogForm : (req, res) => {
		res.render("blogs/new");
	},
	createBlog : async (req, res) => {
		req.body.blog.body = req.sanitize(req.body.blog.body);
		
		try {
			const newBlog = await Blog.create(req.body.blog);
			newBlog.author.id = req.user.id;
			newBlog.author.username = req.user.username;
			await newBlog.save();
			await User.findByIdAndUpdate(req.user.id, {$push: {blogs: newBlog._id}});
			res.redirect("/");
		} catch(err) {
			req.flash("error toast", "Whoops! Couldn't create new blog.");
		}
	},
	getBlog : async (req, res) => {
		try {
			let foundBlog = await Blog.findById(req.params.id).populate("comments");
			if(foundBlog) return res.render("blogs/show", {blog: foundBlog});
			res.redirect("/");
		} catch(err) {
			req.flash("error toast", "Couldn't find this blog post.");
			res.redirect("/");
		}
	},
	updateBlogForm : async (req, res) => {
		try {
			const foundBlog = await Blog.findById(req.params.id);
			if(foundBlog) return res.render("blogs/edit", {blog: foundBlog});
			req.flash("error toast", "Blog no longer exists.");
			res.redirect("/blogs");
		} catch(err) {
			req.flash("error toast", "An error occurred. Please try again.");
			res.redirect("/blogs"); 
		}
	},
	updateBlog : async (req, res) => { 
		req.body.blog.body = req.sanitize(req.body.blog.body);

		try {
			const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body.blog);
			if(updatedBlog) return res.redirect(`/blogs/${req.params.id}`);
			req.flash("error toast", "Blog no longer exists.");
			res.redirect("/blogs");
		} catch(err) {
			req.flash("error toast", "Failed to update blog. Please try again.");
			res.redirect("/blogs");
		}
	},
	deleteConfirm : (req, res) => {
		res.render("blogs/delete", {blog_id: req.params.id});
	},
	deleteBlog : async (req, res) => {
		try {
			// Find and remove blog
			const blog = await Blog.findById(req.params.id);
			blog.remove();
			// Remove blog reference from author
			await User.findByIdAndUpdate(blog.author.id, {$pull: {blogs: blog._id}});
			// Find comments in blog
			const comments = await Comment.find({_id: {$in: blog.comments}});
			// Remove comment references from all authors
			await User.updateMany({$pull: {comments: {$in: comments}}});
			// Remove comments in blog
			await Comment.deleteMany({blog: {id: mongoose.Types.ObjectId(req.params.id)}});
			req.flash("success toast", "Blog removed.");
			res.redirect("/");
		} catch(err) {
			req.flash("error toast", "Something went wrong! Please try again.");
			res.redirect("/");
		}
	}
};