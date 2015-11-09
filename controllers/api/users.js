var mongoose = require('mongoose')
      ,Schema = mongoose.Schema;
var User = require('../../models/user');
var Sync = require('syncho');
var api = require('../../libs/apihelper');

module.exports.controller = function(app) {

    app.post('/api/user/register', function(req, res) {
        var user = new User({email:[], mobile:[], username:req.body.username, password:req.body.password, lastlogin_ip:req.ip});
        user.email.push(req.body.email);
        user.mobile.push(req.body.mobile);
        user.validate(function(err) {
            if (err) {
                res.json(api.Resp(null,err));
            }else{
                user.HashPassword();
                user.save(function (err) {
                    if (err){
                        res.json(api.Resp(null,err));
                    }else{
                        res.json(api.Resp(user.id));
                    }
                });
            }
        });
    });

    app.post('/api/user/login', function(req, res) {
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
                    res.json(api.Resp(null,data));
                }else{
                    User.HashPassword(pass, user.salt, function(err, pass, salt) {
                        if (pass!=user.password) {
                            data.password = '密码错误';
                            res.json(api.Resp(null,data));
                        }else{
                            user.lastlogin_at = new Date();
                            user.lastlogin_ip=req.ip;
                            user.save(function (err) {
                                if (err){
                                    data.error = '保存出错，'+err.message;
                                    res.json(api.Resp(null,data));
                                }else{
                                    user.GenCookie(function(err, cookie) {
                                        res.cookie('loginCookie', cookie, { maxAge: 1000*60*60*24*30 });
                                        res.json(api.Resp(user.id));
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    app.post('/api/user/edit', User.NeedLoginPOST, function(req, res) {
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
                res.json(api.Resp(null,err));
            }else{
                res.json(api.Resp(user.id));
            }
        });
    });

};