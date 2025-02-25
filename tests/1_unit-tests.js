const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    test("Logic handles a valid puzzle string of 81 characters", () => {
        const validPuzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        assert.isTrue(solver.validate(validPuzzle), "Valid puzzle should return true");
    });

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
        const invalidPuzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X";
        assert.deepEqual(solver.validate(invalidPuzzle), { error: 'Invalid characters in puzzle' }, "Invalid characters should return error");
    });

    test("Logic handles a puzzle string that is not 81 characters in length", () => {
        const shortPuzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37";
        assert.deepEqual(solver.validate(shortPuzzle), { error: 'Expected puzzle to be 81 characters long' }, "Incorrect length should return error");
    });

    test("Logic handles a valid row placement", () => {
        const puzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        assert.isTrue(solver.checkRowPlacement(puzzle, "A", 2, "3"), "Valid row placement");
    });

    test("Logic handles an invalid row placement", () => {
        const puzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        assert.isFalse(solver.checkRowPlacement(puzzle, "A", 2, "1"), "Invalid row placement");
    });

    test("Logic handles a valid column placement", () => {
        const puzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        assert.isTrue(solver.checkColPlacement(puzzle, "A", 2, "3"), "Valid column placement");
    });

    test("Logic handles an invalid column placement", () => {
        const puzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        assert.isFalse(solver.checkColPlacement(puzzle, "A", 1, "8"), "Invalid column placement");
    });

    test("Logic handles a valid region (3x3 grid) placement", () => {
        const puzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        assert.isTrue(solver.checkRegionPlacement(puzzle, "A", 2, "3"), "Valid region placement");
    });

    test("Logic handles an invalid region (3x3 grid) placement", () => {
        const puzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        assert.isFalse(solver.checkRegionPlacement(puzzle, "A", 1, "5"), "Invalid region placement");
    });

      test("Valid puzzle strings pass the solver", () => {
        const puzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        const solved = "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
        assert.property(solver.solve(puzzle), 'solution', "Valid puzzle should return solution");
        assert.equal(solver.solve(puzzle).solution, solved, "Valid puzzle should be solved correctly");
    });

    test("Invalid puzzle strings fail the solver", () => {
        const invalidPuzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X";
        assert.deepEqual(solver.solve(invalidPuzzle), { error: 'Invalid characters in puzzle' }, "Invalid puzzle should return error");
    });
        test("Solver returns the expected solution for an incomplete puzzle", () => {
        const puzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        const solved = "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
        assert.deepEqual(solver.solve(puzzle), {solution: solved}, "Solver should return correct solution");
    });

});
