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
};