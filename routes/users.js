const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.route("/")
	.get(UserController.getUsers);

router.route("/:id")	
	.get(UserController.getUser);

module.exports = router;