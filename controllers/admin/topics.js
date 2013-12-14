var mongoose = require('mongoose');
require('mongoose-query-paginate');
var EventProxy = require('eventproxy');
var User = require('../../models/user');
var t = require('../../models/topic'),
    Topic = t.Topic,
    Comment = t.Comment;
var Pager = require('../../libs/pager');

module.exports.controller = function(app) {

    app.get('/admin/topics', User.NeedAdminGET, function(req, res) {
        var query = Topic.find({}).populate('author').sort('-created_on');
        var page = req.query.page||1;
        query.paginate({perPage: 20, delta: 3, page: page}, function(err, result) {
            res.render('admin/topics/list',{ pageTitle: '文章列表', pageTips:'发表文章共10000条，昨日发表200条，今日发表100条', topics: result.results, pager:Pager.GetPager('?page={}', result), error:err });
        });
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
