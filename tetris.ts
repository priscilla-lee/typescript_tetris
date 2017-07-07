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
	}
}

/************************************************************************
* SET UP THE GAME: create necessary game variables & draw
************************************************************************/

function startGame(canvas: any, well: any, form: any, numCols: number, numRows: number, keyControls: KeyControls): void {
	UNIT = 20;
	well.style.display = "block";
	form.style.display = "none";
	var keys: Keys = new Keys(keyControls); 
	var render: Render = new Render(canvas, numCols, numRows);
	var game: Game = new Game(render, keys);
	addGameKeyListener(game);
}

// start with empty function
window.onkeydown = function(e) {};

function addGameKeyListener(game: Game): void {
	var oldKeyDown = window.onkeydown;
	window.onkeydown = function(e) {
		oldKeyDown(e);
		gameKeyPress(game, e);
	};
}

play1.onclick = function(e) {
	startGame(canvas1, well1, form1, parseInt(cols1.value), parseInt(rows1.value), KeyControls.Default);
}

play2.onclick = function(e) {
	startGame(canvas2, well2, form2, parseInt(cols2.value), parseInt(rows2.value), KeyControls.Default);
}