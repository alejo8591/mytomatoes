
/*
 * GET home page.
 */

exports.index = function(req, res){
	if(req.user){
		// res.send(req.user);
		res.render('index', { title: 'Express' });
	} else {
		res.send('<a href="/auth/twitter">Sign in with Twitter</a>');
	}
};