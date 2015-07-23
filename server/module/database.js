/**
 * Created by coffee on 2015/7/22.
 */

var mongoose      = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
    fs            = require('fs');

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
            orderByTime: {
                type: Number,
                default: 0
            }
        });
    }
};


var connect = dataBase.init();
var shema = dataBase.shema();

autoIncrement.initialize(connect);

var model = connect.model('imageList', shema);
shema.plugin(autoIncrement.plugin, 'Id');


var findByPath = function(path, callback){
    model.find({path: path}, function (err, data) {
        if(err){console.log(err);}
        callback(data);
    })
};

var insertData = function(obj, callback){

    if(!obj){
        return false;
    }

    var db = new model;
    db.name = obj.name;
    db.path = obj.path;

    if(obj.classes){
        db.classes = obj.classes;
    }

    db.save();

    callback(obj.name +'  保存成功');

};

var orderByTime = function(callback){
    model.find({},null,{_id: 1},function(err, data){
        callback(data);
    })
};


function init(){
    fs.readdir('./uploads/girl',function (err, files) {

        if(err){
            console.log(err);
            return false;
        }
        files.forEach(function (element, index) {
            insertData({
                name: element,
                path: element
            },function(response){
                console.log(response);
            })
        })

    });
}

exports.init = init;
exports.findByPath = findByPath;
exports.insertData = insertData;
exports.orderByTime = orderByTime;