/**
 * 简单拖拽
 * 拖拽元素边距等其他因素的影响
 */
function Drag(cfg){
	this.cfg = {
		$obj:null,//要绑定的对象
		isChildDrag:false,//是否启用子元素拖拽,设置为true时必须设置dragSelector选项
		dragSelector:null, //子元素选择器
		dragDown:null, //拖拽前的回调
		dragMove:null,//拖拽时的回调
		dragUp:null//拖拽结束时的回调
	};

	$.extend(this.cfg,cfg);
	this.stateMap={
		$obj:null,
		disX:0,
		disY:0
	};
}
Drag.prototype={
	init:function(){
		var _this=this;
		if(this.cfg.isChildDrag){
			this.cfg.$obj.on('mousedown',this.cfg.dragSelector,function(ev){
				ev.stopPropagation();
				_this.bindFnDown(ev);
				return false;
			});
		}else{
			this.cfg.$obj.mousedown(function(ev){
				ev.stopPropagation();
				_this.bindFnDown(ev);
				return false;
			});
		}
		return this;
	},
	bindFnDown:function(ev){
		var _this=this,
			 $obj=$(ev.target);
		this.stateMap.$obj = $obj;

		this.cfg.dragDown&&this.cfg.dragDown(this);

		if($obj.setCapture){
			$obj.setCapture();
		}
		_this.fnDown(ev,$obj);
		$(document).mousemove(function(ev){
			_this.fnMove(ev,$obj);
		}).mouseup(function(ev){
			_this.fnUp(ev,$obj);
		});
		return this;
	},
	fnDown:function(ev,obj){
		this.stateMap.disX=ev.pageX-obj.position().left;
		this.stateMap.disY=ev.pageY-obj.position().top;
		return this;
	},
	fnMove:function(ev,obj){
		 obj.css({
			left:ev.pageX-this.stateMap.disX,
			top:ev.pageY-this.stateMap.disY
		});
		this.cfg.dragMove&&this.cfg.dragMove(this);
		return this;
	},
	fnUp:function(ev,obj){
		$(document).unbind('mousemove mouseup' );

		//释放全局捕获
		if(obj.releaseCapture){
			obj.releaseCapture();
		}
		this.cfg.dragUp&&this.cfg.dragUp(this);
		return this;
	},
	utils:{
		_this:this,
		//获取对象距离文档上下左右的距离
		getDir:function($obj){
			//或者使用这个方法 getBoundingClientRect
				var left=$obj.offset().left,
				    top =$obj.offset().top;
				return  {
					left:left,
					right:left+$obj.width(),
					top:top,
					bottom: top+$obj.height()
				};
		},
		//获取容器左上角之间的距离
		getDistance:function($obj1,$obj2){
			var a =$obj1.offset().left-$obj2.offset().left;
			var b=$obj1.offset().top-$obj2.offset().top;
			return Math.sqrt(Math.pow(a, 2)+Math.pow(b, 2));
		},
		//碰撞检测
		collisionDetection:function($obj1,$obj2){
			var
				  attr1=this.getDir($obj1),
				  attr2=this.getDir($obj2);
			if(attr1.top>attr2.bottom||attr1.right<attr2.left||attr1.bottom<attr2.top||attr1.left>attr2.right){
				return false;
			}else{
				return true;
			}
		},
		//获取距离obj最近的元素
		getNearObj:function($obj,objArry,excObjs){
			if(!excObjs){
				excObjs=[];
			}
			excObjs.push($obj[0]);
			var minValue=Infinity,
			    utils=this,
			    index=-1,
			    diffArry=$.grep(objArry, function(item){
						return $.inArray(item,excObjs) == -1;
					});
			if(diffArry.length>=1){
				$(diffArry).each(function(i){
					if(utils.collisionDetection($obj,$(diffArry[i]))){
						var c=utils.getDistance($obj, $(diffArry[i]));
						if(c<minValue){
							minValue = c;
							index = i;
						}
					}
				});
			}
			if(index!=-1) {
				return $(diffArry[index]);
			}else{
				return null;
			}

		}
	}
};



