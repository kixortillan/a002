var db = require('../../models');

module.exports = {

  totalAppInstalls: function() {
    return db.sequelize.query(
      `SELECT COUNT(*) as total
      FROM tbl_mobile_users 
      WHERE has_installed = 1;`
    );
  },

  firstTimeAppLaunch: function() {
    return db.sequelize.query('');
  },

  registeredMembers: function(dateFrom, dateTo) {
    return db.sequelize.query(
      `SELECT COUNT(*) AS total
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo;`,
      { 
        bind: {
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  totalFamilyCircleAndCircleOfTrust: function(dateFrom, dateTo) {
    return db.sequelize.query(
      `SELECT COUNT(*) AS total, is_family
      FROM tbl_circles
      WHERE date_created >= $dateFrom
      AND date_created <= $dateTo
      GROUP BY is_family;`,
      { 
        bind: {
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  totalOrgsAndCommunities: function(dateFrom, dateTo) {
    return db.sequelize.query(
      `SELECT COUNT(*) AS total, type
      FROM tbl_organizations
      WHERE date_created >= $dateFrom
      AND date_created <= $dateTo
      GROUP BY type;`,
      {
        bind: {
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

  totalUsersPerTelco: function(dateFrom, dateTo) {
    return db.sequelize.query(
      `SELECT COUNT(*) AS total, 
      CASE 
        WHEN (mobile_number LIKE '0905%' 
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
        OR mobile_number LIKE '0976%') THEN 'GLOBE'
        WHEN (mobile_number LIKE '0907%'
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
        OR mobile_number LIKE '0907%') THEN 'SMART'
        WHEN (mobile_number LIKE '0922%'
        OR mobile_number LIKE '0923%'
        OR mobile_number LIKE '0932%'
        OR mobile_number LIKE '0933%'
        OR mobile_number LIKE '0934%'
        OR mobile_number LIKE '0942%'
        OR mobile_number LIKE '0943%'
        OR mobile_number LIKE '0925%'
        OR mobile_number LIKE '0944%'
        OR mobile_number LIKE '0924%'
        OR mobile_number LIKE '0941%') THEN 'SUN'
        ELSE 'OTHERS' 
      END AS telco
      FROM tbl_mobile_users
      WHERE date_registered >= $dateFrom
      AND date_registered <= $dateTo
      GROUP BY telco;`,
      { 
        bind: {
          dateFrom: dateFrom,
          dateTo: dateTo,
        }, 
        type: db.sequelize.QueryTypes.SELECT
      });
  },

};