import * as config from 'config';
import * as jwt from'jsonwebtoken';
import User from '../models/user';
import * as ldap from '../utils/ldap';
import { Document } from 'mongoose';

export const ldapLogin = async ctx=>{
    const { username, password } = ctx.request.body;
    const isValid = await ldap.ldapQuery(username, password);

    let user:Document = await User.findOne({username});

    if (!user || !user._id) {
        user = new User({
            username,
            password,
        });
        user = await user.save();
    }
    const res = user.toObject();
    delete res.password;

    ctx.cookies.set(
        'token',
        jwt.sign(res, config.get('jwt.secret')),
        {
          maxAge: 24 * 60 * 60 * 1000, // cookie有效时长
          httpOnly: false,  // 是否只用于http请求中获取
        }
    );
    ctx.body = { code: 0, data: res };
}

export const getUser = async ctx=>{
    ctx.body = { code:0, data: ctx.state.user };
}

export const register = async ctx=>{
    ctx.body = 'register';
}

export const getPin = async ctx=>{
    ctx.body = 'getPin';
}

export const login = async ctx=>{
    ctx.body = 'login';
}

export const resetPassword = async ctx=>{
    ctx.body = 'resetPassword';
}

export const logout = async ctx=>{
    ctx.body = 'logout';
}