/************************************************************************
* KEYBOARD INPUT: onkeydown
************************************************************************/
window.onkeydown = function(e) {
	//any key to start game
	if (!game.started) {
		game.start(); return;
	} 

	//toggle play & pause
	if (e.keyCode == KEY.play || e.keyCode == KEY.pause) {
		if (game.playing) game.pause();
		else game.play();
	} 

	//only listen to keys if game is playing
	if (game.playing) { 
		if (e.keyCode == KEY.down) {game.move(Direction.Down);} 
		if (e.keyCode == KEY.left) {game.move(Direction.Left);} 
		if (e.keyCode == KEY.right) {game.move(Direction.Right);} 
		if (e.keyCode == KEY.rotate) {game.rotate();}
		if (e.keyCode == KEY.drop) {game.drop();}
		if (e.keyCode == KEY.hold) {game.hold();}
		game.keyPressed(); //anytime key is pressed
	}
};

/************************************************************************
* SET UP THE GAME: create necessary game variables & draw
************************************************************************/
var grid = new Grid();
var game = new Game(grid);
var render = new Render(canvas);