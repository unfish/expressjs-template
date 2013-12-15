var EventProxy = require('eventproxy');
var User = require('../../models/user');
var t = require('../../models/topic'),
    Topic = t.Topic,
    Comment = t.Comment;

module.exports.controller = function(app) {
    app.get('/admin', User.NeedAdminGET, function(req, res) {
        var ep = EventProxy.create("topicCount", "userCount", function (topicCount, userCount) {
            res.render('admin/index',{ pageTitle: '管理中心', pageTips: '欢迎登录'+app.locals.Site.Title+'管理中心', userCount: userCount, topicCount:topicCount });
        });
        User.count({},function (err, count) {
            ep.emit('userCount', count);
        });
        Topic.count({},function (err, count) {
            ep.emit('topicCount', count);
        });
    });
}
