var BubbleShoot = window.BubbleShoot || {};
BubbleShoot.Game = (function($){
	var Game = function(){
		var curBubble;
		var board;
		var numBubbles;
		var MAX_BUBBLES = 70; // Liczba kulek
		this.init = function(){
			$(".butStartGame").bind("click",startGame);
		};
		var startGame = function(){
			$(".butStartGame").unbind("click");
			numBubbles = MAX_BUBBLES; // początek gry
			BubbleShoot.ui.hideDialog();
			curBubble = getNextBubble();
			board = new BubbleShoot.Board();
			BubbleShoot.ui.drawBoard(board);
			$("#game").bind("click",clickGameScreen);
		};
		var getNextBubble = function(){
			var bubble = BubbleShoot.Bubble.create();
			bubble.getSprite().addClass("curBubble");
			$("#board").append(bubble.getSprite());
			BubbleShoot.ui.drawBubblesRemaining(numBubbles); //wyświetlenie ilości kulek
			numBubbles--;
			return bubble;
		};
		var clickGameScreen = function(e){
			var angle = BubbleShoot.ui.getBubbleAngle(curBubble.getSprite(),e);
			var duration = 750;
			var distance = 1000;
			//reagowanie na kolizję
			var collision = BubbleShoot.CollisionDetector.findIntersection(curBubble,
				board,angle);
			if(collision){
				var coords = collision.coords;
				// Do obliczenia zmiany prędkości dane z kolizji
				duration = Math.round(duration * collision.distToCollision / distance);
				board.addBubble(curBubble,coords);
			
			}else{
			var distX = Math.sin(angle) * distance;
			var distY = Math.cos(angle) * distance;
			var bubbleCoords = BubbleShoot.ui.getBubbleCoords(curBubble.
				getSprite());
			var coords = {
				x : bubbleCoords.left + distX,
				y : bubbleCoords.top - distY
			};
		};
			BubbleShoot.ui.fireBubble(curBubble,coords,duration);
			curBubble = getNextBubble(); // wywołanie funkcji wystrzelenia nowej kulki
		};
	
	};
	return Game;
})(jQuery);

