require('mongoose-query-paginate');
var User = require('../models/user');
var t = require('../models/topic'),
    Topic = t.Topic,
    Comment = t.Comment;
var File = require('../models/file');
var Pager = require('../libs/pager');

module.exports.controller = function(app) {
  app.get('/', function(req, res) {
        var query = Topic.find({}).populate('author thumb').sort('-created_at');
        var page = req.query.page||1;
        query.paginate({perPage: 20, delta: 3, page: page}, function(err, result) {
            res.render('index',{ bannerTitle: '今日热点', pageTips:'<a href="#">玉兔号月球车成功驶上月面 六轮着地留下印迹</a>', topics: result.results, pager:Pager.GetPager('?page={}', result), error:err });
        });
  });

  app.get('/404', function(req, res) {
      res.status(404).render('other/404', { bannerTitle: 'Oops! 页面没有找到' });
  });

  app.get('/403', function(req, res) {
      res.status(403).render('other/403', { bannerTitle: 'Oops! 您没有权限打开该页面', });
  });

  app.post('/file', User.NeedLoginPOST, File.UploadFile);
  app.get('/file/ueditor', User.NeedLoginGET, function(req, res) {
      res.send(req.param('fetch')?'updateSavePath(["默认路径"])':'');
  });
  app.post('/file/ueditor', User.NeedLoginPOST, File.UEditorUploadFile);
  app.post('/file/ueditor/fetch', User.NeedLoginPOST, function(req, res) {
      res.send('');
  });
  app.get('/file/:id/:filename', File.GetFile);
}