/************************************************************************
* GRID: 2d array, valid & empty checking
************************************************************************/
function Grid() {
	for (var r = 0; r < rows + topRows; r++) {
		var oneRow = {};
		for (var c = 0; c < cols; c++) {oneRow[c] = "."}
		this[r] = oneRow;
	} //creates the 2d array

	this.isValidEmpty = function(row, col) {return this.isValid(row, col) && this.isEmpty(row, col);};
	this.isEmpty = function(row, col) {return this[row][col] == ".";};
	this.isValid = function(row, col) {return this.isValidRow(row) && this.isValidCol(col);};
	this.isValidCol = function(col) {return (col >= 0 && col < cols);};
	this.isValidRow = function(row) {return (row >= 0 && row < rows + topRows);};
	this.isEmptyRow = function(row) {
		for (var col = 0; col < cols; col++) {
			if (this[row][col] != ".") return false;
		} return true;
	};
	this.isFullRow = function(row) {
		for (var col = 0; col < cols; col++) {
			if (this[row][col] == ".") return false;
		} return true;
	};
	this.clearRow = function(row) {
		for (var c = 0; c < cols; c++) 
			this[row][c] = ".";
	};
	this.collapseRow = function(row) {
		var tallest = this.tallestDirtyRow();
		while (row > tallest) {
			this.shiftRowFromTo(row-1, row);
			row--;
		} this.clearRow(row); //clear the top row that got shifted down
		board_draw.all(); 
	};
	this.collapseFullRows = function() {
		var tallest = this.tallestDirtyRow();
		for (var r = tallest; r < rows + topRows; r++) {
			if (this.isFullRow(r)) this.collapseRow(r);
		}
	};
	this.shiftRowFromTo = function(from, to) {
		for (var c = 0; c < cols; c++) 
			this[to][c] = this[from][c];
	};
	this.isDirtyRow = function(row) { //"dirty" = contains blocks
		return !this.isEmptyRow(row);
	};
	this.tallestDirtyRow = function() {
		var r = rows-1;
		while (this.isDirtyRow(r)) r--;
		return r+1;
	};
	this.numDirtyRows = function() {
		var tallest = this.tallestDirtyRow();
		return rows-tallest; //# of "dirty" rows
	};
}


console.log("loaded grid.js successfully");