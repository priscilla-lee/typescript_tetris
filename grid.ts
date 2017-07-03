/************************************************************************
* GRID: 2d array, valid & empty checking
************************************************************************/
class Grid {
	private _grid: Shape[][];
	public constructor() {
		this._grid = [];
		for (var r = 0; r < rows + NUM_TOP_ROWS; r++) {
			var oneRow: Shape[] = [];
			for (var c = 0; c < cols; c++) {
				oneRow[c] = Shape.Empty
			}
			this._grid[r] = oneRow;
		} //creates the 2d array
	}
	public get(row: number, col: number) {
		return this._grid[row][col];
	}
	public set(row: number, col: number, shape: Shape) {
		this._grid[row][col] = shape;
	}
	public isValidEmpty(row: number, col: number): boolean {
		return this._isValid(row, col) && this._isEmpty(row, col);
	}
	private _isEmpty(row: number, col: number): boolean {
		return this._grid[row][col] == Shape.Empty;
	}
	private _isValid(row: number, col: number): boolean {
		return this._isValidRow(row) && this._isValidCol(col);
	}
	private _isValidCol(col: number): boolean {
		return (col >= 0 && col < cols);
	}
	private _isValidRow(row: number): boolean {
		return (row >= 0 && row < rows + NUM_TOP_ROWS);
	}
	private _isEmptyRow(row: number): boolean {
		for (var col = 0; col < cols; col++) {
			if (this._grid[row][col] != Shape.Empty) return false;
		} return true;
	}
	private _isFullRow(row: number): boolean {
		for (var col = 0; col < cols; col++) {
			if (this._grid[row][col] == Shape.Empty) return false;
		} return true;
	}
	private _clearRow(row: number): void {
		for (var c = 0; c < cols; c++) 
			this._grid[row][c] = Shape.Empty;
	}
	private _collapseRow(row: number): void {
		var tallest: number = this._tallestDirtyRow();
		while (row > tallest) {
			this._shiftRowFromTo(row-1, row);
			row--;
		} this._clearRow(row); //clear the top row that got shifted down
		render.board();
	}
	public collapseFullRows(): void {
		var tallest: number = this._tallestDirtyRow();
		for (var r = tallest; r < rows + NUM_TOP_ROWS; r++) {
			if (this._isFullRow(r)) this._collapseRow(r);
		}
	}
	private _shiftRowFromTo(from: number, to: number): void {
		for (var c = 0; c < cols; c++) 
			this._grid[to][c] = this._grid[from][c];
	}
	private _isDirtyRow(row: number): boolean { //"dirty" = contains blocks
		return !this._isEmptyRow(row);
	}
	private _tallestDirtyRow(): number {
		var r = rows-1;
		while (this._isDirtyRow(r)) r--;
		return r+1;
	}
	private _numDirtyRows(): number {
		var tallest: number = this._tallestDirtyRow();
		return rows-tallest; //# of "dirty" rows
	}
}


console.log("loaded grid.js successfully");