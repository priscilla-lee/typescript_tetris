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
		return this._isValid(row, col) && this._isEmpty(row, col);
	}
	private _isEmpty(row, col) {
		return this[row][col] == ".";
	}
	private _isValid(row, col) {
		return this._isValidRow(row) && this._isValidCol(col);
	}
	private _isValidCol(col) {
		return (col >= 0 && col < cols);
	}
	private _isValidRow(row) {
		return (row >= 0 && row < rows + topRows);
	}
	private _isEmptyRow(row) {
		for (var col = 0; col < cols; col++) {
			if (this[row][col] != ".") return false;
		} return true;
	}
	private _isFullRow(row) {
		for (var col = 0; col < cols; col++) {
			if (this[row][col] == ".") return false;
		} return true;
	}
	private _clearRow(row) {
		for (var c = 0; c < cols; c++) 
			this[row][c] = ".";
	}
	private _collapseRow(row) {
		var tallest = this._tallestDirtyRow();
		while (row > tallest) {
			this._shiftRowFromTo(row-1, row);
			row--;
		} this._clearRow(row); //clear the top row that got shifted down
		render.board(); //board_draw.all(); 
	}
	public collapseFullRows() {
		var tallest = this._tallestDirtyRow();
		for (var r = tallest; r < rows + topRows; r++) {
			if (this._isFullRow(r)) this._collapseRow(r);
		}
	}
	private _shiftRowFromTo(from, to) {
		for (var c = 0; c < cols; c++) 
			this[to][c] = this[from][c];
	}
	private _isDirtyRow(row) { //"dirty" = contains blocks
		return !this._isEmptyRow(row);
	}
	private _tallestDirtyRow() {
		var r = rows-1;
		while (this._isDirtyRow(r)) r--;
		return r+1;
	}
	private _numDirtyRows() {
		var tallest = this._tallestDirtyRow();
		return rows-tallest; //# of "dirty" rows
	}
}


console.log("loaded grid.js successfully");