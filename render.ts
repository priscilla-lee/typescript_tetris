var cols: number = 10; //width
var rows: number = 20; //height
var unit: number = 20; //size of block on grid

var NUM_TOP_ROWS: number = 5; //invisible rows at top, not shown
var NUM_NEXT_PIECES: number = 5; //must be less than 7

enum ContainerSize {
	Medium, Small
}

enum BlockSize {
	Regular, Medium, Small
}

enum BezelSize {
	Board, Hold, Next
}

class ContainerDimension {
	public box: number;
	public offset: number;

	public constructor(box: number, offset: number) {
		this.box = box;
		this.offset = offset;
	}

	public static get(containerSize: ContainerSize): ContainerDimension {
		switch(containerSize) {
			case ContainerSize.Medium: return new ContainerDimension(unit*0.8*4, 0);
			case ContainerSize.Small: return new ContainerDimension(unit*0.7*4, unit*0.2);
		}
	}
}

class BlockDimension {
	public size: number; // size of block square
	public weight: number; // line weight of block square

	public constructor(size: number, weight: number) {
		this.size = size;
		this.weight = weight;
	}

	public static get(blockSize: BlockSize): BlockDimension {
		switch(blockSize) {
			case BlockSize.Regular: return new BlockDimension(unit, unit/10);
			case BlockSize.Medium: return new BlockDimension(unit*0.7, unit/10*0.7);
			case BlockSize.Small: return new BlockDimension(unit*0.6, unit/10*0.6);
		}
	}
}

class BezelDimension {
	public x: number;
	public y: number;
	public outer: number;
	public mid: number;
	public inner: number;
	public ctn: number;

	public constructor(x: number, y: number, outer: number, mid: number, inner: number, ctn: number) {
		this.x = x;
		this.y = y;
		this.outer = outer;
		this.mid = mid;
		this.inner = inner;
		this.ctn = ctn;
	}

	public static get(bezelSize: BezelSize): BezelDimension {
		switch(bezelSize) {
			case BezelSize.Next: return new BezelDimension(unit*(6+cols), unit*2, unit/5, unit/3, 0, 0);
			case BezelSize.Board: return new BezelDimension(unit*4, 0, unit/5, unit/7, unit*0.8, unit/5); 
			case BezelSize.Hold: return new BezelDimension(unit*0.5, unit*2, unit/5, unit/3, 0, 0);
		}
	}
}

class Dimensions {
	public static next(): any{
		var box: number = ContainerDimension.get(ContainerSize.Medium).box; // scale["box_md"].box;

		var n: BezelDimension = BezelDimension.get(BezelSize.Next); //scale.next;
		var X = n.outer + n.mid + n.inner + n.ctn;
		var Y = n.outer + n.mid + n.inner + n.ctn;

		var o: number = ContainerDimension.get(ContainerSize.Small).offset; //scale["box_sm"].offset;

		var h: number = box*NUM_NEXT_PIECES + 2*(Y) + o;
		var w: number = box + 2*(X);

		return {height: h, width: w};
	}
	public static hold(): any {
		var box: number = ContainerDimension.get(ContainerSize.Medium).box; //scale["box_md"].box;

		var h: BezelDimension = BezelDimension.get(BezelSize.Hold); //scale.hold;
		var X = h.outer + h.mid + h.inner + h.ctn;
		var Y = h.outer + h.mid + h.inner + h.ctn;

		var hei: number = box + 2*(Y);
		var w: number = box + 2*(X);

		return {height: hei, width: w};
	}
	public static board(): any {
		var b: BezelDimension = BezelDimension.get(BezelSize.Board); //scale.board;
		var X = b.outer + b.mid + b.inner + b.ctn;
		var Y = b.outer + b.mid + b.inner + b.ctn;

		var bd: BlockDimension = BlockDimension.get(BlockSize.Regular);

		var h: number = rows*bd.size + 2*(Y);
		var w: number =  cols*bd.size + 2*(X);

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
		///////////////////////////////////////////////////////////////////////////
		var box: number = ContainerDimension.get(ContainerSize.Medium).box; //scale["box_md"].box;

		var n: BezelDimension = BezelDimension.get(BezelSize.Next);//scale.next;
		var X = n.outer + n.mid + n.inner + n.ctn;
		var Y = n.outer + n.mid + n.inner + n.ctn;

		var o: number = ContainerDimension.get(ContainerSize.Small).offset; //scale["box_sm"].offset;

		var height: number = box*NUM_NEXT_PIECES + 2*(Y) + o;
		var width: number = box + 2*(X);

		X += n.x; Y += n.y;
		///////////////////////////////////////////////////////////////////////////



		var array: Shape[] = game.randomPieces.getList();

		// "all" function
		CanvasUtil.bezel(this.element, width, height, BezelDimension.get(BezelSize.Next)); //next());
		array = game.randomPieces.getList(); //update
		//draw 1 medium box
		var boxDraw: BoxDraw = new BoxDraw(this.element, ContainerSize.Medium, X+0, Y, array[0]);
		boxDraw.box();
		//draw smaller boxes (skip the first one)
		for (var i = 1; i < array.length; i++) {
			var boxDraw = new BoxDraw(this.element, 
				ContainerSize.Small,
				X+o+0, 
				Y+2*o+box*i, 
				array[i]);
			boxDraw.box();
		}
	}
	public hold(): void {
		///////////////////////////////////////////////////////////////////////////
		var box: number = ContainerDimension.get(ContainerSize.Medium).box; //scale["box_md"].box;

		var h: BezelDimension = BezelDimension.get(BezelSize.Hold); //scale.hold;
		var X = h.outer + h.mid + h.inner + h.ctn;
		var Y = h.outer + h.mid + h.inner + h.ctn;

		var height: number = box + 2*(Y);
		var width: number = box + 2*(X);

		X += h.x; Y += h.y;
		///////////////////////////////////////////////////////////////////////////

		// "all" function
		CanvasUtil.bezel(this.element, width, height, BezelDimension.get(BezelSize.Hold)); //hold());
		if (game.held) {
			var boxDraw: BoxDraw = new BoxDraw(this.element, ContainerSize.Medium, X+0, Y+0, game.held.shape);
			boxDraw.box();			
		} else {
			var boxDraw: BoxDraw = new BoxDraw(this.element, ContainerSize.Medium, X+0, Y+0, Shape.Empty);
			boxDraw.empty();
		}
	}
	public board(): void {
		///////////////////////////////////////////////////////////////////////////
		var b: BezelDimension = BezelDimension.get(BezelSize.Board); //scale.board;
		var X = b.outer + b.mid + b.inner + b.ctn;
		var Y = b.outer + b.mid + b.inner + b.ctn;

		var bd: BlockDimension = BlockDimension.get(BlockSize.Regular);

		var height: number = rows*bd.size + 2*(Y);
		var width: number =  cols*bd.size + 2*(X);

		X += b.x; Y += b.y;
		///////////////////////////////////////////////////////////////////////////

		// "all" function
		CanvasUtil.bezel(this.element, width, height, BezelDimension.get(BezelSize.Board)); //board());
		for (var r = NUM_TOP_ROWS; r < rows + NUM_TOP_ROWS; r++) {
			for (var c = 0; c < cols; c++) 
				this.block(r, c, grid.get(r,c));
		}	
	}
	public block(r: number, c: number, shape: Shape): void {
		///////////////////////////////////////////////////////////////////////////
		var b: BezelDimension = BezelDimension.get(BezelSize.Board); //scale.board;
		var X = b.outer + b.mid + b.inner + b.ctn;
		var Y = b.outer + b.mid + b.inner + b.ctn;

		var bd: BlockDimension = BlockDimension.get(BlockSize.Regular);

		var height: number = rows*bd.size + 2*(Y);
		var width: number =  cols*bd.size + 2*(X);

		X += b.x; Y += b.y;
		///////////////////////////////////////////////////////////////////////////

		var size: number = BlockDimension.get(BlockSize.Regular).size; //Board).size; //scale.board.size;
		var top: number = NUM_TOP_ROWS*size;
		BlockStyle.original(this.element, BlockDimension.get(BlockSize.Regular), c*size+X, r*size+Y-top, shape);
	}
	public emptyFrame(): void {

	}
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


class BlockStyle {
	public static original = function(element: any, blockDim: BlockDimension, x: number, y: number, shape: Shape): void {
		var size: number = blockDim.size;
		var weight: number = blockDim.weight;

		var otln: string = getColor(shape).outline;
		var fill: string = getColor(shape).fill;
		var shd: string = getColor(shape).shade;
		var hlgt: string = getColor(shape).highlight;
		var twkl: string = getColor(shape).twinkle;
		
		CanvasUtil.rect(element, x, y, size, size, 0, otln, otln); //outline
		CanvasUtil.rect(element, x+(size*0.05), y+(size*0.05), size*0.9, size*0.9, 0, fill, fill); //outer rectangle
		CanvasUtil.rect(element, x+(size*0.25), y+(size*0.25), size*0.5, size*0.5, weight, shd, hlgt); //inner rectangle
		CanvasUtil.rect(element, x+(size*0.1), y+(size*0.1), size*0.1, size*0.1, 0, twkl, twkl); //twinkle
	}
	public static image = function(element: any, img: string, x: number, y: number, w: number, h: number): void {
	    var ctx = element.getContext("2d");
	   		ctx.drawImage(img, x, y, w, h);
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
	public static circle(element: any, x: number, y: number, r: number, fill: string, line: string): void {
		var ctx = element.getContext("2d");
			ctx.beginPath();
			ctx.fillStyle = fill;
			ctx.strokeStyle = line;
			ctx.arc(x, y, r, 0, 2*Math.PI);
			ctx.fill();
			ctx.stroke();
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
	public static bezel(element: any, w: number, h: number, bezelDim: BezelDimension): void {
		var x: number = bezelDim.x;
		var y: number = bezelDim.y;

		var otr: number = bezelDim.outer;
		var mid: number = bezelDim.mid;
		var inr: number = bezelDim.inner;
		var ctn: number = bezelDim.ctn;

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
	private _containerSize: ContainerSize

	public constructor(element: any, containerSize: ContainerSize, x: number, y: number, shape: Shape) {
		this.element = element;
		// this.scal = scal;
		this.x = x;
		this.y = y;
		this._shape = shape;
		this._containerSize = containerSize;
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
		var size: number = ContainerDimension.get(this._containerSize).box; //scale[this.scal].box;
		var weight: number = BlockDimension.get(BlockSize.Medium).weight; //scale[this.scal].weight;
		var fill: string = getColor(Shape.Empty).fill;
		CanvasUtil.roundRect(this.element, this.x, this.y, size, size, unit/3, "black");
		CanvasUtil.roundRect(this.element, this.x+(size*0.05), this.y+(size*0.05), size*0.9, size*0.9, unit/4, fill);
	}
	public shape(): void {
		var coords = this._getShapeCoords();
		for (var i in coords) {
			if (this._containerSize == ContainerSize.Medium) //this.scal == "box_md")
				BlockStyle.original(this.element, BlockDimension.get(BlockSize.Medium), coords[i].X, coords[i].Y, this._shape);
			else //"box_sm"
				BlockStyle.original(this.element, BlockDimension.get(BlockSize.Small), coords[i].X, coords[i].Y, this._shape);
		}
	}
	private _getCenterCoord(): any {
		var dim = this._getDimensions();
		var box = ContainerDimension.get(this._containerSize).box; //scale[this.scal].box;
		var size = BlockDimension.get(BlockSize.Medium).size; //_containerSize).size; //scale[this.scal].size;

		var xCenter = this.x + (box - size*dim.w)/2; //depends on width
		var yCenter = this.y + (box - size*dim.h)/2; //depends on height

		return {X: xCenter, Y: yCenter};
	}
	private _getShapeCoords(): any {
		var s = BlockDimension.get(BlockSize.Medium).size; //scale[this.scal].size;
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