
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , TwitterStrategy  = require('passport-twitter').Strategy;
  // , manifest = require('./client');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.session({secret: 'dSYifnIOwYRevPyYIz5awwoDFRi2z8NDL7ILTLxuY'}));
app.use(passport.initialize());
app.use(express.bodyParser());
// app.use(express.methodOverride());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.set('hostname', 'http://mytomatoes.herokuapp.com/');
app.set('TWITTER_CONSUMER_KEY', 'eU2LJAfO0eELeXv4PS4g');
app.set('TWITTER_CONSUMER_SECRET', 'dSYifnIOwYRevPyYIz5awwoDFRi2z8NDL7ILTLxuY');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

passport.use(new TwitterStrategy({
	consumerKey: app.get('TWITTER_CONSUMER_KEY'),
	consumerSecret: app.get('TWITTER_CONSUMER_SECRET'),
	callbackURL:    app.get('hostname') + '/auth/twitter/callback'
	},
	function(token, tokenSecret, profile, done){
	/*	
		User.findOrCreate('...', function(err, user) {
      		if (err) { return done(err); }
      		done(null, user);
		});*/
		done(null, user);
	}
));

passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));

app.get('/install', manifest);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
