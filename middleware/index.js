let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.session.returnTo = req.originalUrl;
	res.redirect("/login");
}

middlewareObj.isAdmin = function(req, res, next){
	if(req.isAuthenticated() && req.user.isAdmin) {
		return next();
	}
	// Put a proper 
	res.send("YOU'RE NOT AN ADMIN!");
}

module.exports = middlewareObj;