var User = require('../../models/user');
var t = require('../../models/topic'),
    Topic = t.Topic,
    Comment = t.Comment;
var Sync = require('syncho');
var api = require('../../libs/apihelper');

module.exports.controller = function(app) {
    app.get('/admin', User.NeedAdminGET, function(req, res) {
        Sync(function () {
            var uc = User.count.sync(User,{});
            var tc = Topic.count.sync(Topic,{});
            res.render('admin/index',{ pageTitle: '管理中心', pageTips: '欢迎登录'+app.locals.Site.Title+'管理中心', userCount: uc, topicCount:tc });
        });
    });
}
