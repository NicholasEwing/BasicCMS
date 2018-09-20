const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

const app = express();

let blogRoutes = require("./routes/blogs");

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

// Enables express-sanitizer, must come after app.use(bodyParser).
app.use(expressSanitizer());

mongoose.set("useCreateIndex", true);
mongoose.connect("mongodb://localhost/blogcms", {useNewUrlParser: true});

let Blog = require("./models/blog");

// RESTFUL ROUTES

app.get("/", function(req, res){
	res.redirect("/blogs");
});

app.use("/blogs", blogRoutes);

// create user schema

// add ability to comment, requires db associations
 // - add oauth
 // - add permissions, "admin" for posting, "user" for viewing/commenting etc.
 // - give admin ability to grant other users admin privleges

// add login system
 // - need passport local

// polish log-in system
 // - add oauth
 // - add permissions, 

// add proper error handling

// add security with helmet and other best practices

// style with VANILLA css

// organize project structure, refactor, apply other best practices

app.listen(3000, () => console.log("Server started on port 3000"));