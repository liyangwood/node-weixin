var express = require('express');
var router = express.Router();

var sogou = require('../lib/sogou/main');

router.get('/', async function(req, res, next){

    var sb = new sogou.WeixinPublicArticle('');
    var txt = await sb.searchName('一页情书');

    var data = {
        title: '国内要闻',
        time: (new Date).toString(),
        list: [
            {
                id: '1',
                name: JSON.stringify(txt)
            },
            {
                id: '2',
                name: '李四'
            }
        ]
    };


    //渲染模板
    res.render('index', data);
});

router.get('/weixin/:name', async function(req, res, next){
    var name = req.params.name;
    var sb = new sogou.WeixinPublicArticle('');
    var txt = await sb.searchName(name);

    res.render('index', {
        list : txt
    });
});

router.get('/weixin/openid/:id', async function(req, res, next){
    var id = req.params.id;
    var sb = new sogou.WeixinPublicArticle(id);
    console.log(id);
    var list = await sb.getArticleListById(id);
    res.render('list', {
        list : list
    });
});


module.exports = router;