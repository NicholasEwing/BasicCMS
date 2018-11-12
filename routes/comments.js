const express = require("express");
const router = express.Router({mergeParams: true});
const middleware = require("../middleware");
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