const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const router = express.Router();

let Blog = require("../models/blog");

// INDEX ROUTE
router.get("/", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err) {
			console.log(err);
		}

		res.render("index", {blogs: blogs})
	});
});

// NEW ROUTE
router.get("/new", function(req, res){
	res.render("new");
});

// CREATE ROUTE
router.post("/", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}

		res.redirect("blogs");
	});
});

// SHOW ROUTE
router.get("/:id", function(req, res){
	Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
		if(err){
			res.redirect("/blogs")
		}
		res.render("show", {blog: foundBlog});
	});
});

// EDIT ROUTE
router.get("/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}

		res.render("edit", {blog: foundBlog});

	});
});

// UPDATE ROUTE
router.put("/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}

		res.redirect("/blogs/" + req.params.id);
	});
});

// DELETE ROUTE
router.delete("/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.send("Could not delete blog. Sorry.");
		}

		res.redirect("/blogs");
	});
});

module.exports = router;
