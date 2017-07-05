class ContainerDimension {
	public box: number;
	public offset: number;
	public x: number;
	public y: number;

	public static medium(): ContainerDimension {
		var container: ContainerDimension = new ContainerDimension();
		container.box = UNIT*0.8*4;
		container.offset = 0;
		return container;
	}

	public static small(): ContainerDimension {
		var container: ContainerDimension = new ContainerDimension();
		container.box = UNIT*0.7*4;
		container.offset = UNIT*0.2;
		return container;
	}
}

class BlockDimension {
	public size: number; // size of block square
	public weight: number; // line weight of block square

	public static large(): BlockDimension {
		var block: BlockDimension = new BlockDimension();
		block.size = UNIT;
		block.weight = UNIT/10;
		return block;
	}

	public static medium(): BlockDimension {
		var block: BlockDimension = new BlockDimension();
		block.size = UNIT*0.7;
		block.weight = UNIT/10*0.7;
		return block;
	}

	public static small(): BlockDimension {
		var block: BlockDimension = new BlockDimension();
		block.size = UNIT*0.6;
		block.weight = UNIT/10*0.6;
		return block;
	}
}

class BezelDimension {
	public x: number;
	public y: number;
	public outer: number;
	public mid: number;
	public inner: number;
	public ctn: number;
	public thickness: number;
	public height: number;
	public width: number;

	public static next(numCols: number): BezelDimension {
		var bezel: BezelDimension = new BezelDimension();
		bezel.x = UNIT*(6+numCols);
		bezel.y = UNIT*2;
		bezel.outer = UNIT/5;
		bezel.mid = UNIT/3;
		bezel.inner = 0;
		bezel.ctn = 0;
		bezel.thickness = bezel.outer + bezel.mid + bezel.inner + bezel.ctn;
		return bezel;
	}

	public static board(): BezelDimension {
		var bezel: BezelDimension = new BezelDimension();
		bezel.x = UNIT*4;
		bezel.y = 0;
		bezel.outer = UNIT/5;
		bezel.mid = UNIT/7;
		bezel.inner = UNIT*0.8;
		bezel.ctn = UNIT/5;
		bezel.thickness = bezel.outer + bezel.mid + bezel.inner + bezel.ctn;
		return bezel;
	}

	public static hold(): BezelDimension {
		var bezel: BezelDimension = new BezelDimension();
		bezel.x = UNIT*0.5;
		bezel.y = UNIT*2;
		bezel.outer = UNIT/5;
		bezel.mid = UNIT/3;
		bezel.inner = 0;
		bezel.ctn = 0;
		bezel.thickness = bezel.outer + bezel.mid + bezel.inner + bezel.ctn;
		return bezel;
	}

}