const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

let validString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
let invalidString = '..A..5.1.85.4....2432......X...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
let shortString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6';
let failString = '..9.287..8.6..4..5..3.....46.........2.71345.........23.....5..9..4..8.7..125.3..';

suite('UnitTests', () => {
  suite('Puzzle String Tests', ()=>{
    //#1
    test('Valid puzzle string', ()=>{
      assert.isFalse(solver.validate(validString), 'The string is valid so validate should return false');
    });
    
    //#2
    test('Invalid characters', ()=>{
      assert.isObject(solver.validate(invalidString), 'Validate should return an object with an error');
      assert.property(solver.validate(invalidString), 'error', 'The object should have the property, error');
      assert.equal(solver.validate(invalidString).error, 'Invalid characters in puzzle');
    })

    //#3
    test('Not 81 characters', ()=>{
      assert.isObject(solver.validate(shortString), 'Validate should return an object with an error');
      assert.property(solver.validate(shortString), 'error', 'The object should have the property, error');
      assert.equal(solver.validate(shortString).error, 'Expected puzzle to be 81 characters long');
    })
  })

  suite('Placement Tests', ()=>{
    //#4
    test('Valid Row Test', ()=>{
      assert.isTrue(solver.checkRowPlacement(validString, 'B', '3', '1'), 'This is a valid placement so should be true.');
    })

    //#5
    test('Invalid Row Test', ()=>{
      assert.isFalse(solver.checkRowPlacement(validString, 'B', '3', '2'), 'This is an invalid placement so should be false.')
    })

    //#6
    test('Valid Column Test', ()=>{
      assert.isTrue(solver.checkColPlacement(validString, 'H', '4', '9'), 'This is a valid placement so should be true.')
    })

    //#7
    test('Invalid Column Test', ()=>{
      assert.isFalse(solver.checkColPlacement(validString, 'H', '4', '7'), 'This is an invalid placement so should be false.')
    })

    //#8
    test('Valid Region Test', ()=>{
      assert.isTrue(solver.checkRegionPlacement(validString, 'I', '8', '2'), 'This is a valid placement so should be true.')
    })

    //#9
    test('Invalid Region Test', ()=>{
      assert.isFalse(solver.checkRegionPlacement(validString, 'I', '8', '3'), 'This is an invalid placement so should be false.')
    })
  })

  suite('Solving sudoku tests', ()=>{
    //#10
    test('Solve valid string', ()=>{
      assert.property(solver.solve(validString), 'solution', 'The returned object should have property, solution');
    })

    //#11
    test('Invalid string should fail', ()=>{
      assert.isFalse(solver.solveSudoku(failString), 'The invalid stirng should pass false');
      assert.property(solver.solve(failString), 'error', 'The returned object should have the property, error');
      assert.equal(solver.solve(failString).error, 'Puzzle cannot be solved');
    })

    //#12
    test('Returns expected solution', ()=>{
      assert.property(solver.solve(validString), 'solution', 'The returned object should have property, solution');
      assert.equal(solver.solve(validString).solution, '769235418851496372432178956174569283395842761628713549283657194516924837947381625')
    })

  })
});
