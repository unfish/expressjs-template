var mongoose = require('mongoose')
var User = require('../models/user');

module.exports.controller = function(app) {

    app.get('/register', function(req, res) {
        res.render('users/register',{ title: 'Register' });
    });
  
    app.post('/register', function(req, res) {
        var user = new User({email:req.param('email'), mobile:req.param('mobile'), username:req.param('username'), password:req.param('password')});
        user.validate(function(err) {
            if (err) {
                res.send({success:false,data:err.errors});
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
        res.render('users/login',{ title: 'Login'});
    });
    
    app.post('/login', function(req, res) {
        var name = req.param('email');
        var pass = req.param('password');
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
                            user.updated_at = new Date();
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

    app.get('/users', User.NeedLoginGET, function(req, res) {
        User.find(function (err, users) {
            if (err) {
                res.render('users/list',{ title: 'Users List', error: err.message });
            }
            else{
                res.render('users/list',{ title: 'Users List', users: users });
            }
        });
    });
    
    app.post('/user/delete/:id', User.NeedLoginPOST, function(req, res) {
        var id = req.params.id;
        if(id==null || id.length==0){
            res.send({success:false,data:{error:'参数错误'}});
        }else if(id==req.user.id){
            res.send({success:false,data:{error:'您不能删除自己的账号'}});
        }else{
            User.findByIdAndRemove(id,function (err, user) {
                if (err || user==null) {
                    res.send({success:false,data:{error:'用户不存在'}});
                }else{
                    res.send({success:true,data:user.id});
                }
            });
        }
    });
}