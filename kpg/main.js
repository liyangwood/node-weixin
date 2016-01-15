
var _ = require('underscore');
var Promise = require('bluebird');

var core = require('./core');
var KG = {};
_.extend(KG, core);


global._ = _;
global.KG = KG;

