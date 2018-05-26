"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const jwt = require("jsonwebtoken");
const user_1 = require("../models/user");
const ldap = require("../utils/ldap");
exports.ldapLogin = async (ctx) => {
    const { username, password } = ctx.request.body;
    const isValid = await ldap.ldapQuery(username, password);
    let user = await user_1.default.findOne({ username });
    if (!user || !user._id) {
        user = new user_1.default({
            username,
            password,
        });
        user = await user.save();
    }
    const res = user.toObject();
    delete res.password;
    ctx.cookies.set('token', jwt.sign(res, config.get('jwt.secret')), {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: false,
    });
    ctx.body = { code: 0, data: res };
};
exports.getUser = async (ctx) => {
    ctx.body = { code: 0, data: ctx.state.user };
};
exports.register = async (ctx) => {
    ctx.body = 'register';
};
exports.getPin = async (ctx) => {
    ctx.body = 'getPin';
};
exports.login = async (ctx) => {
    ctx.body = 'login';
};
exports.resetPassword = async (ctx) => {
    ctx.body = 'resetPassword';
};
exports.logout = async (ctx) => {
    ctx.body = 'logout';
};
//# sourceMappingURL=user.js.map