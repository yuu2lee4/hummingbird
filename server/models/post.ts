import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const postSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    tags: [String],
    content: {
        type: String,
        require: true,
    },
    category: {
        require: true,
        type: ObjectId,
        ref: 'Category'
    },
    author: {
        require: true,
        type: ObjectId,
        ref: 'User'
    },
    attachments: [String],
    meta: {
        createAt: {
            type: Date,
            default: Date.now(),
            index: true
        },
         updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

postSchema.pre('save', function(next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})

postSchema.statics = {
    fetch(cb) {
        return this
        .find({})
        .sort('meta.updateAt')
        .exec(cb)
    }
}

export default mongoose.model('Post',postSchema);
