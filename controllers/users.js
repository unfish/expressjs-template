var User = require('../models/user');

module.exports.controller = function(app) {

    app.get('/register', function(req, res) {
        res.render('users/register',{ pageTitle: '注册新用户',pageTips:'您需要输入完整的手机和邮箱，才能使用网站提供的完整功能',menu:['register'] });
    });
  
    app.get('/login', function(req, res) {
        res.render('users/login',{ pageTitle: '用户登录', menu:['login']});
    });
    
    
    app.get('/logout', function(req, res) {
        res.clearCookie('loginCookie');
        res.redirect('/');
    });

    app.get('/user', User.NeedLoginGET, function(req, res) {
        res.render('users/edit',{ pageTitle: '个人资料', pageTips:'如果不想修改密码，留空就可以。手机和邮箱您都可以输入多个，用英文逗号分隔即可',menu:['user']});
    });
    
}