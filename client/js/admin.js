/**
 * 后台管理
 * */
var admin=(function(){
	var initModule=function($container){
		admin.album.initModule($container);
	};
	return {initModule:initModule};
}());