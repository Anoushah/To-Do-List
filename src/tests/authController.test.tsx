import chai, { expect } from 'chai';
import app from '../../app';
import request from 'supertest';
import { before, after } from 'mocha';

describe('Authentication Controller', () => {
  let server: any;

  before((done: () => void) => {
    server = app.listen(0, () => {
      const port = (server.address() as any).port;
      done();
    });
  });

  after((done: () => void) => {
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
        .end((err: any, res: any) => {
          expect(res.body.message).to.equal('User registered successfully'); // Corrected line
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
        .end((err: any, res: any) => {
          expect(res.body.error).to.equal('Email address already in use'); // Corrected line
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
        .end((err: any, res: any) => {
          expect(res.body.message).to.equal('Login successful'); // Corrected line
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
        .end((err: any, res: any) => {
          expect(res.body.error).to.equal('Please sign up first'); // Corrected line
          done();
        });
    });
  });
});
