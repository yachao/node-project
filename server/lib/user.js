var mongoose = require('mongoose'),
	config = require('./../config.json'),
	header = require('./../util/header');

var SERVER_URL = config.BASE_URL;
var collectionName = 'user';

module.exports = {
	//用户注册
	register: function(req, res){
		res.send('register');
	},
	//用户登录
	login: function(req, res){
		res.send('login');
	}
};