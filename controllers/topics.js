var mongoose = require('mongoose')
      ,Schema = mongoose.Schema
var User = require('../models/user');
var t = require('../models/topic'),
    Topic = t.Topic,
    Comment = t.Comment;

module.exports.controller = function(app) {
    app.get('/topics', function(req, res) {
        Topic.find({}).populate('author').sort('-created_on').exec(function (err, topics) {
            console.log(topics);
            res.render('topics/list',{ pageTitle: 'Topics List', topics: topics, error: err});
        });
    });
    
    app.get('/topics/add', User.NeedLoginGET, function(req, res) {
        res.render('topics/add',{ pageTitle: 'Add Topic'});
    });
  
    app.post('/topics', User.NeedLoginPOST, function(req, res) {
        var topic = new Topic({title:req.param('title'), tags:req.param('tags').length>0?req.param('tags').split(','):null, content:req.param('content'), thumb:req.param('thumb').length>0?req.param('thumb'):null, author:req.user.id});
        topic.save(function (err) {
            if (err){
                res.send({success:false,data:err});
            }else{
                res.send({success:true,data:topic.id});
            }
        });
    });

    app.get('/topic/:id', function(req, res) {
        var id = req.params.id;
        if(id==null || id.length==0){
            res.render('topics/topic',{ pageTitle: '文章页面', error: '参数错误' });
        }else{
            Topic.findById(id).populate('author').exec(function (err, topic) {
                if (err || topic==null) {
                    res.render('topics/topic',{ pageTitle: '文章不存在', error: err.message });
                }else{
                    topic.viewCount++;
                    topic.save();
                    Comment.find({'topic':topic.id}, function(err, comments) {
                        res.render('topics/topic',{ pageTitle: topic.title, topic: topic, comments:comments });
                    });
                }
            });
        }
    });

    app.get('/topic/edit/:id', User.NeedLoginGET, function(req, res) {
        var id = req.params.id;
        if(id==null || id.length==0){
            res.render('topics/topic',{ pageTitle: '文章页面', error: '参数错误' });
        }else{
            Topic.findById(id).exec(function (err, topic) {
                if (err || topic==null) {
                    res.render('topics/topic',{ pageTitle: '文章不存在', error: err.message });
                }else{
                    if (topic.author!=req.user.id) {
                        res.render('topics/topic',{ pageTitle: '权限错误', error: '您只能修改自己的文章' });
                    }else{
                        res.render('topics/edit',{ pageTitle: 'Edit Topic', topic: topic  });
                    }
                }
            });
        }
    });
    
    app.post('/topic/:id', User.NeedLoginPOST, function(req, res) {
        var id = req.params.id;
        if(id==null || id.length==0){
            res.send({success:false,data:{error:'参数错误'}});
        }else{
            Topic.findById(id).populate('author').exec(function (err, topic) {
                if (err || topic==null) {
                    res.send({success:false,data:{error:'文章不存在'}});
                }else{
                    topic.title=req.param('title');
                    topic.tags=req.param('tags').length>0?req.param('tags').split(','):null;
                    topic.content=req.param('content');
                    topic.thumb=req.param('thumb').length>0?req.param('thumb'):null;
                    topic.save(function (err) {
                        if (err){
                            res.send({success:false,data:err});
                        }else{
                            res.send({success:true,data:topic.id});
                        }
                    });
                }
            });
        }
    });

    app.post('/topic/comment/:id', function(req, res) {
        var id = req.params.id;
        if(id==null || id.length==0){
            res.send({success:false,data:{error:'参数错误'}});
        }else{
            Topic.findById(id, function (err, topic) {
                if (err || topic==null) {
                    res.send({success:false,data:{error:'文章不存在'}});
                }else{
                    var comment = new Comment({content:req.param('content'),topic:topic.id});
                    comment.author=req.user?req.user.id:null;
                    comment.save(function (err) {
                        if (err){
                            res.send({success:false,data:err});
                        }else{
                            topic.commentCount++;
                            topic.comment_at = new Date();
                            topic.save();
                            res.send({success:true,data:comment});
                        }
                    });
                }
            });
        }
    });

    app.post('/topic/delete/:id', User.NeedLoginPOST, function(req, res) {
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

    app.post('/topic/comment/delete/:id', User.NeedLoginPOST, function(req, res) {
        var id = req.params.id;
        if(id==null || id.length==0){
            res.send({success:false,data:{error:'参数错误'}});
        }else{
            Comment.findByIdAndRemove(id,function (err, com) {
                if (err || com==null) {
                    res.send({success:false,data:{error:'评论不存在'}});
                }else{
                    Topic.findById(com.topic, function (err, topic) {
                        topic.commentCount--;
                        topic.save();
                    });
                    res.send({success:true,data:com.id});
                }
            });
        }
    });

}