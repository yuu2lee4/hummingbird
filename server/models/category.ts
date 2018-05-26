import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        require: true,
    },
    en: {
        type: String,
        unique: true,
        require: true,
    },
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

categorySchema.pre('save', function(next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})

categorySchema.statics = {
    fetch(cb) {
        return this
        .find({})
        .sort('meta.updateAt')
        .exec(cb)
    }
}

export default mongoose.model('Category',categorySchema);
