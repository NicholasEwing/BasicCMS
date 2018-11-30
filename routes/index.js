const express = require("express");
const passport = require("passport");
const router = express.Router();
const ejs_helpers = require("../public/js/ejs_helpers.js");

let User = require("../models/user");

// RESTFUL ROUTES
router.get("/", (req, res) => {
	res.redirect("/blogs");
});

// AUTH ROUTES

// show register form
router.get("/register", (req, res) => {
	res.render("register", {helpers: ejs_helpers});
});

// handling user sign up
router.post("/register", (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		} else {
			passport.authenticate("local")(req, res, () => {
				req.flash("success toast", "Hey " + user.username + ", thanks for signing up!");
				res.redirect("/blogs");
			});
		}
	});
});

// show login form
router.get("/login", (req, res) => {
	res.render("login");
});

// login logic
router.post("/login", passport.authenticate("local", {
	successReturnToOrRedirect: "/blogs",
	failureRedirect: "/login",
	failureFlash: true
}));

// logout logic
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success toast", "You've logged out.");
	res.redirect("/blogs");
});

router.get("/footer", (req, res) => {
	res.render("footer");
});

module.exports = router;