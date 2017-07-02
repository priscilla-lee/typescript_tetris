/************************************************************************
* TETROMINO: stores shape, an array of blocks, and methods
*			 contains, canMove, move, canRotate, rotate, add, & remove
************************************************************************/
/*public*/ function Tetromino(shape) {
	this.shape = shape;
	this.blocks = TBlocks(shape, this);
	this.ghostBlocks = TBlocks("ghost", this);
	this.resetPosition = function() {
		this.blocks = TBlocks(shape, this);
	};
	this.contains = function(r,c) {
		for (var i in this.blocks) {
			var inBlocks = this.blocks[i].equals(r,c);
			var inGhost = this.ghostBlocks[i].equals(r,c);
			if (inBlocks || inGhost) return true;
		} return false;
	};
	this.canMove = function(dir) {
		for (var i in this.blocks) {
			if (!this.blocks[i].canMove(dir)) return false;
		} return true;
	};
	this.move = function(dir) {
		if (this.canMove(dir)) {
			this.remove(); this.erase();
			for (var i in this.blocks) this.blocks[i].move(dir);
			this.add(); this.draw();
			return true;
		} //else console.log("can't move " + dir);
		return false;
	};
	this.canRotate = function() {
		for (var b in this.blocks) {
			if (!this.blocks[b].canRotate()) return false;
		} return true;
	};
	this.rotate = function() {
		if (this.canRotate()) {
			this.remove(); this.erase();
			for (var b in this.blocks) this.blocks[b].rotate();
			this.add(); this.draw();
		} //else console.log("can't rotate");
	};
	this.add = function() {
		for (var i in this.blocks) {
			var b = this.blocks[i];
			grid[b.r][b.c] = this.shape;
		}
	};
	this.remove = function() {
		for (var i in this.blocks) {
			var b = this.blocks[i];
			grid[b.r][b.c] = ".";
		}
	};
	this.draw = function() {
		this.drawGhost();
		for (var i in this.blocks) this.blocks[i].draw();
	};
	this.erase = function() {
		for (var a = 0; a < 5; a++) {
			for (var i in this.blocks) 
				this.blocks[i].erase();
		} //erase 5 times to eliminate blur trails
		this.eraseGhost();
	};
	this.fall = function() {
		return this.move("down");
	};
	this.drop = function() {
		while(this.fall());
	};
	this.eraseGhost = function() {
		this.calcGhost();
		for (var i in this.ghostBlocks) {
			var g = this.ghostBlocks[i]
			board_draw.block(g.r, g.c, "."); 
		}
	};
	this.drawGhost = function() {
		this.calcGhost();
		for (var i in this.ghostBlocks) {
			var g = this.ghostBlocks[i];
			board_draw.block(g.r, g.c, "ghost");
		}
	};
	this.resetGhost = function() {
		this.ghostBlocks = TBlocks("ghost", this);
	};
	this.calcGhost = function() {
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
	};
}

/*private*/ function TBlocks(shape, T) {
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

/************************************************************************
* BLOCK: stores row, col, parent Tetromino, also contains methods
*		 equals, canMove, move, canRotate, rotate, draw, & erase
************************************************************************/
class Block {
	public r;
	public c;
	public T;
	constructor(row, col, T) {
		this.r = row;
		this.c = col;
		this.T = T;
	}
	equals(r,c) {
		return (this.r==r && this.c==c);		
	}
	canMove(dir) {
		var newR = this.r;
		var newC = this.c;
		if (dir == "down") {newR = this.r+1;}
		if (dir == "left") {newC = this.c-1;}
		if (dir == "right") {newC = this.c+1;}	
		return (this.T.contains(newR, newC) || grid.isValidEmpty(newR, newC));
	}
	move(dir) {
		if (dir == "down") {this.r++;}
		if (dir == "left") {this.c--;}
		if (dir == "right") {this.c++;}
	}
	canRotate() {
		if (this.T.shape == "O") return true; //squares don't rotate
		var pivot = this.T.blocks[0]; //first block is pivot
		var newR = (this.c - pivot.c) + pivot.r;    
		var newC = -(this.r - pivot.r) + pivot.c;		
		return (this.T.contains(newR, newC) || grid.isValidEmpty(newR, newC));
	}
	rotate() {
		if (this.T.shape == "O") return; //squares don't rotate
		var pivot = this.T.blocks[0]; //first block is pivot
		var newC = -(this.r - pivot.r) + pivot.c;
		var newR = (this.c - pivot.c) + pivot.r;    
		this.c = newC;
		this.r = newR;
	}
	draw() {
		if (this.r >= topRows)
			board_draw.block(this.r, this.c, this.T.shape);
	}
	erase() {
		if (this.r >= topRows) 
			board_draw.block(this.r, this.c, ".");
	}
}

console.log("loaded tetromino.js successfully");