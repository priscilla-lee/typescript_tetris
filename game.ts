/************************************************************************
* GAME: game logic, loop, start, play, pause, etc
************************************************************************/
class Game {
	private _loop: number;
	private _randomPieces: RandomPieces;
	private _current: Tetromino;
	private _held: Tetromino;
	private _limitHold: boolean; // limit: can't swap twice in a row
	private _numCols: number;
	private _numRows: number;
	private _grid: Grid;
	private _render: Render;
	private _delay: number;
	public playing: boolean;
	public started: boolean;
	public keys: Keys;

	public constructor(render: Render, keys: Keys) {
		this.started = false;
		this._loop = null;
		this.playing = false;
		this._randomPieces = new RandomPieces();
		this._current;
		this._held;
		this._limitHold = false;
		this._numCols = render.numCols;
		this._numRows = render.numRows;
		this._grid = new Grid(this._numCols, this._numRows);
		this._render = render;
		this.keys = keys;
		this._delay = INITIAL_DELAY;
	}

	public start(): void {
		this.started = true;
		this._nextPiece();
		this.play();
	}

	public play(): void {
		this._loop = setInterval(() => this.step(), this._delay);
		this.playing = true;
	}

	public pause(): void {
		clearInterval(this._loop);
		this.playing = false;
	}

	public step(): void {
		//self.current.drawGhost();
		this._render.eraseTetromino(this._current); 
		if (!this._current.fall()) {
			this._nextPiece();	
		}
		this._render.drawTetromino(this._current); 
	}

	private _nextPiece(): void {
		var next: Shape = this._randomPieces.getNext();
		this._current = new Tetromino(next, this._grid);
		this._current.add(); 
		this._render.drawTetromino(this._current); 
		this._limitHold = false;

		// collapse rows & speed up
		var numCollapsedRows: number = this._grid.collapseFullRows();
		if (numCollapsedRows > 0) {
			this._delay -= DELAY_DECREMENT * numCollapsedRows; 
			clearInterval(this._loop);
			this._loop = setInterval(() => this.step(), this._delay);
			console.log(this._delay);
		}

		this._render.updateBoard(this._grid);
		//this.current.drawGhost();
		this._render.drawTetromino(this._current);
		this._render.updateNext(this._randomPieces.getList());
	}

	public move(dir: Direction): void {
		this._render.eraseTetromino(this._current); 
		this._current.move(dir);
		this._render.drawTetromino(this._current); 
	}

	public rotate(): void {
		this._render.eraseTetromino(this._current);
		this._current.rotate();
		this._render.drawTetromino(this._current); 
	}

	public drop(): void {
		this._current.drop();
		this._nextPiece();
	}

	public hold(): void {
		//limit hold swaps
		if (this._limitHold) return; 
		else this._limitHold = true;

		if (this._held) {
			//remmove & erase current
			this._current.remove(); 
			this._render.eraseTetromino(this._current); 
			//add & draw held
			this._held.reset();
			this._held.add(); 
			this._render.drawTetromino(this._held); 
			//swap
			var temp: Tetromino = this._held; 
			this._held = this._current;
			this._current = temp;
		} else {
			//erase current & put in hold
			this._current.remove(); 
			this._render.eraseTetromino(this._current); 
			this._held = this._current;
			//draw from next list
			var next: Shape = this._randomPieces.getNext();
			this._current = new Tetromino(next, this._grid);
			this._current.add(); 
			this._render.drawTetromino(this._current); 
		}
		this._render.updateHold(this._held.shape);
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