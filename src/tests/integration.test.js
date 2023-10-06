const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration Tests', () => {
  let authToken;

  before((done) => {
    chai
      .request(app)
      .post('/auth/login')
      .send({
        email: 'a22.com',
        password: '12345678',
      })
      .end((err, res) => {
        authToken = res.body.token;
        done();
      });
  });

  describe('Authentication', () => {
    it('should create a new user and return a success message', (done) => {
      chai
        .request(app)
        .post('/signup')
        .send({
          email: 'testuser@example.com',
          username: 'testuser',
          password: 'testpassword',
        })
        .expect(201)
        .end((err, res) => {
          expect(res.body.message).to.equal('User registered successfully');
          done();
        });
    });

    it('should log in an existing user and return a token', (done) => {
      chai
        .request(app)
        .post('/login')
        .send({
          email: 'testuser@example.com',
          password: 'testpassword',
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.message).to.equal('Login successful');
          expect(res.body.token).to.be.a('string');
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
        .expect(201)
        .end((err, res) => {
          expect(res.body.title).to.equal('New Task');
          done();
        });
    });

    it('should get all tasks for the authenticated user', (done) => {
      chai
        .request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .end((err, res) => {
          done();
        });
    });
  });

  describe('Reporting', () => {
    it('should calculate the average tasks and return the result', (done) => {
      const userId = 22;
      chai
        .request(app)
        .get(`/reports/average-tasks?userId=${userId}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('averageTaskPerDay');
          done();
        });
    });

    it('should calculate the task counts and return the result', (done) => {
      const userId = 22;
      chai
        .request(app)
        .get(`/reports/count-tasks?userId=${userId}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('totalTasks');
          expect(res.body).to.have.property('completedTasks');
          expect(res.body).to.have.property('remainingTasks');
          done();
        });
    });

    it('should calculate the maximum tasks and return the result', (done) => {
      const userId = 22;
      chai
        .request(app)
        .get(`/reports/max-tasks?userId=${userId}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('maxTasks');
          done();
        });
    });

  });
});
