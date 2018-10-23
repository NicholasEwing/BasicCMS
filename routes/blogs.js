const express = require("express");
const router = express.Router();

let Blog = require("../models/blog");
let User = require("../models/user");
let middleware = require("../middleware");

// INDEX ROUTE
router.get("/", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err) {
			req.flash("error toast", "Unable to render blog posts. Please try again later.");
			res.redirect("/blogs")
		}

		res.render("blogs/index", {blogs: blogs});
	});
});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("blogs/new");
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			req.flash("error", "That blog title already exists. Please edit title and try again.");
			res.render("blogs/new");
		} else {
			// add username / id to blog, refactor using object
			newBlog.author.id = req.user._id;
			newBlog.author.username = req.user.username;
			newBlog.save();
			User.findById(req.user._id, function(err, user){
				req.flash("error toast", "Failed to lookup author name. Please try again.");
				user.blogs.push(newBlog);
				user.save();
			})
			res.redirect("/blogs");
		}

	});
});

// SHOW ROUTE
router.get("/:id", function(req, res){
	Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
		if(err){
			req.flash("error toast", "That blog post does not exist.");
			res.redirect("/blogs");
		}
		res.render("blogs/show", {blog: foundBlog});
	});
});

// EDIT ROUTE
router.get("/:id/edit", middleware.isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			req.flash("error toast", "Couldn't open the edit view for this post. Please try again.");
			res.redirect("/blogs");
		}

		// Handles trying to edit blog on another tab after it has been deleted
		if(!foundBlog){
			req.flash("error toast", "That blog post does not exist.");
			res.redirect("/blogs");			
		}
		
		res.render("blogs/edit", {blog: foundBlog});
	});
});

// UPDATE ROUTE
router.put("/:id", middleware.isLoggedIn, function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
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
});

// DELETE ROUTE
router.delete("/:id", middleware.isLoggedIn, function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("error toast", "Failed to delete blog. Please try again.");
		}

		res.redirect("/blogs");
	});
});

module.exports = router;
