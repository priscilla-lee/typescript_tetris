/************************************************************************
* KEYBOARD INPUT: onkeydown
************************************************************************/
// start with empty function
window.onkeydown = function(e) {};

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
	}
}

/************************************************************************
* SET UP THE GAME: create necessary game variables & draw
************************************************************************/

function startGame(canvas: any, numCols: number, numRows: number, keyControls: KeyControls): void {
	var keys: Keys = new Keys(keyControls); 
	var render: Render = new Render(canvas, numCols, numRows);
		render.drawInitialFrame();
	var game: Game = new Game(render, keys);
	addGameKeyListener(game);
}


function addGameKeyListener(game: Game): void {
	var oldKeyDown = window.onkeydown;
	window.onkeydown = function(e) {
		oldKeyDown(e);
		gameKeyPress(game, e);
	};
}

play1.onclick = function(e) {
	well1.style.display = "block";
	form1.style.display = "none";
	startGame(canvas1, parseInt(cols1.value), parseInt(rows1.value), KeyControls.Default);
}
