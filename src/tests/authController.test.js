const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app'); 
const { signup, login } = require('../controllers/authController'); 

chai.use(chaiHttp);
const expect = chai.expect;

describe('Authentication Controller', () => {
  describe('signup', () => {
    it('should create a new user and return a success message', (done) => {
      const req = {
        body: {
            email: 'a5@gmail.com',
            username: 'a5',
            password: '12345678',
        },
      };
      const res = {
        status: function (statusCode) {
          expect(statusCode).to.equal(201);
          return this;
        },
        json: function (response) {
          expect(response.message).to.equal('User registered successfully');
          done();
        },
      };

      signup(req, res);
    });

    it('should return an error if the email is already in use', (done) => {
      const req = {
        body: {
          email: 'a5@gmail.com',
          username: 'a5',
          password: '12345678',
        },
      };
      const res = {
        status: function (statusCode) {
          expect(statusCode).to.equal(400);
          return this;
        },
        json: function (response) {
          expect(response.error).to.equal('Email address already in use');
          done();
        },
      };

      signup(req, res);
    });

    
  });

  describe('login', () => {
    it('should log in an existing user and return a token', (done) => {
      const req = {
        body: {
            email: 'a5@gmail.com',
            password: '12345678',
        },
      };
      const res = {
        status: function (statusCode) {
          expect(statusCode).to.equal(200);
          return this;
        },
        json: function (response) {
          expect(response.message).to.equal('Login successful');
          expect(response.token).to.be.a('string');
          done();
        },
      };

      login(req, res);
    });

    it('should return an error if the user does not exist', (done) => {
      const req = {
        body: {
          email: 'a5@gmail.com',
          password: '12345678',
        },
      };
      const res = {
        status: function (statusCode) {
          expect(statusCode).to.equal(401);
          return this;
        },
        json: function (response) {
          expect(response.error).to.equal('Please sign up first');
          done();
        },
      };

      login(req, res);
    });

  });
});
