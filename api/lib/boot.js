const winston = require('winston');
const config = require('../config');

module.exports = function (app) {
  return app.listen(config.app.listenPort, function () {
    winston.log('info', `App started on port ${config.app.listenPort}`);
  });
};
