
var config = require('./config');
var NewNumber = require('./model/NewNumber');
var Article = require('./model/Article');

var mopt = config.get('mongo');


var conn = function(){
    KG.mongoose.connect('mongodb://'+mopt.HOST+'/'+mopt.DBNAME);
    var db = KG.mongoose.connection;
    db.once('open', function(){
        console.log('mongo connect success');
    });
    return db;
};



var num = null,
    article = null;
if(!num){

    (function(){
        var db = conn();
        num = new NewNumber(db);
        article = new Article();
        console.log('----- init start ----');
    })();
}



module.exports = {
    WeixinPublicArticle : require('./weixin_public_article'),
    NewNumber : num,
    Article : article
};

//db.on('error', console.error.bind(console,'连接错误:'));
//db.once('open',function(){
//
//});

