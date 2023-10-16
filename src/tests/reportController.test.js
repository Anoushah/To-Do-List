const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const reportController = require('../controllers/reportController');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Report Controller', () => {
  describe('calculateAverageTasks', () => {
    it('should calculate the average tasks and return the result', (done) => {
      const userId = 22;
      chai
        .request(app)
        .get(`/reports/average-tasks?userId=${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('averageTaskPerDay');
          done();
        });
    });

    it('should return an error if the user is not found', (done) => {
      const userId = 23;
      chai
        .request(app)
        .get(`/reports/average-tasks?userId=${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('calculateCountTasks', () => {
    it('should calculate the task counts and return the result', (done) => {
      const userId = 21;
      chai
        .request(app)
        .get(`/reports/count-tasks?userId=${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('totalTasks');
          expect(res.body).to.have.property('completedTasks');
          expect(res.body).to.have.property('remainingTasks');
          done();
        });
    });

    it('should return an error if there is a problem calculating task counts', (done) => {
      const userId = 29;
      chai
        .request(app)
        .get(`/reports/count-tasks?userId=${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('calculateMaxTasks', () => {
    it('should calculate the maximum tasks and return the result', (done) => {
      const userId = 21;
      chai
        .request(app)
        .get(`/reports/max-tasks?userId=${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('maxTasks');
          done();
        });
    });

    it('should return an error if there is a problem calculating maximum tasks', (done) => {
      const userId = 21;
      chai
        .request(app)
        .get(`/reports/max-tasks?userId=${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('calculateOpenedTasks', () => {
    it('should calculate the opened tasks and return the result', (done) => {
      const userId = 21;
      chai
        .request(app)
        .get(`/reports/opened-tasks?userId=${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('openedTasks');
          done();
        });
    });

    it('should return an error if there is a problem calculating opened tasks', (done) => {
      const userId = 22;
      chai
        .request(app)
        .get(`/reports/opened-tasks?userId=${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('calculateOverdueTasks', () => {
    it('should calculate the overdue tasks and return the result', (done) => {
      const userId = 21;
      chai
        .request(app)
        .get(`/reports/overdue-tasks?userId=${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('overdueTasks');
          done();
        });
    });

    it('should return an error if there is a problem calculating overdue tasks', (done) => {
      const userId = 29;
      chai
        .request(app)
        .get(`/reports/overdue-tasks?userId=${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('calculateSimilarTasks', () => {
    it('should calculate the similar tasks and return the result', (done) => {
      const userId = 21;
      chai
        .request(app)
        .get(`/reports/similar-tasks?userId=${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('similarTasks');
          done();
        });
    });

    it('should return an error if there is a problem calculating similar tasks', (done) => {
      const userId = 21;
      chai
        .request(app)
        .get(`/reports/similar-tasks?userId=${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('sendDailyReminders', () => {
    it('should send daily reminders and return a success message', (done) => {
      chai
        .request(app)
        .get('/reports/send-daily-reminders')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Daily reminders sent successfully');
          done();
        });
    });

    it('should return an error if there is a problem sending daily reminders', (done) => {
      chai
        .request(app)
        .get('/reports/send-daily-reminders')
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
});
