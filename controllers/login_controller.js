// REQUIRE MODELS
var db = require("../models");
var passport = require('passport');

module.exports = function (app) {

  app.get('/account', ensureAuthenticated, function (req, res) {
    res.render('account', {
      user: req.user,
      email: req.user.emails[0].value
    });
  });

  // GET /auth/github
  // USE passport.authenticate() TO AUTHENTICATE REQUEST
  // FIRST REDIRECT USER TO GITHUB, THEN GITHUB WILL REDIRECT USER TO /auth/github/callback
  app.get('/auth/github',
    passport.authenticate('github', {
      scope: ['user:email']
    }),
    function (req, res) {
      // THIS FUNCTION WILL NOT BE CALLED
    });

  // GET /auth/github/callback
  // USE passport.authenticate() TO AUTHENTICATE REQUEST
  // IF AUTH FAILS, USER WILL REDIRECT BACK TO LOGIN PAGE
  // IF AUTH IS SUCCESS, PRIMARY ROUTE IS CALLED
  app.get('/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }),
    function (req, res) {
      //CHANGE TO TRUE WHEN USER IS LOGGED IN 
      module.exports.loggedIn = true;

      var username = req.user._json.login;
      var pictureUrl = req.user._json.avatar_url;
      var email = req.user._json.email;

      //LOGIN USER
      db.User.findOrCreate({
          where: {
            user_name: username
          },
          defaults: {
            picture_url: pictureUrl,
            email: email
          }
        })
        .spread(function (user, created) {
          console.log(user.get({
            plain: true
          }));
          console.log(created);
          res.redirect('/');
        });
    });

  app.get('/logout', function (req, res) {
    //CHANGE TO FALSE WHEN USER IS LOGGED OUT
    module.exports.loggedIn = false;

    req.logout();
    res.redirect('/');
  });

  //PASSPORT AUTH FUNCTION
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }
};