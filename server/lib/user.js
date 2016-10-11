var mongoose = require('mongoose'),
	xss = require('xss'),
	mcrypto = require('./../util/mcrypto'),
	guid = require('./../util/guid'),
	header = require('./../util/header'),
	config = require('./../config.json'),
	USER_TYPE = require('./user_type');

var Schema = mongoose.Schema;
var SERVER_URL = config.BASE_URL;
var collectionName = 'users';
//Schema：一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
var UserSchema = new Schema({
    userid: String,
    token: String,
    email: String,
    password: String,
    time: {type: Date, default: Date.now},
    tag: String,
    nickname: String,
    realname: String,
    avatar: String,
    address: String,
    job: String,
    tel: String,
    hometown: String,
    sign: String,
    hometown_lnglat: String,
    address_lnglat: String
});
//Model：由Schema发布生成的模型，具有抽象属性和行为的数据库操作对
var UserModel = mongoose.model(collectionName, UserSchema);

module.exports = {
	//用户注册
	register: function(req, res){
		header.set(req, res);
        var params = req.query;
        if (params.password && params.password !== params.repeatPassword)
            return res.send({status: 0});
        if (!params.email)
            return res.send({status: 0});
        //Entity：由Model创建的实体，他的操作也会影响数据库
        //构建用户模型；加密等关键信息上线后会有不同算法修改
        var userEntity = new UserModel({
            userid: guid.create() + '-' + mcrypto.md5Password(params.email).toUpperCase(),
            token: guid.create(),
            email: xss(params.email),
            password: mcrypto.md5Password(params.password),
            time: new Date(),
            tag: USER_TYPE.GUEST,
            nickname: '',
            realname: '',
            avatar: SERVER_URL + 'zhu.png',
            address: '',
            job: '',
            tel: '',
            hometown: '',
            sign: '',
            hometown_lnglat: '',
            address_lnglat: ''
        });
        userEntity.save(function(err){
            if (!err){
                return res.send({
                	status: 1
                });
            }else{
                return res.send({
                    status: 0
                });
            }
        });
	},
	//用户登录
	login: function(req, res){
		header.set(req, res);
        var params = req.query,
            email = params.email,
            password = mcrypto.md5Password(params.password),
            query = {
                email: email,
                password: password
            };

        UserModel.findOne(query, function(err, item){
        	if(!err && item){
        		//更新token，每次登录后自己更新
        		var token = item['_id'] + guid.create();
        		item.token = token;
        		item.save(function(err){
        			if (!err){
		                return res.send({
		                	token: token,
		                	status: 1
		                });
		            }else{
		                return res.send({
		                    status: 0
		                });
		            }
        		});
        	}else{
                return res.send({
                    status: 0
                });
            }
        });
	}

	
};