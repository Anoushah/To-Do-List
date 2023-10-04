const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const Task = require('../models/task');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Task Controller', () => {
  let authToken;

  before((done) => {
    chai
      .request(app)
      .post('/auth/login')
      .send({
        email: 'your@example.com',
        password: 'your_password',
      })
      .end((err, res) => {
        authToken = res.body.token;
        done();
      });
  });

  describe('createTask', () => {
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
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('title', 'New Task');
          done();
        });
    });

    it('should return an error if the user has too many tasks', (done) => {
      chai
        .request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Another Task',
          description: 'Description for another task',
          status: false,
          dueDateTime: '2023-09-30T12:00:00Z',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error', "You can't have more than 50 tasks");
          done();
        });
    });
  });

  describe('getAllTasks', () => {
    it('should get all tasks for the authenticated user', (done) => {
      chai
        .request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('updateTask', () => {
    it('should update a task', (done) => {
      chai
        .request(app)
        .put('/tasks/taskNumberToUpdate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Task',
          description: 'Updated description',
          status: true,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Task updated successfully');
          done();
        });
    });

    it('should return an error if the task does not exist', (done) => {
      chai
        .request(app)
        .put('/tasks/nonExistentTaskNumber')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Task',
          description: 'Updated description',
          status: true,
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error', 'Task not found');
          done();
        });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', (done) => {
      chai
        .request(app)
        .delete('/tasks/taskNumberToDelete')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res).to.have.status(204);
          done();
        });
    });

    it('should return an error if the task does not exist', (done) => {
      chai
        .request(app)
        .delete('/tasks/nonExistentTaskNumber')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error', 'Task does not exist for this user');
          done();
        });
    });
  });
});
