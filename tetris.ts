/************************************************************************
* SET UP THE GAME: create necessary game variables & draw
************************************************************************/
function main(): void {
	// set up game 1
	var render = new Render(canvas1);
	var game = new Game(render);

	// set up game 2
	var render2 = new Render(canvas2);
	var game2 = new Game(render2);

	// keyboard input
	window.onkeydown = function(e) {
		// game 1

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

		// game 2

		//any key to start game
		if (!game2.started) {
			game2.start(); return;
		} 

		//toggle play & pause
		if (e.keyCode == KEY.play || e.keyCode == KEY.pause) {
			if (game2.playing) game2.pause();
			else game2.play();
		} 

		//only listen to keys if game is playing
		if (game2.playing) { 
			if (e.keyCode == KEY.down) {game2.move(Direction.Down);} 
			if (e.keyCode == KEY.left) {game2.move(Direction.Left);} 
			if (e.keyCode == KEY.right) {game2.move(Direction.Right);} 
			if (e.keyCode == KEY.rotate) {game2.rotate();}
			if (e.keyCode == KEY.drop) {game2.drop();}
			if (e.keyCode == KEY.hold) {game2.hold();}
			game2.keyPressed(); //anytime key is pressed
		}

	};
}

main();