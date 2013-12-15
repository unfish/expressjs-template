var mongoose = require('mongoose')
      ,Schema = mongoose.Schema
      ,bcrypt = require('bcrypt');
var config = require('../libs/config');

var conn = mongoose.createConnection(config.DB.LogDB);
accessLogSchema = new Schema( {
    method: String,
    query: Schema.Types.Mixed,
    form: Schema.Types.Mixed,
    userid: String,
    userip: String,
    created_at: { type: Date, default: Date.now },
    originalUrl: String,
    fresh:Boolean,
    stale:Boolean,
    xhr:Boolean,
    static:Boolean,
    referer:String
});
AccessLog = conn.model('AccessLog', accessLogSchema);

userSchema = new Schema( {
    email: {type:[String],required:[true,"请输入您的邮箱"],unique:true,validate:[{validator:EmailArrayFormatValidator,msg:'请输入您的邮箱地址'},{validator:buildUniqueValidator('email'),msg:'这个邮箱已经被注册了'}]},
    mobile: {type:[String],unique:true,validate:[{validator:MobileArrayFormatValidator,msg:'请输入您的手机号'},{validator:buildUniqueValidator('mobile'),msg:'这个手机已经被注册了'}]},
    username: {type:String,required:[true,'请输入您的姓名']},
    password: {type:String,required:[true,'请输入登录密码']},
    salt: String,
    isAdmin: {type:Boolean,default:false},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    lastlogin_at: { type: Date, default: Date.now },
    lastlogin_ip: { type: String }
});

userSchema.methods.HashPassword = function (cb) {
    this.salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, this.salt);
    if(cb) cb(null, this);
};

userSchema.statics.HashPassword = function (pass, salt, cb) {
    if (salt==null) {
        salt = bcrypt.genSaltSync(10);
    }
    pass = bcrypt.hashSync(pass, salt);
    if(cb) cb(null, pass, salt);
};

userSchema.methods.GenCookie = function (cb) {
    var salt = bcrypt.genSaltSync(10);
    var pass = bcrypt.hashSync(this.id+"u$JeOIrBkuXotD5P", salt);
    if(cb) cb(null, this.id+'|'+salt+'|'+pass);
};

var staticPath = /^\/(images|javascripts|stylesheets|uploads)\//i
userSchema.statics.ValidateCookie = function (req, res, next) {
    var log = new AccessLog({
        method:req.route.method, query:req.query, form:req.body, userip:req.ip, originalUrl:req.originalUrl,fresh:req.fresh,stale:req.stale,xhr:req.xhr, referer:req.header('Referer'), userid:'', static:staticPath.test(req.originalUrl)
    });
    if (req.cookies.loginCookie) {
        var str = req.cookies.loginCookie.split('|');
        var uid = str[0];
        var salt = str[1];
        var pass = bcrypt.hashSync(uid+"u$JeOIrBkuXotD5P", salt);
        if (pass==str[2]) {
            User.findById(uid, function(err, user) {
                if(err){
                    res.clearCookie('loginCookie');
                }else{
                    log.userid = uid;
                    if(user.email.indexOf("admin@nodejs.org")>=0 && !user.isAdmin){
                        user.isAdmin = true;
                        user.save();
                    }
                    req.user = user;
                }
                log.save();
                next();
            });
        }else{
            res.clearCookie('loginCookie');
            log.save();
            next();
        }
    }else{
        log.save();
        next();
    }
};

userSchema.statics.NeedLoginGET = function (req, res, next) {
    if (req.user) {
        next();
    }else{
        res.redirect('/login');
    }
};
userSchema.statics.NeedLoginPOST = function (req, res, next) {
    if (req.user) {
        next();
    }else{
        res.send({success:false,data:{error:'您需要登录后才能执行该操作'}});
    }
};
userSchema.statics.NeedAdminGET = function (req, res, next) {
    if (req.user && req.user.isAdmin) {
        next();
    }else{
        if (req.user) res.redirect('/403');
        else res.redirect('/login');
    }
};
userSchema.statics.NeedAdminPOST = function (req, res, next) {
    if (req.user && req.user.isAdmin) {
        next();
    }else{
        if (req.user) res.send({success:false,data:{error:'您没有权限执行该操作'}});
        else  res.send({success:false,data:{error:'您需要登录后才能执行该操作'}});
    }
};

User = mongoose.model('User', userSchema);

module.exports = User;

function EmailArrayFormatValidator(value, next) {
    var result = true;
    for (var i=0;i<value.length;i++) {
        var email = value[i].replace(/(^\s*)|(\s*$)/g, "").toLowerCase();
        value[i] = email;
        var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        result = result && regex.test(email);
    }
    next(result);
}
function MobileArrayFormatValidator(value, next) {
    var result = true;
    for (var i=0;i<value.length;i++) {
        var mobile = value[i].replace(/(^\s*)|(\s*$)/g, "");
        value[i] = mobile;
        var regex = /^(1\d{10})$/;
        result = result && regex.test(mobile);
    }
    next(result);
}
function buildUniqueValidator(path) {
    return function (value, respond) {
        var model = this.model(this.constructor.modelName);
        var query = buildQuery(path, value, this._id);
        var callback = buildValidationCallback(respond);
        model.findOne(query, callback);
    };
}

function buildQuery(field, value, id) {
    var query = { $and: [] };
    query.$and.push({ _id: { $ne: id } });
    var target = {};
    if( Object.prototype.toString.call( value ) === '[object Array]' ) {
        target[field] = {$in:value};
    }else{
        target[field] = value;
    }
    query.$and.push(target);
    return query;
}

function buildValidationCallback(respond) {
    return function (err, document) {
        respond(!document);
    };
}
