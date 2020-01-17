var BubbleShoot = window.BubbleShoot || {};
BubbleShoot.Game = (function($){
	var Game = function(){
		var curBubble;
		var board;
		var numBubbles;
		var bubbles = []; // tablica z kulkami w grze
		var MAX_BUBBLES = 70; // Liczba kulek
		var POINTS_PER_BUBBLE = 50; // Punkty za każdą zbitą kulkę
		var level = 0; // aktywny poziom gracza
		var score = 0; // aktualny wynik
		var endScore = 0; // wynik do wyświetlenia w oknie końcowym
		var highScore = 0; // najwyższy wynik
		var MAX_ROWS = 11; // dozwolona liczba zajętych wierszy
		this.init = function(){
			$(".butStartGame").bind("click",startGame);
		};
		var startGame = function(){
			$(".butStartGame").unbind("click");
			numBubbles = MAX_BUBBLES - level*5; // początek gry/poziomu, za każdym poziomem punktów 5 mniej
			BubbleShoot.ui.hideDialog();
			curBubble = getNextBubble();
			board = new BubbleShoot.Board();
			bubbles = board.getBubbles(); // zawartość planszy zasila tablicę
			BubbleShoot.ui.drawBoard(board);
			$("#game").bind("click",clickGameScreen);
			// wyniki i poziom wyświetlane przy starcie gry
			BubbleShoot.ui.drawScore(score); 
			BubbleShoot.ui.drawLevel(level);
		};
		var getNextBubble = function(){
			var bubble = BubbleShoot.Bubble.create();
			bubbles.push(bubble); // dodanie wystrzeliwanej kulki do tablicy
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
				var group = board.getGroup(curBubble,{}); // sprawdzamy grupy kulek i mniejsze niż trzy kulki pomijamy
				if(group.list.length >= 3){
					// sprawdzenie  czy powstały nowe sieroty
					popBubbles(group.list,duration); // czy nie zostały nowe osierocone kulki
					var orphans = board.findOrphans(); // pobranie osieroconych kulek
					var delay = duration + 200 + 30 * group.list.length; // obliczamy opóźnienie
					dropBubbles(orphans,delay); // medoda powodująca usunięcie sierot
					var popped = [].concat(group.list,orphans); // lista osieroconych i pękniętych kulek
					var points = popped.length * POINTS_PER_BUBBLE; // ilość elementów * punkt za kulkę
					score += points; // dodanie punktów
					setTimeout(function(){
						BubbleShoot.ui.drawScore(score);
					},delay); // zmiana wyniku po pęknięciu kulek
				}
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
			// zakończenie gry
			if(board.getRows().length > MAX_ROWS){
				endGame(false); // wykorzystanie wszystkich wierszy
			}else if(numBubbles == 0){
				endGame(false); // liczba dostępnych kulek
			}else if(board.isEmpty()){
				endGame(true); // pusta tablica z kulkami
			}else{
				curBubble = getNextBubble(board); // wywołanie funkcji wystrzelenia nowej kulki
			}

		};
		
		var popBubbles = function(bubbles,delay){
			// sprawdzenie w pęttli każdej kulki w tablicy i wywołujemy metodę popBubbleAt która wskazuje, że kulka ma być usunięta
			$.each(bubbles,function(){
				var bubble = this;
				setTimeout(function(){
					bubble.animatePop(); // metoda zmieniająca pozycję tła
				},delay);
				board.popBubbleAt(this.getRow(),this.getCol());
				setTimeout(function(){
					bubble.getSprite().remove();
				},delay + 200);
				delay += 60; // opóźnienie znikania kulki
			});
		};
		// usunięcie sierot - spadną z ekranu, w parametrze lista kulek i opóźnienie
		var dropBubbles = function(bubbles,delay){
			$.each(bubbles,function(){
				var bubble = this;
				board.popBubbleAt(bubble.getRow(),bubble.getCol()); // usunięcie kulek z planszy
				setTimeout(function(){
					bubble.getSprite().animate({
						top:1000
					},1000);
				},delay); // animacja spadania kulek
			});
		};
		// wyświetlenie końca gry
		var endGame = function(hasWon){
			endScore = score;
			if(score > highScore){
				highScore = score;
				$("#newHighScore").show();
				BubbleShoot.ui.drawHighScore(highScore);
				if(window.localStorage){
					localStorage.setItem("highScore",highScore);
				}
			}else{
				$("#newHighScore").hide();
			};
			if(hasWon){
				level++;
			}else{
				score = 0;
				level = 0;
			};
			$(".butStartGame").click("click",startGame);
			$("#board .bubble").remove();
			BubbleShoot.ui.endGame(hasWon,score, endScore);
		};

	};
	return Game;
})(jQuery);

