var mongoose = require('mongoose')
var User = require('../models/user');
var Topic = require('../models/topic');

module.exports.controller = function(app) {
    app.get('/topics', function(req, res) {
        Topic.find(function (err, topics) {
            if (err) {
                res.render('topics/list',{ title: 'Topics List', error: err.message });
            }
            else{
                res.render('topics/list',{ title: 'Topics List', topics: topics });
            }
        });
    });
    
    app.get('/topics/add', User.NeedLoginGET, function(req, res) {
        res.render('topics/add',{ title: 'Add Topic'});
    });
  
    app.post('/topics', User.NeedLoginPOST, function(req, res) {
        var topic = new Topic({title:req.param('title'), tags:req.param('tags').length>0?req.param('tags').split(','):null, content:req.param('content'), author:req.user.id});
        topic.save(function (err) {
            if (err){
                res.send({success:false,data:err.errors});
            }else{
                res.send({success:true,data:topic.id});
            }
        });
    });

    app.get('/topic/:id', function(req, res) {
        var id = req.params.id;
        if(id==null || id.length==0){
            res.render('topics/topic',{ title: '文章页面', error: '参数错误' });
        }else{
            Topic.findById(id).populate('author').exec(function (err, topic) {
                if (err || topic==null) {
                    res.render('topics/topic',{ title: '文章不存在', error: err.message });
                }else{
                    res.render('topics/topic',{ title: topic.title, topic: topic });
                }
            });
        }
    });

    app.get('/topic/edit/:id', User.NeedLoginGET, function(req, res) {
        var id = req.params.id;
        if(id==null || id.length==0){
            res.render('topics/topic',{ title: '文章页面', error: '参数错误' });
        }else{
            Topic.findById(id).exec(function (err, topic) {
                if (err || topic==null) {
                    res.render('topics/topic',{ title: '文章不存在', error: err.message });
                }else{
                    if (topic.author!=req.user.id) {
                        res.render('topics/topic',{ title: '权限错误', error: '您只能修改自己的文章' });
                    }else{
                        res.render('topics/edit',{ title: 'Edit Topic', topic: topic  });
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
                    topic.save(function (err) {
                        if (err){
                            res.send({success:false,data:err.errors});
                        }else{
                            res.send({success:true,data:topic.id});
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
                    res.send({success:true,data:topic.id});
                }
            });
        }
    });

}