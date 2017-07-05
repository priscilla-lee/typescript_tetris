class Hold {
	private _bezel: BezelDimension;
	private _container: ContainerDimension;
	private _block: BlockDimension;

	public constructor() {
		var bezel = BezelDimension.hold();
		var container = ContainerDimension.medium();
		var block = BlockDimension.medium();

		// set bezel height & width
		bezel.height = container.box + 2*bezel.thickness;
		bezel.width = container.box + 2*bezel.thickness;

		// set medium container x & y
		container.x = bezel.thickness + bezel.x;
		container.y = bezel.thickness + bezel.y;

		// store dimensions
		this._bezel = bezel;
		this._container = container;
		this._block = block;
	}

	public bezel(): BezelDimension {
		return this._bezel;
	}

	public container(): ContainerDimension {
		return this._container;
	}

	public block (): BlockDimension { 
		return this._block;
	}
}

class Board {
	private _bezel: BezelDimension;
	private _block: BlockDimension;

	public constructor(numCols: number, numRows: number) {
		var bezel = BezelDimension.board();
		var block = BlockDimension.large();

		// set bezel height & width
		bezel.height = numRows*block.size + 2*bezel.thickness;
		bezel.width = numCols*block.size + 2*bezel.thickness;

		// store dimensions
		this._bezel = bezel;
		this._block = block;
	}

	public bezel(): BezelDimension {
		return this._bezel;
	}

	public block(): BlockDimension {
		return this._block;
	}
}

class Next {
	private _bezel: BezelDimension;
	private _mediumContainer: ContainerDimension;
	private _smallContainer: ContainerDimension;
	private _mediumBlock: BlockDimension;
	private _smallBlock: BlockDimension;

	public constructor(numCols: number) {
		var bezel = BezelDimension.next(numCols); 
		var mediumContainer = ContainerDimension.medium();
		var smallContainer = ContainerDimension.small();
		var mediumBlock = BlockDimension.medium();
		var smallBlock = BlockDimension.small();	

		// set bezel height & width
		bezel.height = mediumContainer.box*NUM_NEXT_PIECES + 2*bezel.thickness + mediumContainer.offset;
		bezel.width = mediumContainer.box + 2*bezel.thickness;

		// set medium container x & y
		mediumContainer.x = bezel.thickness + bezel.x;
		mediumContainer.y = bezel.thickness + bezel.y;

		// set small container x & y
		smallContainer.x = bezel.thickness + smallContainer.offset + bezel.x;

		// store dimensions
		this._bezel = bezel;
		this._mediumContainer = mediumContainer;
		this._smallContainer = smallContainer;
		this._mediumBlock = mediumBlock;
		this._smallBlock = smallBlock;
	}

	public bezel(): BezelDimension {
		return this._bezel;
	}

	public container(index: number): ContainerDimension {
		if (index == 0) {
			return this._mediumContainer;
		} else {
			var smallContainer = this._smallContainer;
			var mediumContainer = this._mediumContainer;
			var bezel = this._bezel;

			smallContainer.y = bezel.thickness + bezel.y + 2*smallContainer.offset + mediumContainer.box*index;
			return smallContainer;
		}
	}

	public block(index: number): BlockDimension {
		if (index == 0) {
			return this._mediumBlock;
		} else {
			return this._smallBlock;
		}
	}
}

class Canvas {
	private _width: number;
	private _height: number;

	public constructor(board: Board, next: Next, hold: Hold) {
		this._width = board.bezel().width + next.bezel().width + hold.bezel().width; 
		this._height = Math.max(board.bezel().height, next.bezel().height);
	}

	public width(): number {
		return this._width;
	}		

	public height(): number {
		return this._height;
	}	
}