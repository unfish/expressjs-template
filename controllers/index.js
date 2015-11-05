require('mongoose-query-paginate');
var User = require('../models/user');
var t = require('../models/topic'),
    Topic = t.Topic,
    Comment = t.Comment;
var File = require('../models/file');
var Pager = require('../libs/pager');
var Sync = require('syncho');

module.exports.controller = function(app) {
  app.get('/', function(req, res) {
      res.redirect(301, '/topics/new');
  });

  app.get('/404', function(req, res) {
      res.status(404).render('other/404', { bannerTitle: 'Oops! 页面没有找到' });
  });

  app.get('/403', function(req, res) {
      res.status(403).render('other/403', { bannerTitle: 'Oops! 您没有权限打开该页面', });
  });

}