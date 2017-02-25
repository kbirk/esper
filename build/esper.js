(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.esper = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (coll, iteratee, callback) {
    var eachOfImplementation = (0, _isArrayLike2.default)(coll) ? eachOfArrayLike : eachOfGeneric;
    eachOfImplementation(coll, iteratee, callback);
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
 * @param {Function} iteratee - A function to apply to each
 * item in `coll`. The `key` is the item's key, or index in the case of an
 * array. The iteratee is passed a `callback(err)` which must be called once it
 * has completed. If no error has occurred, the callback should be run without
 * arguments or with an explicit `null` argument. Invoked with
 * (item, key, callback).
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
},{"./eachOfLimit":2,"./internal/breakLoop":3,"./internal/doLimit":4,"./internal/once":8,"./internal/onlyOnce":9,"lodash/isArrayLike":35,"lodash/noop":43}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = eachOfLimit;

var _eachOfLimit2 = require('./internal/eachOfLimit');

var _eachOfLimit3 = _interopRequireDefault(_eachOfLimit2);

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
 * @param {Function} iteratee - A function to apply to each
 * item in `coll`. The `key` is the item's key, or index in the case of an
 * array. The iteratee is passed a `callback(err)` which must be called once it
 * has completed. If no error has occurred, the callback should be run without
 * arguments or with an explicit `null` argument. Invoked with
 * (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */
function eachOfLimit(coll, limit, iteratee, callback) {
  (0, _eachOfLimit3.default)(limit)(coll, iteratee, callback);
}
module.exports = exports['default'];
},{"./internal/eachOfLimit":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// A temporary value used to identify if the loop should be broken.
// See #1064, #1293
exports.default = {};
module.exports = exports["default"];
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{"./breakLoop":3,"./iterator":7,"./once":8,"./onlyOnce":9,"lodash/noop":43}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (coll) {
    return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
};

var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;

module.exports = exports['default'];
},{}],7:[function(require,module,exports){
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
},{"./getIterator":6,"lodash/isArrayLike":35,"lodash/keys":42}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _parallel;

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _isArrayLike = require('lodash/isArrayLike');

var _isArrayLike2 = _interopRequireDefault(_isArrayLike);

var _rest = require('./rest');

var _rest2 = _interopRequireDefault(_rest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _parallel(eachfn, tasks, callback) {
    callback = callback || _noop2.default;
    var results = (0, _isArrayLike2.default)(tasks) ? [] : {};

    eachfn(tasks, function (task, key, callback) {
        task((0, _rest2.default)(function (err, args) {
            if (args.length <= 1) {
                args = args[0];
            }
            results[key] = args;
            callback(err);
        }));
    }, function (err) {
        callback(err, results);
    });
}
module.exports = exports['default'];
},{"./rest":11,"lodash/isArrayLike":35,"lodash/noop":43}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = rest;

var _overRest2 = require('lodash/_overRest');

var _overRest3 = _interopRequireDefault(_overRest2);

var _identity = require('lodash/identity');

var _identity2 = _interopRequireDefault(_identity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Lodash rest function without function.toString()
// remappings
function rest(func, start) {
    return (0, _overRest3.default)(func, start, _identity2.default);
}
module.exports = exports['default'];
},{"lodash/_overRest":30,"lodash/identity":32}],12:[function(require,module,exports){
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
 * @param {Array|Iterable|Object} tasks - A collection containing functions to run.
 * Each function is passed a `callback(err, result)` which it must call on
 * completion with an error `err` (which can be `null`) and an optional `result`
 * value.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed successfully. This function gets a results array
 * (or object) containing all the result arguments passed to the task callbacks.
 * Invoked with (err, results).
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
},{"./eachOf":1,"./internal/parallel":10}],13:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":31}],14:[function(require,module,exports){
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

},{}],15:[function(require,module,exports){
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

},{"./_baseTimes":20,"./_isIndex":24,"./isArguments":33,"./isArray":34,"./isBuffer":36,"./isTypedArray":41}],16:[function(require,module,exports){
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

},{"./_Symbol":13,"./_getRawTag":23,"./_objectToString":28}],17:[function(require,module,exports){
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

},{"./_baseGetTag":16,"./isObjectLike":40}],18:[function(require,module,exports){
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

},{"./_baseGetTag":16,"./isLength":38,"./isObjectLike":40}],19:[function(require,module,exports){
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

},{"./_isPrototype":25,"./_nativeKeys":26}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],23:[function(require,module,exports){
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

},{"./_Symbol":13}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":29}],27:[function(require,module,exports){
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

},{"./_freeGlobal":22}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
var apply = require('./_apply');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;

},{"./_apply":14}],31:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":22}],32:[function(require,module,exports){
/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],33:[function(require,module,exports){
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

},{"./_baseIsArguments":17,"./isObjectLike":40}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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

},{"./isFunction":37,"./isLength":38}],36:[function(require,module,exports){
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

},{"./_root":31,"./stubFalse":44}],37:[function(require,module,exports){
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

},{"./_baseGetTag":16,"./isObject":39}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{"./_baseIsTypedArray":18,"./_baseUnary":21,"./_nodeUtil":27}],42:[function(require,module,exports){
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

},{"./_arrayLikeKeys":15,"./_baseKeys":19,"./isArrayLike":35}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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

},{}],45:[function(require,module,exports){
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
 * @constant {String}
 */
var DEFAULT_TYPE = 'UNSIGNED_BYTE';

/**
 * The default format for color textures.
 * @private
 * @constant {String}
 */
var DEFAULT_FORMAT = 'RGBA';

/**
 * The default wrap mode for color textures.
 * @private
 * @constant {String}
 */
var DEFAULT_WRAP = 'REPEAT';

/**
 * The default min / mag filter for color textures.
 * @private
 * @constant {String}
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
 * @class ColorTexture2D
 * @classdesc A texture class to represent a 2D color texture.
 * @augments Texture2D
 */

var ColorTexture2D = function (_Texture2D) {
	_inherits(ColorTexture2D, _Texture2D);

	/**
  * Instantiates a ColorTexture2D object.
  *
  * @param {Object} spec - The specification arguments.
  * @param {ArrayBuffer|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} spec.image - The HTMLImageElement to buffer.
  * @param {String} spec.url - The HTMLImageElement URL to load and buffer.
  * @param {Uint8Array|Float32Array} spec.src - The data to buffer.
  * @param {Number} spec.width - The width of the texture.
  * @param {Number} spec.height - The height of the texture.
  * @param {String} spec.wrap - The wrapping type over both S and T dimension.
  * @param {String} spec.wrapS - The wrapping type over the S dimension.
  * @param {String} spec.wrapT - The wrapping type over the T dimension.
  * @param {String} spec.filter - The min / mag filter used during scaling.
  * @param {String} spec.minFilter - The minification filter used during scaling.
  * @param {String} spec.magFilter - The magnification filter used during scaling.
  * @param {bool} spec.mipMap - Whether or not mip-mapping is enabled.
  * @param {bool} spec.invertY - Whether or not invert-y is enabled.
  * @param {bool} spec.premultiplyAlpha - Whether or not alpha premultiplying is enabled.
  * @param {String} spec.format - The texture pixel format.
  * @param {String} spec.type - The texture pixel component type.
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

},{"../util/ImageLoader":60,"../util/Util":61,"./Texture2D":53}],46:[function(require,module,exports){
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
 * @constant {String}
 */
var DEFAULT_TYPE = 'UNSIGNED_INT';

/**
 * The default format for depth textures.
 * @private
 * @constant {String}
 */
var DEFAULT_FORMAT = 'DEPTH_COMPONENT';

/**
 * The default wrap mode for depth textures.
 * @private
 * @constant {String}
 */
var DEFAULT_WRAP = 'CLAMP_TO_EDGE';

/**
 * The default min / mag filter for depth textures.
 * @private
 * @constant {String}
 */
var DEFAULT_FILTER = 'LINEAR';

/**
 * @class DepthTexture2D
 * @classdesc A texture class to represent a 2D depth texture.
 * @augments Texture2D
 */

var DepthTexture2D = function (_Texture2D) {
	_inherits(DepthTexture2D, _Texture2D);

	/**
  * Instantiates a DepthTexture2D object.
  *
  * @param {Object} spec - The specification arguments.
  * @param {Uint8Array|Uint16Array|Uint32Array} spec.src - The data to buffer.
  * @param {Number} spec.width - The width of the texture.
  * @param {Number} spec.height - The height of the texture.
  * @param {String} spec.wrap - The wrapping type over both S and T dimension.
  * @param {String} spec.wrapS - The wrapping type over the S dimension.
  * @param {String} spec.wrapT - The wrapping type over the T dimension.
  * @param {String} spec.filter - The min / mag filter used during scaling.
  * @param {String} spec.minFilter - The minification filter used during scaling.
  * @param {String} spec.magFilter - The magnification filter used during scaling.
  * @param {String} spec.format - The texture pixel format.
  * @param {String} spec.type - The texture pixel component type.
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

},{"./Texture2D":53}],47:[function(require,module,exports){
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
 * @constant {String}
 */
var DEFAULT_TYPE = 'UNSIGNED_SHORT';

/**
 * The default render mode (primitive type).
 * @private
 * @constant {String}
 */
var DEFAULT_MODE = 'TRIANGLES';

/**
 * The default byte offset to render from.
 * @private
 * @constant {Number}
 */
var DEFAULT_BYTE_OFFSET = 0;

/**
 * The default count of indices to render.
 * @private
 * @constant {Number}
 */
var DEFAULT_COUNT = 0;

/**
 * @class IndexBuffer
 * @classdesc An index buffer class to hole indexing information.
 */

var IndexBuffer = function () {

	/**
  * Instantiates an IndexBuffer object.
  *
  * @param {WebGLBuffer|Uint8Array|Uint16Array|Uin32Array|Array|Number} arg - The index data to buffer.
  * @param {Object} options - The rendering options.
  * @param {String} options.mode - The draw mode / primitive type.
  * @param {String} options.byteOffset - The byte offset into the drawn buffer.
  * @param {String} options.count - The number of vertices to draw.
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
  * @return {IndexBuffer} The index buffer object, for chaining.
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
   * @param {Number} byteOffset - The byte offset at which to buffer.
   *
   * @return {IndexBuffer} The index buffer object, for chaining.
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
   * @param {String} options.mode - The draw mode / primitive type.
   * @param {String} options.byteOffset - The byteOffset into the drawn buffer.
   * @param {String} options.count - The number of vertices to draw.
   *
   * @return {IndexBuffer} The index buffer object, for chaining.
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

},{"./WebGLContext":58}],48:[function(require,module,exports){
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
 * @class RenderTarget
 * @classdesc A renderTarget class to allow rendering to textures.
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
  * @return {RenderTarget} The renderTarget object, for chaining.
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
   * @return {RenderTarget} The renderTarget object, for chaining.
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
   * @param {Number} index - The attachment index. (optional)
   * @param {String} target - The texture target type. (optional)
   *
   * @return {RenderTarget} The renderTarget object, for chaining.
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
   * @return {RenderTarget} The renderTarget object, for chaining.
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
   * @param {Number} width - The new width of the renderTarget.
   * @param {Number} height - The new height of the renderTarget.
   *
   * @return {RenderTarget} The renderTarget object, for chaining.
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

},{"./WebGLContext":58}],49:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VertexPackage = require('./VertexPackage');
var VertexBuffer = require('./VertexBuffer');
var IndexBuffer = require('./IndexBuffer');

/**
 * Iterates over all vertex buffers and throws an exception if the counts
 * are not equal.
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
 * @class Renderable
 * @classdesc A container for one or more VertexBuffers and an optional IndexBuffer.
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
  * @param {String} options.mode - The draw mode / primitive type.
  * @param {String} options.byteOffset - The byteOffset into the drawn buffer.
  * @param {String} options.indexOffset - The indexOffset into the drawn buffer.
  * @param {String} options.count - The number of vertices to draw.
  *
  * @return {Renderable} - The renderable object, for chaining.
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

},{"./IndexBuffer":47,"./VertexBuffer":55,"./VertexPackage":56}],50:[function(require,module,exports){
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
 * Given a map of existing attributes, find the lowest index that is not
 * already used. If the attribute ordering was already provided, use that
 * instead.
 * @private
 *
 * @param {Map} attributes - The existing attributes map.
 * @param {Object} declaration - The attribute declaration object.
 *
 * @return {Number} The attribute index.
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
 * Given vertex and fragment shader source, parses the declarations and appends information pertaining to the uniforms and attribtues declared.
 * @private
 *
 * @param {Shader} shader - The shader object.
 * @param {String} vertSource - The vertex shader source.
 * @param {String} fragSource - The fragment shader source.
 *
 * @return {Object} The attribute and uniform information.
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
 * Given a shader source string and shader type, compiles the shader and returns the resulting WebGLShader object.
 * @private
 *
 * @param {WebGLRenderingContext} gl - The webgl rendering context.
 * @param {String} shaderSource - The shader source.
 * @param {String} type - The shader type.
 *
 * @return {WebGLShader} The compiled shader object.
 */
function compileShader(gl, shaderSource, type) {
	var shader = gl.createShader(gl[type]);
	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw 'An error occurred compiling the shaders:\n' + gl.getShaderInfoLog(shader);
	}
	return shader;
}

/**
 * Binds the attribute locations for the Shader object.
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
		// check if null, parse may detect uniform that is compiled out
		// due to a preprocessor evaluation.
		// TODO: fix parser so that it evaluates these correctly.
		if (location === null) {
			uniforms.delete(name);
		} else {
			uniform.location = location;
		}
	});
}

/**
 * Returns a function to load shader source from a url.
 * @private
 *
 * @param {String} url - The url to load the resource from.
 *
 * @return {Function} The function to load the shader source.
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
 * @private
 *
 * @param {String} source - The source of the shader.
 *
 * @return {Function} The function to pass through the shader source.
 */
function passThroughSource(source) {
	return function (done) {
		done(null, source);
	};
}

/**
 * Returns a function that takes an array of GLSL source strings and URLs, and resolves them into and array of GLSL source.
 * @private
 *
 * @param {Array} sources - The shader sources.
 *
 * @return {Function} A function to resolve the shader sources.
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
 * @private
 *
 * @param {Array} sources - The shader sources.
 *
 * @return {Function} A function to resolve the shader sources.
 */
var createDefines = function createDefines(defines) {
	var res = [];
	for (var name in defines) {
		if (defines.hasOwnProperty(name)) {
			res.push('#define ' + name + ' ' + defines[name]);
		}
	}
	return res.join('\n');
};

/**
 * Creates the shader program object from source strings. This includes:
 *	1) Compiling and linking the shader program.
 *	2) Parsing shader source for attribute and uniform information.
 *	3) Binding attribute locations, by order of delcaration.
 *	4) Querying and storing uniform location.
 * @private
 *
 * @param {Shader} shader - The Shader object.
 * @param {Object} sources - A map containing sources under 'vert' and 'frag' attributes.
 *
 * @return {Shader} The shader object, for chaining.
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
 * @class Shader
 * @classdesc A shader class to assist in compiling and linking webgl shaders, storing attribute and uniform locations, and buffering uniforms.
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
  * @return {Shader} The shader object, for chaining.
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
   * @param {String} name - The uniform name in the shader source.
   * @param {*} value - The uniform value to buffer.
   *
   * @return {Shader} - The shader object, for chaining.
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
   * @return {Shader} The shader object, for chaining.
   */

	}, {
		key: 'setUniforms',
		value: function setUniforms(args) {
			var _this2 = this;

			Object.keys(args).forEach(function (name) {
				_this2.setUniform(name, args[name]);
			});
			return this;
		}
	}]);

	return Shader;
}();

module.exports = Shader;

},{"../util/XHRLoader":62,"./ShaderParser":51,"./WebGLContext":58,"async/parallel":12}],51:[function(require,module,exports){
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
 * @private
 *
 * @param {String} str - The string to strip comments from.
 *
 * @return {String} The commentless string.
 */
function stripComments(str) {
	// regex source: https://github.com/moagrius/stripcomments
	return str.replace(COMMENTS_REGEXP, '');
}

/**
 * Removes an precision statements.
 * @private
 *
 * @param {String} str - The unprocessed source code.
 *
 * @return {String} The processed source code.
 */
function stripPrecision(str) {
	return str.replace(PRECISION_REGEX, '') // remove global precision declarations
	.replace(INLINE_PRECISION_REGEX, ''); // remove inline precision declarations
}

/**
 * Converts all whitespace into a single ' ' space character.
 * @private
 *
 * @param {String} str - The string to normalize whitespace from.
 *
 * @return {String} The normalized string.
 */
function normalizeWhitespace(str) {
	return str.replace(ENDLINE_REGEXP, ' ') // remove line endings
	.replace(WHITESPACE_REGEXP, ' ') // normalize whitespace to single ' '
	.replace(BRACKET_WHITESPACE_REGEXP, '$2$4$6'); // remove whitespace in brackets
}

/**
 * Parses the name and count out of a name statement, returning the declaration object.
 * @private
 *
 * @param {String} qualifier - The qualifier string.
 * @param {String} type - The type string.
 * @param {String} entry - The variable declaration string.
 *
 * @return {Object} The declaration object.
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
 * @private
 *
 * @param {String} statement - The statement to parse.
 *
 * @return {Array} The array of parsed declaration objects.
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
 * @private
 *
 * @param {String} source - The shader source string.
 * @param {String|Array} keywords - The qualifier declaration keywords.
 *
 * @return {Array} The array of qualifier declaration objects.
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
 * @private
 *
 * @param {Array} declarations - The array of declarations.
 *
 * @return {Array} The filtered array of declarations.
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
 * @private
 *
 * @param {String} source - The unprocessed source code.
 *
 * @return {String} The processed source code.
 */
function preprocess(source) {
	return ShaderPreprocessor.preprocess(source);
}

module.exports = {

	/**
  * Parses the provided GLSL source, and returns all declaration statements that contain the provided qualifier type. This can be used to extract all attributes and uniform names and types from a shader.
  *
  * For example, when provided a 'uniform' qualifiers, the declaration:
  *
  *	 'uniform highp vec3 uSpecularColor;'
  *
  * Would be parsed to:
  *	 {
  *		 qualifier: 'uniform',
  *		 type: 'vec3',
  *		 name: 'uSpecularColor',
  *		 count: 1
  *	 }
  * @param {Array} sources - The shader sources.
  * @param {Array} qualifiers - The qualifiers to extract.
  *
  * @return {Array} The array of qualifier declaration statements.
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
  * @param {String} str - The input string to test.
  *
  * @return {boolean} Whether or not the string is glsl code.
  */
	isGLSL: function isGLSL(str) {
		return GLSL_REGEXP.test(str);
	}

};

},{"./ShaderPreprocessor":52}],52:[function(require,module,exports){
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
var PARSE_IF_REGEX = /#if\s+\(?\s*(!?\s*\w+)\s*(==|!=|>=|<=|<|<|>)?\s*(\w*)\s*\)?/i;
var PARSE_IFDEF_REGEX = /#ifdef\s+(\w+)/i;
var PARSE_IFNDEF_REGEX = /#ifndef\s+(\w+)/i;
var PARSE_ELIF_REGEX = /#elif\s+\(?\s*(!?\s*\w+)\s*(==|!=|>=|<=|<|<|>)?\s*(\w*)\s*\)?/i;
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
 * @param {String} glsl - The glsl source code.
 *
 * @return {String} The processed glsl source code.
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

},{}],53:[function(require,module,exports){
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
 * @constant {String}
 */
var DEFAULT_TYPE = 'UNSIGNED_BYTE';

/**
 * The default format for textures.
 * @private
 * @constant {String}
 */
var DEFAULT_FORMAT = 'RGBA';

/**
 * The default wrap mode for textures.
 * @private
 * @constant {String}
 */
var DEFAULT_WRAP = 'REPEAT';

/**
 * The default min / mag filter for textures.
 * @private
 * @constant {String}
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
 * @constant {String}
 */
var DEFAULT_MIPMAP_MIN_FILTER_SUFFIX = '_MIPMAP_LINEAR';

/**
 * @class Texture2D
 * @classdesc A texture class to represent a 2D texture.
 */

var Texture2D = function () {

	/**
  * Instantiates a Texture2D object.
  *
  * @param {ArrayBuffer|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} spec.src - The data to buffer.
  * @param {Number} spec.width - The width of the texture.
  * @param {Number} spec.height - The height of the texture.
  * @param {String} spec.wrap - The wrapping type over both S and T dimension.
  * @param {String} spec.wrapS - The wrapping type over the S dimension.
  * @param {String} spec.wrapT - The wrapping type over the T dimension.
  * @param {String} spec.filter - The min / mag filter used during scaling.
  * @param {String} spec.minFilter - The minification filter used during scaling.
  * @param {String} spec.magFilter - The magnification filter used during scaling.
  * @param {bool} spec.mipMap - Whether or not mip-mapping is enabled.
  * @param {bool} spec.invertY - Whether or not invert-y is enabled.
  * @param {bool} spec.premultiplyAlpha - Whether or not alpha premultiplying is enabled.
  * @param {String} spec.format - The texture pixel format.
  * @param {String} spec.type - The texture pixel component type.
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
  * @param {Number} location - The texture unit location index. Defaults to 0.
  *
  * @return {Texture2D} The texture object, for chaining.
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
   * @return {Texture2D} The texture object, for chaining.
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
   * @param {Number} width - The width of the data.
   * @param {Number} height - The height of the data.
   *
   * @return {Texture2D} The texture object, for chaining.
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
   * @param {Number} xOffset - The x offset at which to buffer.
   * @param {Number} yOffset - The y offset at which to buffer.
   * @param {Number} width - The width of the data.
   * @param {Number} height - The height of the data.
   *
   * @return {Texture2D} The texture object, for chaining.
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
   * @param {String} params.wrap - The wrapping type over both S and T dimension.
   * @param {String} params.wrapS - The wrapping type over the S dimension.
   * @param {String} params.wrapT - The wrapping type over the T dimension.
   * @param {String} params.filter - The min / mag filter used during scaling.
   * @param {String} params.minFilter - The minification filter used during scaling.
   * @param {String} params.magFilter - The magnification filter used during scaling.
   *
   * @return {Texture2D} The texture object, for chaining.
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
   * @param {Number} width - The new width of the texture.
   * @param {Number} height - The new height of the texture.
   *
   * @return {Texture2D} The texture object, for chaining.
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

},{"../util/Util":61,"./WebGLContext":58}],54:[function(require,module,exports){
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
 * @constant {String}
 */
var DEFAULT_TYPE = 'UNSIGNED_BYTE';

/**
 * The default format for textures.
 * @private
 * @constant {String}
 */
var DEFAULT_FORMAT = 'RGBA';

/**
 * The default wrap mode for textures.
 * @private
 * @constant {String}
 */
var DEFAULT_WRAP = 'CLAMP_TO_EDGE';

/**
 * The default min / mag filter for textures.
 * @private
 * @constant {String}
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
 * @constant {String}
 */
var DEFAULT_MIPMAP_MIN_FILTER_SUFFIX = '_MIPMAP_LINEAR';

/**
 * Checks the width and height of the cubemap and throws an exception if
 * it does not meet requirements.
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
 * @private
 *
 * @param {TextureCubeMap} cubeMap - The cube map texture object.
 * @param {String} target - The texture target.
 * @param {String} url - The url to load the face from.
 *
 * @return {Function} The loader function.
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
 * @private
 *
 * @param {TextureCubeMap} cubeMap - The cube map texture object.
 * @param {String} target - The texture target.
 * @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} canvas - The canvas type object.
 *
 * @return {Function} - The loader function.
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
 * @private
 *
 * @param {TextureCubeMap} cubeMap - The cube map texture object.
 * @param {String} target - The texture target.
 * @param {Array|ArrayBuffer|ArrayBufferView} arr - The array type object.
 *
 * @return {Function} The loader function.
 */
function loadFaceArray(cubeMap, target, arr) {
	checkDimensions(cubeMap);
	return function (done) {
		cubeMap.bufferData(target, arr);
		done(null);
	};
}

/**
 * @class TextureCubeMap
 * @classdesc A texture class to represent a cube map texture.
 */

var TextureCubeMap = function () {

	/**
  * Instantiates a TextureCubeMap object.
  *
  * @param {Object} spec - The specification arguments
  * @param {Object} spec.faces - The faces to buffer, under keys '+x', '+y', '+z', '-x', '-y', and '-z'.
  * @param {Number} spec.width - The width of the faces.
  * @param {Number} spec.height - The height of the faces.
  * @param {String} spec.wrap - The wrapping type over both S and T dimension.
  * @param {String} spec.wrapS - The wrapping type over the S dimension.
  * @param {String} spec.wrapT - The wrapping type over the T dimension.
  * @param {String} spec.filter - The min / mag filter used during scaling.
  * @param {String} spec.minFilter - The minification filter used during scaling.
  * @param {String} spec.magFilter - The magnification filter used during scaling.
  * @param {bool} spec.mipMap - Whether or not mip-mapping is enabled.
  * @param {bool} spec.invertY - Whether or not invert-y is enabled.
  * @param {bool} spec.premultiplyAlpha - Whether or not alpha premultiplying is enabled.
  * @param {String} spec.format - The texture pixel format.
  * @param {String} spec.type - The texture pixel component type.
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
  * @param {Number} location - The texture unit location index. Defaults to 0.
  *
  * @return {TextureCubeMap} The texture object, for chaining.
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
   * @return {TextureCubeMap} - The texture object, for chaining.
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
   * @param {String} target - The face target.
   * @param {Object|null} data - The face data.
   *
   * @return {TextureCubeMap} The texture object, for chaining.
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
   * @param {String} params.wrap - The wrapping type over both S and T dimension.
   * @param {String} params.wrapS - The wrapping type over the S dimension.
   * @param {String} params.wrapT - The wrapping type over the T dimension.
   * @param {String} params.filter - The min / mag filter used during scaling.
   * @param {String} params.minFilter - The minification filter used during scaling.
   * @param {String} params.magFilter - The magnification filter used during scaling.
   *
   * @return {TextureCubeMap} The texture object, for chaining.
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

},{"../util/ImageLoader":60,"../util/Util":61,"./WebGLContext":58,"async/parallel":12}],55:[function(require,module,exports){
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
 * @constant {Number}
 */
var DEFAULT_BYTE_OFFSET = 0;

/**
 * The default render mode (primitive type).
 * @private
 * @constant {String}
 */
var DEFAULT_MODE = 'TRIANGLES';

/**
 * The default index offset to render from.
 * @private
 * @constant {Number}
 */
var DEFAULT_INDEX_OFFSET = 0;

/**
 * The default count of indices to render.
 * @private
 * @constant {Number}
 */
var DEFAULT_COUNT = 0;

/**
 * Parse the attribute pointers and determine the byte stride of the buffer.
 * @private
 *
 * @param {Map} attributePointers - The attribute pointer map.
 *
 * @return {Number} The byte stride of the buffer.
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
 * @private
 *
 * @param {Object} attributePointers - The attribute pointer map.
 *
 * @return {Object} The validated attribute pointer map.
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
 * @class VertexBuffer
 * @classdesc A vertex buffer object.
 */

var VertexBuffer = function () {

	/**
  * Instantiates an VertexBuffer object.
  *
  * @param {WebGLBuffer|VertexPackage|ArrayBuffer|Array|Number} arg - The buffer or length of the buffer.
  * @param {Object} attributePointers - The array pointer map, or in the case of a vertex package arg, the options.
  * @param {Object} options - The rendering options.
  * @param {String} options.mode - The draw mode / primitive type.
  * @param {String} options.indexOffset - The index offset into the drawn buffer.
  * @param {String} options.count - The number of indices to draw.
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
  * @return {VertexBuffer} The vertex buffer object, for chaining.
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
   * @param {Number} byteOffset - The byte offset at which to buffer.
   *
   * @return {VertexBuffer} The vertex buffer object, for chaining.
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
   * @return {VertexBuffer} - Returns the vertex buffer object for chaining.
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
   * @return {VertexBuffer} The vertex buffer object, for chaining.
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
   * @param {String} options.mode - The draw mode / primitive type.
   * @param {String} options.indexOffset - The index offset into the drawn buffer.
   * @param {String} options.count - The number of indices to draw.
   *
   * @return {VertexBuffer} The vertex buffer object, for chaining.
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

},{"./WebGLContext":58}],56:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var COMPONENT_TYPE = 'FLOAT';
var BYTES_PER_COMPONENT = 4;

/**
 * Removes invalid attribute arguments. A valid argument must be an Array of length > 0 key by a string representing an int.
 * @private
 *
 * @param {Object} attributes - The map of vertex attributes.
 *
 * @return {Array} The valid array of arguments.
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
 * @private
 *
 * @param {Object|Array} component - The component to measure.
 *
 * @return {Number} The byte size of the component.
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
 * Calculates the type, size, and offset for each attribute in the attribute array along with the length and stride of the package.
 * @private
 *
 * @param {VertexPackage} vertexPackage - The VertexPackage object.
 * @param {Array} attributes The array of vertex attributes.
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
 * @private
 *
 * @param {Float32Array} buffer - The arraybuffer to fill.
 * @param {Array} vertices - The vertex attribute array to copy from.
 * @param {Number} length - The length of the buffer to copy from.
 * @param {Number} offset - The offset to the attribute, not in bytes.
 * @param {Number} stride - The stride of the buffer, not in bytes.
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
 * @private
 *
 * @param {Float32Array} buffer - The arraybuffer to fill.
 * @param {Array} vertices - The vertex attribute array to copy from.
 * @param {Number} length - The length of the buffer to copy from.
 * @param {Number} offset - The offset to the attribute, not in bytes.
 * @param {Number} stride - The stride of the buffer, not in bytes.
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
 * @private
 *
 * @param {Float32Array} buffer - The arraybuffer to fill.
 * @param {Array} vertices - The vertex attribute array to copy from.
 * @param {Number} length - The length of the buffer to copy from.
 * @param {Number} offset - The offset to the attribute, not in bytes.
 * @param {Number} stride - The stride of the buffer, not in bytes.
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
 * @private
 *
 * @param {Float32Array} buffer - The arraybuffer to fill.
 * @param {Array} vertices - The vertex attribute array to copy from.
 * @param {Number} length - The length of the buffer to copy from.
 * @param {Number} offset - The offset to the attribute, not in bytes.
 * @param {Number} stride - The stride of the buffer, not in bytes.
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
 * @class VertexPackage
 * @classdesc A vertex package to assist in interleaving vertex data and building the associated vertex attribute pointers.
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
  * Set the data to be interleaved inside the package. This clears any previously existing data.
  *
  * @param {Object} attributes - The attributes to interleaved, keyed by index.
  *
  * @return {VertexPackage} The vertex package object, for chaining.
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

},{}],57:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebGLContext = require('./WebGLContext');

/**
 * Bind the viewport to the rendering context.
 * @private
 *
 * @param {Viewport} viewport - The viewport object.
 * @param {Number} width - The width override.
 * @param {Number} height - The height override.
 * @param {Number} x - The horizontal offset override.
 * @param {Number} y - The vertical offset override.
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
 * @class Viewport
 * @classdesc A viewport class for managing WebGL viewports.
 */

var Viewport = function () {

	/**
  * Instantiates a Viewport object.
  *
  * @param {Object} spec - The viewport specification object.
  * @param {Number} spec.width - The width of the viewport.
  * @param {Number} spec.height - The height of the viewport.
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
  * @param {Number} width - The width of the viewport.
  * @param {Number} height - The height of the viewport.
  *
  * @return {Viewport} The viewport object, for chaining.
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
   * Sets the viewport dimensions and position. The underlying canvas element is not affected.
   *
   * @param {Number} width - The width override.
   * @param {Number} height - The height override.
   * @param {Number} x - The horizontal offset override.
   * @param {Number} y - The vertical offset override.
   *
   * @return {Viewport} - The viewport object, for chaining.
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
   * @return {Viewport} The viewport object, for chaining.
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

},{"./WebGLContext":58}],58:[function(require,module,exports){
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
 * @private
 *
 * @return {String} - The UUID string.
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
 * Returns the id of the HTMLCanvasElement element. If there is no id, it generates one and appends it.
 * @private
 *
 * @param {HTMLCanvasElement} canvas - The Canvas object.
 *
 * @return {String} The Canvas id string.
 */
function getId(canvas) {
	if (!canvas.id) {
		canvas.id = getUUID();
	}
	return canvas.id;
}

/**
 * Returns a Canvas element object from either an existing object, or identification string.
 * @private
 *
 * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas id or selector string.
 *
 * @return {HTMLCanvasElement} The Canvas element object.
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
 * @private
 *
 * @param {WebGLRenderingContext} context - The WebGLRenderingContext.
 *
 * @return {Object} The context wrapper.
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
 * @private
 *
 * @param {HTMLCanvasElement} The Canvas element object to create the context under.
 *
 * @return {Object} The context wrapper.
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
 * Attempts to load all known extensions for a provided WebGLRenderingContext. Stores the results in the context wrapper for later queries.
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
 * @private
 *
 * @param {HTMLCanvasElement} - The Canvas element object to create the context under.
 * @param {Object}} options - Parameters to the webgl context, only used during instantiation. Optional.
 *
 * @return {Object} The context wrapper.
 */
function createContextWrapper(canvas, options) {
	var gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
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
  * Retrieves an existing WebGL context associated with the provided argument and binds it. While bound, the active context will be used implicitly by any instantiated `esper` constructs.
  *
  * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string.
  *
  * @return {WebGLContext} The namespace, used for chaining.
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
  * Retrieves an existing WebGL context associated with the provided argument. If no context exists, one is created.
  * During creation attempts to load all extensions found at: https://www.khronos.org/registry/webgl/extensions/.
  *
  * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
  * @param {Object} options - Parameters to the webgl context, only used during instantiation. Optional.
  *
  * @return {WebGLRenderingContext} The WebGLRenderingContext object.
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
  * Removes an existing WebGL context object for the provided or currently bound context object.
  *
  * @param {WebGLRenderingContext|HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
  * @param {Object}} options - Parameters to the webgl context, only used during instantiation. Optional.
  *
  * @return {WebGLRenderingContext} The WebGLRenderingContext object.
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
  * Returns an array of all supported extensions for the provided or currently bound context object.
  *
  * @param {WebGLRenderingContext|HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
  *
  * @return {Array} All supported extensions.
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
  * Returns an array of all unsupported extensions for the provided or currently bound context object.
  *
  * @param {WebGLRenderingContext|HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
  *
  * @return {Array} All unsupported extensions.
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
  * Checks if an extension has been successfully loaded for the provided or currently bound context object.
  *
  * @param {WebGLRenderingContext|HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
  * @param {String} extension - The extension name.
  *
  * @return {boolean} Whether or not the provided extension has been loaded successfully.
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
  * Returns an extension if it has been successfully loaded for the provided or currently bound context object.
  *
  * @param {WebGLRenderingContext|HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
  * @param {String} extension - The extension name.
  *
  * @return {boolean} Whether or not the provided extension has been loaded successfully.
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

},{}],59:[function(require,module,exports){
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

},{"./core/ColorTexture2D":45,"./core/DepthTexture2D":46,"./core/IndexBuffer":47,"./core/RenderTarget":48,"./core/Renderable":49,"./core/Shader":50,"./core/Texture2D":53,"./core/TextureCubeMap":54,"./core/VertexBuffer":55,"./core/VertexPackage":56,"./core/Viewport":57,"./core/WebGLContext":58}],60:[function(require,module,exports){
'use strict';

module.exports = {

	/**
  * Sends an GET request create an Image object.
  *
  * @param {Object} options - The XHR options.
  * @param {String} options.url - The URL for the resource.
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

},{}],61:[function(require,module,exports){
'use strict';

/**
 * Returns true if the argument is one of the WebGL `texImage2D` overridden
 * canvas types.
 *
 * @param {*} arg - The argument to test.
 *
 * @return {bool} - Whether or not it is a canvas type.
 */

function isCanvasType(arg) {
  return arg instanceof ImageData || arg instanceof HTMLImageElement || arg instanceof HTMLCanvasElement || arg instanceof HTMLVideoElement;
};

/**
 * Returns true if the texture MUST be a power-of-two. Otherwise return false.
 *
 * @param {Object} spec - The texture specification object.
 *
 * @return {bool} - Whether or not the texture must be a power of two.
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
 * @param {Number} num - The number to test.
 *
 * @return {boolean} - Whether or not the number is a power of two.
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
 * @param {Number} num - The number to modify.
 *
 * @return {Number} - Next highest power of two.
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
 * @private
 *
 * @param {Object} spec - The texture specification object.
 * @param {HTMLImageElement} img - The image object.
 *
 * @return {HTMLImageElement|HTMLCanvasElement} - The original image, or the resized canvas element.
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

},{}],62:[function(require,module,exports){
'use strict';

module.exports = {

	/**
  * Sends an XMLHttpRequest GET request to the supplied url.
  *
  * @param {Object} options - The XHR options.
  * @param {String} options.url - The URL for the resource.
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

},{}]},{},[59])(59)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXN5bmMvZWFjaE9mLmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jL2VhY2hPZkxpbWl0LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jL2ludGVybmFsL2JyZWFrTG9vcC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy9pbnRlcm5hbC9kb0xpbWl0LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jL2ludGVybmFsL2VhY2hPZkxpbWl0LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jL2ludGVybmFsL2dldEl0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jL2ludGVybmFsL2l0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jL2ludGVybmFsL29uY2UuanMiLCJub2RlX21vZHVsZXMvYXN5bmMvaW50ZXJuYWwvb25seU9uY2UuanMiLCJub2RlX21vZHVsZXMvYXN5bmMvaW50ZXJuYWwvcGFyYWxsZWwuanMiLCJub2RlX21vZHVsZXMvYXN5bmMvaW50ZXJuYWwvcmVzdC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy9wYXJhbGxlbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FwcGx5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlMaWtlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNUeXBlZEFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVGltZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVW5hcnkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0UmF3VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNJbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25vZGVVdGlsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlclJlc3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0J1ZmZlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNMZW5ndGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzVHlwZWRBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gva2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvbm9vcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkZhbHNlLmpzIiwic3JjL2NvcmUvQ29sb3JUZXh0dXJlMkQuanMiLCJzcmMvY29yZS9EZXB0aFRleHR1cmUyRC5qcyIsInNyYy9jb3JlL0luZGV4QnVmZmVyLmpzIiwic3JjL2NvcmUvUmVuZGVyVGFyZ2V0LmpzIiwic3JjL2NvcmUvUmVuZGVyYWJsZS5qcyIsInNyYy9jb3JlL1NoYWRlci5qcyIsInNyYy9jb3JlL1NoYWRlclBhcnNlci5qcyIsInNyYy9jb3JlL1NoYWRlclByZXByb2Nlc3Nvci5qcyIsInNyYy9jb3JlL1RleHR1cmUyRC5qcyIsInNyYy9jb3JlL1RleHR1cmVDdWJlTWFwLmpzIiwic3JjL2NvcmUvVmVydGV4QnVmZmVyLmpzIiwic3JjL2NvcmUvVmVydGV4UGFja2FnZS5qcyIsInNyYy9jb3JlL1ZpZXdwb3J0LmpzIiwic3JjL2NvcmUvV2ViR0xDb250ZXh0LmpzIiwic3JjL2V4cG9ydHMuanMiLCJzcmMvdXRpbC9JbWFnZUxvYWRlci5qcyIsInNyYy91dGlsL1V0aWwuanMiLCJzcmMvdXRpbC9YSFJMb2FkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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VUFBK0QsUUFBUSxVQUF2RTtBQUNBO0FBQ0Q7QUFDRDtBQUNELEdBWkQ7QUFhQSxVQUFRLGVBQVIsR0FBMEIsUUFBUSxXQUFSLEdBQXNCLElBQXRCLEdBQTZCLEtBQXZEO0FBQ0EsVUFBUSxJQUFSO0FBQ0E7QUEvQmUsQ0FBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChjb2xsLCBpdGVyYXRlZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgZWFjaE9mSW1wbGVtZW50YXRpb24gPSAoMCwgX2lzQXJyYXlMaWtlMi5kZWZhdWx0KShjb2xsKSA/IGVhY2hPZkFycmF5TGlrZSA6IGVhY2hPZkdlbmVyaWM7XG4gICAgZWFjaE9mSW1wbGVtZW50YXRpb24oY29sbCwgaXRlcmF0ZWUsIGNhbGxiYWNrKTtcbn07XG5cbnZhciBfaXNBcnJheUxpa2UgPSByZXF1aXJlKCdsb2Rhc2gvaXNBcnJheUxpa2UnKTtcblxudmFyIF9pc0FycmF5TGlrZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc0FycmF5TGlrZSk7XG5cbnZhciBfYnJlYWtMb29wID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9icmVha0xvb3AnKTtcblxudmFyIF9icmVha0xvb3AyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYnJlYWtMb29wKTtcblxudmFyIF9lYWNoT2ZMaW1pdCA9IHJlcXVpcmUoJy4vZWFjaE9mTGltaXQnKTtcblxudmFyIF9lYWNoT2ZMaW1pdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9lYWNoT2ZMaW1pdCk7XG5cbnZhciBfZG9MaW1pdCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvZG9MaW1pdCcpO1xuXG52YXIgX2RvTGltaXQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZG9MaW1pdCk7XG5cbnZhciBfbm9vcCA9IHJlcXVpcmUoJ2xvZGFzaC9ub29wJyk7XG5cbnZhciBfbm9vcDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ub29wKTtcblxudmFyIF9vbmNlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9vbmNlJyk7XG5cbnZhciBfb25jZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vbmNlKTtcblxudmFyIF9vbmx5T25jZSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvb25seU9uY2UnKTtcblxudmFyIF9vbmx5T25jZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vbmx5T25jZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8vIGVhY2hPZiBpbXBsZW1lbnRhdGlvbiBvcHRpbWl6ZWQgZm9yIGFycmF5LWxpa2VzXG5mdW5jdGlvbiBlYWNoT2ZBcnJheUxpa2UoY29sbCwgaXRlcmF0ZWUsIGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sgPSAoMCwgX29uY2UyLmRlZmF1bHQpKGNhbGxiYWNrIHx8IF9ub29wMi5kZWZhdWx0KTtcbiAgICB2YXIgaW5kZXggPSAwLFxuICAgICAgICBjb21wbGV0ZWQgPSAwLFxuICAgICAgICBsZW5ndGggPSBjb2xsLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGl0ZXJhdG9yQ2FsbGJhY2soZXJyLCB2YWx1ZSkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICB9IGVsc2UgaWYgKCsrY29tcGxldGVkID09PSBsZW5ndGggfHwgdmFsdWUgPT09IF9icmVha0xvb3AyLmRlZmF1bHQpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yICg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKGNvbGxbaW5kZXhdLCBpbmRleCwgKDAsIF9vbmx5T25jZTIuZGVmYXVsdCkoaXRlcmF0b3JDYWxsYmFjaykpO1xuICAgIH1cbn1cblxuLy8gYSBnZW5lcmljIHZlcnNpb24gb2YgZWFjaE9mIHdoaWNoIGNhbiBoYW5kbGUgYXJyYXksIG9iamVjdCwgYW5kIGl0ZXJhdG9yIGNhc2VzLlxudmFyIGVhY2hPZkdlbmVyaWMgPSAoMCwgX2RvTGltaXQyLmRlZmF1bHQpKF9lYWNoT2ZMaW1pdDIuZGVmYXVsdCwgSW5maW5pdHkpO1xuXG4vKipcbiAqIExpa2UgW2BlYWNoYF17QGxpbmsgbW9kdWxlOkNvbGxlY3Rpb25zLmVhY2h9LCBleGNlcHQgdGhhdCBpdCBwYXNzZXMgdGhlIGtleSAob3IgaW5kZXgpIGFzIHRoZSBzZWNvbmQgYXJndW1lbnRcbiAqIHRvIHRoZSBpdGVyYXRlZS5cbiAqXG4gKiBAbmFtZSBlYWNoT2ZcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBtb2R1bGU6Q29sbGVjdGlvbnNcbiAqIEBtZXRob2RcbiAqIEBhbGlhcyBmb3JFYWNoT2ZcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAc2VlIFthc3luYy5lYWNoXXtAbGluayBtb2R1bGU6Q29sbGVjdGlvbnMuZWFjaH1cbiAqIEBwYXJhbSB7QXJyYXl8SXRlcmFibGV8T2JqZWN0fSBjb2xsIC0gQSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIC0gQSBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoXG4gKiBpdGVtIGluIGBjb2xsYC4gVGhlIGBrZXlgIGlzIHRoZSBpdGVtJ3Mga2V5LCBvciBpbmRleCBpbiB0aGUgY2FzZSBvZiBhblxuICogYXJyYXkuIFRoZSBpdGVyYXRlZSBpcyBwYXNzZWQgYSBgY2FsbGJhY2soZXJyKWAgd2hpY2ggbXVzdCBiZSBjYWxsZWQgb25jZSBpdFxuICogaGFzIGNvbXBsZXRlZC4gSWYgbm8gZXJyb3IgaGFzIG9jY3VycmVkLCB0aGUgY2FsbGJhY2sgc2hvdWxkIGJlIHJ1biB3aXRob3V0XG4gKiBhcmd1bWVudHMgb3Igd2l0aCBhbiBleHBsaWNpdCBgbnVsbGAgYXJndW1lbnQuIEludm9rZWQgd2l0aFxuICogKGl0ZW0sIGtleSwgY2FsbGJhY2spLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSAtIEEgY2FsbGJhY2sgd2hpY2ggaXMgY2FsbGVkIHdoZW4gYWxsXG4gKiBgaXRlcmF0ZWVgIGZ1bmN0aW9ucyBoYXZlIGZpbmlzaGVkLCBvciBhbiBlcnJvciBvY2N1cnMuIEludm9rZWQgd2l0aCAoZXJyKS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iaiA9IHtkZXY6IFwiL2Rldi5qc29uXCIsIHRlc3Q6IFwiL3Rlc3QuanNvblwiLCBwcm9kOiBcIi9wcm9kLmpzb25cIn07XG4gKiB2YXIgY29uZmlncyA9IHt9O1xuICpcbiAqIGFzeW5jLmZvckVhY2hPZihvYmosIGZ1bmN0aW9uICh2YWx1ZSwga2V5LCBjYWxsYmFjaykge1xuICogICAgIGZzLnJlYWRGaWxlKF9fZGlybmFtZSArIHZhbHVlLCBcInV0ZjhcIiwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICogICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAqICAgICAgICAgdHJ5IHtcbiAqICAgICAgICAgICAgIGNvbmZpZ3Nba2V5XSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gKiAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAqICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlKTtcbiAqICAgICAgICAgfVxuICogICAgICAgICBjYWxsYmFjaygpO1xuICogICAgIH0pO1xuICogfSwgZnVuY3Rpb24gKGVycikge1xuICogICAgIGlmIChlcnIpIGNvbnNvbGUuZXJyb3IoZXJyLm1lc3NhZ2UpO1xuICogICAgIC8vIGNvbmZpZ3MgaXMgbm93IGEgbWFwIG9mIEpTT04gZGF0YVxuICogICAgIGRvU29tZXRoaW5nV2l0aChjb25maWdzKTtcbiAqIH0pO1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBlYWNoT2ZMaW1pdDtcblxudmFyIF9lYWNoT2ZMaW1pdDIgPSByZXF1aXJlKCcuL2ludGVybmFsL2VhY2hPZkxpbWl0Jyk7XG5cbnZhciBfZWFjaE9mTGltaXQzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZWFjaE9mTGltaXQyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKiBUaGUgc2FtZSBhcyBbYGVhY2hPZmBde0BsaW5rIG1vZHVsZTpDb2xsZWN0aW9ucy5lYWNoT2Z9IGJ1dCBydW5zIGEgbWF4aW11bSBvZiBgbGltaXRgIGFzeW5jIG9wZXJhdGlvbnMgYXQgYVxuICogdGltZS5cbiAqXG4gKiBAbmFtZSBlYWNoT2ZMaW1pdFxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIG1vZHVsZTpDb2xsZWN0aW9uc1xuICogQG1ldGhvZFxuICogQHNlZSBbYXN5bmMuZWFjaE9mXXtAbGluayBtb2R1bGU6Q29sbGVjdGlvbnMuZWFjaE9mfVxuICogQGFsaWFzIGZvckVhY2hPZkxpbWl0XG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxJdGVyYWJsZXxPYmplY3R9IGNvbGwgLSBBIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtudW1iZXJ9IGxpbWl0IC0gVGhlIG1heGltdW0gbnVtYmVyIG9mIGFzeW5jIG9wZXJhdGlvbnMgYXQgYSB0aW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgLSBBIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2hcbiAqIGl0ZW0gaW4gYGNvbGxgLiBUaGUgYGtleWAgaXMgdGhlIGl0ZW0ncyBrZXksIG9yIGluZGV4IGluIHRoZSBjYXNlIG9mIGFuXG4gKiBhcnJheS4gVGhlIGl0ZXJhdGVlIGlzIHBhc3NlZCBhIGBjYWxsYmFjayhlcnIpYCB3aGljaCBtdXN0IGJlIGNhbGxlZCBvbmNlIGl0XG4gKiBoYXMgY29tcGxldGVkLiBJZiBubyBlcnJvciBoYXMgb2NjdXJyZWQsIHRoZSBjYWxsYmFjayBzaG91bGQgYmUgcnVuIHdpdGhvdXRcbiAqIGFyZ3VtZW50cyBvciB3aXRoIGFuIGV4cGxpY2l0IGBudWxsYCBhcmd1bWVudC4gSW52b2tlZCB3aXRoXG4gKiAoaXRlbSwga2V5LCBjYWxsYmFjaykuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIC0gQSBjYWxsYmFjayB3aGljaCBpcyBjYWxsZWQgd2hlbiBhbGxcbiAqIGBpdGVyYXRlZWAgZnVuY3Rpb25zIGhhdmUgZmluaXNoZWQsIG9yIGFuIGVycm9yIG9jY3Vycy4gSW52b2tlZCB3aXRoIChlcnIpLlxuICovXG5mdW5jdGlvbiBlYWNoT2ZMaW1pdChjb2xsLCBsaW1pdCwgaXRlcmF0ZWUsIGNhbGxiYWNrKSB7XG4gICgwLCBfZWFjaE9mTGltaXQzLmRlZmF1bHQpKGxpbWl0KShjb2xsLCBpdGVyYXRlZSwgY2FsbGJhY2spO1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG4vLyBBIHRlbXBvcmFyeSB2YWx1ZSB1c2VkIHRvIGlkZW50aWZ5IGlmIHRoZSBsb29wIHNob3VsZCBiZSBicm9rZW4uXG4vLyBTZWUgIzEwNjQsICMxMjkzXG5leHBvcnRzLmRlZmF1bHQgPSB7fTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGRvTGltaXQ7XG5mdW5jdGlvbiBkb0xpbWl0KGZuLCBsaW1pdCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoaXRlcmFibGUsIGl0ZXJhdGVlLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gZm4oaXRlcmFibGUsIGxpbWl0LCBpdGVyYXRlZSwgY2FsbGJhY2spO1xuICAgIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gX2VhY2hPZkxpbWl0O1xuXG52YXIgX25vb3AgPSByZXF1aXJlKCdsb2Rhc2gvbm9vcCcpO1xuXG52YXIgX25vb3AyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbm9vcCk7XG5cbnZhciBfb25jZSA9IHJlcXVpcmUoJy4vb25jZScpO1xuXG52YXIgX29uY2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb25jZSk7XG5cbnZhciBfaXRlcmF0b3IgPSByZXF1aXJlKCcuL2l0ZXJhdG9yJyk7XG5cbnZhciBfaXRlcmF0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXRlcmF0b3IpO1xuXG52YXIgX29ubHlPbmNlID0gcmVxdWlyZSgnLi9vbmx5T25jZScpO1xuXG52YXIgX29ubHlPbmNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX29ubHlPbmNlKTtcblxudmFyIF9icmVha0xvb3AgPSByZXF1aXJlKCcuL2JyZWFrTG9vcCcpO1xuXG52YXIgX2JyZWFrTG9vcDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9icmVha0xvb3ApO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfZWFjaE9mTGltaXQobGltaXQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9iaiwgaXRlcmF0ZWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gKDAsIF9vbmNlMi5kZWZhdWx0KShjYWxsYmFjayB8fCBfbm9vcDIuZGVmYXVsdCk7XG4gICAgICAgIGlmIChsaW1pdCA8PSAwIHx8ICFvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmV4dEVsZW0gPSAoMCwgX2l0ZXJhdG9yMi5kZWZhdWx0KShvYmopO1xuICAgICAgICB2YXIgZG9uZSA9IGZhbHNlO1xuICAgICAgICB2YXIgcnVubmluZyA9IDA7XG5cbiAgICAgICAgZnVuY3Rpb24gaXRlcmF0ZWVDYWxsYmFjayhlcnIsIHZhbHVlKSB7XG4gICAgICAgICAgICBydW5uaW5nIC09IDE7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IF9icmVha0xvb3AyLmRlZmF1bHQgfHwgZG9uZSAmJiBydW5uaW5nIDw9IDApIHtcbiAgICAgICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlcGxlbmlzaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVwbGVuaXNoKCkge1xuICAgICAgICAgICAgd2hpbGUgKHJ1bm5pbmcgPCBsaW1pdCAmJiAhZG9uZSkge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtID0gbmV4dEVsZW0oKTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bm5pbmcgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBydW5uaW5nICs9IDE7XG4gICAgICAgICAgICAgICAgaXRlcmF0ZWUoZWxlbS52YWx1ZSwgZWxlbS5rZXksICgwLCBfb25seU9uY2UyLmRlZmF1bHQpKGl0ZXJhdGVlQ2FsbGJhY2spKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlcGxlbmlzaCgpO1xuICAgIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGNvbGwpIHtcbiAgICByZXR1cm4gaXRlcmF0b3JTeW1ib2wgJiYgY29sbFtpdGVyYXRvclN5bWJvbF0gJiYgY29sbFtpdGVyYXRvclN5bWJvbF0oKTtcbn07XG5cbnZhciBpdGVyYXRvclN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGl0ZXJhdG9yO1xuXG52YXIgX2lzQXJyYXlMaWtlID0gcmVxdWlyZSgnbG9kYXNoL2lzQXJyYXlMaWtlJyk7XG5cbnZhciBfaXNBcnJheUxpa2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNBcnJheUxpa2UpO1xuXG52YXIgX2dldEl0ZXJhdG9yID0gcmVxdWlyZSgnLi9nZXRJdGVyYXRvcicpO1xuXG52YXIgX2dldEl0ZXJhdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldEl0ZXJhdG9yKTtcblxudmFyIF9rZXlzID0gcmVxdWlyZSgnbG9kYXNoL2tleXMnKTtcblxudmFyIF9rZXlzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2tleXMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBjcmVhdGVBcnJheUl0ZXJhdG9yKGNvbGwpIHtcbiAgICB2YXIgaSA9IC0xO1xuICAgIHZhciBsZW4gPSBjb2xsLmxlbmd0aDtcbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgcmV0dXJuICsraSA8IGxlbiA/IHsgdmFsdWU6IGNvbGxbaV0sIGtleTogaSB9IDogbnVsbDtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFUzIwMTVJdGVyYXRvcihpdGVyYXRvcikge1xuICAgIHZhciBpID0gLTE7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgIHZhciBpdGVtID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAoaXRlbS5kb25lKSByZXR1cm4gbnVsbDtcbiAgICAgICAgaSsrO1xuICAgICAgICByZXR1cm4geyB2YWx1ZTogaXRlbS52YWx1ZSwga2V5OiBpIH07XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlT2JqZWN0SXRlcmF0b3Iob2JqKSB7XG4gICAgdmFyIG9rZXlzID0gKDAsIF9rZXlzMi5kZWZhdWx0KShvYmopO1xuICAgIHZhciBpID0gLTE7XG4gICAgdmFyIGxlbiA9IG9rZXlzLmxlbmd0aDtcbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgdmFyIGtleSA9IG9rZXlzWysraV07XG4gICAgICAgIHJldHVybiBpIDwgbGVuID8geyB2YWx1ZTogb2JqW2tleV0sIGtleToga2V5IH0gOiBudWxsO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGl0ZXJhdG9yKGNvbGwpIHtcbiAgICBpZiAoKDAsIF9pc0FycmF5TGlrZTIuZGVmYXVsdCkoY29sbCkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUFycmF5SXRlcmF0b3IoY29sbCk7XG4gICAgfVxuXG4gICAgdmFyIGl0ZXJhdG9yID0gKDAsIF9nZXRJdGVyYXRvcjIuZGVmYXVsdCkoY29sbCk7XG4gICAgcmV0dXJuIGl0ZXJhdG9yID8gY3JlYXRlRVMyMDE1SXRlcmF0b3IoaXRlcmF0b3IpIDogY3JlYXRlT2JqZWN0SXRlcmF0b3IoY29sbCk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gb25jZTtcbmZ1bmN0aW9uIG9uY2UoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZm4gPT09IG51bGwpIHJldHVybjtcbiAgICAgICAgdmFyIGNhbGxGbiA9IGZuO1xuICAgICAgICBmbiA9IG51bGw7XG4gICAgICAgIGNhbGxGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBvbmx5T25jZTtcbmZ1bmN0aW9uIG9ubHlPbmNlKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGZuID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoXCJDYWxsYmFjayB3YXMgYWxyZWFkeSBjYWxsZWQuXCIpO1xuICAgICAgICB2YXIgY2FsbEZuID0gZm47XG4gICAgICAgIGZuID0gbnVsbDtcbiAgICAgICAgY2FsbEZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBfcGFyYWxsZWw7XG5cbnZhciBfbm9vcCA9IHJlcXVpcmUoJ2xvZGFzaC9ub29wJyk7XG5cbnZhciBfbm9vcDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ub29wKTtcblxudmFyIF9pc0FycmF5TGlrZSA9IHJlcXVpcmUoJ2xvZGFzaC9pc0FycmF5TGlrZScpO1xuXG52YXIgX2lzQXJyYXlMaWtlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzQXJyYXlMaWtlKTtcblxudmFyIF9yZXN0ID0gcmVxdWlyZSgnLi9yZXN0Jyk7XG5cbnZhciBfcmVzdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZXN0KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX3BhcmFsbGVsKGVhY2hmbiwgdGFza3MsIGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBfbm9vcDIuZGVmYXVsdDtcbiAgICB2YXIgcmVzdWx0cyA9ICgwLCBfaXNBcnJheUxpa2UyLmRlZmF1bHQpKHRhc2tzKSA/IFtdIDoge307XG5cbiAgICBlYWNoZm4odGFza3MsIGZ1bmN0aW9uICh0YXNrLCBrZXksIGNhbGxiYWNrKSB7XG4gICAgICAgIHRhc2soKDAsIF9yZXN0Mi5kZWZhdWx0KShmdW5jdGlvbiAoZXJyLCBhcmdzKSB7XG4gICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmdzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0c1trZXldID0gYXJncztcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgIH0pKTtcbiAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0cyk7XG4gICAgfSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHJlc3Q7XG5cbnZhciBfb3ZlclJlc3QyID0gcmVxdWlyZSgnbG9kYXNoL19vdmVyUmVzdCcpO1xuXG52YXIgX292ZXJSZXN0MyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX292ZXJSZXN0Mik7XG5cbnZhciBfaWRlbnRpdHkgPSByZXF1aXJlKCdsb2Rhc2gvaWRlbnRpdHknKTtcblxudmFyIF9pZGVudGl0eTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pZGVudGl0eSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8vIExvZGFzaCByZXN0IGZ1bmN0aW9uIHdpdGhvdXQgZnVuY3Rpb24udG9TdHJpbmcoKVxuLy8gcmVtYXBwaW5nc1xuZnVuY3Rpb24gcmVzdChmdW5jLCBzdGFydCkge1xuICAgIHJldHVybiAoMCwgX292ZXJSZXN0My5kZWZhdWx0KShmdW5jLCBzdGFydCwgX2lkZW50aXR5Mi5kZWZhdWx0KTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHBhcmFsbGVsTGltaXQ7XG5cbnZhciBfZWFjaE9mID0gcmVxdWlyZSgnLi9lYWNoT2YnKTtcblxudmFyIF9lYWNoT2YyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZWFjaE9mKTtcblxudmFyIF9wYXJhbGxlbCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvcGFyYWxsZWwnKTtcblxudmFyIF9wYXJhbGxlbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wYXJhbGxlbCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogUnVuIHRoZSBgdGFza3NgIGNvbGxlY3Rpb24gb2YgZnVuY3Rpb25zIGluIHBhcmFsbGVsLCB3aXRob3V0IHdhaXRpbmcgdW50aWxcbiAqIHRoZSBwcmV2aW91cyBmdW5jdGlvbiBoYXMgY29tcGxldGVkLiBJZiBhbnkgb2YgdGhlIGZ1bmN0aW9ucyBwYXNzIGFuIGVycm9yIHRvXG4gKiBpdHMgY2FsbGJhY2ssIHRoZSBtYWluIGBjYWxsYmFja2AgaXMgaW1tZWRpYXRlbHkgY2FsbGVkIHdpdGggdGhlIHZhbHVlIG9mIHRoZVxuICogZXJyb3IuIE9uY2UgdGhlIGB0YXNrc2AgaGF2ZSBjb21wbGV0ZWQsIHRoZSByZXN1bHRzIGFyZSBwYXNzZWQgdG8gdGhlIGZpbmFsXG4gKiBgY2FsbGJhY2tgIGFzIGFuIGFycmF5LlxuICpcbiAqICoqTm90ZToqKiBgcGFyYWxsZWxgIGlzIGFib3V0IGtpY2tpbmctb2ZmIEkvTyB0YXNrcyBpbiBwYXJhbGxlbCwgbm90IGFib3V0XG4gKiBwYXJhbGxlbCBleGVjdXRpb24gb2YgY29kZS4gIElmIHlvdXIgdGFza3MgZG8gbm90IHVzZSBhbnkgdGltZXJzIG9yIHBlcmZvcm1cbiAqIGFueSBJL08sIHRoZXkgd2lsbCBhY3R1YWxseSBiZSBleGVjdXRlZCBpbiBzZXJpZXMuICBBbnkgc3luY2hyb25vdXMgc2V0dXBcbiAqIHNlY3Rpb25zIGZvciBlYWNoIHRhc2sgd2lsbCBoYXBwZW4gb25lIGFmdGVyIHRoZSBvdGhlci4gIEphdmFTY3JpcHQgcmVtYWluc1xuICogc2luZ2xlLXRocmVhZGVkLlxuICpcbiAqIEl0IGlzIGFsc28gcG9zc2libGUgdG8gdXNlIGFuIG9iamVjdCBpbnN0ZWFkIG9mIGFuIGFycmF5LiBFYWNoIHByb3BlcnR5IHdpbGxcbiAqIGJlIHJ1biBhcyBhIGZ1bmN0aW9uIGFuZCB0aGUgcmVzdWx0cyB3aWxsIGJlIHBhc3NlZCB0byB0aGUgZmluYWwgYGNhbGxiYWNrYFxuICogYXMgYW4gb2JqZWN0IGluc3RlYWQgb2YgYW4gYXJyYXkuIFRoaXMgY2FuIGJlIGEgbW9yZSByZWFkYWJsZSB3YXkgb2YgaGFuZGxpbmdcbiAqIHJlc3VsdHMgZnJvbSB7QGxpbmsgYXN5bmMucGFyYWxsZWx9LlxuICpcbiAqIEBuYW1lIHBhcmFsbGVsXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgbW9kdWxlOkNvbnRyb2xGbG93XG4gKiBAbWV0aG9kXG4gKiBAY2F0ZWdvcnkgQ29udHJvbCBGbG93XG4gKiBAcGFyYW0ge0FycmF5fEl0ZXJhYmxlfE9iamVjdH0gdGFza3MgLSBBIGNvbGxlY3Rpb24gY29udGFpbmluZyBmdW5jdGlvbnMgdG8gcnVuLlxuICogRWFjaCBmdW5jdGlvbiBpcyBwYXNzZWQgYSBgY2FsbGJhY2soZXJyLCByZXN1bHQpYCB3aGljaCBpdCBtdXN0IGNhbGwgb25cbiAqIGNvbXBsZXRpb24gd2l0aCBhbiBlcnJvciBgZXJyYCAod2hpY2ggY2FuIGJlIGBudWxsYCkgYW5kIGFuIG9wdGlvbmFsIGByZXN1bHRgXG4gKiB2YWx1ZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gLSBBbiBvcHRpb25hbCBjYWxsYmFjayB0byBydW4gb25jZSBhbGwgdGhlXG4gKiBmdW5jdGlvbnMgaGF2ZSBjb21wbGV0ZWQgc3VjY2Vzc2Z1bGx5LiBUaGlzIGZ1bmN0aW9uIGdldHMgYSByZXN1bHRzIGFycmF5XG4gKiAob3Igb2JqZWN0KSBjb250YWluaW5nIGFsbCB0aGUgcmVzdWx0IGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIHRhc2sgY2FsbGJhY2tzLlxuICogSW52b2tlZCB3aXRoIChlcnIsIHJlc3VsdHMpLlxuICogQGV4YW1wbGVcbiAqIGFzeW5jLnBhcmFsbGVsKFtcbiAqICAgICBmdW5jdGlvbihjYWxsYmFjaykge1xuICogICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICogICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgJ29uZScpO1xuICogICAgICAgICB9LCAyMDApO1xuICogICAgIH0sXG4gKiAgICAgZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAqICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAqICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsICd0d28nKTtcbiAqICAgICAgICAgfSwgMTAwKTtcbiAqICAgICB9XG4gKiBdLFxuICogLy8gb3B0aW9uYWwgY2FsbGJhY2tcbiAqIGZ1bmN0aW9uKGVyciwgcmVzdWx0cykge1xuICogICAgIC8vIHRoZSByZXN1bHRzIGFycmF5IHdpbGwgZXF1YWwgWydvbmUnLCd0d28nXSBldmVuIHRob3VnaFxuICogICAgIC8vIHRoZSBzZWNvbmQgZnVuY3Rpb24gaGFkIGEgc2hvcnRlciB0aW1lb3V0LlxuICogfSk7XG4gKlxuICogLy8gYW4gZXhhbXBsZSB1c2luZyBhbiBvYmplY3QgaW5zdGVhZCBvZiBhbiBhcnJheVxuICogYXN5bmMucGFyYWxsZWwoe1xuICogICAgIG9uZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAqICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAqICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIDEpO1xuICogICAgICAgICB9LCAyMDApO1xuICogICAgIH0sXG4gKiAgICAgdHdvOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICogICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICogICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgMik7XG4gKiAgICAgICAgIH0sIDEwMCk7XG4gKiAgICAgfVxuICogfSwgZnVuY3Rpb24oZXJyLCByZXN1bHRzKSB7XG4gKiAgICAgLy8gcmVzdWx0cyBpcyBub3cgZXF1YWxzIHRvOiB7b25lOiAxLCB0d286IDJ9XG4gKiB9KTtcbiAqL1xuZnVuY3Rpb24gcGFyYWxsZWxMaW1pdCh0YXNrcywgY2FsbGJhY2spIHtcbiAgKDAsIF9wYXJhbGxlbDIuZGVmYXVsdCkoX2VhY2hPZjIuZGVmYXVsdCwgdGFza3MsIGNhbGxiYWNrKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2w7XG4iLCIvKipcbiAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2BcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gYXJncyBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGZ1bmNgLlxuICovXG5mdW5jdGlvbiBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXBwbHk7XG4iLCJ2YXIgYmFzZVRpbWVzID0gcmVxdWlyZSgnLi9fYmFzZVRpbWVzJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIHRoZSBhcnJheS1saWtlIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtib29sZWFufSBpbmhlcml0ZWQgU3BlY2lmeSByZXR1cm5pbmcgaW5oZXJpdGVkIHByb3BlcnR5IG5hbWVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYXJyYXlMaWtlS2V5cyh2YWx1ZSwgaW5oZXJpdGVkKSB7XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpLFxuICAgICAgaXNBcmcgPSAhaXNBcnIgJiYgaXNBcmd1bWVudHModmFsdWUpLFxuICAgICAgaXNCdWZmID0gIWlzQXJyICYmICFpc0FyZyAmJiBpc0J1ZmZlcih2YWx1ZSksXG4gICAgICBpc1R5cGUgPSAhaXNBcnIgJiYgIWlzQXJnICYmICFpc0J1ZmYgJiYgaXNUeXBlZEFycmF5KHZhbHVlKSxcbiAgICAgIHNraXBJbmRleGVzID0gaXNBcnIgfHwgaXNBcmcgfHwgaXNCdWZmIHx8IGlzVHlwZSxcbiAgICAgIHJlc3VsdCA9IHNraXBJbmRleGVzID8gYmFzZVRpbWVzKHZhbHVlLmxlbmd0aCwgU3RyaW5nKSA6IFtdLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAoKGluaGVyaXRlZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSAmJlxuICAgICAgICAhKHNraXBJbmRleGVzICYmIChcbiAgICAgICAgICAgLy8gU2FmYXJpIDkgaGFzIGVudW1lcmFibGUgYGFyZ3VtZW50cy5sZW5ndGhgIGluIHN0cmljdCBtb2RlLlxuICAgICAgICAgICBrZXkgPT0gJ2xlbmd0aCcgfHxcbiAgICAgICAgICAgLy8gTm9kZS5qcyAwLjEwIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIGJ1ZmZlcnMuXG4gICAgICAgICAgIChpc0J1ZmYgJiYgKGtleSA9PSAnb2Zmc2V0JyB8fCBrZXkgPT0gJ3BhcmVudCcpKSB8fFxuICAgICAgICAgICAvLyBQaGFudG9tSlMgMiBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiB0eXBlZCBhcnJheXMuXG4gICAgICAgICAgIChpc1R5cGUgJiYgKGtleSA9PSAnYnVmZmVyJyB8fCBrZXkgPT0gJ2J5dGVMZW5ndGgnIHx8IGtleSA9PSAnYnl0ZU9mZnNldCcpKSB8fFxuICAgICAgICAgICAvLyBTa2lwIGluZGV4IHByb3BlcnRpZXMuXG4gICAgICAgICAgIGlzSW5kZXgoa2V5LCBsZW5ndGgpXG4gICAgICAgICkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5TGlrZUtleXM7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgZ2V0UmF3VGFnID0gcmVxdWlyZSgnLi9fZ2V0UmF3VGFnJyksXG4gICAgb2JqZWN0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19vYmplY3RUb1N0cmluZycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0VGFnO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNBcmd1bWVudHM7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzVHlwZWRBcnJheTtcbiIsInZhciBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5cyA9IHJlcXVpcmUoJy4vX25hdGl2ZUtleXMnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VLZXlzO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVGltZXM7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVVuYXJ5O1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlR2xvYmFsO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgJiZcbiAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJbmRleDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcbiIsInZhciBvdmVyQXJnID0gcmVxdWlyZSgnLi9fb3ZlckFyZycpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlS2V5cztcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZVV0aWw7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUb1N0cmluZztcbiIsIi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJBcmc7XG4iLCJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUmVzdGAgd2hpY2ggdHJhbnNmb3JtcyB0aGUgcmVzdCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgcmVzdCBhcnJheSB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlclJlc3QoZnVuYywgc3RhcnQsIHRyYW5zZm9ybSkge1xuICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiBzdGFydCwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgYXJyYXlbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgaW5kZXggPSAtMTtcbiAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSB0cmFuc2Zvcm0oYXJyYXkpO1xuICAgIHJldHVybiBhcHBseShmdW5jLCB0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJSZXN0O1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBpdCByZWNlaXZlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqXG4gKiBjb25zb2xlLmxvZyhfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpZGVudGl0eTtcbiIsInZhciBiYXNlSXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL19iYXNlSXNBcmd1bWVudHMnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcmd1bWVudHMgPSBiYXNlSXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPyBiYXNlSXNBcmd1bWVudHMgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZTtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpLFxuICAgIHN0dWJGYWxzZSA9IHJlcXVpcmUoJy4vc3R1YkZhbHNlJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0J1ZmZlcjtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcbiIsInZhciBiYXNlSXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9fYmFzZUlzVHlwZWRBcnJheScpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIG5vZGVVdGlsID0gcmVxdWlyZSgnLi9fbm9kZVV0aWwnKTtcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNUeXBlZEFycmF5ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNUeXBlZEFycmF5O1xuIiwidmFyIGFycmF5TGlrZUtleXMgPSByZXF1aXJlKCcuL19hcnJheUxpa2VLZXlzJyksXG4gICAgYmFzZUtleXMgPSByZXF1aXJlKCcuL19iYXNlS2V5cycpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbmZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QpIDogYmFzZUtleXMob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzO1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGB1bmRlZmluZWRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi4zLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5ub29wKTtcbiAqIC8vID0+IFt1bmRlZmluZWQsIHVuZGVmaW5lZF1cbiAqL1xuZnVuY3Rpb24gbm9vcCgpIHtcbiAgLy8gTm8gb3BlcmF0aW9uIHBlcmZvcm1lZC5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBub29wO1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJGYWxzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgVGV4dHVyZTJEID0gcmVxdWlyZSgnLi9UZXh0dXJlMkQnKTtcbmNvbnN0IEltYWdlTG9hZGVyID0gcmVxdWlyZSgnLi4vdXRpbC9JbWFnZUxvYWRlcicpO1xuY29uc3QgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpO1xuXG5jb25zdCBNQUdfRklMVEVSUyA9IHtcblx0TkVBUkVTVDogdHJ1ZSxcblx0TElORUFSOiB0cnVlXG59O1xuY29uc3QgTUlOX0ZJTFRFUlMgPSB7XG5cdE5FQVJFU1Q6IHRydWUsXG5cdExJTkVBUjogdHJ1ZSxcblx0TkVBUkVTVF9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcblx0TElORUFSX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxuXHRORUFSRVNUX01JUE1BUF9MSU5FQVI6IHRydWUsXG5cdExJTkVBUl9NSVBNQVBfTElORUFSOiB0cnVlXG59O1xuY29uc3QgV1JBUF9NT0RFUyA9IHtcblx0UkVQRUFUOiB0cnVlLFxuXHRNSVJST1JFRF9SRVBFQVQ6IHRydWUsXG5cdENMQU1QX1RPX0VER0U6IHRydWVcbn07XG5jb25zdCBUWVBFUyA9IHtcblx0VU5TSUdORURfQllURTogdHJ1ZSxcblx0RkxPQVQ6IHRydWVcbn07XG5jb25zdCBGT1JNQVRTID0ge1xuXHRSR0I6IHRydWUsXG5cdFJHQkE6IHRydWVcbn07XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgdHlwZSBmb3IgY29sb3IgdGV4dHVyZXMuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtTdHJpbmd9XG4gKi9cbmNvbnN0IERFRkFVTFRfVFlQRSA9ICdVTlNJR05FRF9CWVRFJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBmb3JtYXQgZm9yIGNvbG9yIHRleHR1cmVzLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7U3RyaW5nfVxuICovXG5jb25zdCBERUZBVUxUX0ZPUk1BVCA9ICdSR0JBJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCB3cmFwIG1vZGUgZm9yIGNvbG9yIHRleHR1cmVzLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7U3RyaW5nfVxuICovXG5jb25zdCBERUZBVUxUX1dSQVAgPSAnUkVQRUFUJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBtaW4gLyBtYWcgZmlsdGVyIGZvciBjb2xvciB0ZXh0dXJlcy5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge1N0cmluZ31cbiAqL1xuY29uc3QgREVGQVVMVF9GSUxURVIgPSAnTElORUFSJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBhbHBoYSBwcmVtdWx0aXBseWluZyBpcyBlbmFibGVkLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgREVGQVVMVF9QUkVNVUxUSVBMWV9BTFBIQSA9IHRydWU7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgZm9yIHdoZXRoZXIgbWlwbWFwcGluZyBpcyBlbmFibGVkLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgREVGQVVMVF9NSVBNQVAgPSB0cnVlO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIGludmVydC15IGlzIGVuYWJsZWQuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtib29sZWFufVxuICovXG5jb25zdCBERUZBVUxUX0lOVkVSVF9ZID0gdHJ1ZTtcblxuLyoqXG4gKiBAY2xhc3MgQ29sb3JUZXh0dXJlMkRcbiAqIEBjbGFzc2Rlc2MgQSB0ZXh0dXJlIGNsYXNzIHRvIHJlcHJlc2VudCBhIDJEIGNvbG9yIHRleHR1cmUuXG4gKiBAYXVnbWVudHMgVGV4dHVyZTJEXG4gKi9cbmNsYXNzIENvbG9yVGV4dHVyZTJEIGV4dGVuZHMgVGV4dHVyZTJEIHtcblxuXHQvKipcblx0ICogSW5zdGFudGlhdGVzIGEgQ29sb3JUZXh0dXJlMkQgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSBzcGVjaWZpY2F0aW9uIGFyZ3VtZW50cy5cblx0ICogQHBhcmFtIHtBcnJheUJ1ZmZlcnxJbWFnZURhdGF8SFRNTEltYWdlRWxlbWVudHxIVE1MQ2FudmFzRWxlbWVudHxIVE1MVmlkZW9FbGVtZW50fSBzcGVjLmltYWdlIC0gVGhlIEhUTUxJbWFnZUVsZW1lbnQgdG8gYnVmZmVyLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy51cmwgLSBUaGUgSFRNTEltYWdlRWxlbWVudCBVUkwgdG8gbG9hZCBhbmQgYnVmZmVyLlxuXHQgKiBAcGFyYW0ge1VpbnQ4QXJyYXl8RmxvYXQzMkFycmF5fSBzcGVjLnNyYyAtIFRoZSBkYXRhIHRvIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtOdW1iZXJ9IHNwZWMud2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIHRleHR1cmUuXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBzcGVjLmhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIHRleHR1cmUuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXAgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIGJvdGggUyBhbmQgVCBkaW1lbnNpb24uXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXBTIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgUyBkaW1lbnNpb24uXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXBUIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgVCBkaW1lbnNpb24uXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmZpbHRlciAtIFRoZSBtaW4gLyBtYWcgZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLm1pbkZpbHRlciAtIFRoZSBtaW5pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLm1hZ0ZpbHRlciAtIFRoZSBtYWduaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKiBAcGFyYW0ge2Jvb2x9IHNwZWMubWlwTWFwIC0gV2hldGhlciBvciBub3QgbWlwLW1hcHBpbmcgaXMgZW5hYmxlZC5cblx0ICogQHBhcmFtIHtib29sfSBzcGVjLmludmVydFkgLSBXaGV0aGVyIG9yIG5vdCBpbnZlcnQteSBpcyBlbmFibGVkLlxuXHQgKiBAcGFyYW0ge2Jvb2x9IHNwZWMucHJlbXVsdGlwbHlBbHBoYSAtIFdoZXRoZXIgb3Igbm90IGFscGhhIHByZW11bHRpcGx5aW5nIGlzIGVuYWJsZWQuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmZvcm1hdCAtIFRoZSB0ZXh0dXJlIHBpeGVsIGZvcm1hdC5cblx0ICogQHBhcmFtIHtTdHJpbmd9IHNwZWMudHlwZSAtIFRoZSB0ZXh0dXJlIHBpeGVsIGNvbXBvbmVudCB0eXBlLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBiZSBleGVjdXRlZCBpZiB0aGUgZGF0YSBpcyBsb2FkZWQgYXN5bmNocm9ub3VzbHkgdmlhIGEgVVJMLlxuXHQgKi9cblx0Y29uc3RydWN0b3Ioc3BlYyA9IHt9LCBjYWxsYmFjayA9IG51bGwpIHtcblx0XHQvLyBnZXQgc3BlY2lmaWMgcGFyYW1zXG5cdFx0c3BlYy53cmFwUyA9IHNwZWMud3JhcFMgfHwgc3BlYy53cmFwO1xuXHRcdHNwZWMud3JhcFQgPSBzcGVjLndyYXBUIHx8IHNwZWMud3JhcDtcblx0XHRzcGVjLm1pbkZpbHRlciA9IHNwZWMubWluRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xuXHRcdHNwZWMubWFnRmlsdGVyID0gc3BlYy5tYWdGaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XG5cdFx0Ly8gc2V0IHRleHR1cmUgcGFyYW1zXG5cdFx0c3BlYy53cmFwUyA9IFdSQVBfTU9ERVNbc3BlYy53cmFwU10gPyBzcGVjLndyYXBTIDogREVGQVVMVF9XUkFQO1xuXHRcdHNwZWMud3JhcFQgPSBXUkFQX01PREVTW3NwZWMud3JhcFRdID8gc3BlYy53cmFwVCA6IERFRkFVTFRfV1JBUDtcblx0XHRzcGVjLm1pbkZpbHRlciA9IE1JTl9GSUxURVJTW3NwZWMubWluRmlsdGVyXSA/IHNwZWMubWluRmlsdGVyIDogREVGQVVMVF9GSUxURVI7XG5cdFx0c3BlYy5tYWdGaWx0ZXIgPSBNQUdfRklMVEVSU1tzcGVjLm1hZ0ZpbHRlcl0gPyBzcGVjLm1hZ0ZpbHRlciA6IERFRkFVTFRfRklMVEVSO1xuXHRcdC8vIHNldCBvdGhlciBwcm9wZXJ0aWVzXG5cdFx0c3BlYy5taXBNYXAgPSBzcGVjLm1pcE1hcCAhPT0gdW5kZWZpbmVkID8gc3BlYy5taXBNYXAgOiBERUZBVUxUX01JUE1BUDtcblx0XHRzcGVjLmludmVydFkgPSBzcGVjLmludmVydFkgIT09IHVuZGVmaW5lZCA/IHNwZWMuaW52ZXJ0WSA6IERFRkFVTFRfSU5WRVJUX1k7XG5cdFx0c3BlYy5wcmVtdWx0aXBseUFscGhhID0gc3BlYy5wcmVtdWx0aXBseUFscGhhICE9PSB1bmRlZmluZWQgPyBzcGVjLnByZW11bHRpcGx5QWxwaGEgOiBERUZBVUxUX1BSRU1VTFRJUExZX0FMUEhBO1xuXHRcdC8vIHNldCBmb3JtYXRcblx0XHRzcGVjLmZvcm1hdCA9IEZPUk1BVFNbc3BlYy5mb3JtYXRdID8gc3BlYy5mb3JtYXQgOiBERUZBVUxUX0ZPUk1BVDtcblx0XHQvLyBidWZmZXIgdGhlIHRleHR1cmUgYmFzZWQgb24gYXJndW1lbnQgdHlwZVxuXHRcdGlmICh0eXBlb2Ygc3BlYy5zcmMgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHQvLyByZXF1ZXN0IHNvdXJjZSBmcm9tIHVybFxuXHRcdFx0c3BlYy50eXBlID0gJ1VOU0lHTkVEX0JZVEUnO1xuXHRcdFx0Ly8gY2FsbCBiYXNlIGNvbnN0cnVjdG9yXG5cdFx0XHRzdXBlcihzcGVjKTtcblx0XHRcdC8vIFRPRE86IHB1dCBleHRlbnNpb24gaGFuZGxpbmcgZm9yIGFycmF5YnVmZmVyIC8gaW1hZ2UgLyB2aWRlbyBkaWZmZXJlbnRpYXRpb25cblx0XHRcdEltYWdlTG9hZGVyLmxvYWQoe1xuXHRcdFx0XHR1cmw6IHNwZWMuc3JjLFxuXHRcdFx0XHRzdWNjZXNzOiBpbWFnZSA9PiB7XG5cdFx0XHRcdFx0Ly8gc2V0IHRvIHVuc2lnbmVkIGJ5dGUgdHlwZVxuXHRcdFx0XHRcdGltYWdlID0gVXRpbC5yZXNpemVDYW52YXMoc3BlYywgaW1hZ2UpO1xuXHRcdFx0XHRcdC8vIG5vdyBidWZmZXJcblx0XHRcdFx0XHR0aGlzLmJ1ZmZlckRhdGEoaW1hZ2UsIHNwZWMud2lkdGgsIHNwZWMuaGVpZ2h0KTtcblx0XHRcdFx0XHR0aGlzLnNldFBhcmFtZXRlcnModGhpcyk7XG5cdFx0XHRcdFx0Ly8gZXhlY3V0ZSBjYWxsYmFja1xuXHRcdFx0XHRcdGlmIChjYWxsYmFjaykge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgdGhpcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvcjogZXJyID0+IHtcblx0XHRcdFx0XHRpZiAoY2FsbGJhY2spIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrKGVyciwgbnVsbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKFV0aWwuaXNDYW52YXNUeXBlKHNwZWMuc3JjKSkge1xuXHRcdFx0Ly8gaXMgaW1hZ2UgLyBjYW52YXMgLyB2aWRlbyB0eXBlXG5cdFx0XHQvLyBzZXQgdG8gdW5zaWduZWQgYnl0ZSB0eXBlXG5cdFx0XHRzcGVjLnR5cGUgPSAnVU5TSUdORURfQllURSc7XG5cdFx0XHRzcGVjLnNyYyA9IFV0aWwucmVzaXplQ2FudmFzKHNwZWMsIHNwZWMuc3JjKTtcblx0XHRcdC8vIGNhbGwgYmFzZSBjb25zdHJ1Y3RvclxuXHRcdFx0c3VwZXIoc3BlYyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIGFycmF5LCBhcnJheWJ1ZmZlciwgb3IgbnVsbFxuXHRcdFx0aWYgKHNwZWMuc3JjID09PSB1bmRlZmluZWQgfHwgc3BlYy5zcmMgPT09IG51bGwpIHtcblx0XHRcdFx0Ly8gaWYgbm8gZGF0YSBpcyBwcm92aWRlZCwgYXNzdW1lIHRoaXMgdGV4dHVyZSB3aWxsIGJlIHJlbmRlcmVkXG5cdFx0XHRcdC8vIHRvLiBJbiB0aGlzIGNhc2UgZGlzYWJsZSBtaXBtYXBwaW5nLCB0aGVyZSBpcyBubyBuZWVkIGFuZCBpdFxuXHRcdFx0XHQvLyB3aWxsIG9ubHkgaW50cm9kdWNlIHZlcnkgcGVjdWxpYXIgYW5kIGRpZmZpY3VsdCB0byBkaXNjZXJuXG5cdFx0XHRcdC8vIHJlbmRlcmluZyBwaGVub21lbmEgaW4gd2hpY2ggdGhlIHRleHR1cmUgJ3RyYW5zZm9ybXMnIGF0XG5cdFx0XHRcdC8vIGNlcnRhaW4gYW5nbGVzIC8gZGlzdGFuY2VzIHRvIHRoZSBtaXBtYXBwZWQgKGVtcHR5KSBwb3J0aW9ucy5cblx0XHRcdFx0c3BlYy5taXBNYXAgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdC8vIGJ1ZmZlciBmcm9tIGFyZ1xuXHRcdFx0c3BlYy50eXBlID0gVFlQRVNbc3BlYy50eXBlXSA/IHNwZWMudHlwZSA6IERFRkFVTFRfVFlQRTtcblx0XHRcdC8vIGNhbGwgYmFzZSBjb25zdHJ1Y3RvclxuXHRcdFx0c3VwZXIoc3BlYyk7XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sb3JUZXh0dXJlMkQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFRleHR1cmUyRCA9IHJlcXVpcmUoJy4vVGV4dHVyZTJEJyk7XG5cbmNvbnN0IE1BR19GSUxURVJTID0ge1xuXHRORUFSRVNUOiB0cnVlLFxuXHRMSU5FQVI6IHRydWVcbn07XG5jb25zdCBNSU5fRklMVEVSUyA9IHtcblx0TkVBUkVTVDogdHJ1ZSxcblx0TElORUFSOiB0cnVlXG59O1xuY29uc3QgV1JBUF9NT0RFUyA9IHtcblx0UkVQRUFUOiB0cnVlLFxuXHRDTEFNUF9UT19FREdFOiB0cnVlLFxuXHRNSVJST1JFRF9SRVBFQVQ6IHRydWVcbn07XG5jb25zdCBERVBUSF9UWVBFUyA9IHtcblx0VU5TSUdORURfQllURTogdHJ1ZSxcblx0VU5TSUdORURfU0hPUlQ6IHRydWUsXG5cdFVOU0lHTkVEX0lOVDogdHJ1ZVxufTtcbmNvbnN0IEZPUk1BVFMgPSB7XG5cdERFUFRIX0NPTVBPTkVOVDogdHJ1ZSxcblx0REVQVEhfU1RFTkNJTDogdHJ1ZVxufTtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCB0eXBlIGZvciBkZXB0aCB0ZXh0dXJlcy5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge1N0cmluZ31cbiAqL1xuY29uc3QgREVGQVVMVF9UWVBFID0gJ1VOU0lHTkVEX0lOVCc7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgZm9ybWF0IGZvciBkZXB0aCB0ZXh0dXJlcy5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge1N0cmluZ31cbiAqL1xuY29uc3QgREVGQVVMVF9GT1JNQVQgPSAnREVQVEhfQ09NUE9ORU5UJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCB3cmFwIG1vZGUgZm9yIGRlcHRoIHRleHR1cmVzLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7U3RyaW5nfVxuICovXG5jb25zdCBERUZBVUxUX1dSQVAgPSAnQ0xBTVBfVE9fRURHRSc7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgbWluIC8gbWFnIGZpbHRlciBmb3IgZGVwdGggdGV4dHVyZXMuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtTdHJpbmd9XG4gKi9cbmNvbnN0IERFRkFVTFRfRklMVEVSID0gJ0xJTkVBUic7XG5cbi8qKlxuICogQGNsYXNzIERlcHRoVGV4dHVyZTJEXG4gKiBAY2xhc3NkZXNjIEEgdGV4dHVyZSBjbGFzcyB0byByZXByZXNlbnQgYSAyRCBkZXB0aCB0ZXh0dXJlLlxuICogQGF1Z21lbnRzIFRleHR1cmUyRFxuICovXG5jbGFzcyBEZXB0aFRleHR1cmUyRCBleHRlbmRzIFRleHR1cmUyRCB7XG5cblx0LyoqXG5cdCAqIEluc3RhbnRpYXRlcyBhIERlcHRoVGV4dHVyZTJEIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgc3BlY2lmaWNhdGlvbiBhcmd1bWVudHMuXG5cdCAqIEBwYXJhbSB7VWludDhBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheX0gc3BlYy5zcmMgLSBUaGUgZGF0YSB0byBidWZmZXIuXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBzcGVjLndpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB0ZXh0dXJlLlxuXHQgKiBAcGFyYW0ge051bWJlcn0gc3BlYy5oZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB0ZXh0dXJlLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cblx0ICogQHBhcmFtIHtTdHJpbmd9IHNwZWMuZm9ybWF0IC0gVGhlIHRleHR1cmUgcGl4ZWwgZm9ybWF0LlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy50eXBlIC0gVGhlIHRleHR1cmUgcGl4ZWwgY29tcG9uZW50IHR5cGUuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihzcGVjID0ge30pIHtcblx0XHQvLyBnZXQgc3BlY2lmaWMgcGFyYW1zXG5cdFx0c3BlYy53cmFwUyA9IHNwZWMud3JhcFMgfHwgc3BlYy53cmFwO1xuXHRcdHNwZWMud3JhcFQgPSBzcGVjLndyYXBUIHx8IHNwZWMud3JhcDtcblx0XHRzcGVjLm1pbkZpbHRlciA9IHNwZWMubWluRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xuXHRcdHNwZWMubWFnRmlsdGVyID0gc3BlYy5tYWdGaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XG5cdFx0Ly8gc2V0IHRleHR1cmUgcGFyYW1zXG5cdFx0c3BlYy53cmFwUyA9IFdSQVBfTU9ERVNbc3BlYy53cmFwU10gPyBzcGVjLndyYXBTIDogREVGQVVMVF9XUkFQO1xuXHRcdHNwZWMud3JhcFQgPSBXUkFQX01PREVTW3NwZWMud3JhcFRdID8gc3BlYy53cmFwVCA6IERFRkFVTFRfV1JBUDtcblx0XHRzcGVjLm1pbkZpbHRlciA9IE1JTl9GSUxURVJTW3NwZWMubWluRmlsdGVyXSA/IHNwZWMubWluRmlsdGVyIDogREVGQVVMVF9GSUxURVI7XG5cdFx0c3BlYy5tYWdGaWx0ZXIgPSBNQUdfRklMVEVSU1tzcGVjLm1hZ0ZpbHRlcl0gPyBzcGVjLm1hZ0ZpbHRlciA6IERFRkFVTFRfRklMVEVSO1xuXHRcdC8vIHNldCBtaXAtbWFwcGluZyBhbmQgZm9ybWF0XG5cdFx0c3BlYy5taXBNYXAgPSBmYWxzZTsgLy8gZGlzYWJsZSBtaXAtbWFwcGluZ1xuXHRcdHNwZWMuaW52ZXJ0WSA9IGZhbHNlOyAvLyBubyBuZWVkIHRvIGludmVydC15XG5cdFx0c3BlYy5wcmVtdWx0aXBseUFscGhhID0gZmFsc2U7IC8vIG5vIGFscGhhIHRvIHByZS1tdWx0aXBseVxuXHRcdHNwZWMuZm9ybWF0ID0gRk9STUFUU1tzcGVjLmZvcm1hdF0gPyBzcGVjLmZvcm1hdCA6IERFRkFVTFRfRk9STUFUO1xuXHRcdC8vIGNoZWNrIGlmIHN0ZW5jaWwtZGVwdGgsIG9yIGp1c3QgZGVwdGhcblx0XHRpZiAoc3BlYy5mb3JtYXQgPT09ICdERVBUSF9TVEVOQ0lMJykge1xuXHRcdFx0c3BlYy50eXBlID0gJ1VOU0lHTkVEX0lOVF8yNF84X1dFQkdMJztcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3BlYy50eXBlID0gREVQVEhfVFlQRVNbc3BlYy50eXBlXSA/IHNwZWMudHlwZSA6IERFRkFVTFRfVFlQRTtcblx0XHR9XG5cdFx0Ly8gY2FsbCBiYXNlIGNvbnN0cnVjdG9yXG5cdFx0c3VwZXIoc3BlYyk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEZXB0aFRleHR1cmUyRDtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcblxuY29uc3QgVFlQRVMgPSB7XG5cdFVOU0lHTkVEX0JZVEU6IHRydWUsXG5cdFVOU0lHTkVEX1NIT1JUOiB0cnVlLFxuXHRVTlNJR05FRF9JTlQ6IHRydWVcbn07XG5jb25zdCBNT0RFUyA9IHtcblx0UE9JTlRTOiB0cnVlLFxuXHRMSU5FUzogdHJ1ZSxcblx0TElORV9TVFJJUDogdHJ1ZSxcblx0TElORV9MT09QOiB0cnVlLFxuXHRUUklBTkdMRVM6IHRydWUsXG5cdFRSSUFOR0xFX1NUUklQOiB0cnVlLFxuXHRUUklBTkdMRV9GQU46IHRydWVcbn07XG5jb25zdCBCWVRFU19QRVJfVFlQRSA9IHtcblx0VU5TSUdORURfQllURTogMSxcblx0VU5TSUdORURfU0hPUlQ6IDIsXG5cdFVOU0lHTkVEX0lOVDogNFxufTtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBjb21wb25lbnQgdHlwZS5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge1N0cmluZ31cbiAqL1xuY29uc3QgREVGQVVMVF9UWVBFID0gJ1VOU0lHTkVEX1NIT1JUJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCByZW5kZXIgbW9kZSAocHJpbWl0aXZlIHR5cGUpLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7U3RyaW5nfVxuICovXG5jb25zdCBERUZBVUxUX01PREUgPSAnVFJJQU5HTEVTJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBieXRlIG9mZnNldCB0byByZW5kZXIgZnJvbS5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge051bWJlcn1cbiAqL1xuY29uc3QgREVGQVVMVF9CWVRFX09GRlNFVCA9IDA7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgY291bnQgb2YgaW5kaWNlcyB0byByZW5kZXIuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtOdW1iZXJ9XG4gKi9cbmNvbnN0IERFRkFVTFRfQ09VTlQgPSAwO1xuXG4vKipcbiAqIEBjbGFzcyBJbmRleEJ1ZmZlclxuICogQGNsYXNzZGVzYyBBbiBpbmRleCBidWZmZXIgY2xhc3MgdG8gaG9sZSBpbmRleGluZyBpbmZvcm1hdGlvbi5cbiAqL1xuY2xhc3MgSW5kZXhCdWZmZXIge1xuXG5cdC8qKlxuXHQgKiBJbnN0YW50aWF0ZXMgYW4gSW5kZXhCdWZmZXIgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge1dlYkdMQnVmZmVyfFVpbnQ4QXJyYXl8VWludDE2QXJyYXl8VWluMzJBcnJheXxBcnJheXxOdW1iZXJ9IGFyZyAtIFRoZSBpbmRleCBkYXRhIHRvIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgcmVuZGVyaW5nIG9wdGlvbnMuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLm1vZGUgLSBUaGUgZHJhdyBtb2RlIC8gcHJpbWl0aXZlIHR5cGUuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmJ5dGVPZmZzZXQgLSBUaGUgYnl0ZSBvZmZzZXQgaW50byB0aGUgZHJhd24gYnVmZmVyLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5jb3VudCAtIFRoZSBudW1iZXIgb2YgdmVydGljZXMgdG8gZHJhdy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGFyZywgb3B0aW9ucyA9IHt9KSB7XG5cdFx0dGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcblx0XHR0aGlzLmJ1ZmZlciA9IG51bGw7XG5cdFx0dGhpcy50eXBlID0gVFlQRVNbb3B0aW9ucy50eXBlXSA/IG9wdGlvbnMudHlwZSA6IERFRkFVTFRfVFlQRTtcblx0XHR0aGlzLm1vZGUgPSBNT0RFU1tvcHRpb25zLm1vZGVdID8gb3B0aW9ucy5tb2RlIDogREVGQVVMVF9NT0RFO1xuXHRcdHRoaXMuY291bnQgPSAob3B0aW9ucy5jb3VudCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuY291bnQgOiBERUZBVUxUX0NPVU5UO1xuXHRcdHRoaXMuYnl0ZU9mZnNldCA9IChvcHRpb25zLmJ5dGVPZmZzZXQgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmJ5dGVPZmZzZXQgOiBERUZBVUxUX0JZVEVfT0ZGU0VUO1xuXHRcdGlmIChhcmcpIHtcblx0XHRcdGlmIChhcmcgaW5zdGFuY2VvZiBXZWJHTEJ1ZmZlcikge1xuXHRcdFx0XHQvLyBXZWJHTEJ1ZmZlciBhcmd1bWVudFxuXHRcdFx0XHR0aGlzLmJ1ZmZlciA9IGFyZztcblx0XHRcdH0gZWxzZSBpZiAoTnVtYmVyLmlzSW50ZWdlcihhcmcpKSB7XG5cdFx0XHRcdC8vIGJ5dGUgbGVuZ3RoIGFyZ3VtZW50XG5cdFx0XHRcdGlmIChvcHRpb25zLnR5cGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHRocm93ICdBcmd1bWVudCBvZiB0eXBlIGBudW1iZXJgIG11c3QgYmUgY29tcGxpbWVudGVkIHdpdGggYSBjb3JyZXNwb25kaW5nIGBvcHRpb25zLnR5cGVgJztcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmJ1ZmZlckRhdGEoYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcblx0XHRcdFx0Ly8gQXJyYXlCdWZmZXIgYXJnXG5cdFx0XHRcdGlmIChvcHRpb25zLnR5cGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHRocm93ICdBcmd1bWVudCBvZiB0eXBlIGBBcnJheUJ1ZmZlcmAgbXVzdCBiZSBjb21wbGltZW50ZWQgd2l0aCBhIGNvcnJlc3BvbmRpbmcgYG9wdGlvbnMudHlwZWAnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuYnVmZmVyRGF0YShhcmcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gQXJyYXkgb3IgQXJyYXlCdWZmZXJWaWV3IGFyZ3VtZW50XG5cdFx0XHRcdHRoaXMuYnVmZmVyRGF0YShhcmcpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAob3B0aW9ucy50eXBlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhyb3cgJ0VtcHR5IGJ1ZmZlciBtdXN0IGJlIGNvbXBsaW1lbnRlZCB3aXRoIGEgY29ycmVzcG9uZGluZyBgb3B0aW9ucy50eXBlYCc7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFVwbG9hZCBpbmRleCBkYXRhIHRvIHRoZSBHUFUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7QXJyYXl8QXJyYXlCdWZmZXJ8QXJyYXlCdWZmZXJWaWV3fG51bWJlcn0gYXJnIC0gVGhlIGFycmF5IG9mIGRhdGEgdG8gYnVmZmVyLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtJbmRleEJ1ZmZlcn0gVGhlIGluZGV4IGJ1ZmZlciBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdGJ1ZmZlckRhdGEoYXJnKSB7XG5cdFx0Y29uc3QgZ2wgPSB0aGlzLmdsO1xuXHRcdC8vIGNhc3QgYXJyYXkgdG8gQXJyYXlCdWZmZXJWaWV3IGJhc2VkIG9uIHByb3ZpZGVkIHR5cGVcblx0XHRpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG5cdFx0XHQvLyBjaGVjayBmb3IgdHlwZVxuXHRcdFx0aWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX0lOVCcpIHtcblx0XHRcdFx0Ly8gYnVmZmVyIHRvIHVpbnQzMlxuXHRcdFx0XHRhcmcgPSBuZXcgVWludDMyQXJyYXkoYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfU0hPUlQnKSB7XG5cdFx0XHRcdC8vIGJ1ZmZlciB0byB1aW50MTZcblx0XHRcdFx0YXJnID0gbmV3IFVpbnQxNkFycmF5KGFyZyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBidWZmZXIgdG8gdWludDhcblx0XHRcdFx0YXJnID0gbmV3IFVpbnQ4QXJyYXkoYXJnKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gc2V0IGVuc3VyZSB0eXBlIGNvcnJlc3BvbmRzIHRvIGRhdGFcblx0XHRcdGlmIChhcmcgaW5zdGFuY2VvZiBVaW50MzJBcnJheSkge1xuXHRcdFx0XHR0aGlzLnR5cGUgPSAnVU5TSUdORURfSU5UJztcblx0XHRcdH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgVWludDE2QXJyYXkpIHtcblx0XHRcdFx0dGhpcy50eXBlID0gJ1VOU0lHTkVEX1NIT1JUJztcblx0XHRcdH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuXHRcdFx0XHR0aGlzLnR5cGUgPSAnVU5TSUdORURfQllURSc7XG5cdFx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0XHQhKGFyZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSAmJlxuXHRcdFx0XHQhKE51bWJlci5pc0ludGVnZXIoYXJnKSlcblx0XHRcdFx0KSB7XG5cdFx0XHRcdHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgYEFycmF5QnVmZmVyVmlld2AsIG9yIGBudW1iZXJgJztcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gY2hlY2sgdGhhdCB0aGUgdHlwZSBpcyBzdXBwb3J0ZWQgYnkgZXh0ZW5zaW9uXG5cdFx0aWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX0lOVCcgJiZcblx0XHRcdCFXZWJHTENvbnRleHQuY2hlY2tFeHRlbnNpb24oJ09FU19lbGVtZW50X2luZGV4X3VpbnQnKSkge1xuXHRcdFx0dGhyb3cgJ0Nhbm5vdCBjcmVhdGUgSW5kZXhCdWZmZXIgb2YgdHlwZSBgVU5TSUdORURfSU5UYCBhcyBleHRlbnNpb24gYE9FU19lbGVtZW50X2luZGV4X3VpbnRgIGlzIG5vdCBzdXBwb3J0ZWQnO1xuXHRcdH1cblx0XHQvLyBkb24ndCBvdmVyd3JpdGUgdGhlIGNvdW50IGlmIGl0IGlzIGFscmVhZHkgc2V0XG5cdFx0aWYgKHRoaXMuY291bnQgPT09IERFRkFVTFRfQ09VTlQpIHtcblx0XHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKGFyZykpIHtcblx0XHRcdFx0dGhpcy5jb3VudCA9IChhcmcgLyBCWVRFU19QRVJfVFlQRVt0aGlzLnR5cGVdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuY291bnQgPSBhcmcubGVuZ3RoO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBjcmVhdGUgYnVmZmVyIGlmIGl0IGRvZXNuJ3QgZXhpc3QgYWxyZWFkeVxuXHRcdGlmICghdGhpcy5idWZmZXIpIHtcblx0XHRcdHRoaXMuYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cdFx0fVxuXHRcdC8vIGJ1ZmZlciB0aGUgZGF0YVxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVyKTtcblx0XHRnbC5idWZmZXJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBhcmcsIGdsLlNUQVRJQ19EUkFXKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBVcGxvYWQgcGFydGlhbCBpbmRleCBkYXRhIHRvIHRoZSBHUFUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7QXJyYXl8QXJyYXlCdWZmZXJ8QXJyYXlCdWZmZXJWaWV3fSBhcnJheSAtIFRoZSBhcnJheSBvZiBkYXRhIHRvIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtOdW1iZXJ9IGJ5dGVPZmZzZXQgLSBUaGUgYnl0ZSBvZmZzZXQgYXQgd2hpY2ggdG8gYnVmZmVyLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtJbmRleEJ1ZmZlcn0gVGhlIGluZGV4IGJ1ZmZlciBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdGJ1ZmZlclN1YkRhdGEoYXJyYXksIGJ5dGVPZmZzZXQgPSBERUZBVUxUX0JZVEVfT0ZGU0VUKSB7XG5cdFx0Y29uc3QgZ2wgPSB0aGlzLmdsO1xuXHRcdGlmICghdGhpcy5idWZmZXIpIHtcblx0XHRcdHRocm93ICdCdWZmZXIgaGFzIG5vdCB5ZXQgYmVlbiBhbGxvY2F0ZWQsIGFsbG9jYXRlIHdpdGggYGJ1ZmZlckRhdGFgJztcblx0XHR9XG5cdFx0Ly8gY2FzdCBhcnJheSB0byBBcnJheUJ1ZmZlclZpZXcgYmFzZWQgb24gcHJvdmlkZWQgdHlwZVxuXHRcdGlmIChBcnJheS5pc0FycmF5KGFycmF5KSkge1xuXHRcdFx0Ly8gY2hlY2sgZm9yIHR5cGVcblx0XHRcdGlmICh0aGlzLnR5cGUgPT09ICdVTlNJR05FRF9JTlQnKSB7XG5cdFx0XHRcdC8vIGJ1ZmZlciB0byB1aW50MzJcblx0XHRcdFx0YXJyYXkgPSBuZXcgVWludDMyQXJyYXkoYXJyYXkpO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdVTlNJR05FRF9TSE9SVCcpIHtcblx0XHRcdFx0Ly8gYnVmZmVyIHRvIHVpbnQxNlxuXHRcdFx0XHRhcnJheSA9IG5ldyBVaW50MTZBcnJheShhcnJheSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBidWZmZXIgdG8gdWludDhcblx0XHRcdFx0YXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChcblx0XHRcdCEoYXJyYXkgaW5zdGFuY2VvZiBVaW50OEFycmF5KSAmJlxuXHRcdFx0IShhcnJheSBpbnN0YW5jZW9mIFVpbnQxNkFycmF5KSAmJlxuXHRcdFx0IShhcnJheSBpbnN0YW5jZW9mIFVpbnQzMkFycmF5KSAmJlxuXHRcdFx0IShhcnJheSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSkge1xuXHRcdFx0dGhyb3cgJ0FyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBgQXJyYXlgLCBgQXJyYXlCdWZmZXJgLCBvciBgQXJyYXlCdWZmZXJWaWV3YCc7XG5cdFx0fVxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVyKTtcblx0XHRnbC5idWZmZXJTdWJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBieXRlT2Zmc2V0LCBhcnJheSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogRXhlY3V0ZSB0aGUgZHJhdyBjb21tYW5kIGZvciB0aGUgYm91bmQgYnVmZmVyLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIHBhc3MgdG8gJ2RyYXdFbGVtZW50cycuIE9wdGlvbmFsLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5tb2RlIC0gVGhlIGRyYXcgbW9kZSAvIHByaW1pdGl2ZSB0eXBlLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5ieXRlT2Zmc2V0IC0gVGhlIGJ5dGVPZmZzZXQgaW50byB0aGUgZHJhd24gYnVmZmVyLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5jb3VudCAtIFRoZSBudW1iZXIgb2YgdmVydGljZXMgdG8gZHJhdy5cblx0ICpcblx0ICogQHJldHVybiB7SW5kZXhCdWZmZXJ9IFRoZSBpbmRleCBidWZmZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRkcmF3KG9wdGlvbnMgPSB7fSkge1xuXHRcdGNvbnN0IGdsID0gdGhpcy5nbDtcblx0XHRjb25zdCBtb2RlID0gZ2xbb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZV07XG5cdFx0Y29uc3QgdHlwZSA9IGdsW3RoaXMudHlwZV07XG5cdFx0Y29uc3QgYnl0ZU9mZnNldCA9IChvcHRpb25zLmJ5dGVPZmZzZXQgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmJ5dGVPZmZzZXQgOiB0aGlzLmJ5dGVPZmZzZXQ7XG5cdFx0Y29uc3QgY291bnQgPSAob3B0aW9ucy5jb3VudCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuY291bnQgOiB0aGlzLmNvdW50O1xuXHRcdGlmIChjb3VudCA9PT0gMCkge1xuXHRcdFx0dGhyb3cgJ0F0dGVtcHRpbmcgdG8gZHJhdyB3aXRoIGEgY291bnQgb2YgMCc7XG5cdFx0fVxuXHRcdC8vIGJpbmQgYnVmZmVyXG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIpO1xuXHRcdC8vIGRyYXcgZWxlbWVudHNcblx0XHRnbC5kcmF3RWxlbWVudHMobW9kZSwgY291bnQsIHR5cGUsIGJ5dGVPZmZzZXQpO1xuXHRcdC8vIG5vIG5lZWQgdG8gdW5iaW5kXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbmRleEJ1ZmZlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcblxuY29uc3QgVEVYVFVSRV9UQVJHRVRTID0ge1xuXHRURVhUVVJFXzJEOiB0cnVlLFxuXHRURVhUVVJFX0NVQkVfTUFQOiB0cnVlXG59O1xuY29uc3QgREVQVEhfRk9STUFUUyA9IHtcblx0REVQVEhfQ09NUE9ORU5UOiB0cnVlLFxuXHRERVBUSF9TVEVOQ0lMOiB0cnVlXG59O1xuXG4vKipcbiAqIEBjbGFzcyBSZW5kZXJUYXJnZXRcbiAqIEBjbGFzc2Rlc2MgQSByZW5kZXJUYXJnZXQgY2xhc3MgdG8gYWxsb3cgcmVuZGVyaW5nIHRvIHRleHR1cmVzLlxuICovXG5jbGFzcyBSZW5kZXJUYXJnZXQge1xuXG5cdC8qKlxuXHQgKiBJbnN0YW50aWF0ZXMgYSBSZW5kZXJUYXJnZXQgb2JqZWN0LlxuXHQgKi9cblx0IGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XG5cdFx0dGhpcy5mcmFtZWJ1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcblx0XHR0aGlzLnRleHR1cmVzID0gbmV3IE1hcCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmRzIHRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRiaW5kKCkge1xuXHRcdC8vIGJpbmQgZnJhbWVidWZmZXJcblx0XHRjb25zdCBnbCA9IHRoaXMuZ2w7XG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCB0aGlzLmZyYW1lYnVmZmVyKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBVbmJpbmRzIHRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHR1bmJpbmQoKSB7XG5cdFx0Ly8gdW5iaW5kIGZyYW1lYnVmZmVyXG5cdFx0Y29uc3QgZ2wgPSB0aGlzLmdsO1xuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogQXR0YWNoZXMgdGhlIHByb3ZpZGVkIHRleHR1cmUgdG8gdGhlIHByb3ZpZGVkIGF0dGFjaG1lbnQgbG9jYXRpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSB7VGV4dHVyZTJEfSB0ZXh0dXJlIC0gVGhlIHRleHR1cmUgdG8gYXR0YWNoLlxuXHQgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggLSBUaGUgYXR0YWNobWVudCBpbmRleC4gKG9wdGlvbmFsKVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdGFyZ2V0IC0gVGhlIHRleHR1cmUgdGFyZ2V0IHR5cGUuIChvcHRpb25hbClcblx0ICpcblx0ICogQHJldHVybiB7UmVuZGVyVGFyZ2V0fSBUaGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0c2V0Q29sb3JUYXJnZXQodGV4dHVyZSwgaW5kZXgsIHRhcmdldCkge1xuXHRcdGNvbnN0IGdsID0gdGhpcy5nbDtcblx0XHRpZiAoIXRleHR1cmUpIHtcblx0XHRcdHRocm93ICdUZXh0dXJlIGFyZ3VtZW50IGlzIG1pc3NpbmcnO1xuXHRcdH1cblx0XHRpZiAoVEVYVFVSRV9UQVJHRVRTW2luZGV4XSAmJiB0YXJnZXQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGFyZ2V0ID0gaW5kZXg7XG5cdFx0XHRpbmRleCA9IDA7XG5cdFx0fVxuXHRcdGlmIChpbmRleCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRpbmRleCA9IDA7XG5cdFx0fSBlbHNlIGlmICghTnVtYmVyLmlzSW50ZWdlcihpbmRleCkgfHwgaW5kZXggPCAwKSB7XG5cdFx0XHR0aHJvdyAnVGV4dHVyZSBjb2xvciBhdHRhY2htZW50IGluZGV4IGlzIGludmFsaWQnO1xuXHRcdH1cblx0XHRpZiAodGFyZ2V0ICYmICFURVhUVVJFX1RBUkdFVFNbdGFyZ2V0XSkge1xuXHRcdFx0dGhyb3cgJ1RleHR1cmUgdGFyZ2V0IGlzIGludmFsaWQnO1xuXHRcdH1cblx0XHR0aGlzLnRleHR1cmVzLnNldChgY29sb3JfJHtpbmRleH1gLCB0ZXh0dXJlKTtcblx0XHR0aGlzLmJpbmQoKTtcblx0XHRnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChcblx0XHRcdGdsLkZSQU1FQlVGRkVSLFxuXHRcdFx0Z2xbJ0NPTE9SX0FUVEFDSE1FTlQnICsgaW5kZXhdLFxuXHRcdFx0Z2xbdGFyZ2V0IHx8ICdURVhUVVJFXzJEJ10sXG5cdFx0XHR0ZXh0dXJlLnRleHR1cmUsXG5cdFx0XHQwKTtcblx0XHR0aGlzLnVuYmluZCgpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEF0dGFjaGVzIHRoZSBwcm92aWRlZCB0ZXh0dXJlIHRvIHRoZSBwcm92aWRlZCBhdHRhY2htZW50IGxvY2F0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0ge1RleHR1cmUyRH0gdGV4dHVyZSAtIFRoZSB0ZXh0dXJlIHRvIGF0dGFjaC5cblx0ICpcblx0ICogQHJldHVybiB7UmVuZGVyVGFyZ2V0fSBUaGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0c2V0RGVwdGhUYXJnZXQodGV4dHVyZSkge1xuXHRcdGlmICghdGV4dHVyZSkge1xuXHRcdFx0dGhyb3cgJ1RleHR1cmUgYXJndW1lbnQgaXMgbWlzc2luZyc7XG5cdFx0fVxuXHRcdGlmICghREVQVEhfRk9STUFUU1t0ZXh0dXJlLmZvcm1hdF0pIHtcblx0XHRcdHRocm93ICdQcm92aWRlZCB0ZXh0dXJlIGlzIG5vdCBvZiBmb3JtYXQgYERFUFRIX0NPTVBPTkVOVGAgb3IgYERFUFRIX1NURU5DSUxgJztcblx0XHR9XG5cdFx0Y29uc3QgZ2wgPSB0aGlzLmdsO1xuXHRcdHRoaXMudGV4dHVyZXMuc2V0KCdkZXB0aCcsIHRleHR1cmUpO1xuXHRcdHRoaXMuYmluZCgpO1xuXHRcdGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKFxuXHRcdFx0Z2wuRlJBTUVCVUZGRVIsXG5cdFx0XHRnbC5ERVBUSF9BVFRBQ0hNRU5ULFxuXHRcdFx0Z2wuVEVYVFVSRV8yRCxcblx0XHRcdHRleHR1cmUudGV4dHVyZSxcblx0XHRcdDApO1xuXHRcdHRoaXMudW5iaW5kKCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogUmVzaXplcyB0aGUgcmVuZGVyVGFyZ2V0IGFuZCBhbGwgYXR0YWNoZWQgdGV4dHVyZXMgYnkgdGhlIHByb3ZpZGVkIGhlaWdodCBhbmQgd2lkdGguXG5cdCAqXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aCAtIFRoZSBuZXcgd2lkdGggb2YgdGhlIHJlbmRlclRhcmdldC5cblx0ICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodCAtIFRoZSBuZXcgaGVpZ2h0IG9mIHRoZSByZW5kZXJUYXJnZXQuXG5cdCAqXG5cdCAqIEByZXR1cm4ge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHJlc2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0aWYgKHR5cGVvZiB3aWR0aCAhPT0gJ251bWJlcicgfHwgKHdpZHRoIDw9IDApKSB7XG5cdFx0XHR0aHJvdyBgUHJvdmlkZWQgXFxgd2lkdGhcXGAgb2YgJHt3aWR0aH0gaXMgaW52YWxpZGA7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgaGVpZ2h0ICE9PSAnbnVtYmVyJyB8fCAoaGVpZ2h0IDw9IDApKSB7XG5cdFx0XHR0aHJvdyBgUHJvdmlkZWQgXFxgaGVpZ2h0XFxgIG9mICR7aGVpZ2h0fSBpcyBpbnZhbGlkYDtcblx0XHR9XG5cdFx0dGhpcy50ZXh0dXJlcy5mb3JFYWNoKHRleHR1cmUgPT4ge1xuXHRcdFx0dGV4dHVyZS5yZXNpemUod2lkdGgsIGhlaWdodCk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJUYXJnZXQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFZlcnRleFBhY2thZ2UgPSByZXF1aXJlKCcuL1ZlcnRleFBhY2thZ2UnKTtcbmNvbnN0IFZlcnRleEJ1ZmZlciA9IHJlcXVpcmUoJy4vVmVydGV4QnVmZmVyJyk7XG5jb25zdCBJbmRleEJ1ZmZlciA9IHJlcXVpcmUoJy4vSW5kZXhCdWZmZXInKTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGFsbCB2ZXJ0ZXggYnVmZmVycyBhbmQgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgY291bnRzXG4gKiBhcmUgbm90IGVxdWFsLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB2ZXJ0ZXhCdWZmZXJzIC0gVGhlIGFycmF5IG9mIHZlcnRleEJ1ZmZlcnMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrVmVydGV4QnVmZmVyQ291bnRzKHZlcnRleEJ1ZmZlcnMpIHtcblx0bGV0IGNvdW50ID0gbnVsbDtcblx0dmVydGV4QnVmZmVycy5mb3JFYWNoKGJ1ZmZlciA9PiB7XG5cdFx0aWYgKGNvdW50ID09PSBudWxsKSB7XG5cdFx0XHRjb3VudCA9IGJ1ZmZlci5jb3VudDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGNvdW50ICE9PSBidWZmZXIuY291bnQpIHtcblx0XHRcdFx0dGhyb3cgJ1ZlcnRleEJ1ZmZlcnMgbXVzdCBhbGwgaGF2ZSB0aGUgc2FtZSBjb3VudCB0byBiZSAnICtcblx0XHRcdFx0XHQncmVuZGVyZWQgd2l0aG91dCBhbiBJbmRleEJ1ZmZlciwgbWlzbWF0Y2ggb2YgJyArXG5cdFx0XHRcdFx0YCR7Y291bnR9IGFuZCAke2J1ZmZlci5jb3VudH0gZm91bmRgO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBhbGwgYXR0cmlidXRlIHBvaW50ZXJzIGFuZCB0aHJvd3MgYW4gZXhjZXB0aW9uIGlmIGFuIGluZGV4XG4gKiBvY2N1cnMgbW9yZSB0aGFuIG9uY2UuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHZlcnRleEJ1ZmZlcnMgLSBUaGUgYXJyYXkgb2YgdmVydGV4QnVmZmVycy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tJbmRleENvbGxpc2lvbnModmVydGV4QnVmZmVycykge1xuXHRjb25zdCBpbmRpY2VzID0gbmV3IE1hcCgpO1xuXHR2ZXJ0ZXhCdWZmZXJzLmZvckVhY2goYnVmZmVyID0+IHtcblx0XHRidWZmZXIucG9pbnRlcnMuZm9yRWFjaCgocG9pbnRlciwgaW5kZXgpID0+IHtcblx0XHRcdGNvbnN0IGNvdW50ID0gaW5kaWNlcy5nZXQoaW5kZXgpIHx8IDA7XG5cdFx0XHRpbmRpY2VzLnNldChpbmRleCwgY291bnQgKyAxKTtcblx0XHR9KTtcblx0fSk7XG5cdGluZGljZXMuZm9yRWFjaChpbmRleCA9PiB7XG5cdFx0aWYgKGluZGV4ID4gMSkge1xuXHRcdFx0dGhyb3cgYE1vcmUgdGhhbiBvbmUgYXR0cmlidXRlIHBvaW50ZXIgZXhpc3RzIGZvciBpbmRleCBcXGAke2luZGV4fVxcYGA7XG5cdFx0fVxuXHR9KTtcbn1cblxuLyoqXG4gKiBAY2xhc3MgUmVuZGVyYWJsZVxuICogQGNsYXNzZGVzYyBBIGNvbnRhaW5lciBmb3Igb25lIG9yIG1vcmUgVmVydGV4QnVmZmVycyBhbmQgYW4gb3B0aW9uYWwgSW5kZXhCdWZmZXIuXG4gKi9cbmNsYXNzIFJlbmRlcmFibGUge1xuXG5cdC8qKlxuXHQgKiBJbnN0YW50aWF0ZXMgYW4gUmVuZGVyYWJsZSBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHJlbmRlcmFibGUgc3BlY2lmaWNhdGlvbiBvYmplY3QuXG5cdCAqIEBwYXJhbSB7QXJyYXl8RmxvYXQzMkFycmF5fSBzcGVjLnZlcnRpY2VzIC0gVGhlIHZlcnRpY2VzIHRvIGludGVybGVhdmUgYW5kIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtWZXJ0ZXhCdWZmZXJ9IHNwZWMudmVydGV4QnVmZmVyIC0gQW4gZXhpc3RpbmcgdmVydGV4IGJ1ZmZlci5cblx0ICogQHBhcmFtIHtWZXJ0ZXhCdWZmZXJbXX0gc3BlYy52ZXJ0ZXhCdWZmZXJzIC0gTXVsdGlwbGUgZXhpc3RpbmcgdmVydGV4IGJ1ZmZlcnMuXG5cdCAqIEBwYXJhbSB7QXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl9IHNwZWMuaW5kaWNlcyAtIFRoZSBpbmRpY2VzIHRvIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtJbmRleEJ1ZmZlcn0gc3BlYy5pbmRleGJ1ZmZlciAtIEFuIGV4aXN0aW5nIGluZGV4IGJ1ZmZlci5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHNwZWMgPSB7fSkge1xuXHRcdGlmIChzcGVjLnZlcnRleEJ1ZmZlciB8fCBzcGVjLnZlcnRleEJ1ZmZlcnMpIHtcblx0XHRcdC8vIHVzZSBleGlzdGluZyB2ZXJ0ZXggYnVmZmVyXG5cdFx0XHR0aGlzLnZlcnRleEJ1ZmZlcnMgPSBzcGVjLnZlcnRleEJ1ZmZlcnMgfHwgW3NwZWMudmVydGV4QnVmZmVyXTtcblx0XHR9IGVsc2UgaWYgKHNwZWMudmVydGljZXMpIHtcblx0XHRcdC8vIGNyZWF0ZSB2ZXJ0ZXggcGFja2FnZVxuXHRcdFx0Y29uc3QgdmVydGV4UGFja2FnZSA9IG5ldyBWZXJ0ZXhQYWNrYWdlKHNwZWMudmVydGljZXMpO1xuXHRcdFx0Ly8gY3JlYXRlIHZlcnRleCBidWZmZXJcblx0XHRcdHRoaXMudmVydGV4QnVmZmVycyA9IFtcblx0XHRcdFx0bmV3IFZlcnRleEJ1ZmZlcih2ZXJ0ZXhQYWNrYWdlLmJ1ZmZlciwgdmVydGV4UGFja2FnZS5wb2ludGVycylcblx0XHRcdF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMudmVydGV4QnVmZmVycyA9IFtdO1xuXHRcdH1cblx0XHRpZiAoc3BlYy5pbmRleEJ1ZmZlcikge1xuXHRcdFx0Ly8gdXNlIGV4aXN0aW5nIGluZGV4IGJ1ZmZlclxuXHRcdFx0dGhpcy5pbmRleEJ1ZmZlciA9IHNwZWMuaW5kZXhCdWZmZXI7XG5cdFx0fSBlbHNlIGlmIChzcGVjLmluZGljZXMpIHtcblx0XHRcdC8vIGNyZWF0ZSBpbmRleCBidWZmZXJcblx0XHRcdHRoaXMuaW5kZXhCdWZmZXIgPSBuZXcgSW5kZXhCdWZmZXIoc3BlYy5pbmRpY2VzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5pbmRleEJ1ZmZlciA9IG51bGw7XG5cdFx0fVxuXHRcdC8vIGlmIHRoZXJlIGlzIG5vIGluZGV4IGJ1ZmZlciwgY2hlY2sgdGhhdCB2ZXJ0ZXggYnVmZmVycyBhbGwgaGF2ZVxuXHRcdC8vIHRoZSBzYW1lIGNvdW50XG5cdFx0aWYgKCF0aGlzLmluZGV4QnVmZmVyKSB7XG5cdFx0XHRjaGVja1ZlcnRleEJ1ZmZlckNvdW50cyh0aGlzLnZlcnRleEJ1ZmZlcnMpO1xuXHRcdH1cblx0XHQvLyBjaGVjayB0aGF0IG5vIGF0dHJpYnV0ZSBpbmRpY2VzIGNsYXNoXG5cdFx0Y2hlY2tJbmRleENvbGxpc2lvbnModGhpcy52ZXJ0ZXhCdWZmZXJzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBFeGVjdXRlIHRoZSBkcmF3IGNvbW1hbmQgZm9yIHRoZSB1bmRlcmx5aW5nIGJ1ZmZlcnMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gcGFzcyB0byAnZHJhd0VsZW1lbnRzJy4gT3B0aW9uYWwuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLm1vZGUgLSBUaGUgZHJhdyBtb2RlIC8gcHJpbWl0aXZlIHR5cGUuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmJ5dGVPZmZzZXQgLSBUaGUgYnl0ZU9mZnNldCBpbnRvIHRoZSBkcmF3biBidWZmZXIuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmluZGV4T2Zmc2V0IC0gVGhlIGluZGV4T2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuY291bnQgLSBUaGUgbnVtYmVyIG9mIHZlcnRpY2VzIHRvIGRyYXcuXG5cdCAqXG5cdCAqIEByZXR1cm4ge1JlbmRlcmFibGV9IC0gVGhlIHJlbmRlcmFibGUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRkcmF3KG9wdGlvbnMgPSB7fSkge1xuXHRcdC8vIGRyYXcgdGhlIHJlbmRlcmFibGVcblx0XHRpZiAodGhpcy5pbmRleEJ1ZmZlcikge1xuXHRcdFx0Ly8gdXNlIGluZGV4IGJ1ZmZlciB0byBkcmF3IGVsZW1lbnRzXG5cdFx0XHQvLyBiaW5kIHZlcnRleCBidWZmZXJzIGFuZCBlbmFibGUgYXR0cmlidXRlIHBvaW50ZXJzXG5cdFx0XHR0aGlzLnZlcnRleEJ1ZmZlcnMuZm9yRWFjaCh2ZXJ0ZXhCdWZmZXIgPT4ge1xuXHRcdFx0XHR2ZXJ0ZXhCdWZmZXIuYmluZCgpO1xuXHRcdFx0fSk7XG5cdFx0XHQvLyBkcmF3IHByaW1pdGl2ZXMgdXNpbmcgaW5kZXggYnVmZmVyXG5cdFx0XHR0aGlzLmluZGV4QnVmZmVyLmRyYXcob3B0aW9ucyk7XG5cdFx0XHQvLyBkaXNhYmxlIGF0dHJpYnV0ZSBwb2ludGVyc1xuXHRcdFx0dGhpcy52ZXJ0ZXhCdWZmZXJzLmZvckVhY2godmVydGV4QnVmZmVyID0+IHtcblx0XHRcdFx0dmVydGV4QnVmZmVyLnVuYmluZCgpO1xuXHRcdFx0fSk7XG5cdFx0XHQvLyBubyBhZHZhbnRhZ2UgdG8gdW5iaW5kaW5nIGFzIHRoZXJlIGlzIG5vIHN0YWNrIHVzZWRcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gbm8gaW5kZXggYnVmZmVyLCB1c2UgZHJhdyBhcnJheXNcblx0XHRcdC8vIHNldCBhbGwgYXR0cmlidXRlIHBvaW50ZXJzXG5cdFx0XHR0aGlzLnZlcnRleEJ1ZmZlcnMuZm9yRWFjaCh2ZXJ0ZXhCdWZmZXIgPT4ge1xuXHRcdFx0XHR2ZXJ0ZXhCdWZmZXIuYmluZCgpO1xuXHRcdFx0fSk7XG5cdFx0XHRpZiAodGhpcy52ZXJ0ZXhCdWZmZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Ly8gZHJhdyB0aGUgYnVmZmVyXG5cdFx0XHRcdHRoaXMudmVydGV4QnVmZmVyc1swXS5kcmF3KG9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gZGlzYWJsZSBhbGwgYXR0cmlidXRlIHBvaW50ZXJzXG5cdFx0XHR0aGlzLnZlcnRleEJ1ZmZlcnMuZm9yRWFjaCh2ZXJ0ZXhCdWZmZXIgPT4ge1xuXHRcdFx0XHR2ZXJ0ZXhCdWZmZXIudW5iaW5kKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJhYmxlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBwYXJhbGxlbCA9IHJlcXVpcmUoJ2FzeW5jL3BhcmFsbGVsJyk7XG5jb25zdCBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpO1xuY29uc3QgU2hhZGVyUGFyc2VyID0gcmVxdWlyZSgnLi9TaGFkZXJQYXJzZXInKTtcbmNvbnN0IFhIUkxvYWRlciA9IHJlcXVpcmUoJy4uL3V0aWwvWEhSTG9hZGVyJyk7XG5cbmNvbnN0IFVOSUZPUk1fRlVOQ1RJT05TID0ge1xuXHQnYm9vbCc6ICd1bmlmb3JtMWknLFxuXHQnYm9vbFtdJzogJ3VuaWZvcm0xaXYnLFxuXHQnZmxvYXQnOiAndW5pZm9ybTFmJyxcblx0J2Zsb2F0W10nOiAndW5pZm9ybTFmdicsXG5cdCdpbnQnOiAndW5pZm9ybTFpJyxcblx0J2ludFtdJzogJ3VuaWZvcm0xaXYnLFxuXHQndWludCc6ICd1bmlmb3JtMWknLFxuXHQndWludFtdJzogJ3VuaWZvcm0xaXYnLFxuXHQndmVjMic6ICd1bmlmb3JtMmZ2Jyxcblx0J3ZlYzJbXSc6ICd1bmlmb3JtMmZ2Jyxcblx0J2l2ZWMyJzogJ3VuaWZvcm0yaXYnLFxuXHQnaXZlYzJbXSc6ICd1bmlmb3JtMml2Jyxcblx0J3ZlYzMnOiAndW5pZm9ybTNmdicsXG5cdCd2ZWMzW10nOiAndW5pZm9ybTNmdicsXG5cdCdpdmVjMyc6ICd1bmlmb3JtM2l2Jyxcblx0J2l2ZWMzW10nOiAndW5pZm9ybTNpdicsXG5cdCd2ZWM0JzogJ3VuaWZvcm00ZnYnLFxuXHQndmVjNFtdJzogJ3VuaWZvcm00ZnYnLFxuXHQnaXZlYzQnOiAndW5pZm9ybTRpdicsXG5cdCdpdmVjNFtdJzogJ3VuaWZvcm00aXYnLFxuXHQnbWF0Mic6ICd1bmlmb3JtTWF0cml4MmZ2Jyxcblx0J21hdDJbXSc6ICd1bmlmb3JtTWF0cml4MmZ2Jyxcblx0J21hdDMnOiAndW5pZm9ybU1hdHJpeDNmdicsXG5cdCdtYXQzW10nOiAndW5pZm9ybU1hdHJpeDNmdicsXG5cdCdtYXQ0JzogJ3VuaWZvcm1NYXRyaXg0ZnYnLFxuXHQnbWF0NFtdJzogJ3VuaWZvcm1NYXRyaXg0ZnYnLFxuXHQnc2FtcGxlcjJEJzogJ3VuaWZvcm0xaScsXG5cdCdzYW1wbGVyQ3ViZSc6ICd1bmlmb3JtMWknXG59O1xuXG4vKipcbiAqIEdpdmVuIGEgbWFwIG9mIGV4aXN0aW5nIGF0dHJpYnV0ZXMsIGZpbmQgdGhlIGxvd2VzdCBpbmRleCB0aGF0IGlzIG5vdFxuICogYWxyZWFkeSB1c2VkLiBJZiB0aGUgYXR0cmlidXRlIG9yZGVyaW5nIHdhcyBhbHJlYWR5IHByb3ZpZGVkLCB1c2UgdGhhdFxuICogaW5zdGVhZC5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtNYXB9IGF0dHJpYnV0ZXMgLSBUaGUgZXhpc3RpbmcgYXR0cmlidXRlcyBtYXAuXG4gKiBAcGFyYW0ge09iamVjdH0gZGVjbGFyYXRpb24gLSBUaGUgYXR0cmlidXRlIGRlY2xhcmF0aW9uIG9iamVjdC5cbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBhdHRyaWJ1dGUgaW5kZXguXG4gKi9cbmZ1bmN0aW9uIGdldEF0dHJpYnV0ZUluZGV4KGF0dHJpYnV0ZXMsIGRlY2xhcmF0aW9uKSB7XG5cdC8vIGNoZWNrIGlmIGF0dHJpYnV0ZSBpcyBhbHJlYWR5IGRlY2xhcmVkLCBpZiBzbywgdXNlIHRoYXQgaW5kZXhcblx0aWYgKGF0dHJpYnV0ZXMuaGFzKGRlY2xhcmF0aW9uLm5hbWUpKSB7XG5cdFx0cmV0dXJuIGF0dHJpYnV0ZXMuZ2V0KGRlY2xhcmF0aW9uLm5hbWUpLmluZGV4O1xuXHR9XG5cdC8vIHJldHVybiBuZXh0IGF2YWlsYWJsZSBpbmRleFxuXHRyZXR1cm4gYXR0cmlidXRlcy5zaXplO1xufVxuXG4vKipcbiAqIEdpdmVuIHZlcnRleCBhbmQgZnJhZ21lbnQgc2hhZGVyIHNvdXJjZSwgcGFyc2VzIHRoZSBkZWNsYXJhdGlvbnMgYW5kIGFwcGVuZHMgaW5mb3JtYXRpb24gcGVydGFpbmluZyB0byB0aGUgdW5pZm9ybXMgYW5kIGF0dHJpYnR1ZXMgZGVjbGFyZWQuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7U2hhZGVyfSBzaGFkZXIgLSBUaGUgc2hhZGVyIG9iamVjdC5cbiAqIEBwYXJhbSB7U3RyaW5nfSB2ZXJ0U291cmNlIC0gVGhlIHZlcnRleCBzaGFkZXIgc291cmNlLlxuICogQHBhcmFtIHtTdHJpbmd9IGZyYWdTb3VyY2UgLSBUaGUgZnJhZ21lbnQgc2hhZGVyIHNvdXJjZS5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBhdHRyaWJ1dGUgYW5kIHVuaWZvcm0gaW5mb3JtYXRpb24uXG4gKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNBbmRVbmlmb3JtcyhzaGFkZXIsIHZlcnRTb3VyY2UsIGZyYWdTb3VyY2UpIHtcblx0Y29uc3QgZGVjbGFyYXRpb25zID0gU2hhZGVyUGFyc2VyLnBhcnNlRGVjbGFyYXRpb25zKFxuXHRcdFt2ZXJ0U291cmNlLCBmcmFnU291cmNlXSxcblx0XHRbJ3VuaWZvcm0nLCAnYXR0cmlidXRlJ10pO1xuXHQvLyBmb3IgZWFjaCBkZWNsYXJhdGlvbiBpbiB0aGUgc2hhZGVyXG5cdGRlY2xhcmF0aW9ucy5mb3JFYWNoKGRlY2xhcmF0aW9uID0+IHtcblx0XHQvLyBjaGVjayBpZiBpdHMgYW4gYXR0cmlidXRlIG9yIHVuaWZvcm1cblx0XHRpZiAoZGVjbGFyYXRpb24ucXVhbGlmaWVyID09PSAnYXR0cmlidXRlJykge1xuXHRcdFx0Ly8gaWYgYXR0cmlidXRlLCBzdG9yZSB0eXBlIGFuZCBpbmRleFxuXHRcdFx0Y29uc3QgaW5kZXggPSBnZXRBdHRyaWJ1dGVJbmRleChzaGFkZXIuYXR0cmlidXRlcywgZGVjbGFyYXRpb24pO1xuXHRcdFx0c2hhZGVyLmF0dHJpYnV0ZXMuc2V0KGRlY2xhcmF0aW9uLm5hbWUsIHtcblx0XHRcdFx0dHlwZTogZGVjbGFyYXRpb24udHlwZSxcblx0XHRcdFx0aW5kZXg6IGluZGV4XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgeyAvLyBpZiAoZGVjbGFyYXRpb24ucXVhbGlmaWVyID09PSAndW5pZm9ybScpIHtcblx0XHRcdC8vIGlmIHVuaWZvcm0sIHN0b3JlIHR5cGUgYW5kIGJ1ZmZlciBmdW5jdGlvbiBuYW1lXG5cdFx0XHRjb25zdCB0eXBlID0gZGVjbGFyYXRpb24udHlwZSArIChkZWNsYXJhdGlvbi5jb3VudCA+IDEgPyAnW10nIDogJycpO1xuXHRcdFx0c2hhZGVyLnVuaWZvcm1zLnNldChkZWNsYXJhdGlvbi5uYW1lLCB7XG5cdFx0XHRcdHR5cGU6IGRlY2xhcmF0aW9uLnR5cGUsXG5cdFx0XHRcdGZ1bmM6IFVOSUZPUk1fRlVOQ1RJT05TW3R5cGVdXG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG4vKipcbiAqIEdpdmVuIGEgc2hhZGVyIHNvdXJjZSBzdHJpbmcgYW5kIHNoYWRlciB0eXBlLCBjb21waWxlcyB0aGUgc2hhZGVyIGFuZCByZXR1cm5zIHRoZSByZXN1bHRpbmcgV2ViR0xTaGFkZXIgb2JqZWN0LlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge1dlYkdMUmVuZGVyaW5nQ29udGV4dH0gZ2wgLSBUaGUgd2ViZ2wgcmVuZGVyaW5nIGNvbnRleHQuXG4gKiBAcGFyYW0ge1N0cmluZ30gc2hhZGVyU291cmNlIC0gVGhlIHNoYWRlciBzb3VyY2UuXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSBzaGFkZXIgdHlwZS5cbiAqXG4gKiBAcmV0dXJuIHtXZWJHTFNoYWRlcn0gVGhlIGNvbXBpbGVkIHNoYWRlciBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGVTaGFkZXIoZ2wsIHNoYWRlclNvdXJjZSwgdHlwZSkge1xuXHRjb25zdCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2xbdHlwZV0pO1xuXHRnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzaGFkZXJTb3VyY2UpO1xuXHRnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XG5cdGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG5cdFx0dGhyb3cgJ0FuIGVycm9yIG9jY3VycmVkIGNvbXBpbGluZyB0aGUgc2hhZGVyczpcXG4nICsgZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpO1xuXHR9XG5cdHJldHVybiBzaGFkZXI7XG59XG5cbi8qKlxuICogQmluZHMgdGhlIGF0dHJpYnV0ZSBsb2NhdGlvbnMgZm9yIHRoZSBTaGFkZXIgb2JqZWN0LlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge1NoYWRlcn0gc2hhZGVyIC0gVGhlIFNoYWRlciBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGJpbmRBdHRyaWJ1dGVMb2NhdGlvbnMoc2hhZGVyKSB7XG5cdGNvbnN0IGdsID0gc2hhZGVyLmdsO1xuXHRzaGFkZXIuYXR0cmlidXRlcy5mb3JFYWNoKChhdHRyaWJ1dGUsIG5hbWUpID0+IHtcblx0XHQvLyBiaW5kIHRoZSBhdHRyaWJ1dGUgbG9jYXRpb25cblx0XHRnbC5iaW5kQXR0cmliTG9jYXRpb24oXG5cdFx0XHRzaGFkZXIucHJvZ3JhbSxcblx0XHRcdGF0dHJpYnV0ZS5pbmRleCxcblx0XHRcdG5hbWUpO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBRdWVyaWVzIHRoZSB3ZWJnbCByZW5kZXJpbmcgY29udGV4dCBmb3IgdGhlIHVuaWZvcm0gbG9jYXRpb25zLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge1NoYWRlcn0gc2hhZGVyIC0gVGhlIFNoYWRlciBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGdldFVuaWZvcm1Mb2NhdGlvbnMoc2hhZGVyKSB7XG5cdGNvbnN0IGdsID0gc2hhZGVyLmdsO1xuXHRjb25zdCB1bmlmb3JtcyA9IHNoYWRlci51bmlmb3Jtcztcblx0dW5pZm9ybXMuZm9yRWFjaCgodW5pZm9ybSwgbmFtZSkgPT4ge1xuXHRcdC8vIGdldCB0aGUgdW5pZm9ybSBsb2NhdGlvblxuXHRcdGNvbnN0IGxvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHNoYWRlci5wcm9ncmFtLCBuYW1lKTtcblx0XHQvLyBjaGVjayBpZiBudWxsLCBwYXJzZSBtYXkgZGV0ZWN0IHVuaWZvcm0gdGhhdCBpcyBjb21waWxlZCBvdXRcblx0XHQvLyBkdWUgdG8gYSBwcmVwcm9jZXNzb3IgZXZhbHVhdGlvbi5cblx0XHQvLyBUT0RPOiBmaXggcGFyc2VyIHNvIHRoYXQgaXQgZXZhbHVhdGVzIHRoZXNlIGNvcnJlY3RseS5cblx0XHRpZiAobG9jYXRpb24gPT09IG51bGwpIHtcblx0XHRcdHVuaWZvcm1zLmRlbGV0ZShuYW1lKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dW5pZm9ybS5sb2NhdGlvbiA9IGxvY2F0aW9uO1xuXHRcdH1cblx0fSk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIGxvYWQgc2hhZGVyIHNvdXJjZSBmcm9tIGEgdXJsLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gVGhlIHVybCB0byBsb2FkIHRoZSByZXNvdXJjZSBmcm9tLlxuICpcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gdG8gbG9hZCB0aGUgc2hhZGVyIHNvdXJjZS5cbiAqL1xuZnVuY3Rpb24gbG9hZFNoYWRlclNvdXJjZSh1cmwpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGRvbmUpIHtcblx0XHRYSFJMb2FkZXIubG9hZCh7XG5cdFx0XHR1cmw6IHVybCxcblx0XHRcdHJlc3BvbnNlVHlwZTogJ3RleHQnLFxuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRcdGRvbmUobnVsbCwgcmVzKTtcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oZXJyKSB7XG5cdFx0XHRcdGRvbmUoZXJyLCBudWxsKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gcGFzcyB0aHJvdWdoIHRoZSBzaGFkZXIgc291cmNlLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc291cmNlIC0gVGhlIHNvdXJjZSBvZiB0aGUgc2hhZGVyLlxuICpcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gdG8gcGFzcyB0aHJvdWdoIHRoZSBzaGFkZXIgc291cmNlLlxuICovXG5mdW5jdGlvbiBwYXNzVGhyb3VnaFNvdXJjZShzb3VyY2UpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGRvbmUpIHtcblx0XHRkb25lKG51bGwsIHNvdXJjZSk7XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYW4gYXJyYXkgb2YgR0xTTCBzb3VyY2Ugc3RyaW5ncyBhbmQgVVJMcywgYW5kIHJlc29sdmVzIHRoZW0gaW50byBhbmQgYXJyYXkgb2YgR0xTTCBzb3VyY2UuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZXMgLSBUaGUgc2hhZGVyIHNvdXJjZXMuXG4gKlxuICogQHJldHVybiB7RnVuY3Rpb259IEEgZnVuY3Rpb24gdG8gcmVzb2x2ZSB0aGUgc2hhZGVyIHNvdXJjZXMuXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmVTb3VyY2VzKHNvdXJjZXMpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGRvbmUpIHtcblx0XHRjb25zdCB0YXNrcyA9IFtdO1xuXHRcdHNvdXJjZXMgPSBzb3VyY2VzIHx8IFtdO1xuXHRcdHNvdXJjZXMgPSAhQXJyYXkuaXNBcnJheShzb3VyY2VzKSA/IFtzb3VyY2VzXSA6IHNvdXJjZXM7XG5cdFx0c291cmNlcy5mb3JFYWNoKHNvdXJjZSA9PiB7XG5cdFx0XHRpZiAoU2hhZGVyUGFyc2VyLmlzR0xTTChzb3VyY2UpKSB7XG5cdFx0XHRcdHRhc2tzLnB1c2gocGFzc1Rocm91Z2hTb3VyY2Uoc291cmNlKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0YXNrcy5wdXNoKGxvYWRTaGFkZXJTb3VyY2Uoc291cmNlKSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cGFyYWxsZWwodGFza3MsIGRvbmUpO1xuXHR9O1xufVxuXG4vKipcbiAqIEluamVjdHMgdGhlIGRlZmluZXMgaW50byB0aGUgc2hhZGVyIHNvdXJjZS5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtBcnJheX0gc291cmNlcyAtIFRoZSBzaGFkZXIgc291cmNlcy5cbiAqXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBzaGFkZXIgc291cmNlcy5cbiAqL1xuY29uc3QgY3JlYXRlRGVmaW5lcyA9IGZ1bmN0aW9uKGRlZmluZXMpIHtcblx0Y29uc3QgcmVzID0gW107XG5cdGZvciAobGV0IG5hbWUgaW4gZGVmaW5lcykge1xuXHRcdGlmKGRlZmluZXMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcblx0XHRcdHJlcy5wdXNoKGAjZGVmaW5lICR7bmFtZX0gJHtkZWZpbmVzW25hbWVdfWApO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzLmpvaW4oJ1xcbicpO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIHRoZSBzaGFkZXIgcHJvZ3JhbSBvYmplY3QgZnJvbSBzb3VyY2Ugc3RyaW5ncy4gVGhpcyBpbmNsdWRlczpcbiAqXHQxKSBDb21waWxpbmcgYW5kIGxpbmtpbmcgdGhlIHNoYWRlciBwcm9ncmFtLlxuICpcdDIpIFBhcnNpbmcgc2hhZGVyIHNvdXJjZSBmb3IgYXR0cmlidXRlIGFuZCB1bmlmb3JtIGluZm9ybWF0aW9uLlxuICpcdDMpIEJpbmRpbmcgYXR0cmlidXRlIGxvY2F0aW9ucywgYnkgb3JkZXIgb2YgZGVsY2FyYXRpb24uXG4gKlx0NCkgUXVlcnlpbmcgYW5kIHN0b3JpbmcgdW5pZm9ybSBsb2NhdGlvbi5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtTaGFkZXJ9IHNoYWRlciAtIFRoZSBTaGFkZXIgb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZXMgLSBBIG1hcCBjb250YWluaW5nIHNvdXJjZXMgdW5kZXIgJ3ZlcnQnIGFuZCAnZnJhZycgYXR0cmlidXRlcy5cbiAqXG4gKiBAcmV0dXJuIHtTaGFkZXJ9IFRoZSBzaGFkZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVByb2dyYW0oc2hhZGVyLCBzb3VyY2VzKSB7XG5cdGNvbnN0IGdsID0gc2hhZGVyLmdsO1xuXHRjb25zdCBkZWZpbmVzID0gY3JlYXRlRGVmaW5lcyhzb3VyY2VzLmRlZmluZSk7XG5cdGNvbnN0IGNvbW1vbiA9IGRlZmluZXMgKyAoc291cmNlcy5jb21tb24gfHwgJycpO1xuXHRjb25zdCB2ZXJ0ID0gc291cmNlcy52ZXJ0LmpvaW4oJycpO1xuXHRjb25zdCBmcmFnID0gc291cmNlcy5mcmFnLmpvaW4oJycpO1xuXHQvLyBjb21waWxlIHNoYWRlcnNcblx0Y29uc3QgdmVydGV4U2hhZGVyID0gY29tcGlsZVNoYWRlcihnbCwgY29tbW9uICsgdmVydCwgJ1ZFUlRFWF9TSEFERVInKTtcblx0Y29uc3QgZnJhZ21lbnRTaGFkZXIgPSBjb21waWxlU2hhZGVyKGdsLCBjb21tb24gKyBmcmFnLCAnRlJBR01FTlRfU0hBREVSJyk7XG5cdC8vIHBhcnNlIHNvdXJjZSBmb3IgYXR0cmlidXRlIGFuZCB1bmlmb3Jtc1xuXHRzZXRBdHRyaWJ1dGVzQW5kVW5pZm9ybXMoc2hhZGVyLCB2ZXJ0LCBmcmFnKTtcblx0Ly8gY3JlYXRlIHRoZSBzaGFkZXIgcHJvZ3JhbVxuXHRzaGFkZXIucHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcblx0Ly8gYXR0YWNoIHZlcnRleCBhbmQgZnJhZ21lbnQgc2hhZGVyc1xuXHRnbC5hdHRhY2hTaGFkZXIoc2hhZGVyLnByb2dyYW0sIHZlcnRleFNoYWRlcik7XG5cdGdsLmF0dGFjaFNoYWRlcihzaGFkZXIucHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpO1xuXHQvLyBiaW5kIHZlcnRleCBhdHRyaWJ1dGUgbG9jYXRpb25zIEJFRk9SRSBsaW5raW5nXG5cdGJpbmRBdHRyaWJ1dGVMb2NhdGlvbnMoc2hhZGVyKTtcblx0Ly8gbGluayBzaGFkZXJcblx0Z2wubGlua1Byb2dyYW0oc2hhZGVyLnByb2dyYW0pO1xuXHQvLyBJZiBjcmVhdGluZyB0aGUgc2hhZGVyIHByb2dyYW0gZmFpbGVkLCBhbGVydFxuXHRpZiAoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIoc2hhZGVyLnByb2dyYW0sIGdsLkxJTktfU1RBVFVTKSkge1xuXHRcdHRocm93ICdBbiBlcnJvciBvY2N1cmVkIGxpbmtpbmcgdGhlIHNoYWRlcjpcXG4nICsgZ2wuZ2V0UHJvZ3JhbUluZm9Mb2coc2hhZGVyLnByb2dyYW0pO1xuXHR9XG5cdC8vIGdldCBzaGFkZXIgdW5pZm9ybSBsb2NhdGlvbnNcblx0Z2V0VW5pZm9ybUxvY2F0aW9ucyhzaGFkZXIpO1xufVxuXG4vKipcbiAqIEBjbGFzcyBTaGFkZXJcbiAqIEBjbGFzc2Rlc2MgQSBzaGFkZXIgY2xhc3MgdG8gYXNzaXN0IGluIGNvbXBpbGluZyBhbmQgbGlua2luZyB3ZWJnbCBzaGFkZXJzLCBzdG9yaW5nIGF0dHJpYnV0ZSBhbmQgdW5pZm9ybSBsb2NhdGlvbnMsIGFuZCBidWZmZXJpbmcgdW5pZm9ybXMuXG4gKi9cbmNsYXNzIFNoYWRlciB7XG5cblx0LyoqXG5cdCAqIEluc3RhbnRpYXRlcyBhIFNoYWRlciBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHNoYWRlciBzcGVjaWZpY2F0aW9uIG9iamVjdC5cblx0ICogQHBhcmFtIHtTdHJpbmd8U3RyaW5nW118T2JqZWN0fSBzcGVjLmNvbW1vbiAtIFNvdXJjZXMgLyBVUkxzIHRvIGJlIHNoYXJlZCBieSBib3RoIHZlcnRleCBhbmQgZnJhZ21lbnQgc2hhZGVycy5cblx0ICogQHBhcmFtIHtTdHJpbmd8U3RyaW5nW118T2JqZWN0fSBzcGVjLnZlcnQgLSBUaGUgdmVydGV4IHNoYWRlciBzb3VyY2VzIC8gVVJMcy5cblx0ICogQHBhcmFtIHtTdHJpbmd8U3RyaW5nW118T2JqZWN0fSBzcGVjLmZyYWcgLSBUaGUgZnJhZ21lbnQgc2hhZGVyIHNvdXJjZXMgLyBVUkxzLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc3BlYy5kZWZpbmUgLSBBbnkgYCNkZWZpbmVgIGRlZmluaXRpb25zIHRvIGJlIGluamVjdGVkIGludG8gdGhlIGdsc2wuXG5cdCAqIEBwYXJhbSB7U3RyaW5nW119IHNwZWMuYXR0cmlidXRlcyAtIFRoZSBhdHRyaWJ1dGUgaW5kZXggb3JkZXJpbmdzLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlIG9uY2UgdGhlIHNoYWRlciBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgY29tcGlsZWQgYW5kIGxpbmtlZC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHNwZWMgPSB7fSwgY2FsbGJhY2sgPSBudWxsKSB7XG5cdFx0Ly8gY2hlY2sgc291cmNlIGFyZ3VtZW50c1xuXHRcdGlmICghc3BlYy52ZXJ0KSB7XG5cdFx0XHR0aHJvdyAnVmVydGV4IHNoYWRlciBhcmd1bWVudCBgdmVydGAgaGFzIG5vdCBiZWVuIHByb3ZpZGVkJztcblx0XHR9XG5cdFx0aWYgKCFzcGVjLmZyYWcpIHtcblx0XHRcdHRocm93ICdGcmFnbWVudCBzaGFkZXIgYXJndW1lbnQgYGZyYWdgIGhhcyBub3QgYmVlbiBwcm92aWRlZCc7XG5cdFx0fVxuXHRcdHRoaXMucHJvZ3JhbSA9IDA7XG5cdFx0dGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcblx0XHR0aGlzLnZlcnNpb24gPSBzcGVjLnZlcnNpb24gfHwgJzEuMDAnO1xuXHRcdHRoaXMuYXR0cmlidXRlcyA9IG5ldyBNYXAoKTtcblx0XHR0aGlzLnVuaWZvcm1zID0gbmV3IE1hcCgpO1xuXHRcdC8vIGlmIGF0dHJpYnV0ZSBvcmRlcmluZyBpcyBwcm92aWRlZCwgdXNlIHRob3NlIGluZGljZXNcblx0XHRpZiAoc3BlYy5hdHRyaWJ1dGVzKSB7XG5cdFx0XHRzcGVjLmF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0ciwgaW5kZXgpID0+IHtcblx0XHRcdFx0dGhpcy5hdHRyaWJ1dGVzLnNldChhdHRyLCB7XG5cdFx0XHRcdFx0aW5kZXg6IGluZGV4XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8vIGNyZWF0ZSB0aGUgc2hhZGVyXG5cdFx0cGFyYWxsZWwoe1xuXHRcdFx0Y29tbW9uOiByZXNvbHZlU291cmNlcyhzcGVjLmNvbW1vbiksXG5cdFx0XHR2ZXJ0OiByZXNvbHZlU291cmNlcyhzcGVjLnZlcnQpLFxuXHRcdFx0ZnJhZzogcmVzb2x2ZVNvdXJjZXMoc3BlYy5mcmFnKSxcblx0XHR9LCAoZXJyLCBzb3VyY2VzKSA9PiB7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdGlmIChjYWxsYmFjaykge1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2soZXJyLCBudWxsKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvLyBvbmNlIGFsbCBzaGFkZXIgc291cmNlcyBhcmUgbG9hZGVkXG5cdFx0XHRjcmVhdGVQcm9ncmFtKHRoaXMsIHNvdXJjZXMpO1xuXHRcdFx0aWYgKGNhbGxiYWNrKSB7XG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdGNhbGxiYWNrKG51bGwsIHRoaXMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBCaW5kcyB0aGUgc2hhZGVyIHByb2dyYW0gZm9yIHVzZS5cblx0ICpcblx0ICogQHJldHVybiB7U2hhZGVyfSBUaGUgc2hhZGVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0dXNlKCkge1xuXHRcdC8vIHVzZSB0aGUgc2hhZGVyXG5cdFx0dGhpcy5nbC51c2VQcm9ncmFtKHRoaXMucHJvZ3JhbSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogQnVmZmVyIGEgdW5pZm9ybSB2YWx1ZSBieSBuYW1lLlxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSB1bmlmb3JtIG5hbWUgaW4gdGhlIHNoYWRlciBzb3VyY2UuXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgLSBUaGUgdW5pZm9ybSB2YWx1ZSB0byBidWZmZXIuXG5cdCAqXG5cdCAqIEByZXR1cm4ge1NoYWRlcn0gLSBUaGUgc2hhZGVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0c2V0VW5pZm9ybShuYW1lLCB2YWx1ZSkge1xuXHRcdGNvbnN0IHVuaWZvcm0gPSB0aGlzLnVuaWZvcm1zLmdldChuYW1lKTtcblx0XHQvLyBlbnN1cmUgdGhhdCB0aGUgdW5pZm9ybSBzcGVjIGV4aXN0cyBmb3IgdGhlIG5hbWVcblx0XHRpZiAoIXVuaWZvcm0pIHtcblx0XHRcdHRocm93IGBObyB1bmlmb3JtIGZvdW5kIHVuZGVyIG5hbWUgXFxgJHtuYW1lfVxcYGA7XG5cdFx0fVxuXHRcdC8vIGNoZWNrIHZhbHVlXG5cdFx0aWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcblx0XHRcdC8vIGVuc3VyZSB0aGF0IHRoZSB1bmlmb3JtIGFyZ3VtZW50IGlzIGRlZmluZWRcblx0XHRcdHRocm93IGBWYWx1ZSBwYXNzZWQgZm9yIHVuaWZvcm0gXFxgJHtuYW1lfVxcYCBpcyB1bmRlZmluZWQgb3IgbnVsbGA7XG5cdFx0fVxuXHRcdC8vIHNldCB0aGUgdW5pZm9ybVxuXHRcdC8vIE5PVEU6IGNoZWNraW5nIHR5cGUgYnkgc3RyaW5nIGNvbXBhcmlzb24gaXMgZmFzdGVyIHRoYW4gd3JhcHBpbmdcblx0XHQvLyB0aGUgZnVuY3Rpb25zLlxuXHRcdGlmICh1bmlmb3JtLnR5cGUgPT09ICdtYXQyJyB8fCB1bmlmb3JtLnR5cGUgPT09ICdtYXQzJyB8fCB1bmlmb3JtLnR5cGUgPT09ICdtYXQ0Jykge1xuXHRcdFx0dGhpcy5nbFt1bmlmb3JtLmZ1bmNdKHVuaWZvcm0ubG9jYXRpb24sIGZhbHNlLCB2YWx1ZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuZ2xbdW5pZm9ybS5mdW5jXSh1bmlmb3JtLmxvY2F0aW9uLCB2YWx1ZSk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJ1ZmZlciBhIG1hcCBvZiB1bmlmb3JtIHZhbHVlcy5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHVuaWZvcm1zIC0gVGhlIG1hcCBvZiB1bmlmb3JtcyBrZXllZCBieSBuYW1lLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtTaGFkZXJ9IFRoZSBzaGFkZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRzZXRVbmlmb3JtcyhhcmdzKSB7XG5cdFx0T2JqZWN0LmtleXMoYXJncykuZm9yRWFjaChuYW1lID0+IHtcblx0XHRcdHRoaXMuc2V0VW5pZm9ybShuYW1lLCBhcmdzW25hbWVdKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYWRlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgU2hhZGVyUHJlcHJvY2Vzc29yID0gcmVxdWlyZSgnLi9TaGFkZXJQcmVwcm9jZXNzb3InKTtcblxuY29uc3QgQ09NTUVOVFNfUkVHRVhQID0gLyhcXC9cXCooW1xcc1xcU10qPylcXCpcXC8pfChcXC9cXC8oLiopJCkvZ207XG5jb25zdCBFTkRMSU5FX1JFR0VYUCA9IC8oXFxyXFxufFxcbnxcXHIpL2dtO1xuY29uc3QgV0hJVEVTUEFDRV9SRUdFWFAgPSAvXFxzezIsfS9nO1xuY29uc3QgQlJBQ0tFVF9XSElURVNQQUNFX1JFR0VYUCA9IC8oXFxzKikoXFxbKShcXHMqKShcXGQrKShcXHMqKShcXF0pKFxccyopL2c7XG5jb25zdCBOQU1FX0NPVU5UX1JFR0VYUCA9IC8oW2EtekEtWl9dW2EtekEtWjAtOV9dKikoPzpcXFsoXFxkKylcXF0pPy87XG5jb25zdCBQUkVDSVNJT05fUkVHRVggPSAvXFxicHJlY2lzaW9uXFxzK1xcdytcXHMrXFx3KzsvZztcbmNvbnN0IElOTElORV9QUkVDSVNJT05fUkVHRVggPSAvXFxiKGhpZ2hwfG1lZGl1bXB8bG93cClcXHMrL2c7XG5jb25zdCBHTFNMX1JFR0VYUCA9IC92b2lkXFxzK21haW5cXHMqXFwoXFxzKih2b2lkKSpcXHMqXFwpXFxzKi9taTtcblxuLyoqXG4gKiBSZW1vdmVzIHN0YW5kYXJkIGNvbW1lbnRzIGZyb20gdGhlIHByb3ZpZGVkIHN0cmluZy5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gc3RyaXAgY29tbWVudHMgZnJvbS5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBjb21tZW50bGVzcyBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIHN0cmlwQ29tbWVudHMoc3RyKSB7XG5cdC8vIHJlZ2V4IHNvdXJjZTogaHR0cHM6Ly9naXRodWIuY29tL21vYWdyaXVzL3N0cmlwY29tbWVudHNcblx0cmV0dXJuIHN0ci5yZXBsYWNlKENPTU1FTlRTX1JFR0VYUCwgJycpO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYW4gcHJlY2lzaW9uIHN0YXRlbWVudHMuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgLSBUaGUgdW5wcm9jZXNzZWQgc291cmNlIGNvZGUuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfSBUaGUgcHJvY2Vzc2VkIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiBzdHJpcFByZWNpc2lvbihzdHIpIHtcblx0cmV0dXJuIHN0clxuXHRcdC5yZXBsYWNlKFBSRUNJU0lPTl9SRUdFWCwgJycpIC8vIHJlbW92ZSBnbG9iYWwgcHJlY2lzaW9uIGRlY2xhcmF0aW9uc1xuXHRcdC5yZXBsYWNlKElOTElORV9QUkVDSVNJT05fUkVHRVgsICcnKTsgLy8gcmVtb3ZlIGlubGluZSBwcmVjaXNpb24gZGVjbGFyYXRpb25zXG59XG5cbi8qKlxuICogQ29udmVydHMgYWxsIHdoaXRlc3BhY2UgaW50byBhIHNpbmdsZSAnICcgc3BhY2UgY2hhcmFjdGVyLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB0byBub3JtYWxpemUgd2hpdGVzcGFjZSBmcm9tLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gVGhlIG5vcm1hbGl6ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBub3JtYWxpemVXaGl0ZXNwYWNlKHN0cikge1xuXHRyZXR1cm4gc3RyXG5cdFx0LnJlcGxhY2UoRU5ETElORV9SRUdFWFAsICcgJykgLy8gcmVtb3ZlIGxpbmUgZW5kaW5nc1xuXHRcdC5yZXBsYWNlKFdISVRFU1BBQ0VfUkVHRVhQLCAnICcpIC8vIG5vcm1hbGl6ZSB3aGl0ZXNwYWNlIHRvIHNpbmdsZSAnICdcblx0XHQucmVwbGFjZShCUkFDS0VUX1dISVRFU1BBQ0VfUkVHRVhQLCAnJDIkNCQ2Jyk7IC8vIHJlbW92ZSB3aGl0ZXNwYWNlIGluIGJyYWNrZXRzXG59XG5cbi8qKlxuICogUGFyc2VzIHRoZSBuYW1lIGFuZCBjb3VudCBvdXQgb2YgYSBuYW1lIHN0YXRlbWVudCwgcmV0dXJuaW5nIHRoZSBkZWNsYXJhdGlvbiBvYmplY3QuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBxdWFsaWZpZXIgLSBUaGUgcXVhbGlmaWVyIHN0cmluZy5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgc3RyaW5nLlxuICogQHBhcmFtIHtTdHJpbmd9IGVudHJ5IC0gVGhlIHZhcmlhYmxlIGRlY2xhcmF0aW9uIHN0cmluZy5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBkZWNsYXJhdGlvbiBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlTmFtZUFuZENvdW50KHF1YWxpZmllciwgdHlwZSwgZW50cnkpIHtcblx0Ly8gZGV0ZXJtaW5lIG5hbWUgYW5kIHNpemUgb2YgdmFyaWFibGVcblx0Y29uc3QgbWF0Y2hlcyA9IGVudHJ5Lm1hdGNoKE5BTUVfQ09VTlRfUkVHRVhQKTtcblx0Y29uc3QgbmFtZSA9IG1hdGNoZXNbMV07XG5cdGNvbnN0IGNvdW50ID0gKG1hdGNoZXNbMl0gPT09IHVuZGVmaW5lZCkgPyAxIDogcGFyc2VJbnQobWF0Y2hlc1syXSwgMTApO1xuXHRyZXR1cm4ge1xuXHRcdHF1YWxpZmllcjogcXVhbGlmaWVyLFxuXHRcdHR5cGU6IHR5cGUsXG5cdFx0bmFtZTogbmFtZSxcblx0XHRjb3VudDogY291bnRcblx0fTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgYSBzaW5nbGUgJ3N0YXRlbWVudCcuIEEgJ3N0YXRlbWVudCcgaXMgY29uc2lkZXJlZCBhbnkgc2VxdWVuY2Ugb2ZcbiAqIGNoYXJhY3RlcnMgZm9sbG93ZWQgYnkgYSBzZW1pLWNvbG9uLiBUaGVyZWZvcmUsIGEgc2luZ2xlICdzdGF0ZW1lbnQnIGluXG4gKiB0aGlzIHNlbnNlIGNvdWxkIGNvbnRhaW4gc2V2ZXJhbCBjb21tYSBzZXBhcmF0ZWQgZGVjbGFyYXRpb25zLiBSZXR1cm5zXG4gKiBhbGwgcmVzdWx0aW5nIGRlY2xhcmF0aW9ucy5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0YXRlbWVudCAtIFRoZSBzdGF0ZW1lbnQgdG8gcGFyc2UuXG4gKlxuICogQHJldHVybiB7QXJyYXl9IFRoZSBhcnJheSBvZiBwYXJzZWQgZGVjbGFyYXRpb24gb2JqZWN0cy5cbiAqL1xuZnVuY3Rpb24gcGFyc2VTdGF0ZW1lbnQoc3RhdGVtZW50KSB7XG5cdC8vIHNwbGl0IHN0YXRlbWVudCBvbiBjb21tYXNcblx0Ly9cblx0Ly8gWyd1bmlmb3JtIG1hdDQgQVsxMF0nLCAnQicsICdDWzJdJ11cblx0Ly9cblx0Y29uc3Qgc3BsaXQgPSBzdGF0ZW1lbnQuc3BsaXQoJywnKS5tYXAoZWxlbSA9PiB7XG5cdFx0cmV0dXJuIGVsZW0udHJpbSgpO1xuXHR9KTtcblxuXHQvLyBzcGxpdCBkZWNsYXJhdGlvbiBoZWFkZXIgZnJvbSBzdGF0ZW1lbnRcblx0Ly9cblx0Ly8gWyd1bmlmb3JtJywgJ21hdDQnLCAnQVsxMF0nXVxuXHQvL1xuXHRjb25zdCBoZWFkZXIgPSBzcGxpdC5zaGlmdCgpLnNwbGl0KCcgJyk7XG5cblx0Ly8gcXVhbGlmaWVyIGlzIGFsd2F5cyBmaXJzdCBlbGVtZW50XG5cdC8vXG5cdC8vICd1bmlmb3JtJ1xuXHQvL1xuXHRjb25zdCBxdWFsaWZpZXIgPSBoZWFkZXIuc2hpZnQoKTtcblxuXHQvLyB0eXBlIHdpbGwgYmUgdGhlIHNlY29uZCBlbGVtZW50XG5cdC8vXG5cdC8vICdtYXQ0J1xuXHQvL1xuXHRjb25zdCB0eXBlID0gaGVhZGVyLnNoaWZ0KCk7XG5cblx0Ly8gbGFzdCBwYXJ0IG9mIGhlYWRlciB3aWxsIGJlIHRoZSBmaXJzdCwgYW5kIHBvc3NpYmxlIG9ubHkgdmFyaWFibGUgbmFtZVxuXHQvL1xuXHQvLyBbJ0FbMTBdJywgJ0InLCAnQ1syXSddXG5cdC8vXG5cdGNvbnN0IG5hbWVzID0gaGVhZGVyLmNvbmNhdChzcGxpdCk7XG5cblx0Ly8gaWYgdGhlcmUgYXJlIG90aGVyIG5hbWVzIGFmdGVyIGEgJywnIGFkZCB0aGVtIGFzIHdlbGxcblx0cmV0dXJuIG5hbWVzLm1hcChuYW1lID0+IHtcblx0XHRyZXR1cm4gcGFyc2VOYW1lQW5kQ291bnQocXVhbGlmaWVyLCB0eXBlLCBuYW1lKTtcblx0fSk7XG59XG5cbi8qKlxuICogU3BsaXRzIHRoZSBzb3VyY2Ugc3RyaW5nIGJ5IHNlbWktY29sb25zIGFuZCBjb25zdHJ1Y3RzIGFuIGFycmF5IG9mXG4gKiBkZWNsYXJhdGlvbiBvYmplY3RzIGJhc2VkIG9uIHRoZSBwcm92aWRlZCBxdWFsaWZpZXIga2V5d29yZHMuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2UgLSBUaGUgc2hhZGVyIHNvdXJjZSBzdHJpbmcuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0ga2V5d29yZHMgLSBUaGUgcXVhbGlmaWVyIGRlY2xhcmF0aW9uIGtleXdvcmRzLlxuICpcbiAqIEByZXR1cm4ge0FycmF5fSBUaGUgYXJyYXkgb2YgcXVhbGlmaWVyIGRlY2xhcmF0aW9uIG9iamVjdHMuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlU291cmNlKHNvdXJjZSwga2V5d29yZHMpIHtcblx0Ly8gZ2V0IGluZGl2aWR1YWwgc3RhdGVtZW50cyAoYW55IHNlcXVlbmNlIGVuZGluZyBpbiA7KVxuXHRjb25zdCBzdGF0ZW1lbnRzID0gc291cmNlLnNwbGl0KCc7Jyk7XG5cdC8vIGJ1aWxkIHJlZ2V4IGZvciBwYXJzaW5nIHN0YXRlbWVudHMgd2l0aCB0YXJnZXR0ZWQga2V5d29yZHNcblx0Y29uc3Qga2V5d29yZFN0ciA9IGtleXdvcmRzLmpvaW4oJ3wnKTtcblx0Y29uc3Qga2V5d29yZFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXFxcXGIoJyArIGtleXdvcmRTdHIgKyAnKVxcXFxiLionKTtcblx0Ly8gcGFyc2UgYW5kIHN0b3JlIGdsb2JhbCBwcmVjaXNpb24gc3RhdGVtZW50cyBhbmQgYW55IGRlY2xhcmF0aW9uc1xuXHRsZXQgbWF0Y2hlZCA9IFtdO1xuXHQvLyBmb3IgZWFjaCBzdGF0ZW1lbnRcblx0c3RhdGVtZW50cy5mb3JFYWNoKHN0YXRlbWVudCA9PiB7XG5cdFx0Ly8gY2hlY2sgZm9yIGtleXdvcmRzXG5cdFx0Ly9cblx0XHQvLyBbJ3VuaWZvcm0gZmxvYXQgdVRpbWUnXVxuXHRcdC8vXG5cdFx0Y29uc3Qga21hdGNoID0gc3RhdGVtZW50Lm1hdGNoKGtleXdvcmRSZWdleCk7XG5cdFx0aWYgKGttYXRjaCkge1xuXHRcdFx0Ly8gcGFyc2Ugc3RhdGVtZW50IGFuZCBhZGQgdG8gYXJyYXlcblx0XHRcdG1hdGNoZWQgPSBtYXRjaGVkLmNvbmNhdChwYXJzZVN0YXRlbWVudChrbWF0Y2hbMF0pKTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gbWF0Y2hlZDtcbn1cblxuLyoqXG4gKiBGaWx0ZXJzIG91dCBkdXBsaWNhdGUgZGVjbGFyYXRpb25zIHByZXNlbnQgYmV0d2VlbiBzaGFkZXJzLiBDdXJyZW50bHlcbiAqIGp1c3QgcmVtb3ZlcyBhbGwgIyBzdGF0ZW1lbnRzLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBkZWNsYXJhdGlvbnMgLSBUaGUgYXJyYXkgb2YgZGVjbGFyYXRpb25zLlxuICpcbiAqIEByZXR1cm4ge0FycmF5fSBUaGUgZmlsdGVyZWQgYXJyYXkgb2YgZGVjbGFyYXRpb25zLlxuICovXG5mdW5jdGlvbiBmaWx0ZXJEdXBsaWNhdGVzQnlOYW1lKGRlY2xhcmF0aW9ucykge1xuXHQvLyBpbiBjYXNlcyB3aGVyZSB0aGUgc2FtZSBkZWNsYXJhdGlvbnMgYXJlIHByZXNlbnQgaW4gbXVsdGlwbGVcblx0Ly8gc291cmNlcywgdGhpcyBmdW5jdGlvbiB3aWxsIHJlbW92ZSBkdXBsaWNhdGVzIGZyb20gdGhlIHJlc3VsdHNcblx0Y29uc3Qgc2VlbiA9IHt9O1xuXHRyZXR1cm4gZGVjbGFyYXRpb25zLmZpbHRlcihkZWNsYXJhdGlvbiA9PiB7XG5cdFx0aWYgKHNlZW5bZGVjbGFyYXRpb24ubmFtZV0pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0c2VlbltkZWNsYXJhdGlvbi5uYW1lXSA9IHRydWU7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0pO1xufVxuXG4vKipcbiAqIFJ1bnMgdGhlIHByZXByb2Nlc3NvciBvbiB0aGUgZ2xzbCBjb2RlLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc291cmNlIC0gVGhlIHVucHJvY2Vzc2VkIHNvdXJjZSBjb2RlLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gVGhlIHByb2Nlc3NlZCBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gcHJlcHJvY2Vzcyhzb3VyY2UpIHtcblx0cmV0dXJuIFNoYWRlclByZXByb2Nlc3Nvci5wcmVwcm9jZXNzKHNvdXJjZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gIHtcblxuXHQvKipcblx0ICogUGFyc2VzIHRoZSBwcm92aWRlZCBHTFNMIHNvdXJjZSwgYW5kIHJldHVybnMgYWxsIGRlY2xhcmF0aW9uIHN0YXRlbWVudHMgdGhhdCBjb250YWluIHRoZSBwcm92aWRlZCBxdWFsaWZpZXIgdHlwZS4gVGhpcyBjYW4gYmUgdXNlZCB0byBleHRyYWN0IGFsbCBhdHRyaWJ1dGVzIGFuZCB1bmlmb3JtIG5hbWVzIGFuZCB0eXBlcyBmcm9tIGEgc2hhZGVyLlxuXHQgKlxuXHQgKiBGb3IgZXhhbXBsZSwgd2hlbiBwcm92aWRlZCBhICd1bmlmb3JtJyBxdWFsaWZpZXJzLCB0aGUgZGVjbGFyYXRpb246XG5cdCAqXG5cdCAqXHQgJ3VuaWZvcm0gaGlnaHAgdmVjMyB1U3BlY3VsYXJDb2xvcjsnXG5cdCAqXG5cdCAqIFdvdWxkIGJlIHBhcnNlZCB0bzpcblx0ICpcdCB7XG5cdCAqXHRcdCBxdWFsaWZpZXI6ICd1bmlmb3JtJyxcblx0ICpcdFx0IHR5cGU6ICd2ZWMzJyxcblx0ICpcdFx0IG5hbWU6ICd1U3BlY3VsYXJDb2xvcicsXG5cdCAqXHRcdCBjb3VudDogMVxuXHQgKlx0IH1cblx0ICogQHBhcmFtIHtBcnJheX0gc291cmNlcyAtIFRoZSBzaGFkZXIgc291cmNlcy5cblx0ICogQHBhcmFtIHtBcnJheX0gcXVhbGlmaWVycyAtIFRoZSBxdWFsaWZpZXJzIHRvIGV4dHJhY3QuXG5cdCAqXG5cdCAqIEByZXR1cm4ge0FycmF5fSBUaGUgYXJyYXkgb2YgcXVhbGlmaWVyIGRlY2xhcmF0aW9uIHN0YXRlbWVudHMuXG5cdCAqL1xuXHRwYXJzZURlY2xhcmF0aW9uczogZnVuY3Rpb24oc291cmNlcyA9IFtdLCBxdWFsaWZpZXJzID0gW10pIHtcblx0XHQvLyBpZiBubyBzb3VyY2VzIG9yIHF1YWxpZmllcnMgYXJlIHByb3ZpZGVkLCByZXR1cm4gZW1wdHkgYXJyYXlcblx0XHRpZiAoc291cmNlcy5sZW5ndGggPT09IDAgfHwgcXVhbGlmaWVycy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cdFx0c291cmNlcyA9IEFycmF5LmlzQXJyYXkoc291cmNlcykgPyBzb3VyY2VzIDogW3NvdXJjZXNdO1xuXHRcdHF1YWxpZmllcnMgPSBBcnJheS5pc0FycmF5KHF1YWxpZmllcnMpID8gcXVhbGlmaWVycyA6IFtxdWFsaWZpZXJzXTtcblx0XHQvLyBwYXJzZSBvdXQgdGFyZ2V0dGVkIGRlY2xhcmF0aW9uc1xuXHRcdGxldCBkZWNsYXJhdGlvbnMgPSBbXTtcblx0XHRzb3VyY2VzLmZvckVhY2goc291cmNlID0+IHtcblx0XHRcdC8vIHJlbW92ZSBjb21tZW50c1xuXHRcdFx0c291cmNlID0gc3RyaXBDb21tZW50cyhzb3VyY2UpO1xuXHRcdFx0Ly8gcnVuIHByZXByb2Nlc3NvclxuXHRcdFx0c291cmNlID0gcHJlcHJvY2Vzcyhzb3VyY2UpO1xuXHRcdFx0Ly8gcmVtb3ZlIHByZWNpc2lvbiBzdGF0ZW1lbnRzXG5cdFx0XHRzb3VyY2UgPSBzdHJpcFByZWNpc2lvbihzb3VyY2UpO1xuXHRcdFx0Ly8gZmluYWxseSwgbm9ybWFsaXplIHRoZSB3aGl0ZXNwYWNlXG5cdFx0XHRzb3VyY2UgPSBub3JtYWxpemVXaGl0ZXNwYWNlKHNvdXJjZSk7XG5cdFx0XHQvLyBwYXJzZSBvdXQgZGVjbGFyYXRpb25zXG5cdFx0XHRkZWNsYXJhdGlvbnMgPSBkZWNsYXJhdGlvbnMuY29uY2F0KHBhcnNlU291cmNlKHNvdXJjZSwgcXVhbGlmaWVycykpO1xuXHRcdH0pO1xuXHRcdC8vIHJlbW92ZSBkdXBsaWNhdGVzIGFuZCByZXR1cm5cblx0XHRyZXR1cm4gZmlsdGVyRHVwbGljYXRlc0J5TmFtZShkZWNsYXJhdGlvbnMpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBEZXRlY3RzIGJhc2VkIG9uIHRoZSBleGlzdGVuY2Ugb2YgYSAndm9pZCBtYWluKCkgeycgc3RhdGVtZW50LCBpZiB0aGUgc3RyaW5nIGlzIGdsc2wgc291cmNlIGNvZGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgLSBUaGUgaW5wdXQgc3RyaW5nIHRvIHRlc3QuXG5cdCAqXG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBzdHJpbmcgaXMgZ2xzbCBjb2RlLlxuXHQgKi9cblx0aXNHTFNMOiBmdW5jdGlvbihzdHIpIHtcblx0XHRyZXR1cm4gR0xTTF9SRUdFWFAudGVzdChzdHIpO1xuXHR9XG5cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IERFRklORUQgPSAnX19ERUZJTkVEX18nO1xuXG5jb25zdCBERUZJTkVfUkVHRVggPSAvI2RlZmluZVxcYi9pO1xuY29uc3QgVU5ERUZfUkVHRVggPSAvI3VuZGVmXFxiL2k7XG5jb25zdCBJRl9SRUdFWCA9IC8jaWZcXGIvaTtcbmNvbnN0IElGREVGX1JFR0VYID0gLyNpZmRlZlxcYi9pO1xuY29uc3QgSUZOREVGX1JFR0VYID0gLyNpZm5kZWZcXGIvaTtcbmNvbnN0IEVMU0VfUkVHRVggPSAvI2Vsc2VcXGIvaTtcbmNvbnN0IEVMSUZfUkVHRVggPSAvI2VsaWZcXGIvaTtcbmNvbnN0IEVORElGX1JFR0VYID0gLyNlbmRpZlxcYi9pO1xuXG5jb25zdCBQQVJTRV9ERUZJTkVfUkVHRVggPSAvI2RlZmluZVxccysoXFx3KykoXFxzKFxcdyopPyk/L2k7XG5jb25zdCBQQVJTRV9VTkRFRl9SRUdFWCA9IC8jdW5kZWZcXHMrKFxcdyspL2k7XG5jb25zdCBQQVJTRV9JRl9SRUdFWCA9IC8jaWZcXHMrXFwoP1xccyooIT9cXHMqXFx3KylcXHMqKD09fCE9fD49fDw9fDx8PHw+KT9cXHMqKFxcdyopXFxzKlxcKT8vaTtcbmNvbnN0IFBBUlNFX0lGREVGX1JFR0VYID0gLyNpZmRlZlxccysoXFx3KykvaTtcbmNvbnN0IFBBUlNFX0lGTkRFRl9SRUdFWCA9IC8jaWZuZGVmXFxzKyhcXHcrKS9pO1xuY29uc3QgUEFSU0VfRUxJRl9SRUdFWCA9IC8jZWxpZlxccytcXCg/XFxzKighP1xccypcXHcrKVxccyooPT18IT18Pj18PD18PHw8fD4pP1xccyooXFx3KilcXHMqXFwpPy9pO1xuY29uc3QgUkVNQUlOSU5HX1JFR0VYID0gLyMoW1xcV1xcd1xcc1xcZF0pKD86LipcXFxccj9cXG4pKi4qJC9nbTtcblxuY29uc3QgZXZhbElmID0gZnVuY3Rpb24oYSwgbG9naWMsIGIpIHtcblx0aWYgKGxvZ2ljID09PSB1bmRlZmluZWQpIHtcblx0XHRpZiAoYVswXSA9PT0gJyEnKSB7XG5cdFx0XHRyZXR1cm4gIShhID09PSAndHJ1ZScgfHwgYSA+PSAxKTtcblx0XHR9XG5cdFx0cmV0dXJuIGEgPT09ICd0cnVlJyB8fCBhID49IDE7XG5cdH1cblx0c3dpdGNoIChsb2dpYykge1xuXHRcdGNhc2UgJz09Jzpcblx0XHRcdHJldHVybiBhID09PSBiO1xuXHRcdGNhc2UgJyE9Jzpcblx0XHRcdHJldHVybiBhICE9PSBiO1xuXHRcdGNhc2UgJz4nOlxuXHRcdFx0cmV0dXJuIGEgPiBiO1xuXHRcdGNhc2UgJz49Jzpcblx0XHRcdHJldHVybiBhID49IGI7XG5cdFx0Y2FzZSAnPCc6XG5cdFx0XHRyZXR1cm4gYSA8IGI7XG5cdFx0Y2FzZSAnPD0nOlxuXHRcdFx0cmV0dXJuIGEgPD0gYjtcblx0fVxuXHR0aHJvdyBgVW5yZWNvZ25pemVkIGxvZ2ljYWwgb3BlcmF0b3IgXFxgJHtsb2dpY31cXGBgO1xufTtcblxuY2xhc3MgQ29uZGl0aW9uYWwge1xuXHRjb25zdHJ1Y3Rvcih0eXBlLCBjb25kaXRpb25hbCkge1xuXHRcdHRoaXMudHlwZSA9IHR5cGU7XG5cdFx0dGhpcy5jb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLnRyaW0oKTtcblx0XHR0aGlzLmJvZHkgPSBbXTtcblx0XHR0aGlzLmNoaWxkcmVuID0gW107XG5cdH1cblx0ZXZhbCgpIHtcblx0XHRsZXQgcGFyc2VkO1xuXHRcdHN3aXRjaCAodGhpcy50eXBlKSB7XG5cdFx0XHRjYXNlICdpZic6XG5cdFx0XHRcdHBhcnNlZCA9IFBBUlNFX0lGX1JFR0VYLmV4ZWModGhpcy5jb25kaXRpb25hbCk7XG5cdFx0XHRcdHJldHVybiBldmFsSWYocGFyc2VkWzFdLCBwYXJzZWRbMl0sIHBhcnNlZFszXSk7XG5cdFx0XHRjYXNlICdpZmRlZic6XG5cdFx0XHRcdHBhcnNlZCA9IFBBUlNFX0lGREVGX1JFR0VYLmV4ZWModGhpcy5jb25kaXRpb25hbCk7XG5cdFx0XHRcdHJldHVybiBwYXJzZWRbMV0gPT09IERFRklORUQ7XG5cdFx0XHRjYXNlICdpZm5kZWYnOlxuXHRcdFx0XHRwYXJzZWQgPSBQQVJTRV9JRk5ERUZfUkVHRVguZXhlYyh0aGlzLmNvbmRpdGlvbmFsKTtcblx0XHRcdFx0cmV0dXJuIHBhcnNlZFsxXSAhPT0gREVGSU5FRDtcblx0XHRcdGNhc2UgJ2VsaWYnOlxuXHRcdFx0XHRwYXJzZWQgPSBQQVJTRV9FTElGX1JFR0VYLmV4ZWModGhpcy5jb25kaXRpb25hbCk7XG5cdFx0XHRcdHJldHVybiBldmFsSWYocGFyc2VkWzFdLCBwYXJzZWRbMl0sIHBhcnNlZFszXSk7XG5cdFx0fVxuXHRcdHRocm93IGBVbnJlY29nbml6ZWQgY29uZGl0aW9uYWwgdHlwZSBcXGAke3RoaXMudHlwZX1cXGBgO1xuXHR9XG59XG5cbmNsYXNzIEJsb2NrIHtcblx0Y29uc3RydWN0b3IodHlwZSwgY29uZGl0aW9uYWwsIGxpbmVOdW0pIHtcblx0XHR0aGlzLmlmID0gbmV3IENvbmRpdGlvbmFsKHR5cGUsIGNvbmRpdGlvbmFsKTtcblx0XHR0aGlzLmVsaWYgPSBbXTtcblx0XHR0aGlzLmVsc2UgPSBudWxsO1xuXHRcdHRoaXMucGFyZW50ID0gbnVsbDtcblx0XHR0aGlzLmN1cnJlbnQgPSB0aGlzLmlmO1xuXHRcdHRoaXMuc3RhcnRMaW5lID0gbGluZU51bTtcblx0XHR0aGlzLmVuZExpbmUgPSBudWxsO1xuXHR9XG5cdGFkZEVsc2UoY29uZGl0aW9uYWwpIHtcblx0XHR0aGlzLmN1cnJlbnQgPSBuZXcgQ29uZGl0aW9uYWwoJ2Vsc2UnLCBjb25kaXRpb25hbCk7XG5cdFx0dGhpcy5lbHNlID0gdGhpcy5jdXJyZW50O1xuXHR9XG5cdGFkZEVsaWYoY29uZGl0aW9uYWwpIHtcblx0XHR0aGlzLmN1cnJlbnQgPSBuZXcgQ29uZGl0aW9uYWwoJ2VsaWYnLCBjb25kaXRpb25hbCk7XG5cdFx0dGhpcy5lbGlmLnB1c2godGhpcy5jdXJyZW50KTtcblx0fVxuXHRhZGRCb2R5KGxpbmUsIGxpbmVOdW0pIHtcblx0XHR0aGlzLmN1cnJlbnQuYm9keS5wdXNoKHtcblx0XHRcdHN0cmluZzogbGluZS50cmltKCksXG5cdFx0XHRsaW5lOiBsaW5lTnVtXG5cdFx0fSk7XG5cdH1cblx0bmVzdChibG9jaykge1xuXHRcdGJsb2NrLnBhcmVudCA9IHRoaXM7XG5cdFx0dGhpcy5jdXJyZW50LmNoaWxkcmVuLnB1c2goYmxvY2spO1xuXHR9XG5cdGV4dHJhY3QoKSB7XG5cdFx0Ly8gI2lmXG5cdFx0bGV0IGJvZHkgPSBbXTtcblx0XHRpZiAodGhpcy5pZi5ldmFsKCkpIHtcblx0XHRcdGJvZHkgPSBib2R5LmNvbmNhdCh0aGlzLmlmLmJvZHkpO1xuXHRcdFx0dGhpcy5pZi5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcblx0XHRcdFx0Ym9keSA9IGJvZHkuY29uY2F0KGNoaWxkLmV4dHJhY3QoKSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBib2R5O1xuXHRcdH1cblx0XHQvLyAjZWxpZlxuXHRcdGZvciAobGV0IGk9MDsgaTx0aGlzLmVsaWYubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IGVsaWYgPSB0aGlzLmVsaWZbaV07XG5cdFx0XHRpZiAoZWxpZi5ldmFsKCkpIHtcblx0XHRcdFx0Ym9keSA9IGJvZHkuY29uY2F0KGVsaWYuYm9keSk7XG5cdFx0XHRcdGZvciAobGV0IGo9MDsgajxlbGlmLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0Y29uc3QgY2hpbGQgPSBlbGlmLmNoaWxkcmVuW2pdO1xuXHRcdFx0XHRcdGJvZHkgPSBib2R5LmNvbmNhdChjaGlsZC5leHRyYWN0KCkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBib2R5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyAjZWxzZVxuXHRcdGlmICh0aGlzLmVsc2UpIHtcblx0XHRcdGJvZHkgPSBib2R5LmNvbmNhdCh0aGlzLmVsc2UuYm9keSk7XG5cdFx0XHR0aGlzLmVsc2UuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG5cdFx0XHRcdGJvZHkgPSBib2R5LmNvbmNhdChjaGlsZC5leHRyYWN0KCkpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gYm9keTtcblx0XHR9XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cdGV2YWwoKSB7XG5cdFx0Ly8gZW5zdXJlIGV4dHJhY3QgdGV4dCBpcyBvcmRlcmVkIGNvcnJlY3RseVxuXHRcdHJldHVybiB0aGlzLmV4dHJhY3QoKS5zb3J0KChhLCBiKSA9PiB7XG5cdFx0XHRyZXR1cm4gYS5saW5lIC0gYi5saW5lO1xuXHRcdH0pLm1hcChhcmcgPT4ge1xuXHRcdFx0cmV0dXJuIGFyZy5zdHJpbmc7XG5cdFx0fSkuam9pbignXFxuJyk7XG5cdH1cbn1cblxuY29uc3QgcGFyc2VMaW5lcyA9IGZ1bmN0aW9uKGxpbmVzKSB7XG5cblx0Y29uc3QgYmxvY2tzID0gW107XG5cdGxldCBjdXJyZW50ID0gbnVsbDtcblxuXHRsaW5lcy5mb3JFYWNoKChsaW5lLCBpbmRleCkgPT4ge1xuXG5cdFx0aWYgKGxpbmUubWF0Y2goSUZfUkVHRVgpKSB7XG5cdFx0XHQvLyAjaWZcblx0XHRcdGNvbnN0IGJsb2NrID0gbmV3IEJsb2NrKCdpZicsIGxpbmUsIGluZGV4KTtcblx0XHRcdGlmICghY3VycmVudCkge1xuXHRcdFx0XHRibG9ja3MucHVzaChibG9jayk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjdXJyZW50Lm5lc3QoYmxvY2spO1xuXHRcdFx0fVxuXHRcdFx0Y3VycmVudCA9IGJsb2NrO1xuXG5cdFx0fSBlbHNlIGlmIChsaW5lLm1hdGNoKElGREVGX1JFR0VYKSkge1xuXHRcdFx0Ly8gI2lmZGVmXG5cdFx0XHRjb25zdCBibG9jayA9IG5ldyBCbG9jaygnaWZkZWYnLCBsaW5lLCBpbmRleCk7XG5cdFx0XHRpZiAoIWN1cnJlbnQpIHtcblx0XHRcdFx0YmxvY2tzLnB1c2goYmxvY2spO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y3VycmVudC5uZXN0KGJsb2NrKTtcblx0XHRcdH1cblx0XHRcdGN1cnJlbnQgPSBibG9jaztcblxuXHRcdH0gZWxzZSBpZiAobGluZS5tYXRjaChJRk5ERUZfUkVHRVgpKSB7XG5cdFx0XHQvLyAjaWZuZGVmXG5cdFx0XHRjb25zdCBibG9jayA9IG5ldyBCbG9jaygnaWZuZGVmJywgbGluZSwgaW5kZXgpO1xuXHRcdFx0aWYgKCFjdXJyZW50KSB7XG5cdFx0XHRcdGJsb2Nrcy5wdXNoKGJsb2NrKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGN1cnJlbnQubmVzdChibG9jayk7XG5cdFx0XHR9XG5cdFx0XHRjdXJyZW50ID0gYmxvY2s7XG5cblx0XHR9IGVsc2UgaWYgKGxpbmUubWF0Y2goRUxJRl9SRUdFWCkpIHtcblx0XHRcdC8vICNlbGlmXG5cdFx0XHRpZiAoIWN1cnJlbnQpIHtcblx0XHRcdFx0dGhyb3cgJ0ludmFsaWQgcHJlcHJvY2Vzc29yIHN5bnRheCwgdW5leHBlY3RlZCBgI2VsaWZgJztcblx0XHRcdH1cblx0XHRcdGN1cnJlbnQuYWRkRWxpZihsaW5lKTtcblxuXHRcdH0gZWxzZSBpZiAobGluZS5tYXRjaChFTFNFX1JFR0VYKSkge1xuXHRcdFx0Ly8gI2Vsc2Vcblx0XHRcdGlmICghY3VycmVudCkge1xuXHRcdFx0XHR0aHJvdyAnSW52YWxpZCBwcmVwcm9jZXNzb3Igc3ludGF4LCB1bmV4cGVjdGVkIGAjZWxzZWAnO1xuXHRcdFx0fVxuXHRcdFx0Y3VycmVudC5hZGRFbHNlKGxpbmUpO1xuXG5cdFx0fSBlbHNlIGlmIChsaW5lLm1hdGNoKEVORElGX1JFR0VYKSkge1xuXHRcdFx0Ly8gI2VuZGlmXG5cdFx0XHRpZiAoIWN1cnJlbnQpIHtcblx0XHRcdFx0dGhyb3cgJ0ludmFsaWQgcHJlcHJvY2Vzc29yIHN5bnRheCwgdW5leHBlY3RlZCBgI2VuZGlmYCc7XG5cdFx0XHR9XG5cdFx0XHRjdXJyZW50LmVuZExpbmUgPSBpbmRleDtcblx0XHRcdGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBvdGhlclxuXHRcdFx0aWYgKGN1cnJlbnQpIHtcblx0XHRcdFx0Y3VycmVudC5hZGRCb2R5KGxpbmUsIGluZGV4KTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdGlmIChjdXJyZW50KSB7XG5cdFx0dGhyb3cgJ0ludmFsaWQgcHJlcHJvY2Vzc29yIHN5bnRheCwgbWlzc2luZyBleHBlY3RlZCBgI2VuZGlmYCc7XG5cdH1cblxuXHRyZXR1cm4gYmxvY2tzO1xufTtcblxuY29uc3QgcmVwbGFjZURlZmluZXMgPSBmdW5jdGlvbihsaW5lcykge1xuXHRjb25zdCBkZWZpbmVzID0gbmV3IE1hcCgpO1xuXHRjb25zdCByZXBsYWNlZCA9IFtdO1xuXHRsaW5lcy5mb3JFYWNoKGxpbmUgPT4ge1xuXHRcdGlmIChsaW5lLm1hdGNoKERFRklORV9SRUdFWCkpIHtcblx0XHRcdC8vICNkZWZpbmVcblx0XHRcdGNvbnN0IHBhcnNlZCA9IFBBUlNFX0RFRklORV9SRUdFWC5leGVjKGxpbmUpO1xuXHRcdFx0ZGVmaW5lcy5zZXQocGFyc2VkWzFdLCBwYXJzZWRbMl0gfHwgREVGSU5FRCk7XG5cblx0XHR9IGVsc2UgaWYgKGxpbmUubWF0Y2goVU5ERUZfUkVHRVgpKSB7XG5cdFx0XHQvLyAjdW5kZWZcblx0XHRcdGNvbnN0IHBhcnNlZCA9IFBBUlNFX1VOREVGX1JFR0VYLmV4ZWMobGluZSk7XG5cdFx0XHRkZWZpbmVzLmRlbGV0ZShwYXJzZWRbMV0pO1xuXG5cdFx0fSBlbHNlIGlmIChsaW5lLm1hdGNoKElGREVGX1JFR0VYKSkge1xuXHRcdFx0Ly8gI2lmZGVmXG5cdFx0XHRjb25zdCBwYXJzZWQgPSBQQVJTRV9JRkRFRl9SRUdFWC5leGVjKGxpbmUpO1xuXHRcdFx0aWYgKGRlZmluZXMuaGFzKHBhcnNlZFsxXSkpIHtcblx0XHRcdFx0bGluZSA9IGxpbmUucmVwbGFjZShwYXJzZWRbMV0sIERFRklORUQpO1xuXHRcdFx0fVxuXHRcdFx0cmVwbGFjZWQucHVzaChsaW5lKTtcblxuXHRcdH0gZWxzZSBpZiAobGluZS5tYXRjaChJRk5ERUZfUkVHRVgpKSB7XG5cdFx0XHQvLyAjaWZuZGVmXG5cdFx0XHRjb25zdCBwYXJzZWQgPSBQQVJTRV9JRk5ERUZfUkVHRVguZXhlYyhsaW5lKTtcblx0XHRcdGlmIChkZWZpbmVzLmhhcyhwYXJzZWRbMV0pKSB7XG5cdFx0XHRcdGxpbmUgPSBsaW5lLnJlcGxhY2UocGFyc2VkWzFdLCBERUZJTkVEKTtcblx0XHRcdH1cblx0XHRcdHJlcGxhY2VkLnB1c2gobGluZSk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gc3dhcCBkZWZpbmVzXG5cdFx0XHRkZWZpbmVzLmZvckVhY2goKHZhbCwgZGVmaW5lKSA9PiB7XG5cdFx0XHRcdGxpbmUgPSBsaW5lLnJlcGxhY2UoZGVmaW5lLCB2YWwpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXBsYWNlZC5wdXNoKGxpbmUpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiByZXBsYWNlZDtcbn07XG5cbi8qKlxuICogRXZhbHVhdGVzIEdMU0wgcHJlcHJvY2Vzc29yIHN0YXRlbWVudHMuXG4gKiBOT1RFOiBhc3N1bWVzIGNvbW1lbnRzIGhhdmUgYmVlbiBzdHJpcHBlZCwgYW5kIHByZXByb2Nlc3NvcnMgYXJlIHZhbGlkLlxuICpcbiAqICAgICBTdXBwb3J0ZWQ6XG4gKlxuICogICAgICAgICAjZGVmaW5lIChzdWJzdGl0dXRpb25zIG9ubHkpXG4gKiAgICAgICAgICN1bmRlZlxuICogICAgICAgICAjaWYgKD09IGFuZCAhPSBjb21wYXJpc29ucyBvbmx5KVxuICogICAgICAgICAjaWZkZWZcbiAqICAgICAgICAgI2lmbmRlZlxuICogICAgICAgICAjZWxpZlxuICogICAgICAgICAjZWxzZVxuICogICAgICAgICAjZW5kaWZcbiAqXG4gKiAgICAgTm90IFN1cHBvcnRlZDpcbiAqXG4gKiAgICAgICAgICNkZWZpbmUgKG1hY3JvcylcbiAqICAgICAgICAgI2lmICgmJiBhbmQgfHwgb3BlcmF0b3JzLCBkZWZpbmVkKCkgcHJlZGljYXRlKVxuICogICAgICAgICAjZXJyb3JcbiAqICAgICAgICAgI3ByYWdtYVxuICogICAgICAgICAjZXh0ZW5zaW9uXG4gKiAgICAgICAgICN2ZXJzaW9uXG4gKiAgICAgICAgICNsaW5lXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGdsc2wgLSBUaGUgZ2xzbCBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBwcm9jZXNzZWQgZ2xzbCBzb3VyY2UgY29kZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHByZXByb2Nlc3M6IGZ1bmN0aW9uKGdsc2wpIHtcblx0XHQvLyBzcGxpdCBsaW5lc1xuXHRcdGxldCBsaW5lcyA9IGdsc2wuc3BsaXQoJ1xcbicpO1xuXHRcdC8vIHJlcGxhY2UgYW55IGRlZmluZXMgd2l0aCB0aGVpciB2YWx1ZXNcblx0XHRsaW5lcyA9IHJlcGxhY2VEZWZpbmVzKGxpbmVzKTtcblx0XHQvLyBwYXJzZSB0aGVtXG5cdFx0Y29uc3QgYmxvY2tzID0gcGFyc2VMaW5lcyhsaW5lcyk7XG5cdFx0Ly8gcmVtb3ZlIGJsb2NrcyBpbiByZXZlcnNlIG9yZGVyIHRvIHByZXNlcnZlIGxpbmUgbnVtYmVyc1xuXHRcdGZvciAobGV0IGk9YmxvY2tzLmxlbmd0aCAtIDE7IGk+PTA7IGktLSkge1xuXHRcdFx0Y29uc3QgYmxvY2sgPSBibG9ja3NbaV07XG5cdFx0XHRjb25zdCByZXBsYWNlbWVudCA9IGJsb2NrLmV2YWwoKTtcblx0XHRcdGlmIChyZXBsYWNlbWVudC5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGxpbmVzLnNwbGljZShibG9jay5zdGFydExpbmUsIGJsb2NrLmVuZExpbmUgLSBibG9jay5zdGFydExpbmUgKyAxLCByZXBsYWNlbWVudCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsaW5lcy5zcGxpY2UoYmxvY2suc3RhcnRMaW5lLCBibG9jay5lbmRMaW5lIC0gYmxvY2suc3RhcnRMaW5lICsgMSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIHN0cmlwIHJlbWFpbmluZyB1bnN1cHBvcnRlZCBwcmVwcm9jZXNzb3Igc3RhdGVtZW50c1xuXHRcdHJldHVybiBsaW5lcy5qb2luKCdcXG4nKS5yZXBsYWNlKFJFTUFJTklOR19SRUdFWCwgJycpO1xuXHR9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpO1xuY29uc3QgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpO1xuXG5jb25zdCBNQUdfRklMVEVSUyA9IHtcblx0TkVBUkVTVDogdHJ1ZSxcblx0TElORUFSOiB0cnVlXG59O1xuY29uc3QgTUlOX0ZJTFRFUlMgPSB7XG5cdE5FQVJFU1Q6IHRydWUsXG5cdExJTkVBUjogdHJ1ZSxcblx0TkVBUkVTVF9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcblx0TElORUFSX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxuXHRORUFSRVNUX01JUE1BUF9MSU5FQVI6IHRydWUsXG5cdExJTkVBUl9NSVBNQVBfTElORUFSOiB0cnVlXG59O1xuY29uc3QgTk9OX01JUE1BUF9NSU5fRklMVEVSUyA9IHtcblx0TkVBUkVTVDogdHJ1ZSxcblx0TElORUFSOiB0cnVlLFxufTtcbmNvbnN0IE1JUE1BUF9NSU5fRklMVEVSUyA9IHtcblx0TkVBUkVTVF9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcblx0TElORUFSX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxuXHRORUFSRVNUX01JUE1BUF9MSU5FQVI6IHRydWUsXG5cdExJTkVBUl9NSVBNQVBfTElORUFSOiB0cnVlXG59O1xuY29uc3QgV1JBUF9NT0RFUyA9IHtcblx0UkVQRUFUOiB0cnVlLFxuXHRNSVJST1JFRF9SRVBFQVQ6IHRydWUsXG5cdENMQU1QX1RPX0VER0U6IHRydWVcbn07XG5jb25zdCBERVBUSF9UWVBFUyA9IHtcblx0REVQVEhfQ09NUE9ORU5UOiB0cnVlLFxuXHRERVBUSF9TVEVOQ0lMOiB0cnVlXG59O1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IHR5cGUgZm9yIHRleHR1cmVzLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7U3RyaW5nfVxuICovXG5jb25zdCBERUZBVUxUX1RZUEUgPSAnVU5TSUdORURfQllURSc7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgZm9ybWF0IGZvciB0ZXh0dXJlcy5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge1N0cmluZ31cbiAqL1xuY29uc3QgREVGQVVMVF9GT1JNQVQgPSAnUkdCQSc7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgd3JhcCBtb2RlIGZvciB0ZXh0dXJlcy5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge1N0cmluZ31cbiAqL1xuY29uc3QgREVGQVVMVF9XUkFQID0gJ1JFUEVBVCc7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgbWluIC8gbWFnIGZpbHRlciBmb3IgdGV4dHVyZXMuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtTdHJpbmd9XG4gKi9cbmNvbnN0IERFRkFVTFRfRklMVEVSID0gJ0xJTkVBUic7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgZm9yIHdoZXRoZXIgYWxwaGEgcHJlbXVsdGlwbHlpbmcgaXMgZW5hYmxlZC5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge2Jvb2xlYW59XG4gKi9cbmNvbnN0IERFRkFVTFRfUFJFTVVMVElQTFlfQUxQSEEgPSB0cnVlO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIG1pcG1hcHBpbmcgaXMgZW5hYmxlZC5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge2Jvb2xlYW59XG4gKi9cbmNvbnN0IERFRkFVTFRfTUlQTUFQID0gdHJ1ZTtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBpbnZlcnQteSBpcyBlbmFibGVkLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgREVGQVVMVF9JTlZFUlRfWSA9IHRydWU7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgbWlwLW1hcHBpbmcgZmlsdGVyIHN1ZmZpeC5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge1N0cmluZ31cbiAqL1xuY29uc3QgREVGQVVMVF9NSVBNQVBfTUlOX0ZJTFRFUl9TVUZGSVggPSAnX01JUE1BUF9MSU5FQVInO1xuXG4vKipcbiAqIEBjbGFzcyBUZXh0dXJlMkRcbiAqIEBjbGFzc2Rlc2MgQSB0ZXh0dXJlIGNsYXNzIHRvIHJlcHJlc2VudCBhIDJEIHRleHR1cmUuXG4gKi9cbmNsYXNzIFRleHR1cmUyRCB7XG5cblx0LyoqXG5cdCAqIEluc3RhbnRpYXRlcyBhIFRleHR1cmUyRCBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ8SW1hZ2VEYXRhfEhUTUxJbWFnZUVsZW1lbnR8SFRNTENhbnZhc0VsZW1lbnR8SFRNTFZpZGVvRWxlbWVudH0gc3BlYy5zcmMgLSBUaGUgZGF0YSB0byBidWZmZXIuXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBzcGVjLndpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB0ZXh0dXJlLlxuXHQgKiBAcGFyYW0ge051bWJlcn0gc3BlYy5oZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB0ZXh0dXJlLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cblx0ICogQHBhcmFtIHtib29sfSBzcGVjLm1pcE1hcCAtIFdoZXRoZXIgb3Igbm90IG1pcC1tYXBwaW5nIGlzIGVuYWJsZWQuXG5cdCAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5pbnZlcnRZIC0gV2hldGhlciBvciBub3QgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cblx0ICogQHBhcmFtIHtib29sfSBzcGVjLnByZW11bHRpcGx5QWxwaGEgLSBXaGV0aGVyIG9yIG5vdCBhbHBoYSBwcmVtdWx0aXBseWluZyBpcyBlbmFibGVkLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5mb3JtYXQgLSBUaGUgdGV4dHVyZSBwaXhlbCBmb3JtYXQuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnR5cGUgLSBUaGUgdGV4dHVyZSBwaXhlbCBjb21wb25lbnQgdHlwZS5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHNwZWMgPSB7fSkge1xuXHRcdC8vIGdldCBzcGVjaWZpYyBwYXJhbXNcblx0XHRzcGVjLndyYXBTID0gc3BlYy53cmFwUyB8fCBzcGVjLndyYXA7XG5cdFx0c3BlYy53cmFwVCA9IHNwZWMud3JhcFQgfHwgc3BlYy53cmFwO1xuXHRcdHNwZWMubWluRmlsdGVyID0gc3BlYy5taW5GaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XG5cdFx0c3BlYy5tYWdGaWx0ZXIgPSBzcGVjLm1hZ0ZpbHRlciB8fCBzcGVjLmZpbHRlcjtcblx0XHQvLyBzZXQgY29udGV4dFxuXHRcdHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XG5cdFx0Ly8gZW1wdHkgdGV4dHVyZVxuXHRcdHRoaXMudGV4dHVyZSA9IG51bGw7XG5cdFx0Ly8gc2V0IHRleHR1cmUgcGFyYW1zXG5cdFx0dGhpcy53cmFwUyA9IHNwZWMud3JhcFMgfHwgREVGQVVMVF9XUkFQO1xuXHRcdHRoaXMud3JhcFQgPSBzcGVjLndyYXBUIHx8IERFRkFVTFRfV1JBUDtcblx0XHR0aGlzLm1pbkZpbHRlciA9IHNwZWMubWluRmlsdGVyIHx8IERFRkFVTFRfRklMVEVSO1xuXHRcdHRoaXMubWFnRmlsdGVyID0gc3BlYy5tYWdGaWx0ZXIgfHwgREVGQVVMVF9GSUxURVI7XG5cdFx0Ly8gc2V0IG90aGVyIHByb3BlcnRpZXNcblx0XHR0aGlzLm1pcE1hcCA9IHNwZWMubWlwTWFwICE9PSB1bmRlZmluZWQgPyBzcGVjLm1pcE1hcCA6IERFRkFVTFRfTUlQTUFQO1xuXHRcdHRoaXMuaW52ZXJ0WSA9IHNwZWMuaW52ZXJ0WSAhPT0gdW5kZWZpbmVkID8gc3BlYy5pbnZlcnRZIDogREVGQVVMVF9JTlZFUlRfWTtcblx0XHR0aGlzLnByZW11bHRpcGx5QWxwaGEgPSBzcGVjLnByZW11bHRpcGx5QWxwaGEgIT09IHVuZGVmaW5lZCA/IHNwZWMucHJlbXVsdGlwbHlBbHBoYSA6IERFRkFVTFRfUFJFTVVMVElQTFlfQUxQSEE7XG5cdFx0Ly8gc2V0IGZvcm1hdFxuXHRcdHRoaXMuZm9ybWF0ID0gc3BlYy5mb3JtYXQgfHwgREVGQVVMVF9GT1JNQVQ7XG5cdFx0aWYgKERFUFRIX1RZUEVTW3RoaXMuZm9ybWF0XSAmJiAhV2ViR0xDb250ZXh0LmNoZWNrRXh0ZW5zaW9uKCdXRUJHTF9kZXB0aF90ZXh0dXJlJykpIHtcblx0XHRcdHRocm93IGBDYW5ub3QgY3JlYXRlIFRleHR1cmUyRCBvZiBmb3JtYXQgXFxgJHt0aGlzLmZvcm1hdH1cXGAgYXMgXFxgV0VCR0xfZGVwdGhfdGV4dHVyZVxcYCBleHRlbnNpb24gaXMgdW5zdXBwb3J0ZWRgO1xuXHRcdH1cblx0XHQvLyBzZXQgdHlwZVxuXHRcdHRoaXMudHlwZSA9IHNwZWMudHlwZSB8fCBERUZBVUxUX1RZUEU7XG5cdFx0aWYgKHRoaXMudHlwZSA9PT0gJ0ZMT0FUJyAmJiAhV2ViR0xDb250ZXh0LmNoZWNrRXh0ZW5zaW9uKCdPRVNfdGV4dHVyZV9mbG9hdCcpKSB7XG5cdFx0XHR0aHJvdyAnQ2Fubm90IGNyZWF0ZSBUZXh0dXJlMkQgb2YgdHlwZSBgRkxPQVRgIGFzIGBPRVNfdGV4dHVyZV9mbG9hdGAgZXh0ZW5zaW9uIGlzIHVuc3VwcG9ydGVkJztcblx0XHR9XG5cdFx0Ly8gdXJsIHdpbGwgbm90IGJlIHJlc29sdmVkIHlldCwgc28gZG9uJ3QgYnVmZmVyIGluIHRoYXQgY2FzZVxuXHRcdGlmICh0eXBlb2Ygc3BlYy5zcmMgIT09ICdzdHJpbmcnKSB7XG5cdFx0XHQvLyBjaGVjayBzaXplXG5cdFx0XHRpZiAoIVV0aWwuaXNDYW52YXNUeXBlKHNwZWMuc3JjKSkge1xuXHRcdFx0XHQvLyBpZiBub3QgYSBjYW52YXMgdHlwZSwgZGltZW5zaW9ucyBNVVNUIGJlIHNwZWNpZmllZFxuXHRcdFx0XHRpZiAodHlwZW9mIHNwZWMud2lkdGggIT09ICdudW1iZXInIHx8IHNwZWMud2lkdGggPD0gMCkge1xuXHRcdFx0XHRcdHRocm93ICdgd2lkdGhgIGFyZ3VtZW50IGlzIG1pc3Npbmcgb3IgaW52YWxpZCc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR5cGVvZiBzcGVjLmhlaWdodCAhPT0gJ251bWJlcicgfHwgc3BlYy5oZWlnaHQgPD0gMCkge1xuXHRcdFx0XHRcdHRocm93ICdgaGVpZ2h0YCBhcmd1bWVudCBpcyBtaXNzaW5nIG9yIGludmFsaWQnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChVdGlsLm11c3RCZVBvd2VyT2ZUd28odGhpcykpIHtcblx0XHRcdFx0XHRpZiAoIVV0aWwuaXNQb3dlck9mVHdvKHNwZWMud2lkdGgpKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBgUGFyYW1ldGVycyByZXF1aXJlIGEgcG93ZXItb2YtdHdvIHRleHR1cmUsIHlldCBwcm92aWRlZCB3aWR0aCBvZiBcXGAke3NwZWMud2lkdGh9XFxgIGlzIG5vdCBhIHBvd2VyIG9mIHR3b2A7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghVXRpbC5pc1Bvd2VyT2ZUd28oc3BlYy5oZWlnaHQpKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBgUGFyYW1ldGVycyByZXF1aXJlIGEgcG93ZXItb2YtdHdvIHRleHR1cmUsIHlldCBwcm92aWRlZCBoZWlnaHQgb2YgXFxgJHtzcGVjLmhlaWdodH1cXGAgaXMgbm90IGEgcG93ZXIgb2YgdHdvYDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIGJ1ZmZlciB0aGUgZGF0YVxuXHRcdFx0dGhpcy5idWZmZXJEYXRhKHNwZWMuc3JjIHx8IG51bGwsIHNwZWMud2lkdGgsIHNwZWMuaGVpZ2h0KTtcblx0XHRcdHRoaXMuc2V0UGFyYW1ldGVycyh0aGlzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQmluZHMgdGhlIHRleHR1cmUgb2JqZWN0IHRvIHRoZSBwcm92aWRlZCB0ZXh0dXJlIHVuaXQgbG9jYXRpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBsb2NhdGlvbiAtIFRoZSB0ZXh0dXJlIHVuaXQgbG9jYXRpb24gaW5kZXguIERlZmF1bHRzIHRvIDAuXG5cdCAqXG5cdCAqIEByZXR1cm4ge1RleHR1cmUyRH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRiaW5kKGxvY2F0aW9uID0gMCkge1xuXHRcdGlmICghTnVtYmVyLmlzSW50ZWdlcihsb2NhdGlvbikgfHwgbG9jYXRpb24gPCAwKSB7XG5cdFx0XHR0aHJvdyAnVGV4dHVyZSB1bml0IGxvY2F0aW9uIGlzIGludmFsaWQnO1xuXHRcdH1cblx0XHQvLyBiaW5kIHRleHR1cmVcblx0XHRjb25zdCBnbCA9IHRoaXMuZ2w7XG5cdFx0Z2wuYWN0aXZlVGV4dHVyZShnbFsnVEVYVFVSRScgKyBsb2NhdGlvbl0pO1xuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogVW5iaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QuXG5cdCAqXG5cdCAqIEByZXR1cm4ge1RleHR1cmUyRH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHR1bmJpbmQoKSB7XG5cdFx0Ly8gdW5iaW5kIHRleHR1cmVcblx0XHRjb25zdCBnbCA9IHRoaXMuZ2w7XG5cdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogQnVmZmVyIGRhdGEgaW50byB0aGUgdGV4dHVyZS5cblx0ICpcblx0ICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcn0gZGF0YSAtIFRoZSBkYXRhIGFycmF5IHRvIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSBkYXRhLlxuXHQgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgZGF0YS5cblx0ICpcblx0ICogQHJldHVybiB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdGJ1ZmZlckRhdGEoZGF0YSwgd2lkdGgsIGhlaWdodCkge1xuXHRcdGNvbnN0IGdsID0gdGhpcy5nbDtcblx0XHQvLyBjcmVhdGUgdGV4dHVyZSBvYmplY3QgaWYgaXQgZG9lc24ndCBhbHJlYWR5IGV4aXN0XG5cdFx0aWYgKCF0aGlzLnRleHR1cmUpIHtcblx0XHRcdHRoaXMudGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcblx0XHR9XG5cdFx0Ly8gYmluZCB0ZXh0dXJlXG5cdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcblx0XHQvLyBpbnZlcnQgeSBpZiBzcGVjaWZpZWRcblx0XHRnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCB0aGlzLmludmVydFkpO1xuXHRcdC8vIHByZW11bHRpcGx5IGFscGhhIGlmIHNwZWNpZmllZFxuXHRcdGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCwgdGhpcy5wcmVtdWx0aXBseUFscGhhKTtcblx0XHQvLyBjYXN0IGFycmF5IGFyZ1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG5cdFx0XHRpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfU0hPUlQnKSB7XG5cdFx0XHRcdGRhdGEgPSBuZXcgVWludDE2QXJyYXkoZGF0YSk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX0lOVCcpIHtcblx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50MzJBcnJheShkYXRhKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnRkxPQVQnKSB7XG5cdFx0XHRcdGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KGRhdGEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50OEFycmF5KGRhdGEpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBzZXQgZW5zdXJlIHR5cGUgY29ycmVzcG9uZHMgdG8gZGF0YVxuXHRcdGlmIChkYXRhIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuXHRcdFx0dGhpcy50eXBlID0gJ1VOU0lHTkVEX0JZVEUnO1xuXHRcdH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIFVpbnQxNkFycmF5KSB7XG5cdFx0XHR0aGlzLnR5cGUgPSAnVU5TSUdORURfU0hPUlQnO1xuXHRcdH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIFVpbnQzMkFycmF5KSB7XG5cdFx0XHR0aGlzLnR5cGUgPSAnVU5TSUdORURfSU5UJztcblx0XHR9IGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkpIHtcblx0XHRcdHRoaXMudHlwZSA9ICdGTE9BVCc7XG5cdFx0fSBlbHNlIGlmIChkYXRhICYmICEoZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSAmJiAhVXRpbC5pc0NhbnZhc1R5cGUoZGF0YSkpIHtcblx0XHRcdHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgJyArXG5cdFx0XHRcdCdgQXJyYXlCdWZmZXJWaWV3YCwgYEltYWdlRGF0YWAsIGBIVE1MSW1hZ2VFbGVtZW50YCwgJyArXG5cdFx0XHRcdCdgSFRNTENhbnZhc0VsZW1lbnRgLCBgSFRNTFZpZGVvRWxlbWVudGAsIG9yIG51bGwnO1xuXHRcdH1cblx0XHRpZiAoVXRpbC5pc0NhbnZhc1R5cGUoZGF0YSkpIHtcblx0XHRcdC8vIHN0b3JlIHdpZHRoIGFuZCBoZWlnaHRcblx0XHRcdHRoaXMud2lkdGggPSBkYXRhLndpZHRoO1xuXHRcdFx0dGhpcy5oZWlnaHQgPSBkYXRhLmhlaWdodDtcblx0XHRcdC8vIGJ1ZmZlciB0aGUgdGV4dHVyZVxuXHRcdFx0Z2wudGV4SW1hZ2UyRChcblx0XHRcdFx0Z2wuVEVYVFVSRV8yRCxcblx0XHRcdFx0MCwgLy8gbWlwLW1hcCBsZXZlbFxuXHRcdFx0XHRnbFt0aGlzLmZvcm1hdF0sIC8vIHdlYmdsIHJlcXVpcmVzIGZvcm1hdCA9PT0gaW50ZXJuYWxGb3JtYXRcblx0XHRcdFx0Z2xbdGhpcy5mb3JtYXRdLFxuXHRcdFx0XHRnbFt0aGlzLnR5cGVdLFxuXHRcdFx0XHRkYXRhKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gc3RvcmUgd2lkdGggYW5kIGhlaWdodFxuXHRcdFx0dGhpcy53aWR0aCA9IHdpZHRoIHx8IHRoaXMud2lkdGg7XG5cdFx0XHR0aGlzLmhlaWdodCA9IGhlaWdodCB8fCB0aGlzLmhlaWdodDtcblx0XHRcdC8vIGJ1ZmZlciB0aGUgdGV4dHVyZSBkYXRhXG5cdFx0XHRnbC50ZXhJbWFnZTJEKFxuXHRcdFx0XHRnbC5URVhUVVJFXzJELFxuXHRcdFx0XHQwLCAvLyBtaXAtbWFwIGxldmVsXG5cdFx0XHRcdGdsW3RoaXMuZm9ybWF0XSwgLy8gd2ViZ2wgcmVxdWlyZXMgZm9ybWF0ID09PSBpbnRlcm5hbEZvcm1hdFxuXHRcdFx0XHR0aGlzLndpZHRoLFxuXHRcdFx0XHR0aGlzLmhlaWdodCxcblx0XHRcdFx0MCwgLy8gYm9yZGVyLCBtdXN0IGJlIDBcblx0XHRcdFx0Z2xbdGhpcy5mb3JtYXRdLFxuXHRcdFx0XHRnbFt0aGlzLnR5cGVdLFxuXHRcdFx0XHRkYXRhKTtcblx0XHR9XG5cdFx0Ly8gZ2VuZXJhdGUgbWlwIG1hcHNcblx0XHRpZiAodGhpcy5taXBNYXApIHtcblx0XHRcdGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xuXHRcdH1cblx0XHQvLyB1bmJpbmQgdGV4dHVyZVxuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJ1ZmZlciBwYXJ0aWFsIGRhdGEgaW50byB0aGUgdGV4dHVyZS5cblx0ICpcblx0ICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcn0gZGF0YSAtIFRoZSBkYXRhIGFycmF5IHRvIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtOdW1iZXJ9IHhPZmZzZXQgLSBUaGUgeCBvZmZzZXQgYXQgd2hpY2ggdG8gYnVmZmVyLlxuXHQgKiBAcGFyYW0ge051bWJlcn0geU9mZnNldCAtIFRoZSB5IG9mZnNldCBhdCB3aGljaCB0byBidWZmZXIuXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgZGF0YS5cblx0ICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIGRhdGEuXG5cdCAqXG5cdCAqIEByZXR1cm4ge1RleHR1cmUyRH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRidWZmZXJTdWJEYXRhKGRhdGEsIHhPZmZzZXQgPSAwLCB5T2Zmc2V0ID0gMCwgd2lkdGggPSB1bmRlZmluZWQsIGhlaWdodCA9IHVuZGVmaW5lZCkge1xuXHRcdGNvbnN0IGdsID0gdGhpcy5nbDtcblx0XHQvLyBiaW5kIHRleHR1cmVcblx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xuXHRcdC8vIGNhc3QgYXJyYXkgYXJnXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcblx0XHRcdGlmICh0aGlzLnR5cGUgPT09ICdVTlNJR05FRF9TSE9SVCcpIHtcblx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50MTZBcnJheShkYXRhKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfSU5UJykge1xuXHRcdFx0XHRkYXRhID0gbmV3IFVpbnQzMkFycmF5KGRhdGEpO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdGTE9BVCcpIHtcblx0XHRcdFx0ZGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoZGF0YSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkYXRhID0gbmV3IFVpbnQ4QXJyYXkoZGF0YSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIHNldCBlbnN1cmUgdHlwZSBjb3JyZXNwb25kcyB0byBkYXRhXG5cdFx0aWYgKGRhdGEgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG5cdFx0XHRpZiAodGhpcy50eXBlICE9PSAnVU5TSUdORURfQllURScpIHtcblx0XHRcdFx0dGhyb3cgJ1Byb3ZpZGVkIGFyZ3VtZW50IG9mIHR5cGUgYFVpbnQ4QXJyYXlgIGRvZXMgbm90IG1hdGNoIHR5cGUgb2YgYFVOU0lHTkVEX0JZVEVgJztcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBVaW50MTZBcnJheSkge1xuXHRcdFx0aWYgKHRoaXMudHlwZSAhPT0gJ1VOU0lHTkVEX1NIT1JUJykge1xuXHRcdFx0XHR0aHJvdyAnUHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSBgVWludDE2QXJyYXlgIGRvZXMgbm90IG1hdGNoIHR5cGUgb2YgYFVOU0lHTkVEX1NIT1JUYCc7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgVWludDMyQXJyYXkpIHtcblx0XHRcdGlmICh0aGlzLnR5cGUgIT09ICdVTlNJR05FRF9JTlQnKSB7XG5cdFx0XHRcdHRocm93ICdQcm92aWRlZCBhcmd1bWVudCBvZiB0eXBlIGBVaW50MzJBcnJheWAgZG9lcyBub3QgbWF0Y2ggdHlwZSBvZiBgVU5TSUdORURfSU5UYCc7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5KSB7XG5cdFx0XHRpZiAodGhpcy50eXBlICE9PSAnRkxPQVQnKSB7XG5cdFx0XHRcdHRocm93ICdQcm92aWRlZCBhcmd1bWVudCBvZiB0eXBlIGBGbG9hdDMyQXJyYXlgIGRvZXMgbm90IG1hdGNoIHR5cGUgb2YgYEZMT0FUYCc7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICghKGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikgJiYgIVV0aWwuaXNDYW52YXNUeXBlKGRhdGEpKSB7XG5cdFx0XHR0aHJvdyAnQXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIGBBcnJheWAsIGBBcnJheUJ1ZmZlcmAsICcgK1xuXHRcdFx0XHQnYEFycmF5QnVmZmVyVmlld2AsIGBJbWFnZURhdGFgLCBgSFRNTEltYWdlRWxlbWVudGAsICcgK1xuXHRcdFx0XHQnYEhUTUxDYW52YXNFbGVtZW50YCwgb3IgYEhUTUxWaWRlb0VsZW1lbnRgJztcblx0XHR9XG5cdFx0aWYgKFV0aWwuaXNDYW52YXNUeXBlKGRhdGEpKSB7XG5cdFx0XHQvLyBidWZmZXIgdGhlIHRleHR1cmVcblx0XHRcdGdsLnRleFN1YkltYWdlMkQoXG5cdFx0XHRcdGdsLlRFWFRVUkVfMkQsXG5cdFx0XHRcdDAsIC8vIG1pcC1tYXAgbGV2ZWxcblx0XHRcdFx0eE9mZnNldCxcblx0XHRcdFx0eU9mZnNldCxcblx0XHRcdFx0Z2xbdGhpcy5mb3JtYXRdLFxuXHRcdFx0XHRnbFt0aGlzLnR5cGVdLFxuXHRcdFx0XHRkYXRhKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gY2hlY2sgdGhhdCB3aWR0aCBpcyBwcm92aWRlZFxuXHRcdFx0aWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHdpZHRoKSkge1xuXHRcdFx0XHR0aHJvdyBgUHJvdmlkZWQgd2lkdGggb2YgXFxgJHt3aWR0aH1cXGAgaXMgaW52YWxpZGA7XG5cdFx0XHR9XG5cdFx0XHQvLyBjaGVjayB0aGF0IGhlaWdodCBpcyBwcm92aWRlZFxuXHRcdFx0aWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGhlaWdodCkpIHtcblx0XHRcdFx0dGhyb3cgYFByb3ZpZGVkIGhlaWdodCBvZiBcXGAke2hlaWdodH1cXGAgaXMgaW52YWxpZGA7XG5cdFx0XHR9XG5cdFx0XHQvLyBjaGVjayB0aGF0IHdlIGFyZW4ndCBvdmVyZmxvd2luZyB0aGUgYnVmZmVyXG5cdFx0XHRpZiAod2lkdGggKyB4T2Zmc2V0ID4gdGhpcy53aWR0aCkge1xuXHRcdFx0XHR0aHJvdyBgUHJvdmlkZWQgd2lkdGggb2YgXFxgJHt3aWR0aH1cXGAgYW5kIHhPZmZzZXQgb2YgYCArXG5cdFx0XHRcdFx0YCBcXGAke3hPZmZzZXR9XFxgIG92ZXJmbG93cyB0aGUgdGV4dHVyZSB3aWR0aCBvZiBgICtcblx0XHRcdFx0XHRgXFxgJHt0aGlzLndpZHRofVxcYGA7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaGVpZ2h0ICsgeU9mZnNldCA+IHRoaXMuaGVpZ2h0KSB7XG5cdFx0XHRcdHRocm93IGBQcm92aWRlZCB3aWR0aCBvZiBcXGAke2hlaWdodH1cXGAgYW5kIHhPZmZzZXQgb2YgYCArXG5cdFx0XHRcdFx0YCBcXGAke3lPZmZzZXR9XFxgIG92ZXJmbG93cyB0aGUgdGV4dHVyZSB3aWR0aCBvZiBgICtcblx0XHRcdFx0XHRgXFxgJHt0aGlzLmhlaWdodH1cXGBgO1xuXHRcdFx0fVxuXHRcdFx0Ly8gYnVmZmVyIHRoZSB0ZXh0dXJlIGRhdGFcblx0XHRcdGdsLnRleFN1YkltYWdlMkQoXG5cdFx0XHRcdGdsLlRFWFRVUkVfMkQsXG5cdFx0XHRcdDAsIC8vIG1pcC1tYXAgbGV2ZWxcblx0XHRcdFx0eE9mZnNldCxcblx0XHRcdFx0eU9mZnNldCxcblx0XHRcdFx0d2lkdGgsXG5cdFx0XHRcdGhlaWdodCxcblx0XHRcdFx0Z2xbdGhpcy5mb3JtYXRdLFxuXHRcdFx0XHRnbFt0aGlzLnR5cGVdLFxuXHRcdFx0XHRkYXRhKTtcblx0XHR9XG5cdFx0Ly8gZ2VuZXJhdGUgbWlwIG1hcHNcblx0XHRpZiAodGhpcy5taXBNYXApIHtcblx0XHRcdGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xuXHRcdH1cblx0XHQvLyB1bmJpbmQgdGV4dHVyZVxuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgdGV4dHVyZSBwYXJhbWV0ZXJzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgYnkgbmFtZS5cblx0ICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLndyYXBTIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgUyBkaW1lbnNpb24uXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMud3JhcFQgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBUIGRpbWVuc2lvbi5cblx0ICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLm1pbkZpbHRlciAtIFRoZSBtaW5pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMubWFnRmlsdGVyIC0gVGhlIG1hZ25pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG5cdCAqXG5cdCAqIEByZXR1cm4ge1RleHR1cmUyRH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRzZXRQYXJhbWV0ZXJzKHBhcmFtcykge1xuXHRcdGNvbnN0IGdsID0gdGhpcy5nbDtcblx0XHQvLyBiaW5kIHRleHR1cmVcblx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xuXHRcdC8vIHNldCB3cmFwIFMgcGFyYW1ldGVyXG5cdFx0bGV0IHBhcmFtID0gcGFyYW1zLndyYXBTIHx8IHBhcmFtcy53cmFwO1xuXHRcdGlmIChwYXJhbSkge1xuXHRcdFx0aWYgKFdSQVBfTU9ERVNbcGFyYW1dKSB7XG5cdFx0XHRcdHRoaXMud3JhcFMgPSBwYXJhbTtcblx0XHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2xbdGhpcy53cmFwU10pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgYFRleHR1cmUgcGFyYW1ldGVyIFxcYCR7cGFyYW19XFxgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBcXGBURVhUVVJFX1dSQVBfU1xcYGA7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIHNldCB3cmFwIFQgcGFyYW1ldGVyXG5cdFx0cGFyYW0gPSBwYXJhbXMud3JhcFQgfHwgcGFyYW1zLndyYXA7XG5cdFx0aWYgKHBhcmFtKSB7XG5cdFx0XHRpZiAoV1JBUF9NT0RFU1twYXJhbV0pIHtcblx0XHRcdFx0dGhpcy53cmFwVCA9IHBhcmFtO1xuXHRcdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbFt0aGlzLndyYXBUXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIFxcYFRFWFRVUkVfV1JBUF9UXFxgYDtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gc2V0IG1hZyBmaWx0ZXIgcGFyYW1ldGVyXG5cdFx0cGFyYW0gPSBwYXJhbXMubWFnRmlsdGVyIHx8IHBhcmFtcy5maWx0ZXI7XG5cdFx0aWYgKHBhcmFtKSB7XG5cdFx0XHRpZiAoTUFHX0ZJTFRFUlNbcGFyYW1dKSB7XG5cdFx0XHRcdHRoaXMubWFnRmlsdGVyID0gcGFyYW07XG5cdFx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbFt0aGlzLm1hZ0ZpbHRlcl0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgYFRleHR1cmUgcGFyYW1ldGVyIFxcYCR7cGFyYW19XFxgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciAnVEVYVFVSRV9NQUdfRklMVEVSXFxgYDtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gc2V0IG1pbiBmaWx0ZXIgcGFyYW1ldGVyXG5cdFx0cGFyYW0gPSBwYXJhbXMubWluRmlsdGVyIHx8IHBhcmFtcy5maWx0ZXI7XG5cdFx0aWYgKHBhcmFtKSB7XG5cdFx0XHRpZiAodGhpcy5taXBNYXApIHtcblx0XHRcdFx0aWYgKE5PTl9NSVBNQVBfTUlOX0ZJTFRFUlNbcGFyYW1dKSB7XG5cdFx0XHRcdFx0Ly8gdXBncmFkZSB0byBtaXAtbWFwIG1pbiBmaWx0ZXJcblx0XHRcdFx0XHRwYXJhbSArPSBERUZBVUxUX01JUE1BUF9NSU5fRklMVEVSX1NVRkZJWDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoTUlQTUFQX01JTl9GSUxURVJTW3BhcmFtXSkge1xuXHRcdFx0XHRcdHRoaXMubWluRmlsdGVyID0gcGFyYW07XG5cdFx0XHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsW3RoaXMubWluRmlsdGVyXSk7XG5cdFx0XHRcdH0gZWxzZSAge1xuXHRcdFx0XHRcdHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgXFxgVEVYVFVSRV9NSU5fRklMVEVSXFxgYDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKE1JTl9GSUxURVJTW3BhcmFtXSkge1xuXHRcdFx0XHRcdHRoaXMubWluRmlsdGVyID0gcGFyYW07XG5cdFx0XHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsW3RoaXMubWluRmlsdGVyXSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhyb3cgYFRleHR1cmUgcGFyYW1ldGVyIFxcYCR7cGFyYW19XFxgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBcXGBURVhUVVJFX01JTl9GSUxURVJcXGBgO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIHVuYmluZCB0ZXh0dXJlXG5cdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXNpemUgdGhlIHVuZGVybHlpbmcgdGV4dHVyZS4gVGhpcyBjbGVhcnMgdGhlIHRleHR1cmUgZGF0YS5cblx0ICpcblx0ICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoIC0gVGhlIG5ldyB3aWR0aCBvZiB0aGUgdGV4dHVyZS5cblx0ICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodCAtIFRoZSBuZXcgaGVpZ2h0IG9mIHRoZSB0ZXh0dXJlLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0cmVzaXplKHdpZHRoLCBoZWlnaHQpIHtcblx0XHRpZiAodHlwZW9mIHdpZHRoICE9PSAnbnVtYmVyJyB8fCAod2lkdGggPD0gMCkpIHtcblx0XHRcdHRocm93IGBQcm92aWRlZCB3aWR0aCBvZiBcXGAke3dpZHRofVxcYCBpcyBpbnZhbGlkYDtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBoZWlnaHQgIT09ICdudW1iZXInIHx8IChoZWlnaHQgPD0gMCkpIHtcblx0XHRcdHRocm93IGBQcm92aWRlZCBoZWlnaHQgb2YgXFxgJHtoZWlnaHR9XFxgIGlzIGludmFsaWRgO1xuXHRcdH1cblx0XHR0aGlzLmJ1ZmZlckRhdGEobnVsbCwgd2lkdGgsIGhlaWdodCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlMkQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBhcmFsbGVsID0gcmVxdWlyZSgnYXN5bmMvcGFyYWxsZWwnKTtcbmNvbnN0IFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0Jyk7XG5jb25zdCBJbWFnZUxvYWRlciA9IHJlcXVpcmUoJy4uL3V0aWwvSW1hZ2VMb2FkZXInKTtcbmNvbnN0IFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKTtcblxuY29uc3QgRkFDRVMgPSBbXG5cdCcteCcsICcreCcsXG5cdCcteScsICcreScsXG5cdCcteicsICcreidcbl07XG5jb25zdCBGQUNFX1RBUkdFVFMgPSB7XG5cdCcreic6ICdURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1onLFxuXHQnLXonOiAnVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9aJyxcblx0Jyt4JzogJ1RFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCcsXG5cdCcteCc6ICdURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1gnLFxuXHQnK3knOiAnVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9ZJyxcblx0Jy15JzogJ1RFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWSdcbn07XG5jb25zdCBUQVJHRVRTID0ge1xuXHRURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1o6IHRydWUsXG5cdFRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWjogdHJ1ZSxcblx0VEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YOiB0cnVlLFxuXHRURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1g6IHRydWUsXG5cdFRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWTogdHJ1ZSxcblx0VEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9ZOiB0cnVlXG59O1xuY29uc3QgTUFHX0ZJTFRFUlMgPSB7XG5cdE5FQVJFU1Q6IHRydWUsXG5cdExJTkVBUjogdHJ1ZVxufTtcbmNvbnN0IE1JTl9GSUxURVJTID0ge1xuXHRORUFSRVNUOiB0cnVlLFxuXHRMSU5FQVI6IHRydWUsXG5cdE5FQVJFU1RfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG5cdExJTkVBUl9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcblx0TkVBUkVTVF9NSVBNQVBfTElORUFSOiB0cnVlLFxuXHRMSU5FQVJfTUlQTUFQX0xJTkVBUjogdHJ1ZVxufTtcbmNvbnN0IE5PTl9NSVBNQVBfTUlOX0ZJTFRFUlMgPSB7XG5cdE5FQVJFU1Q6IHRydWUsXG5cdExJTkVBUjogdHJ1ZSxcbn07XG5jb25zdCBNSVBNQVBfTUlOX0ZJTFRFUlMgPSB7XG5cdE5FQVJFU1RfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG5cdExJTkVBUl9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcblx0TkVBUkVTVF9NSVBNQVBfTElORUFSOiB0cnVlLFxuXHRMSU5FQVJfTUlQTUFQX0xJTkVBUjogdHJ1ZVxufTtcbmNvbnN0IFdSQVBfTU9ERVMgPSB7XG5cdFJFUEVBVDogdHJ1ZSxcblx0TUlSUk9SRURfUkVQRUFUOiB0cnVlLFxuXHRDTEFNUF9UT19FREdFOiB0cnVlXG59O1xuY29uc3QgRk9STUFUUyA9IHtcblx0UkdCOiB0cnVlLFxuXHRSR0JBOiB0cnVlXG59O1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IHR5cGUgZm9yIHRleHR1cmVzLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7U3RyaW5nfVxuICovXG5jb25zdCBERUZBVUxUX1RZUEUgPSAnVU5TSUdORURfQllURSc7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgZm9ybWF0IGZvciB0ZXh0dXJlcy5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge1N0cmluZ31cbiAqL1xuY29uc3QgREVGQVVMVF9GT1JNQVQgPSAnUkdCQSc7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgd3JhcCBtb2RlIGZvciB0ZXh0dXJlcy5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge1N0cmluZ31cbiAqL1xuY29uc3QgREVGQVVMVF9XUkFQID0gJ0NMQU1QX1RPX0VER0UnO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IG1pbiAvIG1hZyBmaWx0ZXIgZm9yIHRleHR1cmVzLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7U3RyaW5nfVxuICovXG5jb25zdCBERUZBVUxUX0ZJTFRFUiA9ICdMSU5FQVInO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIGFscGhhIHByZW11bHRpcGx5aW5nIGlzIGVuYWJsZWQuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtib29sZWFufVxuICovXG5jb25zdCBERUZBVUxUX1BSRU1VTFRJUExZX0FMUEhBID0gdHJ1ZTtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBtaXBtYXBwaW5nIGlzIGVuYWJsZWQuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtib29sZWFufVxuICovXG5jb25zdCBERUZBVUxUX01JUE1BUCA9IHRydWU7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgZm9yIHdoZXRoZXIgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge2Jvb2xlYW59XG4gKi9cbmNvbnN0IERFRkFVTFRfSU5WRVJUX1kgPSB0cnVlO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IG1pcC1tYXBwaW5nIGZpbHRlciBzdWZmaXguXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtTdHJpbmd9XG4gKi9cbmNvbnN0IERFRkFVTFRfTUlQTUFQX01JTl9GSUxURVJfU1VGRklYID0gJ19NSVBNQVBfTElORUFSJztcblxuLyoqXG4gKiBDaGVja3MgdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIGN1YmVtYXAgYW5kIHRocm93cyBhbiBleGNlcHRpb24gaWZcbiAqIGl0IGRvZXMgbm90IG1lZXQgcmVxdWlyZW1lbnRzLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge1RleHR1cmVDdWJlTWFwfSBjdWJlTWFwIC0gVGhlIGN1YmUgbWFwIHRleHR1cmUgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBjaGVja0RpbWVuc2lvbnMoY3ViZU1hcCkge1xuXHRpZiAodHlwZW9mIGN1YmVNYXAud2lkdGggIT09ICdudW1iZXInIHx8IGN1YmVNYXAud2lkdGggPD0gMCkge1xuXHRcdHRocm93ICdgd2lkdGhgIGFyZ3VtZW50IGlzIG1pc3Npbmcgb3IgaW52YWxpZCc7XG5cdH1cblx0aWYgKHR5cGVvZiBjdWJlTWFwLmhlaWdodCAhPT0gJ251bWJlcicgfHwgY3ViZU1hcC5oZWlnaHQgPD0gMCkge1xuXHRcdHRocm93ICdgaGVpZ2h0YCBhcmd1bWVudCBpcyBtaXNzaW5nIG9yIGludmFsaWQnO1xuXHR9XG5cdGlmIChjdWJlTWFwLndpZHRoICE9PSBjdWJlTWFwLmhlaWdodCkge1xuXHRcdHRocm93ICdQcm92aWRlZCBgd2lkdGhgIG11c3QgYmUgZXF1YWwgdG8gYGhlaWdodGAnO1xuXHR9XG5cdGlmIChVdGlsLm11c3RCZVBvd2VyT2ZUd28oY3ViZU1hcCkgJiYgIVV0aWwuaXNQb3dlck9mVHdvKGN1YmVNYXAud2lkdGgpKSB7XG5cdFx0dGhyb3cgYFBhcmFtZXRlcnMgcmVxdWlyZSBhIHBvd2VyLW9mLXR3byB0ZXh0dXJlLCB5ZXQgcHJvdmlkZWQgc2l6ZSBvZiAke2N1YmVNYXAud2lkdGh9IGlzIG5vdCBhIHBvd2VyIG9mIHR3b2A7XG5cdH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBhIGZhY2UgZnJvbSBhIHVybC5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtUZXh0dXJlQ3ViZU1hcH0gY3ViZU1hcCAtIFRoZSBjdWJlIG1hcCB0ZXh0dXJlIG9iamVjdC5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXQgLSBUaGUgdGV4dHVyZSB0YXJnZXQuXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gVGhlIHVybCB0byBsb2FkIHRoZSBmYWNlIGZyb20uXG4gKlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBsb2FkZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGxvYWRGYWNlVVJMKGN1YmVNYXAsIHRhcmdldCwgdXJsKSB7XG5cdHJldHVybiBmdW5jdGlvbihkb25lKSB7XG5cdFx0Ly8gVE9ETzogcHV0IGV4dGVuc2lvbiBoYW5kbGluZyBmb3IgYXJyYXlidWZmZXIgLyBpbWFnZSAvIHZpZGVvIGRpZmZlcmVudGlhdGlvblxuXHRcdEltYWdlTG9hZGVyLmxvYWQoe1xuXHRcdFx0dXJsOiB1cmwsXG5cdFx0XHRzdWNjZXNzOiBpbWFnZSA9PiB7XG5cdFx0XHRcdGltYWdlID0gVXRpbC5yZXNpemVDYW52YXMoY3ViZU1hcCwgaW1hZ2UpO1xuXHRcdFx0XHRjdWJlTWFwLmJ1ZmZlckRhdGEodGFyZ2V0LCBpbWFnZSk7XG5cdFx0XHRcdGRvbmUobnVsbCk7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGVyciA9PiB7XG5cdFx0XHRcdGRvbmUoZXJyLCBudWxsKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBhIGZhY2UgZnJvbSBhIGNhbnZhcyB0eXBlIG9iamVjdC5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtUZXh0dXJlQ3ViZU1hcH0gY3ViZU1hcCAtIFRoZSBjdWJlIG1hcCB0ZXh0dXJlIG9iamVjdC5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXQgLSBUaGUgdGV4dHVyZSB0YXJnZXQuXG4gKiBAcGFyYW0ge0ltYWdlRGF0YXxIVE1MSW1hZ2VFbGVtZW50fEhUTUxDYW52YXNFbGVtZW50fEhUTUxWaWRlb0VsZW1lbnR9IGNhbnZhcyAtIFRoZSBjYW52YXMgdHlwZSBvYmplY3QuXG4gKlxuICogQHJldHVybiB7RnVuY3Rpb259IC0gVGhlIGxvYWRlciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gbG9hZEZhY2VDYW52YXMoY3ViZU1hcCwgdGFyZ2V0LCBjYW52YXMpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGRvbmUpIHtcblx0XHRjYW52YXMgPSBVdGlsLnJlc2l6ZUNhbnZhcyhjdWJlTWFwLCBjYW52YXMpO1xuXHRcdGN1YmVNYXAuYnVmZmVyRGF0YSh0YXJnZXQsIGNhbnZhcyk7XG5cdFx0ZG9uZShudWxsKTtcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBhIGZhY2UgZnJvbSBhbiBhcnJheSB0eXBlIG9iamVjdC5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtUZXh0dXJlQ3ViZU1hcH0gY3ViZU1hcCAtIFRoZSBjdWJlIG1hcCB0ZXh0dXJlIG9iamVjdC5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXQgLSBUaGUgdGV4dHVyZSB0YXJnZXQuXG4gKiBAcGFyYW0ge0FycmF5fEFycmF5QnVmZmVyfEFycmF5QnVmZmVyVmlld30gYXJyIC0gVGhlIGFycmF5IHR5cGUgb2JqZWN0LlxuICpcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgbG9hZGVyIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBsb2FkRmFjZUFycmF5KGN1YmVNYXAsIHRhcmdldCwgYXJyKSB7XG5cdGNoZWNrRGltZW5zaW9ucyhjdWJlTWFwKTtcblx0cmV0dXJuIGZ1bmN0aW9uKGRvbmUpIHtcblx0XHRjdWJlTWFwLmJ1ZmZlckRhdGEodGFyZ2V0LCBhcnIpO1xuXHRcdGRvbmUobnVsbCk7XG5cdH07XG59XG5cbi8qKlxuICogQGNsYXNzIFRleHR1cmVDdWJlTWFwXG4gKiBAY2xhc3NkZXNjIEEgdGV4dHVyZSBjbGFzcyB0byByZXByZXNlbnQgYSBjdWJlIG1hcCB0ZXh0dXJlLlxuICovXG5jbGFzcyBUZXh0dXJlQ3ViZU1hcCB7XG5cblx0LyoqXG5cdCAqIEluc3RhbnRpYXRlcyBhIFRleHR1cmVDdWJlTWFwIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgc3BlY2lmaWNhdGlvbiBhcmd1bWVudHNcblx0ICogQHBhcmFtIHtPYmplY3R9IHNwZWMuZmFjZXMgLSBUaGUgZmFjZXMgdG8gYnVmZmVyLCB1bmRlciBrZXlzICcreCcsICcreScsICcreicsICcteCcsICcteScsIGFuZCAnLXonLlxuXHQgKiBAcGFyYW0ge051bWJlcn0gc3BlYy53aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgZmFjZXMuXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBzcGVjLmhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIGZhY2VzLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cblx0ICogQHBhcmFtIHtib29sfSBzcGVjLm1pcE1hcCAtIFdoZXRoZXIgb3Igbm90IG1pcC1tYXBwaW5nIGlzIGVuYWJsZWQuXG5cdCAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5pbnZlcnRZIC0gV2hldGhlciBvciBub3QgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cblx0ICogQHBhcmFtIHtib29sfSBzcGVjLnByZW11bHRpcGx5QWxwaGEgLSBXaGV0aGVyIG9yIG5vdCBhbHBoYSBwcmVtdWx0aXBseWluZyBpcyBlbmFibGVkLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5mb3JtYXQgLSBUaGUgdGV4dHVyZSBwaXhlbCBmb3JtYXQuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnR5cGUgLSBUaGUgdGV4dHVyZSBwaXhlbCBjb21wb25lbnQgdHlwZS5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHNwZWMgPSB7fSwgY2FsbGJhY2sgPSBudWxsKSB7XG5cdFx0dGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcblx0XHR0aGlzLnRleHR1cmUgPSBudWxsO1xuXHRcdC8vIGdldCBzcGVjaWZpYyBwYXJhbXNcblx0XHRzcGVjLndyYXBTID0gc3BlYy53cmFwUyB8fCBzcGVjLndyYXA7XG5cdFx0c3BlYy53cmFwVCA9IHNwZWMud3JhcFQgfHwgc3BlYy53cmFwO1xuXHRcdHNwZWMubWluRmlsdGVyID0gc3BlYy5taW5GaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XG5cdFx0c3BlYy5tYWdGaWx0ZXIgPSBzcGVjLm1hZ0ZpbHRlciB8fCBzcGVjLmZpbHRlcjtcblx0XHQvLyBzZXQgdGV4dHVyZSBwYXJhbXNcblx0XHR0aGlzLndyYXBTID0gV1JBUF9NT0RFU1tzcGVjLndyYXBTXSA/IHNwZWMud3JhcFMgOiBERUZBVUxUX1dSQVA7XG5cdFx0dGhpcy53cmFwVCA9IFdSQVBfTU9ERVNbc3BlYy53cmFwVF0gPyBzcGVjLndyYXBUIDogREVGQVVMVF9XUkFQO1xuXHRcdHRoaXMubWluRmlsdGVyID0gTUlOX0ZJTFRFUlNbc3BlYy5taW5GaWx0ZXJdID8gc3BlYy5taW5GaWx0ZXIgOiBERUZBVUxUX0ZJTFRFUjtcblx0XHR0aGlzLm1hZ0ZpbHRlciA9IE1BR19GSUxURVJTW3NwZWMubWFnRmlsdGVyXSA/IHNwZWMubWFnRmlsdGVyIDogREVGQVVMVF9GSUxURVI7XG5cdFx0Ly8gc2V0IG90aGVyIHByb3BlcnRpZXNcblx0XHR0aGlzLm1pcE1hcCA9IHNwZWMubWlwTWFwICE9PSB1bmRlZmluZWQgPyBzcGVjLm1pcE1hcCA6IERFRkFVTFRfTUlQTUFQO1xuXHRcdHRoaXMuaW52ZXJ0WSA9IHNwZWMuaW52ZXJ0WSAhPT0gdW5kZWZpbmVkID8gc3BlYy5pbnZlcnRZIDogREVGQVVMVF9JTlZFUlRfWTtcblx0XHR0aGlzLnByZW11bHRpcGx5QWxwaGEgPSBzcGVjLnByZW11bHRpcGx5QWxwaGEgIT09IHVuZGVmaW5lZCA/IHNwZWMucHJlbXVsdGlwbHlBbHBoYSA6IERFRkFVTFRfUFJFTVVMVElQTFlfQUxQSEE7XG5cdFx0Ly8gc2V0IGZvcm1hdCBhbmQgdHlwZVxuXHRcdHRoaXMuZm9ybWF0ID0gRk9STUFUU1tzcGVjLmZvcm1hdF0gPyBzcGVjLmZvcm1hdCA6IERFRkFVTFRfRk9STUFUO1xuXHRcdHRoaXMudHlwZSA9IHNwZWMudHlwZSB8fCBERUZBVUxUX1RZUEU7XG5cdFx0aWYgKHRoaXMudHlwZSA9PT0gJ0ZMT0FUJyAmJiAhV2ViR0xDb250ZXh0LmNoZWNrRXh0ZW5zaW9uKCdPRVNfdGV4dHVyZV9mbG9hdCcpKSB7XG5cdFx0XHR0aHJvdyAnQ2Fubm90IGNyZWF0ZSBUZXh0dXJlMkQgb2YgdHlwZSBgRkxPQVRgIGFzIGBPRVNfdGV4dHVyZV9mbG9hdGAgZXh0ZW5zaW9uIGlzIHVuc3VwcG9ydGVkJztcblx0XHR9XG5cdFx0Ly8gc2V0IGRpbWVuc2lvbnMgaWYgcHJvdmlkZWRcblx0XHR0aGlzLndpZHRoID0gc3BlYy53aWR0aDtcblx0XHR0aGlzLmhlaWdodCA9IHNwZWMuaGVpZ2h0O1xuXHRcdC8vIHNldCBidWZmZXJlZCBmYWNlc1xuXHRcdHRoaXMuYnVmZmVyZWRGYWNlcyA9IFtdO1xuXHRcdC8vIGNyZWF0ZSBjdWJlIG1hcCBiYXNlZCBvbiBpbnB1dFxuXHRcdGlmIChzcGVjLmZhY2VzKSB7XG5cdFx0XHRjb25zdCB0YXNrcyA9IFtdO1xuXHRcdFx0RkFDRVMuZm9yRWFjaChpZCA9PiB7XG5cdFx0XHRcdGNvbnN0IGZhY2UgPSBzcGVjLmZhY2VzW2lkXTtcblx0XHRcdFx0Y29uc3QgdGFyZ2V0ID0gRkFDRV9UQVJHRVRTW2lkXTtcblx0XHRcdFx0Ly8gbG9hZCBiYXNlZCBvbiB0eXBlXG5cdFx0XHRcdGlmICh0eXBlb2YgZmFjZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHQvLyB1cmxcblx0XHRcdFx0XHR0YXNrcy5wdXNoKGxvYWRGYWNlVVJMKHRoaXMsIHRhcmdldCwgZmFjZSkpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKFV0aWwuaXNDYW52YXNUeXBlKGZhY2UpKSB7XG5cdFx0XHRcdFx0Ly8gY2FudmFzXG5cdFx0XHRcdFx0dGFza3MucHVzaChsb2FkRmFjZUNhbnZhcyh0aGlzLCB0YXJnZXQsIGZhY2UpKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBhcnJheSAvIGFycmF5YnVmZmVyIG9yIG51bGxcblx0XHRcdFx0XHR0YXNrcy5wdXNoKGxvYWRGYWNlQXJyYXkodGhpcywgdGFyZ2V0LCBmYWNlKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cGFyYWxsZWwodGFza3MsIGVyciA9PiB7XG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRpZiAoY2FsbGJhY2spIHtcblx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRjYWxsYmFjayhlcnIsIG51bGwpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBzZXQgcGFyYW1ldGVyc1xuXHRcdFx0XHR0aGlzLnNldFBhcmFtZXRlcnModGhpcyk7XG5cdFx0XHRcdGlmIChjYWxsYmFjaykge1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgdGhpcyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBudWxsXG5cdFx0XHRjaGVja0RpbWVuc2lvbnModGhpcyk7XG5cdFx0XHRGQUNFUy5mb3JFYWNoKGlkID0+IHtcblx0XHRcdFx0dGhpcy5idWZmZXJEYXRhKEZBQ0VfVEFSR0VUU1tpZF0sIG51bGwpO1xuXHRcdFx0fSk7XG5cdFx0XHQvLyBzZXQgcGFyYW1ldGVyc1xuXHRcdFx0dGhpcy5zZXRQYXJhbWV0ZXJzKHRoaXMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBCaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QgdG8gdGhlIHByb3ZpZGVkIHRleHR1cmUgdW5pdCBsb2NhdGlvbi5cblx0ICpcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGxvY2F0aW9uIC0gVGhlIHRleHR1cmUgdW5pdCBsb2NhdGlvbiBpbmRleC4gRGVmYXVsdHMgdG8gMC5cblx0ICpcblx0ICogQHJldHVybiB7VGV4dHVyZUN1YmVNYXB9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0YmluZChsb2NhdGlvbiA9IDApIHtcblx0XHRpZiAoIU51bWJlci5pc0ludGVnZXIobG9jYXRpb24pIHx8IGxvY2F0aW9uIDwgMCkge1xuXHRcdFx0dGhyb3cgJ1RleHR1cmUgdW5pdCBsb2NhdGlvbiBpcyBpbnZhbGlkJztcblx0XHR9XG5cdFx0Ly8gYmluZCBjdWJlIG1hcCB0ZXh0dXJlXG5cdFx0Y29uc3QgZ2wgPSB0aGlzLmdsO1xuXHRcdGdsLmFjdGl2ZVRleHR1cmUoZ2xbJ1RFWFRVUkUnICsgbG9jYXRpb25dKTtcblx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCB0aGlzLnRleHR1cmUpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVuYmluZHMgdGhlIHRleHR1cmUgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtUZXh0dXJlQ3ViZU1hcH0gLSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHVuYmluZCgpIHtcblx0XHQvLyB1bmJpbmQgY3ViZSBtYXAgdGV4dHVyZVxuXHRcdGNvbnN0IGdsID0gdGhpcy5nbDtcblx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCBudWxsKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBCdWZmZXIgZGF0YSBpbnRvIHRoZSByZXNwZWN0aXZlIGN1YmUgbWFwIGZhY2UuXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXQgLSBUaGUgZmFjZSB0YXJnZXQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fG51bGx9IGRhdGEgLSBUaGUgZmFjZSBkYXRhLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtUZXh0dXJlQ3ViZU1hcH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRidWZmZXJEYXRhKHRhcmdldCwgZGF0YSkge1xuXHRcdGlmICghVEFSR0VUU1t0YXJnZXRdKSB7XG5cdFx0XHR0aHJvdyBgUHJvdmlkZWQgXFxgdGFyZ2V0XFxgIG9mICR7dGFyZ2V0fSAgaXMgaW52YWxpZGA7XG5cdFx0fVxuXHRcdGNvbnN0IGdsID0gdGhpcy5nbDtcblx0XHQvLyBjcmVhdGUgdGV4dHVyZSBvYmplY3QgaWYgaXQgZG9lc24ndCBhbHJlYWR5IGV4aXN0XG5cdFx0aWYgKCF0aGlzLnRleHR1cmUpIHtcblx0XHRcdHRoaXMudGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcblx0XHR9XG5cdFx0Ly8gYmluZCB0ZXh0dXJlXG5cdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGhpcy50ZXh0dXJlKTtcblx0XHQvLyBpbnZlcnQgeSBpZiBzcGVjaWZpZWRcblx0XHRnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCB0aGlzLmludmVydFkpO1xuXHRcdC8vIHByZW11bHRpcGx5IGFscGhhIGlmIHNwZWNpZmllZFxuXHRcdGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCwgdGhpcy5wcmVtdWx0aXBseUFscGhhKTtcblx0XHQvLyBjYXN0IGFycmF5IGFyZ1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG5cdFx0XHRpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfU0hPUlQnKSB7XG5cdFx0XHRcdGRhdGEgPSBuZXcgVWludDE2QXJyYXkoZGF0YSk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX0lOVCcpIHtcblx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50MzJBcnJheShkYXRhKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnRkxPQVQnKSB7XG5cdFx0XHRcdGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KGRhdGEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGF0YSA9IG5ldyBVaW50OEFycmF5KGRhdGEpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBzZXQgZW5zdXJlIHR5cGUgY29ycmVzcG9uZHMgdG8gZGF0YVxuXHRcdGlmIChkYXRhIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuXHRcdFx0dGhpcy50eXBlID0gJ1VOU0lHTkVEX0JZVEUnO1xuXHRcdH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIFVpbnQxNkFycmF5KSB7XG5cdFx0XHR0aGlzLnR5cGUgPSAnVU5TSUdORURfU0hPUlQnO1xuXHRcdH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIFVpbnQzMkFycmF5KSB7XG5cdFx0XHR0aGlzLnR5cGUgPSAnVU5TSUdORURfSU5UJztcblx0XHR9IGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkpIHtcblx0XHRcdHRoaXMudHlwZSA9ICdGTE9BVCc7XG5cdFx0fSBlbHNlIGlmIChkYXRhICYmICEoZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSAmJiAhVXRpbC5pc0NhbnZhc1R5cGUoZGF0YSkpIHtcblx0XHRcdHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgJyArXG5cdFx0XHRcdCdgQXJyYXlCdWZmZXJWaWV3YCwgYEltYWdlRGF0YWAsIGBIVE1MSW1hZ2VFbGVtZW50YCwgJyArXG5cdFx0XHRcdCdgSFRNTENhbnZhc0VsZW1lbnRgLCBgSFRNTFZpZGVvRWxlbWVudGAsIG9yIG51bGwnO1xuXHRcdH1cblx0XHQvLyBidWZmZXIgdGhlIGRhdGFcblx0XHRpZiAoVXRpbC5pc0NhbnZhc1R5cGUoZGF0YSkpIHtcblx0XHRcdC8vIHN0b3JlIHdpZHRoIGFuZCBoZWlnaHRcblx0XHRcdHRoaXMud2lkdGggPSBkYXRhLndpZHRoO1xuXHRcdFx0dGhpcy5oZWlnaHQgPSBkYXRhLmhlaWdodDtcblx0XHRcdC8vIGJ1ZmZlciB0aGUgdGV4dHVyZVxuXHRcdFx0Z2wudGV4SW1hZ2UyRChcblx0XHRcdFx0Z2xbdGFyZ2V0XSxcblx0XHRcdFx0MCwgLy8gbWlwLW1hcCBsZXZlbCxcblx0XHRcdFx0Z2xbdGhpcy5mb3JtYXRdLCAvLyB3ZWJnbCByZXF1aXJlcyBmb3JtYXQgPT09IGludGVybmFsRm9ybWF0XG5cdFx0XHRcdGdsW3RoaXMuZm9ybWF0XSxcblx0XHRcdFx0Z2xbdGhpcy50eXBlXSxcblx0XHRcdFx0ZGF0YSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIGJ1ZmZlciB0aGUgdGV4dHVyZSBkYXRhXG5cdFx0XHRnbC50ZXhJbWFnZTJEKFxuXHRcdFx0XHRnbFt0YXJnZXRdLFxuXHRcdFx0XHQwLCAvLyBtaXAtbWFwIGxldmVsXG5cdFx0XHRcdGdsW3RoaXMuZm9ybWF0XSwgLy8gd2ViZ2wgcmVxdWlyZXMgZm9ybWF0ID09PSBpbnRlcm5hbEZvcm1hdFxuXHRcdFx0XHR0aGlzLndpZHRoLFxuXHRcdFx0XHR0aGlzLmhlaWdodCxcblx0XHRcdFx0MCwgLy8gYm9yZGVyLCBtdXN0IGJlIDBcblx0XHRcdFx0Z2xbdGhpcy5mb3JtYXRdLFxuXHRcdFx0XHRnbFt0aGlzLnR5cGVdLFxuXHRcdFx0XHRkYXRhKTtcblx0XHR9XG5cdFx0Ly8gdHJhY2sgdGhlIGZhY2UgdGhhdCB3YXMgYnVmZmVyZWRcblx0XHRpZiAodGhpcy5idWZmZXJlZEZhY2VzLmluZGV4T2YodGFyZ2V0KSA8IDApIHtcblx0XHRcdHRoaXMuYnVmZmVyZWRGYWNlcy5wdXNoKHRhcmdldCk7XG5cdFx0fVxuXHRcdC8vIGlmIGFsbCBmYWNlcyBidWZmZXJlZCwgZ2VuZXJhdGUgbWlwbWFwc1xuXHRcdGlmICh0aGlzLm1pcE1hcCAmJiB0aGlzLmJ1ZmZlcmVkRmFjZXMubGVuZ3RoID09PSA2KSB7XG5cdFx0XHQvLyBvbmx5IGdlbmVyYXRlIG1pcG1hcHMgaWYgYWxsIGZhY2VzIGFyZSBidWZmZXJlZFxuXHRcdFx0Z2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV9DVUJFX01BUCk7XG5cdFx0fVxuXHRcdC8vIHVuYmluZCB0ZXh0dXJlXG5cdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgbnVsbCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHRoZSB0ZXh0dXJlIHBhcmFtZXRlcnMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBUaGUgcGFyYW1ldGVycyBieSBuYW1lLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLndyYXAgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIGJvdGggUyBhbmQgVCBkaW1lbnNpb24uXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMud3JhcFMgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBTIGRpbWVuc2lvbi5cblx0ICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLmZpbHRlciAtIFRoZSBtaW4gLyBtYWcgZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMubWluRmlsdGVyIC0gVGhlIG1pbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cblx0ICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cblx0ICpcblx0ICogQHJldHVybiB7VGV4dHVyZUN1YmVNYXB9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0c2V0UGFyYW1ldGVycyhwYXJhbXMpIHtcblx0XHRjb25zdCBnbCA9IHRoaXMuZ2w7XG5cdFx0Ly8gYmluZCB0ZXh0dXJlXG5cdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGhpcy50ZXh0dXJlKTtcblx0XHQvLyBzZXQgd3JhcCBTIHBhcmFtZXRlclxuXHRcdGxldCBwYXJhbSA9IHBhcmFtcy53cmFwUyB8fCBwYXJhbXMud3JhcDtcblx0XHRpZiAocGFyYW0pIHtcblx0XHRcdGlmIChXUkFQX01PREVTW3BhcmFtXSkge1xuXHRcdFx0XHR0aGlzLndyYXBTID0gcGFyYW07XG5cdFx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsW3RoaXMud3JhcFNdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgXFxgVEVYVFVSRV9XUkFQX1NcXGBgO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBzZXQgd3JhcCBUIHBhcmFtZXRlclxuXHRcdHBhcmFtID0gcGFyYW1zLndyYXBUIHx8IHBhcmFtcy53cmFwO1xuXHRcdGlmIChwYXJhbSkge1xuXHRcdFx0aWYgKFdSQVBfTU9ERVNbcGFyYW1dKSB7XG5cdFx0XHRcdHRoaXMud3JhcFQgPSBwYXJhbTtcblx0XHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfVCwgZ2xbdGhpcy53cmFwVF0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgYFRleHR1cmUgcGFyYW1ldGVyIFxcYCR7cGFyYW19XFxgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBcXGBURVhUVVJFX1dSQVBfVFxcYGA7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIHNldCBtYWcgZmlsdGVyIHBhcmFtZXRlclxuXHRcdHBhcmFtID0gcGFyYW1zLm1hZ0ZpbHRlciB8fCBwYXJhbXMuZmlsdGVyO1xuXHRcdGlmIChwYXJhbSkge1xuXHRcdFx0aWYgKE1BR19GSUxURVJTW3BhcmFtXSkge1xuXHRcdFx0XHR0aGlzLm1hZ0ZpbHRlciA9IHBhcmFtO1xuXHRcdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2xbdGhpcy5tYWdGaWx0ZXJdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgJ1RFWFRVUkVfTUFHX0ZJTFRFUlxcYGA7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIHNldCBtaW4gZmlsdGVyIHBhcmFtZXRlclxuXHRcdHBhcmFtID0gcGFyYW1zLm1pbkZpbHRlciB8fCBwYXJhbXMuZmlsdGVyO1xuXHRcdGlmIChwYXJhbSkge1xuXHRcdFx0aWYgKHRoaXMubWlwTWFwKSB7XG5cdFx0XHRcdGlmIChOT05fTUlQTUFQX01JTl9GSUxURVJTW3BhcmFtXSkge1xuXHRcdFx0XHRcdC8vIHVwZ3JhZGUgdG8gbWlwLW1hcCBtaW4gZmlsdGVyXG5cdFx0XHRcdFx0cGFyYW0gKz0gREVGQVVMVF9NSVBNQVBfTUlOX0ZJTFRFUl9TVUZGSVg7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKE1JUE1BUF9NSU5fRklMVEVSU1twYXJhbV0pIHtcblx0XHRcdFx0XHR0aGlzLm1pbkZpbHRlciA9IHBhcmFtO1xuXHRcdFx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbFt0aGlzLm1pbkZpbHRlcl0pO1xuXHRcdFx0XHR9IGVsc2UgIHtcblx0XHRcdFx0XHR0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIFxcYFRFWFRVUkVfTUlOX0ZJTFRFUlxcYGA7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChNSU5fRklMVEVSU1twYXJhbV0pIHtcblx0XHRcdFx0XHR0aGlzLm1pbkZpbHRlciA9IHBhcmFtO1xuXHRcdFx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbFt0aGlzLm1pbkZpbHRlcl0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgXFxgVEVYVFVSRV9NSU5fRklMVEVSXFxgYDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyB1bmJpbmQgdGV4dHVyZVxuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIG51bGwpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGV4dHVyZUN1YmVNYXA7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0Jyk7XG5cbmNvbnN0IE1PREVTID0ge1xuXHRQT0lOVFM6IHRydWUsXG5cdExJTkVTOiB0cnVlLFxuXHRMSU5FX1NUUklQOiB0cnVlLFxuXHRMSU5FX0xPT1A6IHRydWUsXG5cdFRSSUFOR0xFUzogdHJ1ZSxcblx0VFJJQU5HTEVfU1RSSVA6IHRydWUsXG5cdFRSSUFOR0xFX0ZBTjogdHJ1ZVxufTtcbmNvbnN0IFRZUEVTID0ge1xuXHRCWVRFOiB0cnVlLFxuXHRVTlNJR05FRF9CWVRFOiB0cnVlLFxuXHRTSE9SVDogdHJ1ZSxcblx0VU5TSUdORURfU0hPUlQ6IHRydWUsXG5cdEZJWEVEOiB0cnVlLFxuXHRGTE9BVDogdHJ1ZVxufTtcbmNvbnN0IEJZVEVTX1BFUl9UWVBFID0ge1xuXHRCWVRFOiAxLFxuXHRVTlNJR05FRF9CWVRFOiAxLFxuXHRTSE9SVDogMixcblx0VU5TSUdORURfU0hPUlQ6IDIsXG5cdEZJWEVEOiA0LFxuXHRGTE9BVDogNFxufTtcbmNvbnN0IFNJWkVTID0ge1xuXHQxOiB0cnVlLFxuXHQyOiB0cnVlLFxuXHQzOiB0cnVlLFxuXHQ0OiB0cnVlXG59O1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGF0dHJpYnV0ZSBwb2ludCBieXRlIG9mZnNldC5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge051bWJlcn1cbiAqL1xuY29uc3QgREVGQVVMVF9CWVRFX09GRlNFVCA9IDA7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgcmVuZGVyIG1vZGUgKHByaW1pdGl2ZSB0eXBlKS5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RhbnQge1N0cmluZ31cbiAqL1xuY29uc3QgREVGQVVMVF9NT0RFID0gJ1RSSUFOR0xFUyc7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgaW5kZXggb2Zmc2V0IHRvIHJlbmRlciBmcm9tLlxuICogQHByaXZhdGVcbiAqIEBjb25zdGFudCB7TnVtYmVyfVxuICovXG5jb25zdCBERUZBVUxUX0lOREVYX09GRlNFVCA9IDA7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgY291bnQgb2YgaW5kaWNlcyB0byByZW5kZXIuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0YW50IHtOdW1iZXJ9XG4gKi9cbmNvbnN0IERFRkFVTFRfQ09VTlQgPSAwO1xuXG4vKipcbiAqIFBhcnNlIHRoZSBhdHRyaWJ1dGUgcG9pbnRlcnMgYW5kIGRldGVybWluZSB0aGUgYnl0ZSBzdHJpZGUgb2YgdGhlIGJ1ZmZlci5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtNYXB9IGF0dHJpYnV0ZVBvaW50ZXJzIC0gVGhlIGF0dHJpYnV0ZSBwb2ludGVyIG1hcC5cbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBieXRlIHN0cmlkZSBvZiB0aGUgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBnZXRTdHJpZGUoYXR0cmlidXRlUG9pbnRlcnMpIHtcblx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUgYXR0cmlidXRlIHBvaW50ZXIgYXNzaWduZWQgdG8gdGhpcyBidWZmZXIsXG5cdC8vIHRoZXJlIGlzIG5vIG5lZWQgZm9yIHN0cmlkZSwgc2V0IHRvIGRlZmF1bHQgb2YgMFxuXHRpZiAoYXR0cmlidXRlUG9pbnRlcnMuc2l6ZSA9PT0gMSkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cdGxldCBtYXhCeXRlT2Zmc2V0ID0gMDtcblx0bGV0IGJ5dGVTaXplU3VtID0gMDtcblx0bGV0IGJ5dGVTdHJpZGUgPSAwO1xuXHRhdHRyaWJ1dGVQb2ludGVycy5mb3JFYWNoKHBvaW50ZXIgPT4ge1xuXHRcdGNvbnN0IGJ5dGVPZmZzZXQgPSBwb2ludGVyLmJ5dGVPZmZzZXQ7XG5cdFx0Y29uc3Qgc2l6ZSA9IHBvaW50ZXIuc2l6ZTtcblx0XHRjb25zdCB0eXBlID0gcG9pbnRlci50eXBlO1xuXHRcdC8vIHRyYWNrIHRoZSBzdW0gb2YgZWFjaCBhdHRyaWJ1dGUgc2l6ZVxuXHRcdGJ5dGVTaXplU3VtICs9IHNpemUgKiBCWVRFU19QRVJfVFlQRVt0eXBlXTtcblx0XHQvLyB0cmFjayB0aGUgbGFyZ2VzdCBvZmZzZXQgdG8gZGV0ZXJtaW5lIHRoZSBieXRlIHN0cmlkZSBvZiB0aGUgYnVmZmVyXG5cdFx0aWYgKGJ5dGVPZmZzZXQgPiBtYXhCeXRlT2Zmc2V0KSB7XG5cdFx0XHRtYXhCeXRlT2Zmc2V0ID0gYnl0ZU9mZnNldDtcblx0XHRcdGJ5dGVTdHJpZGUgPSBieXRlT2Zmc2V0ICsgKHNpemUgKiBCWVRFU19QRVJfVFlQRVt0eXBlXSk7XG5cdFx0fVxuXHR9KTtcblx0Ly8gY2hlY2sgaWYgdGhlIG1heCBieXRlIG9mZnNldCBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHRoZSBzdW0gb2Zcblx0Ly8gdGhlIHNpemVzLiBJZiBzbyB0aGlzIGJ1ZmZlciBpcyBub3QgaW50ZXJsZWF2ZWQgYW5kIGRvZXMgbm90IG5lZWQgYVxuXHQvLyBzdHJpZGUuXG5cdGlmIChtYXhCeXRlT2Zmc2V0ID49IGJ5dGVTaXplU3VtKSB7XG5cdFx0Ly8gVE9ETzogdGVzdCB3aGF0IHN0cmlkZSA9PT0gMCBkb2VzIGZvciBhbiBpbnRlcmxlYXZlZCBidWZmZXIgb2Zcblx0XHQvLyBsZW5ndGggPT09IDEuXG5cdFx0cmV0dXJuIDA7XG5cdH1cblx0cmV0dXJuIGJ5dGVTdHJpZGU7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGF0dHJpYnV0ZSBwb2ludGVycyB0byBlbnN1cmUgdGhleSBhcmUgdmFsaWQuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVQb2ludGVycyAtIFRoZSBhdHRyaWJ1dGUgcG9pbnRlciBtYXAuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgdmFsaWRhdGVkIGF0dHJpYnV0ZSBwb2ludGVyIG1hcC5cbiAqL1xuZnVuY3Rpb24gZ2V0QXR0cmlidXRlUG9pbnRlcnMoYXR0cmlidXRlUG9pbnRlcnMpIHtcblx0Ly8gcGFyc2UgcG9pbnRlcnMgdG8gZW5zdXJlIHRoZXkgYXJlIHZhbGlkXG5cdGNvbnN0IHBvaW50ZXJzID0gbmV3IE1hcCgpO1xuXHRPYmplY3Qua2V5cyhhdHRyaWJ1dGVQb2ludGVycykuZm9yRWFjaChrZXkgPT4ge1xuXHRcdGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoa2V5LCAxMCk7XG5cdFx0Ly8gY2hlY2sgdGhhdCBrZXkgaXMgYW4gdmFsaWQgaW50ZWdlclxuXHRcdGlmIChpc05hTihpbmRleCkpIHtcblx0XHRcdHRocm93IGBBdHRyaWJ1dGUgaW5kZXggXFxgJHtrZXl9XFxgIGRvZXMgbm90IHJlcHJlc2VudCBhbiBpbnRlZ2VyYDtcblx0XHR9XG5cdFx0Y29uc3QgcG9pbnRlciA9IGF0dHJpYnV0ZVBvaW50ZXJzW2tleV07XG5cdFx0Y29uc3Qgc2l6ZSA9IHBvaW50ZXIuc2l6ZTtcblx0XHRjb25zdCB0eXBlID0gcG9pbnRlci50eXBlO1xuXHRcdGNvbnN0IGJ5dGVPZmZzZXQgPSBwb2ludGVyLmJ5dGVPZmZzZXQ7XG5cdFx0Ly8gY2hlY2sgc2l6ZVxuXHRcdGlmICghU0laRVNbc2l6ZV0pIHtcblx0XHRcdHRocm93ICdBdHRyaWJ1dGUgcG9pbnRlciBgc2l6ZWAgcGFyYW1ldGVyIGlzIGludmFsaWQsIG11c3QgYmUgb25lIG9mICcgK1xuXHRcdFx0XHRKU09OLnN0cmluZ2lmeShPYmplY3Qua2V5cyhTSVpFUykpO1xuXHRcdH1cblx0XHQvLyBjaGVjayB0eXBlXG5cdFx0aWYgKCFUWVBFU1t0eXBlXSkge1xuXHRcdFx0dGhyb3cgJ0F0dHJpYnV0ZSBwb2ludGVyIGB0eXBlYCBwYXJhbWV0ZXIgaXMgaW52YWxpZCwgbXVzdCBiZSBvbmUgb2YgJyArXG5cdFx0XHRcdEpTT04uc3RyaW5naWZ5KE9iamVjdC5rZXlzKFRZUEVTKSk7XG5cdFx0fVxuXHRcdHBvaW50ZXJzLnNldChpbmRleCwge1xuXHRcdFx0c2l6ZTogc2l6ZSxcblx0XHRcdHR5cGU6IHR5cGUsXG5cdFx0XHRieXRlT2Zmc2V0OiAoYnl0ZU9mZnNldCAhPT0gdW5kZWZpbmVkKSA/IGJ5dGVPZmZzZXQgOiBERUZBVUxUX0JZVEVfT0ZGU0VUXG5cdFx0fSk7XG5cdH0pO1xuXHRyZXR1cm4gcG9pbnRlcnM7XG59XG5cbi8qKlxuICogQGNsYXNzIFZlcnRleEJ1ZmZlclxuICogQGNsYXNzZGVzYyBBIHZlcnRleCBidWZmZXIgb2JqZWN0LlxuICovXG5jbGFzcyBWZXJ0ZXhCdWZmZXIge1xuXG5cdC8qKlxuXHQgKiBJbnN0YW50aWF0ZXMgYW4gVmVydGV4QnVmZmVyIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtXZWJHTEJ1ZmZlcnxWZXJ0ZXhQYWNrYWdlfEFycmF5QnVmZmVyfEFycmF5fE51bWJlcn0gYXJnIC0gVGhlIGJ1ZmZlciBvciBsZW5ndGggb2YgdGhlIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZVBvaW50ZXJzIC0gVGhlIGFycmF5IHBvaW50ZXIgbWFwLCBvciBpbiB0aGUgY2FzZSBvZiBhIHZlcnRleCBwYWNrYWdlIGFyZywgdGhlIG9wdGlvbnMuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIHJlbmRlcmluZyBvcHRpb25zLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5tb2RlIC0gVGhlIGRyYXcgbW9kZSAvIHByaW1pdGl2ZSB0eXBlLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5pbmRleE9mZnNldCAtIFRoZSBpbmRleCBvZmZzZXQgaW50byB0aGUgZHJhd24gYnVmZmVyLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5jb3VudCAtIFRoZSBudW1iZXIgb2YgaW5kaWNlcyB0byBkcmF3LlxuXHQgKi9cblx0Y29uc3RydWN0b3IoYXJnLCBhdHRyaWJ1dGVQb2ludGVycyA9IHt9LCBvcHRpb25zID0ge30pIHtcblx0XHR0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xuXHRcdHRoaXMuYnVmZmVyID0gbnVsbDtcblx0XHR0aGlzLm1vZGUgPSBNT0RFU1tvcHRpb25zLm1vZGVdID8gb3B0aW9ucy5tb2RlIDogREVGQVVMVF9NT0RFO1xuXHRcdHRoaXMuY291bnQgPSAob3B0aW9ucy5jb3VudCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuY291bnQgOiBERUZBVUxUX0NPVU5UO1xuXHRcdHRoaXMuaW5kZXhPZmZzZXQgPSAob3B0aW9ucy5pbmRleE9mZnNldCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuaW5kZXhPZmZzZXQgOiBERUZBVUxUX0lOREVYX09GRlNFVDtcblx0XHQvLyBmaXJzdCwgc2V0IHRoZSBhdHRyaWJ1dGUgcG9pbnRlcnNcblx0XHR0aGlzLnBvaW50ZXJzID0gZ2V0QXR0cmlidXRlUG9pbnRlcnMoYXR0cmlidXRlUG9pbnRlcnMpO1xuXHRcdC8vIHNldCB0aGUgYnl0ZSBzdHJpZGVcblx0XHR0aGlzLmJ5dGVTdHJpZGUgPSBnZXRTdHJpZGUodGhpcy5wb2ludGVycyk7XG5cdFx0Ly8gdGhlbiBidWZmZXIgdGhlIGRhdGFcblx0XHRpZiAoYXJnKSB7XG5cdFx0XHRpZiAoYXJnIGluc3RhbmNlb2YgV2ViR0xCdWZmZXIpIHtcblx0XHRcdFx0Ly8gV2ViR0xCdWZmZXIgYXJndW1lbnRcblx0XHRcdFx0dGhpcy5idWZmZXIgPSBhcmc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBBcnJheSBvciBBcnJheUJ1ZmZlciBvciBudW1iZXIgYXJndW1lbnRcblx0XHRcdFx0dGhpcy5idWZmZXJEYXRhKGFyZyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFVwbG9hZCB2ZXJ0ZXggZGF0YSB0byB0aGUgR1BVLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0FycmF5fEFycmF5QnVmZmVyfEFycmF5QnVmZmVyVmlld3xudW1iZXJ9IGFyZyAtIFRoZSBhcnJheSBvZiBkYXRhIHRvIGJ1ZmZlciwgb3Igc2l6ZSBvZiB0aGUgYnVmZmVyIGluIGJ5dGVzLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtWZXJ0ZXhCdWZmZXJ9IFRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0YnVmZmVyRGF0YShhcmcpIHtcblx0XHRjb25zdCBnbCA9IHRoaXMuZ2w7XG5cdFx0Ly8gZW5zdXJlIGFyZ3VtZW50IGlzIHZhbGlkXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHRcdFx0Ly8gY2FzdCBhcnJheSBpbnRvIEZsb2F0MzJBcnJheVxuXHRcdFx0YXJnID0gbmV3IEZsb2F0MzJBcnJheShhcmcpO1xuXHRcdH0gZWxzZSBpZiAoXG5cdFx0XHQhKGFyZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSAmJlxuXHRcdFx0IShBcnJheUJ1ZmZlci5pc1ZpZXcoYXJnKSkgJiZcblx0XHRcdCEoTnVtYmVyLmlzSW50ZWdlcihhcmcpKVxuXHRcdFx0KSB7XG5cdFx0XHQvLyBpZiBub3QgYXJyYXlidWZmZXIgb3IgYSBudW1lcmljIHNpemVcblx0XHRcdHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgYEFycmF5QnVmZmVyVmlld2AsIG9yIGBOdW1iZXJgJztcblx0XHR9XG5cdFx0Ly8gY3JlYXRlIGJ1ZmZlciBpZiBpdCBkb2Vzbid0IGV4aXN0IGFscmVhZHlcblx0XHRpZiAoIXRoaXMuYnVmZmVyKSB7XG5cdFx0XHR0aGlzLmJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXHRcdH1cblx0XHQvLyBidWZmZXIgdGhlIGRhdGFcblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIpO1xuXHRcdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBhcmcsIGdsLlNUQVRJQ19EUkFXKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVcGxvYWQgcGFydGlhbCB2ZXJ0ZXggZGF0YSB0byB0aGUgR1BVLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0FycmF5fEFycmF5QnVmZmVyfSBhcnJheSAtIFRoZSBhcnJheSBvZiBkYXRhIHRvIGJ1ZmZlci5cblx0ICogQHBhcmFtIHtOdW1iZXJ9IGJ5dGVPZmZzZXQgLSBUaGUgYnl0ZSBvZmZzZXQgYXQgd2hpY2ggdG8gYnVmZmVyLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtWZXJ0ZXhCdWZmZXJ9IFRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0YnVmZmVyU3ViRGF0YShhcnJheSwgYnl0ZU9mZnNldCA9IERFRkFVTFRfQllURV9PRkZTRVQpIHtcblx0XHRjb25zdCBnbCA9IHRoaXMuZ2w7XG5cdFx0Ly8gZW5zdXJlIHRoZSBidWZmZXIgZXhpc3RzXG5cdFx0aWYgKCF0aGlzLmJ1ZmZlcikge1xuXHRcdFx0dGhyb3cgJ0J1ZmZlciBoYXMgbm90IHlldCBiZWVuIGFsbG9jYXRlZCwgYWxsb2NhdGUgd2l0aCBgYnVmZmVyRGF0YWAnO1xuXHRcdH1cblx0XHQvLyBlbnN1cmUgYXJndW1lbnQgaXMgdmFsaWRcblx0XHRpZiAoQXJyYXkuaXNBcnJheShhcnJheSkpIHtcblx0XHRcdGFycmF5ID0gbmV3IEZsb2F0MzJBcnJheShhcnJheSk7XG5cdFx0fSBlbHNlIGlmIChcblx0XHRcdCEoYXJyYXkgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikgJiZcblx0XHRcdCFBcnJheUJ1ZmZlci5pc1ZpZXcoYXJyYXkpXG5cdFx0XHQpIHtcblx0XHRcdHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgb3IgYEFycmF5QnVmZmVyVmlld2AnO1xuXHRcdH1cblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIpO1xuXHRcdGdsLmJ1ZmZlclN1YkRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBieXRlT2Zmc2V0LCBhcnJheSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogQmluZHMgdGhlIHZlcnRleCBidWZmZXIgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtWZXJ0ZXhCdWZmZXJ9IC0gUmV0dXJucyB0aGUgdmVydGV4IGJ1ZmZlciBvYmplY3QgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0YmluZCgpIHtcblx0XHRjb25zdCBnbCA9IHRoaXMuZ2w7XG5cdFx0Ly8gYmluZCBidWZmZXJcblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIpO1xuXHRcdC8vIGZvciBlYWNoIGF0dHJpYnV0ZSBwb2ludGVyXG5cdFx0dGhpcy5wb2ludGVycy5mb3JFYWNoKChwb2ludGVyLCBpbmRleCkgPT4ge1xuXHRcdFx0Ly8gc2V0IGF0dHJpYnV0ZSBwb2ludGVyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKFxuXHRcdFx0XHRpbmRleCxcblx0XHRcdFx0cG9pbnRlci5zaXplLFxuXHRcdFx0XHRnbFtwb2ludGVyLnR5cGVdLFxuXHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0dGhpcy5ieXRlU3RyaWRlLFxuXHRcdFx0XHRwb2ludGVyLmJ5dGVPZmZzZXQpO1xuXHRcdFx0Ly8gZW5hYmxlIGF0dHJpYnV0ZSBpbmRleFxuXHRcdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoaW5kZXgpO1xuXHRcdH0pO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVuYmluZHMgdGhlIHZlcnRleCBidWZmZXIgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtWZXJ0ZXhCdWZmZXJ9IFRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0dW5iaW5kKCkge1xuXHRcdGNvbnN0IGdsID0gdGhpcy5nbDtcblx0XHQvLyB1bmJpbmQgYnVmZmVyXG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVyKTtcblx0XHR0aGlzLnBvaW50ZXJzLmZvckVhY2goKHBvaW50ZXIsIGluZGV4KSA9PiB7XG5cdFx0XHQvLyBkaXNhYmxlIGF0dHJpYnV0ZSBpbmRleFxuXHRcdFx0Z2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KGluZGV4KTtcblx0XHR9KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBFeGVjdXRlIHRoZSBkcmF3IGNvbW1hbmQgZm9yIHRoZSBib3VuZCBidWZmZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gcGFzcyB0byAnZHJhd0FycmF5cycuIE9wdGlvbmFsLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5tb2RlIC0gVGhlIGRyYXcgbW9kZSAvIHByaW1pdGl2ZSB0eXBlLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5pbmRleE9mZnNldCAtIFRoZSBpbmRleCBvZmZzZXQgaW50byB0aGUgZHJhd24gYnVmZmVyLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5jb3VudCAtIFRoZSBudW1iZXIgb2YgaW5kaWNlcyB0byBkcmF3LlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtWZXJ0ZXhCdWZmZXJ9IFRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0ZHJhdyhvcHRpb25zID0ge30pIHtcblx0XHRjb25zdCBnbCA9IHRoaXMuZ2w7XG5cdFx0Y29uc3QgbW9kZSA9IGdsW29wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGVdO1xuXHRcdGNvbnN0IGluZGV4T2Zmc2V0ID0gKG9wdGlvbnMuaW5kZXhPZmZzZXQgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmluZGV4T2Zmc2V0IDogdGhpcy5pbmRleE9mZnNldDtcblx0XHRjb25zdCBjb3VudCA9IChvcHRpb25zLmNvdW50ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5jb3VudCA6IHRoaXMuY291bnQ7XG5cdFx0aWYgKGNvdW50ID09PSAwKSB7XG5cdFx0XHR0aHJvdyAnQXR0ZW1wdGluZyB0byBkcmF3IHdpdGggYSBjb3VudCBvZiAwJztcblx0XHR9XG5cdFx0Ly8gZHJhdyBlbGVtZW50c1xuXHRcdGdsLmRyYXdBcnJheXMobW9kZSwgaW5kZXhPZmZzZXQsIGNvdW50KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZlcnRleEJ1ZmZlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgQ09NUE9ORU5UX1RZUEUgPSAnRkxPQVQnO1xuY29uc3QgQllURVNfUEVSX0NPTVBPTkVOVCA9IDQ7XG5cbi8qKlxuICogUmVtb3ZlcyBpbnZhbGlkIGF0dHJpYnV0ZSBhcmd1bWVudHMuIEEgdmFsaWQgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBsZW5ndGggPiAwIGtleSBieSBhIHN0cmluZyByZXByZXNlbnRpbmcgYW4gaW50LlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyAtIFRoZSBtYXAgb2YgdmVydGV4IGF0dHJpYnV0ZXMuXG4gKlxuICogQHJldHVybiB7QXJyYXl9IFRoZSB2YWxpZCBhcnJheSBvZiBhcmd1bWVudHMuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlQXR0cmlidXRlTWFwKGF0dHJpYnV0ZXMpIHtcblx0Y29uc3QgZ29vZEF0dHJpYnV0ZXMgPSBbXTtcblx0T2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChrZXkgPT4ge1xuXHRcdGNvbnN0IGluZGV4ID0gcGFyc2VGbG9hdChrZXkpO1xuXHRcdC8vIGNoZWNrIHRoYXQga2V5IGlzIGFuIHZhbGlkIGludGVnZXJcblx0XHRpZiAoIU51bWJlci5pc0ludGVnZXIoaW5kZXgpIHx8IGluZGV4IDwgMCkge1xuXHRcdFx0dGhyb3cgYEF0dHJpYnV0ZSBpbmRleCBcXGAke2tleX1cXGAgZG9lcyBub3QgcmVwcmVzZW50IGEgdmFsaWQgaW50ZWdlcmA7XG5cdFx0fVxuXHRcdGNvbnN0IHZlcnRpY2VzID0gYXR0cmlidXRlc1trZXldO1xuXHRcdC8vIGVuc3VyZSBhdHRyaWJ1dGUgaXMgdmFsaWRcblx0XHRpZiAoQXJyYXkuaXNBcnJheSh2ZXJ0aWNlcykgJiYgdmVydGljZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0Ly8gYWRkIGF0dHJpYnV0ZSBkYXRhIGFuZCBpbmRleFxuXHRcdFx0Z29vZEF0dHJpYnV0ZXMucHVzaCh7XG5cdFx0XHRcdGluZGV4OiBpbmRleCxcblx0XHRcdFx0ZGF0YTogdmVydGljZXNcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBgRXJyb3IgcGFyc2luZyBhdHRyaWJ1dGUgb2YgaW5kZXggXFxgJHtpbmRleH1cXGBgO1xuXHRcdH1cblx0fSk7XG5cdC8vIHNvcnQgYXR0cmlidXRlcyBhc2NlbmRpbmcgYnkgaW5kZXhcblx0Z29vZEF0dHJpYnV0ZXMuc29ydCgoYSwgYikgPT4ge1xuXHRcdHJldHVybiBhLmluZGV4IC0gYi5pbmRleDtcblx0fSk7XG5cdHJldHVybiBnb29kQXR0cmlidXRlcztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgY29tcG9uZW50J3MgYnl0ZSBzaXplLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gY29tcG9uZW50IC0gVGhlIGNvbXBvbmVudCB0byBtZWFzdXJlLlxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gVGhlIGJ5dGUgc2l6ZSBvZiB0aGUgY29tcG9uZW50LlxuICovXG5mdW5jdGlvbiBnZXRDb21wb25lbnRTaXplKGNvbXBvbmVudCkge1xuXHQvLyBjaGVjayBpZiBhcnJheVxuXHRpZiAoQXJyYXkuaXNBcnJheShjb21wb25lbnQpKSB7XG5cdFx0cmV0dXJuIGNvbXBvbmVudC5sZW5ndGg7XG5cdH1cblx0Ly8gY2hlY2sgaWYgdmVjdG9yXG5cdGlmIChjb21wb25lbnQueCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0Ly8gMSBjb21wb25lbnQgdmVjdG9yXG5cdFx0aWYgKGNvbXBvbmVudC55ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdC8vIDIgY29tcG9uZW50IHZlY3RvclxuXHRcdFx0aWYgKGNvbXBvbmVudC56ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Ly8gMyBjb21wb25lbnQgdmVjdG9yXG5cdFx0XHRcdGlmIChjb21wb25lbnQudyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0Ly8gNCBjb21wb25lbnQgdmVjdG9yXG5cdFx0XHRcdFx0cmV0dXJuIDQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIDM7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gMjtcblx0XHR9XG5cdFx0cmV0dXJuIDE7XG5cdH1cblx0Ly8gc2luZ2xlIGNvbXBvbmVudFxuXHRyZXR1cm4gMTtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSB0eXBlLCBzaXplLCBhbmQgb2Zmc2V0IGZvciBlYWNoIGF0dHJpYnV0ZSBpbiB0aGUgYXR0cmlidXRlIGFycmF5IGFsb25nIHdpdGggdGhlIGxlbmd0aCBhbmQgc3RyaWRlIG9mIHRoZSBwYWNrYWdlLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge1ZlcnRleFBhY2thZ2V9IHZlcnRleFBhY2thZ2UgLSBUaGUgVmVydGV4UGFja2FnZSBvYmplY3QuXG4gKiBAcGFyYW0ge0FycmF5fSBhdHRyaWJ1dGVzIFRoZSBhcnJheSBvZiB2ZXJ0ZXggYXR0cmlidXRlcy5cbiAqL1xuZnVuY3Rpb24gc2V0UG9pbnRlcnNBbmRTdHJpZGUodmVydGV4UGFja2FnZSwgYXR0cmlidXRlcykge1xuXHRsZXQgc2hvcnRlc3RBcnJheSA9IE51bWJlci5NQVhfVkFMVUU7XG5cdGxldCBvZmZzZXQgPSAwO1xuXHQvLyBmb3IgZWFjaCBhdHRyaWJ1dGVcblx0YXR0cmlidXRlcy5mb3JFYWNoKHZlcnRpY2VzID0+IHtcblx0XHQvLyBzZXQgc2l6ZSB0byBudW1iZXIgb2YgY29tcG9uZW50cyBpbiB0aGUgYXR0cmlidXRlXG5cdFx0Y29uc3Qgc2l6ZSA9IGdldENvbXBvbmVudFNpemUodmVydGljZXMuZGF0YVswXSk7XG5cdFx0Ly8gbGVuZ3RoIG9mIHRoZSBwYWNrYWdlIHdpbGwgYmUgdGhlIHNob3J0ZXN0IGF0dHJpYnV0ZSBhcnJheSBsZW5ndGhcblx0XHRzaG9ydGVzdEFycmF5ID0gTWF0aC5taW4oc2hvcnRlc3RBcnJheSwgdmVydGljZXMuZGF0YS5sZW5ndGgpO1xuXHRcdC8vIHN0b3JlIHBvaW50ZXIgdW5kZXIgaW5kZXhcblx0XHR2ZXJ0ZXhQYWNrYWdlLnBvaW50ZXJzW3ZlcnRpY2VzLmluZGV4XSA9IHtcblx0XHRcdHR5cGU6IENPTVBPTkVOVF9UWVBFLFxuXHRcdFx0c2l6ZTogc2l6ZSxcblx0XHRcdGJ5dGVPZmZzZXQ6IG9mZnNldCAqIEJZVEVTX1BFUl9DT01QT05FTlRcblx0XHR9O1xuXHRcdC8vIGFjY3VtdWxhdGUgYXR0cmlidXRlIG9mZnNldFxuXHRcdG9mZnNldCArPSBzaXplO1xuXHR9KTtcblx0Ly8gc2V0IHN0cmlkZSB0byB0b3RhbCBvZmZzZXRcblx0dmVydGV4UGFja2FnZS5zdHJpZGUgPSBvZmZzZXQ7IC8vIG5vdCBpbiBieXRlc1xuXHQvLyBzZXQgbGVuZ3RoIG9mIHBhY2thZ2UgdG8gdGhlIHNob3J0ZXN0IGF0dHJpYnV0ZSBhcnJheSBsZW5ndGhcblx0dmVydGV4UGFja2FnZS5sZW5ndGggPSBzaG9ydGVzdEFycmF5O1xufVxuXG4vKipcbiAqIEZpbGwgdGhlIGFycmF5YnVmZmVyIHdpdGggYSBzaW5nbGUgY29tcG9uZW50IGF0dHJpYnV0ZS5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IGJ1ZmZlciAtIFRoZSBhcnJheWJ1ZmZlciB0byBmaWxsLlxuICogQHBhcmFtIHtBcnJheX0gdmVydGljZXMgLSBUaGUgdmVydGV4IGF0dHJpYnV0ZSBhcnJheSB0byBjb3B5IGZyb20uXG4gKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgYnVmZmVyIHRvIGNvcHkgZnJvbS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgLSBUaGUgb2Zmc2V0IHRvIHRoZSBhdHRyaWJ1dGUsIG5vdCBpbiBieXRlcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBzdHJpZGUgLSBUaGUgc3RyaWRlIG9mIHRoZSBidWZmZXIsIG5vdCBpbiBieXRlcy5cbiAqL1xuZnVuY3Rpb24gc2V0MUNvbXBvbmVudEF0dHIoYnVmZmVyLCB2ZXJ0aWNlcywgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSkge1xuXHRmb3IgKGxldCBpPTA7IGk8bGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCB2ZXJ0ZXggPSB2ZXJ0aWNlc1tpXTtcblx0XHQvLyBnZXQgdGhlIGluZGV4IGluIHRoZSBidWZmZXIgdG8gdGhlIHBhcnRpY3VsYXIgdmVydGV4XG5cdFx0Y29uc3QgaiA9IG9mZnNldCArIChzdHJpZGUgKiBpKTtcblx0XHRpZiAodmVydGV4LnggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0YnVmZmVyW2pdID0gdmVydGV4Lng7XG5cdFx0fSBlbHNlIGlmICh2ZXJ0ZXhbMF0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0YnVmZmVyW2pdID0gdmVydGV4WzBdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRidWZmZXJbal0gPSB2ZXJ0ZXg7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogRmlsbCB0aGUgYXJyYXlidWZmZXIgd2l0aCBhIGRvdWJsZSBjb21wb25lbnQgYXR0cmlidXRlLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gYnVmZmVyIC0gVGhlIGFycmF5YnVmZmVyIHRvIGZpbGwuXG4gKiBAcGFyYW0ge0FycmF5fSB2ZXJ0aWNlcyAtIFRoZSB2ZXJ0ZXggYXR0cmlidXRlIGFycmF5IHRvIGNvcHkgZnJvbS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBidWZmZXIgdG8gY29weSBmcm9tLlxuICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldCAtIFRoZSBvZmZzZXQgdG8gdGhlIGF0dHJpYnV0ZSwgbm90IGluIGJ5dGVzLlxuICogQHBhcmFtIHtOdW1iZXJ9IHN0cmlkZSAtIFRoZSBzdHJpZGUgb2YgdGhlIGJ1ZmZlciwgbm90IGluIGJ5dGVzLlxuICovXG5mdW5jdGlvbiBzZXQyQ29tcG9uZW50QXR0cihidWZmZXIsIHZlcnRpY2VzLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlKSB7XG5cdGZvciAobGV0IGk9MDsgaTxsZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IHZlcnRleCA9IHZlcnRpY2VzW2ldO1xuXHRcdC8vIGdldCB0aGUgaW5kZXggaW4gdGhlIGJ1ZmZlciB0byB0aGUgcGFydGljdWxhciB2ZXJ0ZXhcblx0XHRjb25zdCBqID0gb2Zmc2V0ICsgKHN0cmlkZSAqIGkpO1xuXHRcdGJ1ZmZlcltqXSA9ICh2ZXJ0ZXgueCAhPT0gdW5kZWZpbmVkKSA/IHZlcnRleC54IDogdmVydGV4WzBdO1xuXHRcdGJ1ZmZlcltqKzFdID0gKHZlcnRleC55ICE9PSB1bmRlZmluZWQpID8gdmVydGV4LnkgOiB2ZXJ0ZXhbMV07XG5cdH1cbn1cblxuLyoqXG4gKiBGaWxsIHRoZSBhcnJheWJ1ZmZlciB3aXRoIGEgdHJpcGxlIGNvbXBvbmVudCBhdHRyaWJ1dGUuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBidWZmZXIgLSBUaGUgYXJyYXlidWZmZXIgdG8gZmlsbC5cbiAqIEBwYXJhbSB7QXJyYXl9IHZlcnRpY2VzIC0gVGhlIHZlcnRleCBhdHRyaWJ1dGUgYXJyYXkgdG8gY29weSBmcm9tLlxuICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIGJ1ZmZlciB0byBjb3B5IGZyb20uXG4gKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0IC0gVGhlIG9mZnNldCB0byB0aGUgYXR0cmlidXRlLCBub3QgaW4gYnl0ZXMuXG4gKiBAcGFyYW0ge051bWJlcn0gc3RyaWRlIC0gVGhlIHN0cmlkZSBvZiB0aGUgYnVmZmVyLCBub3QgaW4gYnl0ZXMuXG4gKi9cbmZ1bmN0aW9uIHNldDNDb21wb25lbnRBdHRyKGJ1ZmZlciwgdmVydGljZXMsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUpIHtcblx0Zm9yIChsZXQgaT0wOyBpPGxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3QgdmVydGV4ID0gdmVydGljZXNbaV07XG5cdFx0Ly8gZ2V0IHRoZSBpbmRleCBpbiB0aGUgYnVmZmVyIHRvIHRoZSBwYXJ0aWN1bGFyIHZlcnRleFxuXHRcdGNvbnN0IGogPSBvZmZzZXQgKyAoc3RyaWRlICogaSk7XG5cdFx0YnVmZmVyW2pdID0gKHZlcnRleC54ICE9PSB1bmRlZmluZWQpID8gdmVydGV4LnggOiB2ZXJ0ZXhbMF07XG5cdFx0YnVmZmVyW2orMV0gPSAodmVydGV4LnkgIT09IHVuZGVmaW5lZCkgPyB2ZXJ0ZXgueSA6IHZlcnRleFsxXTtcblx0XHRidWZmZXJbaisyXSA9ICh2ZXJ0ZXgueiAhPT0gdW5kZWZpbmVkKSA/IHZlcnRleC56IDogdmVydGV4WzJdO1xuXHR9XG59XG5cbi8qKlxuICogRmlsbCB0aGUgYXJyYXlidWZmZXIgd2l0aCBhIHF1YWRydXBsZSBjb21wb25lbnQgYXR0cmlidXRlLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gYnVmZmVyIC0gVGhlIGFycmF5YnVmZmVyIHRvIGZpbGwuXG4gKiBAcGFyYW0ge0FycmF5fSB2ZXJ0aWNlcyAtIFRoZSB2ZXJ0ZXggYXR0cmlidXRlIGFycmF5IHRvIGNvcHkgZnJvbS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBidWZmZXIgdG8gY29weSBmcm9tLlxuICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldCAtIFRoZSBvZmZzZXQgdG8gdGhlIGF0dHJpYnV0ZSwgbm90IGluIGJ5dGVzLlxuICogQHBhcmFtIHtOdW1iZXJ9IHN0cmlkZSAtIFRoZSBzdHJpZGUgb2YgdGhlIGJ1ZmZlciwgbm90IGluIGJ5dGVzLlxuICovXG5mdW5jdGlvbiBzZXQ0Q29tcG9uZW50QXR0cihidWZmZXIsIHZlcnRpY2VzLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlKSB7XG5cdGZvciAobGV0IGk9MDsgaTxsZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IHZlcnRleCA9IHZlcnRpY2VzW2ldO1xuXHRcdC8vIGdldCB0aGUgaW5kZXggaW4gdGhlIGJ1ZmZlciB0byB0aGUgcGFydGljdWxhciB2ZXJ0ZXhcblx0XHRjb25zdCBqID0gb2Zmc2V0ICsgKHN0cmlkZSAqIGkpO1xuXHRcdGJ1ZmZlcltqXSA9ICh2ZXJ0ZXgueCAhPT0gdW5kZWZpbmVkKSA/IHZlcnRleC54IDogdmVydGV4WzBdO1xuXHRcdGJ1ZmZlcltqKzFdID0gKHZlcnRleC55ICE9PSB1bmRlZmluZWQpID8gdmVydGV4LnkgOiB2ZXJ0ZXhbMV07XG5cdFx0YnVmZmVyW2orMl0gPSAodmVydGV4LnogIT09IHVuZGVmaW5lZCkgPyB2ZXJ0ZXgueiA6IHZlcnRleFsyXTtcblx0XHRidWZmZXJbaiszXSA9ICh2ZXJ0ZXgudyAhPT0gdW5kZWZpbmVkKSA/IHZlcnRleC53IDogdmVydGV4WzNdO1xuXHR9XG59XG5cbi8qKlxuICogQGNsYXNzIFZlcnRleFBhY2thZ2VcbiAqIEBjbGFzc2Rlc2MgQSB2ZXJ0ZXggcGFja2FnZSB0byBhc3Npc3QgaW4gaW50ZXJsZWF2aW5nIHZlcnRleCBkYXRhIGFuZCBidWlsZGluZyB0aGUgYXNzb2NpYXRlZCB2ZXJ0ZXggYXR0cmlidXRlIHBvaW50ZXJzLlxuICovXG5jbGFzcyBWZXJ0ZXhQYWNrYWdlIHtcblxuXHQvKipcblx0ICogSW5zdGFudGlhdGVzIGEgVmVydGV4UGFja2FnZSBvYmplY3QuXG5cdCAgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyAtIFRoZSBhdHRyaWJ1dGVzIHRvIGludGVybGVhdmUga2V5ZWQgYnkgaW5kZXguXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihhdHRyaWJ1dGVzKSB7XG5cdFx0dGhpcy5zdHJpZGUgPSAwO1xuXHRcdHRoaXMubGVuZ3RoID0gMDtcblx0XHR0aGlzLmJ1ZmZlciA9IG51bGw7XG5cdFx0dGhpcy5wb2ludGVycyA9IHt9O1xuXHRcdGlmIChhdHRyaWJ1dGVzKSB7XG5cdFx0XHR0aGlzLnNldChhdHRyaWJ1dGVzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHRoZSBkYXRhIHRvIGJlIGludGVybGVhdmVkIGluc2lkZSB0aGUgcGFja2FnZS4gVGhpcyBjbGVhcnMgYW55IHByZXZpb3VzbHkgZXhpc3RpbmcgZGF0YS5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgLSBUaGUgYXR0cmlidXRlcyB0byBpbnRlcmxlYXZlZCwga2V5ZWQgYnkgaW5kZXguXG5cdCAqXG5cdCAqIEByZXR1cm4ge1ZlcnRleFBhY2thZ2V9IFRoZSB2ZXJ0ZXggcGFja2FnZSBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHNldChhdHRyaWJ1dGVzKSB7XG5cdFx0Ly8gcmVtb3ZlIGJhZCBhdHRyaWJ1dGVzXG5cdFx0YXR0cmlidXRlcyA9IHBhcnNlQXR0cmlidXRlTWFwKGF0dHJpYnV0ZXMpO1xuXHRcdC8vIHNldCBhdHRyaWJ1dGUgcG9pbnRlcnMgYW5kIHN0cmlkZVxuXHRcdHNldFBvaW50ZXJzQW5kU3RyaWRlKHRoaXMsIGF0dHJpYnV0ZXMpO1xuXHRcdC8vIHNldCBzaXplIG9mIGRhdGEgdmVjdG9yXG5cdFx0Y29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG5cdFx0Y29uc3Qgc3RyaWRlID0gdGhpcy5zdHJpZGU7IC8vIG5vdCBpbiBieXRlc1xuXHRcdGNvbnN0IHBvaW50ZXJzID0gdGhpcy5wb2ludGVycztcblx0XHRjb25zdCBidWZmZXIgPSB0aGlzLmJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkobGVuZ3RoICogc3RyaWRlKTtcblx0XHQvLyBmb3IgZWFjaCB2ZXJ0ZXggYXR0cmlidXRlIGFycmF5XG5cdFx0YXR0cmlidXRlcy5mb3JFYWNoKHZlcnRpY2VzID0+IHtcblx0XHRcdC8vIGdldCB0aGUgcG9pbnRlclxuXHRcdFx0Y29uc3QgcG9pbnRlciA9IHBvaW50ZXJzW3ZlcnRpY2VzLmluZGV4XTtcblx0XHRcdC8vIGdldCB0aGUgcG9pbnRlcnMgb2Zmc2V0XG5cdFx0XHRjb25zdCBvZmZzZXQgPSBwb2ludGVyLmJ5dGVPZmZzZXQgLyBCWVRFU19QRVJfQ09NUE9ORU5UO1xuXHRcdFx0Ly8gY29weSB2ZXJ0ZXggZGF0YSBpbnRvIGFycmF5YnVmZmVyXG5cdFx0XHRzd2l0Y2ggKHBvaW50ZXIuc2l6ZSkge1xuXHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0c2V0MkNvbXBvbmVudEF0dHIoYnVmZmVyLCB2ZXJ0aWNlcy5kYXRhLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdHNldDNDb21wb25lbnRBdHRyKGJ1ZmZlciwgdmVydGljZXMuZGF0YSwgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRzZXQ0Q29tcG9uZW50QXR0cihidWZmZXIsIHZlcnRpY2VzLmRhdGEsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHNldDFDb21wb25lbnRBdHRyKGJ1ZmZlciwgdmVydGljZXMuZGF0YSwgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBWZXJ0ZXhQYWNrYWdlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpO1xuXG4vKipcbiAqIEJpbmQgdGhlIHZpZXdwb3J0IHRvIHRoZSByZW5kZXJpbmcgY29udGV4dC5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtWaWV3cG9ydH0gdmlld3BvcnQgLSBUaGUgdmlld3BvcnQgb2JqZWN0LlxuICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoIC0gVGhlIHdpZHRoIG92ZXJyaWRlLlxuICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodCAtIFRoZSBoZWlnaHQgb3ZlcnJpZGUuXG4gKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSBob3Jpem9udGFsIG9mZnNldCBvdmVycmlkZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSB5IC0gVGhlIHZlcnRpY2FsIG9mZnNldCBvdmVycmlkZS5cbiAqL1xuZnVuY3Rpb24gc2V0KHZpZXdwb3J0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG5cdGNvbnN0IGdsID0gdmlld3BvcnQuZ2w7XG5cdHggPSAoeCAhPT0gdW5kZWZpbmVkKSA/IHggOiB2aWV3cG9ydC54O1xuXHR5ID0gKHkgIT09IHVuZGVmaW5lZCkgPyB5IDogdmlld3BvcnQueTtcblx0d2lkdGggPSAod2lkdGggIT09IHVuZGVmaW5lZCkgPyB3aWR0aCA6IHZpZXdwb3J0LndpZHRoO1xuXHRoZWlnaHQgPSAoaGVpZ2h0ICE9PSB1bmRlZmluZWQpID8gaGVpZ2h0IDogdmlld3BvcnQuaGVpZ2h0O1xuXHRnbC52aWV3cG9ydCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbn1cblxuLyoqXG4gKiBAY2xhc3MgVmlld3BvcnRcbiAqIEBjbGFzc2Rlc2MgQSB2aWV3cG9ydCBjbGFzcyBmb3IgbWFuYWdpbmcgV2ViR0wgdmlld3BvcnRzLlxuICovXG5jbGFzcyBWaWV3cG9ydCB7XG5cblx0LyoqXG5cdCAqIEluc3RhbnRpYXRlcyBhIFZpZXdwb3J0IG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgdmlld3BvcnQgc3BlY2lmaWNhdGlvbiBvYmplY3QuXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBzcGVjLndpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB2aWV3cG9ydC5cblx0ICogQHBhcmFtIHtOdW1iZXJ9IHNwZWMuaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgdmlld3BvcnQuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihzcGVjID0ge30pIHtcblx0XHR0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xuXHRcdHRoaXMuc3RhY2sgPSBbXTtcblx0XHQvLyBzZXQgc2l6ZVxuXHRcdHRoaXMucmVzaXplKFxuXHRcdFx0c3BlYy53aWR0aCB8fCB0aGlzLmdsLmNhbnZhcy53aWR0aCxcblx0XHRcdHNwZWMuaGVpZ2h0IHx8IHRoaXMuZ2wuY2FudmFzLmhlaWdodCk7XG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgdmlld3BvcnRzIHdpZHRoIGFuZCBoZWlnaHQuIFRoaXMgcmVzaXplcyB0aGUgdW5kZXJseWluZyBjYW52YXMgZWxlbWVudC5cblx0ICpcblx0ICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB2aWV3cG9ydC5cblx0ICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIHZpZXdwb3J0LlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtWaWV3cG9ydH0gVGhlIHZpZXdwb3J0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxuXHQgKi9cblx0cmVzaXplKHdpZHRoID0gMCwgaGVpZ2h0ID0gMCkge1xuXHRcdGlmICh0eXBlb2Ygd2lkdGggIT09ICdudW1iZXInIHx8IHdpZHRoIDw9IDApIHtcblx0XHRcdHRocm93IGBQcm92aWRlZCBcXGB3aWR0aFxcYCBvZiBcXGAke3dpZHRofVxcYCBpcyBpbnZhbGlkYDtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBoZWlnaHQgIT09ICdudW1iZXInIHx8IGhlaWdodCA8PSAwKSB7XG5cdFx0XHR0aHJvdyBgUHJvdmlkZWQgXFxgaGVpZ2h0XFxgIG9mIFxcYCR7aGVpZ2h0fVxcYCBpcyBpbnZhbGlkYDtcblx0XHR9XG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdHRoaXMuZ2wuY2FudmFzLndpZHRoID0gd2lkdGg7XG5cdFx0dGhpcy5nbC5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIHZpZXdwb3J0IGRpbWVuc2lvbnMgYW5kIHBvc2l0aW9uLiBUaGUgdW5kZXJseWluZyBjYW52YXMgZWxlbWVudCBpcyBub3QgYWZmZWN0ZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvdmVycmlkZS5cblx0ICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodCAtIFRoZSBoZWlnaHQgb3ZlcnJpZGUuXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gVGhlIGhvcml6b250YWwgb2Zmc2V0IG92ZXJyaWRlLlxuXHQgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSB2ZXJ0aWNhbCBvZmZzZXQgb3ZlcnJpZGUuXG5cdCAqXG5cdCAqIEByZXR1cm4ge1ZpZXdwb3J0fSAtIFRoZSB2aWV3cG9ydCBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHB1c2goeCA9IDAsIHkgPSAwLCB3aWR0aCA9IHRoaXMud2lkdGgsIGhlaWdodCA9IHRoaXMuaGVpZ2h0KSB7XG5cdFx0aWYgKHR5cGVvZiB4ICE9PSAnbnVtYmVyJykge1xuXHRcdFx0dGhyb3cgYFByb3ZpZGVkIFxcYHhcXGAgb2YgXFxgJHt4fVxcYCBpcyBpbnZhbGlkYDtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiB5ICE9PSAnbnVtYmVyJykge1xuXHRcdFx0dGhyb3cgYFByb3ZpZGVkIFxcYHlcXGAgb2YgXFxgJHt5fVxcYCBpcyBpbnZhbGlkYDtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiB3aWR0aCAhPT0gJ251bWJlcicgfHwgd2lkdGggPD0gMCkge1xuXHRcdFx0dGhyb3cgYFByb3ZpZGVkIFxcYHdpZHRoXFxgIG9mIFxcYCR7d2lkdGh9XFxgIGlzIGludmFsaWRgO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIGhlaWdodCAhPT0gJ251bWJlcicgfHwgaGVpZ2h0IDw9IDApIHtcblx0XHRcdHRocm93IGBQcm92aWRlZCBcXGBoZWlnaHRcXGAgb2YgXFxgJHtoZWlnaHR9XFxgIGlzIGludmFsaWRgO1xuXHRcdH1cblx0XHQvLyBwdXNoIG9udG8gc3RhY2tcblx0XHR0aGlzLnN0YWNrLnB1c2goe1xuXHRcdFx0eDogeCxcblx0XHRcdHk6IHksXG5cdFx0XHR3aWR0aDogd2lkdGgsXG5cdFx0XHRoZWlnaHQ6IGhlaWdodFxuXHRcdH0pO1xuXHRcdC8vIHNldCB2aWV3cG9ydFxuXHRcdHNldCh0aGlzLCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBQb3BzIGN1cnJlbnQgdGhlIHZpZXdwb3J0IG9iamVjdCBhbmQgc2V0cyB0aGUgdmlld3BvcnQgYmVuZWF0aCBpdC5cblx0ICpcblx0ICogQHJldHVybiB7Vmlld3BvcnR9IFRoZSB2aWV3cG9ydCBvYmplY3QsIGZvciBjaGFpbmluZy5cblx0ICovXG5cdHBvcCgpIHtcblx0XHRpZiAodGhpcy5zdGFjay5sZW5ndGggPT09IDApIHtcblx0XHRcdHRocm93ICdWaWV3cG9ydCBzdGFjayBpcyBlbXB0eSc7XG5cdFx0fVxuXHRcdHRoaXMuc3RhY2sucG9wKCk7XG5cdFx0aWYgKHRoaXMuc3RhY2subGVuZ3RoID4gMCkge1xuXHRcdFx0Y29uc3QgdG9wID0gdGhpcy5zdGFja1t0aGlzLnN0YWNrLmxlbmd0aCAtIDFdO1xuXHRcdFx0c2V0KHRoaXMsIHRvcC54LCB0b3AueSwgdG9wLndpZHRoLCB0b3AuaGVpZ2h0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2V0KHRoaXMpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdwb3J0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBFWFRFTlNJT05TID0gW1xuXHQvLyByYXRpZmllZFxuXHQnT0VTX3RleHR1cmVfZmxvYXQnLFxuXHQnT0VTX3RleHR1cmVfaGFsZl9mbG9hdCcsXG5cdCdXRUJHTF9sb3NlX2NvbnRleHQnLFxuXHQnT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJyxcblx0J09FU192ZXJ0ZXhfYXJyYXlfb2JqZWN0Jyxcblx0J1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8nLFxuXHQnV0VCR0xfZGVidWdfc2hhZGVycycsXG5cdCdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0YycsXG5cdCdXRUJHTF9kZXB0aF90ZXh0dXJlJyxcblx0J09FU19lbGVtZW50X2luZGV4X3VpbnQnLFxuXHQnRVhUX3RleHR1cmVfZmlsdGVyX2FuaXNvdHJvcGljJyxcblx0J0VYVF9mcmFnX2RlcHRoJyxcblx0J1dFQkdMX2RyYXdfYnVmZmVycycsXG5cdCdBTkdMRV9pbnN0YW5jZWRfYXJyYXlzJyxcblx0J09FU190ZXh0dXJlX2Zsb2F0X2xpbmVhcicsXG5cdCdPRVNfdGV4dHVyZV9oYWxmX2Zsb2F0X2xpbmVhcicsXG5cdCdFWFRfYmxlbmRfbWlubWF4Jyxcblx0J0VYVF9zaGFkZXJfdGV4dHVyZV9sb2QnLFxuXHQvLyBjb21tdW5pdHlcblx0J1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9hdGMnLFxuXHQnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3B2cnRjJyxcblx0J0VYVF9jb2xvcl9idWZmZXJfaGFsZl9mbG9hdCcsXG5cdCdXRUJHTF9jb2xvcl9idWZmZXJfZmxvYXQnLFxuXHQnRVhUX3NSR0InLFxuXHQnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YzEnLFxuXHQnRVhUX2Rpc2pvaW50X3RpbWVyX3F1ZXJ5Jyxcblx0J0VYVF9jb2xvcl9idWZmZXJfZmxvYXQnXG5dO1xuXG4vKipcbiAqIEFsbCBjb250ZXh0IHdyYXBwZXJzLlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgX2NvbnRleHRzID0gbmV3IE1hcCgpO1xuXG4vKipcbiAqIFRoZSBjdXJyZW50bHkgYm91bmQgY29udGV4dC5cbiAqIEBwcml2YXRlXG4gKi9cbmxldCBfYm91bmRDb250ZXh0ID0gbnVsbDtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIHJmYzQxMjIgdmVyc2lvbiA0IGNvbXBsaWFudCBVVUlELlxuICogQHByaXZhdGVcbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IC0gVGhlIFVVSUQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBnZXRVVUlEKCkge1xuXHRjb25zdCByZXBsYWNlID0gZnVuY3Rpb24oYykge1xuXHRcdGNvbnN0IHIgPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwO1xuXHRcdGNvbnN0IHYgPSAoYyA9PT0gJ3gnKSA/IHIgOiAociAmIDB4MyB8IDB4OCk7XG5cdFx0cmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuXHR9O1xuXHRyZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCByZXBsYWNlKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpZCBvZiB0aGUgSFRNTENhbnZhc0VsZW1lbnQgZWxlbWVudC4gSWYgdGhlcmUgaXMgbm8gaWQsIGl0IGdlbmVyYXRlcyBvbmUgYW5kIGFwcGVuZHMgaXQuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IGNhbnZhcyAtIFRoZSBDYW52YXMgb2JqZWN0LlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gVGhlIENhbnZhcyBpZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGdldElkKGNhbnZhcykge1xuXHRpZiAoIWNhbnZhcy5pZCkge1xuXHRcdGNhbnZhcy5pZCA9IGdldFVVSUQoKTtcblx0fVxuXHRyZXR1cm4gY2FudmFzLmlkO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBDYW52YXMgZWxlbWVudCBvYmplY3QgZnJvbSBlaXRoZXIgYW4gZXhpc3Rpbmcgb2JqZWN0LCBvciBpZGVudGlmaWNhdGlvbiBzdHJpbmcuXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWQgb3Igc2VsZWN0b3Igc3RyaW5nLlxuICpcbiAqIEByZXR1cm4ge0hUTUxDYW52YXNFbGVtZW50fSBUaGUgQ2FudmFzIGVsZW1lbnQgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBnZXRDYW52YXMoYXJnKSB7XG5cdGlmIChhcmcgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCkge1xuXHRcdHJldHVybiBhcmc7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGFyZyA9PT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYXJnKSB8fFxuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihhcmcpO1xuXHR9XG5cdHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSB3cmFwcGVkIFdlYkdMUmVuZGVyaW5nQ29udGV4dCBmcm9tIHRoZSBjb250ZXh0IGl0c2VsZi5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9IGNvbnRleHQgLSBUaGUgV2ViR0xSZW5kZXJpbmdDb250ZXh0LlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIGNvbnRleHQgd3JhcHBlci5cbiAqL1xuZnVuY3Rpb24gZ2V0V3JhcHBlckZyb21Db250ZXh0KGNvbnRleHQpIHtcblx0bGV0IGZvdW5kID0gbnVsbDtcblx0X2NvbnRleHRzLmZvckVhY2god3JhcHBlciA9PiB7XG5cdFx0aWYgKGNvbnRleHQgPT09IHdyYXBwZXIuZ2wpIHtcblx0XHRcdGZvdW5kID0gd3JhcHBlcjtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gZm91bmQ7XG59XG5cbi8qKlxuICogQXR0ZW1wdHMgdG8gcmV0cmlldmUgYSB3cmFwcGVkIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5cbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gVGhlIENhbnZhcyBlbGVtZW50IG9iamVjdCB0byBjcmVhdGUgdGhlIGNvbnRleHQgdW5kZXIuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgY29udGV4dCB3cmFwcGVyLlxuICovXG5mdW5jdGlvbiBnZXRDb250ZXh0V3JhcHBlcihhcmcpIHtcblx0aWYgKGFyZyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0aWYgKF9ib3VuZENvbnRleHQpIHtcblx0XHRcdC8vIHJldHVybiBsYXN0IGJvdW5kIGNvbnRleHRcblx0XHRcdHJldHVybiBfYm91bmRDb250ZXh0O1xuXHRcdH1cblx0fSBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpIHtcblx0XHRyZXR1cm4gZ2V0V3JhcHBlckZyb21Db250ZXh0KGFyZyk7XG5cdH0gZWxzZSB7XG5cdFx0Y29uc3QgY2FudmFzID0gZ2V0Q2FudmFzKGFyZyk7XG5cdFx0aWYgKGNhbnZhcykge1xuXHRcdFx0cmV0dXJuIF9jb250ZXh0cy5nZXQoZ2V0SWQoY2FudmFzKSk7XG5cdFx0fVxuXHR9XG5cdC8vIG5vIGJvdW5kIGNvbnRleHQgb3IgYXJndW1lbnRcblx0cmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogQXR0ZW1wdHMgdG8gbG9hZCBhbGwga25vd24gZXh0ZW5zaW9ucyBmb3IgYSBwcm92aWRlZCBXZWJHTFJlbmRlcmluZ0NvbnRleHQuIFN0b3JlcyB0aGUgcmVzdWx0cyBpbiB0aGUgY29udGV4dCB3cmFwcGVyIGZvciBsYXRlciBxdWVyaWVzLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFdyYXBwZXIgLSBUaGUgY29udGV4dCB3cmFwcGVyLlxuICovXG5mdW5jdGlvbiBsb2FkRXh0ZW5zaW9ucyhjb250ZXh0V3JhcHBlcikge1xuXHRjb25zdCBnbCA9IGNvbnRleHRXcmFwcGVyLmdsO1xuXHRFWFRFTlNJT05TLmZvckVhY2goaWQgPT4ge1xuXHRcdGNvbnRleHRXcmFwcGVyLmV4dGVuc2lvbnMuc2V0KGlkLCBnbC5nZXRFeHRlbnNpb24oaWQpKTtcblx0fSk7XG59XG5cbi8qKlxuICogQXR0ZW1wdHMgdG8gY3JlYXRlIGEgV2ViR0xSZW5kZXJpbmdDb250ZXh0IGFuZCBsb2FkIGFsbCBleHRlbnNpb25zLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSAtIFRoZSBDYW52YXMgZWxlbWVudCBvYmplY3QgdG8gY3JlYXRlIHRoZSBjb250ZXh0IHVuZGVyLlxuICogQHBhcmFtIHtPYmplY3R9fSBvcHRpb25zIC0gUGFyYW1ldGVycyB0byB0aGUgd2ViZ2wgY29udGV4dCwgb25seSB1c2VkIGR1cmluZyBpbnN0YW50aWF0aW9uLiBPcHRpb25hbC5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjb250ZXh0IHdyYXBwZXIuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRleHRXcmFwcGVyKGNhbnZhcywgb3B0aW9ucykge1xuXHRjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIG9wdGlvbnMpIHx8IGNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnLCBvcHRpb25zKTtcblx0Ly8gd3JhcCBjb250ZXh0XG5cdGNvbnN0IGNvbnRleHRXcmFwcGVyID0ge1xuXHRcdGlkOiBnZXRJZChjYW52YXMpLFxuXHRcdGdsOiBnbCxcblx0XHRleHRlbnNpb25zOiBuZXcgTWFwKClcblx0fTtcblx0Ly8gbG9hZCBXZWJHTCBleHRlbnNpb25zXG5cdGxvYWRFeHRlbnNpb25zKGNvbnRleHRXcmFwcGVyKTtcblx0Ly8gYWRkIGNvbnRleHQgd3JhcHBlciB0byBtYXBcblx0X2NvbnRleHRzLnNldChnZXRJZChjYW52YXMpLCBjb250ZXh0V3JhcHBlcik7XG5cdC8vIGJpbmQgdGhlIGNvbnRleHRcblx0X2JvdW5kQ29udGV4dCA9IGNvbnRleHRXcmFwcGVyO1xuXHRyZXR1cm4gY29udGV4dFdyYXBwZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgYW4gZXhpc3RpbmcgV2ViR0wgY29udGV4dCBhc3NvY2lhdGVkIHdpdGggdGhlIHByb3ZpZGVkIGFyZ3VtZW50IGFuZCBiaW5kcyBpdC4gV2hpbGUgYm91bmQsIHRoZSBhY3RpdmUgY29udGV4dCB3aWxsIGJlIHVzZWQgaW1wbGljaXRseSBieSBhbnkgaW5zdGFudGlhdGVkIGBlc3BlcmAgY29uc3RydWN0cy5cblx0ICpcblx0ICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuXG5cdCAqXG5cdCAqIEByZXR1cm4ge1dlYkdMQ29udGV4dH0gVGhlIG5hbWVzcGFjZSwgdXNlZCBmb3IgY2hhaW5pbmcuXG5cdCAqL1xuXHRiaW5kOiBmdW5jdGlvbihhcmcpIHtcblx0XHRjb25zdCB3cmFwcGVyID0gZ2V0Q29udGV4dFdyYXBwZXIoYXJnKTtcblx0XHRpZiAod3JhcHBlcikge1xuXHRcdFx0X2JvdW5kQ29udGV4dCA9IHdyYXBwZXI7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0dGhyb3cgYE5vIGNvbnRleHQgZXhpc3RzIGZvciBwcm92aWRlZCBhcmd1bWVudCAnJHthcmd9J2A7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyBhbiBleGlzdGluZyBXZWJHTCBjb250ZXh0IGFzc29jaWF0ZWQgd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnQuIElmIG5vIGNvbnRleHQgZXhpc3RzLCBvbmUgaXMgY3JlYXRlZC5cblx0ICogRHVyaW5nIGNyZWF0aW9uIGF0dGVtcHRzIHRvIGxvYWQgYWxsIGV4dGVuc2lvbnMgZm91bmQgYXQ6IGh0dHBzOi8vd3d3Lmtocm9ub3Mub3JnL3JlZ2lzdHJ5L3dlYmdsL2V4dGVuc2lvbnMvLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gUGFyYW1ldGVycyB0byB0aGUgd2ViZ2wgY29udGV4dCwgb25seSB1c2VkIGR1cmluZyBpbnN0YW50aWF0aW9uLiBPcHRpb25hbC5cblx0ICpcblx0ICogQHJldHVybiB7V2ViR0xSZW5kZXJpbmdDb250ZXh0fSBUaGUgV2ViR0xSZW5kZXJpbmdDb250ZXh0IG9iamVjdC5cblx0ICovXG5cdGdldDogZnVuY3Rpb24oYXJnLCBvcHRpb25zKSB7XG5cdFx0Y29uc3Qgd3JhcHBlciA9IGdldENvbnRleHRXcmFwcGVyKGFyZyk7XG5cdFx0aWYgKHdyYXBwZXIpIHtcblx0XHQgICAvLyByZXR1cm4gdGhlIG5hdGl2ZSBXZWJHTFJlbmRlcmluZ0NvbnRleHRcblx0XHQgICByZXR1cm4gd3JhcHBlci5nbDtcblx0XHR9XG5cdFx0Ly8gZ2V0IGNhbnZhcyBlbGVtZW50XG5cdFx0Y29uc3QgY2FudmFzID0gZ2V0Q2FudmFzKGFyZyk7XG5cdFx0Ly8gdHJ5IHRvIGZpbmQgb3IgY3JlYXRlIGNvbnRleHRcblx0XHRpZiAoIWNhbnZhcykge1xuXHRcdFx0dGhyb3cgYE5vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIGNvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aCBwcm92aWRlZCBhcmd1bWVudCBvZiB0eXBlICR7dHlwZW9mIGFyZ31gO1xuXHRcdH1cblx0XHQvLyBjcmVhdGUgY29udGV4dFxuXHRcdHJldHVybiBjcmVhdGVDb250ZXh0V3JhcHBlcihjYW52YXMsIG9wdGlvbnMpLmdsO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZW1vdmVzIGFuIGV4aXN0aW5nIFdlYkdMIGNvbnRleHQgb2JqZWN0IGZvciB0aGUgcHJvdmlkZWQgb3IgY3VycmVudGx5IGJvdW5kIGNvbnRleHQgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge1dlYkdMUmVuZGVyaW5nQ29udGV4dHxIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuIE9wdGlvbmFsLlxuXHQgKiBAcGFyYW0ge09iamVjdH19IG9wdGlvbnMgLSBQYXJhbWV0ZXJzIHRvIHRoZSB3ZWJnbCBjb250ZXh0LCBvbmx5IHVzZWQgZHVyaW5nIGluc3RhbnRpYXRpb24uIE9wdGlvbmFsLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9IFRoZSBXZWJHTFJlbmRlcmluZ0NvbnRleHQgb2JqZWN0LlxuXHQgKi9cblx0cmVtb3ZlOiBmdW5jdGlvbihhcmcpIHtcblx0XHRjb25zdCB3cmFwcGVyID0gZ2V0Q29udGV4dFdyYXBwZXIoYXJnKTtcblx0XHRpZiAod3JhcHBlcikge1xuXHRcdFx0Ly8gZGVsZXRlIHRoZSBjb250ZXh0XG5cdFx0XHRfY29udGV4dHMuZGVsZXRlKHdyYXBwZXIuaWQpO1xuXHRcdFx0Ly8gcmVtb3ZlIGlmIGN1cnJlbnRseSBib3VuZFxuXHRcdFx0aWYgKHdyYXBwZXIgPT09IF9ib3VuZENvbnRleHQpIHtcblx0XHRcdFx0X2JvdW5kQ29udGV4dCA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IGBObyBjb250ZXh0IGlzIGN1cnJlbnRseSBib3VuZCBvciBjb3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggcHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSAke3R5cGVvZiBhcmd9YDtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIHN1cHBvcnRlZCBleHRlbnNpb25zIGZvciB0aGUgcHJvdmlkZWQgb3IgY3VycmVudGx5IGJvdW5kIGNvbnRleHQgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge1dlYkdMUmVuZGVyaW5nQ29udGV4dHxIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuIE9wdGlvbmFsLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtBcnJheX0gQWxsIHN1cHBvcnRlZCBleHRlbnNpb25zLlxuXHQgKi9cblx0c3VwcG9ydGVkRXh0ZW5zaW9uczogZnVuY3Rpb24oYXJnKSB7XG5cdFx0Y29uc3Qgd3JhcHBlciA9IGdldENvbnRleHRXcmFwcGVyKGFyZyk7XG5cdFx0aWYgKHdyYXBwZXIpIHtcblx0XHRcdGNvbnN0IGV4dGVuc2lvbnMgPSB3cmFwcGVyLmV4dGVuc2lvbnM7XG5cdFx0XHRjb25zdCBzdXBwb3J0ZWQgPSBbXTtcblx0XHRcdGV4dGVuc2lvbnMuZm9yRWFjaCgoZXh0ZW5zaW9uLCBrZXkpID0+IHtcblx0XHRcdFx0aWYgKGV4dGVuc2lvbikge1xuXHRcdFx0XHRcdHN1cHBvcnRlZC5wdXNoKGtleSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHN1cHBvcnRlZDtcblx0XHR9XG5cdFx0dGhyb3cgYE5vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIGNvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aCBwcm92aWRlZCBhcmd1bWVudCBvZiB0eXBlICR7dHlwZW9mIGFyZ31gO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCB1bnN1cHBvcnRlZCBleHRlbnNpb25zIGZvciB0aGUgcHJvdmlkZWQgb3IgY3VycmVudGx5IGJvdW5kIGNvbnRleHQgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge1dlYkdMUmVuZGVyaW5nQ29udGV4dHxIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuIE9wdGlvbmFsLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtBcnJheX0gQWxsIHVuc3VwcG9ydGVkIGV4dGVuc2lvbnMuXG5cdCAqL1xuXHR1bnN1cHBvcnRlZEV4dGVuc2lvbnM6IGZ1bmN0aW9uKGFyZykge1xuXHRcdGNvbnN0IHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlcihhcmcpO1xuXHRcdGlmICh3cmFwcGVyKSB7XG5cdFx0XHRjb25zdCBleHRlbnNpb25zID0gd3JhcHBlci5leHRlbnNpb25zO1xuXHRcdFx0Y29uc3QgdW5zdXBwb3J0ZWQgPSBbXTtcblx0XHRcdGV4dGVuc2lvbnMuZm9yRWFjaCgoZXh0ZW5zaW9uLCBrZXkpID0+IHtcblx0XHRcdFx0aWYgKCFleHRlbnNpb24pIHtcblx0XHRcdFx0XHR1bnN1cHBvcnRlZC5wdXNoKGtleSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHVuc3VwcG9ydGVkO1xuXHRcdH1cblx0XHR0aHJvdyBgTm8gY29udGV4dCBpcyBjdXJyZW50bHkgYm91bmQgb3IgY291bGQgYmUgYXNzb2NpYXRlZCB3aXRoIHByb3ZpZGVkIGFyZ3VtZW50IG9mIHR5cGUgJHt0eXBlb2YgYXJnfWA7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiBhbiBleHRlbnNpb24gaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGxvYWRlZCBmb3IgdGhlIHByb3ZpZGVkIG9yIGN1cnJlbnRseSBib3VuZCBjb250ZXh0IG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR8SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLiBPcHRpb25hbC5cblx0ICogQHBhcmFtIHtTdHJpbmd9IGV4dGVuc2lvbiAtIFRoZSBleHRlbnNpb24gbmFtZS5cblx0ICpcblx0ICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIHByb3ZpZGVkIGV4dGVuc2lvbiBoYXMgYmVlbiBsb2FkZWQgc3VjY2Vzc2Z1bGx5LlxuXHQgKi9cblx0Y2hlY2tFeHRlbnNpb246IGZ1bmN0aW9uKGFyZywgZXh0ZW5zaW9uKSB7XG5cdFx0aWYgKCFleHRlbnNpb24pIHtcblx0XHRcdC8vIHNoaWZ0IHBhcmFtZXRlcnMgaWYgbm8gY2FudmFzIGFyZyBpcyBwcm92aWRlZFxuXHRcdFx0ZXh0ZW5zaW9uID0gYXJnO1xuXHRcdFx0YXJnID0gdW5kZWZpbmVkO1xuXHRcdH1cblx0XHRjb25zdCB3cmFwcGVyID0gZ2V0Q29udGV4dFdyYXBwZXIoYXJnKTtcblx0XHRpZiAod3JhcHBlcikge1xuXHRcdFx0Y29uc3QgZXh0ZW5zaW9ucyA9IHdyYXBwZXIuZXh0ZW5zaW9ucztcblx0XHRcdHJldHVybiBleHRlbnNpb25zLmdldChleHRlbnNpb24pID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdH1cblx0XHR0aHJvdyBgTm8gY29udGV4dCBpcyBjdXJyZW50bHkgYm91bmQgb3IgY291bGQgYmUgYXNzb2NpYXRlZCB3aXRoIHByb3ZpZGVkIGFyZ3VtZW50IG9mIHR5cGUgJHt0eXBlb2YgYXJnfWA7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gZXh0ZW5zaW9uIGlmIGl0IGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBsb2FkZWQgZm9yIHRoZSBwcm92aWRlZCBvciBjdXJyZW50bHkgYm91bmQgY29udGV4dCBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7V2ViR0xSZW5kZXJpbmdDb250ZXh0fEhUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBleHRlbnNpb24gLSBUaGUgZXh0ZW5zaW9uIG5hbWUuXG5cdCAqXG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBwcm92aWRlZCBleHRlbnNpb24gaGFzIGJlZW4gbG9hZGVkIHN1Y2Nlc3NmdWxseS5cblx0ICovXG5cdGdldEV4dGVuc2lvbjogZnVuY3Rpb24oYXJnLCBleHRlbnNpb24pIHtcblx0XHRpZiAoIWV4dGVuc2lvbikge1xuXHRcdFx0Ly8gc2hpZnQgcGFyYW1ldGVycyBpZiBubyBjYW52YXMgYXJnIGlzIHByb3ZpZGVkXG5cdFx0XHRleHRlbnNpb24gPSBhcmc7XG5cdFx0XHRhcmcgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdGNvbnN0IHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlcihhcmcpO1xuXHRcdGlmICh3cmFwcGVyKSB7XG5cdFx0XHRjb25zdCBleHRlbnNpb25zID0gd3JhcHBlci5leHRlbnNpb25zO1xuXHRcdFx0cmV0dXJuIGV4dGVuc2lvbnMuZ2V0KGV4dGVuc2lvbikgfHwgbnVsbDtcblx0XHR9XG5cdFx0dGhyb3cgYE5vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIGNvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aCBwcm92aWRlZCBhcmd1bWVudCBvZiB0eXBlICR7dHlwZW9mIGFyZ31gO1xuXHR9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Q29sb3JUZXh0dXJlMkQ6IHJlcXVpcmUoJy4vY29yZS9Db2xvclRleHR1cmUyRCcpLFxuXHREZXB0aFRleHR1cmUyRDogcmVxdWlyZSgnLi9jb3JlL0RlcHRoVGV4dHVyZTJEJyksXG5cdEluZGV4QnVmZmVyOiByZXF1aXJlKCcuL2NvcmUvSW5kZXhCdWZmZXInKSxcblx0UmVuZGVyYWJsZTogcmVxdWlyZSgnLi9jb3JlL1JlbmRlcmFibGUnKSxcblx0UmVuZGVyVGFyZ2V0OiByZXF1aXJlKCcuL2NvcmUvUmVuZGVyVGFyZ2V0JyksXG5cdFNoYWRlcjogcmVxdWlyZSgnLi9jb3JlL1NoYWRlcicpLFxuXHRUZXh0dXJlMkQ6IHJlcXVpcmUoJy4vY29yZS9UZXh0dXJlMkQnKSxcblx0VGV4dHVyZUN1YmVNYXA6IHJlcXVpcmUoJy4vY29yZS9UZXh0dXJlQ3ViZU1hcCcpLFxuXHRWZXJ0ZXhCdWZmZXI6IHJlcXVpcmUoJy4vY29yZS9WZXJ0ZXhCdWZmZXInKSxcblx0VmVydGV4UGFja2FnZTogcmVxdWlyZSgnLi9jb3JlL1ZlcnRleFBhY2thZ2UnKSxcblx0Vmlld3BvcnQ6IHJlcXVpcmUoJy4vY29yZS9WaWV3cG9ydCcpLFxuXHRXZWJHTENvbnRleHQ6IHJlcXVpcmUoJy4vY29yZS9XZWJHTENvbnRleHQnKVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0LyoqXG5cdCAqIFNlbmRzIGFuIEdFVCByZXF1ZXN0IGNyZWF0ZSBhbiBJbWFnZSBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIFhIUiBvcHRpb25zLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy51cmwgLSBUaGUgVVJMIGZvciB0aGUgcmVzb3VyY2UuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gb3B0aW9ucy5jcm9zc09yaWdpbiAtIEVuYWJsZSBjcm9zcy1vcmlnaW4gcmVxdWVzdC5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5zdWNjZXNzIC0gVGhlIHN1Y2Nlc3MgY2FsbGJhY2sgZnVuY3Rpb24uXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMuZXJyb3IgLSBUaGUgZXJyb3IgY2FsbGJhY2sgZnVuY3Rpb24uXG5cdCAqL1xuXHRsb2FkOiBmdW5jdGlvbiAob3B0aW9ucyA9IHt9KSB7XG5cdFx0Y29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblx0XHRpbWFnZS5vbmxvYWQgPSAoKSA9PiB7XG5cdFx0XHRpZiAob3B0aW9ucy5zdWNjZXNzKSB7XG5cdFx0XHRcdG9wdGlvbnMuc3VjY2VzcyhpbWFnZSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRpbWFnZS5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG5cdFx0XHRpZiAob3B0aW9ucy5lcnJvcikge1xuXHRcdFx0XHRjb25zdCBlcnIgPSBgVW5hYmxlIHRvIGxvYWQgaW1hZ2UgZnJvbSBVUkw6IFxcYCR7ZXZlbnQucGF0aFswXS5jdXJyZW50U3JjIH1cXGBgO1xuXHRcdFx0XHRvcHRpb25zLmVycm9yKGVycik7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRpbWFnZS5jcm9zc09yaWdpbiA9IG9wdGlvbnMuY3Jvc3NPcmlnaW4gPyAnYW5vbnltb3VzJyA6IHVuZGVmaW5lZDtcblx0XHRpbWFnZS5zcmMgPSBvcHRpb25zLnVybDtcblx0fVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGFyZ3VtZW50IGlzIG9uZSBvZiB0aGUgV2ViR0wgYHRleEltYWdlMkRgIG92ZXJyaWRkZW5cbiAqIGNhbnZhcyB0eXBlcy5cbiAqXG4gKiBAcGFyYW0geyp9IGFyZyAtIFRoZSBhcmd1bWVudCB0byB0ZXN0LlxuICpcbiAqIEByZXR1cm4ge2Jvb2x9IC0gV2hldGhlciBvciBub3QgaXQgaXMgYSBjYW52YXMgdHlwZS5cbiAqL1xuZnVuY3Rpb24gaXNDYW52YXNUeXBlKGFyZykge1xuXHRyZXR1cm4gYXJnIGluc3RhbmNlb2YgSW1hZ2VEYXRhIHx8XG5cdFx0YXJnIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCB8fFxuXHRcdGFyZyBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50IHx8XG5cdFx0YXJnIGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudDtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSB0ZXh0dXJlIE1VU1QgYmUgYSBwb3dlci1vZi10d28uIE90aGVyd2lzZSByZXR1cm4gZmFsc2UuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgdGV4dHVyZSBzcGVjaWZpY2F0aW9uIG9iamVjdC5cbiAqXG4gKiBAcmV0dXJuIHtib29sfSAtIFdoZXRoZXIgb3Igbm90IHRoZSB0ZXh0dXJlIG11c3QgYmUgYSBwb3dlciBvZiB0d28uXG4gKi9cbmZ1bmN0aW9uIG11c3RCZVBvd2VyT2ZUd28oc3BlYykge1xuXHQvLyBBY2NvcmRpbmcgdG86XG5cdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJHTF9BUEkvVHV0b3JpYWwvVXNpbmdfdGV4dHVyZXNfaW5fV2ViR0wjTm9uX3Bvd2VyLW9mLXR3b190ZXh0dXJlc1xuXHQvLyBOLVBPVCB0ZXh0dXJlcyBjYW5ub3QgYmUgdXNlZCB3aXRoIG1pcG1hcHBpbmcgYW5kIHRoZXkgbXVzdCBub3QgXCJSRVBFQVRcIlxuXHRyZXR1cm4gc3BlYy5taXBNYXAgfHxcblx0XHRzcGVjLndyYXBTID09PSAnUkVQRUFUJyB8fFxuXHRcdHNwZWMud3JhcFMgPT09ICdNSVJST1JFRF9SRVBFQVQnIHx8XG5cdFx0c3BlYy53cmFwVCA9PT0gJ1JFUEVBVCcgfHxcblx0XHRzcGVjLndyYXBUID09PSAnTUlSUk9SRURfUkVQRUFUJztcbn07XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBwcm92aWRlZCBpbnRlZ2VyIGlzIGEgcG93ZXIgb2YgdHdvLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBudW0gLSBUaGUgbnVtYmVyIHRvIHRlc3QuXG4gKlxuICogQHJldHVybiB7Ym9vbGVhbn0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgbnVtYmVyIGlzIGEgcG93ZXIgb2YgdHdvLlxuICovXG5mdW5jdGlvbiBpc1Bvd2VyT2ZUd28obnVtKSB7XG5cdHJldHVybiAobnVtICE9PSAwKSA/IChudW0gJiAobnVtIC0gMSkpID09PSAwIDogZmFsc2U7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG5leHQgaGlnaGVzdCBwb3dlciBvZiB0d28gZm9yIGEgbnVtYmVyLlxuICpcbiAqIEV4LlxuICpcbiAqXHQgMjAwIC0+IDI1NlxuICpcdCAyNTYgLT4gMjU2XG4gKlx0IDI1NyAtPiA1MTJcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbnVtIC0gVGhlIG51bWJlciB0byBtb2RpZnkuXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSAtIE5leHQgaGlnaGVzdCBwb3dlciBvZiB0d28uXG4gKi9cbmZ1bmN0aW9uIG5leHRIaWdoZXN0UG93ZXJPZlR3byhudW0pIHtcblx0aWYgKG51bSAhPT0gMCkge1xuXHRcdG51bSA9IG51bS0xO1xuXHR9XG5cdG51bSB8PSBudW0gPj4gMTtcblx0bnVtIHw9IG51bSA+PiAyO1xuXHRudW0gfD0gbnVtID4+IDQ7XG5cdG51bSB8PSBudW0gPj4gODtcblx0bnVtIHw9IG51bSA+PiAxNjtcblx0cmV0dXJuIG51bSArIDE7XG59O1xuXG4vKipcbiAqIElmIHRoZSB0ZXh0dXJlIG11c3QgYmUgYSBQT1QsIHJlc2l6ZXMgYW5kIHJldHVybnMgdGhlIGltYWdlLlxuICogQHByaXZhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSB0ZXh0dXJlIHNwZWNpZmljYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWcgLSBUaGUgaW1hZ2Ugb2JqZWN0LlxuICpcbiAqIEByZXR1cm4ge0hUTUxJbWFnZUVsZW1lbnR8SFRNTENhbnZhc0VsZW1lbnR9IC0gVGhlIG9yaWdpbmFsIGltYWdlLCBvciB0aGUgcmVzaXplZCBjYW52YXMgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gcmVzaXplQ2FudmFzKHNwZWMsIGltZykge1xuXHRpZiAoIW11c3RCZVBvd2VyT2ZUd28oc3BlYykgfHxcblx0XHQoaXNQb3dlck9mVHdvKGltZy53aWR0aCkgJiYgaXNQb3dlck9mVHdvKGltZy5oZWlnaHQpKSkge1xuXHRcdHJldHVybiBpbWc7XG5cdH1cblx0Ly8gY3JlYXRlIGFuIGVtcHR5IGNhbnZhcyBlbGVtZW50XG5cdGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRjYW52YXMud2lkdGggPSBuZXh0SGlnaGVzdFBvd2VyT2ZUd28oaW1nLndpZHRoKTtcblx0Y2FudmFzLmhlaWdodCA9IG5leHRIaWdoZXN0UG93ZXJPZlR3byhpbWcuaGVpZ2h0KTtcblx0Ly8gY29weSB0aGUgaW1hZ2UgY29udGVudHMgdG8gdGhlIGNhbnZhc1xuXHRjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0Y3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCwgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblx0cmV0dXJuIGNhbnZhcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpc0NhbnZhc1R5cGU6IGlzQ2FudmFzVHlwZSxcblx0bXVzdEJlUG93ZXJPZlR3bzogbXVzdEJlUG93ZXJPZlR3byxcblx0aXNQb3dlck9mVHdvOiBpc1Bvd2VyT2ZUd28sXG5cdG5leHRIaWdoZXN0UG93ZXJPZlR3bzogbmV4dEhpZ2hlc3RQb3dlck9mVHdvLFxuXHRyZXNpemVDYW52YXM6IHJlc2l6ZUNhbnZhc1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0LyoqXG5cdCAqIFNlbmRzIGFuIFhNTEh0dHBSZXF1ZXN0IEdFVCByZXF1ZXN0IHRvIHRoZSBzdXBwbGllZCB1cmwuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIFhIUiBvcHRpb25zLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy51cmwgLSBUaGUgVVJMIGZvciB0aGUgcmVzb3VyY2UuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gb3B0aW9ucy5jcm9zc09yaWdpbiAtIEVuYWJsZSBjcm9zcy1vcmlnaW4gcmVxdWVzdC5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5zdWNjZXNzIC0gVGhlIHN1Y2Nlc3MgY2FsbGJhY2sgZnVuY3Rpb24uXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMuZXJyb3IgLSBUaGUgZXJyb3IgY2FsbGJhY2sgZnVuY3Rpb24uXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMucmVzcG9uc2VUeXBlIC0gVGhlIHJlc3BvbnNlVHlwZSBvZiB0aGUgWEhSLlxuXHQgKi9cblx0bG9hZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0XHRjb25zdCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0cmVxdWVzdC5vcGVuKCdHRVQnLCBvcHRpb25zLnVybCwgdHJ1ZSk7XG5cdFx0cmVxdWVzdC5yZXNwb25zZVR5cGUgPSBvcHRpb25zLnJlc3BvbnNlVHlwZTtcblx0XHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcblx0XHRcdGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQpIHtcblx0XHRcdFx0aWYgKHJlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5zdWNjZXNzKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLnN1Y2Nlc3MocmVxdWVzdC5yZXNwb25zZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChvcHRpb25zLmVycm9yKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmVycm9yKGBHRVQgJHtyZXF1ZXN0LnJlc3BvbnNlVVJMfSAke3JlcXVlc3Quc3RhdHVzfSAoJHtyZXF1ZXN0LnN0YXR1c1RleHR9KWApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0cmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSBvcHRpb25zLmNyb3NzT3JpZ2luID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdHJlcXVlc3Quc2VuZCgpO1xuXHR9XG59O1xuIl19
