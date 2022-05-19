class SudokuSolver {

  validate(puzzleString) {
    //If any character other than 0-9 or \. , return invalid character error 
    if(/[^0-9.]/g.test(puzzleString)) return { error: 'Invalid characters in puzzle'};
    //If the length is not 81, return length error
    if(puzzleString.length !== 81) return { error: 'Expected puzzle to be 81 characters long'};
    return false;
  }
  
  //Function to adjust row from letter to 0-index
  adjustRow(row){
    switch(row.toUpperCase()){
      case 'A': 
        return 0;
      case 'B': 
        return 1;
      case 'C': 
        return 2;
      case 'D': 
        return 3;
      case 'E': 
        return 4;
      case 'F': 
        return 5;
      case 'G': 
        return 6;
      case 'H': 
        return 7;
      case 'I': 
        return 8;
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    //Split string into rows of 9
    let rows = puzzleString.match(/.{9}/g);

    //Adjust row and column to 0-index
    row = this.adjustRow(row);
    column -= 1;

    //If the placement has the input value, return true
    //else if the placement is not empty, return false 
    if(rows[row][column] === value){
      return true;
    }
    else if(rows[row][column] !== '.'){
      return false;
    }

    //loop through selected row to check if value exists
    for(let i = 0; i < 9; i++){
      if(rows[row][i] === value){
        return false;
      }
    }
    return true;
  }
  
  checkColPlacement(puzzleString, row, column, value) {
    //Split string into rows of 9
    let rows = puzzleString.match(/.{9}/g);

    //Adjust row and column to 0-index
    row = this.adjustRow(row);
    column -= 1;

    //If the placement has the input value, return true
    //else if the placement is not empty, return false 
    if(rows[row][column] === value){
      return true;
    }
    else if(rows[row][column] !== '.'){
      return false;
    }

    //loop through selected column to check if value exists
    for(let j = 0; j < 9; j++){
      if(rows[j][column] === value){
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    //Split string into rows of 9
    let rows = puzzleString.match(/.{9}/g);

    //Adjust row and column to 0-index
    row = this.adjustRow(row);
    column -= 1;

    //If the placement has the input value, return true
    //else if the placement is not empty, return false 
    if(rows[row][column] === value){
      return true;
    }
    else if(rows[row][column] !== '.'){
      return false;
    }

    //Set the start row and column 
    let startRow = row-(row%3);
    let startCol = column - (column%3);

    //Loop through the region using startRow and startCol,
    //If the value exists in the region, return false
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        if(rows[i + startRow][j + startCol] === value){
          return false;
        }
      }
    }
    return true;
  }

  //Solving sudoku from https://www.geeksforgeeks.org/sudoku-backtracking-7/
  isSafe(board, row, col, num){
    for(let d = 0; d < board.length; d++){ 
      // Check if the number we are trying to
      // place is already present in
      // that row, return false;
      if (board[row][d] == num){
        return false;
      }
    }
 
    // Column has the unique numbers (column-clash)
    for(let r = 0; r < board.length; r++){   
      // Check if the number
      // we are trying to
      // place is already present in
      // that column, return false;
      if (board[r][col] == num){
        return false;
      }
    }
 
    // Corresponding square has
    // unique number (box-clash)
    let boxRowStart = row - row % 3;
    let boxColStart = col - col % 3;
 
    for(let r = boxRowStart;
            r < boxRowStart + 3; r++){
      for(let d = boxColStart;
              d < boxColStart + 3; d++){
        if (board[r][d] == num){
          return false;
        }
      }
    }
 
    // If there is no clash, it's safe
    return true;
  }
  
  solveSudoku(board){
    let row = -1;
    let col = -1;
    let isEmpty = true;
    for(let i = 0; i < 9; i++){
      for(let j = 0; j < 9; j++){
        if (board[i][j] == '.'){
          row = i;
          col = j;
 
          // We still have some remaining
          // missing values in Sudoku
          isEmpty = false;
          break;
        }
      }
      if (!isEmpty){
          break;
      }
    }
 
    // No empty space left
    if (isEmpty)
    {
        return true;
    }
 
    // Else for each-row backtrack
    for(let num = 1; num <= 9; num++){
      if (this.isSafe(board, row, col, num)){
        board[row][col] = num;
        if (this.solveSudoku(board)){          
          return true;
        }
        else{
             
            // Replace it
            board[row][col] = '.';
        }
      }
    }
    return false;  
  }
  
  solve(puzzleString) {

    //Split puzzle String into 9 rows
    let board = puzzleString.match(/.{9}/g);
    //Split each string into an array of characters
    board = board.map((row)=>{
      return row.split('');
    })

    //If the puzzle is solvable, rejoin the arrays into a string,
    //return the solution
    if(this.solveSudoku(board)){
      board = board.map(row=>{
        return row.join('');
      })
      board = board.join('');

      return { solution: board };
    }
    //else if the puzzle was not solvable, return error
    else{
      return { error: 'Puzzle cannot be solved' } 
    }
    
  }
}

module.exports = SudokuSolver;

