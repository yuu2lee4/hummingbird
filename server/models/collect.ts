import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const CollectSchema = new Schema({
    post: {type: ObjectId, ref: 'Post', require: true},
    user: {type: ObjectId, ref: 'User', require: true},
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
         updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

CollectSchema.pre('save', function(next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now()
    }else{
        this.meta.updateAt = Date.now()
    }
    next();
})

CollectSchema.statics = {
    fetch(cb) {
        return this
        .find({})
        .sort('meta.updateAt')
        .exec(cb)
    }
}

export default mongoose.model('Collect',CollectSchema);
