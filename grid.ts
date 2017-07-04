/************************************************************************
* GRID: 2d array, valid & empty checking
************************************************************************/
class Grid {
	private _grid: Shape[][];

	public constructor() {
		// create the 2d array
		this._grid = [];
		for (var r = 0; r < ROWS + NUM_TOP_ROWS; r++) {
			var oneRow: Shape[] = [];
			for (var c = 0; c < COLS; c++) {
				oneRow[c] = Shape.Empty
			}
			this._grid[r] = oneRow;
		} 
	}

	public toString(): string {
		var result = "";
		for (var r = 0; r < ROWS + NUM_TOP_ROWS; r++) {
			for (var c = 0; c < COLS; c++) {
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
		var isValidRow: boolean = (row >= 0 && row < ROWS + NUM_TOP_ROWS);
		var isValidCol: boolean = (col >= 0 && col < COLS);
		return isValidRow && isValidCol && (this._grid[row][col] == Shape.Empty);
	}

	private _isFullRow(row: number): boolean {
		for (var col = 0; col < COLS; col++) {
			if (this._grid[row][col] == Shape.Empty) return false;
		} return true;
	}

	private _clearRow(row: number): void {
		for (var c = 0; c < COLS; c++) {
			this._grid[row][c] = Shape.Empty;
		}
	}

	private _collapseRow(row: number): void {
		var tallest: number = this._tallestDirtyRow();
		while (row > tallest) {
			this._shiftRowFromTo(row-1, row);
			row--;
		} this._clearRow(row); //clear the top row that got shifted down
		// render.updateBoard(this);
	}

	public collapseFullRows(): void {
		var tallest: number = this._tallestDirtyRow();
		for (var r = tallest; r < ROWS + NUM_TOP_ROWS; r++) {
			if (this._isFullRow(r)) {
				this._collapseRow(r);
			}
		}
	}

	private _shiftRowFromTo(from: number, to: number): void {
		for (var c = 0; c < COLS; c++) 
			this._grid[to][c] = this._grid[from][c];
	}

	private _isDirtyRow(row: number): boolean { //"dirty" = contains blocks
		var isEmptyRow: boolean = true;
		for (var col = 0; col < COLS; col++) {
			if (this._grid[row][col] != Shape.Empty) {
				isEmptyRow = false; 
			}
		} 
		return !isEmptyRow; 
	}

	private _tallestDirtyRow(): number {
		var r = ROWS - 1;
		while (this._isDirtyRow(r)) r--;
		return r + 1;
	}

	private _numDirtyRows(): number {
		var tallest: number = this._tallestDirtyRow();
		return ROWS - tallest; //# of "dirty" rows
	}
}