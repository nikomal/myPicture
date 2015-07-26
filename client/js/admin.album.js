/**
 * 分类管理
 * 管理端通过拖拽分类来改变分类在展示页面的排序
 */

//1.加载分类列表方法 /loadAlbumList
//2.根据分类加载照片方法 /loadPics
//3.拖拽分类列表方法 /dragAlbum
//4.更新分类列表顺序方法 /updataAlbumSort
//5.新增分类方法        /addAlbum
//6.删除分类方法        /deleteAlbum
//7.修改分类名称        /updataAlbumName
admin.album=(function(){
	//----------------------BEGIN 模块域变量---------------------------
	var
			stateMap={
				$container:null,
				dragTimer:null//延迟执行定时器 防止点击时触发拖拽
			},
			jqueryMap={},
			loadAlbums,loadPics,dragAlbum,updateAlbumSort,addAlbum,deleteAlbum,updateAlbumName,
			onmousedownAlbum,onmouseupAlbum,
			setJqueryMap,initModule
			;
	//----------------------END   模块域变量---------------------------

	//----------------------BEGIN  工具方法 ---------------------------
	dragAlbum=function(ev){
		var
			$this=$(ev.target ),
			$mirror=$this.clone(),
			$albums=jqueryMap.$albums,
			$nearObj=null;
		$this.css({
			opacity:0.2,
			filter:'alpha(opacity=20)'
		});

		$mirror.css({
			position:'absolute',
			width:$this.width(),
			height:$this.height(),
			left:$this.position().left,
			top:$this.position().top,
			zIndex:9999
		});

		jqueryMap.$container.append($mirror);
		$mirror.copyFromNode =$this[0];

		ev.target=$mirror;


		var drag=new Drag({
			$obj:$mirror,
			dragMove:function(drag){//拖拽时的回调
				$nearObj&&($nearObj.css( {
					position : 'static'
				}));

				$nearObj=drag.utils.getNearObj(drag.stateMap.$obj,$albums,[drag.stateMap.$obj.copyFromNode]);

				$nearObj&&($nearObj.css({position : 'relative'}),$nearObj.animate( {
					top     : 10
				}));

			},
			dragUp:function(drag){
				$mirror.remove();
				$this.css({
					opacity:1,
					filter:'alpha(opacity=100)'
				});
				if($nearObj){
					$nearObj.before($this);
					$nearObj.css( {
						position : 'static'
					});
					$nearObj=null;
				}
			}
		}).init().bindFnDown(ev);

		return drag;
	};
	//----------------------END    工具方法 ---------------------------

	//----------------------BEGIN  DOM相关方法------------------------
	setJqueryMap=function(){
		var $container=stateMap.$container;
		jqueryMap={
			$container:$container,
			$albums:$container.children()
		};
	};
	//----------------------END    DOM相关方法------------------------

	//----------------------BEGIN  事件处理   ------------------------
	onmousedownAlbum=function(ev){
		clearTimeout(stateMap.dragTimer);
		stateMap.dragTimer=setTimeout(function(){
			dragAlbum(ev);
		},150);
		return true;
	};
	onmouseupAlbum=function(){
		clearTimeout(stateMap.dragTimer);
	};
	//----------------------END    事件处理   ------------------------

	//----------------------BEGIN  公开方法   ------------------------
	initModule=function($container){
		stateMap.$container=$container;
		setJqueryMap();

		jqueryMap.$container.on('mousedown','li',onmousedownAlbum);
		jqueryMap.$container.on('mouseup','li',onmouseupAlbum);
	}
	//----------------------END    公开方法   ------------------------
	return {initModule:initModule};
}());





