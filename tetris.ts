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
		if (e.keyCode == key.down) {game.move(Direction.Down);} 
		if (e.keyCode == key.left) {game.move(Direction.Left);} 
		if (e.keyCode == key.right) {game.move(Direction.Right);} 
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
var render = new Render(canvas);

canvas.height = Math.max(Dimensions.board().width, Dimensions.next().height*1.2) + 100;
canvas.width = Dimensions.board().width + Dimensions.next().width + Dimensions.hold().width;

render.board(); 
render.next();
render.hold();

console.log("loaded tetris.js successfully");