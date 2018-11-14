const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");

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

		// rewrite this stuff below as a promise!

		Blog.create(req.body.blog)
			.then((newBlog) => {
				newBlog.author.id = req.user._id;
				newBlog.author.username = req.user.username;
				newBlog.save()
			})
			.then((createdBlog) => User.findOneAndUpdate(req.user._id, {$push: {blogs: createdBlog}}))
			.then(() => res.redirect("/blogs"))
			.catch((err) => {
				res.flash("Whoops! Couldn't create new blog");
				res.redirect("/blogs");
			});

	},
	getBlog : (req, res) => {
		Blog.findById(req.params.id).populate("comments").exec((err, foundBlog) => {
			if(err){
				req.flash("error toast", "That blog post does not exist.");
				res.redirect("/blogs");
			}
			res.render("blogs/show", {blog: foundBlog});
		});
	},
	updateBlogForm : (req, res) => {
		Blog.findById(req.params.id, (err, foundBlog) => {
		if(err){
			req.flash("error toast", "Couldn't open the edit view for this post. Please try again.");
			res.redirect("/blogs");
		}

		if(!foundBlog){
			req.flash("error toast", "That blog post does not exist.");
			res.redirect("/blogs");			
		}
		
		res.render("blogs/edit", {blog: foundBlog});
		});
	},
	updateBlog : (req, res) => {
		req.body.blog.body = req.sanitize(req.body.blog.body);
		Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
			if(err){
				req.flash("error toast", "Failed to update blog. Please try again.");
				res.redirect("/blogs");
			}

			if(!updatedBlog){
				req.flash("error toast", "That blog post does not exist.");
				res.redirect("/blogs");	
			}
		
			res.redirect("/blogs/" + req.params.id);
		});
	},
	deleteConfirm : (req, res) => {
		res.render("blogs/delete", {blog_id: req.params.id});
	},
	deleteBlog : (req, res) => {
		Blog.findById(req.params.id, (err, blog) => {
			if(err){
				req.flash("error toast", "Failed to delete blog.");
			}

			if(!blog){
				req.flash("error toast", "Blog no longer exists.");
			}

			Comment.find({_id: {$in: blog.comments}}, (err, comments) => {
				if(err) {
					req.flash("error toast", "Error pulling comments when deleting blog.");
					res.redirect("/");
				}

				User.updateMany({$pull: {comments: {$in: comments}}}, (err, users) => {
					if(err) {
						req.flash("error toast", "Error pulling comments from users.");
						res.redirect("/");
					}
				});
			});

			User.updateMany({$pull: {blogs: {$in: blog._id}}}, (err, user) => {
				if(err) {
					req.flash("error toast", "Error pulling blog from author.")
					res.redirect("/");
				}
			});

			blog.remove();
			req.flash("success toast", "Blog removed.");
			res.redirect("/");
		});
	}
}