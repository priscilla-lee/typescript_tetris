/************************************************************************
* KEYBOARD INPUT: onkeydown
************************************************************************/
function gameKeyPress(game: Game, e: any): void {
	//any key to start game
	if (!game.started) {
		game.start(); return;
	} 

	//toggle play & pause
	if (e.keyCode == game.keys.play || e.keyCode == game.keys.pause) {
		if (game.playing) game.pause();
		else game.play();
	} 

	//only listen to keys if game is playing
	if (game.playing) { 
		if (e.keyCode == game.keys.down) {game.move(Direction.Down);} 
		if (e.keyCode == game.keys.left) {game.move(Direction.Left);} 
		if (e.keyCode == game.keys.right) {game.move(Direction.Right);} 
		if (e.keyCode == game.keys.rotate) {game.rotate();}
		if (e.keyCode == game.keys.drop) {game.drop();}
		if (e.keyCode == game.keys.hold) {game.hold();}
		game.keyPressed(); //anytime key is pressed
	}
}

/************************************************************************
* SET UP THE GAME: create necessary game variables & draw
************************************************************************/
function main(): void {
	// set up game 1
	var numCols: number = 10;
	var numRows: number = 20;
	var keys: Keys = new Keys(KeyControls.Alternative); 
	var render: Render = new Render(canvas, numCols, numRows);
	var game: Game = new Game(render, keys);

	// set up game 2
	var numCols2: number = 15;
	var numRows2: number = 30;
	var keys2: Keys = new Keys(KeyControls.Default); 
	var render2: Render = new Render(canvas2, numCols2, numRows2);
	var game2: Game = new Game(render2, keys2);

	// keyboard input
	window.onkeydown = function(e) {
		gameKeyPress(game, e);
		gameKeyPress(game2, e);
	};
}

main();