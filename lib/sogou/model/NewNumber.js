

var NewNumber = KG.Class.define('sogou-NuwNumber', {
    constructor : function(_mdb){
        this._mdb = _mdb;

        this.model = KG.mongoose.model('NewNumber', this.defineSchema());

        this.addTest();
        console.log('[NewNumber class] init success');
    },

    defineSchema : function(){
        return KG.mongoose.Schema({
            name : String,
            ext : String,
            pic : String,
            openid : String,
            description : String,
            createTime : Date
        });
    },

    insert : function(data, callback){
        data.createTime = Date.now();
        var n = new this.model(data);
        n.save(callback);
    },


    getAll : function(callback){
        this.model.find({}).sort({createTime:-1}).find(callback);
    },

    getAllSync : async function(){
        return this.model.find({}).sort({createTime:-1});
    },

    addTest : function(){


    },

    addByOpenid : function(param, callback){
        var self = this;
        param = param[0];
        if(!param){
            callback(false, '没有数据');
            return false;
        }

        this.model.findOne({openid : param.openid}, function(err, rs){
            if(err) throw err;
            console.log(rs);
            if(!rs){
                self.insert(param, function(err, rs){
                    callback(true, rs);
                });
            }
            else{
                callback(false, '已经存在');
            }
        });
    }
});

module.exports = NewNumber;