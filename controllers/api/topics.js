var mongoose = require('mongoose')
      ,Schema = mongoose.Schema;
require('mongoose-query-paginate');
var User = require('../../models/user');
var t = require('../../models/topic'),
    Topic = t.Topic,
    Comment = t.Comment;
var Pager = require('../../libs/pager');
var Sync = require('syncho');
var api = require('../../libs/apihelper');

module.exports.controller = function(app) {
	//获取最新文章列表
    app.get('/api/topics', function (req, res) {
    	Sync(function () {
    		try{
    			var sort = req.query.type==='hot'?'-comment_at':'-created_at';
    			var query = Topic.find({}).populate('author thumb').sort(sort);
    			var page = req.query.page||1;
    			var result = query.paginate.sync(query, {perPage: 20, delta: 3, page: page});
    			res.json(api.Resp(result));
    		}catch (error) {
    			res.json(api.Resp(null,error));
    		}
    	});
    });

    app.post('/api/topics', User.NeedLoginPOST, function(req, res) {
        var topic = new Topic({title:req.body.title, tags:req.body.tags.length>0?req.body.tags.split(','):null, content:req.body.content, thumb:req.body.thumb.length>0?req.body.thumb:null, author:req.user.id});
        topic.save(function (err) {
            if (err){
                res.json(api.Resp(null,err));
            }else{
            	res.json(api.Resp(topic.id));
            }
        });
    });

    app.get('/api/topic/:id', function(req, res) {
           Sync(function() {
	           try{
	           	   var query = Topic.findById(req.params.id).populate('author thumb');
	               var topic = query.exec.sync(query);
	               topic.viewCount++;
	               topic.save();
	               var comments = Comment.find.sync(Comment, {'topic':topic.id});
	               res.json(api.Resp({topic: topic, comments:comments }));
	           }catch (error) {
	           	   res.json(api.Resp(null,error));
	           }
           });
    });

    app.put('/api/topic/:id', User.NeedLoginPOST, function(req, res) {
    	Sync(function () {
    		try{
    			var topic = Topic.findById.sync(Topic, req.params.id);
    			if(topic.author!=req.user.id){
    				res.json(api.Resp(null,'权限错误')).status(403);
    			}
    			topic.title=req.body.title;
    			topic.tags=req.body.tags.length>0?req.body.tags.split(','):null;
    			topic.content=req.body.content;
    			topic.thumb=req.body.thumb;
    			topic.save.sync();
    			res.json(api.Resp(topic.id));
    		}catch (error) {
    			res.json(api.Resp(null,error));
    		}
    	});
    });

    app.del('/api/topic/:id', User.NeedLoginPOST, function(req, res) {
        var id = req.params.id;
        if(id==null || id.length==0){
            res.json(api.Resp(null,'参数错误'));
        }else{
            Topic.findByIdAndRemove(id,function (err, topic) {
                if (err || topic==null) {
                    res.json(api.Resp(null,'文章不存在'));
                }else{
                    if (topic.thumb) {
                        File.DeleteById(topic.thumb);
                    }
                    res.json(api.Resp(topic.id));
                }
            });
        }
    });

    app.post('/api/topic/:id/comments', function(req, res) {
        var id = req.params.id;
        if(id==null || id.length==0){
            res.json(api.Resp(null,'参数错误'));
        }else{
            Topic.findById(id, function (err, topic) {
                if (err || topic==null) {
                    res.json(api.Resp(null,'文章不存在'));
                }else{
                    var comment = new Comment({content:req.body.content,topic:topic.id});
                    comment.author=req.user?req.user.id:null;
                    comment.save(function (err) {
                        if (err){
                            res.json(api.Resp(null,err));
                        }else{
                            topic.commentCount++;
                            topic.comment_at = new Date();
                            topic.save();
                            res.json(api.Resp(comment));
                        }
                    });
                }
            });
        }
    });

    app.del('/api/topic/:id/comment/:cid', User.NeedLoginPOST, function(req, res) {
        var id = req.params.cid;
        if(id==null || id.length==0){
            res.json(api.Resp(null,'参数错误'));
        }else{
            Comment.findByIdAndRemove(id,function (err, com) {
                if (err || com==null) {
                    res.json(api.Resp(null,'文章不存在'));
                }else{
                    Topic.findById(com.topic, function (err, topic) {
                        topic.commentCount--;
                        topic.save();
                    });
                    res.json(api.Resp(com.id));
                }
            });
        }
    });

}