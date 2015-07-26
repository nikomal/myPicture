# 相册管理器

这是一个相册管理器，以nodejs为后台语言写的

- **支持瀑布流**
- **支持响应式（部分，有待完善）**
- **图片批量上传**
- **HTML5浏览器支持**

-------------------


## 浏览界面  index.html

> /?c=girl&page=1 。 返回图像列表。c表示分类，空表示所有分类，page表示页数，空表示第一页。

## 管理界面  admin.html

> /?c=girl&page=1。 同上



##用法

 1. clone整个项目，图片分类在uploads下面以文件夹形式进行的。
 3. 必须安装nodejs，然后命令行进入项目目录，输入npm install 安装完整依赖。
 4. 命令行输入node app.js运行，端口默认是8881，可以自己修改。

---------

##感谢

感谢[zhangyuanwei](https://github.com/zhangyuanwei)提供的images图片处理库。
