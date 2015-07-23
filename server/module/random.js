/**
 * Created by Coffee on 15/7/5.
 */
/*
 * 随机的短网址：
 * a-z A-z 0-9
 * 97-122 65-90 48-57
 * */
var random = {
    list: [], //短网址随机池
    count: 6, //生成随机短网址位数. 默认
    init: function(){
        for(var i=0; i<=122; i++){
            if((i>=97 && i<=122) || (i>=65 && i<=90) || (i>=48 && i<=57)){
                this.list.push(i);
            }
        }
        this.list = this.list.map(function(obj){
            return String.fromCharCode(obj);
        });
        return this;
    },
    randomInt: function(n,m){
        var c = m-n+1;
        return Math.floor(Math.random() * c + n);
    },
    randomStr: function(count){
        if(typeof count =='number'){
            this.count = parseInt(count);
            console.log(this.count);
        }
        var list = [];
        for(var i = 0; i<this.count; i++){
            var index = this.randomInt(0, this.list.length);
            list.push(this.list[index]);
        }
        return list.join('');
    }
};
random.init();


exports.random = random;