/**
 * Created by coffee on 2015/7/24.
 */

var url = '?search=1&ab=1&code=-13&b=3';
var json = { search: '1', ab: '1', code: '-13', b: '3241414112', 'love':'曾媛' };
var url2 = '';

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
Object.prototype.urlEncode = function () {

    var s, json;

    s = '?';
    json = this;

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
String.prototype.queryAdd = function (json) {
    var dic = this.urlDecode();
    for(var i in json){
        dic[i] = json[i];
    }
    return dic.urlEncode();
};


//console.log(url.urlDecode());
console.log(url.queryAdd(json));
