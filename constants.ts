var UNIT: number = 25; //size of block on grid
var DELAY_DECREMENT = 5; // to decrement every collapsed row
var INITIAL_DELAY = 300; // milliseconds
var NUM_TOP_ROWS: number = 5; //invisible rows at top, not shown
var NUM_NEXT_PIECES: number = 5; //must be less than 7

class IMAGES {
	public static I: any = undefined;
	public static J: any = undefined;
	public static L: any = undefined;
	public static O: any = undefined;
	public static S: any = undefined;
	public static T: any = undefined;
	public static Z: any = undefined;
	public static Ghost: any = undefined;
	public static Empty: any = undefined;

	public static get(shape: Shape): any {
		switch(shape) {
			case Shape.I: return this.I;
			case Shape.J: return this.J;
			case Shape.L: return this.L;
			case Shape.O: return this.O;
			case Shape.S: return this.S;
			case Shape.T: return this.T;
			case Shape.Z: return this.Z;
			case Shape.Ghost: return this.Ghost;
			case Shape.Empty: return this.Empty;
		}
	}

	public static set(shape: Shape, img: any): void {
		switch(shape) {
			case Shape.I: this.I = img; break;
			case Shape.J: this.J = img; break;
			case Shape.L: this.L = img; break;
			case Shape.O: this.O = img; break;
			case Shape.S: this.S = img; break;
			case Shape.T: this.T = img; break;
			case Shape.Z: this.Z = img; break;
			case Shape.Ghost: this.Ghost = img; break;
			case Shape.Empty: this.Empty = img; break;
		}
	}
}

enum Component { // used for bezels
	Board, Hold, Next
}

enum Size { // used for containers & blocks
	Large, Medium, Small
}

enum Direction {
	Up, Down, Left, Right
}

enum Style {
	Default,
	Image
}

enum Shape {
	I = "I", 
	J = "J", 
	L = "L", 
	O = "O", 
	S = "S", 
	T = "T", 
	Z = "Z", 
	Ghost = "ghost", 
	Empty = "."
}

// enum to capture key codes
enum Keyboard {
	Enter = 13,
	LeftArrow = 37,
	UpArrow = 38,
	RightArrow = 39,
	DownArrow = 40,
	Space = 32,
	Shift = 16,
	Tab = 9,
	A = 65,
	W = 87,
	S = 83,
	D = 68,
	P = 80,
}

enum KeyControls {
	Default,
	Alternative
}

class Keys {
	public play: number;
	public pause: number;
	public left: number;
	public right: number;
	public down: number;
	public rotate: number;
	public drop: number;
	public hold: number;

	public constructor(keyControls: KeyControls) {
		switch(keyControls) {
			case KeyControls.Default:
				this.play = Keyboard.Enter;
				this.pause = Keyboard.Enter;
				this.left = Keyboard.LeftArrow;
				this.right = Keyboard.RightArrow;
				this.down = Keyboard.DownArrow;
				this.rotate = Keyboard.UpArrow;
				this.drop = Keyboard.Space;
				this.hold = Keyboard.Shift;	
				break;
			case KeyControls.Alternative:
				this.play = Keyboard.Enter;
				this.pause = Keyboard.Enter;
				this.left = Keyboard.A;
				this.right = Keyboard.D;
				this.down = Keyboard.S;
				this.rotate = Keyboard.W;
				this.drop = Keyboard.Space;
				this.hold = Keyboard.Shift;	
				break;
		}	
	}
}