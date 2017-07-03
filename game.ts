enum Direction {
	Up, Down, Left, Right
}

enum Shape {
	I, J, L, O, S, T, Z, Ghost, Empty
}

/************************************************************************
* GAME: game logic, loop, start, play, pause, etc
************************************************************************/
class Game {
	public started: boolean;
	public loop: number;
	public playing: boolean;
	public randomPieces: RandomPieces;
	public current: Tetromino;
	public held: Tetromino;
	public limitHold: boolean; // limit: can't swap twice in a row
	public grid: Grid;

	public constructor(grid: Grid) {
		this.started = false;
		this.loop = null;
		this.playing = false;
		this.randomPieces = new RandomPieces();
		this.current;
		this.held;
		this.limitHold = false;
		this.grid = grid;
	}

	public start(): void {
		this.started = true;
		this._nextPiece();
		this.play();
	}
	public play(): void {
		this.loop = setInterval(() => this.step(), delay);
		this.playing = true;
	}
	public pause(): void {
		clearInterval(this.loop);
		this.playing = false;
	}
	public step(): void {
		//self.current.drawGhost();
		render.drawTetromino(this.current); 
		if (!this.current.fall()) this._nextPiece();	
		render.next();
	}
	private _nextPiece(): void {
		var next: Shape = this.randomPieces.getNext();
		this.current = new Tetromino(next);
		this.current.add(); 
		render.drawTetromino(this.current); 
		this.limitHold = false;
		this.grid.collapseFullRows();
		//this.current.drawGhost();
		render.drawTetromino(this.current); 
	}
	public move(dir: Direction): void {
		this.current.move(dir);
	}
	public rotate(): void {
		this.current.rotate();
	}
	public drop(): void {
		this.current.drop();
		this._nextPiece();
	}
	public hold(): void {
		//limit hold swaps
		if (this.limitHold) return; 
		else this.limitHold = true;

		if (this.held) {
			//remmove & erase current
			this.current.remove(); 
			render.eraseTetromino(this.current); 
			//add & draw held
			this.held.reset();
			this.held.add(); 
			render.drawTetromino(this.held); 
			//swap
			var temp: Tetromino = this.held; 
			this.held = this.current;
			this.current = temp;
		} else {
			//erase current & put in hold
			this.current.remove(); 
			render.eraseTetromino(this.current); 
			this.held = this.current;
			//draw from next list
			var next: Shape = this.randomPieces.getNext();
			this.current = new Tetromino(next);
			this.current.add(); 
			render.drawTetromino(this.current); 
		}
	}
	public keyPressed(): void {
		render.next(); 
		render.hold();  
		//this.current.drawGhost();
		render.drawTetromino(this.current); 
	}
}

/************************************************************************
* RANDOM PIECE GENERATOR: 7 bag method
************************************************************************/
class RandomPieces {
	private _pieces: Shape[];
	private _bag: Shape[];
	public constructor() {
		this._bag = [];
		this._pieces = [];

		// fill list of pieces
		for (var i = 0; i < NUM_NEXT_PIECES; i++) {
			this._pieces.push(this._select());
		}
	}
	private _select(): Shape { // pieces one at a time from bag
		if (this._bag.length == 0) {
			this._bag = [Shape.I, Shape.J, Shape.L, Shape.O, Shape.S, Shape.T, Shape.Z];
		}
		var randomIndex: number = Math.floor(Math.random() * this._bag.length);
		var selected: Shape = this._bag[randomIndex];
		this._bag.splice(randomIndex, 1);
		return selected;
	}
	public getNext(): Shape { 
		// remove first piece from list, shift everything down, add a new piece (maintain number)
		var next: Shape = this._pieces.shift();
		this._pieces.push(this._select());
		return next;
	}
	public getList(): Shape[] {
		return this._pieces;		
	}
}

console.log("loaded game.js successfully");