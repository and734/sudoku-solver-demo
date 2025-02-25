class SudokuSolver {

  validate(puzzleString) {
      if (puzzleString.length !== 81) {
          return { error: 'Expected puzzle to be 81 characters long' };
      }
      if (/[^1-9.]/.test(puzzleString)) {
          return { error: 'Invalid characters in puzzle' };
      }
      return true;
  }

  letterToNumber(row) {
    return row.charCodeAt(0) - 65;
  }

  checkRowPlacement(puzzleString, row, column, value) {
      const rowIndex = this.letterToNumber(row);
      const col = parseInt(column) - 1;
      
      // Skip the position we're checking
      for (let c = 0; c < 9; c++) {
          if (c === col) continue; // Skip the current position
          if (puzzleString[rowIndex * 9 + c] === value) {
              return false;
          }
      }
      return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
      const rowIndex = this.letterToNumber(row);
      const col = parseInt(column) - 1;
      
      // Skip the position we're checking
      for (let r = 0; r < 9; r++) {
          if (r === rowIndex) continue; // Skip the current position
          if (puzzleString[r * 9 + col] === value) {
              return false;
          }
      }
      return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
      const rowIndex = this.letterToNumber(row);
      const col = parseInt(column) - 1;
      
      const startRow = Math.floor(rowIndex / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      
      for (let r = startRow; r < startRow + 3; r++) {
          for (let c = startCol; c < startCol + 3; c++) {
              // Skip the position we're checking
              if (r === rowIndex && c === col) continue;
              if (puzzleString[r * 9 + c] === value) {
                  return false;
              }
          }
      }
      return true;
  }

  solve(puzzleString) {
      const validationResult = this.validate(puzzleString);
      if (validationResult.error) {
          return validationResult;
      }

      const emptyCell = this.findEmptyCell(puzzleString);
      if (!emptyCell) {
          return { solution: puzzleString };
      }

      const [row, col] = emptyCell;

      for (let num = 1; num <= 9; num++) {
          const value = String(num);
          if (
              this.checkRowPlacement(puzzleString, row, col, value) &&
              this.checkColPlacement(puzzleString, row, col, value) &&
              this.checkRegionPlacement(puzzleString, row, col, value)
          ) {
              const index = (row.charCodeAt(0) - 'A'.charCodeAt(0)) * 9 + (col - 1);
              const newPuzzleString = puzzleString.slice(0, index) + value + puzzleString.slice(index + 1);

              const result = this.solve(newPuzzleString);
              if (result.solution) {
                  return result;
              }
          }
      }

      return { error: 'Puzzle cannot be solved' };
  }
  
  findEmptyCell(puzzleString) {
      for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
              const index = i * 9 + j;
              if (puzzleString[index] === '.') {
                  return [String.fromCharCode('A'.charCodeAt(0) + i), j + 1];
              }
          }
      }
      return null;
  }
}

module.exports = SudokuSolver;
