'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();
  
  app.route('/api/check')
    .post((req, res) => {
      let { puzzle, coordinate, value } = req.body;

      //If any required fields are missing, return error
      if(!puzzle || !coordinate || !value) return res.json({ error: 'Required field(s) missing' });

      //Validate the string
      //If validate returns an error object, return the error
      //If the string is valid, validate will return false
      let validation = solver.validate(puzzle)
      if(validation) return res.json(validation);

      //Checks coordinate for a letter and number within range
      //Otherwise return error
      if(!/^[A-I][1-9]$/.test(coordinate)){
        return res.json({ error: 'Invalid coordinate'});
      }

      //Set the row and column from the coordinate string
      let row = coordinate[0];
      let col = coordinate[1];

      //Check the value is within range
      if(value < 1 || value > 9 || isNaN(value)){
        return res.json({ error: 'Invalid value' });
      }

      //Set up array for conflicts
      let conflict = [];

      //Check all three placements
      //If any return false, add the error to conflict array
      if(!solver.checkRowPlacement(puzzle, row, col, value)){
        conflict.push('row');
      }
      if(!solver.checkColPlacement(puzzle, row, col, value)){
        conflict.push('column');
      }
      if(!solver.checkRegionPlacement(puzzle, row, col, value)){
        conflict.push('region');
      }
      //If conflict array has any conflicts, return object with conflicts
      if(conflict.length > 0){
        return res.json({
          valid: false,
          conflict: conflict
        })
      }
      //Otherwise return valid object
      res.json({
        valid: true
      })
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let { puzzle } = req.body;

      //If there is no puzzle string, return error
      if(!puzzle) return res.json({ error: 'Required field missing' });

      //Validate the string
      //If validate returns an error object, return the error
      //If the string is valid, validate will return false
      let validation = solver.validate(puzzle)
      if(validation) return res.json(validation);

      //solve function will return solution if puzzle is solvable
      //Otherwise it will return error: unsolvable
      res.json(solver.solve(puzzle));
      
    });
};
