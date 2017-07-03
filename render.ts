var cols = 10; //width
var rows = 20; //height
var unit = 20; //size of block on grid

var NUM_TOP_ROWS = 5; //invisible rows at top, not shown

var scale = {
	board: {
		x: unit*4, y: 0,
		size: unit, //size of block 
		weight: unit/10, //line weight of block
		outer: unit/5, mid: unit/7, inner: unit*0.8, ctn: unit/5 //bezel thicknesses
	},
	hold: {
		x: unit*0.5, y: unit*2,
		outer: unit/5, mid: unit/3, inner: 0, ctn: 0
	},
	next: {
		x: unit*(6+cols), y: unit*2,
		outer: unit/5, mid: unit/3, inner: 0, ctn: 0
	},
	box_lg: {
		size: unit*0.8,
		weight: unit/10*0.8,
		box: unit*0.9*4 //size of containing box
	},
	box_md: {
		size: unit*0.7,
		weight: unit/10*0.7,
		box: unit*0.8*4
	},
	box_sm: {
		size: unit*0.6,
		weight: unit/10*0.6,
		box: unit*0.7*4,
		offset: unit*0.2
	}
};

class Dimensions {
	public static next() {
		var box = scale["box_md"].box;

		var n = scale.next;
		n.X = n.outer + n.mid + n.inner + n.ctn;
		n.Y = n.outer + n.mid + n.inner + n.ctn;

		var o = scale["box_sm"].offset;

		var h = box*5 + 2*(n.Y) + o;
		var w = box + 2*(n.X);

		return {height: h, width: w};
	}
	public static hold() {
		var box = scale["box_md"].box;

		var h = scale.hold;
		h.X = h.outer + h.mid + h.inner + h.ctn;
		h.Y = h.outer + h.mid + h.inner + h.ctn;

		var hei = box + 2*(h.Y);
		var w = box + 2*(h.X);

		return {height: hei, width: w};
	}
	public static board() {
		var b = scale.board;
		b.X = b.outer + b.mid + b.inner + b.ctn;
		b.Y = b.outer + b.mid + b.inner + b.ctn;

		var h = rows*b.size + 2*(b.Y);
		var w =  cols*b.size + 2*(b.X);

		return {height: h, width: w};
	}
}

class Render {
	public element;
	public rows;
	public cols;
	public constructor(canvas) {//, rows, cols) {
		this.element = canvas;
		// this.rows = rows;
		// this.cols = cols;
	}
	public next() {
		var box = scale["box_md"].box;

		var n = scale.next;
		n.X = n.outer + n.mid + n.inner + n.ctn;
		n.Y = n.outer + n.mid + n.inner + n.ctn;

		var o = scale["box_sm"].offset;

		var height = box*5 + 2*(n.Y) + o;
		var width = box + 2*(n.X);

		n.X += n.x; n.Y += n.y;

		var array = game.randomPieces.getList(); 

		// "all" function
		CanvasUtil.bezel(this.element, "next", width, height);
		array = game.randomPieces.getList(); //update
		//draw 1 medium box
		var boxDraw = new BoxDraw(this.element, "box_md", n.X+0, n.Y, array[0]);
		boxDraw.box();
		//draw 4 smaller boxes
		for (var i = 1; i < 5; i++) {
			var boxDraw = new BoxDraw(this.element, "box_sm", n.X+o+0, n.Y+2*o+box*i, array[i]);
			boxDraw.box();
		}
	}
	public hold() {
		var box = scale["box_md"].box;

		var h = scale.hold;
		h.X = h.outer + h.mid + h.inner + h.ctn;
		h.Y = h.outer + h.mid + h.inner + h.ctn;

		var height = box + 2*(h.Y);
		var width = box + 2*(h.X);

		h.X += h.x; h.Y += h.y;

		// "all" function
		CanvasUtil.bezel(this.element, "hold", width, height);
		if (game.held) {
			var boxDraw = new BoxDraw(this.element, "box_md", h.X+0, h.Y+0, game.held.shape);
			boxDraw.box();			
		} else {
			var boxDraw = new BoxDraw(this.element, "box_md", h.X+0, h.Y+0, ".");
			boxDraw.empty();
		}
	}
	public board() {
		var b = scale.board;
		b.X = b.outer + b.mid + b.inner + b.ctn;
		b.Y = b.outer + b.mid + b.inner + b.ctn;

		var height = rows*b.size + 2*(b.Y);
		var width =  cols*b.size + 2*(b.X);

		b.X += b.x; b.Y += b.y;

		// "all" function
		CanvasUtil.bezel(this.element, "board", width, height);
		for (var r = NUM_TOP_ROWS; r < rows + NUM_TOP_ROWS; r++) {
			for (var c = 0; c < cols; c++) 
				this.block(r, c, grid[r][c]);
		}	
	}
	public block(r, c, shape) {
		// duplicate beginning
		var b = scale.board;
		b.X = b.outer + b.mid + b.inner + b.ctn;
		b.Y = b.outer + b.mid + b.inner + b.ctn;

		var height = rows*b.size + 2*(b.Y);
		var width =  cols*b.size + 2*(b.X);

		b.X += b.x; b.Y += b.y;
		// duplicate end

		var size = scale.board.size;
		var top = NUM_TOP_ROWS*size;
		CanvasUtil.square(this.element, "board", c*size+b.X, r*size+b.Y-top, shape);
	}
	public emptyFrame() {}
	public clearBoard() {}
	public clearHold() {}
	public clearNext() {}
	public updateNext(tetrominos) {}
	public updateHold(tetromino) {}
	public updateBoard(grid) {}
	public eraseTetromino(tetromino: Tetromino) {
		for (var a = 0; a < 5; a++) {
			for (var i in tetromino.blocks) {
				var block = tetromino.blocks[i];
				if (block.r >= NUM_TOP_ROWS) {
					render.block(block.r, block.c, ".");
				}
			}
		} //erase 5 times to eliminate blur trails
		render._eraseGhost(tetromino);
	}
	public drawTetromino(tetromino: Tetromino) {
		render._drawGhost(tetromino);
		for (var i in tetromino.blocks) {
			var block = tetromino.blocks[i];
			if (block.r >= NUM_TOP_ROWS) {
				render.block(block.r, block.c, block.T.shape);
			}
		}
	}
	private _eraseGhost(tetromino: Tetromino) {
		var ghostBlocks = tetromino.getGhost().blocks;
		for (var i in ghostBlocks) {
			var g = ghostBlocks[i]
			render.block(g.r, g.c, "."); 
		}

	}
	private _drawGhost(tetromino: Tetromino) {
		var ghostBlocks = tetromino.getGhost().blocks;
		for (var i in ghostBlocks) {
			var g = ghostBlocks[i];
			render.block(g.r, g.c, "ghost");
		}

	}
}

/************************************************************************
* CanvasUtil: (rendering) set board canvas w x h, draw block & board
************************************************************************/
class CanvasUtil {
	public static rect(element, x, y, w, h, weight, fill, line) {
		var ctx= element.getContext("2d");
			ctx.beginPath();
			ctx.fillStyle = fill;
			ctx.strokeStyle = line;
			ctx.fillRect(x, y, w, h);
			ctx.lineWidth = weight;
			ctx.rect(x, y, w, h);
			if (weight != 0) ctx.stroke();
	}
	public static square(element, scal, x, y, shape) {
		var size = scale[scal].size;
		var weight = scale[scal].weight;

		var otln = color[shape].outline;
		var fill = color[shape].fill;
		var shd = color[shape].shade;
		var hlgt = color[shape].highlight;
		var twkl = color[shape].twinkle;

		//outline
		this.rect(element, x, y, size, size, 0, otln, otln);
		//outer rectangle
		this.rect(element, x+(size*0.05), y+(size*0.05), size*0.9, size*0.9, 0, fill, fill);
		//inner rectangle
		this.rect(element, x+(size*0.25), y+(size*0.25), size*0.5, size*0.5, weight, shd, hlgt);
		//twinkle
		this.rect(element, x+(size*0.1), y+(size*0.1), size*0.1, size*0.1, 0, twkl, twkl);
	}
	public static squareImage(element, img, x, y, w, h) {
	    var ctx = element.getContext("2d");
	   		ctx.drawImage(img,10,10,10,10);
	}
	public static circle(element, x, y, r, fill, line) {
		var ctx = element.getContext("2d");
			ctx.beginPath();
			ctx.fillStyle = fill;
			ctx.strokeStyle = line;
			ctx.arc(x, y, r, 0, 2*Math.PI);
			ctx.fill();
			ctx.stroke();
	}
	public static box(element, scal, x, y) {
		var size = scale[scal].box;
		var weight = scale[scal].weight;
		var fill = color["."].fill;
		// this.rect(loc, x, y, size, size, weight, fill, "black");
		this.roundRect(element, x, y, size, size, unit/3, "black");
		this.roundRect(element, x+(size*0.05), y+(size*0.05), size*0.9, size*0.9, unit/4, fill);
	}
	public static roundRect(element, x, y, w, h, r, color) {
		var ctx = element.getContext("2d");
			ctx.beginPath();
			ctx.fillStyle = color;
			// ctx.strokeStyle = "red";
			// ctx.lineWidth = 10;
			//draw rounded rectangle
			ctx.moveTo(x + r, y);
			ctx.lineTo(x + w - r, y);
			ctx.quadraticCurveTo(x + w, y, x + w, y + r);
			ctx.lineTo(x + w, y + h - r);
			ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
			ctx.lineTo(x + r, y + h);
			ctx.quadraticCurveTo(x, y + h, x, y + h - r);
			ctx.lineTo(x, y + r);
			ctx.quadraticCurveTo(x, y, x + r, y);
			ctx.closePath();
			//stroke & fill	
			ctx.fill();    
			// ctx.stroke();  
	}
	public static bezel(element, loc, w, h) {
		// var w = loc.width;
		// var h = loc.height;

		var x = scale[loc].x;
		var y = scale[loc].y;		

		var otr = scale[loc].outer;
		var mid = scale[loc].mid;
		var inr = scale[loc].inner;
		var ctn = scale[loc].ctn;

		var o = otr;
		var m = otr + mid;
		var i = otr + mid + inr;
		var c = otr + mid + inr + ctn;

		if (otr != 0) this.roundRect(element, x+0, y+0, w, h, unit*0.9, "#666"); //outer
		if (mid != 0) this.roundRect(element, x+o, y+o, w-(o*2), h-(o*2), unit*0.8, "#f9f9f9"); //mid
		if (inr != 0) this.roundRect(element, x+m, y+m, w-(m*2), h-(m*2), unit*0.7, "#ddd"); //inner
		if (ctn != 0) this.roundRect(element, x+i, y+i, w-(i*2), h-(i*2), unit*0.4, "#000"); //container
		//this.roundRect(element, x+c, y+c, w-(c*2), h-(c*2), unit*0.4, "rgba(0,0,0,0)"); //transparent inside
	}
}

class BoxDraw {
	public element;
	public scal
	public x;
	public y;
	private _shape;
	public dimensions;

	public constructor(element, scal, x, y, shape) {
		this.element = element;
		this.scal = scal;
		this.x = x;
		this.y = y;
		this._shape = shape;
		this.dimensions = {
			I: {w: 4, h: 1}, J: {w: 3, h: 2}, L: {w: 3, h: 2}, O: {w: 2, h: 2}, 
			S: {w: 3, h: 2}, T: {w: 3, h: 2}, Z: {w: 3, h: 2}
		};
	}
	public box() {
		this.empty();
		this.shape();
	}
	public empty() {
		CanvasUtil.box(this.element, this.scal, this.x, this.y);
	}
	public shape() {
		var coords = this._getShapeCoords();
		for (var i in coords)
			CanvasUtil.square(this.element, this.scal, coords[i].X, coords[i].Y, this._shape);
	}
	private _getCenterCoord() {
		var dim = this.dimensions[this._shape];
		var box = scale[this.scal].box;
		var size = scale[this.scal].size;

		var xCenter = this.x + (box - size*dim.w)/2; //depends on width
		var yCenter = this.y + (box - size*dim.h)/2; //depends on height

		return {X: xCenter, Y: yCenter};
	}
	private _getShapeCoords() {
		var s = scale[this.scal].size;
		var ctr = this._getCenterCoord();
		var x = ctr.X, y = ctr.Y;
		switch (this._shape) {
			case 'I': return [{X:x, Y:y}, {X:x+s, Y:y}, {X:x+(2*s), Y:y}, {X:x+(3*s), Y:y}];
			case 'J': return [{X:x, Y:y}, {X:x, Y:y+s}, {X:x+s, Y:y+s}, {X:x+(2*s), Y:y+s}];
			case 'L': return [{X:x, Y:y+s}, {X:x+s, Y:y+s}, {X:x+(2*s), Y:y+s}, {X:x+(2*s), Y:y}];
			case 'O': return [{X:x, Y:y}, {X:x+s, Y:y}, {X:x+s, Y:y+s}, {X:x, Y:y+s}];
			case 'S': return [{X:x, Y:y+s}, {X:x+s, Y:y+s}, {X:x+s, Y:y}, {X:x+(2*s), Y:y}];
			case 'T': return [{X:x+s, Y:y}, {X:x, Y:y+s}, {X:x+s, Y:y+s}, {X:x+(2*s), Y:y+s}];
			case 'Z': return [{X:x, Y:y}, {X:x+s, Y:y}, {X:x+s, Y:y+s}, {X:x+(2*s), Y:y+s}];
		}
	}
}

console.log("loaded render.js successfully");