const express 					= require("express");
const mongoose 					= require("mongoose");
const passport 					= require("passport");
const bodyParser 				= require("body-parser");
const LocalStrategy 			= require("passport-local");
const expressSession 			= require("express-session");
const methodOverride 			= require("method-override");
const expressSanitizer 			= require("express-sanitizer");
const passportLocalMongoose     = require("passport-local-mongoose");

// Routes
let blogRoutes = require("./routes/blogs");
let commentRoutes = require("./routes/comments");

// Not yet working!
// let authRoutes = require("./routes/auth");

// Models - this + authRoutes need to be moved into separate files when refactoring
let User = require("./models/user");

// SeedDB
seedDB = require("./seeds");
seedDB();

const app = express();

app.use(expressSession({
	secret: "this secret is totally going to appear on github",
	resave: false,
	saveUninitialized: false
}))

let path = require("path");

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

// Enables express-sanitizer, must come after app.use(bodyParser).
app.use(expressSanitizer());

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Pass user data to all pages
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})

// Connect MongoDB
mongoose.set("useCreateIndex", true);
mongoose.connect("mongodb://localhost/blogcms", {useNewUrlParser: true});

// Configure passport-local
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// RESTFUL ROUTES

app.get("/", function(req, res){
	res.redirect("/blogs");
});

app.get("/secret", isAdmin, function(req, res){
	res.render("secret");
})

// Referencing route files, need to refactor auth as well
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);

// AUTH ROUTES

// show register form
app.get("/register", function(req, res){
	res.render("register");
});

// handling user sign up
app.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		} else {
			passport.authenticate("local")(req, res, function(){
				res.redirect("/secret");
			});
		}
	});
});

// show login form
app.get("/login", function(req, res){
	res.render("login")
});

// login logic
app.post("/login", passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "/login"
}), function(req, res){

});

// logout logic
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

// these middleware functions repeat themselves, please refactor

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function isAdmin(req, res, next){
	if(req.isAuthenticated() && req.user.isAdmin) {
		return next();
	}
	res.send("YOU'RE NOT AN ADMIN!");
}

// TODO:
	// CLEAN UP:
		// make isLoggedIn / isAdmin DRY
		// refactor auth routes
		// refactor index routes
		// make logging in return user to previous page
		// put filler info in footer links
	// AUTH:
		// associate comments with users
		// have user page, shows all comments and blogs they made
		// add permissions, "admin" for posting and "user" for viewing (DONE)
		// give admin ability to grant admin permissions
	// ERRORS:
		// add actual error handling!
		// create 404 page
	// SECURITY:
		// add helmet and follow other best practices
		// try to post from POSTMAN
	// WISHLIST:
		// handle profanity, inappropriate images, inappropriate names, etc

app.listen(3000, () => console.log("Server started on port 3000"));