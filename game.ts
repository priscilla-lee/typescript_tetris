/************************************************************************
* GAME: game logic, loop, start, play, pause, etc
************************************************************************/
function Game(grid) {
	var self = this;
	this.started = false;
	this.loop = null;
	this.playing = false;
	this.randomPieces = new RandomPieces();
	this.current;
	this.held;
	this.limitHold = false;
	this.grid = grid;

	this.start = function() {
		this.started = true;
		this.nextPiece();
		this.play();
	};
	this.play = function() {
		this.loop = setInterval(this.step, delay);
		this.playing = true;
	};
	this.pause = function() {
		clearInterval(this.loop);
		this.playing = false;
	};
	this.step = function() {
		//self.current.drawGhost();
		self.current.draw();
		if (!self.current.fall()) self.nextPiece();	
		next_draw.all();
	};	
	this.nextPiece = function() {
		var next = this.randomPieces.next();
		this.current = new Tetromino(next);
		this.current.add(); this.current.draw();
		this.limitHold = false;
		this.grid.collapseFullRows();
		//this.current.drawGhost();
		this.current.draw();
	};
	this.move = function(dir) {
		this.current.move(dir);
	};
	this.rotate = function() {
		this.current.rotate();
	};
	this.drop = function() {
		this.current.drop();
		this.nextPiece();
	};
	this.hold = function() {
		//limit hold swaps
		if (this.limitHold) return; 
		else this.limitHold = true;

		if (this.held) {
			//remmove & erase current
			this.current.remove(); 
			this.current.erase();
			//add & draw held
			this.held.resetPosition();
			this.held.add(); 
			this.held.resetGhost(); 
			this.held.draw();
			//swap
			var temp = this.held; 
			this.held = this.current;
			this.current = temp;
		} else {
			//erase current & put in hold
			this.current.remove(); this.current.erase();
			this.held = this.current;
			//draw from next list
			var next = this.randomPieces.next();
			this.current = new Tetromino(next);
			this.current.add(); this.current.draw();
		}
	};
	this.keyPressed = function() {
		next_draw.all();
		hold_draw.all(); 
		//this.current.drawGhost();
		this.current.draw();
	};
}

/************************************************************************
* RANDOM PIECE GENERATOR: 7 bag method
************************************************************************/
/*public*/ function RandomPieces() {
	var bag = new Bag();
	this.list = bag.batch();
	this.next = function() {
		if (this.list.length < 7 ) //maintain 7 random pieces
			this.list.push(bag.select());
		var next = this.list.shift(); //removes first and shifts everything down
		return next;
	};


	/*private*/ function Bag() {
		this.pieces = ["I", "J", "L", "O", "S", "T", "Z"];
		this.select = function() {
			if (this.pieces.length == 0) this.replenish();
			var randomIndex = Math.floor(Math.random() * this.pieces.length);
			var selected = this.pieces[randomIndex];
			this.pieces.splice(randomIndex, 1);
			return selected;
		};
		this.replenish = function() {
			this.pieces = ["I", "J", "L", "O", "S", "T", "Z"];
		};
		this.batch = function() { //returns an array (a "batch") of 7 pieces
			var batch = [];
			for (var i = 0; i < 7; i++) 
				batch.push(this.select());
			return batch;
		};
	}
}

console.log("loaded game.js successfully");