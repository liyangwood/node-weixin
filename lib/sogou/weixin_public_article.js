var config = require('./config');
var xmlParser = require('xml2json');

var F = KG.Class.define('WeixinPublicArticle', {
    constructor : function(id, opts){
        this.id = id;
        this.opts = opts || {};
    },

    getRandomCookie : async function(){
        var suid = ((new Date()).getTime())*1000+Math.round(Math.random()*1000);
        var str = 'ABTEST=0|1452140239|v1; weixinIndexVisited=1; SUID=0A2594AF05C60D0A00000000568DEC6E; SUV=00F41B40AF94250A568DEC6E46383707; CXID=F7559F89855650BBF6FEB5D2A29546FA; ad=cYcAIkllll2Q0KNTlllllVz2dTtlllllriyOjkllll9lllllxTDll5@@@@@@@@@@; sct=6; SNUID=E60205B31C1934BF5369F5971D12C2F2; IPLOC=CN2207';

        return str;
    },

    getRequestHeader : async function(){
        return {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            //'Cookie': 'weixinIndexVisited=1; SUID=0A2594AF05C60D0A00000000568DEC6E; SUV=00F41B40AF94250A568DEC6E46383707; SNUID=95BA3430A09AB717C2E827CEA068296F; CXID=F7559F89855650BBF6FEB5D2A29546FA;',
            'Cookie': await this.getRandomCookie(),
            'Host': 'weixin.sogou.com',
            //'Referer': 'http://weixin.sogou.com/gzh?openid=oIWsFtzoNLI6-6I8GNfFgODdmXAQ',
            'Upgrade-Insecure-Requests' : '1',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
        };
    },

    stripTags : function(string){
        return string.replace(/<(.*?)>/g, '');
    },

    searchName : async function(keyword){
        var url = config.get('URL_ROOT')+'/weixin?query='+encodeURIComponent(keyword);
        var header = await this.getRequestHeader();
        var response = await KG.request.getAsync({
            url : url,
            headers : header
        });

        if(response.error)
            throw new Error(response.error);
        if(response.statusCode != 200)
            throw new Error('response statusCode: ' + response.statusCode);

        var regexp = /<div\sclass="wx-rb\sbg-blue\swx-rb_v1\s_item"([\s\S]*?)<div\sclass="pos-ico">/g;
        var matches = response.body.match(regexp);
        if (!matches)
            throw new Error('查询不到相关账号');
        var result = [];
        for (var i = 0, l = matches.length; i < l; i++) {
            var item = matches[i];
            var match = item.match(/href="\/gzh\?openid=([^&]*)&amp;ext=([^"]*)"[\s\S]*src="([^"]*)"[\s\S]*<h3>(.*)<\/h3>[\s\S]*<span\sclass=\"sp-tit\">功能介绍：<\/span>(.*)<\/span>/);
            if (match) {
                var info = {
                    'openid'      : match[1],
                    'ext'         : match[2],
                    'pic'         : match[3],
                    'name'        : this.stripTags(match[4]),
                    'description' : this.stripTags(match[5])
                };
                result.push(info);
            }
        }
        return result;
    },

    getExt : async function(){
        var url = config.get('URL_ROOT')+'/gzh?openid='+this.id;
        var response = await KG.request.getAsync({
            url : url,
            headers: await this.getRequestHeader()
        });
        console.log(url)
        if (response.error)
            throw new Error(response.error);
        if (response.statusCode != 200)
            throw new Error('response statusCode: ' + response.statusCode);
        var body = response.body;
        var match = body.match(/<h3\sid=\"weixinname\">([\s\S]*?)<\/h3>/);
        if (match && match[1]) {
            var weixinName = match[1];
            var users = await this.searchName(weixinName);
            for (var i = 0, l = users.length; i < l; i++) {
                if (users[i].openid == this.id)
                    return users[i].ext;
            };
        }

        //var match = body.match(/weixin_gzh_openid_ext = \"([^"]*)\";/);
        //console.log(match);
        //if(match && match[1]){
        //    console.log(match[1]);
        //    return match[1];
        //}

        throw Error('获取不到ext数据');
    },

    getArticleListById : async function(id, ext){
        if(!this.id) this.id = id;

        ext = ext || await this.getExt();
        //console.log(ext);
        var url = config.get('URL_ROOT')+'/gzhjs?cb=sogou.weixin_gzhcb&openid='+this.id+'&ext='+ext+'&page=1&t='+Date.now();

        var header = await this.getRequestHeader();
        console.log(header);

        var response = await KG.request.getAsync({
            url : url,
            headers: await this.getRequestHeader()
        });
        console.log(url);
        if (response.error)
            throw new Error(response.error);
        if (response.statusCode != 200)
            throw new Error('response statusCode: ' + response.statusCode);

        var body = response.body;
        var leftLimit = body.indexOf('({');
        var rightLimit = body.indexOf('})');
        if (leftLimit === -1 || rightLimit === -1)
            throw new Error('请求繁忙，请稍后重试..');
        var dataJson = JSON.parse(body.slice(leftLimit + 1, rightLimit + 1));
        if (dataJson.items.length === 0)
            throw new Error(this.id + ': 无相关文章');

        //console.log(dataJson.items.length)
        var items = [];
        dataJson.items.forEach(function(item){
            var itemJson = JSON.parse(xmlParser.toJson(item, {sanitize : false}));
            var _item = itemJson.DOCUMENT.item.display;
            items.push(_item);

            //console.log('http://weixin.sogou.com', _item.url);
        });
        return items;
    }
});


module.exports = F;