/**
 * Created by coffee on 2015/7/24.
 */

'use strict';
Array.prototype.max = function() {
    var max = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++){
        if (this[i] > max) {
            max = this[i];
        }
    }
    return max;
};
Array.prototype.min = function(){
    var min=this[0];
    var len = this.length;
    for(var i =1; i<len; i++){
        if(this[i] < min){
            min = this[i];
        }
    }
    return min;
};
Array.prototype.minIndex = function () {
    var min=this[0];
    var len = this.length;
    for(var i =1; i<len; i++){
        if(this[i] < min){
            min = this[i];
        }
    }
    return this.indexOf(min);
};

//把url的?后面的参数转换成对象
String.prototype.urlDecode = function(){
    var _this, dic;
    if(this.substr(0,1)=='?'){
        _this = this.substr(1);
    }else{
        _this = this;
    }
    _this = decodeURI(_this);
    dic = {};
    _this.split('&').forEach(function(element){
        var array = element.split('=');
        dic[array[0]] = array[1];
    });
    return dic;
};

//把对象转换成get字符串形式，开头会带?
String.prototype.urlEncode = function () {

    var s, json;

    s = '?';
    json = JSON.parse(this);

    for(var i in json){
        if(i == 'urlEncode'){
            continue;
        }
        s += i+'='+json[i]+'&';
    }
    if(s.substr(s.length-1)=='&'){
        s = s.substr(0, s.length-1);
    }

    s = encodeURI(s);
    return s;
};

//get查询字段的添加，有会更新，无则增加
String.prototype.queryUpdate = function (json) {
    var dic = this.urlDecode();
    for(var i in json){
        dic[i] = json[i];
    }
    return JSON.stringify(dic).urlEncode();
};
//检测get字符串是否含有字段
String.prototype.checkField = function(field){
    var dic = this.urlDecode();
    return dic[field] ? true : false;
};

(function($){

    //图片延迟加载。 只加载实际需要的大小
    $.fn.lazyLoad = function(){
        var _this = $(this);
        var imgUrl, imgWidth, imgHeight, realWidth;

        realWidth = _this.find('>li').width();

        //计算真实大小和地址
        var change = function(_src, _width, _height, realWidth){
            var percent, width, height, src;
            _width = parseInt(_width);
            _height = parseInt(_height);

            percent = realWidth/_width;
            width = realWidth;
            height = parseInt(_height*percent);
            src = 'getImage/?path='+_src+'&width='+width+'&height='+height;
            return {
                src: src,
                width: width,
                height: height
            }
        };

        //开始加载图片
        _this.find('img').each(function(index, element){
            var image = $(element);
            imgUrl = image.attr('data-src');
            imgWidth = image.attr('data-width');
            imgHeight = image.attr('data-height');

            var attr = change(imgUrl, imgWidth, imgHeight, realWidth);
            image.attr(
                {
                    'src': attr.src,
                    'width': attr.width,
                    'height': attr.height
                }
            );

        });

        return this;
    };

    //瀑布流
    $.fn.Masonry = function (length) {
        var _this = $(this);
        var __this = this;
        var _width, height, windowWidth;

        function load(){
            _width = _this.find('>li').outerWidth();
            windowWidth = $(window).width();

            var  heights = [0, 0, 0, 0, 0];
            if(length){
                heights.length = length;
            }

            _this.find('>li').each(function (index, element) {
                var li = $(element);
                var num = heights.minIndex();  //填充位置： 总是为最短的那个顺序填充
                li.css({'left': _width*num, 'top': heights[num]});
                heights[num] += li.outerHeight();
            });

            _this.css('height',heights.max());
        }

        load();

    }

    $.fn.drag = function (callback) {
        var _this = $(this);
        var li = _this.find('>li');

        var dragElement, dragIndex;

        dragElement = null;
        dragIndex = null;

        var dropInit = function () {
            _this.find('>li').each(function (index, element) {

                element.onselectstart = function () {
                    return false;
                };
                element.ondragstart = function (ev) {
                    dragIndex = index;
                    dragElement = ev.target;
                    return true;
                };
                element.ondragend = function (ev) {

                    dragElement = null;
                    return false;
                };

                element.ondragover = function (ev) {
                    ev.preventDefault();
                    return true;
                };
                element.ondragenter = function (ev) {
                    return true;
                };
                element.ondrop = function (ev) {
                    if(dragElement){
                        callback(dragIndex, index);
                        dropRemove();
                    }
                    return false;
                };

            });
        };

        var dropRemove = function () {
            _this.find('>li').each(function(index, element){
                element.onselectstart = null;
                element.ondragstart = null;
                element.ondragend = null;

                element.ondragover = null;
                element.ondragenter = null;
                element.ondrop = null;
            });
            dropInit();
        };

        dropInit();

        return this;

    }

})(jQuery);