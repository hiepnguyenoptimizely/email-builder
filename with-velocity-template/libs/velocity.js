var Velocity;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = __webpack_require__(/*! ./src/velocity */ "./src/velocity.js");


/***/ }),

/***/ "./node_modules/debug/src/browser.js":
/*!*******************************************!*\
  !*** ./node_modules/debug/src/browser.js ***!
  \*******************************************/
/***/ ((module, exports, __webpack_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(/*! ./common */ "./node_modules/debug/src/common.js")(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ "./node_modules/debug/src/common.js":
/*!******************************************!*\
  !*** ./node_modules/debug/src/common.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(/*! ms */ "./node_modules/ms/index.js");
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ "./node_modules/ms/index.js":
/*!**********************************!*\
  !*** ./node_modules/ms/index.js ***!
  \**********************************/
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ "./src/compile/blocks.js":
/*!*******************************!*\
  !*** ./src/compile/blocks.js ***!
  \*******************************/
/***/ ((module) => {

"use strict";

module.exports = function(Velocity, utils) {

  /**
   * blocks such as if, foreach, macro syntax handler
   */
  utils.mixin(Velocity.prototype, {

    getBlock: function(block) {

      var ast = block[0];
      var ret = '';

      switch (ast.type) {
        case 'if':
          ret = this.getBlockIf(block);
          break;
        case 'foreach':
          ret = this.getBlockEach(block);
          break;
        case 'macro':
          this.setBlockMacro(block);
          break;
        case 'noescape':
          ret = this._render(block.slice(1));
          break;
        case 'define':
          this.setBlockDefine(block);
          break;
        case 'macro_body':
          ret = this.getMacroBody(block);
          break;
        default:
          ret = this._render(block);
      }

      return ret || '';
    },

    /**
     * define
     */
    setBlockDefine: function(block) {
      var ast = block[0];
      var _block = block.slice(1);
      var defines = this.defines;

      defines[ast.id] = _block;
    },

    /**
     * define macro
     */
    setBlockMacro: function(block) {
      var ast = block[0];
      var _block = block.slice(1);
      var macros = this.macros;

      macros[ast.id] = {
        asts: _block,
        args: ast.args
      };
    },

    getMacroBody: function(asts) {
      const ast = asts[0];
      var _block = asts.slice(1);
      var bodyContent = this.eval(_block, {});
      return this.getMacro(ast, bodyContent);
    },

    /**
     * parse macro call
     */
    getMacro: function(ast, bodyContent) {
      var macro = this.macros[ast.id];
      var ret = '';

      if (!macro) {

        var jsmacros = this.jsmacros;
        macro = jsmacros[ast.id];
        var jsArgs = [];

        if (macro && macro.apply) {

          utils.forEach(ast.args, function(a) {
            jsArgs.push(this.getLiteral(a));
          }, this);

          var self = this;

          // bug修复：此处由于闭包特性，导致eval函数执行时的this对象是上一次函数执行时的this对象，渲染时上下文发生错误。
          // js macros export evel function
          jsmacros.eval = function() {
            return self.eval.apply(self, arguments);
          };


          try {
            ret = macro.apply(jsmacros, jsArgs);
          } catch (e) {
            var pos = ast.pos;
            var text = Velocity.Helper.getRefText(ast);
            // throws error tree
            var err = '\n      at ' + text + ' L/N ' + pos.first_line + ':' + pos.first_column;
            e.name = '';
            e.message += err;
            throw e;
          }

        }

      } else {
        var asts = macro.asts;
        var args = macro.args;
        var callArgs = ast.args;
        var local = { bodyContent: bodyContent };
        var guid = utils.guid();
        var contextId = 'macro:' + ast.id + ':' + guid;

        utils.forEach(args, function(ref, i) {
          if (callArgs[i]) {
            local[ref.id] = this.getLiteral(callArgs[i]);
          } else {
            local[ref.id] = undefined;
          }
        }, this);

        ret = this.eval(asts, local, contextId);
      }

      return ret;
    },

    /**
     * eval
     * @param str {array|string} input string
     * @param local {object} local variable
     * @param contextId {=string} optional contextId, this contextId use to find local variable
     * @return {string}
     */
    eval: function(str, local, contextId) {

      if (!local) {

        if (utils.isArray(str)) {
          return this._render(str);
        } else {
          return this.evalStr(str);
        }

      } else {

        var asts = [];
        var parse = Velocity.parse;
        contextId = contextId || ('eval:' + utils.guid());

        if (utils.isArray(str)) {

          asts = str;

        } else if (parse) {

          asts = parse(str);

        }

        if (asts.length) {

          this.local[contextId] = local;
          var ret = this._render(asts, contextId);
          this.local[contextId] = {};
          this.conditions.shift();
          this.condition = this.conditions[0] || '';

          return ret;
        }

      }

    },

    /**
     * parse #foreach
     */
    getBlockEach: function(block) {

      var ast = block[0];
      var tFrom = {};
      Object.assign(tFrom, ast.from, {pos: ast.pos});
      var _from = this.getLiteral(tFrom);
      var _block = block.slice(1);
      var _to = ast.to;
      var local = {
        foreach: {
          count: 0
        }
      };
      var ret = '';
      var guid = utils.guid();
      var contextId = 'foreach:' + guid;

      var type = ({}).toString.call(_from);
      if (!_from || (type !== '[object Array]' && type !== '[object Object]')) {
        return '';
      }

      if (utils.isArray(_from)) {
        var len = _from.length;
        utils.forEach(_from, function(val, i) {
          if (this._state.break) {
            return;
          }
          // for each local variable
          local[_to] = val;
          local.foreach = {
            count: i + 1,
            index: i,
            hasNext: i + 1 < len
          };
          local.velocityCount = i + 1;

          this.local[contextId] = local;
          ret += this._render(_block, contextId);

        }, this);
      } else {
        var len = utils.keys(_from).length;
        utils.forEach(utils.keys(_from), function(key, i) {
          if (this._state.break) {
            return;
          }
          local[_to] = _from[key];
          local.foreach = {
            count: i + 1,
            index: i,
            hasNext: i + 1 < len
          };
          local.velocityCount = i + 1;
          this.local[contextId] = local;
          ret += this._render(_block, contextId);
        }, this);
      }

      // if foreach items be an empty array, then this code will shift current
      // conditions, but not this._render call, so this will shift parent context
      if (_from && _from.length) {
        this._state.break = false;
        // empty current local context object
        this.local[contextId] = {};
        this.conditions.shift();
        this.condition = this.conditions[0] || '';
      }

      return ret;

    },

    /**
     * parse #if
     */
    getBlockIf: function(block) {

      var received = false;
      var asts = [];

      utils.some(block, function(ast) {

        if (ast.condition) {

          if (received) {
            return true;
          }
          received = this.getExpression(ast.condition);

        } else if (ast.type === 'else') {
          if (received) {
            return true;
          }
          received = true;
        } else if (received) {
          asts.push(ast);
        }

        return false;

      }, this);

      // keep current condition fix #77
      return this._render(asts, this.condition);
    }
  });
};


/***/ }),

/***/ "./src/compile/compile.js":
/*!********************************!*\
  !*** ./src/compile/compile.js ***!
  \********************************/
/***/ ((module) => {

module.exports = function(Velocity, utils) {

  /**
   * compile
   */
  utils.mixin(Velocity.prototype, {
    init: function() {
      this.context = {};
      this.macros = {};
      this.defines = {};
      this.conditions = [];
      this.local = {};
      this.silence = false;
      this.unescape = {};

      var self = this;
      this.directive = {
        stop: function() {
          self._state.stop = true;
          return '';
        }
      };
    },

    /**
     * @param context {object} context object
     * @param macro   {object} self defined #macro
     * @param silent {bool} 如果是true，$foo变量将原样输出
     * @return str
     */
    render: function(context, macros, silence) {

      this.silence = !!silence;
      this.context = context || {};
      this.jsmacros = utils.mixin(macros || {}, this.directive);
      var t1 = utils.now();
      var str = this._render();
      var t2 = utils.now();
      var cost = t2 - t1;

      this.cost = cost;

      return str;
    },

    /**
     * 解析入口函数
     * @param ast {array} 模板结构数组
     * @param contextId {number} 执行环境id，对于macro有局部作用域，变量的设置和
     * 取值，都放在一个this.local下，通过contextId查找
     * @return {string}解析后的字符串
     */
    _render: function(asts, contextId) {

      var str = '';
      asts = asts || this.asts;

      if (contextId) {

        if (contextId !== this.condition &&
            utils.indexOf(contextId, this.conditions) === -1) {
          this.conditions.unshift(contextId);
        }

        this.condition = contextId;

      } else {
        this.condition = null;
      }

      utils.forEach(asts, function(ast) {

        // 进入stop，直接退出
        if (this._state.stop === true) {
          return false;
        }

        switch (ast.type) {
          case 'references':
            str += this.format(this.getReferences(ast, true));
          break;

          case 'set':
            this.setValue(ast);
          break;

          case 'break':
            this._state.break = true;
          break;

          case 'macro_call':
            str += this.getMacro(ast);
          break;

          case 'comment':
          break;

          case 'raw':
            str += ast.value;
          break;

          default:
            str += typeof ast === 'string' ? ast : this.getBlock(ast);
          break;
        }
      }, this);

      return str;
    },
    format: function(value) {
      if (utils.isArray(value)) {
        return "[" + value.map(this.format.bind(this)).join(", ") + "]";
      }

      if (utils.isObject(value)) {
        if (value.toString.toString().indexOf('[native code]') === -1) {
          return value;
        }

        var kvJoin = function(k) { return k + "=" + this.format(value[k]); }.bind(this);
        return "{" + Object.keys(value).map(kvJoin).join(", ") + "}";
      }

      return value;
    }
  });
};


/***/ }),

/***/ "./src/compile/expression.js":
/*!***********************************!*\
  !*** ./src/compile/expression.js ***!
  \***********************************/
/***/ ((module) => {

module.exports = function(Velocity, utils){
  /**
   * expression support, include math, logic, compare expression
   */
  utils.mixin(Velocity.prototype, {
    /**
     * 表达式求值，表达式主要是数学表达式，逻辑运算和比较运算，到最底层数据结构，
     * 基本数据类型，使用 getLiteral求值，getLiteral遇到是引用的时候，使用
     * getReferences求值
     */
    getExpression: function(ast){

      var exp = ast.expression;
      var ret;
      if (ast.type === 'math') {

        switch(ast.operator) {
          case '+':
          ret = this.getExpression(exp[0]) + this.getExpression(exp[1]);
          break;

          case '-':
          ret = this.getExpression(exp[0]) - this.getExpression(exp[1]);
          break;

          case '/':
          ret = this.getExpression(exp[0]) / this.getExpression(exp[1]);
          break;

          case '%':
          ret = this.getExpression(exp[0]) % this.getExpression(exp[1]);
          break;

          case '*':
          ret = this.getExpression(exp[0]) * this.getExpression(exp[1]);
          break;

          case '||':
          ret = this.getExpression(exp[0]) || this.getExpression(exp[1]);
          break;

          case '&&':
          ret = this.getExpression(exp[0]) && this.getExpression(exp[1]);
          break;

          case '>':
          ret = this.getExpression(exp[0]) > this.getExpression(exp[1]);
          break;

          case '<':
          ret = this.getExpression(exp[0]) < this.getExpression(exp[1]);
          break;

          case '==':
          ret = this.getExpression(exp[0]) == this.getExpression(exp[1]);
          break;

          case '>=':
          ret = this.getExpression(exp[0]) >= this.getExpression(exp[1]);
          break;

          case '<=':
          ret = this.getExpression(exp[0]) <= this.getExpression(exp[1]);
          break;

          case '!=':
          ret = this.getExpression(exp[0]) != this.getExpression(exp[1]);
          break;

          case 'minus':
          ret = - this.getExpression(exp[0]);
          break;

          case 'not':
          ret = !this.getExpression(exp[0]);
          break;

          case 'parenthesis':
          ret = this.getExpression(exp[0]);
          break;

          default:
          return;
          // code
        }

        return ret;
      } else {
        return this.getLiteral(ast);
      }
    }
  });
};


/***/ }),

/***/ "./src/compile/index.js":
/*!******************************!*\
  !*** ./src/compile/index.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var utils = __webpack_require__(/*! ../utils */ "./src/utils.js");
var Helper = __webpack_require__(/*! ../helper/index */ "./src/helper/index.js");
var methods = __webpack_require__(/*! ./methods */ "./src/compile/methods.js");
function Velocity(asts, config) {
  this.asts = asts;
  this.config = utils.mixin(
    {
      /**
       * if escapeHtml variable, is set true
       * $foo value will handle by escapeHtml
       */
      escape: false,
      // whiteList which no need escapeHtml
      unescape: {},
      valueMapper(value) {
        return value;
      },
    },
    config
  );
  this._state = { stop: false, break: false };
  this.customMethodHandlers = methods.concat(config ? config.customMethodHandlers : []);
  this.init();
}

Velocity.Helper = Helper;
Velocity.prototype = {
  constructor: Velocity
};

__webpack_require__(/*! ./blocks */ "./src/compile/blocks.js")(Velocity, utils);
__webpack_require__(/*! ./literal */ "./src/compile/literal.js")(Velocity, utils);
__webpack_require__(/*! ./references */ "./src/compile/references.js")(Velocity, utils);
__webpack_require__(/*! ./set */ "./src/compile/set.js")(Velocity, utils);
__webpack_require__(/*! ./expression */ "./src/compile/expression.js")(Velocity, utils);
__webpack_require__(/*! ./compile */ "./src/compile/compile.js")(Velocity, utils);
module.exports = Velocity;


/***/ }),

/***/ "./src/compile/literal.js":
/*!********************************!*\
  !*** ./src/compile/literal.js ***!
  \********************************/
/***/ ((module) => {

"use strict";

module.exports = function(Velocity, utils) {
  /**
   * literal parse, include string, integer, array, map, bool data structure
   * @require {method} getReferences
   */
  utils.mixin(Velocity.prototype, {
    /**
     * 字面量求值，主要包括string, integer, array, map四种数据结构
     * @param literal {object} 定义于velocity.yy文件，type描述数据类型，value属性
     * 是literal值描述
     * @return {object|string|number|array} js variable
     */
    getLiteral: function(literal) {

      var type = literal.type;
      var ret = '';

      if (type === 'string') {

        ret = this.getString(literal);

      } else if (type === 'integer') {

        ret = parseInt(literal.value, 10);

      } else if (type === 'decimal') {

        ret = parseFloat(literal.value, 10);

      } else if (type === 'array') {

        ret = this.getArray(literal);

      } else if (type === 'map') {

        ret = {};
        var map = literal.value;

        utils.forEach(map, function(exp, key) {
          ret[key] = this.getLiteral(exp);
        }, this);
      } else if (type === 'bool') {

        if (literal.value === "null") {
          ret = null;
        } else if (literal.value === 'false') {
          ret = false;
        } else if (literal.value === 'true') {
          ret = true;
        }

      } else {

        ret = this.getReferences(literal);

      }

      return ret;
    },

    /**
     * 对字符串求值，对已双引号字符串，需要做变量替换
     */
    getString: function(literal) {
      var val = literal.value;
      var ret = val;

      if (literal.isEval && (val.indexOf('#') !== -1 ||
            val.indexOf("$") !== -1)) {
        ret = this.evalStr(val);
      }

      return ret;
    },

    /**
     * 对array字面量求值，比如[1, 2]=> [1,2]，[1..5] => [1,2,3,4,5]
     * @param literal {object} array字面量的描述对象，分为普通数组和range数组两种
     * ，和js基本一致
     * @return {array} 求值得到的数组
     */
    getArray: function(literal) {

      var ret = [];

      if (literal.isRange) {

        var begin = literal.value[0];
        if (begin.type === 'references') {
          begin = this.getReferences(begin);
        }

        var end = literal.value[1];
        if (end.type === 'references') {
          end = this.getReferences(end);
        }

        end   = parseInt(end, 10);
        begin = parseInt(begin, 10);

        var i;

        if (!isNaN(begin) && !isNaN(end)) {

          if (begin < end) {
            for (i = begin; i <= end; i++) ret.push(i);
          } else {
            for (i = begin; i >= end; i--) ret.push(i);
          }
        }

      } else {
        utils.forEach(literal.value, function(exp) {
          ret.push(this.getLiteral(exp));
        }, this);
      }

      return ret;
    },

    /**
     * 对双引号字符串进行eval求值，替换其中的变量，只支持最基本的变量类型替换
     */
    evalStr: function(str) {
      var asts = Velocity.parse(str);
      return this._render(asts, this.condition);
    }
  });
};


/***/ }),

/***/ "./src/compile/methods.js":
/*!********************************!*\
  !*** ./src/compile/methods.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const utils = __webpack_require__(/*! ../utils */ "./src/utils.js");

function hasProperty(context, field) {
  if (typeof context === 'number' || typeof context === 'string') {
    return context[field] || Object.prototype.hasOwnProperty.call(context, field);
  }
  if (!context) {
    return false;
  }
  return field in context;
}

function matchProperty(value, notInContext) {
  return function({ property, context }) {
    return value === property && (
      notInContext ? !hasProperty(context, property) : true
    );
  }
}

function matchStartWith(value) {
  return function({ property, context }) {
    return property.indexOf(value) === 0 &&
      !(property in context) &&
      property.length > value.length;
  }
}

function getter(base, property) {
  // get(1)
  if (typeof property === 'number') {
    return base[property];
  }

  var letter = property.charCodeAt(0);
  var isUpper = letter < 91;
  var ret = base[property];

  if (ret !== undefined) {
    return ret;
  }

  if (isUpper) {
    // Address => address
    property = String.fromCharCode(letter).toLowerCase() + property.slice(1);
  }

  if (!isUpper) {
    // address => Address
    property = String.fromCharCode(letter).toUpperCase() + property.slice(1);
  }

  return base[property];
}

function getSize(obj) {
  if (utils.isArray(obj)) {
    return obj.length;
  } else if (utils.isObject(obj)) {
    return utils.keys(obj).length;
  }

  return undefined;
}

const handlers = {
  // $foo.get('bar')
  get: {
    match: matchProperty('get', true),
    resolve: function({ context, params }) {
      return getter(context, params[0]);
    },
  },
  // $foo.set('a', 'b')
  set: {
    match: matchProperty('set', true),
    resolve: function({ context, params, property }) {
      context[params[0]] = params[1];
      return '';
    },
  },
  // getAddress()
  getValue: {
    match: matchStartWith('get'),
    resolve: function({ context, property }) {
      return getter(context, property.slice(3))
    },
  },
  isValue: {
    match: matchStartWith('is'),
    resolve: function({ context, property }) {
      return getter(context, property.slice(2))
    },
  },
  // $page.setName(123)
  setValue: {
    match: matchStartWith('set'),
    resolve: function({ context, property, params }) {
      context[property.slice(3)] = params[0];
      // set value will not output anything
      context.toString = function() { return ''; };
      return context;
    },
  },
  keySet: {
    match: matchProperty('keySet', true),
    resolve: function({ context }) {
      return utils.keys(context);
    },
  },
  entrySet: {
    match: matchProperty('entrySet', true),
    resolve: function({ context }) {
      const ret = [];
      utils.forEach(context, function(value, key) {
        ret.push({ key: key, value: value });
      });
      return ret;
    },
  },
  size: {
    match: matchProperty('size', true),
    resolve: function({ context }) {
      return getSize(context);
    },
  },
  put: {
    match: matchProperty('put', true),
    resolve: function({ context, params }) {
      return context[params[0]] = params[1];
    },
  },
  add: {
    match: matchProperty('add', true),
    resolve: function({ context, params }) {
      if (typeof context.push !== 'function') {
        return;
      }
      return context.push(params[0]);
    },
  },
  remove: {
    match: matchProperty('remove', true),
    resolve: function({ context, params }) {
      if (utils.isArray(context)) {

        let index;
        if (typeof index === 'number') {
          index = params[0];
        } else {
          index = context.indexOf(params[0]);
        }

        ret = context[index];
        context.splice(index, 1);
        return ret;

      } else if (utils.isObject(context)) {
        ret = context[params[0]];
        delete context[params[0]];
        return ret;
      }

      return undefined;
    },
  },
  subList: {
    match: matchProperty('subList', true),
    resolve: function({ context, params }) {
      return context.slice(params[0], params[1]);
    },
  }
};

module.exports = utils.keys(handlers).map(function(key) {
  return {
    uid: 'system: ' + key,
    match: handlers[key].match,
    resolve: handlers[key].resolve,
  };
});

/***/ }),

/***/ "./src/compile/references.js":
/*!***********************************!*\
  !*** ./src/compile/references.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js")('velocity');

module.exports = function(Velocity, utils) {

  'use strict';

  /**
   * escapeHTML
   */
  function convert(str) {

    if (typeof str !== 'string') return str;

    var result = ""
    var escape = false
    var i, c, cstr;

    for (i = 0 ; i < str.length ; i++) {
      c = str.charAt(i);
      if ((' ' <= c && c <= '~') || (c === '\r') || (c === '\n')) {
        if (c === '&') {
          cstr = "&amp;"
          escape = true
        } else if (c === '"') {
          cstr = "&quot;"
          escape = true
        } else if (c === '<') {
          cstr = "&lt;"
          escape = true
        } else if (c === '>') {
          cstr = "&gt;"
          escape = true
        } else {
          cstr = c.toString()
        }
      } else {
        cstr = "&#" + c.charCodeAt().toString() + ";"
      }

      result = result + cstr
    }

    return escape ? result : str
  }

  var posUnknown = { first_line: "unknown", first_column: "unknown"};

  utils.mixin(Velocity.prototype, {
    /**
     * get variable value 
     * @param {object} ast ast data
     * @param {bool} isVal for example `$foo`, isVal value should be true, other condition,
     * `#set($foo = $bar)`, the $bar value get, isVal set to false
     */
    getReferences: function(ast, isVal) {

      if (ast.prue) {
        var define = this.defines[ast.id];
        if (utils.isArray(define)) {
          return this._render(define);
        }
        if (ast.id in this.config.unescape) ast.prue = false;
      }
      var escape = this.config.escape;

      var isSilent = this.silence || ast.leader === "$!";
      var isfn     = ast.args !== undefined;
      var context  = this.context;
      var ret      = context[ast.id];
      var local    = this.getLocal(ast);

      var text = Velocity.Helper.getRefText(ast);

      if (text in context) {
        return (ast.prue && escape) ? convert(context[text]) : context[text];
      }


      if (ret !== undefined && isfn) {
        ret = this.getPropMethod(ast, context, ast);
      }

      if (local.isLocaled) ret = local['value'];

      if (ast.path) {

        utils.some(ast.path, function(property, i, len) {

          if (ret === undefined) {
            this._throw(ast, property);
          }

          // 第三个参数，返回后面的参数ast
          ret = this.getAttributes(property, ret, ast);

        }, this);
      }

      if (isVal && ret === undefined) {
        ret = isSilent ? '' : Velocity.Helper.getRefText(ast);
      }

      ret = (ast.prue && escape) ? convert(ret) : ret;

      return ret;
    },

    /**
     * 获取局部变量，在macro和foreach循环中使用
     */
    getLocal: function(ast) {

      var id = ast.id;
      var local = this.local;
      var ret = false;

      var isLocaled = utils.some(this.conditions, function(contextId) {
        var _local = local[contextId];
        if (id in _local) {
          ret = _local[id];
          return true;
        }

        return false;
      }, this);

      return {
        value: ret,
        isLocaled: isLocaled
      };
    },
    /**
     * $foo.bar 属性求值，最后面两个参数在用户传递的函数中用到
     * @param {object} property 属性描述，一个对象，主要包括id，type等定义
     * @param {object} baseRef 当前执行链结果，比如$a.b.c，第一次baseRef是$a,
     * 第二次是$a.b返回值
     * @private
     */
    getAttributes: function(property, baseRef, ast) {
      // fix #54
      if (baseRef === null || baseRef === undefined) {
        return undefined;
      }

      /**
       * type对应着velocity.yy中的attribute，三种类型: method, index, property
       */
      var type = property.type;
      var ret;
      var id = property.id;
      if (type === 'method') {
        ret = this.getPropMethod(property, baseRef, ast);
      } else if (type === 'property') {
        ret = baseRef[id];
      } else {
        ret = this.getPropIndex(property, baseRef);
      }
      return ret;
    },

    /**
     * $foo.bar[1] index求值
     * @private
     */
    getPropIndex: function(property, baseRef) {
      var ast = property.id;
      var key;
      if (ast.type === 'references') {
        key = this.getReferences(ast);
      } else if (ast.type === 'integer') {
        key = ast.value;
      } else {
        key = ast.value;
      }

      return baseRef[key];
    },

    /**
     * $foo.bar()求值
     */
    getPropMethod: function(property, baseRef, ast) {

      var id = property.id;
      var ret = baseRef[id];
      var args = [];
      utils.forEach(property.args, function(exp) {
        args.push(this.getLiteral(exp));
      }, this);

      const payload = { property: id, params: args, context: baseRef };
      var matched = this.customMethodHandlers.find(function(item) {
        return item && item.match(payload);
      });

      if (matched) {
        debug('match custom method handler, uid %s', matched.uid);
        // run custom method handler, we can
        // add some native method which Java can do, for example
        // #set($foo = [1, 2]) $foo.size()
        ret = matched.resolve(payload);
      } else {

        if (ret && ret.call) {

          var that = this;

          if(typeof baseRef === 'object' && baseRef){
            baseRef.eval = function() {
              return that.eval.apply(that, arguments);
            };
          }

          try {
            ret = ret.apply(baseRef, args);
          } catch (e) {
            var pos = ast.pos || posUnknown;
            var text = Velocity.Helper.getRefText(ast);
            var err = ' on ' + text + ' at L/N ' +
              pos.first_line + ':' + pos.first_column;
            // e.name = '';
            e.message += err;
            throw e;
          }

        } else {
          this._throw(ast, property, 'TypeError');
          ret = undefined;
        }
      }

      return ret;
    },

    _throw: function(ast, property, errorName) {
      if (this.config.env !== 'development') {
        return;
      }

      var text = Velocity.Helper.getRefText(ast);
      var pos = ast.pos || posUnknown;
      var propertyName = property.type === 'index' ? property.id.value : property.id;
      var errorMsg = 'get property ' + propertyName + ' of undefined';
      if (errorName === 'TypeError') {
        errorMsg = propertyName + ' is not method';
      }

      errorMsg += '\n  at L/N ' + text + ' ' + pos.first_line + ':' + pos.first_column;
      var e = new Error(errorMsg);
      e.name = errorName || 'ReferenceError';
      throw e;
    }
  })

}


/***/ }),

/***/ "./src/compile/set.js":
/*!****************************!*\
  !*** ./src/compile/set.js ***!
  \****************************/
/***/ ((module) => {

module.exports = function(Velocity, utils) {
  /**
   * #set value
   */
  utils.mixin(Velocity.prototype, {
    /**
     * get variable from context, if run in block, return local context, else return global context
     */
    getContext: function(idName) {
      var local = this.local;
      // context find, from the conditions stack top to end
      for (var condition of this.conditions) {
        if (local[condition].hasOwnProperty(idName)) {
          return local[condition];
        }
      }
      // not find local variable, return global context
      return this.context;
    },
    /**
     * parse #set
     */
    setValue: function(ast) {
      var ref = ast.equal[0];
      var context = this.getContext(ref.id);

      // @see #25
      if (this.condition && this.condition.indexOf('macro:') === 0) {
        context = this.context;
        // fix #129
      }

      var valAst = ast.equal[1];
      var val;

      if (valAst.type === 'math') {
        val = this.getExpression(valAst);
      } else {
        val = this.config.valueMapper(this.getLiteral(ast.equal[1]));
      }

      if (!ref.path) {

        context[ref.id] = val;

      } else {

        var baseRef = context[ref.id];
        if (typeof baseRef != 'object') {
          baseRef = {};
        }

        context[ref.id] = baseRef;
        var len = ref.path ? ref.path.length: 0;

        const self = this;
        utils.some(ref.path, function(exp, i) {
          var isEnd = len === i + 1;
          var key = exp.id;
          if (exp.type === 'index')  {
            if (exp.id) {
              key = self.getLiteral(exp.id);
            } else {
              key = key.value;
            }
          }

          if (isEnd) {
            return baseRef[key] = val;
          }

          baseRef = baseRef[key];

          // such as
          // #set($a.d.c2 = 2)
          // but $a.d is undefined , value set fail
          if (baseRef === undefined) {
            return true;
          }
        });

      }
    }
  });
};


/***/ }),

/***/ "./src/helper/index.js":
/*!*****************************!*\
  !*** ./src/helper/index.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Helper = {};
var utils = __webpack_require__(/*! ../utils */ "./src/utils.js");
__webpack_require__(/*! ./text */ "./src/helper/text.js")(Helper, utils);
module.exports = Helper;


/***/ }),

/***/ "./src/helper/text.js":
/*!****************************!*\
  !*** ./src/helper/text.js ***!
  \****************************/
/***/ ((module) => {

module.exports = function(Helper, utils){
  /**
   * 获取引用文本，当引用自身不存在的情况下，需要返回原来的模板字符串
   * get variable text
   */
  function getRefText(ast){

    var ret = ast.leader;
    var isFn = ast.args !== undefined;

    if (ast.type === 'macro_call') {
      ret = '#';
    }

    if (ast.isWraped) ret += '{';

    if (isFn) {
      ret += getMethodText(ast);
    } else {
      ret += ast.id;
    }

    utils.forEach(ast.path, function(ref){
      if (ref.type == 'method') {
        ret += '.' + getMethodText(ref);
      } else if (ref.type == 'index') {

        var text = '';
        var id = ref.id;

        if (id.type === 'integer') {

          text = id.value;

        } else if (id.type === 'string') {

          var sign = id.isEval? '"': "'";
          text = sign + id.value + sign;

        } else {

          text = getRefText(id);

        }

        ret += '[' + text + ']';

      } else if (ref.type == 'property') {

        ret += '.' + ref.id;

      }

    }, this);

    if (ast.isWraped) ret += '}';

    return ret;
  }

  function getMethodText(ref) {

    var args = [];
    var ret = '';

    utils.forEach(ref.args, function(arg){
      args.push(getLiteral(arg));
    });

    ret += ref.id + '(' + args.join(',') + ')';

    return ret;

  }

  function getLiteral(ast){

    var ret = '';

    switch(ast.type) {

      case 'string': {
        var sign = ast.isEval? '"': "'";
        ret = sign + ast.value + sign;
        break;
      }

      case 'integer':
      case 'runt':
      case 'bool'   : {
        ret = ast.value;
        break;
      }

      case 'array': {
        ret = '[';
        var len = ast.value.length - 1;
        utils.forEach(ast.value, function(arg, i){
          ret += getLiteral(arg);
          if (i !== len) ret += ', ';
        });
        ret += ']';
        break;
      }

      default:
        ret = getRefText(ast)
    }

    return ret;
  }

  Helper.getRefText = getRefText;
};


/***/ }),

/***/ "./src/parse.js":
/*!**********************!*\
  !*** ./src/parse.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var Parser  = __webpack_require__(/*! ./parse/index */ "./src/parse/index.js");
var _parse = Parser.parse;
var utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

var blockTypes = {
  if: true,
  foreach: true,
  macro: true,
  noescape: true,
  define: true,
  macro_body: true,
};

var customBlocks = [];

/**
 * @param {string} str string to parse
 * @param {object} blocks self define blocks, such as `#cms(1) hello #end`
 * @param {boolean} ignoreSpace if set true, then ignore the newline trim.
 * @return {array} ast array
 */
var parse = function(str, blocks, ignoreSpace) {
  var asts = _parse(str);
  customBlocks = blocks || {};

  /**
   * remove all newline after all direction such as `#set, #each`
   */
  ignoreSpace || utils.forEach(asts, function trim(ast, i) {
    var TRIM_REG = /^[ \t]*\n/;
    // after raw and references, then keep the newline.
    if (ast.type && ['references', 'raw'].indexOf(ast.type) === -1) {
      var _ast = asts[i + 1];
      if (typeof _ast === 'string' && TRIM_REG.test(_ast)) {
        asts[i + 1] = _ast.replace(TRIM_REG, '');
      }
    }
  });

  var ret = makeLevel(asts);

  return utils.isArray(ret) ? ret : ret.arr;
};

function makeLevel(block, index) {

  var len = block.length;
  index = index || 0;
  var ret = [];
  var ignore = index - 1;

  for (var i = index; i < len; i++) {

    if (i <= ignore) continue;

    var ast = block[i];
    var type = ast.type;

    var isBlockType = blockTypes[type];

    // support custom block , for example
    // const vm = '#cms(1)<div class="abs-right"> #H(1,"第一个链接") </div> #end'
    // parse(vm, { cms: true });
    if (!isBlockType && ast.type === 'macro_call' && customBlocks[ast.id]) {
      isBlockType = true;
      ast.type = ast.id;
      delete ast.id;
    }

    if (!isBlockType && type !== 'end') {

      ret.push(ast);

    } else if (type === 'end') {

      return {arr: ret, step: i};

    } else {

      var _ret = makeLevel(block, i + 1);
      ignore = _ret.step;
      _ret.arr.unshift(block[i]);
      ret.push(_ret.arr);

    }

  }

  return ret;
}

module.exports = parse;


/***/ }),

/***/ "./src/parse/index.js":
/*!****************************!*\
  !*** ./src/parse/index.js ***!
  \****************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var velocity = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,8],$V1=[1,9],$V2=[1,19],$V3=[1,10],$V4=[1,24],$V5=[1,25],$V6=[1,23],$V7=[4,10,11,20,35,36,46,83],$V8=[1,29],$V9=[1,34],$Va=[1,30],$Vb=[1,33],$Vc=[4,10,11,20,23,35,36,39,46,49,50,51,54,55,56,57,58,59,60,61,62,63,64,65,66,83,85,94],$Vd=[1,51],$Ve=[1,56],$Vf=[1,57],$Vg=[1,74],$Vh=[1,73],$Vi=[1,86],$Vj=[1,81],$Vk=[1,89],$Vl=[1,97],$Vm=[1,92],$Vn=[1,87],$Vo=[1,96],$Vp=[1,93],$Vq=[1,94],$Vr=[4,10,11,20,23,35,36,39,46,49,50,51,54,55,56,57,58,59,60,61,62,63,64,65,66,76,81,83,84,85,94],$Vs=[1,109],$Vt=[1,123],$Vu=[1,119],$Vv=[1,120],$Vw=[1,133],$Vx=[23,50,85],$Vy=[2,98],$Vz=[23,39,49,50,85],$VA=[23,39,49,50,54,55,56,57,58,59,60,61,62,63,64,65,66,83,85],$VB=[23,39,49,50,54,55,56,57,58,59,60,61,62,63,64,65,66,83,85,96],$VC=[2,111],$VD=[23,39,49,50,54,55,56,57,58,59,60,61,62,63,64,65,66,83,85,94],$VE=[2,114],$VF=[1,142],$VG=[1,148],$VH=[23,49,50],$VI=[1,153],$VJ=[1,154],$VK=[1,155],$VL=[1,156],$VM=[1,157],$VN=[1,158],$VO=[1,159],$VP=[1,160],$VQ=[1,161],$VR=[1,162],$VS=[1,163],$VT=[1,164],$VU=[1,165],$VV=[23,54,55,56,57,58,59,60,61,62,63,64,65,66],$VW=[50,85],$VX=[2,115],$VY=[23,35],$VZ=[1,215],$V_=[1,214],$V$=[39,50],$V01=[23,54,55],$V11=[23,54,55,56,57,61,62,63,64,65,66],$V21=[23,54,55,61,62,63,64,65,66];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"statements":5,"statement":6,"references":7,"directives":8,"content":9,"RAW":10,"COMMENT":11,"set":12,"if":13,"elseif":14,"else":15,"end":16,"foreach":17,"break":18,"define":19,"HASH":20,"NOESCAPE":21,"PARENTHESIS":22,"CLOSE_PARENTHESIS":23,"macro":24,"macro_call":25,"macro_body":26,"SET":27,"equal":28,"IF":29,"expression":30,"ELSEIF":31,"ELSE":32,"END":33,"FOREACH":34,"DOLLAR":35,"ID":36,"IN":37,"MAP_BEGIN":38,"MAP_END":39,"array":40,"BREAK":41,"DEFINE":42,"MACRO":43,"macro_args":44,"macro_call_args_all":45,"MACRO_BODY":46,"macro_call_args":47,"literals":48,"SPACE":49,"COMMA":50,"EQUAL":51,"map":52,"math":53,"||":54,"&&":55,"+":56,"-":57,"*":58,"/":59,"%":60,">":61,"<":62,"==":63,">=":64,"<=":65,"!=":66,"parenthesis":67,"!":68,"literal":69,"brace_begin":70,"attributes":71,"brace_end":72,"BOOL":73,"methodbd":74,"VAR_BEGIN":75,"VAR_END":76,"attribute":77,"method":78,"index":79,"property":80,"DOT":81,"params":82,"CONTENT":83,"BRACKET":84,"CLOSE_BRACKET":85,"string":86,"number":87,"integer":88,"INTEGER":89,"DECIMAL_POINT":90,"STRING":91,"EVAL_STRING":92,"range":93,"RANGE":94,"map_item":95,"MAP_SPLIT":96,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",10:"RAW",11:"COMMENT",20:"HASH",21:"NOESCAPE",22:"PARENTHESIS",23:"CLOSE_PARENTHESIS",27:"SET",29:"IF",31:"ELSEIF",32:"ELSE",33:"END",34:"FOREACH",35:"DOLLAR",36:"ID",37:"IN",38:"MAP_BEGIN",39:"MAP_END",41:"BREAK",42:"DEFINE",43:"MACRO",46:"MACRO_BODY",49:"SPACE",50:"COMMA",51:"EQUAL",54:"||",55:"&&",56:"+",57:"-",58:"*",59:"/",60:"%",61:">",62:"<",63:"==",64:">=",65:"<=",66:"!=",68:"!",73:"BOOL",75:"VAR_BEGIN",76:"VAR_END",81:"DOT",83:"CONTENT",84:"BRACKET",85:"CLOSE_BRACKET",89:"INTEGER",90:"DECIMAL_POINT",91:"STRING",92:"EVAL_STRING",94:"RANGE",96:"MAP_SPLIT"},
productions_: [0,[3,1],[3,2],[5,1],[5,2],[6,1],[6,1],[6,1],[6,1],[6,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,4],[8,1],[8,1],[8,1],[12,5],[13,5],[14,5],[15,2],[16,2],[17,8],[17,10],[17,8],[17,10],[18,2],[19,6],[24,6],[24,5],[44,1],[44,2],[25,5],[25,4],[26,5],[26,4],[47,1],[47,1],[47,3],[47,3],[47,3],[47,3],[45,1],[45,2],[45,3],[45,2],[28,3],[30,1],[30,1],[30,1],[53,3],[53,3],[53,3],[53,3],[53,3],[53,3],[53,3],[53,3],[53,3],[53,3],[53,3],[53,3],[53,3],[53,1],[53,2],[53,2],[53,1],[53,1],[67,3],[7,5],[7,3],[7,3],[7,2],[7,5],[7,3],[7,2],[7,4],[7,2],[7,4],[70,1],[70,1],[72,1],[72,1],[71,1],[71,2],[77,1],[77,1],[77,1],[78,2],[74,4],[74,3],[82,1],[82,1],[82,1],[82,3],[82,3],[80,2],[80,2],[79,3],[79,3],[79,3],[79,2],[79,2],[69,1],[69,1],[69,1],[87,1],[87,3],[87,4],[88,1],[88,2],[86,1],[86,1],[48,1],[48,1],[48,1],[40,3],[40,1],[40,2],[93,5],[93,5],[93,5],[93,5],[52,3],[52,2],[95,3],[95,3],[95,2],[95,5],[95,5],[9,1],[9,1],[9,2],[9,3],[9,3],[9,2]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return []; 
break;
case 2:
 return $$[$0-1]; 
break;
case 3: case 35: case 41: case 42: case 88: case 96: case 98:
 this.$ = [$$[$0]]; 
break;
case 4: case 36: case 89:
 this.$ = [].concat($$[$0-1], $$[$0]); 
break;
case 5:
 $$[$0]['prue'] = true;  $$[$0].pos = this._$; this.$ = $$[$0]; 
break;
case 6:
 $$[$0].pos = this._$; this.$ = $$[$0]; 
break;
case 7: case 10: case 11: case 12: case 13: case 14: case 15: case 16: case 17: case 19: case 20: case 21: case 47: case 48: case 52: case 53: case 54: case 68: case 71: case 72: case 84: case 85: case 86: case 87: case 93: case 101: case 108: case 109: case 114: case 120: case 122: case 135: case 136:
 this.$ = $$[$0]; 
break;
case 8:
 this.$ = {type: 'raw', value: $$[$0] }; 
break;
case 9:
 this.$ = {type: 'comment', value: $$[$0] }; 
break;
case 18:
 this.$ = { type: 'noescape' }; 
break;
case 22:
 this.$ = {type: 'set', equal: $$[$0-1] }; 
break;
case 23:
 this.$ = {type: 'if', condition: $$[$0-1] }; 
break;
case 24:
 this.$ = {type: 'elseif', condition: $$[$0-1] }; 
break;
case 25:
 this.$ = {type: 'else' }; 
break;
case 26:
 this.$ = {type: 'end' }; 
break;
case 27: case 29:
 this.$ = {type: 'foreach', to: $$[$0-3], from: $$[$0-1] }; 
break;
case 28: case 30:
 this.$ = {type: 'foreach', to: $$[$0-4], from: $$[$0-1] }; 
break;
case 31:
 this.$ = {type: $$[$0] }; 
break;
case 32:
 this.$ = {type: 'define', id: $$[$0-1] }; 
break;
case 33:
 this.$ = {type: 'macro', id: $$[$0-2], args: $$[$0-1] }; 
break;
case 34:
 this.$ = {type: 'macro', id: $$[$0-1] }; 
break;
case 37:
 this.$ = { type:"macro_call", id: $$[$0-3].replace(/^\s+|\s+$/g, ''), args: $$[$0-1] }; 
break;
case 38:
 this.$ = { type:"macro_call", id: $$[$0-2].replace(/^\s+|\s+$/g, '') }; 
break;
case 39:
 this.$ = {type: 'macro_body', id: $$[$0-3], args: $$[$0-1] }; 
break;
case 40:
 this.$ = {type: 'macro_body', id: $$[$0-2] }; 
break;
case 43: case 44: case 45: case 46: case 99: case 100:
 this.$ = [].concat($$[$0-2], $$[$0]); 
break;
case 49: case 50: case 103: case 104:
 this.$ = $$[$0-1]; 
break;
case 51:
 this.$ = [$$[$0-2], $$[$0]]; 
break;
case 55:
 this.$ = {type: 'math', expression: [$$[$0-2], $$[$0]], operator: '||' }; 
break;
case 56:
 this.$ = {type: 'math', expression: [$$[$0-2], $$[$0]], operator: '&&' }; 
break;
case 57: case 58: case 59: case 60: case 61:
 this.$ = {type: 'math', expression: [$$[$0-2], $$[$0]], operator: $$[$0-1] }; 
break;
case 62:
 this.$ = {type: 'math', expression: [$$[$0-2], $$[$0]], operator: '>' }; 
break;
case 63:
 this.$ = {type: 'math', expression: [$$[$0-2], $$[$0]], operator: '<' }; 
break;
case 64:
 this.$ = {type: 'math', expression: [$$[$0-2], $$[$0]], operator: '==' }; 
break;
case 65:
 this.$ = {type: 'math', expression: [$$[$0-2], $$[$0]], operator: '>=' }; 
break;
case 66:
 this.$ = {type: 'math', expression: [$$[$0-2], $$[$0]], operator: '<=' }; 
break;
case 67:
 this.$ = {type: 'math', expression: [$$[$0-2], $$[$0]], operator: '!=' }; 
break;
case 69:
 this.$ = {type: 'math', expression: [$$[$0]], operator: 'minus' }; 
break;
case 70:
 this.$ = {type: 'math', expression: [$$[$0]], operator: 'not' }; 
break;
case 73:
 this.$ = {type: 'math', expression: [$$[$0-1]], operator: 'parenthesis' }; 
break;
case 74:
 this.$ = {type: "references", id: $$[$0-2], path: $$[$0-1], isWraped: true, leader: $$[$0-4] }; 
break;
case 75: case 76:
 this.$ = {type: "references", id: $$[$0-1], path: $$[$0], leader: $$[$0-2] }; 
break;
case 77: case 80:
 this.$ = {type: "references", id: $$[$0], leader: $$[$0-1] }; 
break;
case 78:
 this.$ = {type: "references", id: $$[$0-2].id, path: $$[$0-1], isWraped: true, leader: $$[$0-4], args: $$[$0-2].args }; 
break;
case 79:
 this.$ = {type: "references", id: $$[$0-1].id, path: $$[$0], leader: $$[$0-2], args: $$[$0-1].args }; 
break;
case 81:
 this.$ = {type: "references", id: $$[$0-1], isWraped: true, leader: $$[$0-3] }; 
break;
case 82:
 this.$ = {type: "references", id: $$[$0].id, leader: $$[$0-1], args: $$[$0].args }; 
break;
case 83:
 this.$ = {type: "references", id: $$[$0-1].id, isWraped: true, args: $$[$0-1].args, leader: $$[$0-3] }; 
break;
case 90:
 this.$ = {type:"method", id: $$[$0].id, args: $$[$0].args }; 
break;
case 91:
 this.$ = {type: "index", id: $$[$0] }; 
break;
case 92:
 this.$ = {type: "property", id: $$[$0] }; if ($$[$0].type === 'content') this.$ = $$[$0]; 
break;
case 94:
 this.$ = {id: $$[$0-3], args: $$[$0-1] }; 
break;
case 95:
 this.$ = {id: $$[$0-2], args: false }; 
break;
case 97:
 this.$ = [ { type: 'runt', value: $$[$0] } ]; 
break;
case 102:
 this.$ = {type: 'content', value: $$[$0-1] + $$[$0] }; 
break;
case 105:
 this.$ = {type: "content", value: $$[$0-2] + $$[$0-1].value + $$[$0] }; 
break;
case 106: case 107:
 this.$ = {type: "content", value: $$[$0-1] + $$[$0] }; 
break;
case 110:
 this.$ = {type: 'bool', value: $$[$0] }; 
break;
case 111:
 this.$ = {type: "integer", value: $$[$0]}; 
break;
case 112:
 this.$ = {type: "decimal", value: + ($$[$0-2] + '.' + $$[$0]) }; 
break;
case 113:
 this.$ = {type: "decimal", value: - ($$[$0-2] + '.' + $$[$0]) }; 
break;
case 115:
 this.$ = - parseInt($$[$0], 10); 
break;
case 116:
 this.$ = {type: 'string', value: $$[$0] }; 
break;
case 117:
 this.$ = {type: 'string', value: $$[$0], isEval: true }; 
break;
case 118: case 119:
 this.$ = $$[$0];
break;
case 121:
 this.$ = {type: 'array', value: $$[$0-1] }; 
break;
case 123:
 this.$ = {type: 'array', value: [] }; 
break;
case 124: case 125: case 126: case 127:
 this.$ = {type: 'array', isRange: true, value: [$$[$0-3], $$[$0-1]]}; 
break;
case 128:
 this.$ = {type: 'map', value: $$[$0-1] }; 
break;
case 129:
 this.$ = {type: 'map'}; 
break;
case 130: case 131:
 this.$ = {}; this.$[$$[$0-2].value] = $$[$0]; 
break;
case 132:
 this.$ = {}; this.$[$$[$0-1].value] = $$[$01]; 
break;
case 133: case 134:
 this.$ = $$[$0-4]; this.$[$$[$0-2].value] = $$[$0]; 
break;
case 137: case 140:
 this.$ = $$[$0-1] + $$[$0]; 
break;
case 138:
 this.$ = $$[$0-2] + $$[$0-1] + $$[$0]; 
break;
case 139:
 this.$ = $$[$0-2] + $$[$0-1]; 
break;
}
},
table: [{3:1,4:[1,2],5:3,6:4,7:5,8:6,9:7,10:$V0,11:$V1,12:11,13:12,14:13,15:14,16:15,17:16,18:17,19:18,20:$V2,24:20,25:21,26:22,35:$V3,36:$V4,46:$V5,83:$V6},{1:[3]},{1:[2,1]},{4:[1,26],6:27,7:5,8:6,9:7,10:$V0,11:$V1,12:11,13:12,14:13,15:14,16:15,17:16,18:17,19:18,20:$V2,24:20,25:21,26:22,35:$V3,36:$V4,46:$V5,83:$V6},o($V7,[2,3]),o($V7,[2,5]),o($V7,[2,6]),o($V7,[2,7]),o($V7,[2,8]),o($V7,[2,9]),{36:$V8,38:$V9,70:28,73:$Va,74:31,75:$Vb,83:[1,32]},o($V7,[2,10]),o($V7,[2,11]),o($V7,[2,12]),o($V7,[2,13]),o($V7,[2,14]),o($V7,[2,15]),o($V7,[2,16]),o($V7,[2,17]),{21:[1,35],27:[1,38],29:[1,39],31:[1,40],32:[1,41],33:[1,42],34:[1,43],36:[1,37],41:[1,44],42:[1,45],43:[1,46],83:[1,36]},o($V7,[2,19]),o($V7,[2,20]),o($V7,[2,21]),o($V7,[2,135]),o($V7,[2,136]),{36:[1,47]},{1:[2,2]},o($V7,[2,4]),{36:[1,48],74:49},o($Vc,[2,80],{71:50,77:52,78:53,79:54,80:55,22:$Vd,81:$Ve,84:$Vf}),o($Vc,[2,77],{77:52,78:53,79:54,80:55,71:58,81:$Ve,84:$Vf}),o($Vc,[2,82],{77:52,78:53,79:54,80:55,71:59,81:$Ve,84:$Vf}),o($V7,[2,140]),{36:[2,84]},{36:[2,85]},{22:[1,60]},o($V7,[2,137]),{4:[1,62],22:[1,63],83:[1,61]},{22:[1,64]},{22:[1,65]},{22:[1,66]},o($V7,[2,25]),o($V7,[2,26]),{22:[1,67]},o($V7,[2,31]),{22:[1,68]},{22:[1,69]},{22:[1,70]},{22:$Vd,39:$Vg,71:71,72:72,76:$Vh,77:52,78:53,79:54,80:55,81:$Ve,84:$Vf},{39:$Vg,71:75,72:76,76:$Vh,77:52,78:53,79:54,80:55,81:$Ve,84:$Vf},o($Vc,[2,75],{78:53,79:54,80:55,77:77,81:$Ve,84:$Vf}),{7:82,23:[1,79],35:$Vi,36:$Vj,38:$Vk,40:83,48:80,52:84,57:$Vl,69:85,73:$Vm,82:78,84:$Vn,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq,93:88},o($Vr,[2,88]),o($Vr,[2,90]),o($Vr,[2,91]),o($Vr,[2,92]),{36:[1,99],74:98,83:[1,100]},{7:102,35:$Vi,57:$Vl,69:101,73:$Vm,83:[1,103],85:[1,104],86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq},o($Vc,[2,76],{78:53,79:54,80:55,77:77,81:$Ve,84:$Vf}),o($Vc,[2,79],{78:53,79:54,80:55,77:77,81:$Ve,84:$Vf}),{23:[1,105]},o($V7,[2,138]),o($V7,[2,139]),{7:111,23:[1,107],35:$Vi,38:$Vk,40:83,45:106,47:108,48:110,49:$Vs,52:84,57:$Vl,69:85,73:$Vm,84:$Vn,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq,93:88},{7:113,28:112,35:$Vi},{7:121,22:$Vt,30:114,35:$Vi,38:$Vk,40:115,52:116,53:117,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,84:$Vn,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq,93:88},{7:121,22:$Vt,30:124,35:$Vi,38:$Vk,40:115,52:116,53:117,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,84:$Vn,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq,93:88},{35:[1,125]},{35:[1,126]},{36:[1,127]},{7:111,23:[1,129],35:$Vi,38:$Vk,40:83,45:128,47:108,48:110,49:$Vs,52:84,57:$Vl,69:85,73:$Vm,84:$Vn,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq,93:88},{39:$Vg,72:130,76:$Vh,77:77,78:53,79:54,80:55,81:$Ve,84:$Vf},o($Vc,[2,81]),o($Vc,[2,86]),o($Vc,[2,87]),{39:$Vg,72:131,76:$Vh,77:77,78:53,79:54,80:55,81:$Ve,84:$Vf},o($Vc,[2,83]),o($Vr,[2,89]),{23:[1,132],50:$Vw},o($Vr,[2,95]),o($Vx,[2,96]),o($Vx,[2,97]),o([23,50],$Vy),o($Vz,[2,118]),o($Vz,[2,119]),o($Vz,[2,120]),{36:$V8,38:$V9,70:28,73:$Va,74:31,75:$Vb},{7:137,35:$Vi,36:$Vj,38:$Vk,40:83,48:80,52:84,57:$Vl,69:85,73:$Vm,82:134,84:$Vn,85:[1,135],86:90,87:91,88:136,89:$Vo,91:$Vp,92:$Vq,93:88},o($Vz,[2,122]),{39:[1,139],86:140,91:$Vp,92:$Vq,95:138},o($VA,[2,108]),o($VA,[2,109]),o($VA,[2,110]),o($VB,[2,116]),o($VB,[2,117]),o($VA,$VC),o($VD,$VE,{90:[1,141]}),{89:$VF},o($Vr,[2,93]),o($Vr,[2,101],{22:$Vd}),o($Vr,[2,102]),{83:[1,144],85:[1,143]},{85:[1,145]},o($Vr,[2,106]),o($Vr,[2,107]),o($V7,[2,18]),{23:[1,146]},o($V7,[2,38]),{23:[2,47],49:[1,147],50:$VG},{7:111,35:$Vi,38:$Vk,40:83,47:149,48:110,52:84,57:$Vl,69:85,73:$Vm,84:$Vn,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq,93:88},o($VH,[2,41]),o($VH,[2,42]),{23:[1,150]},{51:[1,151]},{23:[1,152]},{23:[2,52]},{23:[2,53]},{23:[2,54],54:$VI,55:$VJ,56:$VK,57:$VL,58:$VM,59:$VN,60:$VO,61:$VP,62:$VQ,63:$VR,64:$VS,65:$VT,66:$VU},o($VV,[2,68]),{22:$Vt,67:166,89:$VF},{7:121,22:$Vt,35:$Vi,53:167,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq},o($VV,[2,71]),o($VV,[2,72]),{7:121,22:$Vt,35:$Vi,53:168,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq},{23:[1,169]},{36:[1,170],38:[1,171]},{36:[1,172]},{7:175,23:[1,174],35:$Vi,44:173},{23:[1,176]},o($V7,[2,40]),o($Vc,[2,74]),o($Vc,[2,78]),o($Vr,[2,94]),{7:178,35:$Vi,38:$Vk,40:83,48:177,52:84,57:$Vl,69:85,73:$Vm,84:$Vn,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq,93:88},{50:$Vw,85:[1,179]},o($Vz,[2,123]),o($VW,$VC,{94:[1,180]}),o($VW,$Vy,{94:[1,181]}),{39:[1,182],50:[1,183]},o($Vz,[2,129]),{96:[1,184]},{89:[1,185]},o($VD,$VX,{90:[1,186]}),o($Vr,[2,103]),o($Vr,[2,105]),o($Vr,[2,104]),o($V7,[2,37]),{7:188,23:[2,50],35:$Vi,38:$Vk,40:83,48:187,52:84,57:$Vl,69:85,73:$Vm,84:$Vn,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq,93:88},{7:190,35:$Vi,38:$Vk,40:83,48:189,52:84,57:$Vl,69:85,73:$Vm,84:$Vn,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq,93:88},{23:[2,48],49:[1,191],50:$VG},o($V7,[2,22]),{7:121,22:$Vt,30:192,35:$Vi,38:$Vk,40:115,52:116,53:117,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,84:$Vn,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq,93:88},o($V7,[2,23]),{7:121,22:$Vt,35:$Vi,53:193,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq},{7:121,22:$Vt,35:$Vi,53:194,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq},{7:121,22:$Vt,35:$Vi,53:195,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq},{7:121,22:$Vt,35:$Vi,53:196,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq},{7:121,22:$Vt,35:$Vi,53:197,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq},{7:121,22:$Vt,35:$Vi,53:198,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq},{7:121,22:$Vt,35:$Vi,53:199,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq},{7:121,22:$Vt,35:$Vi,53:200,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq},{7:121,22:$Vt,35:$Vi,53:201,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq},{7:121,22:$Vt,35:$Vi,53:202,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq},{7:121,22:$Vt,35:$Vi,53:203,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq},{7:121,22:$Vt,35:$Vi,53:204,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq},{7:121,22:$Vt,35:$Vi,53:205,57:$Vu,67:118,68:$Vv,69:122,73:$Vm,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq},o($VV,[2,69]),o($VV,[2,70]),{23:[1,206],54:$VI,55:$VJ,56:$VK,57:$VL,58:$VM,59:$VN,60:$VO,61:$VP,62:$VQ,63:$VR,64:$VS,65:$VT,66:$VU},o($V7,[2,24]),{37:[1,207]},{36:[1,208]},{23:[1,209]},{7:211,23:[1,210],35:$Vi},o($V7,[2,34]),o($VY,[2,35]),o($V7,[2,39]),o($Vx,[2,99]),o($Vx,[2,100]),o($Vz,[2,121]),{7:213,35:$Vi,57:$VZ,88:212,89:$V_},{7:217,35:$Vi,57:$VZ,88:216,89:$V_},o($Vz,[2,128]),{86:218,91:$Vp,92:$Vq},o($V$,[2,132],{40:83,52:84,69:85,93:88,86:90,87:91,88:95,48:219,7:220,35:$Vi,38:$Vk,57:$Vl,73:$Vm,84:$Vn,89:$Vo,91:$Vp,92:$Vq}),o($VA,[2,112]),{89:[1,221]},o($VH,[2,43]),o($VH,[2,46]),o($VH,[2,44]),o($VH,[2,45]),{7:188,23:[2,49],35:$Vi,38:$Vk,40:83,48:187,52:84,57:$Vl,69:85,73:$Vm,84:$Vn,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq,93:88},{23:[2,51]},o($V01,[2,55],{56:$VK,57:$VL,58:$VM,59:$VN,60:$VO,61:$VP,62:$VQ,63:$VR,64:$VS,65:$VT,66:$VU}),o($V01,[2,56],{56:$VK,57:$VL,58:$VM,59:$VN,60:$VO,61:$VP,62:$VQ,63:$VR,64:$VS,65:$VT,66:$VU}),o($V11,[2,57],{58:$VM,59:$VN,60:$VO}),o($V11,[2,58],{58:$VM,59:$VN,60:$VO}),o($VV,[2,59]),o($VV,[2,60]),o($VV,[2,61]),o($V21,[2,62],{56:$VK,57:$VL,58:$VM,59:$VN,60:$VO}),o($V21,[2,63],{56:$VK,57:$VL,58:$VM,59:$VN,60:$VO}),o($V21,[2,64],{56:$VK,57:$VL,58:$VM,59:$VN,60:$VO}),o($V21,[2,65],{56:$VK,57:$VL,58:$VM,59:$VN,60:$VO}),o($V21,[2,66],{56:$VK,57:$VL,58:$VM,59:$VN,60:$VO}),o($V21,[2,67],{56:$VK,57:$VL,58:$VM,59:$VN,60:$VO}),o($VV,[2,73]),{7:222,35:$Vi,40:223,84:$Vn,93:88},{39:[1,224]},o($V7,[2,32]),o($V7,[2,33]),o($VY,[2,36]),{85:[1,225]},{85:[1,226]},{85:$VE},{89:[1,227]},{85:[1,228]},{85:[1,229]},{96:[1,230]},o($V$,[2,130]),o($V$,[2,131]),o($VA,[2,113]),{23:[1,231]},{23:[1,232]},{37:[1,233]},o($Vz,[2,124]),o($Vz,[2,126]),{85:$VX},o($Vz,[2,125]),o($Vz,[2,127]),{7:234,35:$Vi,38:$Vk,40:83,48:235,52:84,57:$Vl,69:85,73:$Vm,84:$Vn,86:90,87:91,88:95,89:$Vo,91:$Vp,92:$Vq,93:88},o($V7,[2,27]),o($V7,[2,29]),{7:236,35:$Vi,40:237,84:$Vn,93:88},o($V$,[2,133]),o($V$,[2,134]),{23:[1,238]},{23:[1,239]},o($V7,[2,28]),o($V7,[2,30])],
defaultActions: {2:[2,1],26:[2,2],33:[2,84],34:[2,85],115:[2,52],116:[2,53],192:[2,51],214:[2,114],227:[2,115]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:
                                    var _reg = /\\+$/;
                                    var _esc = yy_.yytext.match(_reg);
                                    var _num = _esc ? _esc[0].length: null;
                                    /*转义实现，非常恶心，暂时没有好的解决方案*/
                                    if (!_num || !(_num % 2)) {
                                      this.begin("mu");
                                    } else {
                                      yy_.yytext = yy_.yytext.replace(/\\$/, '');
                                      this.begin('esc');
                                    }
                                    if (_num > 1) yy_.yytext = yy_.yytext.replace(/(\\\\)+$/, '\\');
                                    if(yy_.yytext) return 83;
                                  
break;
case 1:
                                    var _reg = /\\+$/;
                                    var _esc = yy_.yytext.match(_reg);
                                    var _num = _esc ? _esc[0].length: null;
                                    if (!_num || !(_num % 2)) {
                                      this.begin("h");
                                    } else {
                                      yy_.yytext = yy_.yytext.replace(/\\$/, '');
                                      this.begin('esc');
                                    }
                                    if (_num > 1) yy_.yytext = yy_.yytext.replace(/(\\\\)+$/, '\\');
                                    if(yy_.yytext) return 83;
                                  
break;
case 2: return 83; 
break;
case 3: this.popState(); return 11; 
break;
case 4: this.popState(); yy_.yytext = yy_.yytext.replace(/^#\[\[|\]\]#$/g, ''); return 10
break;
case 5: this.popState(); return 11; 
break;
case 6: return 46; 
break;
case 7: return 20; 
break;
case 8: return 27; 
break;
case 9: return 29; 
break;
case 10: return 31; 
break;
case 11: this.popState(); return 32; 
break;
case 12: this.popState(); return 32; 
break;
case 13: this.popState(); return 33; 
break;
case 14: this.popState(); return 33; 
break;
case 15: this.popState(); return 41; 
break;
case 16: return 34; 
break;
case 17: return 21; 
break;
case 18: return 42; 
break;
case 19: return 43; 
break;
case 20: return 37; 
break;
case 21: return yy_.yytext; 
break;
case 22: return yy_.yytext; 
break;
case 23: return 65; 
break;
case 24: return yy_.yytext; 
break;
case 25: return 64; 
break;
case 26: return yy_.yytext; 
break;
case 27: return 61; 
break;
case 28: return 62; 
break;
case 29: return yy_.yytext; 
break;
case 30: return 63; 
break;
case 31: return yy_.yytext; 
break;
case 32: return 54; 
break;
case 33: return yy_.yytext; 
break;
case 34: return 55; 
break;
case 35: return yy_.yytext; 
break;
case 36: return 66; 
break;
case 37: return 68; 
break;
case 38: return 35; 
break;
case 39: return 35; 
break;
case 40: return yy_.yytext; 
break;
case 41: return 51; 
break;
case 42:
                                    var len = this.stateStackSize();
                                    if (len >= 2 && this.topState() === 'c' && this.topState(1) === 'run') {
                                      return 49;
                                    }
                                  
break;
case 43: /*ignore whitespace*/ 
break;
case 44: return 38; 
break;
case 45: return 39; 
break;
case 46: return 96; 
break;
case 47: yy.begin = true; return 75; 
break;
case 48: this.popState(); if (yy.begin === true) { yy.begin = false; return 76;} else { return 83; } 
break;
case 49: this.begin("c"); return 22; 
break;
case 50:
                                    if (this.popState() === "c") {
                                      var len = this.stateStackSize();

                                      if (this.topState() === 'run') {
                                        this.popState();
                                        len = len - 1;
                                      }

                                      var tailStack = this.topState(len - 2);
                                      /** 遇到#set(a = b)括号结束后结束状态h*/
                                      if (len === 2 && tailStack === "h"){
                                        this.popState();
                                      } else if (len === 3 && tailStack === "mu" &&  this.topState(len - 3) === "h") {
                                        // issue#7 $foo#if($a)...#end
                                        this.popState();
                                        this.popState();
                                      }

                                      return 23; 
                                    } else {
                                      return 83; 
                                    }
                                  
break;
case 51: this.begin("i"); return 84; 
break;
case 52: 
                                    if (this.popState() === "i") {
                                      return 85; 
                                    } else {
                                      return 83;
                                    }
                                  
break;
case 53: return 94; 
break;
case 54: return 81; 
break;
case 55: return 90; 
break;
case 56: return 50; 
break;
case 57: yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2).replace(/\\"/g,'"'); return 92; 
break;
case 58: yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2).replace(/\\'/g,"'"); return 91; 
break;
case 59: return 73; 
break;
case 60: return 73; 
break;
case 61: return 73; 
break;
case 62: return 89; 
break;
case 63: return 36; 
break;
case 64: this.begin("run"); return 36; 
break;
case 65: this.begin('h'); return 20; 
break;
case 66: this.popState(); return 83; 
break;
case 67: this.popState(); return 83; 
break;
case 68: this.popState(); return 83; 
break;
case 69: this.popState(); return 4; 
break;
case 70: return 4; 
break;
}
},
rules: [/^(?:[^#]*?(?=\$))/,/^(?:[^\$]*?(?=#))/,/^(?:[^\x00]+)/,/^(?:#\*[\s\S]+?\*#)/,/^(?:#\[\[[\s\S]+?\]\]#)/,/^(?:##[^\n]*)/,/^(?:#@)/,/^(?:#(?=[a-zA-Z{]))/,/^(?:set[ ]*(?=[^a-zA-Z0-9_]+))/,/^(?:if[ ]*(?=[^a-zA-Z0-9_]+))/,/^(?:elseif[ ]*(?=[^a-zA-Z0-9_]+))/,/^(?:else\b)/,/^(?:\{else\})/,/^(?:end\b)/,/^(?:\{end\})/,/^(?:break\b)/,/^(?:foreach[ ]*(?=[^a-zA-Z0-9_]+))/,/^(?:noescape(?=[^a-zA-Z0-9_]+))/,/^(?:define[ ]*(?=[^a-zA-Z0-9_]+))/,/^(?:macro[ ]*(?=[^a-zA-Z0-9_]+))/,/^(?:in\b)/,/^(?:[%\+\-\*/])/,/^(?:<=)/,/^(?:le\b)/,/^(?:>=)/,/^(?:ge\b)/,/^(?:[><])/,/^(?:gt\b)/,/^(?:lt\b)/,/^(?:==)/,/^(?:eq\b)/,/^(?:\|\|)/,/^(?:or\b)/,/^(?:&&)/,/^(?:and\b)/,/^(?:!=)/,/^(?:ne\b)/,/^(?:not\b)/,/^(?:\$!(?=[{a-zA-Z_]))/,/^(?:\$(?=[{a-zA-Z_]))/,/^(?:!)/,/^(?:=)/,/^(?:[ ]+(?=[^,]))/,/^(?:\s+)/,/^(?:\{)/,/^(?:\})/,/^(?::[\s]*)/,/^(?:\{[\s]*)/,/^(?:[\s]*\})/,/^(?:\([\s]*(?=[$'"\[\{\-0-9\w()!]))/,/^(?:\))/,/^(?:\[[\s]*(?=[\-$"'0-9{\[\]]+))/,/^(?:\])/,/^(?:\.\.)/,/^(?:\.(?=[a-zA-Z_]))/,/^(?:\.(?=[\d]))/,/^(?:,[ ]*)/,/^(?:"(\\"|[^\"])*")/,/^(?:'(\\'|[^\'])*')/,/^(?:null\b)/,/^(?:false\b)/,/^(?:true\b)/,/^(?:[0-9]+)/,/^(?:[_a-zA-Z][a-zA-Z0-9_\-]*)/,/^(?:[_a-zA-Z][a-zA-Z0-9_\-]*[ ]*(?=\())/,/^(?:#)/,/^(?:.)/,/^(?:\s+)/,/^(?:[\$#])/,/^(?:$)/,/^(?:$)/],
conditions: {"mu":{"rules":[5,38,39,47,48,49,50,51,52,54,63,65,66,67,69],"inclusive":false},"c":{"rules":[20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,49,50,51,52,54,55,56,57,58,59,60,61,62,63],"inclusive":false},"i":{"rules":[20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,43,44,44,45,45,46,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63],"inclusive":false},"h":{"rules":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,38,39,40,41,46,49,50,51,52,54,62,64,66,67,69],"inclusive":false},"esc":{"rules":[68],"inclusive":false},"run":{"rules":[38,39,40,42,43,44,45,46,49,50,51,52,54,55,56,57,58,59,60,61,62,63,66,67,69],"inclusive":false},"INITIAL":{"rules":[0,1,2,70],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (true) {
exports.parser = velocity;
exports.Parser = velocity.Parser;
exports.parse = function () { return velocity.parse.apply(velocity, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = (__webpack_require__(/*! fs */ "?b4bb").readFileSync)((__webpack_require__(/*! path */ "?67e0").normalize)(args[1]), "utf8");
    return exports.parser.parse(source);
};
if ( true && __webpack_require__.c[__webpack_require__.s] === module) {
  exports.main(process.argv.slice(1));
}
}

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((module) => {

"use strict";

var utils = {};

['forEach', 'some', 'every', 'filter', 'map'].forEach(function(fnName) {
  utils[fnName] = function(arr, fn, context) {
    if (!arr || typeof arr === 'string') return arr;
    context = context || this;
    if (arr[fnName]) {
      return arr[fnName](fn, context);
    } else {
      var keys = Object.keys(arr);
      return keys[fnName](function(key) {
        return fn.call(context, arr[key], key, arr);
      }, context);
    }
  };
});

var number = 0;
utils.guid = function() {
  return number++;
};

utils.mixin = function(to, from) {
  utils.forEach(from, function(val, key) {
    if (utils.isArray(val) || utils.isObject(val)) {
      to[key] = utils.mixin(val, to[key] || {});
    } else {
      to[key] = val;
    }
  });
  return to;
};

utils.isArray = function(obj) {
  return {}.toString.call(obj) === '[object Array]';
};

utils.isObject = function(obj) {
  return {}.toString.call(obj) === '[object Object]';
};

utils.indexOf = function(elem, arr) {
  if (utils.isArray(arr)) {
    return arr.indexOf(elem);
  }
};

utils.keys = Object.keys;
utils.now  = Date.now;

module.exports = utils;


/***/ }),

/***/ "./src/velocity.js":
/*!*************************!*\
  !*** ./src/velocity.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var Compile = __webpack_require__(/*! ./compile/ */ "./src/compile/index.js");
var Helper = __webpack_require__(/*! ./helper/index */ "./src/helper/index.js");
var parse = __webpack_require__(/*! ./parse */ "./src/parse.js");

Compile.parse = parse;

var Velocity = {
  parse: parse,
  Compile: Compile,
  Helper: Helper
};

Velocity.render = function(template, context, macros, config) {

  var asts = parse(template);
  var compile = new Compile(asts, config);
  return compile.render(context, macros);
};

module.exports = Velocity;


/***/ }),

/***/ "?b4bb":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?67e0":
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__(__webpack_require__.s = "./index.js");
/******/ 	Velocity = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNqS2E7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBLFNBQVM7QUFD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QUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztB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Q0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVcsZ0NBQWdDO0FBQzNDO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsY0FBYyw4QkFBOEI7QUFDNUM7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isa0JBQWtCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQSxrQ0FBa0M7QUFDbEMsc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLHNEQUFzRDtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQSx5QkFBeUIsdURBQXVEO0FBQ2hGO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBLDBCQUEwQix5QkFBeUIsa0JBQWtCLFlBQVksT0FBTztBQUN4RjtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4RUFBOEU7QUFDOUU7QUFDQSw4RUFBOEU7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCwySkFBMkosK0hBQStILE1BQU0sdUJBQXVCLEtBQUssbVlBQW1ZLHdCQUF3QixvRUFBb0UsVUFBVSx3QkFBd0Isb0JBQW9CLDBCQUEwQixrREFBa0Q7QUFDNzVCLGFBQWEsTUFBTSx3RUFBd0UsTUFBTSx1SkFBdUosTUFBTSw2SkFBNkosTUFBTSxxSEFBcUgsUUFBUSwrQkFBK0IsUUFBUSx1R0FBdUcsWUFBWTtBQUN4ckIsQ0FBQztBQUNEO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxJQUFJLElBQWdFO0FBQ3BFLGNBQWM7QUFDZCxjQUFjO0FBQ2QsYUFBYSxpQkFBaUI7QUFDOUIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHFEQUEwQixDQUFDLG9EQUF5QjtBQUNyRTtBQUNBO0FBQ0EsSUFBSSxLQUE2QixJQUFJLDRDQUFZO0FBQ2pEO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUMvL0JhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUMsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbkRhO0FBQ2IsY0FBYyxtQkFBTyxDQUFDLDBDQUFZO0FBQ2xDLGFBQWEsbUJBQU8sQ0FBQyw2Q0FBZ0I7QUFDckMsWUFBWSxtQkFBTyxDQUFDLCtCQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDcEJBOzs7Ozs7Ozs7O0FDQUE7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOzs7OztXQzVCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztVRUpBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVmVsb2NpdHkvLi9pbmRleC5qcyIsIndlYnBhY2s6Ly9WZWxvY2l0eS8uL25vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9WZWxvY2l0eS8uL25vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvY29tbW9uLmpzIiwid2VicGFjazovL1ZlbG9jaXR5Ly4vbm9kZV9tb2R1bGVzL21zL2luZGV4LmpzIiwid2VicGFjazovL1ZlbG9jaXR5Ly4vc3JjL2NvbXBpbGUvYmxvY2tzLmpzIiwid2VicGFjazovL1ZlbG9jaXR5Ly4vc3JjL2NvbXBpbGUvY29tcGlsZS5qcyIsIndlYnBhY2s6Ly9WZWxvY2l0eS8uL3NyYy9jb21waWxlL2V4cHJlc3Npb24uanMiLCJ3ZWJwYWNrOi8vVmVsb2NpdHkvLi9zcmMvY29tcGlsZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9WZWxvY2l0eS8uL3NyYy9jb21waWxlL2xpdGVyYWwuanMiLCJ3ZWJwYWNrOi8vVmVsb2NpdHkvLi9zcmMvY29tcGlsZS9tZXRob2RzLmpzIiwid2VicGFjazovL1ZlbG9jaXR5Ly4vc3JjL2NvbXBpbGUvcmVmZXJlbmNlcy5qcyIsIndlYnBhY2s6Ly9WZWxvY2l0eS8uL3NyYy9jb21waWxlL3NldC5qcyIsIndlYnBhY2s6Ly9WZWxvY2l0eS8uL3NyYy9oZWxwZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vVmVsb2NpdHkvLi9zcmMvaGVscGVyL3RleHQuanMiLCJ3ZWJwYWNrOi8vVmVsb2NpdHkvLi9zcmMvcGFyc2UuanMiLCJ3ZWJwYWNrOi8vVmVsb2NpdHkvLi9zcmMvcGFyc2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vVmVsb2NpdHkvLi9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vVmVsb2NpdHkvLi9zcmMvdmVsb2NpdHkuanMiLCJ3ZWJwYWNrOi8vVmVsb2NpdHkvaWdub3JlZHwvVm9sdW1lcy9NQUNEQVRBL29wdGltaXplbHkvcHJvZHVjdC1yZWNzL3NhbXBsZXMvdmVsb2NpdHkuanMvc3JjL3BhcnNlfGZzIiwid2VicGFjazovL1ZlbG9jaXR5L2lnbm9yZWR8L1ZvbHVtZXMvTUFDREFUQS9vcHRpbWl6ZWx5L3Byb2R1Y3QtcmVjcy9zYW1wbGVzL3ZlbG9jaXR5LmpzL3NyYy9wYXJzZXxwYXRoIiwid2VicGFjazovL1ZlbG9jaXR5L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1ZlbG9jaXR5L3dlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vVmVsb2NpdHkvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9WZWxvY2l0eS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vVmVsb2NpdHkvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3NyYy92ZWxvY2l0eScpO1xyXG4iLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuLyoqXG4gKiBUaGlzIGlzIHRoZSB3ZWIgYnJvd3NlciBpbXBsZW1lbnRhdGlvbiBvZiBgZGVidWcoKWAuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXRBcmdzID0gZm9ybWF0QXJncztcbmV4cG9ydHMuc2F2ZSA9IHNhdmU7XG5leHBvcnRzLmxvYWQgPSBsb2FkO1xuZXhwb3J0cy51c2VDb2xvcnMgPSB1c2VDb2xvcnM7XG5leHBvcnRzLnN0b3JhZ2UgPSBsb2NhbHN0b3JhZ2UoKTtcbmV4cG9ydHMuZGVzdHJveSA9ICgoKSA9PiB7XG5cdGxldCB3YXJuZWQgPSBmYWxzZTtcblxuXHRyZXR1cm4gKCkgPT4ge1xuXHRcdGlmICghd2FybmVkKSB7XG5cdFx0XHR3YXJuZWQgPSB0cnVlO1xuXHRcdFx0Y29uc29sZS53YXJuKCdJbnN0YW5jZSBtZXRob2QgYGRlYnVnLmRlc3Ryb3koKWAgaXMgZGVwcmVjYXRlZCBhbmQgbm8gbG9uZ2VyIGRvZXMgYW55dGhpbmcuIEl0IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uIG9mIGBkZWJ1Z2AuJyk7XG5cdFx0fVxuXHR9O1xufSkoKTtcblxuLyoqXG4gKiBDb2xvcnMuXG4gKi9cblxuZXhwb3J0cy5jb2xvcnMgPSBbXG5cdCcjMDAwMENDJyxcblx0JyMwMDAwRkYnLFxuXHQnIzAwMzNDQycsXG5cdCcjMDAzM0ZGJyxcblx0JyMwMDY2Q0MnLFxuXHQnIzAwNjZGRicsXG5cdCcjMDA5OUNDJyxcblx0JyMwMDk5RkYnLFxuXHQnIzAwQ0MwMCcsXG5cdCcjMDBDQzMzJyxcblx0JyMwMENDNjYnLFxuXHQnIzAwQ0M5OScsXG5cdCcjMDBDQ0NDJyxcblx0JyMwMENDRkYnLFxuXHQnIzMzMDBDQycsXG5cdCcjMzMwMEZGJyxcblx0JyMzMzMzQ0MnLFxuXHQnIzMzMzNGRicsXG5cdCcjMzM2NkNDJyxcblx0JyMzMzY2RkYnLFxuXHQnIzMzOTlDQycsXG5cdCcjMzM5OUZGJyxcblx0JyMzM0NDMDAnLFxuXHQnIzMzQ0MzMycsXG5cdCcjMzNDQzY2Jyxcblx0JyMzM0NDOTknLFxuXHQnIzMzQ0NDQycsXG5cdCcjMzNDQ0ZGJyxcblx0JyM2NjAwQ0MnLFxuXHQnIzY2MDBGRicsXG5cdCcjNjYzM0NDJyxcblx0JyM2NjMzRkYnLFxuXHQnIzY2Q0MwMCcsXG5cdCcjNjZDQzMzJyxcblx0JyM5OTAwQ0MnLFxuXHQnIzk5MDBGRicsXG5cdCcjOTkzM0NDJyxcblx0JyM5OTMzRkYnLFxuXHQnIzk5Q0MwMCcsXG5cdCcjOTlDQzMzJyxcblx0JyNDQzAwMDAnLFxuXHQnI0NDMDAzMycsXG5cdCcjQ0MwMDY2Jyxcblx0JyNDQzAwOTknLFxuXHQnI0NDMDBDQycsXG5cdCcjQ0MwMEZGJyxcblx0JyNDQzMzMDAnLFxuXHQnI0NDMzMzMycsXG5cdCcjQ0MzMzY2Jyxcblx0JyNDQzMzOTknLFxuXHQnI0NDMzNDQycsXG5cdCcjQ0MzM0ZGJyxcblx0JyNDQzY2MDAnLFxuXHQnI0NDNjYzMycsXG5cdCcjQ0M5OTAwJyxcblx0JyNDQzk5MzMnLFxuXHQnI0NDQ0MwMCcsXG5cdCcjQ0NDQzMzJyxcblx0JyNGRjAwMDAnLFxuXHQnI0ZGMDAzMycsXG5cdCcjRkYwMDY2Jyxcblx0JyNGRjAwOTknLFxuXHQnI0ZGMDBDQycsXG5cdCcjRkYwMEZGJyxcblx0JyNGRjMzMDAnLFxuXHQnI0ZGMzMzMycsXG5cdCcjRkYzMzY2Jyxcblx0JyNGRjMzOTknLFxuXHQnI0ZGMzNDQycsXG5cdCcjRkYzM0ZGJyxcblx0JyNGRjY2MDAnLFxuXHQnI0ZGNjYzMycsXG5cdCcjRkY5OTAwJyxcblx0JyNGRjk5MzMnLFxuXHQnI0ZGQ0MwMCcsXG5cdCcjRkZDQzMzJ1xuXTtcblxuLyoqXG4gKiBDdXJyZW50bHkgb25seSBXZWJLaXQtYmFzZWQgV2ViIEluc3BlY3RvcnMsIEZpcmVmb3ggPj0gdjMxLFxuICogYW5kIHRoZSBGaXJlYnVnIGV4dGVuc2lvbiAoYW55IEZpcmVmb3ggdmVyc2lvbikgYXJlIGtub3duXG4gKiB0byBzdXBwb3J0IFwiJWNcIiBDU1MgY3VzdG9taXphdGlvbnMuXG4gKlxuICogVE9ETzogYWRkIGEgYGxvY2FsU3RvcmFnZWAgdmFyaWFibGUgdG8gZXhwbGljaXRseSBlbmFibGUvZGlzYWJsZSBjb2xvcnNcbiAqL1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tcGxleGl0eVxuZnVuY3Rpb24gdXNlQ29sb3JzKCkge1xuXHQvLyBOQjogSW4gYW4gRWxlY3Ryb24gcHJlbG9hZCBzY3JpcHQsIGRvY3VtZW50IHdpbGwgYmUgZGVmaW5lZCBidXQgbm90IGZ1bGx5XG5cdC8vIGluaXRpYWxpemVkLiBTaW5jZSB3ZSBrbm93IHdlJ3JlIGluIENocm9tZSwgd2UnbGwganVzdCBkZXRlY3QgdGhpcyBjYXNlXG5cdC8vIGV4cGxpY2l0bHlcblx0aWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5wcm9jZXNzICYmICh3aW5kb3cucHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInIHx8IHdpbmRvdy5wcm9jZXNzLl9fbndqcykpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIEludGVybmV0IEV4cGxvcmVyIGFuZCBFZGdlIGRvIG5vdCBzdXBwb3J0IGNvbG9ycy5cblx0aWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC8oZWRnZXx0cmlkZW50KVxcLyhcXGQrKS8pKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gSXMgd2Via2l0PyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNjQ1OTYwNi8zNzY3NzNcblx0Ly8gZG9jdW1lbnQgaXMgdW5kZWZpbmVkIGluIHJlYWN0LW5hdGl2ZTogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0LW5hdGl2ZS9wdWxsLzE2MzJcblx0cmV0dXJuICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLldlYmtpdEFwcGVhcmFuY2UpIHx8XG5cdFx0Ly8gSXMgZmlyZWJ1Zz8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzk4MTIwLzM3Njc3M1xuXHRcdCh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuY29uc29sZSAmJiAod2luZG93LmNvbnNvbGUuZmlyZWJ1ZyB8fCAod2luZG93LmNvbnNvbGUuZXhjZXB0aW9uICYmIHdpbmRvdy5jb25zb2xlLnRhYmxlKSkpIHx8XG5cdFx0Ly8gSXMgZmlyZWZveCA+PSB2MzE/XG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Ub29scy9XZWJfQ29uc29sZSNTdHlsaW5nX21lc3NhZ2VzXG5cdFx0KHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9maXJlZm94XFwvKFxcZCspLykgJiYgcGFyc2VJbnQoUmVnRXhwLiQxLCAxMCkgPj0gMzEpIHx8XG5cdFx0Ly8gRG91YmxlIGNoZWNrIHdlYmtpdCBpbiB1c2VyQWdlbnQganVzdCBpbiBjYXNlIHdlIGFyZSBpbiBhIHdvcmtlclxuXHRcdCh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvYXBwbGV3ZWJraXRcXC8oXFxkKykvKSk7XG59XG5cbi8qKlxuICogQ29sb3JpemUgbG9nIGFyZ3VtZW50cyBpZiBlbmFibGVkLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZm9ybWF0QXJncyhhcmdzKSB7XG5cdGFyZ3NbMF0gPSAodGhpcy51c2VDb2xvcnMgPyAnJWMnIDogJycpICtcblx0XHR0aGlzLm5hbWVzcGFjZSArXG5cdFx0KHRoaXMudXNlQ29sb3JzID8gJyAlYycgOiAnICcpICtcblx0XHRhcmdzWzBdICtcblx0XHQodGhpcy51c2VDb2xvcnMgPyAnJWMgJyA6ICcgJykgK1xuXHRcdCcrJyArIG1vZHVsZS5leHBvcnRzLmh1bWFuaXplKHRoaXMuZGlmZik7XG5cblx0aWYgKCF0aGlzLnVzZUNvbG9ycykge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGMgPSAnY29sb3I6ICcgKyB0aGlzLmNvbG9yO1xuXHRhcmdzLnNwbGljZSgxLCAwLCBjLCAnY29sb3I6IGluaGVyaXQnKTtcblxuXHQvLyBUaGUgZmluYWwgXCIlY1wiIGlzIHNvbWV3aGF0IHRyaWNreSwgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBvdGhlclxuXHQvLyBhcmd1bWVudHMgcGFzc2VkIGVpdGhlciBiZWZvcmUgb3IgYWZ0ZXIgdGhlICVjLCBzbyB3ZSBuZWVkIHRvXG5cdC8vIGZpZ3VyZSBvdXQgdGhlIGNvcnJlY3QgaW5kZXggdG8gaW5zZXJ0IHRoZSBDU1MgaW50b1xuXHRsZXQgaW5kZXggPSAwO1xuXHRsZXQgbGFzdEMgPSAwO1xuXHRhcmdzWzBdLnJlcGxhY2UoLyVbYS16QS1aJV0vZywgbWF0Y2ggPT4ge1xuXHRcdGlmIChtYXRjaCA9PT0gJyUlJykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpbmRleCsrO1xuXHRcdGlmIChtYXRjaCA9PT0gJyVjJykge1xuXHRcdFx0Ly8gV2Ugb25seSBhcmUgaW50ZXJlc3RlZCBpbiB0aGUgKmxhc3QqICVjXG5cdFx0XHQvLyAodGhlIHVzZXIgbWF5IGhhdmUgcHJvdmlkZWQgdGhlaXIgb3duKVxuXHRcdFx0bGFzdEMgPSBpbmRleDtcblx0XHR9XG5cdH0pO1xuXG5cdGFyZ3Muc3BsaWNlKGxhc3RDLCAwLCBjKTtcbn1cblxuLyoqXG4gKiBJbnZva2VzIGBjb25zb2xlLmRlYnVnKClgIHdoZW4gYXZhaWxhYmxlLlxuICogTm8tb3Agd2hlbiBgY29uc29sZS5kZWJ1Z2AgaXMgbm90IGEgXCJmdW5jdGlvblwiLlxuICogSWYgYGNvbnNvbGUuZGVidWdgIGlzIG5vdCBhdmFpbGFibGUsIGZhbGxzIGJhY2tcbiAqIHRvIGBjb25zb2xlLmxvZ2AuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0cy5sb2cgPSBjb25zb2xlLmRlYnVnIHx8IGNvbnNvbGUubG9nIHx8ICgoKSA9PiB7fSk7XG5cbi8qKlxuICogU2F2ZSBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBzYXZlKG5hbWVzcGFjZXMpIHtcblx0dHJ5IHtcblx0XHRpZiAobmFtZXNwYWNlcykge1xuXHRcdFx0ZXhwb3J0cy5zdG9yYWdlLnNldEl0ZW0oJ2RlYnVnJywgbmFtZXNwYWNlcyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGV4cG9ydHMuc3RvcmFnZS5yZW1vdmVJdGVtKCdkZWJ1ZycpO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHQvLyBTd2FsbG93XG5cdFx0Ly8gWFhYIChAUWl4LSkgc2hvdWxkIHdlIGJlIGxvZ2dpbmcgdGhlc2U/XG5cdH1cbn1cblxuLyoqXG4gKiBMb2FkIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJldHVybnMgdGhlIHByZXZpb3VzbHkgcGVyc2lzdGVkIGRlYnVnIG1vZGVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gbG9hZCgpIHtcblx0bGV0IHI7XG5cdHRyeSB7XG5cdFx0ciA9IGV4cG9ydHMuc3RvcmFnZS5nZXRJdGVtKCdkZWJ1ZycpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdC8vIFN3YWxsb3dcblx0XHQvLyBYWFggKEBRaXgtKSBzaG91bGQgd2UgYmUgbG9nZ2luZyB0aGVzZT9cblx0fVxuXG5cdC8vIElmIGRlYnVnIGlzbid0IHNldCBpbiBMUywgYW5kIHdlJ3JlIGluIEVsZWN0cm9uLCB0cnkgdG8gbG9hZCAkREVCVUdcblx0aWYgKCFyICYmIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiAnZW52JyBpbiBwcm9jZXNzKSB7XG5cdFx0ciA9IHByb2Nlc3MuZW52LkRFQlVHO1xuXHR9XG5cblx0cmV0dXJuIHI7XG59XG5cbi8qKlxuICogTG9jYWxzdG9yYWdlIGF0dGVtcHRzIHRvIHJldHVybiB0aGUgbG9jYWxzdG9yYWdlLlxuICpcbiAqIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugc2FmYXJpIHRocm93c1xuICogd2hlbiBhIHVzZXIgZGlzYWJsZXMgY29va2llcy9sb2NhbHN0b3JhZ2VcbiAqIGFuZCB5b3UgYXR0ZW1wdCB0byBhY2Nlc3MgaXQuXG4gKlxuICogQHJldHVybiB7TG9jYWxTdG9yYWdlfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9jYWxzdG9yYWdlKCkge1xuXHR0cnkge1xuXHRcdC8vIFRWTUxLaXQgKEFwcGxlIFRWIEpTIFJ1bnRpbWUpIGRvZXMgbm90IGhhdmUgYSB3aW5kb3cgb2JqZWN0LCBqdXN0IGxvY2FsU3RvcmFnZSBpbiB0aGUgZ2xvYmFsIGNvbnRleHRcblx0XHQvLyBUaGUgQnJvd3NlciBhbHNvIGhhcyBsb2NhbFN0b3JhZ2UgaW4gdGhlIGdsb2JhbCBjb250ZXh0LlxuXHRcdHJldHVybiBsb2NhbFN0b3JhZ2U7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Ly8gU3dhbGxvd1xuXHRcdC8vIFhYWCAoQFFpeC0pIHNob3VsZCB3ZSBiZSBsb2dnaW5nIHRoZXNlP1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9jb21tb24nKShleHBvcnRzKTtcblxuY29uc3Qge2Zvcm1hdHRlcnN9ID0gbW9kdWxlLmV4cG9ydHM7XG5cbi8qKlxuICogTWFwICVqIHRvIGBKU09OLnN0cmluZ2lmeSgpYCwgc2luY2Ugbm8gV2ViIEluc3BlY3RvcnMgZG8gdGhhdCBieSBkZWZhdWx0LlxuICovXG5cbmZvcm1hdHRlcnMuaiA9IGZ1bmN0aW9uICh2KSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHYpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiAnW1VuZXhwZWN0ZWRKU09OUGFyc2VFcnJvcl06ICcgKyBlcnJvci5tZXNzYWdlO1xuXHR9XG59O1xuIiwiXG4vKipcbiAqIFRoaXMgaXMgdGhlIGNvbW1vbiBsb2dpYyBmb3IgYm90aCB0aGUgTm9kZS5qcyBhbmQgd2ViIGJyb3dzZXJcbiAqIGltcGxlbWVudGF0aW9ucyBvZiBgZGVidWcoKWAuXG4gKi9cblxuZnVuY3Rpb24gc2V0dXAoZW52KSB7XG5cdGNyZWF0ZURlYnVnLmRlYnVnID0gY3JlYXRlRGVidWc7XG5cdGNyZWF0ZURlYnVnLmRlZmF1bHQgPSBjcmVhdGVEZWJ1Zztcblx0Y3JlYXRlRGVidWcuY29lcmNlID0gY29lcmNlO1xuXHRjcmVhdGVEZWJ1Zy5kaXNhYmxlID0gZGlzYWJsZTtcblx0Y3JlYXRlRGVidWcuZW5hYmxlID0gZW5hYmxlO1xuXHRjcmVhdGVEZWJ1Zy5lbmFibGVkID0gZW5hYmxlZDtcblx0Y3JlYXRlRGVidWcuaHVtYW5pemUgPSByZXF1aXJlKCdtcycpO1xuXHRjcmVhdGVEZWJ1Zy5kZXN0cm95ID0gZGVzdHJveTtcblxuXHRPYmplY3Qua2V5cyhlbnYpLmZvckVhY2goa2V5ID0+IHtcblx0XHRjcmVhdGVEZWJ1Z1trZXldID0gZW52W2tleV07XG5cdH0pO1xuXG5cdC8qKlxuXHQqIFRoZSBjdXJyZW50bHkgYWN0aXZlIGRlYnVnIG1vZGUgbmFtZXMsIGFuZCBuYW1lcyB0byBza2lwLlxuXHQqL1xuXG5cdGNyZWF0ZURlYnVnLm5hbWVzID0gW107XG5cdGNyZWF0ZURlYnVnLnNraXBzID0gW107XG5cblx0LyoqXG5cdCogTWFwIG9mIHNwZWNpYWwgXCIlblwiIGhhbmRsaW5nIGZ1bmN0aW9ucywgZm9yIHRoZSBkZWJ1ZyBcImZvcm1hdFwiIGFyZ3VtZW50LlxuXHQqXG5cdCogVmFsaWQga2V5IG5hbWVzIGFyZSBhIHNpbmdsZSwgbG93ZXIgb3IgdXBwZXItY2FzZSBsZXR0ZXIsIGkuZS4gXCJuXCIgYW5kIFwiTlwiLlxuXHQqL1xuXHRjcmVhdGVEZWJ1Zy5mb3JtYXR0ZXJzID0ge307XG5cblx0LyoqXG5cdCogU2VsZWN0cyBhIGNvbG9yIGZvciBhIGRlYnVnIG5hbWVzcGFjZVxuXHQqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2UgVGhlIG5hbWVzcGFjZSBzdHJpbmcgZm9yIHRoZSBkZWJ1ZyBpbnN0YW5jZSB0byBiZSBjb2xvcmVkXG5cdCogQHJldHVybiB7TnVtYmVyfFN0cmluZ30gQW4gQU5TSSBjb2xvciBjb2RlIGZvciB0aGUgZ2l2ZW4gbmFtZXNwYWNlXG5cdCogQGFwaSBwcml2YXRlXG5cdCovXG5cdGZ1bmN0aW9uIHNlbGVjdENvbG9yKG5hbWVzcGFjZSkge1xuXHRcdGxldCBoYXNoID0gMDtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZXNwYWNlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBuYW1lc3BhY2UuY2hhckNvZGVBdChpKTtcblx0XHRcdGhhc2ggfD0gMDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNyZWF0ZURlYnVnLmNvbG9yc1tNYXRoLmFicyhoYXNoKSAlIGNyZWF0ZURlYnVnLmNvbG9ycy5sZW5ndGhdO1xuXHR9XG5cdGNyZWF0ZURlYnVnLnNlbGVjdENvbG9yID0gc2VsZWN0Q29sb3I7XG5cblx0LyoqXG5cdCogQ3JlYXRlIGEgZGVidWdnZXIgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVzcGFjZWAuXG5cdCpcblx0KiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlXG5cdCogQHJldHVybiB7RnVuY3Rpb259XG5cdCogQGFwaSBwdWJsaWNcblx0Ki9cblx0ZnVuY3Rpb24gY3JlYXRlRGVidWcobmFtZXNwYWNlKSB7XG5cdFx0bGV0IHByZXZUaW1lO1xuXHRcdGxldCBlbmFibGVPdmVycmlkZSA9IG51bGw7XG5cdFx0bGV0IG5hbWVzcGFjZXNDYWNoZTtcblx0XHRsZXQgZW5hYmxlZENhY2hlO1xuXG5cdFx0ZnVuY3Rpb24gZGVidWcoLi4uYXJncykge1xuXHRcdFx0Ly8gRGlzYWJsZWQ/XG5cdFx0XHRpZiAoIWRlYnVnLmVuYWJsZWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzZWxmID0gZGVidWc7XG5cblx0XHRcdC8vIFNldCBgZGlmZmAgdGltZXN0YW1wXG5cdFx0XHRjb25zdCBjdXJyID0gTnVtYmVyKG5ldyBEYXRlKCkpO1xuXHRcdFx0Y29uc3QgbXMgPSBjdXJyIC0gKHByZXZUaW1lIHx8IGN1cnIpO1xuXHRcdFx0c2VsZi5kaWZmID0gbXM7XG5cdFx0XHRzZWxmLnByZXYgPSBwcmV2VGltZTtcblx0XHRcdHNlbGYuY3VyciA9IGN1cnI7XG5cdFx0XHRwcmV2VGltZSA9IGN1cnI7XG5cblx0XHRcdGFyZ3NbMF0gPSBjcmVhdGVEZWJ1Zy5jb2VyY2UoYXJnc1swXSk7XG5cblx0XHRcdGlmICh0eXBlb2YgYXJnc1swXSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdFx0Ly8gQW55dGhpbmcgZWxzZSBsZXQncyBpbnNwZWN0IHdpdGggJU9cblx0XHRcdFx0YXJncy51bnNoaWZ0KCclTycpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBcHBseSBhbnkgYGZvcm1hdHRlcnNgIHRyYW5zZm9ybWF0aW9uc1xuXHRcdFx0bGV0IGluZGV4ID0gMDtcblx0XHRcdGFyZ3NbMF0gPSBhcmdzWzBdLnJlcGxhY2UoLyUoW2EtekEtWiVdKS9nLCAobWF0Y2gsIGZvcm1hdCkgPT4ge1xuXHRcdFx0XHQvLyBJZiB3ZSBlbmNvdW50ZXIgYW4gZXNjYXBlZCAlIHRoZW4gZG9uJ3QgaW5jcmVhc2UgdGhlIGFycmF5IGluZGV4XG5cdFx0XHRcdGlmIChtYXRjaCA9PT0gJyUlJykge1xuXHRcdFx0XHRcdHJldHVybiAnJSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aW5kZXgrKztcblx0XHRcdFx0Y29uc3QgZm9ybWF0dGVyID0gY3JlYXRlRGVidWcuZm9ybWF0dGVyc1tmb3JtYXRdO1xuXHRcdFx0XHRpZiAodHlwZW9mIGZvcm1hdHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGNvbnN0IHZhbCA9IGFyZ3NbaW5kZXhdO1xuXHRcdFx0XHRcdG1hdGNoID0gZm9ybWF0dGVyLmNhbGwoc2VsZiwgdmFsKTtcblxuXHRcdFx0XHRcdC8vIE5vdyB3ZSBuZWVkIHRvIHJlbW92ZSBgYXJnc1tpbmRleF1gIHNpbmNlIGl0J3MgaW5saW5lZCBpbiB0aGUgYGZvcm1hdGBcblx0XHRcdFx0XHRhcmdzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdFx0aW5kZXgtLTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gQXBwbHkgZW52LXNwZWNpZmljIGZvcm1hdHRpbmcgKGNvbG9ycywgZXRjLilcblx0XHRcdGNyZWF0ZURlYnVnLmZvcm1hdEFyZ3MuY2FsbChzZWxmLCBhcmdzKTtcblxuXHRcdFx0Y29uc3QgbG9nRm4gPSBzZWxmLmxvZyB8fCBjcmVhdGVEZWJ1Zy5sb2c7XG5cdFx0XHRsb2dGbi5hcHBseShzZWxmLCBhcmdzKTtcblx0XHR9XG5cblx0XHRkZWJ1Zy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG5cdFx0ZGVidWcudXNlQ29sb3JzID0gY3JlYXRlRGVidWcudXNlQ29sb3JzKCk7XG5cdFx0ZGVidWcuY29sb3IgPSBjcmVhdGVEZWJ1Zy5zZWxlY3RDb2xvcihuYW1lc3BhY2UpO1xuXHRcdGRlYnVnLmV4dGVuZCA9IGV4dGVuZDtcblx0XHRkZWJ1Zy5kZXN0cm95ID0gY3JlYXRlRGVidWcuZGVzdHJveTsgLy8gWFhYIFRlbXBvcmFyeS4gV2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UuXG5cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVidWcsICdlbmFibGVkJywge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdFx0XHRnZXQ6ICgpID0+IHtcblx0XHRcdFx0aWYgKGVuYWJsZU92ZXJyaWRlICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVuYWJsZU92ZXJyaWRlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChuYW1lc3BhY2VzQ2FjaGUgIT09IGNyZWF0ZURlYnVnLm5hbWVzcGFjZXMpIHtcblx0XHRcdFx0XHRuYW1lc3BhY2VzQ2FjaGUgPSBjcmVhdGVEZWJ1Zy5uYW1lc3BhY2VzO1xuXHRcdFx0XHRcdGVuYWJsZWRDYWNoZSA9IGNyZWF0ZURlYnVnLmVuYWJsZWQobmFtZXNwYWNlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBlbmFibGVkQ2FjaGU7XG5cdFx0XHR9LFxuXHRcdFx0c2V0OiB2ID0+IHtcblx0XHRcdFx0ZW5hYmxlT3ZlcnJpZGUgPSB2O1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gRW52LXNwZWNpZmljIGluaXRpYWxpemF0aW9uIGxvZ2ljIGZvciBkZWJ1ZyBpbnN0YW5jZXNcblx0XHRpZiAodHlwZW9mIGNyZWF0ZURlYnVnLmluaXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGNyZWF0ZURlYnVnLmluaXQoZGVidWcpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkZWJ1Zztcblx0fVxuXG5cdGZ1bmN0aW9uIGV4dGVuZChuYW1lc3BhY2UsIGRlbGltaXRlcikge1xuXHRcdGNvbnN0IG5ld0RlYnVnID0gY3JlYXRlRGVidWcodGhpcy5uYW1lc3BhY2UgKyAodHlwZW9mIGRlbGltaXRlciA9PT0gJ3VuZGVmaW5lZCcgPyAnOicgOiBkZWxpbWl0ZXIpICsgbmFtZXNwYWNlKTtcblx0XHRuZXdEZWJ1Zy5sb2cgPSB0aGlzLmxvZztcblx0XHRyZXR1cm4gbmV3RGVidWc7XG5cdH1cblxuXHQvKipcblx0KiBFbmFibGVzIGEgZGVidWcgbW9kZSBieSBuYW1lc3BhY2VzLiBUaGlzIGNhbiBpbmNsdWRlIG1vZGVzXG5cdCogc2VwYXJhdGVkIGJ5IGEgY29sb24gYW5kIHdpbGRjYXJkcy5cblx0KlxuXHQqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG5cdCogQGFwaSBwdWJsaWNcblx0Ki9cblx0ZnVuY3Rpb24gZW5hYmxlKG5hbWVzcGFjZXMpIHtcblx0XHRjcmVhdGVEZWJ1Zy5zYXZlKG5hbWVzcGFjZXMpO1xuXHRcdGNyZWF0ZURlYnVnLm5hbWVzcGFjZXMgPSBuYW1lc3BhY2VzO1xuXG5cdFx0Y3JlYXRlRGVidWcubmFtZXMgPSBbXTtcblx0XHRjcmVhdGVEZWJ1Zy5za2lwcyA9IFtdO1xuXG5cdFx0bGV0IGk7XG5cdFx0Y29uc3Qgc3BsaXQgPSAodHlwZW9mIG5hbWVzcGFjZXMgPT09ICdzdHJpbmcnID8gbmFtZXNwYWNlcyA6ICcnKS5zcGxpdCgvW1xccyxdKy8pO1xuXHRcdGNvbnN0IGxlbiA9IHNwbGl0Lmxlbmd0aDtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0aWYgKCFzcGxpdFtpXSkge1xuXHRcdFx0XHQvLyBpZ25vcmUgZW1wdHkgc3RyaW5nc1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0bmFtZXNwYWNlcyA9IHNwbGl0W2ldLnJlcGxhY2UoL1xcKi9nLCAnLio/Jyk7XG5cblx0XHRcdGlmIChuYW1lc3BhY2VzWzBdID09PSAnLScpIHtcblx0XHRcdFx0Y3JlYXRlRGVidWcuc2tpcHMucHVzaChuZXcgUmVnRXhwKCdeJyArIG5hbWVzcGFjZXMuc2xpY2UoMSkgKyAnJCcpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNyZWF0ZURlYnVnLm5hbWVzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzICsgJyQnKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCogRGlzYWJsZSBkZWJ1ZyBvdXRwdXQuXG5cdCpcblx0KiBAcmV0dXJuIHtTdHJpbmd9IG5hbWVzcGFjZXNcblx0KiBAYXBpIHB1YmxpY1xuXHQqL1xuXHRmdW5jdGlvbiBkaXNhYmxlKCkge1xuXHRcdGNvbnN0IG5hbWVzcGFjZXMgPSBbXG5cdFx0XHQuLi5jcmVhdGVEZWJ1Zy5uYW1lcy5tYXAodG9OYW1lc3BhY2UpLFxuXHRcdFx0Li4uY3JlYXRlRGVidWcuc2tpcHMubWFwKHRvTmFtZXNwYWNlKS5tYXAobmFtZXNwYWNlID0+ICctJyArIG5hbWVzcGFjZSlcblx0XHRdLmpvaW4oJywnKTtcblx0XHRjcmVhdGVEZWJ1Zy5lbmFibGUoJycpO1xuXHRcdHJldHVybiBuYW1lc3BhY2VzO1xuXHR9XG5cblx0LyoqXG5cdCogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBtb2RlIG5hbWUgaXMgZW5hYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuXHQqXG5cdCogQHBhcmFtIHtTdHJpbmd9IG5hbWVcblx0KiBAcmV0dXJuIHtCb29sZWFufVxuXHQqIEBhcGkgcHVibGljXG5cdCovXG5cdGZ1bmN0aW9uIGVuYWJsZWQobmFtZSkge1xuXHRcdGlmIChuYW1lW25hbWUubGVuZ3RoIC0gMV0gPT09ICcqJykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0bGV0IGk7XG5cdFx0bGV0IGxlbjtcblxuXHRcdGZvciAoaSA9IDAsIGxlbiA9IGNyZWF0ZURlYnVnLnNraXBzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoY3JlYXRlRGVidWcuc2tpcHNbaV0udGVzdChuYW1lKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgbGVuID0gY3JlYXRlRGVidWcubmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGlmIChjcmVhdGVEZWJ1Zy5uYW1lc1tpXS50ZXN0KG5hbWUpKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQqIENvbnZlcnQgcmVnZXhwIHRvIG5hbWVzcGFjZVxuXHQqXG5cdCogQHBhcmFtIHtSZWdFeHB9IHJlZ3hlcFxuXHQqIEByZXR1cm4ge1N0cmluZ30gbmFtZXNwYWNlXG5cdCogQGFwaSBwcml2YXRlXG5cdCovXG5cdGZ1bmN0aW9uIHRvTmFtZXNwYWNlKHJlZ2V4cCkge1xuXHRcdHJldHVybiByZWdleHAudG9TdHJpbmcoKVxuXHRcdFx0LnN1YnN0cmluZygyLCByZWdleHAudG9TdHJpbmcoKS5sZW5ndGggLSAyKVxuXHRcdFx0LnJlcGxhY2UoL1xcLlxcKlxcPyQvLCAnKicpO1xuXHR9XG5cblx0LyoqXG5cdCogQ29lcmNlIGB2YWxgLlxuXHQqXG5cdCogQHBhcmFtIHtNaXhlZH0gdmFsXG5cdCogQHJldHVybiB7TWl4ZWR9XG5cdCogQGFwaSBwcml2YXRlXG5cdCovXG5cdGZ1bmN0aW9uIGNvZXJjZSh2YWwpIHtcblx0XHRpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHtcblx0XHRcdHJldHVybiB2YWwuc3RhY2sgfHwgdmFsLm1lc3NhZ2U7XG5cdFx0fVxuXHRcdHJldHVybiB2YWw7XG5cdH1cblxuXHQvKipcblx0KiBYWFggRE8gTk9UIFVTRS4gVGhpcyBpcyBhIHRlbXBvcmFyeSBzdHViIGZ1bmN0aW9uLlxuXHQqIFhYWCBJdCBXSUxMIGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgbWFqb3IgcmVsZWFzZS5cblx0Ki9cblx0ZnVuY3Rpb24gZGVzdHJveSgpIHtcblx0XHRjb25zb2xlLndhcm4oJ0luc3RhbmNlIG1ldGhvZCBgZGVidWcuZGVzdHJveSgpYCBpcyBkZXByZWNhdGVkIGFuZCBubyBsb25nZXIgZG9lcyBhbnl0aGluZy4gSXQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHZlcnNpb24gb2YgYGRlYnVnYC4nKTtcblx0fVxuXG5cdGNyZWF0ZURlYnVnLmVuYWJsZShjcmVhdGVEZWJ1Zy5sb2FkKCkpO1xuXG5cdHJldHVybiBjcmVhdGVEZWJ1Zztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR1cDtcbiIsIi8qKlxuICogSGVscGVycy5cbiAqL1xuXG52YXIgcyA9IDEwMDA7XG52YXIgbSA9IHMgKiA2MDtcbnZhciBoID0gbSAqIDYwO1xudmFyIGQgPSBoICogMjQ7XG52YXIgdyA9IGQgKiA3O1xudmFyIHkgPSBkICogMzY1LjI1O1xuXG4vKipcbiAqIFBhcnNlIG9yIGZvcm1hdCB0aGUgZ2l2ZW4gYHZhbGAuXG4gKlxuICogT3B0aW9uczpcbiAqXG4gKiAgLSBgbG9uZ2AgdmVyYm9zZSBmb3JtYXR0aW5nIFtmYWxzZV1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHZhbFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHRocm93cyB7RXJyb3J9IHRocm93IGFuIGVycm9yIGlmIHZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgbnVtYmVyXG4gKiBAcmV0dXJuIHtTdHJpbmd8TnVtYmVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsO1xuICBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gcGFyc2UodmFsKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWwpKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMubG9uZyA/IGZtdExvbmcodmFsKSA6IGZtdFNob3J0KHZhbCk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICd2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIHZhbGlkIG51bWJlci4gdmFsPScgK1xuICAgICAgSlNPTi5zdHJpbmdpZnkodmFsKVxuICApO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYHN0cmAgYW5kIHJldHVybiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2Uoc3RyKSB7XG4gIHN0ciA9IFN0cmluZyhzdHIpO1xuICBpZiAoc3RyLmxlbmd0aCA+IDEwMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbWF0Y2ggPSAvXigtPyg/OlxcZCspP1xcLj9cXGQrKSAqKG1pbGxpc2Vjb25kcz98bXNlY3M/fG1zfHNlY29uZHM/fHNlY3M/fHN8bWludXRlcz98bWlucz98bXxob3Vycz98aHJzP3xofGRheXM/fGR8d2Vla3M/fHd8eWVhcnM/fHlycz98eSk/JC9pLmV4ZWMoXG4gICAgc3RyXG4gICk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG4gPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcbiAgdmFyIHR5cGUgPSAobWF0Y2hbMl0gfHwgJ21zJykudG9Mb3dlckNhc2UoKTtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAneWVhcnMnOlxuICAgIGNhc2UgJ3llYXInOlxuICAgIGNhc2UgJ3lycyc6XG4gICAgY2FzZSAneXInOlxuICAgIGNhc2UgJ3knOlxuICAgICAgcmV0dXJuIG4gKiB5O1xuICAgIGNhc2UgJ3dlZWtzJzpcbiAgICBjYXNlICd3ZWVrJzpcbiAgICBjYXNlICd3JzpcbiAgICAgIHJldHVybiBuICogdztcbiAgICBjYXNlICdkYXlzJzpcbiAgICBjYXNlICdkYXknOlxuICAgIGNhc2UgJ2QnOlxuICAgICAgcmV0dXJuIG4gKiBkO1xuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdob3VyJzpcbiAgICBjYXNlICdocnMnOlxuICAgIGNhc2UgJ2hyJzpcbiAgICBjYXNlICdoJzpcbiAgICAgIHJldHVybiBuICogaDtcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdtaW51dGUnOlxuICAgIGNhc2UgJ21pbnMnOlxuICAgIGNhc2UgJ21pbic6XG4gICAgY2FzZSAnbSc6XG4gICAgICByZXR1cm4gbiAqIG07XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnc2Vjb25kJzpcbiAgICBjYXNlICdzZWNzJzpcbiAgICBjYXNlICdzZWMnOlxuICAgIGNhc2UgJ3MnOlxuICAgICAgcmV0dXJuIG4gKiBzO1xuICAgIGNhc2UgJ21pbGxpc2Vjb25kcyc6XG4gICAgY2FzZSAnbWlsbGlzZWNvbmQnOlxuICAgIGNhc2UgJ21zZWNzJzpcbiAgICBjYXNlICdtc2VjJzpcbiAgICBjYXNlICdtcyc6XG4gICAgICByZXR1cm4gbjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIFNob3J0IGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGZtdFNob3J0KG1zKSB7XG4gIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcbiAgaWYgKG1zQWJzID49IGQpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGQpICsgJ2QnO1xuICB9XG4gIGlmIChtc0FicyA+PSBoKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBoKSArICdoJztcbiAgfVxuICBpZiAobXNBYnMgPj0gbSkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbSkgKyAnbSc7XG4gIH1cbiAgaWYgKG1zQWJzID49IHMpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIHMpICsgJ3MnO1xuICB9XG4gIHJldHVybiBtcyArICdtcyc7XG59XG5cbi8qKlxuICogTG9uZyBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRMb25nKG1zKSB7XG4gIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcbiAgaWYgKG1zQWJzID49IGQpIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgZCwgJ2RheScpO1xuICB9XG4gIGlmIChtc0FicyA+PSBoKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIGgsICdob3VyJyk7XG4gIH1cbiAgaWYgKG1zQWJzID49IG0pIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgbSwgJ21pbnV0ZScpO1xuICB9XG4gIGlmIChtc0FicyA+PSBzKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIHMsICdzZWNvbmQnKTtcbiAgfVxuICByZXR1cm4gbXMgKyAnIG1zJztcbn1cblxuLyoqXG4gKiBQbHVyYWxpemF0aW9uIGhlbHBlci5cbiAqL1xuXG5mdW5jdGlvbiBwbHVyYWwobXMsIG1zQWJzLCBuLCBuYW1lKSB7XG4gIHZhciBpc1BsdXJhbCA9IG1zQWJzID49IG4gKiAxLjU7XG4gIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbikgKyAnICcgKyBuYW1lICsgKGlzUGx1cmFsID8gJ3MnIDogJycpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFZlbG9jaXR5LCB1dGlscykge1xyXG5cclxuICAvKipcclxuICAgKiBibG9ja3Mgc3VjaCBhcyBpZiwgZm9yZWFjaCwgbWFjcm8gc3ludGF4IGhhbmRsZXJcclxuICAgKi9cclxuICB1dGlscy5taXhpbihWZWxvY2l0eS5wcm90b3R5cGUsIHtcclxuXHJcbiAgICBnZXRCbG9jazogZnVuY3Rpb24oYmxvY2spIHtcclxuXHJcbiAgICAgIHZhciBhc3QgPSBibG9ja1swXTtcclxuICAgICAgdmFyIHJldCA9ICcnO1xyXG5cclxuICAgICAgc3dpdGNoIChhc3QudHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ2lmJzpcclxuICAgICAgICAgIHJldCA9IHRoaXMuZ2V0QmxvY2tJZihibG9jayk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdmb3JlYWNoJzpcclxuICAgICAgICAgIHJldCA9IHRoaXMuZ2V0QmxvY2tFYWNoKGJsb2NrKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ21hY3JvJzpcclxuICAgICAgICAgIHRoaXMuc2V0QmxvY2tNYWNybyhibG9jayk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdub2VzY2FwZSc6XHJcbiAgICAgICAgICByZXQgPSB0aGlzLl9yZW5kZXIoYmxvY2suc2xpY2UoMSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnZGVmaW5lJzpcclxuICAgICAgICAgIHRoaXMuc2V0QmxvY2tEZWZpbmUoYmxvY2spO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnbWFjcm9fYm9keSc6XHJcbiAgICAgICAgICByZXQgPSB0aGlzLmdldE1hY3JvQm9keShibG9jayk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgcmV0ID0gdGhpcy5fcmVuZGVyKGJsb2NrKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJldCB8fCAnJztcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkZWZpbmVcclxuICAgICAqL1xyXG4gICAgc2V0QmxvY2tEZWZpbmU6IGZ1bmN0aW9uKGJsb2NrKSB7XHJcbiAgICAgIHZhciBhc3QgPSBibG9ja1swXTtcclxuICAgICAgdmFyIF9ibG9jayA9IGJsb2NrLnNsaWNlKDEpO1xyXG4gICAgICB2YXIgZGVmaW5lcyA9IHRoaXMuZGVmaW5lcztcclxuXHJcbiAgICAgIGRlZmluZXNbYXN0LmlkXSA9IF9ibG9jaztcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkZWZpbmUgbWFjcm9cclxuICAgICAqL1xyXG4gICAgc2V0QmxvY2tNYWNybzogZnVuY3Rpb24oYmxvY2spIHtcclxuICAgICAgdmFyIGFzdCA9IGJsb2NrWzBdO1xyXG4gICAgICB2YXIgX2Jsb2NrID0gYmxvY2suc2xpY2UoMSk7XHJcbiAgICAgIHZhciBtYWNyb3MgPSB0aGlzLm1hY3JvcztcclxuXHJcbiAgICAgIG1hY3Jvc1thc3QuaWRdID0ge1xyXG4gICAgICAgIGFzdHM6IF9ibG9jayxcclxuICAgICAgICBhcmdzOiBhc3QuYXJnc1xyXG4gICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRNYWNyb0JvZHk6IGZ1bmN0aW9uKGFzdHMpIHtcclxuICAgICAgY29uc3QgYXN0ID0gYXN0c1swXTtcclxuICAgICAgdmFyIF9ibG9jayA9IGFzdHMuc2xpY2UoMSk7XHJcbiAgICAgIHZhciBib2R5Q29udGVudCA9IHRoaXMuZXZhbChfYmxvY2ssIHt9KTtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0TWFjcm8oYXN0LCBib2R5Q29udGVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcGFyc2UgbWFjcm8gY2FsbFxyXG4gICAgICovXHJcbiAgICBnZXRNYWNybzogZnVuY3Rpb24oYXN0LCBib2R5Q29udGVudCkge1xyXG4gICAgICB2YXIgbWFjcm8gPSB0aGlzLm1hY3Jvc1thc3QuaWRdO1xyXG4gICAgICB2YXIgcmV0ID0gJyc7XHJcblxyXG4gICAgICBpZiAoIW1hY3JvKSB7XHJcblxyXG4gICAgICAgIHZhciBqc21hY3JvcyA9IHRoaXMuanNtYWNyb3M7XHJcbiAgICAgICAgbWFjcm8gPSBqc21hY3Jvc1thc3QuaWRdO1xyXG4gICAgICAgIHZhciBqc0FyZ3MgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKG1hY3JvICYmIG1hY3JvLmFwcGx5KSB7XHJcblxyXG4gICAgICAgICAgdXRpbHMuZm9yRWFjaChhc3QuYXJncywgZnVuY3Rpb24oYSkge1xyXG4gICAgICAgICAgICBqc0FyZ3MucHVzaCh0aGlzLmdldExpdGVyYWwoYSkpO1xyXG4gICAgICAgICAgfSwgdGhpcyk7XHJcblxyXG4gICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgIC8vIGJ1Z+S/ruWkje+8muatpOWkhOeUseS6jumXreWMheeJueaAp++8jOWvvOiHtGV2YWzlh73mlbDmiafooYzml7bnmoR0aGlz5a+56LGh5piv5LiK5LiA5qyh5Ye95pWw5omn6KGM5pe255qEdGhpc+Wvueixoe+8jOa4suafk+aXtuS4iuS4i+aWh+WPkeeUn+mUmeivr+OAglxyXG4gICAgICAgICAgLy8ganMgbWFjcm9zIGV4cG9ydCBldmVsIGZ1bmN0aW9uXHJcbiAgICAgICAgICBqc21hY3Jvcy5ldmFsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmV2YWwuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcclxuICAgICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldCA9IG1hY3JvLmFwcGx5KGpzbWFjcm9zLCBqc0FyZ3MpO1xyXG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gYXN0LnBvcztcclxuICAgICAgICAgICAgdmFyIHRleHQgPSBWZWxvY2l0eS5IZWxwZXIuZ2V0UmVmVGV4dChhc3QpO1xyXG4gICAgICAgICAgICAvLyB0aHJvd3MgZXJyb3IgdHJlZVxyXG4gICAgICAgICAgICB2YXIgZXJyID0gJ1xcbiAgICAgIGF0ICcgKyB0ZXh0ICsgJyBML04gJyArIHBvcy5maXJzdF9saW5lICsgJzonICsgcG9zLmZpcnN0X2NvbHVtbjtcclxuICAgICAgICAgICAgZS5uYW1lID0gJyc7XHJcbiAgICAgICAgICAgIGUubWVzc2FnZSArPSBlcnI7XHJcbiAgICAgICAgICAgIHRocm93IGU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIGFzdHMgPSBtYWNyby5hc3RzO1xyXG4gICAgICAgIHZhciBhcmdzID0gbWFjcm8uYXJncztcclxuICAgICAgICB2YXIgY2FsbEFyZ3MgPSBhc3QuYXJncztcclxuICAgICAgICB2YXIgbG9jYWwgPSB7IGJvZHlDb250ZW50OiBib2R5Q29udGVudCB9O1xyXG4gICAgICAgIHZhciBndWlkID0gdXRpbHMuZ3VpZCgpO1xyXG4gICAgICAgIHZhciBjb250ZXh0SWQgPSAnbWFjcm86JyArIGFzdC5pZCArICc6JyArIGd1aWQ7XHJcblxyXG4gICAgICAgIHV0aWxzLmZvckVhY2goYXJncywgZnVuY3Rpb24ocmVmLCBpKSB7XHJcbiAgICAgICAgICBpZiAoY2FsbEFyZ3NbaV0pIHtcclxuICAgICAgICAgICAgbG9jYWxbcmVmLmlkXSA9IHRoaXMuZ2V0TGl0ZXJhbChjYWxsQXJnc1tpXSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb2NhbFtyZWYuaWRdID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgICByZXQgPSB0aGlzLmV2YWwoYXN0cywgbG9jYWwsIGNvbnRleHRJZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZXZhbFxyXG4gICAgICogQHBhcmFtIHN0ciB7YXJyYXl8c3RyaW5nfSBpbnB1dCBzdHJpbmdcclxuICAgICAqIEBwYXJhbSBsb2NhbCB7b2JqZWN0fSBsb2NhbCB2YXJpYWJsZVxyXG4gICAgICogQHBhcmFtIGNvbnRleHRJZCB7PXN0cmluZ30gb3B0aW9uYWwgY29udGV4dElkLCB0aGlzIGNvbnRleHRJZCB1c2UgdG8gZmluZCBsb2NhbCB2YXJpYWJsZVxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBldmFsOiBmdW5jdGlvbihzdHIsIGxvY2FsLCBjb250ZXh0SWQpIHtcclxuXHJcbiAgICAgIGlmICghbG9jYWwpIHtcclxuXHJcbiAgICAgICAgaWYgKHV0aWxzLmlzQXJyYXkoc3RyKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlcihzdHIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsU3RyKHN0cik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgdmFyIGFzdHMgPSBbXTtcclxuICAgICAgICB2YXIgcGFyc2UgPSBWZWxvY2l0eS5wYXJzZTtcclxuICAgICAgICBjb250ZXh0SWQgPSBjb250ZXh0SWQgfHwgKCdldmFsOicgKyB1dGlscy5ndWlkKCkpO1xyXG5cclxuICAgICAgICBpZiAodXRpbHMuaXNBcnJheShzdHIpKSB7XHJcblxyXG4gICAgICAgICAgYXN0cyA9IHN0cjtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChwYXJzZSkge1xyXG5cclxuICAgICAgICAgIGFzdHMgPSBwYXJzZShzdHIpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhc3RzLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgIHRoaXMubG9jYWxbY29udGV4dElkXSA9IGxvY2FsO1xyXG4gICAgICAgICAgdmFyIHJldCA9IHRoaXMuX3JlbmRlcihhc3RzLCBjb250ZXh0SWQpO1xyXG4gICAgICAgICAgdGhpcy5sb2NhbFtjb250ZXh0SWRdID0ge307XHJcbiAgICAgICAgICB0aGlzLmNvbmRpdGlvbnMuc2hpZnQoKTtcclxuICAgICAgICAgIHRoaXMuY29uZGl0aW9uID0gdGhpcy5jb25kaXRpb25zWzBdIHx8ICcnO1xyXG5cclxuICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBwYXJzZSAjZm9yZWFjaFxyXG4gICAgICovXHJcbiAgICBnZXRCbG9ja0VhY2g6IGZ1bmN0aW9uKGJsb2NrKSB7XHJcblxyXG4gICAgICB2YXIgYXN0ID0gYmxvY2tbMF07XHJcbiAgICAgIHZhciB0RnJvbSA9IHt9O1xyXG4gICAgICBPYmplY3QuYXNzaWduKHRGcm9tLCBhc3QuZnJvbSwge3BvczogYXN0LnBvc30pO1xyXG4gICAgICB2YXIgX2Zyb20gPSB0aGlzLmdldExpdGVyYWwodEZyb20pO1xyXG4gICAgICB2YXIgX2Jsb2NrID0gYmxvY2suc2xpY2UoMSk7XHJcbiAgICAgIHZhciBfdG8gPSBhc3QudG87XHJcbiAgICAgIHZhciBsb2NhbCA9IHtcclxuICAgICAgICBmb3JlYWNoOiB7XHJcbiAgICAgICAgICBjb3VudDogMFxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgICAgdmFyIHJldCA9ICcnO1xyXG4gICAgICB2YXIgZ3VpZCA9IHV0aWxzLmd1aWQoKTtcclxuICAgICAgdmFyIGNvbnRleHRJZCA9ICdmb3JlYWNoOicgKyBndWlkO1xyXG5cclxuICAgICAgdmFyIHR5cGUgPSAoe30pLnRvU3RyaW5nLmNhbGwoX2Zyb20pO1xyXG4gICAgICBpZiAoIV9mcm9tIHx8ICh0eXBlICE9PSAnW29iamVjdCBBcnJheV0nICYmIHR5cGUgIT09ICdbb2JqZWN0IE9iamVjdF0nKSkge1xyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkoX2Zyb20pKSB7XHJcbiAgICAgICAgdmFyIGxlbiA9IF9mcm9tLmxlbmd0aDtcclxuICAgICAgICB1dGlscy5mb3JFYWNoKF9mcm9tLCBmdW5jdGlvbih2YWwsIGkpIHtcclxuICAgICAgICAgIGlmICh0aGlzLl9zdGF0ZS5icmVhaykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBmb3IgZWFjaCBsb2NhbCB2YXJpYWJsZVxyXG4gICAgICAgICAgbG9jYWxbX3RvXSA9IHZhbDtcclxuICAgICAgICAgIGxvY2FsLmZvcmVhY2ggPSB7XHJcbiAgICAgICAgICAgIGNvdW50OiBpICsgMSxcclxuICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgIGhhc05leHQ6IGkgKyAxIDwgbGVuXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgbG9jYWwudmVsb2NpdHlDb3VudCA9IGkgKyAxO1xyXG5cclxuICAgICAgICAgIHRoaXMubG9jYWxbY29udGV4dElkXSA9IGxvY2FsO1xyXG4gICAgICAgICAgcmV0ICs9IHRoaXMuX3JlbmRlcihfYmxvY2ssIGNvbnRleHRJZCk7XHJcblxyXG4gICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBsZW4gPSB1dGlscy5rZXlzKF9mcm9tKS5sZW5ndGg7XHJcbiAgICAgICAgdXRpbHMuZm9yRWFjaCh1dGlscy5rZXlzKF9mcm9tKSwgZnVuY3Rpb24oa2V5LCBpKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5fc3RhdGUuYnJlYWspIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbG9jYWxbX3RvXSA9IF9mcm9tW2tleV07XHJcbiAgICAgICAgICBsb2NhbC5mb3JlYWNoID0ge1xyXG4gICAgICAgICAgICBjb3VudDogaSArIDEsXHJcbiAgICAgICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgICAgICBoYXNOZXh0OiBpICsgMSA8IGxlblxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGxvY2FsLnZlbG9jaXR5Q291bnQgPSBpICsgMTtcclxuICAgICAgICAgIHRoaXMubG9jYWxbY29udGV4dElkXSA9IGxvY2FsO1xyXG4gICAgICAgICAgcmV0ICs9IHRoaXMuX3JlbmRlcihfYmxvY2ssIGNvbnRleHRJZCk7XHJcbiAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGlmIGZvcmVhY2ggaXRlbXMgYmUgYW4gZW1wdHkgYXJyYXksIHRoZW4gdGhpcyBjb2RlIHdpbGwgc2hpZnQgY3VycmVudFxyXG4gICAgICAvLyBjb25kaXRpb25zLCBidXQgbm90IHRoaXMuX3JlbmRlciBjYWxsLCBzbyB0aGlzIHdpbGwgc2hpZnQgcGFyZW50IGNvbnRleHRcclxuICAgICAgaWYgKF9mcm9tICYmIF9mcm9tLmxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuX3N0YXRlLmJyZWFrID0gZmFsc2U7XHJcbiAgICAgICAgLy8gZW1wdHkgY3VycmVudCBsb2NhbCBjb250ZXh0IG9iamVjdFxyXG4gICAgICAgIHRoaXMubG9jYWxbY29udGV4dElkXSA9IHt9O1xyXG4gICAgICAgIHRoaXMuY29uZGl0aW9ucy5zaGlmdCgpO1xyXG4gICAgICAgIHRoaXMuY29uZGl0aW9uID0gdGhpcy5jb25kaXRpb25zWzBdIHx8ICcnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmV0O1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBwYXJzZSAjaWZcclxuICAgICAqL1xyXG4gICAgZ2V0QmxvY2tJZjogZnVuY3Rpb24oYmxvY2spIHtcclxuXHJcbiAgICAgIHZhciByZWNlaXZlZCA9IGZhbHNlO1xyXG4gICAgICB2YXIgYXN0cyA9IFtdO1xyXG5cclxuICAgICAgdXRpbHMuc29tZShibG9jaywgZnVuY3Rpb24oYXN0KSB7XHJcblxyXG4gICAgICAgIGlmIChhc3QuY29uZGl0aW9uKSB7XHJcblxyXG4gICAgICAgICAgaWYgKHJlY2VpdmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmVjZWl2ZWQgPSB0aGlzLmdldEV4cHJlc3Npb24oYXN0LmNvbmRpdGlvbik7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoYXN0LnR5cGUgPT09ICdlbHNlJykge1xyXG4gICAgICAgICAgaWYgKHJlY2VpdmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmVjZWl2ZWQgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVjZWl2ZWQpIHtcclxuICAgICAgICAgIGFzdHMucHVzaChhc3QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgfSwgdGhpcyk7XHJcblxyXG4gICAgICAvLyBrZWVwIGN1cnJlbnQgY29uZGl0aW9uIGZpeCAjNzdcclxuICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlcihhc3RzLCB0aGlzLmNvbmRpdGlvbik7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVmVsb2NpdHksIHV0aWxzKSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIGNvbXBpbGVcclxuICAgKi9cclxuICB1dGlscy5taXhpbihWZWxvY2l0eS5wcm90b3R5cGUsIHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLmNvbnRleHQgPSB7fTtcclxuICAgICAgdGhpcy5tYWNyb3MgPSB7fTtcclxuICAgICAgdGhpcy5kZWZpbmVzID0ge307XHJcbiAgICAgIHRoaXMuY29uZGl0aW9ucyA9IFtdO1xyXG4gICAgICB0aGlzLmxvY2FsID0ge307XHJcbiAgICAgIHRoaXMuc2lsZW5jZSA9IGZhbHNlO1xyXG4gICAgICB0aGlzLnVuZXNjYXBlID0ge307XHJcblxyXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgIHRoaXMuZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgc2VsZi5fc3RhdGUuc3RvcCA9IHRydWU7XHJcbiAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBjb250ZXh0IHtvYmplY3R9IGNvbnRleHQgb2JqZWN0XHJcbiAgICAgKiBAcGFyYW0gbWFjcm8gICB7b2JqZWN0fSBzZWxmIGRlZmluZWQgI21hY3JvXHJcbiAgICAgKiBAcGFyYW0gc2lsZW50IHtib29sfSDlpoLmnpzmmK90cnVl77yMJGZvb+WPmOmHj+WwhuWOn+agt+i+k+WHulxyXG4gICAgICogQHJldHVybiBzdHJcclxuICAgICAqL1xyXG4gICAgcmVuZGVyOiBmdW5jdGlvbihjb250ZXh0LCBtYWNyb3MsIHNpbGVuY2UpIHtcclxuXHJcbiAgICAgIHRoaXMuc2lsZW5jZSA9ICEhc2lsZW5jZTtcclxuICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dCB8fCB7fTtcclxuICAgICAgdGhpcy5qc21hY3JvcyA9IHV0aWxzLm1peGluKG1hY3JvcyB8fCB7fSwgdGhpcy5kaXJlY3RpdmUpO1xyXG4gICAgICB2YXIgdDEgPSB1dGlscy5ub3coKTtcclxuICAgICAgdmFyIHN0ciA9IHRoaXMuX3JlbmRlcigpO1xyXG4gICAgICB2YXIgdDIgPSB1dGlscy5ub3coKTtcclxuICAgICAgdmFyIGNvc3QgPSB0MiAtIHQxO1xyXG5cclxuICAgICAgdGhpcy5jb3N0ID0gY29zdDtcclxuXHJcbiAgICAgIHJldHVybiBzdHI7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kej5p6Q5YWl5Y+j5Ye95pWwXHJcbiAgICAgKiBAcGFyYW0gYXN0IHthcnJheX0g5qih5p2/57uT5p6E5pWw57uEXHJcbiAgICAgKiBAcGFyYW0gY29udGV4dElkIHtudW1iZXJ9IOaJp+ihjOeOr+Wig2lk77yM5a+55LqObWFjcm/mnInlsYDpg6jkvZznlKjln5/vvIzlj5jph4/nmoTorr7nva7lkoxcclxuICAgICAqIOWPluWAvO+8jOmDveaUvuWcqOS4gOS4qnRoaXMubG9jYWzkuIvvvIzpgJrov4djb250ZXh0SWTmn6Xmib5cclxuICAgICAqIEByZXR1cm4ge3N0cmluZ33op6PmnpDlkI7nmoTlrZfnrKbkuLJcclxuICAgICAqL1xyXG4gICAgX3JlbmRlcjogZnVuY3Rpb24oYXN0cywgY29udGV4dElkKSB7XHJcblxyXG4gICAgICB2YXIgc3RyID0gJyc7XHJcbiAgICAgIGFzdHMgPSBhc3RzIHx8IHRoaXMuYXN0cztcclxuXHJcbiAgICAgIGlmIChjb250ZXh0SWQpIHtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHRJZCAhPT0gdGhpcy5jb25kaXRpb24gJiZcclxuICAgICAgICAgICAgdXRpbHMuaW5kZXhPZihjb250ZXh0SWQsIHRoaXMuY29uZGl0aW9ucykgPT09IC0xKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbmRpdGlvbnMudW5zaGlmdChjb250ZXh0SWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb25kaXRpb24gPSBjb250ZXh0SWQ7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29uZGl0aW9uID0gbnVsbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdXRpbHMuZm9yRWFjaChhc3RzLCBmdW5jdGlvbihhc3QpIHtcclxuXHJcbiAgICAgICAgLy8g6L+b5YWlc3RvcO+8jOebtOaOpemAgOWHulxyXG4gICAgICAgIGlmICh0aGlzLl9zdGF0ZS5zdG9wID09PSB0cnVlKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2l0Y2ggKGFzdC50eXBlKSB7XHJcbiAgICAgICAgICBjYXNlICdyZWZlcmVuY2VzJzpcclxuICAgICAgICAgICAgc3RyICs9IHRoaXMuZm9ybWF0KHRoaXMuZ2V0UmVmZXJlbmNlcyhhc3QsIHRydWUpKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGNhc2UgJ3NldCc6XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUoYXN0KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGNhc2UgJ2JyZWFrJzpcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGUuYnJlYWsgPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgY2FzZSAnbWFjcm9fY2FsbCc6XHJcbiAgICAgICAgICAgIHN0ciArPSB0aGlzLmdldE1hY3JvKGFzdCk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBjYXNlICdjb21tZW50JzpcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGNhc2UgJ3Jhdyc6XHJcbiAgICAgICAgICAgIHN0ciArPSBhc3QudmFsdWU7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBzdHIgKz0gdHlwZW9mIGFzdCA9PT0gJ3N0cmluZycgPyBhc3QgOiB0aGlzLmdldEJsb2NrKGFzdCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgcmV0dXJuIHN0cjtcclxuICAgIH0sXHJcbiAgICBmb3JtYXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgIHJldHVybiBcIltcIiArIHZhbHVlLm1hcCh0aGlzLmZvcm1hdC5iaW5kKHRoaXMpKS5qb2luKFwiLCBcIikgKyBcIl1cIjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHV0aWxzLmlzT2JqZWN0KHZhbHVlKSkge1xyXG4gICAgICAgIGlmICh2YWx1ZS50b1N0cmluZy50b1N0cmluZygpLmluZGV4T2YoJ1tuYXRpdmUgY29kZV0nKSA9PT0gLTEpIHtcclxuICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBrdkpvaW4gPSBmdW5jdGlvbihrKSB7IHJldHVybiBrICsgXCI9XCIgKyB0aGlzLmZvcm1hdCh2YWx1ZVtrXSk7IH0uYmluZCh0aGlzKTtcclxuICAgICAgICByZXR1cm4gXCJ7XCIgKyBPYmplY3Qua2V5cyh2YWx1ZSkubWFwKGt2Sm9pbikuam9pbihcIiwgXCIpICsgXCJ9XCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihWZWxvY2l0eSwgdXRpbHMpe1xyXG4gIC8qKlxyXG4gICAqIGV4cHJlc3Npb24gc3VwcG9ydCwgaW5jbHVkZSBtYXRoLCBsb2dpYywgY29tcGFyZSBleHByZXNzaW9uXHJcbiAgICovXHJcbiAgdXRpbHMubWl4aW4oVmVsb2NpdHkucHJvdG90eXBlLCB7XHJcbiAgICAvKipcclxuICAgICAqIOihqOi+vuW8j+axguWAvO+8jOihqOi+vuW8j+S4u+imgeaYr+aVsOWtpuihqOi+vuW8j++8jOmAu+i+kei/kOeul+WSjOavlOi+g+i/kOeul++8jOWIsOacgOW6leWxguaVsOaNrue7k+aehO+8jFxyXG4gICAgICog5Z+65pys5pWw5o2u57G75Z6L77yM5L2/55SoIGdldExpdGVyYWzmsYLlgLzvvIxnZXRMaXRlcmFs6YGH5Yiw5piv5byV55So55qE5pe25YCZ77yM5L2/55SoXHJcbiAgICAgKiBnZXRSZWZlcmVuY2Vz5rGC5YC8XHJcbiAgICAgKi9cclxuICAgIGdldEV4cHJlc3Npb246IGZ1bmN0aW9uKGFzdCl7XHJcblxyXG4gICAgICB2YXIgZXhwID0gYXN0LmV4cHJlc3Npb247XHJcbiAgICAgIHZhciByZXQ7XHJcbiAgICAgIGlmIChhc3QudHlwZSA9PT0gJ21hdGgnKSB7XHJcblxyXG4gICAgICAgIHN3aXRjaChhc3Qub3BlcmF0b3IpIHtcclxuICAgICAgICAgIGNhc2UgJysnOlxyXG4gICAgICAgICAgcmV0ID0gdGhpcy5nZXRFeHByZXNzaW9uKGV4cFswXSkgKyB0aGlzLmdldEV4cHJlc3Npb24oZXhwWzFdKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGNhc2UgJy0nOlxyXG4gICAgICAgICAgcmV0ID0gdGhpcy5nZXRFeHByZXNzaW9uKGV4cFswXSkgLSB0aGlzLmdldEV4cHJlc3Npb24oZXhwWzFdKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGNhc2UgJy8nOlxyXG4gICAgICAgICAgcmV0ID0gdGhpcy5nZXRFeHByZXNzaW9uKGV4cFswXSkgLyB0aGlzLmdldEV4cHJlc3Npb24oZXhwWzFdKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGNhc2UgJyUnOlxyXG4gICAgICAgICAgcmV0ID0gdGhpcy5nZXRFeHByZXNzaW9uKGV4cFswXSkgJSB0aGlzLmdldEV4cHJlc3Npb24oZXhwWzFdKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGNhc2UgJyonOlxyXG4gICAgICAgICAgcmV0ID0gdGhpcy5nZXRFeHByZXNzaW9uKGV4cFswXSkgKiB0aGlzLmdldEV4cHJlc3Npb24oZXhwWzFdKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGNhc2UgJ3x8JzpcclxuICAgICAgICAgIHJldCA9IHRoaXMuZ2V0RXhwcmVzc2lvbihleHBbMF0pIHx8IHRoaXMuZ2V0RXhwcmVzc2lvbihleHBbMV0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgY2FzZSAnJiYnOlxyXG4gICAgICAgICAgcmV0ID0gdGhpcy5nZXRFeHByZXNzaW9uKGV4cFswXSkgJiYgdGhpcy5nZXRFeHByZXNzaW9uKGV4cFsxXSk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBjYXNlICc+JzpcclxuICAgICAgICAgIHJldCA9IHRoaXMuZ2V0RXhwcmVzc2lvbihleHBbMF0pID4gdGhpcy5nZXRFeHByZXNzaW9uKGV4cFsxXSk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBjYXNlICc8JzpcclxuICAgICAgICAgIHJldCA9IHRoaXMuZ2V0RXhwcmVzc2lvbihleHBbMF0pIDwgdGhpcy5nZXRFeHByZXNzaW9uKGV4cFsxXSk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBjYXNlICc9PSc6XHJcbiAgICAgICAgICByZXQgPSB0aGlzLmdldEV4cHJlc3Npb24oZXhwWzBdKSA9PSB0aGlzLmdldEV4cHJlc3Npb24oZXhwWzFdKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGNhc2UgJz49JzpcclxuICAgICAgICAgIHJldCA9IHRoaXMuZ2V0RXhwcmVzc2lvbihleHBbMF0pID49IHRoaXMuZ2V0RXhwcmVzc2lvbihleHBbMV0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgY2FzZSAnPD0nOlxyXG4gICAgICAgICAgcmV0ID0gdGhpcy5nZXRFeHByZXNzaW9uKGV4cFswXSkgPD0gdGhpcy5nZXRFeHByZXNzaW9uKGV4cFsxXSk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBjYXNlICchPSc6XHJcbiAgICAgICAgICByZXQgPSB0aGlzLmdldEV4cHJlc3Npb24oZXhwWzBdKSAhPSB0aGlzLmdldEV4cHJlc3Npb24oZXhwWzFdKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGNhc2UgJ21pbnVzJzpcclxuICAgICAgICAgIHJldCA9IC0gdGhpcy5nZXRFeHByZXNzaW9uKGV4cFswXSk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBjYXNlICdub3QnOlxyXG4gICAgICAgICAgcmV0ID0gIXRoaXMuZ2V0RXhwcmVzc2lvbihleHBbMF0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgY2FzZSAncGFyZW50aGVzaXMnOlxyXG4gICAgICAgICAgcmV0ID0gdGhpcy5nZXRFeHByZXNzaW9uKGV4cFswXSk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgLy8gY29kZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRMaXRlcmFsKGFzdCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxufTtcclxuIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcclxudmFyIEhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlci9pbmRleCcpO1xyXG52YXIgbWV0aG9kcyA9IHJlcXVpcmUoJy4vbWV0aG9kcycpO1xyXG5mdW5jdGlvbiBWZWxvY2l0eShhc3RzLCBjb25maWcpIHtcclxuICB0aGlzLmFzdHMgPSBhc3RzO1xyXG4gIHRoaXMuY29uZmlnID0gdXRpbHMubWl4aW4oXHJcbiAgICB7XHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBpZiBlc2NhcGVIdG1sIHZhcmlhYmxlLCBpcyBzZXQgdHJ1ZVxyXG4gICAgICAgKiAkZm9vIHZhbHVlIHdpbGwgaGFuZGxlIGJ5IGVzY2FwZUh0bWxcclxuICAgICAgICovXHJcbiAgICAgIGVzY2FwZTogZmFsc2UsXHJcbiAgICAgIC8vIHdoaXRlTGlzdCB3aGljaCBubyBuZWVkIGVzY2FwZUh0bWxcclxuICAgICAgdW5lc2NhcGU6IHt9LFxyXG4gICAgICB2YWx1ZU1hcHBlcih2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBjb25maWdcclxuICApO1xyXG4gIHRoaXMuX3N0YXRlID0geyBzdG9wOiBmYWxzZSwgYnJlYWs6IGZhbHNlIH07XHJcbiAgdGhpcy5jdXN0b21NZXRob2RIYW5kbGVycyA9IG1ldGhvZHMuY29uY2F0KGNvbmZpZyA/IGNvbmZpZy5jdXN0b21NZXRob2RIYW5kbGVycyA6IFtdKTtcclxuICB0aGlzLmluaXQoKTtcclxufVxyXG5cclxuVmVsb2NpdHkuSGVscGVyID0gSGVscGVyO1xyXG5WZWxvY2l0eS5wcm90b3R5cGUgPSB7XHJcbiAgY29uc3RydWN0b3I6IFZlbG9jaXR5XHJcbn07XHJcblxyXG5yZXF1aXJlKCcuL2Jsb2NrcycpKFZlbG9jaXR5LCB1dGlscyk7XHJcbnJlcXVpcmUoJy4vbGl0ZXJhbCcpKFZlbG9jaXR5LCB1dGlscyk7XHJcbnJlcXVpcmUoJy4vcmVmZXJlbmNlcycpKFZlbG9jaXR5LCB1dGlscyk7XHJcbnJlcXVpcmUoJy4vc2V0JykoVmVsb2NpdHksIHV0aWxzKTtcclxucmVxdWlyZSgnLi9leHByZXNzaW9uJykoVmVsb2NpdHksIHV0aWxzKTtcclxucmVxdWlyZSgnLi9jb21waWxlJykoVmVsb2NpdHksIHV0aWxzKTtcclxubW9kdWxlLmV4cG9ydHMgPSBWZWxvY2l0eTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFZlbG9jaXR5LCB1dGlscykge1xyXG4gIC8qKlxyXG4gICAqIGxpdGVyYWwgcGFyc2UsIGluY2x1ZGUgc3RyaW5nLCBpbnRlZ2VyLCBhcnJheSwgbWFwLCBib29sIGRhdGEgc3RydWN0dXJlXHJcbiAgICogQHJlcXVpcmUge21ldGhvZH0gZ2V0UmVmZXJlbmNlc1xyXG4gICAqL1xyXG4gIHV0aWxzLm1peGluKFZlbG9jaXR5LnByb3RvdHlwZSwge1xyXG4gICAgLyoqXHJcbiAgICAgKiDlrZfpnaLph4/msYLlgLzvvIzkuLvopoHljIXmi6xzdHJpbmcsIGludGVnZXIsIGFycmF5LCBtYXDlm5vnp43mlbDmja7nu5PmnoRcclxuICAgICAqIEBwYXJhbSBsaXRlcmFsIHtvYmplY3R9IOWumuS5ieS6jnZlbG9jaXR5Lnl55paH5Lu277yMdHlwZeaPj+i/sOaVsOaNruexu+Wei++8jHZhbHVl5bGe5oCnXHJcbiAgICAgKiDmmK9saXRlcmFs5YC85o+P6L+wXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R8c3RyaW5nfG51bWJlcnxhcnJheX0ganMgdmFyaWFibGVcclxuICAgICAqL1xyXG4gICAgZ2V0TGl0ZXJhbDogZnVuY3Rpb24obGl0ZXJhbCkge1xyXG5cclxuICAgICAgdmFyIHR5cGUgPSBsaXRlcmFsLnR5cGU7XHJcbiAgICAgIHZhciByZXQgPSAnJztcclxuXHJcbiAgICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xyXG5cclxuICAgICAgICByZXQgPSB0aGlzLmdldFN0cmluZyhsaXRlcmFsKTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2ludGVnZXInKSB7XHJcblxyXG4gICAgICAgIHJldCA9IHBhcnNlSW50KGxpdGVyYWwudmFsdWUsIDEwKTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2RlY2ltYWwnKSB7XHJcblxyXG4gICAgICAgIHJldCA9IHBhcnNlRmxvYXQobGl0ZXJhbC52YWx1ZSwgMTApO1xyXG5cclxuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnYXJyYXknKSB7XHJcblxyXG4gICAgICAgIHJldCA9IHRoaXMuZ2V0QXJyYXkobGl0ZXJhbCk7XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdtYXAnKSB7XHJcblxyXG4gICAgICAgIHJldCA9IHt9O1xyXG4gICAgICAgIHZhciBtYXAgPSBsaXRlcmFsLnZhbHVlO1xyXG5cclxuICAgICAgICB1dGlscy5mb3JFYWNoKG1hcCwgZnVuY3Rpb24oZXhwLCBrZXkpIHtcclxuICAgICAgICAgIHJldFtrZXldID0gdGhpcy5nZXRMaXRlcmFsKGV4cCk7XHJcbiAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2Jvb2wnKSB7XHJcblxyXG4gICAgICAgIGlmIChsaXRlcmFsLnZhbHVlID09PSBcIm51bGxcIikge1xyXG4gICAgICAgICAgcmV0ID0gbnVsbDtcclxuICAgICAgICB9IGVsc2UgaWYgKGxpdGVyYWwudmFsdWUgPT09ICdmYWxzZScpIHtcclxuICAgICAgICAgIHJldCA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobGl0ZXJhbC52YWx1ZSA9PT0gJ3RydWUnKSB7XHJcbiAgICAgICAgICByZXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIHJldCA9IHRoaXMuZ2V0UmVmZXJlbmNlcyhsaXRlcmFsKTtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5a+55a2X56ym5Liy5rGC5YC877yM5a+55bey5Y+M5byV5Y+35a2X56ym5Liy77yM6ZyA6KaB5YGa5Y+Y6YeP5pu/5o2iXHJcbiAgICAgKi9cclxuICAgIGdldFN0cmluZzogZnVuY3Rpb24obGl0ZXJhbCkge1xyXG4gICAgICB2YXIgdmFsID0gbGl0ZXJhbC52YWx1ZTtcclxuICAgICAgdmFyIHJldCA9IHZhbDtcclxuXHJcbiAgICAgIGlmIChsaXRlcmFsLmlzRXZhbCAmJiAodmFsLmluZGV4T2YoJyMnKSAhPT0gLTEgfHxcclxuICAgICAgICAgICAgdmFsLmluZGV4T2YoXCIkXCIpICE9PSAtMSkpIHtcclxuICAgICAgICByZXQgPSB0aGlzLmV2YWxTdHIodmFsKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJldDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlr7lhcnJheeWtl+mdoumHj+axguWAvO+8jOavlOWmglsxLCAyXT0+IFsxLDJd77yMWzEuLjVdID0+IFsxLDIsMyw0LDVdXHJcbiAgICAgKiBAcGFyYW0gbGl0ZXJhbCB7b2JqZWN0fSBhcnJheeWtl+mdoumHj+eahOaPj+i/sOWvueixoe+8jOWIhuS4uuaZrumAmuaVsOe7hOWSjHJhbmdl5pWw57uE5Lik56eNXHJcbiAgICAgKiDvvIzlkoxqc+WfuuacrOS4gOiHtFxyXG4gICAgICogQHJldHVybiB7YXJyYXl9IOaxguWAvOW+l+WIsOeahOaVsOe7hFxyXG4gICAgICovXHJcbiAgICBnZXRBcnJheTogZnVuY3Rpb24obGl0ZXJhbCkge1xyXG5cclxuICAgICAgdmFyIHJldCA9IFtdO1xyXG5cclxuICAgICAgaWYgKGxpdGVyYWwuaXNSYW5nZSkge1xyXG5cclxuICAgICAgICB2YXIgYmVnaW4gPSBsaXRlcmFsLnZhbHVlWzBdO1xyXG4gICAgICAgIGlmIChiZWdpbi50eXBlID09PSAncmVmZXJlbmNlcycpIHtcclxuICAgICAgICAgIGJlZ2luID0gdGhpcy5nZXRSZWZlcmVuY2VzKGJlZ2luKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBlbmQgPSBsaXRlcmFsLnZhbHVlWzFdO1xyXG4gICAgICAgIGlmIChlbmQudHlwZSA9PT0gJ3JlZmVyZW5jZXMnKSB7XHJcbiAgICAgICAgICBlbmQgPSB0aGlzLmdldFJlZmVyZW5jZXMoZW5kKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVuZCAgID0gcGFyc2VJbnQoZW5kLCAxMCk7XHJcbiAgICAgICAgYmVnaW4gPSBwYXJzZUludChiZWdpbiwgMTApO1xyXG5cclxuICAgICAgICB2YXIgaTtcclxuXHJcbiAgICAgICAgaWYgKCFpc05hTihiZWdpbikgJiYgIWlzTmFOKGVuZCkpIHtcclxuXHJcbiAgICAgICAgICBpZiAoYmVnaW4gPCBlbmQpIHtcclxuICAgICAgICAgICAgZm9yIChpID0gYmVnaW47IGkgPD0gZW5kOyBpKyspIHJldC5wdXNoKGkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChpID0gYmVnaW47IGkgPj0gZW5kOyBpLS0pIHJldC5wdXNoKGkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdXRpbHMuZm9yRWFjaChsaXRlcmFsLnZhbHVlLCBmdW5jdGlvbihleHApIHtcclxuICAgICAgICAgIHJldC5wdXNoKHRoaXMuZ2V0TGl0ZXJhbChleHApKTtcclxuICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJldDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlr7nlj4zlvJXlj7flrZfnrKbkuLLov5vooYxldmFs5rGC5YC877yM5pu/5o2i5YW25Lit55qE5Y+Y6YeP77yM5Y+q5pSv5oyB5pyA5Z+65pys55qE5Y+Y6YeP57G75Z6L5pu/5o2iXHJcbiAgICAgKi9cclxuICAgIGV2YWxTdHI6IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICB2YXIgYXN0cyA9IFZlbG9jaXR5LnBhcnNlKHN0cik7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZW5kZXIoYXN0cywgdGhpcy5jb25kaXRpb24pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG4iLCJjb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XHJcblxyXG5mdW5jdGlvbiBoYXNQcm9wZXJ0eShjb250ZXh0LCBmaWVsZCkge1xyXG4gIGlmICh0eXBlb2YgY29udGV4dCA9PT0gJ251bWJlcicgfHwgdHlwZW9mIGNvbnRleHQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICByZXR1cm4gY29udGV4dFtmaWVsZF0gfHwgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbnRleHQsIGZpZWxkKTtcclxuICB9XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIHJldHVybiBmaWVsZCBpbiBjb250ZXh0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYXRjaFByb3BlcnR5KHZhbHVlLCBub3RJbkNvbnRleHQpIHtcclxuICByZXR1cm4gZnVuY3Rpb24oeyBwcm9wZXJ0eSwgY29udGV4dCB9KSB7XHJcbiAgICByZXR1cm4gdmFsdWUgPT09IHByb3BlcnR5ICYmIChcclxuICAgICAgbm90SW5Db250ZXh0ID8gIWhhc1Byb3BlcnR5KGNvbnRleHQsIHByb3BlcnR5KSA6IHRydWVcclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYXRjaFN0YXJ0V2l0aCh2YWx1ZSkge1xyXG4gIHJldHVybiBmdW5jdGlvbih7IHByb3BlcnR5LCBjb250ZXh0IH0pIHtcclxuICAgIHJldHVybiBwcm9wZXJ0eS5pbmRleE9mKHZhbHVlKSA9PT0gMCAmJlxyXG4gICAgICAhKHByb3BlcnR5IGluIGNvbnRleHQpICYmXHJcbiAgICAgIHByb3BlcnR5Lmxlbmd0aCA+IHZhbHVlLmxlbmd0aDtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldHRlcihiYXNlLCBwcm9wZXJ0eSkge1xyXG4gIC8vIGdldCgxKVxyXG4gIGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdudW1iZXInKSB7XHJcbiAgICByZXR1cm4gYmFzZVtwcm9wZXJ0eV07XHJcbiAgfVxyXG5cclxuICB2YXIgbGV0dGVyID0gcHJvcGVydHkuY2hhckNvZGVBdCgwKTtcclxuICB2YXIgaXNVcHBlciA9IGxldHRlciA8IDkxO1xyXG4gIHZhciByZXQgPSBiYXNlW3Byb3BlcnR5XTtcclxuXHJcbiAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICByZXR1cm4gcmV0O1xyXG4gIH1cclxuXHJcbiAgaWYgKGlzVXBwZXIpIHtcclxuICAgIC8vIEFkZHJlc3MgPT4gYWRkcmVzc1xyXG4gICAgcHJvcGVydHkgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGxldHRlcikudG9Mb3dlckNhc2UoKSArIHByb3BlcnR5LnNsaWNlKDEpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFpc1VwcGVyKSB7XHJcbiAgICAvLyBhZGRyZXNzID0+IEFkZHJlc3NcclxuICAgIHByb3BlcnR5ID0gU3RyaW5nLmZyb21DaGFyQ29kZShsZXR0ZXIpLnRvVXBwZXJDYXNlKCkgKyBwcm9wZXJ0eS5zbGljZSgxKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBiYXNlW3Byb3BlcnR5XTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2l6ZShvYmopIHtcclxuICBpZiAodXRpbHMuaXNBcnJheShvYmopKSB7XHJcbiAgICByZXR1cm4gb2JqLmxlbmd0aDtcclxuICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KG9iaikpIHtcclxuICAgIHJldHVybiB1dGlscy5rZXlzKG9iaikubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHVuZGVmaW5lZDtcclxufVxyXG5cclxuY29uc3QgaGFuZGxlcnMgPSB7XHJcbiAgLy8gJGZvby5nZXQoJ2JhcicpXHJcbiAgZ2V0OiB7XHJcbiAgICBtYXRjaDogbWF0Y2hQcm9wZXJ0eSgnZ2V0JywgdHJ1ZSksXHJcbiAgICByZXNvbHZlOiBmdW5jdGlvbih7IGNvbnRleHQsIHBhcmFtcyB9KSB7XHJcbiAgICAgIHJldHVybiBnZXR0ZXIoY29udGV4dCwgcGFyYW1zWzBdKTtcclxuICAgIH0sXHJcbiAgfSxcclxuICAvLyAkZm9vLnNldCgnYScsICdiJylcclxuICBzZXQ6IHtcclxuICAgIG1hdGNoOiBtYXRjaFByb3BlcnR5KCdzZXQnLCB0cnVlKSxcclxuICAgIHJlc29sdmU6IGZ1bmN0aW9uKHsgY29udGV4dCwgcGFyYW1zLCBwcm9wZXJ0eSB9KSB7XHJcbiAgICAgIGNvbnRleHRbcGFyYW1zWzBdXSA9IHBhcmFtc1sxXTtcclxuICAgICAgcmV0dXJuICcnO1xyXG4gICAgfSxcclxuICB9LFxyXG4gIC8vIGdldEFkZHJlc3MoKVxyXG4gIGdldFZhbHVlOiB7XHJcbiAgICBtYXRjaDogbWF0Y2hTdGFydFdpdGgoJ2dldCcpLFxyXG4gICAgcmVzb2x2ZTogZnVuY3Rpb24oeyBjb250ZXh0LCBwcm9wZXJ0eSB9KSB7XHJcbiAgICAgIHJldHVybiBnZXR0ZXIoY29udGV4dCwgcHJvcGVydHkuc2xpY2UoMykpXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgaXNWYWx1ZToge1xyXG4gICAgbWF0Y2g6IG1hdGNoU3RhcnRXaXRoKCdpcycpLFxyXG4gICAgcmVzb2x2ZTogZnVuY3Rpb24oeyBjb250ZXh0LCBwcm9wZXJ0eSB9KSB7XHJcbiAgICAgIHJldHVybiBnZXR0ZXIoY29udGV4dCwgcHJvcGVydHkuc2xpY2UoMikpXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgLy8gJHBhZ2Uuc2V0TmFtZSgxMjMpXHJcbiAgc2V0VmFsdWU6IHtcclxuICAgIG1hdGNoOiBtYXRjaFN0YXJ0V2l0aCgnc2V0JyksXHJcbiAgICByZXNvbHZlOiBmdW5jdGlvbih7IGNvbnRleHQsIHByb3BlcnR5LCBwYXJhbXMgfSkge1xyXG4gICAgICBjb250ZXh0W3Byb3BlcnR5LnNsaWNlKDMpXSA9IHBhcmFtc1swXTtcclxuICAgICAgLy8gc2V0IHZhbHVlIHdpbGwgbm90IG91dHB1dCBhbnl0aGluZ1xyXG4gICAgICBjb250ZXh0LnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7IHJldHVybiAnJzsgfTtcclxuICAgICAgcmV0dXJuIGNvbnRleHQ7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAga2V5U2V0OiB7XHJcbiAgICBtYXRjaDogbWF0Y2hQcm9wZXJ0eSgna2V5U2V0JywgdHJ1ZSksXHJcbiAgICByZXNvbHZlOiBmdW5jdGlvbih7IGNvbnRleHQgfSkge1xyXG4gICAgICByZXR1cm4gdXRpbHMua2V5cyhjb250ZXh0KTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBlbnRyeVNldDoge1xyXG4gICAgbWF0Y2g6IG1hdGNoUHJvcGVydHkoJ2VudHJ5U2V0JywgdHJ1ZSksXHJcbiAgICByZXNvbHZlOiBmdW5jdGlvbih7IGNvbnRleHQgfSkge1xyXG4gICAgICBjb25zdCByZXQgPSBbXTtcclxuICAgICAgdXRpbHMuZm9yRWFjaChjb250ZXh0LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XHJcbiAgICAgICAgcmV0LnB1c2goeyBrZXk6IGtleSwgdmFsdWU6IHZhbHVlIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHJldDtcclxuICAgIH0sXHJcbiAgfSxcclxuICBzaXplOiB7XHJcbiAgICBtYXRjaDogbWF0Y2hQcm9wZXJ0eSgnc2l6ZScsIHRydWUpLFxyXG4gICAgcmVzb2x2ZTogZnVuY3Rpb24oeyBjb250ZXh0IH0pIHtcclxuICAgICAgcmV0dXJuIGdldFNpemUoY29udGV4dCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcHV0OiB7XHJcbiAgICBtYXRjaDogbWF0Y2hQcm9wZXJ0eSgncHV0JywgdHJ1ZSksXHJcbiAgICByZXNvbHZlOiBmdW5jdGlvbih7IGNvbnRleHQsIHBhcmFtcyB9KSB7XHJcbiAgICAgIHJldHVybiBjb250ZXh0W3BhcmFtc1swXV0gPSBwYXJhbXNbMV07XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYWRkOiB7XHJcbiAgICBtYXRjaDogbWF0Y2hQcm9wZXJ0eSgnYWRkJywgdHJ1ZSksXHJcbiAgICByZXNvbHZlOiBmdW5jdGlvbih7IGNvbnRleHQsIHBhcmFtcyB9KSB7XHJcbiAgICAgIGlmICh0eXBlb2YgY29udGV4dC5wdXNoICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjb250ZXh0LnB1c2gocGFyYW1zWzBdKTtcclxuICAgIH0sXHJcbiAgfSxcclxuICByZW1vdmU6IHtcclxuICAgIG1hdGNoOiBtYXRjaFByb3BlcnR5KCdyZW1vdmUnLCB0cnVlKSxcclxuICAgIHJlc29sdmU6IGZ1bmN0aW9uKHsgY29udGV4dCwgcGFyYW1zIH0pIHtcclxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkoY29udGV4dCkpIHtcclxuXHJcbiAgICAgICAgbGV0IGluZGV4O1xyXG4gICAgICAgIGlmICh0eXBlb2YgaW5kZXggPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICBpbmRleCA9IHBhcmFtc1swXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaW5kZXggPSBjb250ZXh0LmluZGV4T2YocGFyYW1zWzBdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldCA9IGNvbnRleHRbaW5kZXhdO1xyXG4gICAgICAgIGNvbnRleHQuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG5cclxuICAgICAgfSBlbHNlIGlmICh1dGlscy5pc09iamVjdChjb250ZXh0KSkge1xyXG4gICAgICAgIHJldCA9IGNvbnRleHRbcGFyYW1zWzBdXTtcclxuICAgICAgICBkZWxldGUgY29udGV4dFtwYXJhbXNbMF1dO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc3ViTGlzdDoge1xyXG4gICAgbWF0Y2g6IG1hdGNoUHJvcGVydHkoJ3N1Ykxpc3QnLCB0cnVlKSxcclxuICAgIHJlc29sdmU6IGZ1bmN0aW9uKHsgY29udGV4dCwgcGFyYW1zIH0pIHtcclxuICAgICAgcmV0dXJuIGNvbnRleHQuc2xpY2UocGFyYW1zWzBdLCBwYXJhbXNbMV0pO1xyXG4gICAgfSxcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxzLmtleXMoaGFuZGxlcnMpLm1hcChmdW5jdGlvbihrZXkpIHtcclxuICByZXR1cm4ge1xyXG4gICAgdWlkOiAnc3lzdGVtOiAnICsga2V5LFxyXG4gICAgbWF0Y2g6IGhhbmRsZXJzW2tleV0ubWF0Y2gsXHJcbiAgICByZXNvbHZlOiBoYW5kbGVyc1trZXldLnJlc29sdmUsXHJcbiAgfTtcclxufSk7IiwidmFyIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgndmVsb2NpdHknKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVmVsb2NpdHksIHV0aWxzKSB7XHJcblxyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgLyoqXHJcbiAgICogZXNjYXBlSFRNTFxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNvbnZlcnQoc3RyKSB7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSByZXR1cm4gc3RyO1xyXG5cclxuICAgIHZhciByZXN1bHQgPSBcIlwiXHJcbiAgICB2YXIgZXNjYXBlID0gZmFsc2VcclxuICAgIHZhciBpLCBjLCBjc3RyO1xyXG5cclxuICAgIGZvciAoaSA9IDAgOyBpIDwgc3RyLmxlbmd0aCA7IGkrKykge1xyXG4gICAgICBjID0gc3RyLmNoYXJBdChpKTtcclxuICAgICAgaWYgKCgnICcgPD0gYyAmJiBjIDw9ICd+JykgfHwgKGMgPT09ICdcXHInKSB8fCAoYyA9PT0gJ1xcbicpKSB7XHJcbiAgICAgICAgaWYgKGMgPT09ICcmJykge1xyXG4gICAgICAgICAgY3N0ciA9IFwiJmFtcDtcIlxyXG4gICAgICAgICAgZXNjYXBlID0gdHJ1ZVxyXG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJ1wiJykge1xyXG4gICAgICAgICAgY3N0ciA9IFwiJnF1b3Q7XCJcclxuICAgICAgICAgIGVzY2FwZSA9IHRydWVcclxuICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICc8Jykge1xyXG4gICAgICAgICAgY3N0ciA9IFwiJmx0O1wiXHJcbiAgICAgICAgICBlc2NhcGUgPSB0cnVlXHJcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnPicpIHtcclxuICAgICAgICAgIGNzdHIgPSBcIiZndDtcIlxyXG4gICAgICAgICAgZXNjYXBlID0gdHJ1ZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjc3RyID0gYy50b1N0cmluZygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNzdHIgPSBcIiYjXCIgKyBjLmNoYXJDb2RlQXQoKS50b1N0cmluZygpICsgXCI7XCJcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgY3N0clxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlc2NhcGUgPyByZXN1bHQgOiBzdHJcclxuICB9XHJcblxyXG4gIHZhciBwb3NVbmtub3duID0geyBmaXJzdF9saW5lOiBcInVua25vd25cIiwgZmlyc3RfY29sdW1uOiBcInVua25vd25cIn07XHJcblxyXG4gIHV0aWxzLm1peGluKFZlbG9jaXR5LnByb3RvdHlwZSwge1xyXG4gICAgLyoqXHJcbiAgICAgKiBnZXQgdmFyaWFibGUgdmFsdWUgXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gYXN0IGFzdCBkYXRhXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2x9IGlzVmFsIGZvciBleGFtcGxlIGAkZm9vYCwgaXNWYWwgdmFsdWUgc2hvdWxkIGJlIHRydWUsIG90aGVyIGNvbmRpdGlvbixcclxuICAgICAqIGAjc2V0KCRmb28gPSAkYmFyKWAsIHRoZSAkYmFyIHZhbHVlIGdldCwgaXNWYWwgc2V0IHRvIGZhbHNlXHJcbiAgICAgKi9cclxuICAgIGdldFJlZmVyZW5jZXM6IGZ1bmN0aW9uKGFzdCwgaXNWYWwpIHtcclxuXHJcbiAgICAgIGlmIChhc3QucHJ1ZSkge1xyXG4gICAgICAgIHZhciBkZWZpbmUgPSB0aGlzLmRlZmluZXNbYXN0LmlkXTtcclxuICAgICAgICBpZiAodXRpbHMuaXNBcnJheShkZWZpbmUpKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5fcmVuZGVyKGRlZmluZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhc3QuaWQgaW4gdGhpcy5jb25maWcudW5lc2NhcGUpIGFzdC5wcnVlID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIGVzY2FwZSA9IHRoaXMuY29uZmlnLmVzY2FwZTtcclxuXHJcbiAgICAgIHZhciBpc1NpbGVudCA9IHRoaXMuc2lsZW5jZSB8fCBhc3QubGVhZGVyID09PSBcIiQhXCI7XHJcbiAgICAgIHZhciBpc2ZuICAgICA9IGFzdC5hcmdzICE9PSB1bmRlZmluZWQ7XHJcbiAgICAgIHZhciBjb250ZXh0ICA9IHRoaXMuY29udGV4dDtcclxuICAgICAgdmFyIHJldCAgICAgID0gY29udGV4dFthc3QuaWRdO1xyXG4gICAgICB2YXIgbG9jYWwgICAgPSB0aGlzLmdldExvY2FsKGFzdCk7XHJcblxyXG4gICAgICB2YXIgdGV4dCA9IFZlbG9jaXR5LkhlbHBlci5nZXRSZWZUZXh0KGFzdCk7XHJcblxyXG4gICAgICBpZiAodGV4dCBpbiBjb250ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIChhc3QucHJ1ZSAmJiBlc2NhcGUpID8gY29udmVydChjb250ZXh0W3RleHRdKSA6IGNvbnRleHRbdGV4dF07XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQgJiYgaXNmbikge1xyXG4gICAgICAgIHJldCA9IHRoaXMuZ2V0UHJvcE1ldGhvZChhc3QsIGNvbnRleHQsIGFzdCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChsb2NhbC5pc0xvY2FsZWQpIHJldCA9IGxvY2FsWyd2YWx1ZSddO1xyXG5cclxuICAgICAgaWYgKGFzdC5wYXRoKSB7XHJcblxyXG4gICAgICAgIHV0aWxzLnNvbWUoYXN0LnBhdGgsIGZ1bmN0aW9uKHByb3BlcnR5LCBpLCBsZW4pIHtcclxuXHJcbiAgICAgICAgICBpZiAocmV0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGhyb3coYXN0LCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8g56ys5LiJ5Liq5Y+C5pWw77yM6L+U5Zue5ZCO6Z2i55qE5Y+C5pWwYXN0XHJcbiAgICAgICAgICByZXQgPSB0aGlzLmdldEF0dHJpYnV0ZXMocHJvcGVydHksIHJldCwgYXN0KTtcclxuXHJcbiAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc1ZhbCAmJiByZXQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldCA9IGlzU2lsZW50ID8gJycgOiBWZWxvY2l0eS5IZWxwZXIuZ2V0UmVmVGV4dChhc3QpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXQgPSAoYXN0LnBydWUgJiYgZXNjYXBlKSA/IGNvbnZlcnQocmV0KSA6IHJldDtcclxuXHJcbiAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5bGA6YOo5Y+Y6YeP77yM5ZyobWFjcm/lkoxmb3JlYWNo5b6q546v5Lit5L2/55SoXHJcbiAgICAgKi9cclxuICAgIGdldExvY2FsOiBmdW5jdGlvbihhc3QpIHtcclxuXHJcbiAgICAgIHZhciBpZCA9IGFzdC5pZDtcclxuICAgICAgdmFyIGxvY2FsID0gdGhpcy5sb2NhbDtcclxuICAgICAgdmFyIHJldCA9IGZhbHNlO1xyXG5cclxuICAgICAgdmFyIGlzTG9jYWxlZCA9IHV0aWxzLnNvbWUodGhpcy5jb25kaXRpb25zLCBmdW5jdGlvbihjb250ZXh0SWQpIHtcclxuICAgICAgICB2YXIgX2xvY2FsID0gbG9jYWxbY29udGV4dElkXTtcclxuICAgICAgICBpZiAoaWQgaW4gX2xvY2FsKSB7XHJcbiAgICAgICAgICByZXQgPSBfbG9jYWxbaWRdO1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB2YWx1ZTogcmV0LFxyXG4gICAgICAgIGlzTG9jYWxlZDogaXNMb2NhbGVkXHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiAkZm9vLmJhciDlsZ7mgKfmsYLlgLzvvIzmnIDlkI7pnaLkuKTkuKrlj4LmlbDlnKjnlKjmiLfkvKDpgJLnmoTlh73mlbDkuK3nlKjliLBcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wZXJ0eSDlsZ7mgKfmj4/ov7DvvIzkuIDkuKrlr7nosaHvvIzkuLvopoHljIXmi6xpZO+8jHR5cGXnrYnlrprkuYlcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBiYXNlUmVmIOW9k+WJjeaJp+ihjOmTvue7k+aenO+8jOavlOWmgiRhLmIuY++8jOesrOS4gOasoWJhc2VSZWbmmK8kYSxcclxuICAgICAqIOesrOS6jOasoeaYryRhLmLov5Tlm57lgLxcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGdldEF0dHJpYnV0ZXM6IGZ1bmN0aW9uKHByb3BlcnR5LCBiYXNlUmVmLCBhc3QpIHtcclxuICAgICAgLy8gZml4ICM1NFxyXG4gICAgICBpZiAoYmFzZVJlZiA9PT0gbnVsbCB8fCBiYXNlUmVmID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogdHlwZeWvueW6lOedgHZlbG9jaXR5Lnl55Lit55qEYXR0cmlidXRl77yM5LiJ56eN57G75Z6LOiBtZXRob2QsIGluZGV4LCBwcm9wZXJ0eVxyXG4gICAgICAgKi9cclxuICAgICAgdmFyIHR5cGUgPSBwcm9wZXJ0eS50eXBlO1xyXG4gICAgICB2YXIgcmV0O1xyXG4gICAgICB2YXIgaWQgPSBwcm9wZXJ0eS5pZDtcclxuICAgICAgaWYgKHR5cGUgPT09ICdtZXRob2QnKSB7XHJcbiAgICAgICAgcmV0ID0gdGhpcy5nZXRQcm9wTWV0aG9kKHByb3BlcnR5LCBiYXNlUmVmLCBhc3QpO1xyXG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdwcm9wZXJ0eScpIHtcclxuICAgICAgICByZXQgPSBiYXNlUmVmW2lkXTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXQgPSB0aGlzLmdldFByb3BJbmRleChwcm9wZXJ0eSwgYmFzZVJlZik7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJldDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAkZm9vLmJhclsxXSBpbmRleOaxguWAvFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgZ2V0UHJvcEluZGV4OiBmdW5jdGlvbihwcm9wZXJ0eSwgYmFzZVJlZikge1xyXG4gICAgICB2YXIgYXN0ID0gcHJvcGVydHkuaWQ7XHJcbiAgICAgIHZhciBrZXk7XHJcbiAgICAgIGlmIChhc3QudHlwZSA9PT0gJ3JlZmVyZW5jZXMnKSB7XHJcbiAgICAgICAga2V5ID0gdGhpcy5nZXRSZWZlcmVuY2VzKGFzdCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoYXN0LnR5cGUgPT09ICdpbnRlZ2VyJykge1xyXG4gICAgICAgIGtleSA9IGFzdC52YWx1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBrZXkgPSBhc3QudmFsdWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBiYXNlUmVmW2tleV07XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogJGZvby5iYXIoKeaxguWAvFxyXG4gICAgICovXHJcbiAgICBnZXRQcm9wTWV0aG9kOiBmdW5jdGlvbihwcm9wZXJ0eSwgYmFzZVJlZiwgYXN0KSB7XHJcblxyXG4gICAgICB2YXIgaWQgPSBwcm9wZXJ0eS5pZDtcclxuICAgICAgdmFyIHJldCA9IGJhc2VSZWZbaWRdO1xyXG4gICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICB1dGlscy5mb3JFYWNoKHByb3BlcnR5LmFyZ3MsIGZ1bmN0aW9uKGV4cCkge1xyXG4gICAgICAgIGFyZ3MucHVzaCh0aGlzLmdldExpdGVyYWwoZXhwKSk7XHJcbiAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgY29uc3QgcGF5bG9hZCA9IHsgcHJvcGVydHk6IGlkLCBwYXJhbXM6IGFyZ3MsIGNvbnRleHQ6IGJhc2VSZWYgfTtcclxuICAgICAgdmFyIG1hdGNoZWQgPSB0aGlzLmN1c3RvbU1ldGhvZEhhbmRsZXJzLmZpbmQoZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBpdGVtICYmIGl0ZW0ubWF0Y2gocGF5bG9hZCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKG1hdGNoZWQpIHtcclxuICAgICAgICBkZWJ1ZygnbWF0Y2ggY3VzdG9tIG1ldGhvZCBoYW5kbGVyLCB1aWQgJXMnLCBtYXRjaGVkLnVpZCk7XHJcbiAgICAgICAgLy8gcnVuIGN1c3RvbSBtZXRob2QgaGFuZGxlciwgd2UgY2FuXHJcbiAgICAgICAgLy8gYWRkIHNvbWUgbmF0aXZlIG1ldGhvZCB3aGljaCBKYXZhIGNhbiBkbywgZm9yIGV4YW1wbGVcclxuICAgICAgICAvLyAjc2V0KCRmb28gPSBbMSwgMl0pICRmb28uc2l6ZSgpXHJcbiAgICAgICAgcmV0ID0gbWF0Y2hlZC5yZXNvbHZlKHBheWxvYWQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBpZiAocmV0ICYmIHJldC5jYWxsKSB7XHJcblxyXG4gICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICAgIGlmKHR5cGVvZiBiYXNlUmVmID09PSAnb2JqZWN0JyAmJiBiYXNlUmVmKXtcclxuICAgICAgICAgICAgYmFzZVJlZi5ldmFsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRoYXQuZXZhbC5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldCA9IHJldC5hcHBseShiYXNlUmVmLCBhcmdzKTtcclxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IGFzdC5wb3MgfHwgcG9zVW5rbm93bjtcclxuICAgICAgICAgICAgdmFyIHRleHQgPSBWZWxvY2l0eS5IZWxwZXIuZ2V0UmVmVGV4dChhc3QpO1xyXG4gICAgICAgICAgICB2YXIgZXJyID0gJyBvbiAnICsgdGV4dCArICcgYXQgTC9OICcgK1xyXG4gICAgICAgICAgICAgIHBvcy5maXJzdF9saW5lICsgJzonICsgcG9zLmZpcnN0X2NvbHVtbjtcclxuICAgICAgICAgICAgLy8gZS5uYW1lID0gJyc7XHJcbiAgICAgICAgICAgIGUubWVzc2FnZSArPSBlcnI7XHJcbiAgICAgICAgICAgIHRocm93IGU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLl90aHJvdyhhc3QsIHByb3BlcnR5LCAnVHlwZUVycm9yJyk7XHJcbiAgICAgICAgICByZXQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmV0O1xyXG4gICAgfSxcclxuXHJcbiAgICBfdGhyb3c6IGZ1bmN0aW9uKGFzdCwgcHJvcGVydHksIGVycm9yTmFtZSkge1xyXG4gICAgICBpZiAodGhpcy5jb25maWcuZW52ICE9PSAnZGV2ZWxvcG1lbnQnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgdGV4dCA9IFZlbG9jaXR5LkhlbHBlci5nZXRSZWZUZXh0KGFzdCk7XHJcbiAgICAgIHZhciBwb3MgPSBhc3QucG9zIHx8IHBvc1Vua25vd247XHJcbiAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eS50eXBlID09PSAnaW5kZXgnID8gcHJvcGVydHkuaWQudmFsdWUgOiBwcm9wZXJ0eS5pZDtcclxuICAgICAgdmFyIGVycm9yTXNnID0gJ2dldCBwcm9wZXJ0eSAnICsgcHJvcGVydHlOYW1lICsgJyBvZiB1bmRlZmluZWQnO1xyXG4gICAgICBpZiAoZXJyb3JOYW1lID09PSAnVHlwZUVycm9yJykge1xyXG4gICAgICAgIGVycm9yTXNnID0gcHJvcGVydHlOYW1lICsgJyBpcyBub3QgbWV0aG9kJztcclxuICAgICAgfVxyXG5cclxuICAgICAgZXJyb3JNc2cgKz0gJ1xcbiAgYXQgTC9OICcgKyB0ZXh0ICsgJyAnICsgcG9zLmZpcnN0X2xpbmUgKyAnOicgKyBwb3MuZmlyc3RfY29sdW1uO1xyXG4gICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvck1zZyk7XHJcbiAgICAgIGUubmFtZSA9IGVycm9yTmFtZSB8fCAnUmVmZXJlbmNlRXJyb3InO1xyXG4gICAgICB0aHJvdyBlO1xyXG4gICAgfVxyXG4gIH0pXHJcblxyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVmVsb2NpdHksIHV0aWxzKSB7XHJcbiAgLyoqXHJcbiAgICogI3NldCB2YWx1ZVxyXG4gICAqL1xyXG4gIHV0aWxzLm1peGluKFZlbG9jaXR5LnByb3RvdHlwZSwge1xyXG4gICAgLyoqXHJcbiAgICAgKiBnZXQgdmFyaWFibGUgZnJvbSBjb250ZXh0LCBpZiBydW4gaW4gYmxvY2ssIHJldHVybiBsb2NhbCBjb250ZXh0LCBlbHNlIHJldHVybiBnbG9iYWwgY29udGV4dFxyXG4gICAgICovXHJcbiAgICBnZXRDb250ZXh0OiBmdW5jdGlvbihpZE5hbWUpIHtcclxuICAgICAgdmFyIGxvY2FsID0gdGhpcy5sb2NhbDtcclxuICAgICAgLy8gY29udGV4dCBmaW5kLCBmcm9tIHRoZSBjb25kaXRpb25zIHN0YWNrIHRvcCB0byBlbmRcclxuICAgICAgZm9yICh2YXIgY29uZGl0aW9uIG9mIHRoaXMuY29uZGl0aW9ucykge1xyXG4gICAgICAgIGlmIChsb2NhbFtjb25kaXRpb25dLmhhc093blByb3BlcnR5KGlkTmFtZSkpIHtcclxuICAgICAgICAgIHJldHVybiBsb2NhbFtjb25kaXRpb25dO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvLyBub3QgZmluZCBsb2NhbCB2YXJpYWJsZSwgcmV0dXJuIGdsb2JhbCBjb250ZXh0XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbnRleHQ7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBwYXJzZSAjc2V0XHJcbiAgICAgKi9cclxuICAgIHNldFZhbHVlOiBmdW5jdGlvbihhc3QpIHtcclxuICAgICAgdmFyIHJlZiA9IGFzdC5lcXVhbFswXTtcclxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLmdldENvbnRleHQocmVmLmlkKTtcclxuXHJcbiAgICAgIC8vIEBzZWUgIzI1XHJcbiAgICAgIGlmICh0aGlzLmNvbmRpdGlvbiAmJiB0aGlzLmNvbmRpdGlvbi5pbmRleE9mKCdtYWNybzonKSA9PT0gMCkge1xyXG4gICAgICAgIGNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgLy8gZml4ICMxMjlcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHZhbEFzdCA9IGFzdC5lcXVhbFsxXTtcclxuICAgICAgdmFyIHZhbDtcclxuXHJcbiAgICAgIGlmICh2YWxBc3QudHlwZSA9PT0gJ21hdGgnKSB7XHJcbiAgICAgICAgdmFsID0gdGhpcy5nZXRFeHByZXNzaW9uKHZhbEFzdCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFsID0gdGhpcy5jb25maWcudmFsdWVNYXBwZXIodGhpcy5nZXRMaXRlcmFsKGFzdC5lcXVhbFsxXSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXJlZi5wYXRoKSB7XHJcblxyXG4gICAgICAgIGNvbnRleHRbcmVmLmlkXSA9IHZhbDtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIHZhciBiYXNlUmVmID0gY29udGV4dFtyZWYuaWRdO1xyXG4gICAgICAgIGlmICh0eXBlb2YgYmFzZVJlZiAhPSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgYmFzZVJlZiA9IHt9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29udGV4dFtyZWYuaWRdID0gYmFzZVJlZjtcclxuICAgICAgICB2YXIgbGVuID0gcmVmLnBhdGggPyByZWYucGF0aC5sZW5ndGg6IDA7XHJcblxyXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHV0aWxzLnNvbWUocmVmLnBhdGgsIGZ1bmN0aW9uKGV4cCwgaSkge1xyXG4gICAgICAgICAgdmFyIGlzRW5kID0gbGVuID09PSBpICsgMTtcclxuICAgICAgICAgIHZhciBrZXkgPSBleHAuaWQ7XHJcbiAgICAgICAgICBpZiAoZXhwLnR5cGUgPT09ICdpbmRleCcpICB7XHJcbiAgICAgICAgICAgIGlmIChleHAuaWQpIHtcclxuICAgICAgICAgICAgICBrZXkgPSBzZWxmLmdldExpdGVyYWwoZXhwLmlkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBrZXkgPSBrZXkudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoaXNFbmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGJhc2VSZWZba2V5XSA9IHZhbDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBiYXNlUmVmID0gYmFzZVJlZltrZXldO1xyXG5cclxuICAgICAgICAgIC8vIHN1Y2ggYXNcclxuICAgICAgICAgIC8vICNzZXQoJGEuZC5jMiA9IDIpXHJcbiAgICAgICAgICAvLyBidXQgJGEuZCBpcyB1bmRlZmluZWQgLCB2YWx1ZSBzZXQgZmFpbFxyXG4gICAgICAgICAgaWYgKGJhc2VSZWYgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxufTtcclxuIiwidmFyIEhlbHBlciA9IHt9O1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xyXG5yZXF1aXJlKCcuL3RleHQnKShIZWxwZXIsIHV0aWxzKTtcclxubW9kdWxlLmV4cG9ydHMgPSBIZWxwZXI7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oSGVscGVyLCB1dGlscyl7XHJcbiAgLyoqXHJcbiAgICog6I635Y+W5byV55So5paH5pys77yM5b2T5byV55So6Ieq6Lqr5LiN5a2Y5Zyo55qE5oOF5Ya15LiL77yM6ZyA6KaB6L+U5Zue5Y6f5p2l55qE5qih5p2/5a2X56ym5LiyXHJcbiAgICogZ2V0IHZhcmlhYmxlIHRleHRcclxuICAgKi9cclxuICBmdW5jdGlvbiBnZXRSZWZUZXh0KGFzdCl7XHJcblxyXG4gICAgdmFyIHJldCA9IGFzdC5sZWFkZXI7XHJcbiAgICB2YXIgaXNGbiA9IGFzdC5hcmdzICE9PSB1bmRlZmluZWQ7XHJcblxyXG4gICAgaWYgKGFzdC50eXBlID09PSAnbWFjcm9fY2FsbCcpIHtcclxuICAgICAgcmV0ID0gJyMnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhc3QuaXNXcmFwZWQpIHJldCArPSAneyc7XHJcblxyXG4gICAgaWYgKGlzRm4pIHtcclxuICAgICAgcmV0ICs9IGdldE1ldGhvZFRleHQoYXN0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldCArPSBhc3QuaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgdXRpbHMuZm9yRWFjaChhc3QucGF0aCwgZnVuY3Rpb24ocmVmKXtcclxuICAgICAgaWYgKHJlZi50eXBlID09ICdtZXRob2QnKSB7XHJcbiAgICAgICAgcmV0ICs9ICcuJyArIGdldE1ldGhvZFRleHQocmVmKTtcclxuICAgICAgfSBlbHNlIGlmIChyZWYudHlwZSA9PSAnaW5kZXgnKSB7XHJcblxyXG4gICAgICAgIHZhciB0ZXh0ID0gJyc7XHJcbiAgICAgICAgdmFyIGlkID0gcmVmLmlkO1xyXG5cclxuICAgICAgICBpZiAoaWQudHlwZSA9PT0gJ2ludGVnZXInKSB7XHJcblxyXG4gICAgICAgICAgdGV4dCA9IGlkLnZhbHVlO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKGlkLnR5cGUgPT09ICdzdHJpbmcnKSB7XHJcblxyXG4gICAgICAgICAgdmFyIHNpZ24gPSBpZC5pc0V2YWw/ICdcIic6IFwiJ1wiO1xyXG4gICAgICAgICAgdGV4dCA9IHNpZ24gKyBpZC52YWx1ZSArIHNpZ247XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgdGV4dCA9IGdldFJlZlRleHQoaWQpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldCArPSAnWycgKyB0ZXh0ICsgJ10nO1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChyZWYudHlwZSA9PSAncHJvcGVydHknKSB7XHJcblxyXG4gICAgICAgIHJldCArPSAnLicgKyByZWYuaWQ7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgfSwgdGhpcyk7XHJcblxyXG4gICAgaWYgKGFzdC5pc1dyYXBlZCkgcmV0ICs9ICd9JztcclxuXHJcbiAgICByZXR1cm4gcmV0O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0TWV0aG9kVGV4dChyZWYpIHtcclxuXHJcbiAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgdmFyIHJldCA9ICcnO1xyXG5cclxuICAgIHV0aWxzLmZvckVhY2gocmVmLmFyZ3MsIGZ1bmN0aW9uKGFyZyl7XHJcbiAgICAgIGFyZ3MucHVzaChnZXRMaXRlcmFsKGFyZykpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0ICs9IHJlZi5pZCArICcoJyArIGFyZ3Muam9pbignLCcpICsgJyknO1xyXG5cclxuICAgIHJldHVybiByZXQ7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0TGl0ZXJhbChhc3Qpe1xyXG5cclxuICAgIHZhciByZXQgPSAnJztcclxuXHJcbiAgICBzd2l0Y2goYXN0LnR5cGUpIHtcclxuXHJcbiAgICAgIGNhc2UgJ3N0cmluZyc6IHtcclxuICAgICAgICB2YXIgc2lnbiA9IGFzdC5pc0V2YWw/ICdcIic6IFwiJ1wiO1xyXG4gICAgICAgIHJldCA9IHNpZ24gKyBhc3QudmFsdWUgKyBzaWduO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjYXNlICdpbnRlZ2VyJzpcclxuICAgICAgY2FzZSAncnVudCc6XHJcbiAgICAgIGNhc2UgJ2Jvb2wnICAgOiB7XHJcbiAgICAgICAgcmV0ID0gYXN0LnZhbHVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjYXNlICdhcnJheSc6IHtcclxuICAgICAgICByZXQgPSAnWyc7XHJcbiAgICAgICAgdmFyIGxlbiA9IGFzdC52YWx1ZS5sZW5ndGggLSAxO1xyXG4gICAgICAgIHV0aWxzLmZvckVhY2goYXN0LnZhbHVlLCBmdW5jdGlvbihhcmcsIGkpe1xyXG4gICAgICAgICAgcmV0ICs9IGdldExpdGVyYWwoYXJnKTtcclxuICAgICAgICAgIGlmIChpICE9PSBsZW4pIHJldCArPSAnLCAnO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldCArPSAnXSc7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0ID0gZ2V0UmVmVGV4dChhc3QpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJldDtcclxuICB9XHJcblxyXG4gIEhlbHBlci5nZXRSZWZUZXh0ID0gZ2V0UmVmVGV4dDtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgUGFyc2VyICA9IHJlcXVpcmUoJy4vcGFyc2UvaW5kZXgnKTtcclxudmFyIF9wYXJzZSA9IFBhcnNlci5wYXJzZTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG5cclxudmFyIGJsb2NrVHlwZXMgPSB7XHJcbiAgaWY6IHRydWUsXHJcbiAgZm9yZWFjaDogdHJ1ZSxcclxuICBtYWNybzogdHJ1ZSxcclxuICBub2VzY2FwZTogdHJ1ZSxcclxuICBkZWZpbmU6IHRydWUsXHJcbiAgbWFjcm9fYm9keTogdHJ1ZSxcclxufTtcclxuXHJcbnZhciBjdXN0b21CbG9ja3MgPSBbXTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIHN0cmluZyB0byBwYXJzZVxyXG4gKiBAcGFyYW0ge29iamVjdH0gYmxvY2tzIHNlbGYgZGVmaW5lIGJsb2Nrcywgc3VjaCBhcyBgI2NtcygxKSBoZWxsbyAjZW5kYFxyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlnbm9yZVNwYWNlIGlmIHNldCB0cnVlLCB0aGVuIGlnbm9yZSB0aGUgbmV3bGluZSB0cmltLlxyXG4gKiBAcmV0dXJuIHthcnJheX0gYXN0IGFycmF5XHJcbiAqL1xyXG52YXIgcGFyc2UgPSBmdW5jdGlvbihzdHIsIGJsb2NrcywgaWdub3JlU3BhY2UpIHtcclxuICB2YXIgYXN0cyA9IF9wYXJzZShzdHIpO1xyXG4gIGN1c3RvbUJsb2NrcyA9IGJsb2NrcyB8fCB7fTtcclxuXHJcbiAgLyoqXHJcbiAgICogcmVtb3ZlIGFsbCBuZXdsaW5lIGFmdGVyIGFsbCBkaXJlY3Rpb24gc3VjaCBhcyBgI3NldCwgI2VhY2hgXHJcbiAgICovXHJcbiAgaWdub3JlU3BhY2UgfHwgdXRpbHMuZm9yRWFjaChhc3RzLCBmdW5jdGlvbiB0cmltKGFzdCwgaSkge1xyXG4gICAgdmFyIFRSSU1fUkVHID0gL15bIFxcdF0qXFxuLztcclxuICAgIC8vIGFmdGVyIHJhdyBhbmQgcmVmZXJlbmNlcywgdGhlbiBrZWVwIHRoZSBuZXdsaW5lLlxyXG4gICAgaWYgKGFzdC50eXBlICYmIFsncmVmZXJlbmNlcycsICdyYXcnXS5pbmRleE9mKGFzdC50eXBlKSA9PT0gLTEpIHtcclxuICAgICAgdmFyIF9hc3QgPSBhc3RzW2kgKyAxXTtcclxuICAgICAgaWYgKHR5cGVvZiBfYXN0ID09PSAnc3RyaW5nJyAmJiBUUklNX1JFRy50ZXN0KF9hc3QpKSB7XHJcbiAgICAgICAgYXN0c1tpICsgMV0gPSBfYXN0LnJlcGxhY2UoVFJJTV9SRUcsICcnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICB2YXIgcmV0ID0gbWFrZUxldmVsKGFzdHMpO1xyXG5cclxuICByZXR1cm4gdXRpbHMuaXNBcnJheShyZXQpID8gcmV0IDogcmV0LmFycjtcclxufTtcclxuXHJcbmZ1bmN0aW9uIG1ha2VMZXZlbChibG9jaywgaW5kZXgpIHtcclxuXHJcbiAgdmFyIGxlbiA9IGJsb2NrLmxlbmd0aDtcclxuICBpbmRleCA9IGluZGV4IHx8IDA7XHJcbiAgdmFyIHJldCA9IFtdO1xyXG4gIHZhciBpZ25vcmUgPSBpbmRleCAtIDE7XHJcblxyXG4gIGZvciAodmFyIGkgPSBpbmRleDsgaSA8IGxlbjsgaSsrKSB7XHJcblxyXG4gICAgaWYgKGkgPD0gaWdub3JlKSBjb250aW51ZTtcclxuXHJcbiAgICB2YXIgYXN0ID0gYmxvY2tbaV07XHJcbiAgICB2YXIgdHlwZSA9IGFzdC50eXBlO1xyXG5cclxuICAgIHZhciBpc0Jsb2NrVHlwZSA9IGJsb2NrVHlwZXNbdHlwZV07XHJcblxyXG4gICAgLy8gc3VwcG9ydCBjdXN0b20gYmxvY2sgLCBmb3IgZXhhbXBsZVxyXG4gICAgLy8gY29uc3Qgdm0gPSAnI2NtcygxKTxkaXYgY2xhc3M9XCJhYnMtcmlnaHRcIj4gI0goMSxcIuesrOS4gOS4qumTvuaOpVwiKSA8L2Rpdj4gI2VuZCdcclxuICAgIC8vIHBhcnNlKHZtLCB7IGNtczogdHJ1ZSB9KTtcclxuICAgIGlmICghaXNCbG9ja1R5cGUgJiYgYXN0LnR5cGUgPT09ICdtYWNyb19jYWxsJyAmJiBjdXN0b21CbG9ja3NbYXN0LmlkXSkge1xyXG4gICAgICBpc0Jsb2NrVHlwZSA9IHRydWU7XHJcbiAgICAgIGFzdC50eXBlID0gYXN0LmlkO1xyXG4gICAgICBkZWxldGUgYXN0LmlkO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghaXNCbG9ja1R5cGUgJiYgdHlwZSAhPT0gJ2VuZCcpIHtcclxuXHJcbiAgICAgIHJldC5wdXNoKGFzdCk7XHJcblxyXG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnZW5kJykge1xyXG5cclxuICAgICAgcmV0dXJuIHthcnI6IHJldCwgc3RlcDogaX07XHJcblxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIHZhciBfcmV0ID0gbWFrZUxldmVsKGJsb2NrLCBpICsgMSk7XHJcbiAgICAgIGlnbm9yZSA9IF9yZXQuc3RlcDtcclxuICAgICAgX3JldC5hcnIudW5zaGlmdChibG9ja1tpXSk7XHJcbiAgICAgIHJldC5wdXNoKF9yZXQuYXJyKTtcclxuXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJldDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZTtcclxuIiwiLyogcGFyc2VyIGdlbmVyYXRlZCBieSBqaXNvbiAwLjQuMTggKi9cclxuLypcclxuICBSZXR1cm5zIGEgUGFyc2VyIG9iamVjdCBvZiB0aGUgZm9sbG93aW5nIHN0cnVjdHVyZTpcclxuXHJcbiAgUGFyc2VyOiB7XHJcbiAgICB5eToge31cclxuICB9XHJcblxyXG4gIFBhcnNlci5wcm90b3R5cGU6IHtcclxuICAgIHl5OiB7fSxcclxuICAgIHRyYWNlOiBmdW5jdGlvbigpLFxyXG4gICAgc3ltYm9sc186IHthc3NvY2lhdGl2ZSBsaXN0OiBuYW1lID09PiBudW1iZXJ9LFxyXG4gICAgdGVybWluYWxzXzoge2Fzc29jaWF0aXZlIGxpc3Q6IG51bWJlciA9PT4gbmFtZX0sXHJcbiAgICBwcm9kdWN0aW9uc186IFsuLi5dLFxyXG4gICAgcGVyZm9ybUFjdGlvbjogZnVuY3Rpb24gYW5vbnltb3VzKHl5dGV4dCwgeXlsZW5nLCB5eWxpbmVubywgeXksIHl5c3RhdGUsICQkLCBfJCksXHJcbiAgICB0YWJsZTogWy4uLl0sXHJcbiAgICBkZWZhdWx0QWN0aW9uczogey4uLn0sXHJcbiAgICBwYXJzZUVycm9yOiBmdW5jdGlvbihzdHIsIGhhc2gpLFxyXG4gICAgcGFyc2U6IGZ1bmN0aW9uKGlucHV0KSxcclxuXHJcbiAgICBsZXhlcjoge1xyXG4gICAgICAgIEVPRjogMSxcclxuICAgICAgICBwYXJzZUVycm9yOiBmdW5jdGlvbihzdHIsIGhhc2gpLFxyXG4gICAgICAgIHNldElucHV0OiBmdW5jdGlvbihpbnB1dCksXHJcbiAgICAgICAgaW5wdXQ6IGZ1bmN0aW9uKCksXHJcbiAgICAgICAgdW5wdXQ6IGZ1bmN0aW9uKHN0ciksXHJcbiAgICAgICAgbW9yZTogZnVuY3Rpb24oKSxcclxuICAgICAgICBsZXNzOiBmdW5jdGlvbihuKSxcclxuICAgICAgICBwYXN0SW5wdXQ6IGZ1bmN0aW9uKCksXHJcbiAgICAgICAgdXBjb21pbmdJbnB1dDogZnVuY3Rpb24oKSxcclxuICAgICAgICBzaG93UG9zaXRpb246IGZ1bmN0aW9uKCksXHJcbiAgICAgICAgdGVzdF9tYXRjaDogZnVuY3Rpb24ocmVnZXhfbWF0Y2hfYXJyYXksIHJ1bGVfaW5kZXgpLFxyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uKCksXHJcbiAgICAgICAgbGV4OiBmdW5jdGlvbigpLFxyXG4gICAgICAgIGJlZ2luOiBmdW5jdGlvbihjb25kaXRpb24pLFxyXG4gICAgICAgIHBvcFN0YXRlOiBmdW5jdGlvbigpLFxyXG4gICAgICAgIF9jdXJyZW50UnVsZXM6IGZ1bmN0aW9uKCksXHJcbiAgICAgICAgdG9wU3RhdGU6IGZ1bmN0aW9uKCksXHJcbiAgICAgICAgcHVzaFN0YXRlOiBmdW5jdGlvbihjb25kaXRpb24pLFxyXG5cclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgIHJhbmdlczogYm9vbGVhbiAgICAgICAgICAgKG9wdGlvbmFsOiB0cnVlID09PiB0b2tlbiBsb2NhdGlvbiBpbmZvIHdpbGwgaW5jbHVkZSBhIC5yYW5nZVtdIG1lbWJlcilcclxuICAgICAgICAgICAgZmxleDogYm9vbGVhbiAgICAgICAgICAgICAob3B0aW9uYWw6IHRydWUgPT0+IGZsZXgtbGlrZSBsZXhpbmcgYmVoYXZpb3VyIHdoZXJlIHRoZSBydWxlcyBhcmUgdGVzdGVkIGV4aGF1c3RpdmVseSB0byBmaW5kIHRoZSBsb25nZXN0IG1hdGNoKVxyXG4gICAgICAgICAgICBiYWNrdHJhY2tfbGV4ZXI6IGJvb2xlYW4gIChvcHRpb25hbDogdHJ1ZSA9PT4gbGV4ZXIgcmVnZXhlcyBhcmUgdGVzdGVkIGluIG9yZGVyIGFuZCBmb3IgZWFjaCBtYXRjaGluZyByZWdleCB0aGUgYWN0aW9uIGNvZGUgaXMgaW52b2tlZDsgdGhlIGxleGVyIHRlcm1pbmF0ZXMgdGhlIHNjYW4gd2hlbiBhIHRva2VuIGlzIHJldHVybmVkIGJ5IHRoZSBhY3Rpb24gY29kZSlcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBwZXJmb3JtQWN0aW9uOiBmdW5jdGlvbih5eSwgeXlfLCAkYXZvaWRpbmdfbmFtZV9jb2xsaXNpb25zLCBZWV9TVEFSVCksXHJcbiAgICAgICAgcnVsZXM6IFsuLi5dLFxyXG4gICAgICAgIGNvbmRpdGlvbnM6IHthc3NvY2lhdGl2ZSBsaXN0OiBuYW1lID09PiBzZXR9LFxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIHRva2VuIGxvY2F0aW9uIGluZm8gKEAkLCBfJCwgZXRjLik6IHtcclxuICAgIGZpcnN0X2xpbmU6IG4sXHJcbiAgICBsYXN0X2xpbmU6IG4sXHJcbiAgICBmaXJzdF9jb2x1bW46IG4sXHJcbiAgICBsYXN0X2NvbHVtbjogbixcclxuICAgIHJhbmdlOiBbc3RhcnRfbnVtYmVyLCBlbmRfbnVtYmVyXSAgICAgICAod2hlcmUgdGhlIG51bWJlcnMgYXJlIGluZGV4ZXMgaW50byB0aGUgaW5wdXQgc3RyaW5nLCByZWd1bGFyIHplcm8tYmFzZWQpXHJcbiAgfVxyXG5cclxuXHJcbiAgdGhlIHBhcnNlRXJyb3IgZnVuY3Rpb24gcmVjZWl2ZXMgYSAnaGFzaCcgb2JqZWN0IHdpdGggdGhlc2UgbWVtYmVycyBmb3IgbGV4ZXIgYW5kIHBhcnNlciBlcnJvcnM6IHtcclxuICAgIHRleHQ6ICAgICAgICAobWF0Y2hlZCB0ZXh0KVxyXG4gICAgdG9rZW46ICAgICAgICh0aGUgcHJvZHVjZWQgdGVybWluYWwgdG9rZW4sIGlmIGFueSlcclxuICAgIGxpbmU6ICAgICAgICAoeXlsaW5lbm8pXHJcbiAgfVxyXG4gIHdoaWxlIHBhcnNlciAoZ3JhbW1hcikgZXJyb3JzIHdpbGwgYWxzbyBwcm92aWRlIHRoZXNlIG1lbWJlcnMsIGkuZS4gcGFyc2VyIGVycm9ycyBkZWxpdmVyIGEgc3VwZXJzZXQgb2YgYXR0cmlidXRlczoge1xyXG4gICAgbG9jOiAgICAgICAgICh5eWxsb2MpXHJcbiAgICBleHBlY3RlZDogICAgKHN0cmluZyBkZXNjcmliaW5nIHRoZSBzZXQgb2YgZXhwZWN0ZWQgdG9rZW5zKVxyXG4gICAgcmVjb3ZlcmFibGU6IChib29sZWFuOiBUUlVFIHdoZW4gdGhlIHBhcnNlciBoYXMgYSBlcnJvciByZWNvdmVyeSBydWxlIGF2YWlsYWJsZSBmb3IgdGhpcyBwYXJ0aWN1bGFyIGVycm9yKVxyXG4gIH1cclxuKi9cclxudmFyIHZlbG9jaXR5ID0gKGZ1bmN0aW9uKCl7XHJcbnZhciBvPWZ1bmN0aW9uKGssdixvLGwpe2ZvcihvPW98fHt9LGw9ay5sZW5ndGg7bC0tO29ba1tsXV09dik7cmV0dXJuIG99LCRWMD1bMSw4XSwkVjE9WzEsOV0sJFYyPVsxLDE5XSwkVjM9WzEsMTBdLCRWND1bMSwyNF0sJFY1PVsxLDI1XSwkVjY9WzEsMjNdLCRWNz1bNCwxMCwxMSwyMCwzNSwzNiw0Niw4M10sJFY4PVsxLDI5XSwkVjk9WzEsMzRdLCRWYT1bMSwzMF0sJFZiPVsxLDMzXSwkVmM9WzQsMTAsMTEsMjAsMjMsMzUsMzYsMzksNDYsNDksNTAsNTEsNTQsNTUsNTYsNTcsNTgsNTksNjAsNjEsNjIsNjMsNjQsNjUsNjYsODMsODUsOTRdLCRWZD1bMSw1MV0sJFZlPVsxLDU2XSwkVmY9WzEsNTddLCRWZz1bMSw3NF0sJFZoPVsxLDczXSwkVmk9WzEsODZdLCRWaj1bMSw4MV0sJFZrPVsxLDg5XSwkVmw9WzEsOTddLCRWbT1bMSw5Ml0sJFZuPVsxLDg3XSwkVm89WzEsOTZdLCRWcD1bMSw5M10sJFZxPVsxLDk0XSwkVnI9WzQsMTAsMTEsMjAsMjMsMzUsMzYsMzksNDYsNDksNTAsNTEsNTQsNTUsNTYsNTcsNTgsNTksNjAsNjEsNjIsNjMsNjQsNjUsNjYsNzYsODEsODMsODQsODUsOTRdLCRWcz1bMSwxMDldLCRWdD1bMSwxMjNdLCRWdT1bMSwxMTldLCRWdj1bMSwxMjBdLCRWdz1bMSwxMzNdLCRWeD1bMjMsNTAsODVdLCRWeT1bMiw5OF0sJFZ6PVsyMywzOSw0OSw1MCw4NV0sJFZBPVsyMywzOSw0OSw1MCw1NCw1NSw1Niw1Nyw1OCw1OSw2MCw2MSw2Miw2Myw2NCw2NSw2Niw4Myw4NV0sJFZCPVsyMywzOSw0OSw1MCw1NCw1NSw1Niw1Nyw1OCw1OSw2MCw2MSw2Miw2Myw2NCw2NSw2Niw4Myw4NSw5Nl0sJFZDPVsyLDExMV0sJFZEPVsyMywzOSw0OSw1MCw1NCw1NSw1Niw1Nyw1OCw1OSw2MCw2MSw2Miw2Myw2NCw2NSw2Niw4Myw4NSw5NF0sJFZFPVsyLDExNF0sJFZGPVsxLDE0Ml0sJFZHPVsxLDE0OF0sJFZIPVsyMyw0OSw1MF0sJFZJPVsxLDE1M10sJFZKPVsxLDE1NF0sJFZLPVsxLDE1NV0sJFZMPVsxLDE1Nl0sJFZNPVsxLDE1N10sJFZOPVsxLDE1OF0sJFZPPVsxLDE1OV0sJFZQPVsxLDE2MF0sJFZRPVsxLDE2MV0sJFZSPVsxLDE2Ml0sJFZTPVsxLDE2M10sJFZUPVsxLDE2NF0sJFZVPVsxLDE2NV0sJFZWPVsyMyw1NCw1NSw1Niw1Nyw1OCw1OSw2MCw2MSw2Miw2Myw2NCw2NSw2Nl0sJFZXPVs1MCw4NV0sJFZYPVsyLDExNV0sJFZZPVsyMywzNV0sJFZaPVsxLDIxNV0sJFZfPVsxLDIxNF0sJFYkPVszOSw1MF0sJFYwMT1bMjMsNTQsNTVdLCRWMTE9WzIzLDU0LDU1LDU2LDU3LDYxLDYyLDYzLDY0LDY1LDY2XSwkVjIxPVsyMyw1NCw1NSw2MSw2Miw2Myw2NCw2NSw2Nl07XHJcbnZhciBwYXJzZXIgPSB7dHJhY2U6IGZ1bmN0aW9uIHRyYWNlICgpIHsgfSxcclxueXk6IHt9LFxyXG5zeW1ib2xzXzoge1wiZXJyb3JcIjoyLFwicm9vdFwiOjMsXCJFT0ZcIjo0LFwic3RhdGVtZW50c1wiOjUsXCJzdGF0ZW1lbnRcIjo2LFwicmVmZXJlbmNlc1wiOjcsXCJkaXJlY3RpdmVzXCI6OCxcImNvbnRlbnRcIjo5LFwiUkFXXCI6MTAsXCJDT01NRU5UXCI6MTEsXCJzZXRcIjoxMixcImlmXCI6MTMsXCJlbHNlaWZcIjoxNCxcImVsc2VcIjoxNSxcImVuZFwiOjE2LFwiZm9yZWFjaFwiOjE3LFwiYnJlYWtcIjoxOCxcImRlZmluZVwiOjE5LFwiSEFTSFwiOjIwLFwiTk9FU0NBUEVcIjoyMSxcIlBBUkVOVEhFU0lTXCI6MjIsXCJDTE9TRV9QQVJFTlRIRVNJU1wiOjIzLFwibWFjcm9cIjoyNCxcIm1hY3JvX2NhbGxcIjoyNSxcIm1hY3JvX2JvZHlcIjoyNixcIlNFVFwiOjI3LFwiZXF1YWxcIjoyOCxcIklGXCI6MjksXCJleHByZXNzaW9uXCI6MzAsXCJFTFNFSUZcIjozMSxcIkVMU0VcIjozMixcIkVORFwiOjMzLFwiRk9SRUFDSFwiOjM0LFwiRE9MTEFSXCI6MzUsXCJJRFwiOjM2LFwiSU5cIjozNyxcIk1BUF9CRUdJTlwiOjM4LFwiTUFQX0VORFwiOjM5LFwiYXJyYXlcIjo0MCxcIkJSRUFLXCI6NDEsXCJERUZJTkVcIjo0MixcIk1BQ1JPXCI6NDMsXCJtYWNyb19hcmdzXCI6NDQsXCJtYWNyb19jYWxsX2FyZ3NfYWxsXCI6NDUsXCJNQUNST19CT0RZXCI6NDYsXCJtYWNyb19jYWxsX2FyZ3NcIjo0NyxcImxpdGVyYWxzXCI6NDgsXCJTUEFDRVwiOjQ5LFwiQ09NTUFcIjo1MCxcIkVRVUFMXCI6NTEsXCJtYXBcIjo1MixcIm1hdGhcIjo1MyxcInx8XCI6NTQsXCImJlwiOjU1LFwiK1wiOjU2LFwiLVwiOjU3LFwiKlwiOjU4LFwiL1wiOjU5LFwiJVwiOjYwLFwiPlwiOjYxLFwiPFwiOjYyLFwiPT1cIjo2MyxcIj49XCI6NjQsXCI8PVwiOjY1LFwiIT1cIjo2NixcInBhcmVudGhlc2lzXCI6NjcsXCIhXCI6NjgsXCJsaXRlcmFsXCI6NjksXCJicmFjZV9iZWdpblwiOjcwLFwiYXR0cmlidXRlc1wiOjcxLFwiYnJhY2VfZW5kXCI6NzIsXCJCT09MXCI6NzMsXCJtZXRob2RiZFwiOjc0LFwiVkFSX0JFR0lOXCI6NzUsXCJWQVJfRU5EXCI6NzYsXCJhdHRyaWJ1dGVcIjo3NyxcIm1ldGhvZFwiOjc4LFwiaW5kZXhcIjo3OSxcInByb3BlcnR5XCI6ODAsXCJET1RcIjo4MSxcInBhcmFtc1wiOjgyLFwiQ09OVEVOVFwiOjgzLFwiQlJBQ0tFVFwiOjg0LFwiQ0xPU0VfQlJBQ0tFVFwiOjg1LFwic3RyaW5nXCI6ODYsXCJudW1iZXJcIjo4NyxcImludGVnZXJcIjo4OCxcIklOVEVHRVJcIjo4OSxcIkRFQ0lNQUxfUE9JTlRcIjo5MCxcIlNUUklOR1wiOjkxLFwiRVZBTF9TVFJJTkdcIjo5MixcInJhbmdlXCI6OTMsXCJSQU5HRVwiOjk0LFwibWFwX2l0ZW1cIjo5NSxcIk1BUF9TUExJVFwiOjk2LFwiJGFjY2VwdFwiOjAsXCIkZW5kXCI6MX0sXHJcbnRlcm1pbmFsc186IHsyOlwiZXJyb3JcIiw0OlwiRU9GXCIsMTA6XCJSQVdcIiwxMTpcIkNPTU1FTlRcIiwyMDpcIkhBU0hcIiwyMTpcIk5PRVNDQVBFXCIsMjI6XCJQQVJFTlRIRVNJU1wiLDIzOlwiQ0xPU0VfUEFSRU5USEVTSVNcIiwyNzpcIlNFVFwiLDI5OlwiSUZcIiwzMTpcIkVMU0VJRlwiLDMyOlwiRUxTRVwiLDMzOlwiRU5EXCIsMzQ6XCJGT1JFQUNIXCIsMzU6XCJET0xMQVJcIiwzNjpcIklEXCIsMzc6XCJJTlwiLDM4OlwiTUFQX0JFR0lOXCIsMzk6XCJNQVBfRU5EXCIsNDE6XCJCUkVBS1wiLDQyOlwiREVGSU5FXCIsNDM6XCJNQUNST1wiLDQ2OlwiTUFDUk9fQk9EWVwiLDQ5OlwiU1BBQ0VcIiw1MDpcIkNPTU1BXCIsNTE6XCJFUVVBTFwiLDU0OlwifHxcIiw1NTpcIiYmXCIsNTY6XCIrXCIsNTc6XCItXCIsNTg6XCIqXCIsNTk6XCIvXCIsNjA6XCIlXCIsNjE6XCI+XCIsNjI6XCI8XCIsNjM6XCI9PVwiLDY0OlwiPj1cIiw2NTpcIjw9XCIsNjY6XCIhPVwiLDY4OlwiIVwiLDczOlwiQk9PTFwiLDc1OlwiVkFSX0JFR0lOXCIsNzY6XCJWQVJfRU5EXCIsODE6XCJET1RcIiw4MzpcIkNPTlRFTlRcIiw4NDpcIkJSQUNLRVRcIiw4NTpcIkNMT1NFX0JSQUNLRVRcIiw4OTpcIklOVEVHRVJcIiw5MDpcIkRFQ0lNQUxfUE9JTlRcIiw5MTpcIlNUUklOR1wiLDkyOlwiRVZBTF9TVFJJTkdcIiw5NDpcIlJBTkdFXCIsOTY6XCJNQVBfU1BMSVRcIn0sXHJcbnByb2R1Y3Rpb25zXzogWzAsWzMsMV0sWzMsMl0sWzUsMV0sWzUsMl0sWzYsMV0sWzYsMV0sWzYsMV0sWzYsMV0sWzYsMV0sWzgsMV0sWzgsMV0sWzgsMV0sWzgsMV0sWzgsMV0sWzgsMV0sWzgsMV0sWzgsMV0sWzgsNF0sWzgsMV0sWzgsMV0sWzgsMV0sWzEyLDVdLFsxMyw1XSxbMTQsNV0sWzE1LDJdLFsxNiwyXSxbMTcsOF0sWzE3LDEwXSxbMTcsOF0sWzE3LDEwXSxbMTgsMl0sWzE5LDZdLFsyNCw2XSxbMjQsNV0sWzQ0LDFdLFs0NCwyXSxbMjUsNV0sWzI1LDRdLFsyNiw1XSxbMjYsNF0sWzQ3LDFdLFs0NywxXSxbNDcsM10sWzQ3LDNdLFs0NywzXSxbNDcsM10sWzQ1LDFdLFs0NSwyXSxbNDUsM10sWzQ1LDJdLFsyOCwzXSxbMzAsMV0sWzMwLDFdLFszMCwxXSxbNTMsM10sWzUzLDNdLFs1MywzXSxbNTMsM10sWzUzLDNdLFs1MywzXSxbNTMsM10sWzUzLDNdLFs1MywzXSxbNTMsM10sWzUzLDNdLFs1MywzXSxbNTMsM10sWzUzLDFdLFs1MywyXSxbNTMsMl0sWzUzLDFdLFs1MywxXSxbNjcsM10sWzcsNV0sWzcsM10sWzcsM10sWzcsMl0sWzcsNV0sWzcsM10sWzcsMl0sWzcsNF0sWzcsMl0sWzcsNF0sWzcwLDFdLFs3MCwxXSxbNzIsMV0sWzcyLDFdLFs3MSwxXSxbNzEsMl0sWzc3LDFdLFs3NywxXSxbNzcsMV0sWzc4LDJdLFs3NCw0XSxbNzQsM10sWzgyLDFdLFs4MiwxXSxbODIsMV0sWzgyLDNdLFs4MiwzXSxbODAsMl0sWzgwLDJdLFs3OSwzXSxbNzksM10sWzc5LDNdLFs3OSwyXSxbNzksMl0sWzY5LDFdLFs2OSwxXSxbNjksMV0sWzg3LDFdLFs4NywzXSxbODcsNF0sWzg4LDFdLFs4OCwyXSxbODYsMV0sWzg2LDFdLFs0OCwxXSxbNDgsMV0sWzQ4LDFdLFs0MCwzXSxbNDAsMV0sWzQwLDJdLFs5Myw1XSxbOTMsNV0sWzkzLDVdLFs5Myw1XSxbNTIsM10sWzUyLDJdLFs5NSwzXSxbOTUsM10sWzk1LDJdLFs5NSw1XSxbOTUsNV0sWzksMV0sWzksMV0sWzksMl0sWzksM10sWzksM10sWzksMl1dLFxyXG5wZXJmb3JtQWN0aW9uOiBmdW5jdGlvbiBhbm9ueW1vdXMoeXl0ZXh0LCB5eWxlbmcsIHl5bGluZW5vLCB5eSwgeXlzdGF0ZSAvKiBhY3Rpb25bMV0gKi8sICQkIC8qIHZzdGFjayAqLywgXyQgLyogbHN0YWNrICovKSB7XHJcbi8qIHRoaXMgPT0geXl2YWwgKi9cclxuXHJcbnZhciAkMCA9ICQkLmxlbmd0aCAtIDE7XHJcbnN3aXRjaCAoeXlzdGF0ZSkge1xyXG5jYXNlIDE6XHJcbiByZXR1cm4gW107IFxyXG5icmVhaztcclxuY2FzZSAyOlxyXG4gcmV0dXJuICQkWyQwLTFdOyBcclxuYnJlYWs7XHJcbmNhc2UgMzogY2FzZSAzNTogY2FzZSA0MTogY2FzZSA0MjogY2FzZSA4ODogY2FzZSA5NjogY2FzZSA5ODpcclxuIHRoaXMuJCA9IFskJFskMF1dOyBcclxuYnJlYWs7XHJcbmNhc2UgNDogY2FzZSAzNjogY2FzZSA4OTpcclxuIHRoaXMuJCA9IFtdLmNvbmNhdCgkJFskMC0xXSwgJCRbJDBdKTsgXHJcbmJyZWFrO1xyXG5jYXNlIDU6XHJcbiAkJFskMF1bJ3BydWUnXSA9IHRydWU7ICAkJFskMF0ucG9zID0gdGhpcy5fJDsgdGhpcy4kID0gJCRbJDBdOyBcclxuYnJlYWs7XHJcbmNhc2UgNjpcclxuICQkWyQwXS5wb3MgPSB0aGlzLl8kOyB0aGlzLiQgPSAkJFskMF07IFxyXG5icmVhaztcclxuY2FzZSA3OiBjYXNlIDEwOiBjYXNlIDExOiBjYXNlIDEyOiBjYXNlIDEzOiBjYXNlIDE0OiBjYXNlIDE1OiBjYXNlIDE2OiBjYXNlIDE3OiBjYXNlIDE5OiBjYXNlIDIwOiBjYXNlIDIxOiBjYXNlIDQ3OiBjYXNlIDQ4OiBjYXNlIDUyOiBjYXNlIDUzOiBjYXNlIDU0OiBjYXNlIDY4OiBjYXNlIDcxOiBjYXNlIDcyOiBjYXNlIDg0OiBjYXNlIDg1OiBjYXNlIDg2OiBjYXNlIDg3OiBjYXNlIDkzOiBjYXNlIDEwMTogY2FzZSAxMDg6IGNhc2UgMTA5OiBjYXNlIDExNDogY2FzZSAxMjA6IGNhc2UgMTIyOiBjYXNlIDEzNTogY2FzZSAxMzY6XHJcbiB0aGlzLiQgPSAkJFskMF07IFxyXG5icmVhaztcclxuY2FzZSA4OlxyXG4gdGhpcy4kID0ge3R5cGU6ICdyYXcnLCB2YWx1ZTogJCRbJDBdIH07IFxyXG5icmVhaztcclxuY2FzZSA5OlxyXG4gdGhpcy4kID0ge3R5cGU6ICdjb21tZW50JywgdmFsdWU6ICQkWyQwXSB9OyBcclxuYnJlYWs7XHJcbmNhc2UgMTg6XHJcbiB0aGlzLiQgPSB7IHR5cGU6ICdub2VzY2FwZScgfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDIyOlxyXG4gdGhpcy4kID0ge3R5cGU6ICdzZXQnLCBlcXVhbDogJCRbJDAtMV0gfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDIzOlxyXG4gdGhpcy4kID0ge3R5cGU6ICdpZicsIGNvbmRpdGlvbjogJCRbJDAtMV0gfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDI0OlxyXG4gdGhpcy4kID0ge3R5cGU6ICdlbHNlaWYnLCBjb25kaXRpb246ICQkWyQwLTFdIH07IFxyXG5icmVhaztcclxuY2FzZSAyNTpcclxuIHRoaXMuJCA9IHt0eXBlOiAnZWxzZScgfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDI2OlxyXG4gdGhpcy4kID0ge3R5cGU6ICdlbmQnIH07IFxyXG5icmVhaztcclxuY2FzZSAyNzogY2FzZSAyOTpcclxuIHRoaXMuJCA9IHt0eXBlOiAnZm9yZWFjaCcsIHRvOiAkJFskMC0zXSwgZnJvbTogJCRbJDAtMV0gfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDI4OiBjYXNlIDMwOlxyXG4gdGhpcy4kID0ge3R5cGU6ICdmb3JlYWNoJywgdG86ICQkWyQwLTRdLCBmcm9tOiAkJFskMC0xXSB9OyBcclxuYnJlYWs7XHJcbmNhc2UgMzE6XHJcbiB0aGlzLiQgPSB7dHlwZTogJCRbJDBdIH07IFxyXG5icmVhaztcclxuY2FzZSAzMjpcclxuIHRoaXMuJCA9IHt0eXBlOiAnZGVmaW5lJywgaWQ6ICQkWyQwLTFdIH07IFxyXG5icmVhaztcclxuY2FzZSAzMzpcclxuIHRoaXMuJCA9IHt0eXBlOiAnbWFjcm8nLCBpZDogJCRbJDAtMl0sIGFyZ3M6ICQkWyQwLTFdIH07IFxyXG5icmVhaztcclxuY2FzZSAzNDpcclxuIHRoaXMuJCA9IHt0eXBlOiAnbWFjcm8nLCBpZDogJCRbJDAtMV0gfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDM3OlxyXG4gdGhpcy4kID0geyB0eXBlOlwibWFjcm9fY2FsbFwiLCBpZDogJCRbJDAtM10ucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpLCBhcmdzOiAkJFskMC0xXSB9OyBcclxuYnJlYWs7XHJcbmNhc2UgMzg6XHJcbiB0aGlzLiQgPSB7IHR5cGU6XCJtYWNyb19jYWxsXCIsIGlkOiAkJFskMC0yXS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJykgfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDM5OlxyXG4gdGhpcy4kID0ge3R5cGU6ICdtYWNyb19ib2R5JywgaWQ6ICQkWyQwLTNdLCBhcmdzOiAkJFskMC0xXSB9OyBcclxuYnJlYWs7XHJcbmNhc2UgNDA6XHJcbiB0aGlzLiQgPSB7dHlwZTogJ21hY3JvX2JvZHknLCBpZDogJCRbJDAtMl0gfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDQzOiBjYXNlIDQ0OiBjYXNlIDQ1OiBjYXNlIDQ2OiBjYXNlIDk5OiBjYXNlIDEwMDpcclxuIHRoaXMuJCA9IFtdLmNvbmNhdCgkJFskMC0yXSwgJCRbJDBdKTsgXHJcbmJyZWFrO1xyXG5jYXNlIDQ5OiBjYXNlIDUwOiBjYXNlIDEwMzogY2FzZSAxMDQ6XHJcbiB0aGlzLiQgPSAkJFskMC0xXTsgXHJcbmJyZWFrO1xyXG5jYXNlIDUxOlxyXG4gdGhpcy4kID0gWyQkWyQwLTJdLCAkJFskMF1dOyBcclxuYnJlYWs7XHJcbmNhc2UgNTU6XHJcbiB0aGlzLiQgPSB7dHlwZTogJ21hdGgnLCBleHByZXNzaW9uOiBbJCRbJDAtMl0sICQkWyQwXV0sIG9wZXJhdG9yOiAnfHwnIH07IFxyXG5icmVhaztcclxuY2FzZSA1NjpcclxuIHRoaXMuJCA9IHt0eXBlOiAnbWF0aCcsIGV4cHJlc3Npb246IFskJFskMC0yXSwgJCRbJDBdXSwgb3BlcmF0b3I6ICcmJicgfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDU3OiBjYXNlIDU4OiBjYXNlIDU5OiBjYXNlIDYwOiBjYXNlIDYxOlxyXG4gdGhpcy4kID0ge3R5cGU6ICdtYXRoJywgZXhwcmVzc2lvbjogWyQkWyQwLTJdLCAkJFskMF1dLCBvcGVyYXRvcjogJCRbJDAtMV0gfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDYyOlxyXG4gdGhpcy4kID0ge3R5cGU6ICdtYXRoJywgZXhwcmVzc2lvbjogWyQkWyQwLTJdLCAkJFskMF1dLCBvcGVyYXRvcjogJz4nIH07IFxyXG5icmVhaztcclxuY2FzZSA2MzpcclxuIHRoaXMuJCA9IHt0eXBlOiAnbWF0aCcsIGV4cHJlc3Npb246IFskJFskMC0yXSwgJCRbJDBdXSwgb3BlcmF0b3I6ICc8JyB9OyBcclxuYnJlYWs7XHJcbmNhc2UgNjQ6XHJcbiB0aGlzLiQgPSB7dHlwZTogJ21hdGgnLCBleHByZXNzaW9uOiBbJCRbJDAtMl0sICQkWyQwXV0sIG9wZXJhdG9yOiAnPT0nIH07IFxyXG5icmVhaztcclxuY2FzZSA2NTpcclxuIHRoaXMuJCA9IHt0eXBlOiAnbWF0aCcsIGV4cHJlc3Npb246IFskJFskMC0yXSwgJCRbJDBdXSwgb3BlcmF0b3I6ICc+PScgfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDY2OlxyXG4gdGhpcy4kID0ge3R5cGU6ICdtYXRoJywgZXhwcmVzc2lvbjogWyQkWyQwLTJdLCAkJFskMF1dLCBvcGVyYXRvcjogJzw9JyB9OyBcclxuYnJlYWs7XHJcbmNhc2UgNjc6XHJcbiB0aGlzLiQgPSB7dHlwZTogJ21hdGgnLCBleHByZXNzaW9uOiBbJCRbJDAtMl0sICQkWyQwXV0sIG9wZXJhdG9yOiAnIT0nIH07IFxyXG5icmVhaztcclxuY2FzZSA2OTpcclxuIHRoaXMuJCA9IHt0eXBlOiAnbWF0aCcsIGV4cHJlc3Npb246IFskJFskMF1dLCBvcGVyYXRvcjogJ21pbnVzJyB9OyBcclxuYnJlYWs7XHJcbmNhc2UgNzA6XHJcbiB0aGlzLiQgPSB7dHlwZTogJ21hdGgnLCBleHByZXNzaW9uOiBbJCRbJDBdXSwgb3BlcmF0b3I6ICdub3QnIH07IFxyXG5icmVhaztcclxuY2FzZSA3MzpcclxuIHRoaXMuJCA9IHt0eXBlOiAnbWF0aCcsIGV4cHJlc3Npb246IFskJFskMC0xXV0sIG9wZXJhdG9yOiAncGFyZW50aGVzaXMnIH07IFxyXG5icmVhaztcclxuY2FzZSA3NDpcclxuIHRoaXMuJCA9IHt0eXBlOiBcInJlZmVyZW5jZXNcIiwgaWQ6ICQkWyQwLTJdLCBwYXRoOiAkJFskMC0xXSwgaXNXcmFwZWQ6IHRydWUsIGxlYWRlcjogJCRbJDAtNF0gfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDc1OiBjYXNlIDc2OlxyXG4gdGhpcy4kID0ge3R5cGU6IFwicmVmZXJlbmNlc1wiLCBpZDogJCRbJDAtMV0sIHBhdGg6ICQkWyQwXSwgbGVhZGVyOiAkJFskMC0yXSB9OyBcclxuYnJlYWs7XHJcbmNhc2UgNzc6IGNhc2UgODA6XHJcbiB0aGlzLiQgPSB7dHlwZTogXCJyZWZlcmVuY2VzXCIsIGlkOiAkJFskMF0sIGxlYWRlcjogJCRbJDAtMV0gfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDc4OlxyXG4gdGhpcy4kID0ge3R5cGU6IFwicmVmZXJlbmNlc1wiLCBpZDogJCRbJDAtMl0uaWQsIHBhdGg6ICQkWyQwLTFdLCBpc1dyYXBlZDogdHJ1ZSwgbGVhZGVyOiAkJFskMC00XSwgYXJnczogJCRbJDAtMl0uYXJncyB9OyBcclxuYnJlYWs7XHJcbmNhc2UgNzk6XHJcbiB0aGlzLiQgPSB7dHlwZTogXCJyZWZlcmVuY2VzXCIsIGlkOiAkJFskMC0xXS5pZCwgcGF0aDogJCRbJDBdLCBsZWFkZXI6ICQkWyQwLTJdLCBhcmdzOiAkJFskMC0xXS5hcmdzIH07IFxyXG5icmVhaztcclxuY2FzZSA4MTpcclxuIHRoaXMuJCA9IHt0eXBlOiBcInJlZmVyZW5jZXNcIiwgaWQ6ICQkWyQwLTFdLCBpc1dyYXBlZDogdHJ1ZSwgbGVhZGVyOiAkJFskMC0zXSB9OyBcclxuYnJlYWs7XHJcbmNhc2UgODI6XHJcbiB0aGlzLiQgPSB7dHlwZTogXCJyZWZlcmVuY2VzXCIsIGlkOiAkJFskMF0uaWQsIGxlYWRlcjogJCRbJDAtMV0sIGFyZ3M6ICQkWyQwXS5hcmdzIH07IFxyXG5icmVhaztcclxuY2FzZSA4MzpcclxuIHRoaXMuJCA9IHt0eXBlOiBcInJlZmVyZW5jZXNcIiwgaWQ6ICQkWyQwLTFdLmlkLCBpc1dyYXBlZDogdHJ1ZSwgYXJnczogJCRbJDAtMV0uYXJncywgbGVhZGVyOiAkJFskMC0zXSB9OyBcclxuYnJlYWs7XHJcbmNhc2UgOTA6XHJcbiB0aGlzLiQgPSB7dHlwZTpcIm1ldGhvZFwiLCBpZDogJCRbJDBdLmlkLCBhcmdzOiAkJFskMF0uYXJncyB9OyBcclxuYnJlYWs7XHJcbmNhc2UgOTE6XHJcbiB0aGlzLiQgPSB7dHlwZTogXCJpbmRleFwiLCBpZDogJCRbJDBdIH07IFxyXG5icmVhaztcclxuY2FzZSA5MjpcclxuIHRoaXMuJCA9IHt0eXBlOiBcInByb3BlcnR5XCIsIGlkOiAkJFskMF0gfTsgaWYgKCQkWyQwXS50eXBlID09PSAnY29udGVudCcpIHRoaXMuJCA9ICQkWyQwXTsgXHJcbmJyZWFrO1xyXG5jYXNlIDk0OlxyXG4gdGhpcy4kID0ge2lkOiAkJFskMC0zXSwgYXJnczogJCRbJDAtMV0gfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDk1OlxyXG4gdGhpcy4kID0ge2lkOiAkJFskMC0yXSwgYXJnczogZmFsc2UgfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDk3OlxyXG4gdGhpcy4kID0gWyB7IHR5cGU6ICdydW50JywgdmFsdWU6ICQkWyQwXSB9IF07IFxyXG5icmVhaztcclxuY2FzZSAxMDI6XHJcbiB0aGlzLiQgPSB7dHlwZTogJ2NvbnRlbnQnLCB2YWx1ZTogJCRbJDAtMV0gKyAkJFskMF0gfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDEwNTpcclxuIHRoaXMuJCA9IHt0eXBlOiBcImNvbnRlbnRcIiwgdmFsdWU6ICQkWyQwLTJdICsgJCRbJDAtMV0udmFsdWUgKyAkJFskMF0gfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDEwNjogY2FzZSAxMDc6XHJcbiB0aGlzLiQgPSB7dHlwZTogXCJjb250ZW50XCIsIHZhbHVlOiAkJFskMC0xXSArICQkWyQwXSB9OyBcclxuYnJlYWs7XHJcbmNhc2UgMTEwOlxyXG4gdGhpcy4kID0ge3R5cGU6ICdib29sJywgdmFsdWU6ICQkWyQwXSB9OyBcclxuYnJlYWs7XHJcbmNhc2UgMTExOlxyXG4gdGhpcy4kID0ge3R5cGU6IFwiaW50ZWdlclwiLCB2YWx1ZTogJCRbJDBdfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDExMjpcclxuIHRoaXMuJCA9IHt0eXBlOiBcImRlY2ltYWxcIiwgdmFsdWU6ICsgKCQkWyQwLTJdICsgJy4nICsgJCRbJDBdKSB9OyBcclxuYnJlYWs7XHJcbmNhc2UgMTEzOlxyXG4gdGhpcy4kID0ge3R5cGU6IFwiZGVjaW1hbFwiLCB2YWx1ZTogLSAoJCRbJDAtMl0gKyAnLicgKyAkJFskMF0pIH07IFxyXG5icmVhaztcclxuY2FzZSAxMTU6XHJcbiB0aGlzLiQgPSAtIHBhcnNlSW50KCQkWyQwXSwgMTApOyBcclxuYnJlYWs7XHJcbmNhc2UgMTE2OlxyXG4gdGhpcy4kID0ge3R5cGU6ICdzdHJpbmcnLCB2YWx1ZTogJCRbJDBdIH07IFxyXG5icmVhaztcclxuY2FzZSAxMTc6XHJcbiB0aGlzLiQgPSB7dHlwZTogJ3N0cmluZycsIHZhbHVlOiAkJFskMF0sIGlzRXZhbDogdHJ1ZSB9OyBcclxuYnJlYWs7XHJcbmNhc2UgMTE4OiBjYXNlIDExOTpcclxuIHRoaXMuJCA9ICQkWyQwXTtcclxuYnJlYWs7XHJcbmNhc2UgMTIxOlxyXG4gdGhpcy4kID0ge3R5cGU6ICdhcnJheScsIHZhbHVlOiAkJFskMC0xXSB9OyBcclxuYnJlYWs7XHJcbmNhc2UgMTIzOlxyXG4gdGhpcy4kID0ge3R5cGU6ICdhcnJheScsIHZhbHVlOiBbXSB9OyBcclxuYnJlYWs7XHJcbmNhc2UgMTI0OiBjYXNlIDEyNTogY2FzZSAxMjY6IGNhc2UgMTI3OlxyXG4gdGhpcy4kID0ge3R5cGU6ICdhcnJheScsIGlzUmFuZ2U6IHRydWUsIHZhbHVlOiBbJCRbJDAtM10sICQkWyQwLTFdXX07IFxyXG5icmVhaztcclxuY2FzZSAxMjg6XHJcbiB0aGlzLiQgPSB7dHlwZTogJ21hcCcsIHZhbHVlOiAkJFskMC0xXSB9OyBcclxuYnJlYWs7XHJcbmNhc2UgMTI5OlxyXG4gdGhpcy4kID0ge3R5cGU6ICdtYXAnfTsgXHJcbmJyZWFrO1xyXG5jYXNlIDEzMDogY2FzZSAxMzE6XHJcbiB0aGlzLiQgPSB7fTsgdGhpcy4kWyQkWyQwLTJdLnZhbHVlXSA9ICQkWyQwXTsgXHJcbmJyZWFrO1xyXG5jYXNlIDEzMjpcclxuIHRoaXMuJCA9IHt9OyB0aGlzLiRbJCRbJDAtMV0udmFsdWVdID0gJCRbJDAxXTsgXHJcbmJyZWFrO1xyXG5jYXNlIDEzMzogY2FzZSAxMzQ6XHJcbiB0aGlzLiQgPSAkJFskMC00XTsgdGhpcy4kWyQkWyQwLTJdLnZhbHVlXSA9ICQkWyQwXTsgXHJcbmJyZWFrO1xyXG5jYXNlIDEzNzogY2FzZSAxNDA6XHJcbiB0aGlzLiQgPSAkJFskMC0xXSArICQkWyQwXTsgXHJcbmJyZWFrO1xyXG5jYXNlIDEzODpcclxuIHRoaXMuJCA9ICQkWyQwLTJdICsgJCRbJDAtMV0gKyAkJFskMF07IFxyXG5icmVhaztcclxuY2FzZSAxMzk6XHJcbiB0aGlzLiQgPSAkJFskMC0yXSArICQkWyQwLTFdOyBcclxuYnJlYWs7XHJcbn1cclxufSxcclxudGFibGU6IFt7MzoxLDQ6WzEsMl0sNTozLDY6NCw3OjUsODo2LDk6NywxMDokVjAsMTE6JFYxLDEyOjExLDEzOjEyLDE0OjEzLDE1OjE0LDE2OjE1LDE3OjE2LDE4OjE3LDE5OjE4LDIwOiRWMiwyNDoyMCwyNToyMSwyNjoyMiwzNTokVjMsMzY6JFY0LDQ2OiRWNSw4MzokVjZ9LHsxOlszXX0sezE6WzIsMV19LHs0OlsxLDI2XSw2OjI3LDc6NSw4OjYsOTo3LDEwOiRWMCwxMTokVjEsMTI6MTEsMTM6MTIsMTQ6MTMsMTU6MTQsMTY6MTUsMTc6MTYsMTg6MTcsMTk6MTgsMjA6JFYyLDI0OjIwLDI1OjIxLDI2OjIyLDM1OiRWMywzNjokVjQsNDY6JFY1LDgzOiRWNn0sbygkVjcsWzIsM10pLG8oJFY3LFsyLDVdKSxvKCRWNyxbMiw2XSksbygkVjcsWzIsN10pLG8oJFY3LFsyLDhdKSxvKCRWNyxbMiw5XSksezM2OiRWOCwzODokVjksNzA6MjgsNzM6JFZhLDc0OjMxLDc1OiRWYiw4MzpbMSwzMl19LG8oJFY3LFsyLDEwXSksbygkVjcsWzIsMTFdKSxvKCRWNyxbMiwxMl0pLG8oJFY3LFsyLDEzXSksbygkVjcsWzIsMTRdKSxvKCRWNyxbMiwxNV0pLG8oJFY3LFsyLDE2XSksbygkVjcsWzIsMTddKSx7MjE6WzEsMzVdLDI3OlsxLDM4XSwyOTpbMSwzOV0sMzE6WzEsNDBdLDMyOlsxLDQxXSwzMzpbMSw0Ml0sMzQ6WzEsNDNdLDM2OlsxLDM3XSw0MTpbMSw0NF0sNDI6WzEsNDVdLDQzOlsxLDQ2XSw4MzpbMSwzNl19LG8oJFY3LFsyLDE5XSksbygkVjcsWzIsMjBdKSxvKCRWNyxbMiwyMV0pLG8oJFY3LFsyLDEzNV0pLG8oJFY3LFsyLDEzNl0pLHszNjpbMSw0N119LHsxOlsyLDJdfSxvKCRWNyxbMiw0XSksezM2OlsxLDQ4XSw3NDo0OX0sbygkVmMsWzIsODBdLHs3MTo1MCw3Nzo1Miw3ODo1Myw3OTo1NCw4MDo1NSwyMjokVmQsODE6JFZlLDg0OiRWZn0pLG8oJFZjLFsyLDc3XSx7Nzc6NTIsNzg6NTMsNzk6NTQsODA6NTUsNzE6NTgsODE6JFZlLDg0OiRWZn0pLG8oJFZjLFsyLDgyXSx7Nzc6NTIsNzg6NTMsNzk6NTQsODA6NTUsNzE6NTksODE6JFZlLDg0OiRWZn0pLG8oJFY3LFsyLDE0MF0pLHszNjpbMiw4NF19LHszNjpbMiw4NV19LHsyMjpbMSw2MF19LG8oJFY3LFsyLDEzN10pLHs0OlsxLDYyXSwyMjpbMSw2M10sODM6WzEsNjFdfSx7MjI6WzEsNjRdfSx7MjI6WzEsNjVdfSx7MjI6WzEsNjZdfSxvKCRWNyxbMiwyNV0pLG8oJFY3LFsyLDI2XSksezIyOlsxLDY3XX0sbygkVjcsWzIsMzFdKSx7MjI6WzEsNjhdfSx7MjI6WzEsNjldfSx7MjI6WzEsNzBdfSx7MjI6JFZkLDM5OiRWZyw3MTo3MSw3Mjo3Miw3NjokVmgsNzc6NTIsNzg6NTMsNzk6NTQsODA6NTUsODE6JFZlLDg0OiRWZn0sezM5OiRWZyw3MTo3NSw3Mjo3Niw3NjokVmgsNzc6NTIsNzg6NTMsNzk6NTQsODA6NTUsODE6JFZlLDg0OiRWZn0sbygkVmMsWzIsNzVdLHs3ODo1Myw3OTo1NCw4MDo1NSw3Nzo3Nyw4MTokVmUsODQ6JFZmfSksezc6ODIsMjM6WzEsNzldLDM1OiRWaSwzNjokVmosMzg6JFZrLDQwOjgzLDQ4OjgwLDUyOjg0LDU3OiRWbCw2OTo4NSw3MzokVm0sODI6NzgsODQ6JFZuLDg2OjkwLDg3OjkxLDg4Ojk1LDg5OiRWbyw5MTokVnAsOTI6JFZxLDkzOjg4fSxvKCRWcixbMiw4OF0pLG8oJFZyLFsyLDkwXSksbygkVnIsWzIsOTFdKSxvKCRWcixbMiw5Ml0pLHszNjpbMSw5OV0sNzQ6OTgsODM6WzEsMTAwXX0sezc6MTAyLDM1OiRWaSw1NzokVmwsNjk6MTAxLDczOiRWbSw4MzpbMSwxMDNdLDg1OlsxLDEwNF0sODY6OTAsODc6OTEsODg6OTUsODk6JFZvLDkxOiRWcCw5MjokVnF9LG8oJFZjLFsyLDc2XSx7Nzg6NTMsNzk6NTQsODA6NTUsNzc6NzcsODE6JFZlLDg0OiRWZn0pLG8oJFZjLFsyLDc5XSx7Nzg6NTMsNzk6NTQsODA6NTUsNzc6NzcsODE6JFZlLDg0OiRWZn0pLHsyMzpbMSwxMDVdfSxvKCRWNyxbMiwxMzhdKSxvKCRWNyxbMiwxMzldKSx7NzoxMTEsMjM6WzEsMTA3XSwzNTokVmksMzg6JFZrLDQwOjgzLDQ1OjEwNiw0NzoxMDgsNDg6MTEwLDQ5OiRWcyw1Mjo4NCw1NzokVmwsNjk6ODUsNzM6JFZtLDg0OiRWbiw4Njo5MCw4Nzo5MSw4ODo5NSw4OTokVm8sOTE6JFZwLDkyOiRWcSw5Mzo4OH0sezc6MTEzLDI4OjExMiwzNTokVml9LHs3OjEyMSwyMjokVnQsMzA6MTE0LDM1OiRWaSwzODokVmssNDA6MTE1LDUyOjExNiw1MzoxMTcsNTc6JFZ1LDY3OjExOCw2ODokVnYsNjk6MTIyLDczOiRWbSw4NDokVm4sODY6OTAsODc6OTEsODg6OTUsODk6JFZvLDkxOiRWcCw5MjokVnEsOTM6ODh9LHs3OjEyMSwyMjokVnQsMzA6MTI0LDM1OiRWaSwzODokVmssNDA6MTE1LDUyOjExNiw1MzoxMTcsNTc6JFZ1LDY3OjExOCw2ODokVnYsNjk6MTIyLDczOiRWbSw4NDokVm4sODY6OTAsODc6OTEsODg6OTUsODk6JFZvLDkxOiRWcCw5MjokVnEsOTM6ODh9LHszNTpbMSwxMjVdfSx7MzU6WzEsMTI2XX0sezM2OlsxLDEyN119LHs3OjExMSwyMzpbMSwxMjldLDM1OiRWaSwzODokVmssNDA6ODMsNDU6MTI4LDQ3OjEwOCw0ODoxMTAsNDk6JFZzLDUyOjg0LDU3OiRWbCw2OTo4NSw3MzokVm0sODQ6JFZuLDg2OjkwLDg3OjkxLDg4Ojk1LDg5OiRWbyw5MTokVnAsOTI6JFZxLDkzOjg4fSx7Mzk6JFZnLDcyOjEzMCw3NjokVmgsNzc6NzcsNzg6NTMsNzk6NTQsODA6NTUsODE6JFZlLDg0OiRWZn0sbygkVmMsWzIsODFdKSxvKCRWYyxbMiw4Nl0pLG8oJFZjLFsyLDg3XSksezM5OiRWZyw3MjoxMzEsNzY6JFZoLDc3Ojc3LDc4OjUzLDc5OjU0LDgwOjU1LDgxOiRWZSw4NDokVmZ9LG8oJFZjLFsyLDgzXSksbygkVnIsWzIsODldKSx7MjM6WzEsMTMyXSw1MDokVnd9LG8oJFZyLFsyLDk1XSksbygkVngsWzIsOTZdKSxvKCRWeCxbMiw5N10pLG8oWzIzLDUwXSwkVnkpLG8oJFZ6LFsyLDExOF0pLG8oJFZ6LFsyLDExOV0pLG8oJFZ6LFsyLDEyMF0pLHszNjokVjgsMzg6JFY5LDcwOjI4LDczOiRWYSw3NDozMSw3NTokVmJ9LHs3OjEzNywzNTokVmksMzY6JFZqLDM4OiRWayw0MDo4Myw0ODo4MCw1Mjo4NCw1NzokVmwsNjk6ODUsNzM6JFZtLDgyOjEzNCw4NDokVm4sODU6WzEsMTM1XSw4Njo5MCw4Nzo5MSw4ODoxMzYsODk6JFZvLDkxOiRWcCw5MjokVnEsOTM6ODh9LG8oJFZ6LFsyLDEyMl0pLHszOTpbMSwxMzldLDg2OjE0MCw5MTokVnAsOTI6JFZxLDk1OjEzOH0sbygkVkEsWzIsMTA4XSksbygkVkEsWzIsMTA5XSksbygkVkEsWzIsMTEwXSksbygkVkIsWzIsMTE2XSksbygkVkIsWzIsMTE3XSksbygkVkEsJFZDKSxvKCRWRCwkVkUsezkwOlsxLDE0MV19KSx7ODk6JFZGfSxvKCRWcixbMiw5M10pLG8oJFZyLFsyLDEwMV0sezIyOiRWZH0pLG8oJFZyLFsyLDEwMl0pLHs4MzpbMSwxNDRdLDg1OlsxLDE0M119LHs4NTpbMSwxNDVdfSxvKCRWcixbMiwxMDZdKSxvKCRWcixbMiwxMDddKSxvKCRWNyxbMiwxOF0pLHsyMzpbMSwxNDZdfSxvKCRWNyxbMiwzOF0pLHsyMzpbMiw0N10sNDk6WzEsMTQ3XSw1MDokVkd9LHs3OjExMSwzNTokVmksMzg6JFZrLDQwOjgzLDQ3OjE0OSw0ODoxMTAsNTI6ODQsNTc6JFZsLDY5Ojg1LDczOiRWbSw4NDokVm4sODY6OTAsODc6OTEsODg6OTUsODk6JFZvLDkxOiRWcCw5MjokVnEsOTM6ODh9LG8oJFZILFsyLDQxXSksbygkVkgsWzIsNDJdKSx7MjM6WzEsMTUwXX0sezUxOlsxLDE1MV19LHsyMzpbMSwxNTJdfSx7MjM6WzIsNTJdfSx7MjM6WzIsNTNdfSx7MjM6WzIsNTRdLDU0OiRWSSw1NTokVkosNTY6JFZLLDU3OiRWTCw1ODokVk0sNTk6JFZOLDYwOiRWTyw2MTokVlAsNjI6JFZRLDYzOiRWUiw2NDokVlMsNjU6JFZULDY2OiRWVX0sbygkVlYsWzIsNjhdKSx7MjI6JFZ0LDY3OjE2Niw4OTokVkZ9LHs3OjEyMSwyMjokVnQsMzU6JFZpLDUzOjE2Nyw1NzokVnUsNjc6MTE4LDY4OiRWdiw2OToxMjIsNzM6JFZtLDg2OjkwLDg3OjkxLDg4Ojk1LDg5OiRWbyw5MTokVnAsOTI6JFZxfSxvKCRWVixbMiw3MV0pLG8oJFZWLFsyLDcyXSksezc6MTIxLDIyOiRWdCwzNTokVmksNTM6MTY4LDU3OiRWdSw2NzoxMTgsNjg6JFZ2LDY5OjEyMiw3MzokVm0sODY6OTAsODc6OTEsODg6OTUsODk6JFZvLDkxOiRWcCw5MjokVnF9LHsyMzpbMSwxNjldfSx7MzY6WzEsMTcwXSwzODpbMSwxNzFdfSx7MzY6WzEsMTcyXX0sezc6MTc1LDIzOlsxLDE3NF0sMzU6JFZpLDQ0OjE3M30sezIzOlsxLDE3Nl19LG8oJFY3LFsyLDQwXSksbygkVmMsWzIsNzRdKSxvKCRWYyxbMiw3OF0pLG8oJFZyLFsyLDk0XSksezc6MTc4LDM1OiRWaSwzODokVmssNDA6ODMsNDg6MTc3LDUyOjg0LDU3OiRWbCw2OTo4NSw3MzokVm0sODQ6JFZuLDg2OjkwLDg3OjkxLDg4Ojk1LDg5OiRWbyw5MTokVnAsOTI6JFZxLDkzOjg4fSx7NTA6JFZ3LDg1OlsxLDE3OV19LG8oJFZ6LFsyLDEyM10pLG8oJFZXLCRWQyx7OTQ6WzEsMTgwXX0pLG8oJFZXLCRWeSx7OTQ6WzEsMTgxXX0pLHszOTpbMSwxODJdLDUwOlsxLDE4M119LG8oJFZ6LFsyLDEyOV0pLHs5NjpbMSwxODRdfSx7ODk6WzEsMTg1XX0sbygkVkQsJFZYLHs5MDpbMSwxODZdfSksbygkVnIsWzIsMTAzXSksbygkVnIsWzIsMTA1XSksbygkVnIsWzIsMTA0XSksbygkVjcsWzIsMzddKSx7NzoxODgsMjM6WzIsNTBdLDM1OiRWaSwzODokVmssNDA6ODMsNDg6MTg3LDUyOjg0LDU3OiRWbCw2OTo4NSw3MzokVm0sODQ6JFZuLDg2OjkwLDg3OjkxLDg4Ojk1LDg5OiRWbyw5MTokVnAsOTI6JFZxLDkzOjg4fSx7NzoxOTAsMzU6JFZpLDM4OiRWayw0MDo4Myw0ODoxODksNTI6ODQsNTc6JFZsLDY5Ojg1LDczOiRWbSw4NDokVm4sODY6OTAsODc6OTEsODg6OTUsODk6JFZvLDkxOiRWcCw5MjokVnEsOTM6ODh9LHsyMzpbMiw0OF0sNDk6WzEsMTkxXSw1MDokVkd9LG8oJFY3LFsyLDIyXSksezc6MTIxLDIyOiRWdCwzMDoxOTIsMzU6JFZpLDM4OiRWayw0MDoxMTUsNTI6MTE2LDUzOjExNyw1NzokVnUsNjc6MTE4LDY4OiRWdiw2OToxMjIsNzM6JFZtLDg0OiRWbiw4Njo5MCw4Nzo5MSw4ODo5NSw4OTokVm8sOTE6JFZwLDkyOiRWcSw5Mzo4OH0sbygkVjcsWzIsMjNdKSx7NzoxMjEsMjI6JFZ0LDM1OiRWaSw1MzoxOTMsNTc6JFZ1LDY3OjExOCw2ODokVnYsNjk6MTIyLDczOiRWbSw4Njo5MCw4Nzo5MSw4ODo5NSw4OTokVm8sOTE6JFZwLDkyOiRWcX0sezc6MTIxLDIyOiRWdCwzNTokVmksNTM6MTk0LDU3OiRWdSw2NzoxMTgsNjg6JFZ2LDY5OjEyMiw3MzokVm0sODY6OTAsODc6OTEsODg6OTUsODk6JFZvLDkxOiRWcCw5MjokVnF9LHs3OjEyMSwyMjokVnQsMzU6JFZpLDUzOjE5NSw1NzokVnUsNjc6MTE4LDY4OiRWdiw2OToxMjIsNzM6JFZtLDg2OjkwLDg3OjkxLDg4Ojk1LDg5OiRWbyw5MTokVnAsOTI6JFZxfSx7NzoxMjEsMjI6JFZ0LDM1OiRWaSw1MzoxOTYsNTc6JFZ1LDY3OjExOCw2ODokVnYsNjk6MTIyLDczOiRWbSw4Njo5MCw4Nzo5MSw4ODo5NSw4OTokVm8sOTE6JFZwLDkyOiRWcX0sezc6MTIxLDIyOiRWdCwzNTokVmksNTM6MTk3LDU3OiRWdSw2NzoxMTgsNjg6JFZ2LDY5OjEyMiw3MzokVm0sODY6OTAsODc6OTEsODg6OTUsODk6JFZvLDkxOiRWcCw5MjokVnF9LHs3OjEyMSwyMjokVnQsMzU6JFZpLDUzOjE5OCw1NzokVnUsNjc6MTE4LDY4OiRWdiw2OToxMjIsNzM6JFZtLDg2OjkwLDg3OjkxLDg4Ojk1LDg5OiRWbyw5MTokVnAsOTI6JFZxfSx7NzoxMjEsMjI6JFZ0LDM1OiRWaSw1MzoxOTksNTc6JFZ1LDY3OjExOCw2ODokVnYsNjk6MTIyLDczOiRWbSw4Njo5MCw4Nzo5MSw4ODo5NSw4OTokVm8sOTE6JFZwLDkyOiRWcX0sezc6MTIxLDIyOiRWdCwzNTokVmksNTM6MjAwLDU3OiRWdSw2NzoxMTgsNjg6JFZ2LDY5OjEyMiw3MzokVm0sODY6OTAsODc6OTEsODg6OTUsODk6JFZvLDkxOiRWcCw5MjokVnF9LHs3OjEyMSwyMjokVnQsMzU6JFZpLDUzOjIwMSw1NzokVnUsNjc6MTE4LDY4OiRWdiw2OToxMjIsNzM6JFZtLDg2OjkwLDg3OjkxLDg4Ojk1LDg5OiRWbyw5MTokVnAsOTI6JFZxfSx7NzoxMjEsMjI6JFZ0LDM1OiRWaSw1MzoyMDIsNTc6JFZ1LDY3OjExOCw2ODokVnYsNjk6MTIyLDczOiRWbSw4Njo5MCw4Nzo5MSw4ODo5NSw4OTokVm8sOTE6JFZwLDkyOiRWcX0sezc6MTIxLDIyOiRWdCwzNTokVmksNTM6MjAzLDU3OiRWdSw2NzoxMTgsNjg6JFZ2LDY5OjEyMiw3MzokVm0sODY6OTAsODc6OTEsODg6OTUsODk6JFZvLDkxOiRWcCw5MjokVnF9LHs3OjEyMSwyMjokVnQsMzU6JFZpLDUzOjIwNCw1NzokVnUsNjc6MTE4LDY4OiRWdiw2OToxMjIsNzM6JFZtLDg2OjkwLDg3OjkxLDg4Ojk1LDg5OiRWbyw5MTokVnAsOTI6JFZxfSx7NzoxMjEsMjI6JFZ0LDM1OiRWaSw1MzoyMDUsNTc6JFZ1LDY3OjExOCw2ODokVnYsNjk6MTIyLDczOiRWbSw4Njo5MCw4Nzo5MSw4ODo5NSw4OTokVm8sOTE6JFZwLDkyOiRWcX0sbygkVlYsWzIsNjldKSxvKCRWVixbMiw3MF0pLHsyMzpbMSwyMDZdLDU0OiRWSSw1NTokVkosNTY6JFZLLDU3OiRWTCw1ODokVk0sNTk6JFZOLDYwOiRWTyw2MTokVlAsNjI6JFZRLDYzOiRWUiw2NDokVlMsNjU6JFZULDY2OiRWVX0sbygkVjcsWzIsMjRdKSx7Mzc6WzEsMjA3XX0sezM2OlsxLDIwOF19LHsyMzpbMSwyMDldfSx7NzoyMTEsMjM6WzEsMjEwXSwzNTokVml9LG8oJFY3LFsyLDM0XSksbygkVlksWzIsMzVdKSxvKCRWNyxbMiwzOV0pLG8oJFZ4LFsyLDk5XSksbygkVngsWzIsMTAwXSksbygkVnosWzIsMTIxXSksezc6MjEzLDM1OiRWaSw1NzokVlosODg6MjEyLDg5OiRWX30sezc6MjE3LDM1OiRWaSw1NzokVlosODg6MjE2LDg5OiRWX30sbygkVnosWzIsMTI4XSksezg2OjIxOCw5MTokVnAsOTI6JFZxfSxvKCRWJCxbMiwxMzJdLHs0MDo4Myw1Mjo4NCw2OTo4NSw5Mzo4OCw4Njo5MCw4Nzo5MSw4ODo5NSw0ODoyMTksNzoyMjAsMzU6JFZpLDM4OiRWayw1NzokVmwsNzM6JFZtLDg0OiRWbiw4OTokVm8sOTE6JFZwLDkyOiRWcX0pLG8oJFZBLFsyLDExMl0pLHs4OTpbMSwyMjFdfSxvKCRWSCxbMiw0M10pLG8oJFZILFsyLDQ2XSksbygkVkgsWzIsNDRdKSxvKCRWSCxbMiw0NV0pLHs3OjE4OCwyMzpbMiw0OV0sMzU6JFZpLDM4OiRWayw0MDo4Myw0ODoxODcsNTI6ODQsNTc6JFZsLDY5Ojg1LDczOiRWbSw4NDokVm4sODY6OTAsODc6OTEsODg6OTUsODk6JFZvLDkxOiRWcCw5MjokVnEsOTM6ODh9LHsyMzpbMiw1MV19LG8oJFYwMSxbMiw1NV0sezU2OiRWSyw1NzokVkwsNTg6JFZNLDU5OiRWTiw2MDokVk8sNjE6JFZQLDYyOiRWUSw2MzokVlIsNjQ6JFZTLDY1OiRWVCw2NjokVlV9KSxvKCRWMDEsWzIsNTZdLHs1NjokVkssNTc6JFZMLDU4OiRWTSw1OTokVk4sNjA6JFZPLDYxOiRWUCw2MjokVlEsNjM6JFZSLDY0OiRWUyw2NTokVlQsNjY6JFZVfSksbygkVjExLFsyLDU3XSx7NTg6JFZNLDU5OiRWTiw2MDokVk99KSxvKCRWMTEsWzIsNThdLHs1ODokVk0sNTk6JFZOLDYwOiRWT30pLG8oJFZWLFsyLDU5XSksbygkVlYsWzIsNjBdKSxvKCRWVixbMiw2MV0pLG8oJFYyMSxbMiw2Ml0sezU2OiRWSyw1NzokVkwsNTg6JFZNLDU5OiRWTiw2MDokVk99KSxvKCRWMjEsWzIsNjNdLHs1NjokVkssNTc6JFZMLDU4OiRWTSw1OTokVk4sNjA6JFZPfSksbygkVjIxLFsyLDY0XSx7NTY6JFZLLDU3OiRWTCw1ODokVk0sNTk6JFZOLDYwOiRWT30pLG8oJFYyMSxbMiw2NV0sezU2OiRWSyw1NzokVkwsNTg6JFZNLDU5OiRWTiw2MDokVk99KSxvKCRWMjEsWzIsNjZdLHs1NjokVkssNTc6JFZMLDU4OiRWTSw1OTokVk4sNjA6JFZPfSksbygkVjIxLFsyLDY3XSx7NTY6JFZLLDU3OiRWTCw1ODokVk0sNTk6JFZOLDYwOiRWT30pLG8oJFZWLFsyLDczXSksezc6MjIyLDM1OiRWaSw0MDoyMjMsODQ6JFZuLDkzOjg4fSx7Mzk6WzEsMjI0XX0sbygkVjcsWzIsMzJdKSxvKCRWNyxbMiwzM10pLG8oJFZZLFsyLDM2XSksezg1OlsxLDIyNV19LHs4NTpbMSwyMjZdfSx7ODU6JFZFfSx7ODk6WzEsMjI3XX0sezg1OlsxLDIyOF19LHs4NTpbMSwyMjldfSx7OTY6WzEsMjMwXX0sbygkViQsWzIsMTMwXSksbygkViQsWzIsMTMxXSksbygkVkEsWzIsMTEzXSksezIzOlsxLDIzMV19LHsyMzpbMSwyMzJdfSx7Mzc6WzEsMjMzXX0sbygkVnosWzIsMTI0XSksbygkVnosWzIsMTI2XSksezg1OiRWWH0sbygkVnosWzIsMTI1XSksbygkVnosWzIsMTI3XSksezc6MjM0LDM1OiRWaSwzODokVmssNDA6ODMsNDg6MjM1LDUyOjg0LDU3OiRWbCw2OTo4NSw3MzokVm0sODQ6JFZuLDg2OjkwLDg3OjkxLDg4Ojk1LDg5OiRWbyw5MTokVnAsOTI6JFZxLDkzOjg4fSxvKCRWNyxbMiwyN10pLG8oJFY3LFsyLDI5XSksezc6MjM2LDM1OiRWaSw0MDoyMzcsODQ6JFZuLDkzOjg4fSxvKCRWJCxbMiwxMzNdKSxvKCRWJCxbMiwxMzRdKSx7MjM6WzEsMjM4XX0sezIzOlsxLDIzOV19LG8oJFY3LFsyLDI4XSksbygkVjcsWzIsMzBdKV0sXHJcbmRlZmF1bHRBY3Rpb25zOiB7MjpbMiwxXSwyNjpbMiwyXSwzMzpbMiw4NF0sMzQ6WzIsODVdLDExNTpbMiw1Ml0sMTE2OlsyLDUzXSwxOTI6WzIsNTFdLDIxNDpbMiwxMTRdLDIyNzpbMiwxMTVdfSxcclxucGFyc2VFcnJvcjogZnVuY3Rpb24gcGFyc2VFcnJvciAoc3RyLCBoYXNoKSB7XHJcbiAgICBpZiAoaGFzaC5yZWNvdmVyYWJsZSkge1xyXG4gICAgICAgIHRoaXMudHJhY2Uoc3RyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKHN0cik7XHJcbiAgICAgICAgZXJyb3IuaGFzaCA9IGhhc2g7XHJcbiAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9XHJcbn0sXHJcbnBhcnNlOiBmdW5jdGlvbiBwYXJzZShpbnB1dCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLCBzdGFjayA9IFswXSwgdHN0YWNrID0gW10sIHZzdGFjayA9IFtudWxsXSwgbHN0YWNrID0gW10sIHRhYmxlID0gdGhpcy50YWJsZSwgeXl0ZXh0ID0gJycsIHl5bGluZW5vID0gMCwgeXlsZW5nID0gMCwgcmVjb3ZlcmluZyA9IDAsIFRFUlJPUiA9IDIsIEVPRiA9IDE7XHJcbiAgICB2YXIgYXJncyA9IGxzdGFjay5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcbiAgICB2YXIgbGV4ZXIgPSBPYmplY3QuY3JlYXRlKHRoaXMubGV4ZXIpO1xyXG4gICAgdmFyIHNoYXJlZFN0YXRlID0geyB5eToge30gfTtcclxuICAgIGZvciAodmFyIGsgaW4gdGhpcy55eSkge1xyXG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy55eSwgaykpIHtcclxuICAgICAgICAgICAgc2hhcmVkU3RhdGUueXlba10gPSB0aGlzLnl5W2tdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGxleGVyLnNldElucHV0KGlucHV0LCBzaGFyZWRTdGF0ZS55eSk7XHJcbiAgICBzaGFyZWRTdGF0ZS55eS5sZXhlciA9IGxleGVyO1xyXG4gICAgc2hhcmVkU3RhdGUueXkucGFyc2VyID0gdGhpcztcclxuICAgIGlmICh0eXBlb2YgbGV4ZXIueXlsbG9jID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgbGV4ZXIueXlsbG9jID0ge307XHJcbiAgICB9XHJcbiAgICB2YXIgeXlsb2MgPSBsZXhlci55eWxsb2M7XHJcbiAgICBsc3RhY2sucHVzaCh5eWxvYyk7XHJcbiAgICB2YXIgcmFuZ2VzID0gbGV4ZXIub3B0aW9ucyAmJiBsZXhlci5vcHRpb25zLnJhbmdlcztcclxuICAgIGlmICh0eXBlb2Ygc2hhcmVkU3RhdGUueXkucGFyc2VFcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHRoaXMucGFyc2VFcnJvciA9IHNoYXJlZFN0YXRlLnl5LnBhcnNlRXJyb3I7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucGFyc2VFcnJvciA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKS5wYXJzZUVycm9yO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcG9wU3RhY2sobikge1xyXG4gICAgICAgIHN0YWNrLmxlbmd0aCA9IHN0YWNrLmxlbmd0aCAtIDIgKiBuO1xyXG4gICAgICAgIHZzdGFjay5sZW5ndGggPSB2c3RhY2subGVuZ3RoIC0gbjtcclxuICAgICAgICBsc3RhY2subGVuZ3RoID0gbHN0YWNrLmxlbmd0aCAtIG47XHJcbiAgICB9XHJcbiAgICBfdG9rZW5fc3RhY2s6XHJcbiAgICAgICAgdmFyIGxleCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRva2VuO1xyXG4gICAgICAgICAgICB0b2tlbiA9IGxleGVyLmxleCgpIHx8IEVPRjtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0b2tlbiAhPT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgICAgIHRva2VuID0gc2VsZi5zeW1ib2xzX1t0b2tlbl0gfHwgdG9rZW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgICAgIH07XHJcbiAgICB2YXIgc3ltYm9sLCBwcmVFcnJvclN5bWJvbCwgc3RhdGUsIGFjdGlvbiwgYSwgciwgeXl2YWwgPSB7fSwgcCwgbGVuLCBuZXdTdGF0ZSwgZXhwZWN0ZWQ7XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIHN0YXRlID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XHJcbiAgICAgICAgaWYgKHRoaXMuZGVmYXVsdEFjdGlvbnNbc3RhdGVdKSB7XHJcbiAgICAgICAgICAgIGFjdGlvbiA9IHRoaXMuZGVmYXVsdEFjdGlvbnNbc3RhdGVdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChzeW1ib2wgPT09IG51bGwgfHwgdHlwZW9mIHN5bWJvbCA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgc3ltYm9sID0gbGV4KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYWN0aW9uID0gdGFibGVbc3RhdGVdICYmIHRhYmxlW3N0YXRlXVtzeW1ib2xdO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ3VuZGVmaW5lZCcgfHwgIWFjdGlvbi5sZW5ndGggfHwgIWFjdGlvblswXSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVyclN0ciA9ICcnO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAocCBpbiB0YWJsZVtzdGF0ZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXJtaW5hbHNfW3BdICYmIHAgPiBURVJST1IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQucHVzaCgnXFwnJyArIHRoaXMudGVybWluYWxzX1twXSArICdcXCcnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobGV4ZXIuc2hvd1Bvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyU3RyID0gJ1BhcnNlIGVycm9yIG9uIGxpbmUgJyArICh5eWxpbmVubyArIDEpICsgJzpcXG4nICsgbGV4ZXIuc2hvd1Bvc2l0aW9uKCkgKyAnXFxuRXhwZWN0aW5nICcgKyBleHBlY3RlZC5qb2luKCcsICcpICsgJywgZ290IFxcJycgKyAodGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0gfHwgc3ltYm9sKSArICdcXCcnO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJTdHIgPSAnUGFyc2UgZXJyb3Igb24gbGluZSAnICsgKHl5bGluZW5vICsgMSkgKyAnOiBVbmV4cGVjdGVkICcgKyAoc3ltYm9sID09IEVPRiA/ICdlbmQgb2YgaW5wdXQnIDogJ1xcJycgKyAodGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0gfHwgc3ltYm9sKSArICdcXCcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VFcnJvcihlcnJTdHIsIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBsZXhlci5tYXRjaCxcclxuICAgICAgICAgICAgICAgICAgICB0b2tlbjogdGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0gfHwgc3ltYm9sLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmU6IGxleGVyLnl5bGluZW5vLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvYzogeXlsb2MsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IGV4cGVjdGVkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGlmIChhY3Rpb25bMF0gaW5zdGFuY2VvZiBBcnJheSAmJiBhY3Rpb24ubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcnNlIEVycm9yOiBtdWx0aXBsZSBhY3Rpb25zIHBvc3NpYmxlIGF0IHN0YXRlOiAnICsgc3RhdGUgKyAnLCB0b2tlbjogJyArIHN5bWJvbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uWzBdKSB7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICBzdGFjay5wdXNoKHN5bWJvbCk7XHJcbiAgICAgICAgICAgIHZzdGFjay5wdXNoKGxleGVyLnl5dGV4dCk7XHJcbiAgICAgICAgICAgIGxzdGFjay5wdXNoKGxleGVyLnl5bGxvYyk7XHJcbiAgICAgICAgICAgIHN0YWNrLnB1c2goYWN0aW9uWzFdKTtcclxuICAgICAgICAgICAgc3ltYm9sID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKCFwcmVFcnJvclN5bWJvbCkge1xyXG4gICAgICAgICAgICAgICAgeXlsZW5nID0gbGV4ZXIueXlsZW5nO1xyXG4gICAgICAgICAgICAgICAgeXl0ZXh0ID0gbGV4ZXIueXl0ZXh0O1xyXG4gICAgICAgICAgICAgICAgeXlsaW5lbm8gPSBsZXhlci55eWxpbmVubztcclxuICAgICAgICAgICAgICAgIHl5bG9jID0gbGV4ZXIueXlsbG9jO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlY292ZXJpbmcgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVjb3ZlcmluZy0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3ltYm9sID0gcHJlRXJyb3JTeW1ib2w7XHJcbiAgICAgICAgICAgICAgICBwcmVFcnJvclN5bWJvbCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICBsZW4gPSB0aGlzLnByb2R1Y3Rpb25zX1thY3Rpb25bMV1dWzFdO1xyXG4gICAgICAgICAgICB5eXZhbC4kID0gdnN0YWNrW3ZzdGFjay5sZW5ndGggLSBsZW5dO1xyXG4gICAgICAgICAgICB5eXZhbC5fJCA9IHtcclxuICAgICAgICAgICAgICAgIGZpcnN0X2xpbmU6IGxzdGFja1tsc3RhY2subGVuZ3RoIC0gKGxlbiB8fCAxKV0uZmlyc3RfbGluZSxcclxuICAgICAgICAgICAgICAgIGxhc3RfbGluZTogbHN0YWNrW2xzdGFjay5sZW5ndGggLSAxXS5sYXN0X2xpbmUsXHJcbiAgICAgICAgICAgICAgICBmaXJzdF9jb2x1bW46IGxzdGFja1tsc3RhY2subGVuZ3RoIC0gKGxlbiB8fCAxKV0uZmlyc3RfY29sdW1uLFxyXG4gICAgICAgICAgICAgICAgbGFzdF9jb2x1bW46IGxzdGFja1tsc3RhY2subGVuZ3RoIC0gMV0ubGFzdF9jb2x1bW5cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKHJhbmdlcykge1xyXG4gICAgICAgICAgICAgICAgeXl2YWwuXyQucmFuZ2UgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgbHN0YWNrW2xzdGFjay5sZW5ndGggLSAobGVuIHx8IDEpXS5yYW5nZVswXSxcclxuICAgICAgICAgICAgICAgICAgICBsc3RhY2tbbHN0YWNrLmxlbmd0aCAtIDFdLnJhbmdlWzFdXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHIgPSB0aGlzLnBlcmZvcm1BY3Rpb24uYXBwbHkoeXl2YWwsIFtcclxuICAgICAgICAgICAgICAgIHl5dGV4dCxcclxuICAgICAgICAgICAgICAgIHl5bGVuZyxcclxuICAgICAgICAgICAgICAgIHl5bGluZW5vLFxyXG4gICAgICAgICAgICAgICAgc2hhcmVkU3RhdGUueXksXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25bMV0sXHJcbiAgICAgICAgICAgICAgICB2c3RhY2ssXHJcbiAgICAgICAgICAgICAgICBsc3RhY2tcclxuICAgICAgICAgICAgXS5jb25jYXQoYXJncykpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobGVuKSB7XHJcbiAgICAgICAgICAgICAgICBzdGFjayA9IHN0YWNrLnNsaWNlKDAsIC0xICogbGVuICogMik7XHJcbiAgICAgICAgICAgICAgICB2c3RhY2sgPSB2c3RhY2suc2xpY2UoMCwgLTEgKiBsZW4pO1xyXG4gICAgICAgICAgICAgICAgbHN0YWNrID0gbHN0YWNrLnNsaWNlKDAsIC0xICogbGVuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdGFjay5wdXNoKHRoaXMucHJvZHVjdGlvbnNfW2FjdGlvblsxXV1bMF0pO1xyXG4gICAgICAgICAgICB2c3RhY2sucHVzaCh5eXZhbC4kKTtcclxuICAgICAgICAgICAgbHN0YWNrLnB1c2goeXl2YWwuXyQpO1xyXG4gICAgICAgICAgICBuZXdTdGF0ZSA9IHRhYmxlW3N0YWNrW3N0YWNrLmxlbmd0aCAtIDJdXVtzdGFja1tzdGFjay5sZW5ndGggLSAxXV07XHJcbiAgICAgICAgICAgIHN0YWNrLnB1c2gobmV3U3RhdGUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG59fTtcclxuLyogZ2VuZXJhdGVkIGJ5IGppc29uLWxleCAwLjMuNCAqL1xyXG52YXIgbGV4ZXIgPSAoZnVuY3Rpb24oKXtcclxudmFyIGxleGVyID0gKHtcclxuXHJcbkVPRjoxLFxyXG5cclxucGFyc2VFcnJvcjpmdW5jdGlvbiBwYXJzZUVycm9yKHN0ciwgaGFzaCkge1xyXG4gICAgICAgIGlmICh0aGlzLnl5LnBhcnNlcikge1xyXG4gICAgICAgICAgICB0aGlzLnl5LnBhcnNlci5wYXJzZUVycm9yKHN0ciwgaGFzaCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0cik7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbi8vIHJlc2V0cyB0aGUgbGV4ZXIsIHNldHMgbmV3IGlucHV0XHJcbnNldElucHV0OmZ1bmN0aW9uIChpbnB1dCwgeXkpIHtcclxuICAgICAgICB0aGlzLnl5ID0geXkgfHwgdGhpcy55eSB8fCB7fTtcclxuICAgICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xyXG4gICAgICAgIHRoaXMuX21vcmUgPSB0aGlzLl9iYWNrdHJhY2sgPSB0aGlzLmRvbmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnl5bGluZW5vID0gdGhpcy55eWxlbmcgPSAwO1xyXG4gICAgICAgIHRoaXMueXl0ZXh0ID0gdGhpcy5tYXRjaGVkID0gdGhpcy5tYXRjaCA9ICcnO1xyXG4gICAgICAgIHRoaXMuY29uZGl0aW9uU3RhY2sgPSBbJ0lOSVRJQUwnXTtcclxuICAgICAgICB0aGlzLnl5bGxvYyA9IHtcclxuICAgICAgICAgICAgZmlyc3RfbGluZTogMSxcclxuICAgICAgICAgICAgZmlyc3RfY29sdW1uOiAwLFxyXG4gICAgICAgICAgICBsYXN0X2xpbmU6IDEsXHJcbiAgICAgICAgICAgIGxhc3RfY29sdW1uOiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJhbmdlcykge1xyXG4gICAgICAgICAgICB0aGlzLnl5bGxvYy5yYW5nZSA9IFswLDBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9mZnNldCA9IDA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG5cclxuLy8gY29uc3VtZXMgYW5kIHJldHVybnMgb25lIGNoYXIgZnJvbSB0aGUgaW5wdXRcclxuaW5wdXQ6ZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBjaCA9IHRoaXMuX2lucHV0WzBdO1xyXG4gICAgICAgIHRoaXMueXl0ZXh0ICs9IGNoO1xyXG4gICAgICAgIHRoaXMueXlsZW5nKys7XHJcbiAgICAgICAgdGhpcy5vZmZzZXQrKztcclxuICAgICAgICB0aGlzLm1hdGNoICs9IGNoO1xyXG4gICAgICAgIHRoaXMubWF0Y2hlZCArPSBjaDtcclxuICAgICAgICB2YXIgbGluZXMgPSBjaC5tYXRjaCgvKD86XFxyXFxuP3xcXG4pLiovZyk7XHJcbiAgICAgICAgaWYgKGxpbmVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMueXlsaW5lbm8rKztcclxuICAgICAgICAgICAgdGhpcy55eWxsb2MubGFzdF9saW5lKys7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy55eWxsb2MubGFzdF9jb2x1bW4rKztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yYW5nZXMpIHtcclxuICAgICAgICAgICAgdGhpcy55eWxsb2MucmFuZ2VbMV0rKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2lucHV0ID0gdGhpcy5faW5wdXQuc2xpY2UoMSk7XHJcbiAgICAgICAgcmV0dXJuIGNoO1xyXG4gICAgfSxcclxuXHJcbi8vIHVuc2hpZnRzIG9uZSBjaGFyIChvciBhIHN0cmluZykgaW50byB0aGUgaW5wdXRcclxudW5wdXQ6ZnVuY3Rpb24gKGNoKSB7XHJcbiAgICAgICAgdmFyIGxlbiA9IGNoLmxlbmd0aDtcclxuICAgICAgICB2YXIgbGluZXMgPSBjaC5zcGxpdCgvKD86XFxyXFxuP3xcXG4pL2cpO1xyXG5cclxuICAgICAgICB0aGlzLl9pbnB1dCA9IGNoICsgdGhpcy5faW5wdXQ7XHJcbiAgICAgICAgdGhpcy55eXRleHQgPSB0aGlzLnl5dGV4dC5zdWJzdHIoMCwgdGhpcy55eXRleHQubGVuZ3RoIC0gbGVuKTtcclxuICAgICAgICAvL3RoaXMueXlsZW5nIC09IGxlbjtcclxuICAgICAgICB0aGlzLm9mZnNldCAtPSBsZW47XHJcbiAgICAgICAgdmFyIG9sZExpbmVzID0gdGhpcy5tYXRjaC5zcGxpdCgvKD86XFxyXFxuP3xcXG4pL2cpO1xyXG4gICAgICAgIHRoaXMubWF0Y2ggPSB0aGlzLm1hdGNoLnN1YnN0cigwLCB0aGlzLm1hdGNoLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIHRoaXMubWF0Y2hlZCA9IHRoaXMubWF0Y2hlZC5zdWJzdHIoMCwgdGhpcy5tYXRjaGVkLmxlbmd0aCAtIDEpO1xyXG5cclxuICAgICAgICBpZiAobGluZXMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLnl5bGluZW5vIC09IGxpbmVzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByID0gdGhpcy55eWxsb2MucmFuZ2U7XHJcblxyXG4gICAgICAgIHRoaXMueXlsbG9jID0ge1xyXG4gICAgICAgICAgICBmaXJzdF9saW5lOiB0aGlzLnl5bGxvYy5maXJzdF9saW5lLFxyXG4gICAgICAgICAgICBsYXN0X2xpbmU6IHRoaXMueXlsaW5lbm8gKyAxLFxyXG4gICAgICAgICAgICBmaXJzdF9jb2x1bW46IHRoaXMueXlsbG9jLmZpcnN0X2NvbHVtbixcclxuICAgICAgICAgICAgbGFzdF9jb2x1bW46IGxpbmVzID9cclxuICAgICAgICAgICAgICAgIChsaW5lcy5sZW5ndGggPT09IG9sZExpbmVzLmxlbmd0aCA/IHRoaXMueXlsbG9jLmZpcnN0X2NvbHVtbiA6IDApXHJcbiAgICAgICAgICAgICAgICAgKyBvbGRMaW5lc1tvbGRMaW5lcy5sZW5ndGggLSBsaW5lcy5sZW5ndGhdLmxlbmd0aCAtIGxpbmVzWzBdLmxlbmd0aCA6XHJcbiAgICAgICAgICAgICAgdGhpcy55eWxsb2MuZmlyc3RfY29sdW1uIC0gbGVuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yYW5nZXMpIHtcclxuICAgICAgICAgICAgdGhpcy55eWxsb2MucmFuZ2UgPSBbclswXSwgclswXSArIHRoaXMueXlsZW5nIC0gbGVuXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy55eWxlbmcgPSB0aGlzLnl5dGV4dC5sZW5ndGg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG5cclxuLy8gV2hlbiBjYWxsZWQgZnJvbSBhY3Rpb24sIGNhY2hlcyBtYXRjaGVkIHRleHQgYW5kIGFwcGVuZHMgaXQgb24gbmV4dCBhY3Rpb25cclxubW9yZTpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fbW9yZSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG5cclxuLy8gV2hlbiBjYWxsZWQgZnJvbSBhY3Rpb24sIHNpZ25hbHMgdGhlIGxleGVyIHRoYXQgdGhpcyBydWxlIGZhaWxzIHRvIG1hdGNoIHRoZSBpbnB1dCwgc28gdGhlIG5leHQgbWF0Y2hpbmcgcnVsZSAocmVnZXgpIHNob3VsZCBiZSB0ZXN0ZWQgaW5zdGVhZC5cclxucmVqZWN0OmZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJhY2t0cmFja19sZXhlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9iYWNrdHJhY2sgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRXJyb3IoJ0xleGljYWwgZXJyb3Igb24gbGluZSAnICsgKHRoaXMueXlsaW5lbm8gKyAxKSArICcuIFlvdSBjYW4gb25seSBpbnZva2UgcmVqZWN0KCkgaW4gdGhlIGxleGVyIHdoZW4gdGhlIGxleGVyIGlzIG9mIHRoZSBiYWNrdHJhY2tpbmcgcGVyc3Vhc2lvbiAob3B0aW9ucy5iYWNrdHJhY2tfbGV4ZXIgPSB0cnVlKS5cXG4nICsgdGhpcy5zaG93UG9zaXRpb24oKSwge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgIHRva2VuOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgbGluZTogdGhpcy55eWxpbmVub1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuXHJcbi8vIHJldGFpbiBmaXJzdCBuIGNoYXJhY3RlcnMgb2YgdGhlIG1hdGNoXHJcbmxlc3M6ZnVuY3Rpb24gKG4pIHtcclxuICAgICAgICB0aGlzLnVucHV0KHRoaXMubWF0Y2guc2xpY2UobikpO1xyXG4gICAgfSxcclxuXHJcbi8vIGRpc3BsYXlzIGFscmVhZHkgbWF0Y2hlZCBpbnB1dCwgaS5lLiBmb3IgZXJyb3IgbWVzc2FnZXNcclxucGFzdElucHV0OmZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcGFzdCA9IHRoaXMubWF0Y2hlZC5zdWJzdHIoMCwgdGhpcy5tYXRjaGVkLmxlbmd0aCAtIHRoaXMubWF0Y2gubGVuZ3RoKTtcclxuICAgICAgICByZXR1cm4gKHBhc3QubGVuZ3RoID4gMjAgPyAnLi4uJzonJykgKyBwYXN0LnN1YnN0cigtMjApLnJlcGxhY2UoL1xcbi9nLCBcIlwiKTtcclxuICAgIH0sXHJcblxyXG4vLyBkaXNwbGF5cyB1cGNvbWluZyBpbnB1dCwgaS5lLiBmb3IgZXJyb3IgbWVzc2FnZXNcclxudXBjb21pbmdJbnB1dDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG5leHQgPSB0aGlzLm1hdGNoO1xyXG4gICAgICAgIGlmIChuZXh0Lmxlbmd0aCA8IDIwKSB7XHJcbiAgICAgICAgICAgIG5leHQgKz0gdGhpcy5faW5wdXQuc3Vic3RyKDAsIDIwLW5leHQubGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChuZXh0LnN1YnN0cigwLDIwKSArIChuZXh0Lmxlbmd0aCA+IDIwID8gJy4uLicgOiAnJykpLnJlcGxhY2UoL1xcbi9nLCBcIlwiKTtcclxuICAgIH0sXHJcblxyXG4vLyBkaXNwbGF5cyB0aGUgY2hhcmFjdGVyIHBvc2l0aW9uIHdoZXJlIHRoZSBsZXhpbmcgZXJyb3Igb2NjdXJyZWQsIGkuZS4gZm9yIGVycm9yIG1lc3NhZ2VzXHJcbnNob3dQb3NpdGlvbjpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHByZSA9IHRoaXMucGFzdElucHV0KCk7XHJcbiAgICAgICAgdmFyIGMgPSBuZXcgQXJyYXkocHJlLmxlbmd0aCArIDEpLmpvaW4oXCItXCIpO1xyXG4gICAgICAgIHJldHVybiBwcmUgKyB0aGlzLnVwY29taW5nSW5wdXQoKSArIFwiXFxuXCIgKyBjICsgXCJeXCI7XHJcbiAgICB9LFxyXG5cclxuLy8gdGVzdCB0aGUgbGV4ZWQgdG9rZW46IHJldHVybiBGQUxTRSB3aGVuIG5vdCBhIG1hdGNoLCBvdGhlcndpc2UgcmV0dXJuIHRva2VuXHJcbnRlc3RfbWF0Y2g6ZnVuY3Rpb24obWF0Y2gsIGluZGV4ZWRfcnVsZSkge1xyXG4gICAgICAgIHZhciB0b2tlbixcclxuICAgICAgICAgICAgbGluZXMsXHJcbiAgICAgICAgICAgIGJhY2t1cDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5iYWNrdHJhY2tfbGV4ZXIpIHtcclxuICAgICAgICAgICAgLy8gc2F2ZSBjb250ZXh0XHJcbiAgICAgICAgICAgIGJhY2t1cCA9IHtcclxuICAgICAgICAgICAgICAgIHl5bGluZW5vOiB0aGlzLnl5bGluZW5vLFxyXG4gICAgICAgICAgICAgICAgeXlsbG9jOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RfbGluZTogdGhpcy55eWxsb2MuZmlyc3RfbGluZSxcclxuICAgICAgICAgICAgICAgICAgICBsYXN0X2xpbmU6IHRoaXMubGFzdF9saW5lLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0X2NvbHVtbjogdGhpcy55eWxsb2MuZmlyc3RfY29sdW1uLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RfY29sdW1uOiB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHl5dGV4dDogdGhpcy55eXRleHQsXHJcbiAgICAgICAgICAgICAgICBtYXRjaDogdGhpcy5tYXRjaCxcclxuICAgICAgICAgICAgICAgIG1hdGNoZXM6IHRoaXMubWF0Y2hlcyxcclxuICAgICAgICAgICAgICAgIG1hdGNoZWQ6IHRoaXMubWF0Y2hlZCxcclxuICAgICAgICAgICAgICAgIHl5bGVuZzogdGhpcy55eWxlbmcsXHJcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgX21vcmU6IHRoaXMuX21vcmUsXHJcbiAgICAgICAgICAgICAgICBfaW5wdXQ6IHRoaXMuX2lucHV0LFxyXG4gICAgICAgICAgICAgICAgeXk6IHRoaXMueXksXHJcbiAgICAgICAgICAgICAgICBjb25kaXRpb25TdGFjazogdGhpcy5jb25kaXRpb25TdGFjay5zbGljZSgwKSxcclxuICAgICAgICAgICAgICAgIGRvbmU6IHRoaXMuZG9uZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJhbmdlcykge1xyXG4gICAgICAgICAgICAgICAgYmFja3VwLnl5bGxvYy5yYW5nZSA9IHRoaXMueXlsbG9jLnJhbmdlLnNsaWNlKDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsaW5lcyA9IG1hdGNoWzBdLm1hdGNoKC8oPzpcXHJcXG4/fFxcbikuKi9nKTtcclxuICAgICAgICBpZiAobGluZXMpIHtcclxuICAgICAgICAgICAgdGhpcy55eWxpbmVubyArPSBsaW5lcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMueXlsbG9jID0ge1xyXG4gICAgICAgICAgICBmaXJzdF9saW5lOiB0aGlzLnl5bGxvYy5sYXN0X2xpbmUsXHJcbiAgICAgICAgICAgIGxhc3RfbGluZTogdGhpcy55eWxpbmVubyArIDEsXHJcbiAgICAgICAgICAgIGZpcnN0X2NvbHVtbjogdGhpcy55eWxsb2MubGFzdF9jb2x1bW4sXHJcbiAgICAgICAgICAgIGxhc3RfY29sdW1uOiBsaW5lcyA/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXS5sZW5ndGggLSBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXS5tYXRjaCgvXFxyP1xcbj8vKVswXS5sZW5ndGggOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55eWxsb2MubGFzdF9jb2x1bW4gKyBtYXRjaFswXS5sZW5ndGhcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMueXl0ZXh0ICs9IG1hdGNoWzBdO1xyXG4gICAgICAgIHRoaXMubWF0Y2ggKz0gbWF0Y2hbMF07XHJcbiAgICAgICAgdGhpcy5tYXRjaGVzID0gbWF0Y2g7XHJcbiAgICAgICAgdGhpcy55eWxlbmcgPSB0aGlzLnl5dGV4dC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yYW5nZXMpIHtcclxuICAgICAgICAgICAgdGhpcy55eWxsb2MucmFuZ2UgPSBbdGhpcy5vZmZzZXQsIHRoaXMub2Zmc2V0ICs9IHRoaXMueXlsZW5nXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbW9yZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2JhY2t0cmFjayA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2lucHV0ID0gdGhpcy5faW5wdXQuc2xpY2UobWF0Y2hbMF0ubGVuZ3RoKTtcclxuICAgICAgICB0aGlzLm1hdGNoZWQgKz0gbWF0Y2hbMF07XHJcbiAgICAgICAgdG9rZW4gPSB0aGlzLnBlcmZvcm1BY3Rpb24uY2FsbCh0aGlzLCB0aGlzLnl5LCB0aGlzLCBpbmRleGVkX3J1bGUsIHRoaXMuY29uZGl0aW9uU3RhY2tbdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGggLSAxXSk7XHJcbiAgICAgICAgaWYgKHRoaXMuZG9uZSAmJiB0aGlzLl9pbnB1dCkge1xyXG4gICAgICAgICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JhY2t0cmFjaykge1xyXG4gICAgICAgICAgICAvLyByZWNvdmVyIGNvbnRleHRcclxuICAgICAgICAgICAgZm9yICh2YXIgayBpbiBiYWNrdXApIHtcclxuICAgICAgICAgICAgICAgIHRoaXNba10gPSBiYWNrdXBba107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBydWxlIGFjdGlvbiBjYWxsZWQgcmVqZWN0KCkgaW1wbHlpbmcgdGhlIG5leHQgcnVsZSBzaG91bGQgYmUgdGVzdGVkIGluc3RlYWQuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4vLyByZXR1cm4gbmV4dCBtYXRjaCBpbiBpbnB1dFxyXG5uZXh0OmZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5kb25lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkVPRjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pbnB1dCkge1xyXG4gICAgICAgICAgICB0aGlzLmRvbmUgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHRva2VuLFxyXG4gICAgICAgICAgICBtYXRjaCxcclxuICAgICAgICAgICAgdGVtcE1hdGNoLFxyXG4gICAgICAgICAgICBpbmRleDtcclxuICAgICAgICBpZiAoIXRoaXMuX21vcmUpIHtcclxuICAgICAgICAgICAgdGhpcy55eXRleHQgPSAnJztcclxuICAgICAgICAgICAgdGhpcy5tYXRjaCA9ICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcnVsZXMgPSB0aGlzLl9jdXJyZW50UnVsZXMoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRlbXBNYXRjaCA9IHRoaXMuX2lucHV0Lm1hdGNoKHRoaXMucnVsZXNbcnVsZXNbaV1dKTtcclxuICAgICAgICAgICAgaWYgKHRlbXBNYXRjaCAmJiAoIW1hdGNoIHx8IHRlbXBNYXRjaFswXS5sZW5ndGggPiBtYXRjaFswXS5sZW5ndGgpKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaCA9IHRlbXBNYXRjaDtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYmFja3RyYWNrX2xleGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRlc3RfbWF0Y2godGVtcE1hdGNoLCBydWxlc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9iYWNrdHJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7IC8vIHJ1bGUgYWN0aW9uIGNhbGxlZCByZWplY3QoKSBpbXBseWluZyBhIHJ1bGUgTUlTbWF0Y2guXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxzZTogdGhpcyBpcyBhIGxleGVyIHJ1bGUgd2hpY2ggY29uc3VtZXMgaW5wdXQgd2l0aG91dCBwcm9kdWNpbmcgYSB0b2tlbiAoZS5nLiB3aGl0ZXNwYWNlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5vcHRpb25zLmZsZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWF0Y2gpIHtcclxuICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRlc3RfbWF0Y2gobWF0Y2gsIHJ1bGVzW2luZGV4XSk7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbiAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBlbHNlOiB0aGlzIGlzIGEgbGV4ZXIgcnVsZSB3aGljaCBjb25zdW1lcyBpbnB1dCB3aXRob3V0IHByb2R1Y2luZyBhIHRva2VuIChlLmcuIHdoaXRlc3BhY2UpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2lucHV0ID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkVPRjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUVycm9yKCdMZXhpY2FsIGVycm9yIG9uIGxpbmUgJyArICh0aGlzLnl5bGluZW5vICsgMSkgKyAnLiBVbnJlY29nbml6ZWQgdGV4dC5cXG4nICsgdGhpcy5zaG93UG9zaXRpb24oKSwge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgIHRva2VuOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgbGluZTogdGhpcy55eWxpbmVub1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuLy8gcmV0dXJuIG5leHQgbWF0Y2ggdGhhdCBoYXMgYSB0b2tlblxyXG5sZXg6ZnVuY3Rpb24gbGV4ICgpIHtcclxuICAgICAgICB2YXIgciA9IHRoaXMubmV4dCgpO1xyXG4gICAgICAgIGlmIChyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxleCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4vLyBhY3RpdmF0ZXMgYSBuZXcgbGV4ZXIgY29uZGl0aW9uIHN0YXRlIChwdXNoZXMgdGhlIG5ldyBsZXhlciBjb25kaXRpb24gc3RhdGUgb250byB0aGUgY29uZGl0aW9uIHN0YWNrKVxyXG5iZWdpbjpmdW5jdGlvbiBiZWdpbiAoY29uZGl0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5jb25kaXRpb25TdGFjay5wdXNoKGNvbmRpdGlvbik7XHJcbiAgICB9LFxyXG5cclxuLy8gcG9wIHRoZSBwcmV2aW91c2x5IGFjdGl2ZSBsZXhlciBjb25kaXRpb24gc3RhdGUgb2ZmIHRoZSBjb25kaXRpb24gc3RhY2tcclxucG9wU3RhdGU6ZnVuY3Rpb24gcG9wU3RhdGUgKCkge1xyXG4gICAgICAgIHZhciBuID0gdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGggLSAxO1xyXG4gICAgICAgIGlmIChuID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25TdGFjay5wb3AoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25TdGFja1swXTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuLy8gcHJvZHVjZSB0aGUgbGV4ZXIgcnVsZSBzZXQgd2hpY2ggaXMgYWN0aXZlIGZvciB0aGUgY3VycmVudGx5IGFjdGl2ZSBsZXhlciBjb25kaXRpb24gc3RhdGVcclxuX2N1cnJlbnRSdWxlczpmdW5jdGlvbiBfY3VycmVudFJ1bGVzICgpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGggJiYgdGhpcy5jb25kaXRpb25TdGFja1t0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aCAtIDFdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbnNbdGhpcy5jb25kaXRpb25TdGFja1t0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aCAtIDFdXS5ydWxlcztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25zW1wiSU5JVElBTFwiXS5ydWxlcztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuLy8gcmV0dXJuIHRoZSBjdXJyZW50bHkgYWN0aXZlIGxleGVyIGNvbmRpdGlvbiBzdGF0ZTsgd2hlbiBhbiBpbmRleCBhcmd1bWVudCBpcyBwcm92aWRlZCBpdCBwcm9kdWNlcyB0aGUgTi10aCBwcmV2aW91cyBjb25kaXRpb24gc3RhdGUsIGlmIGF2YWlsYWJsZVxyXG50b3BTdGF0ZTpmdW5jdGlvbiB0b3BTdGF0ZSAobikge1xyXG4gICAgICAgIG4gPSB0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aCAtIDEgLSBNYXRoLmFicyhuIHx8IDApO1xyXG4gICAgICAgIGlmIChuID49IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uU3RhY2tbbl07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiSU5JVElBTFwiO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4vLyBhbGlhcyBmb3IgYmVnaW4oY29uZGl0aW9uKVxyXG5wdXNoU3RhdGU6ZnVuY3Rpb24gcHVzaFN0YXRlIChjb25kaXRpb24pIHtcclxuICAgICAgICB0aGlzLmJlZ2luKGNvbmRpdGlvbik7XHJcbiAgICB9LFxyXG5cclxuLy8gcmV0dXJuIHRoZSBudW1iZXIgb2Ygc3RhdGVzIGN1cnJlbnRseSBvbiB0aGUgc3RhY2tcclxuc3RhdGVTdGFja1NpemU6ZnVuY3Rpb24gc3RhdGVTdGFja1NpemUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoO1xyXG4gICAgfSxcclxub3B0aW9uczoge30sXHJcbnBlcmZvcm1BY3Rpb246IGZ1bmN0aW9uIGFub255bW91cyh5eSx5eV8sJGF2b2lkaW5nX25hbWVfY29sbGlzaW9ucyxZWV9TVEFSVCkge1xyXG52YXIgWVlTVEFURT1ZWV9TVEFSVDtcclxuc3dpdGNoKCRhdm9pZGluZ19uYW1lX2NvbGxpc2lvbnMpIHtcclxuY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgX3JlZyA9IC9cXFxcKyQvO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgX2VzYyA9IHl5Xy55eXRleHQubWF0Y2goX3JlZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfbnVtID0gX2VzYyA/IF9lc2NbMF0ubGVuZ3RoOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKui9rOS5ieWunueOsO+8jOmdnuW4uOaBtuW/g++8jOaaguaXtuayoeacieWlveeahOino+WGs+aWueahiCovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghX251bSB8fCAhKF9udW0gJSAyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmVnaW4oXCJtdVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5eV8ueXl0ZXh0ID0geXlfLnl5dGV4dC5yZXBsYWNlKC9cXFxcJC8sICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJlZ2luKCdlc2MnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX251bSA+IDEpIHl5Xy55eXRleHQgPSB5eV8ueXl0ZXh0LnJlcGxhY2UoLyhcXFxcXFxcXCkrJC8sICdcXFxcJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHl5Xy55eXRleHQpIHJldHVybiA4MztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG5icmVhaztcclxuY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgX3JlZyA9IC9cXFxcKyQvO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgX2VzYyA9IHl5Xy55eXRleHQubWF0Y2goX3JlZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfbnVtID0gX2VzYyA/IF9lc2NbMF0ubGVuZ3RoOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIV9udW0gfHwgIShfbnVtICUgMikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJlZ2luKFwiaFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5eV8ueXl0ZXh0ID0geXlfLnl5dGV4dC5yZXBsYWNlKC9cXFxcJC8sICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJlZ2luKCdlc2MnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX251bSA+IDEpIHl5Xy55eXRleHQgPSB5eV8ueXl0ZXh0LnJlcGxhY2UoLyhcXFxcXFxcXCkrJC8sICdcXFxcJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHl5Xy55eXRleHQpIHJldHVybiA4MztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG5icmVhaztcclxuY2FzZSAyOiByZXR1cm4gODM7IFxyXG5icmVhaztcclxuY2FzZSAzOiB0aGlzLnBvcFN0YXRlKCk7IHJldHVybiAxMTsgXHJcbmJyZWFrO1xyXG5jYXNlIDQ6IHRoaXMucG9wU3RhdGUoKTsgeXlfLnl5dGV4dCA9IHl5Xy55eXRleHQucmVwbGFjZSgvXiNcXFtcXFt8XFxdXFxdIyQvZywgJycpOyByZXR1cm4gMTBcclxuYnJlYWs7XHJcbmNhc2UgNTogdGhpcy5wb3BTdGF0ZSgpOyByZXR1cm4gMTE7IFxyXG5icmVhaztcclxuY2FzZSA2OiByZXR1cm4gNDY7IFxyXG5icmVhaztcclxuY2FzZSA3OiByZXR1cm4gMjA7IFxyXG5icmVhaztcclxuY2FzZSA4OiByZXR1cm4gMjc7IFxyXG5icmVhaztcclxuY2FzZSA5OiByZXR1cm4gMjk7IFxyXG5icmVhaztcclxuY2FzZSAxMDogcmV0dXJuIDMxOyBcclxuYnJlYWs7XHJcbmNhc2UgMTE6IHRoaXMucG9wU3RhdGUoKTsgcmV0dXJuIDMyOyBcclxuYnJlYWs7XHJcbmNhc2UgMTI6IHRoaXMucG9wU3RhdGUoKTsgcmV0dXJuIDMyOyBcclxuYnJlYWs7XHJcbmNhc2UgMTM6IHRoaXMucG9wU3RhdGUoKTsgcmV0dXJuIDMzOyBcclxuYnJlYWs7XHJcbmNhc2UgMTQ6IHRoaXMucG9wU3RhdGUoKTsgcmV0dXJuIDMzOyBcclxuYnJlYWs7XHJcbmNhc2UgMTU6IHRoaXMucG9wU3RhdGUoKTsgcmV0dXJuIDQxOyBcclxuYnJlYWs7XHJcbmNhc2UgMTY6IHJldHVybiAzNDsgXHJcbmJyZWFrO1xyXG5jYXNlIDE3OiByZXR1cm4gMjE7IFxyXG5icmVhaztcclxuY2FzZSAxODogcmV0dXJuIDQyOyBcclxuYnJlYWs7XHJcbmNhc2UgMTk6IHJldHVybiA0MzsgXHJcbmJyZWFrO1xyXG5jYXNlIDIwOiByZXR1cm4gMzc7IFxyXG5icmVhaztcclxuY2FzZSAyMTogcmV0dXJuIHl5Xy55eXRleHQ7IFxyXG5icmVhaztcclxuY2FzZSAyMjogcmV0dXJuIHl5Xy55eXRleHQ7IFxyXG5icmVhaztcclxuY2FzZSAyMzogcmV0dXJuIDY1OyBcclxuYnJlYWs7XHJcbmNhc2UgMjQ6IHJldHVybiB5eV8ueXl0ZXh0OyBcclxuYnJlYWs7XHJcbmNhc2UgMjU6IHJldHVybiA2NDsgXHJcbmJyZWFrO1xyXG5jYXNlIDI2OiByZXR1cm4geXlfLnl5dGV4dDsgXHJcbmJyZWFrO1xyXG5jYXNlIDI3OiByZXR1cm4gNjE7IFxyXG5icmVhaztcclxuY2FzZSAyODogcmV0dXJuIDYyOyBcclxuYnJlYWs7XHJcbmNhc2UgMjk6IHJldHVybiB5eV8ueXl0ZXh0OyBcclxuYnJlYWs7XHJcbmNhc2UgMzA6IHJldHVybiA2MzsgXHJcbmJyZWFrO1xyXG5jYXNlIDMxOiByZXR1cm4geXlfLnl5dGV4dDsgXHJcbmJyZWFrO1xyXG5jYXNlIDMyOiByZXR1cm4gNTQ7IFxyXG5icmVhaztcclxuY2FzZSAzMzogcmV0dXJuIHl5Xy55eXRleHQ7IFxyXG5icmVhaztcclxuY2FzZSAzNDogcmV0dXJuIDU1OyBcclxuYnJlYWs7XHJcbmNhc2UgMzU6IHJldHVybiB5eV8ueXl0ZXh0OyBcclxuYnJlYWs7XHJcbmNhc2UgMzY6IHJldHVybiA2NjsgXHJcbmJyZWFrO1xyXG5jYXNlIDM3OiByZXR1cm4gNjg7IFxyXG5icmVhaztcclxuY2FzZSAzODogcmV0dXJuIDM1OyBcclxuYnJlYWs7XHJcbmNhc2UgMzk6IHJldHVybiAzNTsgXHJcbmJyZWFrO1xyXG5jYXNlIDQwOiByZXR1cm4geXlfLnl5dGV4dDsgXHJcbmJyZWFrO1xyXG5jYXNlIDQxOiByZXR1cm4gNTE7IFxyXG5icmVhaztcclxuY2FzZSA0MjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxlbiA9IHRoaXMuc3RhdGVTdGFja1NpemUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxlbiA+PSAyICYmIHRoaXMudG9wU3RhdGUoKSA9PT0gJ2MnICYmIHRoaXMudG9wU3RhdGUoMSkgPT09ICdydW4nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDQ5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuYnJlYWs7XHJcbmNhc2UgNDM6IC8qaWdub3JlIHdoaXRlc3BhY2UqLyBcclxuYnJlYWs7XHJcbmNhc2UgNDQ6IHJldHVybiAzODsgXHJcbmJyZWFrO1xyXG5jYXNlIDQ1OiByZXR1cm4gMzk7IFxyXG5icmVhaztcclxuY2FzZSA0NjogcmV0dXJuIDk2OyBcclxuYnJlYWs7XHJcbmNhc2UgNDc6IHl5LmJlZ2luID0gdHJ1ZTsgcmV0dXJuIDc1OyBcclxuYnJlYWs7XHJcbmNhc2UgNDg6IHRoaXMucG9wU3RhdGUoKTsgaWYgKHl5LmJlZ2luID09PSB0cnVlKSB7IHl5LmJlZ2luID0gZmFsc2U7IHJldHVybiA3Njt9IGVsc2UgeyByZXR1cm4gODM7IH0gXHJcbmJyZWFrO1xyXG5jYXNlIDQ5OiB0aGlzLmJlZ2luKFwiY1wiKTsgcmV0dXJuIDIyOyBcclxuYnJlYWs7XHJcbmNhc2UgNTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBvcFN0YXRlKCkgPT09IFwiY1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxlbiA9IHRoaXMuc3RhdGVTdGFja1NpemUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudG9wU3RhdGUoKSA9PT0gJ3J1bicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlbiA9IGxlbiAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFpbFN0YWNrID0gdGhpcy50b3BTdGF0ZShsZW4gLSAyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiog6YGH5YiwI3NldChhID0gYinmi6zlj7fnu5PmnZ/lkI7nu5PmnZ/nirbmgIFoKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGVuID09PSAyICYmIHRhaWxTdGFjayA9PT0gXCJoXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BTdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobGVuID09PSAzICYmIHRhaWxTdGFjayA9PT0gXCJtdVwiICYmICB0aGlzLnRvcFN0YXRlKGxlbiAtIDMpID09PSBcImhcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXNzdWUjNyAkZm9vI2lmKCRhKS4uLiNlbmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAyMzsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDgzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbmJyZWFrO1xyXG5jYXNlIDUxOiB0aGlzLmJlZ2luKFwiaVwiKTsgcmV0dXJuIDg0OyBcclxuYnJlYWs7XHJcbmNhc2UgNTI6IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wb3BTdGF0ZSgpID09PSBcImlcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA4NTsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDgzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuYnJlYWs7XHJcbmNhc2UgNTM6IHJldHVybiA5NDsgXHJcbmJyZWFrO1xyXG5jYXNlIDU0OiByZXR1cm4gODE7IFxyXG5icmVhaztcclxuY2FzZSA1NTogcmV0dXJuIDkwOyBcclxuYnJlYWs7XHJcbmNhc2UgNTY6IHJldHVybiA1MDsgXHJcbmJyZWFrO1xyXG5jYXNlIDU3OiB5eV8ueXl0ZXh0ID0geXlfLnl5dGV4dC5zdWJzdHIoMSwgeXlfLnl5bGVuZy0yKS5yZXBsYWNlKC9cXFxcXCIvZywnXCInKTsgcmV0dXJuIDkyOyBcclxuYnJlYWs7XHJcbmNhc2UgNTg6IHl5Xy55eXRleHQgPSB5eV8ueXl0ZXh0LnN1YnN0cigxLCB5eV8ueXlsZW5nLTIpLnJlcGxhY2UoL1xcXFwnL2csXCInXCIpOyByZXR1cm4gOTE7IFxyXG5icmVhaztcclxuY2FzZSA1OTogcmV0dXJuIDczOyBcclxuYnJlYWs7XHJcbmNhc2UgNjA6IHJldHVybiA3MzsgXHJcbmJyZWFrO1xyXG5jYXNlIDYxOiByZXR1cm4gNzM7IFxyXG5icmVhaztcclxuY2FzZSA2MjogcmV0dXJuIDg5OyBcclxuYnJlYWs7XHJcbmNhc2UgNjM6IHJldHVybiAzNjsgXHJcbmJyZWFrO1xyXG5jYXNlIDY0OiB0aGlzLmJlZ2luKFwicnVuXCIpOyByZXR1cm4gMzY7IFxyXG5icmVhaztcclxuY2FzZSA2NTogdGhpcy5iZWdpbignaCcpOyByZXR1cm4gMjA7IFxyXG5icmVhaztcclxuY2FzZSA2NjogdGhpcy5wb3BTdGF0ZSgpOyByZXR1cm4gODM7IFxyXG5icmVhaztcclxuY2FzZSA2NzogdGhpcy5wb3BTdGF0ZSgpOyByZXR1cm4gODM7IFxyXG5icmVhaztcclxuY2FzZSA2ODogdGhpcy5wb3BTdGF0ZSgpOyByZXR1cm4gODM7IFxyXG5icmVhaztcclxuY2FzZSA2OTogdGhpcy5wb3BTdGF0ZSgpOyByZXR1cm4gNDsgXHJcbmJyZWFrO1xyXG5jYXNlIDcwOiByZXR1cm4gNDsgXHJcbmJyZWFrO1xyXG59XHJcbn0sXHJcbnJ1bGVzOiBbL14oPzpbXiNdKj8oPz1cXCQpKS8sL14oPzpbXlxcJF0qPyg/PSMpKS8sL14oPzpbXlxceDAwXSspLywvXig/OiNcXCpbXFxzXFxTXSs/XFwqIykvLC9eKD86I1xcW1xcW1tcXHNcXFNdKz9cXF1cXF0jKS8sL14oPzojI1teXFxuXSopLywvXig/OiNAKS8sL14oPzojKD89W2EtekEtWntdKSkvLC9eKD86c2V0WyBdKig/PVteYS16QS1aMC05X10rKSkvLC9eKD86aWZbIF0qKD89W15hLXpBLVowLTlfXSspKS8sL14oPzplbHNlaWZbIF0qKD89W15hLXpBLVowLTlfXSspKS8sL14oPzplbHNlXFxiKS8sL14oPzpcXHtlbHNlXFx9KS8sL14oPzplbmRcXGIpLywvXig/Olxce2VuZFxcfSkvLC9eKD86YnJlYWtcXGIpLywvXig/OmZvcmVhY2hbIF0qKD89W15hLXpBLVowLTlfXSspKS8sL14oPzpub2VzY2FwZSg/PVteYS16QS1aMC05X10rKSkvLC9eKD86ZGVmaW5lWyBdKig/PVteYS16QS1aMC05X10rKSkvLC9eKD86bWFjcm9bIF0qKD89W15hLXpBLVowLTlfXSspKS8sL14oPzppblxcYikvLC9eKD86WyVcXCtcXC1cXCovXSkvLC9eKD86PD0pLywvXig/OmxlXFxiKS8sL14oPzo+PSkvLC9eKD86Z2VcXGIpLywvXig/Ols+PF0pLywvXig/Omd0XFxiKS8sL14oPzpsdFxcYikvLC9eKD86PT0pLywvXig/OmVxXFxiKS8sL14oPzpcXHxcXHwpLywvXig/Om9yXFxiKS8sL14oPzomJikvLC9eKD86YW5kXFxiKS8sL14oPzohPSkvLC9eKD86bmVcXGIpLywvXig/Om5vdFxcYikvLC9eKD86XFwkISg/PVt7YS16QS1aX10pKS8sL14oPzpcXCQoPz1be2EtekEtWl9dKSkvLC9eKD86ISkvLC9eKD86PSkvLC9eKD86WyBdKyg/PVteLF0pKS8sL14oPzpcXHMrKS8sL14oPzpcXHspLywvXig/OlxcfSkvLC9eKD86OltcXHNdKikvLC9eKD86XFx7W1xcc10qKS8sL14oPzpbXFxzXSpcXH0pLywvXig/OlxcKFtcXHNdKig/PVskJ1wiXFxbXFx7XFwtMC05XFx3KCkhXSkpLywvXig/OlxcKSkvLC9eKD86XFxbW1xcc10qKD89W1xcLSRcIicwLTl7XFxbXFxdXSspKS8sL14oPzpcXF0pLywvXig/OlxcLlxcLikvLC9eKD86XFwuKD89W2EtekEtWl9dKSkvLC9eKD86XFwuKD89W1xcZF0pKS8sL14oPzosWyBdKikvLC9eKD86XCIoXFxcXFwifFteXFxcIl0pKlwiKS8sL14oPzonKFxcXFwnfFteXFwnXSkqJykvLC9eKD86bnVsbFxcYikvLC9eKD86ZmFsc2VcXGIpLywvXig/OnRydWVcXGIpLywvXig/OlswLTldKykvLC9eKD86W19hLXpBLVpdW2EtekEtWjAtOV9cXC1dKikvLC9eKD86W19hLXpBLVpdW2EtekEtWjAtOV9cXC1dKlsgXSooPz1cXCgpKS8sL14oPzojKS8sL14oPzouKS8sL14oPzpcXHMrKS8sL14oPzpbXFwkI10pLywvXig/OiQpLywvXig/OiQpL10sXHJcbmNvbmRpdGlvbnM6IHtcIm11XCI6e1wicnVsZXNcIjpbNSwzOCwzOSw0Nyw0OCw0OSw1MCw1MSw1Miw1NCw2Myw2NSw2Niw2Nyw2OV0sXCJpbmNsdXNpdmVcIjpmYWxzZX0sXCJjXCI6e1wicnVsZXNcIjpbMjAsMjEsMjIsMjMsMjQsMjUsMjYsMjcsMjgsMjksMzAsMzEsMzIsMzMsMzQsMzUsMzYsMzcsMzgsMzksNDAsNDEsNDIsNDMsNDQsNDUsNDYsNDksNTAsNTEsNTIsNTQsNTUsNTYsNTcsNTgsNTksNjAsNjEsNjIsNjNdLFwiaW5jbHVzaXZlXCI6ZmFsc2V9LFwiaVwiOntcInJ1bGVzXCI6WzIwLDIxLDIyLDIzLDI0LDI1LDI2LDI3LDI4LDI5LDMwLDMxLDMyLDMzLDM0LDM1LDM2LDM3LDM4LDM5LDQwLDQxLDQzLDQ0LDQ0LDQ1LDQ1LDQ2LDQ5LDUwLDUxLDUyLDUzLDU0LDU1LDU2LDU3LDU4LDU5LDYwLDYxLDYyLDYzXSxcImluY2x1c2l2ZVwiOmZhbHNlfSxcImhcIjp7XCJydWxlc1wiOlszLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDM4LDM5LDQwLDQxLDQ2LDQ5LDUwLDUxLDUyLDU0LDYyLDY0LDY2LDY3LDY5XSxcImluY2x1c2l2ZVwiOmZhbHNlfSxcImVzY1wiOntcInJ1bGVzXCI6WzY4XSxcImluY2x1c2l2ZVwiOmZhbHNlfSxcInJ1blwiOntcInJ1bGVzXCI6WzM4LDM5LDQwLDQyLDQzLDQ0LDQ1LDQ2LDQ5LDUwLDUxLDUyLDU0LDU1LDU2LDU3LDU4LDU5LDYwLDYxLDYyLDYzLDY2LDY3LDY5XSxcImluY2x1c2l2ZVwiOmZhbHNlfSxcIklOSVRJQUxcIjp7XCJydWxlc1wiOlswLDEsMiw3MF0sXCJpbmNsdXNpdmVcIjp0cnVlfX1cclxufSk7XHJcbnJldHVybiBsZXhlcjtcclxufSkoKTtcclxucGFyc2VyLmxleGVyID0gbGV4ZXI7XHJcbmZ1bmN0aW9uIFBhcnNlciAoKSB7XHJcbiAgdGhpcy55eSA9IHt9O1xyXG59XHJcblBhcnNlci5wcm90b3R5cGUgPSBwYXJzZXI7cGFyc2VyLlBhcnNlciA9IFBhcnNlcjtcclxucmV0dXJuIG5ldyBQYXJzZXI7XHJcbn0pKCk7XHJcblxyXG5cclxuaWYgKHR5cGVvZiByZXF1aXJlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuZXhwb3J0cy5wYXJzZXIgPSB2ZWxvY2l0eTtcclxuZXhwb3J0cy5QYXJzZXIgPSB2ZWxvY2l0eS5QYXJzZXI7XHJcbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB2ZWxvY2l0eS5wYXJzZS5hcHBseSh2ZWxvY2l0eSwgYXJndW1lbnRzKTsgfTtcclxuZXhwb3J0cy5tYWluID0gZnVuY3Rpb24gY29tbW9uanNNYWluIChhcmdzKSB7XHJcbiAgICBpZiAoIWFyZ3NbMV0pIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnVXNhZ2U6ICcrYXJnc1swXSsnIEZJTEUnKTtcclxuICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICB9XHJcbiAgICB2YXIgc291cmNlID0gcmVxdWlyZSgnZnMnKS5yZWFkRmlsZVN5bmMocmVxdWlyZSgncGF0aCcpLm5vcm1hbGl6ZShhcmdzWzFdKSwgXCJ1dGY4XCIpO1xyXG4gICAgcmV0dXJuIGV4cG9ydHMucGFyc2VyLnBhcnNlKHNvdXJjZSk7XHJcbn07XHJcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiByZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xyXG4gIGV4cG9ydHMubWFpbihwcm9jZXNzLmFyZ3Yuc2xpY2UoMSkpO1xyXG59XHJcbn0iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIHV0aWxzID0ge307XHJcblxyXG5bJ2ZvckVhY2gnLCAnc29tZScsICdldmVyeScsICdmaWx0ZXInLCAnbWFwJ10uZm9yRWFjaChmdW5jdGlvbihmbk5hbWUpIHtcclxuICB1dGlsc1tmbk5hbWVdID0gZnVuY3Rpb24oYXJyLCBmbiwgY29udGV4dCkge1xyXG4gICAgaWYgKCFhcnIgfHwgdHlwZW9mIGFyciA9PT0gJ3N0cmluZycpIHJldHVybiBhcnI7XHJcbiAgICBjb250ZXh0ID0gY29udGV4dCB8fCB0aGlzO1xyXG4gICAgaWYgKGFycltmbk5hbWVdKSB7XHJcbiAgICAgIHJldHVybiBhcnJbZm5OYW1lXShmbiwgY29udGV4dCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFycik7XHJcbiAgICAgIHJldHVybiBrZXlzW2ZuTmFtZV0oZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIGZuLmNhbGwoY29udGV4dCwgYXJyW2tleV0sIGtleSwgYXJyKTtcclxuICAgICAgfSwgY29udGV4dCk7XHJcbiAgICB9XHJcbiAgfTtcclxufSk7XHJcblxyXG52YXIgbnVtYmVyID0gMDtcclxudXRpbHMuZ3VpZCA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiBudW1iZXIrKztcclxufTtcclxuXHJcbnV0aWxzLm1peGluID0gZnVuY3Rpb24odG8sIGZyb20pIHtcclxuICB1dGlscy5mb3JFYWNoKGZyb20sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XHJcbiAgICBpZiAodXRpbHMuaXNBcnJheSh2YWwpIHx8IHV0aWxzLmlzT2JqZWN0KHZhbCkpIHtcclxuICAgICAgdG9ba2V5XSA9IHV0aWxzLm1peGluKHZhbCwgdG9ba2V5XSB8fCB7fSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0b1trZXldID0gdmFsO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiB0bztcclxufTtcclxuXHJcbnV0aWxzLmlzQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcclxuICByZXR1cm4ge30udG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xyXG59O1xyXG5cclxudXRpbHMuaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcclxuICByZXR1cm4ge30udG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJztcclxufTtcclxuXHJcbnV0aWxzLmluZGV4T2YgPSBmdW5jdGlvbihlbGVtLCBhcnIpIHtcclxuICBpZiAodXRpbHMuaXNBcnJheShhcnIpKSB7XHJcbiAgICByZXR1cm4gYXJyLmluZGV4T2YoZWxlbSk7XHJcbiAgfVxyXG59O1xyXG5cclxudXRpbHMua2V5cyA9IE9iamVjdC5rZXlzO1xyXG51dGlscy5ub3cgID0gRGF0ZS5ub3c7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbnZhciBDb21waWxlID0gcmVxdWlyZSgnLi9jb21waWxlLycpO1xyXG52YXIgSGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXIvaW5kZXgnKTtcclxudmFyIHBhcnNlID0gcmVxdWlyZSgnLi9wYXJzZScpO1xyXG5cclxuQ29tcGlsZS5wYXJzZSA9IHBhcnNlO1xyXG5cclxudmFyIFZlbG9jaXR5ID0ge1xyXG4gIHBhcnNlOiBwYXJzZSxcclxuICBDb21waWxlOiBDb21waWxlLFxyXG4gIEhlbHBlcjogSGVscGVyXHJcbn07XHJcblxyXG5WZWxvY2l0eS5yZW5kZXIgPSBmdW5jdGlvbih0ZW1wbGF0ZSwgY29udGV4dCwgbWFjcm9zLCBjb25maWcpIHtcclxuXHJcbiAgdmFyIGFzdHMgPSBwYXJzZSh0ZW1wbGF0ZSk7XHJcbiAgdmFyIGNvbXBpbGUgPSBuZXcgQ29tcGlsZShhc3RzLCBjb25maWcpO1xyXG4gIHJldHVybiBjb21waWxlLnJlbmRlcihjb250ZXh0LCBtYWNyb3MpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWZWxvY2l0eTtcclxuIiwiLyogKGlnbm9yZWQpICovIiwiLyogKGlnbm9yZWQpICovIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbl9fd2VicGFja19yZXF1aXJlX18uYyA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfXztcblxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIiIsIi8vIG1vZHVsZSBjYWNoZSBhcmUgdXNlZCBzbyBlbnRyeSBpbmxpbmluZyBpcyBkaXNhYmxlZFxuLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2luZGV4LmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9