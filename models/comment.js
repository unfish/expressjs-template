var mongoose = require('mongoose')
      ,Schema = mongoose.Schema
      
commentSchema = new Schema( {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic',required: true, index: true },
    content: {type:String,required:[true,'请输入评论的内容']},
    created_at: { type: Date, default: Date.now },
}),

Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;