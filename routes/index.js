const express = require("express");
const passport = require("passport");
const router = express.Router();

let User = require("../models/user");

// RESTFUL ROUTES

router.get("/", function(req, res){
	res.redirect("/blogs");
});

// AUTH ROUTES

// show register form
router.get("/register", function(req, res){
	res.render("register");
});

// handling user sign up
router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		} else {
			passport.authenticate("local")(req, res, function(){
				res.redirect("/blogs");
			});
		}
	});
});

// show login form
router.get("/login", function(req, res){
	res.render("login")
});

// login logic
router.post("/login", passport.authenticate("local", {
	successReturnToOrRedirect: "/blogs",
	failureRedirect: "/login"
}), function(req, res){
});

// logout logic
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

router.get("/footer", function(req, res){
	res.render("footer");
})

module.exports = router;