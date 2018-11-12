const express = require("express");
// Look up what mergeParams does and study it!
const router = express.Router({mergeParams: true});

let Blog = require("../models/blog");
let User = require("../models/user");
let Comment = require("../models/comment");
let middleware = require("../middleware");

const CommentController = require("../controllers/commentController");

router.use(middleware.isLoggedIn);

router.route("/")
	.post(CommentController.createComment);

router.route("/new")
	.get(CommentController.newCommentForm);

router.route("/:comment_id")
	.put(CommentController.updateComment)
	.delete(CommentController.deleteComment);

router.route("/:comment_id/edit")
	.get(CommentController.updateCommentForm);

router.route("/:comment_id/delete")
	.get(CommentController.deleteConfirm);

module.exports = router;