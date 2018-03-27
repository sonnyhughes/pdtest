// REQUIRE MODELS
var db = require("../models");
var passport = require('passport');

module.exports = function (app) {

    app.get('/account', ensureAuthenticated, function(req, res){
      res.render('account', { user: req.user, email: req.user.emails[0].value});
    });

    // GET /auth/github
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in GitHub authentication will involve redirecting
    //   the user to github.com.  After authorization, GitHub will redirect the user
    //   back to this application at /auth/github/callback
    app.get('/auth/github',
      passport.authenticate('github', { scope: [ 'user:email' ] }),
      function(req, res){
        // The request will be redirected to GitHub for authentication, so this
        // function will not be called.
      });

    // GET /auth/github/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get('/auth/github/callback',
      passport.authenticate('github', { failureRedirect: '/login' }),
      function(req, res) {
        //change to true when logged in
        module.exports.loggedIn = true;

        var username = req.user._json.login;
        var pictureUrl = req.user._json.avatar_url;
        var email = req.user._json.email;

        //uniquely logs user into database on login
        db.User.findOrCreate({
          where: {user_name: username
        }, defaults: {
          picture_url: pictureUrl,
          email: email
        }})
      .spread(function(user, created) {
        console.log(user.get({
          plain: true
        }));
        console.log(created);

        res.redirect('/');

        });

      });

    app.get('/logout', function(req, res){
      //change to false when logged out
      module.exports.loggedIn = false;

      req.logout();
      res.redirect('/');
    });

//function that passport uses to authenticate login, if fails then it redirects to home
    function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      res.redirect('/');
    }

};

