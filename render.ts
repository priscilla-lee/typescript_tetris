var cols = 10; //width
var rows = 20; //height
var unit = 20; //size of block on grid

var topRows = 5; //invisible rows at top, not shown


var scale = {
	board: {
		x: unit*4, y: 0,
		size: unit, //size of block 
		weight: unit/10, //line weight of block
		outer: unit/5, mid: unit/7, inner: unit*0.8, ctn: unit/5 //bezel thicknesses
	},
	hold: {
		x: unit*0.5, y: unit*2,
		outer: unit/5, mid: unit/3, inner: 0, ctn: 0
	},
	next: {
		x: unit*(6+cols), y: unit*2,
		outer: unit/5, mid: unit/3, inner: 0, ctn: 0
	},
	box_lg: {
		size: unit*0.8,
		weight: unit/10*0.8,
		box: unit*0.9*4 //size of containing box
	},
	box_md: {
		size: unit*0.7,
		weight: unit/10*0.7,
		box: unit*0.8*4
	},
	box_sm: {
		size: unit*0.6,
		weight: unit/10*0.6,
		box: unit*0.7*4,
		offset: unit*0.2
	}
};

/************************************************************************
* Render: (rendering) set board canvas w x h, draw block & board
************************************************************************/
/*private*/ var Render = {
	rect: function(element, x, y, w, h, weight, fill, line) {
		var ctx= element.getContext("2d");
			ctx.beginPath();
			ctx.fillStyle = fill;
			ctx.strokeStyle = line;
			ctx.fillRect(x, y, w, h);
			ctx.lineWidth = weight;
			ctx.rect(x, y, w, h);
			if (weight != 0) ctx.stroke();
	},
	square: function(element, scal, x, y, shape) {
		var size = scale[scal].size;
		var weight = scale[scal].weight;

		var otln = color[shape].outline;
		var fill = color[shape].fill;
		var shd = color[shape].shade;
		var hlgt = color[shape].highlight;
		var twkl = color[shape].twinkle;

		//outline
		this.rect(element, x, y, size, size, 0, otln, otln);
		//outer rectangle
		this.rect(element, x+(size*0.05), y+(size*0.05), size*0.9, size*0.9, 0, fill, fill);
		//inner rectangle
		this.rect(element, x+(size*0.25), y+(size*0.25), size*0.5, size*0.5, weight, shd, hlgt);
		//twinkle
		this.rect(element, x+(size*0.1), y+(size*0.1), size*0.1, size*0.1, 0, twkl, twkl);
	},
	squareImage: function(element, img, x, y, w, h) {
	    var ctx = element.getContext("2d");
	   		ctx.drawImage(img,10,10,10,10);
	},
	circle: function(element, x, y, r, fill, line) {
		var ctx = element.getContext("2d");
			ctx.beginPath();
			ctx.fillStyle = fill;
			ctx.strokeStyle = line;
			ctx.arc(x, y, r, 0, 2*Math.PI);
			ctx.fill();
			ctx.stroke();
	},
	box: function(element, scal, x, y) {
		var size = scale[scal].box;
		var weight = scale[scal].weight;
		var fill = color["."].fill;
		// this.rect(loc, x, y, size, size, weight, fill, "black");
		this.roundRect(element, x, y, size, size, unit/3, "black");
		this.roundRect(element, x+(size*0.05), y+(size*0.05), size*0.9, size*0.9, unit/4, fill);
	},
	roundRect: function(element, x, y, w, h, r, color) {
		var ctx= element.getContext("2d");
			ctx.beginPath();
			ctx.fillStyle = color;
			// ctx.strokeStyle = "red";
			// ctx.lineWidth = 10;
			//draw rounded rectangle
			ctx.moveTo(x + r, y);
			ctx.lineTo(x + w - r, y);
			ctx.quadraticCurveTo(x + w, y, x + w, y + r);
			ctx.lineTo(x + w, y + h - r);
			ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
			ctx.lineTo(x + r, y + h);
			ctx.quadraticCurveTo(x, y + h, x, y + h - r);
			ctx.lineTo(x, y + r);
			ctx.quadraticCurveTo(x, y, x + r, y);
			ctx.closePath();
			//stroke & fill	
			ctx.fill();    
			// ctx.stroke();  
	},
	bezel: function(element, loc, w, h) {
		// var w = loc.width;
		// var h = loc.height;

		var x = scale[loc].x;
		var y = scale[loc].y;		

		var otr = scale[loc].outer;
		var mid = scale[loc].mid;
		var inr = scale[loc].inner;
		var ctn = scale[loc].ctn;

		var o = otr;
		var m = otr + mid;
		var i = otr + mid + inr;
		var c = otr + mid + inr + ctn;

		if (otr != 0) this.roundRect(element, x+0, y+0, w, h, unit*0.9, "#666"); //outer
		if (mid != 0) this.roundRect(element, x+o, y+o, w-(o*2), h-(o*2), unit*0.8, "#f9f9f9"); //mid
		if (inr != 0) this.roundRect(element, x+m, y+m, w-(m*2), h-(m*2), unit*0.7, "#ddd"); //inner
		if (ctn != 0) this.roundRect(element, x+i, y+i, w-(i*2), h-(i*2), unit*0.4, "#000"); //container
		//this.roundRect(element, x+c, y+c, w-(c*2), h-(c*2), unit*0.4, "rgba(0,0,0,0)"); //transparent inside
	}
};

/*private*/ function Board_Draw(element) {
	var b = scale.board;
	b.X = b.outer + b.mid + b.inner + b.ctn;
	b.Y = b.outer + b.mid + b.inner + b.ctn;

	this.height = rows*b.size + 2*(b.Y);
	this.width =  cols*b.size + 2*(b.X);

	b.X += b.x; b.Y += b.y;

	this.block = function(r, c, shape) {
		var size = scale.board.size;
		var top = topRows*size;
		Render.square(element, "board", c*size+b.X, r*size+b.Y-top, shape);
	};
	this.all = function() {
		Render.bezel(element, "board", this.width, this.height);
		for (var r = topRows; r < rows + topRows; r++) {
			for (var c = 0; c < cols; c++) 
				this.block(r, c, grid[r][c]);
		}
	};
}

/*private*/ function Hold_Draw(element) {
	var box = scale["box_md"].box;

	var h = scale.hold;
	h.X = h.outer + h.mid + h.inner + h.ctn;
	h.Y = h.outer + h.mid + h.inner + h.ctn;

	this.height = box + 2*(h.Y);
	this.width = box + 2*(h.X);

	h.X += h.x; h.Y += h.y;

	this.all = function() {
		Render.bezel(element, "hold", this.width, this.height);
		if (game.held) {
			var box_draw = new Box_Draw(element, "box_md", h.X+0, h.Y+0, game.held.shape);
			box_draw.box();			
		} else {
			var box_draw = new Box_Draw(element, "box_md", h.X+0, h.Y+0, ".");
			box_draw.empty();
		}
	};
}

/*private*/ function Next_Draw(element) {
	var box = scale["box_md"].box;

	var n = scale.next;
	n.X = n.outer + n.mid + n.inner + n.ctn;
	n.Y = n.outer + n.mid + n.inner + n.ctn;

	var o = scale["box_sm"].offset;

	this.height = box*5 + 2*(n.Y) + o;
	this.width = box + 2*(n.X);

	n.X += n.x; n.Y += n.y;

	this.array = game.randomPieces.list; 
	this.all = function() {
		Render.bezel(element, "next", this.width, this.height);
		this.array = game.randomPieces.list; //update
		//draw 1 medium box
		var box_draw = new Box_Draw(element, "box_md", n.X+0, n.Y, this.array[0]);
		box_draw.box();
		//draw 4 smaller boxes
		for (var i = 1; i < 5; i++) {
			var box_draw = new Box_Draw(element, "box_sm", n.X+o+0, n.Y+2*o+box*i, this.array[i]);
			box_draw.box();
		}
	};
}

/*private*/ function Box_Draw(element, scal, x, y, shape) {
	this.dimensions = { 
		I: {w: 4, h: 1}, J: {w: 3, h: 2}, L: {w: 3, h: 2}, O: {w: 2, h: 2}, 
		S: {w: 3, h: 2}, T: {w: 3, h: 2}, Z: {w: 3, h: 2}
	};
	this.box = function() {
		this.empty();
		this.shape();
	};
	this.empty = function() {
		Render.box(element, scal, x, y);
	};
	this.shape = function() {
		var ctr = this.getCenterCoord();
		var coords = this.getShapeCoords();
		for (var i in coords)
			Render.square(element, scal, coords[i].X, coords[i].Y, shape);
	};
	this.getCenterCoord = function() {
		var dim = this.dimensions[shape];
		var box = scale[scal].box;
		var size = scale[scal].size;

		var xCenter = x + (box - size*dim.w)/2; //depends on width
		var yCenter = y + (box - size*dim.h)/2; //depends on height

		return {X: xCenter, Y: yCenter};

	};
	this.getShapeCoords = function() {
		var s = scale[scal].size;
		var ctr = this.getCenterCoord();
		var x = ctr.X, y = ctr.Y;
		switch (shape) {
			case 'I': return [{X:x, Y:y}, {X:x+s, Y:y}, {X:x+(2*s), Y:y}, {X:x+(3*s), Y:y}];
			case 'J': return [{X:x, Y:y}, {X:x, Y:y+s}, {X:x+s, Y:y+s}, {X:x+(2*s), Y:y+s}];
			case 'L': return [{X:x, Y:y+s}, {X:x+s, Y:y+s}, {X:x+(2*s), Y:y+s}, {X:x+(2*s), Y:y}];
			case 'O': return [{X:x, Y:y}, {X:x+s, Y:y}, {X:x+s, Y:y+s}, {X:x, Y:y+s}];
			case 'S': return [{X:x, Y:y+s}, {X:x+s, Y:y+s}, {X:x+s, Y:y}, {X:x+(2*s), Y:y}];
			case 'T': return [{X:x+s, Y:y}, {X:x, Y:y+s}, {X:x+s, Y:y+s}, {X:x+(2*s), Y:y+s}];
			case 'Z': return [{X:x, Y:y}, {X:x+s, Y:y}, {X:x+s, Y:y+s}, {X:x+(2*s), Y:y+s}];
		}
	};
}



console.log("loaded render.js successfully");