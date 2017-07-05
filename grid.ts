/************************************************************************
* GRID: 2d array, valid & empty checking
************************************************************************/
class Grid {
	private _grid: Shape[][];
	public numCols: number;
	public numRows: number;

	public constructor(numCols: number, numRows: number) {
		this.numCols = numCols;
		this.numRows = numRows;

		// create the 2d array
		this._grid = [];
		for (var r = 0; r < this.numRows + NUM_TOP_ROWS; r++) {
			var oneRow: Shape[] = [];
			for (var c = 0; c < this.numCols; c++) {
				oneRow[c] = Shape.Empty
			}
			this._grid[r] = oneRow;
		} 
	}

	public toString(): string {
		var result = "";
		for (var r = 0; r < this.numRows + NUM_TOP_ROWS; r++) {
			for (var c = 0; c < this.numCols; c++) {
				result += this._grid[r][c] + " ";
			}
			result += "\n";
		}
		return result;
	}

	public get(row: number, col: number): Shape {
		return this._grid[row][col];
	}

	public set(row: number, col: number, shape: Shape): void {
		this._grid[row][col] = shape;
	}

	public isValidEmpty(row: number, col: number): boolean {
		var isValidRow: boolean = (row >= 0 && row < this.numRows + NUM_TOP_ROWS);
		var isValidCol: boolean = (col >= 0 && col < this.numCols);
		return isValidRow && isValidCol && (this._grid[row][col] == Shape.Empty);
	}

	private _isFullRow(row: number): boolean {
		for (var col = 0; col < this.numCols; col++) {
			if (this._grid[row][col] == Shape.Empty) return false;
		} return true;
	}

	private _clearRow(row: number): void {
		for (var c = 0; c < this.numCols; c++) {
			this._grid[row][c] = Shape.Empty;
		}
	}

	private _collapseRow(row: number): void {
		var tallest: number = this._tallestDirtyRow();
		while (row > tallest) {
			this._shiftRowFromTo(row-1, row);
			row--;
		} this._clearRow(row); //clear the top row that got shifted down
	}

	public collapseFullRows(): void {
		var tallest: number = this._tallestDirtyRow();
		for (var r = tallest; r < this.numRows + NUM_TOP_ROWS; r++) {
			if (this._isFullRow(r)) {
				this._collapseRow(r);
			}
		}
	}

	private _shiftRowFromTo(from: number, to: number): void {
		for (var c = 0; c < this.numCols; c++) 
			this._grid[to][c] = this._grid[from][c];
	}

	private _isDirtyRow(row: number): boolean { //"dirty" = contains blocks
		var isEmptyRow: boolean = true;
		for (var col = 0; col < this.numCols; col++) {
			if (this._grid[row][col] != Shape.Empty) {
				isEmptyRow = false; 
			}
		} 
		return !isEmptyRow; 
	}

	private _tallestDirtyRow(): number {
		var r = this.numRows - 1;
		while (this._isDirtyRow(r)) r--;
		return r + 1;
	}

	private _numDirtyRows(): number {
		var tallest: number = this._tallestDirtyRow();
		return this.numRows - tallest; //# of "dirty" rows
	}
}