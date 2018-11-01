const flash						= require("flash");
const helmet					= require("helmet");
const express 					= require("express");
const mongoose 					= require("mongoose");
const passport 					= require("passport");
const bodyParser 				= require("body-parser");
const favicon					= require("serve-favicon");
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

// Models
let User = require("./models/user");

// Seed the database
seedDB = require("./seeds");
// seedDB();

const app = express();
let port = process.env.PORT || 8080;

// Header security
app.use(helmet());

// Session / cookie settings
let expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(expressSession({
	secret: process.env.SESSION_SECRET,
	name: "sessionId",
	resave: false,
	saveUninitialized: false
}));

// Set ejs as default view
app.set("view engine", "ejs");

// Allows for deleting via POST method
app.use(methodOverride("_method"));

let path = require("path");
app.use(express.static(path.join(__dirname, "/public")));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(bodyParser.urlencoded({extended: true}));

// Enables express-sanitizer, must come after app.use(bodyParser).
app.use(expressSanitizer());

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Initialize flash messgges
app.use(flash());

// Pass user data to all pages
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})

// Connect MongoDB
let url = process.env.DATABASEURL || "mongodb://localhost/blogcms";

mongoose.set("useCreateIndex", true);
mongoose.connect(url, {useNewUrlParser: true});

// Configure passport-local
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use(indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);
app.use("/users", userRoutes);

// Handle 404 for html, json, and plain txt
app.use(function(req, res, next){
	res.status(404);

	if(req.accepts("html")) {
		res.render("404", {url: req.originalUrl});
		return;
	}

	if(req.accepts("json")) {
		res.send({error: "Not found"});
	}

	res.type("txt").send("Not found")
});

app.listen(port, () => console.log("Server started on port " + port));