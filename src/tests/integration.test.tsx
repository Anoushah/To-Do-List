import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

chai.use(chaiHttp);

describe('Integration Tests', () => {
  let authToken: string;

  before((done: () => void) => {
    chai
      .request(app)
      .post('/auth/login')
      .send({
        email: 'a22@example.com',
        password: '123452345',
      })
      .end((err: any, res: any) => {
        authToken = res.body.token;
        done();
      });
  });

  describe('Authentication', () => {
    it('should create a new user and return a success message', (done) => {
      chai
        .request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          username: 'TestUser',
          password: 'TestPassword',
        })
        .end((err: any, res: any) => {
          chai.expect(res.status).to.equal(201);
          chai.expect(res.body.message).to.equal('User registered successfully');
          done();
        });
    });

    it('should return an error when registering with an existing email', (done) => {
      chai
        .request(app)
        .post('/auth/signup')
        .send({
          email: 'a22@example.com', // Use an existing email
          username: 'TestUser2',
          password: 'TestPassword',
        })
        .end((err: any, res: any) => {
          chai.expect(res.status).to.equal(400);
          chai.expect(res.body.error).to.equal('Email address already in use');
          done();
        });
    });

    it('should log in an existing user and return a token', (done) => {
      chai
        .request(app)
        .post('/auth/login')
        .send({
          email: 'a22@example.com',
          password: '123452345',
        })
        .end((err: any, res: any) => {
          chai.expect(res.status).to.equal(200);
          chai.expect(res.body.message).to.equal('Login successful');
          chai.expect(res.body.token).to.be.a('string');
          done();
        });
    });

    it('should return an error when logging in with an invalid password', (done) => {
      chai
        .request(app)
        .post('/auth/login')
        .send({
          email: 'a22@example.com',
          password: 'InvalidPassword', // Use an incorrect password
        })
        .end((err: any, res: any) => {
          chai.expect(res.status).to.equal(401);
          chai.expect(res.body.error).to.equal('Invalid password');
          done();
        });
    });
  });

  describe('Task Management', () => {
    it('should create a new task', (done) => {
      chai
        .request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'New Task',
          description: 'Description for the new task',
          status: false,
          dueDateTime: '2023-09-30T12:00:00Z',
        })
        .end((err: any, res: any) => {
          chai.expect(res.status).to.equal(201);
          chai.expect(res.body.title).to.equal('New Task');
          done();
        });
    });

    it('should return an error when creating a task without authorization', (done) => {
      chai
        .request(app)
        .post('/tasks')
        .send({
          title: 'New Task',
          description: 'Description for the new task',
          status: false,
          dueDateTime: '2023-09-30T12:00:00Z',
        })
        .end((err: any, res: any) => {
          chai.expect(res.status).to.equal(401);
          chai.expect(res.body.error).to.equal('Unauthorized');
          done();
        });
    });
  });
});
