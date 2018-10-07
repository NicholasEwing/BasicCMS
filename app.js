const express 					= require("express");
const mongoose 					= require("mongoose");
const passport 					= require("passport");
const bodyParser 				= require("body-parser");
const LocalStrategy 			= require("passport-local");
const expressSession 			= require("express-session");
const methodOverride 			= require("method-override");
const expressSanitizer 			= require("express-sanitizer");
const passportLocalMongoose     = require("passport-local-mongoose");

const app = express();

app.use(expressSession({
	secret: "this secret is totally going to appear on github",
	resave: false,
	saveUninitialized: false
}))

let blogRoutes = require("./routes/blogs");

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

// Enables express-sanitizer, must come after app.use(bodyParser).
app.use(expressSanitizer());

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

mongoose.set("useCreateIndex", true);
mongoose.connect("mongodb://localhost/blogcms", {useNewUrlParser: true});

let Blog = require("./models/blog");
let User = require("./models/user");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// RESTFUL ROUTES

app.get("/", function(req, res){
	res.redirect("/blogs");
});

app.get("/secret", function(req, res){
	res.render("secret")
})

app.use("/blogs", blogRoutes);

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