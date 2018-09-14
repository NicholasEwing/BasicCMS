const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
	res.render("blog");
});

// set up mongodb

app.listen(3000, () => console.log("Server started on port 3000"));