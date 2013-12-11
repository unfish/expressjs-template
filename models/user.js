var mongoose = require('mongoose')
      ,Schema = mongoose.Schema
      ,bcrypt = require('bcrypt');

userSchema = new Schema( {
    email: {type:String,trim:true,lowercase:true,required:[true,"请输入您的邮箱"],validate:[buildUniqueValidator('email'),'这个邮箱已经注册过了，忘记了密码？']},
    mobile: {type:String,trim:true,required:[true,'请输入您的手机'],match:[/^(1\d{10})?$/,'请输入正确的手机'],validate:[buildUniqueValidator('mobile'),'这个手机已经注册过了，忘记了密码？']},
    username: {type:String,required:[true,'请输入您的姓名']},
    password: {type:String,required:[true,'请输入登录密码']},
    salt: String,
    isAdmin: {type:Boolean,default:false},
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

userSchema.statics.ValidateCookie = function (req, res, next) {
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
                    req.user = user;
                }
                next();
            });
        }else{
            res.clearCookie('loginCookie');
            next();
        }
    }else{
        next();
    }
}
userSchema.statics.NeedLoginGET = function (req, res, next) {
    if (req.user) {
        next();
    }else{
        res.redirect('/login');
    }
}
userSchema.statics.NeedLoginPOST = function (req, res, next) {
    if (req.user) {
        next();
    }else{
        res.send({success:false,data:{error:'您需要登录后才能执行该操作'}});
    }
}

User = mongoose.model('User', userSchema);

module.exports = User;

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
    var target = {};
    target[field] = value;
    query.$and.push({ _id: { $ne: id } });
    query.$and.push(target);
    return query;
}

function buildValidationCallback(respond) {
    return function (err, document) {
        respond(!document);
    };
}
