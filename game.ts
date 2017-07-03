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
		this._nextPiece();
		this.play();
	}
	public play() {
		this.loop = setInterval(() => this.step(), delay);
		this.playing = true;
	}
	public pause() {
		clearInterval(this.loop);
		this.playing = false;
	}
	public step() {
		//self.current.drawGhost();
		this.current.draw();
		if (!this.current.fall()) this._nextPiece();	
		render.next(); //next_draw.all();
	}
	private _nextPiece() {
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
		this._nextPiece();
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
	private _bag;
	public constructor() {
		this._bag = new Bag();
		this._list = this._bag.batch();
	}
	public getList() {
		return this._list;
	}
	public getNext(number=1) {
		if (this._list.length < Bag.MAX_CAPACITY ) //maintain 7 random pieces
			this._list.push(this._bag.select());
		var next = this._list.shift(); //removes first and shifts everything down
		return next;
	}
}

class Bag {
	public static MAX_CAPACITY = 7;
	private _pieces;
	public constructor() {
		this._pieces = ["I", "J", "L", "O", "S", "T", "Z"];
	} 
	public select() {
		if (this._pieces.length == 0) this._replenish();
		var randomIndex = Math.floor(Math.random() * this._pieces.length);
		var selected = this._pieces[randomIndex];
		this._pieces.splice(randomIndex, 1);
		return selected;
	}
	private _replenish() {
		this._pieces = ["I", "J", "L", "O", "S", "T", "Z"];
	}
	public batch() { //returns an array (a "batch") of 7 pieces
		var batch = [];
		for (var i = 0; i < 7; i++) 
			batch.push(this.select());
		return batch;
	}
}

console.log("loaded game.js successfully");