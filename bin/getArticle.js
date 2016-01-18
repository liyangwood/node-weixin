
//babel
require("babel-core/register");

var getArticle = require('../task/getArticle');

(function(){
    getArticle.init();
    //process.exit();
})();


