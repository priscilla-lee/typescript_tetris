/************************************************************************
* KEYBOARD INPUT: onkeydown
************************************************************************/
window.onkeydown = function(e) {
	if (!game.started) {game.start(); return;} //any key to start game
	if (e.keyCode == key.play || e.keyCode == key.pause) {
		if (game.playing) game.pause();
		else game.play();
	} //toggle play & pause
	if (game.playing) { //only listen to keys if game is playing
		if (e.keyCode == key.down) {game.move("down");}
		if (e.keyCode == key.left) {game.move("left");}
		if (e.keyCode == key.right) {game.move("right");}
		if (e.keyCode == key.rotate) {game.rotate();}
		if (e.keyCode == key.drop) {game.drop();}
		if (e.keyCode == key.hold) {game.hold();}
		game.keyPressed(); //anytime key is pressed
	}
};

/************************************************************************
* SET UP THE GAME: create necessary game variables & draw
************************************************************************/
var grid = new Grid();
var game = new Game(grid);
//var board_draw = new Board_Draw(canvas);
var render = new Render(canvas);
//var next_draw = new Next_Draw();
//var hold_draw = new Hold_Draw(canvas);

canvas.height = Math.max(Dimensions.board().width /*board_draw.height*/, Dimensions.next().height /*next_draw.height*/*1.2) + 100;
canvas.width = Dimensions.board().width /*board_draw.width*/ + Dimensions.next().width/*next_draw.width*/ + Dimensions.hold().width; //hold_draw.width;

render.board(); //board_draw.all();
render.next(); //next_draw.all();
render.hold(); //hold_draw.all();

console.log("loaded tetris.js successfully");