var User = require('../models/user');

module.exports.controller = function(app) {

    app.get('/register', function(req, res) {
        res.render('users/register',{ pageTitle: '注册新用户',pageTips:'您需要输入完整的手机和邮箱，才能使用网站提供的完整功能',menu:['register'] });
    });
  
    app.post('/register', function(req, res) {
        var user = new User({email:[], mobile:[], username:req.body.username, password:req.body.password, lastlogin_ip:req.ip});
        user.email.push(req.body.email);
        user.mobile.push(req.body.mobile);
        user.validate(function(err) {
            if (err) {
                res.send({success:false,data:err});
            }else{
                user.HashPassword();
                user.save(function (err) {
                    if (err){
                        res.send({success:false,data:{error:'保存出错，'+err.message}});
                    }else{
                        res.send({success:true,data:user.id});
                    }
                });
            }
        });
    });

    app.get('/login', function(req, res) {
        res.render('users/login',{ pageTitle: '用户登录', menu:['login']});
    });
    
    app.post('/login', function(req, res) {
        var name = req.body.email;
        var pass = req.body.password;
        var data = {};
        if(name.length==0||name.length>20){
            data.email = '请输入您的邮箱或手机';
        }
        if(pass.length==0){
            data.password = '请输入登录密码';
        }
        if(Object.keys(data).length>0){
            res.send({success:false,data:data});
        }else{
            User.findOne({$or:[{email:name},{mobile:name}]}).sort('-created_at').exec(function (err, user) {
                if (err || user==null) {
                    data.email = '账号不存在';
                    res.send({success:false,data:data});
                }else{
                    User.HashPassword(pass, user.salt, function(err, pass, salt) {
                        if (pass!=user.password) {
                            data.password = '密码错误';
                            res.send({success:false,data:data});
                        }else{
                            user.lastlogin_at = new Date();
                            user.lastlogin_ip=req.ip;
                            user.save(function (err) {
                                if (err){
                                    data.error = '保存出错，'+err.message;
                                    res.send({success:false,data:data});
                                }else{
                                    user.GenCookie(function(err, cookie) {
                                        res.cookie('loginCookie', cookie, { maxAge: 1000*60*60*24*30 });
                                        res.send({success:true,data:user.id});
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
    
    app.get('/logout', function(req, res) {
        res.clearCookie('loginCookie');
        res.redirect('/');
    });

    app.get('/user', User.NeedLoginGET, function(req, res) {
        res.render('users/edit',{ pageTitle: '个人资料', pageTips:'如果不想修改密码，留空就可以。手机和邮箱您都可以输入多个，用英文逗号分隔即可',menu:['user']});
    });
    
    app.post('/user/edit', User.NeedLoginPOST, function(req, res) {
        var user = req.user;
        user.username=req.body.username;
        user.email = req.body.email.split(',');
        user.mobile = req.body.mobile.split(',');
        if (req.body.password && req.body.password.length>0) {
            user.password = req.body.password;
            user.HashPassword();
        }
        user.save(function (err) {
            if (err){
                res.send({success:false,data:err});
            }else{
                res.send({success:true,data:user.id});
            }
        });
    });

}