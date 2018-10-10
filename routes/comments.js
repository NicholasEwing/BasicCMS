const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const router = express.Router();

let Comments = require("../models/comment");

router.get("/new", function(req, res){
	res.render("comments/new");
});

module.exports = router;