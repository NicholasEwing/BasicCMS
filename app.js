const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

mongoose.connect("mongodb://localhost/blogcms", {useNewUrlParser: true});
mongoose.set("useCreateIndex", true);
app.set("view engine", "ejs");


app.get("/", function(req, res){
	res.redirect("blogs");
})

app.get("/blogs", function(req, res){
	res.render("blog");
});

app.get("/blogs/new", function(req, res){
	res.render("new");
});

app.post("/blogs", function(req, res){
	// some magic that adds the post to db
});

// blog schema
let Blog = mongoose.model("Blog", {
	title: { type: String, unique: true },
	body: String,
});

// let firstPost = new Blog({
// 	title: "This is the title",
// 	body: "This is some body text."
// });

// firstPost.save();

app.listen(3000, () => console.log("Server started on port 3000"));