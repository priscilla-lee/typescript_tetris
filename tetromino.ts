/************************************************************************
* TETROMINO: stores shape, an array of blocks, and methods
*			 contains, canMove, move, canRotate, rotate, add, & remove
************************************************************************/
class Tetromino {
	public shape: Shape;
	public blocks: Block[];
	public grid: Grid;
	private _ghost: Ghost;

	public constructor(shape: Shape, grid: Grid) {
		this.shape = shape;
		this.grid = grid;
		this.blocks = Tetromino.getBlocks(this.shape, this, this.grid.numCols);
		this._ghost = new Ghost(this);
	}

	public reset(): void {  //reset position
		this.blocks = Tetromino.getBlocks(this.shape, this, this.grid.numCols);
		this._ghost.reset(); 
	}

	public contains(r: number, c: number): boolean {
		var inGhost: boolean = this._ghost.contains(r,c);
		for (var i in this.blocks) {
			var inBlocks = this.blocks[i].equals(r,c);
			if (inBlocks || inGhost) {
				return true;
			}
		} return false;
	}

	private _canMove(dir: Direction): boolean {
		for (var i in this.blocks) {
			if (!this.blocks[i].canMove(dir)) {
				return false;
			}
		} return true;
	}

	public move(dir: Direction): void {
		if (this._canMove(dir)) {
			this.remove();  
			for (var i in this.blocks) {
				this.blocks[i].move(dir);
			}
			this.add(); 
		}
	}

	private _canRotate(): boolean {
		for (var b in this.blocks) {
			if (!this.blocks[b].canRotate()) {
				return false;
			}
		} return true;
	}

	public rotate(): void {
		if (this._canRotate()) {
			this.remove(); 
			for (var b in this.blocks) {
				this.blocks[b].rotate();
			}
			this.add(); 
		}
	}

	public add(): void {
		for (var i in this.blocks) {
			var b = this.blocks[i];
			this.grid.set(b.r, b.c, this.shape);
		}
	}

	public remove(): void {
		for (var i in this.blocks) {
			var b = this.blocks[i];
			this.grid.set(b.r, b.c, Shape.Empty);
		}
	}

	public fall(): boolean {
		if (this._canMove(Direction.Down)) {
			this.move(Direction.Down);
			return true;
		}
		return false;
	}

	public drop(): void {
		while(this.fall());
	}

	public getGhost(): Ghost {
		return this._ghost.update();
	}

	public static getBlocks(shape: Shape, T: Tetromino, numCols: number): Block[] {
		//center, top position
		var mid: number = Math.floor(numCols/2)-1; //integer division, truncates
		var shift: number = mid-1; //shifted for 4-wide or 3-wide tetrominos

		var i: number = shift;
		var j: number = shift; 
		var l: number = shift; 
		var s: number = shift; 
		var t: number = shift; 
		var z: number = shift; 
		var o: number = mid;

		var top: number = NUM_TOP_ROWS - 1; //shifted for top rows

		switch(shape) {
			case Shape.I: return [new Block(0+top,i+1,T), new Block(0+top,i+0,T), new Block(0+top,i+2,T), new Block(0+top,i+3,T)];
			case Shape.J: return [new Block(1+top,j+1,T), new Block(0+top,j+0,T), new Block(1+top,j+0,T), new Block(1+top,j+2,T)];
			case Shape.L: return [new Block(1+top,l+1,T), new Block(0+top,l+2,T), new Block(1+top,l+0,T), new Block(1+top,l+2,T)];
			case Shape.O: return [new Block(0+top,o+0,T), new Block(0+top,o+1,T), new Block(1+top,o+0,T), new Block(1+top,o+1,T)];
			case Shape.S: return [new Block(0+top,s+1,T), new Block(0+top,s+2,T), new Block(1+top,s+0,T), new Block(1+top,s+1,T)];
			case Shape.T: return [new Block(1+top,t+1,T), new Block(0+top,t+1,T), new Block(1+top,t+0,T), new Block(1+top,t+2,T)];
			case Shape.Z: return [new Block(0+top,z+1,T), new Block(0+top,z+0,T), new Block(1+top,z+1,T), new Block(1+top,z+2,T)];
			case Shape.Ghost: return [new Block(-1,-1,T), new Block(-1,-1,T), new Block(-1,-1,T), new Block(-1,-1,T)];
		}
	}
}

/************************************************************************
* GHOST: stores blocks, parent Tetromino, also contains methods
*		 calculate, reset, and contains
************************************************************************/
class Ghost {
	public blocks: Block[];
	private _tetromino: Tetromino;

	public constructor(tetromino: Tetromino) {
		this._tetromino = tetromino;
	}

	public update(): Ghost { //calculates, updates, and returns Ghost
		// deep copy
		var ghost: Block[] = []; 
		for (var i in this._tetromino.blocks) { 
			var b = this._tetromino.blocks[i];
			ghost.push(new Block(b.r, b.c, this._tetromino));
		} 

		//hard drop
		outer: while (true) { 
			for (var i in ghost) //if all can fall, make all fall
				if (!ghost[i].canMove(Direction.Down)) break outer; 
			for (var i in ghost) ghost[i].r++; 				
		} 

		//update ghostBlocks
		this.blocks = ghost; 
		return this;
	}

	public reset(): void { //position
		this.blocks = Tetromino.getBlocks(Shape.Ghost, this._tetromino, this._tetromino.grid.numCols);
	}

	public contains(r: number, c: number): boolean {
		for (var i in this.blocks) {
			var inGhost = this.blocks[i].equals(r,c);
			if (inGhost) return true;
		} return false;
	}
}

/************************************************************************
* BLOCK: stores row, col, parent Tetromino, also contains methods
*		 equals, canMove, move, canRotate, rotate
************************************************************************/
class Block {
	public r: number;
	public c: number;
	private _T: Tetromino;

	public constructor(row: number, col: number, T: Tetromino) {
		this.r = row;
		this.c = col;
		this._T = T;
	}

	public equals(r: number, c: number): boolean {
		return (this.r==r && this.c==c);		
	}

	public canMove(dir: Direction): boolean {
		var newR: number = this.r;
		var newC: number = this.c;

		switch (dir) {
			case Direction.Down: newR = this.r+1; break;
			case Direction.Left: newC = this.c-1; break;
			case Direction.Right: newC = this.c+1; break;
		}

		return (this._T.contains(newR, newC) || this._T.grid.isValidEmpty(newR, newC));
	}

	public move(dir: Direction): void {
		switch (dir) {
			case Direction.Down: this.r++; break;
			case Direction.Left: this.c--; break;
			case Direction.Right: this.c++; break;
		}
	}

	public canRotate(): boolean {
		if (this._T.shape == Shape.O) {
			return true; //squares don't rotate
		}

		//first block is pivot
		var pivot: Block = this._T.blocks[0]; 

		var newR: number = (this.c - pivot.c) + pivot.r;    
		var newC: number = -(this.r - pivot.r) + pivot.c;		

		return (this._T.contains(newR, newC) || this._T.grid.isValidEmpty(newR, newC));
	}

	public rotate(): void {
		if (this._T.shape == Shape.O) {
			return; //squares don't rotate
		}

		//first block is pivot
		var pivot: Block = this._T.blocks[0]; 

		var newC: number = -(this.r - pivot.r) + pivot.c;
		var newR: number = (this.c - pivot.c) + pivot.r;   

		this.c = newC;
		this.r = newR;
	}
}