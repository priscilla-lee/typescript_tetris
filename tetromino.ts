/************************************************************************
* TETROMINO: stores shape, an array of blocks, and methods
*			 contains, canMove, move, canRotate, rotate, add, & remove
************************************************************************/
class Tetromino {
	public shape;
	public blocks;
	public ghostBlocks;
	public constructor(shape) {
		this.shape = shape;
		this.blocks = Tetromino.getBlocks(this.shape, this);
		this.ghostBlocks = Tetromino.getBlocks("ghost", this);
	}
	public resetPosition = function() {
		this.blocks = Tetromino.getBlocks(this.shape, this);
	}
	public contains(r,c) {
		for (var i in this.blocks) {
			var inBlocks = this.blocks[i].equals(r,c);
			var inGhost = this.ghostBlocks[i].equals(r,c);
			if (inBlocks || inGhost) return true;
		} return false;
	}
	private _canMove(dir) {
		for (var i in this.blocks) {
			if (!this.blocks[i].canMove(dir)) return false;
		} return true;
	}
	public move(dir) {
		if (this._canMove(dir)) {
			this.remove(); this.erase();
			for (var i in this.blocks) this.blocks[i].move(dir);
			this.add(); this.draw();
			return true;
		} //else console.log("can't move " + dir);
		return false;
	}
	private _canRotate() {
		for (var b in this.blocks) {
			if (!this.blocks[b].canRotate()) return false;
		} return true;
	}
	public rotate() {
		if (this._canRotate()) {
			this.remove(); this.erase();
			for (var b in this.blocks) this.blocks[b].rotate();
			this.add(); this.draw();
		} //else console.log("can't rotate");
	}
	public add() {
		for (var i in this.blocks) {
			var b = this.blocks[i];
			grid[b.r][b.c] = this.shape;
		}
	}
	public remove() {
		for (var i in this.blocks) {
			var b = this.blocks[i];
			grid[b.r][b.c] = ".";
		}
	}
	public draw() {
		this.drawGhost();
		for (var i in this.blocks) this.blocks[i].draw();
	}
	public erase() {
		for (var a = 0; a < 5; a++) {
			for (var i in this.blocks) 
				this.blocks[i].erase();
		} //erase 5 times to eliminate blur trails
		this.eraseGhost();
	}
	public fall() {
		return this.move("down");
	}
	public drop() {
		while(this.fall());
	}
	public eraseGhost() {
		this.calcGhost();
		for (var i in this.ghostBlocks) {
			var g = this.ghostBlocks[i]
			/*board_draw.*/ render.block(g.r, g.c, "."); 
		}
	}
	public drawGhost() {
		this.calcGhost();
		for (var i in this.ghostBlocks) {
			var g = this.ghostBlocks[i];
			/*board_draw.*/ render.block(g.r, g.c, "ghost");
		}
	}
	public resetGhost() {
		this.ghostBlocks = Tetromino.getBlocks("ghost", this);
	}
	public calcGhost() {
		var ghost = []; //make deep copy of blocks
		for (var i in this.blocks) { 
			var b = this.blocks[i];
			ghost.push(new Block(b.r, b.c, this));
		} 
		outer: while (true) { //hard drop
			for (var i in ghost) //if all can fall, make all fall
				if (!ghost[i].canMove("down")) break outer; 
			for (var i in ghost) ghost[i].r++; 				
		} 
		this.ghostBlocks = ghost; //update ghostBlocks
	}
	public static getBlocks(shape, T) {
		//center, top position
		var mid = Math.floor(cols/2)-1; //integer division, truncates
		var shift = mid-1; //shifted for 4-wide or 3-wide tetrominos
		var i=shift, j=shift, l=shift, s=shift, t=shift, z=shift, o=mid;
		var t = topRows -1; //shifted for top rows

		switch(shape) {
			case 'I': return [new Block(0+t,i+1,T), new Block(0+t,i+0,T), new Block(0+t,i+2,T), new Block(0+t,i+3,T)];
			case 'J': return [new Block(1+t,j+1,T), new Block(0+t,j+0,T), new Block(1+t,j+0,T), new Block(1+t,j+2,T)];
			case 'L': return [new Block(1+t,l+1,T), new Block(0+t,l+2,T), new Block(1+t,l+0,T), new Block(1+t,l+2,T)];
			case 'O': return [new Block(0+t,o+0,T), new Block(0+t,o+1,T), new Block(1+t,o+0,T), new Block(1+t,o+1,T)];
			case 'S': return [new Block(0+t,s+1,T), new Block(0+t,s+2,T), new Block(1+t,s+0,T), new Block(1+t,s+1,T)];
			case 'T': return [new Block(1+t,t+1,T), new Block(0+t,t+1,T), new Block(1+t,t+0,T), new Block(1+t,t+2,T)];
			case 'Z': return [new Block(0+t,z+1,T), new Block(0+t,z+0,T), new Block(1+t,z+1,T), new Block(1+t,z+2,T)];
			case 'ghost': return [new Block(-1,-1,T), new Block(-1,-1,T), new Block(-1,-1,T), new Block(-1,-1,T)];
		}
	}
}

/************************************************************************
* BLOCK: stores row, col, parent Tetromino, also contains methods
*		 equals, canMove, move, canRotate, rotate, draw, & erase
************************************************************************/
class Block {
	public r;
	public c;
	public T;
	public constructor(row, col, T) {
		this.r = row;
		this.c = col;
		this.T = T;
	}
	public equals(r,c) {
		return (this.r==r && this.c==c);		
	}
	public canMove(dir) {
		var newR = this.r;
		var newC = this.c;
		if (dir == "down") {newR = this.r+1;}
		if (dir == "left") {newC = this.c-1;}
		if (dir == "right") {newC = this.c+1;}	
		return (this.T.contains(newR, newC) || grid.isValidEmpty(newR, newC));
	}
	public move(dir) {
		if (dir == "down") {this.r++;}
		if (dir == "left") {this.c--;}
		if (dir == "right") {this.c++;}
	}
	public canRotate() {
		if (this.T.shape == "O") return true; //squares don't rotate
		var pivot = this.T.blocks[0]; //first block is pivot
		var newR = (this.c - pivot.c) + pivot.r;    
		var newC = -(this.r - pivot.r) + pivot.c;		
		return (this.T.contains(newR, newC) || grid.isValidEmpty(newR, newC));
	}
	public rotate() {
		if (this.T.shape == "O") return; //squares don't rotate
		var pivot = this.T.blocks[0]; //first block is pivot
		var newC = -(this.r - pivot.r) + pivot.c;
		var newR = (this.c - pivot.c) + pivot.r;    
		this.c = newC;
		this.r = newR;
	}
	public draw() {
		if (this.r >= topRows)
			/*board_draw.*/ render.block(this.r, this.c, this.T.shape);
	}
	public erase() {
		if (this.r >= topRows) 
			/*board_draw.*/ render.block(this.r, this.c, ".");
	}
}

console.log("loaded tetromino.js successfully");