
var _ = require('underscore');
var Promise = require('bluebird');

var Class = require('./lib/myclass/class').Class;

var request = require('request');

var AllConfig = {};
var F = {
    createConfig : function(name){
        if(AllConfig[name]){
            throw new Error('[config '+name+'] is exist');
        }

        var config = {};
        var obj = {
            add : function(key, value){
                var param = {};
                if(arguments.length === 1){
                    param = key;
                }
                else{
                    param[key] = value;
                }

                _.extend(config, param);
            },

            get : function(key){
                if(key){
                    return config[key] || null;
                }
                return config;
            }
        };
        obj.config = config;

        AllConfig[name] = obj;
        return obj;
    }

};


var AllClass = {};
var base = {
    callParent : function(name, arg){
        return this.__class.Super.prototype[name].apply(this, arg);
    },
    getParent : function(){
        return this.__class.Super || null;
    }
};
F.Class = {
    define : function(name, prop){
        if(AllClass[name]){
            throw new Error('[Class '+name+'] is exist');
        }

        var parent = prop['ParentClass'];
        if(parent){
            parent = _.isString(parent) ? AllClass[parent] : parent;
            delete prop['ParentClass'];
        }

        var cls;
        if(parent){
            cls = Class(parent, prop);
        }
        else{
            cls = Class(base, prop);
        }

        cls.prototype.__name = name;
        cls.prototype.__class = cls;

        AllClass[name] = cls;

        return cls;
    },
    get : function(name, arg){
        var cls = AllClass[name];
        return cls;
    }
};

F.Promise = Promise;
F.request = Promise.promisifyAll(request);
















module.exports = F;