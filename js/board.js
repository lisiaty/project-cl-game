var BubbleShoot = window.BubbleShoot || {};
BubbleShoot.Board = (function($) {
    var NUM_ROWS = 9; // 9
    var NUM_COLS = 32; // 32
    var Board = function() {
        var that = this;
        var rows = createLayout();
        this.getRows = function() { return rows;};
        this.addBubble = function(bubble,coords){
			var rowNum = Math.floor(coords.y / BubbleShoot.ui.ROW_HEIGHT);
			var colNum = coords.x / BubbleShoot.ui.BUBBLE_DIMS * 2;
			if(rowNum % 2 == 1)
				colNum -= 1;
			colNum = Math.round(colNum/2) * 2;
			if(rowNum % 2 == 0)
				colNum -= 1;
			if(!rows[rowNum])
				rows[rowNum] = [];
			rows[rowNum][colNum] = bubble; // dodanie kulki na odpowiednie miejsce
			bubble.setRow(rowNum);// przekazanie do bubble obliczony rząd
			bubble.setCol(colNum);// przekazanie do bubble obliczoną kolumnę
		};
		// metoda zwraca kulkę na danej pozycji, null oznacza brak kulki
		this.getBubbleAt = function(rowNum,colNum){
			if(!this.getRows()[rowNum])
				return null;
			return this.getRows()[rowNum][colNum];
		};
		// metoda przechodzi po rzędach sąsiadujących i sprawdza sąsiadujące kolumny czy są kulki
		this.getBubblesAround = function(curRow,curCol){
			var bubbles = [];
			for(var rowNum = curRow - 1;rowNum <= curRow+1; rowNum++){
				for(var colNum = curCol-2; colNum <= curCol+2; colNum++){
					var bubbleAt = that.getBubbleAt(rowNum,colNum);
					if(bubbleAt && !(colNum == curCol && rowNum == curRow))
						bubbles.push(bubbleAt); // sprawdzenie czy jest kulka na sąsiednim i czy to nie jest kulka wokół której sprawdzamy kulki sąsiednie
				};
			};
			return bubbles;
		};
		// Tworzenie grup o tym samym kolorze
		this.getGroup = function(bubble,found,differentColor){
			// differentColor sprawdza osierocone kulki
			var curRow = bubble.getRow();
			if(!found[curRow]) // jeśli obiekt found nie ma wpisu dla danej pozycji tworzymy pustą tablicę
				found[curRow] = {};
			if(!found.list) // jeśli nie istnieje właściwość list musimy ją stworzyć
				found.list = [];
			if(found[curRow][bubble.getCol()]){
				return found; // jeśli dana kulka została już wykryta to nie dodajemy jej ponownie
			}
			// w przeciwnym razie zaznaczamy, że lokalizacja sprawdzona i dodajemy kulkę do listy
			found[curRow][bubble.getCol()] = bubble;
			found.list.push(bubble);
			var curCol = bubble.getCol();
			var surrounding = that.getBubblesAround(curRow,curCol); // pobieramy otaczające kulki
			for(var i=0;i<surrounding.length;i++){
				var bubbleAt = surrounding[i];
				// jeżeli kulki są tego samego koloru to funkcja wywoła samą siebie przekazując ostatnio znalezioną kulkę i aktualne dane
				if(bubbleAt.getType() == bubble.getType() || differentColor){
					found = that.getGroup(bubbleAt,found,differentColor);
				};
			};
			return found;
		};
		// metoda wskazująca, że kulka ma być usunięta
		this.popBubbleAt = function(rowNum,colNum){
			var row = rows[rowNum];
			delete row[colNum];
		};

		// metoda poszukiwania sierot
		this.findOrphans = function(){
			var connected = []; // lokalizacja połączonych kulek
			var groups = []; // wszystkie znalezione grupy kulek
			var rows = that.getRows();
			for(var i=0;i<rows.length;i++){
				connected[i] = [];
			};
			for(var i=0;i<rows[0].length;i++){
				var bubble = that.getBubbleAt(0,i);
				if(bubble && !connected[0][i]){
					var group = that.getGroup(bubble,{},true);
					$.each(group.list,function(){
						connected[this.getRow()][this.getCol()] = true;
					});
				};
			};
			var orphaned = []; // lista osieroconych kulek
			// sprawdzamy wszystkie rzędy i kolumny czy jest tam kulka, jeżeli jest kulka a nie ma jej w tablicy połączonych kulek to sierota
			for(var i=0;i<rows.length;i++){
				for(var j=0;j<rows[i].length;j++){
					var bubble = that.getBubbleAt(i,j);
					if(bubble && !connected[i][j]){
						orphaned.push(bubble);
					};
				};
			};
			return orphaned;
		};
		// metoda zwraca wszystkie kulki z rzędów i kolumn
		this.getBubbles = function(){
			var bubbles = [];
			var rows = this.getRows();
			for(var i=0;i<rows.length;i++){
				var row = rows[i];
				for(var j=0;j<row.length;j++){
					var bubble = row[j];
					if(bubble){
						bubbles.push(bubble);
					};
				};
			};
			return bubbles;
		};
		// metoda sprawdzania czy plansza pusta
		this.isEmpty = function(){
			return this.getBubbles().length == 0;
		};
        return this;
    };
    var createLayout = function(){
		var rows = [];
		for(var i=0;i<NUM_ROWS;i++){
			var row = [];
			var startCol = i%2 == 0 ? 1 : 0; // 1 : 0
			for(var j=startCol;j<NUM_COLS;j+=2){
				var bubble = BubbleShoot.Bubble.create(i,j);
				row[j] = bubble;
			};
			rows.push(row);
		};
		return rows;
	};
    return Board;
})(jQuery);