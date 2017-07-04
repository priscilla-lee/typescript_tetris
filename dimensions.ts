class ContainerDimension {
	public box: number;
	public offset: number;
	public x: number;
	public y: number;

	public constructor(size: Size) {
		switch(size) {
			case Size.Medium: 
				this.box = UNIT*0.8*4;
				this.offset = 0;
				break;
			case Size.Small: 
				this.box = UNIT*0.7*4;
				this.offset = UNIT*0.2;
				break;
		}
	}
}

class BlockDimension {
	public size: number; // size of block square
	public weight: number; // line weight of block square

	public constructor(size: Size) {
		switch(size) {
			case Size.Large: 
				this.size = UNIT;
				this.weight = UNIT/10;
				break;
			case Size.Medium: 
				this.size = UNIT*0.7;
				this.weight = UNIT/10*0.7;
				break;
			case Size.Small: 
				this.size = UNIT*0.6;
				this.weight = UNIT/10*0.6;
				break;
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
	public thickness: number;
	public height: number;
	public width: number;

	public constructor(component: Component) {
		switch(component) {
			case Component.Next: 
				this.x = UNIT*(6+COLS);
				this.y = UNIT*2;
				this.outer = UNIT/5;
				this.mid = UNIT/3;
				this.inner = 0;
				this.ctn = 0;
				break;
			case Component.Board: 
				this.x = UNIT*4;
				this.y = 0;
				this.outer = UNIT/5;
				this.mid = UNIT/7;
				this.inner = UNIT*0.8;
				this.ctn = UNIT/5; 
				break;
			case Component.Hold: 
				this.x = UNIT*0.5;
				this.y = UNIT*2;
				this.outer = UNIT/5;
				this.mid = UNIT/3;
				this.inner = 0;
				this.ctn = 0;
				break;
		}
		this.thickness = this.outer + this.mid + this.inner + this.ctn;
	}
}