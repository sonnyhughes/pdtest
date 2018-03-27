// REQUIRE MODELS
var db = require("../models");
var passport = require('passport');

// PAGE ROUTING
module.exports = function (app) {
    app.get('/past', function (req, res) {
        db.Post.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        }).then(function (result) {
            var createdAtArray = [];
            for (var i = 0; i < result.length; i++) {
                createdAtArray.push(result[i]);
            }
            res.render('pastProjects', {
                posts: result,
                createdAt: createdAtArray
            });
        });
    });
    // app.get('/terms', function (req, res) {
    //     db.User.findAll({}).then(function (result) {
    //         var users = result[0];
    //         res.render("terms", {
    //             users: users,
    //             user: req.user
    //         });
    //         // res.render('/terms');
    //     });
    // });
    // app.get('/privacy', function (req, res) {
    //     db.User.findAll({}).then(function (result) {
    //         var users = result[0];
    //         res.render("privacy", {
    //             users: users,
    //             user: req.user
    //         });
    //     });
    // });
};