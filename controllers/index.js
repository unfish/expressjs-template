
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