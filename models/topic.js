var mongoose = require('mongoose')
      ,Schema = mongoose.Schema
      
topicSchema = new Schema( {
    title: {type:String,required:[true,"请输入文章的标题"]},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true, index: true },
    content: {type:String,required:[true,'请输入文章的内容']},
    tags: {type:[String],required:[true,'请输入文章的关键字'], index: true },
    thumb: { type: mongoose.Schema.Types.ObjectId, ref: 'File'},
    viewCount: {type:Number, default:0},
    commentCount: {type:Number, default:0},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    comment_at: { type: Date, default: new Date(2000,1,1) }
}),

Topic = mongoose.model('Topic', topicSchema);

commentSchema = new Schema( {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic',required: true, index: true },
    content: {type:String,required:[true,'请输入评论的内容']},
    created_at: { type: Date, default: Date.now },
}),

Comment = mongoose.model('Comment', commentSchema);

module.exports.Topic = Topic;
module.exports.Comment = Comment;