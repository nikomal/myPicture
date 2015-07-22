# 相册管理器

这是一个相册管理器，以nodejs为后台语言写的

- **支持瀑布流**
- **支持响应式（部分，有待完善）**
- **图片批量上传**
- ***HTML5浏览器支持**

-------------------


## Nodejs 开放的api接口

> /?c=girl 。 返回这个分类下面的所有图片对象列表，对象包含原图片的大小和URL

> /getImage/?path=/girl/20150227194035_rVtUF.jpeg&width=230&height=306.  根据传入的width和height返回图片的大小（可选）。path图片的路径（必须）
> 

本编辑器支持 **Markdown Extra** , 　扩展了很多好用的功能。具体请参考[Github][2].  


##用法

 1. clone整个项目，图片分类在uploads下面以文件夹形式进行的。
 3. 必须安装nodejs，然后命令行进入项目目录，输入npm install 安装完整依赖。
 4. 命令行输入node app.js运行，端口默认是8881，可以自己修改。

---------

##感谢

感谢[zhangyuanwei](https://github.com/zhangyuanwei)提供的images图片处理库。