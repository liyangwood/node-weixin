//global
require('../kpg/main');

var sogou = require('../lib/sogou/main');
var NewNumber = sogou.NewNumber;
var Article = sogou.Article;

var sb = new sogou.WeixinPublicArticle('');

var F = {
    init : async function(){
        (async function(){
            var list = await NewNumber.getAllSync();
            console.log(list);
            if(list.length < 1){
                process.exit();
            }

            var rs = [];
            //_.each(list, async function(item){
            var item = list[0];
            console.log(item.openid, item.ext);

            F.eachOne(item.openid, item.ext);

        })();


    },
    eachOne : async function(openid, ext){
        var rs = await sb.getArticleListById(openid);

        var self = this;
        try{
            _.each(rs, async function(item){
                var ext = await Article.findByDocid(item.docid);
                console.log(ext);
                if(!ext){
                    var tmp = await Article.insertSync(item);

                    console.log(tmp);
                }
            });


        }catch(e){
            console.error(e);
        }


    }
};

module.exports = F;