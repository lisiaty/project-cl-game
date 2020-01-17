var BubbleShoot = window.BubbleShoot || {};
BubbleShoot.Bubble = (function($){
	var Bubble = function(row, col, type, sprite){
		var that = this;
		this.getType = function() {return type;};
		this.getSprite = function(){ return sprite;};
		this.getCol = function() {return col;};
		this.setCol = function(colIn) {col = colIn;};// relatywna pozycja na planszy
		this.getRow = function() {return row;};
		this.setRow = function(rowIn) {row = rowIn;};// relatywna pozycja na planszy
		//metoda dająca koordynaty kulki
		this.getCoords = function(){
			var coords = {
				// liczba kolumny * 1/2 szerokości wystrzelonej kulki + połowa wymiaru kulki, aby uzyskać środek
				left : that.getCol() * BubbleShoot.ui.BUBBLE_DIMS/2 +
				BubbleShoot.ui.BUBBLE_DIMS/2,
				// numer rzędu * wysokość rzędu + jw.
				top : that.getRow() * BubbleShoot.ui.ROW_HEIGHT + BubbleShoot.
					ui.BUBBLE_DIMS/2
			};
			return coords;
		}
		//Animacja rozwalenia kulki
		this.animatePop = function(){
			var top = type * that.getSprite().height(); // sprawdzanie z jaką kulką pracujemy, aby wybrać odpowiednie tło do wybuchu
			this.getSprite().css(Modernizr.prefixed("transform"),"rotate(" + (Math.
				random() * 360) + "deg)"); // animacja
			// opóźnienie każdej kolejnej klatki animacji i przesuwamy obrazek w lewo
			setTimeout(function(){
				that.getSprite().css("background-position","-50px -" + top + "px");
			},125);
			setTimeout(function(){
				that.getSprite().css("background-position","-100px -" + top + "px");
			},150);
			setTimeout(function(){
				that.getSprite().css("background-position","-150px -" + top + "px");
			},175);
			setTimeout(function(){
				that.getSprite().remove(); // usunięcie kulki z DOM
			},200);
		};


	};
	Bubble.create = function(rowNum, colNum, type){
		if (type === undefined) {
			type = Math.floor(Math.random() * 4);
		};
		var sprite = $(document.createElement("div"));
		sprite.addClass("bubble");
		sprite.addClass("bubble_" + type);
		var bubble = new Bubble(rowNum, colNum, type, sprite);
		return bubble;
	};
	return Bubble;
})(jQuery);