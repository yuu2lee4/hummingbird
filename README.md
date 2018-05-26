涉及到技术或者框架：nodejs、koa2、mongodb、typescript、vue

项目运行指南：  
1、安装node，typescript、ts-node  
1、安装并运行mongodb，初始化数据库（见后面）  
2、vscode打开server，写好配置（见后面），安装依赖  
3、cmd+shit+B(mac)watch模式  
4、打开调试模式运行服务器  
5、vscode打开client，安装依赖并运行(yarn serve)

## 初始化数据库：
建立一个名为hummingbird的数据库，并在categories的集合里插入数据 `{name: '前端', en: 'frontEnd'}`，这里插入的数据跟前端的home页面里的分类是对应的，照理来说应该写个脚本来初始化一下

## server配置
需要在config/default.json和build/config/default.json里配置: 
```javascript
{
    "server": {
        "url": "http://localhost:8080"
    },
    "db": {
        "url": "localhost",
        "name": "hummingbird"
    },
    "ldap": {
        "server": "ldap://ldapservice.domain.com",
        "baseDn": "CN=Admin,CN=Users,DC=test,DC=com",
        "bindPassword": "password123",
        "searchDn": "OU=UserContainer,DC=test,DC=com",
        "searchStandard": "mail"
    },
    "jwt": {
        "secret": "hummingbird jwt"
    }
}
```
本系统只支持ldap登录，针对`ldap`字段进行说明：
- `server` LDAP 服务器地址，前面需要加上 ldap:// 前缀，也可以是 - ldaps:// 表示是通过 SSL 连接;
- `baseDn` LDAP 服务器的登录用户名，必须是从根结点到用户节点的全路径;
- `bindPassword` 登录该 LDAP 服务器的密码;
- `searchDn` 查询用户数据的路径，类似数据库中的一张表的地址，注意这里也必须是全路径;
- `searchStandard` 查询条件，这里是 mail 表示查询用户信息是通过邮箱信息来查询的。注意，该字段信息与LDAP数据库存储数据的字段相对应，如果如果存储用户邮箱信息的字段是 email, 这里就需要修改成 email.

build/config/default.json照理来说是应该编译的时候自动生成的

## 其它说明
这个项目是我第一次用typescript，很多地方并没有严格规定类型

## 展示

![1](https://raw.githubusercontent.com/yuu2lee4/hummingbird/master/static/1.png)

![2](https://raw.githubusercontent.com/yuu2lee4/hummingbird/master/static/2.png)

![3](https://raw.githubusercontent.com/yuu2lee4/hummingbird/master/static/3.png)