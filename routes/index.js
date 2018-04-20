var express = require('express');
var router = express.Router();
var log = require('../lib/logger');
var Promise = require('bluebird');
var qs = require('qs');
var momentRange = require('moment-range');
var moment = momentRange.extendMoment(require('moment'));
var stats = require('../lib/db/Statistics');

/**
 * Route for home page
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next) {             var mode [description]
 * @return {[type]}       [description]
 */
router.get('/', function(req, res, next) {

  //URL query variables
  var mode = req.query.mode ? req.query.mode : 'today';
  var graph1 = req.query.gr1 ? req.query.gr1 : 'reg_mem';
  var graph2 = req.query.gr2 ? req.query.gr2 : 'fam_circles';

  console.log('Mode:', mode, 'Graph1:', graph1, 'Graph2:', graph2);
  
  //initialize dynamic params
  var dateFrom;
  var dateTo;
  var unit;

  switch(mode) {

    case 'last7d':
      dateFrom = moment().startOf('day').subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss');
      dateTo = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
      break;
    case 'last30d':
      dateFrom = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      dateTo = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      break;
    case 'last365d':
      dateFrom = moment().startOf('year').format('YYYY-MM-DD HH:mm:ss');
      dateTo = moment().endOf('year').format('YYYY-MM-DD HH:mm:ss');
      break;
    case 'today':
    default:
      dateFrom = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      dateTo = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
      break;

  }

  console.log('Date From:', dateFrom, 'Date To:', dateTo);
  log.info('Date From:', dateFrom, 'Date To:', dateTo);
  
  var metrics = require('../lib/db/Metrics');
  
  var queries = [];

  queries.push(metrics.registeredMembers(dateFrom, dateTo));
  queries.push(metrics.totalFamilyCircleAndCircleOfTrust(dateFrom, dateTo));
  queries.push(metrics.totalOrgsAndCommunities(dateFrom, dateTo));
  queries.push(metrics.totalUsersPerTelco(dateFrom, dateTo));

  var categories = getCatergories(mode, dateFrom, dateTo);

  queries.push(queryData(graph1, mode, dateFrom, dateTo, categories));
  queries.push(queryData(graph2, mode, dateFrom, dateTo, categories));

  Promise.all(queries)
    .then(function(results) {

      console.log('Queries results:', results);
      log.info('Queries results:', results);
      return results;

    })
    .spread(function(registeredMembers, totalFamilyCircleAndCircleOfTrust, 
      totalOrgsAndCommunities, totalUsersPerTelco, graphData1, graphData2) {
        
      var circles = {};

      totalFamilyCircleAndCircleOfTrust.forEach(function(item) {
        if(item.is_family === 1){
          circles['family'] = item.total;
        } else {
          circles['trust'] = item.total;
        }
      });

      var orgs = {};

      totalOrgsAndCommunities.forEach(function(item) {
        if(item.type === 1) {
          orgs['orgs'] = item.total;
        } else {
          orgs['communities'] = item.total;
        }
      });

      var telcos = {};

      totalUsersPerTelco.forEach(function(item) {
        if(item.telco === 'GLOBE') {
          telcos['globe'] = item.total;
        } else if (item.telco === 'SMART') {
          telcos['smart'] = item.total;
        } else if (item.telco === 'SUN') {
          telcos['sun'] = item.total;
        } else {
          telcos['others'] = item.total;
        }
      });

      var graph1Config = createConfigForGraph(graph1, graphData1, categories);

      var graph2Config = createConfigForGraph(graph2, graphData2, categories);

      // var formattedGraphData2 = {
      //   columns: {
      //     //android
      //     android: ['android'],
      //     ios: ['ios'],
      //   },
      //   categories: categories,
      // };

      // graphData1.forEach(function(item) {
      //   if(item.os_type === 1){
      //     //android
      //     formattedGraphData1.columns.android.push(item.count);
      //   } else if(item.os_type === 2) {
      //     //ios
      //     formattedGraphData1.columns.ios.push(item.count);
      //   } else {
      //     formattedGraphData1.columns.android.push(0);
      //     formattedGraphData1.columns.ios.push(0);
      //   }
      // });

      console.log('Graph Data 1:', graph1Config);
      console.log('Graph Data 2:', graph2Config);

      res.render('stats/main', {
        mode: mode,
        totalRegisteredMembers: registeredMembers[0].total || 0,
        totalFamilyCircles: circles.family || 0,
        totalCircleOfTrust: circles.trust || 0,
        totalOrgs: orgs.orgs || 0,
        totalCommunities: orgs.communities || 0,
        totalUsersGlobe: telcos.globe || 0,
        totalUsersSmart: telcos.smart || 0,
        totalUsersSun: telcos.sun || 0,
        totalUsersOthers: telcos.others || 0,
        graphData1: JSON.stringify(graph1Config),
        graphData1Selected: graph1,
        graphData2: JSON.stringify(graph2Config),
        graphData2Selected: graph2,
        urlToday: '?' + qs.stringify({...req.query, mode: 'today'}),
        urlLast7d: '?' + qs.stringify({...req.query, mode: 'last7d'}),
        urlLast30d: '?' + qs.stringify({...req.query, mode: 'last30d'}),
        urlLast365d: '?' + qs.stringify({...req.query, mode: 'last365d'}),
      });

    })
    .catch(function(err) {

      console.error(err);
      log.error(err);

    });

});


function queryData(dataFor, mode, dateFrom, dateTo, categories) {

  switch(dataFor) {

    case 'f_app_launch':
      break;

    case 'fam_circles':
      return queryCircles(mode, dateFrom, dateTo, categories);
      break;

    case 'cot':
      return queryCircleOfTrusts(mode, dateFrom, dateTo, categories);
      break;

    case 'orgs':
      return queryOrgs(mode, dateFrom, dateTo, categories);
      break;

    case 'comm':
      return queryCommunities(mode, dateFrom, dateTo, categories);
      break;

    case 'smart':
      return querySmartUsers(mode, dateFrom, dateTo, categories);
      break;

    case 'globe':
      return queryGlobeUsers(mode, dateFrom, dateTo, categories);
      break;

    case 'sun':
      return querySunUsers(mode, dateFrom, dateTo, categories);
      break;

    default:
    case 'reg_mem':
      return queryRegisteredMembers(mode, dateFrom, dateTo, categories);
      break;

  }

}

function queryRegisteredMembers(mode, dateFrom, dateTo, categories) {

  switch(mode) {

    case 'last7d':
      return stats.countRegisteredMembersLast7Days(categories, dateFrom, dateTo);
      break;

    case 'last30d':
      return stats.countRegisteredMembersLast30Days(categories, dateFrom, dateTo);
      break;

    case 'last365d':
      return stats.countRegisteredMembersLast365Days(dateFrom, dateTo);
      break;

    case 'today':
    default:
      return stats.countRegisteredMembersToday(dateFrom, dateTo);
      break;

  }

}

function queryCircles(mode, dateFrom, dateTo, categories) {

  switch(mode) {

    case 'last7d':
      return stats.countCirclesLast7Days(categories, dateFrom, dateTo);
      break;

    case 'last30d':
      return stats.countCirclesLast30Days(categories, dateFrom, dateTo);
      break;

    case 'last365d':
      return stats.countCirclesLast365Days(dateFrom, dateTo);
      break;

    case 'today':
    default:
      return stats.countCirclesToday(dateFrom, dateTo);
      break;

  }

}

function queryCircleOfTrusts(mode, dateFrom, dateTo, categories) {

  switch(mode) {

    case 'last7d':
      return stats.countCirclesLast7Days(categories, dateFrom, dateTo, 0);
      break;

    case 'last30d':
      return stats.countCirclesLast30Days(categories, dateFrom, dateTo, 0);
      break;

    case 'last365d':
      return stats.countCirclesLast365Days(dateFrom, dateTo, 0);
      break;

    case 'today':
    default:
      return stats.countCirclesToday(dateFrom, dateTo, 0);
      break;

  }

}

function queryOrgs(mode, dateFrom, dateTo, categories) {

  switch(mode) {

    case 'last7d':
      return stats.countOrgsLast7Days(categories, dateFrom, dateTo);
      break;

    case 'last30d':
      return stats.countOrgsLast30Days(categories, dateFrom, dateTo);
      break;

    case 'last365d':
      return stats.countOrgsLast365Days(dateFrom, dateTo);
      break;

    case 'today':
    default:
      return stats.countOrgsToday(dateFrom, dateTo);
      break;

  }

}

function queryCommunities(mode, dateFrom, dateTo, categories) {

  switch(mode) {

    case 'last7d':
      return stats.countOrgsLast7Days(categories, dateFrom, dateTo, 2);
      break;

    case 'last30d':
      return stats.countOrgsLast30Days(categories, dateFrom, dateTo, 2);
      break;

    case 'last365d':
      return stats.countOrgsLast365Days(dateFrom, dateTo, 2);
      break;

    case 'today':
    default:
      return stats.countOrgsToday(dateFrom, dateTo, 2);
      break;

  }

}

function querySmartUsers(mode, dateFrom, dateTo, categories) {

  switch(mode) {

    case 'last7d':
      return stats.countSmartUsersLast7Days(categories, dateFrom, dateTo);
      break;

    case 'last30d':
      return stats.countSmartUsersLast30Days(categories, dateFrom, dateTo);
      break;

    case 'last365d':
      return stats.countSmartUsersLast365Days(dateFrom, dateTo);
      break;

    case 'today':
    default:
      return stats.countSmartUsersToday(dateFrom, dateTo);
      break;

  }

}

function queryGlobeUsers(mode, dateFrom, dateTo, categories) {

  switch(mode) {

    case 'last7d':
      return stats.countGlobeUsersLast7Days(categories, dateFrom, dateTo);
      break;

    case 'last30d':
      return stats.countGlobeUsersLast30Days(categories, dateFrom, dateTo);
      break;

    case 'last365d':
      return stats.countGlobeUsersLast365Days(dateFrom, dateTo);
      break;

    case 'today':
    default:
      return stats.countGlobeUsersToday(dateFrom, dateTo);
      break;

  }

}

function querySunUsers(mode, dateFrom, dateTo, categories) {

  switch(mode) {

    case 'last7d':
      return stats.countSunUsersLast7Days(categories, dateFrom, dateTo);
      break;

    case 'last30d':
      return stats.countSunUsersLast30Days(categories, dateFrom, dateTo);
      break;

    case 'last365d':
      return stats.countSunUsersLast365Days(dateFrom, dateTo);
      break;

    case 'today':
    default:
      return stats.countSunUsersToday(dateFrom, dateTo);
      break;

  }

}

function getCatergories(mode, dateFrom, dateTo) {

  switch(mode) {

    case 'last7d':
      unit = 'day';
      var range = [moment(dateFrom), moment(dateTo)];

      return Array.from(moment.range(range).by('days')).map(function(moment) {
        return moment.date();
      });
      break;

    case 'last30d':
      var range = [moment(dateFrom), moment(dateTo)];

      return Array.from(moment.range(range).by('days')).map(function(moment) {
        return moment.date();
      });
      break;

    case 'last365d':
      var range = [moment(dateFrom), moment(dateTo)];

      return Array.from(moment.range(range).by('months')).map(function(moment) {
        return moment.format('MMM');
      });
      break;

    case 'today':
    default:
      var range = [moment(dateFrom), moment(dateTo)];

      return Array.from(moment.range(range).by('hours')).map(function(moment) {
        return moment.format('HH');
      });
      break;

  }

}

function createConfigForGraph(dataFor, data, categories) {

  console.log(dataFor);
  var config = {
    columns: [],
    categories: categories,
  };

  switch(dataFor) {

    case 'f_app_launch':
      break;

    case 'fam_circles':
      config.columns.push(['Family Circles']);

      data.forEach(function(item) {
        config.columns[0].push(item.count);
      });

      config.colors = {
        'Family Circles': '#0057AD',
      };

      return config;
      break;

    case 'cot':
      config.columns.push(['Circle of Trust']);

      data.forEach(function(item) {
        config.columns[0].push(item.count);
      });

      config.colors = {
        'Circle of Trust': '#0057AD',
      };

      return config;
      break;

    case 'orgs':
      config.columns.push(['Organizations']);

      data.forEach(function(item) {
        config.columns[0].push(item.count);
      });

      config.colors = {
        'Organizations': '#0057AD',
      };

      return config;
      break;

    case 'comm':
      config.columns.push(['Communities']);

      data.forEach(function(item) {
        config.columns[0].push(item.count);
      });

      config.colors = {
        'Communities': '#0057AD',
      };

      return config;

    default:
    case 'smart':
    case 'globe':
    case 'sun':
    case 'reg_mem':
      config.columns.push(['Android']);
      config.columns.push(['iOS']);

      data.forEach(function(item) {
        if(item.os_type === 1){
          //android
          config.columns[0].push(item.count);
        } else if(item.os_type === 2) {
          //ios
          config.columns[1].push(item.count);
        } else {
          config.columns[0].push(0);
          config.columns[1].push(0);
        }
      });

      config.colors = {
        Android: '#0057AD',
        iOS: '#007EFA',
      };

      config.groups = [
        ['Android', 'iOS']
      ];

      return config;
      break;

  }

}

module.exports = router;
