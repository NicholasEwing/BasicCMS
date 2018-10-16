const express = require("express");
const router = express.Router();

let User = require("../models/user");
let Blog = require("../models/blog");

router.get("/", function(req, res){
	res.render("users/index");
})

router.get("/:id", function(req, res){
	// Find blogs where username == blog.author.username
	User.findOne({username: req.params.id})
	.populate("blogs")
	.exec(function(err, results){
		if(err){
			console.log(err);
		}
		res.render("users/show", {results: results});
		console.log(results);
	});


});

module.exports = router;