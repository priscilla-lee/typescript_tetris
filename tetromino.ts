

/************************************************************************
* TETROMINO: stores shape, an array of blocks, and methods
*			 contains, canMove, move, canRotate, rotate, add, & remove
************************************************************************/
class Tetromino {
	public shape: Shape;
	public blocks: Block[];
	public ghost: Ghost;
	public constructor(shape: Shape) {
		this.shape = shape;
		this.blocks = Tetromino.getBlocks(this.shape, this);
		this.ghost = new Ghost(this);
	}
	public reset(): void {  //reset position
		this.blocks = Tetromino.getBlocks(this.shape, this);
		this.ghost.reset(); 
	}
	public contains(r: number, c: number): boolean {
		var inGhost: boolean = this.ghost.contains(r,c);
		for (var i in this.blocks) {
			var inBlocks = this.blocks[i].equals(r,c);
			if (inBlocks || inGhost) return true;
		} return false;
	}
	private _canMove(dir: Direction): boolean {
		for (var i in this.blocks) {
			if (!this.blocks[i].canMove(dir)) return false;
		} return true;
	}
	public move(dir: Direction): boolean {
		if (this._canMove(dir)) {
			this.remove(); 
			render.eraseTetromino(this); 
			for (var i in this.blocks) this.blocks[i].move(dir);
			this.add(); 
			render.drawTetromino(this); 
			return true;
		} //else console.log("can't move " + dir);
		return false;
	}
	private _canRotate(): boolean {
		for (var b in this.blocks) {
			if (!this.blocks[b].canRotate()) return false;
		} return true;
	}
	public rotate(): void {
		if (this._canRotate()) {
			this.remove(); 
			render.eraseTetromino(this); 
			for (var b in this.blocks) this.blocks[b].rotate();
			this.add(); 
			render.drawTetromino(this); 
		} //else console.log("can't rotate");
	}
	public add(): void {
		for (var i in this.blocks) {
			var b = this.blocks[i];
			grid.set(b.r, b.c, this.shape);
		}
	}
	public remove(): void {
		for (var i in this.blocks) {
			var b = this.blocks[i];
			grid.set(b.r, b.c, Shape.Empty);
		}
	}
	public fall(): boolean {
		return this.move(Direction.Down);
	}
	public drop(): void {
		while(this.fall());
	}
	public getGhost(): Ghost {
		return this.ghost.calculate();
	}
	public static getBlocks(shape: Shape, T: Tetromino): any {
		//center, top position
		var mid: number = Math.floor(cols/2)-1; //integer division, truncates
		var shift: number = mid-1; //shifted for 4-wide or 3-wide tetrominos

		var i: number = shift;
		var j: number = shift; 
		var l: number = shift; 
		var s: number = shift; 
		var t: number = shift; 
		var z: number = shift; 
		var o: number = mid;

		var t: number = NUM_TOP_ROWS -1; //shifted for top rows

		switch(shape) {
			case Shape.I: return [new Block(0+t,i+1,T), new Block(0+t,i+0,T), new Block(0+t,i+2,T), new Block(0+t,i+3,T)];
			case Shape.J: return [new Block(1+t,j+1,T), new Block(0+t,j+0,T), new Block(1+t,j+0,T), new Block(1+t,j+2,T)];
			case Shape.L: return [new Block(1+t,l+1,T), new Block(0+t,l+2,T), new Block(1+t,l+0,T), new Block(1+t,l+2,T)];
			case Shape.O: return [new Block(0+t,o+0,T), new Block(0+t,o+1,T), new Block(1+t,o+0,T), new Block(1+t,o+1,T)];
			case Shape.S: return [new Block(0+t,s+1,T), new Block(0+t,s+2,T), new Block(1+t,s+0,T), new Block(1+t,s+1,T)];
			case Shape.T: return [new Block(1+t,t+1,T), new Block(0+t,t+1,T), new Block(1+t,t+0,T), new Block(1+t,t+2,T)];
			case Shape.Z: return [new Block(0+t,z+1,T), new Block(0+t,z+0,T), new Block(1+t,z+1,T), new Block(1+t,z+2,T)];
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
	public calculate(): Ghost {
		var ghost: Block[] = []; //make deep copy of tetromino blocks
		for (var i in this._tetromino.blocks) { 
			var b = this._tetromino.blocks[i];
			ghost.push(new Block(b.r, b.c, this._tetromino));
		} 
		outer: while (true) { //hard drop
			for (var i in ghost) //if all can fall, make all fall
				if (!ghost[i].canMove(Direction.Down)) break outer; 
			for (var i in ghost) ghost[i].r++; 				
		} 
		this.blocks = ghost; //update ghostBlocks
		return this;
	}
	public reset(): void { //position
		this.blocks = Tetromino.getBlocks(Shape.Ghost, this._tetromino);
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
		if (dir == Direction.Down) {newR = this.r+1;}
		if (dir == Direction.Left) {newC = this.c-1;}
		if (dir == Direction.Right) {newC = this.c+1;}	
		return (this._T.contains(newR, newC) || grid.isValidEmpty(newR, newC));
	}
	public move(dir: Direction): void {
		if (dir == Direction.Down) {this.r++;}
		if (dir == Direction.Left) {this.c--;}
		if (dir == Direction.Right) {this.c++;}
	}
	public canRotate(): boolean {
		if (this._T.shape == Shape.O) return true; //squares don't rotate
		var pivot: Block = this._T.blocks[0]; //first block is pivot
		var newR: number = (this.c - pivot.c) + pivot.r;    
		var newC: number = -(this.r - pivot.r) + pivot.c;		
		return (this._T.contains(newR, newC) || grid.isValidEmpty(newR, newC));
	}
	public rotate(): void {
		if (this._T.shape == Shape.O) return; //squares don't rotate
		var pivot: Block = this._T.blocks[0]; //first block is pivot
		var newC: number = -(this.r - pivot.r) + pivot.c;
		var newR: number = (this.c - pivot.c) + pivot.r;    
		this.c = newC;
		this.r = newR;
	}
}

console.log("loaded tetromino.js successfully");