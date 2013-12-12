var User = require('../models/user');
var File = require('../models/file');

module.exports.controller = function(app) {
  app.get('/', function(req, res) {
      res.render('index', { title: 'Express', user:req.user });
  });

  app.get('/404', function(req, res) {
      res.render('other/404', { title: 'Express' });
  });

  app.get('/403', function(req, res) {
      res.render('other/403', { title: 'Express', });
  });

  app.post('/file', User.NeedLoginPOST, File.UploadFile);
  app.get('/file/:id', File.DownloadFile);
}
