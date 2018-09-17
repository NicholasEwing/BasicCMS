const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

const app = express();

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));

// Enables express-sanitizer, must come after app.use(bodyParser).
app.use(expressSanitizer());

mongoose.set("useCreateIndex", true);
mongoose.connect("mongodb://localhost/blogcms", {useNewUrlParser: true});

// blog schema
let blogSchema = new mongoose.Schema({
	title: {type: String, unique: true},
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

let Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES

app.get("/", function(req, res){
	res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err) {
			console.log(err);
		}

		res.render("index", {blogs: blogs})
	});
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}

		res.redirect("blogs");
	});
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs")
		}
		res.render("show", {blog: foundBlog});
	})
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}

		res.render("edit", {blog: foundBlog});

	});
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}

		res.redirect("/blogs/" + req.params.id);
	});
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.send("Could not delete blog. Sorry.");
		}

		res.redirect("/blogs");
	});
});

// add login system
 // - need passport local
 // - add oauth
 // - add permissions, "admin" for posting, "user" for viewing/commenting etc.
 // - give admin ability to grant other users admin privleges

// add ability to comment, require associations

// add proper error handling

// add security with helmet and other best practices

// style with VANILLA css

// organize project structure, refactor, apply other best practices

app.listen(3000, () => console.log("Server started on port 3000"));