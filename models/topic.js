var mongoose = require('mongoose')
      ,Schema = mongoose.Schema
var request = require("request");
var User = require('./user');
      
topicSchema = new Schema( {
    title: {type:String,required:[true,"请输入文章的标题"]},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true, index: true },
    content: {type:String,required:[true,'请输入文章的内容']},
    tags: {type:[String], index: true },
    thumb: { type: mongoose.Schema.Types.ObjectId, ref: 'File'},
    viewCount: {type:Number, default:0},
    commentCount: {type:Number, default:0},
    summary: String,
    source: String,
    pattern: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    comment_at: { type: Date, default: new Date(2000,1,1) }
});

//抓取网页，options可以是一个URL字符串，也可以是一个完整的选项字典，其中可以自定义http头部
//使用方法参照：https://github.com/mikeal/request
topicSchema.statics.Download = function (options, callback) {
    if (typeof(options) === 'string') {
        options = {url: options};
    }
    if (!options.hasOwnProperty('timeout')) {
        options.timeout = 5000;
    }
    request(options, function (err, resp, body) {
        callback(err, resp, body);
    });
};
//检查页面是否已存在，不存在就创建新的并保存，否则报错
//options包含Topic的字段，source和pattern是必填项，其它可选
topicSchema.statics.CreateTopic = function (options, callback) {
    Topic.findOne({source:options.source}, function(err, topic) {
        if (err || topic==null) {
            User.findOne({email:'admin@nodejs.org'}, function (err, user) {
                options.author = user.id;
                var art = new Topic(options);
                callback(err, art);
            });
        }else{
            callback(err, topic);
        }
    });
};

Topic = mongoose.model('Topic', topicSchema);

commentSchema = new Schema( {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic',required: true, index: true },
    content: {type:String,required:[true,'请输入评论的内容']},
    created_at: { type: Date, default: Date.now },
});

Comment = mongoose.model('Comment', commentSchema);

module.exports.Topic = Topic;
module.exports.Comment = Comment;