var mongoose = require('mongoose')
      ,Schema = mongoose.Schema
      ,bcrypt = require('bcrypt');
      
userSchema = new Schema( {
    email: String,
    mobile: String,
    username: String,
    password: String,
    salt: String,
    isAdmin: Boolean,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}),
userSchema.methods.HashPassword = function (cb) {
    this.salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, this.salt);
    if(cb) cb(null, this);
}
userSchema.statics.HashPassword = function (pass, salt, cb) {
    if (salt==null) {
        salt = bcrypt.genSaltSync(10);
    }
    pass = bcrypt.hashSync(pass, salt);
    if(cb) cb(null, pass, salt);
}
userSchema.methods.GenCookie = function (cb) {
    var salt = bcrypt.genSaltSync(10);
    var pass = bcrypt.hashSync(this.id+"u$JeOIrBkuXotD5P", salt);
    if(cb) cb(null, this.id+'|'+salt+'|'+pass);
}
userSchema.statics.ValidateCookieGET = function (req, res, next) {
    if (req.cookies.loginCookie) {
        var str = req.cookies.loginCookie.split('|');
        var uid = str[0];
        var salt = str[1];
        var pass = bcrypt.hashSync(uid+"u$JeOIrBkuXotD5P", salt);
        if (pass==str[2]) {
            User.findById(uid, function(err, user) {
                if(err){
                    res.clearCookie('loginCookie');
                    res.redirect('/login');
                }else{
                    req.user = user;
                    next();
                }
            });
        }else{
            res.clearCookie('loginCookie');
            res.redirect('/login');
        }
    }else{
        res.redirect('/login');
    }
}
userSchema.statics.ValidateCookiePOST = function (req, res, next) {
    if (req.cookies.loginCookie) {
        var str = req.cookies.loginCookie.split('|');
        var uid = str[0];
        var salt = str[1];
        var pass = bcrypt.hashSync(uid+"u$JeOIrBkuXotD5P", salt);
        if (pass==str[2]) {
            User.findById(uid, function(err, user) {
                if(err){
                    res.clearCookie('loginCookie');
                    res.send({success:false,data:{error:'您需要登录后才能执行该操作'}});
                }else{
                    req.user = user;
                    next();
                }
            });
        }else{
            res.clearCookie('loginCookie');
            res.send({success:false,data:{error:'您需要登录后才能执行该操作'}});
        }
    }else{
        res.send({success:false,data:{error:'您需要登录后才能执行该操作'}});
    }
}

User = mongoose.model('User', userSchema);

module.exports = User;