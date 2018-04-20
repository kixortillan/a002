var db = require('../../models');

module.exports = {

  countRegisteredMembersToday: function(dateFrom, dateTo) {
    return db.sequelize.query(
      `SELECT hours.hour, IFNULL(main.count, 0) as count, main.os_type
      FROM (
      SELECT 00 AS hour
      UNION SELECT 01 AS hour
      UNION SELECT 02 AS hour
      UNION SELECT 03 AS hour
      UNION SELECT 04 AS hour
      UNION SELECT 05 AS hour
      UNION SELECT 06 AS hour
      UNION SELECT 07 AS hour
      UNION SELECT 08 AS hour
      UNION SELECT 09 AS hour
      UNION SELECT 10 AS hour
      UNION SELECT 11 AS hour
      UNION SELECT 12 AS hour
      UNION SELECT 13 AS hour
      UNION SELECT 14 AS hour
      UNION SELECT 15 AS hour
      UNION SELECT 16 AS hour
      UNION SELECT 17 AS hour
      UNION SELECT 18 AS hour
      UNION SELECT 19 AS hour
      UNION SELECT 20 AS hour
      UNION SELECT 21 AS hour
      UNION SELECT 22 AS hour
      UNION SELECT 23 AS hour
      ) hours
      LEFT JOIN
      (
      SELECT COUNT(*) AS count, HOUR(date_registered) AS hour, os_type
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      AND os_type IS NOT NULL
      GROUP BY HOUR(date_registered), os_type
      ) main
      ON hours.hour = main.hour;`,
      { 
        bind: {
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countRegisteredMembersLast7Days: function(targetDays, dateFrom, dateTo) {
    return db.sequelize.query(
      `SELECT days.day, IFNULL(main.count, 0) as count, main.os_type
      FROM (
      SELECT $one AS day
      UNION SELECT $two AS day
      UNION SELECT $three AS day
      UNION SELECT $four AS day
      UNION SELECT $five AS day
      UNION SELECT $six AS day
      UNION SELECT $seven AS day
      ) days
      LEFT JOIN (
      SELECT COUNT(*) as count, DAY(date_registered) as day, os_type
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      AND os_type IS NOT NULL
      GROUP BY DAY(date_registered), os_type
      ) main
      ON days.day = main.day;`,
      { 
        bind: {
          one: targetDays[0],
          two: targetDays[1],
          three: targetDays[2],
          four: targetDays[3],
          five: targetDays[4],
          six: targetDays[5],
          seven: targetDays[6],
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countRegisteredMembersLast30Days: function(targetDays, dateFrom, dateTo) {

    var sqlDays = '';
    for(var i = 0; i < targetDays.length; i++) {
      if(i === 0) {
        sqlDays += 'SELECT ' + targetDays[i] + ' AS day ';
      }else {
        sqlDays += 'UNION SELECT ' + targetDays[i] + ' AS day ';
      }
    }

    return db.sequelize.query(
      `SELECT days.day, IFNULL(main.count, 0) as count, main.os_type
      FROM (
        ${sqlDays}
      ) days
      LEFT JOIN (
      SELECT COUNT(*) as count, DAY(date_registered) as day, os_type
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      AND os_type IS NOT NULL
      GROUP BY DAY(date_registered), os_type
      ) main
      ON days.day = main.day;`,
      { 
        bind: {
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countRegisteredMembersLast365Days: function(dateFrom, dateTo) {
    return db.sequelize.query(
      `SELECT months.month, IFNULL(main.count, 0) as count, main.os_type
      FROM (
      SELECT 'Jan' AS month
      UNION SELECT 'Feb' AS month
      UNION SELECT 'Mar' AS month
      UNION SELECT 'Apr' AS month
      UNION SELECT 'May' AS month
      UNION SELECT 'Jun' AS month
      UNION SELECT 'Jul' AS month
      UNION SELECT 'Aug' AS month
      UNION SELECT 'Sep' AS month
      UNION SELECT 'Oct' AS month
      UNION SELECT 'Nov' AS month
      UNION SELECT 'Dec' AS month
      ) months
      LEFT JOIN
      (
      SELECT COUNT(*) AS count, DATE_FORMAT(date_registered, '%b') AS month, os_type
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      AND os_type IS NOT NULL
      GROUP BY MONTH(date_registered), os_type
      ) main
      ON months.month = main.month;`,
      { 
        bind: {
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countCirclesToday: function(dateFrom, dateTo, isFamily = 1) {
    return db.sequelize.query(
      `SELECT hours.hour, IFNULL(main.count, 0) as count
      FROM (
      SELECT 00 AS hour
      UNION SELECT 01 AS hour
      UNION SELECT 02 AS hour
      UNION SELECT 03 AS hour
      UNION SELECT 04 AS hour
      UNION SELECT 05 AS hour
      UNION SELECT 06 AS hour
      UNION SELECT 07 AS hour
      UNION SELECT 08 AS hour
      UNION SELECT 09 AS hour
      UNION SELECT 10 AS hour
      UNION SELECT 11 AS hour
      UNION SELECT 12 AS hour
      UNION SELECT 13 AS hour
      UNION SELECT 14 AS hour
      UNION SELECT 15 AS hour
      UNION SELECT 16 AS hour
      UNION SELECT 17 AS hour
      UNION SELECT 18 AS hour
      UNION SELECT 19 AS hour
      UNION SELECT 20 AS hour
      UNION SELECT 21 AS hour
      UNION SELECT 22 AS hour
      UNION SELECT 23 AS hour
      ) hours
      LEFT JOIN
      (
      SELECT COUNT(*) AS count, HOUR(date_created) AS hour
      FROM tbl_circles
      WHERE date_created >= $dateFrom
      AND date_created <= $dateTo
      AND is_family = $isFamily
      GROUP BY HOUR(date_created)
      ) main
      ON hours.hour = main.hour;`,
      { 
        bind: {
          isFamily: isFamily,
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countCirclesLast7Days: function(targetDays, dateFrom, dateTo, isFamily = 1) {
    return db.sequelize.query(
      `SELECT days.day, IFNULL(main.count, 0) as count
      FROM (
      SELECT $one AS day
      UNION SELECT $two AS day
      UNION SELECT $three AS day
      UNION SELECT $four AS day
      UNION SELECT $five AS day
      UNION SELECT $six AS day
      UNION SELECT $seven AS day
      ) days
      LEFT JOIN (
      SELECT COUNT(*) as count, DAY(date_created) as day
      FROM tbl_circles
      WHERE date_created >= $dateFrom
      AND date_created <= $dateTo
      AND is_family = $isFamily
      GROUP BY DAY(date_created)
      ) main
      ON days.day = main.day;`,
      { 
        bind: {
          one: targetDays[0],
          two: targetDays[1],
          three: targetDays[2],
          four: targetDays[3],
          five: targetDays[4],
          six: targetDays[5],
          seven: targetDays[6],
          isFamily: isFamily,
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countCirclesLast30Days: function(targetDays, dateFrom, dateTo, isFamily = 1) {

    var sqlDays = '';
    for(var i = 0; i < targetDays.length; i++) {
      if(i === 0) {
        sqlDays += 'SELECT ' + targetDays[i] + ' AS day ';
      }else {
        sqlDays += 'UNION SELECT ' + targetDays[i] + ' AS day ';
      }
    }

    return db.sequelize.query(
      `SELECT days.day, IFNULL(main.count, 0) as count
      FROM (
        ${sqlDays}
      ) days
      LEFT JOIN (
      SELECT COUNT(*) as count, DAY(date_created) as day
      FROM tbl_circles
      WHERE date_created >= $dateFrom
      AND date_created <= $dateTo
      AND is_family = $isFamily
      GROUP BY DAY(date_created)
      ) main
      ON days.day = main.day;`,
      { 
        bind: {
          isFamily: isFamily,
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countCirclesLast365Days: function(dateFrom, dateTo, isFamily = 1) {
    return db.sequelize.query(
      `SELECT months.month, IFNULL(main.count, 0) as count
      FROM (
      SELECT 'Jan' AS month
      UNION SELECT 'Feb' AS month
      UNION SELECT 'Mar' AS month
      UNION SELECT 'Apr' AS month
      UNION SELECT 'May' AS month
      UNION SELECT 'Jun' AS month
      UNION SELECT 'Jul' AS month
      UNION SELECT 'Aug' AS month
      UNION SELECT 'Sep' AS month
      UNION SELECT 'Oct' AS month
      UNION SELECT 'Nov' AS month
      UNION SELECT 'Dec' AS month
      ) months
      LEFT JOIN
      (
      SELECT COUNT(*) AS count, DATE_FORMAT(date_created, '%b') AS month
      FROM tbl_circles
      WHERE date_created >= $dateFrom
      AND date_created <= $dateTo
      AND is_family = $isFamily
      GROUP BY MONTH(date_created)
      ) main
      ON months.month = main.month;`,
      { 
        bind: {
          isFamily: isFamily,
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countOrgsToday: function(dateFrom, dateTo, orgType = 1) {
    return db.sequelize.query(
      `SELECT hours.hour, IFNULL(main.count, 0) as count
      FROM (
      SELECT 00 AS hour
      UNION SELECT 01 AS hour
      UNION SELECT 02 AS hour
      UNION SELECT 03 AS hour
      UNION SELECT 04 AS hour
      UNION SELECT 05 AS hour
      UNION SELECT 06 AS hour
      UNION SELECT 07 AS hour
      UNION SELECT 08 AS hour
      UNION SELECT 09 AS hour
      UNION SELECT 10 AS hour
      UNION SELECT 11 AS hour
      UNION SELECT 12 AS hour
      UNION SELECT 13 AS hour
      UNION SELECT 14 AS hour
      UNION SELECT 15 AS hour
      UNION SELECT 16 AS hour
      UNION SELECT 17 AS hour
      UNION SELECT 18 AS hour
      UNION SELECT 19 AS hour
      UNION SELECT 20 AS hour
      UNION SELECT 21 AS hour
      UNION SELECT 22 AS hour
      UNION SELECT 23 AS hour
      ) hours
      LEFT JOIN
      (
      SELECT COUNT(*) AS count, HOUR(date_created) AS hour
      FROM tbl_organizations
      WHERE date_created >= $dateFrom
      AND date_created <= $dateTo
      AND type = $orgType
      GROUP BY HOUR(date_created)
      ) main
      ON hours.hour = main.hour;`,
      { 
        bind: {
          orgType: orgType,
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countOrgsLast7Days: function(targetDays, dateFrom, dateTo, orgType = 1) {
    return db.sequelize.query(
      `SELECT days.day, IFNULL(main.count, 0) as count
      FROM (
      SELECT $one AS day
      UNION SELECT $two AS day
      UNION SELECT $three AS day
      UNION SELECT $four AS day
      UNION SELECT $five AS day
      UNION SELECT $six AS day
      UNION SELECT $seven AS day
      ) days
      LEFT JOIN (
      SELECT COUNT(*) as count, DAY(date_created) as day
      FROM tbl_organizations
      WHERE date_created >= $dateFrom
      AND date_created <= $dateTo
      AND type = $orgType
      GROUP BY DAY(date_created)
      ) main
      ON days.day = main.day;`,
      { 
        bind: {
          one: targetDays[0],
          two: targetDays[1],
          three: targetDays[2],
          four: targetDays[3],
          five: targetDays[4],
          six: targetDays[5],
          seven: targetDays[6],
          orgType: orgType,
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countOrgsLast30Days: function(targetDays, dateFrom, dateTo, orgType = 1) {

    var sqlDays = '';
    for(var i = 0; i < targetDays.length; i++) {
      if(i === 0) {
        sqlDays += 'SELECT ' + targetDays[i] + ' AS day ';
      }else {
        sqlDays += 'UNION SELECT ' + targetDays[i] + ' AS day ';
      }
    }

    return db.sequelize.query(
      `SELECT days.day, IFNULL(main.count, 0) as count
      FROM (
        ${sqlDays}
      ) days
      LEFT JOIN (
      SELECT COUNT(*) as count, DAY(date_created) as day
      FROM tbl_organizations
      WHERE date_created >= $dateFrom
      AND date_created <= $dateTo
      AND type = $orgType
      GROUP BY DAY(date_created)
      ) main
      ON days.day = main.day;`,
      { 
        bind: {
          orgType: orgType,
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countOrgsLast365Days: function(dateFrom, dateTo, orgType = 1) {
    return db.sequelize.query(
      `SELECT months.month, IFNULL(main.count, 0) as count
      FROM (
      SELECT 'Jan' AS month
      UNION SELECT 'Feb' AS month
      UNION SELECT 'Mar' AS month
      UNION SELECT 'Apr' AS month
      UNION SELECT 'May' AS month
      UNION SELECT 'Jun' AS month
      UNION SELECT 'Jul' AS month
      UNION SELECT 'Aug' AS month
      UNION SELECT 'Sep' AS month
      UNION SELECT 'Oct' AS month
      UNION SELECT 'Nov' AS month
      UNION SELECT 'Dec' AS month
      ) months
      LEFT JOIN
      (
      SELECT COUNT(*) AS count, DATE_FORMAT(date_created, '%b') AS month
      FROM tbl_organizations
      WHERE date_created >= $dateFrom
      AND date_created <= $dateTo
      AND type = $orgType
      GROUP BY MONTH(date_created)
      ) main
      ON months.month = main.month;`,
      { 
        bind: {
          orgType: orgType,
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countSmartUsersToday: function(dateFrom, dateTo) {
    return db.sequelize.query(
      `SELECT hours.hour, IFNULL(main.count, 0) as count, main.os_type
      FROM (
      SELECT 00 AS hour
      UNION SELECT 01 AS hour
      UNION SELECT 02 AS hour
      UNION SELECT 03 AS hour
      UNION SELECT 04 AS hour
      UNION SELECT 05 AS hour
      UNION SELECT 06 AS hour
      UNION SELECT 07 AS hour
      UNION SELECT 08 AS hour
      UNION SELECT 09 AS hour
      UNION SELECT 10 AS hour
      UNION SELECT 11 AS hour
      UNION SELECT 12 AS hour
      UNION SELECT 13 AS hour
      UNION SELECT 14 AS hour
      UNION SELECT 15 AS hour
      UNION SELECT 16 AS hour
      UNION SELECT 17 AS hour
      UNION SELECT 18 AS hour
      UNION SELECT 19 AS hour
      UNION SELECT 20 AS hour
      UNION SELECT 21 AS hour
      UNION SELECT 22 AS hour
      UNION SELECT 23 AS hour
      ) hours
      LEFT JOIN
      (
      SELECT COUNT(*) AS count, HOUR(date_registered) AS hour, os_type
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      AND os_type IS NOT NULL
      AND (mobile_number LIKE '0907%'
        OR mobile_number LIKE '0908%'
        OR mobile_number LIKE '0909%'
        OR mobile_number LIKE '0910%'
        OR mobile_number LIKE '0912%'
        OR mobile_number LIKE '0918%'
        OR mobile_number LIKE '0919%'
        OR mobile_number LIKE '0920%'
        OR mobile_number LIKE '0921%'
        OR mobile_number LIKE '0928%'
        OR mobile_number LIKE '0929%'
        OR mobile_number LIKE '0930%'
        OR mobile_number LIKE '0938%'
        OR mobile_number LIKE '0939%'
        OR mobile_number LIKE '0989%'
        OR mobile_number LIKE '0999%'
        OR mobile_number LIKE '0949%'
        OR mobile_number LIKE '0946%'
        OR mobile_number LIKE '0813%'
        OR mobile_number LIKE '0947%'
        OR mobile_number LIKE '0948%'
        OR mobile_number LIKE '0998%'
        OR mobile_number LIKE '0900%'
        OR mobile_number LIKE '0931%'
        OR mobile_number LIKE '0940%'
        OR mobile_number LIKE '0971%'
        OR mobile_number LIKE '0980%'
        OR mobile_number LIKE '0911%'
        OR mobile_number LIKE '0913%'
        OR mobile_number LIKE '0914%'
        OR mobile_number LIKE '0951%'
        OR mobile_number LIKE '0970%'
        OR mobile_number LIKE '0981%'
        OR mobile_number LIKE '0992%'
        OR mobile_number LIKE '0907%')
      GROUP BY HOUR(date_registered), os_type
      ) main
      ON hours.hour = main.hour;`,
      { 
        bind: {
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countSmartUsersLast7Days: function(targetDays, dateFrom, dateTo) {
    return db.sequelize.query(
      `SELECT days.day, IFNULL(main.count, 0) as count, main.os_type
      FROM (
      SELECT $one AS day
      UNION SELECT $two AS day
      UNION SELECT $three AS day
      UNION SELECT $four AS day
      UNION SELECT $five AS day
      UNION SELECT $six AS day
      UNION SELECT $seven AS day
      ) days
      LEFT JOIN (
      SELECT COUNT(*) as count, DAY(date_registered) as day, os_type
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      AND os_type IS NOT NULL
      AND (mobile_number LIKE '0907%'
        OR mobile_number LIKE '0908%'
        OR mobile_number LIKE '0909%'
        OR mobile_number LIKE '0910%'
        OR mobile_number LIKE '0912%'
        OR mobile_number LIKE '0918%'
        OR mobile_number LIKE '0919%'
        OR mobile_number LIKE '0920%'
        OR mobile_number LIKE '0921%'
        OR mobile_number LIKE '0928%'
        OR mobile_number LIKE '0929%'
        OR mobile_number LIKE '0930%'
        OR mobile_number LIKE '0938%'
        OR mobile_number LIKE '0939%'
        OR mobile_number LIKE '0989%'
        OR mobile_number LIKE '0999%'
        OR mobile_number LIKE '0949%'
        OR mobile_number LIKE '0946%'
        OR mobile_number LIKE '0813%'
        OR mobile_number LIKE '0947%'
        OR mobile_number LIKE '0948%'
        OR mobile_number LIKE '0998%'
        OR mobile_number LIKE '0900%'
        OR mobile_number LIKE '0931%'
        OR mobile_number LIKE '0940%'
        OR mobile_number LIKE '0971%'
        OR mobile_number LIKE '0980%'
        OR mobile_number LIKE '0911%'
        OR mobile_number LIKE '0913%'
        OR mobile_number LIKE '0914%'
        OR mobile_number LIKE '0951%'
        OR mobile_number LIKE '0970%'
        OR mobile_number LIKE '0981%'
        OR mobile_number LIKE '0992%'
        OR mobile_number LIKE '0907%')
      GROUP BY DAY(date_registered), os_type
      ) main
      ON days.day = main.day;`,
      { 
        bind: {
          one: targetDays[0],
          two: targetDays[1],
          three: targetDays[2],
          four: targetDays[3],
          five: targetDays[4],
          six: targetDays[5],
          seven: targetDays[6],
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countSmartUsersLast30Days: function(targetDays, dateFrom, dateTo) {

    var sqlDays = '';
    for(var i = 0; i < targetDays.length; i++) {
      if(i === 0) {
        sqlDays += 'SELECT ' + targetDays[i] + ' AS day ';
      }else {
        sqlDays += 'UNION SELECT ' + targetDays[i] + ' AS day ';
      }
    }

    return db.sequelize.query(
      `SELECT days.day, IFNULL(main.count, 0) as count, main.os_type
      FROM (
        ${sqlDays}
      ) days
      LEFT JOIN (
      SELECT COUNT(*) as count, DAY(date_registered) as day, os_type
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      AND os_type IS NOT NULL
      AND (mobile_number LIKE '0907%'
        OR mobile_number LIKE '0908%'
        OR mobile_number LIKE '0909%'
        OR mobile_number LIKE '0910%'
        OR mobile_number LIKE '0912%'
        OR mobile_number LIKE '0918%'
        OR mobile_number LIKE '0919%'
        OR mobile_number LIKE '0920%'
        OR mobile_number LIKE '0921%'
        OR mobile_number LIKE '0928%'
        OR mobile_number LIKE '0929%'
        OR mobile_number LIKE '0930%'
        OR mobile_number LIKE '0938%'
        OR mobile_number LIKE '0939%'
        OR mobile_number LIKE '0989%'
        OR mobile_number LIKE '0999%'
        OR mobile_number LIKE '0949%'
        OR mobile_number LIKE '0946%'
        OR mobile_number LIKE '0813%'
        OR mobile_number LIKE '0947%'
        OR mobile_number LIKE '0948%'
        OR mobile_number LIKE '0998%'
        OR mobile_number LIKE '0900%'
        OR mobile_number LIKE '0931%'
        OR mobile_number LIKE '0940%'
        OR mobile_number LIKE '0971%'
        OR mobile_number LIKE '0980%'
        OR mobile_number LIKE '0911%'
        OR mobile_number LIKE '0913%'
        OR mobile_number LIKE '0914%'
        OR mobile_number LIKE '0951%'
        OR mobile_number LIKE '0970%'
        OR mobile_number LIKE '0981%'
        OR mobile_number LIKE '0992%'
        OR mobile_number LIKE '0907%')
      GROUP BY DAY(date_registered), os_type
      ) main
      ON days.day = main.day;`,
      { 
        bind: {
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countSmartUsersLast365Days: function(dateFrom, dateTo) {
    return db.sequelize.query(
      `SELECT months.month, IFNULL(main.count, 0) as count, main.os_type
      FROM (
      SELECT 'Jan' AS month
      UNION SELECT 'Feb' AS month
      UNION SELECT 'Mar' AS month
      UNION SELECT 'Apr' AS month
      UNION SELECT 'May' AS month
      UNION SELECT 'Jun' AS month
      UNION SELECT 'Jul' AS month
      UNION SELECT 'Aug' AS month
      UNION SELECT 'Sep' AS month
      UNION SELECT 'Oct' AS month
      UNION SELECT 'Nov' AS month
      UNION SELECT 'Dec' AS month
      ) months
      LEFT JOIN
      (
      SELECT COUNT(*) AS count, DATE_FORMAT(date_registered, '%b') AS month, os_type
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      AND os_type IS NOT NULL
      AND (mobile_number LIKE '0907%'
        OR mobile_number LIKE '0908%'
        OR mobile_number LIKE '0909%'
        OR mobile_number LIKE '0910%'
        OR mobile_number LIKE '0912%'
        OR mobile_number LIKE '0918%'
        OR mobile_number LIKE '0919%'
        OR mobile_number LIKE '0920%'
        OR mobile_number LIKE '0921%'
        OR mobile_number LIKE '0928%'
        OR mobile_number LIKE '0929%'
        OR mobile_number LIKE '0930%'
        OR mobile_number LIKE '0938%'
        OR mobile_number LIKE '0939%'
        OR mobile_number LIKE '0989%'
        OR mobile_number LIKE '0999%'
        OR mobile_number LIKE '0949%'
        OR mobile_number LIKE '0946%'
        OR mobile_number LIKE '0813%'
        OR mobile_number LIKE '0947%'
        OR mobile_number LIKE '0948%'
        OR mobile_number LIKE '0998%'
        OR mobile_number LIKE '0900%'
        OR mobile_number LIKE '0931%'
        OR mobile_number LIKE '0940%'
        OR mobile_number LIKE '0971%'
        OR mobile_number LIKE '0980%'
        OR mobile_number LIKE '0911%'
        OR mobile_number LIKE '0913%'
        OR mobile_number LIKE '0914%'
        OR mobile_number LIKE '0951%'
        OR mobile_number LIKE '0970%'
        OR mobile_number LIKE '0981%'
        OR mobile_number LIKE '0992%'
        OR mobile_number LIKE '0907%')
      GROUP BY MONTH(date_registered), os_type
      ) main
      ON months.month = main.month;`,
      { 
        bind: {
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countGlobeUsersToday: function(dateFrom, dateTo) {
    return db.sequelize.query(
      `SELECT hours.hour, IFNULL(main.count, 0) as count, main.os_type
      FROM (
      SELECT 00 AS hour
      UNION SELECT 01 AS hour
      UNION SELECT 02 AS hour
      UNION SELECT 03 AS hour
      UNION SELECT 04 AS hour
      UNION SELECT 05 AS hour
      UNION SELECT 06 AS hour
      UNION SELECT 07 AS hour
      UNION SELECT 08 AS hour
      UNION SELECT 09 AS hour
      UNION SELECT 10 AS hour
      UNION SELECT 11 AS hour
      UNION SELECT 12 AS hour
      UNION SELECT 13 AS hour
      UNION SELECT 14 AS hour
      UNION SELECT 15 AS hour
      UNION SELECT 16 AS hour
      UNION SELECT 17 AS hour
      UNION SELECT 18 AS hour
      UNION SELECT 19 AS hour
      UNION SELECT 20 AS hour
      UNION SELECT 21 AS hour
      UNION SELECT 22 AS hour
      UNION SELECT 23 AS hour
      ) hours
      LEFT JOIN
      (
      SELECT COUNT(*) AS count, HOUR(date_registered) AS hour, os_type
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      AND os_type IS NOT NULL
      AND (mobile_number LIKE '0905%' 
        OR mobile_number LIKE '0906%'
        OR mobile_number LIKE '0915%'
        OR mobile_number LIKE '0916%'
        OR mobile_number LIKE '0917%'
        OR mobile_number LIKE '0926%'
        OR mobile_number LIKE '0927%'
        OR mobile_number LIKE '0935%'
        OR mobile_number LIKE '0936%'
        OR mobile_number LIKE '0817%'
        OR mobile_number LIKE '0994%'
        OR mobile_number LIKE '0997%'
        OR mobile_number LIKE '0995%'
        OR mobile_number LIKE '0945%'
        OR mobile_number LIKE '0975%'
        OR mobile_number LIKE '0955%'
        OR mobile_number LIKE '0956%'
        OR mobile_number LIKE '0965%'
        OR mobile_number LIKE '0976%')
      GROUP BY HOUR(date_registered), os_type
      ) main
      ON hours.hour = main.hour;`,
      { 
        bind: {
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countGlobeUsersLast7Days: function(targetDays, dateFrom, dateTo) {
    return db.sequelize.query(
      `SELECT days.day, IFNULL(main.count, 0) as count, main.os_type
      FROM (
      SELECT $one AS day
      UNION SELECT $two AS day
      UNION SELECT $three AS day
      UNION SELECT $four AS day
      UNION SELECT $five AS day
      UNION SELECT $six AS day
      UNION SELECT $seven AS day
      ) days
      LEFT JOIN (
      SELECT COUNT(*) as count, DAY(date_registered) as day, os_type
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      AND os_type IS NOT NULL
      AND (mobile_number LIKE '0905%' 
        OR mobile_number LIKE '0906%'
        OR mobile_number LIKE '0915%'
        OR mobile_number LIKE '0916%'
        OR mobile_number LIKE '0917%'
        OR mobile_number LIKE '0926%'
        OR mobile_number LIKE '0927%'
        OR mobile_number LIKE '0935%'
        OR mobile_number LIKE '0936%'
        OR mobile_number LIKE '0817%'
        OR mobile_number LIKE '0994%'
        OR mobile_number LIKE '0997%'
        OR mobile_number LIKE '0995%'
        OR mobile_number LIKE '0945%'
        OR mobile_number LIKE '0975%'
        OR mobile_number LIKE '0955%'
        OR mobile_number LIKE '0956%'
        OR mobile_number LIKE '0965%'
        OR mobile_number LIKE '0976%')
      GROUP BY DAY(date_registered), os_type
      ) main
      ON days.day = main.day;`,
      { 
        bind: {
          one: targetDays[0],
          two: targetDays[1],
          three: targetDays[2],
          four: targetDays[3],
          five: targetDays[4],
          six: targetDays[5],
          seven: targetDays[6],
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countGlobeUsersLast30Days: function(targetDays, dateFrom, dateTo) {

    var sqlDays = '';
    for(var i = 0; i < targetDays.length; i++) {
      if(i === 0) {
        sqlDays += 'SELECT ' + targetDays[i] + ' AS day ';
      }else {
        sqlDays += 'UNION SELECT ' + targetDays[i] + ' AS day ';
      }
    }

    return db.sequelize.query(
      `SELECT days.day, IFNULL(main.count, 0) as count, main.os_type
      FROM (
        ${sqlDays}
      ) days
      LEFT JOIN (
      SELECT COUNT(*) as count, DAY(date_registered) as day, os_type
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      AND os_type IS NOT NULL
      AND (mobile_number LIKE '0905%' 
        OR mobile_number LIKE '0906%'
        OR mobile_number LIKE '0915%'
        OR mobile_number LIKE '0916%'
        OR mobile_number LIKE '0917%'
        OR mobile_number LIKE '0926%'
        OR mobile_number LIKE '0927%'
        OR mobile_number LIKE '0935%'
        OR mobile_number LIKE '0936%'
        OR mobile_number LIKE '0817%'
        OR mobile_number LIKE '0994%'
        OR mobile_number LIKE '0997%'
        OR mobile_number LIKE '0995%'
        OR mobile_number LIKE '0945%'
        OR mobile_number LIKE '0975%'
        OR mobile_number LIKE '0955%'
        OR mobile_number LIKE '0956%'
        OR mobile_number LIKE '0965%'
        OR mobile_number LIKE '0976%')
      GROUP BY DAY(date_registered), os_type
      ) main
      ON days.day = main.day;`,
      { 
        bind: {
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countGlobeUsersLast365Days: function(dateFrom, dateTo) {
    return db.sequelize.query(
      `SELECT months.month, IFNULL(main.count, 0) as count, main.os_type
      FROM (
      SELECT 'Jan' AS month
      UNION SELECT 'Feb' AS month
      UNION SELECT 'Mar' AS month
      UNION SELECT 'Apr' AS month
      UNION SELECT 'May' AS month
      UNION SELECT 'Jun' AS month
      UNION SELECT 'Jul' AS month
      UNION SELECT 'Aug' AS month
      UNION SELECT 'Sep' AS month
      UNION SELECT 'Oct' AS month
      UNION SELECT 'Nov' AS month
      UNION SELECT 'Dec' AS month
      ) months
      LEFT JOIN
      (
      SELECT COUNT(*) AS count, DATE_FORMAT(date_registered, '%b') AS month, os_type
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      AND os_type IS NOT NULL
      AND (mobile_number LIKE '0905%' 
        OR mobile_number LIKE '0906%'
        OR mobile_number LIKE '0915%'
        OR mobile_number LIKE '0916%'
        OR mobile_number LIKE '0917%'
        OR mobile_number LIKE '0926%'
        OR mobile_number LIKE '0927%'
        OR mobile_number LIKE '0935%'
        OR mobile_number LIKE '0936%'
        OR mobile_number LIKE '0817%'
        OR mobile_number LIKE '0994%'
        OR mobile_number LIKE '0997%'
        OR mobile_number LIKE '0995%'
        OR mobile_number LIKE '0945%'
        OR mobile_number LIKE '0975%'
        OR mobile_number LIKE '0955%'
        OR mobile_number LIKE '0956%'
        OR mobile_number LIKE '0965%'
        OR mobile_number LIKE '0976%')
      GROUP BY MONTH(date_registered), os_type
      ) main
      ON months.month = main.month;`,
      { 
        bind: {
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countSunUsersToday: function(dateFrom, dateTo) {
    return db.sequelize.query(
      `SELECT hours.hour, IFNULL(main.count, 0) as count, main.os_type
      FROM (
      SELECT 00 AS hour
      UNION SELECT 01 AS hour
      UNION SELECT 02 AS hour
      UNION SELECT 03 AS hour
      UNION SELECT 04 AS hour
      UNION SELECT 05 AS hour
      UNION SELECT 06 AS hour
      UNION SELECT 07 AS hour
      UNION SELECT 08 AS hour
      UNION SELECT 09 AS hour
      UNION SELECT 10 AS hour
      UNION SELECT 11 AS hour
      UNION SELECT 12 AS hour
      UNION SELECT 13 AS hour
      UNION SELECT 14 AS hour
      UNION SELECT 15 AS hour
      UNION SELECT 16 AS hour
      UNION SELECT 17 AS hour
      UNION SELECT 18 AS hour
      UNION SELECT 19 AS hour
      UNION SELECT 20 AS hour
      UNION SELECT 21 AS hour
      UNION SELECT 22 AS hour
      UNION SELECT 23 AS hour
      ) hours
      LEFT JOIN
      (
      SELECT COUNT(*) AS count, HOUR(date_registered) AS hour, os_type
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      AND os_type IS NOT NULL
      AND (mobile_number LIKE '0922%'
        OR mobile_number LIKE '0923%'
        OR mobile_number LIKE '0932%'
        OR mobile_number LIKE '0933%'
        OR mobile_number LIKE '0934%'
        OR mobile_number LIKE '0942%'
        OR mobile_number LIKE '0943%'
        OR mobile_number LIKE '0925%'
        OR mobile_number LIKE '0944%'
        OR mobile_number LIKE '0924%'
        OR mobile_number LIKE '0941%')
      GROUP BY HOUR(date_registered), os_type
      ) main
      ON hours.hour = main.hour;`,
      { 
        bind: {
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countSunUsersLast7Days: function(targetDays, dateFrom, dateTo) {
    return db.sequelize.query(
      `SELECT days.day, IFNULL(main.count, 0) as count, main.os_type
      FROM (
      SELECT $one AS day
      UNION SELECT $two AS day
      UNION SELECT $three AS day
      UNION SELECT $four AS day
      UNION SELECT $five AS day
      UNION SELECT $six AS day
      UNION SELECT $seven AS day
      ) days
      LEFT JOIN (
      SELECT COUNT(*) as count, DAY(date_registered) as day, os_type
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      AND os_type IS NOT NULL
      AND (mobile_number LIKE '0922%'
        OR mobile_number LIKE '0923%'
        OR mobile_number LIKE '0932%'
        OR mobile_number LIKE '0933%'
        OR mobile_number LIKE '0934%'
        OR mobile_number LIKE '0942%'
        OR mobile_number LIKE '0943%'
        OR mobile_number LIKE '0925%'
        OR mobile_number LIKE '0944%'
        OR mobile_number LIKE '0924%'
        OR mobile_number LIKE '0941%')
      GROUP BY DAY(date_registered), os_type
      ) main
      ON days.day = main.day;`,
      { 
        bind: {
          one: targetDays[0],
          two: targetDays[1],
          three: targetDays[2],
          four: targetDays[3],
          five: targetDays[4],
          six: targetDays[5],
          seven: targetDays[6],
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countSunUsersLast30Days: function(targetDays, dateFrom, dateTo) {

    var sqlDays = '';
    for(var i = 0; i < targetDays.length; i++) {
      if(i === 0) {
        sqlDays += 'SELECT ' + targetDays[i] + ' AS day ';
      }else {
        sqlDays += 'UNION SELECT ' + targetDays[i] + ' AS day ';
      }
    }

    return db.sequelize.query(
      `SELECT days.day, IFNULL(main.count, 0) as count, main.os_type
      FROM (
        ${sqlDays}
      ) days
      LEFT JOIN (
      SELECT COUNT(*) as count, DAY(date_registered) as day, os_type
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      AND os_type IS NOT NULL
      AND (mobile_number LIKE '0922%'
        OR mobile_number LIKE '0923%'
        OR mobile_number LIKE '0932%'
        OR mobile_number LIKE '0933%'
        OR mobile_number LIKE '0934%'
        OR mobile_number LIKE '0942%'
        OR mobile_number LIKE '0943%'
        OR mobile_number LIKE '0925%'
        OR mobile_number LIKE '0944%'
        OR mobile_number LIKE '0924%'
        OR mobile_number LIKE '0941%')
      GROUP BY DAY(date_registered), os_type
      ) main
      ON days.day = main.day;`,
      { 
        bind: {
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  countSunUsersLast365Days: function(dateFrom, dateTo) {
    return db.sequelize.query(
      `SELECT months.month, IFNULL(main.count, 0) as count, main.os_type
      FROM (
      SELECT 'Jan' AS month
      UNION SELECT 'Feb' AS month
      UNION SELECT 'Mar' AS month
      UNION SELECT 'Apr' AS month
      UNION SELECT 'May' AS month
      UNION SELECT 'Jun' AS month
      UNION SELECT 'Jul' AS month
      UNION SELECT 'Aug' AS month
      UNION SELECT 'Sep' AS month
      UNION SELECT 'Oct' AS month
      UNION SELECT 'Nov' AS month
      UNION SELECT 'Dec' AS month
      ) months
      LEFT JOIN
      (
      SELECT COUNT(*) AS count, DATE_FORMAT(date_registered, '%b') AS month, os_type
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      AND os_type IS NOT NULL
      AND (mobile_number LIKE '0922%'
        OR mobile_number LIKE '0923%'
        OR mobile_number LIKE '0932%'
        OR mobile_number LIKE '0933%'
        OR mobile_number LIKE '0934%'
        OR mobile_number LIKE '0942%'
        OR mobile_number LIKE '0943%'
        OR mobile_number LIKE '0925%'
        OR mobile_number LIKE '0944%'
        OR mobile_number LIKE '0924%'
        OR mobile_number LIKE '0941%')
      GROUP BY MONTH(date_registered), os_type
      ) main
      ON months.month = main.month;`,
      { 
        bind: {
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

};