var mongoose = require('mongoose')
      ,Schema = mongoose.Schema
      
topicSchema = new Schema( {
    title: {type:String,required:[true,"请输入文章的标题"]},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true, index: true },
    content: {type:String,required:[true,'请输入文章的内容']},
    tags: {type:[String],required:[true,'请输入文章的关键字'], index: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}),

Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;