//DEPENDENCIES
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var exphbs = require("express-handlebars");
var passport = require('passport');
var util = require('util');
var session = require('express-session');
var GitHubStrategy = require('passport-github2').Strategy;
var partials = require('express-partials');
var PORT = process.env.PORT || 8080;
var db = require("./models");

//GITHUB PASSPORT
var GITHUB_CLIENT_ID = "caff6bf6f0c8379836f4";
var GITHUB_CLIENT_SECRET = "34e26a2b6b29e0e58ccc1ea8e60ad3f119baa5c0";

// PASSPORT SESSION SETUP
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// USE GITHUB STRATEGY WITHIN PASSPORT
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "https://projectdepottest.herokuapp.com/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

// EXPRESS APP
var app = express();
app.use(partials());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(methodOverride("_method"));

//BODY PARSER FOR POST AND PUT
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// INIT PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// STATIC CONTENT
app.use(express.static(__dirname + '/public'));

// HANDLEBARS ENGINE
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//IMPORT ROUTES
var sandboxRoutes = require("./controllers/app_controller.js")(app);
var loginRoutes = require("./controllers/login_controller.js")(app);
var pageRoutes = require("./controllers/pages_controller.js")(app);

//DATABASE LISTENING
db.sequelize.sync().then(function() {
    app.listen(PORT, function () {
console.log("App listening on PORT: " + PORT);
    });
});