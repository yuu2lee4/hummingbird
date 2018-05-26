"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const CommentSchema = new Schema({
    post: { type: ObjectId, ref: 'Post', require: true },
    from: { type: ObjectId, ref: 'User', require: true },
    to: { type: ObjectId, ref: 'User', require: true },
    comment: { type: ObjectId, ref: 'Comment' },
    content: { type: String, require: true },
    isRead: { type: Boolean, default: false },
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
});
CommentSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else {
        this.meta.updateAt = Date.now();
    }
    next();
});
CommentSchema.statics = {
    fetch(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    }
};
exports.default = mongoose.model('Comment', CommentSchema);
//# sourceMappingURL=comment.js.map