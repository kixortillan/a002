var winston = require('winston');
require('winston-daily-rotate-file');
var dir = 'logs';

var transport = new (winston.transports.DailyRotateFile)({
  filename: dir + '/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '100m',
  maxFiles: '30d'
});

var logger = new (winston.Logger)({
  transports: [
    transport
  ]
});

module.exports = logger;