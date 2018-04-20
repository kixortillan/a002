var express = require('express');
var router = express.Router();
var log = require('../lib/logger');
var Promise = require('bluebird');
var momentRange = require('moment-range');
var moment = momentRange.extendMoment(require('moment'));

/**
 * API for bar graph data
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next) {}          [description]
 * @return {[type]}       [description]
 */
router.get('/stats/bar', function(req, res, next) {

  var mode = req.query.mode ? req.query.mode : 'today';
  var dataFor = req.query.df ? req.query.df : 'registered_members';

});

module.exports = router;