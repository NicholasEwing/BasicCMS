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
let indexRoutes = require("./routes/index");
let blogRoutes = require("./routes/blogs");
let commentRoutes = require("./routes/comments");
let userRoutes = require("./routes/users");

let User = require("./models/user");

// Seed the database
seedDB = require("./seeds");
// seedDB();

const app = express();

app.use(expressSession({
	secret: "this secret is totally going to appear on github",
	resave: false,
	saveUninitialized: false
}))

let path = require("path");

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
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

// Routes
app.use(indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);
app.use("/users", userRoutes);

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

app.listen(3000, () => console.log("Server started on port 3000"));