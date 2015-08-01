/**
 * 后台管理
 * */
var admin = (function () {
    var initModule = function ($container) {
        admin.album.initModule($container);
    };
    return {initModule: initModule};
}());

//更多事件
(function ($) {

    var _this = $('.c-menu'),
        menuBtn = _this.find('.c-menu-btn'),
        closeBtn = _this.find('.c-close-btn'),
        classes = _this.find('.c-classes');

    menuBtn.click(function () {
        _this.addClass('open');
    });
    closeBtn.click(function () {
        _this.removeClass('open');
    });

    classes.on('click', 'li', function () {
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

    var _this, li, moreBtn, classesList, pagination, getPageUrl, url;

    _this = $('.c-pic-list');
    classesList = $('.c-classes');
    pagination = $('.cc-pagination');
    getPageUrl = '/imgListPageLength';
    url = '/imgList';


    //加载分类并标记
    $.ajax('/imgClasses').success(function (response) {
        var total, ClassName;

        total = 0;
        ClassName = Object.keys(response);

        ClassName.forEach(function (element, index) {
            total += response[element];
            classesList.append('<li>' +
                '                <div class="c-wrapper">' +
                '                    <a href="admin.html?c=' + element + '"><span class="className">' + element + '</span>( 1253 )</a>' +
                '                    <div class="c-input-group">' +
                '                        <input type="text" title="请输入要修改的标题" placeholder="请输入要修改的标题"/>' +
                '                        <span class="iconfont"><span class="sure">&#xe60a;</span>&nbsp<span class="cancel">&#xe60c;</span>&nbsp;</span>' +
                '                    </div>' +
                '                    <div class="edit-ctrl iconfont">' +
                '                        <span class="icon-edit"></span>' +
                '                        <span class="icon-delete"></span>' +
                '                    </div>' +
                '                </div>' +
                '            </li>');
        });

        classesList.prepend('<li><a href="admin.html"><span>全部</span>( ' + total + ' )' + '</a></li>');

        //标记分类
        if (location.search.checkField('c')) {
            var query = location.search.urlDecode();
            if (query['c']) {
                classesList.find('>li').each(function (index, element) {
                    if ($(element).find('.className').text() == query['c']) {
                        $(element).addClass('active');
                    }
                })
            }

        } else {
            classesList.find('>li').eq(0).addClass('active')
        }
        classesList.editClasses();
    });

    //输出分页
    function getPagination(pageActive, pageCount) {

        var domain, pathName, query, _page;

        pageActive = parseInt(pageActive);
        pageCount = parseInt(pageCount);

        pathName = location.pathname;
        domain = location.origin;
        query = location.search;

        //插入数字页码
        for (var i = 0; i < pageCount; i++) {
            if (i - pageActive < 2 && i - pageActive > -4) {
                if (i == pageActive - 1) {
                    pagination.append('<li class="active">' + (i + 1) + '</li>');
                } else {
                    _page = i + 1;
                    query = query.queryUpdate({page: _page}); //更新页面的值
                    pagination.append('<li><a href="' + pathName + query + '">' + _page + '</a></li>');
                }
            }

        }
        //插入上下翻页，和首尾翻页
        //上翻页
        if (pageActive != 1) {
            _page = pageActive - 1;
            query = query.queryUpdate({page: _page});
            pagination.prepend('<li><a href="' + pathName + query + '">&lt;</a></li>');
        }
        //首页
        if (pageActive > 2) {
            _page = 1;
            query = query.queryUpdate({page: _page});
            pagination.prepend('<li><a href="' + pathName + query + '">&lt;&lt;</a></li>');
        }
        //下翻页
        if (pageActive != pageCount) {
            _page = pageActive + 1;
            query = query.queryUpdate({page: _page});
            pagination.append('<li><a href="' + pathName + query + '">&gt;</a></li>');
        }
        //尾页
        if (pageActive < pageCount - 1) {
            _page = pageCount + 1;
            query = query.queryUpdate({page: _page});
            pagination.append('<li><a href="' + pathName + query + '">&gt;&gt;</a></li>');
        }
    }

    // 判断是否有参数
    var params = location.search.urlDecode();
    if (location.search.checkField('c')) {
        url += location.search.queryUpdate({c: params.c, page: params.page});
        getPageUrl += location.search.queryUpdate({c: params.c});
        //url += 'c='+params.c+'&page='+params.page;
    } else {
        //url += 'page='+params.page;
        url += location.search.queryUpdate({page: params.page});
    }

    //渲染图片
    $.ajax(url).success(function (response) {
        response.forEach(function (element, index) {
            var html = '<li draggable="true">' +
                '            <div class="c-image-box">' +
                '                <div class="c-image">' +
                '                    <div class="c-layer">' +
                '                        <img data-src="' + element.url + '" data-width="' + element.width + '" data-height="' + element.height + '" alt=""/>' +
                '                    </div>' +
                '                    <div' +
                '                          data-role="lightbox"' +
                '                          data-source="' + element.url + '"' +
                '                          data-group="group-1"' +
                '                          data-id="kojji"' +
                '                          data-caption="发了看得见啊" class="c-mask js-lightbox">' +
                '                        <div class="c-mask-layer ">' +
                '                            <div class="iconfont c-eye">' +
                '                                &#xe65e;' +
                '                            </div>' +
                '                        </div>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="c-title">' +
                '                    武器大师，贾克斯' +
                '                    <div class="c-more cc-right ">' +
                '                        <span class="iconfont">&#xe626;</span>' +
                '                        <div class="c-polygon c-polygon-border"></div>' +
                '                        <div class="c-polygon"></div>' +
                '                        <ul class="c-more-sub">' +
                '                            <li>编辑</li>' +
                '                            <li>移动</li>' +
                '                            <li>删除</li>' +
                '                            <li class="c-close iconfont">&#xe60d;</li>' +
                '                        </ul>' +
                '                    </div>' +
                '                </div>' +
                '            </div>' +
                '        </li>';
            _this.append(html);
        });
        li = _this.find('>li');
        moreBtn = li.find('.c-more');

        moreBtn.click(function () {
            $(this).toggleClass('active');
        });

        _this.drag(function (start, end) {
            var _temp = li.eq(start);
            if (start < end) {
                li.eq(start).remove();
                li.eq(end + 1).before(_temp);
            } else if (start > end) {
                li.eq(start).remove();
                li.eq(end).before(_temp);
            }
            li = _this.find('>li');
            console.log(start, end);

            _this.Masonry(responseCount());
        });

        _this.lazyLoad().Masonry(responseCount());

    });

    //获取页码
    $.ajax(getPageUrl).success(function (response) {
        params.page = params.page || 1;
        getPagination(params.page, response);
    }).error(function (e) {
        console.log(e.statusText);
    });


    var t = null;
    $(window).resize(function () {
        _this.lazyLoad();
        clearTimeout(t);
        t = setTimeout(function () {
            _this.Masonry(responseCount())
        }, 300)
    })


})(jQuery);

//分类编辑、创建
(function ($) {

    $.fn.editClasses = function () {

        $(this).find('>li').each(function () {
            var _this = $(this),
                editBtn = _this.find('.icon-edit'),
                delBtn = _this.find('.icon-delete'),
                sureBtn = _this.find('.sure'),
                cancelBtn = _this.find('.cancel'),
                className = _this.find('.className'),
                input = _this.find('input');

            editBtn.click(function (e) {
                e.stopPropagation();
                _this.addClass('edit');
                setTimeout(function () {
                    input.focus();
                }, 500)
            });

            delBtn.click(function () {
                if (confirm('是否删除该分类，删除后不可恢复')) {
                    _this.remove();
                }
            });

            sureBtn.click(function (e) {
                e.stopPropagation();
                if (input.val()) {
                    className.text(input.val());
                    _this.removeClass('edit');
                } else {
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
                if (event.keyCode == 13) {
                    sureBtn.trigger('click');
                } else if (event.keyCode == 27) {
                    cancelBtn.trigger('click');
                }
            })

        })

    };

    $.fn.createClasses = function () {
        var _this, newClasses;

        _this = $(this);
        var init = function () {
            _this.find('option[value!="新建"]').each(function (index, element) {
                $(this).attr('selected', true);
                return false;
            });
        };
        init();
        _this.change(function () {
            console.log(_this.val());
            if (_this.val().indexOf('新建') != -1) {
                var c = prompt('创建分类 (可以为中文、英文、下划线)', '');
                if (c) {
                    _this.append('<option value="' + c + '">' + c + '</option>');
                    _this.val(c);
                } else {
                    init();
                }
            }
        })
    };

    $.fn.fileUpload = function () {
        var _this       = $(this),
            fileInput   = _this.find('input[type="file"]'),
            previewList = _this.find('.preview-list'),
            classSelect = _this.find('select');

        fileInput.change(function () {
            var files = $(this)[0].files;
            previewList.empty();

            $.each(files, function(index, file){
                var url = window.URL.createObjectURL(file);
                previewList.append('<li class="cc-x6">'+
                    '    <div class="cc-x24">'+
                    '        <img src="'+url+'" alt="">'+
                    '        <div class="progressbar">'+
                    '            <div class="progress-all"></div>'+
                    '            <div class="progress-now"></div>'+
                    '            <img class="success-icon" src="images/success.png" alt="">'+
                    '        </div>'+
                    '    </div>'+
                    '</li>');
            });
        });

        _this.on('submit', function(event){
            event.stopPropagation();

            var previewLi = previewList.find('>li');

            try{
                if(window.FormData) {
                    var files = fileInput[0].files;
                    $.each(files,function (index, element) {

                        var formData = new FormData();

                        formData.append('upload', element);

                        var xhr = new XMLHttpRequest();

                        xhr.open('POST', '/upload?c='+classSelect.val());
                        xhr.upload.addEventListener("progress", function(event){
                            if (event.lengthComputable) {
                                var complete = (event.loaded / event.total * 100 | 0);
                                previewLi.eq(index).find('.progress-now').css('width', complete+"%");
                            }
                        }, false);
                        // 定义上传完成后的回调函数
                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                previewLi.eq(index).addClass('success');
                                console.log(JSON.parse(xhr.response));
                            } else {
                                console.log('出错了');
                            }
                        };
                        xhr.send(formData);
                    });




                    /*$.ajax({
                        url: '/upload',
                        type: 'POST',
                        data: formData,
                        processData: false,  // tell jQuery not to process the data
                        contentType: false
                    }).success(function(response){
                        console.log(response);
                    })*/
                }else{
                    alert('浏览器不支持html5属性');
                }
            }catch(e){
                console.log(e);
            }
            return false;
        });
    }

})(jQuery);



