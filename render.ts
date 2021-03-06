class Render {
	private _element: any;
	private _board: Board;
	private _next: Next;
	private _hold: Hold;
	private _canvas: Canvas;
	private _preview: Preview;
	public numCols: number;
	public numRows: number;

	public constructor(canvas: any, numCols: number, numRows: number) {
		this.numCols = numCols;
		this.numRows = numRows; 
		this._element = canvas;
	}

	public drawInitialFrame(): void {
		// set up components
		this._board = new Board(this.numCols, this.numRows);
		this._next = new Next(this.numCols);
		this._hold = new Hold();
		this._canvas = new Canvas(this._board, this._next, this._hold);

		// set up canvas
		this._element.height = this._canvas.height(); 
		this._element.width = this._canvas.width(); 

		// draw empty frame
		this._drawBezel(this._board.bezel());
		this._drawBezel(this._hold.bezel());
		this._drawBezel(this._next.bezel());

		// draw cleared components
		this._clearBoard();
		this._clearNext();
		this._clearHold();
	}

	public drawStylePreview(shape: Shape): void {
		this._preview = new Preview();
		this._element.height = this._preview.bezel().height;
		this._element.width = this._preview.bezel().width;

		this._drawBezel(this._preview.bezel());
		this.updatePreview(shape);
	}

	private _clearBoard(): void {
		for (var r = NUM_TOP_ROWS; r < this.numRows + NUM_TOP_ROWS; r++) {
			for (var c = 0; c < this.numCols; c++) 
				this._drawGridBlock(r, c, Shape.Empty);
		}	
	}
	
	private _clearNext(): void {
		this._drawContainer(this._next.container(0), this._next.block(0), Shape.Empty); // medium box
		//draw smaller boxes (skip the first one)
		for (var i = 1; i < NUM_NEXT_PIECES; i++) {
			this._drawContainer(this._next.container(i), this._next.block(i), Shape.Empty);
		}
	}

	private _clearHold(): void {
		this._drawContainer(this._hold.container(), this._hold.block(), Shape.Empty);
	}

	public updateBoard(grid: Grid): void {
		for (var r = NUM_TOP_ROWS; r < this.numRows + NUM_TOP_ROWS; r++) {
			for (var c = 0; c < this.numCols; c++) 
				this._drawGridBlock(r, c, grid.get(r,c));
		}	
	}

	public updateNext(shapes: Shape[]): void {
		this._drawContainer(this._next.container(0), this._next.block(0), shapes[0]); // medium box
		//draw smaller boxes (skip the first one)
		for (var i = 1; i < shapes.length; i++) {
			this._drawContainer(this._next.container(i), this._next.block(i), shapes[i]);
		}
	}

	public updateHold(shape: Shape): void {
		this._drawContainer(this._hold.container(), this._hold.block(), shape); 
	}

	public updatePreview(shape: Shape): void {
		this._drawContainer(this._preview.container(), this._preview.block(), shape); 
	}

	public drawTetromino(tetromino: Tetromino): void {
		this._drawGhost(tetromino);
		for (var i in tetromino.blocks) {
			var block = tetromino.blocks[i];
			if (block.r >= NUM_TOP_ROWS) {
				this._drawGridBlock(block.r, block.c, tetromino.shape);
			}
		}
	}

	public eraseTetromino(tetromino: Tetromino): void {
		for (var a = 0; a < 5; a++) {
			for (var i in tetromino.blocks) {
				var block = tetromino.blocks[i];
				if (block.r >= NUM_TOP_ROWS) {
					this._drawGridBlock(block.r, block.c, Shape.Empty); 
				}
			}
		} //erase 5 times to eliminate blur trails
		this._eraseGhost(tetromino);
	}
	
	private _drawGhost(tetromino: Tetromino): void {
		var ghostBlocks: Block[] = tetromino.getGhost().blocks;
		for (var i in ghostBlocks) {
			var g = ghostBlocks[i];
			this._drawGridBlock(g.r, g.c, Shape.Ghost); 
		}
	}

	private _eraseGhost(tetromino: Tetromino): void {
		var ghostBlocks: Block[] = tetromino.getGhost().blocks;
		for (var i in ghostBlocks) {
			var g = ghostBlocks[i]
			this._drawGridBlock(g.r, g.c, Shape.Empty);  
		}
	}
	
	private _drawGridBlock(row: number, col: number, shape: Shape): void {
		var bezel: BezelDimension = this._board.bezel();
		var block: BlockDimension = this._board.block();

		var gridX: number = bezel.thickness + bezel.x; 
		var gridY: number = bezel.thickness + bezel.y;

		var x: number = col*block.size + gridX;
		var y: number = row*block.size + gridY - NUM_TOP_ROWS*block.size; // subtract top rows

		this._drawSquare(block, x, y, shape);
	}

	private _drawBezel(bezelDim: BezelDimension): void {
		var x: number = bezelDim.x;
		var y: number = bezelDim.y;

		var w: number = bezelDim.width;
		var h: number = bezelDim.height;

		var otr: number = bezelDim.outer;
		var mid: number = bezelDim.mid;
		var inr: number = bezelDim.inner;
		var ctn: number = bezelDim.ctn;

		var o: number = otr;
		var m: number = otr + mid;
		var i: number = otr + mid + inr;
		var c: number = otr + mid + inr + ctn;

		// draw bezel
		if (otr != 0) CanvasUtil.roundRect(this._element, x+0, y+0, w, h, UNIT*0.9, "#666"); //outer
		if (mid != 0) CanvasUtil.roundRect(this._element, x+o, y+o, w-(o*2), h-(o*2), UNIT*0.8, "#f9f9f9"); //mid
		if (inr != 0) CanvasUtil.roundRect(this._element, x+m, y+m, w-(m*2), h-(m*2), UNIT*0.7, "#ddd"); //inner
		if (ctn != 0) CanvasUtil.roundRect(this._element, x+i, y+i, w-(i*2), h-(i*2), UNIT*0.4, "#000"); //container
	}

	private _drawContainer(contDim: ContainerDimension, blockDim: BlockDimension, shape: Shape): void {
		var size: number = contDim.box;
		var fill: string = getColor(Shape.Empty).fill;

		// draw empty container first
		CanvasUtil.roundRect(this._element, contDim.x, contDim.y, size, size, UNIT/3, "black");
		CanvasUtil.roundRect(this._element, contDim.x+(size*0.05), contDim.y+(size*0.05), size*0.9, size*0.9, UNIT/4, fill);

		// then draw shape inside (if applicable)
		if (shape != Shape.Empty) {
			var coords = ContainerDraw._getCoordinates(shape, contDim, blockDim);
			for (var i in coords) {
				this._drawSquare(blockDim, coords[i].X, coords[i].Y, shape);
			}
		}
	}

	private _drawSquare(blockDim: BlockDimension, x: number, y: number, shape: Shape): void {
		if (IMAGES.get(shape) == undefined) {
			this._drawDefaultSquare(blockDim, x, y, shape);
		} else {
			this._drawImageSquare(blockDim, x, y, shape);
		}
	}

	private _drawDefaultSquare(blockDim: BlockDimension, x: number, y: number, shape: Shape): void {
		var size: number = blockDim.size;
		var weight: number = blockDim.weight;

		var otln: string = getColor(shape).outline;
		var fill: string = getColor(shape).fill;
		var shd: string = getColor(shape).shade;
		var hlgt: string = getColor(shape).highlight;
		var twkl: string = getColor(shape).twinkle;
		
		CanvasUtil.rect(this._element, x, y, size, size, 0, otln, otln); //outline
		CanvasUtil.rect(this._element, x+(size*0.05), y+(size*0.05), size*0.9, size*0.9, 0, fill, fill); //outer rectangle
		CanvasUtil.rect(this._element, x+(size*0.25), y+(size*0.25), size*0.5, size*0.5, weight, shd, hlgt); //inner rectangle
		CanvasUtil.rect(this._element, x+(size*0.1), y+(size*0.1), size*0.1, size*0.1, 0, twkl, twkl); //twinkle
	}

	private _drawImageSquare(blockDim: BlockDimension, x: number, y: number, shape: Shape): void {
		var size: number = blockDim.size;
		var image = IMAGES.get(shape);
		var ctx = this._element.getContext("2d");
			ctx.drawImage(image, x, y, size, size);
	}
}

class ContainerDraw {
	public static _getDimensions(shape: Shape) {
		switch (shape) {
			case Shape.I: return {w: 4, h: 1};
			case Shape.J: return {w: 3, h: 2};
			case Shape.L: return {w: 3, h: 2};
			case Shape.O: return {w: 2, h: 2}; 
			case Shape.S: return {w: 3, h: 2};
			case Shape.T: return {w: 3, h: 2};  
			case Shape.Z: return {w: 3, h: 2};
		}
	}

	public static _getCoordinates(shape: Shape, contDim: ContainerDimension, blockDim: BlockDimension): any {
		var dim = ContainerDraw._getDimensions(shape);

		// calculate the center coordinates
		var x = contDim.x + (contDim.box - blockDim.size*dim.w)/2; //depends on width
		var y = contDim.y + (contDim.box - blockDim.size*dim.h)/2; //depends on height

		// get x & y coordinates of each block
		var s = blockDim.size; 

		switch (shape) {
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