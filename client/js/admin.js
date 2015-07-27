/**
 * 后台管理
 * */
var admin=(function(){
	var initModule=function($container){
		admin.album.initModule($container);
	};
	return {initModule:initModule};
}());

//更多事件
(function($){

    var _this    = $('.c-menu'),
        menuBtn  = _this.find('.c-menu-btn'),
        closeBtn = _this.find('.c-close-btn'),
        classes  = _this.find('.c-classes');

    menuBtn.click(function(){
        _this.addClass('open');
    });
    closeBtn.click(function(){
        _this.removeClass('open');
    });

    classes.on('click','li',function(){
        $(this).addClass('active').siblings('.active').removeClass('active');
        closeBtn.trigger('click');
    });
//        classes.find('>li').each(function(index, element){
//            $(element).click(function(){
//                $(this).addClass('active').siblings().removeClass('active');
//                closeBtn.trigger('click');
//            });
//        })

})(jQuery);

//页面渲染
(function ($) {

    var _this, li, moreBtn, classesList;
    _this   = $('.c-pic-list');
    classesList = $('.c-classes');

    //渲染图片
    $.ajax('http://127.0.0.1:8881/imgList?page=1')
        .success(function (response) {
            response.forEach(function (element, index) {
                var html = '<li draggable="true">'+
                    '            <div class="c-image-box">'+
                    '                <div class="c-image">'+
                    '                    <div class="c-layer">'+
                    '                        <img src="'+element.url+'" alt=""/>'+
                    '                    </div>'+
                    '                    <div'+
                    '                          data-role="lightbox"'+
                    '                          data-source="'+element.url+'"'+
                    '                          data-group="group-1"'+
                    '                          data-id="kojji"'+
                    '                          data-caption="发了看得见啊" class="c-mask js-lightbox">'+
                    '                        <div class="c-mask-layer ">'+
                    '                            <div class="iconfont c-eye">'+
                    '                                &#xe65e;'+
                    '                            </div>'+
                    '                        </div>'+
                    '                    </div>'+
                    '                </div>'+
                    '                <div class="c-title">'+
                    '                    武器大师，贾克斯'+
                    '                    <div class="c-more cc-right ">'+
                    '                        <span class="iconfont">&#xe626;</span>'+
                    '                        <div class="c-polygon c-polygon-border"></div>'+
                    '                        <div class="c-polygon"></div>'+
                    '                        <ul class="c-more-sub">'+
                    '                            <li>编辑</li>'+
                    '                            <li>移动</li>'+
                    '                            <li>删除</li>'+
                    '                            <li class="c-close iconfont">&#xe60d;</li>'+
                    '                        </ul>'+
                    '                    </div>'+
                    '                </div>'+
                    '            </div>'+
                    '        </li>';
                _this.append(html);
            });
            li      = _this.find('>li');
            moreBtn = li.find('.c-more');

            moreBtn.click(function(){
                $(this).toggleClass('active');
            });

            _this.drag(function(start,end){
                var _temp = li.eq(start);
                li.eq(start).remove();
                li.eq(end).before(_temp);
                li = _this.find('>li');

                _this.Masonry(3);
            });

            setTimeout(function () {
                _this.Masonry(3);
            },500)
        });

    //加载分类并标记
    $.ajax('/imgClasses').success(function (response) {
        var total,ClassName;

        total = 0;
        ClassName = Object.keys(response);

        ClassName.forEach(function (element, index) {
            total += response[element];
            classesList.append('<li>'+
                '                <div class="c-wrapper">'+
                '                    <a href="admin.html?c='+element+'"><span class="className">'+element+'</span>( 1253 )</a>'+
                '                    <div class="c-input-group">'+
                '                        <input type="text" title="请输入要修改的标题" placeholder="请输入要修改的标题"/>'+
                '                        <span class="iconfont"><span class="sure">&#xe60a;</span>&nbsp<span class="cancel">&#xe60c;</span>&nbsp;</span>'+
                '                    </div>'+
                '                    <div class="edit-ctrl iconfont">'+
                '                        <span class="icon-edit"></span>'+
                '                        <span class="icon-delete"></span>'+
                '                    </div>'+
                '                </div>'+
                '            </li>');
        });

        classesList.prepend('<li><a href="admin.html"><span>全部</span>( '+total+' )'+'</a></li>');

        //标记分类
        if(location.search){
            var query = location.search.urlDecode();
            console.log(query['c']);
            if(query['c']){
                classesList.find('>li').each(function (index, element) {
                    if($(element).find('.className').text()==query['c']){
                        $(element).addClass('active');
                    }
                })
            }

        }else{
            classesList.find('>li').eq(0).addClass('active')
        }
        classesList.editClasses();
    });





})(jQuery);

//分类编辑
(function($){
    
    $.fn.editClasses = function () {

        $(this).find('>li').each(function(){
            var _this     = $(this),
                editBtn   = _this.find('.icon-edit'),
                delBtn    = _this.find('.icon-delete'),
                sureBtn   = _this.find('.sure'),
                cancelBtn = _this.find('.cancel'),
                className = _this.find('.className'),
                input     = _this.find('input');

            editBtn.click(function(e){
                e.stopPropagation();
                _this.addClass('edit');
                setTimeout(function () {
                    input.focus();
                },500)
            });

            delBtn.click(function(){
                if(confirm('是否删除该分类，删除后不可恢复')){
                    _this.remove();
                }
            });

            sureBtn.click(function(e){
                e.stopPropagation();
                if(input.val()){
                    className.text(input.val());
                    _this.removeClass('edit');
                }else{
                    alert('不允许分类名为空');
                    input.focus();
                }
            });

            cancelBtn.click(function (e) {
                e.stopPropagation();
                _this.removeClass('edit');
            });

            input.click(function (e) {
                e.stopPropagation();
            });
            //Enter和Esc快捷键绑定
            input.on('keyup', function (event) {
                /**
                 * 13: Enter
                 * 27: Esc
                 */
                if(event.keyCode == 13){
                    sureBtn.trigger('click');
                }else if(event.keyCode == 27){
                    cancelBtn.trigger('click');
                }
            })

        })

    }
    
})(jQuery);
