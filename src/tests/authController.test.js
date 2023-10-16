const chai = require('chai');
const app = require('../../app');
const request = require('supertest');
const expect = chai.expect;

describe('Authentication Controller', () => {
  let server;

  before((done) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      done();
    });
  });

  after((done) => {
    server.close(() => {
      done();
    });
  });

  describe('signup', () => {
    it('should create a new user and return a success message', (done) => {
      request(app)
        .post('/signup')
        .send({
          email: 'a5@gmail.com',
          username: 'a5',
          password: '12345678',
        })
        .expect(201)
        .end((err, res) => {
          expect(res.body.message).to.equal('User registered successfully');
          done();
        });
    });

    it('should return an error if the email is already in use', (done) => {
      request(app)
        .post('/signup')
        .send({
          email: 'a5@gmail.com',
          username: 'a5',
          password: '12345678',
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body.error).to.equal('Email address already in use');
          done();
        });
    });
  });

  describe('login', () => {
    it('should log in an existing user and return a token', (done) => {
      request(app)
        .post('/login')
        .send({
          email: 'a5@gmail.com',
          password: '12345678',
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.message).to.equal('Login successful');
          expect(res.body.token).to.be.a('string');
          done();
        });
    });

    it('should return an error if the user does not exist', (done) => {
      request(app)
        .post('/login')
        .send({
          email: 'a5@gmail.com',
          password: '12345678',
        })
        .expect(401)
        .end((err, res) => {
          expect(res.body.error).to.equal('Please sign up first');
          done();
        });
    });
  });
});
