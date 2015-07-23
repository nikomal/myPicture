/**
 * Created by Coffee on 15/7/18.
 */


var express    = require('express'),
    bodyParser = require('body-parser'),
    path       = require('path'),
    multer     = require('multer'),
    fs         = require('fs'),
    //sharp      = require('sharp'),
    //images     = require('images'),
    imageCore  = require('./server/module/image-core.js'),
    database  = require('./server/module/database.js');

var app = express();

app.use(express.static(path.join(__dirname, './client')));
app.use(express.static(path.join(__dirname, './uploads')));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(multer(
        {
            dest: './uploads/',
            rename: function (fieldname, filename, req, res) {
                return filename;
            },
            onFileUploadStart: function (file, req, res) {
                console.log(file.fieldname + ' is starting ...')
            },
            onFileUploadData: function (file, data, req, res) {
                console.log(data.length + ' of ' + file.fieldname + ' arrived')
            },
            onFileUploadComplete: function (file, req, res) {
                console.log(file.fieldname + ' uploaded to  ' + file.path)
            }
        })
);

app.listen(8881);
console.log('server is start: '+ 8881);

app.post('/upload', function(req, res){
    console.log(req.files);
    res.send(req.files);
});

//分页输出图片，默认20张，第一页
app.get('/imgList', function(req, res){

    var classes, path, page;

    page = req.query.page || '1';
    classes = req.query.c || 'lol';
    path = './uploads/'+classes+'/';

    /*fs.readdir(path, function(err, files){

        if(err){
            res.send(err);
        }
        files = files.map(function(element, index){
            return path+element;
        });
        imageCore.imageInfoAll(files, function(fileList){
            res.send(fileList);
        })

    });*/

    database.orderByDefault(classes, page, null, function (data) {
        data = data.map(function (element, index) {
            element.path = path + element.path;
            return element;
        });
        imageCore.imageInfoAll(data, function(fileList){
            res.send(fileList);
        });
    })

});
//返回图片的页数
app.get('/imgListPageLength', function(req, res){

    var limit, classes;

    classes = req.query.c || 'lol';
    limit = req.query.limit || 20;

    database.orderByDefault(classes, null, 0, function (data) {
        res.send(Math.ceil((data.length)/limit).toString());
    })
});

app.get('/imgResize', function(req, res){

    var path = './uploads/girl/1.jpg';

    fs.exists(path ,function(exists){

        if(!exists){
            res.send('图像路径不存在');
            return;
        }
        var g = gm(path);
        g.size(function(size){
            console.log(size);
        });
        g.resize(200, 200);
        g.write('./uploads/girl/1-1.jpg', function (err) {
            if (!err)
                console.log('done');
            else{
                console.log('写入失败');
            }
        });
        g.toBuffer(function(err, buffer, info){
            console.log(info);	
            if(err){
                console.log(err);
            }else{
                //res.send('Content-Type','');
                res.send(buffer);
            }
        })

    });


});

app.get('/sharp', function(req, res){
   
   var path = './uploads/girl/1.jpg';

    fs.exists(path ,function(exists){

        if(!exists){
            res.send('图像路径不存在!!!');
            return;
        }
        sharp('./uploads/girl/1.jpg')
          .resize(200, 200)
          .toFile('./uploads/girl/1-sharp.jpg', function(err) {
            if(err)
                console.log(err);     
          })
          .toFormat(sharp.format.jpeg)
          .toBuffer(function(err, buffer){
              console.log(buffer.length);
              if(err){
                  console.log(err);
                  res.send('error');
              }else{
                  var webpDataURL = 'data:image/jpeg;base64,' + buffer.toString('base64');
                  res.set('Content-Type', 'image/jpeg');
                  res.send(buffer);
              }
          });

    });
    
});


app.get('/getImage', function(req, res){

    var path, width, height;

    path = req.query.path || '/girl/1.jpg';
    width = req.query.width || 400;

    path = './uploads'+path;

    height = req.query.height;

    imageCore.imageSet(path, {width: width, height: height}, function(buffer){
        res.set('Content-Type', 'image/jpeg');
        res.send(buffer);
    });

});

app.get('/imageInfo', function(req, res){
    var path = req.query.path || './uploads/girl/1.jpg';
    var width = req.query.width || 400;

    imageCore.imageInfo(path, function(size){
        res.send(size);
    });
});

app.get('/order', function(req, res){
    database.orderByDefault(5, null, function (data) {
        console.log(data);
        res.send(data);
    });
});

app.get('/resort',function(req, res){
    var page  = parseInt(req.query.page),
        i     = parseInt(req.query.i),
        index = parseInt(req.query.index);

    if(page==undefined || i==undefined || index==undefined){
        res.send('fuck,还有值没传过来，page、i、index，请自查');
        return false;
    }else{
        database.reSortById(page, i, index, function (data) {
            res.send(data);
        })
    }

});

//database.init();

/*
database.orderByTime(function(data){
    console.log(data);
});*/
