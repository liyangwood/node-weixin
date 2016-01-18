


var Article = KG.Class.define('sogou-Article', {
    constructor : function(){

        this.model = KG.mongoose.model('Article', this.defineSchema());

        console.log('[Article class] init success');
    },

    defineSchema : function(){
        return KG.mongoose.Schema({
            docid : String,
            title : String,
            url : String,
            title1 : String,
            imglink : String,
            headimage : String,
            sourcename : String,
            content168 : String,
            site : String,
            openid : String,
            ext : String,
            content : String,
            date : String,

            createTime : Date
        });
    },

    findByDocid : async function(docid){
        var self = this;
        var one = await self.model.findOne({
            docid : docid
        }).exec();

        return !!one;
    },

    getAllSync : async function(){
        return this.model.find({}).sort({createTime:1});
    },

    insertSync : async function(data){
        var self = this;


        var pro = new KG.Promise(function(resolve, reject){
            data.createTime = Date.now();
            var tmp = new self.model(data);
            tmp.save(function(err, rs){
                if(err){
                    reject(err);
                }
                else{
                    resolve(rs);
                }
            });
        });

        return pro;
    }


});

module.exports = Article;