class Hold {
	private static _bezel: BezelDimension;
	private static _container: ContainerDimension;
	private static _block: BlockDimension;

	private static _construct() {
		var bezel = new BezelDimension(Component.Hold);
		var container = new ContainerDimension(Size.Medium);
		var block = new BlockDimension(Size.Medium);

		// set bezel height & width
		bezel.height = container.box + 2*bezel.thickness;
		bezel.width = container.box + 2*bezel.thickness;

		// set medium container x & y
		container.x = bezel.thickness + bezel.x;
		container.y = bezel.thickness + bezel.y;

		// store dimensions
		Hold._bezel = bezel;
		Hold._container = container;
		Hold._block = block;
	}

	public static bezel(): BezelDimension {
		if (Hold._bezel == undefined) {
			Hold._construct();
		}
		return Hold._bezel;
	}

	public static container(): ContainerDimension {
		if (Hold._container == undefined) {
			Hold._construct();
		}
		return Hold._container;
	}

	public static block (): BlockDimension { 
		if (Hold._block == undefined) {
			Hold._construct();
		}
		return Hold._block;
	}
}

class Board {
	private static _bezel: BezelDimension;
	private static _block: BlockDimension;

	private static _construct() {
		var bezel = new BezelDimension(Component.Board); 
		var block = new BlockDimension(Size.Large); 

		// set bezel height & width
		bezel.height = ROWS*block.size + 2*bezel.thickness;
		bezel.width = COLS*block.size + 2*bezel.thickness;

		// store dimensions
		this._bezel = bezel;
		this._block = block;
	}

	public static bezel(): BezelDimension {
		if (Board._bezel == undefined) {
			Board._construct();
		}
		return this._bezel;
	}

	public static block (): BlockDimension { 
		if (Board._block == undefined) {
			Board._construct();
		}
		return this._block;
	}
}

class Next {
	private static _bezel: BezelDimension;
	private static _mediumContainer: ContainerDimension;
	private static _smallContainer: ContainerDimension;
	private static _mediumBlock: BlockDimension;
	private static _smallBlock: BlockDimension;

	private static _construct() {
		var bezel = new BezelDimension(Component.Next); 
		var mediumContainer = new ContainerDimension(Size.Medium); 
		var smallContainer = new ContainerDimension(Size.Small); 
		var mediumBlock = new BlockDimension(Size.Medium); 
		var smallBlock = new BlockDimension(Size.Small); 	

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

	public static bezel(): BezelDimension {
		if (Next._bezel == undefined) {
			Next._construct();
		}
		return this._bezel;
	}

	public static container(index: number): ContainerDimension {
		if (index == 0) {
			if (Next._mediumContainer == undefined) {
				Next._construct();
			}
			return this._mediumContainer;
		} else {
			if (Next._smallContainer == undefined) {
				Next._construct();
			}
			var smallContainer = this._smallContainer;
			var mediumContainer = this._mediumContainer;
			var bezel = this._bezel;

			smallContainer.y = bezel.thickness + bezel.y + 2*smallContainer.offset + mediumContainer.box*index;
			return smallContainer;
		}
	}

	public static block (index: number): BlockDimension { 
		if (index == 0) {
			if (Next._mediumBlock == undefined) {
				Next._construct();
			}
			return this._mediumBlock;
		} else {
			if (Next._smallBlock == undefined) {
				Next._construct();
			}
			return this._smallBlock;
		}
	}
}

class CanvasDimensions {
	public static height(): number {
		var board = Board.bezel().height; 
		var next = Next.bezel().height;
		return Math.max(board, next);
	}

	public static width(): number {
		var board = Board.bezel().width;
		var next = Next.bezel().width; 
		var hold = Hold.bezel().width;
		return board + next + hold; 
	}
}