var COLS: number = 10; //width
var ROWS: number = 20; //height
var UNIT: number = 20; //size of block on grid

var DELAY = 300; //milliseconds

var NUM_TOP_ROWS: number = 5; //invisible rows at top, not shown
var NUM_NEXT_PIECES: number = 5; //must be less than 7

var KEY = {
	play: 13, //enter
	pause: 13, //enter
	left: 37,
	right: 39,
	down: 40,
	rotate: 38, //up
	drop: 32, //space
	hold: 16 //shift
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
