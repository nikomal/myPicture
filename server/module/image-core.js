/**
 * Created by coffee on 2015/7/22.
 */

var images = require('images');

//指定图片大小，width必须，height可选，无height自动等比缩放
var imageSet =  function(path, size1, callback){

    var size, width, height, image;

    image = images(path);

    size = size1 || 400; //默认宽为400

    if(typeof size == 'object'){
        width = size.width || 400;
        height = size.height;
    }else{
        width = parseInt(size);
    }

    width = parseInt(width);
    height = parseInt(height);

    if(height){
        image.resize(width, height);
    }else{
        image.resize(width);
    }

    callback(image.encode('jpg'));

};

// 返回图像大小
var imageInfo = function(path, callback){

    var image;

    image = images(path);
    var size = image.size();

    callback(size);

};

// 批量返回图像大小
var imageInfoAll = function(filesPath, callback){

    var filesPathList = [];

    filesPath.forEach(function(path, index){
        var image;
        try{
            image = images(path);
        }catch(e){
            console.log(e);
        }

        if(image){
            var obj = image.size();
            obj.url = path.replace('./uploads', '');
            filesPathList.push(obj);
        }

    });
    console.log(filesPathList);
    callback(filesPathList);
};


exports.imageSet = imageSet;
exports.imageInfo = imageInfo;
exports.imageInfoAll = imageInfoAll;