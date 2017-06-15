(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.esper = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = asyncify;

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _initialParams = require('./internal/initialParams');

var _initialParams2 = _interopRequireDefault(_initialParams);

var _setImmediate = require('./internal/setImmediate');

var _setImmediate2 = _interopRequireDefault(_setImmediate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Take a sync function and make it async, passing its return value to a
 * callback. This is useful for plugging sync functions into a waterfall,
 * series, or other async functions. Any arguments passed to the generated
 * function will be passed to the wrapped function (except for the final
 * callback argument). Errors thrown will be passed to the callback.
 *
 * If the function passed to `asyncify` returns a Promise, that promises's
 * resolved/rejected state will be used to call the callback, rather than simply
 * the synchronous return value.
 *
 * This also means you can asyncify ES2017 `async` functions.
 *
 * @name asyncify
 * @static
 * @memberOf module:Utils
 * @method
 * @alias wrapSync
 * @category Util
 * @param {Function} func - The synchronous function, or Promise-returning
 * function to convert to an {@link AsyncFunction}.
 * @returns {AsyncFunction} An asynchronous wrapper of the `func`. To be
 * invoked with `(args..., callback)`.
 * @example
 *
 * // passing a regular synchronous function
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(JSON.parse),
 *     function (data, next) {
 *         // data is the result of parsing the text.
 *         // If there was a parsing error, it would have been caught.
 *     }
 * ], callback);
 *
 * // passing a function returning a promise
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(function (contents) {
 *         return db.model.create(contents);
 *     }),
 *     function (model, next) {
 *         // `model` is the instantiated model object.
 *         // If there was an error, this function would be skipped.
 *     }
 * ], callback);
 *
 * // es2017 example, though `asyncify` is not needed if your JS environment
 * // supports async functions out of the box
 * var q = async.queue(async.asyncify(async function(file) {
 *     var intermediateStep = await processFile(file);
 *     return await somePromise(intermediateStep)
 * }));
 *
 * q.push(files);
 */
function asyncify(func) {
    return (0, _initialParams2.default)(function (args, callback) {
        var result;
        try {
            result = func.apply(this, args);
        } catch (e) {
            return callback(e);
        }
        // if result is Promise object
        if ((0, _isObject2.default)(result) && typeof result.then === 'function') {
            result.then(function (value) {
                invokeCallback(callback, null, value);
            }, function (err) {
                invokeCallback(callback, err.message ? err : new Error(err));
            });
        } else {
            callback(null, result);
        }
    });
}

function invokeCallback(callback, error, value) {
    try {
        callback(error, value);
    } catch (e) {
        (0, _setImmediate2.default)(rethrow, e);
    }
}

function rethrow(error) {
    throw error;
}
module.exports = exports['default'];
},{"./internal/initialParams":8,"./internal/setImmediate":13,"lodash/isObject":40}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (coll, iteratee, callback) {
    var eachOfImplementation = (0, _isArrayLike2.default)(coll) ? eachOfArrayLike : eachOfGeneric;
    eachOfImplementation(coll, (0, _wrapAsync2.default)(iteratee), callback);
};

var _isArrayLike = require('lodash/isArrayLike');

var _isArrayLike2 = _interopRequireDefault(_isArrayLike);

var _breakLoop = require('./internal/breakLoop');

var _breakLoop2 = _interopRequireDefault(_breakLoop);

var _eachOfLimit = require('./eachOfLimit');

var _eachOfLimit2 = _interopRequireDefault(_eachOfLimit);

var _doLimit = require('./internal/doLimit');

var _doLimit2 = _interopRequireDefault(_doLimit);

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _once = require('./internal/once');

var _once2 = _interopRequireDefault(_once);

var _onlyOnce = require('./internal/onlyOnce');

var _onlyOnce2 = _interopRequireDefault(_onlyOnce);

var _wrapAsync = require('./internal/wrapAsync');

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eachOf implementation optimized for array-likes
function eachOfArrayLike(coll, iteratee, callback) {
    callback = (0, _once2.default)(callback || _noop2.default);
    var index = 0,
        completed = 0,
        length = coll.length;
    if (length === 0) {
        callback(null);
    }

    function iteratorCallback(err, value) {
        if (err) {
            callback(err);
        } else if (++completed === length || value === _breakLoop2.default) {
            callback(null);
        }
    }

    for (; index < length; index++) {
        iteratee(coll[index], index, (0, _onlyOnce2.default)(iteratorCallback));
    }
}

// a generic version of eachOf which can handle array, object, and iterator cases.
var eachOfGeneric = (0, _doLimit2.default)(_eachOfLimit2.default, Infinity);

/**
 * Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
 * to the iteratee.
 *
 * @name eachOf
 * @static
 * @memberOf module:Collections
 * @method
 * @alias forEachOf
 * @category Collection
 * @see [async.each]{@link module:Collections.each}
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A function to apply to each
 * item in `coll`.
 * The `key` is the item's key, or index in the case of an array.
 * Invoked with (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @example
 *
 * var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
 * var configs = {};
 *
 * async.forEachOf(obj, function (value, key, callback) {
 *     fs.readFile(__dirname + value, "utf8", function (err, data) {
 *         if (err) return callback(err);
 *         try {
 *             configs[key] = JSON.parse(data);
 *         } catch (e) {
 *             return callback(e);
 *         }
 *         callback();
 *     });
 * }, function (err) {
 *     if (err) console.error(err.message);
 *     // configs is now a map of JSON data
 *     doSomethingWith(configs);
 * });
 */
module.exports = exports['default'];
},{"./eachOfLimit":3,"./internal/breakLoop":4,"./internal/doLimit":5,"./internal/once":10,"./internal/onlyOnce":11,"./internal/wrapAsync":15,"lodash/isArrayLike":36,"lodash/noop":44}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = eachOfLimit;

var _eachOfLimit2 = require('./internal/eachOfLimit');

var _eachOfLimit3 = _interopRequireDefault(_eachOfLimit2);

var _wrapAsync = require('./internal/wrapAsync');

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The same as [`eachOf`]{@link module:Collections.eachOf} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name eachOfLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.eachOf]{@link module:Collections.eachOf}
 * @alias forEachOfLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each
 * item in `coll`. The `key` is the item's key, or index in the case of an
 * array.
 * Invoked with (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */
function eachOfLimit(coll, limit, iteratee, callback) {
  (0, _eachOfLimit3.default)(limit)(coll, (0, _wrapAsync2.default)(iteratee), callback);
}
module.exports = exports['default'];
},{"./internal/eachOfLimit":6,"./internal/wrapAsync":15}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// A temporary value used to identify if the loop should be broken.
// See #1064, #1293
exports.default = {};
module.exports = exports["default"];
},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = doLimit;
function doLimit(fn, limit) {
    return function (iterable, iteratee, callback) {
        return fn(iterable, limit, iteratee, callback);
    };
}
module.exports = exports["default"];
},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _eachOfLimit;

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _once = require('./once');

var _once2 = _interopRequireDefault(_once);

var _iterator = require('./iterator');

var _iterator2 = _interopRequireDefault(_iterator);

var _onlyOnce = require('./onlyOnce');

var _onlyOnce2 = _interopRequireDefault(_onlyOnce);

var _breakLoop = require('./breakLoop');

var _breakLoop2 = _interopRequireDefault(_breakLoop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _eachOfLimit(limit) {
    return function (obj, iteratee, callback) {
        callback = (0, _once2.default)(callback || _noop2.default);
        if (limit <= 0 || !obj) {
            return callback(null);
        }
        var nextElem = (0, _iterator2.default)(obj);
        var done = false;
        var running = 0;

        function iterateeCallback(err, value) {
            running -= 1;
            if (err) {
                done = true;
                callback(err);
            } else if (value === _breakLoop2.default || done && running <= 0) {
                done = true;
                return callback(null);
            } else {
                replenish();
            }
        }

        function replenish() {
            while (running < limit && !done) {
                var elem = nextElem();
                if (elem === null) {
                    done = true;
                    if (running <= 0) {
                        callback(null);
                    }
                    return;
                }
                running += 1;
                iteratee(elem.value, elem.key, (0, _onlyOnce2.default)(iterateeCallback));
            }
        }

        replenish();
    };
}
module.exports = exports['default'];
},{"./breakLoop":4,"./iterator":9,"./once":10,"./onlyOnce":11,"lodash/noop":44}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (coll) {
    return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
};

var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;

module.exports = exports['default'];
},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (fn) {
    return function () /*...args, callback*/{
        var args = (0, _slice2.default)(arguments);
        var callback = args.pop();
        fn.call(this, args, callback);
    };
};

var _slice = require('./slice');

var _slice2 = _interopRequireDefault(_slice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];
},{"./slice":14}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = iterator;

var _isArrayLike = require('lodash/isArrayLike');

var _isArrayLike2 = _interopRequireDefault(_isArrayLike);

var _getIterator = require('./getIterator');

var _getIterator2 = _interopRequireDefault(_getIterator);

var _keys = require('lodash/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createArrayIterator(coll) {
    var i = -1;
    var len = coll.length;
    return function next() {
        return ++i < len ? { value: coll[i], key: i } : null;
    };
}

function createES2015Iterator(iterator) {
    var i = -1;
    return function next() {
        var item = iterator.next();
        if (item.done) return null;
        i++;
        return { value: item.value, key: i };
    };
}

function createObjectIterator(obj) {
    var okeys = (0, _keys2.default)(obj);
    var i = -1;
    var len = okeys.length;
    return function next() {
        var key = okeys[++i];
        return i < len ? { value: obj[key], key: key } : null;
    };
}

function iterator(coll) {
    if ((0, _isArrayLike2.default)(coll)) {
        return createArrayIterator(coll);
    }

    var iterator = (0, _getIterator2.default)(coll);
    return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}
module.exports = exports['default'];
},{"./getIterator":7,"lodash/isArrayLike":36,"lodash/keys":43}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = once;
function once(fn) {
    return function () {
        if (fn === null) return;
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}
module.exports = exports["default"];
},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = onlyOnce;
function onlyOnce(fn) {
    return function () {
        if (fn === null) throw new Error("Callback was already called.");
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}
module.exports = exports["default"];
},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _parallel;

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _isArrayLike = require('lodash/isArrayLike');

var _isArrayLike2 = _interopRequireDefault(_isArrayLike);

var _slice = require('./slice');

var _slice2 = _interopRequireDefault(_slice);

var _wrapAsync = require('./wrapAsync');

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _parallel(eachfn, tasks, callback) {
    callback = callback || _noop2.default;
    var results = (0, _isArrayLike2.default)(tasks) ? [] : {};

    eachfn(tasks, function (task, key, callback) {
        (0, _wrapAsync2.default)(task)(function (err, result) {
            if (arguments.length > 2) {
                result = (0, _slice2.default)(arguments, 1);
            }
            results[key] = result;
            callback(err);
        });
    }, function (err) {
        callback(err, results);
    });
}
module.exports = exports['default'];
},{"./slice":14,"./wrapAsync":15,"lodash/isArrayLike":36,"lodash/noop":44}],13:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasNextTick = exports.hasSetImmediate = undefined;
exports.fallback = fallback;
exports.wrap = wrap;

var _slice = require('./slice');

var _slice2 = _interopRequireDefault(_slice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasSetImmediate = exports.hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
var hasNextTick = exports.hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';

function fallback(fn) {
    setTimeout(fn, 0);
}

function wrap(defer) {
    return function (fn /*, ...args*/) {
        var args = (0, _slice2.default)(arguments, 1);
        defer(function () {
            fn.apply(null, args);
        });
    };
}

var _defer;

if (hasSetImmediate) {
    _defer = setImmediate;
} else if (hasNextTick) {
    _defer = process.nextTick;
} else {
    _defer = fallback;
}

exports.default = wrap(_defer);
}).call(this,require('_process'))

},{"./slice":14,"_process":46}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = slice;
function slice(arrayLike, start) {
    start = start | 0;
    var newLen = Math.max(arrayLike.length - start, 0);
    var newArr = Array(newLen);
    for (var idx = 0; idx < newLen; idx++) {
        newArr[idx] = arrayLike[start + idx];
    }
    return newArr;
}
module.exports = exports["default"];
},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isAsync = undefined;

var _asyncify = require('../asyncify');

var _asyncify2 = _interopRequireDefault(_asyncify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var supportsSymbol = typeof Symbol === 'function';

function isAsync(fn) {
    return supportsSymbol && fn[Symbol.toStringTag] === 'AsyncFunction';
}

function wrapAsync(asyncFn) {
    return isAsync(asyncFn) ? (0, _asyncify2.default)(asyncFn) : asyncFn;
}

exports.default = wrapAsync;
exports.isAsync = isAsync;
},{"../asyncify":1}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parallelLimit;

var _eachOf = require('./eachOf');

var _eachOf2 = _interopRequireDefault(_eachOf);

var _parallel = require('./internal/parallel');

var _parallel2 = _interopRequireDefault(_parallel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Run the `tasks` collection of functions in parallel, without waiting until
 * the previous function has completed. If any of the functions pass an error to
 * its callback, the main `callback` is immediately called with the value of the
 * error. Once the `tasks` have completed, the results are passed to the final
 * `callback` as an array.
 *
 * **Note:** `parallel` is about kicking-off I/O tasks in parallel, not about
 * parallel execution of code.  If your tasks do not use any timers or perform
 * any I/O, they will actually be executed in series.  Any synchronous setup
 * sections for each task will happen one after the other.  JavaScript remains
 * single-threaded.
 *
 * **Hint:** Use [`reflect`]{@link module:Utils.reflect} to continue the
 * execution of other tasks when a task fails.
 *
 * It is also possible to use an object instead of an array. Each property will
 * be run as a function and the results will be passed to the final `callback`
 * as an object instead of an array. This can be a more readable way of handling
 * results from {@link async.parallel}.
 *
 * @name parallel
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|Object} tasks - A collection of
 * [async functions]{@link AsyncFunction} to run.
 * Each async function can complete with any number of optional `result` values.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed successfully. This function gets a results array
 * (or object) containing all the result arguments passed to the task callbacks.
 * Invoked with (err, results).
 *
 * @example
 * async.parallel([
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ],
 * // optional callback
 * function(err, results) {
 *     // the results array will equal ['one','two'] even though
 *     // the second function had a shorter timeout.
 * });
 *
 * // an example using an object instead of an array
 * async.parallel({
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 1);
 *         }, 200);
 *     },
 *     two: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 2);
 *         }, 100);
 *     }
 * }, function(err, results) {
 *     // results is now equals to: {one: 1, two: 2}
 * });
 */
function parallelLimit(tasks, callback) {
  (0, _parallel2.default)(_eachOf2.default, tasks, callback);
}
module.exports = exports['default'];
},{"./eachOf":2,"./internal/parallel":12}],17:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":33}],18:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isIndex = require('./_isIndex'),
    isTypedArray = require('./isTypedArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

},{"./_baseTimes":23,"./_isIndex":27,"./isArguments":34,"./isArray":35,"./isBuffer":37,"./isTypedArray":42}],19:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":17,"./_getRawTag":26,"./_objectToString":31}],20:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

},{"./_baseGetTag":19,"./isObjectLike":41}],21:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

},{"./_baseGetTag":19,"./isLength":39,"./isObjectLike":41}],22:[function(require,module,exports){
var isPrototype = require('./_isPrototype'),
    nativeKeys = require('./_nativeKeys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;

},{"./_isPrototype":28,"./_nativeKeys":29}],23:[function(require,module,exports){
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],24:[function(require,module,exports){
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],25:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],26:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":17}],27:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],28:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],29:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":32}],30:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

},{"./_freeGlobal":25}],31:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],32:[function(require,module,exports){
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],33:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":25}],34:[function(require,module,exports){
var baseIsArguments = require('./_baseIsArguments'),
    isObjectLike = require('./isObjectLike');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;

},{"./_baseIsArguments":20,"./isObjectLike":41}],35:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],36:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./isFunction":38,"./isLength":39}],37:[function(require,module,exports){
var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

},{"./_root":33,"./stubFalse":45}],38:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObject = require('./isObject');

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

},{"./_baseGetTag":19,"./isObject":40}],39:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],40:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],41:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],42:[function(require,module,exports){
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

},{"./_baseIsTypedArray":21,"./_baseUnary":24,"./_nodeUtil":30}],43:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeys = require('./_baseKeys'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;

},{"./_arrayLikeKeys":18,"./_baseKeys":22,"./isArrayLike":36}],44:[function(require,module,exports){
/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;

},{}],45:[function(require,module,exports){
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],46:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],47:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Texture2D = require('./Texture2D');
var ImageLoader = require('../util/ImageLoader');
var Util = require('../util/Util');

var MAG_FILTERS = {
	NEAREST: true,
	LINEAR: true
};
var MIN_FILTERS = {
	NEAREST: true,
	LINEAR: true,
	NEAREST_MIPMAP_NEAREST: true,
	LINEAR_MIPMAP_NEAREST: true,
	NEAREST_MIPMAP_LINEAR: true,
	LINEAR_MIPMAP_LINEAR: true
};
var WRAP_MODES = {
	REPEAT: true,
	MIRRORED_REPEAT: true,
	CLAMP_TO_EDGE: true
};
var TYPES = {
	UNSIGNED_BYTE: true,
	FLOAT: true
};
var FORMATS = {
	RGB: true,
	RGBA: true
};

/**
 * The default type for color textures.
 * @private
 * @constant {string}
 */
var DEFAULT_TYPE = 'UNSIGNED_BYTE';

/**
 * The default format for color textures.
 * @private
 * @constant {string}
 */
var DEFAULT_FORMAT = 'RGBA';

/**
 * The default wrap mode for color textures.
 * @private
 * @constant {string}
 */
var DEFAULT_WRAP = 'REPEAT';

/**
 * The default min / mag filter for color textures.
 * @private
 * @constant {string}
 */
var DEFAULT_FILTER = 'LINEAR';

/**
 * The default for whether alpha premultiplying is enabled.
 * @private
 * @constant {boolean}
 */
var DEFAULT_PREMULTIPLY_ALPHA = true;

/**
 * The default for whether mipmapping is enabled.
 * @private
 * @constant {boolean}
 */
var DEFAULT_MIPMAP = true;

/**
 * The default for whether invert-y is enabled.
 * @private
 * @constant {boolean}
 */
var DEFAULT_INVERT_Y = true;

/**
 * A texture class to represent a 2D color texture.
 * @augments Texture2D
 */

var ColorTexture2D = function (_Texture2D) {
	_inherits(ColorTexture2D, _Texture2D);

	/**
  * Instantiates a ColorTexture2D object.
  *
  * @param {Object} spec - The specification arguments.
  * @param {ArrayBuffer|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} spec.image - The HTMLImageElement to buffer.
  * @param {string} spec.url - The HTMLImageElement URL to load and buffer.
  * @param {Uint8Array|Float32Array} spec.src - The data to buffer.
  * @param {number} spec.width - The width of the texture.
  * @param {number} spec.height - The height of the texture.
  * @param {string} spec.wrap - The wrapping type over both S and T dimension.
  * @param {string} spec.wrapS - The wrapping type over the S dimension.
  * @param {string} spec.wrapT - The wrapping type over the T dimension.
  * @param {string} spec.filter - The min / mag filter used during scaling.
  * @param {string} spec.minFilter - The minification filter used during scaling.
  * @param {string} spec.magFilter - The magnification filter used during scaling.
  * @param {bool} spec.mipMap - Whether or not mip-mapping is enabled.
  * @param {bool} spec.invertY - Whether or not invert-y is enabled.
  * @param {bool} spec.premultiplyAlpha - Whether or not alpha premultiplying is enabled.
  * @param {string} spec.format - The texture pixel format.
  * @param {string} spec.type - The texture pixel component type.
  * @param {Function} callback - The callback to be executed if the data is loaded asynchronously via a URL.
  */
	function ColorTexture2D() {
		var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		_classCallCheck(this, ColorTexture2D);

		// get specific params
		spec.wrapS = spec.wrapS || spec.wrap;
		spec.wrapT = spec.wrapT || spec.wrap;
		spec.minFilter = spec.minFilter || spec.filter;
		spec.magFilter = spec.magFilter || spec.filter;
		// set texture params
		spec.wrapS = WRAP_MODES[spec.wrapS] ? spec.wrapS : DEFAULT_WRAP;
		spec.wrapT = WRAP_MODES[spec.wrapT] ? spec.wrapT : DEFAULT_WRAP;
		spec.minFilter = MIN_FILTERS[spec.minFilter] ? spec.minFilter : DEFAULT_FILTER;
		spec.magFilter = MAG_FILTERS[spec.magFilter] ? spec.magFilter : DEFAULT_FILTER;
		// set other properties
		spec.mipMap = spec.mipMap !== undefined ? spec.mipMap : DEFAULT_MIPMAP;
		spec.invertY = spec.invertY !== undefined ? spec.invertY : DEFAULT_INVERT_Y;
		spec.premultiplyAlpha = spec.premultiplyAlpha !== undefined ? spec.premultiplyAlpha : DEFAULT_PREMULTIPLY_ALPHA;
		// set format
		spec.format = FORMATS[spec.format] ? spec.format : DEFAULT_FORMAT;
		// buffer the texture based on argument type
		if (typeof spec.src === 'string') {
			// request source from url
			spec.type = 'UNSIGNED_BYTE';
			// call base constructor

			// TODO: put extension handling for arraybuffer / image / video differentiation
			var _this = _possibleConstructorReturn(this, (ColorTexture2D.__proto__ || Object.getPrototypeOf(ColorTexture2D)).call(this, spec));

			ImageLoader.load({
				url: spec.src,
				success: function success(image) {
					// set to unsigned byte type
					image = Util.resizeCanvas(spec, image);
					// now buffer
					_this.bufferData(image, spec.width, spec.height);
					_this.setParameters(_this);
					// execute callback
					if (callback) {
						callback(null, _this);
					}
				},
				error: function error(err) {
					if (callback) {
						callback(err, null);
					}
				}
			});
		} else if (Util.isCanvasType(spec.src)) {
			// is image / canvas / video type
			// set to unsigned byte type
			spec.type = 'UNSIGNED_BYTE';
			spec.src = Util.resizeCanvas(spec, spec.src);
			// call base constructor

			var _this = _possibleConstructorReturn(this, (ColorTexture2D.__proto__ || Object.getPrototypeOf(ColorTexture2D)).call(this, spec));
		} else {
			// array, arraybuffer, or null
			if (spec.src === undefined || spec.src === null) {
				// if no data is provided, assume this texture will be rendered
				// to. In this case disable mipmapping, there is no need and it
				// will only introduce very peculiar and difficult to discern
				// rendering phenomena in which the texture 'transforms' at
				// certain angles / distances to the mipmapped (empty) portions.
				spec.mipMap = false;
			}
			// buffer from arg
			spec.type = TYPES[spec.type] ? spec.type : DEFAULT_TYPE;
			// call base constructor

			var _this = _possibleConstructorReturn(this, (ColorTexture2D.__proto__ || Object.getPrototypeOf(ColorTexture2D)).call(this, spec));
		}
		return _possibleConstructorReturn(_this);
	}

	return ColorTexture2D;
}(Texture2D);

module.exports = ColorTexture2D;

},{"../util/ImageLoader":62,"../util/Util":63,"./Texture2D":55}],48:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Texture2D = require('./Texture2D');

var MAG_FILTERS = {
	NEAREST: true,
	LINEAR: true
};
var MIN_FILTERS = {
	NEAREST: true,
	LINEAR: true
};
var WRAP_MODES = {
	REPEAT: true,
	CLAMP_TO_EDGE: true,
	MIRRORED_REPEAT: true
};
var DEPTH_TYPES = {
	UNSIGNED_BYTE: true,
	UNSIGNED_SHORT: true,
	UNSIGNED_INT: true
};
var FORMATS = {
	DEPTH_COMPONENT: true,
	DEPTH_STENCIL: true
};

/**
 * The default type for depth textures.
 * @private
 * @constant {string}
 */
var DEFAULT_TYPE = 'UNSIGNED_INT';

/**
 * The default format for depth textures.
 * @private
 * @constant {string}
 */
var DEFAULT_FORMAT = 'DEPTH_COMPONENT';

/**
 * The default wrap mode for depth textures.
 * @private
 * @constant {string}
 */
var DEFAULT_WRAP = 'CLAMP_TO_EDGE';

/**
 * The default min / mag filter for depth textures.
 * @private
 * @constant {string}
 */
var DEFAULT_FILTER = 'LINEAR';

/**
 * A texture class to represent a 2D depth texture.
 * @augments Texture2D
 */

var DepthTexture2D = function (_Texture2D) {
	_inherits(DepthTexture2D, _Texture2D);

	/**
  * Instantiates a DepthTexture2D object.
  *
  * @param {Object} spec - The specification arguments.
  * @param {Uint8Array|Uint16Array|Uint32Array} spec.src - The data to buffer.
  * @param {number} spec.width - The width of the texture.
  * @param {number} spec.height - The height of the texture.
  * @param {string} spec.wrap - The wrapping type over both S and T dimension.
  * @param {string} spec.wrapS - The wrapping type over the S dimension.
  * @param {string} spec.wrapT - The wrapping type over the T dimension.
  * @param {string} spec.filter - The min / mag filter used during scaling.
  * @param {string} spec.minFilter - The minification filter used during scaling.
  * @param {string} spec.magFilter - The magnification filter used during scaling.
  * @param {string} spec.format - The texture pixel format.
  * @param {string} spec.type - The texture pixel component type.
  */
	function DepthTexture2D() {
		var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, DepthTexture2D);

		// get specific params
		spec.wrapS = spec.wrapS || spec.wrap;
		spec.wrapT = spec.wrapT || spec.wrap;
		spec.minFilter = spec.minFilter || spec.filter;
		spec.magFilter = spec.magFilter || spec.filter;
		// set texture params
		spec.wrapS = WRAP_MODES[spec.wrapS] ? spec.wrapS : DEFAULT_WRAP;
		spec.wrapT = WRAP_MODES[spec.wrapT] ? spec.wrapT : DEFAULT_WRAP;
		spec.minFilter = MIN_FILTERS[spec.minFilter] ? spec.minFilter : DEFAULT_FILTER;
		spec.magFilter = MAG_FILTERS[spec.magFilter] ? spec.magFilter : DEFAULT_FILTER;
		// set mip-mapping and format
		spec.mipMap = false; // disable mip-mapping
		spec.invertY = false; // no need to invert-y
		spec.premultiplyAlpha = false; // no alpha to pre-multiply
		spec.format = FORMATS[spec.format] ? spec.format : DEFAULT_FORMAT;
		// check if stencil-depth, or just depth
		if (spec.format === 'DEPTH_STENCIL') {
			spec.type = 'UNSIGNED_INT_24_8_WEBGL';
		} else {
			spec.type = DEPTH_TYPES[spec.type] ? spec.type : DEFAULT_TYPE;
		}
		// call base constructor
		return _possibleConstructorReturn(this, (DepthTexture2D.__proto__ || Object.getPrototypeOf(DepthTexture2D)).call(this, spec));
	}

	return DepthTexture2D;
}(Texture2D);

module.exports = DepthTexture2D;

},{"./Texture2D":55}],49:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebGLContext = require('./WebGLContext');

var TYPES = {
	UNSIGNED_BYTE: true,
	UNSIGNED_SHORT: true,
	UNSIGNED_INT: true
};
var MODES = {
	POINTS: true,
	LINES: true,
	LINE_STRIP: true,
	LINE_LOOP: true,
	TRIANGLES: true,
	TRIANGLE_STRIP: true,
	TRIANGLE_FAN: true
};
var BYTES_PER_TYPE = {
	UNSIGNED_BYTE: 1,
	UNSIGNED_SHORT: 2,
	UNSIGNED_INT: 4
};

/**
 * The default component type.
 * @private
 * @constant {string}
 */
var DEFAULT_TYPE = 'UNSIGNED_SHORT';

/**
 * The default render mode (primitive type).
 * @private
 * @constant {string}
 */
var DEFAULT_MODE = 'TRIANGLES';

/**
 * The default byte offset to render from.
 * @private
 * @constant {number}
 */
var DEFAULT_BYTE_OFFSET = 0;

/**
 * The default count of indices to render.
 * @private
 * @constant {number}
 */
var DEFAULT_COUNT = 0;

/**
 * An index buffer class to hole indexing information.
 */

var IndexBuffer = function () {

	/**
  * Instantiates an IndexBuffer object.
  *
  * @param {WebGLBuffer|Uint8Array|Uint16Array|Uin32Array|Array|Number} arg - The index data to buffer.
  * @param {Object} options - The rendering options.
  * @param {string} options.mode - The draw mode / primitive type.
  * @param {string} options.byteOffset - The byte offset into the drawn buffer.
  * @param {string} options.count - The number of vertices to draw.
  */
	function IndexBuffer(arg) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, IndexBuffer);

		this.gl = WebGLContext.get();
		this.buffer = null;
		this.type = TYPES[options.type] ? options.type : DEFAULT_TYPE;
		this.mode = MODES[options.mode] ? options.mode : DEFAULT_MODE;
		this.count = options.count !== undefined ? options.count : DEFAULT_COUNT;
		this.byteOffset = options.byteOffset !== undefined ? options.byteOffset : DEFAULT_BYTE_OFFSET;
		if (arg) {
			if (arg instanceof WebGLBuffer) {
				// WebGLBuffer argument
				this.buffer = arg;
			} else if (Number.isInteger(arg)) {
				// byte length argument
				if (options.type === undefined) {
					throw 'Argument of type `number` must be complimented with a corresponding `options.type`';
				}
				this.bufferData(arg);
			} else if (arg instanceof ArrayBuffer) {
				// ArrayBuffer arg
				if (options.type === undefined) {
					throw 'Argument of type `ArrayBuffer` must be complimented with a corresponding `options.type`';
				}
				this.bufferData(arg);
			} else {
				// Array or ArrayBufferView argument
				this.bufferData(arg);
			}
		} else {
			if (options.type === undefined) {
				throw 'Empty buffer must be complimented with a corresponding `options.type`';
			}
		}
	}

	/**
  * Upload index data to the GPU.
  *
  * @param {Array|ArrayBuffer|ArrayBufferView|number} arg - The array of data to buffer.
  *
  * @returns {IndexBuffer} The index buffer object, for chaining.
  */


	_createClass(IndexBuffer, [{
		key: 'bufferData',
		value: function bufferData(arg) {
			var gl = this.gl;
			// cast array to ArrayBufferView based on provided type
			if (Array.isArray(arg)) {
				// check for type
				if (this.type === 'UNSIGNED_INT') {
					// buffer to uint32
					arg = new Uint32Array(arg);
				} else if (this.type === 'UNSIGNED_SHORT') {
					// buffer to uint16
					arg = new Uint16Array(arg);
				} else {
					// buffer to uint8
					arg = new Uint8Array(arg);
				}
			} else {
				// set ensure type corresponds to data
				if (arg instanceof Uint32Array) {
					this.type = 'UNSIGNED_INT';
				} else if (arg instanceof Uint16Array) {
					this.type = 'UNSIGNED_SHORT';
				} else if (arg instanceof Uint8Array) {
					this.type = 'UNSIGNED_BYTE';
				} else if (!(arg instanceof ArrayBuffer) && !Number.isInteger(arg)) {
					throw 'Argument must be of type `Array`, `ArrayBuffer`, `ArrayBufferView`, or `number`';
				}
			}
			// check that the type is supported by extension
			if (this.type === 'UNSIGNED_INT' && !WebGLContext.checkExtension('OES_element_index_uint')) {
				throw 'Cannot create IndexBuffer of type `UNSIGNED_INT` as extension `OES_element_index_uint` is not supported';
			}
			// don't overwrite the count if it is already set
			if (this.count === DEFAULT_COUNT) {
				if (Number.isInteger(arg)) {
					this.count = arg / BYTES_PER_TYPE[this.type];
				} else {
					this.count = arg.length;
				}
			}
			// create buffer if it doesn't exist already
			if (!this.buffer) {
				this.buffer = gl.createBuffer();
			}
			// buffer the data
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arg, gl.STATIC_DRAW);
			return this;
		}

		/**
   * Upload partial index data to the GPU.
   *
   * @param {Array|ArrayBuffer|ArrayBufferView} array - The array of data to buffer.
   * @param {number} byteOffset - The byte offset at which to buffer.
   *
   * @returns {IndexBuffer} The index buffer object, for chaining.
   */

	}, {
		key: 'bufferSubData',
		value: function bufferSubData(array) {
			var byteOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_BYTE_OFFSET;

			var gl = this.gl;
			if (!this.buffer) {
				throw 'Buffer has not yet been allocated, allocate with `bufferData`';
			}
			// cast array to ArrayBufferView based on provided type
			if (Array.isArray(array)) {
				// check for type
				if (this.type === 'UNSIGNED_INT') {
					// buffer to uint32
					array = new Uint32Array(array);
				} else if (this.type === 'UNSIGNED_SHORT') {
					// buffer to uint16
					array = new Uint16Array(array);
				} else {
					// buffer to uint8
					array = new Uint8Array(array);
				}
			} else if (!(array instanceof Uint8Array) && !(array instanceof Uint16Array) && !(array instanceof Uint32Array) && !(array instanceof ArrayBuffer)) {
				throw 'Argument must be of type `Array`, `ArrayBuffer`, or `ArrayBufferView`';
			}
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
			gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, byteOffset, array);
			return this;
		}

		/**
   * Execute the draw command for the bound buffer.
   *
   * @param {Object} options - The options to pass to 'drawElements'. Optional.
   * @param {string} options.mode - The draw mode / primitive type.
   * @param {string} options.byteOffset - The byteOffset into the drawn buffer.
   * @param {string} options.count - The number of vertices to draw.
   *
   * @returns {IndexBuffer} The index buffer object, for chaining.
   */

	}, {
		key: 'draw',
		value: function draw() {
			var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var gl = this.gl;
			var mode = gl[options.mode || this.mode];
			var type = gl[this.type];
			var byteOffset = options.byteOffset !== undefined ? options.byteOffset : this.byteOffset;
			var count = options.count !== undefined ? options.count : this.count;
			if (count === 0) {
				throw 'Attempting to draw with a count of 0';
			}
			// bind buffer
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
			// draw elements
			gl.drawElements(mode, count, type, byteOffset);
			// no need to unbind
			return this;
		}
	}]);

	return IndexBuffer;
}();

module.exports = IndexBuffer;

},{"./WebGLContext":60}],50:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebGLContext = require('./WebGLContext');

var TEXTURE_TARGETS = {
	TEXTURE_2D: true,
	TEXTURE_CUBE_MAP: true
};
var DEPTH_FORMATS = {
	DEPTH_COMPONENT: true,
	DEPTH_STENCIL: true
};

/**
 * A render target class to allow rendering to textures.
 */

var RenderTarget = function () {

	/**
  * Instantiates a RenderTarget object.
  */
	function RenderTarget() {
		_classCallCheck(this, RenderTarget);

		this.gl = WebGLContext.get();
		this.framebuffer = this.gl.createFramebuffer();
		this.textures = new Map();
	}

	/**
  * Binds the renderTarget object.
  *
  * @returns {RenderTarget} The renderTarget object, for chaining.
  */


	_createClass(RenderTarget, [{
		key: 'bind',
		value: function bind() {
			// bind framebuffer
			var gl = this.gl;
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
			return this;
		}

		/**
   * Unbinds the renderTarget object.
   *
   * @returns {RenderTarget} The renderTarget object, for chaining.
   */

	}, {
		key: 'unbind',
		value: function unbind() {
			// unbind framebuffer
			var gl = this.gl;
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			return this;
		}

		/**
   * Attaches the provided texture to the provided attachment location.
   *
   * @param {Texture2D} texture - The texture to attach.
   * @param {number} index - The attachment index. (optional)
   * @param {string} target - The texture target type. (optional)
   *
   * @returns {RenderTarget} The renderTarget object, for chaining.
   */

	}, {
		key: 'setColorTarget',
		value: function setColorTarget(texture, index, target) {
			var gl = this.gl;
			if (!texture) {
				throw 'Texture argument is missing';
			}
			if (TEXTURE_TARGETS[index] && target === undefined) {
				target = index;
				index = 0;
			}
			if (index === undefined) {
				index = 0;
			} else if (!Number.isInteger(index) || index < 0) {
				throw 'Texture color attachment index is invalid';
			}
			if (target && !TEXTURE_TARGETS[target]) {
				throw 'Texture target is invalid';
			}
			this.textures.set('color_' + index, texture);
			this.bind();
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl['COLOR_ATTACHMENT' + index], gl[target || 'TEXTURE_2D'], texture.texture, 0);
			this.unbind();
			return this;
		}

		/**
   * Attaches the provided texture to the provided attachment location.
   *
   * @param {Texture2D} texture - The texture to attach.
   *
   * @returns {RenderTarget} The renderTarget object, for chaining.
   */

	}, {
		key: 'setDepthTarget',
		value: function setDepthTarget(texture) {
			if (!texture) {
				throw 'Texture argument is missing';
			}
			if (!DEPTH_FORMATS[texture.format]) {
				throw 'Provided texture is not of format `DEPTH_COMPONENT` or `DEPTH_STENCIL`';
			}
			var gl = this.gl;
			this.textures.set('depth', texture);
			this.bind();
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, texture.texture, 0);
			this.unbind();
			return this;
		}

		/**
   * Resizes the renderTarget and all attached textures by the provided height and width.
   *
   * @param {number} width - The new width of the renderTarget.
   * @param {number} height - The new height of the renderTarget.
   *
   * @returns {RenderTarget} The renderTarget object, for chaining.
   */

	}, {
		key: 'resize',
		value: function resize(width, height) {
			if (typeof width !== 'number' || width <= 0) {
				throw 'Provided `width` of ' + width + ' is invalid';
			}
			if (typeof height !== 'number' || height <= 0) {
				throw 'Provided `height` of ' + height + ' is invalid';
			}
			this.textures.forEach(function (texture) {
				texture.resize(width, height);
			});
			return this;
		}
	}]);

	return RenderTarget;
}();

module.exports = RenderTarget;

},{"./WebGLContext":60}],51:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VertexPackage = require('./VertexPackage');
var VertexBuffer = require('./VertexBuffer');
var IndexBuffer = require('./IndexBuffer');

/**
 * Iterates over all vertex buffers and throws an exception if the counts are
 * not equal.
 *
 * @private
 *
 * @param {Array} vertexBuffers - The array of vertexBuffers.
 */
function checkVertexBufferCounts(vertexBuffers) {
	var count = null;
	vertexBuffers.forEach(function (buffer) {
		if (count === null) {
			count = buffer.count;
		} else {
			if (count !== buffer.count) {
				throw 'VertexBuffers must all have the same count to be ' + 'rendered without an IndexBuffer, mismatch of ' + (count + ' and ' + buffer.count + ' found');
			}
		}
	});
}

/**
 * Iterates over all attribute pointers and throws an exception if an index
 * occurs more than once.
 *
 * @private
 *
 * @param {Array} vertexBuffers - The array of vertexBuffers.
 */
function checkIndexCollisions(vertexBuffers) {
	var indices = new Map();
	vertexBuffers.forEach(function (buffer) {
		buffer.pointers.forEach(function (pointer, index) {
			var count = indices.get(index) || 0;
			indices.set(index, count + 1);
		});
	});
	indices.forEach(function (index) {
		if (index > 1) {
			throw 'More than one attribute pointer exists for index `' + index + '`';
		}
	});
}

/**
 * A container for one or more VertexBuffers and an optional IndexBuffer.
 */

var Renderable = function () {

	/**
  * Instantiates an Renderable object.
  *
  * @param {Object} spec - The renderable specification object.
  * @param {Array|Float32Array} spec.vertices - The vertices to interleave and buffer.
  * @param {VertexBuffer} spec.vertexBuffer - An existing vertex buffer.
  * @param {VertexBuffer[]} spec.vertexBuffers - Multiple existing vertex buffers.
  * @param {Array|Uint16Array|Uint32Array} spec.indices - The indices to buffer.
  * @param {IndexBuffer} spec.indexbuffer - An existing index buffer.
  */
	function Renderable() {
		var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Renderable);

		if (spec.vertexBuffer || spec.vertexBuffers) {
			// use existing vertex buffer
			this.vertexBuffers = spec.vertexBuffers || [spec.vertexBuffer];
		} else if (spec.vertices) {
			// create vertex package
			var vertexPackage = new VertexPackage(spec.vertices);
			// create vertex buffer
			this.vertexBuffers = [new VertexBuffer(vertexPackage.buffer, vertexPackage.pointers)];
		} else {
			this.vertexBuffers = [];
		}
		if (spec.indexBuffer) {
			// use existing index buffer
			this.indexBuffer = spec.indexBuffer;
		} else if (spec.indices) {
			// create index buffer
			this.indexBuffer = new IndexBuffer(spec.indices);
		} else {
			this.indexBuffer = null;
		}
		// if there is no index buffer, check that vertex buffers all have
		// the same count
		if (!this.indexBuffer) {
			checkVertexBufferCounts(this.vertexBuffers);
		}
		// check that no attribute indices clash
		checkIndexCollisions(this.vertexBuffers);
	}

	/**
  * Execute the draw command for the underlying buffers.
  *
  * @param {Object} options - The options to pass to 'drawElements'. Optional.
  * @param {string} options.mode - The draw mode / primitive type.
  * @param {string} options.byteOffset - The byteOffset into the drawn buffer.
  * @param {string} options.indexOffset - The indexOffset into the drawn buffer.
  * @param {string} options.count - The number of vertices to draw.
  *
  * @returns {Renderable} - The renderable object, for chaining.
  */


	_createClass(Renderable, [{
		key: 'draw',
		value: function draw() {
			var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			// draw the renderable
			if (this.indexBuffer) {
				// use index buffer to draw elements
				// bind vertex buffers and enable attribute pointers
				this.vertexBuffers.forEach(function (vertexBuffer) {
					vertexBuffer.bind();
				});
				// draw primitives using index buffer
				this.indexBuffer.draw(options);
				// disable attribute pointers
				this.vertexBuffers.forEach(function (vertexBuffer) {
					vertexBuffer.unbind();
				});
				// no advantage to unbinding as there is no stack used
			} else {
				// no index buffer, use draw arrays
				// set all attribute pointers
				this.vertexBuffers.forEach(function (vertexBuffer) {
					vertexBuffer.bind();
				});
				if (this.vertexBuffers.length > 0) {
					// draw the buffer
					this.vertexBuffers[0].draw(options);
				}
				// disable all attribute pointers
				this.vertexBuffers.forEach(function (vertexBuffer) {
					vertexBuffer.unbind();
				});
			}
			return this;
		}
	}]);

	return Renderable;
}();

module.exports = Renderable;

},{"./IndexBuffer":49,"./VertexBuffer":57,"./VertexPackage":58}],52:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var parallel = require('async/parallel');
var WebGLContext = require('./WebGLContext');
var ShaderParser = require('./ShaderParser');
var XHRLoader = require('../util/XHRLoader');

var UNIFORM_FUNCTIONS = {
	'bool': 'uniform1i',
	'bool[]': 'uniform1iv',
	'float': 'uniform1f',
	'float[]': 'uniform1fv',
	'int': 'uniform1i',
	'int[]': 'uniform1iv',
	'uint': 'uniform1i',
	'uint[]': 'uniform1iv',
	'vec2': 'uniform2fv',
	'vec2[]': 'uniform2fv',
	'ivec2': 'uniform2iv',
	'ivec2[]': 'uniform2iv',
	'vec3': 'uniform3fv',
	'vec3[]': 'uniform3fv',
	'ivec3': 'uniform3iv',
	'ivec3[]': 'uniform3iv',
	'vec4': 'uniform4fv',
	'vec4[]': 'uniform4fv',
	'ivec4': 'uniform4iv',
	'ivec4[]': 'uniform4iv',
	'mat2': 'uniformMatrix2fv',
	'mat2[]': 'uniformMatrix2fv',
	'mat3': 'uniformMatrix3fv',
	'mat3[]': 'uniformMatrix3fv',
	'mat4': 'uniformMatrix4fv',
	'mat4[]': 'uniformMatrix4fv',
	'sampler2D': 'uniform1i',
	'samplerCube': 'uniform1i'
};

/**
 * Given a map of existing attributes, find the lowest index that is not already
 * used. If the attribute ordering was already provided, use that instead.
 *
 * @private
 *
 * @param {Map} attributes - The existing attributes map.
 * @param {Object} declaration - The attribute declaration object.
 *
 * @returns {number} The attribute index.
 */
function getAttributeIndex(attributes, declaration) {
	// check if attribute is already declared, if so, use that index
	if (attributes.has(declaration.name)) {
		return attributes.get(declaration.name).index;
	}
	// return next available index
	return attributes.size;
}

/**
 * Given vertex and fragment shader source, parses the declarations and appends
 * information pertaining to the uniforms and attribtues declared.
 *
 * @private
 *
 * @param {Shader} shader - The shader object.
 * @param {string} vertSource - The vertex shader source.
 * @param {string} fragSource - The fragment shader source.
 *
 * @returns {Object} The attribute and uniform information.
 */
function setAttributesAndUniforms(shader, vertSource, fragSource) {
	var declarations = ShaderParser.parseDeclarations([vertSource, fragSource], ['uniform', 'attribute']);
	// for each declaration in the shader
	declarations.forEach(function (declaration) {
		// check if its an attribute or uniform
		if (declaration.qualifier === 'attribute') {
			// if attribute, store type and index
			var index = getAttributeIndex(shader.attributes, declaration);
			shader.attributes.set(declaration.name, {
				type: declaration.type,
				index: index
			});
		} else {
			// if (declaration.qualifier === 'uniform') {
			// if uniform, store type and buffer function name
			var type = declaration.type + (declaration.count > 1 ? '[]' : '');
			shader.uniforms.set(declaration.name, {
				type: declaration.type,
				func: UNIFORM_FUNCTIONS[type]
			});
		}
	});
}

/**
 * Given a lineNumber and max number of digits, pad the line accordingly.
 *
 * @private
 *
 * @param {number} lineNum - The line number.
 * @param {number} maxDigits - The max digits to pad.
 *
 * @returns {string} The padded string.
 */
function padLineNumber(lineNum, maxDigits) {
	lineNum = lineNum.toString();
	var diff = maxDigits - lineNum.length;
	lineNum += ':';
	for (var i = 0; i < diff; i++) {
		lineNum += ' ';
	}
	return lineNum;
};

/**
 * Given a shader source string and shader type, compiles the shader and returns
 * the resulting WebGLShader object.
 *
 * @private
 *
 * @param {WebGLRenderingContext} gl - The webgl rendering context.
 * @param {string} shaderSource - The shader source.
 * @param {string} type - The shader type.
 *
 * @returns {WebGLShader} The compiled shader object.
 */
function compileShader(gl, shaderSource, type) {
	var shader = gl.createShader(gl[type]);
	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		var split = shaderSource.split('\n');
		var maxDigits = split.length.toString().length + 1;
		var srcByLines = split.map(function (line, index) {
			return padLineNumber(index + 1, maxDigits) + ' ' + line;
		}).join('\n');
		var shaderLog = gl.getShaderInfoLog(shader);
		throw 'An error occurred compiling the shader:\n\n' + shaderLog.slice(0, shaderLog.length - 1) + '\n' + srcByLines;
	}
	return shader;
}

/**
 * Binds the attribute locations for the Shader object.
 *
 * @private
 *
 * @param {Shader} shader - The Shader object.
 */
function bindAttributeLocations(shader) {
	var gl = shader.gl;
	shader.attributes.forEach(function (attribute, name) {
		// bind the attribute location
		gl.bindAttribLocation(shader.program, attribute.index, name);
	});
}

/**
 * Queries the webgl rendering context for the uniform locations.
 *
 * @private
 *
 * @param {Shader} shader - The Shader object.
 */
function getUniformLocations(shader) {
	var gl = shader.gl;
	var uniforms = shader.uniforms;
	uniforms.forEach(function (uniform, name) {
		// get the uniform location
		var location = gl.getUniformLocation(shader.program, name);
		// check if null, parse may detect uniform that is compiled out due to
		// not being used, or due to a preprocessor evaluation.
		if (location === null) {
			uniforms.delete(name);
		} else {
			uniform.location = location;
		}
	});
}

/**
 * Returns a function to load shader source from a url.
 *
 * @private
 *
 * @param {string} url - The url to load the resource from.
 *
 * @returns {Function} The function to load the shader source.
 */
function loadShaderSource(url) {
	return function (done) {
		XHRLoader.load({
			url: url,
			responseType: 'text',
			success: function success(res) {
				done(null, res);
			},
			error: function error(err) {
				done(err, null);
			}
		});
	};
}

/**
 * Returns a function to pass through the shader source.
 *
 * @private
 *
 * @param {string} source - The source of the shader.
 *
 * @returns {Function} The function to pass through the shader source.
 */
function passThroughSource(source) {
	return function (done) {
		done(null, source);
	};
}

/**
 * Returns a function that takes an array of GLSL source strings and URLs, and
 * resolves them into and array of GLSL source.
 *
 * @private
 *
 * @param {Array} sources - The shader sources.
 *
 * @returns {Function} A function to resolve the shader sources.
 */
function resolveSources(sources) {
	return function (done) {
		var tasks = [];
		sources = sources || [];
		sources = !Array.isArray(sources) ? [sources] : sources;
		sources.forEach(function (source) {
			if (ShaderParser.isGLSL(source)) {
				tasks.push(passThroughSource(source));
			} else {
				tasks.push(loadShaderSource(source));
			}
		});
		parallel(tasks, done);
	};
}

/**
 * Injects the defines into the shader source.
 *
 * @private
 *
 * @param {Array} defines - The shader defines.
 *
 * @returns {Function} A function to resolve the shader sources.
 */
var createDefines = function createDefines() {
	var defines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var res = [];
	Object.keys(defines).forEach(function (name) {
		res.push('#define ' + name + ' ' + defines[name]);
	});
	return res.join('\n');
};

/**
 * Creates the shader program object from source strings. This includes:
 *	1) Compiling and linking the shader program.
 *	2) Parsing shader source for attribute and uniform information.
 *	3) Binding attribute locations, by order of delcaration.
 *	4) Querying and storing uniform location.
 *
 * @private
 *
 * @param {Shader} shader - The Shader object.
 * @param {Object} sources - A map containing sources under 'vert' and 'frag' attributes.
 *
 * @returns {Shader} The shader object, for chaining.
 */
function createProgram(shader, sources) {
	var gl = shader.gl;
	var defines = createDefines(sources.define);
	var common = defines + (sources.common || '');
	var vert = sources.vert.join('');
	var frag = sources.frag.join('');
	// compile shaders
	var vertexShader = compileShader(gl, common + vert, 'VERTEX_SHADER');
	var fragmentShader = compileShader(gl, common + frag, 'FRAGMENT_SHADER');
	// parse source for attribute and uniforms
	setAttributesAndUniforms(shader, vert, frag);
	// create the shader program
	shader.program = gl.createProgram();
	// attach vertex and fragment shaders
	gl.attachShader(shader.program, vertexShader);
	gl.attachShader(shader.program, fragmentShader);
	// bind vertex attribute locations BEFORE linking
	bindAttributeLocations(shader);
	// link shader
	gl.linkProgram(shader.program);
	// If creating the shader program failed, alert
	if (!gl.getProgramParameter(shader.program, gl.LINK_STATUS)) {
		throw 'An error occured linking the shader:\n' + gl.getProgramInfoLog(shader.program);
	}
	// get shader uniform locations
	getUniformLocations(shader);
}

/**
 * A shader class to assist in compiling and linking webgl shaders, storing
 * attribute and uniform locations, and buffering uniforms.
 */

var Shader = function () {

	/**
  * Instantiates a Shader object.
  *
  * @param {Object} spec - The shader specification object.
  * @param {String|String[]|Object} spec.common - Sources / URLs to be shared by both vertex and fragment shaders.
  * @param {String|String[]|Object} spec.vert - The vertex shader sources / URLs.
  * @param {String|String[]|Object} spec.frag - The fragment shader sources / URLs.
  * @param {Object} spec.define - Any `#define` definitions to be injected into the glsl.
  * @param {String[]} spec.attributes - The attribute index orderings.
  * @param {Function} callback - The callback function to execute once the shader has been successfully compiled and linked.
  */
	function Shader() {
		var _this = this;

		var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		_classCallCheck(this, Shader);

		// check source arguments
		if (!spec.vert) {
			throw 'Vertex shader argument `vert` has not been provided';
		}
		if (!spec.frag) {
			throw 'Fragment shader argument `frag` has not been provided';
		}
		this.program = 0;
		this.gl = WebGLContext.get();
		this.version = spec.version || '1.00';
		this.attributes = new Map();
		this.uniforms = new Map();
		// if attribute ordering is provided, use those indices
		if (spec.attributes) {
			spec.attributes.forEach(function (attr, index) {
				_this.attributes.set(attr, {
					index: index
				});
			});
		}
		// create the shader
		parallel({
			common: resolveSources(spec.common),
			vert: resolveSources(spec.vert),
			frag: resolveSources(spec.frag)
		}, function (err, sources) {
			if (err) {
				if (callback) {
					setTimeout(function () {
						callback(err, null);
					});
				}
				return;
			}
			// append defines
			sources.define = spec.define;
			// once all shader sources are loaded
			createProgram(_this, sources);
			if (callback) {
				setTimeout(function () {
					callback(null, _this);
				});
			}
		});
	}

	/**
  * Binds the shader program for use.
  *
  * @returns {Shader} The shader object, for chaining.
  */


	_createClass(Shader, [{
		key: 'use',
		value: function use() {
			// use the shader
			this.gl.useProgram(this.program);
			return this;
		}

		/**
   * Buffer a uniform value by name.
   *
   * @param {string} name - The uniform name in the shader source.
   * @param {*} value - The uniform value to buffer.
   *
   * @returns {Shader} - The shader object, for chaining.
   */

	}, {
		key: 'setUniform',
		value: function setUniform(name, value) {
			var uniform = this.uniforms.get(name);
			// ensure that the uniform spec exists for the name
			if (!uniform) {
				throw 'No uniform found under name `' + name + '`';
			}
			// check value
			if (value === undefined || value === null) {
				// ensure that the uniform argument is defined
				throw 'Value passed for uniform `' + name + '` is undefined or null';
			}
			// set the uniform
			// NOTE: checking type by string comparison is faster than wrapping
			// the functions.
			if (uniform.type === 'mat2' || uniform.type === 'mat3' || uniform.type === 'mat4') {
				this.gl[uniform.func](uniform.location, false, value);
			} else {
				this.gl[uniform.func](uniform.location, value);
			}
			return this;
		}

		/**
   * Buffer a map of uniform values.
   *
   * @param {Object} uniforms - The map of uniforms keyed by name.
   *
   * @returns {Shader} The shader object, for chaining.
   */

	}, {
		key: 'setUniforms',
		value: function setUniforms(uniforms) {
			var _this2 = this;

			Object.keys(uniforms).forEach(function (name) {
				_this2.setUniform(name, uniforms[name]);
			});
			return this;
		}
	}]);

	return Shader;
}();

module.exports = Shader;

},{"../util/XHRLoader":64,"./ShaderParser":53,"./WebGLContext":60,"async/parallel":16}],53:[function(require,module,exports){
'use strict';

var ShaderPreprocessor = require('./ShaderPreprocessor');

var COMMENTS_REGEXP = /(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm;
var ENDLINE_REGEXP = /(\r\n|\n|\r)/gm;
var WHITESPACE_REGEXP = /\s{2,}/g;
var BRACKET_WHITESPACE_REGEXP = /(\s*)(\[)(\s*)(\d+)(\s*)(\])(\s*)/g;
var NAME_COUNT_REGEXP = /([a-zA-Z_][a-zA-Z0-9_]*)(?:\[(\d+)\])?/;
var PRECISION_REGEX = /\bprecision\s+\w+\s+\w+;/g;
var INLINE_PRECISION_REGEX = /\b(highp|mediump|lowp)\s+/g;
var GLSL_REGEXP = /void\s+main\s*\(\s*(void)*\s*\)\s*/mi;

/**
 * Removes standard comments from the provided string.
 *
 * @private
 *
 * @param {string} str - The string to strip comments from.
 *
 * @returns {string} The commentless string.
 */
function stripComments(str) {
	// regex source: https://github.com/moagrius/stripcomments
	return str.replace(COMMENTS_REGEXP, '');
}

/**
 * Removes an precision statements.
 *
 * @private
 *
 * @param {string} str - The unprocessed source code.
 *
 * @returns {string} The processed source code.
 */
function stripPrecision(str) {
	return str.replace(PRECISION_REGEX, '' // remove global precision declarations
	).replace(INLINE_PRECISION_REGEX, ''); // remove inline precision declarations
}

/**
 * Converts all whitespace into a single ' ' space character.
 *
 * @private
 *
 * @param {string} str - The string to normalize whitespace from.
 *
 * @returns {string} The normalized string.
 */
function normalizeWhitespace(str) {
	return str.replace(ENDLINE_REGEXP, ' ' // remove line endings
	).replace(WHITESPACE_REGEXP, ' ' // normalize whitespace to single ' '
	).replace(BRACKET_WHITESPACE_REGEXP, '$2$4$6'); // remove whitespace in brackets
}

/**
 * Parses the name and count out of a name statement, returning the declaration
 * object.
 *
 * @private
 *
 * @param {string} qualifier - The qualifier string.
 * @param {string} type - The type string.
 * @param {string} entry - The variable declaration string.
 *
 * @returns {Object} The declaration object.
 */
function parseNameAndCount(qualifier, type, entry) {
	// determine name and size of variable
	var matches = entry.match(NAME_COUNT_REGEXP);
	var name = matches[1];
	var count = matches[2] === undefined ? 1 : parseInt(matches[2], 10);
	return {
		qualifier: qualifier,
		type: type,
		name: name,
		count: count
	};
}

/**
 * Parses a single 'statement'. A 'statement' is considered any sequence of
 * characters followed by a semi-colon. Therefore, a single 'statement' in
 * this sense could contain several comma separated declarations. Returns
 * all resulting declarations.
 *
 * @private
 *
 * @param {string} statement - The statement to parse.
 *
 * @returns {Array} The array of parsed declaration objects.
 */
function parseStatement(statement) {
	// split statement on commas
	//
	// ['uniform mat4 A[10]', 'B', 'C[2]']
	//
	var split = statement.split(',').map(function (elem) {
		return elem.trim();
	});

	// split declaration header from statement
	//
	// ['uniform', 'mat4', 'A[10]']
	//
	var header = split.shift().split(' ');

	// qualifier is always first element
	//
	// 'uniform'
	//
	var qualifier = header.shift();

	// type will be the second element
	//
	// 'mat4'
	//
	var type = header.shift();

	// last part of header will be the first, and possible only variable name
	//
	// ['A[10]', 'B', 'C[2]']
	//
	var names = header.concat(split);

	// if there are other names after a ',' add them as well
	return names.map(function (name) {
		return parseNameAndCount(qualifier, type, name);
	});
}

/**
 * Splits the source string by semi-colons and constructs an array of
 * declaration objects based on the provided qualifier keywords.
 *
 * @private
 *
 * @param {string} source - The shader source string.
 * @param {String|Array} keywords - The qualifier declaration keywords.
 *
 * @returns {Array} The array of qualifier declaration objects.
 */
function parseSource(source, keywords) {
	// get individual statements (any sequence ending in ;)
	var statements = source.split(';');
	// build regex for parsing statements with targetted keywords
	var keywordStr = keywords.join('|');
	var keywordRegex = new RegExp('\\b(' + keywordStr + ')\\b.*');
	// parse and store global precision statements and any declarations
	var matched = [];
	// for each statement
	statements.forEach(function (statement) {
		// check for keywords
		//
		// ['uniform float uTime']
		//
		var kmatch = statement.match(keywordRegex);
		if (kmatch) {
			// parse statement and add to array
			matched = matched.concat(parseStatement(kmatch[0]));
		}
	});
	return matched;
}

/**
 * Filters out duplicate declarations present between shaders. Currently
 * just removes all # statements.
 *
 * @private
 *
 * @param {Array} declarations - The array of declarations.
 *
 * @returns {Array} The filtered array of declarations.
 */
function filterDuplicatesByName(declarations) {
	// in cases where the same declarations are present in multiple
	// sources, this function will remove duplicates from the results
	var seen = {};
	return declarations.filter(function (declaration) {
		if (seen[declaration.name]) {
			return false;
		}
		seen[declaration.name] = true;
		return true;
	});
}

/**
 * Runs the preprocessor on the glsl code.
 *
 * @private
 *
 * @param {string} source - The unprocessed source code.
 *
 * @returns {string} The processed source code.
 */
function preprocess(source) {
	return ShaderPreprocessor.preprocess(source);
}

module.exports = {

	/**
  * Parses the provided GLSL source, and returns all declaration statements
  * that contain the provided qualifier type. This can be used to extract all
  * attributes and uniform names and types from a shader.
  *
  * For example, when provided a 'uniform' qualifiers, the declaration:
  *
  *	 'uniform highp vec3 uSpecularColor;'
  *
  * Would be parsed to:
  *    {
  *        qualifier: 'uniform',
  *        type: 'vec3',
  *        name: 'uSpecularColor',
  *        count: 1
  *	 }
  *
  * @param {Array} sources - The shader sources.
  * @param {Array} qualifiers - The qualifiers to extract.
  *
  * @returns {Array} The array of qualifier declaration statements.
  */
	parseDeclarations: function parseDeclarations() {
		var sources = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
		var qualifiers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

		// if no sources or qualifiers are provided, return empty array
		if (sources.length === 0 || qualifiers.length === 0) {
			return [];
		}
		sources = Array.isArray(sources) ? sources : [sources];
		qualifiers = Array.isArray(qualifiers) ? qualifiers : [qualifiers];
		// parse out targetted declarations
		var declarations = [];
		sources.forEach(function (source) {
			// remove comments
			source = stripComments(source);
			// run preprocessor
			source = preprocess(source);
			// remove precision statements
			source = stripPrecision(source);
			// finally, normalize the whitespace
			source = normalizeWhitespace(source);
			// parse out declarations
			declarations = declarations.concat(parseSource(source, qualifiers));
		});
		// remove duplicates and return
		return filterDuplicatesByName(declarations);
	},

	/**
  * Detects based on the existence of a 'void main() {' statement, if the string is glsl source code.
  *
  * @param {string} str - The input string to test.
  *
  * @returns {boolean} Whether or not the string is glsl code.
  */
	isGLSL: function isGLSL(str) {
		return GLSL_REGEXP.test(str);
	}

};

},{"./ShaderPreprocessor":54}],54:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFINED = '__DEFINED__';

var DEFINE_REGEX = /#define\b/i;
var UNDEF_REGEX = /#undef\b/i;
var IF_REGEX = /#if\b/i;
var IFDEF_REGEX = /#ifdef\b/i;
var IFNDEF_REGEX = /#ifndef\b/i;
var ELSE_REGEX = /#else\b/i;
var ELIF_REGEX = /#elif\b/i;
var ENDIF_REGEX = /#endif\b/i;

var PARSE_DEFINE_REGEX = /#define\s+(\w+)(\s(\w*)?)?/i;
var PARSE_UNDEF_REGEX = /#undef\s+(\w+)/i;
var PARSE_IF_REGEX = /#if\s+\(?\s*(!?\s*\w+)\s*(==|!=|>=|<=|<|>)?\s*(\w*)\s*\)?/i;
var PARSE_IFDEF_REGEX = /#ifdef\s+(\w+)/i;
var PARSE_IFNDEF_REGEX = /#ifndef\s+(\w+)/i;
var PARSE_ELIF_REGEX = /#elif\s+\(?\s*(!?\s*\w+)\s*(==|!=|>=|<=|<|>)?\s*(\w*)\s*\)?/i;
var REMAINING_REGEX = /#([\W\w\s\d])(?:.*\\r?\n)*.*$/gm;

var evalIf = function evalIf(a, logic, b) {
	if (logic === undefined) {
		if (a[0] === '!') {
			return !(a === 'true' || a >= 1);
		}
		return a === 'true' || a >= 1;
	}
	switch (logic) {
		case '==':
			return a === b;
		case '!=':
			return a !== b;
		case '>':
			return a > b;
		case '>=':
			return a >= b;
		case '<':
			return a < b;
		case '<=':
			return a <= b;
	}
	throw 'Unrecognized logical operator `' + logic + '`';
};

var Conditional = function () {
	function Conditional(type, conditional) {
		_classCallCheck(this, Conditional);

		this.type = type;
		this.conditional = conditional.trim();
		this.body = [];
		this.children = [];
	}

	_createClass(Conditional, [{
		key: 'eval',
		value: function _eval() {
			var parsed = void 0;
			switch (this.type) {
				case 'if':
					parsed = PARSE_IF_REGEX.exec(this.conditional);
					return evalIf(parsed[1], parsed[2], parsed[3]);
				case 'ifdef':
					parsed = PARSE_IFDEF_REGEX.exec(this.conditional);
					return parsed[1] === DEFINED;
				case 'ifndef':
					parsed = PARSE_IFNDEF_REGEX.exec(this.conditional);
					return parsed[1] !== DEFINED;
				case 'elif':
					parsed = PARSE_ELIF_REGEX.exec(this.conditional);
					return evalIf(parsed[1], parsed[2], parsed[3]);
			}
			throw 'Unrecognized conditional type `' + this.type + '`';
		}
	}]);

	return Conditional;
}();

var Block = function () {
	function Block(type, conditional, lineNum) {
		_classCallCheck(this, Block);

		this.if = new Conditional(type, conditional);
		this.elif = [];
		this.else = null;
		this.parent = null;
		this.current = this.if;
		this.startLine = lineNum;
		this.endLine = null;
	}

	_createClass(Block, [{
		key: 'addElse',
		value: function addElse(conditional) {
			this.current = new Conditional('else', conditional);
			this.else = this.current;
		}
	}, {
		key: 'addElif',
		value: function addElif(conditional) {
			this.current = new Conditional('elif', conditional);
			this.elif.push(this.current);
		}
	}, {
		key: 'addBody',
		value: function addBody(line, lineNum) {
			this.current.body.push({
				string: line.trim(),
				line: lineNum
			});
		}
	}, {
		key: 'nest',
		value: function nest(block) {
			block.parent = this;
			this.current.children.push(block);
		}
	}, {
		key: 'extract',
		value: function extract() {
			// #if
			var body = [];
			if (this.if.eval()) {
				body = body.concat(this.if.body);
				this.if.children.forEach(function (child) {
					body = body.concat(child.extract());
				});
				return body;
			}
			// #elif
			for (var i = 0; i < this.elif.length; i++) {
				var elif = this.elif[i];
				if (elif.eval()) {
					body = body.concat(elif.body);
					for (var j = 0; j < elif.children.length; j++) {
						var child = elif.children[j];
						body = body.concat(child.extract());
					}
					return body;
				}
			}
			// #else
			if (this.else) {
				body = body.concat(this.else.body);
				this.else.children.forEach(function (child) {
					body = body.concat(child.extract());
				});
				return body;
			}
			return [];
		}
	}, {
		key: 'eval',
		value: function _eval() {
			// ensure extract text is ordered correctly
			return this.extract().sort(function (a, b) {
				return a.line - b.line;
			}).map(function (arg) {
				return arg.string;
			}).join('\n');
		}
	}]);

	return Block;
}();

var parseLines = function parseLines(lines) {

	var blocks = [];
	var current = null;

	lines.forEach(function (line, index) {

		if (line.match(IF_REGEX)) {
			// #if
			var block = new Block('if', line, index);
			if (!current) {
				blocks.push(block);
			} else {
				current.nest(block);
			}
			current = block;
		} else if (line.match(IFDEF_REGEX)) {
			// #ifdef
			var _block = new Block('ifdef', line, index);
			if (!current) {
				blocks.push(_block);
			} else {
				current.nest(_block);
			}
			current = _block;
		} else if (line.match(IFNDEF_REGEX)) {
			// #ifndef
			var _block2 = new Block('ifndef', line, index);
			if (!current) {
				blocks.push(_block2);
			} else {
				current.nest(_block2);
			}
			current = _block2;
		} else if (line.match(ELIF_REGEX)) {
			// #elif
			if (!current) {
				throw 'Invalid preprocessor syntax, unexpected `#elif`';
			}
			current.addElif(line);
		} else if (line.match(ELSE_REGEX)) {
			// #else
			if (!current) {
				throw 'Invalid preprocessor syntax, unexpected `#else`';
			}
			current.addElse(line);
		} else if (line.match(ENDIF_REGEX)) {
			// #endif
			if (!current) {
				throw 'Invalid preprocessor syntax, unexpected `#endif`';
			}
			current.endLine = index;
			current = current.parent;
		} else {
			// other
			if (current) {
				current.addBody(line, index);
			}
		}
	});

	if (current) {
		throw 'Invalid preprocessor syntax, missing expected `#endif`';
	}

	return blocks;
};

var replaceDefines = function replaceDefines(lines) {
	var defines = new Map();
	var replaced = [];
	lines.forEach(function (line) {
		if (line.match(DEFINE_REGEX)) {
			// #define
			var parsed = PARSE_DEFINE_REGEX.exec(line);
			defines.set(parsed[1], parsed[2] || DEFINED);
		} else if (line.match(UNDEF_REGEX)) {
			// #undef
			var _parsed = PARSE_UNDEF_REGEX.exec(line);
			defines.delete(_parsed[1]);
		} else if (line.match(IFDEF_REGEX)) {
			// #ifdef
			var _parsed2 = PARSE_IFDEF_REGEX.exec(line);
			if (defines.has(_parsed2[1])) {
				line = line.replace(_parsed2[1], DEFINED);
			}
			replaced.push(line);
		} else if (line.match(IFNDEF_REGEX)) {
			// #ifndef
			var _parsed3 = PARSE_IFNDEF_REGEX.exec(line);
			if (defines.has(_parsed3[1])) {
				line = line.replace(_parsed3[1], DEFINED);
			}
			replaced.push(line);
		} else {
			// swap defines
			defines.forEach(function (val, define) {
				line = line.replace(define, val);
			});
			replaced.push(line);
		}
	});
	return replaced;
};

/**
 * Evaluates GLSL preprocessor statements.
 * NOTE: assumes comments have been stripped, and preprocessors are valid.
 *
 *     Supported:
 *
 *         #define (substitutions only)
 *         #undef
 *         #if (== and != comparisons only)
 *         #ifdef
 *         #ifndef
 *         #elif
 *         #else
 *         #endif
 *
 *     Not Supported:
 *
 *         #define (macros)
 *         #if (&& and || operators, defined() predicate)
 *         #error
 *         #pragma
 *         #extension
 *         #version
 *         #line
 *
 * @param {string} glsl - The glsl source code.
 *
 * @returns {string} The processed glsl source code.
 */
module.exports = {
	preprocess: function preprocess(glsl) {
		// split lines
		var lines = glsl.split('\n');
		// replace any defines with their values
		lines = replaceDefines(lines);
		// parse them
		var blocks = parseLines(lines);
		// remove blocks in reverse order to preserve line numbers
		for (var i = blocks.length - 1; i >= 0; i--) {
			var block = blocks[i];
			var replacement = block.eval();
			if (replacement.length > 0) {
				lines.splice(block.startLine, block.endLine - block.startLine + 1, replacement);
			} else {
				lines.splice(block.startLine, block.endLine - block.startLine + 1);
			}
		}
		// strip remaining unsupported preprocessor statements
		return lines.join('\n').replace(REMAINING_REGEX, '');
	}
};

},{}],55:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebGLContext = require('./WebGLContext');
var Util = require('../util/Util');

var MAG_FILTERS = {
	NEAREST: true,
	LINEAR: true
};
var MIN_FILTERS = {
	NEAREST: true,
	LINEAR: true,
	NEAREST_MIPMAP_NEAREST: true,
	LINEAR_MIPMAP_NEAREST: true,
	NEAREST_MIPMAP_LINEAR: true,
	LINEAR_MIPMAP_LINEAR: true
};
var NON_MIPMAP_MIN_FILTERS = {
	NEAREST: true,
	LINEAR: true
};
var MIPMAP_MIN_FILTERS = {
	NEAREST_MIPMAP_NEAREST: true,
	LINEAR_MIPMAP_NEAREST: true,
	NEAREST_MIPMAP_LINEAR: true,
	LINEAR_MIPMAP_LINEAR: true
};
var WRAP_MODES = {
	REPEAT: true,
	MIRRORED_REPEAT: true,
	CLAMP_TO_EDGE: true
};
var DEPTH_TYPES = {
	DEPTH_COMPONENT: true,
	DEPTH_STENCIL: true
};

/**
 * The default type for textures.
 * @private
 * @constant {string}
 */
var DEFAULT_TYPE = 'UNSIGNED_BYTE';

/**
 * The default format for textures.
 * @private
 * @constant {string}
 */
var DEFAULT_FORMAT = 'RGBA';

/**
 * The default wrap mode for textures.
 * @private
 * @constant {string}
 */
var DEFAULT_WRAP = 'REPEAT';

/**
 * The default min / mag filter for textures.
 * @private
 * @constant {string}
 */
var DEFAULT_FILTER = 'LINEAR';

/**
 * The default for whether alpha premultiplying is enabled.
 * @private
 * @constant {boolean}
 */
var DEFAULT_PREMULTIPLY_ALPHA = true;

/**
 * The default for whether mipmapping is enabled.
 * @private
 * @constant {boolean}
 */
var DEFAULT_MIPMAP = true;

/**
 * The default for whether invert-y is enabled.
 * @private
 * @constant {boolean}
 */
var DEFAULT_INVERT_Y = true;

/**
 * The default mip-mapping filter suffix.
 * @private
 * @constant {string}
 */
var DEFAULT_MIPMAP_MIN_FILTER_SUFFIX = '_MIPMAP_LINEAR';

/**
 * A texture class to represent a 2D texture.
 */

var Texture2D = function () {

	/**
  * Instantiates a Texture2D object.
  *
  * @param {Object} spec - The specification arguments.
  * @param {ArrayBuffer|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} spec.src - The data to buffer.
  * @param {number} spec.width - The width of the texture.
  * @param {number} spec.height - The height of the texture.
  * @param {string} spec.wrap - The wrapping type over both S and T dimension.
  * @param {string} spec.wrapS - The wrapping type over the S dimension.
  * @param {string} spec.wrapT - The wrapping type over the T dimension.
  * @param {string} spec.filter - The min / mag filter used during scaling.
  * @param {string} spec.minFilter - The minification filter used during scaling.
  * @param {string} spec.magFilter - The magnification filter used during scaling.
  * @param {bool} spec.mipMap - Whether or not mip-mapping is enabled.
  * @param {bool} spec.invertY - Whether or not invert-y is enabled.
  * @param {bool} spec.premultiplyAlpha - Whether or not alpha premultiplying is enabled.
  * @param {string} spec.format - The texture pixel format.
  * @param {string} spec.type - The texture pixel component type.
  */
	function Texture2D() {
		var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Texture2D);

		// get specific params
		spec.wrapS = spec.wrapS || spec.wrap;
		spec.wrapT = spec.wrapT || spec.wrap;
		spec.minFilter = spec.minFilter || spec.filter;
		spec.magFilter = spec.magFilter || spec.filter;
		// set context
		this.gl = WebGLContext.get();
		// empty texture
		this.texture = null;
		// set texture params
		this.wrapS = spec.wrapS || DEFAULT_WRAP;
		this.wrapT = spec.wrapT || DEFAULT_WRAP;
		this.minFilter = spec.minFilter || DEFAULT_FILTER;
		this.magFilter = spec.magFilter || DEFAULT_FILTER;
		// set other properties
		this.mipMap = spec.mipMap !== undefined ? spec.mipMap : DEFAULT_MIPMAP;
		this.invertY = spec.invertY !== undefined ? spec.invertY : DEFAULT_INVERT_Y;
		this.premultiplyAlpha = spec.premultiplyAlpha !== undefined ? spec.premultiplyAlpha : DEFAULT_PREMULTIPLY_ALPHA;
		// set format
		this.format = spec.format || DEFAULT_FORMAT;
		if (DEPTH_TYPES[this.format] && !WebGLContext.checkExtension('WEBGL_depth_texture')) {
			throw 'Cannot create Texture2D of format `' + this.format + '` as `WEBGL_depth_texture` extension is unsupported';
		}
		// set type
		this.type = spec.type || DEFAULT_TYPE;
		if (this.type === 'FLOAT' && !WebGLContext.checkExtension('OES_texture_float')) {
			throw 'Cannot create Texture2D of type `FLOAT` as `OES_texture_float` extension is unsupported';
		}
		// url will not be resolved yet, so don't buffer in that case
		if (typeof spec.src !== 'string') {
			// check size
			if (!Util.isCanvasType(spec.src)) {
				// if not a canvas type, dimensions MUST be specified
				if (typeof spec.width !== 'number' || spec.width <= 0) {
					throw '`width` argument is missing or invalid';
				}
				if (typeof spec.height !== 'number' || spec.height <= 0) {
					throw '`height` argument is missing or invalid';
				}
				if (Util.mustBePowerOfTwo(this)) {
					if (!Util.isPowerOfTwo(spec.width)) {
						throw 'Parameters require a power-of-two texture, yet provided width of `' + spec.width + '` is not a power of two';
					}
					if (!Util.isPowerOfTwo(spec.height)) {
						throw 'Parameters require a power-of-two texture, yet provided height of `' + spec.height + '` is not a power of two';
					}
				}
			}
			// buffer the data
			this.bufferData(spec.src || null, spec.width, spec.height);
			this.setParameters(this);
		}
	}

	/**
  * Binds the texture object to the provided texture unit location.
  *
  * @param {number} location - The texture unit location index. Defaults to 0.
  *
  * @returns {Texture2D} The texture object, for chaining.
  */


	_createClass(Texture2D, [{
		key: 'bind',
		value: function bind() {
			var location = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			if (!Number.isInteger(location) || location < 0) {
				throw 'Texture unit location is invalid';
			}
			// bind texture
			var gl = this.gl;
			gl.activeTexture(gl['TEXTURE' + location]);
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			return this;
		}

		/**
   * Unbinds the texture object.
   *
   * @returns {Texture2D} The texture object, for chaining.
   */

	}, {
		key: 'unbind',
		value: function unbind() {
			// unbind texture
			var gl = this.gl;
			gl.bindTexture(gl.TEXTURE_2D, null);
			return this;
		}

		/**
   * Buffer data into the texture.
   *
   * @param {Array|ArrayBuffer} data - The data array to buffer.
   * @param {number} width - The width of the data.
   * @param {number} height - The height of the data.
   *
   * @returns {Texture2D} The texture object, for chaining.
   */

	}, {
		key: 'bufferData',
		value: function bufferData(data, width, height) {
			var gl = this.gl;
			// create texture object if it doesn't already exist
			if (!this.texture) {
				this.texture = gl.createTexture();
			}
			// bind texture
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			// invert y if specified
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.invertY);
			// premultiply alpha if specified
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
			// cast array arg
			if (Array.isArray(data)) {
				if (this.type === 'UNSIGNED_SHORT') {
					data = new Uint16Array(data);
				} else if (this.type === 'UNSIGNED_INT') {
					data = new Uint32Array(data);
				} else if (this.type === 'FLOAT') {
					data = new Float32Array(data);
				} else {
					data = new Uint8Array(data);
				}
			}
			// set ensure type corresponds to data
			if (data instanceof Uint8Array) {
				this.type = 'UNSIGNED_BYTE';
			} else if (data instanceof Uint16Array) {
				this.type = 'UNSIGNED_SHORT';
			} else if (data instanceof Uint32Array) {
				this.type = 'UNSIGNED_INT';
			} else if (data instanceof Float32Array) {
				this.type = 'FLOAT';
			} else if (data && !(data instanceof ArrayBuffer) && !Util.isCanvasType(data)) {
				throw 'Argument must be of type `Array`, `ArrayBuffer`, ' + '`ArrayBufferView`, `ImageData`, `HTMLImageElement`, ' + '`HTMLCanvasElement`, `HTMLVideoElement`, or null';
			}
			if (Util.isCanvasType(data)) {
				// store width and height
				this.width = data.width;
				this.height = data.height;
				// buffer the texture
				gl.texImage2D(gl.TEXTURE_2D, 0, // mip-map level
				gl[this.format], // webgl requires format === internalFormat
				gl[this.format], gl[this.type], data);
			} else {
				// store width and height
				this.width = width || this.width;
				this.height = height || this.height;
				// buffer the texture data
				gl.texImage2D(gl.TEXTURE_2D, 0, // mip-map level
				gl[this.format], // webgl requires format === internalFormat
				this.width, this.height, 0, // border, must be 0
				gl[this.format], gl[this.type], data);
			}
			// generate mip maps
			if (this.mipMap) {
				gl.generateMipmap(gl.TEXTURE_2D);
			}
			// unbind texture
			gl.bindTexture(gl.TEXTURE_2D, null);
			return this;
		}

		/**
   * Buffer partial data into the texture.
   *
   * @param {Array|ArrayBuffer} data - The data array to buffer.
   * @param {number} xOffset - The x offset at which to buffer.
   * @param {number} yOffset - The y offset at which to buffer.
   * @param {number} width - The width of the data.
   * @param {number} height - The height of the data.
   *
   * @returns {Texture2D} The texture object, for chaining.
   */

	}, {
		key: 'bufferSubData',
		value: function bufferSubData(data) {
			var xOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var yOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
			var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
			var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

			var gl = this.gl;
			// bind texture
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			// cast array arg
			if (Array.isArray(data)) {
				if (this.type === 'UNSIGNED_SHORT') {
					data = new Uint16Array(data);
				} else if (this.type === 'UNSIGNED_INT') {
					data = new Uint32Array(data);
				} else if (this.type === 'FLOAT') {
					data = new Float32Array(data);
				} else {
					data = new Uint8Array(data);
				}
			}
			// set ensure type corresponds to data
			if (data instanceof Uint8Array) {
				if (this.type !== 'UNSIGNED_BYTE') {
					throw 'Provided argument of type `Uint8Array` does not match type of `UNSIGNED_BYTE`';
				}
			} else if (data instanceof Uint16Array) {
				if (this.type !== 'UNSIGNED_SHORT') {
					throw 'Provided argument of type `Uint16Array` does not match type of `UNSIGNED_SHORT`';
				}
			} else if (data instanceof Uint32Array) {
				if (this.type !== 'UNSIGNED_INT') {
					throw 'Provided argument of type `Uint32Array` does not match type of `UNSIGNED_INT`';
				}
			} else if (data instanceof Float32Array) {
				if (this.type !== 'FLOAT') {
					throw 'Provided argument of type `Float32Array` does not match type of `FLOAT`';
				}
			} else if (!(data instanceof ArrayBuffer) && !Util.isCanvasType(data)) {
				throw 'Argument must be of type `Array`, `ArrayBuffer`, ' + '`ArrayBufferView`, `ImageData`, `HTMLImageElement`, ' + '`HTMLCanvasElement`, or `HTMLVideoElement`';
			}
			if (Util.isCanvasType(data)) {
				// buffer the texture
				gl.texSubImage2D(gl.TEXTURE_2D, 0, // mip-map level
				xOffset, yOffset, gl[this.format], gl[this.type], data);
			} else {
				// check that width is provided
				if (!Number.isInteger(width)) {
					throw 'Provided width of `' + width + '` is invalid';
				}
				// check that height is provided
				if (!Number.isInteger(height)) {
					throw 'Provided height of `' + height + '` is invalid';
				}
				// check that we aren't overflowing the buffer
				if (width + xOffset > this.width) {
					throw 'Provided width of `' + width + '` and xOffset of ' + (' `' + xOffset + '` overflows the texture width of ') + ('`' + this.width + '`');
				}
				if (height + yOffset > this.height) {
					throw 'Provided width of `' + height + '` and xOffset of ' + (' `' + yOffset + '` overflows the texture width of ') + ('`' + this.height + '`');
				}
				// buffer the texture data
				gl.texSubImage2D(gl.TEXTURE_2D, 0, // mip-map level
				xOffset, yOffset, width, height, gl[this.format], gl[this.type], data);
			}
			// generate mip maps
			if (this.mipMap) {
				gl.generateMipmap(gl.TEXTURE_2D);
			}
			// unbind texture
			gl.bindTexture(gl.TEXTURE_2D, null);
			return this;
		}

		/**
   * Set the texture parameters.
   *
   * @param {Object} params - The parameters by name.
   * @param {string} params.wrap - The wrapping type over both S and T dimension.
   * @param {string} params.wrapS - The wrapping type over the S dimension.
   * @param {string} params.wrapT - The wrapping type over the T dimension.
   * @param {string} params.filter - The min / mag filter used during scaling.
   * @param {string} params.minFilter - The minification filter used during scaling.
   * @param {string} params.magFilter - The magnification filter used during scaling.
   *
   * @returns {Texture2D} The texture object, for chaining.
   */

	}, {
		key: 'setParameters',
		value: function setParameters(params) {
			var gl = this.gl;
			// bind texture
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			// set wrap S parameter
			var param = params.wrapS || params.wrap;
			if (param) {
				if (WRAP_MODES[param]) {
					this.wrapS = param;
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[this.wrapS]);
				} else {
					throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_WRAP_S`';
				}
			}
			// set wrap T parameter
			param = params.wrapT || params.wrap;
			if (param) {
				if (WRAP_MODES[param]) {
					this.wrapT = param;
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[this.wrapT]);
				} else {
					throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_WRAP_T`';
				}
			}
			// set mag filter parameter
			param = params.magFilter || params.filter;
			if (param) {
				if (MAG_FILTERS[param]) {
					this.magFilter = param;
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[this.magFilter]);
				} else {
					throw 'Texture parameter `' + param + '` is not a valid value for \'TEXTURE_MAG_FILTER`';
				}
			}
			// set min filter parameter
			param = params.minFilter || params.filter;
			if (param) {
				if (this.mipMap) {
					if (NON_MIPMAP_MIN_FILTERS[param]) {
						// upgrade to mip-map min filter
						param += DEFAULT_MIPMAP_MIN_FILTER_SUFFIX;
					}
					if (MIPMAP_MIN_FILTERS[param]) {
						this.minFilter = param;
						gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
					} else {
						throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MIN_FILTER`';
					}
				} else {
					if (MIN_FILTERS[param]) {
						this.minFilter = param;
						gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
					} else {
						throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MIN_FILTER`';
					}
				}
			}
			// unbind texture
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			return this;
		}

		/**
   * Resize the underlying texture. This clears the texture data.
   *
   * @param {number} width - The new width of the texture.
   * @param {number} height - The new height of the texture.
   *
   * @returns {Texture2D} The texture object, for chaining.
   */

	}, {
		key: 'resize',
		value: function resize(width, height) {
			if (typeof width !== 'number' || width <= 0) {
				throw 'Provided width of `' + width + '` is invalid';
			}
			if (typeof height !== 'number' || height <= 0) {
				throw 'Provided height of `' + height + '` is invalid';
			}
			this.bufferData(null, width, height);
			return this;
		}
	}]);

	return Texture2D;
}();

module.exports = Texture2D;

},{"../util/Util":63,"./WebGLContext":60}],56:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var parallel = require('async/parallel');
var WebGLContext = require('./WebGLContext');
var ImageLoader = require('../util/ImageLoader');
var Util = require('../util/Util');

var FACES = ['-x', '+x', '-y', '+y', '-z', '+z'];
var FACE_TARGETS = {
	'+z': 'TEXTURE_CUBE_MAP_POSITIVE_Z',
	'-z': 'TEXTURE_CUBE_MAP_NEGATIVE_Z',
	'+x': 'TEXTURE_CUBE_MAP_POSITIVE_X',
	'-x': 'TEXTURE_CUBE_MAP_NEGATIVE_X',
	'+y': 'TEXTURE_CUBE_MAP_POSITIVE_Y',
	'-y': 'TEXTURE_CUBE_MAP_NEGATIVE_Y'
};
var TARGETS = {
	TEXTURE_CUBE_MAP_POSITIVE_Z: true,
	TEXTURE_CUBE_MAP_NEGATIVE_Z: true,
	TEXTURE_CUBE_MAP_POSITIVE_X: true,
	TEXTURE_CUBE_MAP_NEGATIVE_X: true,
	TEXTURE_CUBE_MAP_POSITIVE_Y: true,
	TEXTURE_CUBE_MAP_NEGATIVE_Y: true
};
var MAG_FILTERS = {
	NEAREST: true,
	LINEAR: true
};
var MIN_FILTERS = {
	NEAREST: true,
	LINEAR: true,
	NEAREST_MIPMAP_NEAREST: true,
	LINEAR_MIPMAP_NEAREST: true,
	NEAREST_MIPMAP_LINEAR: true,
	LINEAR_MIPMAP_LINEAR: true
};
var NON_MIPMAP_MIN_FILTERS = {
	NEAREST: true,
	LINEAR: true
};
var MIPMAP_MIN_FILTERS = {
	NEAREST_MIPMAP_NEAREST: true,
	LINEAR_MIPMAP_NEAREST: true,
	NEAREST_MIPMAP_LINEAR: true,
	LINEAR_MIPMAP_LINEAR: true
};
var WRAP_MODES = {
	REPEAT: true,
	MIRRORED_REPEAT: true,
	CLAMP_TO_EDGE: true
};
var FORMATS = {
	RGB: true,
	RGBA: true
};

/**
 * The default type for textures.
 * @private
 * @constant {string}
 */
var DEFAULT_TYPE = 'UNSIGNED_BYTE';

/**
 * The default format for textures.
 * @private
 * @constant {string}
 */
var DEFAULT_FORMAT = 'RGBA';

/**
 * The default wrap mode for textures.
 * @private
 * @constant {string}
 */
var DEFAULT_WRAP = 'CLAMP_TO_EDGE';

/**
 * The default min / mag filter for textures.
 * @private
 * @constant {string}
 */
var DEFAULT_FILTER = 'LINEAR';

/**
 * The default for whether alpha premultiplying is enabled.
 * @private
 * @constant {boolean}
 */
var DEFAULT_PREMULTIPLY_ALPHA = true;

/**
 * The default for whether mipmapping is enabled.
 * @private
 * @constant {boolean}
 */
var DEFAULT_MIPMAP = true;

/**
 * The default for whether invert-y is enabled.
 * @private
 * @constant {boolean}
 */
var DEFAULT_INVERT_Y = true;

/**
 * The default mip-mapping filter suffix.
 * @private
 * @constant {string}
 */
var DEFAULT_MIPMAP_MIN_FILTER_SUFFIX = '_MIPMAP_LINEAR';

/**
 * Checks the width and height of the cubemap and throws an exception if it does
 * not meet requirements.
 *
 * @private
 *
 * @param {TextureCubeMap} cubeMap - The cube map texture object.
 */
function checkDimensions(cubeMap) {
	if (typeof cubeMap.width !== 'number' || cubeMap.width <= 0) {
		throw '`width` argument is missing or invalid';
	}
	if (typeof cubeMap.height !== 'number' || cubeMap.height <= 0) {
		throw '`height` argument is missing or invalid';
	}
	if (cubeMap.width !== cubeMap.height) {
		throw 'Provided `width` must be equal to `height`';
	}
	if (Util.mustBePowerOfTwo(cubeMap) && !Util.isPowerOfTwo(cubeMap.width)) {
		throw 'Parameters require a power-of-two texture, yet provided size of ' + cubeMap.width + ' is not a power of two';
	}
}

/**
 * Returns a function to load a face from a url.
 *
 * @private
 *
 * @param {TextureCubeMap} cubeMap - The cube map texture object.
 * @param {string} target - The texture target.
 * @param {string} url - The url to load the face from.
 *
 * @returns {Function} The loader function.
 */
function loadFaceURL(cubeMap, target, url) {
	return function (done) {
		// TODO: put extension handling for arraybuffer / image / video differentiation
		ImageLoader.load({
			url: url,
			success: function success(image) {
				image = Util.resizeCanvas(cubeMap, image);
				cubeMap.bufferData(target, image);
				done(null);
			},
			error: function error(err) {
				done(err, null);
			}
		});
	};
}

/**
 * Returns a function to load a face from a canvas type object.
 *
 * @private
 *
 * @param {TextureCubeMap} cubeMap - The cube map texture object.
 * @param {string} target - The texture target.
 * @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} canvas - The canvas type object.
 *
 * @returns {Function} - The loader function.
 */
function loadFaceCanvas(cubeMap, target, canvas) {
	return function (done) {
		canvas = Util.resizeCanvas(cubeMap, canvas);
		cubeMap.bufferData(target, canvas);
		done(null);
	};
}

/**
 * Returns a function to load a face from an array type object.
 *
 * @private
 *
 * @param {TextureCubeMap} cubeMap - The cube map texture object.
 * @param {string} target - The texture target.
 * @param {Array|ArrayBuffer|ArrayBufferView} arr - The array type object.
 *
 * @returns {Function} The loader function.
 */
function loadFaceArray(cubeMap, target, arr) {
	checkDimensions(cubeMap);
	return function (done) {
		cubeMap.bufferData(target, arr);
		done(null);
	};
}

/**
 * A texture class to represent a cube map texture.
 */

var TextureCubeMap = function () {

	/**
  * Instantiates a TextureCubeMap object.
  *
  * @param {Object} spec - The specification arguments.
  * @param {Object} spec.faces - The faces to buffer, under keys '+x', '+y', '+z', '-x', '-y', and '-z'.
  * @param {number} spec.width - The width of the faces.
  * @param {number} spec.height - The height of the faces.
  * @param {string} spec.wrap - The wrapping type over both S and T dimension.
  * @param {string} spec.wrapS - The wrapping type over the S dimension.
  * @param {string} spec.wrapT - The wrapping type over the T dimension.
  * @param {string} spec.filter - The min / mag filter used during scaling.
  * @param {string} spec.minFilter - The minification filter used during scaling.
  * @param {string} spec.magFilter - The magnification filter used during scaling.
  * @param {bool} spec.mipMap - Whether or not mip-mapping is enabled.
  * @param {bool} spec.invertY - Whether or not invert-y is enabled.
  * @param {bool} spec.premultiplyAlpha - Whether or not alpha premultiplying is enabled.
  * @param {string} spec.format - The texture pixel format.
  * @param {string} spec.type - The texture pixel component type.
  * @param {Function} callback - The callback to be executed if the data is loaded asynchronously via a URL.
  */
	function TextureCubeMap() {
		var _this = this;

		var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		_classCallCheck(this, TextureCubeMap);

		this.gl = WebGLContext.get();
		this.texture = null;
		// get specific params
		spec.wrapS = spec.wrapS || spec.wrap;
		spec.wrapT = spec.wrapT || spec.wrap;
		spec.minFilter = spec.minFilter || spec.filter;
		spec.magFilter = spec.magFilter || spec.filter;
		// set texture params
		this.wrapS = WRAP_MODES[spec.wrapS] ? spec.wrapS : DEFAULT_WRAP;
		this.wrapT = WRAP_MODES[spec.wrapT] ? spec.wrapT : DEFAULT_WRAP;
		this.minFilter = MIN_FILTERS[spec.minFilter] ? spec.minFilter : DEFAULT_FILTER;
		this.magFilter = MAG_FILTERS[spec.magFilter] ? spec.magFilter : DEFAULT_FILTER;
		// set other properties
		this.mipMap = spec.mipMap !== undefined ? spec.mipMap : DEFAULT_MIPMAP;
		this.invertY = spec.invertY !== undefined ? spec.invertY : DEFAULT_INVERT_Y;
		this.premultiplyAlpha = spec.premultiplyAlpha !== undefined ? spec.premultiplyAlpha : DEFAULT_PREMULTIPLY_ALPHA;
		// set format and type
		this.format = FORMATS[spec.format] ? spec.format : DEFAULT_FORMAT;
		this.type = spec.type || DEFAULT_TYPE;
		if (this.type === 'FLOAT' && !WebGLContext.checkExtension('OES_texture_float')) {
			throw 'Cannot create Texture2D of type `FLOAT` as `OES_texture_float` extension is unsupported';
		}
		// set dimensions if provided
		this.width = spec.width;
		this.height = spec.height;
		// set buffered faces
		this.bufferedFaces = [];
		// create cube map based on input
		if (spec.faces) {
			var tasks = [];
			FACES.forEach(function (id) {
				var face = spec.faces[id];
				var target = FACE_TARGETS[id];
				// load based on type
				if (typeof face === 'string') {
					// url
					tasks.push(loadFaceURL(_this, target, face));
				} else if (Util.isCanvasType(face)) {
					// canvas
					tasks.push(loadFaceCanvas(_this, target, face));
				} else {
					// array / arraybuffer or null
					tasks.push(loadFaceArray(_this, target, face));
				}
			});
			parallel(tasks, function (err) {
				if (err) {
					if (callback) {
						setTimeout(function () {
							callback(err, null);
						});
					}
					return;
				}
				// set parameters
				_this.setParameters(_this);
				if (callback) {
					setTimeout(function () {
						callback(null, _this);
					});
				}
			});
		} else {
			// null
			checkDimensions(this);
			FACES.forEach(function (id) {
				_this.bufferData(FACE_TARGETS[id], null);
			});
			// set parameters
			this.setParameters(this);
		}
	}

	/**
  * Binds the texture object to the provided texture unit location.
  *
  * @param {number} location - The texture unit location index. Defaults to 0.
  *
  * @returns {TextureCubeMap} The texture object, for chaining.
  */


	_createClass(TextureCubeMap, [{
		key: 'bind',
		value: function bind() {
			var location = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			if (!Number.isInteger(location) || location < 0) {
				throw 'Texture unit location is invalid';
			}
			// bind cube map texture
			var gl = this.gl;
			gl.activeTexture(gl['TEXTURE' + location]);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
			return this;
		}

		/**
   * Unbinds the texture object.
   *
   * @returns {TextureCubeMap} - The texture object, for chaining.
   */

	}, {
		key: 'unbind',
		value: function unbind() {
			// unbind cube map texture
			var gl = this.gl;
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
			return this;
		}

		/**
   * Buffer data into the respective cube map face.
   *
   * @param {string} target - The face target.
   * @param {Object|null} data - The face data.
   *
   * @returns {TextureCubeMap} The texture object, for chaining.
   */

	}, {
		key: 'bufferData',
		value: function bufferData(target, data) {
			if (!TARGETS[target]) {
				throw 'Provided `target` of ' + target + '  is invalid';
			}
			var gl = this.gl;
			// create texture object if it doesn't already exist
			if (!this.texture) {
				this.texture = gl.createTexture();
			}
			// bind texture
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
			// invert y if specified
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.invertY);
			// premultiply alpha if specified
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
			// cast array arg
			if (Array.isArray(data)) {
				if (this.type === 'UNSIGNED_SHORT') {
					data = new Uint16Array(data);
				} else if (this.type === 'UNSIGNED_INT') {
					data = new Uint32Array(data);
				} else if (this.type === 'FLOAT') {
					data = new Float32Array(data);
				} else {
					data = new Uint8Array(data);
				}
			}
			// set ensure type corresponds to data
			if (data instanceof Uint8Array) {
				this.type = 'UNSIGNED_BYTE';
			} else if (data instanceof Uint16Array) {
				this.type = 'UNSIGNED_SHORT';
			} else if (data instanceof Uint32Array) {
				this.type = 'UNSIGNED_INT';
			} else if (data instanceof Float32Array) {
				this.type = 'FLOAT';
			} else if (data && !(data instanceof ArrayBuffer) && !Util.isCanvasType(data)) {
				throw 'Argument must be of type `Array`, `ArrayBuffer`, ' + '`ArrayBufferView`, `ImageData`, `HTMLImageElement`, ' + '`HTMLCanvasElement`, `HTMLVideoElement`, or null';
			}
			// buffer the data
			if (Util.isCanvasType(data)) {
				// store width and height
				this.width = data.width;
				this.height = data.height;
				// buffer the texture
				gl.texImage2D(gl[target], 0, // mip-map level,
				gl[this.format], // webgl requires format === internalFormat
				gl[this.format], gl[this.type], data);
			} else {
				// buffer the texture data
				gl.texImage2D(gl[target], 0, // mip-map level
				gl[this.format], // webgl requires format === internalFormat
				this.width, this.height, 0, // border, must be 0
				gl[this.format], gl[this.type], data);
			}
			// track the face that was buffered
			if (this.bufferedFaces.indexOf(target) < 0) {
				this.bufferedFaces.push(target);
			}
			// if all faces buffered, generate mipmaps
			if (this.mipMap && this.bufferedFaces.length === 6) {
				// only generate mipmaps if all faces are buffered
				gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
			}
			// unbind texture
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
			return this;
		}

		/**
   * Set the texture parameters.
   *
   * @param {Object} params - The parameters by name.
   * @param {string} params.wrap - The wrapping type over both S and T dimension.
   * @param {string} params.wrapS - The wrapping type over the S dimension.
   * @param {string} params.wrapT - The wrapping type over the T dimension.
   * @param {string} params.filter - The min / mag filter used during scaling.
   * @param {string} params.minFilter - The minification filter used during scaling.
   * @param {string} params.magFilter - The magnification filter used during scaling.
   *
   * @returns {TextureCubeMap} The texture object, for chaining.
   */

	}, {
		key: 'setParameters',
		value: function setParameters(params) {
			var gl = this.gl;
			// bind texture
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
			// set wrap S parameter
			var param = params.wrapS || params.wrap;
			if (param) {
				if (WRAP_MODES[param]) {
					this.wrapS = param;
					gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl[this.wrapS]);
				} else {
					throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_WRAP_S`';
				}
			}
			// set wrap T parameter
			param = params.wrapT || params.wrap;
			if (param) {
				if (WRAP_MODES[param]) {
					this.wrapT = param;
					gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl[this.wrapT]);
				} else {
					throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_WRAP_T`';
				}
			}
			// set mag filter parameter
			param = params.magFilter || params.filter;
			if (param) {
				if (MAG_FILTERS[param]) {
					this.magFilter = param;
					gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl[this.magFilter]);
				} else {
					throw 'Texture parameter `' + param + '` is not a valid value for \'TEXTURE_MAG_FILTER`';
				}
			}
			// set min filter parameter
			param = params.minFilter || params.filter;
			if (param) {
				if (this.mipMap) {
					if (NON_MIPMAP_MIN_FILTERS[param]) {
						// upgrade to mip-map min filter
						param += DEFAULT_MIPMAP_MIN_FILTER_SUFFIX;
					}
					if (MIPMAP_MIN_FILTERS[param]) {
						this.minFilter = param;
						gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
					} else {
						throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MIN_FILTER`';
					}
				} else {
					if (MIN_FILTERS[param]) {
						this.minFilter = param;
						gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
					} else {
						throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MIN_FILTER`';
					}
				}
			}
			// unbind texture
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
			return this;
		}
	}]);

	return TextureCubeMap;
}();

module.exports = TextureCubeMap;

},{"../util/ImageLoader":62,"../util/Util":63,"./WebGLContext":60,"async/parallel":16}],57:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebGLContext = require('./WebGLContext');

var MODES = {
	POINTS: true,
	LINES: true,
	LINE_STRIP: true,
	LINE_LOOP: true,
	TRIANGLES: true,
	TRIANGLE_STRIP: true,
	TRIANGLE_FAN: true
};
var TYPES = {
	BYTE: true,
	UNSIGNED_BYTE: true,
	SHORT: true,
	UNSIGNED_SHORT: true,
	FIXED: true,
	FLOAT: true
};
var BYTES_PER_TYPE = {
	BYTE: 1,
	UNSIGNED_BYTE: 1,
	SHORT: 2,
	UNSIGNED_SHORT: 2,
	FIXED: 4,
	FLOAT: 4
};
var SIZES = {
	1: true,
	2: true,
	3: true,
	4: true
};

/**
 * The default attribute point byte offset.
 * @private
 * @constant {number}
 */
var DEFAULT_BYTE_OFFSET = 0;

/**
 * The default render mode (primitive type).
 * @private
 * @constant {string}
 */
var DEFAULT_MODE = 'TRIANGLES';

/**
 * The default index offset to render from.
 * @private
 * @constant {number}
 */
var DEFAULT_INDEX_OFFSET = 0;

/**
 * The default count of indices to render.
 * @private
 * @constant {number}
 */
var DEFAULT_COUNT = 0;

/**
 * Parse the attribute pointers and determine the byte stride of the buffer.
 *
 * @private
 *
 * @param {Map} attributePointers - The attribute pointer map.
 *
 * @returns {number} The byte stride of the buffer.
 */
function getStride(attributePointers) {
	// if there is only one attribute pointer assigned to this buffer,
	// there is no need for stride, set to default of 0
	if (attributePointers.size === 1) {
		return 0;
	}
	var maxByteOffset = 0;
	var byteSizeSum = 0;
	var byteStride = 0;
	attributePointers.forEach(function (pointer) {
		var byteOffset = pointer.byteOffset;
		var size = pointer.size;
		var type = pointer.type;
		// track the sum of each attribute size
		byteSizeSum += size * BYTES_PER_TYPE[type];
		// track the largest offset to determine the byte stride of the buffer
		if (byteOffset > maxByteOffset) {
			maxByteOffset = byteOffset;
			byteStride = byteOffset + size * BYTES_PER_TYPE[type];
		}
	});
	// check if the max byte offset is greater than or equal to the the sum of
	// the sizes. If so this buffer is not interleaved and does not need a
	// stride.
	if (maxByteOffset >= byteSizeSum) {
		// TODO: test what stride === 0 does for an interleaved buffer of
		// length === 1.
		return 0;
	}
	return byteStride;
}

/**
 * Parse the attribute pointers to ensure they are valid.
 *
 * @private
 *
 * @param {Object} attributePointers - The attribute pointer map.
 *
 * @returns {Object} The validated attribute pointer map.
 */
function getAttributePointers(attributePointers) {
	// parse pointers to ensure they are valid
	var pointers = new Map();
	Object.keys(attributePointers).forEach(function (key) {
		var index = parseInt(key, 10);
		// check that key is an valid integer
		if (isNaN(index)) {
			throw 'Attribute index `' + key + '` does not represent an integer';
		}
		var pointer = attributePointers[key];
		var size = pointer.size;
		var type = pointer.type;
		var byteOffset = pointer.byteOffset;
		// check size
		if (!SIZES[size]) {
			throw 'Attribute pointer `size` parameter is invalid, must be one of ' + JSON.stringify(Object.keys(SIZES));
		}
		// check type
		if (!TYPES[type]) {
			throw 'Attribute pointer `type` parameter is invalid, must be one of ' + JSON.stringify(Object.keys(TYPES));
		}
		pointers.set(index, {
			size: size,
			type: type,
			byteOffset: byteOffset !== undefined ? byteOffset : DEFAULT_BYTE_OFFSET
		});
	});
	return pointers;
}

/**
 * A vertex buffer object.
 */

var VertexBuffer = function () {

	/**
  * Instantiates an VertexBuffer object.
  *
  * @param {WebGLBuffer|VertexPackage|ArrayBuffer|Array|Number} arg - The buffer or length of the buffer.
  * @param {Object} attributePointers - The array pointer map, or in the case of a vertex package arg, the options.
  * @param {Object} options - The rendering options.
  * @param {string} options.mode - The draw mode / primitive type.
  * @param {string} options.indexOffset - The index offset into the drawn buffer.
  * @param {string} options.count - The number of indices to draw.
  */
	function VertexBuffer(arg) {
		var attributePointers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		_classCallCheck(this, VertexBuffer);

		this.gl = WebGLContext.get();
		this.buffer = null;
		this.mode = MODES[options.mode] ? options.mode : DEFAULT_MODE;
		this.count = options.count !== undefined ? options.count : DEFAULT_COUNT;
		this.indexOffset = options.indexOffset !== undefined ? options.indexOffset : DEFAULT_INDEX_OFFSET;
		// first, set the attribute pointers
		this.pointers = getAttributePointers(attributePointers);
		// set the byte stride
		this.byteStride = getStride(this.pointers);
		// then buffer the data
		if (arg) {
			if (arg instanceof WebGLBuffer) {
				// WebGLBuffer argument
				this.buffer = arg;
			} else {
				// Array or ArrayBuffer or number argument
				this.bufferData(arg);
			}
		}
	}

	/**
  * Upload vertex data to the GPU.
  *
  * @param {Array|ArrayBuffer|ArrayBufferView|number} arg - The array of data to buffer, or size of the buffer in bytes.
  *
  * @returns {VertexBuffer} The vertex buffer object, for chaining.
  */


	_createClass(VertexBuffer, [{
		key: 'bufferData',
		value: function bufferData(arg) {
			var gl = this.gl;
			// ensure argument is valid
			if (Array.isArray(arg)) {
				// cast array into Float32Array
				arg = new Float32Array(arg);
			} else if (!(arg instanceof ArrayBuffer) && !ArrayBuffer.isView(arg) && !Number.isInteger(arg)) {
				// if not arraybuffer or a numeric size
				throw 'Argument must be of type `Array`, `ArrayBuffer`, `ArrayBufferView`, or `Number`';
			}
			// create buffer if it doesn't exist already
			if (!this.buffer) {
				this.buffer = gl.createBuffer();
			}
			// buffer the data
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, arg, gl.STATIC_DRAW);
		}

		/**
   * Upload partial vertex data to the GPU.
   *
   * @param {Array|ArrayBuffer} array - The array of data to buffer.
   * @param {number} byteOffset - The byte offset at which to buffer.
   *
   * @returns {VertexBuffer} The vertex buffer object, for chaining.
   */

	}, {
		key: 'bufferSubData',
		value: function bufferSubData(array) {
			var byteOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_BYTE_OFFSET;

			var gl = this.gl;
			// ensure the buffer exists
			if (!this.buffer) {
				throw 'Buffer has not yet been allocated, allocate with `bufferData`';
			}
			// ensure argument is valid
			if (Array.isArray(array)) {
				array = new Float32Array(array);
			} else if (!(array instanceof ArrayBuffer) && !ArrayBuffer.isView(array)) {
				throw 'Argument must be of type `Array`, `ArrayBuffer`, or `ArrayBufferView`';
			}
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			gl.bufferSubData(gl.ARRAY_BUFFER, byteOffset, array);
			return this;
		}

		/**
   * Binds the vertex buffer object.
   *
   * @returns {VertexBuffer} - Returns the vertex buffer object for chaining.
   */

	}, {
		key: 'bind',
		value: function bind() {
			var _this = this;

			var gl = this.gl;
			// bind buffer
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			// for each attribute pointer
			this.pointers.forEach(function (pointer, index) {
				// set attribute pointer
				gl.vertexAttribPointer(index, pointer.size, gl[pointer.type], false, _this.byteStride, pointer.byteOffset);
				// enable attribute index
				gl.enableVertexAttribArray(index);
			});
			return this;
		}

		/**
   * Unbinds the vertex buffer object.
   *
   * @returns {VertexBuffer} The vertex buffer object, for chaining.
   */

	}, {
		key: 'unbind',
		value: function unbind() {
			var gl = this.gl;
			// unbind buffer
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			this.pointers.forEach(function (pointer, index) {
				// disable attribute index
				gl.disableVertexAttribArray(index);
			});
			return this;
		}

		/**
   * Execute the draw command for the bound buffer.
   *
   * @param {Object} options - The options to pass to 'drawArrays'. Optional.
   * @param {string} options.mode - The draw mode / primitive type.
   * @param {string} options.indexOffset - The index offset into the drawn buffer.
   * @param {string} options.count - The number of indices to draw.
   *
   * @returns {VertexBuffer} The vertex buffer object, for chaining.
   */

	}, {
		key: 'draw',
		value: function draw() {
			var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var gl = this.gl;
			var mode = gl[options.mode || this.mode];
			var indexOffset = options.indexOffset !== undefined ? options.indexOffset : this.indexOffset;
			var count = options.count !== undefined ? options.count : this.count;
			if (count === 0) {
				throw 'Attempting to draw with a count of 0';
			}
			// draw elements
			gl.drawArrays(mode, indexOffset, count);
			return this;
		}
	}]);

	return VertexBuffer;
}();

module.exports = VertexBuffer;

},{"./WebGLContext":60}],58:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var COMPONENT_TYPE = 'FLOAT';
var BYTES_PER_COMPONENT = 4;

/**
 * Removes invalid attribute arguments. A valid argument must be an Array of length > 0 key by a string representing an int.
 *
 * @private
 *
 * @param {Object} attributes - The map of vertex attributes.
 *
 * @returns {Array} The valid array of arguments.
 */
function parseAttributeMap(attributes) {
	var goodAttributes = [];
	Object.keys(attributes).forEach(function (key) {
		var index = parseFloat(key);
		// check that key is an valid integer
		if (!Number.isInteger(index) || index < 0) {
			throw 'Attribute index `' + key + '` does not represent a valid integer';
		}
		var vertices = attributes[key];
		// ensure attribute is valid
		if (Array.isArray(vertices) && vertices.length > 0) {
			// add attribute data and index
			goodAttributes.push({
				index: index,
				data: vertices
			});
		} else {
			throw 'Error parsing attribute of index `' + index + '`';
		}
	});
	// sort attributes ascending by index
	goodAttributes.sort(function (a, b) {
		return a.index - b.index;
	});
	return goodAttributes;
}

/**
 * Returns a component's byte size.
 *
 * @private
 *
 * @param {Object|Array} component - The component to measure.
 *
 * @returns {number} The byte size of the component.
 */
function getComponentSize(component) {
	// check if array
	if (Array.isArray(component)) {
		return component.length;
	}
	// check if vector
	if (component.x !== undefined) {
		// 1 component vector
		if (component.y !== undefined) {
			// 2 component vector
			if (component.z !== undefined) {
				// 3 component vector
				if (component.w !== undefined) {
					// 4 component vector
					return 4;
				}
				return 3;
			}
			return 2;
		}
		return 1;
	}
	// single component
	return 1;
}

/**
 * Calculates the type, size, and offset for each attribute in the attribute
 * array along with the length and stride of the package.
 *
 * @private
 *
 * @param {VertexPackage} vertexPackage - The VertexPackage object.
 * @param {Array} attributes - The array of vertex attributes.
 */
function setPointersAndStride(vertexPackage, attributes) {
	var shortestArray = Number.MAX_VALUE;
	var offset = 0;
	// for each attribute
	attributes.forEach(function (vertices) {
		// set size to number of components in the attribute
		var size = getComponentSize(vertices.data[0]);
		// length of the package will be the shortest attribute array length
		shortestArray = Math.min(shortestArray, vertices.data.length);
		// store pointer under index
		vertexPackage.pointers[vertices.index] = {
			type: COMPONENT_TYPE,
			size: size,
			byteOffset: offset * BYTES_PER_COMPONENT
		};
		// accumulate attribute offset
		offset += size;
	});
	// set stride to total offset
	vertexPackage.stride = offset; // not in bytes
	// set length of package to the shortest attribute array length
	vertexPackage.length = shortestArray;
}

/**
 * Fill the arraybuffer with a single component attribute.
 *
 * @private
 *
 * @param {Float32Array} buffer - The arraybuffer to fill.
 * @param {Array} vertices - The vertex attribute array to copy from.
 * @param {number} length - The length of the buffer to copy from.
 * @param {number} offset - The offset to the attribute, not in bytes.
 * @param {number} stride - The stride of the buffer, not in bytes.
 */
function set1ComponentAttr(buffer, vertices, length, offset, stride) {
	for (var i = 0; i < length; i++) {
		var vertex = vertices[i];
		// get the index in the buffer to the particular vertex
		var j = offset + stride * i;
		if (vertex.x !== undefined) {
			buffer[j] = vertex.x;
		} else if (vertex[0] !== undefined) {
			buffer[j] = vertex[0];
		} else {
			buffer[j] = vertex;
		}
	}
}

/**
 * Fill the arraybuffer with a double component attribute.
 *
 * @private
 *
 * @param {Float32Array} buffer - The arraybuffer to fill.
 * @param {Array} vertices - The vertex attribute array to copy from.
 * @param {number} length - The length of the buffer to copy from.
 * @param {number} offset - The offset to the attribute, not in bytes.
 * @param {number} stride - The stride of the buffer, not in bytes.
 */
function set2ComponentAttr(buffer, vertices, length, offset, stride) {
	for (var i = 0; i < length; i++) {
		var vertex = vertices[i];
		// get the index in the buffer to the particular vertex
		var j = offset + stride * i;
		buffer[j] = vertex.x !== undefined ? vertex.x : vertex[0];
		buffer[j + 1] = vertex.y !== undefined ? vertex.y : vertex[1];
	}
}

/**
 * Fill the arraybuffer with a triple component attribute.
 *
 * @private
 *
 * @param {Float32Array} buffer - The arraybuffer to fill.
 * @param {Array} vertices - The vertex attribute array to copy from.
 * @param {number} length - The length of the buffer to copy from.
 * @param {number} offset - The offset to the attribute, not in bytes.
 * @param {number} stride - The stride of the buffer, not in bytes.
 */
function set3ComponentAttr(buffer, vertices, length, offset, stride) {
	for (var i = 0; i < length; i++) {
		var vertex = vertices[i];
		// get the index in the buffer to the particular vertex
		var j = offset + stride * i;
		buffer[j] = vertex.x !== undefined ? vertex.x : vertex[0];
		buffer[j + 1] = vertex.y !== undefined ? vertex.y : vertex[1];
		buffer[j + 2] = vertex.z !== undefined ? vertex.z : vertex[2];
	}
}

/**
 * Fill the arraybuffer with a quadruple component attribute.
 *
 * @private
 *
 * @param {Float32Array} buffer - The arraybuffer to fill.
 * @param {Array} vertices - The vertex attribute array to copy from.
 * @param {number} length - The length of the buffer to copy from.
 * @param {number} offset - The offset to the attribute, not in bytes.
 * @param {number} stride - The stride of the buffer, not in bytes.
 */
function set4ComponentAttr(buffer, vertices, length, offset, stride) {
	for (var i = 0; i < length; i++) {
		var vertex = vertices[i];
		// get the index in the buffer to the particular vertex
		var j = offset + stride * i;
		buffer[j] = vertex.x !== undefined ? vertex.x : vertex[0];
		buffer[j + 1] = vertex.y !== undefined ? vertex.y : vertex[1];
		buffer[j + 2] = vertex.z !== undefined ? vertex.z : vertex[2];
		buffer[j + 3] = vertex.w !== undefined ? vertex.w : vertex[3];
	}
}

/**
 * A vertex package to assist in interleaving vertex data and building the
 * associated vertex attribute pointers.
 */

var VertexPackage = function () {

	/**
  * Instantiates a VertexPackage object.
   *
  * @param {Object} attributes - The attributes to interleave keyed by index.
  */
	function VertexPackage(attributes) {
		_classCallCheck(this, VertexPackage);

		this.stride = 0;
		this.length = 0;
		this.buffer = null;
		this.pointers = {};
		if (attributes) {
			this.set(attributes);
		}
	}

	/**
  * Set the data to be interleaved inside the package. This clears any
  * previously existing data.
  *
  * @param {Object} attributes - The attributes to interleaved, keyed by index.
  *
  * @returns {VertexPackage} The vertex package object, for chaining.
  */


	_createClass(VertexPackage, [{
		key: 'set',
		value: function set(attributes) {
			// remove bad attributes
			attributes = parseAttributeMap(attributes);
			// set attribute pointers and stride
			setPointersAndStride(this, attributes);
			// set size of data vector
			var length = this.length;
			var stride = this.stride; // not in bytes
			var pointers = this.pointers;
			var buffer = this.buffer = new Float32Array(length * stride);
			// for each vertex attribute array
			attributes.forEach(function (vertices) {
				// get the pointer
				var pointer = pointers[vertices.index];
				// get the pointers offset
				var offset = pointer.byteOffset / BYTES_PER_COMPONENT;
				// copy vertex data into arraybuffer
				switch (pointer.size) {
					case 2:
						set2ComponentAttr(buffer, vertices.data, length, offset, stride);
						break;
					case 3:
						set3ComponentAttr(buffer, vertices.data, length, offset, stride);
						break;
					case 4:
						set4ComponentAttr(buffer, vertices.data, length, offset, stride);
						break;
					default:
						set1ComponentAttr(buffer, vertices.data, length, offset, stride);
						break;
				}
			});
			return this;
		}
	}]);

	return VertexPackage;
}();

module.exports = VertexPackage;

},{}],59:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebGLContext = require('./WebGLContext');

/**
 * Bind the viewport to the rendering context.
 *
 * @private
 *
 * @param {Viewport} viewport - The viewport object.
 * @param {number} x - The horizontal offset override.
 * @param {number} y - The vertical offset override.
 * @param {number} width - The width override.
 * @param {number} height - The height override.
 */
function set(viewport, x, y, width, height) {
	var gl = viewport.gl;
	x = x !== undefined ? x : viewport.x;
	y = y !== undefined ? y : viewport.y;
	width = width !== undefined ? width : viewport.width;
	height = height !== undefined ? height : viewport.height;
	gl.viewport(x, y, width, height);
}

/**
 * A viewport class for managing WebGL viewports.
 */

var Viewport = function () {

	/**
  * Instantiates a Viewport object.
  *
  * @param {Object} spec - The viewport specification object.
  * @param {number} spec.width - The width of the viewport.
  * @param {number} spec.height - The height of the viewport.
  */
	function Viewport() {
		var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Viewport);

		this.gl = WebGLContext.get();
		this.stack = [];
		// set size
		this.resize(spec.width || this.gl.canvas.width, spec.height || this.gl.canvas.height);
	}

	/**
  * Updates the viewports width and height. This resizes the underlying canvas element.
  *
  * @param {number} width - The width of the viewport.
  * @param {number} height - The height of the viewport.
  *
  * @returns {Viewport} The viewport object, for chaining.
  */


	_createClass(Viewport, [{
		key: 'resize',
		value: function resize() {
			var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
			var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			if (typeof width !== 'number' || width <= 0) {
				throw 'Provided `width` of `' + width + '` is invalid';
			}
			if (typeof height !== 'number' || height <= 0) {
				throw 'Provided `height` of `' + height + '` is invalid';
			}
			this.width = width;
			this.height = height;
			this.gl.canvas.width = width;
			this.gl.canvas.height = height;
			return this;
		}

		/**
   * Sets the viewport dimensions and position. The underlying canvas element
   * is not affected.
   *
   * @param {number} x - The horizontal offset override.
   * @param {number} y - The vertical offset override.
   * @param {number} width - The width override.
   * @param {number} height - The height override.
   *
   * @returns {Viewport} - The viewport object, for chaining.
   */

	}, {
		key: 'push',
		value: function push() {
			var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
			var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.width;
			var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.height;

			if (typeof x !== 'number') {
				throw 'Provided `x` of `' + x + '` is invalid';
			}
			if (typeof y !== 'number') {
				throw 'Provided `y` of `' + y + '` is invalid';
			}
			if (typeof width !== 'number' || width <= 0) {
				throw 'Provided `width` of `' + width + '` is invalid';
			}
			if (typeof height !== 'number' || height <= 0) {
				throw 'Provided `height` of `' + height + '` is invalid';
			}
			// push onto stack
			this.stack.push({
				x: x,
				y: y,
				width: width,
				height: height
			});
			// set viewport
			set(this, x, y, width, height);
			return this;
		}

		/**
   * Pops current the viewport object and sets the viewport beneath it.
   *
   * @returns {Viewport} The viewport object, for chaining.
   */

	}, {
		key: 'pop',
		value: function pop() {
			if (this.stack.length === 0) {
				throw 'Viewport stack is empty';
			}
			this.stack.pop();
			if (this.stack.length > 0) {
				var top = this.stack[this.stack.length - 1];
				set(this, top.x, top.y, top.width, top.height);
			} else {
				set(this);
			}
			return this;
		}
	}]);

	return Viewport;
}();

module.exports = Viewport;

},{"./WebGLContext":60}],60:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var EXTENSIONS = [
// ratified
'OES_texture_float', 'OES_texture_half_float', 'WEBGL_lose_context', 'OES_standard_derivatives', 'OES_vertex_array_object', 'WEBGL_debug_renderer_info', 'WEBGL_debug_shaders', 'WEBGL_compressed_texture_s3tc', 'WEBGL_depth_texture', 'OES_element_index_uint', 'EXT_texture_filter_anisotropic', 'EXT_frag_depth', 'WEBGL_draw_buffers', 'ANGLE_instanced_arrays', 'OES_texture_float_linear', 'OES_texture_half_float_linear', 'EXT_blend_minmax', 'EXT_shader_texture_lod',
// community
'WEBGL_compressed_texture_atc', 'WEBGL_compressed_texture_pvrtc', 'EXT_color_buffer_half_float', 'WEBGL_color_buffer_float', 'EXT_sRGB', 'WEBGL_compressed_texture_etc1', 'EXT_disjoint_timer_query', 'EXT_color_buffer_float'];

/**
 * All context wrappers.
 * @private
 */
var _contexts = new Map();

/**
 * The currently bound context.
 * @private
 */
var _boundContext = null;

/**
 * Returns an rfc4122 version 4 compliant UUID.
 *
 * @private
 *
 * @returns {string} - The UUID string.
 */
function getUUID() {
	var replace = function replace(c) {
		var r = Math.random() * 16 | 0;
		var v = c === 'x' ? r : r & 0x3 | 0x8;
		return v.toString(16);
	};
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, replace);
}

/**
 * Returns the id of the HTMLCanvasElement element. If there is no id, it
 * generates one and appends it.
 *
 * @private
 *
 * @param {HTMLCanvasElement} canvas - The Canvas object.
 *
 * @returns {string} The Canvas id string.
 */
function getId(canvas) {
	if (!canvas.id) {
		canvas.id = getUUID();
	}
	return canvas.id;
}

/**
 * Returns a Canvas element object from either an existing object, or
 * identification string.
 *
 * @private
 *
 * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas id or selector string.
 *
 * @returns {HTMLCanvasElement} The Canvas element object.
 */
function getCanvas(arg) {
	if (arg instanceof HTMLCanvasElement) {
		return arg;
	} else if (typeof arg === 'string') {
		return document.getElementById(arg) || document.querySelector(arg);
	}
	return null;
}

/**
 * Returns a wrapped WebGLRenderingContext from the context itself.
 *
 * @private
 *
 * @param {WebGLRenderingContext} context - The WebGLRenderingContext.
 *
 * @returns {Object} The context wrapper.
 */
function getWrapperFromContext(context) {
	var found = null;
	_contexts.forEach(function (wrapper) {
		if (context === wrapper.gl) {
			found = wrapper;
		}
	});
	return found;
}

/**
 * Attempts to retrieve a wrapped WebGLRenderingContext.
 *
 * @private
 *
 * @param {HTMLCanvasElement} arg - The Canvas element object to create the context under.
 *
 * @returns {Object} The context wrapper.
 */
function getContextWrapper(arg) {
	if (arg === undefined) {
		if (_boundContext) {
			// return last bound context
			return _boundContext;
		}
	} else if (arg instanceof WebGLRenderingContext) {
		return getWrapperFromContext(arg);
	} else {
		var canvas = getCanvas(arg);
		if (canvas) {
			return _contexts.get(getId(canvas));
		}
	}
	// no bound context or argument
	return null;
}

/**
 * Attempts to load all known extensions for a provided WebGLRenderingContext.
 * Stores the results in the context wrapper for later queries.
 *
 * @private
 *
 * @param {Object} contextWrapper - The context wrapper.
 */
function loadExtensions(contextWrapper) {
	var gl = contextWrapper.gl;
	EXTENSIONS.forEach(function (id) {
		contextWrapper.extensions.set(id, gl.getExtension(id));
	});
}

/**
 * Attempts to create a WebGLRenderingContext and load all extensions.
 *
 * @private
 *
 * @param {HTMLCanvasElement} canvas - The Canvas element object to create the context under.
 * @param {Object} options - Parameters to the webgl context, only used during instantiation. Optional.
 *
 * @returns {Object} The context wrapper.
 */
function createContextWrapper(canvas, options) {
	var gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
	if (!gl) {
		throw 'Unable to create a WebGLRenderingContext, please ensure your browser supports WebGL';
	}
	// wrap context
	var contextWrapper = {
		id: getId(canvas),
		gl: gl,
		extensions: new Map()
	};
	// load WebGL extensions
	loadExtensions(contextWrapper);
	// add context wrapper to map
	_contexts.set(getId(canvas), contextWrapper);
	// bind the context
	_boundContext = contextWrapper;
	return contextWrapper;
}

module.exports = {

	/**
  * Retrieves an existing WebGL context associated with the provided argument
  * and binds it. While bound, the active context will be used implicitly by
  * any instantiated `esper` constructs.
  *
  * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string.
  *
  * @returns {WebGLContext} The namespace, used for chaining.
  */
	bind: function bind(arg) {
		var wrapper = getContextWrapper(arg);
		if (wrapper) {
			_boundContext = wrapper;
			return this;
		}
		throw 'No context exists for provided argument \'' + arg + '\'';
	},

	/**
  * Retrieves an existing WebGL context associated with the provided
  * argument. If no context exists, one is created. During creation attempts
  * to load all extensions found at:
  *     https://www.khronos.org/registry/webgl/extensions/.
  *
  * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
  * @param {Object} options - Parameters to the webgl context, only used during instantiation. Optional.
  *
  * @returns {WebGLRenderingContext} The WebGLRenderingContext object.
  */
	get: function get(arg, options) {
		var wrapper = getContextWrapper(arg);
		if (wrapper) {
			// return the native WebGLRenderingContext
			return wrapper.gl;
		}
		// get canvas element
		var canvas = getCanvas(arg);
		// try to find or create context
		if (!canvas) {
			throw 'No context is currently bound or could be associated with provided argument of type ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
		}
		// create context
		return createContextWrapper(canvas, options).gl;
	},

	/**
  * Removes an existing WebGL context object for the provided or currently
  * bound context object.
  *
  * @param {WebGLRenderingContext|HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
  *
  * @returns {WebGLRenderingContext} The WebGLRenderingContext object.
  */
	remove: function remove(arg) {
		var wrapper = getContextWrapper(arg);
		if (wrapper) {
			// delete the context
			_contexts.delete(wrapper.id);
			// remove if currently bound
			if (wrapper === _boundContext) {
				_boundContext = null;
			}
		} else {
			throw 'No context is currently bound or could be associated with provided argument of type ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
		}
	},

	/**
  * Returns an array of all supported extensions for the provided or
  * currently bound context object.
  *
  * @param {WebGLRenderingContext|HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
  *
  * @returns {Array} All supported extensions.
  */
	supportedExtensions: function supportedExtensions(arg) {
		var wrapper = getContextWrapper(arg);
		if (wrapper) {
			var extensions = wrapper.extensions;
			var supported = [];
			extensions.forEach(function (extension, key) {
				if (extension) {
					supported.push(key);
				}
			});
			return supported;
		}
		throw 'No context is currently bound or could be associated with provided argument of type ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
	},

	/**
  * Returns an array of all unsupported extensions for the provided or
  * currently bound context object.
  *
  * @param {WebGLRenderingContext|HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
  *
  * @returns {Array} All unsupported extensions.
  */
	unsupportedExtensions: function unsupportedExtensions(arg) {
		var wrapper = getContextWrapper(arg);
		if (wrapper) {
			var extensions = wrapper.extensions;
			var unsupported = [];
			extensions.forEach(function (extension, key) {
				if (!extension) {
					unsupported.push(key);
				}
			});
			return unsupported;
		}
		throw 'No context is currently bound or could be associated with provided argument of type ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
	},

	/**
  * Checks if an extension has been successfully loaded for the provided or
  * currently bound context object.
  *
  * @param {WebGLRenderingContext|HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
  * @param {string} extension - The extension name.
  *
  * @returns {boolean} Whether or not the provided extension has been loaded successfully.
  */
	checkExtension: function checkExtension(arg, extension) {
		if (!extension) {
			// shift parameters if no canvas arg is provided
			extension = arg;
			arg = undefined;
		}
		var wrapper = getContextWrapper(arg);
		if (wrapper) {
			var extensions = wrapper.extensions;
			return extensions.get(extension) ? true : false;
		}
		throw 'No context is currently bound or could be associated with provided argument of type ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
	},

	/**
  * Returns an extension if it has been successfully loaded for the provided
  * or currently bound context object.
  *
  * @param {WebGLRenderingContext|HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
  * @param {string} extension - The extension name.
  *
  * @returns {boolean} Whether or not the provided extension has been loaded successfully.
  */
	getExtension: function getExtension(arg, extension) {
		if (!extension) {
			// shift parameters if no canvas arg is provided
			extension = arg;
			arg = undefined;
		}
		var wrapper = getContextWrapper(arg);
		if (wrapper) {
			var extensions = wrapper.extensions;
			return extensions.get(extension) || null;
		}
		throw 'No context is currently bound or could be associated with provided argument of type ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
	}
};

},{}],61:[function(require,module,exports){
'use strict';

module.exports = {
	ColorTexture2D: require('./core/ColorTexture2D'),
	DepthTexture2D: require('./core/DepthTexture2D'),
	IndexBuffer: require('./core/IndexBuffer'),
	Renderable: require('./core/Renderable'),
	RenderTarget: require('./core/RenderTarget'),
	Shader: require('./core/Shader'),
	Texture2D: require('./core/Texture2D'),
	TextureCubeMap: require('./core/TextureCubeMap'),
	VertexBuffer: require('./core/VertexBuffer'),
	VertexPackage: require('./core/VertexPackage'),
	Viewport: require('./core/Viewport'),
	WebGLContext: require('./core/WebGLContext')
};

},{"./core/ColorTexture2D":47,"./core/DepthTexture2D":48,"./core/IndexBuffer":49,"./core/RenderTarget":50,"./core/Renderable":51,"./core/Shader":52,"./core/Texture2D":55,"./core/TextureCubeMap":56,"./core/VertexBuffer":57,"./core/VertexPackage":58,"./core/Viewport":59,"./core/WebGLContext":60}],62:[function(require,module,exports){
'use strict';

module.exports = {

	/**
  * Sends an GET request create an Image object.
  *
  * @param {Object} options - The XHR options.
  * @param {string} options.url - The URL for the resource.
  * @param {boolean} options.crossOrigin - Enable cross-origin request.
  * @param {Function} options.success - The success callback function.
  * @param {Function} options.error - The error callback function.
  */
	load: function load() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		var image = new Image();
		image.onload = function () {
			if (options.success) {
				options.success(image);
			}
		};
		image.onerror = function (event) {
			if (options.error) {
				var err = 'Unable to load image from URL: `' + event.path[0].currentSrc + '`';
				options.error(err);
			}
		};
		image.crossOrigin = options.crossOrigin ? 'anonymous' : undefined;
		image.src = options.url;
	}
};

},{}],63:[function(require,module,exports){
'use strict';

/**
 * Returns true if the argument is one of the WebGL `texImage2D` overridden
 * canvas types.
 *
 * @param {*} arg - The argument to test.
 *
 * @returns {bool} - Whether or not it is a canvas type.
 */

function isCanvasType(arg) {
  return arg instanceof ImageData || arg instanceof HTMLImageElement || arg instanceof HTMLCanvasElement || arg instanceof HTMLVideoElement;
};

/**
 * Returns true if the texture MUST be a power-of-two. Otherwise return false.
 *
 * @param {Object} spec - The texture specification object.
 *
 * @returns {bool} - Whether or not the texture must be a power of two.
 */
function mustBePowerOfTwo(spec) {
  // According to:
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL#Non_power-of-two_textures
  // N-POT textures cannot be used with mipmapping and they must not "REPEAT"
  return spec.mipMap || spec.wrapS === 'REPEAT' || spec.wrapS === 'MIRRORED_REPEAT' || spec.wrapT === 'REPEAT' || spec.wrapT === 'MIRRORED_REPEAT';
};

/**
 * Returns true if the provided integer is a power of two.
 *
 * @param {number} num - The number to test.
 *
 * @returns {boolean} - Whether or not the number is a power of two.
 */
function isPowerOfTwo(num) {
  return num !== 0 ? (num & num - 1) === 0 : false;
};

/**
 * Returns the next highest power of two for a number.
 *
 * Ex.
 *
 *	 200 -> 256
 *	 256 -> 256
 *	 257 -> 512
 *
 * @param {number} num - The number to modify.
 *
 * @returns {number} - Next highest power of two.
 */
function nextHighestPowerOfTwo(num) {
  if (num !== 0) {
    num = num - 1;
  }
  num |= num >> 1;
  num |= num >> 2;
  num |= num >> 4;
  num |= num >> 8;
  num |= num >> 16;
  return num + 1;
};

/**
 * If the texture must be a POT, resizes and returns the image.
 *
 * @private
 *
 * @param {Object} spec - The texture specification object.
 * @param {HTMLImageElement} img - The image object.
 *
 * @returns {HTMLImageElement|HTMLCanvasElement} - The original image, or the resized canvas element.
 */
function resizeCanvas(spec, img) {
  if (!mustBePowerOfTwo(spec) || isPowerOfTwo(img.width) && isPowerOfTwo(img.height)) {
    return img;
  }
  // create an empty canvas element
  var canvas = document.createElement('canvas');
  canvas.width = nextHighestPowerOfTwo(img.width);
  canvas.height = nextHighestPowerOfTwo(img.height);
  // copy the image contents to the canvas
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
  return canvas;
};

module.exports = {
  isCanvasType: isCanvasType,
  mustBePowerOfTwo: mustBePowerOfTwo,
  isPowerOfTwo: isPowerOfTwo,
  nextHighestPowerOfTwo: nextHighestPowerOfTwo,
  resizeCanvas: resizeCanvas
};

},{}],64:[function(require,module,exports){
'use strict';

module.exports = {

	/**
  * Sends an XMLHttpRequest GET request to the supplied url.
  *
  * @param {Object} options - The XHR options.
  * @param {string} options.url - The URL for the resource.
  * @param {boolean} options.crossOrigin - Enable cross-origin request.
  * @param {Function} options.success - The success callback function.
  * @param {Function} options.error - The error callback function.
  * @param {Function} options.responseType - The responseType of the XHR.
  */
	load: function load(options) {
		var request = new XMLHttpRequest();
		request.open('GET', options.url, true);
		request.responseType = options.responseType;
		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				if (request.status === 200) {
					if (options.success) {
						options.success(request.response);
					}
				} else {
					if (options.error) {
						options.error('GET ' + request.responseURL + ' ' + request.status + ' (' + request.statusText + ')');
					}
				}
			}
		};
		request.withCredentials = options.crossOrigin ? true : false;
		request.send();
	}
};

},{}]},{},[61])(61)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXN5bmMvYXN5bmNpZnkuanMiLCJub2RlX21vZHVsZXMvYXN5bmMvZWFjaE9mLmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jL2VhY2hPZkxpbWl0LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jL2ludGVybmFsL2JyZWFrTG9vcC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy9pbnRlcm5hbC9kb0xpbWl0LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jL2ludGVybmFsL2VhY2hPZkxpbWl0LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jL2ludGVybmFsL2dldEl0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jL2ludGVybmFsL2luaXRpYWxQYXJhbXMuanMiLCJub2RlX21vZHVsZXMvYXN5bmMvaW50ZXJuYWwvaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYXN5bmMvaW50ZXJuYWwvb25jZS5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy9pbnRlcm5hbC9vbmx5T25jZS5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy9pbnRlcm5hbC9wYXJhbGxlbC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy9pbnRlcm5hbC9zZXRJbW1lZGlhdGUuanMiLCJub2RlX21vZHVsZXMvYXN5bmMvaW50ZXJuYWwvc2xpY2UuanMiLCJub2RlX21vZHVsZXMvYXN5bmMvaW50ZXJuYWwvd3JhcEFzeW5jLmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jL3BhcmFsbGVsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fU3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlMaWtlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNUeXBlZEFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVGltZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVW5hcnkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0UmF3VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNJbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25vZGVVdGlsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0J1ZmZlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNMZW5ndGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzVHlwZWRBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gva2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvbm9vcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkZhbHNlLmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsInNyYy9jb3JlL0NvbG9yVGV4dHVyZTJELmpzIiwic3JjL2NvcmUvRGVwdGhUZXh0dXJlMkQuanMiLCJzcmMvY29yZS9JbmRleEJ1ZmZlci5qcyIsInNyYy9jb3JlL1JlbmRlclRhcmdldC5qcyIsInNyYy9jb3JlL1JlbmRlcmFibGUuanMiLCJzcmMvY29yZS9TaGFkZXIuanMiLCJzcmMvY29yZS9TaGFkZXJQYXJzZXIuanMiLCJzcmMvY29yZS9TaGFkZXJQcmVwcm9jZXNzb3IuanMiLCJzcmMvY29yZS9UZXh0dXJlMkQuanMiLCJzcmMvY29yZS9UZXh0dXJlQ3ViZU1hcC5qcyIsInNyYy9jb3JlL1ZlcnRleEJ1ZmZlci5qcyIsInNyYy9jb3JlL1ZlcnRleFBhY2thZ2UuanMiLCJzcmMvY29yZS9WaWV3cG9ydC5qcyIsInNyYy9jb3JlL1dlYkdMQ29udGV4dC5qcyIsInNyYy9leHBvcnRzLmpzIiwic3JjL3V0aWwvSW1hZ2VMb2FkZXIuanMiLCJzcmMvdXRpbC9VdGlsLmpzIiwic3JjL3V0aWwvWEhSTG9hZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7Ozs7Ozs7O0FBRUEsSUFBTSxZQUFZLFFBQVEsYUFBUixDQUFsQjtBQUNBLElBQU0sY0FBYyxRQUFRLHFCQUFSLENBQXBCO0FBQ0EsSUFBTSxPQUFPLFFBQVEsY0FBUixDQUFiOztBQUVBLElBQU0sY0FBYztBQUNuQixVQUFTLElBRFU7QUFFbkIsU0FBUTtB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QixnQkFGRjtBQUdoQixnQkFBYyxZQUhFO0FBSWhCLHlCQUF1QixxQkFKUDtBQUtoQixnQkFBYztBQUxFLENBQWpCOzs7QUNoR0E7O0FBRUEsT0FBTyxPQUFQLEdBQWlCOztBQUVoQjs7Ozs7Ozs7OztBQVVBLE9BQU0sY0FBVSxPQUFWLEVBQW1CO0FBQ3hCLE1BQU0sVUFBVSxJQUFJLGNBQUosRUFBaEI7QUFDQSxVQUFRLElBQVIsQ0FBYSxLQUFiLEVBQW9CLFFBQVEsR0FBNUIsRUFBaUMsSUFBakM7QUFDQSxVQUFRLFlBQVIsR0FBdUIsUUFBUSxZQUEvQjtBQUNBLFVBQVEsa0JBQVIsR0FBNkIsWUFBTTtBQUNsQyxPQUFJLFFBQVEsVUFBUixLQUF1QixDQUEzQixFQUE4QjtBQUM3QixRQUFJLFFBQVEsTUFBUixLQUFtQixHQUF2QixFQUE0QjtBQUMzQixTQUFJLFFBQVEsT0FBWixFQUFxQjtBQUNwQixjQUFRLE9BQVIsQ0FBZ0IsUUFBUSxRQUF4QjtBQUNBO0FBQ0QsS0FKRCxNQUlPO0FBQ04sU0FBSSxRQUFRLEtBQVosRUFBbUI7QUFDbEIsY0FBUSxLQUFSLFVBQXFCLFFBQVEsV0FBN0IsU0FBNEMsUUFBUSxNQUFwRCxVQUErRCxRQUFRLFVBQXZFO0FBQ0E7QUFDRDtBQUNEO0FBQ0QsR0FaRDtBQWFBLFVBQVEsZUFBUixHQUEwQixRQUFRLFdBQVIsR0FBc0IsSUFBdEIsR0FBNkIsS0FBdkQ7QUFDQSxVQUFRLElBQVI7QUFDQTtBQS9CZSxDQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGFzeW5jaWZ5O1xuXG52YXIgX2lzT2JqZWN0ID0gcmVxdWlyZSgnbG9kYXNoL2lzT2JqZWN0Jyk7XG5cbnZhciBfaXNPYmplY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNPYmplY3QpO1xuXG52YXIgX2luaXRpYWxQYXJhbXMgPSByZXF1aXJlKCcuL2ludGVybmFsL2luaXRpYWxQYXJhbXMnKTtcblxudmFyIF9pbml0aWFsUGFyYW1zMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luaXRpYWxQYXJhbXMpO1xuXG52YXIgX3NldEltbWVkaWF0ZSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvc2V0SW1tZWRpYXRlJyk7XG5cbnZhciBfc2V0SW1tZWRpYXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NldEltbWVkaWF0ZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogVGFrZSBhIHN5bmMgZnVuY3Rpb24gYW5kIG1ha2UgaXQgYXN5bmMsIHBhc3NpbmcgaXRzIHJldHVybiB2YWx1ZSB0byBhXG4gKiBjYWxsYmFjay4gVGhpcyBpcyB1c2VmdWwgZm9yIHBsdWdnaW5nIHN5bmMgZnVuY3Rpb25zIGludG8gYSB3YXRlcmZhbGwsXG4gKiBzZXJpZXMsIG9yIG90aGVyIGFzeW5jIGZ1bmN0aW9ucy4gQW55IGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIGdlbmVyYXRlZFxuICogZnVuY3Rpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIHdyYXBwZWQgZnVuY3Rpb24gKGV4Y2VwdCBmb3IgdGhlIGZpbmFsXG4gKiBjYWxsYmFjayBhcmd1bWVudCkuIEVycm9ycyB0aHJvd24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrLlxuICpcbiAqIElmIHRoZSBmdW5jdGlvbiBwYXNzZWQgdG8gYGFzeW5jaWZ5YCByZXR1cm5zIGEgUHJvbWlzZSwgdGhhdCBwcm9taXNlcydzXG4gKiByZXNvbHZlZC9yZWplY3RlZCBzdGF0ZSB3aWxsIGJlIHVzZWQgdG8gY2FsbCB0aGUgY2FsbGJhY2ssIHJhdGhlciB0aGFuIHNpbXBseVxuICogdGhlIHN5bmNocm9ub3VzIHJldHVybiB2YWx1ZS5cbiAqXG4gKiBUaGlzIGFsc28gbWVhbnMgeW91IGNhbiBhc3luY2lmeSBFUzIwMTcgYGFzeW5jYCBmdW5jdGlvbnMuXG4gKlxuICogQG5hbWUgYXN5bmNpZnlcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBtb2R1bGU6VXRpbHNcbiAqIEBtZXRob2RcbiAqIEBhbGlhcyB3cmFwU3luY1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgLSBUaGUgc3luY2hyb25vdXMgZnVuY3Rpb24sIG9yIFByb21pc2UtcmV0dXJuaW5nXG4gKiBmdW5jdGlvbiB0byBjb252ZXJ0IHRvIGFuIHtAbGluayBBc3luY0Z1bmN0aW9ufS5cbiAqIEByZXR1cm5zIHtBc3luY0Z1bmN0aW9ufSBBbiBhc3luY2hyb25vdXMgd3JhcHBlciBvZiB0aGUgYGZ1bmNgLiBUbyBiZVxuICogaW52b2tlZCB3aXRoIGAoYXJncy4uLiwgY2FsbGJhY2spYC5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gcGFzc2luZyBhIHJlZ3VsYXIgc3luY2hyb25vdXMgZnVuY3Rpb25cbiAqIGFzeW5jLndhdGVyZmFsbChbXG4gKiAgICAgYXN5bmMuYXBwbHkoZnMucmVhZEZpbGUsIGZpbGVuYW1lLCBcInV0ZjhcIiksXG4gKiAgICAgYXN5bmMuYXN5bmNpZnkoSlNPTi5wYXJzZSksXG4gKiAgICAgZnVuY3Rpb24gKGRhdGEsIG5leHQpIHtcbiAqICAgICAgICAgLy8gZGF0YSBpcyB0aGUgcmVzdWx0IG9mIHBhcnNpbmcgdGhlIHRleHQuXG4gKiAgICAgICAgIC8vIElmIHRoZXJlIHdhcyBhIHBhcnNpbmcgZXJyb3IsIGl0IHdvdWxkIGhhdmUgYmVlbiBjYXVnaHQuXG4gKiAgICAgfVxuICogXSwgY2FsbGJhY2spO1xuICpcbiAqIC8vIHBhc3NpbmcgYSBmdW5jdGlvbiByZXR1cm5pbmcgYSBwcm9taXNlXG4gKiBhc3luYy53YXRlcmZhbGwoW1xuICogICAgIGFzeW5jLmFwcGx5KGZzLnJlYWRGaWxlLCBmaWxlbmFtZSwgXCJ1dGY4XCIpLFxuICogICAgIGFzeW5jLmFzeW5jaWZ5KGZ1bmN0aW9uIChjb250ZW50cykge1xuICogICAgICAgICByZXR1cm4gZGIubW9kZWwuY3JlYXRlKGNvbnRlbnRzKTtcbiAqICAgICB9KSxcbiAqICAgICBmdW5jdGlvbiAobW9kZWwsIG5leHQpIHtcbiAqICAgICAgICAgLy8gYG1vZGVsYCBpcyB0aGUgaW5zdGFudGlhdGVkIG1vZGVsIG9iamVjdC5cbiAqICAgICAgICAgLy8gSWYgdGhlcmUgd2FzIGFuIGVycm9yLCB0aGlzIGZ1bmN0aW9uIHdvdWxkIGJlIHNraXBwZWQuXG4gKiAgICAgfVxuICogXSwgY2FsbGJhY2spO1xuICpcbiAqIC8vIGVzMjAxNyBleGFtcGxlLCB0aG91Z2ggYGFzeW5jaWZ5YCBpcyBub3QgbmVlZGVkIGlmIHlvdXIgSlMgZW52aXJvbm1lbnRcbiAqIC8vIHN1cHBvcnRzIGFzeW5jIGZ1bmN0aW9ucyBvdXQgb2YgdGhlIGJveFxuICogdmFyIHEgPSBhc3luYy5xdWV1ZShhc3luYy5hc3luY2lmeShhc3luYyBmdW5jdGlvbihmaWxlKSB7XG4gKiAgICAgdmFyIGludGVybWVkaWF0ZVN0ZXAgPSBhd2FpdCBwcm9jZXNzRmlsZShmaWxlKTtcbiAqICAgICByZXR1cm4gYXdhaXQgc29tZVByb21pc2UoaW50ZXJtZWRpYXRlU3RlcClcbiAqIH0pKTtcbiAqXG4gKiBxLnB1c2goZmlsZXMpO1xuICovXG5mdW5jdGlvbiBhc3luY2lmeShmdW5jKSB7XG4gICAgcmV0dXJuICgwLCBfaW5pdGlhbFBhcmFtczIuZGVmYXVsdCkoZnVuY3Rpb24gKGFyZ3MsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgcmVzdWx0IGlzIFByb21pc2Ugb2JqZWN0XG4gICAgICAgIGlmICgoMCwgX2lzT2JqZWN0Mi5kZWZhdWx0KShyZXN1bHQpICYmIHR5cGVvZiByZXN1bHQudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmVzdWx0LnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaW52b2tlQ2FsbGJhY2soY2FsbGJhY2ssIG51bGwsIHZhbHVlKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpbnZva2VDYWxsYmFjayhjYWxsYmFjaywgZXJyLm1lc3NhZ2UgPyBlcnIgOiBuZXcgRXJyb3IoZXJyKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaW52b2tlQ2FsbGJhY2soY2FsbGJhY2ssIGVycm9yLCB2YWx1ZSkge1xuICAgIHRyeSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCB2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAoMCwgX3NldEltbWVkaWF0ZTIuZGVmYXVsdCkocmV0aHJvdywgZSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiByZXRocm93KGVycm9yKSB7XG4gICAgdGhyb3cgZXJyb3I7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGNvbGwsIGl0ZXJhdGVlLCBjYWxsYmFjaykge1xuICAgIHZhciBlYWNoT2ZJbXBsZW1lbnRhdGlvbiA9ICgwLCBfaXNBcnJheUxpa2UyLmRlZmF1bHQpKGNvbGwpID8gZWFjaE9mQXJyYXlMaWtlIDogZWFjaE9mR2VuZXJpYztcbiAgICBlYWNoT2ZJbXBsZW1lbnRhdGlvbihjb2xsLCAoMCwgX3dyYXBBc3luYzIuZGVmYXVsdCkoaXRlcmF0ZWUpLCBjYWxsYmFjayk7XG59O1xuXG52YXIgX2lzQXJyYXlMaWtlID0gcmVxdWlyZSgnbG9kYXNoL2lzQXJyYXlMaWtlJyk7XG5cbnZhciBfaXNBcnJheUxpa2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNBcnJheUxpa2UpO1xuXG52YXIgX2JyZWFrTG9vcCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvYnJlYWtMb29wJyk7XG5cbnZhciBfYnJlYWtMb29wMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2JyZWFrTG9vcCk7XG5cbnZhciBfZWFjaE9mTGltaXQgPSByZXF1aXJlKCcuL2VhY2hPZkxpbWl0Jyk7XG5cbnZhciBfZWFjaE9mTGltaXQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZWFjaE9mTGltaXQpO1xuXG52YXIgX2RvTGltaXQgPSByZXF1aXJlKCcuL2ludGVybmFsL2RvTGltaXQnKTtcblxudmFyIF9kb0xpbWl0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RvTGltaXQpO1xuXG52YXIgX25vb3AgPSByZXF1aXJlKCdsb2Rhc2gvbm9vcCcpO1xuXG52YXIgX25vb3AyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbm9vcCk7XG5cbnZhciBfb25jZSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvb25jZScpO1xuXG52YXIgX29uY2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb25jZSk7XG5cbnZhciBfb25seU9uY2UgPSByZXF1aXJlKCcuL2ludGVybmFsL29ubHlPbmNlJyk7XG5cbnZhciBfb25seU9uY2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb25seU9uY2UpO1xuXG52YXIgX3dyYXBBc3luYyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvd3JhcEFzeW5jJyk7XG5cbnZhciBfd3JhcEFzeW5jMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3dyYXBBc3luYyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8vIGVhY2hPZiBpbXBsZW1lbnRhdGlvbiBvcHRpbWl6ZWQgZm9yIGFycmF5LWxpa2VzXG5mdW5jdGlvbiBlYWNoT2ZBcnJheUxpa2UoY29sbCwgaXRlcmF0ZWUsIGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sgPSAoMCwgX29uY2UyLmRlZmF1bHQpKGNhbGxiYWNrIHx8IF9ub29wMi5kZWZhdWx0KTtcbiAgICB2YXIgaW5kZXggPSAwLFxuICAgICAgICBjb21wbGV0ZWQgPSAwLFxuICAgICAgICBsZW5ndGggPSBjb2xsLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGl0ZXJhdG9yQ2FsbGJhY2soZXJyLCB2YWx1ZSkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICB9IGVsc2UgaWYgKCsrY29tcGxldGVkID09PSBsZW5ndGggfHwgdmFsdWUgPT09IF9icmVha0xvb3AyLmRlZmF1bHQpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yICg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKGNvbGxbaW5kZXhdLCBpbmRleCwgKDAsIF9vbmx5T25jZTIuZGVmYXVsdCkoaXRlcmF0b3JDYWxsYmFjaykpO1xuICAgIH1cbn1cblxuLy8gYSBnZW5lcmljIHZlcnNpb24gb2YgZWFjaE9mIHdoaWNoIGNhbiBoYW5kbGUgYXJyYXksIG9iamVjdCwgYW5kIGl0ZXJhdG9yIGNhc2VzLlxudmFyIGVhY2hPZkdlbmVyaWMgPSAoMCwgX2RvTGltaXQyLmRlZmF1bHQpKF9lYWNoT2ZMaW1pdDIuZGVmYXVsdCwgSW5maW5pdHkpO1xuXG4vKipcbiAqIExpa2UgW2BlYWNoYF17QGxpbmsgbW9kdWxlOkNvbGxlY3Rpb25zLmVhY2h9LCBleGNlcHQgdGhhdCBpdCBwYXNzZXMgdGhlIGtleSAob3IgaW5kZXgpIGFzIHRoZSBzZWNvbmQgYXJndW1lbnRcbiAqIHRvIHRoZSBpdGVyYXRlZS5cbiAqXG4gKiBAbmFtZSBlYWNoT2ZcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBtb2R1bGU6Q29sbGVjdGlvbnNcbiAqIEBtZXRob2RcbiAqIEBhbGlhcyBmb3JFYWNoT2ZcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAc2VlIFthc3luYy5lYWNoXXtAbGluayBtb2R1bGU6Q29sbGVjdGlvbnMuZWFjaH1cbiAqIEBwYXJhbSB7QXJyYXl8SXRlcmFibGV8T2JqZWN0fSBjb2xsIC0gQSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7QXN5bmNGdW5jdGlvbn0gaXRlcmF0ZWUgLSBBIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2hcbiAqIGl0ZW0gaW4gYGNvbGxgLlxuICogVGhlIGBrZXlgIGlzIHRoZSBpdGVtJ3Mga2V5LCBvciBpbmRleCBpbiB0aGUgY2FzZSBvZiBhbiBhcnJheS5cbiAqIEludm9rZWQgd2l0aCAoaXRlbSwga2V5LCBjYWxsYmFjaykuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIC0gQSBjYWxsYmFjayB3aGljaCBpcyBjYWxsZWQgd2hlbiBhbGxcbiAqIGBpdGVyYXRlZWAgZnVuY3Rpb25zIGhhdmUgZmluaXNoZWQsIG9yIGFuIGVycm9yIG9jY3Vycy4gSW52b2tlZCB3aXRoIChlcnIpLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqID0ge2RldjogXCIvZGV2Lmpzb25cIiwgdGVzdDogXCIvdGVzdC5qc29uXCIsIHByb2Q6IFwiL3Byb2QuanNvblwifTtcbiAqIHZhciBjb25maWdzID0ge307XG4gKlxuICogYXN5bmMuZm9yRWFjaE9mKG9iaiwgZnVuY3Rpb24gKHZhbHVlLCBrZXksIGNhbGxiYWNrKSB7XG4gKiAgICAgZnMucmVhZEZpbGUoX19kaXJuYW1lICsgdmFsdWUsIFwidXRmOFwiLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gKiAgICAgICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICogICAgICAgICB0cnkge1xuICogICAgICAgICAgICAgY29uZmlnc1trZXldID0gSlNPTi5wYXJzZShkYXRhKTtcbiAqICAgICAgICAgfSBjYXRjaCAoZSkge1xuICogICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGUpO1xuICogICAgICAgICB9XG4gKiAgICAgICAgIGNhbGxiYWNrKCk7XG4gKiAgICAgfSk7XG4gKiB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gKiAgICAgaWYgKGVycikgY29uc29sZS5lcnJvcihlcnIubWVzc2FnZSk7XG4gKiAgICAgLy8gY29uZmlncyBpcyBub3cgYSBtYXAgb2YgSlNPTiBkYXRhXG4gKiAgICAgZG9Tb21ldGhpbmdXaXRoKGNvbmZpZ3MpO1xuICogfSk7XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGVhY2hPZkxpbWl0O1xuXG52YXIgX2VhY2hPZkxpbWl0MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvZWFjaE9mTGltaXQnKTtcblxudmFyIF9lYWNoT2ZMaW1pdDMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9lYWNoT2ZMaW1pdDIpO1xuXG52YXIgX3dyYXBBc3luYyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvd3JhcEFzeW5jJyk7XG5cbnZhciBfd3JhcEFzeW5jMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3dyYXBBc3luYyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogVGhlIHNhbWUgYXMgW2BlYWNoT2ZgXXtAbGluayBtb2R1bGU6Q29sbGVjdGlvbnMuZWFjaE9mfSBidXQgcnVucyBhIG1heGltdW0gb2YgYGxpbWl0YCBhc3luYyBvcGVyYXRpb25zIGF0IGFcbiAqIHRpbWUuXG4gKlxuICogQG5hbWUgZWFjaE9mTGltaXRcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBtb2R1bGU6Q29sbGVjdGlvbnNcbiAqIEBtZXRob2RcbiAqIEBzZWUgW2FzeW5jLmVhY2hPZl17QGxpbmsgbW9kdWxlOkNvbGxlY3Rpb25zLmVhY2hPZn1cbiAqIEBhbGlhcyBmb3JFYWNoT2ZMaW1pdFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8SXRlcmFibGV8T2JqZWN0fSBjb2xsIC0gQSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCAtIFRoZSBtYXhpbXVtIG51bWJlciBvZiBhc3luYyBvcGVyYXRpb25zIGF0IGEgdGltZS5cbiAqIEBwYXJhbSB7QXN5bmNGdW5jdGlvbn0gaXRlcmF0ZWUgLSBBbiBhc3luYyBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoXG4gKiBpdGVtIGluIGBjb2xsYC4gVGhlIGBrZXlgIGlzIHRoZSBpdGVtJ3Mga2V5LCBvciBpbmRleCBpbiB0aGUgY2FzZSBvZiBhblxuICogYXJyYXkuXG4gKiBJbnZva2VkIHdpdGggKGl0ZW0sIGtleSwgY2FsbGJhY2spLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSAtIEEgY2FsbGJhY2sgd2hpY2ggaXMgY2FsbGVkIHdoZW4gYWxsXG4gKiBgaXRlcmF0ZWVgIGZ1bmN0aW9ucyBoYXZlIGZpbmlzaGVkLCBvciBhbiBlcnJvciBvY2N1cnMuIEludm9rZWQgd2l0aCAoZXJyKS5cbiAqL1xuZnVuY3Rpb24gZWFjaE9mTGltaXQoY29sbCwgbGltaXQsIGl0ZXJhdGVlLCBjYWxsYmFjaykge1xuICAoMCwgX2VhY2hPZkxpbWl0My5kZWZhdWx0KShsaW1pdCkoY29sbCwgKDAsIF93cmFwQXN5bmMyLmRlZmF1bHQpKGl0ZXJhdGVlKSwgY2FsbGJhY2spO1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG4vLyBBIHRlbXBvcmFyeSB2YWx1ZSB1c2VkIHRvIGlkZW50aWZ5IGlmIHRoZSBsb29wIHNob3VsZCBiZSBicm9rZW4uXG4vLyBTZWUgIzEwNjQsICMxMjkzXG5leHBvcnRzLmRlZmF1bHQgPSB7fTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGRvTGltaXQ7XG5mdW5jdGlvbiBkb0xpbWl0KGZuLCBsaW1pdCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoaXRlcmFibGUsIGl0ZXJhdGVlLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gZm4oaXRlcmFibGUsIGxpbWl0LCBpdGVyYXRlZSwgY2FsbGJhY2spO1xuICAgIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gX2VhY2hPZkxpbWl0O1xuXG52YXIgX25vb3AgPSByZXF1aXJlKCdsb2Rhc2gvbm9vcCcpO1xuXG52YXIgX25vb3AyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbm9vcCk7XG5cbnZhciBfb25jZSA9IHJlcXVpcmUoJy4vb25jZScpO1xuXG52YXIgX29uY2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb25jZSk7XG5cbnZhciBfaXRlcmF0b3IgPSByZXF1aXJlKCcuL2l0ZXJhdG9yJyk7XG5cbnZhciBfaXRlcmF0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXRlcmF0b3IpO1xuXG52YXIgX29ubHlPbmNlID0gcmVxdWlyZSgnLi9vbmx5T25jZScpO1xuXG52YXIgX29ubHlPbmNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX29ubHlPbmNlKTtcblxudmFyIF9icmVha0xvb3AgPSByZXF1aXJlKCcuL2JyZWFrTG9vcCcpO1xuXG52YXIgX2JyZWFrTG9vcDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9icmVha0xvb3ApO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfZWFjaE9mTGltaXQobGltaXQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9iaiwgaXRlcmF0ZWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gKDAsIF9vbmNlMi5kZWZhdWx0KShjYWxsYmFjayB8fCBfbm9vcDIuZGVmYXVsdCk7XG4gICAgICAgIGlmIChsaW1pdCA8PSAwIHx8ICFvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmV4dEVsZW0gPSAoMCwgX2l0ZXJhdG9yMi5kZWZhdWx0KShvYmopO1xuICAgICAgICB2YXIgZG9uZSA9IGZhbHNlO1xuICAgICAgICB2YXIgcnVubmluZyA9IDA7XG5cbiAgICAgICAgZnVuY3Rpb24gaXRlcmF0ZWVDYWxsYmFjayhlcnIsIHZhbHVlKSB7XG4gICAgICAgICAgICBydW5uaW5nIC09IDE7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IF9icmVha0xvb3AyLmRlZmF1bHQgfHwgZG9uZSAmJiBydW5uaW5nIDw9IDApIHtcbiAgICAgICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlcGxlbmlzaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVwbGVuaXNoKCkge1xuICAgICAgICAgICAgd2hpbGUgKHJ1bm5pbmcgPCBsaW1pdCAmJiAhZG9uZSkge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtID0gbmV4dEVsZW0oKTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bm5pbmcgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBydW5uaW5nICs9IDE7XG4gICAgICAgICAgICAgICAgaXRlcmF0ZWUoZWxlbS52YWx1ZSwgZWxlbS5rZXksICgwLCBfb25seU9uY2UyLmRlZmF1bHQpKGl0ZXJhdGVlQ2FsbGJhY2spKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlcGxlbmlzaCgpO1xuICAgIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGNvbGwpIHtcbiAgICByZXR1cm4gaXRlcmF0b3JTeW1ib2wgJiYgY29sbFtpdGVyYXRvclN5bWJvbF0gJiYgY29sbFtpdGVyYXRvclN5bWJvbF0oKTtcbn07XG5cbnZhciBpdGVyYXRvclN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIC8qLi4uYXJncywgY2FsbGJhY2sqL3tcbiAgICAgICAgdmFyIGFyZ3MgPSAoMCwgX3NsaWNlMi5kZWZhdWx0KShhcmd1bWVudHMpO1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmdzLnBvcCgpO1xuICAgICAgICBmbi5jYWxsKHRoaXMsIGFyZ3MsIGNhbGxiYWNrKTtcbiAgICB9O1xufTtcblxudmFyIF9zbGljZSA9IHJlcXVpcmUoJy4vc2xpY2UnKTtcblxudmFyIF9zbGljZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zbGljZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gaXRlcmF0b3I7XG5cbnZhciBfaXNBcnJheUxpa2UgPSByZXF1aXJlKCdsb2Rhc2gvaXNBcnJheUxpa2UnKTtcblxudmFyIF9pc0FycmF5TGlrZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc0FycmF5TGlrZSk7XG5cbnZhciBfZ2V0SXRlcmF0b3IgPSByZXF1aXJlKCcuL2dldEl0ZXJhdG9yJyk7XG5cbnZhciBfZ2V0SXRlcmF0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0SXRlcmF0b3IpO1xuXG52YXIgX2tleXMgPSByZXF1aXJlKCdsb2Rhc2gva2V5cycpO1xuXG52YXIgX2tleXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfa2V5cyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGNyZWF0ZUFycmF5SXRlcmF0b3IoY29sbCkge1xuICAgIHZhciBpID0gLTE7XG4gICAgdmFyIGxlbiA9IGNvbGwubGVuZ3RoO1xuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICByZXR1cm4gKytpIDwgbGVuID8geyB2YWx1ZTogY29sbFtpXSwga2V5OiBpIH0gOiBudWxsO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVTMjAxNUl0ZXJhdG9yKGl0ZXJhdG9yKSB7XG4gICAgdmFyIGkgPSAtMTtcbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIGlmIChpdGVtLmRvbmUpIHJldHVybiBudWxsO1xuICAgICAgICBpKys7XG4gICAgICAgIHJldHVybiB7IHZhbHVlOiBpdGVtLnZhbHVlLCBrZXk6IGkgfTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVPYmplY3RJdGVyYXRvcihvYmopIHtcbiAgICB2YXIgb2tleXMgPSAoMCwgX2tleXMyLmRlZmF1bHQpKG9iaik7XG4gICAgdmFyIGkgPSAtMTtcbiAgICB2YXIgbGVuID0gb2tleXMubGVuZ3RoO1xuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICB2YXIga2V5ID0gb2tleXNbKytpXTtcbiAgICAgICAgcmV0dXJuIGkgPCBsZW4gPyB7IHZhbHVlOiBvYmpba2V5XSwga2V5OiBrZXkgfSA6IG51bGw7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gaXRlcmF0b3IoY29sbCkge1xuICAgIGlmICgoMCwgX2lzQXJyYXlMaWtlMi5kZWZhdWx0KShjb2xsKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlQXJyYXlJdGVyYXRvcihjb2xsKTtcbiAgICB9XG5cbiAgICB2YXIgaXRlcmF0b3IgPSAoMCwgX2dldEl0ZXJhdG9yMi5kZWZhdWx0KShjb2xsKTtcbiAgICByZXR1cm4gaXRlcmF0b3IgPyBjcmVhdGVFUzIwMTVJdGVyYXRvcihpdGVyYXRvcikgOiBjcmVhdGVPYmplY3RJdGVyYXRvcihjb2xsKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBvbmNlO1xuZnVuY3Rpb24gb25jZShmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChmbiA9PT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICB2YXIgY2FsbEZuID0gZm47XG4gICAgICAgIGZuID0gbnVsbDtcbiAgICAgICAgY2FsbEZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IG9ubHlPbmNlO1xuZnVuY3Rpb24gb25seU9uY2UoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZm4gPT09IG51bGwpIHRocm93IG5ldyBFcnJvcihcIkNhbGxiYWNrIHdhcyBhbHJlYWR5IGNhbGxlZC5cIik7XG4gICAgICAgIHZhciBjYWxsRm4gPSBmbjtcbiAgICAgICAgZm4gPSBudWxsO1xuICAgICAgICBjYWxsRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IF9wYXJhbGxlbDtcblxudmFyIF9ub29wID0gcmVxdWlyZSgnbG9kYXNoL25vb3AnKTtcblxudmFyIF9ub29wMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX25vb3ApO1xuXG52YXIgX2lzQXJyYXlMaWtlID0gcmVxdWlyZSgnbG9kYXNoL2lzQXJyYXlMaWtlJyk7XG5cbnZhciBfaXNBcnJheUxpa2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNBcnJheUxpa2UpO1xuXG52YXIgX3NsaWNlID0gcmVxdWlyZSgnLi9zbGljZScpO1xuXG52YXIgX3NsaWNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NsaWNlKTtcblxudmFyIF93cmFwQXN5bmMgPSByZXF1aXJlKCcuL3dyYXBBc3luYycpO1xuXG52YXIgX3dyYXBBc3luYzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF93cmFwQXN5bmMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfcGFyYWxsZWwoZWFjaGZuLCB0YXNrcywgY2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IF9ub29wMi5kZWZhdWx0O1xuICAgIHZhciByZXN1bHRzID0gKDAsIF9pc0FycmF5TGlrZTIuZGVmYXVsdCkodGFza3MpID8gW10gOiB7fTtcblxuICAgIGVhY2hmbih0YXNrcywgZnVuY3Rpb24gKHRhc2ssIGtleSwgY2FsbGJhY2spIHtcbiAgICAgICAgKDAsIF93cmFwQXN5bmMyLmRlZmF1bHQpKHRhc2spKGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKDAsIF9zbGljZTIuZGVmYXVsdCkoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdHNba2V5XSA9IHJlc3VsdDtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgIH0pO1xuICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHRzKTtcbiAgICB9KTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5oYXNOZXh0VGljayA9IGV4cG9ydHMuaGFzU2V0SW1tZWRpYXRlID0gdW5kZWZpbmVkO1xuZXhwb3J0cy5mYWxsYmFjayA9IGZhbGxiYWNrO1xuZXhwb3J0cy53cmFwID0gd3JhcDtcblxudmFyIF9zbGljZSA9IHJlcXVpcmUoJy4vc2xpY2UnKTtcblxudmFyIF9zbGljZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zbGljZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBoYXNTZXRJbW1lZGlhdGUgPSBleHBvcnRzLmhhc1NldEltbWVkaWF0ZSA9IHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicgJiYgc2V0SW1tZWRpYXRlO1xudmFyIGhhc05leHRUaWNrID0gZXhwb3J0cy5oYXNOZXh0VGljayA9IHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgcHJvY2Vzcy5uZXh0VGljayA9PT0gJ2Z1bmN0aW9uJztcblxuZnVuY3Rpb24gZmFsbGJhY2soZm4pIHtcbiAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbn1cblxuZnVuY3Rpb24gd3JhcChkZWZlcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZm4gLyosIC4uLmFyZ3MqLykge1xuICAgICAgICB2YXIgYXJncyA9ICgwLCBfc2xpY2UyLmRlZmF1bHQpKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGRlZmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuXG52YXIgX2RlZmVyO1xuXG5pZiAoaGFzU2V0SW1tZWRpYXRlKSB7XG4gICAgX2RlZmVyID0gc2V0SW1tZWRpYXRlO1xufSBlbHNlIGlmIChoYXNOZXh0VGljaykge1xuICAgIF9kZWZlciA9IHByb2Nlc3MubmV4dFRpY2s7XG59IGVsc2Uge1xuICAgIF9kZWZlciA9IGZhbGxiYWNrO1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSB3cmFwKF9kZWZlcik7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHNsaWNlO1xuZnVuY3Rpb24gc2xpY2UoYXJyYXlMaWtlLCBzdGFydCkge1xuICAgIHN0YXJ0ID0gc3RhcnQgfCAwO1xuICAgIHZhciBuZXdMZW4gPSBNYXRoLm1heChhcnJheUxpa2UubGVuZ3RoIC0gc3RhcnQsIDApO1xuICAgIHZhciBuZXdBcnIgPSBBcnJheShuZXdMZW4pO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IG5ld0xlbjsgaWR4KyspIHtcbiAgICAgICAgbmV3QXJyW2lkeF0gPSBhcnJheUxpa2Vbc3RhcnQgKyBpZHhdO1xuICAgIH1cbiAgICByZXR1cm4gbmV3QXJyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuaXNBc3luYyA9IHVuZGVmaW5lZDtcblxudmFyIF9hc3luY2lmeSA9IHJlcXVpcmUoJy4uL2FzeW5jaWZ5Jyk7XG5cbnZhciBfYXN5bmNpZnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXN5bmNpZnkpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgc3VwcG9ydHNTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nO1xuXG5mdW5jdGlvbiBpc0FzeW5jKGZuKSB7XG4gICAgcmV0dXJuIHN1cHBvcnRzU3ltYm9sICYmIGZuW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09ICdBc3luY0Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gd3JhcEFzeW5jKGFzeW5jRm4pIHtcbiAgICByZXR1cm4gaXNBc3luYyhhc3luY0ZuKSA/ICgwLCBfYXN5bmNpZnkyLmRlZmF1bHQpKGFzeW5jRm4pIDogYXN5bmNGbjtcbn1cblxuZXhwb3J0cy5kZWZhdWx0ID0gd3JhcEFzeW5jO1xuZXhwb3J0cy5pc0FzeW5jID0gaXNBc3luYzsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBwYXJhbGxlbExpbWl0O1xuXG52YXIgX2VhY2hPZiA9IHJlcXVpcmUoJy4vZWFjaE9mJyk7XG5cbnZhciBfZWFjaE9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2VhY2hPZik7XG5cbnZhciBfcGFyYWxsZWwgPSByZXF1aXJlKCcuL2ludGVybmFsL3BhcmFsbGVsJyk7XG5cbnZhciBfcGFyYWxsZWwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGFyYWxsZWwpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIFJ1biB0aGUgYHRhc2tzYCBjb2xsZWN0aW9uIG9mIGZ1bmN0aW9ucyBpbiBwYXJhbGxlbCwgd2l0aG91dCB3YWl0aW5nIHVudGlsXG4gKiB0aGUgcHJldmlvdXMgZnVuY3Rpb24gaGFzIGNvbXBsZXRlZC4gSWYgYW55IG9mIHRoZSBmdW5jdGlvbnMgcGFzcyBhbiBlcnJvciB0b1xuICogaXRzIGNhbGxiYWNrLCB0aGUgbWFpbiBgY2FsbGJhY2tgIGlzIGltbWVkaWF0ZWx5IGNhbGxlZCB3aXRoIHRoZSB2YWx1ZSBvZiB0aGVcbiAqIGVycm9yLiBPbmNlIHRoZSBgdGFza3NgIGhhdmUgY29tcGxldGVkLCB0aGUgcmVzdWx0cyBhcmUgcGFzc2VkIHRvIHRoZSBmaW5hbFxuICogYGNhbGxiYWNrYCBhcyBhbiBhcnJheS5cbiAqXG4gKiAqKk5vdGU6KiogYHBhcmFsbGVsYCBpcyBhYm91dCBraWNraW5nLW9mZiBJL08gdGFza3MgaW4gcGFyYWxsZWwsIG5vdCBhYm91dFxuICogcGFyYWxsZWwgZXhlY3V0aW9uIG9mIGNvZGUuICBJZiB5b3VyIHRhc2tzIGRvIG5vdCB1c2UgYW55IHRpbWVycyBvciBwZXJmb3JtXG4gKiBhbnkgSS9PLCB0aGV5IHdpbGwgYWN0dWFsbHkgYmUgZXhlY3V0ZWQgaW4gc2VyaWVzLiAgQW55IHN5bmNocm9ub3VzIHNldHVwXG4gKiBzZWN0aW9ucyBmb3IgZWFjaCB0YXNrIHdpbGwgaGFwcGVuIG9uZSBhZnRlciB0aGUgb3RoZXIuICBKYXZhU2NyaXB0IHJlbWFpbnNcbiAqIHNpbmdsZS10aHJlYWRlZC5cbiAqXG4gKiAqKkhpbnQ6KiogVXNlIFtgcmVmbGVjdGBde0BsaW5rIG1vZHVsZTpVdGlscy5yZWZsZWN0fSB0byBjb250aW51ZSB0aGVcbiAqIGV4ZWN1dGlvbiBvZiBvdGhlciB0YXNrcyB3aGVuIGEgdGFzayBmYWlscy5cbiAqXG4gKiBJdCBpcyBhbHNvIHBvc3NpYmxlIHRvIHVzZSBhbiBvYmplY3QgaW5zdGVhZCBvZiBhbiBhcnJheS4gRWFjaCBwcm9wZXJ0eSB3aWxsXG4gKiBiZSBydW4gYXMgYSBmdW5jdGlvbiBhbmQgdGhlIHJlc3VsdHMgd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGZpbmFsIGBjYWxsYmFja2BcbiAqIGFzIGFuIG9iamVjdCBpbnN0ZWFkIG9mIGFuIGFycmF5LiBUaGlzIGNhbiBiZSBhIG1vcmUgcmVhZGFibGUgd2F5IG9mIGhhbmRsaW5nXG4gKiByZXN1bHRzIGZyb20ge0BsaW5rIGFzeW5jLnBhcmFsbGVsfS5cbiAqXG4gKiBAbmFtZSBwYXJhbGxlbFxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIG1vZHVsZTpDb250cm9sRmxvd1xuICogQG1ldGhvZFxuICogQGNhdGVnb3J5IENvbnRyb2wgRmxvd1xuICogQHBhcmFtIHtBcnJheXxJdGVyYWJsZXxPYmplY3R9IHRhc2tzIC0gQSBjb2xsZWN0aW9uIG9mXG4gKiBbYXN5bmMgZnVuY3Rpb25zXXtAbGluayBBc3luY0Z1bmN0aW9ufSB0byBydW4uXG4gKiBFYWNoIGFzeW5jIGZ1bmN0aW9uIGNhbiBjb21wbGV0ZSB3aXRoIGFueSBudW1iZXIgb2Ygb3B0aW9uYWwgYHJlc3VsdGAgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSAtIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRvIHJ1biBvbmNlIGFsbCB0aGVcbiAqIGZ1bmN0aW9ucyBoYXZlIGNvbXBsZXRlZCBzdWNjZXNzZnVsbHkuIFRoaXMgZnVuY3Rpb24gZ2V0cyBhIHJlc3VsdHMgYXJyYXlcbiAqIChvciBvYmplY3QpIGNvbnRhaW5pbmcgYWxsIHRoZSByZXN1bHQgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgdGFzayBjYWxsYmFja3MuXG4gKiBJbnZva2VkIHdpdGggKGVyciwgcmVzdWx0cykuXG4gKlxuICogQGV4YW1wbGVcbiAqIGFzeW5jLnBhcmFsbGVsKFtcbiAqICAgICBmdW5jdGlvbihjYWxsYmFjaykge1xuICogICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICogICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgJ29uZScpO1xuICogICAgICAgICB9LCAyMDApO1xuICogICAgIH0sXG4gKiAgICAgZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAqICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAqICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsICd0d28nKTtcbiAqICAgICAgICAgfSwgMTAwKTtcbiAqICAgICB9XG4gKiBdLFxuICogLy8gb3B0aW9uYWwgY2FsbGJhY2tcbiAqIGZ1bmN0aW9uKGVyciwgcmVzdWx0cykge1xuICogICAgIC8vIHRoZSByZXN1bHRzIGFycmF5IHdpbGwgZXF1YWwgWydvbmUnLCd0d28nXSBldmVuIHRob3VnaFxuICogICAgIC8vIHRoZSBzZWNvbmQgZnVuY3Rpb24gaGFkIGEgc2hvcnRlciB0aW1lb3V0LlxuICogfSk7XG4gKlxuICogLy8gYW4gZXhhbXBsZSB1c2luZyBhbiBvYmplY3QgaW5zdGVhZCBvZiBhbiBhcnJheVxuICogYXN5bmMucGFyYWxsZWwoe1xuICogICAgIG9uZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAqICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAqICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIDEpO1xuICogICAgICAgICB9LCAyMDApO1xuICogICAgIH0sXG4gKiAgICAgdHdvOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICogICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICogICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgMik7XG4gKiAgICAgICAgIH0sIDEwMCk7XG4gKiAgICAgfVxuICogfSwgZnVuY3Rpb24oZXJyLCByZXN1bHRzKSB7XG4gKiAgICAgLy8gcmVzdWx0cyBpcyBub3cgZXF1YWxzIHRvOiB7b25lOiAxLCB0d286IDJ9XG4gKiB9KTtcbiAqL1xuZnVuY3Rpb24gcGFyYWxsZWxMaW1pdCh0YXNrcywgY2FsbGJhY2spIHtcbiAgKDAsIF9wYXJhbGxlbDIuZGVmYXVsdCkoX2VhY2hPZjIuZGVmYXVsdCwgdGFza3MsIGNhbGxiYWNrKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2w7XG4iLCJ2YXIgYmFzZVRpbWVzID0gcmVxdWlyZSgnLi9fYmFzZVRpbWVzJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIHRoZSBhcnJheS1saWtlIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtib29sZWFufSBpbmhlcml0ZWQgU3BlY2lmeSByZXR1cm5pbmcgaW5oZXJpdGVkIHByb3BlcnR5IG5hbWVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYXJyYXlMaWtlS2V5cyh2YWx1ZSwgaW5oZXJpdGVkKSB7XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpLFxuICAgICAgaXNBcmcgPSAhaXNBcnIgJiYgaXNBcmd1bWVudHModmFsdWUpLFxuICAgICAgaXNCdWZmID0gIWlzQXJyICYmICFpc0FyZyAmJiBpc0J1ZmZlcih2YWx1ZSksXG4gICAgICBpc1R5cGUgPSAhaXNBcnIgJiYgIWlzQXJnICYmICFpc0J1ZmYgJiYgaXNUeXBlZEFycmF5KHZhbHVlKSxcbiAgICAgIHNraXBJbmRleGVzID0gaXNBcnIgfHwgaXNBcmcgfHwgaXNCdWZmIHx8IGlzVHlwZSxcbiAgICAgIHJlc3VsdCA9IHNraXBJbmRleGVzID8gYmFzZVRpbWVzKHZhbHVlLmxlbmd0aCwgU3RyaW5nKSA6IFtdLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAoKGluaGVyaXRlZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSAmJlxuICAgICAgICAhKHNraXBJbmRleGVzICYmIChcbiAgICAgICAgICAgLy8gU2FmYXJpIDkgaGFzIGVudW1lcmFibGUgYGFyZ3VtZW50cy5sZW5ndGhgIGluIHN0cmljdCBtb2RlLlxuICAgICAgICAgICBrZXkgPT0gJ2xlbmd0aCcgfHxcbiAgICAgICAgICAgLy8gTm9kZS5qcyAwLjEwIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIGJ1ZmZlcnMuXG4gICAgICAgICAgIChpc0J1ZmYgJiYgKGtleSA9PSAnb2Zmc2V0JyB8fCBrZXkgPT0gJ3BhcmVudCcpKSB8fFxuICAgICAgICAgICAvLyBQaGFudG9tSlMgMiBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiB0eXBlZCBhcnJheXMuXG4gICAgICAgICAgIChpc1R5cGUgJiYgKGtleSA9PSAnYnVmZmVyJyB8fCBrZXkgPT0gJ2J5dGVMZW5ndGgnIHx8IGtleSA9PSAnYnl0ZU9mZnNldCcpKSB8fFxuICAgICAgICAgICAvLyBTa2lwIGluZGV4IHByb3BlcnRpZXMuXG4gICAgICAgICAgIGlzSW5kZXgoa2V5LCBsZW5ndGgpXG4gICAgICAgICkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5TGlrZUtleXM7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgZ2V0UmF3VGFnID0gcmVxdWlyZSgnLi9fZ2V0UmF3VGFnJyksXG4gICAgb2JqZWN0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19vYmplY3RUb1N0cmluZycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0VGFnO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNBcmd1bWVudHM7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzVHlwZWRBcnJheTtcbiIsInZhciBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5cyA9IHJlcXVpcmUoJy4vX25hdGl2ZUtleXMnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VLZXlzO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVGltZXM7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVVuYXJ5O1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlR2xvYmFsO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgJiZcbiAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJbmRleDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcbiIsInZhciBvdmVyQXJnID0gcmVxdWlyZSgnLi9fb3ZlckFyZycpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlS2V5cztcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZVV0aWw7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUb1N0cmluZztcbiIsIi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJBcmc7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvb3Q7XG4iLCJ2YXIgYmFzZUlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9fYmFzZUlzQXJndW1lbnRzJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJndW1lbnRzID0gYmFzZUlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID8gYmFzZUlzQXJndW1lbnRzIDogZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcmd1bWVudHM7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5O1xuIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheUxpa2U7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKSxcbiAgICBzdHViRmFsc2UgPSByZXF1aXJlKCcuL3N0dWJGYWxzZScpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQnVmZmVyID0gQnVmZmVyID8gQnVmZmVyLmlzQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IEJ1ZmZlcigyKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgVWludDhBcnJheSgyKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNCdWZmZXIgPSBuYXRpdmVJc0J1ZmZlciB8fCBzdHViRmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNCdWZmZXI7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uO1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTGVuZ3RoO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG4iLCJ2YXIgYmFzZUlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Jhc2VJc1R5cGVkQXJyYXknKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzVHlwZWRBcnJheSA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVHlwZWRBcnJheTtcbiIsInZhciBhcnJheUxpa2VLZXlzID0gcmVxdWlyZSgnLi9fYXJyYXlMaWtlS2V5cycpLFxuICAgIGJhc2VLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUtleXMnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgdW5kZWZpbmVkYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8ubm9vcCk7XG4gKiAvLyA9PiBbdW5kZWZpbmVkLCB1bmRlZmluZWRdXG4gKi9cbmZ1bmN0aW9uIG5vb3AoKSB7XG4gIC8vIE5vIG9wZXJhdGlvbiBwZXJmb3JtZWQuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gbm9vcDtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLnN0dWJGYWxzZSk7XG4gKiAvLyA9PiBbZmFsc2UsIGZhbHNlXVxuICovXG5mdW5jdGlvbiBzdHViRmFsc2UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHViRmFsc2U7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBUZXh0dXJlMkQgPSByZXF1aXJlKCcuL1RleHR1cmUyRCcpO1xuY29uc3QgSW1hZ2VMb2FkZXIgPSByZXF1aXJlKCcuLi91dGlsL0ltYWdlTG9hZGVyJyk7XG5jb25zdCBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyk7XG5cbmNvbnN0IE1BR19GSUxURVJTID0ge1xuXHRORUFSRVNUOiB0cnVlLFxuXHRMSU5FQVI6IHRydWVcbn07XG5jb25zdCBNSU5fRklMVEVSUyA9IHtcblx0TkVBUkVTVDogdHJ1ZSxcblx0TElORUFSOiB0cnVlLFxuXHRORUFSRVNUX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxuXHRMSU5FQVJfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG5cdE5FQVJFU1RfTUlQTUFQX0xJTkVBUjogdHJ1ZSxcblx0TElORUFSX01JUE1BUF9MSU5FQVI6IHRydWVcbn07XG5jb25zdCBXUkFQX01PREVTID0ge1xuXHRSRVBFQVQ6IHRydWUsXG5cdE1JUlJPUkVEX1JFUEVBVDogdHJ1ZSxcblx0Q0xBTVBfVE9fRURHRTogdHJ1ZVxufTtcbmNvbnN0IFRZUEVTID0ge1xuXHRVTlNJR05FRF9CWVRFOiB0cnVlLFxuXHRGTE9BVDogdHJ1ZVxufTtcbmNvbnN0IEZPUk1BVFMgPSB7XG5cdFJHQjogdHJ1ZSxcblx0UkdCQTogdHJ1ZVxufTtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCB0eXBlIGZvciBjb2xvciB0ZXh0dXJlcy5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge3N0cmluZ31cbiAqL1xuY29uc3QgREVGQVVMVF9UWVBFID0gJ1VOU0lHTkVEX0JZVEUnO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGZvcm1hdCBmb3IgY29sb3IgdGV4dHVyZXMuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtzdHJpbmd9XG4gKi9cbmNvbnN0IERFRkFVTFRfRk9STUFUID0gJ1JHQkEnO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IHdyYXAgbW9kZSBmb3IgY29sb3IgdGV4dHVyZXMuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtzdHJpbmd9XG4gKi9cbmNvbnN0IERFRkFVTFRfV1JBUCA9ICdSRVBFQVQnO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IG1pbiAvIG1hZyBmaWx0ZXIgZm9yIGNvbG9yIHRleHR1cmVzLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7c3RyaW5nfVxuICovXG5jb25zdCBERUZBVUxUX0ZJTFRFUiA9ICdMSU5FQVInO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIGFscGhhIHByZW11bHRpcGx5aW5nIGlzIGVuYWJsZWQuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtib29sZWFufVxuICovXG5jb25zdCBERUZBVUxUX1BSRU1VTFRJUExZX0FMUEhBID0gdHJ1ZTtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBtaXBtYXBwaW5nIGlzIGVuYWJsZWQuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtib29sZWFufVxuICovXG5jb25zdCBERUZBVUxUX01JUE1BUCA9IHRydWU7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgZm9yIHdoZXRoZXIgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge2Jvb2xlYW59XG4gKi9cbmNvbnN0IERFRkFVTFRfSU5WRVJUX1kgPSB0cnVlO1xuXG4vKipcbiAqIEEgdGV4dHVyZSBjbGFzcyB0byByZXByZXNlbnQgYSAyRCBjb2xvciB0ZXh0dXJlLlxuICogQGF1Z21lbnRzIFRleHR1cmUyRFxuICovXG5jbGFzcyBDb2xvclRleHR1cmUyRCBleHRlbmRzIFRleHR1cmUyRCB7XG5cblx0LyoqXG5cdCAqIEluc3RhbnRpYXRlcyBhIENvbG9yVGV4dHVyZTJEIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgc3BlY2lmaWNhdGlvbiBhcmd1bWVudHMuXG5cdCAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ8SW1hZ2VEYXRhfEhUTUxJbWFnZUVsZW1lbnR8SFRNTENhbnZhc0VsZW1lbnR8SFRNTFZpZGVvRWxlbWVudH0gc3BlYy5pbWFnZSAtIFRoZSBIVE1MSW1hZ2VFbGVtZW50IHRvIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHNwZWMudXJsIC0gVGhlIEhUTUxJbWFnZUVsZW1lbnQgVVJMIHRvIGxvYWQgYW5kIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtVaW50OEFycmF5fEZsb2F0MzJBcnJheX0gc3BlYy5zcmMgLSBUaGUgZGF0YSB0byBidWZmZXIuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzcGVjLndpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB0ZXh0dXJlLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gc3BlYy5oZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB0ZXh0dXJlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cblx0ICogQHBhcmFtIHtib29sfSBzcGVjLm1pcE1hcCAtIFdoZXRoZXIgb3Igbm90IG1pcC1tYXBwaW5nIGlzIGVuYWJsZWQuXG5cdCAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5pbnZlcnRZIC0gV2hldGhlciBvciBub3QgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cblx0ICogQHBhcmFtIHtib29sfSBzcGVjLnByZW11bHRpcGx5QWxwaGEgLSBXaGV0aGVyIG9yIG5vdCBhbHBoYSBwcmVtdWx0aXBseWluZyBpcyBlbmFibGVkLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy5mb3JtYXQgLSBUaGUgdGV4dHVyZSBwaXhlbCBmb3JtYXQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzcGVjLnR5cGUgLSBUaGUgdGV4dHVyZSBwaXhlbCBjb21wb25lbnQgdHlwZS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gYmUgZXhlY3V0ZWQgaWYgdGhlIGRhdGEgaXMgbG9hZGVkIGFzeW5jaHJvbm91c2x5IHZpYSBhIFVSTC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHNwZWMgPSB7fSwgY2FsbGJhY2sgPSBudWxsKSB7XG5cdFx0Ly8gZ2V0IHNwZWNpZmljIHBhcmFtc1xuXHRcdHNwZWMud3JhcFMgPSBzcGVjLndyYXBTIHx8IHNwZWMud3JhcDtcblx0XHRzcGVjLndyYXBUID0gc3BlYy53cmFwVCB8fCBzcGVjLndyYXA7XG5cdFx0c3BlYy5taW5GaWx0ZXIgPSBzcGVjLm1pbkZpbHRlciB8fCBzcGVjLmZpbHRlcjtcblx0XHRzcGVjLm1hZ0ZpbHRlciA9IHNwZWMubWFnRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xuXHRcdC8vIHNldCB0ZXh0dXJlIHBhcmFtc1xuXHRcdHNwZWMud3JhcFMgPSBXUkFQX01PREVTW3NwZWMud3JhcFNdID8gc3BlYy53cmFwUyA6IERFRkFVTFRfV1JBUDtcblx0XHRzcGVjLndyYXBUID0gV1JBUF9NT0RFU1tzcGVjLndyYXBUXSA/IHNwZWMud3JhcFQgOiBERUZBVUxUX1dSQVA7XG5cdFx0c3BlYy5taW5GaWx0ZXIgPSBNSU5fRklMVEVSU1tzcGVjLm1pbkZpbHRlcl0gPyBzcGVjLm1pbkZpbHRlciA6IERFRkFVTFRfRklMVEVSO1xuXHRcdHNwZWMubWFnRmlsdGVyID0gTUFHX0ZJTFRFUlNbc3BlYy5tYWdGaWx0ZXJdID8gc3BlYy5tYWdGaWx0ZXIgOiBERUZBVUxUX0ZJTFRFUjtcblx0XHQvLyBzZXQgb3RoZXIgcHJvcGVydGllc1xuXHRcdHNwZWMubWlwTWFwID0gc3BlYy5taXBNYXAgIT09IHVuZGVmaW5lZCA/IHNwZWMubWlwTWFwIDogREVGQVVMVF9NSVBNQVA7XG5cdFx0c3BlYy5pbnZlcnRZID0gc3BlYy5pbnZlcnRZICE9PSB1bmRlZmluZWQgPyBzcGVjLmludmVydFkgOiBERUZBVUxUX0lOVkVSVF9ZO1xuXHRcdHNwZWMucHJlbXVsdGlwbHlBbHBoYSA9IHNwZWMucHJlbXVsdGlwbHlBbHBoYSAhPT0gdW5kZWZpbmVkID8gc3BlYy5wcmVtdWx0aXBseUFscGhhIDogREVGQVVMVF9QUkVNVUxUSVBMWV9BTFBIQTtcblx0XHQvLyBzZXQgZm9ybWF0XG5cdFx0c3BlYy5mb3JtYXQgPSBGT1JNQVRTW3NwZWMuZm9ybWF0XSA/IHNwZWMuZm9ybWF0IDogREVGQVVMVF9GT1JNQVQ7XG5cdFx0Ly8gYnVmZmVyIHRoZSB0ZXh0dXJlIGJhc2VkIG9uIGFyZ3VtZW50IHR5cGVcblx0XHRpZiAodHlwZW9mIHNwZWMuc3JjID09PSAnc3RyaW5nJykge1xuXHRcdFx0Ly8gcmVxdWVzdCBzb3VyY2UgZnJvbSB1cmxcblx0XHRcdHNwZWMudHlwZSA9ICdVTlNJR05FRF9CWVRFJztcblx0XHRcdC8vIGNhbGwgYmFzZSBjb25zdHJ1Y3RvclxuXHRcdFx0c3VwZXIoc3BlYyk7XG5cdFx0XHQvLyBUT0RPOiBwdXQgZXh0ZW5zaW9uIGhhbmRsaW5nIGZvciBhcnJheWJ1ZmZlciAvIGltYWdlIC8gdmlkZW8gZGlmZmVyZW50aWF0aW9uXG5cdFx0XHRJbWFnZUxvYWRlci5sb2FkKHtcblx0XHRcdFx0dXJsOiBzcGVjLnNyYyxcblx0XHRcdFx0c3VjY2VzczogaW1hZ2UgPT4ge1xuXHRcdFx0XHRcdC8vIHNldCB0byB1bnNpZ25lZCBieXRlIHR5cGVcblx0XHRcdFx0XHRpbWFnZSA9IFV0aWwucmVzaXplQ2FudmFzKHNwZWMsIGltYWdlKTtcblx0XHRcdFx0XHQvLyBub3cgYnVmZmVyXG5cdFx0XHRcdFx0dGhpcy5idWZmZXJEYXRhKGltYWdlLCBzcGVjLndpZHRoLCBzcGVjLmhlaWdodCk7XG5cdFx0XHRcdFx0dGhpcy5zZXRQYXJhbWV0ZXJzKHRoaXMpO1xuXHRcdFx0XHRcdC8vIGV4ZWN1dGUgY2FsbGJhY2tcblx0XHRcdFx0XHRpZiAoY2FsbGJhY2spIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrKG51bGwsIHRoaXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0ZXJyb3I6IGVyciA9PiB7XG5cdFx0XHRcdFx0aWYgKGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayhlcnIsIG51bGwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmIChVdGlsLmlzQ2FudmFzVHlwZShzcGVjLnNyYykpIHtcblx0XHRcdC8vIGlzIGltYWdlIC8gY2FudmFzIC8gdmlkZW8gdHlwZVxuXHRcdFx0Ly8gc2V0IHRvIHVuc2lnbmVkIGJ5dGUgdHlwZVxuXHRcdFx0c3BlYy50eXBlID0gJ1VOU0lHTkVEX0JZVEUnO1xuXHRcdFx0c3BlYy5zcmMgPSBVdGlsLnJlc2l6ZUNhbnZhcyhzcGVjLCBzcGVjLnNyYyk7XG5cdFx0XHQvLyBjYWxsIGJhc2UgY29uc3RydWN0b3Jcblx0XHRcdHN1cGVyKHNwZWMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBhcnJheSwgYXJyYXlidWZmZXIsIG9yIG51bGxcblx0XHRcdGlmIChzcGVjLnNyYyA9PT0gdW5kZWZpbmVkIHx8IHNwZWMuc3JjID09PSBudWxsKSB7XG5cdFx0XHRcdC8vIGlmIG5vIGRhdGEgaXMgcHJvdmlkZWQsIGFzc3VtZSB0aGlzIHRleHR1cmUgd2lsbCBiZSByZW5kZXJlZFxuXHRcdFx0XHQvLyB0by4gSW4gdGhpcyBjYXNlIGRpc2FibGUgbWlwbWFwcGluZywgdGhlcmUgaXMgbm8gbmVlZCBhbmQgaXRcblx0XHRcdFx0Ly8gd2lsbCBvbmx5IGludHJvZHVjZSB2ZXJ5IHBlY3VsaWFyIGFuZCBkaWZmaWN1bHQgdG8gZGlzY2VyblxuXHRcdFx0XHQvLyByZW5kZXJpbmcgcGhlbm9tZW5hIGluIHdoaWNoIHRoZSB0ZXh0dXJlICd0cmFuc2Zvcm1zJyBhdFxuXHRcdFx0XHQvLyBjZXJ0YWluIGFuZ2xlcyAvIGRpc3RhbmNlcyB0byB0aGUgbWlwbWFwcGVkIChlbXB0eSkgcG9ydGlvbnMuXG5cdFx0XHRcdHNwZWMubWlwTWFwID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHQvLyBidWZmZXIgZnJvbSBhcmdcblx0XHRcdHNwZWMudHlwZSA9IFRZUEVTW3NwZWMudHlwZV0gPyBzcGVjLnR5cGUgOiBERUZBVUxUX1RZUEU7XG5cdFx0XHQvLyBjYWxsIGJhc2UgY29uc3RydWN0b3Jcblx0XHRcdHN1cGVyKHNwZWMpO1xuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yVGV4dHVyZTJEO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBUZXh0dXJlMkQgPSByZXF1aXJlKCcuL1RleHR1cmUyRCcpO1xuXG5jb25zdCBNQUdfRklMVEVSUyA9IHtcblx0TkVBUkVTVDogdHJ1ZSxcblx0TElORUFSOiB0cnVlXG59O1xuY29uc3QgTUlOX0ZJTFRFUlMgPSB7XG5cdE5FQVJFU1Q6IHRydWUsXG5cdExJTkVBUjogdHJ1ZVxufTtcbmNvbnN0IFdSQVBfTU9ERVMgPSB7XG5cdFJFUEVBVDogdHJ1ZSxcblx0Q0xBTVBfVE9fRURHRTogdHJ1ZSxcblx0TUlSUk9SRURfUkVQRUFUOiB0cnVlXG59O1xuY29uc3QgREVQVEhfVFlQRVMgPSB7XG5cdFVOU0lHTkVEX0JZVEU6IHRydWUsXG5cdFVOU0lHTkVEX1NIT1JUOiB0cnVlLFxuXHRVTlNJR05FRF9JTlQ6IHRydWVcbn07XG5jb25zdCBGT1JNQVRTID0ge1xuXHRERVBUSF9DT01QT05FTlQ6IHRydWUsXG5cdERFUFRIX1NURU5DSUw6IHRydWVcbn07XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgdHlwZSBmb3IgZGVwdGggdGV4dHVyZXMuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtzdHJpbmd9XG4gKi9cbmNvbnN0IERFRkFVTFRfVFlQRSA9ICdVTlNJR05FRF9JTlQnO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGZvcm1hdCBmb3IgZGVwdGggdGV4dHVyZXMuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtzdHJpbmd9XG4gKi9cbmNvbnN0IERFRkFVTFRfRk9STUFUID0gJ0RFUFRIX0NPTVBPTkVOVCc7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgd3JhcCBtb2RlIGZvciBkZXB0aCB0ZXh0dXJlcy5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge3N0cmluZ31cbiAqL1xuY29uc3QgREVGQVVMVF9XUkFQID0gJ0NMQU1QX1RPX0VER0UnO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IG1pbiAvIG1hZyBmaWx0ZXIgZm9yIGRlcHRoIHRleHR1cmVzLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7c3RyaW5nfVxuICovXG5jb25zdCBERUZBVUxUX0ZJTFRFUiA9ICdMSU5FQVInO1xuXG4vKipcbiAqIEEgdGV4dHVyZSBjbGFzcyB0byByZXByZXNlbnQgYSAyRCBkZXB0aCB0ZXh0dXJlLlxuICogQGF1Z21lbnRzIFRleHR1cmUyRFxuICovXG5jbGFzcyBEZXB0aFRleHR1cmUyRCBleHRlbmRzIFRleHR1cmUyRCB7XG5cblx0LyoqXG5cdCAqIEluc3RhbnRpYXRlcyBhIERlcHRoVGV4dHVyZTJEIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgc3BlY2lmaWNhdGlvbiBhcmd1bWVudHMuXG5cdCAqIEBwYXJhbSB7VWludDhBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheX0gc3BlYy5zcmMgLSBUaGUgZGF0YSB0byBidWZmZXIuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzcGVjLndpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB0ZXh0dXJlLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gc3BlYy5oZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB0ZXh0dXJlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHNwZWMuZm9ybWF0IC0gVGhlIHRleHR1cmUgcGl4ZWwgZm9ybWF0LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy50eXBlIC0gVGhlIHRleHR1cmUgcGl4ZWwgY29tcG9uZW50IHR5cGUuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihzcGVjID0ge30pIHtcblx0XHQvLyBnZXQgc3BlY2lmaWMgcGFyYW1zXG5cdFx0c3BlYy53cmFwUyA9IHNwZWMud3JhcFMgfHwgc3BlYy53cmFwO1xuXHRcdHNwZWMud3JhcFQgPSBzcGVjLndyYXBUIHx8IHNwZWMud3JhcDtcblx0XHRzcGVjLm1pbkZpbHRlciA9IHNwZWMubWluRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xuXHRcdHNwZWMubWFnRmlsdGVyID0gc3BlYy5tYWdGaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XG5cdFx0Ly8gc2V0IHRleHR1cmUgcGFyYW1zXG5cdFx0c3BlYy53cmFwUyA9IFdSQVBfTU9ERVNbc3BlYy53cmFwU10gPyBzcGVjLndyYXBTIDogREVGQVVMVF9XUkFQO1xuXHRcdHNwZWMud3JhcFQgPSBXUkFQX01PREVTW3NwZWMud3JhcFRdID8gc3BlYy53cmFwVCA6IERFRkFVTFRfV1JBUDtcblx0XHRzcGVjLm1pbkZpbHRlciA9IE1JTl9GSUxURVJTW3NwZWMubWluRmlsdGVyXSA/IHNwZWMubWluRmlsdGVyIDogREVGQVVMVF9GSUxURVI7XG5cdFx0c3BlYy5tYWdGaWx0ZXIgPSBNQUdfRklMVEVSU1tzcGVjLm1hZ0ZpbHRlcl0gPyBzcGVjLm1hZ0ZpbHRlciA6IERFRkFVTFRfRklMVEVSO1xuXHRcdC8vIHNldCBtaXAtbWFwcGluZyBhbmQgZm9ybWF0XG5cdFx0c3BlYy5taXBNYXAgPSBmYWxzZTsgLy8gZGlzYWJsZSBtaXAtbWFwcGluZ1xuXHRcdHNwZWMuaW52ZXJ0WSA9IGZhbHNlOyAvLyBubyBuZWVkIHRvIGludmVydC15XG5cdFx0c3BlYy5wcmVtdWx0aXBseUFscGhhID0gZmFsc2U7IC8vIG5vIGFscGhhIHRvIHByZS1tdWx0aXBseVxuXHRcdHNwZWMuZm9ybWF0ID0gRk9STUFUU1tzcGVjLmZvcm1hdF0gPyBzcGVjLmZvcm1hdCA6IERFRkFVTFRfRk9STUFUO1xuXHRcdC8vIGNoZWNrIGlmIHN0ZW5jaWwtZGVwdGgsIG9yIGp1c3QgZGVwdGhcblx0XHRpZiAoc3BlYy5mb3JtYXQgPT09ICdERVBUSF9TVEVOQ0lMJykge1xuXHRcdFx0c3BlYy50eXBlID0gJ1VOU0lHTkVEX0lOVF8yNF84X1dFQkdMJztcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3BlYy50eXBlID0gREVQVEhfVFlQRVNbc3BlYy50eXBlXSA/IHNwZWMudHlwZSA6IERFRkFVTFRfVFlQRTtcblx0XHR9XG5cdFx0Ly8gY2FsbCBiYXNlIGNvbnN0cnVjdG9yXG5cdFx0c3VwZXIoc3BlYyk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEZXB0aFRleHR1cmUyRDtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcblxuY29uc3QgVFlQRVMgPSB7XG5cdFVOU0lHTkVEX0JZVEU6IHRydWUsXG5cdFVOU0lHTkVEX1NIT1JUOiB0cnVlLFxuXHRVTlNJR05FRF9JTlQ6IHRydWVcbn07XG5jb25zdCBNT0RFUyA9IHtcblx0UE9JTlRTOiB0cnVlLFxuXHRMSU5FUzogdHJ1ZSxcblx0TElORV9TVFJJUDogdHJ1ZSxcblx0TElORV9MT09QOiB0cnVlLFxuXHRUUklBTkdMRVM6IHRydWUsXG5cdFRSSUFOR0xFX1NUUklQOiB0cnVlLFxuXHRUUklBTkdMRV9GQU46IHRydWVcbn07XG5jb25zdCBCWVRFU19QRVJfVFlQRSA9IHtcblx0VU5TSUdORURfQllURTogMSxcblx0VU5TSUdORURfU0hPUlQ6IDIsXG5cdFVOU0lHTkVEX0lOVDogNFxufTtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBjb21wb25lbnQgdHlwZS5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge3N0cmluZ31cbiAqL1xuY29uc3QgREVGQVVMVF9UWVBFID0gJ1VOU0lHTkVEX1NIT1JUJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCByZW5kZXIgbW9kZSAocHJpbWl0aXZlIHR5cGUpLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7c3RyaW5nfVxuICovXG5jb25zdCBERUZBVUxUX01PREUgPSAnVFJJQU5HTEVTJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBieXRlIG9mZnNldCB0byByZW5kZXIgZnJvbS5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge251bWJlcn1cbiAqL1xuY29uc3QgREVGQVVMVF9CWVRFX09GRlNFVCA9IDA7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgY291bnQgb2YgaW5kaWNlcyB0byByZW5kZXIuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtudW1iZXJ9XG4gKi9cbmNvbnN0IERFRkFVTFRfQ09VTlQgPSAwO1xuXG4vKipcbiAqIEFuIGluZGV4IGJ1ZmZlciBjbGFzcyB0byBob2xlIGluZGV4aW5nIGluZm9ybWF0aW9uLlxuICovXG5jbGFzcyBJbmRleEJ1ZmZlciB7XG5cblx0LyoqXG5cdCAqIEluc3RhbnRpYXRlcyBhbiBJbmRleEJ1ZmZlciBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7V2ViR0xCdWZmZXJ8VWludDhBcnJheXxVaW50MTZBcnJheXxVaW4zMkFycmF5fEFycmF5fE51bWJlcn0gYXJnIC0gVGhlIGluZGV4IGRhdGEgdG8gYnVmZmVyLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSByZW5kZXJpbmcgb3B0aW9ucy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuYnl0ZU9mZnNldCAtIFRoZSBieXRlIG9mZnNldCBpbnRvIHRoZSBkcmF3biBidWZmZXIuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvdW50IC0gVGhlIG51bWJlciBvZiB2ZXJ0aWNlcyB0byBkcmF3LlxuXHQgKi9cblx0Y29uc3RydWN0b3IoYXJnLCBvcHRpb25zID0ge30pIHtcblx0XHR0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xuXHRcdHRoaXMuYnVmZmVyID0gbnVsbDtcblx0XHR0aGlzLnR5cGUgPSBUWVBFU1tvcHRpb25zLnR5cGVdID8gb3B0aW9ucy50eXBlIDogREVGQVVMVF9UWVBFO1xuXHRcdHRoaXMubW9kZSA9IE1PREVTW29wdGlvbnMubW9kZV0gPyBvcHRpb25zLm1vZGUgOiBERUZBVUxUX01PREU7XG5cdFx0dGhpcy5jb3VudCA9IChvcHRpb25zLmNvdW50ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5jb3VudCA6IERFRkFVTFRfQ09VTlQ7XG5cdFx0dGhpcy5ieXRlT2Zmc2V0ID0gKG9wdGlvbnMuYnl0ZU9mZnNldCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuYnl0ZU9mZnNldCA6IERFRkFVTFRfQllURV9PRkZTRVQ7XG5cdFx0aWYgKGFyZykge1xuXHRcdFx0aWYgKGFyZyBpbnN0YW5jZW9mIFdlYkdMQnVmZmVyKSB7XG5cdFx0XHRcdC8vIFdlYkdMQnVmZmVyIGFyZ3VtZW50XG5cdFx0XHRcdHRoaXMuYnVmZmVyID0gYXJnO1xuXHRcdFx0fSBlbHNlIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGFyZykpIHtcblx0XHRcdFx0Ly8gYnl0ZSBsZW5ndGggYXJndW1lbnRcblx0XHRcdFx0aWYgKG9wdGlvbnMudHlwZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0dGhyb3cgJ0FyZ3VtZW50IG9mIHR5cGUgYG51bWJlcmAgbXVzdCBiZSBjb21wbGltZW50ZWQgd2l0aCBhIGNvcnJlc3BvbmRpbmcgYG9wdGlvbnMudHlwZWAnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuYnVmZmVyRGF0YShhcmcpO1xuXHRcdFx0fSBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuXHRcdFx0XHQvLyBBcnJheUJ1ZmZlciBhcmdcblx0XHRcdFx0aWYgKG9wdGlvbnMudHlwZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0dGhyb3cgJ0FyZ3VtZW50IG9mIHR5cGUgYEFycmF5QnVmZmVyYCBtdXN0IGJlIGNvbXBsaW1lbnRlZCB3aXRoIGEgY29ycmVzcG9uZGluZyBgb3B0aW9ucy50eXBlYCc7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5idWZmZXJEYXRhKGFyZyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBBcnJheSBvciBBcnJheUJ1ZmZlclZpZXcgYXJndW1lbnRcblx0XHRcdFx0dGhpcy5idWZmZXJEYXRhKGFyZyk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChvcHRpb25zLnR5cGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aHJvdyAnRW1wdHkgYnVmZmVyIG11c3QgYmUgY29tcGxpbWVudGVkIHdpdGggYSBjb3JyZXNwb25kaW5nIGBvcHRpb25zLnR5cGVgJztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVXBsb2FkIGluZGV4IGRhdGEgdG8gdGhlIEdQVS5cblx0ICpcblx0ICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcnxBcnJheUJ1ZmZlclZpZXd8bnVtYmVyfSBhcmcgLSBUaGUgYXJyYXkgb2YgZGF0YSB0byBidWZmZXIuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtJbmRleEJ1ZmZlcn0gVGhlIGluZGV4IGJ1ZmZlciBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdGJ1ZmZlckRhdGEoYXJnKSB7XG5cdFx0Y29uc3QgZ2wgPSB0aGlzLmdsO1xuXHRcdC8vIGNhc3QgYXJyYXkgdG8gQXJyYXlCdWZmZXJWaWV3IGJhc2VkIG9uIHByb3ZpZGVkIHR5cGVcblx0XHRpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG5cdFx0XHQvLyBjaGVjayBmb3IgdHlwZVxuXHRcdFx0aWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX0lOVCcpIHtcblx0XHRcdFx0Ly8gYnVmZmVyIHRvIHVpbnQzMlxuXHRcdFx0XHRhcmcgPSBuZXcgVWludDMyQXJyYXkoYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfU0hPUlQnKSB7XG5cdFx0XHRcdC8vIGJ1ZmZlciB0byB1aW50MTZcblx0XHRcdFx0YXJnID0gbmV3IFVpbnQxNkFycmF5KGFyZyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBidWZmZXIgdG8gdWludDhcblx0XHRcdFx0YXJnID0gbmV3IFVpbnQ4QXJyYXkoYXJnKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gc2V0IGVuc3VyZSB0eXBlIGNvcnJlc3BvbmRzIHRvIGRhdGFcblx0XHRcdGlmIChhcmcgaW5zdGFuY2VvZiBVaW50MzJBcnJheSkge1xuXHRcdFx0XHR0aGlzLnR5cGUgPSAnVU5TSUdORURfSU5UJztcblx0XHRcdH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgVWludDE2QXJyYXkpIHtcblx0XHRcdFx0dGhpcy50eXBlID0gJ1VOU0lHTkVEX1NIT1JUJztcblx0XHRcdH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuXHRcdFx0XHR0aGlzLnR5cGUgPSAnVU5TSUdORURfQllURSc7XG5cdFx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0XHQhKGFyZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSAmJlxuXHRcdFx0XHQhKE51bWJlci5pc0ludGVnZXIoYXJnKSlcblx0XHRcdFx0KSB7XG5cdFx0XHRcdHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgYEFycmF5QnVmZmVyVmlld2AsIG9yIGBudW1iZXJgJztcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gY2hlY2sgdGhhdCB0aGUgdHlwZSBpcyBzdXBwb3J0ZWQgYnkgZXh0ZW5zaW9uXG5cdFx0aWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX0lOVCcgJiZcblx0XHRcdCFXZWJHTENvbnRleHQuY2hlY2tFeHRlbnNpb24oJ09FU19lbGVtZW50X2luZGV4X3VpbnQnKSkge1xuXHRcdFx0dGhyb3cgJ0Nhbm5vdCBjcmVhdGUgSW5kZXhCdWZmZXIgb2YgdHlwZSBgVU5TSUdORURfSU5UYCBhcyBleHRlbnNpb24gYE9FU19lbGVtZW50X2luZGV4X3VpbnRgIGlzIG5vdCBzdXBwb3J0ZWQnO1xuXHRcdH1cblx0XHQvLyBkb24ndCBvdmVyd3JpdGUgdGhlIGNvdW50IGlmIGl0IGlzIGFscmVhZHkgc2V0XG5cdFx0aWYgKHRoaXMuY291bnQgPT09IERFRkFVTFRfQ09VTlQpIHtcblx0XHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKGFyZykpIHtcblx0XHRcdFx0dGhpcy5jb3VudCA9IChhcmcgLyBCWVRFU19QRVJfVFlQRVt0aGlzLnR5cGVdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuY291bnQgPSBhcmcubGVuZ3RoO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBjcmVhdGUgYnVmZmVyIGlmIGl0IGRvZXNuJ3QgZXhpc3QgYWxyZWFkeVxuXHRcdGlmICghdGhpcy5idWZmZXIpIHtcblx0XHRcdHRoaXMuYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cdFx0fVxuXHRcdC8vIGJ1ZmZlciB0aGUgZGF0YVxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVyKTtcblx0XHRnbC5idWZmZXJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBhcmcsIGdsLlNUQVRJQ19EUkFXKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBVcGxvYWQgcGFydGlhbCBpbmRleCBkYXRhIHRvIHRoZSBHUFUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7QXJyYXl8QXJyYXlCdWZmZXJ8QXJyYXlCdWZmZXJWaWV3fSBhcnJheSAtIFRoZSBhcnJheSBvZiBkYXRhIHRvIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVPZmZzZXQgLSBUaGUgYnl0ZSBvZmZzZXQgYXQgd2hpY2ggdG8gYnVmZmVyLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7SW5kZXhCdWZmZXJ9IFRoZSBpbmRleCBidWZmZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRidWZmZXJTdWJEYXRhKGFycmF5LCBieXRlT2Zmc2V0ID0gREVGQVVMVF9CWVRFX09GRlNFVCkge1xuXHRcdGNvbnN0IGdsID0gdGhpcy5nbDtcblx0XHRpZiAoIXRoaXMuYnVmZmVyKSB7XG5cdFx0XHR0aHJvdyAnQnVmZmVyIGhhcyBub3QgeWV0IGJlZW4gYWxsb2NhdGVkLCBhbGxvY2F0ZSB3aXRoIGBidWZmZXJEYXRhYCc7XG5cdFx0fVxuXHRcdC8vIGNhc3QgYXJyYXkgdG8gQXJyYXlCdWZmZXJWaWV3IGJhc2VkIG9uIHByb3ZpZGVkIHR5cGVcblx0XHRpZiAoQXJyYXkuaXNBcnJheShhcnJheSkpIHtcblx0XHRcdC8vIGNoZWNrIGZvciB0eXBlXG5cdFx0XHRpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfSU5UJykge1xuXHRcdFx0XHQvLyBidWZmZXIgdG8gdWludDMyXG5cdFx0XHRcdGFycmF5ID0gbmV3IFVpbnQzMkFycmF5KGFycmF5KTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfU0hPUlQnKSB7XG5cdFx0XHRcdC8vIGJ1ZmZlciB0byB1aW50MTZcblx0XHRcdFx0YXJyYXkgPSBuZXcgVWludDE2QXJyYXkoYXJyYXkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gYnVmZmVyIHRvIHVpbnQ4XG5cdFx0XHRcdGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoXG5cdFx0XHQhKGFycmF5IGluc3RhbmNlb2YgVWludDhBcnJheSkgJiZcblx0XHRcdCEoYXJyYXkgaW5zdGFuY2VvZiBVaW50MTZBcnJheSkgJiZcblx0XHRcdCEoYXJyYXkgaW5zdGFuY2VvZiBVaW50MzJBcnJheSkgJiZcblx0XHRcdCEoYXJyYXkgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikpIHtcblx0XHRcdHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgb3IgYEFycmF5QnVmZmVyVmlld2AnO1xuXHRcdH1cblx0XHRnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcik7XG5cdFx0Z2wuYnVmZmVyU3ViRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgYnl0ZU9mZnNldCwgYXJyYXkpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGUgdGhlIGRyYXcgY29tbWFuZCBmb3IgdGhlIGJvdW5kIGJ1ZmZlci5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBwYXNzIHRvICdkcmF3RWxlbWVudHMnLiBPcHRpb25hbC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuYnl0ZU9mZnNldCAtIFRoZSBieXRlT2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuY291bnQgLSBUaGUgbnVtYmVyIG9mIHZlcnRpY2VzIHRvIGRyYXcuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtJbmRleEJ1ZmZlcn0gVGhlIGluZGV4IGJ1ZmZlciBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdGRyYXcob3B0aW9ucyA9IHt9KSB7XG5cdFx0Y29uc3QgZ2wgPSB0aGlzLmdsO1xuXHRcdGNvbnN0IG1vZGUgPSBnbFtvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlXTtcblx0XHRjb25zdCB0eXBlID0gZ2xbdGhpcy50eXBlXTtcblx0XHRjb25zdCBieXRlT2Zmc2V0ID0gKG9wdGlvbnMuYnl0ZU9mZnNldCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuYnl0ZU9mZnNldCA6IHRoaXMuYnl0ZU9mZnNldDtcblx0XHRjb25zdCBjb3VudCA9IChvcHRpb25zLmNvdW50ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5jb3VudCA6IHRoaXMuY291bnQ7XG5cdFx0aWYgKGNvdW50ID09PSAwKSB7XG5cdFx0XHR0aHJvdyAnQXR0ZW1wdGluZyB0byBkcmF3IHdpdGggYSBjb3VudCBvZiAwJztcblx0XHR9XG5cdFx0Ly8gYmluZCBidWZmZXJcblx0XHRnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcik7XG5cdFx0Ly8gZHJhdyBlbGVtZW50c1xuXHRcdGdsLmRyYXdFbGVtZW50cyhtb2RlLCBjb3VudCwgdHlwZSwgYnl0ZU9mZnNldCk7XG5cdFx0Ly8gbm8gbmVlZCB0byB1bmJpbmRcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEluZGV4QnVmZmVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpO1xuXG5jb25zdCBURVhUVVJFX1RBUkdFVFMgPSB7XG5cdFRFWFRVUkVfMkQ6IHRydWUsXG5cdFRFWFRVUkVfQ1VCRV9NQVA6IHRydWVcbn07XG5jb25zdCBERVBUSF9GT1JNQVRTID0ge1xuXHRERVBUSF9DT01QT05FTlQ6IHRydWUsXG5cdERFUFRIX1NURU5DSUw6IHRydWVcbn07XG5cbi8qKlxuICogQSByZW5kZXIgdGFyZ2V0IGNsYXNzIHRvIGFsbG93IHJlbmRlcmluZyB0byB0ZXh0dXJlcy5cbiAqL1xuY2xhc3MgUmVuZGVyVGFyZ2V0IHtcblxuXHQvKipcblx0ICogSW5zdGFudGlhdGVzIGEgUmVuZGVyVGFyZ2V0IG9iamVjdC5cblx0ICovXG5cdCBjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xuXHRcdHRoaXMuZnJhbWVidWZmZXIgPSB0aGlzLmdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XG5cdFx0dGhpcy50ZXh0dXJlcyA9IG5ldyBNYXAoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBCaW5kcyB0aGUgcmVuZGVyVGFyZ2V0IG9iamVjdC5cblx0ICpcblx0ICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdGJpbmQoKSB7XG5cdFx0Ly8gYmluZCBmcmFtZWJ1ZmZlclxuXHRcdGNvbnN0IGdsID0gdGhpcy5nbDtcblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIHRoaXMuZnJhbWVidWZmZXIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVuYmluZHMgdGhlIHJlbmRlclRhcmdldCBvYmplY3QuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHR1bmJpbmQoKSB7XG5cdFx0Ly8gdW5iaW5kIGZyYW1lYnVmZmVyXG5cdFx0Y29uc3QgZ2wgPSB0aGlzLmdsO1xuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogQXR0YWNoZXMgdGhlIHByb3ZpZGVkIHRleHR1cmUgdG8gdGhlIHByb3ZpZGVkIGF0dGFjaG1lbnQgbG9jYXRpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSB7VGV4dHVyZTJEfSB0ZXh0dXJlIC0gVGhlIHRleHR1cmUgdG8gYXR0YWNoLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBUaGUgYXR0YWNobWVudCBpbmRleC4gKG9wdGlvbmFsKVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0IC0gVGhlIHRleHR1cmUgdGFyZ2V0IHR5cGUuIChvcHRpb25hbClcblx0ICpcblx0ICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHNldENvbG9yVGFyZ2V0KHRleHR1cmUsIGluZGV4LCB0YXJnZXQpIHtcblx0XHRjb25zdCBnbCA9IHRoaXMuZ2w7XG5cdFx0aWYgKCF0ZXh0dXJlKSB7XG5cdFx0XHR0aHJvdyAnVGV4dHVyZSBhcmd1bWVudCBpcyBtaXNzaW5nJztcblx0XHR9XG5cdFx0aWYgKFRFWFRVUkVfVEFSR0VUU1tpbmRleF0gJiYgdGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRhcmdldCA9IGluZGV4O1xuXHRcdFx0aW5kZXggPSAwO1xuXHRcdH1cblx0XHRpZiAoaW5kZXggPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0aW5kZXggPSAwO1xuXHRcdH0gZWxzZSBpZiAoIU51bWJlci5pc0ludGVnZXIoaW5kZXgpIHx8IGluZGV4IDwgMCkge1xuXHRcdFx0dGhyb3cgJ1RleHR1cmUgY29sb3IgYXR0YWNobWVudCBpbmRleCBpcyBpbnZhbGlkJztcblx0XHR9XG5cdFx0aWYgKHRhcmdldCAmJiAhVEVYVFVSRV9UQVJHRVRTW3RhcmdldF0pIHtcblx0XHRcdHRocm93ICdUZXh0dXJlIHRhcmdldCBpcyBpbnZhbGlkJztcblx0XHR9XG5cdFx0dGhpcy50ZXh0dXJlcy5zZXQoYGNvbG9yXyR7aW5kZXh9YCwgdGV4dHVyZSk7XG5cdFx0dGhpcy5iaW5kKCk7XG5cdFx0Z2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoXG5cdFx0XHRnbC5GUkFNRUJVRkZFUixcblx0XHRcdGdsWydDT0xPUl9BVFRBQ0hNRU5UJyArIGluZGV4XSxcblx0XHRcdGdsW3RhcmdldCB8fCAnVEVYVFVSRV8yRCddLFxuXHRcdFx0dGV4dHVyZS50ZXh0dXJlLFxuXHRcdFx0MCk7XG5cdFx0dGhpcy51bmJpbmQoKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBBdHRhY2hlcyB0aGUgcHJvdmlkZWQgdGV4dHVyZSB0byB0aGUgcHJvdmlkZWQgYXR0YWNobWVudCBsb2NhdGlvbi5cblx0ICpcblx0ICogQHBhcmFtIHtUZXh0dXJlMkR9IHRleHR1cmUgLSBUaGUgdGV4dHVyZSB0byBhdHRhY2guXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRzZXREZXB0aFRhcmdldCh0ZXh0dXJlKSB7XG5cdFx0aWYgKCF0ZXh0dXJlKSB7XG5cdFx0XHR0aHJvdyAnVGV4dHVyZSBhcmd1bWVudCBpcyBtaXNzaW5nJztcblx0XHR9XG5cdFx0aWYgKCFERVBUSF9GT1JNQVRTW3RleHR1cmUuZm9ybWF0XSkge1xuXHRcdFx0dGhyb3cgJ1Byb3ZpZGVkIHRleHR1cmUgaXMgbm90IG9mIGZvcm1hdCBgREVQVEhfQ09NUE9ORU5UYCBvciBgREVQVEhfU1RFTkNJTGAnO1xuXHRcdH1cblx0XHRjb25zdCBnbCA9IHRoaXMuZ2w7XG5cdFx0dGhpcy50ZXh0dXJlcy5zZXQoJ2RlcHRoJywgdGV4dHVyZSk7XG5cdFx0dGhpcy5iaW5kKCk7XG5cdFx0Z2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoXG5cdFx0XHRnbC5GUkFNRUJVRkZFUixcblx0XHRcdGdsLkRFUFRIX0FUVEFDSE1FTlQsXG5cdFx0XHRnbC5URVhUVVJFXzJELFxuXHRcdFx0dGV4dHVyZS50ZXh0dXJlLFxuXHRcdFx0MCk7XG5cdFx0dGhpcy51bmJpbmQoKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXNpemVzIHRoZSByZW5kZXJUYXJnZXQgYW5kIGFsbCBhdHRhY2hlZCB0ZXh0dXJlcyBieSB0aGUgcHJvdmlkZWQgaGVpZ2h0IGFuZCB3aWR0aC5cblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0gVGhlIG5ldyB3aWR0aCBvZiB0aGUgcmVuZGVyVGFyZ2V0LlxuXHQgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0gVGhlIG5ldyBoZWlnaHQgb2YgdGhlIHJlbmRlclRhcmdldC5cblx0ICpcblx0ICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHJlc2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0aWYgKHR5cGVvZiB3aWR0aCAhPT0gJ251bWJlcicgfHwgKHdpZHRoIDw9IDApKSB7XG5cdFx0XHR0aHJvdyBgUHJvdmlkZWQgXFxgd2lkdGhcXGAgb2YgJHt3aWR0aH0gaXMgaW52YWxpZGA7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgaGVpZ2h0ICE9PSAnbnVtYmVyJyB8fCAoaGVpZ2h0IDw9IDApKSB7XG5cdFx0XHR0aHJvdyBgUHJvdmlkZWQgXFxgaGVpZ2h0XFxgIG9mICR7aGVpZ2h0fSBpcyBpbnZhbGlkYDtcblx0XHR9XG5cdFx0dGhpcy50ZXh0dXJlcy5mb3JFYWNoKHRleHR1cmUgPT4ge1xuXHRcdFx0dGV4dHVyZS5yZXNpemUod2lkdGgsIGhlaWdodCk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJUYXJnZXQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFZlcnRleFBhY2thZ2UgPSByZXF1aXJlKCcuL1ZlcnRleFBhY2thZ2UnKTtcbmNvbnN0IFZlcnRleEJ1ZmZlciA9IHJlcXVpcmUoJy4vVmVydGV4QnVmZmVyJyk7XG5jb25zdCBJbmRleEJ1ZmZlciA9IHJlcXVpcmUoJy4vSW5kZXhCdWZmZXInKTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGFsbCB2ZXJ0ZXggYnVmZmVycyBhbmQgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgY291bnRzIGFyZVxuICogbm90IGVxdWFsLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdmVydGV4QnVmZmVycyAtIFRoZSBhcnJheSBvZiB2ZXJ0ZXhCdWZmZXJzLlxuICovXG5mdW5jdGlvbiBjaGVja1ZlcnRleEJ1ZmZlckNvdW50cyh2ZXJ0ZXhCdWZmZXJzKSB7XG5cdGxldCBjb3VudCA9IG51bGw7XG5cdHZlcnRleEJ1ZmZlcnMuZm9yRWFjaChidWZmZXIgPT4ge1xuXHRcdGlmIChjb3VudCA9PT0gbnVsbCkge1xuXHRcdFx0Y291bnQgPSBidWZmZXIuY291bnQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChjb3VudCAhPT0gYnVmZmVyLmNvdW50KSB7XG5cdFx0XHRcdHRocm93ICdWZXJ0ZXhCdWZmZXJzIG11c3QgYWxsIGhhdmUgdGhlIHNhbWUgY291bnQgdG8gYmUgJyArXG5cdFx0XHRcdFx0J3JlbmRlcmVkIHdpdGhvdXQgYW4gSW5kZXhCdWZmZXIsIG1pc21hdGNoIG9mICcgK1xuXHRcdFx0XHRcdGAke2NvdW50fSBhbmQgJHtidWZmZXIuY291bnR9IGZvdW5kYDtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufVxuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgYWxsIGF0dHJpYnV0ZSBwb2ludGVycyBhbmQgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiBhbiBpbmRleFxuICogb2NjdXJzIG1vcmUgdGhhbiBvbmNlLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdmVydGV4QnVmZmVycyAtIFRoZSBhcnJheSBvZiB2ZXJ0ZXhCdWZmZXJzLlxuICovXG5mdW5jdGlvbiBjaGVja0luZGV4Q29sbGlzaW9ucyh2ZXJ0ZXhCdWZmZXJzKSB7XG5cdGNvbnN0IGluZGljZXMgPSBuZXcgTWFwKCk7XG5cdHZlcnRleEJ1ZmZlcnMuZm9yRWFjaChidWZmZXIgPT4ge1xuXHRcdGJ1ZmZlci5wb2ludGVycy5mb3JFYWNoKChwb2ludGVyLCBpbmRleCkgPT4ge1xuXHRcdFx0Y29uc3QgY291bnQgPSBpbmRpY2VzLmdldChpbmRleCkgfHwgMDtcblx0XHRcdGluZGljZXMuc2V0KGluZGV4LCBjb3VudCArIDEpO1xuXHRcdH0pO1xuXHR9KTtcblx0aW5kaWNlcy5mb3JFYWNoKGluZGV4ID0+IHtcblx0XHRpZiAoaW5kZXggPiAxKSB7XG5cdFx0XHR0aHJvdyBgTW9yZSB0aGFuIG9uZSBhdHRyaWJ1dGUgcG9pbnRlciBleGlzdHMgZm9yIGluZGV4IFxcYCR7aW5kZXh9XFxgYDtcblx0XHR9XG5cdH0pO1xufVxuXG4vKipcbiAqIEEgY29udGFpbmVyIGZvciBvbmUgb3IgbW9yZSBWZXJ0ZXhCdWZmZXJzIGFuZCBhbiBvcHRpb25hbCBJbmRleEJ1ZmZlci5cbiAqL1xuY2xhc3MgUmVuZGVyYWJsZSB7XG5cblx0LyoqXG5cdCAqIEluc3RhbnRpYXRlcyBhbiBSZW5kZXJhYmxlIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgcmVuZGVyYWJsZSBzcGVjaWZpY2F0aW9uIG9iamVjdC5cblx0ICogQHBhcmFtIHtBcnJheXxGbG9hdDMyQXJyYXl9IHNwZWMudmVydGljZXMgLSBUaGUgdmVydGljZXMgdG8gaW50ZXJsZWF2ZSBhbmQgYnVmZmVyLlxuXHQgKiBAcGFyYW0ge1ZlcnRleEJ1ZmZlcn0gc3BlYy52ZXJ0ZXhCdWZmZXIgLSBBbiBleGlzdGluZyB2ZXJ0ZXggYnVmZmVyLlxuXHQgKiBAcGFyYW0ge1ZlcnRleEJ1ZmZlcltdfSBzcGVjLnZlcnRleEJ1ZmZlcnMgLSBNdWx0aXBsZSBleGlzdGluZyB2ZXJ0ZXggYnVmZmVycy5cblx0ICogQHBhcmFtIHtBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheX0gc3BlYy5pbmRpY2VzIC0gVGhlIGluZGljZXMgdG8gYnVmZmVyLlxuXHQgKiBAcGFyYW0ge0luZGV4QnVmZmVyfSBzcGVjLmluZGV4YnVmZmVyIC0gQW4gZXhpc3RpbmcgaW5kZXggYnVmZmVyLlxuXHQgKi9cblx0Y29uc3RydWN0b3Ioc3BlYyA9IHt9KSB7XG5cdFx0aWYgKHNwZWMudmVydGV4QnVmZmVyIHx8IHNwZWMudmVydGV4QnVmZmVycykge1xuXHRcdFx0Ly8gdXNlIGV4aXN0aW5nIHZlcnRleCBidWZmZXJcblx0XHRcdHRoaXMudmVydGV4QnVmZmVycyA9IHNwZWMudmVydGV4QnVmZmVycyB8fCBbc3BlYy52ZXJ0ZXhCdWZmZXJdO1xuXHRcdH0gZWxzZSBpZiAoc3BlYy52ZXJ0aWNlcykge1xuXHRcdFx0Ly8gY3JlYXRlIHZlcnRleCBwYWNrYWdlXG5cdFx0XHRjb25zdCB2ZXJ0ZXhQYWNrYWdlID0gbmV3IFZlcnRleFBhY2thZ2Uoc3BlYy52ZXJ0aWNlcyk7XG5cdFx0XHQvLyBjcmVhdGUgdmVydGV4IGJ1ZmZlclxuXHRcdFx0dGhpcy52ZXJ0ZXhCdWZmZXJzID0gW1xuXHRcdFx0XHRuZXcgVmVydGV4QnVmZmVyKHZlcnRleFBhY2thZ2UuYnVmZmVyLCB2ZXJ0ZXhQYWNrYWdlLnBvaW50ZXJzKVxuXHRcdFx0XTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy52ZXJ0ZXhCdWZmZXJzID0gW107XG5cdFx0fVxuXHRcdGlmIChzcGVjLmluZGV4QnVmZmVyKSB7XG5cdFx0XHQvLyB1c2UgZXhpc3RpbmcgaW5kZXggYnVmZmVyXG5cdFx0XHR0aGlzLmluZGV4QnVmZmVyID0gc3BlYy5pbmRleEJ1ZmZlcjtcblx0XHR9IGVsc2UgaWYgKHNwZWMuaW5kaWNlcykge1xuXHRcdFx0Ly8gY3JlYXRlIGluZGV4IGJ1ZmZlclxuXHRcdFx0dGhpcy5pbmRleEJ1ZmZlciA9IG5ldyBJbmRleEJ1ZmZlcihzcGVjLmluZGljZXMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmluZGV4QnVmZmVyID0gbnVsbDtcblx0XHR9XG5cdFx0Ly8gaWYgdGhlcmUgaXMgbm8gaW5kZXggYnVmZmVyLCBjaGVjayB0aGF0IHZlcnRleCBidWZmZXJzIGFsbCBoYXZlXG5cdFx0Ly8gdGhlIHNhbWUgY291bnRcblx0XHRpZiAoIXRoaXMuaW5kZXhCdWZmZXIpIHtcblx0XHRcdGNoZWNrVmVydGV4QnVmZmVyQ291bnRzKHRoaXMudmVydGV4QnVmZmVycyk7XG5cdFx0fVxuXHRcdC8vIGNoZWNrIHRoYXQgbm8gYXR0cmlidXRlIGluZGljZXMgY2xhc2hcblx0XHRjaGVja0luZGV4Q29sbGlzaW9ucyh0aGlzLnZlcnRleEJ1ZmZlcnMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGUgdGhlIGRyYXcgY29tbWFuZCBmb3IgdGhlIHVuZGVybHlpbmcgYnVmZmVycy5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBwYXNzIHRvICdkcmF3RWxlbWVudHMnLiBPcHRpb25hbC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuYnl0ZU9mZnNldCAtIFRoZSBieXRlT2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuaW5kZXhPZmZzZXQgLSBUaGUgaW5kZXhPZmZzZXQgaW50byB0aGUgZHJhd24gYnVmZmVyLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5jb3VudCAtIFRoZSBudW1iZXIgb2YgdmVydGljZXMgdG8gZHJhdy5cblx0ICpcblx0ICogQHJldHVybnMge1JlbmRlcmFibGV9IC0gVGhlIHJlbmRlcmFibGUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRkcmF3KG9wdGlvbnMgPSB7fSkge1xuXHRcdC8vIGRyYXcgdGhlIHJlbmRlcmFibGVcblx0XHRpZiAodGhpcy5pbmRleEJ1ZmZlcikge1xuXHRcdFx0Ly8gdXNlIGluZGV4IGJ1ZmZlciB0byBkcmF3IGVsZW1lbnRzXG5cdFx0XHQvLyBiaW5kIHZlcnRleCBidWZmZXJzIGFuZCBlbmFibGUgYXR0cmlidXRlIHBvaW50ZXJzXG5cdFx0XHR0aGlzLnZlcnRleEJ1ZmZlcnMuZm9yRWFjaCh2ZXJ0ZXhCdWZmZXIgPT4ge1xuXHRcdFx0XHR2ZXJ0ZXhCdWZmZXIuYmluZCgpO1xuXHRcdFx0fSk7XG5cdFx0XHQvLyBkcmF3IHByaW1pdGl2ZXMgdXNpbmcgaW5kZXggYnVmZmVyXG5cdFx0XHR0aGlzLmluZGV4QnVmZmVyLmRyYXcob3B0aW9ucyk7XG5cdFx0XHQvLyBkaXNhYmxlIGF0dHJpYnV0ZSBwb2ludGVyc1xuXHRcdFx0dGhpcy52ZXJ0ZXhCdWZmZXJzLmZvckVhY2godmVydGV4QnVmZmVyID0+IHtcblx0XHRcdFx0dmVydGV4QnVmZmVyLnVuYmluZCgpO1xuXHRcdFx0fSk7XG5cdFx0XHQvLyBubyBhZHZhbnRhZ2UgdG8gdW5iaW5kaW5nIGFzIHRoZXJlIGlzIG5vIHN0YWNrIHVzZWRcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gbm8gaW5kZXggYnVmZmVyLCB1c2UgZHJhdyBhcnJheXNcblx0XHRcdC8vIHNldCBhbGwgYXR0cmlidXRlIHBvaW50ZXJzXG5cdFx0XHR0aGlzLnZlcnRleEJ1ZmZlcnMuZm9yRWFjaCh2ZXJ0ZXhCdWZmZXIgPT4ge1xuXHRcdFx0XHR2ZXJ0ZXhCdWZmZXIuYmluZCgpO1xuXHRcdFx0fSk7XG5cdFx0XHRpZiAodGhpcy52ZXJ0ZXhCdWZmZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Ly8gZHJhdyB0aGUgYnVmZmVyXG5cdFx0XHRcdHRoaXMudmVydGV4QnVmZmVyc1swXS5kcmF3KG9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gZGlzYWJsZSBhbGwgYXR0cmlidXRlIHBvaW50ZXJzXG5cdFx0XHR0aGlzLnZlcnRleEJ1ZmZlcnMuZm9yRWFjaCh2ZXJ0ZXhCdWZmZXIgPT4ge1xuXHRcdFx0XHR2ZXJ0ZXhCdWZmZXIudW5iaW5kKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJhYmxlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBwYXJhbGxlbCA9IHJlcXVpcmUoJ2FzeW5jL3BhcmFsbGVsJyk7XG5jb25zdCBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpO1xuY29uc3QgU2hhZGVyUGFyc2VyID0gcmVxdWlyZSgnLi9TaGFkZXJQYXJzZXInKTtcbmNvbnN0IFhIUkxvYWRlciA9IHJlcXVpcmUoJy4uL3V0aWwvWEhSTG9hZGVyJyk7XG5cbmNvbnN0IFVOSUZPUk1fRlVOQ1RJT05TID0ge1xuXHQnYm9vbCc6ICd1bmlmb3JtMWknLFxuXHQnYm9vbFtdJzogJ3VuaWZvcm0xaXYnLFxuXHQnZmxvYXQnOiAndW5pZm9ybTFmJyxcblx0J2Zsb2F0W10nOiAndW5pZm9ybTFmdicsXG5cdCdpbnQnOiAndW5pZm9ybTFpJyxcblx0J2ludFtdJzogJ3VuaWZvcm0xaXYnLFxuXHQndWludCc6ICd1bmlmb3JtMWknLFxuXHQndWludFtdJzogJ3VuaWZvcm0xaXYnLFxuXHQndmVjMic6ICd1bmlmb3JtMmZ2Jyxcblx0J3ZlYzJbXSc6ICd1bmlmb3JtMmZ2Jyxcblx0J2l2ZWMyJzogJ3VuaWZvcm0yaXYnLFxuXHQnaXZlYzJbXSc6ICd1bmlmb3JtMml2Jyxcblx0J3ZlYzMnOiAndW5pZm9ybTNmdicsXG5cdCd2ZWMzW10nOiAndW5pZm9ybTNmdicsXG5cdCdpdmVjMyc6ICd1bmlmb3JtM2l2Jyxcblx0J2l2ZWMzW10nOiAndW5pZm9ybTNpdicsXG5cdCd2ZWM0JzogJ3VuaWZvcm00ZnYnLFxuXHQndmVjNFtdJzogJ3VuaWZvcm00ZnYnLFxuXHQnaXZlYzQnOiAndW5pZm9ybTRpdicsXG5cdCdpdmVjNFtdJzogJ3VuaWZvcm00aXYnLFxuXHQnbWF0Mic6ICd1bmlmb3JtTWF0cml4MmZ2Jyxcblx0J21hdDJbXSc6ICd1bmlmb3JtTWF0cml4MmZ2Jyxcblx0J21hdDMnOiAndW5pZm9ybU1hdHJpeDNmdicsXG5cdCdtYXQzW10nOiAndW5pZm9ybU1hdHJpeDNmdicsXG5cdCdtYXQ0JzogJ3VuaWZvcm1NYXRyaXg0ZnYnLFxuXHQnbWF0NFtdJzogJ3VuaWZvcm1NYXRyaXg0ZnYnLFxuXHQnc2FtcGxlcjJEJzogJ3VuaWZvcm0xaScsXG5cdCdzYW1wbGVyQ3ViZSc6ICd1bmlmb3JtMWknXG59O1xuXG4vKipcbiAqIEdpdmVuIGEgbWFwIG9mIGV4aXN0aW5nIGF0dHJpYnV0ZXMsIGZpbmQgdGhlIGxvd2VzdCBpbmRleCB0aGF0IGlzIG5vdCBhbHJlYWR5XG4gKiB1c2VkLiBJZiB0aGUgYXR0cmlidXRlIG9yZGVyaW5nIHdhcyBhbHJlYWR5IHByb3ZpZGVkLCB1c2UgdGhhdCBpbnN0ZWFkLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtNYXB9IGF0dHJpYnV0ZXMgLSBUaGUgZXhpc3RpbmcgYXR0cmlidXRlcyBtYXAuXG4gKiBAcGFyYW0ge09iamVjdH0gZGVjbGFyYXRpb24gLSBUaGUgYXR0cmlidXRlIGRlY2xhcmF0aW9uIG9iamVjdC5cbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgYXR0cmlidXRlIGluZGV4LlxuICovXG5mdW5jdGlvbiBnZXRBdHRyaWJ1dGVJbmRleChhdHRyaWJ1dGVzLCBkZWNsYXJhdGlvbikge1xuXHQvLyBjaGVjayBpZiBhdHRyaWJ1dGUgaXMgYWxyZWFkeSBkZWNsYXJlZCwgaWYgc28sIHVzZSB0aGF0IGluZGV4XG5cdGlmIChhdHRyaWJ1dGVzLmhhcyhkZWNsYXJhdGlvbi5uYW1lKSkge1xuXHRcdHJldHVybiBhdHRyaWJ1dGVzLmdldChkZWNsYXJhdGlvbi5uYW1lKS5pbmRleDtcblx0fVxuXHQvLyByZXR1cm4gbmV4dCBhdmFpbGFibGUgaW5kZXhcblx0cmV0dXJuIGF0dHJpYnV0ZXMuc2l6ZTtcbn1cblxuLyoqXG4gKiBHaXZlbiB2ZXJ0ZXggYW5kIGZyYWdtZW50IHNoYWRlciBzb3VyY2UsIHBhcnNlcyB0aGUgZGVjbGFyYXRpb25zIGFuZCBhcHBlbmRzXG4gKiBpbmZvcm1hdGlvbiBwZXJ0YWluaW5nIHRvIHRoZSB1bmlmb3JtcyBhbmQgYXR0cmlidHVlcyBkZWNsYXJlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7U2hhZGVyfSBzaGFkZXIgLSBUaGUgc2hhZGVyIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB2ZXJ0U291cmNlIC0gVGhlIHZlcnRleCBzaGFkZXIgc291cmNlLlxuICogQHBhcmFtIHtzdHJpbmd9IGZyYWdTb3VyY2UgLSBUaGUgZnJhZ21lbnQgc2hhZGVyIHNvdXJjZS5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgYXR0cmlidXRlIGFuZCB1bmlmb3JtIGluZm9ybWF0aW9uLlxuICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzQW5kVW5pZm9ybXMoc2hhZGVyLCB2ZXJ0U291cmNlLCBmcmFnU291cmNlKSB7XG5cdGNvbnN0IGRlY2xhcmF0aW9ucyA9IFNoYWRlclBhcnNlci5wYXJzZURlY2xhcmF0aW9ucyhcblx0XHRbdmVydFNvdXJjZSwgZnJhZ1NvdXJjZV0sXG5cdFx0Wyd1bmlmb3JtJywgJ2F0dHJpYnV0ZSddKTtcblx0Ly8gZm9yIGVhY2ggZGVjbGFyYXRpb24gaW4gdGhlIHNoYWRlclxuXHRkZWNsYXJhdGlvbnMuZm9yRWFjaChkZWNsYXJhdGlvbiA9PiB7XG5cdFx0Ly8gY2hlY2sgaWYgaXRzIGFuIGF0dHJpYnV0ZSBvciB1bmlmb3JtXG5cdFx0aWYgKGRlY2xhcmF0aW9uLnF1YWxpZmllciA9PT0gJ2F0dHJpYnV0ZScpIHtcblx0XHRcdC8vIGlmIGF0dHJpYnV0ZSwgc3RvcmUgdHlwZSBhbmQgaW5kZXhcblx0XHRcdGNvbnN0IGluZGV4ID0gZ2V0QXR0cmlidXRlSW5kZXgoc2hhZGVyLmF0dHJpYnV0ZXMsIGRlY2xhcmF0aW9uKTtcblx0XHRcdHNoYWRlci5hdHRyaWJ1dGVzLnNldChkZWNsYXJhdGlvbi5uYW1lLCB7XG5cdFx0XHRcdHR5cGU6IGRlY2xhcmF0aW9uLnR5cGUsXG5cdFx0XHRcdGluZGV4OiBpbmRleFxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHsgLy8gaWYgKGRlY2xhcmF0aW9uLnF1YWxpZmllciA9PT0gJ3VuaWZvcm0nKSB7XG5cdFx0XHQvLyBpZiB1bmlmb3JtLCBzdG9yZSB0eXBlIGFuZCBidWZmZXIgZnVuY3Rpb24gbmFtZVxuXHRcdFx0Y29uc3QgdHlwZSA9IGRlY2xhcmF0aW9uLnR5cGUgKyAoZGVjbGFyYXRpb24uY291bnQgPiAxID8gJ1tdJyA6ICcnKTtcblx0XHRcdHNoYWRlci51bmlmb3Jtcy5zZXQoZGVjbGFyYXRpb24ubmFtZSwge1xuXHRcdFx0XHR0eXBlOiBkZWNsYXJhdGlvbi50eXBlLFxuXHRcdFx0XHRmdW5jOiBVTklGT1JNX0ZVTkNUSU9OU1t0eXBlXVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuLyoqXG4gKiBHaXZlbiBhIGxpbmVOdW1iZXIgYW5kIG1heCBudW1iZXIgb2YgZGlnaXRzLCBwYWQgdGhlIGxpbmUgYWNjb3JkaW5nbHkuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbGluZU51bSAtIFRoZSBsaW5lIG51bWJlci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXhEaWdpdHMgLSBUaGUgbWF4IGRpZ2l0cyB0byBwYWQuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHBhZGRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIHBhZExpbmVOdW1iZXIobGluZU51bSwgbWF4RGlnaXRzKSB7XG5cdGxpbmVOdW0gPSBsaW5lTnVtLnRvU3RyaW5nKCk7XG5cdGNvbnN0IGRpZmYgPSBtYXhEaWdpdHMgLSBsaW5lTnVtLmxlbmd0aDtcblx0bGluZU51bSArPSAnOic7XG5cdGZvciAobGV0IGk9MDsgaTxkaWZmOyBpKyspIHtcblx0XHRsaW5lTnVtICs9ICcgJztcblx0fVxuXHRyZXR1cm4gbGluZU51bTtcbn07XG5cbi8qKlxuICogR2l2ZW4gYSBzaGFkZXIgc291cmNlIHN0cmluZyBhbmQgc2hhZGVyIHR5cGUsIGNvbXBpbGVzIHRoZSBzaGFkZXIgYW5kIHJldHVybnNcbiAqIHRoZSByZXN1bHRpbmcgV2ViR0xTaGFkZXIgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9IGdsIC0gVGhlIHdlYmdsIHJlbmRlcmluZyBjb250ZXh0LlxuICogQHBhcmFtIHtzdHJpbmd9IHNoYWRlclNvdXJjZSAtIFRoZSBzaGFkZXIgc291cmNlLlxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSBUaGUgc2hhZGVyIHR5cGUuXG4gKlxuICogQHJldHVybnMge1dlYkdMU2hhZGVyfSBUaGUgY29tcGlsZWQgc2hhZGVyIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY29tcGlsZVNoYWRlcihnbCwgc2hhZGVyU291cmNlLCB0eXBlKSB7XG5cdGNvbnN0IHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbFt0eXBlXSk7XG5cdGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNoYWRlclNvdXJjZSk7XG5cdGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcblx0aWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIHtcblx0XHRjb25zdCBzcGxpdCA9IHNoYWRlclNvdXJjZS5zcGxpdCgnXFxuJyk7XG5cdFx0Y29uc3QgbWF4RGlnaXRzID0gKHNwbGl0Lmxlbmd0aCkudG9TdHJpbmcoKS5sZW5ndGggKyAxO1xuXHRcdGNvbnN0IHNyY0J5TGluZXMgPSBzcGxpdC5tYXAoKGxpbmUsIGluZGV4KSA9PiB7XG5cdFx0XHRyZXR1cm4gYCR7cGFkTGluZU51bWJlcihpbmRleCsxLCBtYXhEaWdpdHMpfSAke2xpbmV9YDtcblx0XHR9KS5qb2luKCdcXG4nKTtcblx0XHRjb25zdCBzaGFkZXJMb2cgPSBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcik7XG5cdFx0dGhyb3cgYEFuIGVycm9yIG9jY3VycmVkIGNvbXBpbGluZyB0aGUgc2hhZGVyOlxcblxcbiR7c2hhZGVyTG9nLnNsaWNlKDAsIHNoYWRlckxvZy5sZW5ndGgtMSl9XFxuJHtzcmNCeUxpbmVzfWA7XG5cdH1cblx0cmV0dXJuIHNoYWRlcjtcbn1cblxuLyoqXG4gKiBCaW5kcyB0aGUgYXR0cmlidXRlIGxvY2F0aW9ucyBmb3IgdGhlIFNoYWRlciBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge1NoYWRlcn0gc2hhZGVyIC0gVGhlIFNoYWRlciBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGJpbmRBdHRyaWJ1dGVMb2NhdGlvbnMoc2hhZGVyKSB7XG5cdGNvbnN0IGdsID0gc2hhZGVyLmdsO1xuXHRzaGFkZXIuYXR0cmlidXRlcy5mb3JFYWNoKChhdHRyaWJ1dGUsIG5hbWUpID0+IHtcblx0XHQvLyBiaW5kIHRoZSBhdHRyaWJ1dGUgbG9jYXRpb25cblx0XHRnbC5iaW5kQXR0cmliTG9jYXRpb24oXG5cdFx0XHRzaGFkZXIucHJvZ3JhbSxcblx0XHRcdGF0dHJpYnV0ZS5pbmRleCxcblx0XHRcdG5hbWUpO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBRdWVyaWVzIHRoZSB3ZWJnbCByZW5kZXJpbmcgY29udGV4dCBmb3IgdGhlIHVuaWZvcm0gbG9jYXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtTaGFkZXJ9IHNoYWRlciAtIFRoZSBTaGFkZXIgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBnZXRVbmlmb3JtTG9jYXRpb25zKHNoYWRlcikge1xuXHRjb25zdCBnbCA9IHNoYWRlci5nbDtcblx0Y29uc3QgdW5pZm9ybXMgPSBzaGFkZXIudW5pZm9ybXM7XG5cdHVuaWZvcm1zLmZvckVhY2goKHVuaWZvcm0sIG5hbWUpID0+IHtcblx0XHQvLyBnZXQgdGhlIHVuaWZvcm0gbG9jYXRpb25cblx0XHRjb25zdCBsb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXIucHJvZ3JhbSwgbmFtZSk7XG5cdFx0Ly8gY2hlY2sgaWYgbnVsbCwgcGFyc2UgbWF5IGRldGVjdCB1bmlmb3JtIHRoYXQgaXMgY29tcGlsZWQgb3V0IGR1ZSB0b1xuXHRcdC8vIG5vdCBiZWluZyB1c2VkLCBvciBkdWUgdG8gYSBwcmVwcm9jZXNzb3IgZXZhbHVhdGlvbi5cblx0XHRpZiAobG9jYXRpb24gPT09IG51bGwpIHtcblx0XHRcdHVuaWZvcm1zLmRlbGV0ZShuYW1lKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dW5pZm9ybS5sb2NhdGlvbiA9IGxvY2F0aW9uO1xuXHRcdH1cblx0fSk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIGxvYWQgc2hhZGVyIHNvdXJjZSBmcm9tIGEgdXJsLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSB1cmwgdG8gbG9hZCB0aGUgcmVzb3VyY2UgZnJvbS5cbiAqXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFRoZSBmdW5jdGlvbiB0byBsb2FkIHRoZSBzaGFkZXIgc291cmNlLlxuICovXG5mdW5jdGlvbiBsb2FkU2hhZGVyU291cmNlKHVybCkge1xuXHRyZXR1cm4gZnVuY3Rpb24oZG9uZSkge1xuXHRcdFhIUkxvYWRlci5sb2FkKHtcblx0XHRcdHVybDogdXJsLFxuXHRcdFx0cmVzcG9uc2VUeXBlOiAndGV4dCcsXG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcblx0XHRcdFx0ZG9uZShudWxsLCByZXMpO1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbihlcnIpIHtcblx0XHRcdFx0ZG9uZShlcnIsIG51bGwpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byBwYXNzIHRocm91Z2ggdGhlIHNoYWRlciBzb3VyY2UuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc291cmNlIC0gVGhlIHNvdXJjZSBvZiB0aGUgc2hhZGVyLlxuICpcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gVGhlIGZ1bmN0aW9uIHRvIHBhc3MgdGhyb3VnaCB0aGUgc2hhZGVyIHNvdXJjZS5cbiAqL1xuZnVuY3Rpb24gcGFzc1Rocm91Z2hTb3VyY2Uoc291cmNlKSB7XG5cdHJldHVybiBmdW5jdGlvbihkb25lKSB7XG5cdFx0ZG9uZShudWxsLCBzb3VyY2UpO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGFuIGFycmF5IG9mIEdMU0wgc291cmNlIHN0cmluZ3MgYW5kIFVSTHMsIGFuZFxuICogcmVzb2x2ZXMgdGhlbSBpbnRvIGFuZCBhcnJheSBvZiBHTFNMIHNvdXJjZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZXMgLSBUaGUgc2hhZGVyIHNvdXJjZXMuXG4gKlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIGZ1bmN0aW9uIHRvIHJlc29sdmUgdGhlIHNoYWRlciBzb3VyY2VzLlxuICovXG5mdW5jdGlvbiByZXNvbHZlU291cmNlcyhzb3VyY2VzKSB7XG5cdHJldHVybiBmdW5jdGlvbihkb25lKSB7XG5cdFx0Y29uc3QgdGFza3MgPSBbXTtcblx0XHRzb3VyY2VzID0gc291cmNlcyB8fCBbXTtcblx0XHRzb3VyY2VzID0gIUFycmF5LmlzQXJyYXkoc291cmNlcykgPyBbc291cmNlc10gOiBzb3VyY2VzO1xuXHRcdHNvdXJjZXMuZm9yRWFjaChzb3VyY2UgPT4ge1xuXHRcdFx0aWYgKFNoYWRlclBhcnNlci5pc0dMU0woc291cmNlKSkge1xuXHRcdFx0XHR0YXNrcy5wdXNoKHBhc3NUaHJvdWdoU291cmNlKHNvdXJjZSkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGFza3MucHVzaChsb2FkU2hhZGVyU291cmNlKHNvdXJjZSkpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHBhcmFsbGVsKHRhc2tzLCBkb25lKTtcblx0fTtcbn1cblxuLyoqXG4gKiBJbmplY3RzIHRoZSBkZWZpbmVzIGludG8gdGhlIHNoYWRlciBzb3VyY2UuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBkZWZpbmVzIC0gVGhlIHNoYWRlciBkZWZpbmVzLlxuICpcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBzaGFkZXIgc291cmNlcy5cbiAqL1xuY29uc3QgY3JlYXRlRGVmaW5lcyA9IGZ1bmN0aW9uKGRlZmluZXMgPSB7fSkge1xuXHRjb25zdCByZXMgPSBbXTtcblx0T2JqZWN0LmtleXMoZGVmaW5lcykuZm9yRWFjaChuYW1lID0+IHtcblx0XHRyZXMucHVzaChgI2RlZmluZSAke25hbWV9ICR7ZGVmaW5lc1tuYW1lXX1gKTtcblx0fSk7XG5cdHJldHVybiByZXMuam9pbignXFxuJyk7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgdGhlIHNoYWRlciBwcm9ncmFtIG9iamVjdCBmcm9tIHNvdXJjZSBzdHJpbmdzLiBUaGlzIGluY2x1ZGVzOlxuICpcdDEpIENvbXBpbGluZyBhbmQgbGlua2luZyB0aGUgc2hhZGVyIHByb2dyYW0uXG4gKlx0MikgUGFyc2luZyBzaGFkZXIgc291cmNlIGZvciBhdHRyaWJ1dGUgYW5kIHVuaWZvcm0gaW5mb3JtYXRpb24uXG4gKlx0MykgQmluZGluZyBhdHRyaWJ1dGUgbG9jYXRpb25zLCBieSBvcmRlciBvZiBkZWxjYXJhdGlvbi5cbiAqXHQ0KSBRdWVyeWluZyBhbmQgc3RvcmluZyB1bmlmb3JtIGxvY2F0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtTaGFkZXJ9IHNoYWRlciAtIFRoZSBTaGFkZXIgb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZXMgLSBBIG1hcCBjb250YWluaW5nIHNvdXJjZXMgdW5kZXIgJ3ZlcnQnIGFuZCAnZnJhZycgYXR0cmlidXRlcy5cbiAqXG4gKiBAcmV0dXJucyB7U2hhZGVyfSBUaGUgc2hhZGVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICovXG5mdW5jdGlvbiBjcmVhdGVQcm9ncmFtKHNoYWRlciwgc291cmNlcykge1xuXHRjb25zdCBnbCA9IHNoYWRlci5nbDtcblx0Y29uc3QgZGVmaW5lcyA9IGNyZWF0ZURlZmluZXMoc291cmNlcy5kZWZpbmUpO1xuXHRjb25zdCBjb21tb24gPSBkZWZpbmVzICsgKHNvdXJjZXMuY29tbW9uIHx8ICcnKTtcblx0Y29uc3QgdmVydCA9IHNvdXJjZXMudmVydC5qb2luKCcnKTtcblx0Y29uc3QgZnJhZyA9IHNvdXJjZXMuZnJhZy5qb2luKCcnKTtcblx0Ly8gY29tcGlsZSBzaGFkZXJzXG5cdGNvbnN0IHZlcnRleFNoYWRlciA9IGNvbXBpbGVTaGFkZXIoZ2wsIGNvbW1vbiArIHZlcnQsICdWRVJURVhfU0hBREVSJyk7XG5cdGNvbnN0IGZyYWdtZW50U2hhZGVyID0gY29tcGlsZVNoYWRlcihnbCwgY29tbW9uICsgZnJhZywgJ0ZSQUdNRU5UX1NIQURFUicpO1xuXHQvLyBwYXJzZSBzb3VyY2UgZm9yIGF0dHJpYnV0ZSBhbmQgdW5pZm9ybXNcblx0c2V0QXR0cmlidXRlc0FuZFVuaWZvcm1zKHNoYWRlciwgdmVydCwgZnJhZyk7XG5cdC8vIGNyZWF0ZSB0aGUgc2hhZGVyIHByb2dyYW1cblx0c2hhZGVyLnByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG5cdC8vIGF0dGFjaCB2ZXJ0ZXggYW5kIGZyYWdtZW50IHNoYWRlcnNcblx0Z2wuYXR0YWNoU2hhZGVyKHNoYWRlci5wcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpO1xuXHRnbC5hdHRhY2hTaGFkZXIoc2hhZGVyLnByb2dyYW0sIGZyYWdtZW50U2hhZGVyKTtcblx0Ly8gYmluZCB2ZXJ0ZXggYXR0cmlidXRlIGxvY2F0aW9ucyBCRUZPUkUgbGlua2luZ1xuXHRiaW5kQXR0cmlidXRlTG9jYXRpb25zKHNoYWRlcik7XG5cdC8vIGxpbmsgc2hhZGVyXG5cdGdsLmxpbmtQcm9ncmFtKHNoYWRlci5wcm9ncmFtKTtcblx0Ly8gSWYgY3JlYXRpbmcgdGhlIHNoYWRlciBwcm9ncmFtIGZhaWxlZCwgYWxlcnRcblx0aWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHNoYWRlci5wcm9ncmFtLCBnbC5MSU5LX1NUQVRVUykpIHtcblx0XHR0aHJvdyAnQW4gZXJyb3Igb2NjdXJlZCBsaW5raW5nIHRoZSBzaGFkZXI6XFxuJyArIGdsLmdldFByb2dyYW1JbmZvTG9nKHNoYWRlci5wcm9ncmFtKTtcblx0fVxuXHQvLyBnZXQgc2hhZGVyIHVuaWZvcm0gbG9jYXRpb25zXG5cdGdldFVuaWZvcm1Mb2NhdGlvbnMoc2hhZGVyKTtcbn1cblxuLyoqXG4gKiBBIHNoYWRlciBjbGFzcyB0byBhc3Npc3QgaW4gY29tcGlsaW5nIGFuZCBsaW5raW5nIHdlYmdsIHNoYWRlcnMsIHN0b3JpbmdcbiAqIGF0dHJpYnV0ZSBhbmQgdW5pZm9ybSBsb2NhdGlvbnMsIGFuZCBidWZmZXJpbmcgdW5pZm9ybXMuXG4gKi9cbmNsYXNzIFNoYWRlciB7XG5cblx0LyoqXG5cdCAqIEluc3RhbnRpYXRlcyBhIFNoYWRlciBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHNoYWRlciBzcGVjaWZpY2F0aW9uIG9iamVjdC5cblx0ICogQHBhcmFtIHtTdHJpbmd8U3RyaW5nW118T2JqZWN0fSBzcGVjLmNvbW1vbiAtIFNvdXJjZXMgLyBVUkxzIHRvIGJlIHNoYXJlZCBieSBib3RoIHZlcnRleCBhbmQgZnJhZ21lbnQgc2hhZGVycy5cblx0ICogQHBhcmFtIHtTdHJpbmd8U3RyaW5nW118T2JqZWN0fSBzcGVjLnZlcnQgLSBUaGUgdmVydGV4IHNoYWRlciBzb3VyY2VzIC8gVVJMcy5cblx0ICogQHBhcmFtIHtTdHJpbmd8U3RyaW5nW118T2JqZWN0fSBzcGVjLmZyYWcgLSBUaGUgZnJhZ21lbnQgc2hhZGVyIHNvdXJjZXMgLyBVUkxzLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc3BlYy5kZWZpbmUgLSBBbnkgYCNkZWZpbmVgIGRlZmluaXRpb25zIHRvIGJlIGluamVjdGVkIGludG8gdGhlIGdsc2wuXG5cdCAqIEBwYXJhbSB7U3RyaW5nW119IHNwZWMuYXR0cmlidXRlcyAtIFRoZSBhdHRyaWJ1dGUgaW5kZXggb3JkZXJpbmdzLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlIG9uY2UgdGhlIHNoYWRlciBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgY29tcGlsZWQgYW5kIGxpbmtlZC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHNwZWMgPSB7fSwgY2FsbGJhY2sgPSBudWxsKSB7XG5cdFx0Ly8gY2hlY2sgc291cmNlIGFyZ3VtZW50c1xuXHRcdGlmICghc3BlYy52ZXJ0KSB7XG5cdFx0XHR0aHJvdyAnVmVydGV4IHNoYWRlciBhcmd1bWVudCBgdmVydGAgaGFzIG5vdCBiZWVuIHByb3ZpZGVkJztcblx0XHR9XG5cdFx0aWYgKCFzcGVjLmZyYWcpIHtcblx0XHRcdHRocm93ICdGcmFnbWVudCBzaGFkZXIgYXJndW1lbnQgYGZyYWdgIGhhcyBub3QgYmVlbiBwcm92aWRlZCc7XG5cdFx0fVxuXHRcdHRoaXMucHJvZ3JhbSA9IDA7XG5cdFx0dGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcblx0XHR0aGlzLnZlcnNpb24gPSBzcGVjLnZlcnNpb24gfHwgJzEuMDAnO1xuXHRcdHRoaXMuYXR0cmlidXRlcyA9IG5ldyBNYXAoKTtcblx0XHR0aGlzLnVuaWZvcm1zID0gbmV3IE1hcCgpO1xuXHRcdC8vIGlmIGF0dHJpYnV0ZSBvcmRlcmluZyBpcyBwcm92aWRlZCwgdXNlIHRob3NlIGluZGljZXNcblx0XHRpZiAoc3BlYy5hdHRyaWJ1dGVzKSB7XG5cdFx0XHRzcGVjLmF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0ciwgaW5kZXgpID0+IHtcblx0XHRcdFx0dGhpcy5hdHRyaWJ1dGVzLnNldChhdHRyLCB7XG5cdFx0XHRcdFx0aW5kZXg6IGluZGV4XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8vIGNyZWF0ZSB0aGUgc2hhZGVyXG5cdFx0cGFyYWxsZWwoe1xuXHRcdFx0Y29tbW9uOiByZXNvbHZlU291cmNlcyhzcGVjLmNvbW1vbiksXG5cdFx0XHR2ZXJ0OiByZXNvbHZlU291cmNlcyhzcGVjLnZlcnQpLFxuXHRcdFx0ZnJhZzogcmVzb2x2ZVNvdXJjZXMoc3BlYy5mcmFnKSxcblx0XHR9LCAoZXJyLCBzb3VyY2VzKSA9PiB7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdGlmIChjYWxsYmFjaykge1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2soZXJyLCBudWxsKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvLyBhcHBlbmQgZGVmaW5lc1xuXHRcdFx0c291cmNlcy5kZWZpbmUgPSBzcGVjLmRlZmluZTtcblx0XHRcdC8vIG9uY2UgYWxsIHNoYWRlciBzb3VyY2VzIGFyZSBsb2FkZWRcblx0XHRcdGNyZWF0ZVByb2dyYW0odGhpcywgc291cmNlcyk7XG5cdFx0XHRpZiAoY2FsbGJhY2spIHtcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgdGhpcyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmRzIHRoZSBzaGFkZXIgcHJvZ3JhbSBmb3IgdXNlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7U2hhZGVyfSBUaGUgc2hhZGVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0dXNlKCkge1xuXHRcdC8vIHVzZSB0aGUgc2hhZGVyXG5cdFx0dGhpcy5nbC51c2VQcm9ncmFtKHRoaXMucHJvZ3JhbSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogQnVmZmVyIGEgdW5pZm9ybSB2YWx1ZSBieSBuYW1lLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSB1bmlmb3JtIG5hbWUgaW4gdGhlIHNoYWRlciBzb3VyY2UuXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgLSBUaGUgdW5pZm9ybSB2YWx1ZSB0byBidWZmZXIuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtTaGFkZXJ9IC0gVGhlIHNoYWRlciBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHNldFVuaWZvcm0obmFtZSwgdmFsdWUpIHtcblx0XHRjb25zdCB1bmlmb3JtID0gdGhpcy51bmlmb3Jtcy5nZXQobmFtZSk7XG5cdFx0Ly8gZW5zdXJlIHRoYXQgdGhlIHVuaWZvcm0gc3BlYyBleGlzdHMgZm9yIHRoZSBuYW1lXG5cdFx0aWYgKCF1bmlmb3JtKSB7XG5cdFx0XHR0aHJvdyBgTm8gdW5pZm9ybSBmb3VuZCB1bmRlciBuYW1lIFxcYCR7bmFtZX1cXGBgO1xuXHRcdH1cblx0XHQvLyBjaGVjayB2YWx1ZVxuXHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHQvLyBlbnN1cmUgdGhhdCB0aGUgdW5pZm9ybSBhcmd1bWVudCBpcyBkZWZpbmVkXG5cdFx0XHR0aHJvdyBgVmFsdWUgcGFzc2VkIGZvciB1bmlmb3JtIFxcYCR7bmFtZX1cXGAgaXMgdW5kZWZpbmVkIG9yIG51bGxgO1xuXHRcdH1cblx0XHQvLyBzZXQgdGhlIHVuaWZvcm1cblx0XHQvLyBOT1RFOiBjaGVja2luZyB0eXBlIGJ5IHN0cmluZyBjb21wYXJpc29uIGlzIGZhc3RlciB0aGFuIHdyYXBwaW5nXG5cdFx0Ly8gdGhlIGZ1bmN0aW9ucy5cblx0XHRpZiAodW5pZm9ybS50eXBlID09PSAnbWF0MicgfHwgdW5pZm9ybS50eXBlID09PSAnbWF0MycgfHwgdW5pZm9ybS50eXBlID09PSAnbWF0NCcpIHtcblx0XHRcdHRoaXMuZ2xbdW5pZm9ybS5mdW5jXSh1bmlmb3JtLmxvY2F0aW9uLCBmYWxzZSwgdmFsdWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmdsW3VuaWZvcm0uZnVuY10odW5pZm9ybS5sb2NhdGlvbiwgdmFsdWUpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBCdWZmZXIgYSBtYXAgb2YgdW5pZm9ybSB2YWx1ZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB1bmlmb3JtcyAtIFRoZSBtYXAgb2YgdW5pZm9ybXMga2V5ZWQgYnkgbmFtZS5cblx0ICpcblx0ICogQHJldHVybnMge1NoYWRlcn0gVGhlIHNoYWRlciBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHNldFVuaWZvcm1zKHVuaWZvcm1zKSB7XG5cdFx0T2JqZWN0LmtleXModW5pZm9ybXMpLmZvckVhY2gobmFtZSA9PiB7XG5cdFx0XHR0aGlzLnNldFVuaWZvcm0obmFtZSwgdW5pZm9ybXNbbmFtZV0pO1xuXHRcdH0pO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhZGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBTaGFkZXJQcmVwcm9jZXNzb3IgPSByZXF1aXJlKCcuL1NoYWRlclByZXByb2Nlc3NvcicpO1xuXG5jb25zdCBDT01NRU5UU19SRUdFWFAgPSAvKFxcL1xcKihbXFxzXFxTXSo/KVxcKlxcLyl8KFxcL1xcLyguKikkKS9nbTtcbmNvbnN0IEVORExJTkVfUkVHRVhQID0gLyhcXHJcXG58XFxufFxccikvZ207XG5jb25zdCBXSElURVNQQUNFX1JFR0VYUCA9IC9cXHN7Mix9L2c7XG5jb25zdCBCUkFDS0VUX1dISVRFU1BBQ0VfUkVHRVhQID0gLyhcXHMqKShcXFspKFxccyopKFxcZCspKFxccyopKFxcXSkoXFxzKikvZztcbmNvbnN0IE5BTUVfQ09VTlRfUkVHRVhQID0gLyhbYS16QS1aX11bYS16QS1aMC05X10qKSg/OlxcWyhcXGQrKVxcXSk/LztcbmNvbnN0IFBSRUNJU0lPTl9SRUdFWCA9IC9cXGJwcmVjaXNpb25cXHMrXFx3K1xccytcXHcrOy9nO1xuY29uc3QgSU5MSU5FX1BSRUNJU0lPTl9SRUdFWCA9IC9cXGIoaGlnaHB8bWVkaXVtcHxsb3dwKVxccysvZztcbmNvbnN0IEdMU0xfUkVHRVhQID0gL3ZvaWRcXHMrbWFpblxccypcXChcXHMqKHZvaWQpKlxccypcXClcXHMqL21pO1xuXG4vKipcbiAqIFJlbW92ZXMgc3RhbmRhcmQgY29tbWVudHMgZnJvbSB0aGUgcHJvdmlkZWQgc3RyaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gc3RyaXAgY29tbWVudHMgZnJvbS5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tbWVudGxlc3Mgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBzdHJpcENvbW1lbnRzKHN0cikge1xuXHQvLyByZWdleCBzb3VyY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9tb2Fncml1cy9zdHJpcGNvbW1lbnRzXG5cdHJldHVybiBzdHIucmVwbGFjZShDT01NRU5UU19SRUdFWFAsICcnKTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFuIHByZWNpc2lvbiBzdGF0ZW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIFRoZSB1bnByb2Nlc3NlZCBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcHJvY2Vzc2VkIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiBzdHJpcFByZWNpc2lvbihzdHIpIHtcblx0cmV0dXJuIHN0clxuXHRcdC5yZXBsYWNlKFBSRUNJU0lPTl9SRUdFWCwgJycpIC8vIHJlbW92ZSBnbG9iYWwgcHJlY2lzaW9uIGRlY2xhcmF0aW9uc1xuXHRcdC5yZXBsYWNlKElOTElORV9QUkVDSVNJT05fUkVHRVgsICcnKTsgLy8gcmVtb3ZlIGlubGluZSBwcmVjaXNpb24gZGVjbGFyYXRpb25zXG59XG5cbi8qKlxuICogQ29udmVydHMgYWxsIHdoaXRlc3BhY2UgaW50byBhIHNpbmdsZSAnICcgc3BhY2UgY2hhcmFjdGVyLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gbm9ybWFsaXplIHdoaXRlc3BhY2UgZnJvbS5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgbm9ybWFsaXplZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZVdoaXRlc3BhY2Uoc3RyKSB7XG5cdHJldHVybiBzdHJcblx0XHQucmVwbGFjZShFTkRMSU5FX1JFR0VYUCwgJyAnKSAvLyByZW1vdmUgbGluZSBlbmRpbmdzXG5cdFx0LnJlcGxhY2UoV0hJVEVTUEFDRV9SRUdFWFAsICcgJykgLy8gbm9ybWFsaXplIHdoaXRlc3BhY2UgdG8gc2luZ2xlICcgJ1xuXHRcdC5yZXBsYWNlKEJSQUNLRVRfV0hJVEVTUEFDRV9SRUdFWFAsICckMiQ0JDYnKTsgLy8gcmVtb3ZlIHdoaXRlc3BhY2UgaW4gYnJhY2tldHNcbn1cblxuLyoqXG4gKiBQYXJzZXMgdGhlIG5hbWUgYW5kIGNvdW50IG91dCBvZiBhIG5hbWUgc3RhdGVtZW50LCByZXR1cm5pbmcgdGhlIGRlY2xhcmF0aW9uXG4gKiBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcXVhbGlmaWVyIC0gVGhlIHF1YWxpZmllciBzdHJpbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIHN0cmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBlbnRyeSAtIFRoZSB2YXJpYWJsZSBkZWNsYXJhdGlvbiBzdHJpbmcuXG4gKlxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRlY2xhcmF0aW9uIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gcGFyc2VOYW1lQW5kQ291bnQocXVhbGlmaWVyLCB0eXBlLCBlbnRyeSkge1xuXHQvLyBkZXRlcm1pbmUgbmFtZSBhbmQgc2l6ZSBvZiB2YXJpYWJsZVxuXHRjb25zdCBtYXRjaGVzID0gZW50cnkubWF0Y2goTkFNRV9DT1VOVF9SRUdFWFApO1xuXHRjb25zdCBuYW1lID0gbWF0Y2hlc1sxXTtcblx0Y29uc3QgY291bnQgPSAobWF0Y2hlc1syXSA9PT0gdW5kZWZpbmVkKSA/IDEgOiBwYXJzZUludChtYXRjaGVzWzJdLCAxMCk7XG5cdHJldHVybiB7XG5cdFx0cXVhbGlmaWVyOiBxdWFsaWZpZXIsXG5cdFx0dHlwZTogdHlwZSxcblx0XHRuYW1lOiBuYW1lLFxuXHRcdGNvdW50OiBjb3VudFxuXHR9O1xufVxuXG4vKipcbiAqIFBhcnNlcyBhIHNpbmdsZSAnc3RhdGVtZW50Jy4gQSAnc3RhdGVtZW50JyBpcyBjb25zaWRlcmVkIGFueSBzZXF1ZW5jZSBvZlxuICogY2hhcmFjdGVycyBmb2xsb3dlZCBieSBhIHNlbWktY29sb24uIFRoZXJlZm9yZSwgYSBzaW5nbGUgJ3N0YXRlbWVudCcgaW5cbiAqIHRoaXMgc2Vuc2UgY291bGQgY29udGFpbiBzZXZlcmFsIGNvbW1hIHNlcGFyYXRlZCBkZWNsYXJhdGlvbnMuIFJldHVybnNcbiAqIGFsbCByZXN1bHRpbmcgZGVjbGFyYXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlbWVudCAtIFRoZSBzdGF0ZW1lbnQgdG8gcGFyc2UuXG4gKlxuICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgb2YgcGFyc2VkIGRlY2xhcmF0aW9uIG9iamVjdHMuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlU3RhdGVtZW50KHN0YXRlbWVudCkge1xuXHQvLyBzcGxpdCBzdGF0ZW1lbnQgb24gY29tbWFzXG5cdC8vXG5cdC8vIFsndW5pZm9ybSBtYXQ0IEFbMTBdJywgJ0InLCAnQ1syXSddXG5cdC8vXG5cdGNvbnN0IHNwbGl0ID0gc3RhdGVtZW50LnNwbGl0KCcsJykubWFwKGVsZW0gPT4ge1xuXHRcdHJldHVybiBlbGVtLnRyaW0oKTtcblx0fSk7XG5cblx0Ly8gc3BsaXQgZGVjbGFyYXRpb24gaGVhZGVyIGZyb20gc3RhdGVtZW50XG5cdC8vXG5cdC8vIFsndW5pZm9ybScsICdtYXQ0JywgJ0FbMTBdJ11cblx0Ly9cblx0Y29uc3QgaGVhZGVyID0gc3BsaXQuc2hpZnQoKS5zcGxpdCgnICcpO1xuXG5cdC8vIHF1YWxpZmllciBpcyBhbHdheXMgZmlyc3QgZWxlbWVudFxuXHQvL1xuXHQvLyAndW5pZm9ybSdcblx0Ly9cblx0Y29uc3QgcXVhbGlmaWVyID0gaGVhZGVyLnNoaWZ0KCk7XG5cblx0Ly8gdHlwZSB3aWxsIGJlIHRoZSBzZWNvbmQgZWxlbWVudFxuXHQvL1xuXHQvLyAnbWF0NCdcblx0Ly9cblx0Y29uc3QgdHlwZSA9IGhlYWRlci5zaGlmdCgpO1xuXG5cdC8vIGxhc3QgcGFydCBvZiBoZWFkZXIgd2lsbCBiZSB0aGUgZmlyc3QsIGFuZCBwb3NzaWJsZSBvbmx5IHZhcmlhYmxlIG5hbWVcblx0Ly9cblx0Ly8gWydBWzEwXScsICdCJywgJ0NbMl0nXVxuXHQvL1xuXHRjb25zdCBuYW1lcyA9IGhlYWRlci5jb25jYXQoc3BsaXQpO1xuXG5cdC8vIGlmIHRoZXJlIGFyZSBvdGhlciBuYW1lcyBhZnRlciBhICcsJyBhZGQgdGhlbSBhcyB3ZWxsXG5cdHJldHVybiBuYW1lcy5tYXAobmFtZSA9PiB7XG5cdFx0cmV0dXJuIHBhcnNlTmFtZUFuZENvdW50KHF1YWxpZmllciwgdHlwZSwgbmFtZSk7XG5cdH0pO1xufVxuXG4vKipcbiAqIFNwbGl0cyB0aGUgc291cmNlIHN0cmluZyBieSBzZW1pLWNvbG9ucyBhbmQgY29uc3RydWN0cyBhbiBhcnJheSBvZlxuICogZGVjbGFyYXRpb24gb2JqZWN0cyBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgcXVhbGlmaWVyIGtleXdvcmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZSAtIFRoZSBzaGFkZXIgc291cmNlIHN0cmluZy5cbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBrZXl3b3JkcyAtIFRoZSBxdWFsaWZpZXIgZGVjbGFyYXRpb24ga2V5d29yZHMuXG4gKlxuICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgb2YgcXVhbGlmaWVyIGRlY2xhcmF0aW9uIG9iamVjdHMuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlU291cmNlKHNvdXJjZSwga2V5d29yZHMpIHtcblx0Ly8gZ2V0IGluZGl2aWR1YWwgc3RhdGVtZW50cyAoYW55IHNlcXVlbmNlIGVuZGluZyBpbiA7KVxuXHRjb25zdCBzdGF0ZW1lbnRzID0gc291cmNlLnNwbGl0KCc7Jyk7XG5cdC8vIGJ1aWxkIHJlZ2V4IGZvciBwYXJzaW5nIHN0YXRlbWVudHMgd2l0aCB0YXJnZXR0ZWQga2V5d29yZHNcblx0Y29uc3Qga2V5d29yZFN0ciA9IGtleXdvcmRzLmpvaW4oJ3wnKTtcblx0Y29uc3Qga2V5d29yZFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXFxcXGIoJyArIGtleXdvcmRTdHIgKyAnKVxcXFxiLionKTtcblx0Ly8gcGFyc2UgYW5kIHN0b3JlIGdsb2JhbCBwcmVjaXNpb24gc3RhdGVtZW50cyBhbmQgYW55IGRlY2xhcmF0aW9uc1xuXHRsZXQgbWF0Y2hlZCA9IFtdO1xuXHQvLyBmb3IgZWFjaCBzdGF0ZW1lbnRcblx0c3RhdGVtZW50cy5mb3JFYWNoKHN0YXRlbWVudCA9PiB7XG5cdFx0Ly8gY2hlY2sgZm9yIGtleXdvcmRzXG5cdFx0Ly9cblx0XHQvLyBbJ3VuaWZvcm0gZmxvYXQgdVRpbWUnXVxuXHRcdC8vXG5cdFx0Y29uc3Qga21hdGNoID0gc3RhdGVtZW50Lm1hdGNoKGtleXdvcmRSZWdleCk7XG5cdFx0aWYgKGttYXRjaCkge1xuXHRcdFx0Ly8gcGFyc2Ugc3RhdGVtZW50IGFuZCBhZGQgdG8gYXJyYXlcblx0XHRcdG1hdGNoZWQgPSBtYXRjaGVkLmNvbmNhdChwYXJzZVN0YXRlbWVudChrbWF0Y2hbMF0pKTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gbWF0Y2hlZDtcbn1cblxuLyoqXG4gKiBGaWx0ZXJzIG91dCBkdXBsaWNhdGUgZGVjbGFyYXRpb25zIHByZXNlbnQgYmV0d2VlbiBzaGFkZXJzLiBDdXJyZW50bHlcbiAqIGp1c3QgcmVtb3ZlcyBhbGwgIyBzdGF0ZW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtBcnJheX0gZGVjbGFyYXRpb25zIC0gVGhlIGFycmF5IG9mIGRlY2xhcmF0aW9ucy5cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBmaWx0ZXJlZCBhcnJheSBvZiBkZWNsYXJhdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIGZpbHRlckR1cGxpY2F0ZXNCeU5hbWUoZGVjbGFyYXRpb25zKSB7XG5cdC8vIGluIGNhc2VzIHdoZXJlIHRoZSBzYW1lIGRlY2xhcmF0aW9ucyBhcmUgcHJlc2VudCBpbiBtdWx0aXBsZVxuXHQvLyBzb3VyY2VzLCB0aGlzIGZ1bmN0aW9uIHdpbGwgcmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSB0aGUgcmVzdWx0c1xuXHRjb25zdCBzZWVuID0ge307XG5cdHJldHVybiBkZWNsYXJhdGlvbnMuZmlsdGVyKGRlY2xhcmF0aW9uID0+IHtcblx0XHRpZiAoc2VlbltkZWNsYXJhdGlvbi5uYW1lXSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRzZWVuW2RlY2xhcmF0aW9uLm5hbWVdID0gdHJ1ZTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSk7XG59XG5cbi8qKlxuICogUnVucyB0aGUgcHJlcHJvY2Vzc29yIG9uIHRoZSBnbHNsIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc291cmNlIC0gVGhlIHVucHJvY2Vzc2VkIHNvdXJjZSBjb2RlLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBwcm9jZXNzZWQgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHByZXByb2Nlc3Moc291cmNlKSB7XG5cdHJldHVybiBTaGFkZXJQcmVwcm9jZXNzb3IucHJlcHJvY2Vzcyhzb3VyY2UpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9ICB7XG5cblx0LyoqXG5cdCAqIFBhcnNlcyB0aGUgcHJvdmlkZWQgR0xTTCBzb3VyY2UsIGFuZCByZXR1cm5zIGFsbCBkZWNsYXJhdGlvbiBzdGF0ZW1lbnRzXG5cdCAqIHRoYXQgY29udGFpbiB0aGUgcHJvdmlkZWQgcXVhbGlmaWVyIHR5cGUuIFRoaXMgY2FuIGJlIHVzZWQgdG8gZXh0cmFjdCBhbGxcblx0ICogYXR0cmlidXRlcyBhbmQgdW5pZm9ybSBuYW1lcyBhbmQgdHlwZXMgZnJvbSBhIHNoYWRlci5cblx0ICpcblx0ICogRm9yIGV4YW1wbGUsIHdoZW4gcHJvdmlkZWQgYSAndW5pZm9ybScgcXVhbGlmaWVycywgdGhlIGRlY2xhcmF0aW9uOlxuXHQgKlxuXHQgKlx0ICd1bmlmb3JtIGhpZ2hwIHZlYzMgdVNwZWN1bGFyQ29sb3I7J1xuXHQgKlxuXHQgKiBXb3VsZCBiZSBwYXJzZWQgdG86XG5cdCAqICAgIHtcblx0ICogICAgICAgIHF1YWxpZmllcjogJ3VuaWZvcm0nLFxuXHQgKiAgICAgICAgdHlwZTogJ3ZlYzMnLFxuXHQgKiAgICAgICAgbmFtZTogJ3VTcGVjdWxhckNvbG9yJyxcblx0ICogICAgICAgIGNvdW50OiAxXG5cdCAqXHQgfVxuXHQgKlxuXHQgKiBAcGFyYW0ge0FycmF5fSBzb3VyY2VzIC0gVGhlIHNoYWRlciBzb3VyY2VzLlxuXHQgKiBAcGFyYW0ge0FycmF5fSBxdWFsaWZpZXJzIC0gVGhlIHF1YWxpZmllcnMgdG8gZXh0cmFjdC5cblx0ICpcblx0ICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgb2YgcXVhbGlmaWVyIGRlY2xhcmF0aW9uIHN0YXRlbWVudHMuXG5cdCAqL1xuXHRwYXJzZURlY2xhcmF0aW9uczogZnVuY3Rpb24oc291cmNlcyA9IFtdLCBxdWFsaWZpZXJzID0gW10pIHtcblx0XHQvLyBpZiBubyBzb3VyY2VzIG9yIHF1YWxpZmllcnMgYXJlIHByb3ZpZGVkLCByZXR1cm4gZW1wdHkgYXJyYXlcblx0XHRpZiAoc291cmNlcy5sZW5ndGggPT09IDAgfHwgcXVhbGlmaWVycy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cdFx0c291cmNlcyA9IEFycmF5LmlzQXJyYXkoc291cmNlcykgPyBzb3VyY2VzIDogW3NvdXJjZXNdO1xuXHRcdHF1YWxpZmllcnMgPSBBcnJheS5pc0FycmF5KHF1YWxpZmllcnMpID8gcXVhbGlmaWVycyA6IFtxdWFsaWZpZXJzXTtcblx0XHQvLyBwYXJzZSBvdXQgdGFyZ2V0dGVkIGRlY2xhcmF0aW9uc1xuXHRcdGxldCBkZWNsYXJhdGlvbnMgPSBbXTtcblx0XHRzb3VyY2VzLmZvckVhY2goc291cmNlID0+IHtcblx0XHRcdC8vIHJlbW92ZSBjb21tZW50c1xuXHRcdFx0c291cmNlID0gc3RyaXBDb21tZW50cyhzb3VyY2UpO1xuXHRcdFx0Ly8gcnVuIHByZXByb2Nlc3NvclxuXHRcdFx0c291cmNlID0gcHJlcHJvY2Vzcyhzb3VyY2UpO1xuXHRcdFx0Ly8gcmVtb3ZlIHByZWNpc2lvbiBzdGF0ZW1lbnRzXG5cdFx0XHRzb3VyY2UgPSBzdHJpcFByZWNpc2lvbihzb3VyY2UpO1xuXHRcdFx0Ly8gZmluYWxseSwgbm9ybWFsaXplIHRoZSB3aGl0ZXNwYWNlXG5cdFx0XHRzb3VyY2UgPSBub3JtYWxpemVXaGl0ZXNwYWNlKHNvdXJjZSk7XG5cdFx0XHQvLyBwYXJzZSBvdXQgZGVjbGFyYXRpb25zXG5cdFx0XHRkZWNsYXJhdGlvbnMgPSBkZWNsYXJhdGlvbnMuY29uY2F0KHBhcnNlU291cmNlKHNvdXJjZSwgcXVhbGlmaWVycykpO1xuXHRcdH0pO1xuXHRcdC8vIHJlbW92ZSBkdXBsaWNhdGVzIGFuZCByZXR1cm5cblx0XHRyZXR1cm4gZmlsdGVyRHVwbGljYXRlc0J5TmFtZShkZWNsYXJhdGlvbnMpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBEZXRlY3RzIGJhc2VkIG9uIHRoZSBleGlzdGVuY2Ugb2YgYSAndm9pZCBtYWluKCkgeycgc3RhdGVtZW50LCBpZiB0aGUgc3RyaW5nIGlzIGdsc2wgc291cmNlIGNvZGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSBUaGUgaW5wdXQgc3RyaW5nIHRvIHRlc3QuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgc3RyaW5nIGlzIGdsc2wgY29kZS5cblx0ICovXG5cdGlzR0xTTDogZnVuY3Rpb24oc3RyKSB7XG5cdFx0cmV0dXJuIEdMU0xfUkVHRVhQLnRlc3Qoc3RyKTtcblx0fVxuXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBERUZJTkVEID0gJ19fREVGSU5FRF9fJztcblxuY29uc3QgREVGSU5FX1JFR0VYID0gLyNkZWZpbmVcXGIvaTtcbmNvbnN0IFVOREVGX1JFR0VYID0gLyN1bmRlZlxcYi9pO1xuY29uc3QgSUZfUkVHRVggPSAvI2lmXFxiL2k7XG5jb25zdCBJRkRFRl9SRUdFWCA9IC8jaWZkZWZcXGIvaTtcbmNvbnN0IElGTkRFRl9SRUdFWCA9IC8jaWZuZGVmXFxiL2k7XG5jb25zdCBFTFNFX1JFR0VYID0gLyNlbHNlXFxiL2k7XG5jb25zdCBFTElGX1JFR0VYID0gLyNlbGlmXFxiL2k7XG5jb25zdCBFTkRJRl9SRUdFWCA9IC8jZW5kaWZcXGIvaTtcblxuY29uc3QgUEFSU0VfREVGSU5FX1JFR0VYID0gLyNkZWZpbmVcXHMrKFxcdyspKFxccyhcXHcqKT8pPy9pO1xuY29uc3QgUEFSU0VfVU5ERUZfUkVHRVggPSAvI3VuZGVmXFxzKyhcXHcrKS9pO1xuY29uc3QgUEFSU0VfSUZfUkVHRVggPSAvI2lmXFxzK1xcKD9cXHMqKCE/XFxzKlxcdyspXFxzKig9PXwhPXw+PXw8PXw8fD4pP1xccyooXFx3KilcXHMqXFwpPy9pO1xuY29uc3QgUEFSU0VfSUZERUZfUkVHRVggPSAvI2lmZGVmXFxzKyhcXHcrKS9pO1xuY29uc3QgUEFSU0VfSUZOREVGX1JFR0VYID0gLyNpZm5kZWZcXHMrKFxcdyspL2k7XG5jb25zdCBQQVJTRV9FTElGX1JFR0VYID0gLyNlbGlmXFxzK1xcKD9cXHMqKCE/XFxzKlxcdyspXFxzKig9PXwhPXw+PXw8PXw8fD4pP1xccyooXFx3KilcXHMqXFwpPy9pO1xuY29uc3QgUkVNQUlOSU5HX1JFR0VYID0gLyMoW1xcV1xcd1xcc1xcZF0pKD86LipcXFxccj9cXG4pKi4qJC9nbTtcblxuY29uc3QgZXZhbElmID0gZnVuY3Rpb24oYSwgbG9naWMsIGIpIHtcblx0aWYgKGxvZ2ljID09PSB1bmRlZmluZWQpIHtcblx0XHRpZiAoYVswXSA9PT0gJyEnKSB7XG5cdFx0XHRyZXR1cm4gIShhID09PSAndHJ1ZScgfHwgYSA+PSAxKTtcblx0XHR9XG5cdFx0cmV0dXJuIGEgPT09ICd0cnVlJyB8fCBhID49IDE7XG5cdH1cblx0c3dpdGNoIChsb2dpYykge1xuXHRcdGNhc2UgJz09Jzpcblx0XHRcdHJldHVybiBhID09PSBiO1xuXHRcdGNhc2UgJyE9Jzpcblx0XHRcdHJldHVybiBhICE9PSBiO1xuXHRcdGNhc2UgJz4nOlxuXHRcdFx0cmV0dXJuIGEgPiBiO1xuXHRcdGNhc2UgJz49Jzpcblx0XHRcdHJldHVybiBhID49IGI7XG5cdFx0Y2FzZSAnPCc6XG5cdFx0XHRyZXR1cm4gYSA8IGI7XG5cdFx0Y2FzZSAnPD0nOlxuXHRcdFx0cmV0dXJuIGEgPD0gYjtcblx0fVxuXHR0aHJvdyBgVW5yZWNvZ25pemVkIGxvZ2ljYWwgb3BlcmF0b3IgXFxgJHtsb2dpY31cXGBgO1xufTtcblxuY2xhc3MgQ29uZGl0aW9uYWwge1xuXHRjb25zdHJ1Y3Rvcih0eXBlLCBjb25kaXRpb25hbCkge1xuXHRcdHRoaXMudHlwZSA9IHR5cGU7XG5cdFx0dGhpcy5jb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLnRyaW0oKTtcblx0XHR0aGlzLmJvZHkgPSBbXTtcblx0XHR0aGlzLmNoaWxkcmVuID0gW107XG5cdH1cblx0ZXZhbCgpIHtcblx0XHRsZXQgcGFyc2VkO1xuXHRcdHN3aXRjaCAodGhpcy50eXBlKSB7XG5cdFx0XHRjYXNlICdpZic6XG5cdFx0XHRcdHBhcnNlZCA9IFBBUlNFX0lGX1JFR0VYLmV4ZWModGhpcy5jb25kaXRpb25hbCk7XG5cdFx0XHRcdHJldHVybiBldmFsSWYocGFyc2VkWzFdLCBwYXJzZWRbMl0sIHBhcnNlZFszXSk7XG5cdFx0XHRjYXNlICdpZmRlZic6XG5cdFx0XHRcdHBhcnNlZCA9IFBBUlNFX0lGREVGX1JFR0VYLmV4ZWModGhpcy5jb25kaXRpb25hbCk7XG5cdFx0XHRcdHJldHVybiBwYXJzZWRbMV0gPT09IERFRklORUQ7XG5cdFx0XHRjYXNlICdpZm5kZWYnOlxuXHRcdFx0XHRwYXJzZWQgPSBQQVJTRV9JRk5ERUZfUkVHRVguZXhlYyh0aGlzLmNvbmRpdGlvbmFsKTtcblx0XHRcdFx0cmV0dXJuIHBhcnNlZFsxXSAhPT0gREVGSU5FRDtcblx0XHRcdGNhc2UgJ2VsaWYnOlxuXHRcdFx0XHRwYXJzZWQgPSBQQVJTRV9FTElGX1JFR0VYLmV4ZWModGhpcy5jb25kaXRpb25hbCk7XG5cdFx0XHRcdHJldHVybiBldmFsSWYocGFyc2VkWzFdLCBwYXJzZWRbMl0sIHBhcnNlZFszXSk7XG5cdFx0fVxuXHRcdHRocm93IGBVbnJlY29nbml6ZWQgY29uZGl0aW9uYWwgdHlwZSBcXGAke3RoaXMudHlwZX1cXGBgO1xuXHR9XG59XG5cbmNsYXNzIEJsb2NrIHtcblx0Y29uc3RydWN0b3IodHlwZSwgY29uZGl0aW9uYWwsIGxpbmVOdW0pIHtcblx0XHR0aGlzLmlmID0gbmV3IENvbmRpdGlvbmFsKHR5cGUsIGNvbmRpdGlvbmFsKTtcblx0XHR0aGlzLmVsaWYgPSBbXTtcblx0XHR0aGlzLmVsc2UgPSBudWxsO1xuXHRcdHRoaXMucGFyZW50ID0gbnVsbDtcblx0XHR0aGlzLmN1cnJlbnQgPSB0aGlzLmlmO1xuXHRcdHRoaXMuc3RhcnRMaW5lID0gbGluZU51bTtcblx0XHR0aGlzLmVuZExpbmUgPSBudWxsO1xuXHR9XG5cdGFkZEVsc2UoY29uZGl0aW9uYWwpIHtcblx0XHR0aGlzLmN1cnJlbnQgPSBuZXcgQ29uZGl0aW9uYWwoJ2Vsc2UnLCBjb25kaXRpb25hbCk7XG5cdFx0dGhpcy5lbHNlID0gdGhpcy5jdXJyZW50O1xuXHR9XG5cdGFkZEVsaWYoY29uZGl0aW9uYWwpIHtcblx0XHR0aGlzLmN1cnJlbnQgPSBuZXcgQ29uZGl0aW9uYWwoJ2VsaWYnLCBjb25kaXRpb25hbCk7XG5cdFx0dGhpcy5lbGlmLnB1c2godGhpcy5jdXJyZW50KTtcblx0fVxuXHRhZGRCb2R5KGxpbmUsIGxpbmVOdW0pIHtcblx0XHR0aGlzLmN1cnJlbnQuYm9keS5wdXNoKHtcblx0XHRcdHN0cmluZzogbGluZS50cmltKCksXG5cdFx0XHRsaW5lOiBsaW5lTnVtXG5cdFx0fSk7XG5cdH1cblx0bmVzdChibG9jaykge1xuXHRcdGJsb2NrLnBhcmVudCA9IHRoaXM7XG5cdFx0dGhpcy5jdXJyZW50LmNoaWxkcmVuLnB1c2goYmxvY2spO1xuXHR9XG5cdGV4dHJhY3QoKSB7XG5cdFx0Ly8gI2lmXG5cdFx0bGV0IGJvZHkgPSBbXTtcblx0XHRpZiAodGhpcy5pZi5ldmFsKCkpIHtcblx0XHRcdGJvZHkgPSBib2R5LmNvbmNhdCh0aGlzLmlmLmJvZHkpO1xuXHRcdFx0dGhpcy5pZi5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcblx0XHRcdFx0Ym9keSA9IGJvZHkuY29uY2F0KGNoaWxkLmV4dHJhY3QoKSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBib2R5O1xuXHRcdH1cblx0XHQvLyAjZWxpZlxuXHRcdGZvciAobGV0IGk9MDsgaTx0aGlzLmVsaWYubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IGVsaWYgPSB0aGlzLmVsaWZbaV07XG5cdFx0XHRpZiAoZWxpZi5ldmFsKCkpIHtcblx0XHRcdFx0Ym9keSA9IGJvZHkuY29uY2F0KGVsaWYuYm9keSk7XG5cdFx0XHRcdGZvciAobGV0IGo9MDsgajxlbGlmLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0Y29uc3QgY2hpbGQgPSBlbGlmLmNoaWxkcmVuW2pdO1xuXHRcdFx0XHRcdGJvZHkgPSBib2R5LmNvbmNhdChjaGlsZC5leHRyYWN0KCkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBib2R5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyAjZWxzZVxuXHRcdGlmICh0aGlzLmVsc2UpIHtcblx0XHRcdGJvZHkgPSBib2R5LmNvbmNhdCh0aGlzLmVsc2UuYm9keSk7XG5cdFx0XHR0aGlzLmVsc2UuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG5cdFx0XHRcdGJvZHkgPSBib2R5LmNvbmNhdChjaGlsZC5leHRyYWN0KCkpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gYm9keTtcblx0XHR9XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cdGV2YWwoKSB7XG5cdFx0Ly8gZW5zdXJlIGV4dHJhY3QgdGV4dCBpcyBvcmRlcmVkIGNvcnJlY3RseVxuXHRcdHJldHVybiB0aGlzLmV4dHJhY3QoKS5zb3J0KChhLCBiKSA9PiB7XG5cdFx0XHRyZXR1cm4gYS5saW5lIC0gYi5saW5lO1xuXHRcdH0pLm1hcChhcmcgPT4ge1xuXHRcdFx0cmV0dXJuIGFyZy5zdHJpbmc7XG5cdFx0fSkuam9pbignXFxuJyk7XG5cdH1cbn1cblxuY29uc3QgcGFyc2VMaW5lcyA9IGZ1bmN0aW9uKGxpbmVzKSB7XG5cblx0Y29uc3QgYmxvY2tzID0gW107XG5cdGxldCBjdXJyZW50ID0gbnVsbDtcblxuXHRsaW5lcy5mb3JFYWNoKChsaW5lLCBpbmRleCkgPT4ge1xuXG5cdFx0aWYgKGxpbmUubWF0Y2goSUZfUkVHRVgpKSB7XG5cdFx0XHQvLyAjaWZcblx0XHRcdGNvbnN0IGJsb2NrID0gbmV3IEJsb2NrKCdpZicsIGxpbmUsIGluZGV4KTtcblx0XHRcdGlmICghY3VycmVudCkge1xuXHRcdFx0XHRibG9ja3MucHVzaChibG9jayk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjdXJyZW50Lm5lc3QoYmxvY2spO1xuXHRcdFx0fVxuXHRcdFx0Y3VycmVudCA9IGJsb2NrO1xuXG5cdFx0fSBlbHNlIGlmIChsaW5lLm1hdGNoKElGREVGX1JFR0VYKSkge1xuXHRcdFx0Ly8gI2lmZGVmXG5cdFx0XHRjb25zdCBibG9jayA9IG5ldyBCbG9jaygnaWZkZWYnLCBsaW5lLCBpbmRleCk7XG5cdFx0XHRpZiAoIWN1cnJlbnQpIHtcblx0XHRcdFx0YmxvY2tzLnB1c2goYmxvY2spO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y3VycmVudC5uZXN0KGJsb2NrKTtcblx0XHRcdH1cblx0XHRcdGN1cnJlbnQgPSBibG9jaztcblxuXHRcdH0gZWxzZSBpZiAobGluZS5tYXRjaChJRk5ERUZfUkVHRVgpKSB7XG5cdFx0XHQvLyAjaWZuZGVmXG5cdFx0XHRjb25zdCBibG9jayA9IG5ldyBCbG9jaygnaWZuZGVmJywgbGluZSwgaW5kZXgpO1xuXHRcdFx0aWYgKCFjdXJyZW50KSB7XG5cdFx0XHRcdGJsb2Nrcy5wdXNoKGJsb2NrKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGN1cnJlbnQubmVzdChibG9jayk7XG5cdFx0XHR9XG5cdFx0XHRjdXJyZW50ID0gYmxvY2s7XG5cblx0XHR9IGVsc2UgaWYgKGxpbmUubWF0Y2goRUxJRl9SRUdFWCkpIHtcblx0XHRcdC8vICNlbGlmXG5cdFx0XHRpZiAoIWN1cnJlbnQpIHtcblx0XHRcdFx0dGhyb3cgJ0ludmFsaWQgcHJlcHJvY2Vzc29yIHN5bnRheCwgdW5leHBlY3RlZCBgI2VsaWZgJztcblx0XHRcdH1cblx0XHRcdGN1cnJlbnQuYWRkRWxpZihsaW5lKTtcblxuXHRcdH0gZWxzZSBpZiAobGluZS5tYXRjaChFTFNFX1JFR0VYKSkge1xuXHRcdFx0Ly8gI2Vsc2Vcblx0XHRcdGlmICghY3VycmVudCkge1xuXHRcdFx0XHR0aHJvdyAnSW52YWxpZCBwcmVwcm9jZXNzb3Igc3ludGF4LCB1bmV4cGVjdGVkIGAjZWxzZWAnO1xuXHRcdFx0fVxuXHRcdFx0Y3VycmVudC5hZGRFbHNlKGxpbmUpO1xuXG5cdFx0fSBlbHNlIGlmIChsaW5lLm1hdGNoKEVORElGX1JFR0VYKSkge1xuXHRcdFx0Ly8gI2VuZGlmXG5cdFx0XHRpZiAoIWN1cnJlbnQpIHtcblx0XHRcdFx0dGhyb3cgJ0ludmFsaWQgcHJlcHJvY2Vzc29yIHN5bnRheCwgdW5leHBlY3RlZCBgI2VuZGlmYCc7XG5cdFx0XHR9XG5cdFx0XHRjdXJyZW50LmVuZExpbmUgPSBpbmRleDtcblx0XHRcdGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBvdGhlclxuXHRcdFx0aWYgKGN1cnJlbnQpIHtcblx0XHRcdFx0Y3VycmVudC5hZGRCb2R5KGxpbmUsIGluZGV4KTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdGlmIChjdXJyZW50KSB7XG5cdFx0dGhyb3cgJ0ludmFsaWQgcHJlcHJvY2Vzc29yIHN5bnRheCwgbWlzc2luZyBleHBlY3RlZCBgI2VuZGlmYCc7XG5cdH1cblxuXHRyZXR1cm4gYmxvY2tzO1xufTtcblxuY29uc3QgcmVwbGFjZURlZmluZXMgPSBmdW5jdGlvbihsaW5lcykge1xuXHRjb25zdCBkZWZpbmVzID0gbmV3IE1hcCgpO1xuXHRjb25zdCByZXBsYWNlZCA9IFtdO1xuXHRsaW5lcy5mb3JFYWNoKGxpbmUgPT4ge1xuXHRcdGlmIChsaW5lLm1hdGNoKERFRklORV9SRUdFWCkpIHtcblx0XHRcdC8vICNkZWZpbmVcblx0XHRcdGNvbnN0IHBhcnNlZCA9IFBBUlNFX0RFRklORV9SRUdFWC5leGVjKGxpbmUpO1xuXHRcdFx0ZGVmaW5lcy5zZXQocGFyc2VkWzFdLCBwYXJzZWRbMl0gfHwgREVGSU5FRCk7XG5cblx0XHR9IGVsc2UgaWYgKGxpbmUubWF0Y2goVU5ERUZfUkVHRVgpKSB7XG5cdFx0XHQvLyAjdW5kZWZcblx0XHRcdGNvbnN0IHBhcnNlZCA9IFBBUlNFX1VOREVGX1JFR0VYLmV4ZWMobGluZSk7XG5cdFx0XHRkZWZpbmVzLmRlbGV0ZShwYXJzZWRbMV0pO1xuXG5cdFx0fSBlbHNlIGlmIChsaW5lLm1hdGNoKElGREVGX1JFR0VYKSkge1xuXHRcdFx0Ly8gI2lmZGVmXG5cdFx0XHRjb25zdCBwYXJzZWQgPSBQQVJTRV9JRkRFRl9SRUdFWC5leGVjKGxpbmUpO1xuXHRcdFx0aWYgKGRlZmluZXMuaGFzKHBhcnNlZFsxXSkpIHtcblx0XHRcdFx0bGluZSA9IGxpbmUucmVwbGFjZShwYXJzZWRbMV0sIERFRklORUQpO1xuXHRcdFx0fVxuXHRcdFx0cmVwbGFjZWQucHVzaChsaW5lKTtcblxuXHRcdH0gZWxzZSBpZiAobGluZS5tYXRjaChJRk5ERUZfUkVHRVgpKSB7XG5cdFx0XHQvLyAjaWZuZGVmXG5cdFx0XHRjb25zdCBwYXJzZWQgPSBQQVJTRV9JRk5ERUZfUkVHRVguZXhlYyhsaW5lKTtcblx0XHRcdGlmIChkZWZpbmVzLmhhcyhwYXJzZWRbMV0pKSB7XG5cdFx0XHRcdGxpbmUgPSBsaW5lLnJlcGxhY2UocGFyc2VkWzFdLCBERUZJTkVEKTtcblx0XHRcdH1cblx0XHRcdHJlcGxhY2VkLnB1c2gobGluZSk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gc3dhcCBkZWZpbmVzXG5cdFx0XHRkZWZpbmVzLmZvckVhY2goKHZhbCwgZGVmaW5lKSA9PiB7XG5cdFx0XHRcdGxpbmUgPSBsaW5lLnJlcGxhY2UoZGVmaW5lLCB2YWwpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXBsYWNlZC5wdXNoKGxpbmUpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiByZXBsYWNlZDtcbn07XG5cbi8qKlxuICogRXZhbHVhdGVzIEdMU0wgcHJlcHJvY2Vzc29yIHN0YXRlbWVudHMuXG4gKiBOT1RFOiBhc3N1bWVzIGNvbW1lbnRzIGhhdmUgYmVlbiBzdHJpcHBlZCwgYW5kIHByZXByb2Nlc3NvcnMgYXJlIHZhbGlkLlxuICpcbiAqICAgICBTdXBwb3J0ZWQ6XG4gKlxuICogICAgICAgICAjZGVmaW5lIChzdWJzdGl0dXRpb25zIG9ubHkpXG4gKiAgICAgICAgICN1bmRlZlxuICogICAgICAgICAjaWYgKD09IGFuZCAhPSBjb21wYXJpc29ucyBvbmx5KVxuICogICAgICAgICAjaWZkZWZcbiAqICAgICAgICAgI2lmbmRlZlxuICogICAgICAgICAjZWxpZlxuICogICAgICAgICAjZWxzZVxuICogICAgICAgICAjZW5kaWZcbiAqXG4gKiAgICAgTm90IFN1cHBvcnRlZDpcbiAqXG4gKiAgICAgICAgICNkZWZpbmUgKG1hY3JvcylcbiAqICAgICAgICAgI2lmICgmJiBhbmQgfHwgb3BlcmF0b3JzLCBkZWZpbmVkKCkgcHJlZGljYXRlKVxuICogICAgICAgICAjZXJyb3JcbiAqICAgICAgICAgI3ByYWdtYVxuICogICAgICAgICAjZXh0ZW5zaW9uXG4gKiAgICAgICAgICN2ZXJzaW9uXG4gKiAgICAgICAgICNsaW5lXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGdsc2wgLSBUaGUgZ2xzbCBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcHJvY2Vzc2VkIGdsc2wgc291cmNlIGNvZGUuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRwcmVwcm9jZXNzOiBmdW5jdGlvbihnbHNsKSB7XG5cdFx0Ly8gc3BsaXQgbGluZXNcblx0XHRsZXQgbGluZXMgPSBnbHNsLnNwbGl0KCdcXG4nKTtcblx0XHQvLyByZXBsYWNlIGFueSBkZWZpbmVzIHdpdGggdGhlaXIgdmFsdWVzXG5cdFx0bGluZXMgPSByZXBsYWNlRGVmaW5lcyhsaW5lcyk7XG5cdFx0Ly8gcGFyc2UgdGhlbVxuXHRcdGNvbnN0IGJsb2NrcyA9IHBhcnNlTGluZXMobGluZXMpO1xuXHRcdC8vIHJlbW92ZSBibG9ja3MgaW4gcmV2ZXJzZSBvcmRlciB0byBwcmVzZXJ2ZSBsaW5lIG51bWJlcnNcblx0XHRmb3IgKGxldCBpPWJsb2Nrcy5sZW5ndGggLSAxOyBpPj0wOyBpLS0pIHtcblx0XHRcdGNvbnN0IGJsb2NrID0gYmxvY2tzW2ldO1xuXHRcdFx0Y29uc3QgcmVwbGFjZW1lbnQgPSBibG9jay5ldmFsKCk7XG5cdFx0XHRpZiAocmVwbGFjZW1lbnQubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRsaW5lcy5zcGxpY2UoYmxvY2suc3RhcnRMaW5lLCBibG9jay5lbmRMaW5lIC0gYmxvY2suc3RhcnRMaW5lICsgMSwgcmVwbGFjZW1lbnQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGluZXMuc3BsaWNlKGJsb2NrLnN0YXJ0TGluZSwgYmxvY2suZW5kTGluZSAtIGJsb2NrLnN0YXJ0TGluZSArIDEpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBzdHJpcCByZW1haW5pbmcgdW5zdXBwb3J0ZWQgcHJlcHJvY2Vzc29yIHN0YXRlbWVudHNcblx0XHRyZXR1cm4gbGluZXMuam9pbignXFxuJykucmVwbGFjZShSRU1BSU5JTkdfUkVHRVgsICcnKTtcblx0fVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcbmNvbnN0IFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKTtcblxuY29uc3QgTUFHX0ZJTFRFUlMgPSB7XG5cdE5FQVJFU1Q6IHRydWUsXG5cdExJTkVBUjogdHJ1ZVxufTtcbmNvbnN0IE1JTl9GSUxURVJTID0ge1xuXHRORUFSRVNUOiB0cnVlLFxuXHRMSU5FQVI6IHRydWUsXG5cdE5FQVJFU1RfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG5cdExJTkVBUl9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcblx0TkVBUkVTVF9NSVBNQVBfTElORUFSOiB0cnVlLFxuXHRMSU5FQVJfTUlQTUFQX0xJTkVBUjogdHJ1ZVxufTtcbmNvbnN0IE5PTl9NSVBNQVBfTUlOX0ZJTFRFUlMgPSB7XG5cdE5FQVJFU1Q6IHRydWUsXG5cdExJTkVBUjogdHJ1ZSxcbn07XG5jb25zdCBNSVBNQVBfTUlOX0ZJTFRFUlMgPSB7XG5cdE5FQVJFU1RfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG5cdExJTkVBUl9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcblx0TkVBUkVTVF9NSVBNQVBfTElORUFSOiB0cnVlLFxuXHRMSU5FQVJfTUlQTUFQX0xJTkVBUjogdHJ1ZVxufTtcbmNvbnN0IFdSQVBfTU9ERVMgPSB7XG5cdFJFUEVBVDogdHJ1ZSxcblx0TUlSUk9SRURfUkVQRUFUOiB0cnVlLFxuXHRDTEFNUF9UT19FREdFOiB0cnVlXG59O1xuY29uc3QgREVQVEhfVFlQRVMgPSB7XG5cdERFUFRIX0NPTVBPTkVOVDogdHJ1ZSxcblx0REVQVEhfU1RFTkNJTDogdHJ1ZVxufTtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCB0eXBlIGZvciB0ZXh0dXJlcy5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge3N0cmluZ31cbiAqL1xuY29uc3QgREVGQVVMVF9UWVBFID0gJ1VOU0lHTkVEX0JZVEUnO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGZvcm1hdCBmb3IgdGV4dHVyZXMuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtzdHJpbmd9XG4gKi9cbmNvbnN0IERFRkFVTFRfRk9STUFUID0gJ1JHQkEnO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IHdyYXAgbW9kZSBmb3IgdGV4dHVyZXMuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtzdHJpbmd9XG4gKi9cbmNvbnN0IERFRkFVTFRfV1JBUCA9ICdSRVBFQVQnO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IG1pbiAvIG1hZyBmaWx0ZXIgZm9yIHRleHR1cmVzLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7c3RyaW5nfVxuICovXG5jb25zdCBERUZBVUxUX0ZJTFRFUiA9ICdMSU5FQVInO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIGFscGhhIHByZW11bHRpcGx5aW5nIGlzIGVuYWJsZWQuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtib29sZWFufVxuICovXG5jb25zdCBERUZBVUxUX1BSRU1VTFRJUExZX0FMUEhBID0gdHJ1ZTtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBtaXBtYXBwaW5nIGlzIGVuYWJsZWQuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtib29sZWFufVxuICovXG5jb25zdCBERUZBVUxUX01JUE1BUCA9IHRydWU7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgZm9yIHdoZXRoZXIgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge2Jvb2xlYW59XG4gKi9cbmNvbnN0IERFRkFVTFRfSU5WRVJUX1kgPSB0cnVlO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IG1pcC1tYXBwaW5nIGZpbHRlciBzdWZmaXguXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtzdHJpbmd9XG4gKi9cbmNvbnN0IERFRkFVTFRfTUlQTUFQX01JTl9GSUxURVJfU1VGRklYID0gJ19NSVBNQVBfTElORUFSJztcblxuLyoqXG4gKiBBIHRleHR1cmUgY2xhc3MgdG8gcmVwcmVzZW50IGEgMkQgdGV4dHVyZS5cbiAqL1xuY2xhc3MgVGV4dHVyZTJEIHtcblxuXHQvKipcblx0ICogSW5zdGFudGlhdGVzIGEgVGV4dHVyZTJEIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgc3BlY2lmaWNhdGlvbiBhcmd1bWVudHMuXG5cdCAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ8SW1hZ2VEYXRhfEhUTUxJbWFnZUVsZW1lbnR8SFRNTENhbnZhc0VsZW1lbnR8SFRNTFZpZGVvRWxlbWVudH0gc3BlYy5zcmMgLSBUaGUgZGF0YSB0byBidWZmZXIuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzcGVjLndpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB0ZXh0dXJlLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gc3BlYy5oZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB0ZXh0dXJlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cblx0ICogQHBhcmFtIHtib29sfSBzcGVjLm1pcE1hcCAtIFdoZXRoZXIgb3Igbm90IG1pcC1tYXBwaW5nIGlzIGVuYWJsZWQuXG5cdCAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5pbnZlcnRZIC0gV2hldGhlciBvciBub3QgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cblx0ICogQHBhcmFtIHtib29sfSBzcGVjLnByZW11bHRpcGx5QWxwaGEgLSBXaGV0aGVyIG9yIG5vdCBhbHBoYSBwcmVtdWx0aXBseWluZyBpcyBlbmFibGVkLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy5mb3JtYXQgLSBUaGUgdGV4dHVyZSBwaXhlbCBmb3JtYXQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzcGVjLnR5cGUgLSBUaGUgdGV4dHVyZSBwaXhlbCBjb21wb25lbnQgdHlwZS5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHNwZWMgPSB7fSkge1xuXHRcdC8vIGdldCBzcGVjaWZpYyBwYXJhbXNcblx0XHRzcGVjLndyYXBTID0gc3BlYy53cmFwUyB8fCBzcGVjLndyYXA7XG5cdFx0c3BlYy53cmFwVCA9IHNwZWMud3JhcFQgfHwgc3BlYy53cmFwO1xuXHRcdHNwZWMubWluRmlsdGVyID0gc3BlYy5taW5GaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XG5cdFx0c3BlYy5tYWdGaWx0ZXIgPSBzcGVjLm1hZ0ZpbHRlciB8fCBzcGVjLmZpbHRlcjtcblx0XHQvLyBzZXQgY29udGV4dFxuXHRcdHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XG5cdFx0Ly8gZW1wdHkgdGV4dHVyZVxuXHRcdHRoaXMudGV4dHVyZSA9IG51bGw7XG5cdFx0Ly8gc2V0IHRleHR1cmUgcGFyYW1zXG5cdFx0dGhpcy53cmFwUyA9IHNwZWMud3JhcFMgfHwgREVGQVVMVF9XUkFQO1xuXHRcdHRoaXMud3JhcFQgPSBzcGVjLndyYXBUIHx8IERFRkFVTFRfV1JBUDtcblx0XHR0aGlzLm1pbkZpbHRlciA9IHNwZWMubWluRmlsdGVyIHx8IERFRkFVTFRfRklMVEVSO1xuXHRcdHRoaXMubWFnRmlsdGVyID0gc3BlYy5tYWdGaWx0ZXIgfHwgREVGQVVMVF9GSUxURVI7XG5cdFx0Ly8gc2V0IG90aGVyIHByb3BlcnRpZXNcblx0XHR0aGlzLm1pcE1hcCA9IHNwZWMubWlwTWFwICE9PSB1bmRlZmluZWQgPyBzcGVjLm1pcE1hcCA6IERFRkFVTFRfTUlQTUFQO1xuXHRcdHRoaXMuaW52ZXJ0WSA9IHNwZWMuaW52ZXJ0WSAhPT0gdW5kZWZpbmVkID8gc3BlYy5pbnZlcnRZIDogREVGQVVMVF9JTlZFUlRfWTtcblx0XHR0aGlzLnByZW11bHRpcGx5QWxwaGEgPSBzcGVjLnByZW11bHRpcGx5QWxwaGEgIT09IHVuZGVmaW5lZCA/IHNwZWMucHJlbXVsdGlwbHlBbHBoYSA6IERFRkFVTFRfUFJFTVVMVElQTFlfQUxQSEE7XG5cdFx0Ly8gc2V0IGZvcm1hdFxuXHRcdHRoaXMuZm9ybWF0ID0gc3BlYy5mb3JtYXQgfHwgREVGQVVMVF9GT1JNQVQ7XG5cdFx0aWYgKERFUFRIX1RZUEVTW3RoaXMuZm9ybWF0XSAmJiAhV2ViR0xDb250ZXh0LmNoZWNrRXh0ZW5zaW9uKCdXRUJHTF9kZXB0aF90ZXh0dXJlJykpIHtcblx0XHRcdHRocm93IGBDYW5ub3QgY3JlYXRlIFRleHR1cmUyRCBvZiBmb3JtYXQgXFxgJHt0aGlzLmZvcm1hdH1cXGAgYXMgXFxgV0VCR0xfZGVwdGhfdGV4dHVyZVxcYCBleHRlbnNpb24gaXMgdW5zdXBwb3J0ZWRgO1xuXHRcdH1cblx0XHQvLyBzZXQgdHlwZVxuXHRcdHRoaXMudHlwZSA9IHNwZWMudHlwZSB8fCBERUZBVUxUX1RZUEU7XG5cdFx0aWYgKHRoaXMudHlwZSA9PT0gJ0ZMT0FUJyAmJiAhV2ViR0xDb250ZXh0LmNoZWNrRXh0ZW5zaW9uKCdPRVNfdGV4dHVyZV9mbG9hdCcpKSB7XG5cdFx0XHR0aHJvdyAnQ2Fubm90IGNyZWF0ZSBUZXh0dXJlMkQgb2YgdHlwZSBgRkxPQVRgIGFzIGBPRVNfdGV4dHVyZV9mbG9hdGAgZXh0ZW5zaW9uIGlzIHVuc3VwcG9ydGVkJztcblx0XHR9XG5cdFx0Ly8gdXJsIHdpbGwgbm90IGJlIHJlc29sdmVkIHlldCwgc28gZG9uJ3QgYnVmZmVyIGluIHRoYXQgY2FzZVxuXHRcdGlmICh0eXBlb2Ygc3BlYy5zcmMgIT09ICdzdHJpbmcnKSB7XG5cdFx0XHQvLyBjaGVjayBzaXplXG5cdFx0XHRpZiAoIVV0aWwuaXNDYW52YXNUeXBlKHNwZWMuc3JjKSkge1xuXHRcdFx0XHQvLyBpZiBub3QgYSBjYW52YXMgdHlwZSwgZGltZW5zaW9ucyBNVVNUIGJlIHNwZWNpZmllZFxuXHRcdFx0XHRpZiAodHlwZW9mIHNwZWMud2lkdGggIT09ICdudW1iZXInIHx8IHNwZWMud2lkdGggPD0gMCkge1xuXHRcdFx0XHRcdHRocm93ICdgd2lkdGhgIGFyZ3VtZW50IGlzIG1pc3Npbmcgb3IgaW52YWxpZCc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR5cGVvZiBzcGVjLmhlaWdodCAhPT0gJ251bWJlcicgfHwgc3BlYy5oZWlnaHQgPD0gMCkge1xuXHRcdFx0XHRcdHRocm93ICdgaGVpZ2h0YCBhcmd1bWVudCBpcyBtaXNzaW5nIG9yIGludmFsaWQnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChVdGlsLm11c3RCZVBvd2VyT2ZUd28odGhpcykpIHtcblx0XHRcdFx0XHRpZiAoIVV0aWwuaXNQb3dlck9mVHdvKHNwZWMud2lkdGgpKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBgUGFyYW1ldGVycyByZXF1aXJlIGEgcG93ZXItb2YtdHdvIHRleHR1cmUsIHlldCBwcm92aWRlZCB3aWR0aCBvZiBcXGAke3NwZWMud2lkdGh9XFxgIGlzIG5vdCBhIHBvd2VyIG9mIHR3b2A7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghVXRpbC5pc1Bvd2VyT2ZUd28oc3BlYy5oZWlnaHQpKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBgUGFyYW1ldGVycyByZXF1aXJlIGEgcG93ZXItb2YtdHdvIHRleHR1cmUsIHlldCBwcm92aWRlZCBoZWlnaHQgb2YgXFxgJHtzcGVjLmhlaWdodH1cXGAgaXMgbm90IGEgcG93ZXIgb2YgdHdvYDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIGJ1ZmZlciB0aGUgZGF0YVxuXHRcdFx0dGhpcy5idWZmZXJEYXRhKHNwZWMuc3JjIHx8IG51bGwsIHNwZWMud2lkdGgsIHNwZWMuaGVpZ2h0KTtcblx0XHRcdHRoaXMuc2V0UGFyYW1ldGVycyh0aGlzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQmluZHMgdGhlIHRleHR1cmUgb2JqZWN0IHRvIHRoZSBwcm92aWRlZCB0ZXh0dXJlIHVuaXQgbG9jYXRpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBsb2NhdGlvbiAtIFRoZSB0ZXh0dXJlIHVuaXQgbG9jYXRpb24gaW5kZXguIERlZmF1bHRzIHRvIDAuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0YmluZChsb2NhdGlvbiA9IDApIHtcblx0XHRpZiAoIU51bWJlci5pc0ludGVnZXIobG9jYXRpb24pIHx8IGxvY2F0aW9uIDwgMCkge1xuXHRcdFx0dGhyb3cgJ1RleHR1cmUgdW5pdCBsb2NhdGlvbiBpcyBpbnZhbGlkJztcblx0XHR9XG5cdFx0Ly8gYmluZCB0ZXh0dXJlXG5cdFx0Y29uc3QgZ2wgPSB0aGlzLmdsO1xuXHRcdGdsLmFjdGl2ZVRleHR1cmUoZ2xbJ1RFWFRVUkUnICsgbG9jYXRpb25dKTtcblx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVuYmluZHMgdGhlIHRleHR1cmUgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHVuYmluZCgpIHtcblx0XHQvLyB1bmJpbmQgdGV4dHVyZVxuXHRcdGNvbnN0IGdsID0gdGhpcy5nbDtcblx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBCdWZmZXIgZGF0YSBpbnRvIHRoZSB0ZXh0dXJlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0FycmF5fEFycmF5QnVmZmVyfSBkYXRhIC0gVGhlIGRhdGEgYXJyYXkgdG8gYnVmZmVyLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIGRhdGEuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBkYXRhLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdGJ1ZmZlckRhdGEoZGF0YSwgd2lkdGgsIGhlaWdodCkge1xuXHRcdGNvbnN0IGdsID0gdGhpcy5nbDtcblx0XHQvLyBjcmVhdGUgdGV4dHVyZSBvYmplY3QgaWYgaXQgZG9lc24ndCBhbHJlYWR5IGV4aXN0XG5cdFx0aWYgKCF0aGlzLnRleHR1cmUpIHtcblx0XHRcdHRoaXMudGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcblx0XHR9XG5cdFx0Ly8gYmluZCB0ZXh0dXJlXG5cdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcblx0XHQvLyBpbnZlcnQgeSBpZiBzcGVjaWZpZWRcblx0XHRnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCB0aGlzLmludmVydFkpO1xuXHRcdC8vIHByZW11bHRpcGx5IGFscGhhIGlmIHNwZWNpZmllZFxuXHRcdGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCwgdGhpcy5wcmVtdWx0aXBseUFscGhhKTtcblx0XHQvLyBjYXN0IGFycmF5IGFyZ1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG5cdFx0XHRpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfU0hPUlQnKSB7XG5cdFx0XHRcdGRhdGEgPSBuZXcgVWludDE2QXJyYXkoZGF0YSk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX0lOVCcpIHtcblx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50MzJBcnJheShkYXRhKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnRkxPQVQnKSB7XG5cdFx0XHRcdGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KGRhdGEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50OEFycmF5KGRhdGEpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBzZXQgZW5zdXJlIHR5cGUgY29ycmVzcG9uZHMgdG8gZGF0YVxuXHRcdGlmIChkYXRhIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuXHRcdFx0dGhpcy50eXBlID0gJ1VOU0lHTkVEX0JZVEUnO1xuXHRcdH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIFVpbnQxNkFycmF5KSB7XG5cdFx0XHR0aGlzLnR5cGUgPSAnVU5TSUdORURfU0hPUlQnO1xuXHRcdH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIFVpbnQzMkFycmF5KSB7XG5cdFx0XHR0aGlzLnR5cGUgPSAnVU5TSUdORURfSU5UJztcblx0XHR9IGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkpIHtcblx0XHRcdHRoaXMudHlwZSA9ICdGTE9BVCc7XG5cdFx0fSBlbHNlIGlmIChkYXRhICYmICEoZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSAmJiAhVXRpbC5pc0NhbnZhc1R5cGUoZGF0YSkpIHtcblx0XHRcdHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgJyArXG5cdFx0XHRcdCdgQXJyYXlCdWZmZXJWaWV3YCwgYEltYWdlRGF0YWAsIGBIVE1MSW1hZ2VFbGVtZW50YCwgJyArXG5cdFx0XHRcdCdgSFRNTENhbnZhc0VsZW1lbnRgLCBgSFRNTFZpZGVvRWxlbWVudGAsIG9yIG51bGwnO1xuXHRcdH1cblx0XHRpZiAoVXRpbC5pc0NhbnZhc1R5cGUoZGF0YSkpIHtcblx0XHRcdC8vIHN0b3JlIHdpZHRoIGFuZCBoZWlnaHRcblx0XHRcdHRoaXMud2lkdGggPSBkYXRhLndpZHRoO1xuXHRcdFx0dGhpcy5oZWlnaHQgPSBkYXRhLmhlaWdodDtcblx0XHRcdC8vIGJ1ZmZlciB0aGUgdGV4dHVyZVxuXHRcdFx0Z2wudGV4SW1hZ2UyRChcblx0XHRcdFx0Z2wuVEVYVFVSRV8yRCxcblx0XHRcdFx0MCwgLy8gbWlwLW1hcCBsZXZlbFxuXHRcdFx0XHRnbFt0aGlzLmZvcm1hdF0sIC8vIHdlYmdsIHJlcXVpcmVzIGZvcm1hdCA9PT0gaW50ZXJuYWxGb3JtYXRcblx0XHRcdFx0Z2xbdGhpcy5mb3JtYXRdLFxuXHRcdFx0XHRnbFt0aGlzLnR5cGVdLFxuXHRcdFx0XHRkYXRhKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gc3RvcmUgd2lkdGggYW5kIGhlaWdodFxuXHRcdFx0dGhpcy53aWR0aCA9IHdpZHRoIHx8IHRoaXMud2lkdGg7XG5cdFx0XHR0aGlzLmhlaWdodCA9IGhlaWdodCB8fCB0aGlzLmhlaWdodDtcblx0XHRcdC8vIGJ1ZmZlciB0aGUgdGV4dHVyZSBkYXRhXG5cdFx0XHRnbC50ZXhJbWFnZTJEKFxuXHRcdFx0XHRnbC5URVhUVVJFXzJELFxuXHRcdFx0XHQwLCAvLyBtaXAtbWFwIGxldmVsXG5cdFx0XHRcdGdsW3RoaXMuZm9ybWF0XSwgLy8gd2ViZ2wgcmVxdWlyZXMgZm9ybWF0ID09PSBpbnRlcm5hbEZvcm1hdFxuXHRcdFx0XHR0aGlzLndpZHRoLFxuXHRcdFx0XHR0aGlzLmhlaWdodCxcblx0XHRcdFx0MCwgLy8gYm9yZGVyLCBtdXN0IGJlIDBcblx0XHRcdFx0Z2xbdGhpcy5mb3JtYXRdLFxuXHRcdFx0XHRnbFt0aGlzLnR5cGVdLFxuXHRcdFx0XHRkYXRhKTtcblx0XHR9XG5cdFx0Ly8gZ2VuZXJhdGUgbWlwIG1hcHNcblx0XHRpZiAodGhpcy5taXBNYXApIHtcblx0XHRcdGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xuXHRcdH1cblx0XHQvLyB1bmJpbmQgdGV4dHVyZVxuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJ1ZmZlciBwYXJ0aWFsIGRhdGEgaW50byB0aGUgdGV4dHVyZS5cblx0ICpcblx0ICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcn0gZGF0YSAtIFRoZSBkYXRhIGFycmF5IHRvIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtudW1iZXJ9IHhPZmZzZXQgLSBUaGUgeCBvZmZzZXQgYXQgd2hpY2ggdG8gYnVmZmVyLlxuXHQgKiBAcGFyYW0ge251bWJlcn0geU9mZnNldCAtIFRoZSB5IG9mZnNldCBhdCB3aGljaCB0byBidWZmZXIuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgZGF0YS5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIGRhdGEuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0YnVmZmVyU3ViRGF0YShkYXRhLCB4T2Zmc2V0ID0gMCwgeU9mZnNldCA9IDAsIHdpZHRoID0gdW5kZWZpbmVkLCBoZWlnaHQgPSB1bmRlZmluZWQpIHtcblx0XHRjb25zdCBnbCA9IHRoaXMuZ2w7XG5cdFx0Ly8gYmluZCB0ZXh0dXJlXG5cdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcblx0XHQvLyBjYXN0IGFycmF5IGFyZ1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG5cdFx0XHRpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfU0hPUlQnKSB7XG5cdFx0XHRcdGRhdGEgPSBuZXcgVWludDE2QXJyYXkoZGF0YSk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX0lOVCcpIHtcblx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50MzJBcnJheShkYXRhKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnRkxPQVQnKSB7XG5cdFx0XHRcdGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KGRhdGEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50OEFycmF5KGRhdGEpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBzZXQgZW5zdXJlIHR5cGUgY29ycmVzcG9uZHMgdG8gZGF0YVxuXHRcdGlmIChkYXRhIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuXHRcdFx0aWYgKHRoaXMudHlwZSAhPT0gJ1VOU0lHTkVEX0JZVEUnKSB7XG5cdFx0XHRcdHRocm93ICdQcm92aWRlZCBhcmd1bWVudCBvZiB0eXBlIGBVaW50OEFycmF5YCBkb2VzIG5vdCBtYXRjaCB0eXBlIG9mIGBVTlNJR05FRF9CWVRFYCc7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgVWludDE2QXJyYXkpIHtcblx0XHRcdGlmICh0aGlzLnR5cGUgIT09ICdVTlNJR05FRF9TSE9SVCcpIHtcblx0XHRcdFx0dGhyb3cgJ1Byb3ZpZGVkIGFyZ3VtZW50IG9mIHR5cGUgYFVpbnQxNkFycmF5YCBkb2VzIG5vdCBtYXRjaCB0eXBlIG9mIGBVTlNJR05FRF9TSE9SVGAnO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIFVpbnQzMkFycmF5KSB7XG5cdFx0XHRpZiAodGhpcy50eXBlICE9PSAnVU5TSUdORURfSU5UJykge1xuXHRcdFx0XHR0aHJvdyAnUHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSBgVWludDMyQXJyYXlgIGRvZXMgbm90IG1hdGNoIHR5cGUgb2YgYFVOU0lHTkVEX0lOVGAnO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSkge1xuXHRcdFx0aWYgKHRoaXMudHlwZSAhPT0gJ0ZMT0FUJykge1xuXHRcdFx0XHR0aHJvdyAnUHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSBgRmxvYXQzMkFycmF5YCBkb2VzIG5vdCBtYXRjaCB0eXBlIG9mIGBGTE9BVGAnO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoIShkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpICYmICFVdGlsLmlzQ2FudmFzVHlwZShkYXRhKSkge1xuXHRcdFx0dGhyb3cgJ0FyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBgQXJyYXlgLCBgQXJyYXlCdWZmZXJgLCAnICtcblx0XHRcdFx0J2BBcnJheUJ1ZmZlclZpZXdgLCBgSW1hZ2VEYXRhYCwgYEhUTUxJbWFnZUVsZW1lbnRgLCAnICtcblx0XHRcdFx0J2BIVE1MQ2FudmFzRWxlbWVudGAsIG9yIGBIVE1MVmlkZW9FbGVtZW50YCc7XG5cdFx0fVxuXHRcdGlmIChVdGlsLmlzQ2FudmFzVHlwZShkYXRhKSkge1xuXHRcdFx0Ly8gYnVmZmVyIHRoZSB0ZXh0dXJlXG5cdFx0XHRnbC50ZXhTdWJJbWFnZTJEKFxuXHRcdFx0XHRnbC5URVhUVVJFXzJELFxuXHRcdFx0XHQwLCAvLyBtaXAtbWFwIGxldmVsXG5cdFx0XHRcdHhPZmZzZXQsXG5cdFx0XHRcdHlPZmZzZXQsXG5cdFx0XHRcdGdsW3RoaXMuZm9ybWF0XSxcblx0XHRcdFx0Z2xbdGhpcy50eXBlXSxcblx0XHRcdFx0ZGF0YSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIGNoZWNrIHRoYXQgd2lkdGggaXMgcHJvdmlkZWRcblx0XHRcdGlmICghTnVtYmVyLmlzSW50ZWdlcih3aWR0aCkpIHtcblx0XHRcdFx0dGhyb3cgYFByb3ZpZGVkIHdpZHRoIG9mIFxcYCR7d2lkdGh9XFxgIGlzIGludmFsaWRgO1xuXHRcdFx0fVxuXHRcdFx0Ly8gY2hlY2sgdGhhdCBoZWlnaHQgaXMgcHJvdmlkZWRcblx0XHRcdGlmICghTnVtYmVyLmlzSW50ZWdlcihoZWlnaHQpKSB7XG5cdFx0XHRcdHRocm93IGBQcm92aWRlZCBoZWlnaHQgb2YgXFxgJHtoZWlnaHR9XFxgIGlzIGludmFsaWRgO1xuXHRcdFx0fVxuXHRcdFx0Ly8gY2hlY2sgdGhhdCB3ZSBhcmVuJ3Qgb3ZlcmZsb3dpbmcgdGhlIGJ1ZmZlclxuXHRcdFx0aWYgKHdpZHRoICsgeE9mZnNldCA+IHRoaXMud2lkdGgpIHtcblx0XHRcdFx0dGhyb3cgYFByb3ZpZGVkIHdpZHRoIG9mIFxcYCR7d2lkdGh9XFxgIGFuZCB4T2Zmc2V0IG9mIGAgK1xuXHRcdFx0XHRcdGAgXFxgJHt4T2Zmc2V0fVxcYCBvdmVyZmxvd3MgdGhlIHRleHR1cmUgd2lkdGggb2YgYCArXG5cdFx0XHRcdFx0YFxcYCR7dGhpcy53aWR0aH1cXGBgO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGhlaWdodCArIHlPZmZzZXQgPiB0aGlzLmhlaWdodCkge1xuXHRcdFx0XHR0aHJvdyBgUHJvdmlkZWQgd2lkdGggb2YgXFxgJHtoZWlnaHR9XFxgIGFuZCB4T2Zmc2V0IG9mIGAgK1xuXHRcdFx0XHRcdGAgXFxgJHt5T2Zmc2V0fVxcYCBvdmVyZmxvd3MgdGhlIHRleHR1cmUgd2lkdGggb2YgYCArXG5cdFx0XHRcdFx0YFxcYCR7dGhpcy5oZWlnaHR9XFxgYDtcblx0XHRcdH1cblx0XHRcdC8vIGJ1ZmZlciB0aGUgdGV4dHVyZSBkYXRhXG5cdFx0XHRnbC50ZXhTdWJJbWFnZTJEKFxuXHRcdFx0XHRnbC5URVhUVVJFXzJELFxuXHRcdFx0XHQwLCAvLyBtaXAtbWFwIGxldmVsXG5cdFx0XHRcdHhPZmZzZXQsXG5cdFx0XHRcdHlPZmZzZXQsXG5cdFx0XHRcdHdpZHRoLFxuXHRcdFx0XHRoZWlnaHQsXG5cdFx0XHRcdGdsW3RoaXMuZm9ybWF0XSxcblx0XHRcdFx0Z2xbdGhpcy50eXBlXSxcblx0XHRcdFx0ZGF0YSk7XG5cdFx0fVxuXHRcdC8vIGdlbmVyYXRlIG1pcCBtYXBzXG5cdFx0aWYgKHRoaXMubWlwTWFwKSB7XG5cdFx0XHRnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcblx0XHR9XG5cdFx0Ly8gdW5iaW5kIHRleHR1cmVcblx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgdGhlIHRleHR1cmUgcGFyYW1ldGVycy5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIFRoZSBwYXJhbWV0ZXJzIGJ5IG5hbWUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMud3JhcCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgYm90aCBTIGFuZCBUIGRpbWVuc2lvbi5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtcy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLndyYXBUIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgVCBkaW1lbnNpb24uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMuZmlsdGVyIC0gVGhlIG1pbiAvIG1hZyBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtcy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLm1hZ0ZpbHRlciAtIFRoZSBtYWduaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHNldFBhcmFtZXRlcnMocGFyYW1zKSB7XG5cdFx0Y29uc3QgZ2wgPSB0aGlzLmdsO1xuXHRcdC8vIGJpbmQgdGV4dHVyZVxuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSk7XG5cdFx0Ly8gc2V0IHdyYXAgUyBwYXJhbWV0ZXJcblx0XHRsZXQgcGFyYW0gPSBwYXJhbXMud3JhcFMgfHwgcGFyYW1zLndyYXA7XG5cdFx0aWYgKHBhcmFtKSB7XG5cdFx0XHRpZiAoV1JBUF9NT0RFU1twYXJhbV0pIHtcblx0XHRcdFx0dGhpcy53cmFwUyA9IHBhcmFtO1xuXHRcdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbFt0aGlzLndyYXBTXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIFxcYFRFWFRVUkVfV1JBUF9TXFxgYDtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gc2V0IHdyYXAgVCBwYXJhbWV0ZXJcblx0XHRwYXJhbSA9IHBhcmFtcy53cmFwVCB8fCBwYXJhbXMud3JhcDtcblx0XHRpZiAocGFyYW0pIHtcblx0XHRcdGlmIChXUkFQX01PREVTW3BhcmFtXSkge1xuXHRcdFx0XHR0aGlzLndyYXBUID0gcGFyYW07XG5cdFx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsW3RoaXMud3JhcFRdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgXFxgVEVYVFVSRV9XUkFQX1RcXGBgO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBzZXQgbWFnIGZpbHRlciBwYXJhbWV0ZXJcblx0XHRwYXJhbSA9IHBhcmFtcy5tYWdGaWx0ZXIgfHwgcGFyYW1zLmZpbHRlcjtcblx0XHRpZiAocGFyYW0pIHtcblx0XHRcdGlmIChNQUdfRklMVEVSU1twYXJhbV0pIHtcblx0XHRcdFx0dGhpcy5tYWdGaWx0ZXIgPSBwYXJhbTtcblx0XHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsW3RoaXMubWFnRmlsdGVyXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yICdURVhUVVJFX01BR19GSUxURVJcXGBgO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBzZXQgbWluIGZpbHRlciBwYXJhbWV0ZXJcblx0XHRwYXJhbSA9IHBhcmFtcy5taW5GaWx0ZXIgfHwgcGFyYW1zLmZpbHRlcjtcblx0XHRpZiAocGFyYW0pIHtcblx0XHRcdGlmICh0aGlzLm1pcE1hcCkge1xuXHRcdFx0XHRpZiAoTk9OX01JUE1BUF9NSU5fRklMVEVSU1twYXJhbV0pIHtcblx0XHRcdFx0XHQvLyB1cGdyYWRlIHRvIG1pcC1tYXAgbWluIGZpbHRlclxuXHRcdFx0XHRcdHBhcmFtICs9IERFRkFVTFRfTUlQTUFQX01JTl9GSUxURVJfU1VGRklYO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChNSVBNQVBfTUlOX0ZJTFRFUlNbcGFyYW1dKSB7XG5cdFx0XHRcdFx0dGhpcy5taW5GaWx0ZXIgPSBwYXJhbTtcblx0XHRcdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xbdGhpcy5taW5GaWx0ZXJdKTtcblx0XHRcdFx0fSBlbHNlICB7XG5cdFx0XHRcdFx0dGhyb3cgYFRleHR1cmUgcGFyYW1ldGVyIFxcYCR7cGFyYW19XFxgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBcXGBURVhUVVJFX01JTl9GSUxURVJcXGBgO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoTUlOX0ZJTFRFUlNbcGFyYW1dKSB7XG5cdFx0XHRcdFx0dGhpcy5taW5GaWx0ZXIgPSBwYXJhbTtcblx0XHRcdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xbdGhpcy5taW5GaWx0ZXJdKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIFxcYFRFWFRVUkVfTUlOX0ZJTFRFUlxcYGA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gdW5iaW5kIHRleHR1cmVcblx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlc2l6ZSB0aGUgdW5kZXJseWluZyB0ZXh0dXJlLiBUaGlzIGNsZWFycyB0aGUgdGV4dHVyZSBkYXRhLlxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSBUaGUgbmV3IHdpZHRoIG9mIHRoZSB0ZXh0dXJlLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0gVGhlIG5ldyBoZWlnaHQgb2YgdGhlIHRleHR1cmUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0cmVzaXplKHdpZHRoLCBoZWlnaHQpIHtcblx0XHRpZiAodHlwZW9mIHdpZHRoICE9PSAnbnVtYmVyJyB8fCAod2lkdGggPD0gMCkpIHtcblx0XHRcdHRocm93IGBQcm92aWRlZCB3aWR0aCBvZiBcXGAke3dpZHRofVxcYCBpcyBpbnZhbGlkYDtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBoZWlnaHQgIT09ICdudW1iZXInIHx8IChoZWlnaHQgPD0gMCkpIHtcblx0XHRcdHRocm93IGBQcm92aWRlZCBoZWlnaHQgb2YgXFxgJHtoZWlnaHR9XFxgIGlzIGludmFsaWRgO1xuXHRcdH1cblx0XHR0aGlzLmJ1ZmZlckRhdGEobnVsbCwgd2lkdGgsIGhlaWdodCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlMkQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBhcmFsbGVsID0gcmVxdWlyZSgnYXN5bmMvcGFyYWxsZWwnKTtcbmNvbnN0IFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0Jyk7XG5jb25zdCBJbWFnZUxvYWRlciA9IHJlcXVpcmUoJy4uL3V0aWwvSW1hZ2VMb2FkZXInKTtcbmNvbnN0IFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKTtcblxuY29uc3QgRkFDRVMgPSBbXG5cdCcteCcsICcreCcsXG5cdCcteScsICcreScsXG5cdCcteicsICcreidcbl07XG5jb25zdCBGQUNFX1RBUkdFVFMgPSB7XG5cdCcreic6ICdURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1onLFxuXHQnLXonOiAnVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9aJyxcblx0Jyt4JzogJ1RFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCcsXG5cdCcteCc6ICdURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1gnLFxuXHQnK3knOiAnVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9ZJyxcblx0Jy15JzogJ1RFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWSdcbn07XG5jb25zdCBUQVJHRVRTID0ge1xuXHRURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1o6IHRydWUsXG5cdFRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWjogdHJ1ZSxcblx0VEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YOiB0cnVlLFxuXHRURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1g6IHRydWUsXG5cdFRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWTogdHJ1ZSxcblx0VEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9ZOiB0cnVlXG59O1xuY29uc3QgTUFHX0ZJTFRFUlMgPSB7XG5cdE5FQVJFU1Q6IHRydWUsXG5cdExJTkVBUjogdHJ1ZVxufTtcbmNvbnN0IE1JTl9GSUxURVJTID0ge1xuXHRORUFSRVNUOiB0cnVlLFxuXHRMSU5FQVI6IHRydWUsXG5cdE5FQVJFU1RfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG5cdExJTkVBUl9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcblx0TkVBUkVTVF9NSVBNQVBfTElORUFSOiB0cnVlLFxuXHRMSU5FQVJfTUlQTUFQX0xJTkVBUjogdHJ1ZVxufTtcbmNvbnN0IE5PTl9NSVBNQVBfTUlOX0ZJTFRFUlMgPSB7XG5cdE5FQVJFU1Q6IHRydWUsXG5cdExJTkVBUjogdHJ1ZSxcbn07XG5jb25zdCBNSVBNQVBfTUlOX0ZJTFRFUlMgPSB7XG5cdE5FQVJFU1RfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG5cdExJTkVBUl9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcblx0TkVBUkVTVF9NSVBNQVBfTElORUFSOiB0cnVlLFxuXHRMSU5FQVJfTUlQTUFQX0xJTkVBUjogdHJ1ZVxufTtcbmNvbnN0IFdSQVBfTU9ERVMgPSB7XG5cdFJFUEVBVDogdHJ1ZSxcblx0TUlSUk9SRURfUkVQRUFUOiB0cnVlLFxuXHRDTEFNUF9UT19FREdFOiB0cnVlXG59O1xuY29uc3QgRk9STUFUUyA9IHtcblx0UkdCOiB0cnVlLFxuXHRSR0JBOiB0cnVlXG59O1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IHR5cGUgZm9yIHRleHR1cmVzLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7c3RyaW5nfVxuICovXG5jb25zdCBERUZBVUxUX1RZUEUgPSAnVU5TSUdORURfQllURSc7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgZm9ybWF0IGZvciB0ZXh0dXJlcy5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge3N0cmluZ31cbiAqL1xuY29uc3QgREVGQVVMVF9GT1JNQVQgPSAnUkdCQSc7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgd3JhcCBtb2RlIGZvciB0ZXh0dXJlcy5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge3N0cmluZ31cbiAqL1xuY29uc3QgREVGQVVMVF9XUkFQID0gJ0NMQU1QX1RPX0VER0UnO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IG1pbiAvIG1hZyBmaWx0ZXIgZm9yIHRleHR1cmVzLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7c3RyaW5nfVxuICovXG5jb25zdCBERUZBVUxUX0ZJTFRFUiA9ICdMSU5FQVInO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIGFscGhhIHByZW11bHRpcGx5aW5nIGlzIGVuYWJsZWQuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtib29sZWFufVxuICovXG5jb25zdCBERUZBVUxUX1BSRU1VTFRJUExZX0FMUEhBID0gdHJ1ZTtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBtaXBtYXBwaW5nIGlzIGVuYWJsZWQuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtib29sZWFufVxuICovXG5jb25zdCBERUZBVUxUX01JUE1BUCA9IHRydWU7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgZm9yIHdoZXRoZXIgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge2Jvb2xlYW59XG4gKi9cbmNvbnN0IERFRkFVTFRfSU5WRVJUX1kgPSB0cnVlO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IG1pcC1tYXBwaW5nIGZpbHRlciBzdWZmaXguXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtzdHJpbmd9XG4gKi9cbmNvbnN0IERFRkFVTFRfTUlQTUFQX01JTl9GSUxURVJfU1VGRklYID0gJ19NSVBNQVBfTElORUFSJztcblxuLyoqXG4gKiBDaGVja3MgdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIGN1YmVtYXAgYW5kIHRocm93cyBhbiBleGNlcHRpb24gaWYgaXQgZG9lc1xuICogbm90IG1lZXQgcmVxdWlyZW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtUZXh0dXJlQ3ViZU1hcH0gY3ViZU1hcCAtIFRoZSBjdWJlIG1hcCB0ZXh0dXJlIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY2hlY2tEaW1lbnNpb25zKGN1YmVNYXApIHtcblx0aWYgKHR5cGVvZiBjdWJlTWFwLndpZHRoICE9PSAnbnVtYmVyJyB8fCBjdWJlTWFwLndpZHRoIDw9IDApIHtcblx0XHR0aHJvdyAnYHdpZHRoYCBhcmd1bWVudCBpcyBtaXNzaW5nIG9yIGludmFsaWQnO1xuXHR9XG5cdGlmICh0eXBlb2YgY3ViZU1hcC5oZWlnaHQgIT09ICdudW1iZXInIHx8IGN1YmVNYXAuaGVpZ2h0IDw9IDApIHtcblx0XHR0aHJvdyAnYGhlaWdodGAgYXJndW1lbnQgaXMgbWlzc2luZyBvciBpbnZhbGlkJztcblx0fVxuXHRpZiAoY3ViZU1hcC53aWR0aCAhPT0gY3ViZU1hcC5oZWlnaHQpIHtcblx0XHR0aHJvdyAnUHJvdmlkZWQgYHdpZHRoYCBtdXN0IGJlIGVxdWFsIHRvIGBoZWlnaHRgJztcblx0fVxuXHRpZiAoVXRpbC5tdXN0QmVQb3dlck9mVHdvKGN1YmVNYXApICYmICFVdGlsLmlzUG93ZXJPZlR3byhjdWJlTWFwLndpZHRoKSkge1xuXHRcdHRocm93IGBQYXJhbWV0ZXJzIHJlcXVpcmUgYSBwb3dlci1vZi10d28gdGV4dHVyZSwgeWV0IHByb3ZpZGVkIHNpemUgb2YgJHtjdWJlTWFwLndpZHRofSBpcyBub3QgYSBwb3dlciBvZiB0d29gO1xuXHR9XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIGxvYWQgYSBmYWNlIGZyb20gYSB1cmwuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge1RleHR1cmVDdWJlTWFwfSBjdWJlTWFwIC0gVGhlIGN1YmUgbWFwIHRleHR1cmUgb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldCAtIFRoZSB0ZXh0dXJlIHRhcmdldC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRvIGxvYWQgdGhlIGZhY2UgZnJvbS5cbiAqXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFRoZSBsb2FkZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGxvYWRGYWNlVVJMKGN1YmVNYXAsIHRhcmdldCwgdXJsKSB7XG5cdHJldHVybiBmdW5jdGlvbihkb25lKSB7XG5cdFx0Ly8gVE9ETzogcHV0IGV4dGVuc2lvbiBoYW5kbGluZyBmb3IgYXJyYXlidWZmZXIgLyBpbWFnZSAvIHZpZGVvIGRpZmZlcmVudGlhdGlvblxuXHRcdEltYWdlTG9hZGVyLmxvYWQoe1xuXHRcdFx0dXJsOiB1cmwsXG5cdFx0XHRzdWNjZXNzOiBpbWFnZSA9PiB7XG5cdFx0XHRcdGltYWdlID0gVXRpbC5yZXNpemVDYW52YXMoY3ViZU1hcCwgaW1hZ2UpO1xuXHRcdFx0XHRjdWJlTWFwLmJ1ZmZlckRhdGEodGFyZ2V0LCBpbWFnZSk7XG5cdFx0XHRcdGRvbmUobnVsbCk7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGVyciA9PiB7XG5cdFx0XHRcdGRvbmUoZXJyLCBudWxsKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBhIGZhY2UgZnJvbSBhIGNhbnZhcyB0eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7VGV4dHVyZUN1YmVNYXB9IGN1YmVNYXAgLSBUaGUgY3ViZSBtYXAgdGV4dHVyZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0IC0gVGhlIHRleHR1cmUgdGFyZ2V0LlxuICogQHBhcmFtIHtJbWFnZURhdGF8SFRNTEltYWdlRWxlbWVudHxIVE1MQ2FudmFzRWxlbWVudHxIVE1MVmlkZW9FbGVtZW50fSBjYW52YXMgLSBUaGUgY2FudmFzIHR5cGUgb2JqZWN0LlxuICpcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gLSBUaGUgbG9hZGVyIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBsb2FkRmFjZUNhbnZhcyhjdWJlTWFwLCB0YXJnZXQsIGNhbnZhcykge1xuXHRyZXR1cm4gZnVuY3Rpb24oZG9uZSkge1xuXHRcdGNhbnZhcyA9IFV0aWwucmVzaXplQ2FudmFzKGN1YmVNYXAsIGNhbnZhcyk7XG5cdFx0Y3ViZU1hcC5idWZmZXJEYXRhKHRhcmdldCwgY2FudmFzKTtcblx0XHRkb25lKG51bGwpO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byBsb2FkIGEgZmFjZSBmcm9tIGFuIGFycmF5IHR5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtUZXh0dXJlQ3ViZU1hcH0gY3ViZU1hcCAtIFRoZSBjdWJlIG1hcCB0ZXh0dXJlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXQgLSBUaGUgdGV4dHVyZSB0YXJnZXQuXG4gKiBAcGFyYW0ge0FycmF5fEFycmF5QnVmZmVyfEFycmF5QnVmZmVyVmlld30gYXJyIC0gVGhlIGFycmF5IHR5cGUgb2JqZWN0LlxuICpcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gVGhlIGxvYWRlciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gbG9hZEZhY2VBcnJheShjdWJlTWFwLCB0YXJnZXQsIGFycikge1xuXHRjaGVja0RpbWVuc2lvbnMoY3ViZU1hcCk7XG5cdHJldHVybiBmdW5jdGlvbihkb25lKSB7XG5cdFx0Y3ViZU1hcC5idWZmZXJEYXRhKHRhcmdldCwgYXJyKTtcblx0XHRkb25lKG51bGwpO1xuXHR9O1xufVxuXG4vKipcbiAqIEEgdGV4dHVyZSBjbGFzcyB0byByZXByZXNlbnQgYSBjdWJlIG1hcCB0ZXh0dXJlLlxuICovXG5jbGFzcyBUZXh0dXJlQ3ViZU1hcCB7XG5cblx0LyoqXG5cdCAqIEluc3RhbnRpYXRlcyBhIFRleHR1cmVDdWJlTWFwIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgc3BlY2lmaWNhdGlvbiBhcmd1bWVudHMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjLmZhY2VzIC0gVGhlIGZhY2VzIHRvIGJ1ZmZlciwgdW5kZXIga2V5cyAnK3gnLCAnK3knLCAnK3onLCAnLXgnLCAnLXknLCBhbmQgJy16Jy5cblx0ICogQHBhcmFtIHtudW1iZXJ9IHNwZWMud2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIGZhY2VzLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gc3BlYy5oZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBmYWNlcy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHNwZWMud3JhcCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgYm90aCBTIGFuZCBUIGRpbWVuc2lvbi5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHNwZWMud3JhcFMgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBTIGRpbWVuc2lvbi5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHNwZWMud3JhcFQgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBUIGRpbWVuc2lvbi5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHNwZWMuZmlsdGVyIC0gVGhlIG1pbiAvIG1hZyBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHNwZWMubWluRmlsdGVyIC0gVGhlIG1pbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHNwZWMubWFnRmlsdGVyIC0gVGhlIG1hZ25pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG5cdCAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5taXBNYXAgLSBXaGV0aGVyIG9yIG5vdCBtaXAtbWFwcGluZyBpcyBlbmFibGVkLlxuXHQgKiBAcGFyYW0ge2Jvb2x9IHNwZWMuaW52ZXJ0WSAtIFdoZXRoZXIgb3Igbm90IGludmVydC15IGlzIGVuYWJsZWQuXG5cdCAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5wcmVtdWx0aXBseUFscGhhIC0gV2hldGhlciBvciBub3QgYWxwaGEgcHJlbXVsdGlwbHlpbmcgaXMgZW5hYmxlZC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHNwZWMuZm9ybWF0IC0gVGhlIHRleHR1cmUgcGl4ZWwgZm9ybWF0LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3BlYy50eXBlIC0gVGhlIHRleHR1cmUgcGl4ZWwgY29tcG9uZW50IHR5cGUuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIGlmIHRoZSBkYXRhIGlzIGxvYWRlZCBhc3luY2hyb25vdXNseSB2aWEgYSBVUkwuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihzcGVjID0ge30sIGNhbGxiYWNrID0gbnVsbCkge1xuXHRcdHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XG5cdFx0dGhpcy50ZXh0dXJlID0gbnVsbDtcblx0XHQvLyBnZXQgc3BlY2lmaWMgcGFyYW1zXG5cdFx0c3BlYy53cmFwUyA9IHNwZWMud3JhcFMgfHwgc3BlYy53cmFwO1xuXHRcdHNwZWMud3JhcFQgPSBzcGVjLndyYXBUIHx8IHNwZWMud3JhcDtcblx0XHRzcGVjLm1pbkZpbHRlciA9IHNwZWMubWluRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xuXHRcdHNwZWMubWFnRmlsdGVyID0gc3BlYy5tYWdGaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XG5cdFx0Ly8gc2V0IHRleHR1cmUgcGFyYW1zXG5cdFx0dGhpcy53cmFwUyA9IFdSQVBfTU9ERVNbc3BlYy53cmFwU10gPyBzcGVjLndyYXBTIDogREVGQVVMVF9XUkFQO1xuXHRcdHRoaXMud3JhcFQgPSBXUkFQX01PREVTW3NwZWMud3JhcFRdID8gc3BlYy53cmFwVCA6IERFRkFVTFRfV1JBUDtcblx0XHR0aGlzLm1pbkZpbHRlciA9IE1JTl9GSUxURVJTW3NwZWMubWluRmlsdGVyXSA/IHNwZWMubWluRmlsdGVyIDogREVGQVVMVF9GSUxURVI7XG5cdFx0dGhpcy5tYWdGaWx0ZXIgPSBNQUdfRklMVEVSU1tzcGVjLm1hZ0ZpbHRlcl0gPyBzcGVjLm1hZ0ZpbHRlciA6IERFRkFVTFRfRklMVEVSO1xuXHRcdC8vIHNldCBvdGhlciBwcm9wZXJ0aWVzXG5cdFx0dGhpcy5taXBNYXAgPSBzcGVjLm1pcE1hcCAhPT0gdW5kZWZpbmVkID8gc3BlYy5taXBNYXAgOiBERUZBVUxUX01JUE1BUDtcblx0XHR0aGlzLmludmVydFkgPSBzcGVjLmludmVydFkgIT09IHVuZGVmaW5lZCA/IHNwZWMuaW52ZXJ0WSA6IERFRkFVTFRfSU5WRVJUX1k7XG5cdFx0dGhpcy5wcmVtdWx0aXBseUFscGhhID0gc3BlYy5wcmVtdWx0aXBseUFscGhhICE9PSB1bmRlZmluZWQgPyBzcGVjLnByZW11bHRpcGx5QWxwaGEgOiBERUZBVUxUX1BSRU1VTFRJUExZX0FMUEhBO1xuXHRcdC8vIHNldCBmb3JtYXQgYW5kIHR5cGVcblx0XHR0aGlzLmZvcm1hdCA9IEZPUk1BVFNbc3BlYy5mb3JtYXRdID8gc3BlYy5mb3JtYXQgOiBERUZBVUxUX0ZPUk1BVDtcblx0XHR0aGlzLnR5cGUgPSBzcGVjLnR5cGUgfHwgREVGQVVMVF9UWVBFO1xuXHRcdGlmICh0aGlzLnR5cGUgPT09ICdGTE9BVCcgJiYgIVdlYkdMQ29udGV4dC5jaGVja0V4dGVuc2lvbignT0VTX3RleHR1cmVfZmxvYXQnKSkge1xuXHRcdFx0dGhyb3cgJ0Nhbm5vdCBjcmVhdGUgVGV4dHVyZTJEIG9mIHR5cGUgYEZMT0FUYCBhcyBgT0VTX3RleHR1cmVfZmxvYXRgIGV4dGVuc2lvbiBpcyB1bnN1cHBvcnRlZCc7XG5cdFx0fVxuXHRcdC8vIHNldCBkaW1lbnNpb25zIGlmIHByb3ZpZGVkXG5cdFx0dGhpcy53aWR0aCA9IHNwZWMud2lkdGg7XG5cdFx0dGhpcy5oZWlnaHQgPSBzcGVjLmhlaWdodDtcblx0XHQvLyBzZXQgYnVmZmVyZWQgZmFjZXNcblx0XHR0aGlzLmJ1ZmZlcmVkRmFjZXMgPSBbXTtcblx0XHQvLyBjcmVhdGUgY3ViZSBtYXAgYmFzZWQgb24gaW5wdXRcblx0XHRpZiAoc3BlYy5mYWNlcykge1xuXHRcdFx0Y29uc3QgdGFza3MgPSBbXTtcblx0XHRcdEZBQ0VTLmZvckVhY2goaWQgPT4ge1xuXHRcdFx0XHRjb25zdCBmYWNlID0gc3BlYy5mYWNlc1tpZF07XG5cdFx0XHRcdGNvbnN0IHRhcmdldCA9IEZBQ0VfVEFSR0VUU1tpZF07XG5cdFx0XHRcdC8vIGxvYWQgYmFzZWQgb24gdHlwZVxuXHRcdFx0XHRpZiAodHlwZW9mIGZhY2UgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0Ly8gdXJsXG5cdFx0XHRcdFx0dGFza3MucHVzaChsb2FkRmFjZVVSTCh0aGlzLCB0YXJnZXQsIGZhY2UpKTtcblx0XHRcdFx0fSBlbHNlIGlmIChVdGlsLmlzQ2FudmFzVHlwZShmYWNlKSkge1xuXHRcdFx0XHRcdC8vIGNhbnZhc1xuXHRcdFx0XHRcdHRhc2tzLnB1c2gobG9hZEZhY2VDYW52YXModGhpcywgdGFyZ2V0LCBmYWNlKSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gYXJyYXkgLyBhcnJheWJ1ZmZlciBvciBudWxsXG5cdFx0XHRcdFx0dGFza3MucHVzaChsb2FkRmFjZUFycmF5KHRoaXMsIHRhcmdldCwgZmFjZSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHBhcmFsbGVsKHRhc2tzLCBlcnIgPT4ge1xuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0aWYgKGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2soZXJyLCBudWxsKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gc2V0IHBhcmFtZXRlcnNcblx0XHRcdFx0dGhpcy5zZXRQYXJhbWV0ZXJzKHRoaXMpO1xuXHRcdFx0XHRpZiAoY2FsbGJhY2spIHtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrKG51bGwsIHRoaXMpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gbnVsbFxuXHRcdFx0Y2hlY2tEaW1lbnNpb25zKHRoaXMpO1xuXHRcdFx0RkFDRVMuZm9yRWFjaChpZCA9PiB7XG5cdFx0XHRcdHRoaXMuYnVmZmVyRGF0YShGQUNFX1RBUkdFVFNbaWRdLCBudWxsKTtcblx0XHRcdH0pO1xuXHRcdFx0Ly8gc2V0IHBhcmFtZXRlcnNcblx0XHRcdHRoaXMuc2V0UGFyYW1ldGVycyh0aGlzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQmluZHMgdGhlIHRleHR1cmUgb2JqZWN0IHRvIHRoZSBwcm92aWRlZCB0ZXh0dXJlIHVuaXQgbG9jYXRpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBsb2NhdGlvbiAtIFRoZSB0ZXh0dXJlIHVuaXQgbG9jYXRpb24gaW5kZXguIERlZmF1bHRzIHRvIDAuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtUZXh0dXJlQ3ViZU1hcH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRiaW5kKGxvY2F0aW9uID0gMCkge1xuXHRcdGlmICghTnVtYmVyLmlzSW50ZWdlcihsb2NhdGlvbikgfHwgbG9jYXRpb24gPCAwKSB7XG5cdFx0XHR0aHJvdyAnVGV4dHVyZSB1bml0IGxvY2F0aW9uIGlzIGludmFsaWQnO1xuXHRcdH1cblx0XHQvLyBiaW5kIGN1YmUgbWFwIHRleHR1cmVcblx0XHRjb25zdCBnbCA9IHRoaXMuZ2w7XG5cdFx0Z2wuYWN0aXZlVGV4dHVyZShnbFsnVEVYVFVSRScgKyBsb2NhdGlvbl0pO1xuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIHRoaXMudGV4dHVyZSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogVW5iaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtUZXh0dXJlQ3ViZU1hcH0gLSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHVuYmluZCgpIHtcblx0XHQvLyB1bmJpbmQgY3ViZSBtYXAgdGV4dHVyZVxuXHRcdGNvbnN0IGdsID0gdGhpcy5nbDtcblx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCBudWxsKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBCdWZmZXIgZGF0YSBpbnRvIHRoZSByZXNwZWN0aXZlIGN1YmUgbWFwIGZhY2UuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXQgLSBUaGUgZmFjZSB0YXJnZXQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fG51bGx9IGRhdGEgLSBUaGUgZmFjZSBkYXRhLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7VGV4dHVyZUN1YmVNYXB9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0YnVmZmVyRGF0YSh0YXJnZXQsIGRhdGEpIHtcblx0XHRpZiAoIVRBUkdFVFNbdGFyZ2V0XSkge1xuXHRcdFx0dGhyb3cgYFByb3ZpZGVkIFxcYHRhcmdldFxcYCBvZiAke3RhcmdldH0gIGlzIGludmFsaWRgO1xuXHRcdH1cblx0XHRjb25zdCBnbCA9IHRoaXMuZ2w7XG5cdFx0Ly8gY3JlYXRlIHRleHR1cmUgb2JqZWN0IGlmIGl0IGRvZXNuJ3QgYWxyZWFkeSBleGlzdFxuXHRcdGlmICghdGhpcy50ZXh0dXJlKSB7XG5cdFx0XHR0aGlzLnRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG5cdFx0fVxuXHRcdC8vIGJpbmQgdGV4dHVyZVxuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIHRoaXMudGV4dHVyZSk7XG5cdFx0Ly8gaW52ZXJ0IHkgaWYgc3BlY2lmaWVkXG5cdFx0Z2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX0ZMSVBfWV9XRUJHTCwgdGhpcy5pbnZlcnRZKTtcblx0XHQvLyBwcmVtdWx0aXBseSBhbHBoYSBpZiBzcGVjaWZpZWRcblx0XHRnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0wsIHRoaXMucHJlbXVsdGlwbHlBbHBoYSk7XG5cdFx0Ly8gY2FzdCBhcnJheSBhcmdcblx0XHRpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuXHRcdFx0aWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX1NIT1JUJykge1xuXHRcdFx0XHRkYXRhID0gbmV3IFVpbnQxNkFycmF5KGRhdGEpO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdVTlNJR05FRF9JTlQnKSB7XG5cdFx0XHRcdGRhdGEgPSBuZXcgVWludDMyQXJyYXkoZGF0YSk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ0ZMT0FUJykge1xuXHRcdFx0XHRkYXRhID0gbmV3IEZsb2F0MzJBcnJheShkYXRhKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRhdGEgPSBuZXcgVWludDhBcnJheShkYXRhKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gc2V0IGVuc3VyZSB0eXBlIGNvcnJlc3BvbmRzIHRvIGRhdGFcblx0XHRpZiAoZGF0YSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcblx0XHRcdHRoaXMudHlwZSA9ICdVTlNJR05FRF9CWVRFJztcblx0XHR9IGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBVaW50MTZBcnJheSkge1xuXHRcdFx0dGhpcy50eXBlID0gJ1VOU0lHTkVEX1NIT1JUJztcblx0XHR9IGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBVaW50MzJBcnJheSkge1xuXHRcdFx0dGhpcy50eXBlID0gJ1VOU0lHTkVEX0lOVCc7XG5cdFx0fSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5KSB7XG5cdFx0XHR0aGlzLnR5cGUgPSAnRkxPQVQnO1xuXHRcdH0gZWxzZSBpZiAoZGF0YSAmJiAhKGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikgJiYgIVV0aWwuaXNDYW52YXNUeXBlKGRhdGEpKSB7XG5cdFx0XHR0aHJvdyAnQXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIGBBcnJheWAsIGBBcnJheUJ1ZmZlcmAsICcgK1xuXHRcdFx0XHQnYEFycmF5QnVmZmVyVmlld2AsIGBJbWFnZURhdGFgLCBgSFRNTEltYWdlRWxlbWVudGAsICcgK1xuXHRcdFx0XHQnYEhUTUxDYW52YXNFbGVtZW50YCwgYEhUTUxWaWRlb0VsZW1lbnRgLCBvciBudWxsJztcblx0XHR9XG5cdFx0Ly8gYnVmZmVyIHRoZSBkYXRhXG5cdFx0aWYgKFV0aWwuaXNDYW52YXNUeXBlKGRhdGEpKSB7XG5cdFx0XHQvLyBzdG9yZSB3aWR0aCBhbmQgaGVpZ2h0XG5cdFx0XHR0aGlzLndpZHRoID0gZGF0YS53aWR0aDtcblx0XHRcdHRoaXMuaGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XG5cdFx0XHQvLyBidWZmZXIgdGhlIHRleHR1cmVcblx0XHRcdGdsLnRleEltYWdlMkQoXG5cdFx0XHRcdGdsW3RhcmdldF0sXG5cdFx0XHRcdDAsIC8vIG1pcC1tYXAgbGV2ZWwsXG5cdFx0XHRcdGdsW3RoaXMuZm9ybWF0XSwgLy8gd2ViZ2wgcmVxdWlyZXMgZm9ybWF0ID09PSBpbnRlcm5hbEZvcm1hdFxuXHRcdFx0XHRnbFt0aGlzLmZvcm1hdF0sXG5cdFx0XHRcdGdsW3RoaXMudHlwZV0sXG5cdFx0XHRcdGRhdGEpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBidWZmZXIgdGhlIHRleHR1cmUgZGF0YVxuXHRcdFx0Z2wudGV4SW1hZ2UyRChcblx0XHRcdFx0Z2xbdGFyZ2V0XSxcblx0XHRcdFx0MCwgLy8gbWlwLW1hcCBsZXZlbFxuXHRcdFx0XHRnbFt0aGlzLmZvcm1hdF0sIC8vIHdlYmdsIHJlcXVpcmVzIGZvcm1hdCA9PT0gaW50ZXJuYWxGb3JtYXRcblx0XHRcdFx0dGhpcy53aWR0aCxcblx0XHRcdFx0dGhpcy5oZWlnaHQsXG5cdFx0XHRcdDAsIC8vIGJvcmRlciwgbXVzdCBiZSAwXG5cdFx0XHRcdGdsW3RoaXMuZm9ybWF0XSxcblx0XHRcdFx0Z2xbdGhpcy50eXBlXSxcblx0XHRcdFx0ZGF0YSk7XG5cdFx0fVxuXHRcdC8vIHRyYWNrIHRoZSBmYWNlIHRoYXQgd2FzIGJ1ZmZlcmVkXG5cdFx0aWYgKHRoaXMuYnVmZmVyZWRGYWNlcy5pbmRleE9mKHRhcmdldCkgPCAwKSB7XG5cdFx0XHR0aGlzLmJ1ZmZlcmVkRmFjZXMucHVzaCh0YXJnZXQpO1xuXHRcdH1cblx0XHQvLyBpZiBhbGwgZmFjZXMgYnVmZmVyZWQsIGdlbmVyYXRlIG1pcG1hcHNcblx0XHRpZiAodGhpcy5taXBNYXAgJiYgdGhpcy5idWZmZXJlZEZhY2VzLmxlbmd0aCA9PT0gNikge1xuXHRcdFx0Ly8gb25seSBnZW5lcmF0ZSBtaXBtYXBzIGlmIGFsbCBmYWNlcyBhcmUgYnVmZmVyZWRcblx0XHRcdGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfQ1VCRV9NQVApO1xuXHRcdH1cblx0XHQvLyB1bmJpbmQgdGV4dHVyZVxuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIG51bGwpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgdGV4dHVyZSBwYXJhbWV0ZXJzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgYnkgbmFtZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtcy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLndyYXBTIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgUyBkaW1lbnNpb24uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMud3JhcFQgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBUIGRpbWVuc2lvbi5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtcy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLm1pbkZpbHRlciAtIFRoZSBtaW5pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMubWFnRmlsdGVyIC0gVGhlIG1hZ25pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtUZXh0dXJlQ3ViZU1hcH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRzZXRQYXJhbWV0ZXJzKHBhcmFtcykge1xuXHRcdGNvbnN0IGdsID0gdGhpcy5nbDtcblx0XHQvLyBiaW5kIHRleHR1cmVcblx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCB0aGlzLnRleHR1cmUpO1xuXHRcdC8vIHNldCB3cmFwIFMgcGFyYW1ldGVyXG5cdFx0bGV0IHBhcmFtID0gcGFyYW1zLndyYXBTIHx8IHBhcmFtcy53cmFwO1xuXHRcdGlmIChwYXJhbSkge1xuXHRcdFx0aWYgKFdSQVBfTU9ERVNbcGFyYW1dKSB7XG5cdFx0XHRcdHRoaXMud3JhcFMgPSBwYXJhbTtcblx0XHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfUywgZ2xbdGhpcy53cmFwU10pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgYFRleHR1cmUgcGFyYW1ldGVyIFxcYCR7cGFyYW19XFxgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBcXGBURVhUVVJFX1dSQVBfU1xcYGA7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIHNldCB3cmFwIFQgcGFyYW1ldGVyXG5cdFx0cGFyYW0gPSBwYXJhbXMud3JhcFQgfHwgcGFyYW1zLndyYXA7XG5cdFx0aWYgKHBhcmFtKSB7XG5cdFx0XHRpZiAoV1JBUF9NT0RFU1twYXJhbV0pIHtcblx0XHRcdFx0dGhpcy53cmFwVCA9IHBhcmFtO1xuXHRcdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbFt0aGlzLndyYXBUXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIFxcYFRFWFRVUkVfV1JBUF9UXFxgYDtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gc2V0IG1hZyBmaWx0ZXIgcGFyYW1ldGVyXG5cdFx0cGFyYW0gPSBwYXJhbXMubWFnRmlsdGVyIHx8IHBhcmFtcy5maWx0ZXI7XG5cdFx0aWYgKHBhcmFtKSB7XG5cdFx0XHRpZiAoTUFHX0ZJTFRFUlNbcGFyYW1dKSB7XG5cdFx0XHRcdHRoaXMubWFnRmlsdGVyID0gcGFyYW07XG5cdFx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbFt0aGlzLm1hZ0ZpbHRlcl0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgYFRleHR1cmUgcGFyYW1ldGVyIFxcYCR7cGFyYW19XFxgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciAnVEVYVFVSRV9NQUdfRklMVEVSXFxgYDtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gc2V0IG1pbiBmaWx0ZXIgcGFyYW1ldGVyXG5cdFx0cGFyYW0gPSBwYXJhbXMubWluRmlsdGVyIHx8IHBhcmFtcy5maWx0ZXI7XG5cdFx0aWYgKHBhcmFtKSB7XG5cdFx0XHRpZiAodGhpcy5taXBNYXApIHtcblx0XHRcdFx0aWYgKE5PTl9NSVBNQVBfTUlOX0ZJTFRFUlNbcGFyYW1dKSB7XG5cdFx0XHRcdFx0Ly8gdXBncmFkZSB0byBtaXAtbWFwIG1pbiBmaWx0ZXJcblx0XHRcdFx0XHRwYXJhbSArPSBERUZBVUxUX01JUE1BUF9NSU5fRklMVEVSX1NVRkZJWDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoTUlQTUFQX01JTl9GSUxURVJTW3BhcmFtXSkge1xuXHRcdFx0XHRcdHRoaXMubWluRmlsdGVyID0gcGFyYW07XG5cdFx0XHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsW3RoaXMubWluRmlsdGVyXSk7XG5cdFx0XHRcdH0gZWxzZSAge1xuXHRcdFx0XHRcdHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgXFxgVEVYVFVSRV9NSU5fRklMVEVSXFxgYDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKE1JTl9GSUxURVJTW3BhcmFtXSkge1xuXHRcdFx0XHRcdHRoaXMubWluRmlsdGVyID0gcGFyYW07XG5cdFx0XHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsW3RoaXMubWluRmlsdGVyXSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhyb3cgYFRleHR1cmUgcGFyYW1ldGVyIFxcYCR7cGFyYW19XFxgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBcXGBURVhUVVJFX01JTl9GSUxURVJcXGBgO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIHVuYmluZCB0ZXh0dXJlXG5cdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgbnVsbCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlQ3ViZU1hcDtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcblxuY29uc3QgTU9ERVMgPSB7XG5cdFBPSU5UUzogdHJ1ZSxcblx0TElORVM6IHRydWUsXG5cdExJTkVfU1RSSVA6IHRydWUsXG5cdExJTkVfTE9PUDogdHJ1ZSxcblx0VFJJQU5HTEVTOiB0cnVlLFxuXHRUUklBTkdMRV9TVFJJUDogdHJ1ZSxcblx0VFJJQU5HTEVfRkFOOiB0cnVlXG59O1xuY29uc3QgVFlQRVMgPSB7XG5cdEJZVEU6IHRydWUsXG5cdFVOU0lHTkVEX0JZVEU6IHRydWUsXG5cdFNIT1JUOiB0cnVlLFxuXHRVTlNJR05FRF9TSE9SVDogdHJ1ZSxcblx0RklYRUQ6IHRydWUsXG5cdEZMT0FUOiB0cnVlXG59O1xuY29uc3QgQllURVNfUEVSX1RZUEUgPSB7XG5cdEJZVEU6IDEsXG5cdFVOU0lHTkVEX0JZVEU6IDEsXG5cdFNIT1JUOiAyLFxuXHRVTlNJR05FRF9TSE9SVDogMixcblx0RklYRUQ6IDQsXG5cdEZMT0FUOiA0XG59O1xuY29uc3QgU0laRVMgPSB7XG5cdDE6IHRydWUsXG5cdDI6IHRydWUsXG5cdDM6IHRydWUsXG5cdDQ6IHRydWVcbn07XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgYXR0cmlidXRlIHBvaW50IGJ5dGUgb2Zmc2V0LlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7bnVtYmVyfVxuICovXG5jb25zdCBERUZBVUxUX0JZVEVfT0ZGU0VUID0gMDtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCByZW5kZXIgbW9kZSAocHJpbWl0aXZlIHR5cGUpLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7c3RyaW5nfVxuICovXG5jb25zdCBERUZBVUxUX01PREUgPSAnVFJJQU5HTEVTJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBpbmRleCBvZmZzZXQgdG8gcmVuZGVyIGZyb20uXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtudW1iZXJ9XG4gKi9cbmNvbnN0IERFRkFVTFRfSU5ERVhfT0ZGU0VUID0gMDtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBjb3VudCBvZiBpbmRpY2VzIHRvIHJlbmRlci5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge251bWJlcn1cbiAqL1xuY29uc3QgREVGQVVMVF9DT1VOVCA9IDA7XG5cbi8qKlxuICogUGFyc2UgdGhlIGF0dHJpYnV0ZSBwb2ludGVycyBhbmQgZGV0ZXJtaW5lIHRoZSBieXRlIHN0cmlkZSBvZiB0aGUgYnVmZmVyLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtNYXB9IGF0dHJpYnV0ZVBvaW50ZXJzIC0gVGhlIGF0dHJpYnV0ZSBwb2ludGVyIG1hcC5cbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgYnl0ZSBzdHJpZGUgb2YgdGhlIGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gZ2V0U3RyaWRlKGF0dHJpYnV0ZVBvaW50ZXJzKSB7XG5cdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lIGF0dHJpYnV0ZSBwb2ludGVyIGFzc2lnbmVkIHRvIHRoaXMgYnVmZmVyLFxuXHQvLyB0aGVyZSBpcyBubyBuZWVkIGZvciBzdHJpZGUsIHNldCB0byBkZWZhdWx0IG9mIDBcblx0aWYgKGF0dHJpYnV0ZVBvaW50ZXJzLnNpemUgPT09IDEpIHtcblx0XHRyZXR1cm4gMDtcblx0fVxuXHRsZXQgbWF4Qnl0ZU9mZnNldCA9IDA7XG5cdGxldCBieXRlU2l6ZVN1bSA9IDA7XG5cdGxldCBieXRlU3RyaWRlID0gMDtcblx0YXR0cmlidXRlUG9pbnRlcnMuZm9yRWFjaChwb2ludGVyID0+IHtcblx0XHRjb25zdCBieXRlT2Zmc2V0ID0gcG9pbnRlci5ieXRlT2Zmc2V0O1xuXHRcdGNvbnN0IHNpemUgPSBwb2ludGVyLnNpemU7XG5cdFx0Y29uc3QgdHlwZSA9IHBvaW50ZXIudHlwZTtcblx0XHQvLyB0cmFjayB0aGUgc3VtIG9mIGVhY2ggYXR0cmlidXRlIHNpemVcblx0XHRieXRlU2l6ZVN1bSArPSBzaXplICogQllURVNfUEVSX1RZUEVbdHlwZV07XG5cdFx0Ly8gdHJhY2sgdGhlIGxhcmdlc3Qgb2Zmc2V0IHRvIGRldGVybWluZSB0aGUgYnl0ZSBzdHJpZGUgb2YgdGhlIGJ1ZmZlclxuXHRcdGlmIChieXRlT2Zmc2V0ID4gbWF4Qnl0ZU9mZnNldCkge1xuXHRcdFx0bWF4Qnl0ZU9mZnNldCA9IGJ5dGVPZmZzZXQ7XG5cdFx0XHRieXRlU3RyaWRlID0gYnl0ZU9mZnNldCArIChzaXplICogQllURVNfUEVSX1RZUEVbdHlwZV0pO1xuXHRcdH1cblx0fSk7XG5cdC8vIGNoZWNrIGlmIHRoZSBtYXggYnl0ZSBvZmZzZXQgaXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSB0aGUgc3VtIG9mXG5cdC8vIHRoZSBzaXplcy4gSWYgc28gdGhpcyBidWZmZXIgaXMgbm90IGludGVybGVhdmVkIGFuZCBkb2VzIG5vdCBuZWVkIGFcblx0Ly8gc3RyaWRlLlxuXHRpZiAobWF4Qnl0ZU9mZnNldCA+PSBieXRlU2l6ZVN1bSkge1xuXHRcdC8vIFRPRE86IHRlc3Qgd2hhdCBzdHJpZGUgPT09IDAgZG9lcyBmb3IgYW4gaW50ZXJsZWF2ZWQgYnVmZmVyIG9mXG5cdFx0Ly8gbGVuZ3RoID09PSAxLlxuXHRcdHJldHVybiAwO1xuXHR9XG5cdHJldHVybiBieXRlU3RyaWRlO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBhdHRyaWJ1dGUgcG9pbnRlcnMgdG8gZW5zdXJlIHRoZXkgYXJlIHZhbGlkLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZVBvaW50ZXJzIC0gVGhlIGF0dHJpYnV0ZSBwb2ludGVyIG1hcC5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgdmFsaWRhdGVkIGF0dHJpYnV0ZSBwb2ludGVyIG1hcC5cbiAqL1xuZnVuY3Rpb24gZ2V0QXR0cmlidXRlUG9pbnRlcnMoYXR0cmlidXRlUG9pbnRlcnMpIHtcblx0Ly8gcGFyc2UgcG9pbnRlcnMgdG8gZW5zdXJlIHRoZXkgYXJlIHZhbGlkXG5cdGNvbnN0IHBvaW50ZXJzID0gbmV3IE1hcCgpO1xuXHRPYmplY3Qua2V5cyhhdHRyaWJ1dGVQb2ludGVycykuZm9yRWFjaChrZXkgPT4ge1xuXHRcdGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoa2V5LCAxMCk7XG5cdFx0Ly8gY2hlY2sgdGhhdCBrZXkgaXMgYW4gdmFsaWQgaW50ZWdlclxuXHRcdGlmIChpc05hTihpbmRleCkpIHtcblx0XHRcdHRocm93IGBBdHRyaWJ1dGUgaW5kZXggXFxgJHtrZXl9XFxgIGRvZXMgbm90IHJlcHJlc2VudCBhbiBpbnRlZ2VyYDtcblx0XHR9XG5cdFx0Y29uc3QgcG9pbnRlciA9IGF0dHJpYnV0ZVBvaW50ZXJzW2tleV07XG5cdFx0Y29uc3Qgc2l6ZSA9IHBvaW50ZXIuc2l6ZTtcblx0XHRjb25zdCB0eXBlID0gcG9pbnRlci50eXBlO1xuXHRcdGNvbnN0IGJ5dGVPZmZzZXQgPSBwb2ludGVyLmJ5dGVPZmZzZXQ7XG5cdFx0Ly8gY2hlY2sgc2l6ZVxuXHRcdGlmICghU0laRVNbc2l6ZV0pIHtcblx0XHRcdHRocm93ICdBdHRyaWJ1dGUgcG9pbnRlciBgc2l6ZWAgcGFyYW1ldGVyIGlzIGludmFsaWQsIG11c3QgYmUgb25lIG9mICcgK1xuXHRcdFx0XHRKU09OLnN0cmluZ2lmeShPYmplY3Qua2V5cyhTSVpFUykpO1xuXHRcdH1cblx0XHQvLyBjaGVjayB0eXBlXG5cdFx0aWYgKCFUWVBFU1t0eXBlXSkge1xuXHRcdFx0dGhyb3cgJ0F0dHJpYnV0ZSBwb2ludGVyIGB0eXBlYCBwYXJhbWV0ZXIgaXMgaW52YWxpZCwgbXVzdCBiZSBvbmUgb2YgJyArXG5cdFx0XHRcdEpTT04uc3RyaW5naWZ5KE9iamVjdC5rZXlzKFRZUEVTKSk7XG5cdFx0fVxuXHRcdHBvaW50ZXJzLnNldChpbmRleCwge1xuXHRcdFx0c2l6ZTogc2l6ZSxcblx0XHRcdHR5cGU6IHR5cGUsXG5cdFx0XHRieXRlT2Zmc2V0OiAoYnl0ZU9mZnNldCAhPT0gdW5kZWZpbmVkKSA/IGJ5dGVPZmZzZXQgOiBERUZBVUxUX0JZVEVfT0ZGU0VUXG5cdFx0fSk7XG5cdH0pO1xuXHRyZXR1cm4gcG9pbnRlcnM7XG59XG5cbi8qKlxuICogQSB2ZXJ0ZXggYnVmZmVyIG9iamVjdC5cbiAqL1xuY2xhc3MgVmVydGV4QnVmZmVyIHtcblxuXHQvKipcblx0ICogSW5zdGFudGlhdGVzIGFuIFZlcnRleEJ1ZmZlciBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7V2ViR0xCdWZmZXJ8VmVydGV4UGFja2FnZXxBcnJheUJ1ZmZlcnxBcnJheXxOdW1iZXJ9IGFyZyAtIFRoZSBidWZmZXIgb3IgbGVuZ3RoIG9mIHRoZSBidWZmZXIuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVQb2ludGVycyAtIFRoZSBhcnJheSBwb2ludGVyIG1hcCwgb3IgaW4gdGhlIGNhc2Ugb2YgYSB2ZXJ0ZXggcGFja2FnZSBhcmcsIHRoZSBvcHRpb25zLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSByZW5kZXJpbmcgb3B0aW9ucy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuaW5kZXhPZmZzZXQgLSBUaGUgaW5kZXggb2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuY291bnQgLSBUaGUgbnVtYmVyIG9mIGluZGljZXMgdG8gZHJhdy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGFyZywgYXR0cmlidXRlUG9pbnRlcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0dGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcblx0XHR0aGlzLmJ1ZmZlciA9IG51bGw7XG5cdFx0dGhpcy5tb2RlID0gTU9ERVNbb3B0aW9ucy5tb2RlXSA/IG9wdGlvbnMubW9kZSA6IERFRkFVTFRfTU9ERTtcblx0XHR0aGlzLmNvdW50ID0gKG9wdGlvbnMuY291bnQgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmNvdW50IDogREVGQVVMVF9DT1VOVDtcblx0XHR0aGlzLmluZGV4T2Zmc2V0ID0gKG9wdGlvbnMuaW5kZXhPZmZzZXQgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmluZGV4T2Zmc2V0IDogREVGQVVMVF9JTkRFWF9PRkZTRVQ7XG5cdFx0Ly8gZmlyc3QsIHNldCB0aGUgYXR0cmlidXRlIHBvaW50ZXJzXG5cdFx0dGhpcy5wb2ludGVycyA9IGdldEF0dHJpYnV0ZVBvaW50ZXJzKGF0dHJpYnV0ZVBvaW50ZXJzKTtcblx0XHQvLyBzZXQgdGhlIGJ5dGUgc3RyaWRlXG5cdFx0dGhpcy5ieXRlU3RyaWRlID0gZ2V0U3RyaWRlKHRoaXMucG9pbnRlcnMpO1xuXHRcdC8vIHRoZW4gYnVmZmVyIHRoZSBkYXRhXG5cdFx0aWYgKGFyZykge1xuXHRcdFx0aWYgKGFyZyBpbnN0YW5jZW9mIFdlYkdMQnVmZmVyKSB7XG5cdFx0XHRcdC8vIFdlYkdMQnVmZmVyIGFyZ3VtZW50XG5cdFx0XHRcdHRoaXMuYnVmZmVyID0gYXJnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gQXJyYXkgb3IgQXJyYXlCdWZmZXIgb3IgbnVtYmVyIGFyZ3VtZW50XG5cdFx0XHRcdHRoaXMuYnVmZmVyRGF0YShhcmcpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBVcGxvYWQgdmVydGV4IGRhdGEgdG8gdGhlIEdQVS5cblx0ICpcblx0ICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcnxBcnJheUJ1ZmZlclZpZXd8bnVtYmVyfSBhcmcgLSBUaGUgYXJyYXkgb2YgZGF0YSB0byBidWZmZXIsIG9yIHNpemUgb2YgdGhlIGJ1ZmZlciBpbiBieXRlcy5cblx0ICpcblx0ICogQHJldHVybnMge1ZlcnRleEJ1ZmZlcn0gVGhlIHZlcnRleCBidWZmZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRidWZmZXJEYXRhKGFyZykge1xuXHRcdGNvbnN0IGdsID0gdGhpcy5nbDtcblx0XHQvLyBlbnN1cmUgYXJndW1lbnQgaXMgdmFsaWRcblx0XHRpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG5cdFx0XHQvLyBjYXN0IGFycmF5IGludG8gRmxvYXQzMkFycmF5XG5cdFx0XHRhcmcgPSBuZXcgRmxvYXQzMkFycmF5KGFyZyk7XG5cdFx0fSBlbHNlIGlmIChcblx0XHRcdCEoYXJnIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpICYmXG5cdFx0XHQhKEFycmF5QnVmZmVyLmlzVmlldyhhcmcpKSAmJlxuXHRcdFx0IShOdW1iZXIuaXNJbnRlZ2VyKGFyZykpXG5cdFx0XHQpIHtcblx0XHRcdC8vIGlmIG5vdCBhcnJheWJ1ZmZlciBvciBhIG51bWVyaWMgc2l6ZVxuXHRcdFx0dGhyb3cgJ0FyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBgQXJyYXlgLCBgQXJyYXlCdWZmZXJgLCBgQXJyYXlCdWZmZXJWaWV3YCwgb3IgYE51bWJlcmAnO1xuXHRcdH1cblx0XHQvLyBjcmVhdGUgYnVmZmVyIGlmIGl0IGRvZXNuJ3QgZXhpc3QgYWxyZWFkeVxuXHRcdGlmICghdGhpcy5idWZmZXIpIHtcblx0XHRcdHRoaXMuYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cdFx0fVxuXHRcdC8vIGJ1ZmZlciB0aGUgZGF0YVxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcik7XG5cdFx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGFyZywgZ2wuU1RBVElDX0RSQVcpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVwbG9hZCBwYXJ0aWFsIHZlcnRleCBkYXRhIHRvIHRoZSBHUFUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7QXJyYXl8QXJyYXlCdWZmZXJ9IGFycmF5IC0gVGhlIGFycmF5IG9mIGRhdGEgdG8gYnVmZmVyLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gYnl0ZU9mZnNldCAtIFRoZSBieXRlIG9mZnNldCBhdCB3aGljaCB0byBidWZmZXIuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtWZXJ0ZXhCdWZmZXJ9IFRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0YnVmZmVyU3ViRGF0YShhcnJheSwgYnl0ZU9mZnNldCA9IERFRkFVTFRfQllURV9PRkZTRVQpIHtcblx0XHRjb25zdCBnbCA9IHRoaXMuZ2w7XG5cdFx0Ly8gZW5zdXJlIHRoZSBidWZmZXIgZXhpc3RzXG5cdFx0aWYgKCF0aGlzLmJ1ZmZlcikge1xuXHRcdFx0dGhyb3cgJ0J1ZmZlciBoYXMgbm90IHlldCBiZWVuIGFsbG9jYXRlZCwgYWxsb2NhdGUgd2l0aCBgYnVmZmVyRGF0YWAnO1xuXHRcdH1cblx0XHQvLyBlbnN1cmUgYXJndW1lbnQgaXMgdmFsaWRcblx0XHRpZiAoQXJyYXkuaXNBcnJheShhcnJheSkpIHtcblx0XHRcdGFycmF5ID0gbmV3IEZsb2F0MzJBcnJheShhcnJheSk7XG5cdFx0fSBlbHNlIGlmIChcblx0XHRcdCEoYXJyYXkgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikgJiZcblx0XHRcdCFBcnJheUJ1ZmZlci5pc1ZpZXcoYXJyYXkpXG5cdFx0XHQpIHtcblx0XHRcdHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgb3IgYEFycmF5QnVmZmVyVmlld2AnO1xuXHRcdH1cblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIpO1xuXHRcdGdsLmJ1ZmZlclN1YkRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBieXRlT2Zmc2V0LCBhcnJheSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogQmluZHMgdGhlIHZlcnRleCBidWZmZXIgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7VmVydGV4QnVmZmVyfSAtIFJldHVybnMgdGhlIHZlcnRleCBidWZmZXIgb2JqZWN0IGZvciBjaGFpbmluZy5cblx0ICovXG5cdGJpbmQoKSB7XG5cdFx0Y29uc3QgZ2wgPSB0aGlzLmdsO1xuXHRcdC8vIGJpbmQgYnVmZmVyXG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVyKTtcblx0XHQvLyBmb3IgZWFjaCBhdHRyaWJ1dGUgcG9pbnRlclxuXHRcdHRoaXMucG9pbnRlcnMuZm9yRWFjaCgocG9pbnRlciwgaW5kZXgpID0+IHtcblx0XHRcdC8vIHNldCBhdHRyaWJ1dGUgcG9pbnRlclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihcblx0XHRcdFx0aW5kZXgsXG5cdFx0XHRcdHBvaW50ZXIuc2l6ZSxcblx0XHRcdFx0Z2xbcG9pbnRlci50eXBlXSxcblx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdHRoaXMuYnl0ZVN0cmlkZSxcblx0XHRcdFx0cG9pbnRlci5ieXRlT2Zmc2V0KTtcblx0XHRcdC8vIGVuYWJsZSBhdHRyaWJ1dGUgaW5kZXhcblx0XHRcdGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGluZGV4KTtcblx0XHR9KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBVbmJpbmRzIHRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdC5cblx0ICpcblx0ICogQHJldHVybnMge1ZlcnRleEJ1ZmZlcn0gVGhlIHZlcnRleCBidWZmZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHR1bmJpbmQoKSB7XG5cdFx0Y29uc3QgZ2wgPSB0aGlzLmdsO1xuXHRcdC8vIHVuYmluZCBidWZmZXJcblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIpO1xuXHRcdHRoaXMucG9pbnRlcnMuZm9yRWFjaCgocG9pbnRlciwgaW5kZXgpID0+IHtcblx0XHRcdC8vIGRpc2FibGUgYXR0cmlidXRlIGluZGV4XG5cdFx0XHRnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoaW5kZXgpO1xuXHRcdH0pO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGUgdGhlIGRyYXcgY29tbWFuZCBmb3IgdGhlIGJvdW5kIGJ1ZmZlci5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBwYXNzIHRvICdkcmF3QXJyYXlzJy4gT3B0aW9uYWwuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLm1vZGUgLSBUaGUgZHJhdyBtb2RlIC8gcHJpbWl0aXZlIHR5cGUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmluZGV4T2Zmc2V0IC0gVGhlIGluZGV4IG9mZnNldCBpbnRvIHRoZSBkcmF3biBidWZmZXIuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvdW50IC0gVGhlIG51bWJlciBvZiBpbmRpY2VzIHRvIGRyYXcuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtWZXJ0ZXhCdWZmZXJ9IFRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0ZHJhdyhvcHRpb25zID0ge30pIHtcblx0XHRjb25zdCBnbCA9IHRoaXMuZ2w7XG5cdFx0Y29uc3QgbW9kZSA9IGdsW29wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGVdO1xuXHRcdGNvbnN0IGluZGV4T2Zmc2V0ID0gKG9wdGlvbnMuaW5kZXhPZmZzZXQgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmluZGV4T2Zmc2V0IDogdGhpcy5pbmRleE9mZnNldDtcblx0XHRjb25zdCBjb3VudCA9IChvcHRpb25zLmNvdW50ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5jb3VudCA6IHRoaXMuY291bnQ7XG5cdFx0aWYgKGNvdW50ID09PSAwKSB7XG5cdFx0XHR0aHJvdyAnQXR0ZW1wdGluZyB0byBkcmF3IHdpdGggYSBjb3VudCBvZiAwJztcblx0XHR9XG5cdFx0Ly8gZHJhdyBlbGVtZW50c1xuXHRcdGdsLmRyYXdBcnJheXMobW9kZSwgaW5kZXhPZmZzZXQsIGNvdW50KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZlcnRleEJ1ZmZlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgQ09NUE9ORU5UX1RZUEUgPSAnRkxPQVQnO1xuY29uc3QgQllURVNfUEVSX0NPTVBPTkVOVCA9IDQ7XG5cbi8qKlxuICogUmVtb3ZlcyBpbnZhbGlkIGF0dHJpYnV0ZSBhcmd1bWVudHMuIEEgdmFsaWQgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBsZW5ndGggPiAwIGtleSBieSBhIHN0cmluZyByZXByZXNlbnRpbmcgYW4gaW50LlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgLSBUaGUgbWFwIG9mIHZlcnRleCBhdHRyaWJ1dGVzLlxuICpcbiAqIEByZXR1cm5zIHtBcnJheX0gVGhlIHZhbGlkIGFycmF5IG9mIGFyZ3VtZW50cy5cbiAqL1xuZnVuY3Rpb24gcGFyc2VBdHRyaWJ1dGVNYXAoYXR0cmlidXRlcykge1xuXHRjb25zdCBnb29kQXR0cmlidXRlcyA9IFtdO1xuXHRPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0Y29uc3QgaW5kZXggPSBwYXJzZUZsb2F0KGtleSk7XG5cdFx0Ly8gY2hlY2sgdGhhdCBrZXkgaXMgYW4gdmFsaWQgaW50ZWdlclxuXHRcdGlmICghTnVtYmVyLmlzSW50ZWdlcihpbmRleCkgfHwgaW5kZXggPCAwKSB7XG5cdFx0XHR0aHJvdyBgQXR0cmlidXRlIGluZGV4IFxcYCR7a2V5fVxcYCBkb2VzIG5vdCByZXByZXNlbnQgYSB2YWxpZCBpbnRlZ2VyYDtcblx0XHR9XG5cdFx0Y29uc3QgdmVydGljZXMgPSBhdHRyaWJ1dGVzW2tleV07XG5cdFx0Ly8gZW5zdXJlIGF0dHJpYnV0ZSBpcyB2YWxpZFxuXHRcdGlmIChBcnJheS5pc0FycmF5KHZlcnRpY2VzKSAmJiB2ZXJ0aWNlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHQvLyBhZGQgYXR0cmlidXRlIGRhdGEgYW5kIGluZGV4XG5cdFx0XHRnb29kQXR0cmlidXRlcy5wdXNoKHtcblx0XHRcdFx0aW5kZXg6IGluZGV4LFxuXHRcdFx0XHRkYXRhOiB2ZXJ0aWNlc1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IGBFcnJvciBwYXJzaW5nIGF0dHJpYnV0ZSBvZiBpbmRleCBcXGAke2luZGV4fVxcYGA7XG5cdFx0fVxuXHR9KTtcblx0Ly8gc29ydCBhdHRyaWJ1dGVzIGFzY2VuZGluZyBieSBpbmRleFxuXHRnb29kQXR0cmlidXRlcy5zb3J0KChhLCBiKSA9PiB7XG5cdFx0cmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xuXHR9KTtcblx0cmV0dXJuIGdvb2RBdHRyaWJ1dGVzO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBjb21wb25lbnQncyBieXRlIHNpemUuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gY29tcG9uZW50IC0gVGhlIGNvbXBvbmVudCB0byBtZWFzdXJlLlxuICpcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBieXRlIHNpemUgb2YgdGhlIGNvbXBvbmVudC5cbiAqL1xuZnVuY3Rpb24gZ2V0Q29tcG9uZW50U2l6ZShjb21wb25lbnQpIHtcblx0Ly8gY2hlY2sgaWYgYXJyYXlcblx0aWYgKEFycmF5LmlzQXJyYXkoY29tcG9uZW50KSkge1xuXHRcdHJldHVybiBjb21wb25lbnQubGVuZ3RoO1xuXHR9XG5cdC8vIGNoZWNrIGlmIHZlY3RvclxuXHRpZiAoY29tcG9uZW50LnggIT09IHVuZGVmaW5lZCkge1xuXHRcdC8vIDEgY29tcG9uZW50IHZlY3RvclxuXHRcdGlmIChjb21wb25lbnQueSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyAyIGNvbXBvbmVudCB2ZWN0b3Jcblx0XHRcdGlmIChjb21wb25lbnQueiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdC8vIDMgY29tcG9uZW50IHZlY3RvclxuXHRcdFx0XHRpZiAoY29tcG9uZW50LncgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdC8vIDQgY29tcG9uZW50IHZlY3RvclxuXHRcdFx0XHRcdHJldHVybiA0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAzO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIDI7XG5cdFx0fVxuXHRcdHJldHVybiAxO1xuXHR9XG5cdC8vIHNpbmdsZSBjb21wb25lbnRcblx0cmV0dXJuIDE7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgdHlwZSwgc2l6ZSwgYW5kIG9mZnNldCBmb3IgZWFjaCBhdHRyaWJ1dGUgaW4gdGhlIGF0dHJpYnV0ZVxuICogYXJyYXkgYWxvbmcgd2l0aCB0aGUgbGVuZ3RoIGFuZCBzdHJpZGUgb2YgdGhlIHBhY2thZ2UuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge1ZlcnRleFBhY2thZ2V9IHZlcnRleFBhY2thZ2UgLSBUaGUgVmVydGV4UGFja2FnZSBvYmplY3QuXG4gKiBAcGFyYW0ge0FycmF5fSBhdHRyaWJ1dGVzIC0gVGhlIGFycmF5IG9mIHZlcnRleCBhdHRyaWJ1dGVzLlxuICovXG5mdW5jdGlvbiBzZXRQb2ludGVyc0FuZFN0cmlkZSh2ZXJ0ZXhQYWNrYWdlLCBhdHRyaWJ1dGVzKSB7XG5cdGxldCBzaG9ydGVzdEFycmF5ID0gTnVtYmVyLk1BWF9WQUxVRTtcblx0bGV0IG9mZnNldCA9IDA7XG5cdC8vIGZvciBlYWNoIGF0dHJpYnV0ZVxuXHRhdHRyaWJ1dGVzLmZvckVhY2godmVydGljZXMgPT4ge1xuXHRcdC8vIHNldCBzaXplIHRvIG51bWJlciBvZiBjb21wb25lbnRzIGluIHRoZSBhdHRyaWJ1dGVcblx0XHRjb25zdCBzaXplID0gZ2V0Q29tcG9uZW50U2l6ZSh2ZXJ0aWNlcy5kYXRhWzBdKTtcblx0XHQvLyBsZW5ndGggb2YgdGhlIHBhY2thZ2Ugd2lsbCBiZSB0aGUgc2hvcnRlc3QgYXR0cmlidXRlIGFycmF5IGxlbmd0aFxuXHRcdHNob3J0ZXN0QXJyYXkgPSBNYXRoLm1pbihzaG9ydGVzdEFycmF5LCB2ZXJ0aWNlcy5kYXRhLmxlbmd0aCk7XG5cdFx0Ly8gc3RvcmUgcG9pbnRlciB1bmRlciBpbmRleFxuXHRcdHZlcnRleFBhY2thZ2UucG9pbnRlcnNbdmVydGljZXMuaW5kZXhdID0ge1xuXHRcdFx0dHlwZTogQ09NUE9ORU5UX1RZUEUsXG5cdFx0XHRzaXplOiBzaXplLFxuXHRcdFx0Ynl0ZU9mZnNldDogb2Zmc2V0ICogQllURVNfUEVSX0NPTVBPTkVOVFxuXHRcdH07XG5cdFx0Ly8gYWNjdW11bGF0ZSBhdHRyaWJ1dGUgb2Zmc2V0XG5cdFx0b2Zmc2V0ICs9IHNpemU7XG5cdH0pO1xuXHQvLyBzZXQgc3RyaWRlIHRvIHRvdGFsIG9mZnNldFxuXHR2ZXJ0ZXhQYWNrYWdlLnN0cmlkZSA9IG9mZnNldDsgLy8gbm90IGluIGJ5dGVzXG5cdC8vIHNldCBsZW5ndGggb2YgcGFja2FnZSB0byB0aGUgc2hvcnRlc3QgYXR0cmlidXRlIGFycmF5IGxlbmd0aFxuXHR2ZXJ0ZXhQYWNrYWdlLmxlbmd0aCA9IHNob3J0ZXN0QXJyYXk7XG59XG5cbi8qKlxuICogRmlsbCB0aGUgYXJyYXlidWZmZXIgd2l0aCBhIHNpbmdsZSBjb21wb25lbnQgYXR0cmlidXRlLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IGJ1ZmZlciAtIFRoZSBhcnJheWJ1ZmZlciB0byBmaWxsLlxuICogQHBhcmFtIHtBcnJheX0gdmVydGljZXMgLSBUaGUgdmVydGV4IGF0dHJpYnV0ZSBhcnJheSB0byBjb3B5IGZyb20uXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgYnVmZmVyIHRvIGNvcHkgZnJvbS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXQgLSBUaGUgb2Zmc2V0IHRvIHRoZSBhdHRyaWJ1dGUsIG5vdCBpbiBieXRlcy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzdHJpZGUgLSBUaGUgc3RyaWRlIG9mIHRoZSBidWZmZXIsIG5vdCBpbiBieXRlcy5cbiAqL1xuZnVuY3Rpb24gc2V0MUNvbXBvbmVudEF0dHIoYnVmZmVyLCB2ZXJ0aWNlcywgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSkge1xuXHRmb3IgKGxldCBpPTA7IGk8bGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCB2ZXJ0ZXggPSB2ZXJ0aWNlc1tpXTtcblx0XHQvLyBnZXQgdGhlIGluZGV4IGluIHRoZSBidWZmZXIgdG8gdGhlIHBhcnRpY3VsYXIgdmVydGV4XG5cdFx0Y29uc3QgaiA9IG9mZnNldCArIChzdHJpZGUgKiBpKTtcblx0XHRpZiAodmVydGV4LnggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0YnVmZmVyW2pdID0gdmVydGV4Lng7XG5cdFx0fSBlbHNlIGlmICh2ZXJ0ZXhbMF0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0YnVmZmVyW2pdID0gdmVydGV4WzBdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRidWZmZXJbal0gPSB2ZXJ0ZXg7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogRmlsbCB0aGUgYXJyYXlidWZmZXIgd2l0aCBhIGRvdWJsZSBjb21wb25lbnQgYXR0cmlidXRlLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IGJ1ZmZlciAtIFRoZSBhcnJheWJ1ZmZlciB0byBmaWxsLlxuICogQHBhcmFtIHtBcnJheX0gdmVydGljZXMgLSBUaGUgdmVydGV4IGF0dHJpYnV0ZSBhcnJheSB0byBjb3B5IGZyb20uXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgYnVmZmVyIHRvIGNvcHkgZnJvbS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXQgLSBUaGUgb2Zmc2V0IHRvIHRoZSBhdHRyaWJ1dGUsIG5vdCBpbiBieXRlcy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzdHJpZGUgLSBUaGUgc3RyaWRlIG9mIHRoZSBidWZmZXIsIG5vdCBpbiBieXRlcy5cbiAqL1xuZnVuY3Rpb24gc2V0MkNvbXBvbmVudEF0dHIoYnVmZmVyLCB2ZXJ0aWNlcywgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSkge1xuXHRmb3IgKGxldCBpPTA7IGk8bGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCB2ZXJ0ZXggPSB2ZXJ0aWNlc1tpXTtcblx0XHQvLyBnZXQgdGhlIGluZGV4IGluIHRoZSBidWZmZXIgdG8gdGhlIHBhcnRpY3VsYXIgdmVydGV4XG5cdFx0Y29uc3QgaiA9IG9mZnNldCArIChzdHJpZGUgKiBpKTtcblx0XHRidWZmZXJbal0gPSAodmVydGV4LnggIT09IHVuZGVmaW5lZCkgPyB2ZXJ0ZXgueCA6IHZlcnRleFswXTtcblx0XHRidWZmZXJbaisxXSA9ICh2ZXJ0ZXgueSAhPT0gdW5kZWZpbmVkKSA/IHZlcnRleC55IDogdmVydGV4WzFdO1xuXHR9XG59XG5cbi8qKlxuICogRmlsbCB0aGUgYXJyYXlidWZmZXIgd2l0aCBhIHRyaXBsZSBjb21wb25lbnQgYXR0cmlidXRlLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IGJ1ZmZlciAtIFRoZSBhcnJheWJ1ZmZlciB0byBmaWxsLlxuICogQHBhcmFtIHtBcnJheX0gdmVydGljZXMgLSBUaGUgdmVydGV4IGF0dHJpYnV0ZSBhcnJheSB0byBjb3B5IGZyb20uXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgYnVmZmVyIHRvIGNvcHkgZnJvbS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXQgLSBUaGUgb2Zmc2V0IHRvIHRoZSBhdHRyaWJ1dGUsIG5vdCBpbiBieXRlcy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzdHJpZGUgLSBUaGUgc3RyaWRlIG9mIHRoZSBidWZmZXIsIG5vdCBpbiBieXRlcy5cbiAqL1xuZnVuY3Rpb24gc2V0M0NvbXBvbmVudEF0dHIoYnVmZmVyLCB2ZXJ0aWNlcywgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSkge1xuXHRmb3IgKGxldCBpPTA7IGk8bGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCB2ZXJ0ZXggPSB2ZXJ0aWNlc1tpXTtcblx0XHQvLyBnZXQgdGhlIGluZGV4IGluIHRoZSBidWZmZXIgdG8gdGhlIHBhcnRpY3VsYXIgdmVydGV4XG5cdFx0Y29uc3QgaiA9IG9mZnNldCArIChzdHJpZGUgKiBpKTtcblx0XHRidWZmZXJbal0gPSAodmVydGV4LnggIT09IHVuZGVmaW5lZCkgPyB2ZXJ0ZXgueCA6IHZlcnRleFswXTtcblx0XHRidWZmZXJbaisxXSA9ICh2ZXJ0ZXgueSAhPT0gdW5kZWZpbmVkKSA/IHZlcnRleC55IDogdmVydGV4WzFdO1xuXHRcdGJ1ZmZlcltqKzJdID0gKHZlcnRleC56ICE9PSB1bmRlZmluZWQpID8gdmVydGV4LnogOiB2ZXJ0ZXhbMl07XG5cdH1cbn1cblxuLyoqXG4gKiBGaWxsIHRoZSBhcnJheWJ1ZmZlciB3aXRoIGEgcXVhZHJ1cGxlIGNvbXBvbmVudCBhdHRyaWJ1dGUuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gYnVmZmVyIC0gVGhlIGFycmF5YnVmZmVyIHRvIGZpbGwuXG4gKiBAcGFyYW0ge0FycmF5fSB2ZXJ0aWNlcyAtIFRoZSB2ZXJ0ZXggYXR0cmlidXRlIGFycmF5IHRvIGNvcHkgZnJvbS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBidWZmZXIgdG8gY29weSBmcm9tLlxuICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldCAtIFRoZSBvZmZzZXQgdG8gdGhlIGF0dHJpYnV0ZSwgbm90IGluIGJ5dGVzLlxuICogQHBhcmFtIHtudW1iZXJ9IHN0cmlkZSAtIFRoZSBzdHJpZGUgb2YgdGhlIGJ1ZmZlciwgbm90IGluIGJ5dGVzLlxuICovXG5mdW5jdGlvbiBzZXQ0Q29tcG9uZW50QXR0cihidWZmZXIsIHZlcnRpY2VzLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlKSB7XG5cdGZvciAobGV0IGk9MDsgaTxsZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IHZlcnRleCA9IHZlcnRpY2VzW2ldO1xuXHRcdC8vIGdldCB0aGUgaW5kZXggaW4gdGhlIGJ1ZmZlciB0byB0aGUgcGFydGljdWxhciB2ZXJ0ZXhcblx0XHRjb25zdCBqID0gb2Zmc2V0ICsgKHN0cmlkZSAqIGkpO1xuXHRcdGJ1ZmZlcltqXSA9ICh2ZXJ0ZXgueCAhPT0gdW5kZWZpbmVkKSA/IHZlcnRleC54IDogdmVydGV4WzBdO1xuXHRcdGJ1ZmZlcltqKzFdID0gKHZlcnRleC55ICE9PSB1bmRlZmluZWQpID8gdmVydGV4LnkgOiB2ZXJ0ZXhbMV07XG5cdFx0YnVmZmVyW2orMl0gPSAodmVydGV4LnogIT09IHVuZGVmaW5lZCkgPyB2ZXJ0ZXgueiA6IHZlcnRleFsyXTtcblx0XHRidWZmZXJbaiszXSA9ICh2ZXJ0ZXgudyAhPT0gdW5kZWZpbmVkKSA/IHZlcnRleC53IDogdmVydGV4WzNdO1xuXHR9XG59XG5cbi8qKlxuICogQSB2ZXJ0ZXggcGFja2FnZSB0byBhc3Npc3QgaW4gaW50ZXJsZWF2aW5nIHZlcnRleCBkYXRhIGFuZCBidWlsZGluZyB0aGVcbiAqIGFzc29jaWF0ZWQgdmVydGV4IGF0dHJpYnV0ZSBwb2ludGVycy5cbiAqL1xuY2xhc3MgVmVydGV4UGFja2FnZSB7XG5cblx0LyoqXG5cdCAqIEluc3RhbnRpYXRlcyBhIFZlcnRleFBhY2thZ2Ugb2JqZWN0LlxuXHQgICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgLSBUaGUgYXR0cmlidXRlcyB0byBpbnRlcmxlYXZlIGtleWVkIGJ5IGluZGV4LlxuXHQgKi9cblx0Y29uc3RydWN0b3IoYXR0cmlidXRlcykge1xuXHRcdHRoaXMuc3RyaWRlID0gMDtcblx0XHR0aGlzLmxlbmd0aCA9IDA7XG5cdFx0dGhpcy5idWZmZXIgPSBudWxsO1xuXHRcdHRoaXMucG9pbnRlcnMgPSB7fTtcblx0XHRpZiAoYXR0cmlidXRlcykge1xuXHRcdFx0dGhpcy5zZXQoYXR0cmlidXRlcyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgZGF0YSB0byBiZSBpbnRlcmxlYXZlZCBpbnNpZGUgdGhlIHBhY2thZ2UuIFRoaXMgY2xlYXJzIGFueVxuXHQgKiBwcmV2aW91c2x5IGV4aXN0aW5nIGRhdGEuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVzIC0gVGhlIGF0dHJpYnV0ZXMgdG8gaW50ZXJsZWF2ZWQsIGtleWVkIGJ5IGluZGV4LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7VmVydGV4UGFja2FnZX0gVGhlIHZlcnRleCBwYWNrYWdlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0c2V0KGF0dHJpYnV0ZXMpIHtcblx0XHQvLyByZW1vdmUgYmFkIGF0dHJpYnV0ZXNcblx0XHRhdHRyaWJ1dGVzID0gcGFyc2VBdHRyaWJ1dGVNYXAoYXR0cmlidXRlcyk7XG5cdFx0Ly8gc2V0IGF0dHJpYnV0ZSBwb2ludGVycyBhbmQgc3RyaWRlXG5cdFx0c2V0UG9pbnRlcnNBbmRTdHJpZGUodGhpcywgYXR0cmlidXRlcyk7XG5cdFx0Ly8gc2V0IHNpemUgb2YgZGF0YSB2ZWN0b3Jcblx0XHRjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblx0XHRjb25zdCBzdHJpZGUgPSB0aGlzLnN0cmlkZTsgLy8gbm90IGluIGJ5dGVzXG5cdFx0Y29uc3QgcG9pbnRlcnMgPSB0aGlzLnBvaW50ZXJzO1xuXHRcdGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShsZW5ndGggKiBzdHJpZGUpO1xuXHRcdC8vIGZvciBlYWNoIHZlcnRleCBhdHRyaWJ1dGUgYXJyYXlcblx0XHRhdHRyaWJ1dGVzLmZvckVhY2godmVydGljZXMgPT4ge1xuXHRcdFx0Ly8gZ2V0IHRoZSBwb2ludGVyXG5cdFx0XHRjb25zdCBwb2ludGVyID0gcG9pbnRlcnNbdmVydGljZXMuaW5kZXhdO1xuXHRcdFx0Ly8gZ2V0IHRoZSBwb2ludGVycyBvZmZzZXRcblx0XHRcdGNvbnN0IG9mZnNldCA9IHBvaW50ZXIuYnl0ZU9mZnNldCAvIEJZVEVTX1BFUl9DT01QT05FTlQ7XG5cdFx0XHQvLyBjb3B5IHZlcnRleCBkYXRhIGludG8gYXJyYXlidWZmZXJcblx0XHRcdHN3aXRjaCAocG9pbnRlci5zaXplKSB7XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRzZXQyQ29tcG9uZW50QXR0cihidWZmZXIsIHZlcnRpY2VzLmRhdGEsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0c2V0M0NvbXBvbmVudEF0dHIoYnVmZmVyLCB2ZXJ0aWNlcy5kYXRhLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdHNldDRDb21wb25lbnRBdHRyKGJ1ZmZlciwgdmVydGljZXMuZGF0YSwgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0c2V0MUNvbXBvbmVudEF0dHIoYnVmZmVyLCB2ZXJ0aWNlcy5kYXRhLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZlcnRleFBhY2thZ2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0Jyk7XG5cbi8qKlxuICogQmluZCB0aGUgdmlld3BvcnQgdG8gdGhlIHJlbmRlcmluZyBjb250ZXh0LlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtWaWV3cG9ydH0gdmlld3BvcnQgLSBUaGUgdmlld3BvcnQgb2JqZWN0LlxuICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgaG9yaXpvbnRhbCBvZmZzZXQgb3ZlcnJpZGUuXG4gKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSB2ZXJ0aWNhbCBvZmZzZXQgb3ZlcnJpZGUuXG4gKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSBUaGUgd2lkdGggb3ZlcnJpZGUuXG4gKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0gVGhlIGhlaWdodCBvdmVycmlkZS5cbiAqL1xuZnVuY3Rpb24gc2V0KHZpZXdwb3J0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG5cdGNvbnN0IGdsID0gdmlld3BvcnQuZ2w7XG5cdHggPSAoeCAhPT0gdW5kZWZpbmVkKSA/IHggOiB2aWV3cG9ydC54O1xuXHR5ID0gKHkgIT09IHVuZGVmaW5lZCkgPyB5IDogdmlld3BvcnQueTtcblx0d2lkdGggPSAod2lkdGggIT09IHVuZGVmaW5lZCkgPyB3aWR0aCA6IHZpZXdwb3J0LndpZHRoO1xuXHRoZWlnaHQgPSAoaGVpZ2h0ICE9PSB1bmRlZmluZWQpID8gaGVpZ2h0IDogdmlld3BvcnQuaGVpZ2h0O1xuXHRnbC52aWV3cG9ydCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbn1cblxuLyoqXG4gKiBBIHZpZXdwb3J0IGNsYXNzIGZvciBtYW5hZ2luZyBXZWJHTCB2aWV3cG9ydHMuXG4gKi9cbmNsYXNzIFZpZXdwb3J0IHtcblxuXHQvKipcblx0ICogSW5zdGFudGlhdGVzIGEgVmlld3BvcnQgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSB2aWV3cG9ydCBzcGVjaWZpY2F0aW9uIG9iamVjdC5cblx0ICogQHBhcmFtIHtudW1iZXJ9IHNwZWMud2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIHZpZXdwb3J0LlxuXHQgKiBAcGFyYW0ge251bWJlcn0gc3BlYy5oZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB2aWV3cG9ydC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHNwZWMgPSB7fSkge1xuXHRcdHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XG5cdFx0dGhpcy5zdGFjayA9IFtdO1xuXHRcdC8vIHNldCBzaXplXG5cdFx0dGhpcy5yZXNpemUoXG5cdFx0XHRzcGVjLndpZHRoIHx8IHRoaXMuZ2wuY2FudmFzLndpZHRoLFxuXHRcdFx0c3BlYy5oZWlnaHQgfHwgdGhpcy5nbC5jYW52YXMuaGVpZ2h0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSB2aWV3cG9ydHMgd2lkdGggYW5kIGhlaWdodC4gVGhpcyByZXNpemVzIHRoZSB1bmRlcmx5aW5nIGNhbnZhcyBlbGVtZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIHZpZXdwb3J0LlxuXHQgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgdmlld3BvcnQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtWaWV3cG9ydH0gVGhlIHZpZXdwb3J0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0cmVzaXplKHdpZHRoID0gMCwgaGVpZ2h0ID0gMCkge1xuXHRcdGlmICh0eXBlb2Ygd2lkdGggIT09ICdudW1iZXInIHx8IHdpZHRoIDw9IDApIHtcblx0XHRcdHRocm93IGBQcm92aWRlZCBcXGB3aWR0aFxcYCBvZiBcXGAke3dpZHRofVxcYCBpcyBpbnZhbGlkYDtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBoZWlnaHQgIT09ICdudW1iZXInIHx8IGhlaWdodCA8PSAwKSB7XG5cdFx0XHR0aHJvdyBgUHJvdmlkZWQgXFxgaGVpZ2h0XFxgIG9mIFxcYCR7aGVpZ2h0fVxcYCBpcyBpbnZhbGlkYDtcblx0XHR9XG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdHRoaXMuZ2wuY2FudmFzLndpZHRoID0gd2lkdGg7XG5cdFx0dGhpcy5nbC5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIHZpZXdwb3J0IGRpbWVuc2lvbnMgYW5kIHBvc2l0aW9uLiBUaGUgdW5kZXJseWluZyBjYW52YXMgZWxlbWVudFxuXHQgKiBpcyBub3QgYWZmZWN0ZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIGhvcml6b250YWwgb2Zmc2V0IG92ZXJyaWRlLlxuXHQgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSB2ZXJ0aWNhbCBvZmZzZXQgb3ZlcnJpZGUuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvdmVycmlkZS5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIFRoZSBoZWlnaHQgb3ZlcnJpZGUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtWaWV3cG9ydH0gLSBUaGUgdmlld3BvcnQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRwdXNoKHggPSAwLCB5ID0gMCwgd2lkdGggPSB0aGlzLndpZHRoLCBoZWlnaHQgPSB0aGlzLmhlaWdodCkge1xuXHRcdGlmICh0eXBlb2YgeCAhPT0gJ251bWJlcicpIHtcblx0XHRcdHRocm93IGBQcm92aWRlZCBcXGB4XFxgIG9mIFxcYCR7eH1cXGAgaXMgaW52YWxpZGA7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgeSAhPT0gJ251bWJlcicpIHtcblx0XHRcdHRocm93IGBQcm92aWRlZCBcXGB5XFxgIG9mIFxcYCR7eX1cXGAgaXMgaW52YWxpZGA7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2Ygd2lkdGggIT09ICdudW1iZXInIHx8IHdpZHRoIDw9IDApIHtcblx0XHRcdHRocm93IGBQcm92aWRlZCBcXGB3aWR0aFxcYCBvZiBcXGAke3dpZHRofVxcYCBpcyBpbnZhbGlkYDtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBoZWlnaHQgIT09ICdudW1iZXInIHx8IGhlaWdodCA8PSAwKSB7XG5cdFx0XHR0aHJvdyBgUHJvdmlkZWQgXFxgaGVpZ2h0XFxgIG9mIFxcYCR7aGVpZ2h0fVxcYCBpcyBpbnZhbGlkYDtcblx0XHR9XG5cdFx0Ly8gcHVzaCBvbnRvIHN0YWNrXG5cdFx0dGhpcy5zdGFjay5wdXNoKHtcblx0XHRcdHg6IHgsXG5cdFx0XHR5OiB5LFxuXHRcdFx0d2lkdGg6IHdpZHRoLFxuXHRcdFx0aGVpZ2h0OiBoZWlnaHRcblx0XHR9KTtcblx0XHQvLyBzZXQgdmlld3BvcnRcblx0XHRzZXQodGhpcywgeCwgeSwgd2lkdGgsIGhlaWdodCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogUG9wcyBjdXJyZW50IHRoZSB2aWV3cG9ydCBvYmplY3QgYW5kIHNldHMgdGhlIHZpZXdwb3J0IGJlbmVhdGggaXQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtWaWV3cG9ydH0gVGhlIHZpZXdwb3J0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0cG9wKCkge1xuXHRcdGlmICh0aGlzLnN0YWNrLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0dGhyb3cgJ1ZpZXdwb3J0IHN0YWNrIGlzIGVtcHR5Jztcblx0XHR9XG5cdFx0dGhpcy5zdGFjay5wb3AoKTtcblx0XHRpZiAodGhpcy5zdGFjay5sZW5ndGggPiAwKSB7XG5cdFx0XHRjb25zdCB0b3AgPSB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV07XG5cdFx0XHRzZXQodGhpcywgdG9wLngsIHRvcC55LCB0b3Aud2lkdGgsIHRvcC5oZWlnaHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzZXQodGhpcyk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVmlld3BvcnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IEVYVEVOU0lPTlMgPSBbXG5cdC8vIHJhdGlmaWVkXG5cdCdPRVNfdGV4dHVyZV9mbG9hdCcsXG5cdCdPRVNfdGV4dHVyZV9oYWxmX2Zsb2F0Jyxcblx0J1dFQkdMX2xvc2VfY29udGV4dCcsXG5cdCdPRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnLFxuXHQnT0VTX3ZlcnRleF9hcnJheV9vYmplY3QnLFxuXHQnV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbycsXG5cdCdXRUJHTF9kZWJ1Z19zaGFkZXJzJyxcblx0J1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9zM3RjJyxcblx0J1dFQkdMX2RlcHRoX3RleHR1cmUnLFxuXHQnT0VTX2VsZW1lbnRfaW5kZXhfdWludCcsXG5cdCdFWFRfdGV4dHVyZV9maWx0ZXJfYW5pc290cm9waWMnLFxuXHQnRVhUX2ZyYWdfZGVwdGgnLFxuXHQnV0VCR0xfZHJhd19idWZmZXJzJyxcblx0J0FOR0xFX2luc3RhbmNlZF9hcnJheXMnLFxuXHQnT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyJyxcblx0J09FU190ZXh0dXJlX2hhbGZfZmxvYXRfbGluZWFyJyxcblx0J0VYVF9ibGVuZF9taW5tYXgnLFxuXHQnRVhUX3NoYWRlcl90ZXh0dXJlX2xvZCcsXG5cdC8vIGNvbW11bml0eVxuXHQnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2F0YycsXG5cdCdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfcHZydGMnLFxuXHQnRVhUX2NvbG9yX2J1ZmZlcl9oYWxmX2Zsb2F0Jyxcblx0J1dFQkdMX2NvbG9yX2J1ZmZlcl9mbG9hdCcsXG5cdCdFWFRfc1JHQicsXG5cdCdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjMScsXG5cdCdFWFRfZGlzam9pbnRfdGltZXJfcXVlcnknLFxuXHQnRVhUX2NvbG9yX2J1ZmZlcl9mbG9hdCdcbl07XG5cbi8qKlxuICogQWxsIGNvbnRleHQgd3JhcHBlcnMuXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBfY29udGV4dHMgPSBuZXcgTWFwKCk7XG5cbi8qKlxuICogVGhlIGN1cnJlbnRseSBib3VuZCBjb250ZXh0LlxuICogQHByaXZhdGVcbiAqL1xubGV0IF9ib3VuZENvbnRleHQgPSBudWxsO1xuXG4vKipcbiAqIFJldHVybnMgYW4gcmZjNDEyMiB2ZXJzaW9uIDQgY29tcGxpYW50IFVVSUQuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSAtIFRoZSBVVUlEIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gZ2V0VVVJRCgpIHtcblx0Y29uc3QgcmVwbGFjZSA9IGZ1bmN0aW9uKGMpIHtcblx0XHRjb25zdCByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMDtcblx0XHRjb25zdCB2ID0gKGMgPT09ICd4JykgPyByIDogKHIgJiAweDMgfCAweDgpO1xuXHRcdHJldHVybiB2LnRvU3RyaW5nKDE2KTtcblx0fTtcblx0cmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgcmVwbGFjZSk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgaWQgb2YgdGhlIEhUTUxDYW52YXNFbGVtZW50IGVsZW1lbnQuIElmIHRoZXJlIGlzIG5vIGlkLCBpdFxuICogZ2VuZXJhdGVzIG9uZSBhbmQgYXBwZW5kcyBpdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IGNhbnZhcyAtIFRoZSBDYW52YXMgb2JqZWN0LlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBDYW52YXMgaWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBnZXRJZChjYW52YXMpIHtcblx0aWYgKCFjYW52YXMuaWQpIHtcblx0XHRjYW52YXMuaWQgPSBnZXRVVUlEKCk7XG5cdH1cblx0cmV0dXJuIGNhbnZhcy5pZDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgQ2FudmFzIGVsZW1lbnQgb2JqZWN0IGZyb20gZWl0aGVyIGFuIGV4aXN0aW5nIG9iamVjdCwgb3JcbiAqIGlkZW50aWZpY2F0aW9uIHN0cmluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWQgb3Igc2VsZWN0b3Igc3RyaW5nLlxuICpcbiAqIEByZXR1cm5zIHtIVE1MQ2FudmFzRWxlbWVudH0gVGhlIENhbnZhcyBlbGVtZW50IG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gZ2V0Q2FudmFzKGFyZykge1xuXHRpZiAoYXJnIGluc3RhbmNlb2YgSFRNTENhbnZhc0VsZW1lbnQpIHtcblx0XHRyZXR1cm4gYXJnO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGFyZykgfHxcblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYXJnKTtcblx0fVxuXHRyZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgd3JhcHBlZCBXZWJHTFJlbmRlcmluZ0NvbnRleHQgZnJvbSB0aGUgY29udGV4dCBpdHNlbGYuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge1dlYkdMUmVuZGVyaW5nQ29udGV4dH0gY29udGV4dCAtIFRoZSBXZWJHTFJlbmRlcmluZ0NvbnRleHQuXG4gKlxuICogQHJldHVybnMge09iamVjdH0gVGhlIGNvbnRleHQgd3JhcHBlci5cbiAqL1xuZnVuY3Rpb24gZ2V0V3JhcHBlckZyb21Db250ZXh0KGNvbnRleHQpIHtcblx0bGV0IGZvdW5kID0gbnVsbDtcblx0X2NvbnRleHRzLmZvckVhY2god3JhcHBlciA9PiB7XG5cdFx0aWYgKGNvbnRleHQgPT09IHdyYXBwZXIuZ2wpIHtcblx0XHRcdGZvdW5kID0gd3JhcHBlcjtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gZm91bmQ7XG59XG5cbi8qKlxuICogQXR0ZW1wdHMgdG8gcmV0cmlldmUgYSB3cmFwcGVkIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5cbiAqXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IGFyZyAtIFRoZSBDYW52YXMgZWxlbWVudCBvYmplY3QgdG8gY3JlYXRlIHRoZSBjb250ZXh0IHVuZGVyLlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBjb250ZXh0IHdyYXBwZXIuXG4gKi9cbmZ1bmN0aW9uIGdldENvbnRleHRXcmFwcGVyKGFyZykge1xuXHRpZiAoYXJnID09PSB1bmRlZmluZWQpIHtcblx0XHRpZiAoX2JvdW5kQ29udGV4dCkge1xuXHRcdFx0Ly8gcmV0dXJuIGxhc3QgYm91bmQgY29udGV4dFxuXHRcdFx0cmV0dXJuIF9ib3VuZENvbnRleHQ7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIFdlYkdMUmVuZGVyaW5nQ29udGV4dCkge1xuXHRcdHJldHVybiBnZXRXcmFwcGVyRnJvbUNvbnRleHQoYXJnKTtcblx0fSBlbHNlIHtcblx0XHRjb25zdCBjYW52YXMgPSBnZXRDYW52YXMoYXJnKTtcblx0XHRpZiAoY2FudmFzKSB7XG5cdFx0XHRyZXR1cm4gX2NvbnRleHRzLmdldChnZXRJZChjYW52YXMpKTtcblx0XHR9XG5cdH1cblx0Ly8gbm8gYm91bmQgY29udGV4dCBvciBhcmd1bWVudFxuXHRyZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBBdHRlbXB0cyB0byBsb2FkIGFsbCBrbm93biBleHRlbnNpb25zIGZvciBhIHByb3ZpZGVkIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5cbiAqIFN0b3JlcyB0aGUgcmVzdWx0cyBpbiB0aGUgY29udGV4dCB3cmFwcGVyIGZvciBsYXRlciBxdWVyaWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHRXcmFwcGVyIC0gVGhlIGNvbnRleHQgd3JhcHBlci5cbiAqL1xuZnVuY3Rpb24gbG9hZEV4dGVuc2lvbnMoY29udGV4dFdyYXBwZXIpIHtcblx0Y29uc3QgZ2wgPSBjb250ZXh0V3JhcHBlci5nbDtcblx0RVhURU5TSU9OUy5mb3JFYWNoKGlkID0+IHtcblx0XHRjb250ZXh0V3JhcHBlci5leHRlbnNpb25zLnNldChpZCwgZ2wuZ2V0RXh0ZW5zaW9uKGlkKSk7XG5cdH0pO1xufVxuXG4vKipcbiAqIEF0dGVtcHRzIHRvIGNyZWF0ZSBhIFdlYkdMUmVuZGVyaW5nQ29udGV4dCBhbmQgbG9hZCBhbGwgZXh0ZW5zaW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IGNhbnZhcyAtIFRoZSBDYW52YXMgZWxlbWVudCBvYmplY3QgdG8gY3JlYXRlIHRoZSBjb250ZXh0IHVuZGVyLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBQYXJhbWV0ZXJzIHRvIHRoZSB3ZWJnbCBjb250ZXh0LCBvbmx5IHVzZWQgZHVyaW5nIGluc3RhbnRpYXRpb24uIE9wdGlvbmFsLlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBjb250ZXh0IHdyYXBwZXIuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRleHRXcmFwcGVyKGNhbnZhcywgb3B0aW9ucykge1xuXHRjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIG9wdGlvbnMpIHx8IGNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnLCBvcHRpb25zKTtcblx0aWYgKCFnbCkge1xuXHRcdHRocm93ICdVbmFibGUgdG8gY3JlYXRlIGEgV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBwbGVhc2UgZW5zdXJlIHlvdXIgYnJvd3NlciBzdXBwb3J0cyBXZWJHTCc7XG5cdH1cblx0Ly8gd3JhcCBjb250ZXh0XG5cdGNvbnN0IGNvbnRleHRXcmFwcGVyID0ge1xuXHRcdGlkOiBnZXRJZChjYW52YXMpLFxuXHRcdGdsOiBnbCxcblx0XHRleHRlbnNpb25zOiBuZXcgTWFwKClcblx0fTtcblx0Ly8gbG9hZCBXZWJHTCBleHRlbnNpb25zXG5cdGxvYWRFeHRlbnNpb25zKGNvbnRleHRXcmFwcGVyKTtcblx0Ly8gYWRkIGNvbnRleHQgd3JhcHBlciB0byBtYXBcblx0X2NvbnRleHRzLnNldChnZXRJZChjYW52YXMpLCBjb250ZXh0V3JhcHBlcik7XG5cdC8vIGJpbmQgdGhlIGNvbnRleHRcblx0X2JvdW5kQ29udGV4dCA9IGNvbnRleHRXcmFwcGVyO1xuXHRyZXR1cm4gY29udGV4dFdyYXBwZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgYW4gZXhpc3RpbmcgV2ViR0wgY29udGV4dCBhc3NvY2lhdGVkIHdpdGggdGhlIHByb3ZpZGVkIGFyZ3VtZW50XG5cdCAqIGFuZCBiaW5kcyBpdC4gV2hpbGUgYm91bmQsIHRoZSBhY3RpdmUgY29udGV4dCB3aWxsIGJlIHVzZWQgaW1wbGljaXRseSBieVxuXHQgKiBhbnkgaW5zdGFudGlhdGVkIGBlc3BlcmAgY29uc3RydWN0cy5cblx0ICpcblx0ICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtXZWJHTENvbnRleHR9IFRoZSBuYW1lc3BhY2UsIHVzZWQgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0YmluZDogZnVuY3Rpb24oYXJnKSB7XG5cdFx0Y29uc3Qgd3JhcHBlciA9IGdldENvbnRleHRXcmFwcGVyKGFyZyk7XG5cdFx0aWYgKHdyYXBwZXIpIHtcblx0XHRcdF9ib3VuZENvbnRleHQgPSB3cmFwcGVyO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHRcdHRocm93IGBObyBjb250ZXh0IGV4aXN0cyBmb3IgcHJvdmlkZWQgYXJndW1lbnQgJyR7YXJnfSdgO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgYW4gZXhpc3RpbmcgV2ViR0wgY29udGV4dCBhc3NvY2lhdGVkIHdpdGggdGhlIHByb3ZpZGVkXG5cdCAqIGFyZ3VtZW50LiBJZiBubyBjb250ZXh0IGV4aXN0cywgb25lIGlzIGNyZWF0ZWQuIER1cmluZyBjcmVhdGlvbiBhdHRlbXB0c1xuXHQgKiB0byBsb2FkIGFsbCBleHRlbnNpb25zIGZvdW5kIGF0OlxuXHQgKiAgICAgaHR0cHM6Ly93d3cua2hyb25vcy5vcmcvcmVnaXN0cnkvd2ViZ2wvZXh0ZW5zaW9ucy8uXG5cdCAqXG5cdCAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLiBPcHRpb25hbC5cblx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBQYXJhbWV0ZXJzIHRvIHRoZSB3ZWJnbCBjb250ZXh0LCBvbmx5IHVzZWQgZHVyaW5nIGluc3RhbnRpYXRpb24uIE9wdGlvbmFsLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7V2ViR0xSZW5kZXJpbmdDb250ZXh0fSBUaGUgV2ViR0xSZW5kZXJpbmdDb250ZXh0IG9iamVjdC5cblx0ICovXG5cdGdldDogZnVuY3Rpb24oYXJnLCBvcHRpb25zKSB7XG5cdFx0Y29uc3Qgd3JhcHBlciA9IGdldENvbnRleHRXcmFwcGVyKGFyZyk7XG5cdFx0aWYgKHdyYXBwZXIpIHtcblx0XHRcdC8vIHJldHVybiB0aGUgbmF0aXZlIFdlYkdMUmVuZGVyaW5nQ29udGV4dFxuXHRcdFx0cmV0dXJuIHdyYXBwZXIuZ2w7XG5cdFx0fVxuXHRcdC8vIGdldCBjYW52YXMgZWxlbWVudFxuXHRcdGNvbnN0IGNhbnZhcyA9IGdldENhbnZhcyhhcmcpO1xuXHRcdC8vIHRyeSB0byBmaW5kIG9yIGNyZWF0ZSBjb250ZXh0XG5cdFx0aWYgKCFjYW52YXMpIHtcblx0XHRcdHRocm93IGBObyBjb250ZXh0IGlzIGN1cnJlbnRseSBib3VuZCBvciBjb3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggcHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSAke3R5cGVvZiBhcmd9YDtcblx0XHR9XG5cdFx0Ly8gY3JlYXRlIGNvbnRleHRcblx0XHRyZXR1cm4gY3JlYXRlQ29udGV4dFdyYXBwZXIoY2FudmFzLCBvcHRpb25zKS5nbDtcblx0fSxcblxuXHQvKipcblx0ICogUmVtb3ZlcyBhbiBleGlzdGluZyBXZWJHTCBjb250ZXh0IG9iamVjdCBmb3IgdGhlIHByb3ZpZGVkIG9yIGN1cnJlbnRseVxuXHQgKiBib3VuZCBjb250ZXh0IG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR8SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLiBPcHRpb25hbC5cblx0ICpcblx0ICogQHJldHVybnMge1dlYkdMUmVuZGVyaW5nQ29udGV4dH0gVGhlIFdlYkdMUmVuZGVyaW5nQ29udGV4dCBvYmplY3QuXG5cdCAqL1xuXHRyZW1vdmU6IGZ1bmN0aW9uKGFyZykge1xuXHRcdGNvbnN0IHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlcihhcmcpO1xuXHRcdGlmICh3cmFwcGVyKSB7XG5cdFx0XHQvLyBkZWxldGUgdGhlIGNvbnRleHRcblx0XHRcdF9jb250ZXh0cy5kZWxldGUod3JhcHBlci5pZCk7XG5cdFx0XHQvLyByZW1vdmUgaWYgY3VycmVudGx5IGJvdW5kXG5cdFx0XHRpZiAod3JhcHBlciA9PT0gX2JvdW5kQ29udGV4dCkge1xuXHRcdFx0XHRfYm91bmRDb250ZXh0ID0gbnVsbDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgYE5vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIGNvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aCBwcm92aWRlZCBhcmd1bWVudCBvZiB0eXBlICR7dHlwZW9mIGFyZ31gO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgc3VwcG9ydGVkIGV4dGVuc2lvbnMgZm9yIHRoZSBwcm92aWRlZCBvclxuXHQgKiBjdXJyZW50bHkgYm91bmQgY29udGV4dCBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7V2ViR0xSZW5kZXJpbmdDb250ZXh0fEhUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gQWxsIHN1cHBvcnRlZCBleHRlbnNpb25zLlxuXHQgKi9cblx0c3VwcG9ydGVkRXh0ZW5zaW9uczogZnVuY3Rpb24oYXJnKSB7XG5cdFx0Y29uc3Qgd3JhcHBlciA9IGdldENvbnRleHRXcmFwcGVyKGFyZyk7XG5cdFx0aWYgKHdyYXBwZXIpIHtcblx0XHRcdGNvbnN0IGV4dGVuc2lvbnMgPSB3cmFwcGVyLmV4dGVuc2lvbnM7XG5cdFx0XHRjb25zdCBzdXBwb3J0ZWQgPSBbXTtcblx0XHRcdGV4dGVuc2lvbnMuZm9yRWFjaCgoZXh0ZW5zaW9uLCBrZXkpID0+IHtcblx0XHRcdFx0aWYgKGV4dGVuc2lvbikge1xuXHRcdFx0XHRcdHN1cHBvcnRlZC5wdXNoKGtleSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHN1cHBvcnRlZDtcblx0XHR9XG5cdFx0dGhyb3cgYE5vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIGNvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aCBwcm92aWRlZCBhcmd1bWVudCBvZiB0eXBlICR7dHlwZW9mIGFyZ31gO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCB1bnN1cHBvcnRlZCBleHRlbnNpb25zIGZvciB0aGUgcHJvdmlkZWQgb3Jcblx0ICogY3VycmVudGx5IGJvdW5kIGNvbnRleHQgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge1dlYkdMUmVuZGVyaW5nQ29udGV4dHxIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuIE9wdGlvbmFsLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IEFsbCB1bnN1cHBvcnRlZCBleHRlbnNpb25zLlxuXHQgKi9cblx0dW5zdXBwb3J0ZWRFeHRlbnNpb25zOiBmdW5jdGlvbihhcmcpIHtcblx0XHRjb25zdCB3cmFwcGVyID0gZ2V0Q29udGV4dFdyYXBwZXIoYXJnKTtcblx0XHRpZiAod3JhcHBlcikge1xuXHRcdFx0Y29uc3QgZXh0ZW5zaW9ucyA9IHdyYXBwZXIuZXh0ZW5zaW9ucztcblx0XHRcdGNvbnN0IHVuc3VwcG9ydGVkID0gW107XG5cdFx0XHRleHRlbnNpb25zLmZvckVhY2goKGV4dGVuc2lvbiwga2V5KSA9PiB7XG5cdFx0XHRcdGlmICghZXh0ZW5zaW9uKSB7XG5cdFx0XHRcdFx0dW5zdXBwb3J0ZWQucHVzaChrZXkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB1bnN1cHBvcnRlZDtcblx0XHR9XG5cdFx0dGhyb3cgYE5vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIGNvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aCBwcm92aWRlZCBhcmd1bWVudCBvZiB0eXBlICR7dHlwZW9mIGFyZ31gO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgYW4gZXh0ZW5zaW9uIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBsb2FkZWQgZm9yIHRoZSBwcm92aWRlZCBvclxuXHQgKiBjdXJyZW50bHkgYm91bmQgY29udGV4dCBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7V2ViR0xSZW5kZXJpbmdDb250ZXh0fEhUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBleHRlbnNpb24gLSBUaGUgZXh0ZW5zaW9uIG5hbWUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvdmlkZWQgZXh0ZW5zaW9uIGhhcyBiZWVuIGxvYWRlZCBzdWNjZXNzZnVsbHkuXG5cdCAqL1xuXHRjaGVja0V4dGVuc2lvbjogZnVuY3Rpb24oYXJnLCBleHRlbnNpb24pIHtcblx0XHRpZiAoIWV4dGVuc2lvbikge1xuXHRcdFx0Ly8gc2hpZnQgcGFyYW1ldGVycyBpZiBubyBjYW52YXMgYXJnIGlzIHByb3ZpZGVkXG5cdFx0XHRleHRlbnNpb24gPSBhcmc7XG5cdFx0XHRhcmcgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdGNvbnN0IHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlcihhcmcpO1xuXHRcdGlmICh3cmFwcGVyKSB7XG5cdFx0XHRjb25zdCBleHRlbnNpb25zID0gd3JhcHBlci5leHRlbnNpb25zO1xuXHRcdFx0cmV0dXJuIGV4dGVuc2lvbnMuZ2V0KGV4dGVuc2lvbikgPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHRcdHRocm93IGBObyBjb250ZXh0IGlzIGN1cnJlbnRseSBib3VuZCBvciBjb3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggcHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSAke3R5cGVvZiBhcmd9YDtcblx0fSxcblxuXHQvKipcblx0ICogUmV0dXJucyBhbiBleHRlbnNpb24gaWYgaXQgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGxvYWRlZCBmb3IgdGhlIHByb3ZpZGVkXG5cdCAqIG9yIGN1cnJlbnRseSBib3VuZCBjb250ZXh0IG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR8SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLiBPcHRpb25hbC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGV4dGVuc2lvbiAtIFRoZSBleHRlbnNpb24gbmFtZS5cblx0ICpcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBwcm92aWRlZCBleHRlbnNpb24gaGFzIGJlZW4gbG9hZGVkIHN1Y2Nlc3NmdWxseS5cblx0ICovXG5cdGdldEV4dGVuc2lvbjogZnVuY3Rpb24oYXJnLCBleHRlbnNpb24pIHtcblx0XHRpZiAoIWV4dGVuc2lvbikge1xuXHRcdFx0Ly8gc2hpZnQgcGFyYW1ldGVycyBpZiBubyBjYW52YXMgYXJnIGlzIHByb3ZpZGVkXG5cdFx0XHRleHRlbnNpb24gPSBhcmc7XG5cdFx0XHRhcmcgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdGNvbnN0IHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlcihhcmcpO1xuXHRcdGlmICh3cmFwcGVyKSB7XG5cdFx0XHRjb25zdCBleHRlbnNpb25zID0gd3JhcHBlci5leHRlbnNpb25zO1xuXHRcdFx0cmV0dXJuIGV4dGVuc2lvbnMuZ2V0KGV4dGVuc2lvbikgfHwgbnVsbDtcblx0XHR9XG5cdFx0dGhyb3cgYE5vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIGNvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aCBwcm92aWRlZCBhcmd1bWVudCBvZiB0eXBlICR7dHlwZW9mIGFyZ31gO1xuXHR9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Q29sb3JUZXh0dXJlMkQ6IHJlcXVpcmUoJy4vY29yZS9Db2xvclRleHR1cmUyRCcpLFxuXHREZXB0aFRleHR1cmUyRDogcmVxdWlyZSgnLi9jb3JlL0RlcHRoVGV4dHVyZTJEJyksXG5cdEluZGV4QnVmZmVyOiByZXF1aXJlKCcuL2NvcmUvSW5kZXhCdWZmZXInKSxcblx0UmVuZGVyYWJsZTogcmVxdWlyZSgnLi9jb3JlL1JlbmRlcmFibGUnKSxcblx0UmVuZGVyVGFyZ2V0OiByZXF1aXJlKCcuL2NvcmUvUmVuZGVyVGFyZ2V0JyksXG5cdFNoYWRlcjogcmVxdWlyZSgnLi9jb3JlL1NoYWRlcicpLFxuXHRUZXh0dXJlMkQ6IHJlcXVpcmUoJy4vY29yZS9UZXh0dXJlMkQnKSxcblx0VGV4dHVyZUN1YmVNYXA6IHJlcXVpcmUoJy4vY29yZS9UZXh0dXJlQ3ViZU1hcCcpLFxuXHRWZXJ0ZXhCdWZmZXI6IHJlcXVpcmUoJy4vY29yZS9WZXJ0ZXhCdWZmZXInKSxcblx0VmVydGV4UGFja2FnZTogcmVxdWlyZSgnLi9jb3JlL1ZlcnRleFBhY2thZ2UnKSxcblx0Vmlld3BvcnQ6IHJlcXVpcmUoJy4vY29yZS9WaWV3cG9ydCcpLFxuXHRXZWJHTENvbnRleHQ6IHJlcXVpcmUoJy4vY29yZS9XZWJHTENvbnRleHQnKVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0LyoqXG5cdCAqIFNlbmRzIGFuIEdFVCByZXF1ZXN0IGNyZWF0ZSBhbiBJbWFnZSBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIFhIUiBvcHRpb25zLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy51cmwgLSBUaGUgVVJMIGZvciB0aGUgcmVzb3VyY2UuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gb3B0aW9ucy5jcm9zc09yaWdpbiAtIEVuYWJsZSBjcm9zcy1vcmlnaW4gcmVxdWVzdC5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5zdWNjZXNzIC0gVGhlIHN1Y2Nlc3MgY2FsbGJhY2sgZnVuY3Rpb24uXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMuZXJyb3IgLSBUaGUgZXJyb3IgY2FsbGJhY2sgZnVuY3Rpb24uXG5cdCAqL1xuXHRsb2FkOiBmdW5jdGlvbiAob3B0aW9ucyA9IHt9KSB7XG5cdFx0Y29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblx0XHRpbWFnZS5vbmxvYWQgPSAoKSA9PiB7XG5cdFx0XHRpZiAob3B0aW9ucy5zdWNjZXNzKSB7XG5cdFx0XHRcdG9wdGlvbnMuc3VjY2VzcyhpbWFnZSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRpbWFnZS5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG5cdFx0XHRpZiAob3B0aW9ucy5lcnJvcikge1xuXHRcdFx0XHRjb25zdCBlcnIgPSBgVW5hYmxlIHRvIGxvYWQgaW1hZ2UgZnJvbSBVUkw6IFxcYCR7ZXZlbnQucGF0aFswXS5jdXJyZW50U3JjIH1cXGBgO1xuXHRcdFx0XHRvcHRpb25zLmVycm9yKGVycik7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRpbWFnZS5jcm9zc09yaWdpbiA9IG9wdGlvbnMuY3Jvc3NPcmlnaW4gPyAnYW5vbnltb3VzJyA6IHVuZGVmaW5lZDtcblx0XHRpbWFnZS5zcmMgPSBvcHRpb25zLnVybDtcblx0fVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGFyZ3VtZW50IGlzIG9uZSBvZiB0aGUgV2ViR0wgYHRleEltYWdlMkRgIG92ZXJyaWRkZW5cbiAqIGNhbnZhcyB0eXBlcy5cbiAqXG4gKiBAcGFyYW0geyp9IGFyZyAtIFRoZSBhcmd1bWVudCB0byB0ZXN0LlxuICpcbiAqIEByZXR1cm5zIHtib29sfSAtIFdoZXRoZXIgb3Igbm90IGl0IGlzIGEgY2FudmFzIHR5cGUuXG4gKi9cbmZ1bmN0aW9uIGlzQ2FudmFzVHlwZShhcmcpIHtcblx0cmV0dXJuIGFyZyBpbnN0YW5jZW9mIEltYWdlRGF0YSB8fFxuXHRcdGFyZyBpbnN0YW5jZW9mIEhUTUxJbWFnZUVsZW1lbnQgfHxcblx0XHRhcmcgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCB8fFxuXHRcdGFyZyBpbnN0YW5jZW9mIEhUTUxWaWRlb0VsZW1lbnQ7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdGV4dHVyZSBNVVNUIGJlIGEgcG93ZXItb2YtdHdvLiBPdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHRleHR1cmUgc3BlY2lmaWNhdGlvbiBvYmplY3QuXG4gKlxuICogQHJldHVybnMge2Jvb2x9IC0gV2hldGhlciBvciBub3QgdGhlIHRleHR1cmUgbXVzdCBiZSBhIHBvd2VyIG9mIHR3by5cbiAqL1xuZnVuY3Rpb24gbXVzdEJlUG93ZXJPZlR3byhzcGVjKSB7XG5cdC8vIEFjY29yZGluZyB0bzpcblx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMX0FQSS9UdXRvcmlhbC9Vc2luZ190ZXh0dXJlc19pbl9XZWJHTCNOb25fcG93ZXItb2YtdHdvX3RleHR1cmVzXG5cdC8vIE4tUE9UIHRleHR1cmVzIGNhbm5vdCBiZSB1c2VkIHdpdGggbWlwbWFwcGluZyBhbmQgdGhleSBtdXN0IG5vdCBcIlJFUEVBVFwiXG5cdHJldHVybiBzcGVjLm1pcE1hcCB8fFxuXHRcdHNwZWMud3JhcFMgPT09ICdSRVBFQVQnIHx8XG5cdFx0c3BlYy53cmFwUyA9PT0gJ01JUlJPUkVEX1JFUEVBVCcgfHxcblx0XHRzcGVjLndyYXBUID09PSAnUkVQRUFUJyB8fFxuXHRcdHNwZWMud3JhcFQgPT09ICdNSVJST1JFRF9SRVBFQVQnO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHByb3ZpZGVkIGludGVnZXIgaXMgYSBwb3dlciBvZiB0d28uXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IG51bSAtIFRoZSBudW1iZXIgdG8gdGVzdC5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgbnVtYmVyIGlzIGEgcG93ZXIgb2YgdHdvLlxuICovXG5mdW5jdGlvbiBpc1Bvd2VyT2ZUd28obnVtKSB7XG5cdHJldHVybiAobnVtICE9PSAwKSA/IChudW0gJiAobnVtIC0gMSkpID09PSAwIDogZmFsc2U7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG5leHQgaGlnaGVzdCBwb3dlciBvZiB0d28gZm9yIGEgbnVtYmVyLlxuICpcbiAqIEV4LlxuICpcbiAqXHQgMjAwIC0+IDI1NlxuICpcdCAyNTYgLT4gMjU2XG4gKlx0IDI1NyAtPiA1MTJcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtIC0gVGhlIG51bWJlciB0byBtb2RpZnkuXG4gKlxuICogQHJldHVybnMge251bWJlcn0gLSBOZXh0IGhpZ2hlc3QgcG93ZXIgb2YgdHdvLlxuICovXG5mdW5jdGlvbiBuZXh0SGlnaGVzdFBvd2VyT2ZUd28obnVtKSB7XG5cdGlmIChudW0gIT09IDApIHtcblx0XHRudW0gPSBudW0tMTtcblx0fVxuXHRudW0gfD0gbnVtID4+IDE7XG5cdG51bSB8PSBudW0gPj4gMjtcblx0bnVtIHw9IG51bSA+PiA0O1xuXHRudW0gfD0gbnVtID4+IDg7XG5cdG51bSB8PSBudW0gPj4gMTY7XG5cdHJldHVybiBudW0gKyAxO1xufTtcblxuLyoqXG4gKiBJZiB0aGUgdGV4dHVyZSBtdXN0IGJlIGEgUE9ULCByZXNpemVzIGFuZCByZXR1cm5zIHRoZSBpbWFnZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHRleHR1cmUgc3BlY2lmaWNhdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnR9IGltZyAtIFRoZSBpbWFnZSBvYmplY3QuXG4gKlxuICogQHJldHVybnMge0hUTUxJbWFnZUVsZW1lbnR8SFRNTENhbnZhc0VsZW1lbnR9IC0gVGhlIG9yaWdpbmFsIGltYWdlLCBvciB0aGUgcmVzaXplZCBjYW52YXMgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gcmVzaXplQ2FudmFzKHNwZWMsIGltZykge1xuXHRpZiAoIW11c3RCZVBvd2VyT2ZUd28oc3BlYykgfHxcblx0XHQoaXNQb3dlck9mVHdvKGltZy53aWR0aCkgJiYgaXNQb3dlck9mVHdvKGltZy5oZWlnaHQpKSkge1xuXHRcdHJldHVybiBpbWc7XG5cdH1cblx0Ly8gY3JlYXRlIGFuIGVtcHR5IGNhbnZhcyBlbGVtZW50XG5cdGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRjYW52YXMud2lkdGggPSBuZXh0SGlnaGVzdFBvd2VyT2ZUd28oaW1nLndpZHRoKTtcblx0Y2FudmFzLmhlaWdodCA9IG5leHRIaWdoZXN0UG93ZXJPZlR3byhpbWcuaGVpZ2h0KTtcblx0Ly8gY29weSB0aGUgaW1hZ2UgY29udGVudHMgdG8gdGhlIGNhbnZhc1xuXHRjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0Y3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCwgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblx0cmV0dXJuIGNhbnZhcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpc0NhbnZhc1R5cGU6IGlzQ2FudmFzVHlwZSxcblx0bXVzdEJlUG93ZXJPZlR3bzogbXVzdEJlUG93ZXJPZlR3byxcblx0aXNQb3dlck9mVHdvOiBpc1Bvd2VyT2ZUd28sXG5cdG5leHRIaWdoZXN0UG93ZXJPZlR3bzogbmV4dEhpZ2hlc3RQb3dlck9mVHdvLFxuXHRyZXNpemVDYW52YXM6IHJlc2l6ZUNhbnZhc1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0LyoqXG5cdCAqIFNlbmRzIGFuIFhNTEh0dHBSZXF1ZXN0IEdFVCByZXF1ZXN0IHRvIHRoZSBzdXBwbGllZCB1cmwuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIFhIUiBvcHRpb25zLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy51cmwgLSBUaGUgVVJMIGZvciB0aGUgcmVzb3VyY2UuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gb3B0aW9ucy5jcm9zc09yaWdpbiAtIEVuYWJsZSBjcm9zcy1vcmlnaW4gcmVxdWVzdC5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5zdWNjZXNzIC0gVGhlIHN1Y2Nlc3MgY2FsbGJhY2sgZnVuY3Rpb24uXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMuZXJyb3IgLSBUaGUgZXJyb3IgY2FsbGJhY2sgZnVuY3Rpb24uXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMucmVzcG9uc2VUeXBlIC0gVGhlIHJlc3BvbnNlVHlwZSBvZiB0aGUgWEhSLlxuXHQgKi9cblx0bG9hZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0XHRjb25zdCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0cmVxdWVzdC5vcGVuKCdHRVQnLCBvcHRpb25zLnVybCwgdHJ1ZSk7XG5cdFx0cmVxdWVzdC5yZXNwb25zZVR5cGUgPSBvcHRpb25zLnJlc3BvbnNlVHlwZTtcblx0XHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcblx0XHRcdGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQpIHtcblx0XHRcdFx0aWYgKHJlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5zdWNjZXNzKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLnN1Y2Nlc3MocmVxdWVzdC5yZXNwb25zZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChvcHRpb25zLmVycm9yKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmVycm9yKGBHRVQgJHtyZXF1ZXN0LnJlc3BvbnNlVVJMfSAke3JlcXVlc3Quc3RhdHVzfSAoJHtyZXF1ZXN0LnN0YXR1c1RleHR9KWApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0cmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSBvcHRpb25zLmNyb3NzT3JpZ2luID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdHJlcXVlc3Quc2VuZCgpO1xuXHR9XG59O1xuIl19
