/************************************************************************
* GAME: game logic, loop, start, play, pause, etc
************************************************************************/
class Game {
	public started;
	public loop;
	public playing;
	public randomPieces;
	public current;
	public held;
	public limitHold;
	public grid;

	public constructor(grid) {
		this.started = false;
		this.loop = null;
		this.playing = false;
		this.randomPieces = new RandomPieces();
		this.current;
		this.held;
		this.limitHold = false;
		this.grid = grid;
	}

	public start() {
		this.started = true;
		this.nextPiece();
		this.play();
	}
	public play() {
		this.loop = setInterval(() => this.step(), delay); 
		console.log("PLAY this: " + this + " /t self: " + self);
		this.playing = true;
	}
	public pause() {
		clearInterval(this.loop);
		this.playing = false;
	}
	public step() {
		//self.current.drawGhost();
		console.log("STEP this: " + this + " /t self: " + self);
		this.current.draw();
		if (!this.current.fall()) this.nextPiece();	
		render.next(); //next_draw.all();
	}
	public nextPiece() {
		var next = this.randomPieces.getNext();
		this.current = new Tetromino(next);
		this.current.add(); this.current.draw();
		this.limitHold = false;
		this.grid.collapseFullRows();
		//this.current.drawGhost();
		this.current.draw();
	}
	public move(dir) {
		this.current.move(dir);
	}
	public rotate() {
		this.current.rotate();
	}
	public drop() {
		this.current.drop();
		this.nextPiece();
	}
	public hold() {
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
			var next = this.randomPieces.getNext();
			this.current = new Tetromino(next);
			this.current.add(); this.current.draw();
		}
	}
	public keyPressed() {
		render.next(); //next_draw.all();
		render.hold(); //hold_draw.all(); 
		//this.current.drawGhost();
		this.current.draw();
	}
}

/************************************************************************
* RANDOM PIECE GENERATOR: 7 bag method
************************************************************************/
class RandomPieces {
	private _list;
	public bag;
	public constructor() {
		this.bag = new Bag();
		this._list = this.bag.batch();
	}
	public getList() {
		return this._list;
	}
	public getNext(number=1) {
		if (this._list.length < 7 ) //maintain 7 random pieces
			this._list.push(this.bag.select());
		var next = this._list.shift(); //removes first and shifts everything down
		return next;
	}
}

class Bag {
	public pieces;
	public constructor() {
		this.pieces = ["I", "J", "L", "O", "S", "T", "Z"];
	} 
	public select() {
		if (this.pieces.length == 0) this.replenish();
		var randomIndex = Math.floor(Math.random() * this.pieces.length);
		var selected = this.pieces[randomIndex];
		this.pieces.splice(randomIndex, 1);
		return selected;
	}
	public replenish() {
		this.pieces = ["I", "J", "L", "O", "S", "T", "Z"];
	}
	public batch() { //returns an array (a "batch") of 7 pieces
		var batch = [];
		for (var i = 0; i < 7; i++) 
			batch.push(this.select());
		return batch;
	}
}

console.log("loaded game.js successfully");