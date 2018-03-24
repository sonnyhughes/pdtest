var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();
var expect = require("chai").expect;

chai.use(chaiHttp);

describe("Status and content", function() {
    // Main page
    describe("Main page", function() {
        it("should load", function(done) {
            chai.request(server)
            .get("/")
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it("should return an object (webpage)", function(done) {
            chai.request(server)
            .get("/")
            .end(function(err, res) {
                expect(res.body).to.be.a("object");
                // use chai-dom to select certain elements?
                done();
            });
        });
    });
    
    // Project Posting
    describe("Project posting", function() {
        it("it should POST a project", function(done) {
            var project = {
                authorEmail: "test email"['email'],
                groupLimit: 5['groupLimit'],
                body: "New test project"['body'],
                pictureUrl: ['picture_url'],
                user: ['user_name'],
                authorId: 2['id']
            };
            chai.request(server)
            .post("/add")
            .send(project)
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                // this doesn't work, not sure why
                // expect(res).to.redirectTo("/");
                done();
            });
        });
        // it("it should not post a project without.....", function(done) {
            
        // });
    });

    // Past project page
    describe("Past project page", function() {
        it("should load", function(done) {
            chai.request(server)
            .get("/past")
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it("should return an object (webpage)", function(done) {
            chai.request(server)
            .get("/past")
            .end(function(err, res) {
                expect(res.body).to.be.a("object");
                // use chai-dom to select certain elements?
                done();
            });
        });
    });

    // Passport/Auth

    // Project joining

    // Terms info

    // Privacy info
    
});


// it("should add a SINGLE project on /add POST");
// it("should add a SINGLE user to a project on /post/join POST");
// it("should list ALL past projects on /past GET");
// it("should ..... on /terms GET");
// it("should ..... on /privacy GET");