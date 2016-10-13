/**
 * router模块提供路由转发。
 * @module router
 */
var user = require('./user');
var verify = require('./verify');

/*
* 服务路由
* 可供第三方访问，部分接口需使用鉴权
*/
module.exports = function(app){
	//用户模块
    //用户注册
    app.post('/user/register', user.register);
    //用户登录后创建更新token
    app.post('/user/login', user.login);
    //生成验证码
    app.get('/verify/create', verify.create);
    //校验验证码
    app.get('/verify/check', verify.check);
};