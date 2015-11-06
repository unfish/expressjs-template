var User = require('../models/user');

module.exports.controller = function(app) {
    app.get('/topics', function(req, res) {
        res.redirect(301, '/topics/new');
    });
    app.get('/topics/new', function(req, res) {
        res.render('topics/list',{ pageTitle: '最新文章', menu:['news'], type:'new', page:req.query.page||1 });
    });

    app.get('/topics/hot', function(req, res) {
        res.render('topics/list',{ pageTitle: '热门文章', menu:['hots'], type:'hot', page:req.query.page||1 });
    });

    app.get('/topics/add', User.NeedLoginGET, function(req, res) {
        res.render('topics/add',{ pageTitle: '发表新文章', menu:['add']});
    });
  
    app.get('/topic/:id', function(req, res) {
        res.render('topics/topic',{ pageTitle: '文章页面', id:req.params.id });
    });

    app.get('/topic/edit/:id', User.NeedLoginGET, function(req, res) {
        res.render('topics/edit',{ pageTitle: '修改文章', id:req.params.id });
    });
    
}