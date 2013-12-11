var mongoose = require('mongoose')
      ,Schema = mongoose.Schema
      
topicSchema = new Schema( {
    title: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content: String,
    tags: [String],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}),

Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;