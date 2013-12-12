var mongoose = require('mongoose')
var User = require('../models/user');

module.exports.controller = function(app) {
    app.get('/admin/users', User.NeedAdminGET, function(req, res) {
        User.find(function (err, users) {
            if (err) {
                res.render('admin/userlist',{ title: 'Users List', error: err.message });
            }
            else{
                res.render('admin/userlist',{ title: 'Users List', users: users });
            }
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
