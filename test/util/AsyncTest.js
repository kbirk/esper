(function () {

    'use strict';

    const assert = require('assert');
    const Async = require('../../src/util/Async');

    describe('Async', function() {
        describe('#parallel()', function() {
            it('should execute all jobs asynchronously', function(done) {
                const asyncResults = [];
                Async.parallel([
                    done => {
                        setTimeout(() => {
                            asyncResults.push(0);
                            done();
                        }, 150);
                    },
                    done => {
                        setTimeout(() => {
                            asyncResults.push(1);
                            done();
                        }, 100);
                    },
                    done => {
                        setTimeout(() => {
                            asyncResults.push(2);
                            done();
                        }, 50);
                    }
                ], () => {
                    assert(asyncResults[0] === 2);
                    assert(asyncResults[1] === 1);
                    assert(asyncResults[2] === 0);
                    done();
                });
            });
            it('should return results in the order they are queued', function(done) {
                Async.parallel([
                    done => {
                        setTimeout(() => {
                            done(null, 0);
                        }, 150);
                    },
                    done => {
                        setTimeout(() => {
                            done(null, 1);
                        }, 100);
                    },
                    done => {
                        setTimeout(() => {
                            done(null, 2);
                        }, 50);
                    }
                ], (err, results) => {
                    assert(!err);
                    assert(results[0] === 0);
                    assert(results[1] === 1);
                    assert(results[2] === 2);
                    done();
                });
            });
            it('should accept an array of jobs, returning results in a corresponding array', function(done) {
                Async.parallel([
                    done => {
                        done(null, 0);
                    },
                    done => {
                        done(null, 1);
                    },
                    done => {
                        done(null, 2);
                    }
                ], (err, results) => {
                    assert(!err);
                    assert(results[0] === 0);
                    assert(results[1] === 1);
                    assert(results[2] === 2);
                    done();
                });
            });
            it('should accept a map of jobs, returning results in a corresponding map', function(done) {
                function Obj() {
                    this.a = done => {
                        done(null, 'a');
                    };
                    this.b = done => {
                        done(null, 'b');
                    };
                    this.c = done => {
                        done(null, 'c');
                    };
                }
                Async.parallel(new Obj(), (err, results) => {
                    assert(!err);
                    assert(results.a === 'a');
                    assert(results.b === 'b');
                    assert(results.c === 'c');
                    done();
                });
            });
            it('should accept empty object and return empty object of results', function(done) {
                Async.parallel({}, (err, results) => {
                    assert(!err);
                    for (let prop in results) {
                        if (results.hasOwnProperty(prop)) {
                            assert(false);
                        }
                    }
                    done();
                });
            });
            it('should accept empty array and return empty array of results', function(done) {
                Async.parallel([], (err, results) => {
                    assert(!err);
                    assert(results.length === 0);
                    done();
                });
            });
            it('should execute the callback upon first indication of error, ignoring other pending results', function(done) {
                Async.parallel({
                    a: done => {
                        setTimeout(() => {
                            done({});
                        }, 100);
                    },
                    b: done => {
                        setTimeout(() => {
                            assert(false);
                            done(null, 1);
                        }, 1000);
                    },
                    c: done => {
                        done(null, 2);
                    },
                    e: done => {
                        done({});
                    },
                    f: done => {
                        setTimeout(() => {
                            done({});
                        }, 100);
                    },
                    g: done => {
                        setTimeout(() => {
                            done({});
                        }, 500);
                    }
                }, err => {
                    assert(err);
                    done();
                });
            });
        });
    });

}());
