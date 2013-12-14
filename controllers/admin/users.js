var mongoose = require('mongoose');
require('mongoose-query-paginate');
var EventProxy = require('eventproxy');
var User = require('../../models/user');
var Pager = require('../../libs/pager');

module.exports.controller = function(app) {

    app.get('/admin/users', User.NeedAdminGET, function(req, res) {
        var query = User.find({}).sort('-created_on');
        var page = req.query.page||1;
        query.paginate({perPage: 20, delta: 3, page: page}, function(err, result) {
            res.render('admin/users/list',{ pageTitle: '用户列表', pageTips:'注册用户共10000人，昨日注册200人，今日注册100人', users: result.results, pager:Pager.GetPager('?page={}', result), error:err });
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
