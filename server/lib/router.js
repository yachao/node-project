/**
 * router模块提供路由转发。
 * @module router
 */
var user = require('./user');

/*
* 服务路由
* 可供第三方访问，部分接口需使用鉴权
*/
module.exports = function(app){
	app.get('/', function(req, res){
		res.send('hello world!');
	});

	//用户模块
    //用户注册
    app.post('/user/register', user.register);
    //用户登录后创建更新token
    app.post('/user/login', user.login);
};