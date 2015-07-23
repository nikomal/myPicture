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
var findById = function (id) {
    if(typeof id != 'number'){
        try{
            id = parseInt(id);
        }catch(e){
            return false;
        }
    }
    model.find({_id: id}, function(err, data){
        console.log(data);
    });
};
/**
 * 根据id更新数据
 * @param id
 * @param updateData  对象，包含需要修改的字段和值
 * @param callback
 */
var updateById = function(id, updateData, callback){
    model.update({_id: id}, updateData, {}, function (err, data) {
        callback(data);
    })
};

//默认排序 以写入数据库时间排序
var orderByDefault = function(classes, page, limit, callback){

    classes = classes || {};
    page  = page || 1;

    //如果值为0，就输出全部结果
    if(limit != 0){
        limit = limit || 20;
    }

    if( typeof classes!= 'object'){
        classes = {classes: classes};
    }

    model.find(classes, function (err, data) {
        if(err){
            console.log(err);
        }
        callback(data);
    }).sort({orderByDefault: 1})
        .limit(limit)
        .skip((page-1)*20);

};

//找到数据库的默认排序最大值，并设置排序初始值
var findTheBig = function(callback){

    orderByDefault(null, null, null, function(data){
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

var reSortById = function(page, i, index, callback){

    orderByDefault(page, null, function(list){
        //对象的克隆方法
        Object.prototype.clone = function(){
            var objClone;
            if (this.constructor == Object){
                objClone = new this.constructor();
            }else{
                objClone = new this.constructor(this.valueOf());
            }
            for(var key in this){
                if ( objClone[key] != this[key] ){
                    if ( typeof(this[key]) == 'object' ){
                        objClone[key] = this[key].clone();
                    }else{
                        objClone[key] = this[key];
                    }
                }
            }
            objClone.toString = this.toString;
            objClone.valueOf = this.valueOf;
            return objClone;
        };

        var _list, temp;

        temp = list[i];

        //克隆list
        _list = list.clone();


        //找到对应位置的元素剔除，然后指定位置添加
        list.splice(i, 1);
        list.splice(index, 0, temp);


        //修改orderByDefault为原来的顺序
        _list.forEach(function (element, index) {
            list[index].orderByDefault = element.orderByDefault;
        });

        list.forEach(function(element, index){
            if(index>6){
                return false;
            }
            //console.log(list[index]._id, _list[index]._id);
            //console.log(list[index].orderByDefault, _list[index].orderByDefault);
        });


        list.forEach(function (element, index) {
            updateById(element._id, {
                orderByDefault: element.orderByDefault
            },function(data){
                console.log(data);
            })
        });

        callback({
            status: 200,
            msg: 'ok'
        });
    })
};

/*findById(1071);
updateById(1071, {orderByDefault: 1123}, function(data){
    console.log(data);
});*/

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
                    path: element,
                    classes: 'girl'
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
exports.orderByDefault = orderByDefault;
exports.reSortById = reSortById;