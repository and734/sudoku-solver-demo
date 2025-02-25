const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite("POST requests to /api/solve", () => {
        test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'solution');
                    done();
                });
        });

        test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Required field missing' });
                    done();
                });
        });

        test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
                    done();
                });
        });

        test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
                    done();
                });
        });

        test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
                    done();
                });
        });
    });


    suite("POST requests to /api/check", () => {

        test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '3' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { valid: true });
                    done();
                })
        });

        test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '1' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.valid, false);
                    assert.deepEqual(res.body.conflict, ["row"]);  // Expect ONLY row conflict
                    done();
                })
        });

        test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '4' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.valid, false);
                    assert.deepEqual(res.body.conflict, ["row", "column"]); // Expect row AND column conflict
                    done();
                });
        });

       test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
           chai.request(server)
            .post('/api/check')
            .send({puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '2'})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false);
                assert.deepEqual(res.body.conflict, ['row','column','region']);
                done();
            })
       });

        test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Required field(s) missing' });
                    done();
                });
        });

        test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X', coordinate: 'A2', value: '3' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
                    done();
                });
        });

        test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
             chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37', coordinate: 'A2', value: '3' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
                    done();
                });
        });

        test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'XZ', value: '3' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Invalid coordinate' });
                    done();
                });
        });

        test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: 'X' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Invalid value' });
                    done();
                });
        });
    });
});
