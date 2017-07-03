var cols: number = 10; //width
var rows: number = 20; //height
var unit: number = 20; //size of block on grid

var NUM_TOP_ROWS: number = 5; //invisible rows at top, not shown
var NUM_NEXT_PIECES: number = 5; //must be less than 7

var scale: any = {
	board: {
		x: unit*4, y: 0,
		size: unit, //size of block 
		weight: unit/10, //line weight of block
		outer: unit/5, mid: unit/7, inner: unit*0.8, ctn: unit/5 //bezel thicknesses
		// "ctn" stands for container
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
	public static next(): any{
		var box: number = scale["box_md"].box;

		var n: any= scale.next;
		n.X = n.outer + n.mid + n.inner + n.ctn;
		n.Y = n.outer + n.mid + n.inner + n.ctn;

		var o: number = scale["box_sm"].offset;

		var h: number = box*NUM_NEXT_PIECES + 2*(n.Y) + o;
		var w: number = box + 2*(n.X);

		return {height: h, width: w};
	}
	public static hold(): any {
		var box: number = scale["box_md"].box;

		var h: any = scale.hold;
		h.X = h.outer + h.mid + h.inner + h.ctn;
		h.Y = h.outer + h.mid + h.inner + h.ctn;

		var hei: number = box + 2*(h.Y);
		var w: number = box + 2*(h.X);

		return {height: hei, width: w};
	}
	public static board(): any {
		var b: any = scale.board;
		b.X = b.outer + b.mid + b.inner + b.ctn;
		b.Y = b.outer + b.mid + b.inner + b.ctn;

		var h: number = rows*b.size + 2*(b.Y);
		var w: number =  cols*b.size + 2*(b.X);

		return {height: h, width: w};
	}
}

class Render {
	public element: any;
	public rows: number;
	public cols: number;
	public constructor(canvas: any) {//, rows, cols) {
		this.element = canvas;
		// this.rows = rows;
		// this.cols = cols;
	}
	public next(): void {
		var box: number = scale["box_md"].box;

		var n: any = scale.next;
		n.X = n.outer + n.mid + n.inner + n.ctn;
		n.Y = n.outer + n.mid + n.inner + n.ctn;

		var o: any = scale["box_sm"].offset;

		var height: number = box*NUM_NEXT_PIECES + 2*(n.Y) + o;
		var width: number = box + 2*(n.X);

		n.X += n.x; n.Y += n.y;

		var array: Shape[] = game.randomPieces.getList();

		// "all" function
		CanvasUtil.bezel(this.element, "next", width, height);
		array = game.randomPieces.getList(); //update
		//draw 1 medium box
		var boxDraw: BoxDraw = new BoxDraw(this.element, "box_md", n.X+0, n.Y, array[0]);
		boxDraw.box();
		//draw smaller boxes (skip the first one)
		for (var i = 1; i < array.length; i++) {
			var boxDraw = new BoxDraw(this.element, 
				"box_sm", 
				n.X+o+0, 
				n.Y+2*o+box*i, 
				array[i]);
			boxDraw.box();
		}
	}
	public hold(): void {
		var box: number = scale["box_md"].box;

		var h: any = scale.hold;
		h.X = h.outer + h.mid + h.inner + h.ctn;
		h.Y = h.outer + h.mid + h.inner + h.ctn;

		var height: number = box + 2*(h.Y);
		var width: number = box + 2*(h.X);

		h.X += h.x; h.Y += h.y;

		// "all" function
		CanvasUtil.bezel(this.element, "hold", width, height);
		if (game.held) {
			var boxDraw: BoxDraw = new BoxDraw(this.element, "box_md", h.X+0, h.Y+0, game.held.shape);
			boxDraw.box();			
		} else {
			var boxDraw: BoxDraw = new BoxDraw(this.element, "box_md", h.X+0, h.Y+0, Shape.Empty);
			boxDraw.empty();
		}
	}
	public board(): void {
		var b: any = scale.board;
		b.X = b.outer + b.mid + b.inner + b.ctn;
		b.Y = b.outer + b.mid + b.inner + b.ctn;

		var height: number = rows*b.size + 2*(b.Y);
		var width: number =  cols*b.size + 2*(b.X);

		b.X += b.x; b.Y += b.y;

		// "all" function
		CanvasUtil.bezel(this.element, "board", width, height);
		for (var r = NUM_TOP_ROWS; r < rows + NUM_TOP_ROWS; r++) {
			for (var c = 0; c < cols; c++) 
				this.block(r, c, grid.get(r,c));
		}	
	}
	public block(r: number, c: number, shape: Shape): void {
		// duplicate beginning
		var b: any = scale.board;
		b.X = b.outer + b.mid + b.inner + b.ctn;
		b.Y = b.outer + b.mid + b.inner + b.ctn;

		var height: number = rows*b.size + 2*(b.Y);
		var width: number =  cols*b.size + 2*(b.X);

		b.X += b.x; b.Y += b.y;
		// duplicate end

		var size: number = scale.board.size;
		var top: number = NUM_TOP_ROWS*size;
		CanvasUtil.square(this.element, "board", c*size+b.X, r*size+b.Y-top, shape);
	}
	public emptyFrame(): void {}
	public clearBoard(): void {}
	public clearHold(): void {}
	public clearNext(): void {}
	public updateNext(tetrominos: Tetromino[]): void {}
	public updateHold(tetromino: Tetromino): void {}
	public updateBoard(grid: Grid): void {}
	public eraseTetromino(tetromino: Tetromino): void {
		for (var a = 0; a < 5; a++) {
			for (var i in tetromino.blocks) {
				var block = tetromino.blocks[i];
				if (block.r >= NUM_TOP_ROWS) {
					render.block(block.r, block.c, Shape.Empty); 
				}
			}
		} //erase 5 times to eliminate blur trails
		render._eraseGhost(tetromino);
	}
	public drawTetromino(tetromino: Tetromino): void {
		render._drawGhost(tetromino);
		for (var i in tetromino.blocks) {
			var block = tetromino.blocks[i];
			if (block.r >= NUM_TOP_ROWS) {
				render.block(block.r, block.c, tetromino.shape);
			}
		}
	}
	private _eraseGhost(tetromino: Tetromino): void {
		var ghostBlocks: Block[] = tetromino.getGhost().blocks;
		for (var i in ghostBlocks) {
			var g = ghostBlocks[i]
			render.block(g.r, g.c, Shape.Empty);  
		}

	}
	private _drawGhost(tetromino: Tetromino): void {
		var ghostBlocks: Block[] = tetromino.getGhost().blocks;
		for (var i in ghostBlocks) {
			var g = ghostBlocks[i];
			render.block(g.r, g.c, Shape.Ghost); 
		}

	}
}

/************************************************************************
* CanvasUtil: (rendering) set board canvas w x h, draw block & board
************************************************************************/
class CanvasUtil {
	public static rect(element: any, x: number, y: number, w: number, h: number, weight: number, fill: string, line: string): void {
		var ctx= element.getContext("2d");
			ctx.beginPath();
			ctx.fillStyle = fill;
			ctx.strokeStyle = line;
			ctx.fillRect(x, y, w, h);
			ctx.lineWidth = weight;
			ctx.rect(x, y, w, h);
			if (weight != 0) ctx.stroke();
	}
	public static square(element: any, scal: string, x: number, y: number, shape: Shape): void {
		var size: number = scale[scal].size;
		var weight: number = scale[scal].weight;

		var otln: string = getColor(shape).outline;
		var fill: string = getColor(shape).fill;
		var shd: string = getColor(shape).shade;
		var hlgt: string = getColor(shape).highlight;
		var twkl: string = getColor(shape).twinkle;

		//outline
		this.rect(element, x, y, size, size, 0, otln, otln);
		//outer rectangle
		this.rect(element, x+(size*0.05), y+(size*0.05), size*0.9, size*0.9, 0, fill, fill);
		//inner rectangle
		this.rect(element, x+(size*0.25), y+(size*0.25), size*0.5, size*0.5, weight, shd, hlgt);
		//twinkle
		this.rect(element, x+(size*0.1), y+(size*0.1), size*0.1, size*0.1, 0, twkl, twkl);
	}
	public static squareImage(element: any, img: string, x: number, y: number, w: number, h: number): void {
	    var ctx = element.getContext("2d");
	   		ctx.drawImage(img,10,10,10,10);
	}
	public static circle(element: any, x: number, y: number, r: number, fill: string, line: string): void {
		var ctx = element.getContext("2d");
			ctx.beginPath();
			ctx.fillStyle = fill;
			ctx.strokeStyle = line;
			ctx.arc(x, y, r, 0, 2*Math.PI);
			ctx.fill();
			ctx.stroke();
	}
	public static box(element: any, scal: string, x: number, y: number): void {
		var size: number = scale[scal].box;
		var weight: number = scale[scal].weight;
		var fill: string = getColor(Shape.Empty).fill;
		// this.rect(loc, x, y, size, size, weight, fill, "black");
		this.roundRect(element, x, y, size, size, unit/3, "black");
		this.roundRect(element, x+(size*0.05), y+(size*0.05), size*0.9, size*0.9, unit/4, fill);
	}
	public static roundRect(element: any, x: number, y: number, w: number, h: number, r: number, color: string): void {
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
	public static bezel(element: any, loc: string, w: number, h: number): void {
		// var w = loc.width;
		// var h = loc.height;

		var x: number = scale[loc].x;
		var y: number = scale[loc].y;		

		var otr: number = scale[loc].outer;
		var mid: number = scale[loc].mid;
		var inr: number = scale[loc].inner;
		var ctn: number = scale[loc].ctn;

		var o: number = otr;
		var m: number = otr + mid;
		var i: number = otr + mid + inr;
		var c: number = otr + mid + inr + ctn;

		if (otr != 0) this.roundRect(element, x+0, y+0, w, h, unit*0.9, "#666"); //outer
		if (mid != 0) this.roundRect(element, x+o, y+o, w-(o*2), h-(o*2), unit*0.8, "#f9f9f9"); //mid
		if (inr != 0) this.roundRect(element, x+m, y+m, w-(m*2), h-(m*2), unit*0.7, "#ddd"); //inner
		if (ctn != 0) this.roundRect(element, x+i, y+i, w-(i*2), h-(i*2), unit*0.4, "#000"); //container
		//this.roundRect(element, x+c, y+c, w-(c*2), h-(c*2), unit*0.4, "rgba(0,0,0,0)"); //transparent inside
	}
}

class BoxDraw {
	public element: any;
	public scal: string;
	public x: number;
	public y: number;
	private _shape: Shape;

	public constructor(element: any, scal: string, x: number, y: number, shape: Shape) {
		this.element = element;
		this.scal = scal;
		this.x = x;
		this.y = y;
		this._shape = shape;
	}
	private _getDimensions() {
		switch (this._shape) {
			case Shape.I: return {w: 4, h: 1};
			case Shape.J: return {w: 3, h: 2};
			case Shape.L: return {w: 3, h: 2};
			case Shape.O: return {w: 2, h: 2}; 
			case Shape.S: return {w: 3, h: 2};
			case Shape.T: return {w: 3, h: 2};  
			case Shape.Z: return {w: 3, h: 2};
		}
	}
	public box():void {
		this.empty();
		this.shape();
	}
	public empty(): void {
		CanvasUtil.box(this.element, this.scal, this.x, this.y);
	}
	public shape(): void {
		var coords = this._getShapeCoords();
		for (var i in coords)
			CanvasUtil.square(this.element, this.scal, coords[i].X, coords[i].Y, this._shape);
	}
	private _getCenterCoord(): any {
		var dim = this._getDimensions();
		var box = scale[this.scal].box;
		var size = scale[this.scal].size;

		var xCenter = this.x + (box - size*dim.w)/2; //depends on width
		var yCenter = this.y + (box - size*dim.h)/2; //depends on height

		return {X: xCenter, Y: yCenter};
	}
	private _getShapeCoords(): any {
		var s = scale[this.scal].size;
		var ctr = this._getCenterCoord();
		var x = ctr.X, y = ctr.Y;
		switch (this._shape) {
			case Shape.I: return [{X:x, Y:y}, {X:x+s, Y:y}, {X:x+(2*s), Y:y}, {X:x+(3*s), Y:y}];
			case Shape.J: return [{X:x, Y:y}, {X:x, Y:y+s}, {X:x+s, Y:y+s}, {X:x+(2*s), Y:y+s}];
			case Shape.L: return [{X:x, Y:y+s}, {X:x+s, Y:y+s}, {X:x+(2*s), Y:y+s}, {X:x+(2*s), Y:y}];
			case Shape.O: return [{X:x, Y:y}, {X:x+s, Y:y}, {X:x+s, Y:y+s}, {X:x, Y:y+s}];
			case Shape.S: return [{X:x, Y:y+s}, {X:x+s, Y:y+s}, {X:x+s, Y:y}, {X:x+(2*s), Y:y}];
			case Shape.T: return [{X:x+s, Y:y}, {X:x, Y:y+s}, {X:x+s, Y:y+s}, {X:x+(2*s), Y:y+s}];
			case Shape.Z: return [{X:x, Y:y}, {X:x+s, Y:y}, {X:x+s, Y:y+s}, {X:x+(2*s), Y:y+s}];
		}
	}
}

console.log("loaded render.js successfully");