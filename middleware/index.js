let middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {

	if(req.isAuthenticated()){
		return next();
	}

	req.session.returnTo = req.originalUrl;
	req.flash("error", "You must be logged in to do that.");
	res.redirect("/login");
}

middlewareObj.isAdmin = (req, res, next) => {
	if(req.isAuthenticated() && req.user.isAdmin) {
		return next();
	}
	// You must be an admin to do that!
	res.redirect("/login");
}

module.exports = middlewareObj;