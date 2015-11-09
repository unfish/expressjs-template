var mongoose = require('mongoose');
require('mongoose-query-paginate');
var User = require('../../models/user');
var t = require('../../models/topic'),
    Topic = t.Topic,
    Comment = t.Comment;

module.exports.controller = function(app) {

    app.get('/admin/topics', User.NeedAdminGET, function(req, res) {
        res.render('admin/topics/list',{ pageTitle: '文章列表', pageTips:'发表文章共10000条，昨日发表200条，今日发表100条', menu:['topics','topiclist'], page:req.query.page||1});
    });

    app.post('/admin/topics/delete/:id', User.NeedAdminPOST, function(req, res) {
        var id = req.params.id;
        if(id==null || id.length==0){
            res.send({success:false,data:{error:'参数错误'}});
        }else{
            Topic.findByIdAndRemove(id,function (err, topic) {
                if (err || topic==null) {
                    res.send({success:false,data:{error:'文章不存在'}});
                }else{
                    if (topic.thumb) {
                        File.DeleteById(topic.thumb);
                    }
                    res.send({success:true,data:topic.id});
                }
            });
        }
    });

}
