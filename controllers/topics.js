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
    
    app.get('/topics/add', User.ValidateCookieGET);
    app.get('/topics/add', function(req, res) {
        res.render('topics/add',{ title: 'Add Topic'});
    });
  
    app.post('/topics', User.ValidateCookiePOST);
    app.post('/topics', function(req, res) {
        var title = req.param('title');
        var tags = req.param('tags');
        var content = req.param('content');
        var data = {};
        if(title.length==0){
            data.title = '请输入文章标题';
        }
        if(tags.length==0){
            data.tags = '请输入文章的关键字';
        }
        if(content.length==0){
            data.content = '请输入文章内容';
        }
        if(Object.keys(data).length>0){
            res.send({success:false,data:data});
        }else{
            var topic = new Topic({title:title, tags:tags.split(','), content:content, author:req.user.id});
            topic.save(function (err) {
                if (err){
                    data.error = '保存出错，'+err.message;
                    res.send({success:false,data:data});
                }else{
                    res.send({success:true,data:topic.id});
                }
            });
        }
    });

//    app.get('/topic/:id', User.ValidateCookieGET);
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

    app.get('/topic/edit/:id', User.ValidateCookieGET);
    app.get('/topic/edit/:id', function(req, res) {
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
    
    app.post('/topic/(.+)', User.ValidateCookiePOST);
    app.post('/topic/delete/:id', function(req, res) {
        var id = req.params.id;
        var data = {};
        if(id==null || id.length==0){
            data.error = '参数错误';
            res.send({success:false,data:data});
        }else{
            Topic.findByIdAndRemove(id,function (err, topic) {
                if (err || topic==null) {
                    data.error = '文章不存在';
                    res.send({success:false,data:data});
                }else{
                    res.send({success:true,data:topic.id});
                }
            });
        }
    });

    app.post('/topic/:id', function(req, res) {
        var id = req.params.id;
        if(id==null || id.length==0){
            res.send({success:false,data:{error:'参数错误'}});
        }else{
            Topic.findById(id).populate('author').exec(function (err, topic) {
                if (err || topic==null) {
                    res.send({success:false,data:{error:'文章不存在'}});
                }else{
                    var title = req.param('title');
                    var tags = req.param('tags');
                    var content = req.param('content');
                    var data = {};
                    if(title.length==0){
                        data.title = '请输入文章标题';
                    }
                    if(tags.length==0){
                        data.tags = '请输入文章的关键字';
                    }
                    if(content.length==0){
                        data.content = '请输入文章内容';
                    }
                    if(Object.keys(data).length>0){
                        res.send({success:false,data:data});
                    }else{
                        topic.title=title;
                        topic.tags=tags.split(',');
                        topic.content=content
                        topic.save(function (err) {
                            if (err){
                                data.error = '保存出错，'+err.message;
                                res.send({success:false,data:data});
                            }else{
                                res.send({success:true,data:topic.id});
                            }
                        });
                    }
                }
            });
        }
    });

}