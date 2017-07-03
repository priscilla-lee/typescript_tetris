/************************************************************************
* GRID: 2d array, valid & empty checking
************************************************************************/
class Grid {
	public constructor() {
		for (var r = 0; r < rows + topRows; r++) {
			var oneRow = {};
			for (var c = 0; c < cols; c++) {oneRow[c] = "."}
			this[r] = oneRow;
		} //creates the 2d array

	}
	public isValidEmpty(row, col) {
		return this.isValid(row, col) && this.isEmpty(row, col);
	}
	public isEmpty(row, col) {
		return this[row][col] == ".";
	}
	public isValid(row, col) {
		return this.isValidRow(row) && this.isValidCol(col);
	}
	public isValidCol(col) {
		return (col >= 0 && col < cols);
	}
	public isValidRow(row) {
		return (row >= 0 && row < rows + topRows);
	}
	public isEmptyRow(row) {
		for (var col = 0; col < cols; col++) {
			if (this[row][col] != ".") return false;
		} return true;
	}
	public isFullRow(row) {
		for (var col = 0; col < cols; col++) {
			if (this[row][col] == ".") return false;
		} return true;
	}
	public clearRow(row) {
		for (var c = 0; c < cols; c++) 
			this[row][c] = ".";
	}
	public collapseRow(row) {
		var tallest = this.tallestDirtyRow();
		while (row > tallest) {
			this.shiftRowFromTo(row-1, row);
			row--;
		} this.clearRow(row); //clear the top row that got shifted down
		render.board(); //board_draw.all(); 
	}
	public collapseFullRows() {
		var tallest = this.tallestDirtyRow();
		for (var r = tallest; r < rows + topRows; r++) {
			if (this.isFullRow(r)) this.collapseRow(r);
		}
	}
	public shiftRowFromTo(from, to) {
		for (var c = 0; c < cols; c++) 
			this[to][c] = this[from][c];
	}
	public isDirtyRow(row) { //"dirty" = contains blocks
		return !this.isEmptyRow(row);
	}
	public tallestDirtyRow() {
		var r = rows-1;
		while (this.isDirtyRow(r)) r--;
		return r+1;
	}
	public numDirtyRows() {
		var tallest = this.tallestDirtyRow();
		return rows-tallest; //# of "dirty" rows
	}
}


console.log("loaded grid.js successfully");