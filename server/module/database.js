/**
 * Created by coffee on 2015/7/22.
 */

var mongoose      = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
    fs            = require('fs'),
    random        = require('./random.js');


var dataBase = {
    init: function(){
        return mongoose.createConnection('localhost', 'myPicture');
    },
    shema: function(){
        return new mongoose.Schema({
            id: {
                type: Number,
                ref: 'Id'
            },
            name: String,
            path: String,
            classes: {
                type: String,
                default: 'girl'
            },
            description: {
                type: String,
                default: ''
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            lastModify: {
                type: Date,
                default: Date.now
            },
            orderByDefault: {
                type: Number,
                default: function(){
                    return random.random.randomInt(1,1000);
                }
            }
        });
    }
};


var connect = dataBase.init();
var shema = dataBase.shema();

autoIncrement.initialize(connect);

var model = connect.model('imageList', shema);
shema.plugin(autoIncrement.plugin, 'Id');

// 排序初始值
var orderByStart = 0;

var findByPath = function(path, callback){
    model.find({path: path}, function (err, data) {
        if(err){console.log(err);}
        callback(data);
    })
};

//默认排序  根据插入数序
var orderByDefault = function(page, limit, callback){

    var page  = page || 1,
        limit = limit || 20;

    model.find({}, function (err, data) {
        callback(data);
    }).sort({orderByDefault: 1})
        .limit(limit)
        .skip((page-1)*20);

};

//找到数据库的默认排序最大值，并设置排序初始值
var findTheBig = function(callback){

    orderByDefault(null, null, function(data){
        if(data.length>0){
            orderByStart = data[data.length-1].orderByDefault+1;
            callback(data[data.length-1].orderByDefault+1);
        }else{
            orderByStart = 0;
            callback(0);
        }
    });

};

//插入数据
var insertData = function(obj, callback){

    if(!obj){
        return false;
    }

    var db = new model;
    db.name = obj.name;
    db.path = obj.path;
    db.orderByDefault = orderByStart;
    console.log(orderByStart);

    if(obj.classes){
        db.classes = obj.classes;
    }
    db.save();
    orderByStart++;

    callback(obj.name +'  保存成功');

};

//时间排序， 貌似没用，一秒完成上百个，都一样哪来的顺序
var orderByTime = function(callback){
    model.find({},null,{_id: 1},function(err, data){
        callback(data);
    })
};

//数据库初始化
function init(){
    fs.readdir('./uploads/girl',function (err, files) {

        if(err){
            console.log(err);
            return false;
        }

        findTheBig(function (big) {
            files.forEach(function (element, index) {
                insertData({
                    name: element,
                    path: element
                },function(response){
                    console.log(response);
                })
            })
        });


    });
}



findTheBig(function () {
    
});  //初始化最大值

exports.init = init;
exports.findByPath = findByPath;
exports.insertData = insertData;
exports.orderByTime = orderByTime;
exports.orderByDefault = orderByDefault;