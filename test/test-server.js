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
    
    // Event Posting
    describe("Event posting", function() {
        it("it should POST an event", function(done) {
            var event = {
                authorEmail: "test email"['email'],
                groupLimit: 5['groupLimit'],
                body: "New test event"['body'],
                pictureUrl: ['picture_url'],
                user: ['user_name'],
                authorId: 2['id']
            };
            chai.request(server)
            .post("/add")
            .send(event)
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                // this doesn't work, not sure why
                // expect(res).to.redirectTo("/");
                done();
            });
        });
        // it("it should not post a event without.....", function(done) {
            
        // });
    });

    // Past event page
    describe("Past event page", function() {
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

    // Event joining

    // Terms info

    // Privacy info
    
});


// it("should add a SINGLE event on /add POST");
// it("should add a SINGLE user to a event on /post/join POST");
// it("should list ALL past events on /past GET");
// it("should ..... on /terms GET");
// it("should ..... on /privacy GET");