var BubbleShoot = window.BubbleShoot || {};
BubbleShoot.Game = (function($){
	var Game = function(){
		this.init = function(){
			$(".butStartGame").bind("click",startGame);
		};
		var startGame = function(){
			$(".butStartGame").unbind("click");
			BubbleShoot.ui.hideDialog();
		};
	};
	return Game;
})(jQuery);