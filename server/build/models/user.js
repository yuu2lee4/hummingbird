"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const util = require("util");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        unique: true,
        require: true,
        type: String
    },
    password: {
        require: true,
        type: String
    },
    // 0: normal user
    // 1: verified user
    // 2: peofessional user
    // >10: admin
    // >50: super admin
    role: {
        type: Number,
        default: 0
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
});
UserSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else {
        this.meta.updateAt = Date.now();
    }
    if (this.notHashPassword) {
        delete this.notHashPassword;
        next();
    }
    else {
        bcrypt.genSalt(10, (err, salt) => {
            if (err)
                return next(err);
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err)
                    return next(err);
                this.password = hash;
                next();
            });
        });
    }
});
UserSchema.methods = {
    comparePassword(_password) {
        return util.promisify(bcrypt.compare)(_password, this.password);
    }
};
UserSchema.statics = {
    fetch(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    }
};
exports.default = mongoose.model('User', UserSchema);
//# sourceMappingURL=user.js.map