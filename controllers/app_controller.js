// REQUIRE MODELS
var db = require("../models");
var loginBool = require("./login_controller");
var passport = require('passport');
const nodemailer = require('nodemailer');

//GMAIL CONFIGURATION FOR NODEMAILER (DOCUMENTATION SAYS SOMETIMES IT WORKS WITH GMAIL AND SOMETIMES NOT???)
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pronghorns2017@gmail.com',
        pass: 'NWBootcamp'
    }
});

// EXPORTING ROUTES
module.exports = function (app) {
    // ROOT ROUTE ROOT ROUTE
    app.get("/", function (req, res, next) {
        Promise.all([
            db.Post.findAll({
                order: [
                    ['updatedAt', 'DESC']
                ]
            }),
            db.User.findAll({}),
            db.UserPost.findAll({})
        ]).then(function (result) {
            var posts = result[0];
            var users = result[1];
            var groups = result[2];
            res.render("index", {
                posts: posts,
                users: users,
                groups: groups,
                user: req.user
            });
        }).catch(function (e) {
            console.log(e);
        });
    });
    // POST FOR ADDING EVENTS
    app.post('/add/', function (req, res) {
        // TRIGGER MODAL IF USER IS NOT LOGGED
        if (JSON.stringify(req.user) === undefined) {
            Promise.all([
                db.Post.findAll({})
            ]).then(function (result) {
                res.render("pleaseLoginModal", {
                    posts: result[0] || []
                });
            });
            //IF USER IS LOGGED IN
        } else {
            var newPost = req.body;
            //CHECK IF DATA IS PRESENT IN INPUT FIELDS
            if (req.body['body'] !== "" || req.body['groupLimit'] !== "") {
                //STORE CURRENT USER EMAIL
                var currentUser = req.user._json.email;
                //FETCH USER OBJECT FROM DB
                Promise.all([
                    db.User.find({
                        where: {
                            email: currentUser
                        }
                    })
                ]).then(function (result) {
                    //CREATE EVENT OBJECT FOR EACH USER
                    db.Post.create({
                        authorEmail: result[0]['email'],
                        groupLimit: newPost['groupLimit'],
                        body: newPost['body'],
                        pictureUrl: result[0]['picture_url'],
                        user: result[0]['user_name'],
                        authorId: result[0]['id']
                    }).then(function (result) {
                        //LINK EVENT AUTHOR TO GROUP
                        db.UserPost.create({
                            userEmail: currentUser,
                            UserId: result['authorId'],
                            PostId: result['id']
                        })
                        //REFRESH PAGE TO VIEW NEW EVENTS
                        res.redirect('/');
                    }).catch(function (err) {
                        console.log(err);
                    });
                });
                //TRIGGER MODEL IF DATA IS NOT PRESENT IN INPUT FIELDS
            } else {
                Promise.all([
                    db.Post.findAll({})
                ]).then(function (result) {
                    res.render("emptyInputModal", {
                        posts: result[0] || []
                    });
                });
            }

        }
    });
    // POST FOR JOINING EVENTS
    app.post('/post/join', function (req, res) {
        // TRIGGER MODAL IF USER IS NOT LOGGED
        if (JSON.stringify(req.user) === undefined) {
            Promise.all([
                db.Post.findAll({}),
                db.User.findAll({}),
                db.UserPost.findAll({})
            ]).then(function (result) {
                res.render("pleaseLoginModal", {
                    posts: result[0] || [],
                    users: result[1] || [],
                    groups: result[2] || []
                });
            });
        }
        //IF USER IS LOGGED IN
        else {
            //FETCH CURRENT USER INFO AND EVENT SELECTED
            var currentUser = req.user._json.email;
            var selectPostId = req.body.postId;
            var selectGroupLimit = req.body.groupLimit;
            //FETCH ALL EVENT ENTRIES LINKED TO THAT `postID`
            db.UserPost.findAll({
                where: {
                    postId: selectPostId
                }
            }).then(function (result) {
                //CHECK IF CURRENT USER IS A CURRENT MEMBER OF EVENT
                var userAlreadyJoinBool = false;
                //LOOP THROUGH RESULTS
                for (var i = 0; i < result.length; i++) {
                    if (result[i]['userEmail'] === currentUser) {
                        userAlreadyJoinBool = true;
                    }
                }
                //TRIGGER MODAL IF USER IS A CURRENT MEMBER OF AN EVENT
                if (userAlreadyJoinBool) {
                    Promise.all([
                        db.Post.findAll({}),
                    ]).then(function (result) {
                        var posts = result[0];
                        res.render("cantJoinModal", {
                            posts: posts,
                            user: req.user
                        });
                    }).catch(function (e) {
                        console.log(e);
                    });
                    //IF USER IS NOT A CURRENT MEMBER OF EVENT THEN CREATE EVENT LINKED TO USER
                } else {
                    var emailBody;
                    Promise.all([
                        db.User.find({
                            where: {
                                email: currentUser
                            }
                        }),
                        db.Post.find({
                            where: {
                                id: selectPostId
                            }
                        })
                    ]).then(function (result) {
                        //SAVE EMAIL BODY
                        emailBody = result[1]['body'];
                        // CHECK IF EVENT REQUIREMENTS HAVE BEEN MET ONCE EVENT IS CREATED
                        db.UserPost.create({
                            userEmail: currentUser,
                            UserId: result[0]['id'],
                            PostId: selectPostId
                        }).then(function (result) {
                            db.UserPost.findAll({
                                where: {
                                    postId: selectPostId
                                }
                            }).then(function (result) {
                                // SEND TO SAVED PROJECT PAGE IS EVENT HAS MET REQUIREMENTS AND 
                                if (result.length == selectGroupLimit) {

                                    var listOfEmails = "";

                                    for (var i = 0; i < result.length; i++) {
                                        var recipient = result[i]['userEmail'] + ', ';
                                        listOfEmails = listOfEmails.concat(recipient);
                                    }
                                    listOfEmails = listOfEmails.slice(0, (listOfEmails.length - 2));
                                    // NODE MAILER OPTIONS
                                    var mailOptions = {
                                        from: '"Study Hall" <pronghorns2017@gmail.com>',
                                        to: listOfEmails,
                                        subject: 'Your Event is Ready to Schedule!',
                                        text: 'Hi! Please connect with us!',
                                        html: '<b>Hi! Please connect with us!</b><p>Your study group is ready to be scheduled!</p><p>Here are the topcs you will discuss: </p>' + '"' + emailBody + '"'
                                    };
                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            return console.log(error);
                                        }
                                        console.log('Message %s sent: %s', info.messageId, info.response);
                                    });
                                    //UPDATE POST CAPACITY
                                    db.Post.update({
                                        capacity: true
                                    }, {
                                        where: {
                                            id: selectPostId
                                        }
                                    });
                                    Promise.all([
                                        db.Post.findAll({}),
                                    ]).then(function (result) {
                                        var posts = result[0];
                                        res.render("joinAndEmailModal", {
                                            posts: posts,
                                            user: req.user
                                        });
                                    }).catch(function (e) {
                                        console.log(e);
                                    });
                                }
                                // TRIGGER MODAL IF GROUP LIMIT IS NOT MET
                                else {
                                    Promise.all([
                                        db.Post.findAll({}),
                                    ]).then(function (result) {
                                        var posts = result[0];
                                        res.render("joinModal", {
                                            posts: posts,
                                            user: req.user
                                        });
                                    }).catch(function (e) {
                                        console.log(e);
                                    });
                                }

                            });

                        });

                    });
                }

            });
        }

    });
};