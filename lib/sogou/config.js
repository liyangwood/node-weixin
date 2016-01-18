

var config = KG.createConfig('lib-Sogou-config');

config.add({
    cacheEnable : true,

    URL_ROOT : 'http://weixin.sogou.com',

    mongo : {
        HOST : '127.0.0.1',
        DBNAME : 'node-weixin'
    }
});

module.exports = config;