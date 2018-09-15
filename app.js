const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

mongoose.connect("mongodb://localhost/blogcms", {useNewUrlParser: true});
mongoose.set("useCreateIndex", true);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// blog schema
let blogSchema = new mongoose.Schema({
	title: {type: String, unique: true},
	body: String,
});

let Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
	res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err) {
			console.log(err);
		}

		res.render("index", {blogs: blogs})
	});
});

app.get("/blogs/new", function(req, res){
	res.render("new");
});

app.post("/blogs", function(req, res){
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}

		res.redirect("blogs");
	});
});

// add show route

app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs")
		}

		res.render("show", {blog: foundBlog});
	})
});

app.listen(3000, () => console.log("Server started on port 3000"));