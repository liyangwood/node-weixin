var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    var data = {
        title: '国内要闻',
        time: (new Date).toString(),
        list: [
            {
                id: '1',
                name: '张三'
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


module.exports = router;