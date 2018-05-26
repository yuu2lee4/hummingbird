import fly from 'flyio';
import Cookies from 'js-cookie';

export default {
    install(Vue: any){
        fly.interceptors.request.use((config: any, promise: any) => {
            if (config.needLogin && !Cookies.get('token')) {
                Vue.toast('需要登录', { className: 'et-warn' });
                promise.reject();
                window.$store.state.account = null;
            }
            return config;
        });

        fly.interceptors.response.use((response) => {
            const code = response.data.code * 1;
            // 特定错误码的统一处理
            if (code === 0) {
                return response.data.data;
            }
            if (code === 401) {
                window.$store.state.account = null;
            }
            const msg = response.data.msg;
            // 统一提示接口业务错误
            if (msg) Vue.toast(msg, { className: 'et-warn' });
            const err = new Error(msg);
            err.name = code.toString();
            return Promise.reject(err);
        }, (error) => {
            // 统一提示接口业务错误
            if (error.message) Vue.toast(error.message, { className: 'et-alert' });
            return Promise.reject(error);
        });

        (window as any).$api = Vue.$api = Vue.prototype.$api =  new Proxy({}, {
            get(target, prop) {
                const action = prop.toString();
                const res = /^[a-z]+/.exec(action) || ['get'];
                const method = res[0];
                const path = '/' + action
                        .substring(method.length)
                        .replace(/([a-z])([A-Z])/g, '$1/$2')
                        .replace(/\$/g, '/$/')
                        .toLowerCase();
                return (...args: any[]) => { // <------ 返回动态构造的函数！
                    const url = path.replace(/\$/g, () => args.shift());
                    const data = args.shift() || {};
                    const options = args.shift() || {};
                    return (fly as any)[method](`/api${url}`, data, options);
                }
            }
        });
        /*
            api.get()
            // GET /

            api.getUsers()
            // 获取所有用户
            // GET /users

            api.getUsers$Books(42)
            // 获取 ID 为 42 的用户的所有书籍
            // GET /users/42/books

            api.getUsers$Books(42, { page: 2 } )
            // 获取 ID 为 42 的用户的所有书籍的第二页
            // GET /users/42/books?page=2

            api.postUsers( { name: '小明' }, {
                method:"post",
                timeout:5000 //超时设置为5s
            })
            // 创建名字为 小明 的用户
            // POST /users Payload { name: '小明' } options { method:"post", timeout:5000 //超时设置为5s}
        */
    },
};
