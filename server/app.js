var express = require('express'),
	mongoose = require('mongoose'),
	log4js = require('log4js'),
	router = require('./lib/router'),
	config = require('./config.json'),
	app = express(),
	uri = 'mongodb://' + config.host + ':' + config.port + '/' + config.dbname;

app.set('port', process.env.PORT || 3000);

// Mongoose connection to MongoDB
mongoose.connect(uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('DB Connected');
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
router(app);

app.listen(app.get('port'), function(){
	console.log('API服务启动' + app.get('port'))
})