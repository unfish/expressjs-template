var User = require('../models/user');
var File = require('../models/file');

module.exports.controller = function(app) {
  app.get('/', function(req, res) {
      res.render('index', { pageTitle: 'Express', user:req.user });
  });

  app.get('/404', function(req, res) {
      res.render('other/404', { pageTitle: 'Express' });
  });

  app.get('/403', function(req, res) {
      res.render('other/403', { pageTitle: 'Express', });
  });

  app.post('/file', User.NeedLoginPOST, File.UploadFile);
  app.get('/file/ueditor', User.NeedLoginGET, function(req, res) {
      res.send(request.params('fetch')?'updateSavePath(["默认路径"])':'');
  });
  app.post('/file/ueditor', User.NeedLoginPOST, File.UEditorUploadFile);
  app.post('/file/ueditor/fetch', User.NeedLoginPOST, function(req, res) {
      res.send('');
  });
  app.get('/file/:id', File.DownloadFile);
}