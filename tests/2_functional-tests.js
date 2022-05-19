const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let puzzleStrings = require('../controllers/puzzle-strings.js');
let puzzlesAndSolutions = puzzleStrings.puzzlesAndSolutions;

let validString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
let invalidString = '..A..5.1.85.4....2432......X...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
let shortString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6';
let failString = '..9.287..8.6..4..5..3.....46.........2.71345.........23.....5..9..4..8.7..125.3..';

suite('Functional Tests', () => {
  suite('Solve puzzle tests', ()=>{
    //#1
    test('Valid puzzle string', (done)=>[
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzlesAndSolutions[0][0] })
        .end((err, res)=>{
          assert.isObject(res.body, 'The response should be an object');
          assert.property(res.body, 'solution', 'The valid puzzle should have a solution');
          assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
          done();
        })
    ])

    //#2
    test('Missing puzzle string', (done)=>[
      chai.request(server)
        .post('/api/solve')
        .end((err, res)=>{
          assert.property(res.body, 'error', 'The res should have property, error');
          assert.equal(res.body.error, 'Required field missing');
          done();
        })
    ])

    //#3
    test('Invalid Characters', (done)=>[
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: invalidString })
        .end((err, res)=>{
          assert.property(res.body, 'error', 'The res should have property, error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        })
    ])

    //#4
    test('Incorrect Length', (done)=>[
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: shortString })
        .end((err, res)=>{
          assert.property(res.body, 'error', 'The res should have property, error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        })
    ])

    //#5
    test('Unsolvable puzzle', (done)=>[
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: failString })
        .end((err, res)=>{
          assert.property(res.body, 'error', 'The res should have property, error');
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        })
    ])
  })
  
  suite('Check puzzle tests', ()=>{
    //#6
    test('All fields filled', (done)=>[
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: validString, 
          coordinate: 'B3', 
          value: '1'
        })
        .end((err, res)=>{
          assert.property(res.body, 'valid', 'The res should have property, valid');
          assert.isTrue(res.body.valid, 'The placement is valid, therefore should be true');
          done();
        })
    ])

    //#7
    test('Single placement conflict', (done)=>[
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: validString, 
          coordinate: 'D3', 
          value: '3'
        })
        .end((err, res)=>{
          assert.property(res.body, 'valid');
          assert.property(res.body, 'conflict');
          assert.isFalse(res.body.valid, 'The placement is invalid so should be false');
          assert.lengthOf(res.body.conflict, 1, 'There should only be one conflict');
          done();
        })
    ])

    //#8
    test('Multiple placement conflicts', (done)=>[
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: validString, 
          coordinate: 'A1', 
          value: '1'
        })
        .end((err, res)=>{
          assert.property(res.body, 'valid');
          assert.property(res.body, 'conflict');
          assert.isFalse(res.body.valid, 'The placement is invalid so should be false');
          assert.lengthOf(res.body.conflict, 2, 'There should be two conflicts');
          done();
        })
    ])

    //#9
    test('All placement conflicts', (done)=>[
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: validString, 
          coordinate: 'E5', 
          value: '6'
        })
        .end((err, res)=>{
          assert.property(res.body, 'valid');
          assert.property(res.body, 'conflict');
          assert.isFalse(res.body.valid, 'The placement is invalid so should be false');
          assert.lengthOf(res.body.conflict, 3, 'There should be three conflicts');
          done();
        })
    ])

    //#10
    test('Missing required fields', (done)=>[
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: validString, 
          coordinate: 'A1' 
        })
        .end((err, res)=>{
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        })
    ])

    //#11
    test('Invalid character in puzzleString', (done)=>[
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: invalidString, 
          coordinate: 'A1', 
          value: '1'
        })
        .end((err, res)=>{
          assert.property(res.body, 'error', 'The res should have property, error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        })
    ])

    //#12
    test('Puzzle with incorrect length', (done)=>[
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: shortString, 
          coordinate: 'A1', 
          value: '1'
        })
        .end((err, res)=>{
          assert.property(res.body, 'error', 'The res should have property, error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        })
    ])
    
    //#13
    test('Invalid placement coordinate', (done)=>[
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: validString, 
          coordinate: 'Z1', 
          value: '5'
        })
        .end((err, res)=>{
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        })
    ])

    //#14
    test('Invalid placement value', (done)=>[
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: validString, 
          coordinate: 'A1', 
          value: 'A'
        })
        .end((err, res)=>{
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid value');
          done();
        })
    ])
  })
  
});

/*
    //#
    test('', (done)=>[
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: , 
          coordinate: , 
          value:
        })
        .end((err, res)=>{
          assert
          done();
        })
    ])

*/
