var mongoose = require('mongoose')
      ,Schema = mongoose.Schema;
require('mongoose-query-paginate');
var User = require('../models/user');
var t = require('../models/topic'),
    Topic = t.Topic,
    Comment = t.Comment;
var Pager = require('../libs/pager');

module.exports.controller = function(app) {
    app.get('/topics', function(req, res) {
        res.redirect(301, '/topics/new');
    });
    app.get('/topics/new', function(req, res) {
        var query = Topic.find({}).populate('author thumb').sort('-created_at');
        var page = req.query.page||1;
        query.paginate({perPage: 20, delta: 3, page: page}, function(err, result) {
            res.render('topics/list',{ pageTitle: '最新文章', menu:['news'], topics: result.results, pager:Pager.GetPager('?page={}', result), error:err });
        });
    });

    app.get('/topics/hot', function(req, res) {
        var query = Topic.find({}).populate('author thumb').sort('-comment_at');
        var page = req.query.page||1;
        query.paginate({perPage: 20, delta: 3, page: page}, function(err, result) {
            res.render('topics/list',{ pageTitle: '热门文章', menu:['hots'], topics: result.results, pager:Pager.GetPager('?page={}', result), error:err });
        });
    });

    app.get('/topics/add', User.NeedLoginGET, function(req, res) {
        res.render('topics/add',{ pageTitle: '发表新文章', menu:['add']});
    });
  
    app.post('/topics', User.NeedLoginPOST, function(req, res) {
        var topic = new Topic({title:req.body.title, tags:req.body.tags.length>0?req.body.tags.split(','):null, content:req.body.content, thumb:req.body.thumb.length>0?req.body.thumb:null, author:req.user.id});
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
            res.redirect('/404');
        }else{
            Topic.findById(id).populate('author').exec(function (err, topic) {
                if (err || topic==null) {
                    res.redirect('/404');
                }else{
                    topic.viewCount++;
                    topic.save();
                    Comment.find({'topic':topic.id}, function(err, comments) {
                        res.render('topics/topic',{ pageTitle: topic.title, pageTips:topic.summary, menu:['news'], topic: topic, comments:comments });
                    });
                }
            });
        }
    });

    app.get('/topic/edit/:id', User.NeedLoginGET, function(req, res) {
        var id = req.params.id;
        if(id==null || id.length==0){
            res.redirect('/404');
        }else{
            Topic.findById(id).populate('thumb').exec(function (err, topic) {
                if (err || topic==null) {
                    res.redirect('/404');
                }else{
                    if (topic.author!=req.user.id) {
                        res.redirect('/403');
                    }else{
                        res.render('topics/edit',{ pageTitle: '修改文章', topic: topic  });
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
                    var comment = new Comment({content:req.body.content,topic:topic.id});
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