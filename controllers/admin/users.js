var mongoose = require('mongoose');
require('mongoose-query-paginate');
var User = require('../../models/user');

module.exports.controller = function(app) {

    app.get('/admin/users', User.NeedAdminGET, function(req, res) {
        res.render('admin/users/list',{ pageTitle: '用户列表', pageTips:'注册用户共10000人，昨日注册200人，今日注册100人', menu:['users','userlist'], page:req.query.page||1 });
    });

}
