/**
 * Created by Coffee on 15/7/18.
 */


var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    multer = require('multer'),
    fs = require('fs'),
//sharp      = require('sharp'),
//images     = require('images'),
    imageCore = require('./server/module/image-core.js'),
    database = require('./server/module/database.js');

var app = express();

app.use(express.static(path.join(__dirname, './client')));
app.use(express.static(path.join(__dirname, './uploads')));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(
    multer(
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
console.log('server is start: ' + 8881);

app.post('/upload', function (req, res) {
    var className = req.query.c || 'girl';
    req.files.classes = className;
    res.send(req.files);
    if(className){
        var imgPath = req.files.upload.path;
        fs.exists('./uploads/'+className, function(exists){
            if(!exists){
                fs.mkdir('./uploads/'+className, function (err) {});
            }
        });
        if(typeof req.files.upload == 'object'){

        }else{
            console.log(req.files.upload);
        }
    }
});

//分页输出图片，默认20张，第一页
app.get('/imgList', function (req, res) {

    var classes, path, page;

    page = req.query.page || '1';
    classes = req.query.c;

    database.orderByDefault(classes, page, null, function (data) {
        data = data.map(function (element, index) {
            path = './uploads/' + element.classes + '/';
            element.path = path + element.path;
            return element;
        });
        imageCore.imageInfoAll(data, function (fileList) {
            res.send(fileList);
        });
    })

});
//返回图片的页数
app.get('/imgListPageLength', function (req, res) {

    var limit, classes;

    classes = req.query.c;
    limit = req.query.limit || 20;

    database.orderByDefault(classes, null, 0, function (data) {
        res.send(Math.ceil((data.length) / limit).toString());
    })
});
//返回图片的分类
app.get('/imgClasses', function (req, res) {
    database.findTheClasses(function (data) {
        res.send(data);
    })
});
//返回指定大小图片
app.get('/getImage', function (req, res) {

    var path, width, height;

    path = req.query.path || '/girl/1.jpg';
    width = req.query.width || 400;

    path = './uploads' + path;

    height = req.query.height;

    imageCore.imageSet(path, {width: width, height: height}, function (buffer) {
        res.set('Content-Type', 'image/jpeg');
        res.send(buffer);
    });

});

app.get('/imageInfo', function (req, res) {
    var path = req.query.path || './uploads/girl/1.jpg';
    var width = req.query.width || 400;

    imageCore.imageInfo(path, function (size) {
        res.send(size);
    });
});

app.get('/order', function (req, res) {
    database.orderByDefault(5, null, function (data) {
        console.log(data);
        res.send(data);
    });
});
//图片之间的重排序
app.get('/resort', function (req, res) {
    var page = parseInt(req.query.page),
        i = parseInt(req.query.i),
        index = parseInt(req.query.index);

    if (page == undefined || i == undefined || index == undefined) {
        res.send('fuck,还有值没传过来，page、i、index，请自查');
        return false;
    } else {
        database.reSortById(page, i, index, function (data) {
            res.send(data);
        })
    }

});

//删除分类
app.get('/deleteClass', function (req, res) {
    var className = req.query.c;
    if (!className) {
        res.send({
            status: 500,
            msg: '不允许传递空值'
        });
    } else {
        database.deleteClass(className, function (data) {
            res.send(data);
        })
    }
});
//通过id删除图片
app.get('/deleteById', function (req, res) {
    var id = req.query.id;
    if (!id) {
        res.send({
            status: 500,
            msg: '不允许传递空值'
        });
    }
    database.deleteById(id, function (data) {
        res.send(data);
    })
});
app.get('/addClass', function (req, res) {
    var className = req.query.c;
    if (!className) {
        res.send({
            status: 500,
            msg: '不允许传递空值'
        });
    } else {

    }
});

app.get('/init', function (req, res) {

    fs.readdir('./uploads/', function (err, files) {

        database.deleteAll();
        files.forEach(function (element, index) {
            database.init(element);
        });
        res.send('初始化完成');
    });
});


//database.init('风景');

/*
 database.orderByTime(function(data){
 console.log(data);
 });*/
