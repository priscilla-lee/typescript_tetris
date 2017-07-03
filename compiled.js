/************************************************************************
* CUSTOMIZABLE VARIABLES: cols, rows, size, keys, delay, colors
    ? what keys/controls
    ? style/color/image of tetrominos
    ? ghost or no ghost
    ? how many games at same time? 1 or 2 player
    ? reveal how many "next" blocks

************************************************************************/
var key = {
    play: 13,
    pause: 13,
    left: 37,
    right: 39,
    down: 40,
    rotate: 38,
    drop: 32,
    hold: 16 //shift
};
var delay = 300; //milliseconds
var color = {
    I: { outline: "#0D455B", fill: "#1A9AFC", shade: "#1986D3", highlight: "#26ADFF", twinkle: "white" },
    J: { outline: "#001467", fill: "#133BDF", shade: "#1224C2", highlight: "#245CDF", twinkle: "white" },
    L: { outline: "#842600", fill: "#F96700", shade: "#D74900", highlight: "#F78400", twinkle: "white" },
    O: { outline: "#CA9720", fill: "#FFDE23", shade: "#FDB900", highlight: "#FDC500", twinkle: "white" },
    S: { outline: "#459100", fill: "#7EEB00", shade: "#72D000", highlight: "#8BED00", twinkle: "white" },
    T: { outline: "#8D1B8A", fill: "#DB2DC4", shade: "#C232A2", highlight: "#E135CD", twinkle: "white" },
    Z: { outline: "#AF203C", fill: "#F21F48", shade: "#F21F48", highlight: "#F95A83", twinkle: "white" },
    ".": { outline: "black", fill: "#222", shade: "#222", highlight: "#222", twinkle: "#222" },
    "ghost": { outline: "black", fill: "#888", shade: "#222", highlight: "#222", twinkle: "#888" }
};
// var color = {
// 	I: {outline: "black", fill: "turquoise", shade: "turquoise", highlight: "turquoise"},
// 	J: {outline: "black", fill: "blue", shade: "blue", highlight: "blue"},
// 	L: {outline: "black", fill: "orange", shade: "orange", highlight: "orange"},
// 	O: {outline: "black", fill: "yellow", shade: "yellow", highlight: "yellow"},
// 	S: {outline: "black", fill: "green", shade: "green", highlight: "green"},
// 	T: {outline: "black", fill: "purple", shade: "purple", highlight: "purple"},
// 	Z: {outline: "black", fill: "red", shade: "red", highlight: "red"},
// 	".": {outline: "black", fill: "#2A2A2A", shade: "#2A2A2A", highlight: "#2A2A2A"},
// 	"ghost": {outline: "black", fill: "white", shade: "white", highlight: "white"},
// };
console.log("loaded customize.js successfully");
/************************************************************************
* GAME: game logic, loop, start, play, pause, etc
************************************************************************/
var Game = (function () {
    function Game(grid) {
        this.started = false;
        this.loop = null;
        this.playing = false;
        this.randomPieces = new RandomPieces();
        this.current;
        this.held;
        this.limitHold = false;
        this.grid = grid;
    }
    Game.prototype.start = function () {
        this.started = true;
        this._nextPiece();
        this.play();
    };
    Game.prototype.play = function () {
        var _this = this;
        this.loop = setInterval(function () { return _this.step(); }, delay);
        this.playing = true;
    };
    Game.prototype.pause = function () {
        clearInterval(this.loop);
        this.playing = false;
    };
    Game.prototype.step = function () {
        //self.current.drawGhost();
        this.current.draw();
        if (!this.current.fall())
            this._nextPiece();
        render.next(); //next_draw.all();
    };
    Game.prototype._nextPiece = function () {
        var next = this.randomPieces.getNext();
        this.current = new Tetromino(next);
        this.current.add();
        this.current.draw();
        this.limitHold = false;
        this.grid.collapseFullRows();
        //this.current.drawGhost();
        this.current.draw();
    };
    Game.prototype.move = function (dir) {
        this.current.move(dir);
    };
    Game.prototype.rotate = function () {
        this.current.rotate();
    };
    Game.prototype.drop = function () {
        this.current.drop();
        this._nextPiece();
    };
    Game.prototype.hold = function () {
        //limit hold swaps
        if (this.limitHold)
            return;
        else
            this.limitHold = true;
        if (this.held) {
            //remmove & erase current
            this.current.remove();
            this.current.erase();
            //add & draw held
            this.held.resetPosition();
            this.held.add();
            this.held.resetGhost();
            this.held.draw();
            //swap
            var temp = this.held;
            this.held = this.current;
            this.current = temp;
        }
        else {
            //erase current & put in hold
            this.current.remove();
            this.current.erase();
            this.held = this.current;
            //draw from next list
            var next = this.randomPieces.getNext();
            this.current = new Tetromino(next);
            this.current.add();
            this.current.draw();
        }
    };
    Game.prototype.keyPressed = function () {
        render.next(); //next_draw.all();
        render.hold(); //hold_draw.all(); 
        //this.current.drawGhost();
        this.current.draw();
    };
    return Game;
}());
/************************************************************************
* RANDOM PIECE GENERATOR: 7 bag method
************************************************************************/
var RandomPieces = (function () {
    function RandomPieces() {
        this._bag = new Bag();
        this._list = this._bag.batch();
    }
    RandomPieces.prototype.getList = function () {
        return this._list;
    };
    RandomPieces.prototype.getNext = function (number) {
        if (number === void 0) { number = 1; }
        if (this._list.length < Bag.MAX_CAPACITY)
            this._list.push(this._bag.select());
        var next = this._list.shift(); //removes first and shifts everything down
        return next;
    };
    return RandomPieces;
}());
var Bag = (function () {
    function Bag() {
        this._pieces = ["I", "J", "L", "O", "S", "T", "Z"];
    }
    Bag.prototype.select = function () {
        if (this._pieces.length == 0)
            this._replenish();
        var randomIndex = Math.floor(Math.random() * this._pieces.length);
        var selected = this._pieces[randomIndex];
        this._pieces.splice(randomIndex, 1);
        return selected;
    };
    Bag.prototype._replenish = function () {
        this._pieces = ["I", "J", "L", "O", "S", "T", "Z"];
    };
    Bag.prototype.batch = function () {
        var batch = [];
        for (var i = 0; i < 7; i++)
            batch.push(this.select());
        return batch;
    };
    Bag.MAX_CAPACITY = 7;
    return Bag;
}());
console.log("loaded game.js successfully");
/************************************************************************
* GRID: 2d array, valid & empty checking
************************************************************************/
var Grid = (function () {
    function Grid() {
        for (var r = 0; r < rows + topRows; r++) {
            var oneRow = {};
            for (var c = 0; c < cols; c++) {
                oneRow[c] = ".";
            }
            this[r] = oneRow;
        } //creates the 2d array
    }
    Grid.prototype.isValidEmpty = function (row, col) {
        return this._isValid(row, col) && this._isEmpty(row, col);
    };
    Grid.prototype._isEmpty = function (row, col) {
        return this[row][col] == ".";
    };
    Grid.prototype._isValid = function (row, col) {
        return this._isValidRow(row) && this._isValidCol(col);
    };
    Grid.prototype._isValidCol = function (col) {
        return (col >= 0 && col < cols);
    };
    Grid.prototype._isValidRow = function (row) {
        return (row >= 0 && row < rows + topRows);
    };
    Grid.prototype._isEmptyRow = function (row) {
        for (var col = 0; col < cols; col++) {
            if (this[row][col] != ".")
                return false;
        }
        return true;
    };
    Grid.prototype._isFullRow = function (row) {
        for (var col = 0; col < cols; col++) {
            if (this[row][col] == ".")
                return false;
        }
        return true;
    };
    Grid.prototype._clearRow = function (row) {
        for (var c = 0; c < cols; c++)
            this[row][c] = ".";
    };
    Grid.prototype._collapseRow = function (row) {
        var tallest = this._tallestDirtyRow();
        while (row > tallest) {
            this._shiftRowFromTo(row - 1, row);
            row--;
        }
        this._clearRow(row); //clear the top row that got shifted down
        render.board(); //board_draw.all(); 
    };
    Grid.prototype.collapseFullRows = function () {
        var tallest = this._tallestDirtyRow();
        for (var r = tallest; r < rows + topRows; r++) {
            if (this._isFullRow(r))
                this._collapseRow(r);
        }
    };
    Grid.prototype._shiftRowFromTo = function (from, to) {
        for (var c = 0; c < cols; c++)
            this[to][c] = this[from][c];
    };
    Grid.prototype._isDirtyRow = function (row) {
        return !this._isEmptyRow(row);
    };
    Grid.prototype._tallestDirtyRow = function () {
        var r = rows - 1;
        while (this._isDirtyRow(r))
            r--;
        return r + 1;
    };
    Grid.prototype._numDirtyRows = function () {
        var tallest = this._tallestDirtyRow();
        return rows - tallest; //# of "dirty" rows
    };
    return Grid;
}());
console.log("loaded grid.js successfully");
var cols = 10; //width
var rows = 20; //height
var unit = 20; //size of block on grid
var topRows = 5; //invisible rows at top, not shown
var scale = {
    board: {
        x: unit * 4, y: 0,
        size: unit,
        weight: unit / 10,
        outer: unit / 5, mid: unit / 7, inner: unit * 0.8, ctn: unit / 5 //bezel thicknesses
    },
    hold: {
        x: unit * 0.5, y: unit * 2,
        outer: unit / 5, mid: unit / 3, inner: 0, ctn: 0
    },
    next: {
        x: unit * (6 + cols), y: unit * 2,
        outer: unit / 5, mid: unit / 3, inner: 0, ctn: 0
    },
    box_lg: {
        size: unit * 0.8,
        weight: unit / 10 * 0.8,
        box: unit * 0.9 * 4 //size of containing box
    },
    box_md: {
        size: unit * 0.7,
        weight: unit / 10 * 0.7,
        box: unit * 0.8 * 4
    },
    box_sm: {
        size: unit * 0.6,
        weight: unit / 10 * 0.6,
        box: unit * 0.7 * 4,
        offset: unit * 0.2
    }
};
var Dimensions = (function () {
    function Dimensions() {
    }
    Dimensions.next = function () {
        var box = scale["box_md"].box;
        var n = scale.next;
        n.X = n.outer + n.mid + n.inner + n.ctn;
        n.Y = n.outer + n.mid + n.inner + n.ctn;
        var o = scale["box_sm"].offset;
        var h = box * 5 + 2 * (n.Y) + o;
        var w = box + 2 * (n.X);
        return { height: h, width: w };
    };
    Dimensions.hold = function () {
        var box = scale["box_md"].box;
        var h = scale.hold;
        h.X = h.outer + h.mid + h.inner + h.ctn;
        h.Y = h.outer + h.mid + h.inner + h.ctn;
        var hei = box + 2 * (h.Y);
        var w = box + 2 * (h.X);
        return { height: hei, width: w };
    };
    Dimensions.board = function () {
        var b = scale.board;
        b.X = b.outer + b.mid + b.inner + b.ctn;
        b.Y = b.outer + b.mid + b.inner + b.ctn;
        var h = rows * b.size + 2 * (b.Y);
        var w = cols * b.size + 2 * (b.X);
        return { height: h, width: w };
    };
    return Dimensions;
}());
var Render = (function () {
    function Render(canvas) {
        this.element = canvas;
        // this.rows = rows;
        // this.cols = cols;
    }
    Render.prototype.next = function () {
        var box = scale["box_md"].box;
        var n = scale.next;
        n.X = n.outer + n.mid + n.inner + n.ctn;
        n.Y = n.outer + n.mid + n.inner + n.ctn;
        var o = scale["box_sm"].offset;
        var height = box * 5 + 2 * (n.Y) + o;
        var width = box + 2 * (n.X);
        n.X += n.x;
        n.Y += n.y;
        var array = game.randomPieces.getList();
        // "all" function
        CanvasUtil.bezel(this.element, "next", width, height);
        array = game.randomPieces.getList(); //update
        //draw 1 medium box
        var boxDraw = new BoxDraw(this.element, "box_md", n.X + 0, n.Y, array[0]);
        boxDraw.box();
        //draw 4 smaller boxes
        for (var i = 1; i < 5; i++) {
            var boxDraw = new BoxDraw(this.element, "box_sm", n.X + o + 0, n.Y + 2 * o + box * i, array[i]);
            boxDraw.box();
        }
    };
    Render.prototype.hold = function () {
        var box = scale["box_md"].box;
        var h = scale.hold;
        h.X = h.outer + h.mid + h.inner + h.ctn;
        h.Y = h.outer + h.mid + h.inner + h.ctn;
        var height = box + 2 * (h.Y);
        var width = box + 2 * (h.X);
        h.X += h.x;
        h.Y += h.y;
        // "all" function
        CanvasUtil.bezel(this.element, "hold", width, height);
        if (game.held) {
            var boxDraw = new BoxDraw(this.element, "box_md", h.X + 0, h.Y + 0, game.held.shape);
            boxDraw.box();
        }
        else {
            var boxDraw = new BoxDraw(this.element, "box_md", h.X + 0, h.Y + 0, ".");
            boxDraw.empty();
        }
    };
    Render.prototype.board = function () {
        var b = scale.board;
        b.X = b.outer + b.mid + b.inner + b.ctn;
        b.Y = b.outer + b.mid + b.inner + b.ctn;
        var height = rows * b.size + 2 * (b.Y);
        var width = cols * b.size + 2 * (b.X);
        b.X += b.x;
        b.Y += b.y;
        // "all" function
        CanvasUtil.bezel(this.element, "board", width, height);
        for (var r = topRows; r < rows + topRows; r++) {
            for (var c = 0; c < cols; c++)
                this.block(r, c, grid[r][c]);
        }
    };
    Render.prototype.block = function (r, c, shape) {
        // duplicate beginning
        var b = scale.board;
        b.X = b.outer + b.mid + b.inner + b.ctn;
        b.Y = b.outer + b.mid + b.inner + b.ctn;
        var height = rows * b.size + 2 * (b.Y);
        var width = cols * b.size + 2 * (b.X);
        b.X += b.x;
        b.Y += b.y;
        // duplicate end
        var size = scale.board.size;
        var top = topRows * size;
        CanvasUtil.square(this.element, "board", c * size + b.X, r * size + b.Y - top, shape);
    };
    Render.prototype.emptyFrame = function () { };
    Render.prototype.clearBoard = function () { };
    Render.prototype.clearHold = function () { };
    Render.prototype.clearNext = function () { };
    Render.prototype.updateNext = function (tetrominos) { };
    Render.prototype.updateHold = function (tetromino) { };
    Render.prototype.updateBoard = function (grid) { };
    Render.prototype.eraseTetromino = function () { };
    Render.prototype.drawTetromino = function () { };
    return Render;
}());
/************************************************************************
* CanvasUtil: (rendering) set board canvas w x h, draw block & board
************************************************************************/
var CanvasUtil = (function () {
    function CanvasUtil() {
    }
    CanvasUtil.rect = function (element, x, y, w, h, weight, fill, line) {
        var ctx = element.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.strokeStyle = line;
        ctx.fillRect(x, y, w, h);
        ctx.lineWidth = weight;
        ctx.rect(x, y, w, h);
        if (weight != 0)
            ctx.stroke();
    };
    CanvasUtil.square = function (element, scal, x, y, shape) {
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
        this.rect(element, x + (size * 0.05), y + (size * 0.05), size * 0.9, size * 0.9, 0, fill, fill);
        //inner rectangle
        this.rect(element, x + (size * 0.25), y + (size * 0.25), size * 0.5, size * 0.5, weight, shd, hlgt);
        //twinkle
        this.rect(element, x + (size * 0.1), y + (size * 0.1), size * 0.1, size * 0.1, 0, twkl, twkl);
    };
    CanvasUtil.squareImage = function (element, img, x, y, w, h) {
        var ctx = element.getContext("2d");
        ctx.drawImage(img, 10, 10, 10, 10);
    };
    CanvasUtil.circle = function (element, x, y, r, fill, line) {
        var ctx = element.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.strokeStyle = line;
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    };
    CanvasUtil.box = function (element, scal, x, y) {
        var size = scale[scal].box;
        var weight = scale[scal].weight;
        var fill = color["."].fill;
        // this.rect(loc, x, y, size, size, weight, fill, "black");
        this.roundRect(element, x, y, size, size, unit / 3, "black");
        this.roundRect(element, x + (size * 0.05), y + (size * 0.05), size * 0.9, size * 0.9, unit / 4, fill);
    };
    CanvasUtil.roundRect = function (element, x, y, w, h, r, color) {
        var ctx = element.getContext("2d");
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
    };
    CanvasUtil.bezel = function (element, loc, w, h) {
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
        if (otr != 0)
            this.roundRect(element, x + 0, y + 0, w, h, unit * 0.9, "#666"); //outer
        if (mid != 0)
            this.roundRect(element, x + o, y + o, w - (o * 2), h - (o * 2), unit * 0.8, "#f9f9f9"); //mid
        if (inr != 0)
            this.roundRect(element, x + m, y + m, w - (m * 2), h - (m * 2), unit * 0.7, "#ddd"); //inner
        if (ctn != 0)
            this.roundRect(element, x + i, y + i, w - (i * 2), h - (i * 2), unit * 0.4, "#000"); //container
        //this.roundRect(element, x+c, y+c, w-(c*2), h-(c*2), unit*0.4, "rgba(0,0,0,0)"); //transparent inside
    };
    return CanvasUtil;
}());
var BoxDraw = (function () {
    function BoxDraw(element, scal, x, y, shape) {
        this.element = element;
        this.scal = scal;
        this.x = x;
        this.y = y;
        this._shape = shape;
        this.dimensions = {
            I: { w: 4, h: 1 }, J: { w: 3, h: 2 }, L: { w: 3, h: 2 }, O: { w: 2, h: 2 },
            S: { w: 3, h: 2 }, T: { w: 3, h: 2 }, Z: { w: 3, h: 2 }
        };
    }
    BoxDraw.prototype.box = function () {
        this.empty();
        this.shape();
    };
    BoxDraw.prototype.empty = function () {
        CanvasUtil.box(this.element, this.scal, this.x, this.y);
    };
    BoxDraw.prototype.shape = function () {
        var coords = this._getShapeCoords();
        for (var i in coords)
            CanvasUtil.square(this.element, this.scal, coords[i].X, coords[i].Y, this._shape);
    };
    BoxDraw.prototype._getCenterCoord = function () {
        var dim = this.dimensions[this._shape];
        var box = scale[this.scal].box;
        var size = scale[this.scal].size;
        var xCenter = this.x + (box - size * dim.w) / 2; //depends on width
        var yCenter = this.y + (box - size * dim.h) / 2; //depends on height
        return { X: xCenter, Y: yCenter };
    };
    BoxDraw.prototype._getShapeCoords = function () {
        var s = scale[this.scal].size;
        var ctr = this._getCenterCoord();
        var x = ctr.X, y = ctr.Y;
        switch (this._shape) {
            case 'I': return [{ X: x, Y: y }, { X: x + s, Y: y }, { X: x + (2 * s), Y: y }, { X: x + (3 * s), Y: y }];
            case 'J': return [{ X: x, Y: y }, { X: x, Y: y + s }, { X: x + s, Y: y + s }, { X: x + (2 * s), Y: y + s }];
            case 'L': return [{ X: x, Y: y + s }, { X: x + s, Y: y + s }, { X: x + (2 * s), Y: y + s }, { X: x + (2 * s), Y: y }];
            case 'O': return [{ X: x, Y: y }, { X: x + s, Y: y }, { X: x + s, Y: y + s }, { X: x, Y: y + s }];
            case 'S': return [{ X: x, Y: y + s }, { X: x + s, Y: y + s }, { X: x + s, Y: y }, { X: x + (2 * s), Y: y }];
            case 'T': return [{ X: x + s, Y: y }, { X: x, Y: y + s }, { X: x + s, Y: y + s }, { X: x + (2 * s), Y: y + s }];
            case 'Z': return [{ X: x, Y: y }, { X: x + s, Y: y }, { X: x + s, Y: y + s }, { X: x + (2 * s), Y: y + s }];
        }
    };
    return BoxDraw;
}());
console.log("loaded render.js successfully");
/************************************************************************
* KEYBOARD INPUT: onkeydown
************************************************************************/
window.onkeydown = function (e) {
    if (!game.started) {
        game.start();
        return;
    } //any key to start game
    if (e.keyCode == key.play || e.keyCode == key.pause) {
        if (game.playing)
            game.pause();
        else
            game.play();
    } //toggle play & pause
    if (game.playing) {
        if (e.keyCode == key.down) {
            game.move("down");
        }
        if (e.keyCode == key.left) {
            game.move("left");
        }
        if (e.keyCode == key.right) {
            game.move("right");
        }
        if (e.keyCode == key.rotate) {
            game.rotate();
        }
        if (e.keyCode == key.drop) {
            game.drop();
        }
        if (e.keyCode == key.hold) {
            game.hold();
        }
        game.keyPressed(); //anytime key is pressed
    }
};
/************************************************************************
* SET UP THE GAME: create necessary game variables & draw
************************************************************************/
var grid = new Grid();
var game = new Game(grid);
var render = new Render(canvas);
canvas.height = Math.max(Dimensions.board().width, Dimensions.next().height * 1.2) + 100;
canvas.width = Dimensions.board().width + Dimensions.next().width + Dimensions.hold().width;
render.board();
render.next();
render.hold();
console.log("loaded tetris.js successfully");
/************************************************************************
* TETROMINO: stores shape, an array of blocks, and methods
*			 contains, canMove, move, canRotate, rotate, add, & remove
************************************************************************/
var Tetromino = (function () {
    function Tetromino(shape) {
        this.resetPosition = function () {
            this.blocks = Tetromino.getBlocks(this.shape, this);
        };
        this.shape = shape;
        this.blocks = Tetromino.getBlocks(this.shape, this);
        this.ghostBlocks = Tetromino.getBlocks("ghost", this);
    }
    Tetromino.prototype.contains = function (r, c) {
        for (var i in this.blocks) {
            var inBlocks = this.blocks[i].equals(r, c);
            var inGhost = this.ghostBlocks[i].equals(r, c);
            if (inBlocks || inGhost)
                return true;
        }
        return false;
    };
    Tetromino.prototype._canMove = function (dir) {
        for (var i in this.blocks) {
            if (!this.blocks[i].canMove(dir))
                return false;
        }
        return true;
    };
    Tetromino.prototype.move = function (dir) {
        if (this._canMove(dir)) {
            this.remove();
            this.erase();
            for (var i in this.blocks)
                this.blocks[i].move(dir);
            this.add();
            this.draw();
            return true;
        } //else console.log("can't move " + dir);
        return false;
    };
    Tetromino.prototype._canRotate = function () {
        for (var b in this.blocks) {
            if (!this.blocks[b].canRotate())
                return false;
        }
        return true;
    };
    Tetromino.prototype.rotate = function () {
        if (this._canRotate()) {
            this.remove();
            this.erase();
            for (var b in this.blocks)
                this.blocks[b].rotate();
            this.add();
            this.draw();
        } //else console.log("can't rotate");
    };
    Tetromino.prototype.add = function () {
        for (var i in this.blocks) {
            var b = this.blocks[i];
            grid[b.r][b.c] = this.shape;
        }
    };
    Tetromino.prototype.remove = function () {
        for (var i in this.blocks) {
            var b = this.blocks[i];
            grid[b.r][b.c] = ".";
        }
    };
    Tetromino.prototype.draw = function () {
        this.drawGhost();
        for (var i in this.blocks)
            this.blocks[i].draw();
    };
    Tetromino.prototype.erase = function () {
        for (var a = 0; a < 5; a++) {
            for (var i in this.blocks)
                this.blocks[i].erase();
        } //erase 5 times to eliminate blur trails
        this.eraseGhost();
    };
    Tetromino.prototype.fall = function () {
        return this.move("down");
    };
    Tetromino.prototype.drop = function () {
        while (this.fall())
            ;
    };
    Tetromino.prototype.eraseGhost = function () {
        this.calcGhost();
        for (var i in this.ghostBlocks) {
            var g = this.ghostBlocks[i];
            /*board_draw.*/ render.block(g.r, g.c, ".");
        }
    };
    Tetromino.prototype.drawGhost = function () {
        this.calcGhost();
        for (var i in this.ghostBlocks) {
            var g = this.ghostBlocks[i];
            /*board_draw.*/ render.block(g.r, g.c, "ghost");
        }
    };
    Tetromino.prototype.resetGhost = function () {
        this.ghostBlocks = Tetromino.getBlocks("ghost", this);
    };
    Tetromino.prototype.calcGhost = function () {
        var ghost = []; //make deep copy of blocks
        for (var i in this.blocks) {
            var b = this.blocks[i];
            ghost.push(new Block(b.r, b.c, this));
        }
        outer: while (true) {
            for (var i in ghost)
                if (!ghost[i].canMove("down"))
                    break outer;
            for (var i in ghost)
                ghost[i].r++;
        }
        this.ghostBlocks = ghost; //update ghostBlocks
    };
    Tetromino.getBlocks = function (shape, T) {
        //center, top position
        var mid = Math.floor(cols / 2) - 1; //integer division, truncates
        var shift = mid - 1; //shifted for 4-wide or 3-wide tetrominos
        var i = shift, j = shift, l = shift, s = shift, t = shift, z = shift, o = mid;
        var t = topRows - 1; //shifted for top rows
        switch (shape) {
            case 'I': return [new Block(0 + t, i + 1, T), new Block(0 + t, i + 0, T), new Block(0 + t, i + 2, T), new Block(0 + t, i + 3, T)];
            case 'J': return [new Block(1 + t, j + 1, T), new Block(0 + t, j + 0, T), new Block(1 + t, j + 0, T), new Block(1 + t, j + 2, T)];
            case 'L': return [new Block(1 + t, l + 1, T), new Block(0 + t, l + 2, T), new Block(1 + t, l + 0, T), new Block(1 + t, l + 2, T)];
            case 'O': return [new Block(0 + t, o + 0, T), new Block(0 + t, o + 1, T), new Block(1 + t, o + 0, T), new Block(1 + t, o + 1, T)];
            case 'S': return [new Block(0 + t, s + 1, T), new Block(0 + t, s + 2, T), new Block(1 + t, s + 0, T), new Block(1 + t, s + 1, T)];
            case 'T': return [new Block(1 + t, t + 1, T), new Block(0 + t, t + 1, T), new Block(1 + t, t + 0, T), new Block(1 + t, t + 2, T)];
            case 'Z': return [new Block(0 + t, z + 1, T), new Block(0 + t, z + 0, T), new Block(1 + t, z + 1, T), new Block(1 + t, z + 2, T)];
            case 'ghost': return [new Block(-1, -1, T), new Block(-1, -1, T), new Block(-1, -1, T), new Block(-1, -1, T)];
        }
    };
    return Tetromino;
}());
/************************************************************************
* BLOCK: stores row, col, parent Tetromino, also contains methods
*		 equals, canMove, move, canRotate, rotate, draw, & erase
************************************************************************/
var Block = (function () {
    function Block(row, col, T) {
        this.r = row;
        this.c = col;
        this.T = T;
    }
    Block.prototype.equals = function (r, c) {
        return (this.r == r && this.c == c);
    };
    Block.prototype.canMove = function (dir) {
        var newR = this.r;
        var newC = this.c;
        if (dir == "down") {
            newR = this.r + 1;
        }
        if (dir == "left") {
            newC = this.c - 1;
        }
        if (dir == "right") {
            newC = this.c + 1;
        }
        return (this.T.contains(newR, newC) || grid.isValidEmpty(newR, newC));
    };
    Block.prototype.move = function (dir) {
        if (dir == "down") {
            this.r++;
        }
        if (dir == "left") {
            this.c--;
        }
        if (dir == "right") {
            this.c++;
        }
    };
    Block.prototype.canRotate = function () {
        if (this.T.shape == "O")
            return true; //squares don't rotate
        var pivot = this.T.blocks[0]; //first block is pivot
        var newR = (this.c - pivot.c) + pivot.r;
        var newC = -(this.r - pivot.r) + pivot.c;
        return (this.T.contains(newR, newC) || grid.isValidEmpty(newR, newC));
    };
    Block.prototype.rotate = function () {
        if (this.T.shape == "O")
            return; //squares don't rotate
        var pivot = this.T.blocks[0]; //first block is pivot
        var newC = -(this.r - pivot.r) + pivot.c;
        var newR = (this.c - pivot.c) + pivot.r;
        this.c = newC;
        this.r = newR;
    };
    Block.prototype.draw = function () {
        if (this.r >= topRows)
            /*board_draw.*/ render.block(this.r, this.c, this.T.shape);
    };
    Block.prototype.erase = function () {
        if (this.r >= topRows)
            /*board_draw.*/ render.block(this.r, this.c, ".");
    };
    return Block;
}());
console.log("loaded tetromino.js successfully");
