var EventProxy = require('eventproxy');
var User = require('../../models/user');
var Topic = require('../../models/topic');

module.exports.controller = function(app) {
    app.get('/admin', User.NeedAdminGET, function(req, res) {
        var ep = EventProxy.create("topicCount", "userCount", function (topicCount, userCount) {
            res.render('admin/index',{ pageTitle: '管理中心', pageTips: '欢迎登录管理后台，上次登录时间：<span class="timeSpan">'+req.user.lastlogin_at+'</span>，上次登录IP：'+req.user.lastlogin_ip, userCount: userCount, topicCount:topicCount });
        });
        User.count({},function (err, count) {
            ep.emit('userCount', count);
        });
        Topic.count({},function (err, count) {
            ep.emit('topicCount', count);
        });
    });
}
