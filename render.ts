class Render {
	private _element: any;

	public constructor(canvas: any) {
		// set up canvas
		this._element = canvas;
		canvas.height = CanvasDimensions.height()
		canvas.width = CanvasDimensions.width(); 

		// draw empty frame
		this._drawBezel(Board.bezel());
		this._drawBezel(Hold.bezel());
		this._drawBezel(Next.bezel()); 

		// draw cleared components
		this._clearBoard();
		this._clearNext();
		this._clearHold();
	}

	private _clearBoard(): void {
		for (var r = NUM_TOP_ROWS; r < ROWS + NUM_TOP_ROWS; r++) {
			for (var c = 0; c < COLS; c++) 
				this._drawGridBlock(r, c, Shape.Empty);
		}	
	}
	
	private _clearNext(): void {
		this._drawContainer(Next.container(0), Next.block(0), Shape.Empty); // medium box
		//draw smaller boxes (skip the first one)
		for (var i = 1; i < NUM_NEXT_PIECES; i++) {
			this._drawContainer(Next.container(i), Next.block(i), Shape.Empty);
		}
	}

	private _clearHold(): void {
		this._drawContainer(Hold.container(), Hold.block(), Shape.Empty);
	}

	public updateBoard(grid: Grid): void {
		for (var r = NUM_TOP_ROWS; r < ROWS + NUM_TOP_ROWS; r++) {
			for (var c = 0; c < COLS; c++) 
				this._drawGridBlock(r, c, grid.get(r,c));
		}	
	}

	public updateNext(shapes: Shape[]): void {
		this._drawContainer(Next.container(0), Next.block(0), shapes[0]); // medium box
		//draw smaller boxes (skip the first one)
		for (var i = 1; i < shapes.length; i++) {
			this._drawContainer(Next.container(i), Next.block(i), shapes[i]);
		}
	}

	public updateHold(shape: Shape): void {
		this._drawContainer(Hold.container(), Hold.block(), shape); 
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
		var bezel: BezelDimension = Board.bezel();
		var block: BlockDimension = Board.block();

		var gridX: number = bezel.thickness + bezel.x; 
		var gridY: number = bezel.thickness + bezel.y;

		var x: number = col*block.size + gridX;
		var y: number = row*block.size + gridY - NUM_TOP_ROWS*block.size; // subtract top rows

		BlockStyle.original(this._element, block, x, y, shape);
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
				BlockStyle.original(this._element, blockDim, coords[i].X, coords[i].Y, shape);
			}
		}
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