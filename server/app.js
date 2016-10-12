var express = require('express'),
	mongoose = require('mongoose'),
	log4js = require('log4js'),
	router = require('./lib/router'),
	config = require('./config.json'),
	app = express(),
	dbURI = 'mongodb://' + config.host + ':' + config.port + '/' + config.dbname,
	dbOptions = {'user': config.username, 'pass': config.password};

app.set('port', process.env.PORT || 3000);

// Mongoose connection to MongoDB
mongoose.connect(dbURI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// we're connected!
});
db.on('connected', function () {
	console.log('Mongoose connected to ' + dbURI);
});

//日志配置
log4js.configure({
    appenders: [{
        type: 'console'
    }, {
        type: 'file',
        filename: 'logs/access.log',
        maxLogSize: 1024,
        backups: 3,
        category: 'normal'
    }],
    replaceConsole: true
});

var logger = log4js.getLogger('normal');
logger.setLevel('INFO');
app.use(log4js.connectLogger(logger, {
    level: log4js.levels.INFO
}));

//路由
app.get('/', function(req, res){
    res.send('hello world!');
});
router(app);

app.listen(app.get('port'), function(){
	console.log('API服务启动' + app.get('port'))
})