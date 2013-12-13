var mongoose = require('mongoose')
var User = require('../models/user');
var EventProxy = require('eventproxy');

module.exports.controller = function(app) {
    app.get('/admin', User.NeedAdminGET, function(req, res) {
        var ep = EventProxy.create("topicCount", "userCount", function (topicCount, userCount) {
            res.render('admin/index',{ title: 'Admin Page', userCount: userCount, topicCount:topicCount });
        });
        User.count({},function (err, count) {
            ep.emit('userCount', count);
        });
        Topic.count({},function (err, count) {
            ep.emit('topicCount', count);
        });
    });

    app.get('/admin/users', User.NeedAdminGET, function(req, res) {
        User.find({},function (err, users) {
            res.render('admin/userlist',{ title: 'Users List', users: users, error:err });
        });
    });

    app.post('/admin/users/delete/:id', User.NeedAdminPOST, function(req, res) {
        var id = req.params.id;
        if(id==null || id.length==0){
            res.send({success:false,data:{error:'参数错误'}});
        }else if(id==req.user.id){
            res.send({success:false,data:{error:'您不能删除自己的账号'}});
        }else{
            User.findByIdAndRemove(id,function (err, user) {
                if (err || user==null) {
                    res.send({success:false,data:{error:'用户不存在'}});
                }else{
                    res.send({success:true,data:user.id});
                }
            });
        }
    });

}
