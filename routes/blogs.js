const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const BlogController = require("../controllers/blogController");

router.route("/")
	.get(BlogController.getBlogs)
	.post(middleware.isLoggedIn, BlogController.createBlog);

router.route("/new")
	.get(middleware.isLoggedIn, BlogController.newBlogForm);

router.route("/:id")
	.get(BlogController.getBlog)
	.put(middleware.isLoggedIn, BlogController.updateBlog)
	.delete(middleware.isLoggedIn, BlogController.deleteBlog);

router.route("/:id/edit")
	.get(middleware.isLoggedIn, BlogController.updateBlogForm);

router.route("/:id/delete")
	.get(middleware.isLoggedIn, BlogController.deleteConfirm);

module.exports = router;