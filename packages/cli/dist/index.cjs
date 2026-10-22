#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/fast-glob/out/utils/array.js
var require_array = __commonJS({
  "../../node_modules/fast-glob/out/utils/array.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.splitWhen = exports2.flatten = void 0;
    function flatten(items) {
      return items.reduce((collection, item) => [].concat(collection, item), []);
    }
    exports2.flatten = flatten;
    function splitWhen(items, predicate) {
      const result = [[]];
      let groupIndex = 0;
      for (const item of items) {
        if (predicate(item)) {
          groupIndex++;
          result[groupIndex] = [];
        } else {
          result[groupIndex].push(item);
        }
      }
      return result;
    }
    exports2.splitWhen = splitWhen;
  }
});

// ../../node_modules/fast-glob/out/utils/errno.js
var require_errno = __commonJS({
  "../../node_modules/fast-glob/out/utils/errno.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isEnoentCodeError = void 0;
    function isEnoentCodeError(error) {
      return error.code === "ENOENT";
    }
    exports2.isEnoentCodeError = isEnoentCodeError;
  }
});

// ../../node_modules/fast-glob/out/utils/fs.js
var require_fs = __commonJS({
  "../../node_modules/fast-glob/out/utils/fs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createDirentFromStats = void 0;
    var DirentFromStats = class {
      constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
      }
    };
    function createDirentFromStats(name, stats) {
      return new DirentFromStats(name, stats);
    }
    exports2.createDirentFromStats = createDirentFromStats;
  }
});

// ../../node_modules/fast-glob/out/utils/path.js
var require_path = __commonJS({
  "../../node_modules/fast-glob/out/utils/path.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.convertPosixPathToPattern = exports2.convertWindowsPathToPattern = exports2.convertPathToPattern = exports2.escapePosixPath = exports2.escapeWindowsPath = exports2.escape = exports2.removeLeadingDotSegment = exports2.makeAbsolute = exports2.unixify = void 0;
    var os = require("os");
    var path4 = require("path");
    var IS_WINDOWS_PLATFORM = os.platform() === "win32";
    var LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2;
    var POSIX_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\()|\\(?![!()*+?@[\]{|}]))/g;
    var WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()[\]{}]|^!|[!+@](?=\())/g;
    var DOS_DEVICE_PATH_RE = /^\\\\([.?])/;
    var WINDOWS_BACKSLASHES_RE = /\\(?![!()+@[\]{}])/g;
    function unixify(filepath) {
      return filepath.replace(/\\/g, "/");
    }
    exports2.unixify = unixify;
    function makeAbsolute(cwd, filepath) {
      return path4.resolve(cwd, filepath);
    }
    exports2.makeAbsolute = makeAbsolute;
    function removeLeadingDotSegment(entry) {
      if (entry.charAt(0) === ".") {
        const secondCharactery = entry.charAt(1);
        if (secondCharactery === "/" || secondCharactery === "\\") {
          return entry.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
        }
      }
      return entry;
    }
    exports2.removeLeadingDotSegment = removeLeadingDotSegment;
    exports2.escape = IS_WINDOWS_PLATFORM ? escapeWindowsPath : escapePosixPath;
    function escapeWindowsPath(pattern) {
      return pattern.replace(WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
    }
    exports2.escapeWindowsPath = escapeWindowsPath;
    function escapePosixPath(pattern) {
      return pattern.replace(POSIX_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
    }
    exports2.escapePosixPath = escapePosixPath;
    exports2.convertPathToPattern = IS_WINDOWS_PLATFORM ? convertWindowsPathToPattern : convertPosixPathToPattern;
    function convertWindowsPathToPattern(filepath) {
      return escapeWindowsPath(filepath).replace(DOS_DEVICE_PATH_RE, "//$1").replace(WINDOWS_BACKSLASHES_RE, "/");
    }
    exports2.convertWindowsPathToPattern = convertWindowsPathToPattern;
    function convertPosixPathToPattern(filepath) {
      return escapePosixPath(filepath);
    }
    exports2.convertPosixPathToPattern = convertPosixPathToPattern;
  }
});

// ../../node_modules/is-extglob/index.js
var require_is_extglob = __commonJS({
  "../../node_modules/is-extglob/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function isExtglob(str) {
      if (typeof str !== "string" || str === "") {
        return false;
      }
      var match;
      while (match = /(\\).|([@?!+*]\(.*\))/g.exec(str)) {
        if (match[2]) return true;
        str = str.slice(match.index + match[0].length);
      }
      return false;
    };
  }
});

// ../../node_modules/is-glob/index.js
var require_is_glob = __commonJS({
  "../../node_modules/is-glob/index.js"(exports2, module2) {
    "use strict";
    var isExtglob = require_is_extglob();
    var chars = { "{": "}", "(": ")", "[": "]" };
    var strictCheck = function(str) {
      if (str[0] === "!") {
        return true;
      }
      var index = 0;
      var pipeIndex = -2;
      var closeSquareIndex = -2;
      var closeCurlyIndex = -2;
      var closeParenIndex = -2;
      var backSlashIndex = -2;
      while (index < str.length) {
        if (str[index] === "*") {
          return true;
        }
        if (str[index + 1] === "?" && /[\].+)]/.test(str[index])) {
          return true;
        }
        if (closeSquareIndex !== -1 && str[index] === "[" && str[index + 1] !== "]") {
          if (closeSquareIndex < index) {
            closeSquareIndex = str.indexOf("]", index);
          }
          if (closeSquareIndex > index) {
            if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
              return true;
            }
            backSlashIndex = str.indexOf("\\", index);
            if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
              return true;
            }
          }
        }
        if (closeCurlyIndex !== -1 && str[index] === "{" && str[index + 1] !== "}") {
          closeCurlyIndex = str.indexOf("}", index);
          if (closeCurlyIndex > index) {
            backSlashIndex = str.indexOf("\\", index);
            if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) {
              return true;
            }
          }
        }
        if (closeParenIndex !== -1 && str[index] === "(" && str[index + 1] === "?" && /[:!=]/.test(str[index + 2]) && str[index + 3] !== ")") {
          closeParenIndex = str.indexOf(")", index);
          if (closeParenIndex > index) {
            backSlashIndex = str.indexOf("\\", index);
            if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
              return true;
            }
          }
        }
        if (pipeIndex !== -1 && str[index] === "(" && str[index + 1] !== "|") {
          if (pipeIndex < index) {
            pipeIndex = str.indexOf("|", index);
          }
          if (pipeIndex !== -1 && str[pipeIndex + 1] !== ")") {
            closeParenIndex = str.indexOf(")", pipeIndex);
            if (closeParenIndex > pipeIndex) {
              backSlashIndex = str.indexOf("\\", pipeIndex);
              if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
                return true;
              }
            }
          }
        }
        if (str[index] === "\\") {
          var open = str[index + 1];
          index += 2;
          var close = chars[open];
          if (close) {
            var n = str.indexOf(close, index);
            if (n !== -1) {
              index = n + 1;
            }
          }
          if (str[index] === "!") {
            return true;
          }
        } else {
          index++;
        }
      }
      return false;
    };
    var relaxedCheck = function(str) {
      if (str[0] === "!") {
        return true;
      }
      var index = 0;
      while (index < str.length) {
        if (/[*?{}()[\]]/.test(str[index])) {
          return true;
        }
        if (str[index] === "\\") {
          var open = str[index + 1];
          index += 2;
          var close = chars[open];
          if (close) {
            var n = str.indexOf(close, index);
            if (n !== -1) {
              index = n + 1;
            }
          }
          if (str[index] === "!") {
            return true;
          }
        } else {
          index++;
        }
      }
      return false;
    };
    module2.exports = function isGlob(str, options) {
      if (typeof str !== "string" || str === "") {
        return false;
      }
      if (isExtglob(str)) {
        return true;
      }
      var check = strictCheck;
      if (options && options.strict === false) {
        check = relaxedCheck;
      }
      return check(str);
    };
  }
});

// ../../node_modules/glob-parent/index.js
var require_glob_parent = __commonJS({
  "../../node_modules/glob-parent/index.js"(exports2, module2) {
    "use strict";
    var isGlob = require_is_glob();
    var pathPosixDirname = require("path").posix.dirname;
    var isWin32 = require("os").platform() === "win32";
    var slash = "/";
    var backslash = /\\/g;
    var enclosure = /[\{\[].*[\}\]]$/;
    var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
    var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;
    module2.exports = function globParent(str, opts) {
      var options = Object.assign({ flipBackslashes: true }, opts);
      if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) {
        str = str.replace(backslash, slash);
      }
      if (enclosure.test(str)) {
        str += slash;
      }
      str += "a";
      do {
        str = pathPosixDirname(str);
      } while (isGlob(str) || globby.test(str));
      return str.replace(escaped, "$1");
    };
  }
});

// ../../node_modules/braces/lib/utils.js
var require_utils = __commonJS({
  "../../node_modules/braces/lib/utils.js"(exports2) {
    "use strict";
    exports2.isInteger = (num) => {
      if (typeof num === "number") {
        return Number.isInteger(num);
      }
      if (typeof num === "string" && num.trim() !== "") {
        return Number.isInteger(Number(num));
      }
      return false;
    };
    exports2.find = (node, type) => node.nodes.find((node2) => node2.type === type);
    exports2.exceedsLimit = (min, max, step = 1, limit) => {
      if (limit === false) return false;
      if (!exports2.isInteger(min) || !exports2.isInteger(max)) return false;
      return (Number(max) - Number(min)) / Number(step) >= limit;
    };
    exports2.escapeNode = (block, n = 0, type) => {
      const node = block.nodes[n];
      if (!node) return;
      if (type && node.type === type || node.type === "open" || node.type === "close") {
        if (node.escaped !== true) {
          node.value = "\\" + node.value;
          node.escaped = true;
        }
      }
    };
    exports2.encloseBrace = (node) => {
      if (node.type !== "brace") return false;
      if (node.commas >> 0 + node.ranges >> 0 === 0) {
        node.invalid = true;
        return true;
      }
      return false;
    };
    exports2.isInvalidBrace = (block) => {
      if (block.type !== "brace") return false;
      if (block.invalid === true || block.dollar) return true;
      if (block.commas >> 0 + block.ranges >> 0 === 0) {
        block.invalid = true;
        return true;
      }
      if (block.open !== true || block.close !== true) {
        block.invalid = true;
        return true;
      }
      return false;
    };
    exports2.isOpenOrClose = (node) => {
      if (node.type === "open" || node.type === "close") {
        return true;
      }
      return node.open === true || node.close === true;
    };
    exports2.reduce = (nodes) => nodes.reduce((acc, node) => {
      if (node.type === "text") acc.push(node.value);
      if (node.type === "range") node.type = "text";
      return acc;
    }, []);
    exports2.flatten = (...args) => {
      const result = [];
      const flat = (arr) => {
        for (let i = 0; i < arr.length; i++) {
          const ele = arr[i];
          if (Array.isArray(ele)) {
            flat(ele);
            continue;
          }
          if (ele !== void 0) {
            result.push(ele);
          }
        }
        return result;
      };
      flat(args);
      return result;
    };
  }
});

// ../../node_modules/braces/lib/stringify.js
var require_stringify = __commonJS({
  "../../node_modules/braces/lib/stringify.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = (ast, options = {}) => {
      const stringify = (node, parent = {}) => {
        const invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
        const invalidNode = node.invalid === true && options.escapeInvalid === true;
        let output = "";
        if (node.value) {
          if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
            return "\\" + node.value;
          }
          return node.value;
        }
        if (node.value) {
          return node.value;
        }
        if (node.nodes) {
          for (const child of node.nodes) {
            output += stringify(child);
          }
        }
        return output;
      };
      return stringify(ast);
    };
  }
});

// ../../node_modules/is-number/index.js
var require_is_number = __commonJS({
  "../../node_modules/is-number/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function(num) {
      if (typeof num === "number") {
        return num - num === 0;
      }
      if (typeof num === "string" && num.trim() !== "") {
        return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
      }
      return false;
    };
  }
});

// ../../node_modules/to-regex-range/index.js
var require_to_regex_range = __commonJS({
  "../../node_modules/to-regex-range/index.js"(exports2, module2) {
    "use strict";
    var isNumber = require_is_number();
    var toRegexRange = (min, max, options) => {
      if (isNumber(min) === false) {
        throw new TypeError("toRegexRange: expected the first argument to be a number");
      }
      if (max === void 0 || min === max) {
        return String(min);
      }
      if (isNumber(max) === false) {
        throw new TypeError("toRegexRange: expected the second argument to be a number.");
      }
      let opts = { relaxZeros: true, ...options };
      if (typeof opts.strictZeros === "boolean") {
        opts.relaxZeros = opts.strictZeros === false;
      }
      let relax = String(opts.relaxZeros);
      let shorthand = String(opts.shorthand);
      let capture = String(opts.capture);
      let wrap = String(opts.wrap);
      let cacheKey = min + ":" + max + "=" + relax + shorthand + capture + wrap;
      if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
        return toRegexRange.cache[cacheKey].result;
      }
      let a = Math.min(min, max);
      let b = Math.max(min, max);
      if (Math.abs(a - b) === 1) {
        let result = min + "|" + max;
        if (opts.capture) {
          return `(${result})`;
        }
        if (opts.wrap === false) {
          return result;
        }
        return `(?:${result})`;
      }
      let isPadded = hasPadding(min) || hasPadding(max);
      let state = { min, max, a, b };
      let positives = [];
      let negatives = [];
      if (isPadded) {
        state.isPadded = isPadded;
        state.maxLen = String(state.max).length;
      }
      if (a < 0) {
        let newMin = b < 0 ? Math.abs(b) : 1;
        negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
        a = state.a = 0;
      }
      if (b >= 0) {
        positives = splitToPatterns(a, b, state, opts);
      }
      state.negatives = negatives;
      state.positives = positives;
      state.result = collatePatterns(negatives, positives, opts);
      if (opts.capture === true) {
        state.result = `(${state.result})`;
      } else if (opts.wrap !== false && positives.length + negatives.length > 1) {
        state.result = `(?:${state.result})`;
      }
      toRegexRange.cache[cacheKey] = state;
      return state.result;
    };
    function collatePatterns(neg, pos, options) {
      let onlyNegative = filterPatterns(neg, pos, "-", false, options) || [];
      let onlyPositive = filterPatterns(pos, neg, "", false, options) || [];
      let intersected = filterPatterns(neg, pos, "-?", true, options) || [];
      let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
      return subpatterns.join("|");
    }
    function splitToRanges(min, max) {
      let nines = 1;
      let zeros = 1;
      let stop = countNines(min, nines);
      let stops = /* @__PURE__ */ new Set([max]);
      while (min <= stop && stop <= max) {
        stops.add(stop);
        nines += 1;
        stop = countNines(min, nines);
      }
      stop = countZeros(max + 1, zeros) - 1;
      while (min < stop && stop <= max) {
        stops.add(stop);
        zeros += 1;
        stop = countZeros(max + 1, zeros) - 1;
      }
      stops = [...stops];
      stops.sort(compare);
      return stops;
    }
    function rangeToPattern(start, stop, options) {
      if (start === stop) {
        return { pattern: start, count: [], digits: 0 };
      }
      let zipped = zip(start, stop);
      let digits = zipped.length;
      let pattern = "";
      let count = 0;
      for (let i = 0; i < digits; i++) {
        let [startDigit, stopDigit] = zipped[i];
        if (startDigit === stopDigit) {
          pattern += startDigit;
        } else if (startDigit !== "0" || stopDigit !== "9") {
          pattern += toCharacterClass(startDigit, stopDigit, options);
        } else {
          count++;
        }
      }
      if (count) {
        pattern += options.shorthand === true ? "\\d" : "[0-9]";
      }
      return { pattern, count: [count], digits };
    }
    function splitToPatterns(min, max, tok, options) {
      let ranges = splitToRanges(min, max);
      let tokens = [];
      let start = min;
      let prev;
      for (let i = 0; i < ranges.length; i++) {
        let max2 = ranges[i];
        let obj = rangeToPattern(String(start), String(max2), options);
        let zeros = "";
        if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
          if (prev.count.length > 1) {
            prev.count.pop();
          }
          prev.count.push(obj.count[0]);
          prev.string = prev.pattern + toQuantifier(prev.count);
          start = max2 + 1;
          continue;
        }
        if (tok.isPadded) {
          zeros = padZeros(max2, tok, options);
        }
        obj.string = zeros + obj.pattern + toQuantifier(obj.count);
        tokens.push(obj);
        start = max2 + 1;
        prev = obj;
      }
      return tokens;
    }
    function filterPatterns(arr, comparison, prefix, intersection, options) {
      let result = [];
      for (let ele of arr) {
        let { string } = ele;
        if (!intersection && !contains(comparison, "string", string)) {
          result.push(prefix + string);
        }
        if (intersection && contains(comparison, "string", string)) {
          result.push(prefix + string);
        }
      }
      return result;
    }
    function zip(a, b) {
      let arr = [];
      for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
      return arr;
    }
    function compare(a, b) {
      return a > b ? 1 : b > a ? -1 : 0;
    }
    function contains(arr, key, val) {
      return arr.some((ele) => ele[key] === val);
    }
    function countNines(min, len) {
      return Number(String(min).slice(0, -len) + "9".repeat(len));
    }
    function countZeros(integer, zeros) {
      return integer - integer % Math.pow(10, zeros);
    }
    function toQuantifier(digits) {
      let [start = 0, stop = ""] = digits;
      if (stop || start > 1) {
        return `{${start + (stop ? "," + stop : "")}}`;
      }
      return "";
    }
    function toCharacterClass(a, b, options) {
      return `[${a}${b - a === 1 ? "" : "-"}${b}]`;
    }
    function hasPadding(str) {
      return /^-?(0+)\d/.test(str);
    }
    function padZeros(value, tok, options) {
      if (!tok.isPadded) {
        return value;
      }
      let diff = Math.abs(tok.maxLen - String(value).length);
      let relax = options.relaxZeros !== false;
      switch (diff) {
        case 0:
          return "";
        case 1:
          return relax ? "0?" : "0";
        case 2:
          return relax ? "0{0,2}" : "00";
        default: {
          return relax ? `0{0,${diff}}` : `0{${diff}}`;
        }
      }
    }
    toRegexRange.cache = {};
    toRegexRange.clearCache = () => toRegexRange.cache = {};
    module2.exports = toRegexRange;
  }
});

// ../../node_modules/fill-range/index.js
var require_fill_range = __commonJS({
  "../../node_modules/fill-range/index.js"(exports2, module2) {
    "use strict";
    var util = require("util");
    var toRegexRange = require_to_regex_range();
    var isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    var transform = (toNumber) => {
      return (value) => toNumber === true ? Number(value) : String(value);
    };
    var isValidValue = (value) => {
      return typeof value === "number" || typeof value === "string" && value !== "";
    };
    var isNumber = (num) => Number.isInteger(+num);
    var zeros = (input) => {
      let value = `${input}`;
      let index = -1;
      if (value[0] === "-") value = value.slice(1);
      if (value === "0") return false;
      while (value[++index] === "0") ;
      return index > 0;
    };
    var stringify = (start, end, options) => {
      if (typeof start === "string" || typeof end === "string") {
        return true;
      }
      return options.stringify === true;
    };
    var pad = (input, maxLength, toNumber) => {
      if (maxLength > 0) {
        let dash = input[0] === "-" ? "-" : "";
        if (dash) input = input.slice(1);
        input = dash + input.padStart(dash ? maxLength - 1 : maxLength, "0");
      }
      if (toNumber === false) {
        return String(input);
      }
      return input;
    };
    var toMaxLen = (input, maxLength) => {
      let negative = input[0] === "-" ? "-" : "";
      if (negative) {
        input = input.slice(1);
        maxLength--;
      }
      while (input.length < maxLength) input = "0" + input;
      return negative ? "-" + input : input;
    };
    var toSequence = (parts, options, maxLen) => {
      parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
      parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
      let prefix = options.capture ? "" : "?:";
      let positives = "";
      let negatives = "";
      let result;
      if (parts.positives.length) {
        positives = parts.positives.map((v) => toMaxLen(String(v), maxLen)).join("|");
      }
      if (parts.negatives.length) {
        negatives = `-(${prefix}${parts.negatives.map((v) => toMaxLen(String(v), maxLen)).join("|")})`;
      }
      if (positives && negatives) {
        result = `${positives}|${negatives}`;
      } else {
        result = positives || negatives;
      }
      if (options.wrap) {
        return `(${prefix}${result})`;
      }
      return result;
    };
    var toRange = (a, b, isNumbers, options) => {
      if (isNumbers) {
        return toRegexRange(a, b, { wrap: false, ...options });
      }
      let start = String.fromCharCode(a);
      if (a === b) return start;
      let stop = String.fromCharCode(b);
      return `[${start}-${stop}]`;
    };
    var toRegex = (start, end, options) => {
      if (Array.isArray(start)) {
        let wrap = options.wrap === true;
        let prefix = options.capture ? "" : "?:";
        return wrap ? `(${prefix}${start.join("|")})` : start.join("|");
      }
      return toRegexRange(start, end, options);
    };
    var rangeError = (...args) => {
      return new RangeError("Invalid range arguments: " + util.inspect(...args));
    };
    var invalidRange = (start, end, options) => {
      if (options.strictRanges === true) throw rangeError([start, end]);
      return [];
    };
    var invalidStep = (step, options) => {
      if (options.strictRanges === true) {
        throw new TypeError(`Expected step "${step}" to be a number`);
      }
      return [];
    };
    var fillNumbers = (start, end, step = 1, options = {}) => {
      let a = Number(start);
      let b = Number(end);
      if (!Number.isInteger(a) || !Number.isInteger(b)) {
        if (options.strictRanges === true) throw rangeError([start, end]);
        return [];
      }
      if (a === 0) a = 0;
      if (b === 0) b = 0;
      let descending = a > b;
      let startString = String(start);
      let endString = String(end);
      let stepString = String(step);
      step = Math.max(Math.abs(step), 1);
      let padded = zeros(startString) || zeros(endString) || zeros(stepString);
      let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
      let toNumber = padded === false && stringify(start, end, options) === false;
      let format = options.transform || transform(toNumber);
      if (options.toRegex && step === 1) {
        return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
      }
      let parts = { negatives: [], positives: [] };
      let push = (num) => parts[num < 0 ? "negatives" : "positives"].push(Math.abs(num));
      let range = [];
      let index = 0;
      while (descending ? a >= b : a <= b) {
        if (options.toRegex === true && step > 1) {
          push(a);
        } else {
          range.push(pad(format(a, index), maxLen, toNumber));
        }
        a = descending ? a - step : a + step;
        index++;
      }
      if (options.toRegex === true) {
        return step > 1 ? toSequence(parts, options, maxLen) : toRegex(range, null, { wrap: false, ...options });
      }
      return range;
    };
    var fillLetters = (start, end, step = 1, options = {}) => {
      if (!isNumber(start) && start.length > 1 || !isNumber(end) && end.length > 1) {
        return invalidRange(start, end, options);
      }
      let format = options.transform || ((val) => String.fromCharCode(val));
      let a = `${start}`.charCodeAt(0);
      let b = `${end}`.charCodeAt(0);
      let descending = a > b;
      let min = Math.min(a, b);
      let max = Math.max(a, b);
      if (options.toRegex && step === 1) {
        return toRange(min, max, false, options);
      }
      let range = [];
      let index = 0;
      while (descending ? a >= b : a <= b) {
        range.push(format(a, index));
        a = descending ? a - step : a + step;
        index++;
      }
      if (options.toRegex === true) {
        return toRegex(range, null, { wrap: false, options });
      }
      return range;
    };
    var fill = (start, end, step, options = {}) => {
      if (end == null && isValidValue(start)) {
        return [start];
      }
      if (!isValidValue(start) || !isValidValue(end)) {
        return invalidRange(start, end, options);
      }
      if (typeof step === "function") {
        return fill(start, end, 1, { transform: step });
      }
      if (isObject(step)) {
        return fill(start, end, 0, step);
      }
      let opts = { ...options };
      if (opts.capture === true) opts.wrap = true;
      step = step || opts.step || 1;
      if (!isNumber(step)) {
        if (step != null && !isObject(step)) return invalidStep(step, opts);
        return fill(start, end, 1, step);
      }
      if (isNumber(start) && isNumber(end)) {
        return fillNumbers(start, end, step, opts);
      }
      return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
    };
    module2.exports = fill;
  }
});

// ../../node_modules/braces/lib/compile.js
var require_compile = __commonJS({
  "../../node_modules/braces/lib/compile.js"(exports2, module2) {
    "use strict";
    var fill = require_fill_range();
    var utils = require_utils();
    var compile = (ast, options = {}) => {
      const walk = (node, parent = {}) => {
        const invalidBlock = utils.isInvalidBrace(parent);
        const invalidNode = node.invalid === true && options.escapeInvalid === true;
        const invalid = invalidBlock === true || invalidNode === true;
        const prefix = options.escapeInvalid === true ? "\\" : "";
        let output = "";
        if (node.isOpen === true) {
          return prefix + node.value;
        }
        if (node.isClose === true) {
          console.log("node.isClose", prefix, node.value);
          return prefix + node.value;
        }
        if (node.type === "open") {
          return invalid ? prefix + node.value : "(";
        }
        if (node.type === "close") {
          return invalid ? prefix + node.value : ")";
        }
        if (node.type === "comma") {
          return node.prev.type === "comma" ? "" : invalid ? node.value : "|";
        }
        if (node.value) {
          return node.value;
        }
        if (node.nodes && node.ranges > 0) {
          const args = utils.reduce(node.nodes);
          const range = fill(...args, { ...options, wrap: false, toRegex: true, strictZeros: true });
          if (range.length !== 0) {
            return args.length > 1 && range.length > 1 ? `(${range})` : range;
          }
        }
        if (node.nodes) {
          for (const child of node.nodes) {
            output += walk(child, node);
          }
        }
        return output;
      };
      return walk(ast);
    };
    module2.exports = compile;
  }
});

// ../../node_modules/braces/lib/expand.js
var require_expand = __commonJS({
  "../../node_modules/braces/lib/expand.js"(exports2, module2) {
    "use strict";
    var fill = require_fill_range();
    var stringify = require_stringify();
    var utils = require_utils();
    var append = (queue = "", stash = "", enclose = false) => {
      const result = [];
      queue = [].concat(queue);
      stash = [].concat(stash);
      if (!stash.length) return queue;
      if (!queue.length) {
        return enclose ? utils.flatten(stash).map((ele) => `{${ele}}`) : stash;
      }
      for (const item of queue) {
        if (Array.isArray(item)) {
          for (const value of item) {
            result.push(append(value, stash, enclose));
          }
        } else {
          for (let ele of stash) {
            if (enclose === true && typeof ele === "string") ele = `{${ele}}`;
            result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
          }
        }
      }
      return utils.flatten(result);
    };
    var expand = (ast, options = {}) => {
      const rangeLimit = options.rangeLimit === void 0 ? 1e3 : options.rangeLimit;
      const walk = (node, parent = {}) => {
        node.queue = [];
        let p = parent;
        let q = parent.queue;
        while (p.type !== "brace" && p.type !== "root" && p.parent) {
          p = p.parent;
          q = p.queue;
        }
        if (node.invalid || node.dollar) {
          q.push(append(q.pop(), stringify(node, options)));
          return;
        }
        if (node.type === "brace" && node.invalid !== true && node.nodes.length === 2) {
          q.push(append(q.pop(), ["{}"]));
          return;
        }
        if (node.nodes && node.ranges > 0) {
          const args = utils.reduce(node.nodes);
          if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
            throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");
          }
          let range = fill(...args, options);
          if (range.length === 0) {
            range = stringify(node, options);
          }
          q.push(append(q.pop(), range));
          node.nodes = [];
          return;
        }
        const enclose = utils.encloseBrace(node);
        let queue = node.queue;
        let block = node;
        while (block.type !== "brace" && block.type !== "root" && block.parent) {
          block = block.parent;
          queue = block.queue;
        }
        for (let i = 0; i < node.nodes.length; i++) {
          const child = node.nodes[i];
          if (child.type === "comma" && node.type === "brace") {
            if (i === 1) queue.push("");
            queue.push("");
            continue;
          }
          if (child.type === "close") {
            q.push(append(q.pop(), queue, enclose));
            continue;
          }
          if (child.value && child.type !== "open") {
            queue.push(append(queue.pop(), child.value));
            continue;
          }
          if (child.nodes) {
            walk(child, node);
          }
        }
        return queue;
      };
      return utils.flatten(walk(ast));
    };
    module2.exports = expand;
  }
});

// ../../node_modules/braces/lib/constants.js
var require_constants = __commonJS({
  "../../node_modules/braces/lib/constants.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      MAX_LENGTH: 1e4,
      // Digits
      CHAR_0: "0",
      /* 0 */
      CHAR_9: "9",
      /* 9 */
      // Alphabet chars.
      CHAR_UPPERCASE_A: "A",
      /* A */
      CHAR_LOWERCASE_A: "a",
      /* a */
      CHAR_UPPERCASE_Z: "Z",
      /* Z */
      CHAR_LOWERCASE_Z: "z",
      /* z */
      CHAR_LEFT_PARENTHESES: "(",
      /* ( */
      CHAR_RIGHT_PARENTHESES: ")",
      /* ) */
      CHAR_ASTERISK: "*",
      /* * */
      // Non-alphabetic chars.
      CHAR_AMPERSAND: "&",
      /* & */
      CHAR_AT: "@",
      /* @ */
      CHAR_BACKSLASH: "\\",
      /* \ */
      CHAR_BACKTICK: "`",
      /* ` */
      CHAR_CARRIAGE_RETURN: "\r",
      /* \r */
      CHAR_CIRCUMFLEX_ACCENT: "^",
      /* ^ */
      CHAR_COLON: ":",
      /* : */
      CHAR_COMMA: ",",
      /* , */
      CHAR_DOLLAR: "$",
      /* . */
      CHAR_DOT: ".",
      /* . */
      CHAR_DOUBLE_QUOTE: '"',
      /* " */
      CHAR_EQUAL: "=",
      /* = */
      CHAR_EXCLAMATION_MARK: "!",
      /* ! */
      CHAR_FORM_FEED: "\f",
      /* \f */
      CHAR_FORWARD_SLASH: "/",
      /* / */
      CHAR_HASH: "#",
      /* # */
      CHAR_HYPHEN_MINUS: "-",
      /* - */
      CHAR_LEFT_ANGLE_BRACKET: "<",
      /* < */
      CHAR_LEFT_CURLY_BRACE: "{",
      /* { */
      CHAR_LEFT_SQUARE_BRACKET: "[",
      /* [ */
      CHAR_LINE_FEED: "\n",
      /* \n */
      CHAR_NO_BREAK_SPACE: "\xA0",
      /* \u00A0 */
      CHAR_PERCENT: "%",
      /* % */
      CHAR_PLUS: "+",
      /* + */
      CHAR_QUESTION_MARK: "?",
      /* ? */
      CHAR_RIGHT_ANGLE_BRACKET: ">",
      /* > */
      CHAR_RIGHT_CURLY_BRACE: "}",
      /* } */
      CHAR_RIGHT_SQUARE_BRACKET: "]",
      /* ] */
      CHAR_SEMICOLON: ";",
      /* ; */
      CHAR_SINGLE_QUOTE: "'",
      /* ' */
      CHAR_SPACE: " ",
      /*   */
      CHAR_TAB: "	",
      /* \t */
      CHAR_UNDERSCORE: "_",
      /* _ */
      CHAR_VERTICAL_LINE: "|",
      /* | */
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\uFEFF"
      /* \uFEFF */
    };
  }
});

// ../../node_modules/braces/lib/parse.js
var require_parse = __commonJS({
  "../../node_modules/braces/lib/parse.js"(exports2, module2) {
    "use strict";
    var stringify = require_stringify();
    var {
      MAX_LENGTH,
      CHAR_BACKSLASH,
      /* \ */
      CHAR_BACKTICK,
      /* ` */
      CHAR_COMMA,
      /* , */
      CHAR_DOT,
      /* . */
      CHAR_LEFT_PARENTHESES,
      /* ( */
      CHAR_RIGHT_PARENTHESES,
      /* ) */
      CHAR_LEFT_CURLY_BRACE,
      /* { */
      CHAR_RIGHT_CURLY_BRACE,
      /* } */
      CHAR_LEFT_SQUARE_BRACKET,
      /* [ */
      CHAR_RIGHT_SQUARE_BRACKET,
      /* ] */
      CHAR_DOUBLE_QUOTE,
      /* " */
      CHAR_SINGLE_QUOTE,
      /* ' */
      CHAR_NO_BREAK_SPACE,
      CHAR_ZERO_WIDTH_NOBREAK_SPACE
    } = require_constants();
    var parse = (input, options = {}) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected a string");
      }
      const opts = options || {};
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      if (input.length > max) {
        throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
      }
      const ast = { type: "root", input, nodes: [] };
      const stack = [ast];
      let block = ast;
      let prev = ast;
      let brackets = 0;
      const length = input.length;
      let index = 0;
      let depth = 0;
      let value;
      const advance = () => input[index++];
      const push = (node) => {
        if (node.type === "text" && prev.type === "dot") {
          prev.type = "text";
        }
        if (prev && prev.type === "text" && node.type === "text") {
          prev.value += node.value;
          return;
        }
        block.nodes.push(node);
        node.parent = block;
        node.prev = prev;
        prev = node;
        return node;
      };
      push({ type: "bos" });
      while (index < length) {
        block = stack[stack.length - 1];
        value = advance();
        if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
          continue;
        }
        if (value === CHAR_BACKSLASH) {
          push({ type: "text", value: (options.keepEscaping ? value : "") + advance() });
          continue;
        }
        if (value === CHAR_RIGHT_SQUARE_BRACKET) {
          push({ type: "text", value: "\\" + value });
          continue;
        }
        if (value === CHAR_LEFT_SQUARE_BRACKET) {
          brackets++;
          let next;
          while (index < length && (next = advance())) {
            value += next;
            if (next === CHAR_LEFT_SQUARE_BRACKET) {
              brackets++;
              continue;
            }
            if (next === CHAR_BACKSLASH) {
              value += advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              brackets--;
              if (brackets === 0) {
                break;
              }
            }
          }
          push({ type: "text", value });
          continue;
        }
        if (value === CHAR_LEFT_PARENTHESES) {
          block = push({ type: "paren", nodes: [] });
          stack.push(block);
          push({ type: "text", value });
          continue;
        }
        if (value === CHAR_RIGHT_PARENTHESES) {
          if (block.type !== "paren") {
            push({ type: "text", value });
            continue;
          }
          block = stack.pop();
          push({ type: "text", value });
          block = stack[stack.length - 1];
          continue;
        }
        if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
          const open = value;
          let next;
          if (options.keepQuotes !== true) {
            value = "";
          }
          while (index < length && (next = advance())) {
            if (next === CHAR_BACKSLASH) {
              value += next + advance();
              continue;
            }
            if (next === open) {
              if (options.keepQuotes === true) value += next;
              break;
            }
            value += next;
          }
          push({ type: "text", value });
          continue;
        }
        if (value === CHAR_LEFT_CURLY_BRACE) {
          depth++;
          const dollar = prev.value && prev.value.slice(-1) === "$" || block.dollar === true;
          const brace = {
            type: "brace",
            open: true,
            close: false,
            dollar,
            depth,
            commas: 0,
            ranges: 0,
            nodes: []
          };
          block = push(brace);
          stack.push(block);
          push({ type: "open", value });
          continue;
        }
        if (value === CHAR_RIGHT_CURLY_BRACE) {
          if (block.type !== "brace") {
            push({ type: "text", value });
            continue;
          }
          const type = "close";
          block = stack.pop();
          block.close = true;
          push({ type, value });
          depth--;
          block = stack[stack.length - 1];
          continue;
        }
        if (value === CHAR_COMMA && depth > 0) {
          if (block.ranges > 0) {
            block.ranges = 0;
            const open = block.nodes.shift();
            block.nodes = [open, { type: "text", value: stringify(block) }];
          }
          push({ type: "comma", value });
          block.commas++;
          continue;
        }
        if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
          const siblings = block.nodes;
          if (depth === 0 || siblings.length === 0) {
            push({ type: "text", value });
            continue;
          }
          if (prev.type === "dot") {
            block.range = [];
            prev.value += value;
            prev.type = "range";
            if (block.nodes.length !== 3 && block.nodes.length !== 5) {
              block.invalid = true;
              block.ranges = 0;
              prev.type = "text";
              continue;
            }
            block.ranges++;
            block.args = [];
            continue;
          }
          if (prev.type === "range") {
            siblings.pop();
            const before = siblings[siblings.length - 1];
            before.value += prev.value + value;
            prev = before;
            block.ranges--;
            continue;
          }
          push({ type: "dot", value });
          continue;
        }
        push({ type: "text", value });
      }
      do {
        block = stack.pop();
        if (block.type !== "root") {
          block.nodes.forEach((node) => {
            if (!node.nodes) {
              if (node.type === "open") node.isOpen = true;
              if (node.type === "close") node.isClose = true;
              if (!node.nodes) node.type = "text";
              node.invalid = true;
            }
          });
          const parent = stack[stack.length - 1];
          const index2 = parent.nodes.indexOf(block);
          parent.nodes.splice(index2, 1, ...block.nodes);
        }
      } while (stack.length > 0);
      push({ type: "eos" });
      return ast;
    };
    module2.exports = parse;
  }
});

// ../../node_modules/braces/index.js
var require_braces = __commonJS({
  "../../node_modules/braces/index.js"(exports2, module2) {
    "use strict";
    var stringify = require_stringify();
    var compile = require_compile();
    var expand = require_expand();
    var parse = require_parse();
    var braces = (input, options = {}) => {
      let output = [];
      if (Array.isArray(input)) {
        for (const pattern of input) {
          const result = braces.create(pattern, options);
          if (Array.isArray(result)) {
            output.push(...result);
          } else {
            output.push(result);
          }
        }
      } else {
        output = [].concat(braces.create(input, options));
      }
      if (options && options.expand === true && options.nodupes === true) {
        output = [...new Set(output)];
      }
      return output;
    };
    braces.parse = (input, options = {}) => parse(input, options);
    braces.stringify = (input, options = {}) => {
      if (typeof input === "string") {
        return stringify(braces.parse(input, options), options);
      }
      return stringify(input, options);
    };
    braces.compile = (input, options = {}) => {
      if (typeof input === "string") {
        input = braces.parse(input, options);
      }
      return compile(input, options);
    };
    braces.expand = (input, options = {}) => {
      if (typeof input === "string") {
        input = braces.parse(input, options);
      }
      let result = expand(input, options);
      if (options.noempty === true) {
        result = result.filter(Boolean);
      }
      if (options.nodupes === true) {
        result = [...new Set(result)];
      }
      return result;
    };
    braces.create = (input, options = {}) => {
      if (input === "" || input.length < 3) {
        return [input];
      }
      return options.expand !== true ? braces.compile(input, options) : braces.expand(input, options);
    };
    module2.exports = braces;
  }
});

// ../../node_modules/picomatch/lib/constants.js
var require_constants2 = __commonJS({
  "../../node_modules/picomatch/lib/constants.js"(exports2, module2) {
    "use strict";
    var path4 = require("path");
    var WIN_SLASH = "\\\\/";
    var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
    var DEFAULT_MAX_EXTGLOB_RECURSION = 0;
    var DOT_LITERAL = "\\.";
    var PLUS_LITERAL = "\\+";
    var QMARK_LITERAL = "\\?";
    var SLASH_LITERAL = "\\/";
    var ONE_CHAR = "(?=.)";
    var QMARK = "[^/]";
    var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
    var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
    var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
    var NO_DOT = `(?!${DOT_LITERAL})`;
    var NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
    var NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
    var NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
    var QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
    var STAR = `${QMARK}*?`;
    var POSIX_CHARS = {
      DOT_LITERAL,
      PLUS_LITERAL,
      QMARK_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      QMARK,
      END_ANCHOR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR
    };
    var WINDOWS_CHARS = {
      ...POSIX_CHARS,
      SLASH_LITERAL: `[${WIN_SLASH}]`,
      QMARK: WIN_NO_SLASH,
      STAR: `${WIN_NO_SLASH}*?`,
      DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
      NO_DOT: `(?!${DOT_LITERAL})`,
      NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
      NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
      START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
      END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
    };
    var POSIX_REGEX_SOURCE = {
      __proto__: null,
      alnum: "a-zA-Z0-9",
      alpha: "a-zA-Z",
      ascii: "\\x00-\\x7F",
      blank: " \\t",
      cntrl: "\\x00-\\x1F\\x7F",
      digit: "0-9",
      graph: "\\x21-\\x7E",
      lower: "a-z",
      print: "\\x20-\\x7E ",
      punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
      space: " \\t\\r\\n\\v\\f",
      upper: "A-Z",
      word: "A-Za-z0-9_",
      xdigit: "A-Fa-f0-9"
    };
    module2.exports = {
      DEFAULT_MAX_EXTGLOB_RECURSION,
      MAX_LENGTH: 1024 * 64,
      POSIX_REGEX_SOURCE,
      // regular expressions
      REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
      REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
      REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
      REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
      REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
      REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
      // Replace globs with equivalent patterns to reduce parsing time.
      REPLACEMENTS: {
        __proto__: null,
        "***": "*",
        "**/**": "**",
        "**/**/**": "**"
      },
      // Digits
      CHAR_0: 48,
      /* 0 */
      CHAR_9: 57,
      /* 9 */
      // Alphabet chars.
      CHAR_UPPERCASE_A: 65,
      /* A */
      CHAR_LOWERCASE_A: 97,
      /* a */
      CHAR_UPPERCASE_Z: 90,
      /* Z */
      CHAR_LOWERCASE_Z: 122,
      /* z */
      CHAR_LEFT_PARENTHESES: 40,
      /* ( */
      CHAR_RIGHT_PARENTHESES: 41,
      /* ) */
      CHAR_ASTERISK: 42,
      /* * */
      // Non-alphabetic chars.
      CHAR_AMPERSAND: 38,
      /* & */
      CHAR_AT: 64,
      /* @ */
      CHAR_BACKWARD_SLASH: 92,
      /* \ */
      CHAR_CARRIAGE_RETURN: 13,
      /* \r */
      CHAR_CIRCUMFLEX_ACCENT: 94,
      /* ^ */
      CHAR_COLON: 58,
      /* : */
      CHAR_COMMA: 44,
      /* , */
      CHAR_DOT: 46,
      /* . */
      CHAR_DOUBLE_QUOTE: 34,
      /* " */
      CHAR_EQUAL: 61,
      /* = */
      CHAR_EXCLAMATION_MARK: 33,
      /* ! */
      CHAR_FORM_FEED: 12,
      /* \f */
      CHAR_FORWARD_SLASH: 47,
      /* / */
      CHAR_GRAVE_ACCENT: 96,
      /* ` */
      CHAR_HASH: 35,
      /* # */
      CHAR_HYPHEN_MINUS: 45,
      /* - */
      CHAR_LEFT_ANGLE_BRACKET: 60,
      /* < */
      CHAR_LEFT_CURLY_BRACE: 123,
      /* { */
      CHAR_LEFT_SQUARE_BRACKET: 91,
      /* [ */
      CHAR_LINE_FEED: 10,
      /* \n */
      CHAR_NO_BREAK_SPACE: 160,
      /* \u00A0 */
      CHAR_PERCENT: 37,
      /* % */
      CHAR_PLUS: 43,
      /* + */
      CHAR_QUESTION_MARK: 63,
      /* ? */
      CHAR_RIGHT_ANGLE_BRACKET: 62,
      /* > */
      CHAR_RIGHT_CURLY_BRACE: 125,
      /* } */
      CHAR_RIGHT_SQUARE_BRACKET: 93,
      /* ] */
      CHAR_SEMICOLON: 59,
      /* ; */
      CHAR_SINGLE_QUOTE: 39,
      /* ' */
      CHAR_SPACE: 32,
      /*   */
      CHAR_TAB: 9,
      /* \t */
      CHAR_UNDERSCORE: 95,
      /* _ */
      CHAR_VERTICAL_LINE: 124,
      /* | */
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
      /* \uFEFF */
      SEP: path4.sep,
      /**
       * Create EXTGLOB_CHARS
       */
      extglobChars(chars) {
        return {
          "!": { type: "negate", open: "(?:(?!(?:", close: `))${chars.STAR})` },
          "?": { type: "qmark", open: "(?:", close: ")?" },
          "+": { type: "plus", open: "(?:", close: ")+" },
          "*": { type: "star", open: "(?:", close: ")*" },
          "@": { type: "at", open: "(?:", close: ")" }
        };
      },
      /**
       * Create GLOB_CHARS
       */
      globChars(win32) {
        return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
      }
    };
  }
});

// ../../node_modules/picomatch/lib/utils.js
var require_utils2 = __commonJS({
  "../../node_modules/picomatch/lib/utils.js"(exports2) {
    "use strict";
    var path4 = require("path");
    var win32 = process.platform === "win32";
    var {
      REGEX_BACKSLASH,
      REGEX_REMOVE_BACKSLASH,
      REGEX_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_GLOBAL
    } = require_constants2();
    exports2.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    exports2.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
    exports2.isRegexChar = (str) => str.length === 1 && exports2.hasRegexChars(str);
    exports2.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
    exports2.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
    exports2.removeBackslashes = (str) => {
      return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
        return match === "\\" ? "" : match;
      });
    };
    exports2.supportsLookbehinds = () => {
      const segs = process.version.slice(1).split(".").map(Number);
      if (segs.length === 3 && segs[0] >= 9 || segs[0] === 8 && segs[1] >= 10) {
        return true;
      }
      return false;
    };
    exports2.isWindows = (options) => {
      if (options && typeof options.windows === "boolean") {
        return options.windows;
      }
      return win32 === true || path4.sep === "\\";
    };
    exports2.escapeLast = (input, char, lastIdx) => {
      const idx = input.lastIndexOf(char, lastIdx);
      if (idx === -1) return input;
      if (input[idx - 1] === "\\") return exports2.escapeLast(input, char, idx - 1);
      return `${input.slice(0, idx)}\\${input.slice(idx)}`;
    };
    exports2.removePrefix = (input, state = {}) => {
      let output = input;
      if (output.startsWith("./")) {
        output = output.slice(2);
        state.prefix = "./";
      }
      return output;
    };
    exports2.wrapOutput = (input, state = {}, options = {}) => {
      const prepend = options.contains ? "" : "^";
      const append = options.contains ? "" : "$";
      let output = `${prepend}(?:${input})${append}`;
      if (state.negated === true) {
        output = `(?:^(?!${output}).*$)`;
      }
      return output;
    };
  }
});

// ../../node_modules/picomatch/lib/scan.js
var require_scan = __commonJS({
  "../../node_modules/picomatch/lib/scan.js"(exports2, module2) {
    "use strict";
    var utils = require_utils2();
    var {
      CHAR_ASTERISK,
      /* * */
      CHAR_AT,
      /* @ */
      CHAR_BACKWARD_SLASH,
      /* \ */
      CHAR_COMMA,
      /* , */
      CHAR_DOT,
      /* . */
      CHAR_EXCLAMATION_MARK,
      /* ! */
      CHAR_FORWARD_SLASH,
      /* / */
      CHAR_LEFT_CURLY_BRACE,
      /* { */
      CHAR_LEFT_PARENTHESES,
      /* ( */
      CHAR_LEFT_SQUARE_BRACKET,
      /* [ */
      CHAR_PLUS,
      /* + */
      CHAR_QUESTION_MARK,
      /* ? */
      CHAR_RIGHT_CURLY_BRACE,
      /* } */
      CHAR_RIGHT_PARENTHESES,
      /* ) */
      CHAR_RIGHT_SQUARE_BRACKET
      /* ] */
    } = require_constants2();
    var isPathSeparator = (code) => {
      return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
    };
    var depth = (token) => {
      if (token.isPrefix !== true) {
        token.depth = token.isGlobstar ? Infinity : 1;
      }
    };
    var scan = (input, options) => {
      const opts = options || {};
      const length = input.length - 1;
      const scanToEnd = opts.parts === true || opts.scanToEnd === true;
      const slashes = [];
      const tokens = [];
      const parts = [];
      let str = input;
      let index = -1;
      let start = 0;
      let lastIndex = 0;
      let isBrace = false;
      let isBracket = false;
      let isGlob = false;
      let isExtglob = false;
      let isGlobstar = false;
      let braceEscaped = false;
      let backslashes = false;
      let negated = false;
      let negatedExtglob = false;
      let finished = false;
      let braces = 0;
      let prev;
      let code;
      let token = { value: "", depth: 0, isGlob: false };
      const eos = () => index >= length;
      const peek = () => str.charCodeAt(index + 1);
      const advance = () => {
        prev = code;
        return str.charCodeAt(++index);
      };
      while (index < length) {
        code = advance();
        let next;
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          code = advance();
          if (code === CHAR_LEFT_CURLY_BRACE) {
            braceEscaped = true;
          }
          continue;
        }
        if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (code === CHAR_LEFT_CURLY_BRACE) {
              braces++;
              continue;
            }
            if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (braceEscaped !== true && code === CHAR_COMMA) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (code === CHAR_RIGHT_CURLY_BRACE) {
              braces--;
              if (braces === 0) {
                braceEscaped = false;
                isBrace = token.isBrace = true;
                finished = true;
                break;
              }
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_FORWARD_SLASH) {
          slashes.push(index);
          tokens.push(token);
          token = { value: "", depth: 0, isGlob: false };
          if (finished === true) continue;
          if (prev === CHAR_DOT && index === start + 1) {
            start += 2;
            continue;
          }
          lastIndex = index + 1;
          continue;
        }
        if (opts.noext !== true) {
          const isExtglobChar = code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK;
          if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
            isGlob = token.isGlob = true;
            isExtglob = token.isExtglob = true;
            finished = true;
            if (code === CHAR_EXCLAMATION_MARK && index === start) {
              negatedExtglob = true;
            }
            if (scanToEnd === true) {
              while (eos() !== true && (code = advance())) {
                if (code === CHAR_BACKWARD_SLASH) {
                  backslashes = token.backslashes = true;
                  code = advance();
                  continue;
                }
                if (code === CHAR_RIGHT_PARENTHESES) {
                  isGlob = token.isGlob = true;
                  finished = true;
                  break;
                }
              }
              continue;
            }
            break;
          }
        }
        if (code === CHAR_ASTERISK) {
          if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_QUESTION_MARK) {
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_LEFT_SQUARE_BRACKET) {
          while (eos() !== true && (next = advance())) {
            if (next === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              isBracket = token.isBracket = true;
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
          negated = token.negated = true;
          start++;
          continue;
        }
        if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
          isGlob = token.isGlob = true;
          if (scanToEnd === true) {
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_LEFT_PARENTHESES) {
                backslashes = token.backslashes = true;
                code = advance();
                continue;
              }
              if (code === CHAR_RIGHT_PARENTHESES) {
                finished = true;
                break;
              }
            }
            continue;
          }
          break;
        }
        if (isGlob === true) {
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
      if (opts.noext === true) {
        isExtglob = false;
        isGlob = false;
      }
      let base = str;
      let prefix = "";
      let glob = "";
      if (start > 0) {
        prefix = str.slice(0, start);
        str = str.slice(start);
        lastIndex -= start;
      }
      if (base && isGlob === true && lastIndex > 0) {
        base = str.slice(0, lastIndex);
        glob = str.slice(lastIndex);
      } else if (isGlob === true) {
        base = "";
        glob = str;
      } else {
        base = str;
      }
      if (base && base !== "" && base !== "/" && base !== str) {
        if (isPathSeparator(base.charCodeAt(base.length - 1))) {
          base = base.slice(0, -1);
        }
      }
      if (opts.unescape === true) {
        if (glob) glob = utils.removeBackslashes(glob);
        if (base && backslashes === true) {
          base = utils.removeBackslashes(base);
        }
      }
      const state = {
        prefix,
        input,
        start,
        base,
        glob,
        isBrace,
        isBracket,
        isGlob,
        isExtglob,
        isGlobstar,
        negated,
        negatedExtglob
      };
      if (opts.tokens === true) {
        state.maxDepth = 0;
        if (!isPathSeparator(code)) {
          tokens.push(token);
        }
        state.tokens = tokens;
      }
      if (opts.parts === true || opts.tokens === true) {
        let prevIndex;
        for (let idx = 0; idx < slashes.length; idx++) {
          const n = prevIndex ? prevIndex + 1 : start;
          const i = slashes[idx];
          const value = input.slice(n, i);
          if (opts.tokens) {
            if (idx === 0 && start !== 0) {
              tokens[idx].isPrefix = true;
              tokens[idx].value = prefix;
            } else {
              tokens[idx].value = value;
            }
            depth(tokens[idx]);
            state.maxDepth += tokens[idx].depth;
          }
          if (idx !== 0 || value !== "") {
            parts.push(value);
          }
          prevIndex = i;
        }
        if (prevIndex && prevIndex + 1 < input.length) {
          const value = input.slice(prevIndex + 1);
          parts.push(value);
          if (opts.tokens) {
            tokens[tokens.length - 1].value = value;
            depth(tokens[tokens.length - 1]);
            state.maxDepth += tokens[tokens.length - 1].depth;
          }
        }
        state.slashes = slashes;
        state.parts = parts;
      }
      return state;
    };
    module2.exports = scan;
  }
});

// ../../node_modules/picomatch/lib/parse.js
var require_parse2 = __commonJS({
  "../../node_modules/picomatch/lib/parse.js"(exports2, module2) {
    "use strict";
    var constants = require_constants2();
    var utils = require_utils2();
    var {
      MAX_LENGTH,
      POSIX_REGEX_SOURCE,
      REGEX_NON_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_BACKREF,
      REPLACEMENTS
    } = constants;
    var expandRange = (args, options) => {
      if (typeof options.expandRange === "function") {
        return options.expandRange(...args, options);
      }
      args.sort();
      const value = `[${args.join("-")}]`;
      try {
        new RegExp(value);
      } catch (ex) {
        return args.map((v) => utils.escapeRegex(v)).join("..");
      }
      return value;
    };
    var syntaxError = (type, char) => {
      return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
    };
    var splitTopLevel = (input) => {
      const parts = [];
      let bracket = 0;
      let paren = 0;
      let quote = 0;
      let value = "";
      let escaped = false;
      for (const ch of input) {
        if (escaped === true) {
          value += ch;
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          value += ch;
          escaped = true;
          continue;
        }
        if (ch === '"') {
          quote = quote === 1 ? 0 : 1;
          value += ch;
          continue;
        }
        if (quote === 0) {
          if (ch === "[") {
            bracket++;
          } else if (ch === "]" && bracket > 0) {
            bracket--;
          } else if (bracket === 0) {
            if (ch === "(") {
              paren++;
            } else if (ch === ")" && paren > 0) {
              paren--;
            } else if (ch === "|" && paren === 0) {
              parts.push(value);
              value = "";
              continue;
            }
          }
        }
        value += ch;
      }
      parts.push(value);
      return parts;
    };
    var isPlainBranch = (branch) => {
      let escaped = false;
      for (const ch of branch) {
        if (escaped === true) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (/[?*+@!()[\]{}]/.test(ch)) {
          return false;
        }
      }
      return true;
    };
    var normalizeSimpleBranch = (branch) => {
      let value = branch.trim();
      let changed = true;
      while (changed === true) {
        changed = false;
        if (/^@\([^\\()[\]{}|]+\)$/.test(value)) {
          value = value.slice(2, -1);
          changed = true;
        }
      }
      if (!isPlainBranch(value)) {
        return;
      }
      return value.replace(/\\(.)/g, "$1");
    };
    var hasRepeatedCharPrefixOverlap = (branches) => {
      const values = branches.map(normalizeSimpleBranch).filter(Boolean);
      for (let i = 0; i < values.length; i++) {
        for (let j = i + 1; j < values.length; j++) {
          const a = values[i];
          const b = values[j];
          const char = a[0];
          if (!char || a !== char.repeat(a.length) || b !== char.repeat(b.length)) {
            continue;
          }
          if (a === b || a.startsWith(b) || b.startsWith(a)) {
            return true;
          }
        }
      }
      return false;
    };
    var parseRepeatedExtglob = (pattern, requireEnd = true) => {
      if (pattern[0] !== "+" && pattern[0] !== "*" || pattern[1] !== "(") {
        return;
      }
      let bracket = 0;
      let paren = 0;
      let quote = 0;
      let escaped = false;
      for (let i = 1; i < pattern.length; i++) {
        const ch = pattern[i];
        if (escaped === true) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (ch === '"') {
          quote = quote === 1 ? 0 : 1;
          continue;
        }
        if (quote === 1) {
          continue;
        }
        if (ch === "[") {
          bracket++;
          continue;
        }
        if (ch === "]" && bracket > 0) {
          bracket--;
          continue;
        }
        if (bracket > 0) {
          continue;
        }
        if (ch === "(") {
          paren++;
          continue;
        }
        if (ch === ")") {
          paren--;
          if (paren === 0) {
            if (requireEnd === true && i !== pattern.length - 1) {
              return;
            }
            return {
              type: pattern[0],
              body: pattern.slice(2, i),
              end: i
            };
          }
        }
      }
    };
    var getStarExtglobSequenceOutput = (pattern) => {
      let index = 0;
      const chars = [];
      while (index < pattern.length) {
        const match = parseRepeatedExtglob(pattern.slice(index), false);
        if (!match || match.type !== "*") {
          return;
        }
        const branches = splitTopLevel(match.body).map((branch2) => branch2.trim());
        if (branches.length !== 1) {
          return;
        }
        const branch = normalizeSimpleBranch(branches[0]);
        if (!branch || branch.length !== 1) {
          return;
        }
        chars.push(branch);
        index += match.end + 1;
      }
      if (chars.length < 1) {
        return;
      }
      const source = chars.length === 1 ? utils.escapeRegex(chars[0]) : `[${chars.map((ch) => utils.escapeRegex(ch)).join("")}]`;
      return `${source}*`;
    };
    var repeatedExtglobRecursion = (pattern) => {
      let depth = 0;
      let value = pattern.trim();
      let match = parseRepeatedExtglob(value);
      while (match) {
        depth++;
        value = match.body.trim();
        match = parseRepeatedExtglob(value);
      }
      return depth;
    };
    var analyzeRepeatedExtglob = (body, options) => {
      if (options.maxExtglobRecursion === false) {
        return { risky: false };
      }
      const max = typeof options.maxExtglobRecursion === "number" ? options.maxExtglobRecursion : constants.DEFAULT_MAX_EXTGLOB_RECURSION;
      const branches = splitTopLevel(body).map((branch) => branch.trim());
      if (branches.length > 1) {
        if (branches.some((branch) => branch === "") || branches.some((branch) => /^[*?]+$/.test(branch)) || hasRepeatedCharPrefixOverlap(branches)) {
          return { risky: true };
        }
      }
      for (const branch of branches) {
        const safeOutput = getStarExtglobSequenceOutput(branch);
        if (safeOutput) {
          return { risky: true, safeOutput };
        }
        if (repeatedExtglobRecursion(branch) > max) {
          return { risky: true };
        }
      }
      return { risky: false };
    };
    var parse = (input, options) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected a string");
      }
      input = REPLACEMENTS[input] || input;
      const opts = { ...options };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      let len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      const bos = { type: "bos", value: "", output: opts.prepend || "" };
      const tokens = [bos];
      const capture = opts.capture ? "" : "?:";
      const win32 = utils.isWindows(options);
      const PLATFORM_CHARS = constants.globChars(win32);
      const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
      const {
        DOT_LITERAL,
        PLUS_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOT_SLASH,
        NO_DOTS_SLASH,
        QMARK,
        QMARK_NO_DOT,
        STAR,
        START_ANCHOR
      } = PLATFORM_CHARS;
      const globstar = (opts2) => {
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const nodot = opts.dot ? "" : NO_DOT;
      const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
      let star = opts.bash === true ? globstar(opts) : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      if (typeof opts.noext === "boolean") {
        opts.noextglob = opts.noext;
      }
      const state = {
        input,
        index: -1,
        start: 0,
        dot: opts.dot === true,
        consumed: "",
        output: "",
        prefix: "",
        backtrack: false,
        negated: false,
        brackets: 0,
        braces: 0,
        parens: 0,
        quotes: 0,
        globstar: false,
        tokens
      };
      input = utils.removePrefix(input, state);
      len = input.length;
      const extglobs = [];
      const braces = [];
      const stack = [];
      let prev = bos;
      let value;
      const eos = () => state.index === len - 1;
      const peek = state.peek = (n = 1) => input[state.index + n];
      const advance = state.advance = () => input[++state.index] || "";
      const remaining = () => input.slice(state.index + 1);
      const consume = (value2 = "", num = 0) => {
        state.consumed += value2;
        state.index += num;
      };
      const append = (token) => {
        state.output += token.output != null ? token.output : token.value;
        consume(token.value);
      };
      const negate = () => {
        let count = 1;
        while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
          advance();
          state.start++;
          count++;
        }
        if (count % 2 === 0) {
          return false;
        }
        state.negated = true;
        state.start++;
        return true;
      };
      const increment = (type) => {
        state[type]++;
        stack.push(type);
      };
      const decrement = (type) => {
        state[type]--;
        stack.pop();
      };
      const push = (tok) => {
        if (prev.type === "globstar") {
          const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
          const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
          if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
            state.output = state.output.slice(0, -prev.output.length);
            prev.type = "star";
            prev.value = "*";
            prev.output = star;
            state.output += prev.output;
          }
        }
        if (extglobs.length && tok.type !== "paren") {
          extglobs[extglobs.length - 1].inner += tok.value;
        }
        if (tok.value || tok.output) append(tok);
        if (prev && prev.type === "text" && tok.type === "text") {
          prev.value += tok.value;
          prev.output = (prev.output || "") + tok.value;
          return;
        }
        tok.prev = prev;
        tokens.push(tok);
        prev = tok;
      };
      const extglobOpen = (type, value2) => {
        const token = { ...EXTGLOB_CHARS[value2], conditions: 1, inner: "" };
        token.prev = prev;
        token.parens = state.parens;
        token.output = state.output;
        token.startIndex = state.index;
        token.tokensIndex = tokens.length;
        const output = (opts.capture ? "(" : "") + token.open;
        increment("parens");
        push({ type, value: value2, output: state.output ? "" : ONE_CHAR });
        push({ type: "paren", extglob: true, value: advance(), output });
        extglobs.push(token);
      };
      const extglobClose = (token) => {
        const literal = input.slice(token.startIndex, state.index + 1);
        const body = input.slice(token.startIndex + 2, state.index);
        const analysis = analyzeRepeatedExtglob(body, opts);
        if ((token.type === "plus" || token.type === "star") && analysis.risky) {
          const safeOutput = analysis.safeOutput ? (token.output ? "" : ONE_CHAR) + (opts.capture ? `(${analysis.safeOutput})` : analysis.safeOutput) : void 0;
          const open = tokens[token.tokensIndex];
          open.type = "text";
          open.value = literal;
          open.output = safeOutput || utils.escapeRegex(literal);
          for (let i = token.tokensIndex + 1; i < tokens.length; i++) {
            tokens[i].value = "";
            tokens[i].output = "";
            delete tokens[i].suffix;
          }
          state.output = token.output + open.output;
          state.backtrack = true;
          push({ type: "paren", extglob: true, value, output: "" });
          decrement("parens");
          return;
        }
        let output = token.close + (opts.capture ? ")" : "");
        let rest;
        if (token.type === "negate") {
          let extglobStar = star;
          if (token.inner && token.inner.length > 1 && token.inner.includes("/")) {
            extglobStar = globstar(opts);
          }
          if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
            output = token.close = `)$))${extglobStar}`;
          }
          if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
            const expression = parse(rest, { ...options, fastpaths: false }).output;
            output = token.close = `)${expression})${extglobStar})`;
          }
          if (token.prev.type === "bos") {
            state.negatedExtglob = true;
          }
        }
        push({ type: "paren", extglob: true, value, output });
        decrement("parens");
      };
      if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
        let backslashes = false;
        let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
          if (first === "\\") {
            backslashes = true;
            return m;
          }
          if (first === "?") {
            if (esc) {
              return esc + first + (rest ? QMARK.repeat(rest.length) : "");
            }
            if (index === 0) {
              return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
            }
            return QMARK.repeat(chars.length);
          }
          if (first === ".") {
            return DOT_LITERAL.repeat(chars.length);
          }
          if (first === "*") {
            if (esc) {
              return esc + first + (rest ? star : "");
            }
            return star;
          }
          return esc ? m : `\\${m}`;
        });
        if (backslashes === true) {
          if (opts.unescape === true) {
            output = output.replace(/\\/g, "");
          } else {
            output = output.replace(/\\+/g, (m) => {
              return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
            });
          }
        }
        if (output === input && opts.contains === true) {
          state.output = input;
          return state;
        }
        state.output = utils.wrapOutput(output, state, options);
        return state;
      }
      while (!eos()) {
        value = advance();
        if (value === "\0") {
          continue;
        }
        if (value === "\\") {
          const next = peek();
          if (next === "/" && opts.bash !== true) {
            continue;
          }
          if (next === "." || next === ";") {
            continue;
          }
          if (!next) {
            value += "\\";
            push({ type: "text", value });
            continue;
          }
          const match = /^\\+/.exec(remaining());
          let slashes = 0;
          if (match && match[0].length > 2) {
            slashes = match[0].length;
            state.index += slashes;
            if (slashes % 2 !== 0) {
              value += "\\";
            }
          }
          if (opts.unescape === true) {
            value = advance();
          } else {
            value += advance();
          }
          if (state.brackets === 0) {
            push({ type: "text", value });
            continue;
          }
        }
        if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
          if (opts.posix !== false && value === ":") {
            const inner = prev.value.slice(1);
            if (inner.includes("[")) {
              prev.posix = true;
              if (inner.includes(":")) {
                const idx = prev.value.lastIndexOf("[");
                const pre = prev.value.slice(0, idx);
                const rest2 = prev.value.slice(idx + 2);
                const posix = POSIX_REGEX_SOURCE[rest2];
                if (posix) {
                  prev.value = pre + posix;
                  state.backtrack = true;
                  advance();
                  if (!bos.output && tokens.indexOf(prev) === 1) {
                    bos.output = ONE_CHAR;
                  }
                  continue;
                }
              }
            }
          }
          if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") {
            value = `\\${value}`;
          }
          if (value === "]" && (prev.value === "[" || prev.value === "[^")) {
            value = `\\${value}`;
          }
          if (opts.posix === true && value === "!" && prev.value === "[") {
            value = "^";
          }
          prev.value += value;
          append({ value });
          continue;
        }
        if (state.quotes === 1 && value !== '"') {
          value = utils.escapeRegex(value);
          prev.value += value;
          append({ value });
          continue;
        }
        if (value === '"') {
          state.quotes = state.quotes === 1 ? 0 : 1;
          if (opts.keepQuotes === true) {
            push({ type: "text", value });
          }
          continue;
        }
        if (value === "(") {
          increment("parens");
          push({ type: "paren", value });
          continue;
        }
        if (value === ")") {
          if (state.parens === 0 && opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("opening", "("));
          }
          const extglob = extglobs[extglobs.length - 1];
          if (extglob && state.parens === extglob.parens + 1) {
            extglobClose(extglobs.pop());
            continue;
          }
          push({ type: "paren", value, output: state.parens ? ")" : "\\)" });
          decrement("parens");
          continue;
        }
        if (value === "[") {
          if (opts.nobracket === true || !remaining().includes("]")) {
            if (opts.nobracket !== true && opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("closing", "]"));
            }
            value = `\\${value}`;
          } else {
            increment("brackets");
          }
          push({ type: "bracket", value });
          continue;
        }
        if (value === "]") {
          if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          if (state.brackets === 0) {
            if (opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("opening", "["));
            }
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          decrement("brackets");
          const prevValue = prev.value.slice(1);
          if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) {
            value = `/${value}`;
          }
          prev.value += value;
          append({ value });
          if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
            continue;
          }
          const escaped = utils.escapeRegex(prev.value);
          state.output = state.output.slice(0, -prev.value.length);
          if (opts.literalBrackets === true) {
            state.output += escaped;
            prev.value = escaped;
            continue;
          }
          prev.value = `(${capture}${escaped}|${prev.value})`;
          state.output += prev.value;
          continue;
        }
        if (value === "{" && opts.nobrace !== true) {
          increment("braces");
          const open = {
            type: "brace",
            value,
            output: "(",
            outputIndex: state.output.length,
            tokensIndex: state.tokens.length
          };
          braces.push(open);
          push(open);
          continue;
        }
        if (value === "}") {
          const brace = braces[braces.length - 1];
          if (opts.nobrace === true || !brace) {
            push({ type: "text", value, output: value });
            continue;
          }
          let output = ")";
          if (brace.dots === true) {
            const arr = tokens.slice();
            const range = [];
            for (let i = arr.length - 1; i >= 0; i--) {
              tokens.pop();
              if (arr[i].type === "brace") {
                break;
              }
              if (arr[i].type !== "dots") {
                range.unshift(arr[i].value);
              }
            }
            output = expandRange(range, opts);
            state.backtrack = true;
          }
          if (brace.comma !== true && brace.dots !== true) {
            const out = state.output.slice(0, brace.outputIndex);
            const toks = state.tokens.slice(brace.tokensIndex);
            brace.value = brace.output = "\\{";
            value = output = "\\}";
            state.output = out;
            for (const t of toks) {
              state.output += t.output || t.value;
            }
          }
          push({ type: "brace", value, output });
          decrement("braces");
          braces.pop();
          continue;
        }
        if (value === "|") {
          if (extglobs.length > 0) {
            extglobs[extglobs.length - 1].conditions++;
          }
          push({ type: "text", value });
          continue;
        }
        if (value === ",") {
          let output = value;
          const brace = braces[braces.length - 1];
          if (brace && stack[stack.length - 1] === "braces") {
            brace.comma = true;
            output = "|";
          }
          push({ type: "comma", value, output });
          continue;
        }
        if (value === "/") {
          if (prev.type === "dot" && state.index === state.start + 1) {
            state.start = state.index + 1;
            state.consumed = "";
            state.output = "";
            tokens.pop();
            prev = bos;
            continue;
          }
          push({ type: "slash", value, output: SLASH_LITERAL });
          continue;
        }
        if (value === ".") {
          if (state.braces > 0 && prev.type === "dot") {
            if (prev.value === ".") prev.output = DOT_LITERAL;
            const brace = braces[braces.length - 1];
            prev.type = "dots";
            prev.output += value;
            prev.value += value;
            brace.dots = true;
            continue;
          }
          if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
            push({ type: "text", value, output: DOT_LITERAL });
            continue;
          }
          push({ type: "dot", value, output: DOT_LITERAL });
          continue;
        }
        if (value === "?") {
          const isGroup = prev && prev.value === "(";
          if (!isGroup && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("qmark", value);
            continue;
          }
          if (prev && prev.type === "paren") {
            const next = peek();
            let output = value;
            if (next === "<" && !utils.supportsLookbehinds()) {
              throw new Error("Node.js v10 or higher is required for regex lookbehinds");
            }
            if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) {
              output = `\\${value}`;
            }
            push({ type: "text", value, output });
            continue;
          }
          if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
            push({ type: "qmark", value, output: QMARK_NO_DOT });
            continue;
          }
          push({ type: "qmark", value, output: QMARK });
          continue;
        }
        if (value === "!") {
          if (opts.noextglob !== true && peek() === "(") {
            if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
              extglobOpen("negate", value);
              continue;
            }
          }
          if (opts.nonegate !== true && state.index === 0) {
            negate();
            continue;
          }
        }
        if (value === "+") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("plus", value);
            continue;
          }
          if (prev && prev.value === "(" || opts.regex === false) {
            push({ type: "plus", value, output: PLUS_LITERAL });
            continue;
          }
          if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
            push({ type: "plus", value });
            continue;
          }
          push({ type: "plus", value: PLUS_LITERAL });
          continue;
        }
        if (value === "@") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            push({ type: "at", extglob: true, value, output: "" });
            continue;
          }
          push({ type: "text", value });
          continue;
        }
        if (value !== "*") {
          if (value === "$" || value === "^") {
            value = `\\${value}`;
          }
          const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
          if (match) {
            value += match[0];
            state.index += match[0].length;
          }
          push({ type: "text", value });
          continue;
        }
        if (prev && (prev.type === "globstar" || prev.star === true)) {
          prev.type = "star";
          prev.star = true;
          prev.value += value;
          prev.output = star;
          state.backtrack = true;
          state.globstar = true;
          consume(value);
          continue;
        }
        let rest = remaining();
        if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
          extglobOpen("star", value);
          continue;
        }
        if (prev.type === "star") {
          if (opts.noglobstar === true) {
            consume(value);
            continue;
          }
          const prior = prev.prev;
          const before = prior.prev;
          const isStart = prior.type === "slash" || prior.type === "bos";
          const afterStar = before && (before.type === "star" || before.type === "globstar");
          if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
            push({ type: "star", value, output: "" });
            continue;
          }
          const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
          const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
          if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
            push({ type: "star", value, output: "" });
            continue;
          }
          while (rest.slice(0, 3) === "/**") {
            const after = input[state.index + 4];
            if (after && after !== "/") {
              break;
            }
            rest = rest.slice(3);
            consume("/**", 3);
          }
          if (prior.type === "bos" && eos()) {
            prev.type = "globstar";
            prev.value += value;
            prev.output = globstar(opts);
            state.output = prev.output;
            state.globstar = true;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
            prev.value += value;
            state.globstar = true;
            state.output += prior.output + prev.output;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
            const end = rest[1] !== void 0 ? "|$" : "";
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
            prev.value += value;
            state.output += prior.output + prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          if (prior.type === "bos" && rest[0] === "/") {
            prev.type = "globstar";
            prev.value += value;
            prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
            state.output = prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          state.output = state.output.slice(0, -prev.output.length);
          prev.type = "globstar";
          prev.output = globstar(opts);
          prev.value += value;
          state.output += prev.output;
          state.globstar = true;
          consume(value);
          continue;
        }
        const token = { type: "star", value, output: star };
        if (opts.bash === true) {
          token.output = ".*?";
          if (prev.type === "bos" || prev.type === "slash") {
            token.output = nodot + token.output;
          }
          push(token);
          continue;
        }
        if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
          token.output = value;
          push(token);
          continue;
        }
        if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
          if (prev.type === "dot") {
            state.output += NO_DOT_SLASH;
            prev.output += NO_DOT_SLASH;
          } else if (opts.dot === true) {
            state.output += NO_DOTS_SLASH;
            prev.output += NO_DOTS_SLASH;
          } else {
            state.output += nodot;
            prev.output += nodot;
          }
          if (peek() !== "*") {
            state.output += ONE_CHAR;
            prev.output += ONE_CHAR;
          }
        }
        push(token);
      }
      while (state.brackets > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
        state.output = utils.escapeLast(state.output, "[");
        decrement("brackets");
      }
      while (state.parens > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
        state.output = utils.escapeLast(state.output, "(");
        decrement("parens");
      }
      while (state.braces > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
        state.output = utils.escapeLast(state.output, "{");
        decrement("braces");
      }
      if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) {
        push({ type: "maybe_slash", value: "", output: `${SLASH_LITERAL}?` });
      }
      if (state.backtrack === true) {
        state.output = "";
        for (const token of state.tokens) {
          state.output += token.output != null ? token.output : token.value;
          if (token.suffix) {
            state.output += token.suffix;
          }
        }
      }
      return state;
    };
    parse.fastpaths = (input, options) => {
      const opts = { ...options };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      const len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      input = REPLACEMENTS[input] || input;
      const win32 = utils.isWindows(options);
      const {
        DOT_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOTS,
        NO_DOTS_SLASH,
        STAR,
        START_ANCHOR
      } = constants.globChars(win32);
      const nodot = opts.dot ? NO_DOTS : NO_DOT;
      const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
      const capture = opts.capture ? "" : "?:";
      const state = { negated: false, prefix: "" };
      let star = opts.bash === true ? ".*?" : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      const globstar = (opts2) => {
        if (opts2.noglobstar === true) return star;
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const create = (str) => {
        switch (str) {
          case "*":
            return `${nodot}${ONE_CHAR}${star}`;
          case ".*":
            return `${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*.*":
            return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*/*":
            return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
          case "**":
            return nodot + globstar(opts);
          case "**/*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
          case "**/*.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "**/.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
          default: {
            const match = /^(.*?)\.(\w+)$/.exec(str);
            if (!match) return;
            const source2 = create(match[1]);
            if (!source2) return;
            return source2 + DOT_LITERAL + match[2];
          }
        }
      };
      const output = utils.removePrefix(input, state);
      let source = create(output);
      if (source && opts.strictSlashes !== true) {
        source += `${SLASH_LITERAL}?`;
      }
      return source;
    };
    module2.exports = parse;
  }
});

// ../../node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS({
  "../../node_modules/picomatch/lib/picomatch.js"(exports2, module2) {
    "use strict";
    var path4 = require("path");
    var scan = require_scan();
    var parse = require_parse2();
    var utils = require_utils2();
    var constants = require_constants2();
    var isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
    var picomatch = (glob, options, returnState = false) => {
      if (Array.isArray(glob)) {
        const fns = glob.map((input) => picomatch(input, options, returnState));
        const arrayMatcher = (str) => {
          for (const isMatch of fns) {
            const state2 = isMatch(str);
            if (state2) return state2;
          }
          return false;
        };
        return arrayMatcher;
      }
      const isState = isObject(glob) && glob.tokens && glob.input;
      if (glob === "" || typeof glob !== "string" && !isState) {
        throw new TypeError("Expected pattern to be a non-empty string");
      }
      const opts = options || {};
      const posix = utils.isWindows(options);
      const regex = isState ? picomatch.compileRe(glob, options) : picomatch.makeRe(glob, options, false, true);
      const state = regex.state;
      delete regex.state;
      let isIgnored = () => false;
      if (opts.ignore) {
        const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
        isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
      }
      const matcher = (input, returnObject = false) => {
        const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
        const result = { glob, state, regex, posix, input, output, match, isMatch };
        if (typeof opts.onResult === "function") {
          opts.onResult(result);
        }
        if (isMatch === false) {
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (isIgnored(input)) {
          if (typeof opts.onIgnore === "function") {
            opts.onIgnore(result);
          }
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (typeof opts.onMatch === "function") {
          opts.onMatch(result);
        }
        return returnObject ? result : true;
      };
      if (returnState) {
        matcher.state = state;
      }
      return matcher;
    };
    picomatch.test = (input, regex, options, { glob, posix } = {}) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected input to be a string");
      }
      if (input === "") {
        return { isMatch: false, output: "" };
      }
      const opts = options || {};
      const format = opts.format || (posix ? utils.toPosixSlashes : null);
      let match = input === glob;
      let output = match && format ? format(input) : input;
      if (match === false) {
        output = format ? format(input) : input;
        match = output === glob;
      }
      if (match === false || opts.capture === true) {
        if (opts.matchBase === true || opts.basename === true) {
          match = picomatch.matchBase(input, regex, options, posix);
        } else {
          match = regex.exec(output);
        }
      }
      return { isMatch: Boolean(match), match, output };
    };
    picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
      const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
      return regex.test(path4.basename(input));
    };
    picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
    picomatch.parse = (pattern, options) => {
      if (Array.isArray(pattern)) return pattern.map((p) => picomatch.parse(p, options));
      return parse(pattern, { ...options, fastpaths: false });
    };
    picomatch.scan = (input, options) => scan(input, options);
    picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
      if (returnOutput === true) {
        return state.output;
      }
      const opts = options || {};
      const prepend = opts.contains ? "" : "^";
      const append = opts.contains ? "" : "$";
      let source = `${prepend}(?:${state.output})${append}`;
      if (state && state.negated === true) {
        source = `^(?!${source}).*$`;
      }
      const regex = picomatch.toRegex(source, options);
      if (returnState === true) {
        regex.state = state;
      }
      return regex;
    };
    picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
      if (!input || typeof input !== "string") {
        throw new TypeError("Expected a non-empty string");
      }
      let parsed = { negated: false, fastpaths: true };
      if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
        parsed.output = parse.fastpaths(input, options);
      }
      if (!parsed.output) {
        parsed = parse(input, options);
      }
      return picomatch.compileRe(parsed, options, returnOutput, returnState);
    };
    picomatch.toRegex = (source, options) => {
      try {
        const opts = options || {};
        return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
      } catch (err) {
        if (options && options.debug === true) throw err;
        return /$^/;
      }
    };
    picomatch.constants = constants;
    module2.exports = picomatch;
  }
});

// ../../node_modules/picomatch/index.js
var require_picomatch2 = __commonJS({
  "../../node_modules/picomatch/index.js"(exports2, module2) {
    "use strict";
    module2.exports = require_picomatch();
  }
});

// ../../node_modules/micromatch/index.js
var require_micromatch = __commonJS({
  "../../node_modules/micromatch/index.js"(exports2, module2) {
    "use strict";
    var util = require("util");
    var braces = require_braces();
    var picomatch = require_picomatch2();
    var utils = require_utils2();
    var isEmptyString = (v) => v === "" || v === "./";
    var hasBraces = (v) => {
      const index = v.indexOf("{");
      return index > -1 && v.indexOf("}", index) > -1;
    };
    var micromatch = (list, patterns, options) => {
      patterns = [].concat(patterns);
      list = [].concat(list);
      let omit = /* @__PURE__ */ new Set();
      let keep = /* @__PURE__ */ new Set();
      let items = /* @__PURE__ */ new Set();
      let negatives = 0;
      let onResult = (state) => {
        items.add(state.output);
        if (options && options.onResult) {
          options.onResult(state);
        }
      };
      for (let i = 0; i < patterns.length; i++) {
        let isMatch = picomatch(String(patterns[i]), { ...options, onResult }, true);
        let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
        if (negated) negatives++;
        for (let item of list) {
          let matched = isMatch(item, true);
          let match = negated ? !matched.isMatch : matched.isMatch;
          if (!match) continue;
          if (negated) {
            omit.add(matched.output);
          } else {
            omit.delete(matched.output);
            keep.add(matched.output);
          }
        }
      }
      let result = negatives === patterns.length ? [...items] : [...keep];
      let matches = result.filter((item) => !omit.has(item));
      if (options && matches.length === 0) {
        if (options.failglob === true) {
          throw new Error(`No matches found for "${patterns.join(", ")}"`);
        }
        if (options.nonull === true || options.nullglob === true) {
          return options.unescape ? patterns.map((p) => p.replace(/\\/g, "")) : patterns;
        }
      }
      return matches;
    };
    micromatch.match = micromatch;
    micromatch.matcher = (pattern, options) => picomatch(pattern, options);
    micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
    micromatch.any = micromatch.isMatch;
    micromatch.not = (list, patterns, options = {}) => {
      patterns = [].concat(patterns).map(String);
      let result = /* @__PURE__ */ new Set();
      let items = [];
      let onResult = (state) => {
        if (options.onResult) options.onResult(state);
        items.push(state.output);
      };
      let matches = new Set(micromatch(list, patterns, { ...options, onResult }));
      for (let item of items) {
        if (!matches.has(item)) {
          result.add(item);
        }
      }
      return [...result];
    };
    micromatch.contains = (str, pattern, options) => {
      if (typeof str !== "string") {
        throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
      }
      if (Array.isArray(pattern)) {
        return pattern.some((p) => micromatch.contains(str, p, options));
      }
      if (typeof pattern === "string") {
        if (isEmptyString(str) || isEmptyString(pattern)) {
          return false;
        }
        if (str.includes(pattern) || str.startsWith("./") && str.slice(2).includes(pattern)) {
          return true;
        }
      }
      return micromatch.isMatch(str, pattern, { ...options, contains: true });
    };
    micromatch.matchKeys = (obj, patterns, options) => {
      if (!utils.isObject(obj)) {
        throw new TypeError("Expected the first argument to be an object");
      }
      let keys = micromatch(Object.keys(obj), patterns, options);
      let res = {};
      for (let key of keys) res[key] = obj[key];
      return res;
    };
    micromatch.some = (list, patterns, options) => {
      let items = [].concat(list);
      for (let pattern of [].concat(patterns)) {
        let isMatch = picomatch(String(pattern), options);
        if (items.some((item) => isMatch(item))) {
          return true;
        }
      }
      return false;
    };
    micromatch.every = (list, patterns, options) => {
      let items = [].concat(list);
      for (let pattern of [].concat(patterns)) {
        let isMatch = picomatch(String(pattern), options);
        if (!items.every((item) => isMatch(item))) {
          return false;
        }
      }
      return true;
    };
    micromatch.all = (str, patterns, options) => {
      if (typeof str !== "string") {
        throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
      }
      return [].concat(patterns).every((p) => picomatch(p, options)(str));
    };
    micromatch.capture = (glob, input, options) => {
      let posix = utils.isWindows(options);
      let regex = picomatch.makeRe(String(glob), { ...options, capture: true });
      let match = regex.exec(posix ? utils.toPosixSlashes(input) : input);
      if (match) {
        return match.slice(1).map((v) => v === void 0 ? "" : v);
      }
    };
    micromatch.makeRe = (...args) => picomatch.makeRe(...args);
    micromatch.scan = (...args) => picomatch.scan(...args);
    micromatch.parse = (patterns, options) => {
      let res = [];
      for (let pattern of [].concat(patterns || [])) {
        for (let str of braces(String(pattern), options)) {
          res.push(picomatch.parse(str, options));
        }
      }
      return res;
    };
    micromatch.braces = (pattern, options) => {
      if (typeof pattern !== "string") throw new TypeError("Expected a string");
      if (options && options.nobrace === true || !hasBraces(pattern)) {
        return [pattern];
      }
      return braces(pattern, options);
    };
    micromatch.braceExpand = (pattern, options) => {
      if (typeof pattern !== "string") throw new TypeError("Expected a string");
      return micromatch.braces(pattern, { ...options, expand: true });
    };
    micromatch.hasBraces = hasBraces;
    module2.exports = micromatch;
  }
});

// ../../node_modules/fast-glob/out/utils/pattern.js
var require_pattern = __commonJS({
  "../../node_modules/fast-glob/out/utils/pattern.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isAbsolute = exports2.partitionAbsoluteAndRelative = exports2.removeDuplicateSlashes = exports2.matchAny = exports2.convertPatternsToRe = exports2.makeRe = exports2.getPatternParts = exports2.expandBraceExpansion = exports2.expandPatternsWithBraceExpansion = exports2.isAffectDepthOfReadingPattern = exports2.endsWithSlashGlobStar = exports2.hasGlobStar = exports2.getBaseDirectory = exports2.isPatternRelatedToParentDirectory = exports2.getPatternsOutsideCurrentDirectory = exports2.getPatternsInsideCurrentDirectory = exports2.getPositivePatterns = exports2.getNegativePatterns = exports2.isPositivePattern = exports2.isNegativePattern = exports2.convertToNegativePattern = exports2.convertToPositivePattern = exports2.isDynamicPattern = exports2.isStaticPattern = void 0;
    var path4 = require("path");
    var globParent = require_glob_parent();
    var micromatch = require_micromatch();
    var GLOBSTAR = "**";
    var ESCAPE_SYMBOL = "\\";
    var COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
    var REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[[^[]*]/;
    var REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\([^(]*\|[^|]*\)/;
    var GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\([^(]*\)/;
    var BRACE_EXPANSION_SEPARATORS_RE = /,|\.\./;
    var DOUBLE_SLASH_RE = /(?!^)\/{2,}/g;
    function isStaticPattern(pattern, options = {}) {
      return !isDynamicPattern(pattern, options);
    }
    exports2.isStaticPattern = isStaticPattern;
    function isDynamicPattern(pattern, options = {}) {
      if (pattern === "") {
        return false;
      }
      if (options.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) {
        return true;
      }
      if (COMMON_GLOB_SYMBOLS_RE.test(pattern) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || REGEX_GROUP_SYMBOLS_RE.test(pattern)) {
        return true;
      }
      if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) {
        return true;
      }
      if (options.braceExpansion !== false && hasBraceExpansion(pattern)) {
        return true;
      }
      return false;
    }
    exports2.isDynamicPattern = isDynamicPattern;
    function hasBraceExpansion(pattern) {
      const openingBraceIndex = pattern.indexOf("{");
      if (openingBraceIndex === -1) {
        return false;
      }
      const closingBraceIndex = pattern.indexOf("}", openingBraceIndex + 1);
      if (closingBraceIndex === -1) {
        return false;
      }
      const braceContent = pattern.slice(openingBraceIndex, closingBraceIndex);
      return BRACE_EXPANSION_SEPARATORS_RE.test(braceContent);
    }
    function convertToPositivePattern(pattern) {
      return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
    }
    exports2.convertToPositivePattern = convertToPositivePattern;
    function convertToNegativePattern(pattern) {
      return "!" + pattern;
    }
    exports2.convertToNegativePattern = convertToNegativePattern;
    function isNegativePattern(pattern) {
      return pattern.startsWith("!") && pattern[1] !== "(";
    }
    exports2.isNegativePattern = isNegativePattern;
    function isPositivePattern(pattern) {
      return !isNegativePattern(pattern);
    }
    exports2.isPositivePattern = isPositivePattern;
    function getNegativePatterns(patterns) {
      return patterns.filter(isNegativePattern);
    }
    exports2.getNegativePatterns = getNegativePatterns;
    function getPositivePatterns(patterns) {
      return patterns.filter(isPositivePattern);
    }
    exports2.getPositivePatterns = getPositivePatterns;
    function getPatternsInsideCurrentDirectory(patterns) {
      return patterns.filter((pattern) => !isPatternRelatedToParentDirectory(pattern));
    }
    exports2.getPatternsInsideCurrentDirectory = getPatternsInsideCurrentDirectory;
    function getPatternsOutsideCurrentDirectory(patterns) {
      return patterns.filter(isPatternRelatedToParentDirectory);
    }
    exports2.getPatternsOutsideCurrentDirectory = getPatternsOutsideCurrentDirectory;
    function isPatternRelatedToParentDirectory(pattern) {
      return pattern.startsWith("..") || pattern.startsWith("./..");
    }
    exports2.isPatternRelatedToParentDirectory = isPatternRelatedToParentDirectory;
    function getBaseDirectory(pattern) {
      return globParent(pattern, { flipBackslashes: false });
    }
    exports2.getBaseDirectory = getBaseDirectory;
    function hasGlobStar(pattern) {
      return pattern.includes(GLOBSTAR);
    }
    exports2.hasGlobStar = hasGlobStar;
    function endsWithSlashGlobStar(pattern) {
      return pattern.endsWith("/" + GLOBSTAR);
    }
    exports2.endsWithSlashGlobStar = endsWithSlashGlobStar;
    function isAffectDepthOfReadingPattern(pattern) {
      const basename2 = path4.basename(pattern);
      return endsWithSlashGlobStar(pattern) || isStaticPattern(basename2);
    }
    exports2.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
    function expandPatternsWithBraceExpansion(patterns) {
      return patterns.reduce((collection, pattern) => {
        return collection.concat(expandBraceExpansion(pattern));
      }, []);
    }
    exports2.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
    function expandBraceExpansion(pattern) {
      const patterns = micromatch.braces(pattern, { expand: true, nodupes: true, keepEscaping: true });
      patterns.sort((a, b) => a.length - b.length);
      return patterns.filter((pattern2) => pattern2 !== "");
    }
    exports2.expandBraceExpansion = expandBraceExpansion;
    function getPatternParts(pattern, options) {
      let { parts } = micromatch.scan(pattern, Object.assign(Object.assign({}, options), { parts: true }));
      if (parts.length === 0) {
        parts = [pattern];
      }
      if (parts[0].startsWith("/")) {
        parts[0] = parts[0].slice(1);
        parts.unshift("");
      }
      return parts;
    }
    exports2.getPatternParts = getPatternParts;
    function makeRe(pattern, options) {
      return micromatch.makeRe(pattern, options);
    }
    exports2.makeRe = makeRe;
    function convertPatternsToRe(patterns, options) {
      return patterns.map((pattern) => makeRe(pattern, options));
    }
    exports2.convertPatternsToRe = convertPatternsToRe;
    function matchAny(entry, patternsRe) {
      return patternsRe.some((patternRe) => patternRe.test(entry));
    }
    exports2.matchAny = matchAny;
    function removeDuplicateSlashes(pattern) {
      return pattern.replace(DOUBLE_SLASH_RE, "/");
    }
    exports2.removeDuplicateSlashes = removeDuplicateSlashes;
    function partitionAbsoluteAndRelative(patterns) {
      const absolute = [];
      const relative = [];
      for (const pattern of patterns) {
        if (isAbsolute(pattern)) {
          absolute.push(pattern);
        } else {
          relative.push(pattern);
        }
      }
      return [absolute, relative];
    }
    exports2.partitionAbsoluteAndRelative = partitionAbsoluteAndRelative;
    function isAbsolute(pattern) {
      return path4.isAbsolute(pattern);
    }
    exports2.isAbsolute = isAbsolute;
  }
});

// ../../node_modules/merge2/index.js
var require_merge2 = __commonJS({
  "../../node_modules/merge2/index.js"(exports2, module2) {
    "use strict";
    var Stream = require("stream");
    var PassThrough = Stream.PassThrough;
    var slice = Array.prototype.slice;
    module2.exports = merge2;
    function merge2() {
      const streamsQueue = [];
      const args = slice.call(arguments);
      let merging = false;
      let options = args[args.length - 1];
      if (options && !Array.isArray(options) && options.pipe == null) {
        args.pop();
      } else {
        options = {};
      }
      const doEnd = options.end !== false;
      const doPipeError = options.pipeError === true;
      if (options.objectMode == null) {
        options.objectMode = true;
      }
      if (options.highWaterMark == null) {
        options.highWaterMark = 64 * 1024;
      }
      const mergedStream = PassThrough(options);
      function addStream() {
        for (let i = 0, len = arguments.length; i < len; i++) {
          streamsQueue.push(pauseStreams(arguments[i], options));
        }
        mergeStream();
        return this;
      }
      function mergeStream() {
        if (merging) {
          return;
        }
        merging = true;
        let streams = streamsQueue.shift();
        if (!streams) {
          process.nextTick(endStream);
          return;
        }
        if (!Array.isArray(streams)) {
          streams = [streams];
        }
        let pipesCount = streams.length + 1;
        function next() {
          if (--pipesCount > 0) {
            return;
          }
          merging = false;
          mergeStream();
        }
        function pipe(stream) {
          function onend() {
            stream.removeListener("merge2UnpipeEnd", onend);
            stream.removeListener("end", onend);
            if (doPipeError) {
              stream.removeListener("error", onerror);
            }
            next();
          }
          function onerror(err) {
            mergedStream.emit("error", err);
          }
          if (stream._readableState.endEmitted) {
            return next();
          }
          stream.on("merge2UnpipeEnd", onend);
          stream.on("end", onend);
          if (doPipeError) {
            stream.on("error", onerror);
          }
          stream.pipe(mergedStream, { end: false });
          stream.resume();
        }
        for (let i = 0; i < streams.length; i++) {
          pipe(streams[i]);
        }
        next();
      }
      function endStream() {
        merging = false;
        mergedStream.emit("queueDrain");
        if (doEnd) {
          mergedStream.end();
        }
      }
      mergedStream.setMaxListeners(0);
      mergedStream.add = addStream;
      mergedStream.on("unpipe", function(stream) {
        stream.emit("merge2UnpipeEnd");
      });
      if (args.length) {
        addStream.apply(null, args);
      }
      return mergedStream;
    }
    function pauseStreams(streams, options) {
      if (!Array.isArray(streams)) {
        if (!streams._readableState && streams.pipe) {
          streams = streams.pipe(PassThrough(options));
        }
        if (!streams._readableState || !streams.pause || !streams.pipe) {
          throw new Error("Only readable stream can be merged.");
        }
        streams.pause();
      } else {
        for (let i = 0, len = streams.length; i < len; i++) {
          streams[i] = pauseStreams(streams[i], options);
        }
      }
      return streams;
    }
  }
});

// ../../node_modules/fast-glob/out/utils/stream.js
var require_stream = __commonJS({
  "../../node_modules/fast-glob/out/utils/stream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.merge = void 0;
    var merge2 = require_merge2();
    function merge(streams) {
      const mergedStream = merge2(streams);
      streams.forEach((stream) => {
        stream.once("error", (error) => mergedStream.emit("error", error));
      });
      mergedStream.once("close", () => propagateCloseEventToSources(streams));
      mergedStream.once("end", () => propagateCloseEventToSources(streams));
      return mergedStream;
    }
    exports2.merge = merge;
    function propagateCloseEventToSources(streams) {
      streams.forEach((stream) => stream.emit("close"));
    }
  }
});

// ../../node_modules/fast-glob/out/utils/string.js
var require_string = __commonJS({
  "../../node_modules/fast-glob/out/utils/string.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isEmpty = exports2.isString = void 0;
    function isString(input) {
      return typeof input === "string";
    }
    exports2.isString = isString;
    function isEmpty(input) {
      return input === "";
    }
    exports2.isEmpty = isEmpty;
  }
});

// ../../node_modules/fast-glob/out/utils/index.js
var require_utils3 = __commonJS({
  "../../node_modules/fast-glob/out/utils/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.string = exports2.stream = exports2.pattern = exports2.path = exports2.fs = exports2.errno = exports2.array = void 0;
    var array = require_array();
    exports2.array = array;
    var errno = require_errno();
    exports2.errno = errno;
    var fs2 = require_fs();
    exports2.fs = fs2;
    var path4 = require_path();
    exports2.path = path4;
    var pattern = require_pattern();
    exports2.pattern = pattern;
    var stream = require_stream();
    exports2.stream = stream;
    var string = require_string();
    exports2.string = string;
  }
});

// ../../node_modules/fast-glob/out/managers/tasks.js
var require_tasks = __commonJS({
  "../../node_modules/fast-glob/out/managers/tasks.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.convertPatternGroupToTask = exports2.convertPatternGroupsToTasks = exports2.groupPatternsByBaseDirectory = exports2.getNegativePatternsAsPositive = exports2.getPositivePatterns = exports2.convertPatternsToTasks = exports2.generate = void 0;
    var utils = require_utils3();
    function generate(input, settings) {
      const patterns = processPatterns(input, settings);
      const ignore = processPatterns(settings.ignore, settings);
      const positivePatterns = getPositivePatterns(patterns);
      const negativePatterns = getNegativePatternsAsPositive(patterns, ignore);
      const staticPatterns = positivePatterns.filter((pattern) => utils.pattern.isStaticPattern(pattern, settings));
      const dynamicPatterns = positivePatterns.filter((pattern) => utils.pattern.isDynamicPattern(pattern, settings));
      const staticTasks = convertPatternsToTasks(
        staticPatterns,
        negativePatterns,
        /* dynamic */
        false
      );
      const dynamicTasks = convertPatternsToTasks(
        dynamicPatterns,
        negativePatterns,
        /* dynamic */
        true
      );
      return staticTasks.concat(dynamicTasks);
    }
    exports2.generate = generate;
    function processPatterns(input, settings) {
      let patterns = input;
      if (settings.braceExpansion) {
        patterns = utils.pattern.expandPatternsWithBraceExpansion(patterns);
      }
      if (settings.baseNameMatch) {
        patterns = patterns.map((pattern) => pattern.includes("/") ? pattern : `**/${pattern}`);
      }
      return patterns.map((pattern) => utils.pattern.removeDuplicateSlashes(pattern));
    }
    function convertPatternsToTasks(positive, negative, dynamic) {
      const tasks = [];
      const patternsOutsideCurrentDirectory = utils.pattern.getPatternsOutsideCurrentDirectory(positive);
      const patternsInsideCurrentDirectory = utils.pattern.getPatternsInsideCurrentDirectory(positive);
      const outsideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsOutsideCurrentDirectory);
      const insideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsInsideCurrentDirectory);
      tasks.push(...convertPatternGroupsToTasks(outsideCurrentDirectoryGroup, negative, dynamic));
      if ("." in insideCurrentDirectoryGroup) {
        tasks.push(convertPatternGroupToTask(".", patternsInsideCurrentDirectory, negative, dynamic));
      } else {
        tasks.push(...convertPatternGroupsToTasks(insideCurrentDirectoryGroup, negative, dynamic));
      }
      return tasks;
    }
    exports2.convertPatternsToTasks = convertPatternsToTasks;
    function getPositivePatterns(patterns) {
      return utils.pattern.getPositivePatterns(patterns);
    }
    exports2.getPositivePatterns = getPositivePatterns;
    function getNegativePatternsAsPositive(patterns, ignore) {
      const negative = utils.pattern.getNegativePatterns(patterns).concat(ignore);
      const positive = negative.map(utils.pattern.convertToPositivePattern);
      return positive;
    }
    exports2.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
    function groupPatternsByBaseDirectory(patterns) {
      const group = {};
      return patterns.reduce((collection, pattern) => {
        const base = utils.pattern.getBaseDirectory(pattern);
        if (base in collection) {
          collection[base].push(pattern);
        } else {
          collection[base] = [pattern];
        }
        return collection;
      }, group);
    }
    exports2.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
    function convertPatternGroupsToTasks(positive, negative, dynamic) {
      return Object.keys(positive).map((base) => {
        return convertPatternGroupToTask(base, positive[base], negative, dynamic);
      });
    }
    exports2.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
    function convertPatternGroupToTask(base, positive, negative, dynamic) {
      return {
        dynamic,
        positive,
        negative,
        base,
        patterns: [].concat(positive, negative.map(utils.pattern.convertToNegativePattern))
      };
    }
    exports2.convertPatternGroupToTask = convertPatternGroupToTask;
  }
});

// ../../node_modules/@nodelib/fs.stat/out/providers/async.js
var require_async = __commonJS({
  "../../node_modules/@nodelib/fs.stat/out/providers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.read = void 0;
    function read(path4, settings, callback) {
      settings.fs.lstat(path4, (lstatError, lstat) => {
        if (lstatError !== null) {
          callFailureCallback(callback, lstatError);
          return;
        }
        if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
          callSuccessCallback(callback, lstat);
          return;
        }
        settings.fs.stat(path4, (statError, stat) => {
          if (statError !== null) {
            if (settings.throwErrorOnBrokenSymbolicLink) {
              callFailureCallback(callback, statError);
              return;
            }
            callSuccessCallback(callback, lstat);
            return;
          }
          if (settings.markSymbolicLink) {
            stat.isSymbolicLink = () => true;
          }
          callSuccessCallback(callback, stat);
        });
      });
    }
    exports2.read = read;
    function callFailureCallback(callback, error) {
      callback(error);
    }
    function callSuccessCallback(callback, result) {
      callback(null, result);
    }
  }
});

// ../../node_modules/@nodelib/fs.stat/out/providers/sync.js
var require_sync = __commonJS({
  "../../node_modules/@nodelib/fs.stat/out/providers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.read = void 0;
    function read(path4, settings) {
      const lstat = settings.fs.lstatSync(path4);
      if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
        return lstat;
      }
      try {
        const stat = settings.fs.statSync(path4);
        if (settings.markSymbolicLink) {
          stat.isSymbolicLink = () => true;
        }
        return stat;
      } catch (error) {
        if (!settings.throwErrorOnBrokenSymbolicLink) {
          return lstat;
        }
        throw error;
      }
    }
    exports2.read = read;
  }
});

// ../../node_modules/@nodelib/fs.stat/out/adapters/fs.js
var require_fs2 = __commonJS({
  "../../node_modules/@nodelib/fs.stat/out/adapters/fs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createFileSystemAdapter = exports2.FILE_SYSTEM_ADAPTER = void 0;
    var fs2 = require("fs");
    exports2.FILE_SYSTEM_ADAPTER = {
      lstat: fs2.lstat,
      stat: fs2.stat,
      lstatSync: fs2.lstatSync,
      statSync: fs2.statSync
    };
    function createFileSystemAdapter(fsMethods) {
      if (fsMethods === void 0) {
        return exports2.FILE_SYSTEM_ADAPTER;
      }
      return Object.assign(Object.assign({}, exports2.FILE_SYSTEM_ADAPTER), fsMethods);
    }
    exports2.createFileSystemAdapter = createFileSystemAdapter;
  }
});

// ../../node_modules/@nodelib/fs.stat/out/settings.js
var require_settings = __commonJS({
  "../../node_modules/@nodelib/fs.stat/out/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fs2 = require_fs2();
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
        this.fs = fs2.createFileSystemAdapter(this._options.fs);
        this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
      }
      _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
      }
    };
    exports2.default = Settings;
  }
});

// ../../node_modules/@nodelib/fs.stat/out/index.js
var require_out = __commonJS({
  "../../node_modules/@nodelib/fs.stat/out/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.statSync = exports2.stat = exports2.Settings = void 0;
    var async = require_async();
    var sync = require_sync();
    var settings_1 = require_settings();
    exports2.Settings = settings_1.default;
    function stat(path4, optionsOrSettingsOrCallback, callback) {
      if (typeof optionsOrSettingsOrCallback === "function") {
        async.read(path4, getSettings(), optionsOrSettingsOrCallback);
        return;
      }
      async.read(path4, getSettings(optionsOrSettingsOrCallback), callback);
    }
    exports2.stat = stat;
    function statSync(path4, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      return sync.read(path4, settings);
    }
    exports2.statSync = statSync;
    function getSettings(settingsOrOptions = {}) {
      if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
      }
      return new settings_1.default(settingsOrOptions);
    }
  }
});

// ../../node_modules/queue-microtask/index.js
var require_queue_microtask = __commonJS({
  "../../node_modules/queue-microtask/index.js"(exports2, module2) {
    "use strict";
    var promise;
    module2.exports = typeof queueMicrotask === "function" ? queueMicrotask.bind(typeof window !== "undefined" ? window : global) : (cb) => (promise || (promise = Promise.resolve())).then(cb).catch((err) => setTimeout(() => {
      throw err;
    }, 0));
  }
});

// ../../node_modules/run-parallel/index.js
var require_run_parallel = __commonJS({
  "../../node_modules/run-parallel/index.js"(exports2, module2) {
    "use strict";
    module2.exports = runParallel;
    var queueMicrotask2 = require_queue_microtask();
    function runParallel(tasks, cb) {
      let results, pending, keys;
      let isSync = true;
      if (Array.isArray(tasks)) {
        results = [];
        pending = tasks.length;
      } else {
        keys = Object.keys(tasks);
        results = {};
        pending = keys.length;
      }
      function done(err) {
        function end() {
          if (cb) cb(err, results);
          cb = null;
        }
        if (isSync) queueMicrotask2(end);
        else end();
      }
      function each(i, err, result) {
        results[i] = result;
        if (--pending === 0 || err) {
          done(err);
        }
      }
      if (!pending) {
        done(null);
      } else if (keys) {
        keys.forEach(function(key) {
          tasks[key](function(err, result) {
            each(key, err, result);
          });
        });
      } else {
        tasks.forEach(function(task, i) {
          task(function(err, result) {
            each(i, err, result);
          });
        });
      }
      isSync = false;
    }
  }
});

// ../../node_modules/@nodelib/fs.scandir/out/constants.js
var require_constants3 = __commonJS({
  "../../node_modules/@nodelib/fs.scandir/out/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.IS_SUPPORT_READDIR_WITH_FILE_TYPES = void 0;
    var NODE_PROCESS_VERSION_PARTS = process.versions.node.split(".");
    if (NODE_PROCESS_VERSION_PARTS[0] === void 0 || NODE_PROCESS_VERSION_PARTS[1] === void 0) {
      throw new Error(`Unexpected behavior. The 'process.versions.node' variable has invalid value: ${process.versions.node}`);
    }
    var MAJOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
    var MINOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
    var SUPPORTED_MAJOR_VERSION = 10;
    var SUPPORTED_MINOR_VERSION = 10;
    var IS_MATCHED_BY_MAJOR = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION;
    var IS_MATCHED_BY_MAJOR_AND_MINOR = MAJOR_VERSION === SUPPORTED_MAJOR_VERSION && MINOR_VERSION >= SUPPORTED_MINOR_VERSION;
    exports2.IS_SUPPORT_READDIR_WITH_FILE_TYPES = IS_MATCHED_BY_MAJOR || IS_MATCHED_BY_MAJOR_AND_MINOR;
  }
});

// ../../node_modules/@nodelib/fs.scandir/out/utils/fs.js
var require_fs3 = __commonJS({
  "../../node_modules/@nodelib/fs.scandir/out/utils/fs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createDirentFromStats = void 0;
    var DirentFromStats = class {
      constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
      }
    };
    function createDirentFromStats(name, stats) {
      return new DirentFromStats(name, stats);
    }
    exports2.createDirentFromStats = createDirentFromStats;
  }
});

// ../../node_modules/@nodelib/fs.scandir/out/utils/index.js
var require_utils4 = __commonJS({
  "../../node_modules/@nodelib/fs.scandir/out/utils/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.fs = void 0;
    var fs2 = require_fs3();
    exports2.fs = fs2;
  }
});

// ../../node_modules/@nodelib/fs.scandir/out/providers/common.js
var require_common = __commonJS({
  "../../node_modules/@nodelib/fs.scandir/out/providers/common.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.joinPathSegments = void 0;
    function joinPathSegments(a, b, separator) {
      if (a.endsWith(separator)) {
        return a + b;
      }
      return a + separator + b;
    }
    exports2.joinPathSegments = joinPathSegments;
  }
});

// ../../node_modules/@nodelib/fs.scandir/out/providers/async.js
var require_async2 = __commonJS({
  "../../node_modules/@nodelib/fs.scandir/out/providers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.readdir = exports2.readdirWithFileTypes = exports2.read = void 0;
    var fsStat = require_out();
    var rpl = require_run_parallel();
    var constants_1 = require_constants3();
    var utils = require_utils4();
    var common = require_common();
    function read(directory, settings, callback) {
      if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        readdirWithFileTypes(directory, settings, callback);
        return;
      }
      readdir(directory, settings, callback);
    }
    exports2.read = read;
    function readdirWithFileTypes(directory, settings, callback) {
      settings.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
        if (readdirError !== null) {
          callFailureCallback(callback, readdirError);
          return;
        }
        const entries2 = dirents.map((dirent) => ({
          dirent,
          name: dirent.name,
          path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
        }));
        if (!settings.followSymbolicLinks) {
          callSuccessCallback(callback, entries2);
          return;
        }
        const tasks = entries2.map((entry) => makeRplTaskEntry(entry, settings));
        rpl(tasks, (rplError, rplEntries) => {
          if (rplError !== null) {
            callFailureCallback(callback, rplError);
            return;
          }
          callSuccessCallback(callback, rplEntries);
        });
      });
    }
    exports2.readdirWithFileTypes = readdirWithFileTypes;
    function makeRplTaskEntry(entry, settings) {
      return (done) => {
        if (!entry.dirent.isSymbolicLink()) {
          done(null, entry);
          return;
        }
        settings.fs.stat(entry.path, (statError, stats) => {
          if (statError !== null) {
            if (settings.throwErrorOnBrokenSymbolicLink) {
              done(statError);
              return;
            }
            done(null, entry);
            return;
          }
          entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
          done(null, entry);
        });
      };
    }
    function readdir(directory, settings, callback) {
      settings.fs.readdir(directory, (readdirError, names) => {
        if (readdirError !== null) {
          callFailureCallback(callback, readdirError);
          return;
        }
        const tasks = names.map((name) => {
          const path4 = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
          return (done) => {
            fsStat.stat(path4, settings.fsStatSettings, (error, stats) => {
              if (error !== null) {
                done(error);
                return;
              }
              const entry = {
                name,
                path: path4,
                dirent: utils.fs.createDirentFromStats(name, stats)
              };
              if (settings.stats) {
                entry.stats = stats;
              }
              done(null, entry);
            });
          };
        });
        rpl(tasks, (rplError, entries2) => {
          if (rplError !== null) {
            callFailureCallback(callback, rplError);
            return;
          }
          callSuccessCallback(callback, entries2);
        });
      });
    }
    exports2.readdir = readdir;
    function callFailureCallback(callback, error) {
      callback(error);
    }
    function callSuccessCallback(callback, result) {
      callback(null, result);
    }
  }
});

// ../../node_modules/@nodelib/fs.scandir/out/providers/sync.js
var require_sync2 = __commonJS({
  "../../node_modules/@nodelib/fs.scandir/out/providers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.readdir = exports2.readdirWithFileTypes = exports2.read = void 0;
    var fsStat = require_out();
    var constants_1 = require_constants3();
    var utils = require_utils4();
    var common = require_common();
    function read(directory, settings) {
      if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        return readdirWithFileTypes(directory, settings);
      }
      return readdir(directory, settings);
    }
    exports2.read = read;
    function readdirWithFileTypes(directory, settings) {
      const dirents = settings.fs.readdirSync(directory, { withFileTypes: true });
      return dirents.map((dirent) => {
        const entry = {
          dirent,
          name: dirent.name,
          path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
        };
        if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) {
          try {
            const stats = settings.fs.statSync(entry.path);
            entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
          } catch (error) {
            if (settings.throwErrorOnBrokenSymbolicLink) {
              throw error;
            }
          }
        }
        return entry;
      });
    }
    exports2.readdirWithFileTypes = readdirWithFileTypes;
    function readdir(directory, settings) {
      const names = settings.fs.readdirSync(directory);
      return names.map((name) => {
        const entryPath = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
        const stats = fsStat.statSync(entryPath, settings.fsStatSettings);
        const entry = {
          name,
          path: entryPath,
          dirent: utils.fs.createDirentFromStats(name, stats)
        };
        if (settings.stats) {
          entry.stats = stats;
        }
        return entry;
      });
    }
    exports2.readdir = readdir;
  }
});

// ../../node_modules/@nodelib/fs.scandir/out/adapters/fs.js
var require_fs4 = __commonJS({
  "../../node_modules/@nodelib/fs.scandir/out/adapters/fs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createFileSystemAdapter = exports2.FILE_SYSTEM_ADAPTER = void 0;
    var fs2 = require("fs");
    exports2.FILE_SYSTEM_ADAPTER = {
      lstat: fs2.lstat,
      stat: fs2.stat,
      lstatSync: fs2.lstatSync,
      statSync: fs2.statSync,
      readdir: fs2.readdir,
      readdirSync: fs2.readdirSync
    };
    function createFileSystemAdapter(fsMethods) {
      if (fsMethods === void 0) {
        return exports2.FILE_SYSTEM_ADAPTER;
      }
      return Object.assign(Object.assign({}, exports2.FILE_SYSTEM_ADAPTER), fsMethods);
    }
    exports2.createFileSystemAdapter = createFileSystemAdapter;
  }
});

// ../../node_modules/@nodelib/fs.scandir/out/settings.js
var require_settings2 = __commonJS({
  "../../node_modules/@nodelib/fs.scandir/out/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path4 = require("path");
    var fsStat = require_out();
    var fs2 = require_fs4();
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
        this.fs = fs2.createFileSystemAdapter(this._options.fs);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path4.sep);
        this.stats = this._getValue(this._options.stats, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
        this.fsStatSettings = new fsStat.Settings({
          followSymbolicLink: this.followSymbolicLinks,
          fs: this.fs,
          throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
        });
      }
      _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
      }
    };
    exports2.default = Settings;
  }
});

// ../../node_modules/@nodelib/fs.scandir/out/index.js
var require_out2 = __commonJS({
  "../../node_modules/@nodelib/fs.scandir/out/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Settings = exports2.scandirSync = exports2.scandir = void 0;
    var async = require_async2();
    var sync = require_sync2();
    var settings_1 = require_settings2();
    exports2.Settings = settings_1.default;
    function scandir(path4, optionsOrSettingsOrCallback, callback) {
      if (typeof optionsOrSettingsOrCallback === "function") {
        async.read(path4, getSettings(), optionsOrSettingsOrCallback);
        return;
      }
      async.read(path4, getSettings(optionsOrSettingsOrCallback), callback);
    }
    exports2.scandir = scandir;
    function scandirSync(path4, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      return sync.read(path4, settings);
    }
    exports2.scandirSync = scandirSync;
    function getSettings(settingsOrOptions = {}) {
      if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
      }
      return new settings_1.default(settingsOrOptions);
    }
  }
});

// ../../node_modules/reusify/reusify.js
var require_reusify = __commonJS({
  "../../node_modules/reusify/reusify.js"(exports2, module2) {
    "use strict";
    function reusify(Constructor) {
      var head = new Constructor();
      var tail = head;
      function get() {
        var current = head;
        if (current.next) {
          head = current.next;
        } else {
          head = new Constructor();
          tail = head;
        }
        current.next = null;
        return current;
      }
      function release(obj) {
        tail.next = obj;
        tail = obj;
      }
      return {
        get,
        release
      };
    }
    module2.exports = reusify;
  }
});

// ../../node_modules/fastq/queue.js
var require_queue = __commonJS({
  "../../node_modules/fastq/queue.js"(exports2, module2) {
    "use strict";
    var reusify = require_reusify();
    function fastqueue(context, worker, _concurrency) {
      if (typeof context === "function") {
        _concurrency = worker;
        worker = context;
        context = null;
      }
      if (!(_concurrency >= 1)) {
        throw new Error("fastqueue concurrency must be equal to or greater than 1");
      }
      var cache = reusify(Task);
      var queueHead = null;
      var queueTail = null;
      var _running = 0;
      var errorHandler = null;
      var self = {
        push,
        drain: noop,
        saturated: noop,
        pause,
        paused: false,
        get concurrency() {
          return _concurrency;
        },
        set concurrency(value) {
          if (!(value >= 1)) {
            throw new Error("fastqueue concurrency must be equal to or greater than 1");
          }
          _concurrency = value;
          if (self.paused) return;
          for (; queueHead && _running < _concurrency; ) {
            _running++;
            release();
          }
        },
        running,
        resume,
        idle,
        length,
        getQueue,
        unshift,
        empty: noop,
        kill,
        killAndDrain,
        error,
        abort
      };
      return self;
      function running() {
        return _running;
      }
      function pause() {
        self.paused = true;
      }
      function length() {
        var current = queueHead;
        var counter = 0;
        while (current) {
          current = current.next;
          counter++;
        }
        return counter;
      }
      function getQueue() {
        var current = queueHead;
        var tasks = [];
        while (current) {
          tasks.push(current.value);
          current = current.next;
        }
        return tasks;
      }
      function resume() {
        if (!self.paused) return;
        self.paused = false;
        if (queueHead === null) {
          _running++;
          release();
          return;
        }
        for (; queueHead && _running < _concurrency; ) {
          _running++;
          release();
        }
      }
      function idle() {
        return _running === 0 && self.length() === 0;
      }
      function push(value, done) {
        var current = cache.get();
        current.context = context;
        current.release = release;
        current.value = value;
        current.callback = done || noop;
        current.errorHandler = errorHandler;
        if (_running >= _concurrency || self.paused) {
          if (queueTail) {
            queueTail.next = current;
            queueTail = current;
          } else {
            queueHead = current;
            queueTail = current;
            self.saturated();
          }
        } else {
          _running++;
          worker.call(context, current.value, current.worked);
        }
      }
      function unshift(value, done) {
        var current = cache.get();
        current.context = context;
        current.release = release;
        current.value = value;
        current.callback = done || noop;
        current.errorHandler = errorHandler;
        if (_running >= _concurrency || self.paused) {
          if (queueHead) {
            current.next = queueHead;
            queueHead = current;
          } else {
            queueHead = current;
            queueTail = current;
            self.saturated();
          }
        } else {
          _running++;
          worker.call(context, current.value, current.worked);
        }
      }
      function release(holder) {
        if (holder) {
          cache.release(holder);
        }
        var next = queueHead;
        if (next && _running <= _concurrency) {
          if (!self.paused) {
            if (queueTail === queueHead) {
              queueTail = null;
            }
            queueHead = next.next;
            next.next = null;
            worker.call(context, next.value, next.worked);
            if (queueTail === null) {
              self.empty();
            }
          } else {
            _running--;
          }
        } else if (--_running === 0) {
          self.drain();
        }
      }
      function kill() {
        queueHead = null;
        queueTail = null;
        self.drain = noop;
      }
      function killAndDrain() {
        queueHead = null;
        queueTail = null;
        self.drain();
        self.drain = noop;
      }
      function abort() {
        var current = queueHead;
        queueHead = null;
        queueTail = null;
        while (current) {
          var next = current.next;
          var callback = current.callback;
          var errorHandler2 = current.errorHandler;
          var val = current.value;
          var context2 = current.context;
          current.value = null;
          current.callback = noop;
          current.errorHandler = null;
          if (errorHandler2) {
            errorHandler2(new Error("abort"), val);
          }
          callback.call(context2, new Error("abort"));
          current.release(current);
          current = next;
        }
        self.drain = noop;
      }
      function error(handler) {
        errorHandler = handler;
      }
    }
    function noop() {
    }
    function Task() {
      this.value = null;
      this.callback = noop;
      this.next = null;
      this.release = noop;
      this.context = null;
      this.errorHandler = null;
      var self = this;
      this.worked = function worked(err, result) {
        var callback = self.callback;
        var errorHandler = self.errorHandler;
        var val = self.value;
        self.value = null;
        self.callback = noop;
        if (self.errorHandler) {
          errorHandler(err, val);
        }
        callback.call(self.context, err, result);
        self.release(self);
      };
    }
    function queueAsPromised(context, worker, _concurrency) {
      if (typeof context === "function") {
        _concurrency = worker;
        worker = context;
        context = null;
      }
      function asyncWrapper(arg, cb) {
        worker.call(this, arg).then(function(res) {
          cb(null, res);
        }, cb);
      }
      var queue = fastqueue(context, asyncWrapper, _concurrency);
      var pushCb = queue.push;
      var unshiftCb = queue.unshift;
      queue.push = push;
      queue.unshift = unshift;
      queue.drained = drained;
      return queue;
      function push(value) {
        var p = new Promise(function(resolve, reject) {
          pushCb(value, function(err, result) {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          });
        });
        p.catch(noop);
        return p;
      }
      function unshift(value) {
        var p = new Promise(function(resolve, reject) {
          unshiftCb(value, function(err, result) {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          });
        });
        p.catch(noop);
        return p;
      }
      function drained() {
        var p = new Promise(function(resolve) {
          process.nextTick(function() {
            if (queue.idle()) {
              resolve();
            } else {
              var previousDrain = queue.drain;
              queue.drain = function() {
                if (typeof previousDrain === "function") previousDrain();
                resolve();
                queue.drain = previousDrain;
              };
            }
          });
        });
        return p;
      }
    }
    module2.exports = fastqueue;
    module2.exports.promise = queueAsPromised;
  }
});

// ../../node_modules/@nodelib/fs.walk/out/readers/common.js
var require_common2 = __commonJS({
  "../../node_modules/@nodelib/fs.walk/out/readers/common.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.joinPathSegments = exports2.replacePathSegmentSeparator = exports2.isAppliedFilter = exports2.isFatalError = void 0;
    function isFatalError(settings, error) {
      if (settings.errorFilter === null) {
        return true;
      }
      return !settings.errorFilter(error);
    }
    exports2.isFatalError = isFatalError;
    function isAppliedFilter(filter, value) {
      return filter === null || filter(value);
    }
    exports2.isAppliedFilter = isAppliedFilter;
    function replacePathSegmentSeparator(filepath, separator) {
      return filepath.split(/[/\\]/).join(separator);
    }
    exports2.replacePathSegmentSeparator = replacePathSegmentSeparator;
    function joinPathSegments(a, b, separator) {
      if (a === "") {
        return b;
      }
      if (a.endsWith(separator)) {
        return a + b;
      }
      return a + separator + b;
    }
    exports2.joinPathSegments = joinPathSegments;
  }
});

// ../../node_modules/@nodelib/fs.walk/out/readers/reader.js
var require_reader = __commonJS({
  "../../node_modules/@nodelib/fs.walk/out/readers/reader.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var common = require_common2();
    var Reader = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._root = common.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
      }
    };
    exports2.default = Reader;
  }
});

// ../../node_modules/@nodelib/fs.walk/out/readers/async.js
var require_async3 = __commonJS({
  "../../node_modules/@nodelib/fs.walk/out/readers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var events_1 = require("events");
    var fsScandir = require_out2();
    var fastq = require_queue();
    var common = require_common2();
    var reader_1 = require_reader();
    var AsyncReader = class extends reader_1.default {
      constructor(_root, _settings) {
        super(_root, _settings);
        this._settings = _settings;
        this._scandir = fsScandir.scandir;
        this._emitter = new events_1.EventEmitter();
        this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
        this._isFatalError = false;
        this._isDestroyed = false;
        this._queue.drain = () => {
          if (!this._isFatalError) {
            this._emitter.emit("end");
          }
        };
      }
      read() {
        this._isFatalError = false;
        this._isDestroyed = false;
        setImmediate(() => {
          this._pushToQueue(this._root, this._settings.basePath);
        });
        return this._emitter;
      }
      get isDestroyed() {
        return this._isDestroyed;
      }
      destroy() {
        if (this._isDestroyed) {
          throw new Error("The reader is already destroyed");
        }
        this._isDestroyed = true;
        this._queue.killAndDrain();
      }
      onEntry(callback) {
        this._emitter.on("entry", callback);
      }
      onError(callback) {
        this._emitter.once("error", callback);
      }
      onEnd(callback) {
        this._emitter.once("end", callback);
      }
      _pushToQueue(directory, base) {
        const queueItem = { directory, base };
        this._queue.push(queueItem, (error) => {
          if (error !== null) {
            this._handleError(error);
          }
        });
      }
      _worker(item, done) {
        this._scandir(item.directory, this._settings.fsScandirSettings, (error, entries2) => {
          if (error !== null) {
            done(error, void 0);
            return;
          }
          for (const entry of entries2) {
            this._handleEntry(entry, item.base);
          }
          done(null, void 0);
        });
      }
      _handleError(error) {
        if (this._isDestroyed || !common.isFatalError(this._settings, error)) {
          return;
        }
        this._isFatalError = true;
        this._isDestroyed = true;
        this._emitter.emit("error", error);
      }
      _handleEntry(entry, base) {
        if (this._isDestroyed || this._isFatalError) {
          return;
        }
        const fullpath = entry.path;
        if (base !== void 0) {
          entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
          this._emitEntry(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
          this._pushToQueue(fullpath, base === void 0 ? void 0 : entry.path);
        }
      }
      _emitEntry(entry) {
        this._emitter.emit("entry", entry);
      }
    };
    exports2.default = AsyncReader;
  }
});

// ../../node_modules/@nodelib/fs.walk/out/providers/async.js
var require_async4 = __commonJS({
  "../../node_modules/@nodelib/fs.walk/out/providers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var async_1 = require_async3();
    var AsyncProvider = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._storage = [];
      }
      read(callback) {
        this._reader.onError((error) => {
          callFailureCallback(callback, error);
        });
        this._reader.onEntry((entry) => {
          this._storage.push(entry);
        });
        this._reader.onEnd(() => {
          callSuccessCallback(callback, this._storage);
        });
        this._reader.read();
      }
    };
    exports2.default = AsyncProvider;
    function callFailureCallback(callback, error) {
      callback(error);
    }
    function callSuccessCallback(callback, entries2) {
      callback(null, entries2);
    }
  }
});

// ../../node_modules/@nodelib/fs.walk/out/providers/stream.js
var require_stream2 = __commonJS({
  "../../node_modules/@nodelib/fs.walk/out/providers/stream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var stream_1 = require("stream");
    var async_1 = require_async3();
    var StreamProvider = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._stream = new stream_1.Readable({
          objectMode: true,
          read: () => {
          },
          destroy: () => {
            if (!this._reader.isDestroyed) {
              this._reader.destroy();
            }
          }
        });
      }
      read() {
        this._reader.onError((error) => {
          this._stream.emit("error", error);
        });
        this._reader.onEntry((entry) => {
          this._stream.push(entry);
        });
        this._reader.onEnd(() => {
          this._stream.push(null);
        });
        this._reader.read();
        return this._stream;
      }
    };
    exports2.default = StreamProvider;
  }
});

// ../../node_modules/@nodelib/fs.walk/out/readers/sync.js
var require_sync3 = __commonJS({
  "../../node_modules/@nodelib/fs.walk/out/readers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fsScandir = require_out2();
    var common = require_common2();
    var reader_1 = require_reader();
    var SyncReader = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._scandir = fsScandir.scandirSync;
        this._storage = [];
        this._queue = /* @__PURE__ */ new Set();
      }
      read() {
        this._pushToQueue(this._root, this._settings.basePath);
        this._handleQueue();
        return this._storage;
      }
      _pushToQueue(directory, base) {
        this._queue.add({ directory, base });
      }
      _handleQueue() {
        for (const item of this._queue.values()) {
          this._handleDirectory(item.directory, item.base);
        }
      }
      _handleDirectory(directory, base) {
        try {
          const entries2 = this._scandir(directory, this._settings.fsScandirSettings);
          for (const entry of entries2) {
            this._handleEntry(entry, base);
          }
        } catch (error) {
          this._handleError(error);
        }
      }
      _handleError(error) {
        if (!common.isFatalError(this._settings, error)) {
          return;
        }
        throw error;
      }
      _handleEntry(entry, base) {
        const fullpath = entry.path;
        if (base !== void 0) {
          entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
          this._pushToStorage(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
          this._pushToQueue(fullpath, base === void 0 ? void 0 : entry.path);
        }
      }
      _pushToStorage(entry) {
        this._storage.push(entry);
      }
    };
    exports2.default = SyncReader;
  }
});

// ../../node_modules/@nodelib/fs.walk/out/providers/sync.js
var require_sync4 = __commonJS({
  "../../node_modules/@nodelib/fs.walk/out/providers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var sync_1 = require_sync3();
    var SyncProvider = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new sync_1.default(this._root, this._settings);
      }
      read() {
        return this._reader.read();
      }
    };
    exports2.default = SyncProvider;
  }
});

// ../../node_modules/@nodelib/fs.walk/out/settings.js
var require_settings3 = __commonJS({
  "../../node_modules/@nodelib/fs.walk/out/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path4 = require("path");
    var fsScandir = require_out2();
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.basePath = this._getValue(this._options.basePath, void 0);
        this.concurrency = this._getValue(this._options.concurrency, Number.POSITIVE_INFINITY);
        this.deepFilter = this._getValue(this._options.deepFilter, null);
        this.entryFilter = this._getValue(this._options.entryFilter, null);
        this.errorFilter = this._getValue(this._options.errorFilter, null);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path4.sep);
        this.fsScandirSettings = new fsScandir.Settings({
          followSymbolicLinks: this._options.followSymbolicLinks,
          fs: this._options.fs,
          pathSegmentSeparator: this._options.pathSegmentSeparator,
          stats: this._options.stats,
          throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
        });
      }
      _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
      }
    };
    exports2.default = Settings;
  }
});

// ../../node_modules/@nodelib/fs.walk/out/index.js
var require_out3 = __commonJS({
  "../../node_modules/@nodelib/fs.walk/out/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Settings = exports2.walkStream = exports2.walkSync = exports2.walk = void 0;
    var async_1 = require_async4();
    var stream_1 = require_stream2();
    var sync_1 = require_sync4();
    var settings_1 = require_settings3();
    exports2.Settings = settings_1.default;
    function walk(directory, optionsOrSettingsOrCallback, callback) {
      if (typeof optionsOrSettingsOrCallback === "function") {
        new async_1.default(directory, getSettings()).read(optionsOrSettingsOrCallback);
        return;
      }
      new async_1.default(directory, getSettings(optionsOrSettingsOrCallback)).read(callback);
    }
    exports2.walk = walk;
    function walkSync(directory, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      const provider = new sync_1.default(directory, settings);
      return provider.read();
    }
    exports2.walkSync = walkSync;
    function walkStream(directory, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      const provider = new stream_1.default(directory, settings);
      return provider.read();
    }
    exports2.walkStream = walkStream;
    function getSettings(settingsOrOptions = {}) {
      if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
      }
      return new settings_1.default(settingsOrOptions);
    }
  }
});

// ../../node_modules/fast-glob/out/readers/reader.js
var require_reader2 = __commonJS({
  "../../node_modules/fast-glob/out/readers/reader.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path4 = require("path");
    var fsStat = require_out();
    var utils = require_utils3();
    var Reader = class {
      constructor(_settings) {
        this._settings = _settings;
        this._fsStatSettings = new fsStat.Settings({
          followSymbolicLink: this._settings.followSymbolicLinks,
          fs: this._settings.fs,
          throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
        });
      }
      _getFullEntryPath(filepath) {
        return path4.resolve(this._settings.cwd, filepath);
      }
      _makeEntry(stats, pattern) {
        const entry = {
          name: pattern,
          path: pattern,
          dirent: utils.fs.createDirentFromStats(pattern, stats)
        };
        if (this._settings.stats) {
          entry.stats = stats;
        }
        return entry;
      }
      _isFatalError(error) {
        return !utils.errno.isEnoentCodeError(error) && !this._settings.suppressErrors;
      }
    };
    exports2.default = Reader;
  }
});

// ../../node_modules/fast-glob/out/readers/stream.js
var require_stream3 = __commonJS({
  "../../node_modules/fast-glob/out/readers/stream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var stream_1 = require("stream");
    var fsStat = require_out();
    var fsWalk = require_out3();
    var reader_1 = require_reader2();
    var ReaderStream = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._walkStream = fsWalk.walkStream;
        this._stat = fsStat.stat;
      }
      dynamic(root, options) {
        return this._walkStream(root, options);
      }
      static(patterns, options) {
        const filepaths = patterns.map(this._getFullEntryPath, this);
        const stream = new stream_1.PassThrough({ objectMode: true });
        stream._write = (index, _enc, done) => {
          return this._getEntry(filepaths[index], patterns[index], options).then((entry) => {
            if (entry !== null && options.entryFilter(entry)) {
              stream.push(entry);
            }
            if (index === filepaths.length - 1) {
              stream.end();
            }
            done();
          }).catch(done);
        };
        for (let i = 0; i < filepaths.length; i++) {
          stream.write(i);
        }
        return stream;
      }
      _getEntry(filepath, pattern, options) {
        return this._getStat(filepath).then((stats) => this._makeEntry(stats, pattern)).catch((error) => {
          if (options.errorFilter(error)) {
            return null;
          }
          throw error;
        });
      }
      _getStat(filepath) {
        return new Promise((resolve, reject) => {
          this._stat(filepath, this._fsStatSettings, (error, stats) => {
            return error === null ? resolve(stats) : reject(error);
          });
        });
      }
    };
    exports2.default = ReaderStream;
  }
});

// ../../node_modules/fast-glob/out/readers/async.js
var require_async5 = __commonJS({
  "../../node_modules/fast-glob/out/readers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fsWalk = require_out3();
    var reader_1 = require_reader2();
    var stream_1 = require_stream3();
    var ReaderAsync = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._walkAsync = fsWalk.walk;
        this._readerStream = new stream_1.default(this._settings);
      }
      dynamic(root, options) {
        return new Promise((resolve, reject) => {
          this._walkAsync(root, options, (error, entries2) => {
            if (error === null) {
              resolve(entries2);
            } else {
              reject(error);
            }
          });
        });
      }
      async static(patterns, options) {
        const entries2 = [];
        const stream = this._readerStream.static(patterns, options);
        return new Promise((resolve, reject) => {
          stream.once("error", reject);
          stream.on("data", (entry) => entries2.push(entry));
          stream.once("end", () => resolve(entries2));
        });
      }
    };
    exports2.default = ReaderAsync;
  }
});

// ../../node_modules/fast-glob/out/providers/matchers/matcher.js
var require_matcher = __commonJS({
  "../../node_modules/fast-glob/out/providers/matchers/matcher.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var Matcher = class {
      constructor(_patterns, _settings, _micromatchOptions) {
        this._patterns = _patterns;
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this._storage = [];
        this._fillStorage();
      }
      _fillStorage() {
        for (const pattern of this._patterns) {
          const segments = this._getPatternSegments(pattern);
          const sections = this._splitSegmentsIntoSections(segments);
          this._storage.push({
            complete: sections.length <= 1,
            pattern,
            segments,
            sections
          });
        }
      }
      _getPatternSegments(pattern) {
        const parts = utils.pattern.getPatternParts(pattern, this._micromatchOptions);
        return parts.map((part) => {
          const dynamic = utils.pattern.isDynamicPattern(part, this._settings);
          if (!dynamic) {
            return {
              dynamic: false,
              pattern: part
            };
          }
          return {
            dynamic: true,
            pattern: part,
            patternRe: utils.pattern.makeRe(part, this._micromatchOptions)
          };
        });
      }
      _splitSegmentsIntoSections(segments) {
        return utils.array.splitWhen(segments, (segment) => segment.dynamic && utils.pattern.hasGlobStar(segment.pattern));
      }
    };
    exports2.default = Matcher;
  }
});

// ../../node_modules/fast-glob/out/providers/matchers/partial.js
var require_partial = __commonJS({
  "../../node_modules/fast-glob/out/providers/matchers/partial.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var matcher_1 = require_matcher();
    var PartialMatcher = class extends matcher_1.default {
      match(filepath) {
        const parts = filepath.split("/");
        const levels = parts.length;
        const patterns = this._storage.filter((info) => !info.complete || info.segments.length > levels);
        for (const pattern of patterns) {
          const section = pattern.sections[0];
          if (!pattern.complete && levels > section.length) {
            return true;
          }
          const match = parts.every((part, index) => {
            const segment = pattern.segments[index];
            if (segment.dynamic && segment.patternRe.test(part)) {
              return true;
            }
            if (!segment.dynamic && segment.pattern === part) {
              return true;
            }
            return false;
          });
          if (match) {
            return true;
          }
        }
        return false;
      }
    };
    exports2.default = PartialMatcher;
  }
});

// ../../node_modules/fast-glob/out/providers/filters/deep.js
var require_deep = __commonJS({
  "../../node_modules/fast-glob/out/providers/filters/deep.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var partial_1 = require_partial();
    var DeepFilter = class {
      constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
      }
      getFilter(basePath, positive, negative) {
        const matcher = this._getMatcher(positive);
        const negativeRe = this._getNegativePatternsRe(negative);
        return (entry) => this._filter(basePath, entry, matcher, negativeRe);
      }
      _getMatcher(patterns) {
        return new partial_1.default(patterns, this._settings, this._micromatchOptions);
      }
      _getNegativePatternsRe(patterns) {
        const affectDepthOfReadingPatterns = patterns.filter(utils.pattern.isAffectDepthOfReadingPattern);
        return utils.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
      }
      _filter(basePath, entry, matcher, negativeRe) {
        if (this._isSkippedByDeep(basePath, entry.path)) {
          return false;
        }
        if (this._isSkippedSymbolicLink(entry)) {
          return false;
        }
        const filepath = utils.path.removeLeadingDotSegment(entry.path);
        if (this._isSkippedByPositivePatterns(filepath, matcher)) {
          return false;
        }
        return this._isSkippedByNegativePatterns(filepath, negativeRe);
      }
      _isSkippedByDeep(basePath, entryPath) {
        if (this._settings.deep === Infinity) {
          return false;
        }
        return this._getEntryLevel(basePath, entryPath) >= this._settings.deep;
      }
      _getEntryLevel(basePath, entryPath) {
        const entryPathDepth = entryPath.split("/").length;
        if (basePath === "") {
          return entryPathDepth;
        }
        const basePathDepth = basePath.split("/").length;
        return entryPathDepth - basePathDepth;
      }
      _isSkippedSymbolicLink(entry) {
        return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
      }
      _isSkippedByPositivePatterns(entryPath, matcher) {
        return !this._settings.baseNameMatch && !matcher.match(entryPath);
      }
      _isSkippedByNegativePatterns(entryPath, patternsRe) {
        return !utils.pattern.matchAny(entryPath, patternsRe);
      }
    };
    exports2.default = DeepFilter;
  }
});

// ../../node_modules/fast-glob/out/providers/filters/entry.js
var require_entry = __commonJS({
  "../../node_modules/fast-glob/out/providers/filters/entry.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var EntryFilter = class {
      constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this.index = /* @__PURE__ */ new Map();
      }
      getFilter(positive, negative) {
        const [absoluteNegative, relativeNegative] = utils.pattern.partitionAbsoluteAndRelative(negative);
        const patterns = {
          positive: {
            all: utils.pattern.convertPatternsToRe(positive, this._micromatchOptions)
          },
          negative: {
            absolute: utils.pattern.convertPatternsToRe(absoluteNegative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true })),
            relative: utils.pattern.convertPatternsToRe(relativeNegative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true }))
          }
        };
        return (entry) => this._filter(entry, patterns);
      }
      _filter(entry, patterns) {
        const filepath = utils.path.removeLeadingDotSegment(entry.path);
        if (this._settings.unique && this._isDuplicateEntry(filepath)) {
          return false;
        }
        if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) {
          return false;
        }
        const isMatched = this._isMatchToPatternsSet(filepath, patterns, entry.dirent.isDirectory());
        if (this._settings.unique && isMatched) {
          this._createIndexRecord(filepath);
        }
        return isMatched;
      }
      _isDuplicateEntry(filepath) {
        return this.index.has(filepath);
      }
      _createIndexRecord(filepath) {
        this.index.set(filepath, void 0);
      }
      _onlyFileFilter(entry) {
        return this._settings.onlyFiles && !entry.dirent.isFile();
      }
      _onlyDirectoryFilter(entry) {
        return this._settings.onlyDirectories && !entry.dirent.isDirectory();
      }
      _isMatchToPatternsSet(filepath, patterns, isDirectory) {
        const isMatched = this._isMatchToPatterns(filepath, patterns.positive.all, isDirectory);
        if (!isMatched) {
          return false;
        }
        const isMatchedByRelativeNegative = this._isMatchToPatterns(filepath, patterns.negative.relative, isDirectory);
        if (isMatchedByRelativeNegative) {
          return false;
        }
        const isMatchedByAbsoluteNegative = this._isMatchToAbsoluteNegative(filepath, patterns.negative.absolute, isDirectory);
        if (isMatchedByAbsoluteNegative) {
          return false;
        }
        return true;
      }
      _isMatchToAbsoluteNegative(filepath, patternsRe, isDirectory) {
        if (patternsRe.length === 0) {
          return false;
        }
        const fullpath = utils.path.makeAbsolute(this._settings.cwd, filepath);
        return this._isMatchToPatterns(fullpath, patternsRe, isDirectory);
      }
      _isMatchToPatterns(filepath, patternsRe, isDirectory) {
        if (patternsRe.length === 0) {
          return false;
        }
        const isMatched = utils.pattern.matchAny(filepath, patternsRe);
        if (!isMatched && isDirectory) {
          return utils.pattern.matchAny(filepath + "/", patternsRe);
        }
        return isMatched;
      }
    };
    exports2.default = EntryFilter;
  }
});

// ../../node_modules/fast-glob/out/providers/filters/error.js
var require_error = __commonJS({
  "../../node_modules/fast-glob/out/providers/filters/error.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var ErrorFilter = class {
      constructor(_settings) {
        this._settings = _settings;
      }
      getFilter() {
        return (error) => this._isNonFatalError(error);
      }
      _isNonFatalError(error) {
        return utils.errno.isEnoentCodeError(error) || this._settings.suppressErrors;
      }
    };
    exports2.default = ErrorFilter;
  }
});

// ../../node_modules/fast-glob/out/providers/transformers/entry.js
var require_entry2 = __commonJS({
  "../../node_modules/fast-glob/out/providers/transformers/entry.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var EntryTransformer = class {
      constructor(_settings) {
        this._settings = _settings;
      }
      getTransformer() {
        return (entry) => this._transform(entry);
      }
      _transform(entry) {
        let filepath = entry.path;
        if (this._settings.absolute) {
          filepath = utils.path.makeAbsolute(this._settings.cwd, filepath);
          filepath = utils.path.unixify(filepath);
        }
        if (this._settings.markDirectories && entry.dirent.isDirectory()) {
          filepath += "/";
        }
        if (!this._settings.objectMode) {
          return filepath;
        }
        return Object.assign(Object.assign({}, entry), { path: filepath });
      }
    };
    exports2.default = EntryTransformer;
  }
});

// ../../node_modules/fast-glob/out/providers/provider.js
var require_provider = __commonJS({
  "../../node_modules/fast-glob/out/providers/provider.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path4 = require("path");
    var deep_1 = require_deep();
    var entry_1 = require_entry();
    var error_1 = require_error();
    var entry_2 = require_entry2();
    var Provider = class {
      constructor(_settings) {
        this._settings = _settings;
        this.errorFilter = new error_1.default(this._settings);
        this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
        this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
        this.entryTransformer = new entry_2.default(this._settings);
      }
      _getRootDirectory(task) {
        return path4.resolve(this._settings.cwd, task.base);
      }
      _getReaderOptions(task) {
        const basePath = task.base === "." ? "" : task.base;
        return {
          basePath,
          pathSegmentSeparator: "/",
          concurrency: this._settings.concurrency,
          deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
          entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
          errorFilter: this.errorFilter.getFilter(),
          followSymbolicLinks: this._settings.followSymbolicLinks,
          fs: this._settings.fs,
          stats: this._settings.stats,
          throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
          transform: this.entryTransformer.getTransformer()
        };
      }
      _getMicromatchOptions() {
        return {
          dot: this._settings.dot,
          matchBase: this._settings.baseNameMatch,
          nobrace: !this._settings.braceExpansion,
          nocase: !this._settings.caseSensitiveMatch,
          noext: !this._settings.extglob,
          noglobstar: !this._settings.globstar,
          posix: true,
          strictSlashes: false
        };
      }
    };
    exports2.default = Provider;
  }
});

// ../../node_modules/fast-glob/out/providers/async.js
var require_async6 = __commonJS({
  "../../node_modules/fast-glob/out/providers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var async_1 = require_async5();
    var provider_1 = require_provider();
    var ProviderAsync = class extends provider_1.default {
      constructor() {
        super(...arguments);
        this._reader = new async_1.default(this._settings);
      }
      async read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries2 = await this.api(root, task, options);
        return entries2.map((entry) => options.transform(entry));
      }
      api(root, task, options) {
        if (task.dynamic) {
          return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
      }
    };
    exports2.default = ProviderAsync;
  }
});

// ../../node_modules/fast-glob/out/providers/stream.js
var require_stream4 = __commonJS({
  "../../node_modules/fast-glob/out/providers/stream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var stream_1 = require("stream");
    var stream_2 = require_stream3();
    var provider_1 = require_provider();
    var ProviderStream = class extends provider_1.default {
      constructor() {
        super(...arguments);
        this._reader = new stream_2.default(this._settings);
      }
      read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const source = this.api(root, task, options);
        const destination = new stream_1.Readable({ objectMode: true, read: () => {
        } });
        source.once("error", (error) => destination.emit("error", error)).on("data", (entry) => destination.emit("data", options.transform(entry))).once("end", () => destination.emit("end"));
        destination.once("close", () => source.destroy());
        return destination;
      }
      api(root, task, options) {
        if (task.dynamic) {
          return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
      }
    };
    exports2.default = ProviderStream;
  }
});

// ../../node_modules/fast-glob/out/readers/sync.js
var require_sync5 = __commonJS({
  "../../node_modules/fast-glob/out/readers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fsStat = require_out();
    var fsWalk = require_out3();
    var reader_1 = require_reader2();
    var ReaderSync = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._walkSync = fsWalk.walkSync;
        this._statSync = fsStat.statSync;
      }
      dynamic(root, options) {
        return this._walkSync(root, options);
      }
      static(patterns, options) {
        const entries2 = [];
        for (const pattern of patterns) {
          const filepath = this._getFullEntryPath(pattern);
          const entry = this._getEntry(filepath, pattern, options);
          if (entry === null || !options.entryFilter(entry)) {
            continue;
          }
          entries2.push(entry);
        }
        return entries2;
      }
      _getEntry(filepath, pattern, options) {
        try {
          const stats = this._getStat(filepath);
          return this._makeEntry(stats, pattern);
        } catch (error) {
          if (options.errorFilter(error)) {
            return null;
          }
          throw error;
        }
      }
      _getStat(filepath) {
        return this._statSync(filepath, this._fsStatSettings);
      }
    };
    exports2.default = ReaderSync;
  }
});

// ../../node_modules/fast-glob/out/providers/sync.js
var require_sync6 = __commonJS({
  "../../node_modules/fast-glob/out/providers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var sync_1 = require_sync5();
    var provider_1 = require_provider();
    var ProviderSync = class extends provider_1.default {
      constructor() {
        super(...arguments);
        this._reader = new sync_1.default(this._settings);
      }
      read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries2 = this.api(root, task, options);
        return entries2.map(options.transform);
      }
      api(root, task, options) {
        if (task.dynamic) {
          return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
      }
    };
    exports2.default = ProviderSync;
  }
});

// ../../node_modules/fast-glob/out/settings.js
var require_settings4 = __commonJS({
  "../../node_modules/fast-glob/out/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
    var fs2 = require("fs");
    var os = require("os");
    var CPU_COUNT = Math.max(os.cpus().length, 1);
    exports2.DEFAULT_FILE_SYSTEM_ADAPTER = {
      lstat: fs2.lstat,
      lstatSync: fs2.lstatSync,
      stat: fs2.stat,
      statSync: fs2.statSync,
      readdir: fs2.readdir,
      readdirSync: fs2.readdirSync
    };
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.absolute = this._getValue(this._options.absolute, false);
        this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
        this.braceExpansion = this._getValue(this._options.braceExpansion, true);
        this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
        this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
        this.cwd = this._getValue(this._options.cwd, process.cwd());
        this.deep = this._getValue(this._options.deep, Infinity);
        this.dot = this._getValue(this._options.dot, false);
        this.extglob = this._getValue(this._options.extglob, true);
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
        this.fs = this._getFileSystemMethods(this._options.fs);
        this.globstar = this._getValue(this._options.globstar, true);
        this.ignore = this._getValue(this._options.ignore, []);
        this.markDirectories = this._getValue(this._options.markDirectories, false);
        this.objectMode = this._getValue(this._options.objectMode, false);
        this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
        this.onlyFiles = this._getValue(this._options.onlyFiles, true);
        this.stats = this._getValue(this._options.stats, false);
        this.suppressErrors = this._getValue(this._options.suppressErrors, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
        this.unique = this._getValue(this._options.unique, true);
        if (this.onlyDirectories) {
          this.onlyFiles = false;
        }
        if (this.stats) {
          this.objectMode = true;
        }
        this.ignore = [].concat(this.ignore);
      }
      _getValue(option, value) {
        return option === void 0 ? value : option;
      }
      _getFileSystemMethods(methods = {}) {
        return Object.assign(Object.assign({}, exports2.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
      }
    };
    exports2.default = Settings;
  }
});

// ../../node_modules/fast-glob/out/index.js
var require_out4 = __commonJS({
  "../../node_modules/fast-glob/out/index.js"(exports2, module2) {
    "use strict";
    var taskManager = require_tasks();
    var async_1 = require_async6();
    var stream_1 = require_stream4();
    var sync_1 = require_sync6();
    var settings_1 = require_settings4();
    var utils = require_utils3();
    async function FastGlob(source, options) {
      assertPatternsInput(source);
      const works = getWorks(source, async_1.default, options);
      const result = await Promise.all(works);
      return utils.array.flatten(result);
    }
    (function(FastGlob2) {
      FastGlob2.glob = FastGlob2;
      FastGlob2.globSync = sync;
      FastGlob2.globStream = stream;
      FastGlob2.async = FastGlob2;
      function sync(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, sync_1.default, options);
        return utils.array.flatten(works);
      }
      FastGlob2.sync = sync;
      function stream(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, stream_1.default, options);
        return utils.stream.merge(works);
      }
      FastGlob2.stream = stream;
      function generateTasks(source, options) {
        assertPatternsInput(source);
        const patterns = [].concat(source);
        const settings = new settings_1.default(options);
        return taskManager.generate(patterns, settings);
      }
      FastGlob2.generateTasks = generateTasks;
      function isDynamicPattern(source, options) {
        assertPatternsInput(source);
        const settings = new settings_1.default(options);
        return utils.pattern.isDynamicPattern(source, settings);
      }
      FastGlob2.isDynamicPattern = isDynamicPattern;
      function escapePath(source) {
        assertPatternsInput(source);
        return utils.path.escape(source);
      }
      FastGlob2.escapePath = escapePath;
      function convertPathToPattern(source) {
        assertPatternsInput(source);
        return utils.path.convertPathToPattern(source);
      }
      FastGlob2.convertPathToPattern = convertPathToPattern;
      let posix;
      (function(posix2) {
        function escapePath2(source) {
          assertPatternsInput(source);
          return utils.path.escapePosixPath(source);
        }
        posix2.escapePath = escapePath2;
        function convertPathToPattern2(source) {
          assertPatternsInput(source);
          return utils.path.convertPosixPathToPattern(source);
        }
        posix2.convertPathToPattern = convertPathToPattern2;
      })(posix = FastGlob2.posix || (FastGlob2.posix = {}));
      let win32;
      (function(win322) {
        function escapePath2(source) {
          assertPatternsInput(source);
          return utils.path.escapeWindowsPath(source);
        }
        win322.escapePath = escapePath2;
        function convertPathToPattern2(source) {
          assertPatternsInput(source);
          return utils.path.convertWindowsPathToPattern(source);
        }
        win322.convertPathToPattern = convertPathToPattern2;
      })(win32 = FastGlob2.win32 || (FastGlob2.win32 = {}));
    })(FastGlob || (FastGlob = {}));
    function getWorks(source, _Provider, options) {
      const patterns = [].concat(source);
      const settings = new settings_1.default(options);
      const tasks = taskManager.generate(patterns, settings);
      const provider = new _Provider(settings);
      return tasks.map(provider.read, provider);
    }
    function assertPatternsInput(input) {
      const source = [].concat(input);
      const isValidSource = source.every((item) => utils.string.isString(item) && !utils.string.isEmpty(item));
      if (!isValidSource) {
        throw new TypeError("Patterns must be a string (non empty) or an array of strings");
      }
    }
    module2.exports = FastGlob;
  }
});

// src/index.ts
var import_promises2 = require("fs/promises");
var import_node_path2 = __toESM(require("path"), 1);
var import_node_process2 = __toESM(require("process"), 1);
var import_node_url = require("url");

// ../../node_modules/commander/lib/error.js
var CommanderError = class extends Error {
  /**
   * Constructs the CommanderError class
   * @param {number} exitCode suggested exit code which could be used with process.exit
   * @param {string} code an id string representing the error
   * @param {string} message human-readable description of the error
   */
  constructor(exitCode, code, message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.code = code;
    this.exitCode = exitCode;
    this.nestedError = void 0;
  }
};
var InvalidArgumentError = class extends CommanderError {
  /**
   * Constructs the InvalidArgumentError class
   * @param {string} [message] explanation of why argument is invalid
   */
  constructor(message) {
    super(1, "commander.invalidArgument", message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
};

// ../../node_modules/commander/lib/argument.js
var Argument = class {
  /**
   * Initialize a new command argument with the given name and description.
   * The default is that the argument is required, and you can explicitly
   * indicate this with <> around the name. Put [] around the name for an optional argument.
   *
   * @param {string} name
   * @param {string} [description]
   */
  constructor(name, description) {
    this.description = description || "";
    this.variadic = false;
    this.parseArg = void 0;
    this.defaultValue = void 0;
    this.defaultValueDescription = void 0;
    this.argChoices = void 0;
    switch (name[0]) {
      case "<":
        this.required = true;
        this._name = name.slice(1, -1);
        break;
      case "[":
        this.required = false;
        this._name = name.slice(1, -1);
        break;
      default:
        this.required = true;
        this._name = name;
        break;
    }
    if (this._name.endsWith("...")) {
      this.variadic = true;
      this._name = this._name.slice(0, -3);
    }
  }
  /**
   * Return argument name.
   *
   * @return {string}
   */
  name() {
    return this._name;
  }
  /**
   * @package
   */
  _collectValue(value, previous) {
    if (previous === this.defaultValue || !Array.isArray(previous)) {
      return [value];
    }
    previous.push(value);
    return previous;
  }
  /**
   * Set the default value, and optionally supply the description to be displayed in the help.
   *
   * @param {*} value
   * @param {string} [description]
   * @return {Argument}
   */
  default(value, description) {
    this.defaultValue = value;
    this.defaultValueDescription = description;
    return this;
  }
  /**
   * Set the custom handler for processing CLI command arguments into argument values.
   *
   * @param {Function} [fn]
   * @return {Argument}
   */
  argParser(fn) {
    this.parseArg = fn;
    return this;
  }
  /**
   * Only allow argument value to be one of choices.
   *
   * @param {string[]} values
   * @return {Argument}
   */
  choices(values) {
    this.argChoices = values.slice();
    this.parseArg = (arg, previous) => {
      if (!this.argChoices.includes(arg)) {
        throw new InvalidArgumentError(
          `Allowed choices are ${this.argChoices.join(", ")}.`
        );
      }
      if (this.variadic) {
        return this._collectValue(arg, previous);
      }
      return arg;
    };
    return this;
  }
  /**
   * Make argument required.
   *
   * @returns {Argument}
   */
  argRequired() {
    this.required = true;
    return this;
  }
  /**
   * Make argument optional.
   *
   * @returns {Argument}
   */
  argOptional() {
    this.required = false;
    return this;
  }
};
function humanReadableArgName(arg) {
  const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");
  return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
}

// ../../node_modules/commander/lib/command.js
var import_node_events = require("events");
var import_node_child_process = __toESM(require("child_process"), 1);
var import_node_path = __toESM(require("path"), 1);
var import_node_fs = __toESM(require("fs"), 1);
var import_node_process = __toESM(require("process"), 1);
var import_node_util2 = require("util");

// ../../node_modules/commander/lib/help.js
var import_node_util = require("util");
var Help = class {
  constructor() {
    this.helpWidth = void 0;
    this.minWidthToWrap = 40;
    this.sortSubcommands = false;
    this.sortOptions = false;
    this.showGlobalOptions = false;
  }
  /**
   * prepareContext is called by Commander after applying overrides from `Command.configureHelp()`
   * and just before calling `formatHelp()`.
   *
   * Commander just uses the helpWidth and the rest is provided for optional use by more complex subclasses.
   *
   * @param {{ error?: boolean, helpWidth?: number, outputHasColors?: boolean }} contextOptions
   */
  prepareContext(contextOptions) {
    this.helpWidth = this.helpWidth ?? contextOptions.helpWidth ?? 80;
  }
  /**
   * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
   *
   * @param {Command} cmd
   * @returns {Command[]}
   */
  visibleCommands(cmd) {
    const visibleCommands = cmd.commands.filter((cmd2) => !cmd2._hidden);
    const helpCommand = cmd._getHelpCommand();
    if (helpCommand && !helpCommand._hidden) {
      visibleCommands.push(helpCommand);
    }
    if (this.sortSubcommands) {
      visibleCommands.sort((a, b) => {
        return a.name().localeCompare(b.name());
      });
    }
    return visibleCommands;
  }
  /**
   * Compare options for sort.
   *
   * @param {Option} a
   * @param {Option} b
   * @returns {number}
   */
  compareOptions(a, b) {
    const getSortKey = (option) => {
      return option.short ? option.short.replace(/^-/, "") : option.long.replace(/^--/, "");
    };
    return getSortKey(a).localeCompare(getSortKey(b));
  }
  /**
   * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
   *
   * @param {Command} cmd
   * @returns {Option[]}
   */
  visibleOptions(cmd) {
    const visibleOptions = cmd.options.filter((option) => !option.hidden);
    const helpOption = cmd._getHelpOption();
    if (helpOption && !helpOption.hidden) {
      const removeShort = helpOption.short && cmd._findOption(helpOption.short);
      const removeLong = helpOption.long && cmd._findOption(helpOption.long);
      if (!removeShort && !removeLong) {
        visibleOptions.push(helpOption);
      } else if (helpOption.long && !removeLong) {
        visibleOptions.push(
          cmd.createOption(helpOption.long, helpOption.description)
        );
      } else if (helpOption.short && !removeShort) {
        visibleOptions.push(
          cmd.createOption(helpOption.short, helpOption.description)
        );
      }
    }
    if (this.sortOptions) {
      visibleOptions.sort(this.compareOptions);
    }
    return visibleOptions;
  }
  /**
   * Get an array of the visible global options. (Not including help.)
   *
   * @param {Command} cmd
   * @returns {Option[]}
   */
  visibleGlobalOptions(cmd) {
    if (!this.showGlobalOptions) return [];
    const globalOptions = [];
    for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
      const visibleOptions = ancestorCmd.options.filter(
        (option) => !option.hidden
      );
      globalOptions.push(...visibleOptions);
    }
    if (this.sortOptions) {
      globalOptions.sort(this.compareOptions);
    }
    return globalOptions;
  }
  /**
   * Get an array of the arguments if any have a description.
   *
   * @param {Command} cmd
   * @returns {Argument[]}
   */
  visibleArguments(cmd) {
    if (cmd._argsDescription) {
      cmd.registeredArguments.forEach((argument) => {
        argument.description = argument.description || cmd._argsDescription[argument.name()] || "";
      });
    }
    if (cmd.registeredArguments.find((argument) => argument.description)) {
      return cmd.registeredArguments;
    }
    return [];
  }
  /**
   * Get the command term to show in the list of subcommands.
   *
   * @param {Command} cmd
   * @returns {string}
   */
  subcommandTerm(cmd) {
    const args = cmd.registeredArguments.map((arg) => humanReadableArgName(arg)).join(" ");
    return cmd._name + (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") + (cmd.options.length ? " [options]" : "") + // simplistic check for non-help option
    (args ? " " + args : "");
  }
  /**
   * Get the option term to show in the list of options.
   *
   * @param {Option} option
   * @returns {string}
   */
  optionTerm(option) {
    return option.flags;
  }
  /**
   * Get the argument term to show in the list of arguments.
   *
   * @param {Argument} argument
   * @returns {string}
   */
  argumentTerm(argument) {
    return argument.name();
  }
  /**
   * Get the longest command term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */
  longestSubcommandTermLength(cmd, helper) {
    return helper.visibleCommands(cmd).reduce((max, command) => {
      return Math.max(
        max,
        this.displayWidth(
          helper.styleSubcommandTerm(helper.subcommandTerm(command))
        )
      );
    }, 0);
  }
  /**
   * Get the longest option term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */
  longestOptionTermLength(cmd, helper) {
    return helper.visibleOptions(cmd).reduce((max, option) => {
      return Math.max(
        max,
        this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option)))
      );
    }, 0);
  }
  /**
   * Get the longest global option term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */
  longestGlobalOptionTermLength(cmd, helper) {
    return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
      return Math.max(
        max,
        this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option)))
      );
    }, 0);
  }
  /**
   * Get the longest argument term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */
  longestArgumentTermLength(cmd, helper) {
    return helper.visibleArguments(cmd).reduce((max, argument) => {
      return Math.max(
        max,
        this.displayWidth(
          helper.styleArgumentTerm(helper.argumentTerm(argument))
        )
      );
    }, 0);
  }
  /**
   * Get the command usage to be displayed at the top of the built-in help.
   *
   * @param {Command} cmd
   * @returns {string}
   */
  commandUsage(cmd) {
    let cmdName = cmd._name;
    if (cmd._aliases[0]) {
      cmdName = cmdName + "|" + cmd._aliases[0];
    }
    let ancestorCmdNames = "";
    for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
      ancestorCmdNames = ancestorCmd.name() + " " + ancestorCmdNames;
    }
    return ancestorCmdNames + cmdName + " " + cmd.usage();
  }
  /**
   * Get the description for the command.
   *
   * @param {Command} cmd
   * @returns {string}
   */
  commandDescription(cmd) {
    return cmd.description();
  }
  /**
   * Get the subcommand summary to show in the list of subcommands.
   * (Fallback to description for backwards compatibility.)
   *
   * @param {Command} cmd
   * @returns {string}
   */
  subcommandDescription(cmd) {
    return cmd.summary() || cmd.description();
  }
  /**
   * Get the option description to show in the list of options.
   *
   * @param {Option} option
   * @return {string}
   */
  optionDescription(option) {
    const extraInfo = [];
    if (option.argChoices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
      );
    }
    if (option.defaultValue !== void 0) {
      const showDefault = option.required || option.optional || option.isBoolean() && typeof option.defaultValue === "boolean";
      if (showDefault) {
        extraInfo.push(
          `default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`
        );
      }
    }
    if (option.presetArg !== void 0 && option.optional) {
      extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
    }
    if (option.envVar !== void 0) {
      extraInfo.push(`env: ${option.envVar}`);
    }
    if (extraInfo.length > 0) {
      const extraDescription = `(${extraInfo.join(", ")})`;
      if (option.description) {
        return `${option.description} ${extraDescription}`;
      }
      return extraDescription;
    }
    return option.description;
  }
  /**
   * Get the argument description to show in the list of arguments.
   *
   * @param {Argument} argument
   * @return {string}
   */
  argumentDescription(argument) {
    const extraInfo = [];
    if (argument.argChoices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
      );
    }
    if (argument.defaultValue !== void 0) {
      extraInfo.push(
        `default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`
      );
    }
    if (extraInfo.length > 0) {
      const extraDescription = `(${extraInfo.join(", ")})`;
      if (argument.description) {
        return `${argument.description} ${extraDescription}`;
      }
      return extraDescription;
    }
    return argument.description;
  }
  /**
   * Format a list of items, given a heading and an array of formatted items.
   *
   * @param {string} heading
   * @param {string[]} items
   * @param {Help} helper
   * @returns string[]
   */
  formatItemList(heading, items, helper) {
    if (items.length === 0) return [];
    return [helper.styleTitle(heading), ...items, ""];
  }
  /**
   * Group items by their help group heading.
   *
   * @param {Command[] | Option[]} unsortedItems
   * @param {Command[] | Option[]} visibleItems
   * @param {Function} getGroup
   * @returns {Map<string, Command[] | Option[]>}
   */
  groupItems(unsortedItems, visibleItems, getGroup) {
    const result = /* @__PURE__ */ new Map();
    unsortedItems.forEach((item) => {
      const group = getGroup(item);
      if (!result.has(group)) result.set(group, []);
    });
    visibleItems.forEach((item) => {
      const group = getGroup(item);
      if (!result.has(group)) {
        result.set(group, []);
      }
      result.get(group).push(item);
    });
    return result;
  }
  /**
   * Generate the built-in help text.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {string}
   */
  formatHelp(cmd, helper) {
    const termWidth = helper.padWidth(cmd, helper);
    const helpWidth = helper.helpWidth ?? 80;
    function callFormatItem(term, description) {
      return helper.formatItem(term, termWidth, description, helper);
    }
    let output = [
      `${helper.styleTitle("Usage:")} ${helper.styleUsage(helper.commandUsage(cmd))}`,
      ""
    ];
    const commandDescription = helper.commandDescription(cmd);
    if (commandDescription.length > 0) {
      output = output.concat([
        helper.boxWrap(
          helper.styleCommandDescription(commandDescription),
          helpWidth
        ),
        ""
      ]);
    }
    const argumentList = helper.visibleArguments(cmd).map((argument) => {
      return callFormatItem(
        helper.styleArgumentTerm(helper.argumentTerm(argument)),
        helper.styleArgumentDescription(helper.argumentDescription(argument))
      );
    });
    output = output.concat(
      this.formatItemList("Arguments:", argumentList, helper)
    );
    const optionGroups = this.groupItems(
      cmd.options,
      helper.visibleOptions(cmd),
      (option) => option.helpGroupHeading ?? "Options:"
    );
    optionGroups.forEach((options, group) => {
      const optionList = options.map((option) => {
        return callFormatItem(
          helper.styleOptionTerm(helper.optionTerm(option)),
          helper.styleOptionDescription(helper.optionDescription(option))
        );
      });
      output = output.concat(this.formatItemList(group, optionList, helper));
    });
    if (helper.showGlobalOptions) {
      const globalOptionList = helper.visibleGlobalOptions(cmd).map((option) => {
        return callFormatItem(
          helper.styleOptionTerm(helper.optionTerm(option)),
          helper.styleOptionDescription(helper.optionDescription(option))
        );
      });
      output = output.concat(
        this.formatItemList("Global Options:", globalOptionList, helper)
      );
    }
    const commandGroups = this.groupItems(
      cmd.commands,
      helper.visibleCommands(cmd),
      (sub) => sub.helpGroup() || "Commands:"
    );
    commandGroups.forEach((commands, group) => {
      const commandList = commands.map((sub) => {
        return callFormatItem(
          helper.styleSubcommandTerm(helper.subcommandTerm(sub)),
          helper.styleSubcommandDescription(helper.subcommandDescription(sub))
        );
      });
      output = output.concat(this.formatItemList(group, commandList, helper));
    });
    return output.join("\n");
  }
  /**
   * Return display width of string, ignoring ANSI escape sequences. Used in padding and wrapping calculations.
   *
   * @param {string} str
   * @returns {number}
   */
  displayWidth(str) {
    return (0, import_node_util.stripVTControlCharacters)(str).length;
  }
  /**
   * Style the title for displaying in the help. Called with 'Usage:', 'Options:', etc.
   *
   * @param {string} str
   * @returns {string}
   */
  styleTitle(str) {
    return str;
  }
  styleUsage(str) {
    return str.split(" ").map((word) => {
      if (word === "[options]") return this.styleOptionText(word);
      if (word === "[command]") return this.styleSubcommandText(word);
      if (word[0] === "[" || word[0] === "<")
        return this.styleArgumentText(word);
      return this.styleCommandText(word);
    }).join(" ");
  }
  styleCommandDescription(str) {
    return this.styleDescriptionText(str);
  }
  styleOptionDescription(str) {
    return this.styleDescriptionText(str);
  }
  styleSubcommandDescription(str) {
    return this.styleDescriptionText(str);
  }
  styleArgumentDescription(str) {
    return this.styleDescriptionText(str);
  }
  styleDescriptionText(str) {
    return str;
  }
  styleOptionTerm(str) {
    return this.styleOptionText(str);
  }
  styleSubcommandTerm(str) {
    return str.split(" ").map((word) => {
      if (word === "[options]") return this.styleOptionText(word);
      if (word[0] === "[" || word[0] === "<")
        return this.styleArgumentText(word);
      return this.styleSubcommandText(word);
    }).join(" ");
  }
  styleArgumentTerm(str) {
    return this.styleArgumentText(str);
  }
  styleOptionText(str) {
    return str;
  }
  styleArgumentText(str) {
    return str;
  }
  styleSubcommandText(str) {
    return str;
  }
  styleCommandText(str) {
    return str;
  }
  /**
   * Calculate the pad width from the maximum term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */
  padWidth(cmd, helper) {
    return Math.max(
      helper.longestOptionTermLength(cmd, helper),
      helper.longestGlobalOptionTermLength(cmd, helper),
      helper.longestSubcommandTermLength(cmd, helper),
      helper.longestArgumentTermLength(cmd, helper)
    );
  }
  /**
   * Detect manually wrapped and indented strings by checking for line break followed by whitespace.
   *
   * @param {string} str
   * @returns {boolean}
   */
  preformatted(str) {
    return /\n[^\S\r\n]/.test(str);
  }
  /**
   * Format the "item", which consists of a term and description. Pad the term and wrap the description, indenting the following lines.
   *
   * So "TTT", 5, "DDD DDDD DD DDD" might be formatted for this.helpWidth=17 like so:
   *   TTT  DDD DDDD
   *        DD DDD
   *
   * @param {string} term
   * @param {number} termWidth
   * @param {string} description
   * @param {Help} helper
   * @returns {string}
   */
  formatItem(term, termWidth, description, helper) {
    const itemIndent = 2;
    const itemIndentStr = " ".repeat(itemIndent);
    if (!description) return itemIndentStr + term;
    const paddedTerm = term.padEnd(
      termWidth + term.length - helper.displayWidth(term)
    );
    const spacerWidth = 2;
    const helpWidth = this.helpWidth ?? 80;
    const remainingWidth = helpWidth - termWidth - spacerWidth - itemIndent;
    let formattedDescription;
    if (remainingWidth < this.minWidthToWrap || helper.preformatted(description)) {
      formattedDescription = description;
    } else {
      const wrappedDescription = helper.boxWrap(description, remainingWidth);
      formattedDescription = wrappedDescription.replace(
        /\n/g,
        "\n" + " ".repeat(termWidth + spacerWidth)
      );
    }
    return itemIndentStr + paddedTerm + " ".repeat(spacerWidth) + formattedDescription.replace(/\n/g, `
${itemIndentStr}`);
  }
  /**
   * Wrap a string at whitespace, preserving existing line breaks.
   * Wrapping is skipped if the width is less than `minWidthToWrap`.
   *
   * @param {string} str
   * @param {number} width
   * @returns {string}
   */
  boxWrap(str, width) {
    if (width < this.minWidthToWrap) return str;
    const rawLines = str.split(/\r\n|\n/);
    const chunkPattern = /[\s]*[^\s]+/g;
    const wrappedLines = [];
    rawLines.forEach((line) => {
      const chunks = line.match(chunkPattern);
      if (chunks === null) {
        wrappedLines.push("");
        return;
      }
      let sumChunks = [chunks.shift()];
      let sumWidth = this.displayWidth(sumChunks[0]);
      chunks.forEach((chunk) => {
        const visibleWidth = this.displayWidth(chunk);
        if (sumWidth + visibleWidth <= width) {
          sumChunks.push(chunk);
          sumWidth += visibleWidth;
          return;
        }
        wrappedLines.push(sumChunks.join(""));
        const nextChunk = chunk.trimStart();
        sumChunks = [nextChunk];
        sumWidth = this.displayWidth(nextChunk);
      });
      wrappedLines.push(sumChunks.join(""));
    });
    return wrappedLines.join("\n");
  }
};

// ../../node_modules/commander/lib/option.js
var Option = class {
  /**
   * Initialize a new `Option` with the given `flags` and `description`.
   *
   * @param {string} flags
   * @param {string} [description]
   */
  constructor(flags, description) {
    this.flags = flags;
    this.description = description || "";
    this.required = flags.includes("<");
    this.optional = flags.includes("[");
    this.variadic = /\w\.\.\.[>\]]$/.test(flags);
    this.mandatory = false;
    const optionFlags = splitOptionFlags(flags);
    this.short = optionFlags.shortFlag;
    this.long = optionFlags.longFlag;
    this.negate = false;
    if (this.long) {
      this.negate = this.long.startsWith("--no-");
    }
    this.defaultValue = void 0;
    this.defaultValueDescription = void 0;
    this.presetArg = void 0;
    this.envVar = void 0;
    this.parseArg = void 0;
    this.hidden = false;
    this.argChoices = void 0;
    this.conflictsWith = [];
    this.implied = void 0;
    this.helpGroupHeading = void 0;
  }
  /**
   * Set the default value, and optionally supply the description to be displayed in the help.
   *
   * @param {*} value
   * @param {string} [description]
   * @return {Option}
   */
  default(value, description) {
    this.defaultValue = value;
    this.defaultValueDescription = description;
    return this;
  }
  /**
   * Preset to use when option used without option-argument, especially optional but also boolean and negated.
   * The custom processing (parseArg) is called.
   *
   * @example
   * new Option('--color').default('GREYSCALE').preset('RGB');
   * new Option('--donate [amount]').preset('20').argParser(parseFloat);
   *
   * @param {*} arg
   * @return {Option}
   */
  preset(arg) {
    this.presetArg = arg;
    return this;
  }
  /**
   * Add option name(s) that conflict with this option.
   * An error will be displayed if conflicting options are found during parsing.
   *
   * @example
   * new Option('--rgb').conflicts('cmyk');
   * new Option('--js').conflicts(['ts', 'jsx']);
   *
   * @param {(string | string[])} names
   * @return {Option}
   */
  conflicts(names) {
    this.conflictsWith = this.conflictsWith.concat(names);
    return this;
  }
  /**
   * Specify implied option values for when this option is set and the implied options are not.
   *
   * The custom processing (parseArg) is not called on the implied values.
   *
   * @example
   * program
   *   .addOption(new Option('--log', 'write logging information to file'))
   *   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
   *
   * @param {object} impliedOptionValues
   * @return {Option}
   */
  implies(impliedOptionValues) {
    let newImplied = impliedOptionValues;
    if (typeof impliedOptionValues === "string") {
      newImplied = { [impliedOptionValues]: true };
    }
    this.implied = Object.assign(this.implied || {}, newImplied);
    return this;
  }
  /**
   * Set environment variable to check for option value.
   *
   * An environment variable is only used if when processed the current option value is
   * undefined, or the source of the current value is 'default' or 'config' or 'env'.
   *
   * @param {string} name
   * @return {Option}
   */
  env(name) {
    this.envVar = name;
    return this;
  }
  /**
   * Set the custom handler for processing CLI option arguments into option values.
   *
   * @param {Function} [fn]
   * @return {Option}
   */
  argParser(fn) {
    this.parseArg = fn;
    return this;
  }
  /**
   * Whether the option is mandatory and must have a value after parsing.
   *
   * @param {boolean} [mandatory=true]
   * @return {Option}
   */
  makeOptionMandatory(mandatory = true) {
    this.mandatory = !!mandatory;
    return this;
  }
  /**
   * Hide option in help.
   *
   * @param {boolean} [hide=true]
   * @return {Option}
   */
  hideHelp(hide = true) {
    this.hidden = !!hide;
    return this;
  }
  /**
   * @package
   */
  _collectValue(value, previous) {
    if (previous === this.defaultValue || !Array.isArray(previous)) {
      return [value];
    }
    previous.push(value);
    return previous;
  }
  /**
   * Only allow option value to be one of choices.
   *
   * @param {string[]} values
   * @return {Option}
   */
  choices(values) {
    this.argChoices = values.slice();
    this.parseArg = (arg, previous) => {
      if (!this.argChoices.includes(arg)) {
        throw new InvalidArgumentError(
          `Allowed choices are ${this.argChoices.join(", ")}.`
        );
      }
      if (this.variadic) {
        return this._collectValue(arg, previous);
      }
      return arg;
    };
    return this;
  }
  /**
   * Return option name.
   *
   * @return {string}
   */
  name() {
    if (this.long) {
      return this.long.replace(/^--/, "");
    }
    return this.short.replace(/^-/, "");
  }
  /**
   * Return option name, in a camelcase format that can be used
   * as an object attribute key.
   *
   * @return {string}
   */
  attributeName() {
    if (this.negate) {
      return camelcase(this.name().replace(/^no-/, ""));
    }
    return camelcase(this.name());
  }
  /**
   * Set the help group heading.
   *
   * @param {string} heading
   * @return {Option}
   */
  helpGroup(heading) {
    this.helpGroupHeading = heading;
    return this;
  }
  /**
   * Check if `arg` matches the short or long flag.
   *
   * @param {string} arg
   * @return {boolean}
   * @package
   */
  is(arg) {
    return this.short === arg || this.long === arg;
  }
  /**
   * Return whether a boolean option.
   *
   * Options are one of boolean, negated, required argument, or optional argument.
   *
   * @return {boolean}
   * @package
   */
  isBoolean() {
    return !this.required && !this.optional && !this.negate;
  }
};
var DualOptions = class {
  /**
   * @param {Option[]} options
   */
  constructor(options) {
    this.positiveOptions = /* @__PURE__ */ new Map();
    this.negativeOptions = /* @__PURE__ */ new Map();
    this.dualOptions = /* @__PURE__ */ new Set();
    options.forEach((option) => {
      if (option.negate) {
        this.negativeOptions.set(option.attributeName(), option);
      } else {
        this.positiveOptions.set(option.attributeName(), option);
      }
    });
    this.negativeOptions.forEach((value, key) => {
      if (this.positiveOptions.has(key)) {
        this.dualOptions.add(key);
      }
    });
  }
  /**
   * Did the value come from the option, and not from possible matching dual option?
   *
   * @param {*} value
   * @param {Option} option
   * @returns {boolean}
   */
  valueFromOption(value, option) {
    const optionKey = option.attributeName();
    if (!this.dualOptions.has(optionKey)) return true;
    const preset = this.negativeOptions.get(optionKey).presetArg;
    const negativeValue = preset !== void 0 ? preset : false;
    return option.negate === (negativeValue === value);
  }
};
function camelcase(str) {
  return str.split("-").reduce((str2, word) => {
    return str2 + word[0].toUpperCase() + word.slice(1);
  });
}
function splitOptionFlags(flags) {
  let shortFlag;
  let longFlag;
  const shortFlagExp = /^-[^-]$/;
  const longFlagExp = /^--[^-]/;
  const flagParts = flags.split(/[ |,]+/).concat("guard");
  if (shortFlagExp.test(flagParts[0])) shortFlag = flagParts.shift();
  if (longFlagExp.test(flagParts[0])) longFlag = flagParts.shift();
  if (!shortFlag && shortFlagExp.test(flagParts[0]))
    shortFlag = flagParts.shift();
  if (!shortFlag && longFlagExp.test(flagParts[0])) {
    shortFlag = longFlag;
    longFlag = flagParts.shift();
  }
  if (flagParts[0].startsWith("-")) {
    const unsupportedFlag = flagParts[0];
    const baseError = `option creation failed due to '${unsupportedFlag}' in option flags '${flags}'`;
    if (/^-[^-][^-]/.test(unsupportedFlag))
      throw new Error(
        `${baseError}
- a short flag is a single dash and a single character
  - either use a single dash and a single character (for a short flag)
  - or use a double dash for a long option (and can have two, like '--ws, --workspace')`
      );
    if (shortFlagExp.test(unsupportedFlag))
      throw new Error(`${baseError}
- too many short flags`);
    if (longFlagExp.test(unsupportedFlag))
      throw new Error(`${baseError}
- too many long flags`);
    throw new Error(`${baseError}
- unrecognised flag format`);
  }
  if (shortFlag === void 0 && longFlag === void 0)
    throw new Error(
      `option creation failed due to no flags found in '${flags}'.`
    );
  return { shortFlag, longFlag };
}

// ../../node_modules/commander/lib/suggestSimilar.js
var maxDistance = 3;
function editDistance(a, b) {
  if (Math.abs(a.length - b.length) > maxDistance)
    return Math.max(a.length, b.length);
  const d = [];
  for (let i = 0; i <= a.length; i++) {
    d[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    d[0][j] = j;
  }
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      let cost;
      if (a[i - 1] === b[j - 1]) {
        cost = 0;
      } else {
        cost = 1;
      }
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        // deletion
        d[i][j - 1] + 1,
        // insertion
        d[i - 1][j - 1] + cost
        // substitution
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}
function suggestSimilar(word, candidates) {
  if (!candidates || candidates.length === 0) return "";
  candidates = Array.from(new Set(candidates));
  const searchingOptions = word.startsWith("--");
  if (searchingOptions) {
    word = word.slice(2);
    candidates = candidates.map((candidate) => candidate.slice(2));
  }
  let similar = [];
  let bestDistance = maxDistance;
  const minSimilarity = 0.4;
  candidates.forEach((candidate) => {
    if (candidate.length <= 1) return;
    const distance = editDistance(word, candidate);
    const length = Math.max(word.length, candidate.length);
    const similarity = (length - distance) / length;
    if (similarity > minSimilarity) {
      if (distance < bestDistance) {
        bestDistance = distance;
        similar = [candidate];
      } else if (distance === bestDistance) {
        similar.push(candidate);
      }
    }
  });
  similar.sort((a, b) => a.localeCompare(b));
  if (searchingOptions) {
    similar = similar.map((candidate) => `--${candidate}`);
  }
  if (similar.length > 1) {
    return `
(Did you mean one of ${similar.join(", ")}?)`;
  }
  if (similar.length === 1) {
    return `
(Did you mean ${similar[0]}?)`;
  }
  return "";
}

// ../../node_modules/commander/lib/command.js
var Command = class _Command extends import_node_events.EventEmitter {
  /**
   * Initialize a new `Command`.
   *
   * @param {string} [name]
   */
  constructor(name) {
    super();
    this.commands = [];
    this.options = [];
    this.parent = null;
    this._allowUnknownOption = false;
    this._allowExcessArguments = false;
    this.registeredArguments = [];
    this._args = this.registeredArguments;
    this.args = [];
    this.rawArgs = [];
    this.processedArgs = [];
    this._scriptPath = null;
    this._name = name || "";
    this._optionValues = {};
    this._optionValueSources = {};
    this._storeOptionsAsProperties = false;
    this._actionHandler = null;
    this._executableHandler = false;
    this._executableFile = null;
    this._executableDir = null;
    this._defaultCommandName = null;
    this._exitCallback = null;
    this._aliases = [];
    this._combineFlagAndOptionalValue = true;
    this._description = "";
    this._summary = "";
    this._argsDescription = void 0;
    this._enablePositionalOptions = false;
    this._passThroughOptions = false;
    this._lifeCycleHooks = {};
    this._showHelpAfterError = false;
    this._showSuggestionAfterError = true;
    this._savedState = null;
    this._outputConfiguration = {
      writeOut: (str) => import_node_process.default.stdout.write(str),
      writeErr: (str) => import_node_process.default.stderr.write(str),
      outputError: (str, write) => write(str),
      getOutHelpWidth: () => import_node_process.default.stdout.isTTY ? import_node_process.default.stdout.columns : void 0,
      getErrHelpWidth: () => import_node_process.default.stderr.isTTY ? import_node_process.default.stderr.columns : void 0,
      getOutHasColors: () => useColor() ?? (import_node_process.default.stdout.isTTY && import_node_process.default.stdout.hasColors?.()),
      getErrHasColors: () => useColor() ?? (import_node_process.default.stderr.isTTY && import_node_process.default.stderr.hasColors?.()),
      stripColor: (str) => (0, import_node_util2.stripVTControlCharacters)(str)
    };
    this._hidden = false;
    this._helpOption = void 0;
    this._addImplicitHelpCommand = void 0;
    this._helpCommand = void 0;
    this._helpConfiguration = {};
    this._helpGroupHeading = void 0;
    this._defaultCommandGroup = void 0;
    this._defaultOptionGroup = void 0;
  }
  /**
   * Copy settings that are useful to have in common across root command and subcommands.
   *
   * (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
   *
   * @param {Command} sourceCommand
   * @return {Command} `this` command for chaining
   */
  copyInheritedSettings(sourceCommand) {
    this._outputConfiguration = sourceCommand._outputConfiguration;
    this._helpOption = sourceCommand._helpOption;
    this._helpCommand = sourceCommand._helpCommand;
    this._helpConfiguration = sourceCommand._helpConfiguration;
    this._exitCallback = sourceCommand._exitCallback;
    this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
    this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
    this._allowExcessArguments = sourceCommand._allowExcessArguments;
    this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
    this._showHelpAfterError = sourceCommand._showHelpAfterError;
    this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;
    return this;
  }
  /**
   * @returns {Command[]}
   * @private
   */
  _getCommandAndAncestors() {
    const result = [];
    for (let command = this; command; command = command.parent) {
      result.push(command);
    }
    return result;
  }
  /**
   * Define a command.
   *
   * There are two styles of command: pay attention to where to put the description.
   *
   * @example
   * // Command implemented using action handler (description is supplied separately to `.command`)
   * program
   *   .command('clone <source> [destination]')
   *   .description('clone a repository into a newly created directory')
   *   .action((source, destination) => {
   *     console.log('clone command called');
   *   });
   *
   * // Command implemented using separate executable file (description is second parameter to `.command`)
   * program
   *   .command('start <service>', 'start named service')
   *   .command('stop [service]', 'stop named service, or all if no name supplied');
   *
   * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
   * @param {(object | string)} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
   * @param {object} [execOpts] - configuration options (for executable)
   * @return {Command} returns new command for action handler, or `this` for executable command
   */
  command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
    let desc = actionOptsOrExecDesc;
    let opts = execOpts;
    if (typeof desc === "object" && desc !== null) {
      opts = desc;
      desc = null;
    }
    opts = opts || {};
    const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);
    const cmd = this.createCommand(name);
    if (desc) {
      cmd.description(desc);
      cmd._executableHandler = true;
    }
    if (opts.isDefault) this._defaultCommandName = cmd._name;
    cmd._hidden = !!(opts.noHelp || opts.hidden);
    cmd._executableFile = opts.executableFile || null;
    if (args) cmd.arguments(args);
    this._registerCommand(cmd);
    cmd.parent = this;
    cmd.copyInheritedSettings(this);
    if (desc) return this;
    return cmd;
  }
  /**
   * Factory routine to create a new unattached command.
   *
   * See .command() for creating an attached subcommand, which uses this routine to
   * create the command. You can override createCommand to customise subcommands.
   *
   * @param {string} [name]
   * @return {Command} new command
   */
  createCommand(name) {
    return new _Command(name);
  }
  /**
   * You can customise the help with a subclass of Help by overriding createHelp,
   * or by overriding Help properties using configureHelp().
   *
   * @return {Help}
   */
  createHelp() {
    return Object.assign(new Help(), this.configureHelp());
  }
  /**
   * You can customise the help by overriding Help properties using configureHelp(),
   * or with a subclass of Help by overriding createHelp().
   *
   * @param {object} [configuration] - configuration options
   * @return {(Command | object)} `this` command for chaining, or stored configuration
   */
  configureHelp(configuration) {
    if (configuration === void 0) return this._helpConfiguration;
    this._helpConfiguration = configuration;
    return this;
  }
  /**
   * The default output goes to stdout and stderr. You can customise this for special
   * applications. You can also customise the display of errors by overriding outputError.
   *
   * The configuration properties are all functions:
   *
   *     // change how output being written, defaults to stdout and stderr
   *     writeOut(str)
   *     writeErr(str)
   *     // change how output being written for errors, defaults to writeErr
   *     outputError(str, write) // used for displaying errors and not used for displaying help
   *     // specify width for wrapping help
   *     getOutHelpWidth()
   *     getErrHelpWidth()
   *     // color support, currently only used with Help
   *     getOutHasColors()
   *     getErrHasColors()
   *     stripColor() // used to remove ANSI escape codes if output does not have colors
   *
   * @param {object} [configuration] - configuration options
   * @return {(Command | object)} `this` command for chaining, or stored configuration
   */
  configureOutput(configuration) {
    if (configuration === void 0) return this._outputConfiguration;
    this._outputConfiguration = {
      ...this._outputConfiguration,
      ...configuration
    };
    return this;
  }
  /**
   * Display the help or a custom message after an error occurs.
   *
   * @param {(boolean|string)} [displayHelp]
   * @return {Command} `this` command for chaining
   */
  showHelpAfterError(displayHelp = true) {
    if (typeof displayHelp !== "string") displayHelp = !!displayHelp;
    this._showHelpAfterError = displayHelp;
    return this;
  }
  /**
   * Display suggestion of similar commands for unknown commands, or options for unknown options.
   *
   * @param {boolean} [displaySuggestion]
   * @return {Command} `this` command for chaining
   */
  showSuggestionAfterError(displaySuggestion = true) {
    this._showSuggestionAfterError = !!displaySuggestion;
    return this;
  }
  /**
   * Add a prepared subcommand.
   *
   * See .command() for creating an attached subcommand which inherits settings from its parent.
   *
   * @param {Command} cmd - new subcommand
   * @param {object} [opts] - configuration options
   * @return {Command} `this` command for chaining
   */
  addCommand(cmd, opts) {
    if (!cmd._name) {
      throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
    }
    opts = opts || {};
    if (opts.isDefault) this._defaultCommandName = cmd._name;
    if (opts.noHelp || opts.hidden) cmd._hidden = true;
    this._registerCommand(cmd);
    cmd.parent = this;
    cmd._checkForBrokenPassThrough();
    return this;
  }
  /**
   * Factory routine to create a new unattached argument.
   *
   * See .argument() for creating an attached argument, which uses this routine to
   * create the argument. You can override createArgument to return a custom argument.
   *
   * @param {string} name
   * @param {string} [description]
   * @return {Argument} new argument
   */
  createArgument(name, description) {
    return new Argument(name, description);
  }
  /**
   * Define argument syntax for command.
   *
   * The default is that the argument is required, and you can explicitly
   * indicate this with <> around the name. Put [] around the name for an optional argument.
   *
   * @example
   * program.argument('<input-file>');
   * program.argument('[output-file]');
   *
   * @param {string} name
   * @param {string} [description]
   * @param {(Function|*)} [parseArg] - custom argument processing function or default value
   * @param {*} [defaultValue]
   * @return {Command} `this` command for chaining
   */
  argument(name, description, parseArg, defaultValue) {
    const argument = this.createArgument(name, description);
    if (typeof parseArg === "function") {
      argument.default(defaultValue).argParser(parseArg);
    } else {
      argument.default(parseArg);
    }
    this.addArgument(argument);
    return this;
  }
  /**
   * Define argument syntax for command, adding multiple at once (without descriptions).
   *
   * See also .argument().
   *
   * @example
   * program.arguments('<cmd> [env]');
   *
   * @param {string} names
   * @return {Command} `this` command for chaining
   */
  arguments(names) {
    names.trim().split(/ +/).forEach((detail) => {
      this.argument(detail);
    });
    return this;
  }
  /**
   * Define argument syntax for command, adding a prepared argument.
   *
   * @param {Argument} argument
   * @return {Command} `this` command for chaining
   */
  addArgument(argument) {
    const previousArgument = this.registeredArguments.slice(-1)[0];
    if (previousArgument?.variadic) {
      throw new Error(
        `only the last argument can be variadic '${previousArgument.name()}'`
      );
    }
    if (argument.required && argument.defaultValue !== void 0 && argument.parseArg === void 0) {
      throw new Error(
        `a default value for a required argument is never used: '${argument.name()}'`
      );
    }
    this.registeredArguments.push(argument);
    return this;
  }
  /**
   * Customise or override default help command. By default a help command is automatically added if your command has subcommands.
   *
   * @example
   *    program.helpCommand('help [cmd]');
   *    program.helpCommand('help [cmd]', 'show help');
   *    program.helpCommand(false); // suppress default help command
   *    program.helpCommand(true); // add help command even if no subcommands
   *
   * @param {string|boolean} enableOrNameAndArgs - enable with custom name and/or arguments, or boolean to override whether added
   * @param {string} [description] - custom description
   * @return {Command} `this` command for chaining
   */
  helpCommand(enableOrNameAndArgs, description) {
    if (typeof enableOrNameAndArgs === "boolean") {
      this._addImplicitHelpCommand = enableOrNameAndArgs;
      if (enableOrNameAndArgs && this._defaultCommandGroup) {
        this._initCommandGroup(this._getHelpCommand());
      }
      return this;
    }
    const nameAndArgs = enableOrNameAndArgs ?? "help [command]";
    const [, helpName, helpArgs] = nameAndArgs.match(/([^ ]+) *(.*)/);
    const helpDescription = description ?? "display help for command";
    const helpCommand = this.createCommand(helpName);
    helpCommand.helpOption(false);
    if (helpArgs) helpCommand.arguments(helpArgs);
    if (helpDescription) helpCommand.description(helpDescription);
    this._addImplicitHelpCommand = true;
    this._helpCommand = helpCommand;
    if (enableOrNameAndArgs || description) this._initCommandGroup(helpCommand);
    return this;
  }
  /**
   * Add prepared custom help command.
   *
   * @param {(Command|string|boolean)} helpCommand - custom help command, or deprecated enableOrNameAndArgs as for `.helpCommand()`
   * @param {string} [deprecatedDescription] - deprecated custom description used with custom name only
   * @return {Command} `this` command for chaining
   */
  addHelpCommand(helpCommand, deprecatedDescription) {
    if (typeof helpCommand !== "object") {
      this.helpCommand(helpCommand, deprecatedDescription);
      return this;
    }
    this._addImplicitHelpCommand = true;
    this._helpCommand = helpCommand;
    this._initCommandGroup(helpCommand);
    return this;
  }
  /**
   * Lazy create help command.
   *
   * @return {(Command|null)}
   * @package
   */
  _getHelpCommand() {
    const hasImplicitHelpCommand = this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help"));
    if (hasImplicitHelpCommand) {
      if (this._helpCommand === void 0) {
        this.helpCommand(void 0, void 0);
      }
      return this._helpCommand;
    }
    return null;
  }
  /**
   * Add hook for life cycle event.
   *
   * @param {string} event
   * @param {Function} listener
   * @return {Command} `this` command for chaining
   */
  hook(event, listener) {
    const allowedValues = ["preSubcommand", "preAction", "postAction"];
    if (!allowedValues.includes(event)) {
      throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
    }
    if (this._lifeCycleHooks[event]) {
      this._lifeCycleHooks[event].push(listener);
    } else {
      this._lifeCycleHooks[event] = [listener];
    }
    return this;
  }
  /**
   * Register callback to use as replacement for calling process.exit.
   *
   * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
   * @return {Command} `this` command for chaining
   */
  exitOverride(fn) {
    if (fn) {
      this._exitCallback = fn;
    } else {
      this._exitCallback = (err) => {
        if (err.code !== "commander.executeSubCommandAsync") {
          throw err;
        } else {
        }
      };
    }
    return this;
  }
  /**
   * Call process.exit, and _exitCallback if defined.
   *
   * @param {number} exitCode exit code for using with process.exit
   * @param {string} code an id string representing the error
   * @param {string} message human-readable description of the error
   * @return never
   * @private
   */
  _exit(exitCode, code, message) {
    if (this._exitCallback) {
      this._exitCallback(new CommanderError(exitCode, code, message));
    }
    import_node_process.default.exit(exitCode);
  }
  /**
   * Register callback `fn` for the command.
   *
   * @example
   * program
   *   .command('serve')
   *   .description('start service')
   *   .action(function() {
   *      // do work here
   *   });
   *
   * @param {Function} fn
   * @return {Command} `this` command for chaining
   */
  action(fn) {
    const listener = (args) => {
      const expectedArgsCount = this.registeredArguments.length;
      const actionArgs = args.slice(0, expectedArgsCount);
      if (this._storeOptionsAsProperties) {
        actionArgs[expectedArgsCount] = this;
      } else {
        actionArgs[expectedArgsCount] = this.opts();
      }
      actionArgs.push(this);
      return fn.apply(this, actionArgs);
    };
    this._actionHandler = listener;
    return this;
  }
  /**
   * Factory routine to create a new unattached option.
   *
   * See .option() for creating an attached option, which uses this routine to
   * create the option. You can override createOption to return a custom option.
   *
   * @param {string} flags
   * @param {string} [description]
   * @return {Option} new option
   */
  createOption(flags, description) {
    return new Option(flags, description);
  }
  /**
   * Wrap parseArgs to catch 'commander.invalidArgument'.
   *
   * @param {(Option | Argument)} target
   * @param {string} value
   * @param {*} previous
   * @param {string} invalidArgumentMessage
   * @private
   */
  _callParseArg(target, value, previous, invalidArgumentMessage) {
    try {
      return target.parseArg(value, previous);
    } catch (err) {
      if (err.code === "commander.invalidArgument") {
        const message = `${invalidArgumentMessage} ${err.message}`;
        this.error(message, { exitCode: err.exitCode, code: err.code });
      }
      throw err;
    }
  }
  /**
   * Check for option flag conflicts.
   * Register option if no conflicts found, or throw on conflict.
   *
   * @param {Option} option
   * @private
   */
  _registerOption(option) {
    const matchingOption = option.short && this._findOption(option.short) || option.long && this._findOption(option.long);
    if (matchingOption) {
      const matchingFlag = option.long && this._findOption(option.long) ? option.long : option.short;
      throw new Error(`Cannot add option '${option.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
    }
    this._initOptionGroup(option);
    this.options.push(option);
  }
  /**
   * Check for command name and alias conflicts with existing commands.
   * Register command if no conflicts found, or throw on conflict.
   *
   * @param {Command} command
   * @private
   */
  _registerCommand(command) {
    const knownBy = (cmd) => {
      return [cmd.name()].concat(cmd.aliases());
    };
    const alreadyUsed = knownBy(command).find(
      (name) => this._findCommand(name)
    );
    if (alreadyUsed) {
      const existingCmd = knownBy(this._findCommand(alreadyUsed)).join("|");
      const newCmd = knownBy(command).join("|");
      throw new Error(
        `cannot add command '${newCmd}' as already have command '${existingCmd}'`
      );
    }
    this._initCommandGroup(command);
    this.commands.push(command);
  }
  /**
   * Add an option.
   *
   * @param {Option} option
   * @return {Command} `this` command for chaining
   */
  addOption(option) {
    this._registerOption(option);
    const oname = option.name();
    const name = option.attributeName();
    if (option.defaultValue !== void 0) {
      this.setOptionValueWithSource(name, option.defaultValue, "default");
    }
    const handleOptionValue = (val, invalidValueMessage, valueSource) => {
      if (val == null && option.presetArg !== void 0) {
        val = option.presetArg;
      }
      const oldValue = this.getOptionValue(name);
      if (val !== null && option.parseArg) {
        val = this._callParseArg(option, val, oldValue, invalidValueMessage);
      } else if (val !== null && option.variadic) {
        val = option._collectValue(val, oldValue);
      }
      if (val == null) {
        if (option.negate) {
          val = false;
        } else if (option.isBoolean() || option.optional) {
          val = true;
        } else {
          val = "";
        }
      }
      this.setOptionValueWithSource(name, val, valueSource);
    };
    this.on("option:" + oname, (val) => {
      const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
      handleOptionValue(val, invalidValueMessage, "cli");
    });
    if (option.envVar) {
      this.on("optionEnv:" + oname, (val) => {
        const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
        handleOptionValue(val, invalidValueMessage, "env");
      });
    }
    return this;
  }
  /**
   * Internal implementation shared by .option() and .requiredOption()
   *
   * @return {Command} `this` command for chaining
   * @private
   */
  _optionEx(config, flags, description, fn, defaultValue) {
    if (typeof flags === "object" && flags instanceof Option) {
      throw new Error(
        "To add an Option object use addOption() instead of option() or requiredOption()"
      );
    }
    const option = this.createOption(flags, description);
    option.makeOptionMandatory(!!config.mandatory);
    if (typeof fn === "function") {
      option.default(defaultValue).argParser(fn);
    } else if (fn instanceof RegExp) {
      const regex = fn;
      fn = (val, def) => {
        const m = regex.exec(val);
        return m ? m[0] : def;
      };
      option.default(defaultValue).argParser(fn);
    } else {
      option.default(fn);
    }
    return this.addOption(option);
  }
  /**
   * Define option with `flags`, `description`, and optional argument parsing function or `defaultValue` or both.
   *
   * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space. A required
   * option-argument is indicated by `<>` and an optional option-argument by `[]`.
   *
   * See the README for more details, and see also addOption() and requiredOption().
   *
   * @example
   * program
   *     .option('-p, --pepper', 'add pepper')
   *     .option('--pt, --pizza-type <TYPE>', 'type of pizza') // required option-argument
   *     .option('-c, --cheese [CHEESE]', 'add extra cheese', 'mozzarella') // optional option-argument with default
   *     .option('-t, --tip <VALUE>', 'add tip to purchase cost', parseFloat) // custom parse function
   *
   * @param {string} flags
   * @param {string} [description]
   * @param {(Function|*)} [parseArg] - custom option processing function or default value
   * @param {*} [defaultValue]
   * @return {Command} `this` command for chaining
   */
  option(flags, description, parseArg, defaultValue) {
    return this._optionEx({}, flags, description, parseArg, defaultValue);
  }
  /**
   * Add a required option which must have a value after parsing. This usually means
   * the option must be specified on the command line. (Otherwise the same as .option().)
   *
   * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
   *
   * @param {string} flags
   * @param {string} [description]
   * @param {(Function|*)} [parseArg] - custom option processing function or default value
   * @param {*} [defaultValue]
   * @return {Command} `this` command for chaining
   */
  requiredOption(flags, description, parseArg, defaultValue) {
    return this._optionEx(
      { mandatory: true },
      flags,
      description,
      parseArg,
      defaultValue
    );
  }
  /**
   * Alter parsing of short flags with optional values.
   *
   * @example
   * // for `.option('-f,--flag [value]'):
   * program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
   * program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
   *
   * @param {boolean} [combine] - if `true` or omitted, an optional value can be specified directly after the flag.
   * @return {Command} `this` command for chaining
   */
  combineFlagAndOptionalValue(combine = true) {
    this._combineFlagAndOptionalValue = !!combine;
    return this;
  }
  /**
   * Allow unknown options on the command line.
   *
   * @param {boolean} [allowUnknown] - if `true` or omitted, no error will be thrown for unknown options.
   * @return {Command} `this` command for chaining
   */
  allowUnknownOption(allowUnknown = true) {
    this._allowUnknownOption = !!allowUnknown;
    return this;
  }
  /**
   * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
   *
   * @param {boolean} [allowExcess] - if `true` or omitted, no error will be thrown for excess arguments.
   * @return {Command} `this` command for chaining
   */
  allowExcessArguments(allowExcess = true) {
    this._allowExcessArguments = !!allowExcess;
    return this;
  }
  /**
   * Enable positional options. Positional means global options are specified before subcommands which lets
   * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
   * The default behaviour is non-positional and global options may appear anywhere on the command line.
   *
   * @param {boolean} [positional]
   * @return {Command} `this` command for chaining
   */
  enablePositionalOptions(positional = true) {
    this._enablePositionalOptions = !!positional;
    return this;
  }
  /**
   * Pass through options that come after command-arguments rather than treat them as command-options,
   * so actual command-options come before command-arguments. Turning this on for a subcommand requires
   * positional options to have been enabled on the program (parent commands).
   * The default behaviour is non-positional and options may appear before or after command-arguments.
   *
   * @param {boolean} [passThrough] for unknown options.
   * @return {Command} `this` command for chaining
   */
  passThroughOptions(passThrough = true) {
    this._passThroughOptions = !!passThrough;
    this._checkForBrokenPassThrough();
    return this;
  }
  /**
   * @private
   */
  _checkForBrokenPassThrough() {
    if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions) {
      throw new Error(
        `passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`
      );
    }
  }
  /**
   * Whether to store option values as properties on command object,
   * or store separately (specify false). In both cases the option values can be accessed using .opts().
   *
   * @param {boolean} [storeAsProperties=true]
   * @return {Command} `this` command for chaining
   */
  storeOptionsAsProperties(storeAsProperties = true) {
    if (this.options.length) {
      throw new Error("call .storeOptionsAsProperties() before adding options");
    }
    if (Object.keys(this._optionValues).length) {
      throw new Error(
        "call .storeOptionsAsProperties() before setting option values"
      );
    }
    this._storeOptionsAsProperties = !!storeAsProperties;
    return this;
  }
  /**
   * Retrieve option value.
   *
   * @param {string} key
   * @return {object} value
   */
  getOptionValue(key) {
    if (this._storeOptionsAsProperties) {
      return this[key];
    }
    return this._optionValues[key];
  }
  /**
   * Store option value.
   *
   * @param {string} key
   * @param {object} value
   * @return {Command} `this` command for chaining
   */
  setOptionValue(key, value) {
    return this.setOptionValueWithSource(key, value, void 0);
  }
  /**
   * Store option value and where the value came from.
   *
   * @param {string} key
   * @param {object} value
   * @param {string} source - expected values are default/config/env/cli/implied
   * @return {Command} `this` command for chaining
   */
  setOptionValueWithSource(key, value, source) {
    if (this._storeOptionsAsProperties) {
      this[key] = value;
    } else {
      this._optionValues[key] = value;
    }
    this._optionValueSources[key] = source;
    return this;
  }
  /**
   * Get source of option value.
   * Expected values are default | config | env | cli | implied
   *
   * @param {string} key
   * @return {string}
   */
  getOptionValueSource(key) {
    return this._optionValueSources[key];
  }
  /**
   * Get source of option value. See also .optsWithGlobals().
   * Expected values are default | config | env | cli | implied
   *
   * @param {string} key
   * @return {string}
   */
  getOptionValueSourceWithGlobals(key) {
    let source;
    this._getCommandAndAncestors().forEach((cmd) => {
      if (cmd.getOptionValueSource(key) !== void 0) {
        source = cmd.getOptionValueSource(key);
      }
    });
    return source;
  }
  /**
   * Get user arguments from implied or explicit arguments.
   * Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
   *
   * @private
   */
  _prepareUserArgs(argv, parseOptions) {
    if (argv !== void 0 && !Array.isArray(argv)) {
      throw new Error("first parameter to parse must be array or undefined");
    }
    parseOptions = parseOptions || {};
    if (argv === void 0 && parseOptions.from === void 0) {
      if (import_node_process.default.versions?.electron) {
        parseOptions.from = "electron";
      }
      const execArgv = import_node_process.default.execArgv ?? [];
      if (execArgv.includes("-e") || execArgv.includes("--eval") || execArgv.includes("-p") || execArgv.includes("--print")) {
        parseOptions.from = "eval";
      }
    }
    if (argv === void 0) {
      argv = import_node_process.default.argv;
    }
    this.rawArgs = argv.slice();
    let userArgs;
    switch (parseOptions.from) {
      case void 0:
      case "node":
        this._scriptPath = argv[1];
        userArgs = argv.slice(2);
        break;
      case "electron":
        if (import_node_process.default.defaultApp) {
          this._scriptPath = argv[1];
          userArgs = argv.slice(2);
        } else {
          userArgs = argv.slice(1);
        }
        break;
      case "user":
        userArgs = argv.slice(0);
        break;
      case "eval":
        userArgs = argv.slice(1);
        break;
      default:
        throw new Error(
          `unexpected parse option { from: '${parseOptions.from}' }`
        );
    }
    if (!this._name && this._scriptPath)
      this.nameFromFilename(this._scriptPath);
    this._name = this._name || "program";
    return userArgs;
  }
  /**
   * Parse `argv`, setting options and invoking commands when defined.
   *
   * Use parseAsync instead of parse if any of your action handlers are async.
   *
   * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
   *
   * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
   * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
   * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
   * - `'user'`: just user arguments
   *
   * @example
   * program.parse(); // parse process.argv and auto-detect electron and special node flags
   * program.parse(process.argv); // assume argv[0] is app and argv[1] is script
   * program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
   *
   * @param {string[]} [argv] - optional, defaults to process.argv
   * @param {object} [parseOptions] - optionally specify style of options with from: node/user/electron
   * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
   * @return {Command} `this` command for chaining
   */
  parse(argv, parseOptions) {
    this._prepareForParse();
    const userArgs = this._prepareUserArgs(argv, parseOptions);
    this._parseCommand([], userArgs);
    return this;
  }
  /**
   * Parse `argv`, setting options and invoking commands when defined.
   *
   * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
   *
   * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
   * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
   * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
   * - `'user'`: just user arguments
   *
   * @example
   * await program.parseAsync(); // parse process.argv and auto-detect electron and special node flags
   * await program.parseAsync(process.argv); // assume argv[0] is app and argv[1] is script
   * await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
   *
   * @param {string[]} [argv]
   * @param {object} [parseOptions]
   * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
   * @return {Promise}
   */
  async parseAsync(argv, parseOptions) {
    this._prepareForParse();
    const userArgs = this._prepareUserArgs(argv, parseOptions);
    await this._parseCommand([], userArgs);
    return this;
  }
  _prepareForParse() {
    if (this._savedState === null) {
      this.options.filter(
        (option) => option.negate && option.defaultValue === void 0 && this.getOptionValue(option.attributeName()) === void 0
      ).forEach((option) => {
        const positiveLongFlag = option.long.replace(/^--no-/, "--");
        if (!this._findOption(positiveLongFlag)) {
          this.setOptionValueWithSource(
            option.attributeName(),
            true,
            "default"
          );
        }
      });
      this.saveStateBeforeParse();
    } else {
      this.restoreStateBeforeParse();
    }
  }
  /**
   * Called the first time parse is called to save state and allow a restore before subsequent calls to parse.
   * Not usually called directly, but available for subclasses to save their custom state.
   *
   * This is called in a lazy way. Only commands used in parsing chain will have state saved.
   */
  saveStateBeforeParse() {
    this._savedState = {
      // name is stable if supplied by author, but may be unspecified for root command and deduced during parsing
      _name: this._name,
      // option values before parse have default values (including false for negated options)
      // shallow clones
      _optionValues: { ...this._optionValues },
      _optionValueSources: { ...this._optionValueSources }
    };
  }
  /**
   * Restore state before parse for calls after the first.
   * Not usually called directly, but available for subclasses to save their custom state.
   *
   * This is called in a lazy way. Only commands used in parsing chain will have state restored.
   */
  restoreStateBeforeParse() {
    if (this._storeOptionsAsProperties)
      throw new Error(`Can not call parse again when storeOptionsAsProperties is true.
- either make a new Command for each call to parse, or stop storing options as properties`);
    this._name = this._savedState._name;
    this._scriptPath = null;
    this.rawArgs = [];
    this._optionValues = { ...this._savedState._optionValues };
    this._optionValueSources = { ...this._savedState._optionValueSources };
    this.args = [];
    this.processedArgs = [];
  }
  /**
   * Throw if expected executable is missing. Add lots of help for author.
   *
   * @param {string} executableFile
   * @param {string} executableDir
   * @param {string} subcommandName
   */
  _checkForMissingExecutable(executableFile, executableDir, subcommandName) {
    if (import_node_fs.default.existsSync(executableFile)) return;
    const executableDirMessage = executableDir ? `searched for local subcommand relative to directory '${executableDir}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory";
    const executableMissing = `'${executableFile}' does not exist
 - if '${subcommandName}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
    throw new Error(executableMissing);
  }
  /**
   * Execute a sub-command executable.
   *
   * @private
   */
  _executeSubCommand(subcommand, args) {
    args = args.slice();
    const sourceExt = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
    function findFile(baseDir, baseName) {
      const localBin = import_node_path.default.resolve(baseDir, baseName);
      if (import_node_fs.default.existsSync(localBin)) return localBin;
      if (sourceExt.includes(import_node_path.default.extname(baseName))) return void 0;
      const foundExt = sourceExt.find(
        (ext) => import_node_fs.default.existsSync(`${localBin}${ext}`)
      );
      if (foundExt) return `${localBin}${foundExt}`;
      return void 0;
    }
    this._checkForMissingMandatoryOptions();
    this._checkForConflictingOptions();
    let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
    let executableDir = this._executableDir || "";
    if (this._scriptPath) {
      let resolvedScriptPath;
      try {
        resolvedScriptPath = import_node_fs.default.realpathSync(this._scriptPath);
      } catch {
        resolvedScriptPath = this._scriptPath;
      }
      executableDir = import_node_path.default.resolve(
        import_node_path.default.dirname(resolvedScriptPath),
        executableDir
      );
    }
    if (executableDir) {
      let localFile = findFile(executableDir, executableFile);
      if (!localFile && !subcommand._executableFile && this._scriptPath) {
        const legacyName = import_node_path.default.basename(
          this._scriptPath,
          import_node_path.default.extname(this._scriptPath)
        );
        if (legacyName !== this._name) {
          localFile = findFile(
            executableDir,
            `${legacyName}-${subcommand._name}`
          );
        }
      }
      executableFile = localFile || executableFile;
    }
    const launchWithNode = sourceExt.includes(import_node_path.default.extname(executableFile));
    let proc;
    if (import_node_process.default.platform !== "win32") {
      if (launchWithNode) {
        args.unshift(executableFile);
        args = incrementNodeInspectorPort(import_node_process.default.execArgv).concat(args);
        proc = import_node_child_process.default.spawn(import_node_process.default.argv[0], args, { stdio: "inherit" });
      } else {
        proc = import_node_child_process.default.spawn(executableFile, args, { stdio: "inherit" });
      }
    } else {
      this._checkForMissingExecutable(
        executableFile,
        executableDir,
        subcommand._name
      );
      args.unshift(executableFile);
      args = incrementNodeInspectorPort(import_node_process.default.execArgv).concat(args);
      proc = import_node_child_process.default.spawn(import_node_process.default.execPath, args, { stdio: "inherit" });
    }
    if (!proc.killed) {
      const signals = ["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"];
      signals.forEach((signal) => {
        import_node_process.default.on(signal, () => {
          if (proc.killed === false && proc.exitCode === null) {
            proc.kill(signal);
          }
        });
      });
    }
    const exitCallback = this._exitCallback;
    proc.on("close", (code) => {
      code = code ?? 1;
      if (!exitCallback) {
        import_node_process.default.exit(code);
      } else {
        exitCallback(
          new CommanderError(
            code,
            "commander.executeSubCommandAsync",
            "(close)"
          )
        );
      }
    });
    proc.on("error", (err) => {
      if (err.code === "ENOENT") {
        this._checkForMissingExecutable(
          executableFile,
          executableDir,
          subcommand._name
        );
      } else if (err.code === "EACCES") {
        throw new Error(`'${executableFile}' not executable`);
      }
      if (!exitCallback) {
        import_node_process.default.exit(1);
      } else {
        const wrappedError = new CommanderError(
          1,
          "commander.executeSubCommandAsync",
          "(error)"
        );
        wrappedError.nestedError = err;
        exitCallback(wrappedError);
      }
    });
    this.runningCommand = proc;
  }
  /**
   * @private
   */
  _dispatchSubcommand(commandName, operands, unknown) {
    const subCommand = this._findCommand(commandName);
    if (!subCommand) this.help({ error: true });
    subCommand._prepareForParse();
    let promiseChain;
    promiseChain = this._chainOrCallSubCommandHook(
      promiseChain,
      subCommand,
      "preSubcommand"
    );
    promiseChain = this._chainOrCall(promiseChain, () => {
      if (subCommand._executableHandler) {
        this._executeSubCommand(subCommand, operands.concat(unknown));
      } else {
        return subCommand._parseCommand(operands, unknown);
      }
    });
    return promiseChain;
  }
  /**
   * Invoke help directly if possible, or dispatch if necessary.
   * e.g. help foo
   *
   * @private
   */
  _dispatchHelpCommand(subcommandName) {
    if (!subcommandName) {
      this.help();
    }
    const subCommand = this._findCommand(subcommandName);
    if (subCommand && !subCommand._executableHandler) {
      subCommand.help();
    }
    return this._dispatchSubcommand(
      subcommandName,
      [],
      [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"]
    );
  }
  /**
   * Check this.args against expected this.registeredArguments.
   *
   * @private
   */
  _checkNumberOfArguments() {
    this.registeredArguments.forEach((arg, i) => {
      if (arg.required && this.args[i] == null) {
        this.missingArgument(arg.name());
      }
    });
    if (this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) {
      return;
    }
    if (this.args.length > this.registeredArguments.length) {
      this._excessArguments(this.args);
    }
  }
  /**
   * Process this.args using this.registeredArguments and save as this.processedArgs!
   *
   * @private
   */
  _processArguments() {
    const myParseArg = (argument, value, previous) => {
      let parsedValue = value;
      if (value !== null && argument.parseArg) {
        const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
        parsedValue = this._callParseArg(
          argument,
          value,
          previous,
          invalidValueMessage
        );
      }
      return parsedValue;
    };
    this._checkNumberOfArguments();
    const processedArgs = [];
    this.registeredArguments.forEach((declaredArg, index) => {
      let value = declaredArg.defaultValue;
      if (declaredArg.variadic) {
        if (index < this.args.length) {
          value = this.args.slice(index);
          if (declaredArg.parseArg) {
            value = value.reduce((processed, v) => {
              return myParseArg(declaredArg, v, processed);
            }, declaredArg.defaultValue);
          }
        } else if (value === void 0) {
          value = [];
        }
      } else if (index < this.args.length) {
        value = this.args[index];
        if (declaredArg.parseArg) {
          value = myParseArg(declaredArg, value, declaredArg.defaultValue);
        }
      }
      processedArgs[index] = value;
    });
    this.processedArgs = processedArgs;
  }
  /**
   * Once we have a promise we chain, but call synchronously until then.
   *
   * @param {(Promise|undefined)} promise
   * @param {Function} fn
   * @return {(Promise|undefined)}
   * @private
   */
  _chainOrCall(promise, fn) {
    if (promise?.then && typeof promise.then === "function") {
      return promise.then(() => fn());
    }
    return fn();
  }
  /**
   *
   * @param {(Promise|undefined)} promise
   * @param {string} event
   * @return {(Promise|undefined)}
   * @private
   */
  _chainOrCallHooks(promise, event) {
    let result = promise;
    const hooks = [];
    this._getCommandAndAncestors().reverse().filter((cmd) => cmd._lifeCycleHooks[event] !== void 0).forEach((hookedCommand) => {
      hookedCommand._lifeCycleHooks[event].forEach((callback) => {
        hooks.push({ hookedCommand, callback });
      });
    });
    if (event === "postAction") {
      hooks.reverse();
    }
    hooks.forEach((hookDetail) => {
      result = this._chainOrCall(result, () => {
        return hookDetail.callback(hookDetail.hookedCommand, this);
      });
    });
    return result;
  }
  /**
   *
   * @param {(Promise|undefined)} promise
   * @param {Command} subCommand
   * @param {string} event
   * @return {(Promise|undefined)}
   * @private
   */
  _chainOrCallSubCommandHook(promise, subCommand, event) {
    let result = promise;
    if (this._lifeCycleHooks[event] !== void 0) {
      this._lifeCycleHooks[event].forEach((hook) => {
        result = this._chainOrCall(result, () => {
          return hook(this, subCommand);
        });
      });
    }
    return result;
  }
  /**
   * Process arguments in context of this command.
   * Returns action result, in case it is a promise.
   *
   * @private
   */
  _parseCommand(operands, unknown) {
    const parsed = this.parseOptions(unknown);
    this._parseOptionsEnv();
    this._parseOptionsImplied();
    operands = operands.concat(parsed.operands);
    unknown = parsed.unknown;
    this.args = operands.concat(unknown);
    if (operands && this._findCommand(operands[0])) {
      return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
    }
    if (this._getHelpCommand() && operands[0] === this._getHelpCommand().name()) {
      return this._dispatchHelpCommand(operands[1]);
    }
    if (this._defaultCommandName) {
      this._outputHelpIfRequested(unknown);
      return this._dispatchSubcommand(
        this._defaultCommandName,
        operands,
        unknown
      );
    }
    if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
      this.help({ error: true });
    }
    this._outputHelpIfRequested(parsed.unknown);
    this._checkForMissingMandatoryOptions();
    this._checkForConflictingOptions();
    const checkForUnknownOptions = () => {
      if (parsed.unknown.length > 0) {
        this.unknownOption(parsed.unknown[0]);
      }
    };
    const commandEvent = `command:${this.name()}`;
    if (this._actionHandler) {
      checkForUnknownOptions();
      this._processArguments();
      let promiseChain;
      promiseChain = this._chainOrCallHooks(promiseChain, "preAction");
      promiseChain = this._chainOrCall(
        promiseChain,
        () => this._actionHandler(this.processedArgs)
      );
      if (this.parent) {
        promiseChain = this._chainOrCall(promiseChain, () => {
          this.parent.emit(commandEvent, operands, unknown);
        });
      }
      promiseChain = this._chainOrCallHooks(promiseChain, "postAction");
      return promiseChain;
    }
    if (this.parent?.listenerCount(commandEvent)) {
      checkForUnknownOptions();
      this._processArguments();
      this.parent.emit(commandEvent, operands, unknown);
    } else if (operands.length) {
      if (this._findCommand("*")) {
        return this._dispatchSubcommand("*", operands, unknown);
      }
      if (this.listenerCount("command:*")) {
        this.emit("command:*", operands, unknown);
      } else if (this.commands.length) {
        this.unknownCommand();
      } else {
        checkForUnknownOptions();
        this._processArguments();
      }
    } else if (this.commands.length) {
      checkForUnknownOptions();
      this.help({ error: true });
    } else {
      checkForUnknownOptions();
      this._processArguments();
    }
  }
  /**
   * Find matching command.
   *
   * @private
   * @return {Command | undefined}
   */
  _findCommand(name) {
    if (!name) return void 0;
    return this.commands.find(
      (cmd) => cmd._name === name || cmd._aliases.includes(name)
    );
  }
  /**
   * Return an option matching `arg` if any.
   *
   * @param {string} arg
   * @return {Option}
   * @package
   */
  _findOption(arg) {
    return this.options.find((option) => option.is(arg));
  }
  /**
   * Display an error message if a mandatory option does not have a value.
   * Called after checking for help flags in leaf subcommand.
   *
   * @private
   */
  _checkForMissingMandatoryOptions() {
    this._getCommandAndAncestors().forEach((cmd) => {
      cmd.options.forEach((anOption) => {
        if (anOption.mandatory && cmd.getOptionValue(anOption.attributeName()) === void 0) {
          cmd.missingMandatoryOptionValue(anOption);
        }
      });
    });
  }
  /**
   * Display an error message if conflicting options are used together in this.
   *
   * @private
   */
  _checkForConflictingLocalOptions() {
    const definedNonDefaultOptions = this.options.filter((option) => {
      const optionKey = option.attributeName();
      if (this.getOptionValue(optionKey) === void 0) {
        return false;
      }
      return this.getOptionValueSource(optionKey) !== "default";
    });
    const optionsWithConflicting = definedNonDefaultOptions.filter(
      (option) => option.conflictsWith.length > 0
    );
    optionsWithConflicting.forEach((option) => {
      const conflictingAndDefined = definedNonDefaultOptions.find(
        (defined) => option.conflictsWith.includes(defined.attributeName())
      );
      if (conflictingAndDefined) {
        this._conflictingOption(option, conflictingAndDefined);
      }
    });
  }
  /**
   * Display an error message if conflicting options are used together.
   * Called after checking for help flags in leaf subcommand.
   *
   * @private
   */
  _checkForConflictingOptions() {
    this._getCommandAndAncestors().forEach((cmd) => {
      cmd._checkForConflictingLocalOptions();
    });
  }
  /**
   * Parse options from `argv` removing known options,
   * and return argv split into operands and unknown arguments.
   *
   * Side effects: modifies command by storing options. Does not reset state if called again.
   *
   * Examples:
   *
   *     argv => operands, unknown
   *     --known kkk op => [op], []
   *     op --known kkk => [op], []
   *     sub --unknown uuu op => [sub], [--unknown uuu op]
   *     sub -- --unknown uuu op => [sub --unknown uuu op], []
   *
   * @param {string[]} args
   * @return {{operands: string[], unknown: string[]}}
   */
  parseOptions(args) {
    const operands = [];
    const unknown = [];
    let dest = operands;
    function maybeOption(arg) {
      return arg.length > 1 && arg[0] === "-";
    }
    const negativeNumberArg = (arg) => {
      if (!/^-(\d+|\d*\.\d+)(e[+-]?\d+)?$/.test(arg)) return false;
      return !this._getCommandAndAncestors().some(
        (cmd) => cmd.options.map((opt) => opt.short).some((short) => /^-\d$/.test(short))
      );
    };
    let activeVariadicOption = null;
    let activeGroup = null;
    let i = 0;
    while (i < args.length || activeGroup) {
      const arg = activeGroup ?? args[i++];
      activeGroup = null;
      if (arg === "--") {
        if (dest === unknown) dest.push(arg);
        dest.push(...args.slice(i));
        break;
      }
      if (activeVariadicOption && (!maybeOption(arg) || negativeNumberArg(arg))) {
        this.emit(`option:${activeVariadicOption.name()}`, arg);
        continue;
      }
      activeVariadicOption = null;
      if (maybeOption(arg)) {
        const option = this._findOption(arg);
        if (option) {
          if (option.required) {
            const value = args[i++];
            if (value === void 0) this.optionMissingArgument(option);
            this.emit(`option:${option.name()}`, value);
          } else if (option.optional) {
            let value = null;
            if (i < args.length && (!maybeOption(args[i]) || negativeNumberArg(args[i]))) {
              value = args[i++];
            }
            this.emit(`option:${option.name()}`, value);
          } else {
            this.emit(`option:${option.name()}`);
          }
          activeVariadicOption = option.variadic ? option : null;
          continue;
        }
      }
      if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-") {
        const option = this._findOption(`-${arg[1]}`);
        if (option) {
          if (option.required || option.optional && this._combineFlagAndOptionalValue) {
            this.emit(`option:${option.name()}`, arg.slice(2));
          } else {
            this.emit(`option:${option.name()}`);
            activeGroup = `-${arg.slice(2)}`;
          }
          continue;
        }
      }
      if (/^--[^=]+=/.test(arg)) {
        const index = arg.indexOf("=");
        const option = this._findOption(arg.slice(0, index));
        if (option && (option.required || option.optional)) {
          this.emit(`option:${option.name()}`, arg.slice(index + 1));
          continue;
        }
      }
      if (dest === operands && maybeOption(arg) && !(this.commands.length === 0 && negativeNumberArg(arg))) {
        dest = unknown;
      }
      if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
        if (this._findCommand(arg)) {
          operands.push(arg);
          unknown.push(...args.slice(i));
          break;
        } else if (this._getHelpCommand() && arg === this._getHelpCommand().name()) {
          operands.push(arg, ...args.slice(i));
          break;
        } else if (this._defaultCommandName) {
          unknown.push(arg, ...args.slice(i));
          break;
        }
      }
      if (this._passThroughOptions) {
        dest.push(arg, ...args.slice(i));
        break;
      }
      dest.push(arg);
    }
    return { operands, unknown };
  }
  /**
   * Return an object containing local option values as key-value pairs.
   *
   * @return {object}
   */
  opts() {
    if (this._storeOptionsAsProperties) {
      const result = {};
      const len = this.options.length;
      for (let i = 0; i < len; i++) {
        const key = this.options[i].attributeName();
        result[key] = key === this._versionOptionName ? this._version : this[key];
      }
      return result;
    }
    return this._optionValues;
  }
  /**
   * Return an object containing merged local and global option values as key-value pairs.
   *
   * @return {object}
   */
  optsWithGlobals() {
    return this._getCommandAndAncestors().reduce(
      (combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()),
      {}
    );
  }
  /**
   * Display error message and exit (or call exitOverride).
   *
   * @param {string} message
   * @param {object} [errorOptions]
   * @param {string} [errorOptions.code] - an id string representing the error
   * @param {number} [errorOptions.exitCode] - used with process.exit
   */
  error(message, errorOptions) {
    this._outputConfiguration.outputError(
      `${message}
`,
      this._outputConfiguration.writeErr
    );
    if (typeof this._showHelpAfterError === "string") {
      this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
    } else if (this._showHelpAfterError) {
      this._outputConfiguration.writeErr("\n");
      this.outputHelp({ error: true });
    }
    const config = errorOptions || {};
    const exitCode = config.exitCode || 1;
    const code = config.code || "commander.error";
    this._exit(exitCode, code, message);
  }
  /**
   * Apply any option related environment variables, if option does
   * not have a value from cli or client code.
   *
   * @private
   */
  _parseOptionsEnv() {
    this.options.forEach((option) => {
      if (option.envVar && option.envVar in import_node_process.default.env) {
        const optionKey = option.attributeName();
        if (this.getOptionValue(optionKey) === void 0 || ["default", "config", "env"].includes(
          this.getOptionValueSource(optionKey)
        )) {
          if (option.required || option.optional) {
            this.emit(`optionEnv:${option.name()}`, import_node_process.default.env[option.envVar]);
          } else {
            this.emit(`optionEnv:${option.name()}`);
          }
        }
      }
    });
  }
  /**
   * Apply any implied option values, if option is undefined or default value.
   *
   * @private
   */
  _parseOptionsImplied() {
    const dualHelper = new DualOptions(this.options);
    const hasCustomOptionValue = (optionKey) => {
      return this.getOptionValue(optionKey) !== void 0 && !["default", "implied"].includes(this.getOptionValueSource(optionKey));
    };
    this.options.filter(
      (option) => option.implied !== void 0 && hasCustomOptionValue(option.attributeName()) && dualHelper.valueFromOption(
        this.getOptionValue(option.attributeName()),
        option
      )
    ).forEach((option) => {
      Object.keys(option.implied).filter((impliedKey) => !hasCustomOptionValue(impliedKey)).forEach((impliedKey) => {
        this.setOptionValueWithSource(
          impliedKey,
          option.implied[impliedKey],
          "implied"
        );
      });
    });
  }
  /**
   * Argument `name` is missing.
   *
   * @param {string} name
   * @private
   */
  missingArgument(name) {
    const message = `error: missing required argument '${name}'`;
    this.error(message, { code: "commander.missingArgument" });
  }
  /**
   * `Option` is missing an argument.
   *
   * @param {Option} option
   * @private
   */
  optionMissingArgument(option) {
    const message = `error: option '${option.flags}' argument missing`;
    this.error(message, { code: "commander.optionMissingArgument" });
  }
  /**
   * `Option` does not have a value, and is a mandatory option.
   *
   * @param {Option} option
   * @private
   */
  missingMandatoryOptionValue(option) {
    const message = `error: required option '${option.flags}' not specified`;
    this.error(message, { code: "commander.missingMandatoryOptionValue" });
  }
  /**
   * `Option` conflicts with another option.
   *
   * @param {Option} option
   * @param {Option} conflictingOption
   * @private
   */
  _conflictingOption(option, conflictingOption) {
    const findBestOptionFromValue = (option2) => {
      const optionKey = option2.attributeName();
      const optionValue = this.getOptionValue(optionKey);
      const negativeOption = this.options.find(
        (target) => target.negate && optionKey === target.attributeName()
      );
      const positiveOption = this.options.find(
        (target) => !target.negate && optionKey === target.attributeName()
      );
      if (negativeOption && (negativeOption.presetArg === void 0 && optionValue === false || negativeOption.presetArg !== void 0 && optionValue === negativeOption.presetArg)) {
        return negativeOption;
      }
      return positiveOption || option2;
    };
    const getErrorMessage = (option2) => {
      const bestOption = findBestOptionFromValue(option2);
      const optionKey = bestOption.attributeName();
      const source = this.getOptionValueSource(optionKey);
      if (source === "env") {
        return `environment variable '${bestOption.envVar}'`;
      }
      return `option '${bestOption.flags}'`;
    };
    const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
    this.error(message, { code: "commander.conflictingOption" });
  }
  /**
   * Unknown option `flag`.
   *
   * @param {string} flag
   * @private
   */
  unknownOption(flag) {
    if (this._allowUnknownOption) return;
    let suggestion = "";
    if (flag.startsWith("--") && this._showSuggestionAfterError) {
      let candidateFlags = [];
      let command = this;
      do {
        const moreFlags = command.createHelp().visibleOptions(command).filter((option) => option.long).map((option) => option.long);
        candidateFlags = candidateFlags.concat(moreFlags);
        command = command.parent;
      } while (command && !command._enablePositionalOptions);
      suggestion = suggestSimilar(flag, candidateFlags);
    }
    const message = `error: unknown option '${flag}'${suggestion}`;
    this.error(message, { code: "commander.unknownOption" });
  }
  /**
   * Excess arguments, more than expected.
   *
   * @param {string[]} receivedArgs
   * @private
   */
  _excessArguments(receivedArgs) {
    if (this._allowExcessArguments) return;
    const expected = this.registeredArguments.length;
    const s = expected === 1 ? "" : "s";
    const received = receivedArgs.length;
    const forSubcommand = this.parent ? ` for '${this.name()}'` : "";
    const details = receivedArgs.join(", ");
    const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${received}: ${details}.`;
    this.error(message, { code: "commander.excessArguments" });
  }
  /**
   * Unknown command.
   *
   * @private
   */
  unknownCommand() {
    const unknownName = this.args[0];
    let suggestion = "";
    if (this._showSuggestionAfterError) {
      const candidateNames = [];
      this.createHelp().visibleCommands(this).forEach((command) => {
        candidateNames.push(command.name());
        if (command.alias()) candidateNames.push(command.alias());
      });
      suggestion = suggestSimilar(unknownName, candidateNames);
    }
    const message = `error: unknown command '${unknownName}'${suggestion}`;
    this.error(message, { code: "commander.unknownCommand" });
  }
  /**
   * Get or set the program version.
   *
   * This method auto-registers the "-V, --version" option which will print the version number.
   *
   * You can optionally supply the flags and description to override the defaults.
   *
   * @param {string} [str]
   * @param {string} [flags]
   * @param {string} [description]
   * @return {(this | string | undefined)} `this` command for chaining, or version string if no arguments
   */
  version(str, flags, description) {
    if (str === void 0) return this._version;
    this._version = str;
    flags = flags || "-V, --version";
    description = description || "output the version number";
    const versionOption = this.createOption(flags, description);
    this._versionOptionName = versionOption.attributeName();
    this._registerOption(versionOption);
    this.on("option:" + versionOption.name(), () => {
      this._outputConfiguration.writeOut(`${str}
`);
      this._exit(0, "commander.version", str);
    });
    return this;
  }
  /**
   * Set the description.
   *
   * @param {string} [str]
   * @param {object} [argsDescription]
   * @return {(string|Command)}
   */
  description(str, argsDescription) {
    if (str === void 0 && argsDescription === void 0)
      return this._description;
    this._description = str;
    if (argsDescription) {
      this._argsDescription = argsDescription;
    }
    return this;
  }
  /**
   * Set the summary. Used when listed as subcommand of parent.
   *
   * @param {string} [str]
   * @return {(string|Command)}
   */
  summary(str) {
    if (str === void 0) return this._summary;
    this._summary = str;
    return this;
  }
  /**
   * Set an alias for the command.
   *
   * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
   *
   * @param {string} [alias]
   * @return {(string|Command)}
   */
  alias(alias) {
    if (alias === void 0) return this._aliases[0];
    let command = this;
    if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
      command = this.commands[this.commands.length - 1];
    }
    if (alias === command._name)
      throw new Error("Command alias can't be the same as its name");
    const matchingCommand = this.parent?._findCommand(alias);
    if (matchingCommand) {
      const existingCmd = [matchingCommand.name()].concat(matchingCommand.aliases()).join("|");
      throw new Error(
        `cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`
      );
    }
    command._aliases.push(alias);
    return this;
  }
  /**
   * Set aliases for the command.
   *
   * Only the first alias is shown in the auto-generated help.
   *
   * @param {string[]} [aliases]
   * @return {(string[]|Command)}
   */
  aliases(aliases) {
    if (aliases === void 0) return this._aliases;
    aliases.forEach((alias) => this.alias(alias));
    return this;
  }
  /**
   * Set / get the command usage `str`.
   *
   * @param {string} [str]
   * @return {(string|Command)}
   */
  usage(str) {
    if (str === void 0) {
      if (this._usage) return this._usage;
      const args = this.registeredArguments.map((arg) => {
        return humanReadableArgName(arg);
      });
      return [].concat(
        this.options.length || this._helpOption !== null ? "[options]" : [],
        this.commands.length ? "[command]" : [],
        this.registeredArguments.length ? args : []
      ).join(" ");
    }
    this._usage = str;
    return this;
  }
  /**
   * Get or set the name of the command.
   *
   * @param {string} [str]
   * @return {(string|Command)}
   */
  name(str) {
    if (str === void 0) return this._name;
    this._name = str;
    return this;
  }
  /**
   * Set/get the help group heading for this subcommand in parent command's help.
   *
   * @param {string} [heading]
   * @return {Command | string}
   */
  helpGroup(heading) {
    if (heading === void 0) return this._helpGroupHeading ?? "";
    this._helpGroupHeading = heading;
    return this;
  }
  /**
   * Set/get the default help group heading for subcommands added to this command.
   * (This does not override a group set directly on the subcommand using .helpGroup().)
   *
   * @example
   * program.commandsGroup('Development Commands:);
   * program.command('watch')...
   * program.command('lint')...
   * ...
   *
   * @param {string} [heading]
   * @returns {Command | string}
   */
  commandsGroup(heading) {
    if (heading === void 0) return this._defaultCommandGroup ?? "";
    this._defaultCommandGroup = heading;
    return this;
  }
  /**
   * Set/get the default help group heading for options added to this command.
   * (This does not override a group set directly on the option using .helpGroup().)
   *
   * @example
   * program
   *   .optionsGroup('Development Options:')
   *   .option('-d, --debug', 'output extra debugging')
   *   .option('-p, --profile', 'output profiling information')
   *
   * @param {string} [heading]
   * @returns {Command | string}
   */
  optionsGroup(heading) {
    if (heading === void 0) return this._defaultOptionGroup ?? "";
    this._defaultOptionGroup = heading;
    return this;
  }
  /**
   * @param {Option} option
   * @private
   */
  _initOptionGroup(option) {
    if (this._defaultOptionGroup && !option.helpGroupHeading)
      option.helpGroup(this._defaultOptionGroup);
  }
  /**
   * @param {Command} cmd
   * @private
   */
  _initCommandGroup(cmd) {
    if (this._defaultCommandGroup && !cmd.helpGroup())
      cmd.helpGroup(this._defaultCommandGroup);
  }
  /**
   * Set the name of the command from script filename, such as process.argv[1],
   * or import.meta.filename.
   *
   * (Used internally and public although not documented in README.)
   *
   * @example
   * program.nameFromFilename(import.meta.filename);
   *
   * @param {string} filename
   * @return {Command}
   */
  nameFromFilename(filename) {
    this._name = import_node_path.default.basename(filename, import_node_path.default.extname(filename));
    return this;
  }
  /**
   * Get or set the directory for searching for executable subcommands of this command.
   *
   * @example
   * program.executableDir(import.meta.dirname);
   * // or
   * program.executableDir('subcommands');
   *
   * @param {string} [path]
   * @return {(string|null|Command)}
   */
  executableDir(path4) {
    if (path4 === void 0) return this._executableDir;
    this._executableDir = path4;
    return this;
  }
  /**
   * Return program help documentation.
   *
   * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
   * @return {string}
   */
  helpInformation(contextOptions) {
    const helper = this.createHelp();
    const context = this._getOutputContext(contextOptions);
    helper.prepareContext({
      error: context.error,
      helpWidth: context.helpWidth,
      outputHasColors: context.hasColors
    });
    const text = helper.formatHelp(this, helper);
    if (context.hasColors) return text;
    return this._outputConfiguration.stripColor(text);
  }
  /**
   * @typedef HelpContext
   * @type {object}
   * @property {boolean} error
   * @property {number} helpWidth
   * @property {boolean} hasColors
   * @property {function} write - includes stripColor if needed
   *
   * @returns {HelpContext}
   * @private
   */
  _getOutputContext(contextOptions) {
    contextOptions = contextOptions || {};
    const error = !!contextOptions.error;
    let baseWrite;
    let hasColors;
    let helpWidth;
    if (error) {
      baseWrite = (str) => this._outputConfiguration.writeErr(str);
      hasColors = this._outputConfiguration.getErrHasColors();
      helpWidth = this._outputConfiguration.getErrHelpWidth();
    } else {
      baseWrite = (str) => this._outputConfiguration.writeOut(str);
      hasColors = this._outputConfiguration.getOutHasColors();
      helpWidth = this._outputConfiguration.getOutHelpWidth();
    }
    const write = (str) => {
      if (!hasColors) str = this._outputConfiguration.stripColor(str);
      return baseWrite(str);
    };
    return { error, write, hasColors, helpWidth };
  }
  /**
   * Output help information for this command.
   *
   * Outputs built-in help, and custom text added using `.addHelpText()`.
   *
   * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
   */
  outputHelp(contextOptions) {
    let deprecatedCallback;
    if (typeof contextOptions === "function") {
      deprecatedCallback = contextOptions;
      contextOptions = void 0;
    }
    const outputContext = this._getOutputContext(contextOptions);
    const eventContext = {
      error: outputContext.error,
      write: outputContext.write,
      command: this
    };
    this._getCommandAndAncestors().reverse().forEach((command) => command.emit("beforeAllHelp", eventContext));
    this.emit("beforeHelp", eventContext);
    let helpInformation = this.helpInformation({ error: outputContext.error });
    if (deprecatedCallback) {
      helpInformation = deprecatedCallback(helpInformation);
      if (typeof helpInformation !== "string" && !Buffer.isBuffer(helpInformation)) {
        throw new Error("outputHelp callback must return a string or a Buffer");
      }
    }
    outputContext.write(helpInformation);
    if (this._getHelpOption()?.long) {
      this.emit(this._getHelpOption().long);
    }
    this.emit("afterHelp", eventContext);
    this._getCommandAndAncestors().forEach(
      (command) => command.emit("afterAllHelp", eventContext)
    );
  }
  /**
   * You can pass in flags and a description to customise the built-in help option.
   * Pass in false to disable the built-in help option.
   *
   * @example
   * program.helpOption('-?, --help' 'show help'); // customise
   * program.helpOption(false); // disable
   *
   * @param {(string | boolean)} flags
   * @param {string} [description]
   * @return {Command} `this` command for chaining
   */
  helpOption(flags, description) {
    if (typeof flags === "boolean") {
      if (flags) {
        if (this._helpOption === null) this._helpOption = void 0;
        if (this._defaultOptionGroup) {
          this._initOptionGroup(this._getHelpOption());
        }
      } else {
        this._helpOption = null;
      }
      return this;
    }
    this._helpOption = this.createOption(
      flags ?? "-h, --help",
      description ?? "display help for command"
    );
    if (flags || description) this._initOptionGroup(this._helpOption);
    return this;
  }
  /**
   * Lazy create help option.
   * Returns null if has been disabled with .helpOption(false).
   *
   * @returns {(Option | null)} the help option
   * @package
   */
  _getHelpOption() {
    if (this._helpOption === void 0) {
      this.helpOption(void 0, void 0);
    }
    return this._helpOption;
  }
  /**
   * Supply your own option to use for the built-in help option.
   * This is an alternative to using helpOption() to customise the flags and description etc.
   *
   * @param {Option} option
   * @return {Command} `this` command for chaining
   */
  addHelpOption(option) {
    this._helpOption = option;
    this._initOptionGroup(option);
    return this;
  }
  /**
   * Output help information and exit.
   *
   * Outputs built-in help, and custom text added using `.addHelpText()`.
   *
   * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
   */
  help(contextOptions) {
    this.outputHelp(contextOptions);
    let exitCode = Number(import_node_process.default.exitCode ?? 0);
    if (exitCode === 0 && contextOptions && typeof contextOptions !== "function" && contextOptions.error) {
      exitCode = 1;
    }
    this._exit(exitCode, "commander.help", "(outputHelp)");
  }
  /**
   * // Do a little typing to coordinate emit and listener for the help text events.
   * @typedef HelpTextEventContext
   * @type {object}
   * @property {boolean} error
   * @property {Command} command
   * @property {function} write
   */
  /**
   * Add additional text to be displayed with the built-in help.
   *
   * Position is 'before' or 'after' to affect just this command,
   * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
   *
   * @param {string} position - before or after built-in help
   * @param {(string | Function)} text - string to add, or a function returning a string
   * @return {Command} `this` command for chaining
   */
  addHelpText(position, text) {
    const allowedValues = ["beforeAll", "before", "after", "afterAll"];
    if (!allowedValues.includes(position)) {
      throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
    }
    const helpEvent = `${position}Help`;
    this.on(helpEvent, (context) => {
      let helpStr;
      if (typeof text === "function") {
        helpStr = text({ error: context.error, command: context.command });
      } else {
        helpStr = text;
      }
      if (helpStr) {
        context.write(`${helpStr}
`);
      }
    });
    return this;
  }
  /**
   * Output help information if help flags specified
   *
   * @param {Array} args - array of options to search for help flags
   * @private
   */
  _outputHelpIfRequested(args) {
    const helpOption = this._getHelpOption();
    const helpRequested = helpOption && args.find((arg) => helpOption.is(arg));
    if (helpRequested) {
      this.outputHelp();
      this._exit(0, "commander.helpDisplayed", "(outputHelp)");
    }
  }
};
function incrementNodeInspectorPort(args) {
  return args.map((arg) => {
    if (!arg.startsWith("--inspect")) {
      return arg;
    }
    let debugOption;
    let debugHost = "127.0.0.1";
    let debugPort = "9229";
    let match;
    if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
      debugOption = match[1];
    } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
      debugOption = match[1];
      if (/^\d+$/.test(match[3])) {
        debugPort = match[3];
      } else {
        debugHost = match[3];
      }
    } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
      debugOption = match[1];
      debugHost = match[3];
      debugPort = match[4];
    }
    if (debugOption && debugPort !== "0") {
      return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
    }
    return arg;
  });
}
function useColor() {
  if (import_node_process.default.env.NO_COLOR || import_node_process.default.env.FORCE_COLOR === "0" || import_node_process.default.env.FORCE_COLOR === "false")
    return false;
  if (import_node_process.default.env.FORCE_COLOR || import_node_process.default.env.CLICOLOR_FORCE !== void 0)
    return true;
  return void 0;
}

// ../../node_modules/commander/index.js
var program = new Command();

// ../core/dist/chunk-K7VG4N2F.js
var defaultConfig = {
  maxInstructionTokens: 4e3,
  duplicateSimilarity: 0.88
};
function parseRepositoryConfig(files) {
  const candidates = files.filter((file) => /(^|\/)\.agentlint\.json$/i.test(file.path));
  const root = candidates.find((file) => file.path === ".agentlint.json") ?? candidates[0];
  if (!root?.content.trim()) return { config: {}, findings: [] };
  try {
    const parsed = JSON.parse(root.content);
    const findings = [];
    if (parsed.maxInstructionTokens !== void 0 && (!Number.isFinite(parsed.maxInstructionTokens) || parsed.maxInstructionTokens < 200)) {
      findings.push(configFinding(root.path, "maxInstructionTokens must be a number of at least 200."));
    }
    if (parsed.duplicateSimilarity !== void 0 && (parsed.duplicateSimilarity < 0.5 || parsed.duplicateSimilarity > 1)) {
      findings.push(configFinding(root.path, "duplicateSimilarity must be between 0.5 and 1."));
    }
    if (parsed.rules && typeof parsed.rules !== "object") {
      findings.push(configFinding(root.path, "rules must be an object mapping rule IDs to error, warning, info or off."));
    }
    if (parsed.locale !== void 0 && !["zh-CN", "en-US"].includes(parsed.locale)) {
      findings.push(configFinding(root.path, "locale must be zh-CN or en-US."));
    }
    return { config: parsed, findings };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    return { config: {}, findings: [configFinding(root.path, message)] };
  }
}
function mergeConfig(repository, override) {
  return {
    ...repository,
    ...override,
    ignore: override?.ignore ?? repository.ignore,
    rules: { ...repository.rules ?? {}, ...override?.rules ?? {} }
  };
}
function resolveRuleSetting(config, ruleId, fallback) {
  const exact = config.rules?.[ruleId];
  if (exact) return exact;
  const category = ruleId.split("/", 1)[0];
  return config.rules?.[`${category}/*`] ?? config.rules?.["*"] ?? fallback;
}
function configFinding(file, details) {
  return {
    id: `validity/config-invalid/${hash(details)}`,
    ruleId: "validity/config-invalid",
    severity: "error",
    category: "validity",
    title: "Invalid AgentLint configuration",
    message: details,
    file,
    suggestion: "Fix .agentlint.json or remove the invalid option.",
    translations: {
      "en-US": {
        title: "Invalid AgentLint configuration",
        message: details,
        suggestion: "Fix .agentlint.json or remove the invalid option."
      },
      "zh-CN": {
        title: "AgentLint \u914D\u7F6E\u65E0\u6548",
        message: translateDetails(details),
        suggestion: "\u4FEE\u590D .agentlint.json\uFF0C\u6216\u5220\u9664\u65E0\u6548\u914D\u7F6E\u9879\u3002"
      }
    }
  };
}
function hash(value) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(36);
}
function translateDetails(details) {
  if (details.includes("maxInstructionTokens")) return "maxInstructionTokens \u5FC5\u987B\u662F\u4E00\u4E2A\u4E0D\u5C0F\u4E8E 200 \u7684\u6570\u5B57\u3002";
  if (details.includes("duplicateSimilarity")) return "duplicateSimilarity \u5FC5\u987B\u4F4D\u4E8E 0.5 \u5230 1 \u4E4B\u95F4\u3002";
  if (details.includes("rules must")) return "rules \u5FC5\u987B\u662F\u5C06\u89C4\u5219 ID \u6620\u5C04\u5230 error\u3001warning\u3001info \u6216 off \u7684\u5BF9\u8C61\u3002";
  if (details.includes("locale must")) return "locale \u5FC5\u987B\u4E3A zh-CN \u6216 en-US\u3002";
  return `\u914D\u7F6E JSON \u65E0\u6548\uFF1A${details}`;
}
function normalizePath(input) {
  const absolute = input.startsWith("/");
  const parts = [];
  for (const part of input.replaceAll("\\", "/").split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") {
      if (parts.length && parts.at(-1) !== "..") parts.pop();
      else if (!absolute) parts.push("..");
    } else parts.push(part);
  }
  const value = parts.join("/");
  return absolute ? `/${value}` : value || ".";
}
function dirname(input) {
  const normalized = normalizePath(input);
  const index = normalized.lastIndexOf("/");
  if (index < 0) return ".";
  if (index === 0) return "/";
  return normalized.slice(0, index);
}
function basename(input) {
  const normalized = normalizePath(input);
  const index = normalized.lastIndexOf("/");
  return index < 0 ? normalized : normalized.slice(index + 1);
}
function joinPath(...parts) {
  return normalizePath(parts.filter(Boolean).join("/"));
}
function extname(input) {
  const base = basename(input);
  const index = base.lastIndexOf(".");
  return index <= 0 ? "" : base.slice(index);
}
var normalizeRepositoryPath = (inputPath) => inputPath.replaceAll("\\", "/").replace(/^\.\//, "").replace(/\/{2,}/g, "/");
function detectInstructionKind(inputPath) {
  const filePath = normalizeRepositoryPath(inputPath);
  if (/(^|\/)AGENTS\.md$/i.test(filePath)) return "agents";
  if (/(^|\/)\.claude\/rules\/.+\.md$/i.test(filePath)) return "claude-rule";
  if (/(^|\/)(?:\.claude\/)?CLAUDE(?:\.local)?\.md$/i.test(filePath)) return "claude";
  if (/(^|\/)GEMINI\.md$/i.test(filePath)) return "gemini";
  if (/(^|\/)\.cursorrules$/i.test(filePath)) return "cursor";
  if (/(^|\/)\.cursor\/rules\/.+\.(?:md|mdc)$/i.test(filePath)) return "cursor";
  if (/(^|\/)\.github\/copilot-instructions\.md$/i.test(filePath)) return "copilot";
  if (/(^|\/)\.github\/instructions\/.+\.instructions\.md$/i.test(filePath)) return "copilot";
  if (/(^|\/)\.github\/agents\/.+\.md$/i.test(filePath)) return "copilot-agent";
  if (/(^|\/)\.clinerules(?:\/.*\.md)?$/i.test(filePath)) return "cline";
  if (/(^|\/)\.windsurfrules$/i.test(filePath)) return "windsurf";
  if (/(^|\/)\.windsurf\/rules\/.+\.md$/i.test(filePath)) return "windsurf";
  return null;
}
function instructionLabel(kind, locale = "en-US") {
  const labels = {
    agents: ["AGENTS.md", "AGENTS.md"],
    claude: ["Claude Code", "Claude Code"],
    "claude-rule": ["Claude scoped rule", "Claude \u4F5C\u7528\u57DF\u89C4\u5219"],
    gemini: ["Gemini CLI", "Gemini CLI"],
    cursor: ["Cursor Rules", "Cursor \u89C4\u5219"],
    copilot: ["GitHub Copilot", "GitHub Copilot"],
    "copilot-agent": ["Copilot custom agent", "Copilot \u81EA\u5B9A\u4E49\u52A9\u624B"],
    cline: ["Cline", "Cline"],
    windsurf: ["Windsurf", "Windsurf"],
    unknown: ["Unknown", "\u672A\u77E5"]
  };
  return labels[kind][locale === "zh-CN" ? 1 : 0];
}
function instructionScope(inputPath, locale = "en-US") {
  const filePath = normalizeRepositoryPath(inputPath);
  const kind = detectInstructionKind(filePath);
  const directory = dirname(filePath);
  const zh = locale === "zh-CN";
  if (kind === "agents" || kind === "claude" || kind === "gemini") {
    return directory === "." ? zh ? "\u6574\u4E2A\u4ED3\u5E93" : "repository" : `${directory}/**`;
  }
  if (kind === "claude-rule") return zh ? "frontmatter \u8DEF\u5F84\u6216\u6574\u4E2A\u4ED3\u5E93" : "frontmatter paths or repository";
  if (kind === "cursor") return zh ? "\u89C4\u5219\u5143\u6570\u636E\u5B9A\u4E49" : "rule metadata";
  if (kind === "copilot") return filePath.includes("/.github/instructions/") || filePath.startsWith(".github/instructions/") ? zh ? "applyTo \u5339\u914D\u8303\u56F4" : "applyTo glob" : zh ? "\u6574\u4E2A\u4ED3\u5E93" : "repository";
  if (kind === "copilot-agent") return zh ? "\u81EA\u5B9A\u4E49 Agent" : "custom agent";
  return directory === "." ? zh ? "\u6574\u4E2A\u4ED3\u5E93" : "repository" : `${directory}/**`;
}
function isInstructionFile(inputPath) {
  return detectInstructionKind(inputPath) !== null;
}
function isConfigurationFile(inputPath) {
  const filePath = normalizeRepositoryPath(inputPath);
  return /(^|\/)\.agentlint\.json$/i.test(filePath);
}
function shouldReadRepositoryFile(inputPath) {
  const filePath = normalizeRepositoryPath(inputPath);
  return isInstructionFile(filePath) || isConfigurationFile(filePath) || /(^|\/)package\.json$/i.test(filePath) || /(^|\/)(?:pnpm-lock\.yaml|package-lock\.json|npm-shrinkwrap\.json|yarn\.lock|bun\.lockb?|uv\.lock|pyproject\.toml|Cargo\.toml|go\.mod|Makefile|Justfile|Taskfile\.ya?ml)$/i.test(filePath);
}
function sortRepositoryFiles(files) {
  return [...files].sort((a, b) => normalizeRepositoryPath(a.path).localeCompare(normalizeRepositoryPath(b.path)));
}
function estimateTokens(text) {
  if (!text) return 0;
  const withoutComments = text.replace(/<!--[^]*?-->/g, "");
  const latin = (withoutComments.match(/[\u0000-\u00ff]/g) ?? []).length;
  const nonLatin = withoutComments.length - latin;
  return Math.ceil(latin / 4 + nonLatin / 1.8);
}
function normalizeInstruction(text) {
  return text.toLowerCase().replace(/`([^`]+)`/g, "$1").replace(/\[[^\]]+\]\([^\)]+\)/g, "").replace(/[\p{P}\p{S}]+/gu, " ").replace(/\s+/g, " ").trim();
}
function parseFrontmatter(content) {
  const lines = content.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") {
    return { hasFrontmatter: false, closed: true, data: {}, bodyStartLine: 1 };
  }
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (end < 0) return { hasFrontmatter: true, closed: false, data: {}, bodyStartLine: lines.length + 1 };
  const data = {};
  let arrayKey = null;
  for (const raw of lines.slice(1, end)) {
    const arrayItem = raw.match(/^\s*-\s+["']?(.+?)["']?\s*$/);
    if (arrayItem?.[1] && arrayKey) {
      const values = Array.isArray(data[arrayKey]) ? data[arrayKey] : [];
      values.push(arrayItem[1]);
      data[arrayKey] = values;
      continue;
    }
    const property = raw.match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/);
    if (!property?.[1]) continue;
    const key = property[1];
    const value = (property[2] ?? "").replace(/^['"]|['"]$/g, "");
    if (!value) {
      data[key] = [];
      arrayKey = key;
    } else {
      data[key] = value;
      arrayKey = null;
    }
  }
  return { hasFrontmatter: true, closed: true, data, bodyStartLine: end + 2 };
}
function extractInstructionLines(file) {
  const originalLines = file.content.split(/\r?\n/);
  const frontmatter = parseFrontmatter(file.content);
  const output = [];
  let inCodeFence = false;
  let inHtmlComment = false;
  originalLines.forEach((raw, index) => {
    const lineNumber = index + 1;
    if (frontmatter.hasFrontmatter && lineNumber < frontmatter.bodyStartLine) return;
    const trimmed = raw.trim();
    if (inHtmlComment) {
      if (trimmed.includes("-->")) inHtmlComment = false;
      return;
    }
    if (trimmed.includes("<!--")) {
      if (!trimmed.includes("-->")) inHtmlComment = true;
      return;
    }
    if (/^```|^~~~/.test(trimmed)) {
      inCodeFence = !inCodeFence;
      return;
    }
    if (!trimmed || /^#{1,6}\s+/.test(trimmed)) return;
    const cleaned = inCodeFence ? trimmed : trimmed.replace(/^[-*+]\s+/, "").replace(/^\d+[.)]\s+/, "").replace(/^>\s*/, "").trim();
    const normalized = normalizeInstruction(cleaned);
    if (normalized.length < 4) return;
    output.push({
      file: file.path,
      line: lineNumber,
      text: cleaned,
      raw,
      normalized,
      inCodeFence
    });
  });
  return output;
}
function repositoryPathExists(allPaths, reference, fromFile) {
  let candidate = reference.trim().replace(/[),.;:]+$/, "").replace(/^['"`]|['"`]$/g, "");
  if (!candidate || /^(?:https?:|mailto:|#|~\/|\/)/i.test(candidate)) return true;
  if (/[!*?{}[\]]/.test(candidate)) return true;
  candidate = candidate.split("#", 1)[0] ?? candidate;
  candidate = candidate.replace(/^@/, "").replace(/^\.\//, "");
  const fromDir = dirname(fromFile);
  const rawCandidates = [candidate, joinPath(fromDir, candidate)];
  const candidates = /* @__PURE__ */ new Set();
  for (const value of rawCandidates) {
    const normalized = normalizePath(value).replace(/^(?:\.\.\/)+/, "");
    candidates.add(normalized);
    if (!extname(normalized)) candidates.add(`${normalized}.md`);
  }
  for (const value of candidates) {
    if (allPaths.has(value)) return true;
    const prefix = value.replace(/\/$/, "") + "/";
    for (const existing of allPaths) {
      if (existing.startsWith(prefix)) return true;
    }
  }
  return false;
}
function extractPathReferences(text) {
  const found = /* @__PURE__ */ new Set();
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    if (match[1]) found.add(match[1]);
  }
  for (const match of text.matchAll(/`([^`]+)`/g)) {
    const value = match[1]?.trim();
    if (value && looksLikeRepositoryPath(value)) found.add(value);
  }
  for (const match of text.matchAll(/(?:^|\s)(@[\w@./{}*?-]+)/g)) {
    const raw = match[1];
    const value = raw?.slice(1);
    const isImportPath = value && (/^\.{1,2}\//.test(value) || /\.(?:md|json|ya?ml|toml)$/i.test(value));
    if (raw && value && isImportPath && looksLikeRepositoryPath(value)) found.add(raw);
  }
  for (const match of text.matchAll(/(?:^|\s)((?:\.\.?\/)?(?:[\w@.-]+\/)+[\w@.{}*?-]+\/?)/g)) {
    const value = match[1]?.trim();
    if (value && looksLikeRepositoryPath(value)) found.add(value);
  }
  return [...found].slice(0, 20);
}
function jaccardSimilarity(left, right) {
  const a = new Set(normalizeInstruction(left).split(" ").filter((token) => token.length > 2));
  const b = new Set(normalizeInstruction(right).split(" ").filter((token) => token.length > 2));
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
}
function looksLikeRepositoryPath(value) {
  if (/\s/.test(value) || /^(?:https?:|git@|[\w-]+@\d)/i.test(value)) return false;
  if (/^@[A-Za-z0-9_.-]+\//.test(value)) return false;
  if (/(?:^|\/)(?:node_modules|dist|coverage|\.next|\.turbo|vendor|target)(?:\/|$)/i.test(value)) return false;
  if (/^(?:npm|pnpm|yarn|bun|git|node|npx|python|pytest|make|cargo|go)\b/i.test(value)) return false;
  return value.includes("/") || /^(?:README|AGENTS|CLAUDE|GEMINI)$/i.test(value) || /\.(?:md|json|ya?ml|toml|ts|tsx|js|jsx|py|go|rs|java|css|scss|html)$/i.test(value);
}
var managerLockfiles = {
  npm: ["package-lock.json", "npm-shrinkwrap.json"],
  pnpm: ["pnpm-lock.yaml"],
  yarn: ["yarn.lock"],
  bun: ["bun.lock", "bun.lockb"]
};
var dangerousRules = [
  {
    ruleId: "security/force-push",
    pattern: /git\s+push\s+(?:[^\n]*\s)?(?:--force(?!-with-lease)|-f\b)/i,
    subject: /git\s+push.{0,30}(?:--force|-f\b)/i,
    title: "Dangerous force-push instruction",
    message: "The instruction permits rewriting remote Git history with an unconditional force push.",
    suggestion: "Require explicit user confirmation and prefer --force-with-lease on a non-protected branch.",
    severity: "error"
  },
  {
    ruleId: "security/force-with-lease",
    pattern: /git\s+push\s+(?:[^\n]*\s)?--force-with-lease/i,
    subject: /git\s+push.{0,30}--force-with-lease/i,
    title: "History rewrite should require confirmation",
    message: "Even --force-with-lease rewrites remote history and should not be performed silently.",
    suggestion: "State that the agent must ask before rewriting a remote branch.",
    severity: "warning"
  },
  {
    ruleId: "security/destructive-shell",
    pattern: /\brm\s+-rf\s+(?:\/|~|\.\.?\/?(?:\s|$))|\bdel\s+\/s\s+\/q\b/i,
    subject: /(?:rm\s+-rf|del\s+\/s\s+\/q)/i,
    title: "Destructive shell instruction",
    message: "The instruction contains a broad recursive-delete command.",
    suggestion: "Limit deletion to a named temporary directory and require confirmation.",
    severity: "error"
  },
  {
    ruleId: "security/pipe-to-shell",
    pattern: /(?:curl|wget)\b[^\n|]{0,200}\|\s*(?:sudo\s+)?(?:bash|sh|zsh)\b/i,
    subject: /(?:curl|wget).{0,200}\|.{0,20}(?:bash|sh|zsh)/i,
    title: "Remote script is piped directly to a shell",
    message: "Executing downloaded content without review creates a supply-chain risk.",
    suggestion: "Download to a file, verify its source or checksum, inspect it, and then execute explicitly.",
    severity: "error"
  },
  {
    ruleId: "security/hard-reset",
    pattern: /git\s+reset\s+--hard/i,
    subject: /git\s+reset\s+--hard/i,
    title: "Hard reset can discard work",
    message: "The instruction may permanently discard uncommitted changes.",
    suggestion: "Create a backup branch or stash changes and ask the user before resetting.",
    severity: "warning"
  },
  {
    ruleId: "security/no-verify",
    pattern: /(?:git\s+(?:commit|push)[^\n]*|npm\s+publish[^\n]*)--no-verify/i,
    subject: /--no-verify/i,
    title: "Verification hooks are bypassed",
    message: "The instruction bypasses repository safety and quality hooks.",
    suggestion: "Fix the hook failure instead of disabling verification, or document a narrow emergency exception.",
    severity: "warning"
  },
  {
    ruleId: "security/chmod-777",
    pattern: /chmod\s+(?:-R\s+)?777\b/i,
    subject: /chmod.{0,20}777/i,
    title: "World-writable permissions requested",
    message: "chmod 777 grants write access to every local user and process.",
    suggestion: "Use the minimum required owner/group permissions, such as 755 or 750.",
    severity: "warning"
  },
  {
    ruleId: "security/tls-disabled",
    pattern: /NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*0|(?:curl|wget)\b[^\n]*(?:--insecure|-k\b)/i,
    subject: /(?:NODE_TLS_REJECT_UNAUTHORIZED|--insecure|-k\b)/i,
    title: "TLS verification is disabled",
    message: "Disabling certificate verification exposes downloads and API traffic to interception.",
    suggestion: "Install the correct CA certificate or configure a trusted development proxy.",
    severity: "warning"
  },
  {
    ruleId: "security/broad-sudo",
    pattern: /(?:always|may|可以|允许).{0,20}\bsudo\b|\bsudo\s+(?:rm|chmod|chown|sh|bash)\b/i,
    subject: /\bsudo\b/i,
    title: "Broad privileged execution instruction",
    message: "The rule encourages commands with elevated operating-system privileges.",
    suggestion: "Name the exact privileged operation, explain why it is required, and require confirmation.",
    severity: "warning"
  },
  {
    ruleId: "security/no-confirmation",
    pattern: /(?:do not|never|don't)\s+(?:ask|request)\s+(?:for\s+)?confirmation|无需确认|不要.{0,4}确认/i,
    subject: /(?:confirmation|确认)/i,
    title: "Instruction suppresses user confirmation",
    message: "Autonomous execution without confirmation is risky for destructive or external actions.",
    suggestion: "Allow silent operation only for reversible local changes; require confirmation otherwise.",
    severity: "warning"
  },
  {
    ruleId: "security/production-data",
    pattern: /(?:modify|delete|drop|truncate|write).{0,30}(?:production|prod).{0,15}(?:database|db)|(?:生产|线上).{0,12}(?:数据库|数据).{0,12}(?:删除|修改|写入)/i,
    subject: /(?:production|prod|生产|线上).{0,30}(?:database|db|数据库|数据)/i,
    title: "Production-data modification instruction",
    message: "The instruction appears to authorize changes to production data.",
    suggestion: "Disallow production writes by default and require a separate audited workflow.",
    severity: "error"
  },
  {
    ruleId: "security/secret-exposure",
    pattern: /(?:print|echo|log|commit|upload|send).{0,30}(?:api[_ -]?keys?|secrets?|tokens?|\.env)|(?:输出|打印|提交|上传).{0,16}(?:密钥|令牌|\.env)/i,
    subject: /(?:api[_ -]?keys?|secrets?|tokens?|\.env|密钥|令牌)/i,
    title: "Instruction may expose secrets",
    message: "The rule appears to permit printing, committing or transmitting secret material.",
    suggestion: "Keep secrets out of logs and version control; use redaction and a secret manager.",
    severity: "error"
  },
  {
    ruleId: "security/skip-validation",
    pattern: /(?:skip|disable|ignore).{0,20}(?:tests?|type\s*check|lint)|(?:忽略|跳过|禁用).{0,12}(?:测试|类型检查|lint)/i,
    subject: /(?:tests?|type\s*check|lint|测试|类型检查)/i,
    title: "Validation is explicitly bypassed",
    message: "Skipping tests, linting or type checks can hide regressions.",
    suggestion: "Describe the fastest relevant validation command instead of disabling validation.",
    severity: "warning"
  }
];
var contradictionSubjects = [
  "prettier",
  "biome",
  "eslint",
  "typescript",
  "javascript",
  "jest",
  "vitest",
  "pytest",
  "tailwind",
  "react",
  "vue",
  "semicolons",
  "tabs",
  "spaces",
  "class components",
  "functional components"
];
function analyzeRepository(inputFiles, options = {}) {
  const files = sortRepositoryFiles(
    inputFiles.map((file) => ({ ...file, path: normalizeRepositoryPath(file.path) }))
  );
  const fileByPath = new Map(files.map((file) => [file.path, file]));
  const allPaths = new Set(files.map((file) => file.path));
  const instructionSources = files.filter((file) => detectInstructionKind(file.path));
  const instructionLines = instructionSources.flatMap(extractInstructionLines);
  const repositoryConfig = parseRepositoryConfig(files);
  const config = mergeConfig(repositoryConfig.config, options.config);
  const locale = options.locale ?? config.locale ?? "en-US";
  const maxInstructionTokens = validNumber(config.maxInstructionTokens, 200, 1e5) ? config.maxInstructionTokens : defaultConfig.maxInstructionTokens;
  const duplicateSimilarity = validNumber(config.duplicateSimilarity, 0.5, 1) ? config.duplicateSimilarity : defaultConfig.duplicateSimilarity;
  const findings = [...repositoryConfig.findings];
  if (instructionSources.length === 0) {
    findings.push(makeFinding("coverage/no-instruction-files", "warning", "coverage", {
      title: "No agent instruction files found",
      message: "The repository does not contain a recognized AI coding-agent instruction file.",
      suggestion: "Add an AGENTS.md file with build, test, architecture and safety guidance."
    }));
  }
  findings.push(...findInstructionFileProblems(instructionSources, maxInstructionTokens));
  findings.push(...findGuidanceGaps(files, instructionLines));
  findings.push(...findDuplicateInstructions(instructionLines));
  findings.push(...findNearDuplicateInstructions(instructionLines, duplicateSimilarity));
  findings.push(...findContradictions(instructionLines));
  findings.push(...findPackageManagerProblems(files, instructionLines));
  findings.push(...findMissingScripts(files, instructionLines));
  findings.push(...findMissingTaskTargets(files, instructionLines));
  findings.push(...findMissingPaths(allPaths, instructionLines));
  findings.push(...findDangerousInstructions(instructionLines));
  const uniqueFindings = findings.filter((finding, index, array) => array.findIndex((item) => item.id === finding.id) === index);
  const { active, suppressed } = applyConfigurationAndSuppressions(uniqueFindings, fileByPath, config);
  const orderedFindings = active.sort(compareFindings).map((finding) => localizeFinding(finding, locale));
  const instructionFiles = instructionSources.map((file) => {
    const kind = detectInstructionKind(file.path) ?? "unknown";
    return {
      path: file.path,
      kind,
      label: instructionLabel(kind, locale),
      estimatedTokens: estimateTokens(file.content),
      instructionCount: extractInstructionLines(file).length,
      lineCount: file.content ? file.content.split(/\r?\n/).length : 0,
      scope: describeScope(file, locale) ?? instructionScope(file.path, locale)
    };
  });
  const duplicateInstructions = countDuplicateLines(instructionLines);
  const estimatedTokens = instructionFiles.reduce((sum, file) => sum + file.estimatedTokens, 0);
  const avoidableTokens = estimateAvoidableTokens(instructionLines);
  const metrics = calculateMetrics(orderedFindings, instructionSources.length);
  const score = Math.round(
    metrics.coverage * 0.15 + metrics.consistency * 0.2 + metrics.validity * 0.25 + metrics.security * 0.25 + metrics.efficiency * 0.15
  );
  const gradeKey = score >= 90 ? "excellent" : score >= 75 ? "good" : score >= 50 ? "needs-work" : "critical";
  const scopeGraph = buildScopeGraph(instructionFiles);
  return {
    schemaVersion: "1.2",
    generatedAt: options.generatedAt ?? (/* @__PURE__ */ new Date()).toISOString(),
    repositoryName: options.repositoryName,
    locale,
    score,
    gradeKey,
    grade: gradeLabel(gradeKey, locale),
    metrics,
    summary: {
      filesScanned: files.length,
      instructionFiles: instructionSources.length,
      instructions: instructionLines.length,
      errors: orderedFindings.filter((finding) => finding.severity === "error").length,
      warnings: orderedFindings.filter((finding) => finding.severity === "warning").length,
      suggestions: orderedFindings.filter((finding) => finding.severity === "info").length,
      estimatedTokens,
      duplicateInstructions,
      avoidableTokens,
      fixable: orderedFindings.filter((finding) => finding.fix?.safe && finding.fix.edits.length).length,
      suppressed
    },
    instructionFiles,
    scopeGraph,
    findings: orderedFindings,
    config: { maxInstructionTokens, duplicateSimilarity }
  };
}
function findInstructionFileProblems(files, maxTokens) {
  const findings = [];
  for (const file of files) {
    const kind = detectInstructionKind(file.path);
    const lines = extractInstructionLines(file);
    const frontmatter = parseFrontmatter(file.content);
    const tokens = estimateTokens(file.content);
    if (!file.content.trim() || lines.length === 0) {
      findings.push(makeFinding("coverage/empty-instruction-file", "warning", "coverage", {
        title: "Instruction file contains no usable guidance",
        message: "The file is empty or contains only headings, comments and frontmatter.",
        file: file.path,
        suggestion: "Add concise, verifiable project instructions or remove the unused file."
      }));
    }
    if (tokens > maxTokens) {
      findings.push(makeFinding("efficiency/file-too-large", "warning", "efficiency", {
        title: "Instruction file consumes a large context budget",
        message: `This file is estimated at ${tokens} tokens, above the configured ${maxTokens}-token limit.`,
        file: file.path,
        suggestion: "Move task-specific material into scoped rules, skills or referenced documentation."
      }));
    }
    if (kind === "claude" && file.content.split(/\r?\n/).length > 200) {
      findings.push(makeFinding("efficiency/claude-line-count", "info", "efficiency", {
        title: "CLAUDE.md is longer than the recommended working size",
        message: "Long always-loaded instruction files consume context and may reduce instruction adherence.",
        file: file.path,
        suggestion: "Aim for fewer than 200 lines and move topic-specific guidance into .claude/rules/.",
        docs: "https://code.claude.com/docs/en/memory"
      }));
    }
    if (frontmatter.hasFrontmatter && !frontmatter.closed) {
      findings.push(makeFinding("validity/frontmatter-unclosed", "error", "validity", {
        title: "YAML frontmatter is not closed",
        message: "The file starts with --- but does not contain a closing --- delimiter.",
        file: file.path,
        line: 1,
        suggestion: "Add a closing --- line before the Markdown instructions."
      }));
      continue;
    }
    if (/\.cursorrules$/i.test(file.path)) {
      findings.push(makeFinding("coverage/cursor-legacy-format", "info", "coverage", {
        title: "Legacy .cursorrules format detected",
        message: "Cursor still supports this file, but project rules in .cursor/rules provide scoping and metadata.",
        file: file.path,
        suggestion: "Migrate the content into one or more .cursor/rules/*.mdc files.",
        docs: "https://docs.cursor.com/context/rules"
      }));
    }
    if (/\.windsurfrules$/i.test(file.path)) {
      findings.push(makeFinding("coverage/windsurf-legacy-format", "info", "coverage", {
        title: "Legacy Windsurf rules file detected",
        message: "Workspace rules in .windsurf/rules/ are easier to scope and maintain.",
        file: file.path,
        suggestion: "Move the content into focused .windsurf/rules/*.md files."
      }));
    }
    if (/\.cursor\/rules\/.+\.mdc$/i.test(file.path)) {
      if (!frontmatter.hasFrontmatter) {
        findings.push(makeFinding("validity/cursor-frontmatter", "warning", "validity", {
          title: "Cursor MDC rule has no frontmatter",
          message: "Cursor project rules use YAML frontmatter to control description, globs and activation.",
          file: file.path,
          line: 1,
          suggestion: "Add a frontmatter block with description, globs and alwaysApply as appropriate."
        }));
      } else {
        const alwaysApply = scalar(frontmatter.data.alwaysApply);
        if (alwaysApply && !/^(?:true|false)$/i.test(alwaysApply)) {
          findings.push(makeFinding("validity/cursor-always-apply", "error", "validity", {
            title: "Cursor alwaysApply must be true or false",
            message: `The current value is \u201C${alwaysApply}\u201D.`,
            file: file.path,
            line: 1,
            suggestion: "Set alwaysApply to true or false."
          }));
        }
        if (!scalar(frontmatter.data.description) && !scalar(frontmatter.data.globs) && alwaysApply !== "true") {
          findings.push(makeFinding("coverage/cursor-activation", "warning", "coverage", {
            title: "Cursor rule has no clear activation mode",
            message: "The rule has no description, globs or alwaysApply: true metadata.",
            file: file.path,
            line: 1,
            suggestion: "Define when the rule should be attached so it is not silently ignored."
          }));
        }
      }
    }
    if (/\.github\/instructions\/.+\.instructions\.md$/i.test(file.path)) {
      if (!frontmatter.hasFrontmatter || !scalar(frontmatter.data.applyTo)) {
        findings.push(makeFinding("validity/copilot-apply-to", "error", "validity", {
          title: "Path-specific Copilot instructions are missing applyTo",
          message: "GitHub path-specific instruction files require an applyTo glob in YAML frontmatter.",
          file: file.path,
          line: 1,
          suggestion: 'Add frontmatter such as applyTo: "src/**/*.ts".',
          docs: "https://docs.github.com/en/copilot/how-tos/custom-instructions/adding-repository-custom-instructions-for-github-copilot"
        }));
      }
    }
    if (/\.github\/agents\/.+\.md$/i.test(file.path)) {
      if (!frontmatter.hasFrontmatter || !scalar(frontmatter.data.description)) {
        findings.push(makeFinding("validity/copilot-agent-description", "error", "validity", {
          title: "Copilot custom agent is missing a description",
          message: "Custom agent profiles use YAML frontmatter and require a description of the agent's purpose.",
          file: file.path,
          line: 1,
          suggestion: "Add a concise description field to the frontmatter.",
          docs: "https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents"
        }));
      }
    }
  }
  return findings;
}
function findGuidanceGaps(files, lines) {
  if (lines.length === 0) return [];
  const scriptNames = collectPackageScripts(files);
  const normalized = lines.map((line) => line.normalized).join("\n");
  const checks = [
    {
      ruleId: "coverage/no-test-guidance",
      terms: /\b(?:test|tests|testing|pytest|vitest|jest)\b|测试/i,
      scripts: /(?:^|:)(?:test|check)(?::|$)/i,
      title: "No test guidance found",
      suggestion: "Document the fastest relevant test command and when a full test suite is required."
    },
    {
      ruleId: "coverage/no-build-guidance",
      terms: /\b(?:build|compile|typecheck|type-check|tsc)\b|构建|编译|类型检查/i,
      scripts: /(?:^|:)(?:build|compile|typecheck|type-check)(?::|$)/i,
      title: "No build or type-check guidance found",
      suggestion: "Tell agents how to verify that the project builds or type-checks successfully."
    },
    {
      ruleId: "coverage/no-lint-guidance",
      terms: /\b(?:lint|format|prettier|biome|eslint)\b|格式化/i,
      scripts: /(?:^|:)(?:lint|format)(?::|$)/i,
      title: "No lint or formatting guidance found",
      suggestion: "Document the project's lint or formatting command so generated changes match repository standards."
    }
  ];
  return checks.flatMap((check) => {
    const relevantScript = [...scriptNames].some((script) => check.scripts.test(script));
    if (!relevantScript || check.terms.test(normalized)) return [];
    return [makeFinding(check.ruleId, "info", "coverage", {
      title: check.title,
      message: "The repository exposes a matching package script, but its agent instructions do not mention it.",
      suggestion: check.suggestion
    })];
  });
}
function findDuplicateInstructions(lines) {
  const groups = /* @__PURE__ */ new Map();
  for (const line of lines) {
    if (line.normalized.length < 16) continue;
    groups.set(line.normalized, [...groups.get(line.normalized) ?? [], line]);
  }
  const findings = [];
  for (const [normalized, group] of groups) {
    if (group.length < 2 || new Set(group.map((line) => line.file)).size < 2) continue;
    const first = group[0];
    if (!first) continue;
    const locations = group.map((line) => `${line.file}:${line.line}`).join(", ");
    findings.push(makeFinding("efficiency/duplicate-instruction", "warning", "efficiency", {
      discriminator: normalized,
      title: "Duplicate instruction across agent files",
      message: `The same instruction appears ${group.length} times: ${locations}.`,
      file: first.file,
      line: first.line,
      evidence: first.text,
      suggestion: "Keep one canonical rule and import or generate tool-specific variants where supported."
    }));
  }
  return findings.slice(0, 20);
}
function findNearDuplicateInstructions(lines, threshold) {
  const candidates = lines.filter((line) => line.normalized.length >= 35);
  const findings = [];
  for (let leftIndex = 0; leftIndex < candidates.length; leftIndex += 1) {
    const left = candidates[leftIndex];
    if (!left) continue;
    for (let rightIndex = leftIndex + 1; rightIndex < candidates.length; rightIndex += 1) {
      const right = candidates[rightIndex];
      if (!right || left.file === right.file || left.normalized === right.normalized) continue;
      const similarity = jaccardSimilarity(left.text, right.text);
      if (similarity < threshold) continue;
      findings.push(makeFinding("efficiency/near-duplicate-instruction", "info", "efficiency", {
        discriminator: `${left.file}:${left.line}:${right.file}:${right.line}`,
        title: "Very similar instructions may waste context",
        message: `These rules are ${Math.round(similarity * 100)}% similar: ${left.file}:${left.line} and ${right.file}:${right.line}.`,
        file: left.file,
        line: left.line,
        evidence: left.text,
        suggestion: "Consolidate the shared part and keep only tool- or scope-specific differences."
      }));
      if (findings.length >= 12) return findings;
    }
  }
  return findings;
}
function findContradictions(lines) {
  const findings = [];
  for (const subject of contradictionSubjects) {
    const positive = lines.filter((line) => instructionPolarity(line.text, subject) === "positive");
    const negative = lines.filter((line) => instructionPolarity(line.text, subject) === "negative");
    if (!positive.length || !negative.length) continue;
    const firstPositive = positive[0];
    const firstNegative = negative[0];
    if (!firstPositive || !firstNegative) continue;
    findings.push(makeFinding("consistency/contradictory-instructions", "warning", "consistency", {
      discriminator: subject,
      title: `Conflicting guidance about ${subject}`,
      message: `One instruction requires or prefers ${subject}, while another tells the agent to avoid it.`,
      file: firstNegative.file,
      line: firstNegative.line,
      evidence: `${firstPositive.file}:${firstPositive.line} \u2014 ${firstPositive.text}
${firstNegative.file}:${firstNegative.line} \u2014 ${firstNegative.text}`,
      suggestion: "Choose one repository-wide policy or scope each rule to the directories where it applies."
    }));
  }
  return findings;
}
function findPackageManagerProblems(files, lines) {
  const findings = [];
  const sources = collectManagerSources(files);
  const byDirectory = /* @__PURE__ */ new Map();
  for (const source of sources) {
    const managers = byDirectory.get(source.directory) ?? /* @__PURE__ */ new Set();
    managers.add(source.manager);
    byDirectory.set(source.directory, managers);
  }
  for (const [directory, managers] of byDirectory) {
    if (managers.size <= 1) continue;
    findings.push(makeFinding("consistency/multiple-package-managers", "warning", "consistency", {
      discriminator: directory,
      title: "Multiple package managers detected in one scope",
      message: `${directory === "." ? "The repository root" : directory} declares artifacts for ${[...managers].join(", ")}.`,
      suggestion: "Keep one authoritative packageManager field and lockfile, or document an intentional nested workspace exception."
    }));
  }
  for (const line of lines) {
    const mentioned = detectManagerCommand(line.text);
    if (!mentioned) continue;
    const authoritative = nearestManagerForFile(line.file, sources);
    if (!authoritative || mentioned === authoritative) continue;
    const replacement = replaceManager(line.raw, mentioned, authoritative);
    findings.push(makeFinding("consistency/package-manager", "warning", "consistency", {
      discriminator: `${line.file}:${line.line}:${mentioned}`,
      title: "Package-manager instruction conflicts with repository metadata",
      message: `This instruction uses ${mentioned}, but the nearest lockfile or packageManager field indicates ${authoritative}.`,
      file: line.file,
      line: line.line,
      evidence: line.text,
      suggestion: `Replace the command with the ${authoritative} equivalent, or explain why this scope is different.`,
      fix: replacement === line.raw ? void 0 : {
        description: `Replace ${mentioned} with ${authoritative} on this instruction line.`,
        safe: true,
        edits: [{ file: line.file, line: line.line, replacement }]
      }
    }));
  }
  return findings;
}
function findMissingScripts(files, lines) {
  const manifests = collectPackageManifests(files);
  if (manifests.length === 0) return [];
  const allScripts = new Set(manifests.flatMap((manifest) => [...manifest.scripts]));
  const findings = [];
  for (const line of lines) {
    for (const command of extractScriptCommands(line.text)) {
      const nearest = nearestPackageManifest(line.file, manifests);
      if (nearest?.scripts.has(command)) continue;
      if (allScripts.has(command)) {
        findings.push(makeFinding("validity/script-out-of-scope", "warning", "validity", {
          discriminator: `${line.file}:${line.line}:${command}`,
          title: `Script \u201C${command}\u201D exists only in another package`,
          message: "The command is not defined in the nearest package.json for this instruction file.",
          file: line.file,
          line: line.line,
          evidence: line.text,
          suggestion: "Name the workspace/package directory explicitly or use the correct workspace command."
        }));
        continue;
      }
      findings.push(makeFinding("validity/missing-script", "error", "validity", {
        discriminator: `${line.file}:${line.line}:${command}`,
        title: `Script \u201C${command}\u201D does not exist`,
        message: "The instruction tells the agent to run a package script that is absent from every package.json scanned.",
        file: line.file,
        line: line.line,
        evidence: line.text,
        suggestion: `Add a \u201C${command}\u201D script or update the instruction to an existing command.`
      }));
    }
  }
  return findings;
}
function findMissingTaskTargets(files, lines) {
  const makeTargets = /* @__PURE__ */ new Set();
  const justTargets = /* @__PURE__ */ new Set();
  for (const file of files) {
    if (/(^|\/)Makefile$/i.test(file.path)) {
      for (const match of file.content.matchAll(/^([A-Za-z0-9_.-]+)\s*:(?![=])/gm)) if (match[1]) makeTargets.add(match[1]);
    }
    if (/(^|\/)Justfile$/i.test(file.path)) {
      for (const match of file.content.matchAll(/^([A-Za-z0-9_.-]+)(?:\s+[^:=]+)?\s*:(?![=])/gm)) if (match[1]) justTargets.add(match[1]);
    }
  }
  const findings = [];
  for (const line of lines) {
    for (const target of extractTaskTargets(line.text, "make")) {
      if (!makeTargets.size || makeTargets.has(target)) continue;
      findings.push(missingTaskFinding("make", target, line));
    }
    for (const target of extractTaskTargets(line.text, "just")) {
      if (!justTargets.size || justTargets.has(target)) continue;
      findings.push(missingTaskFinding("just", target, line));
    }
  }
  return findings;
}
function findMissingPaths(allPaths, lines) {
  const findings = [];
  for (const line of lines) {
    for (const reference of extractPathReferences(line.text)) {
      if (repositoryPathExists(allPaths, reference, line.file)) continue;
      findings.push(makeFinding("validity/missing-path", "warning", "validity", {
        discriminator: `${line.file}:${line.line}:${reference}`,
        title: `Referenced path \u201C${reference}\u201D was not found`,
        message: "The instruction references a file or directory that is not present in the repository tree.",
        file: line.file,
        line: line.line,
        evidence: line.text,
        suggestion: "Update the path, restore the referenced file, or remove the stale instruction."
      }));
    }
  }
  return findings.slice(0, 50);
}
function findDangerousInstructions(lines) {
  const findings = [];
  for (const line of lines) {
    for (const rule of dangerousRules) {
      if (!rule.pattern.test(line.text)) continue;
      if (rule.ruleId !== "security/no-confirmation" && isExplicitProhibition(line.text, rule.subject)) continue;
      findings.push(makeFinding(rule.ruleId, rule.severity, "security", {
        discriminator: `${line.file}:${line.line}`,
        title: rule.title,
        message: rule.message,
        file: line.file,
        line: line.line,
        evidence: line.text,
        suggestion: rule.suggestion
      }));
    }
  }
  return findings;
}
function applyConfigurationAndSuppressions(findings, fileByPath, config) {
  const active = [];
  let suppressed = 0;
  for (const finding of findings) {
    const setting = resolveRuleSetting(config, finding.ruleId, finding.severity);
    if (setting === "off" || isInlineSuppressed(finding, fileByPath.get(finding.file ?? "")?.content)) {
      suppressed += 1;
      continue;
    }
    active.push(setting === finding.severity ? finding : { ...finding, severity: setting });
  }
  return { active, suppressed };
}
function isInlineSuppressed(finding, content) {
  if (!content || !finding.file) return false;
  const wholeFileDirectives = [...content.matchAll(/<!--\s*agentlint-disable(?!-next-line)\s+([^>]+?)\s*-->/gi)];
  if (wholeFileDirectives.some((match) => directiveMatches(match[1] ?? "", finding.ruleId))) return true;
  if (!finding.line || finding.line <= 1) return false;
  const previousLine = content.split(/\r?\n/)[finding.line - 2] ?? "";
  const nextLineDirective = previousLine.match(/<!--\s*agentlint-disable-next-line\s+([^>]+?)\s*-->/i);
  return Boolean(nextLineDirective && directiveMatches(nextLineDirective[1] ?? "", finding.ruleId));
}
function directiveMatches(value, ruleId) {
  const patterns = value.split(/[\s,]+/).filter(Boolean);
  return patterns.some((pattern) => pattern === "*" || pattern === ruleId || pattern.endsWith("/*") && ruleId.startsWith(pattern.slice(0, -1)));
}
function makeFinding(ruleId, severity, category, input) {
  const { discriminator, ...rest } = input;
  const translations = translateFinding(ruleId, input);
  const fix = input.fix ? {
    ...input.fix,
    translations: input.fix.translations ?? {
      "en-US": input.fix.description,
      "zh-CN": translateFixDescription(ruleId, input.fix.description)
    }
  } : void 0;
  return {
    id: `${ruleId}/${stableHash(discriminator ?? `${input.file ?? "repo"}:${input.line ?? 0}:${input.title}`)}`,
    ruleId,
    severity,
    category,
    ...rest,
    fix,
    translations
  };
}
function localizeFinding(finding, locale) {
  const translated = finding.translations?.[locale];
  const fix = finding.fix ? {
    ...finding.fix,
    description: finding.fix.translations?.[locale] ?? finding.fix.description
  } : void 0;
  return translated ? {
    ...finding,
    title: translated.title,
    message: translated.message,
    suggestion: translated.suggestion,
    fix
  } : { ...finding, fix };
}
function gradeLabel(key, locale) {
  const labels = {
    excellent: ["Excellent", "\u4F18\u79C0"],
    good: ["Good", "\u826F\u597D"],
    "needs-work": ["Needs work", "\u9700\u8981\u6539\u8FDB"],
    critical: ["Critical", "\u95EE\u9898\u4E25\u91CD"]
  };
  return labels[key][locale === "zh-CN" ? 1 : 0];
}
function buildScopeGraph(files) {
  const nodes = files.map((file, index) => ({
    id: `scope-${index}`,
    path: file.path,
    label: file.label,
    scope: file.scope,
    kind: file.kind,
    tokens: file.estimatedTokens
  }));
  const edges = [];
  for (let left = 0; left < nodes.length; left += 1) {
    for (let right = left + 1; right < nodes.length; right += 1) {
      const a = nodes[left];
      const b = nodes[right];
      if (!a || !b) continue;
      const aDir = dirname(a.path);
      const bDir = dirname(b.path);
      if (aDir === "." && (a.scope === "repository" || a.scope === "\u6574\u4E2A\u4ED3\u5E93") && bDir !== "." || aDir !== "." && (b.path.startsWith(`${aDir}/`) || b.scope.startsWith(`${aDir}/`))) {
        edges.push({ from: a.id, to: b.id, relation: "inherits" });
      } else if (bDir === "." && (b.scope === "repository" || b.scope === "\u6574\u4E2A\u4ED3\u5E93") && aDir !== "." || bDir !== "." && (a.path.startsWith(`${bDir}/`) || a.scope.startsWith(`${bDir}/`))) {
        edges.push({ from: b.id, to: a.id, relation: "inherits" });
      } else if (a.scope === b.scope) {
        edges.push({ from: a.id, to: b.id, relation: a.kind === b.kind ? "overlaps" : "tool-variant" });
      }
    }
  }
  return { nodes, edges: edges.slice(0, 100) };
}
function translateFixDescription(ruleId, description) {
  if (ruleId === "consistency/package-manager") {
    const match = description.match(/^Replace (\w+) with (\w+) on this instruction line\.$/);
    if (match) return `\u5C06\u8BE5\u6307\u4EE4\u884C\u4E2D\u7684 ${match[1]} \u66FF\u6362\u4E3A ${match[2]}\u3002`;
  }
  return description;
}
function translateFinding(ruleId, input) {
  const en = { title: input.title, message: input.message, suggestion: input.suggestion };
  let zh = { title: input.title, message: input.message, suggestion: input.suggestion };
  const quoted = (value) => value.match(/[“\"]([^”\"]+)[”\"]/)?.[1] ?? "";
  switch (ruleId) {
    case "coverage/no-instruction-files":
      zh = { title: "\u672A\u53D1\u73B0\u7F16\u7A0B\u52A9\u624B\u6307\u4EE4\u6587\u4EF6", message: "\u4ED3\u5E93\u4E2D\u6CA1\u6709\u53EF\u8BC6\u522B\u7684 AI \u7F16\u7A0B\u52A9\u624B\u6307\u4EE4\u6587\u4EF6\u3002", suggestion: "\u6DFB\u52A0 AGENTS.md\uFF0C\u5E76\u5199\u660E\u6784\u5EFA\u3001\u6D4B\u8BD5\u3001\u67B6\u6784\u548C\u5B89\u5168\u8981\u6C42\u3002" };
      break;
    case "coverage/empty-instruction-file":
      zh = { title: "\u6307\u4EE4\u6587\u4EF6\u6CA1\u6709\u53EF\u7528\u5185\u5BB9", message: "\u8BE5\u6587\u4EF6\u4E3A\u7A7A\uFF0C\u6216\u4EC5\u5305\u542B\u6807\u9898\u3001\u6CE8\u91CA\u548C\u6587\u4EF6\u5934\u5143\u6570\u636E\u3002", suggestion: "\u6DFB\u52A0\u7B80\u6D01\u4E14\u53EF\u9A8C\u8BC1\u7684\u9879\u76EE\u6307\u4EE4\uFF0C\u6216\u5220\u9664\u8FD9\u4E2A\u672A\u4F7F\u7528\u7684\u6587\u4EF6\u3002" };
      break;
    case "efficiency/file-too-large": {
      const nums = input.message.match(/(\d+).+?(\d+)-token/);
      zh = { title: "\u6307\u4EE4\u6587\u4EF6\u5360\u7528\u8FC7\u591A\u4E0A\u4E0B\u6587", message: `\u8BE5\u6587\u4EF6\u4F30\u7B97\u7EA6 ${nums?.[1] ?? "\u8F83\u591A"} \u4E2A\u4EE4\u724C\uFF0C\u8D85\u8FC7\u914D\u7F6E\u7684 ${nums?.[2] ?? ""} \u4E2A\u4EE4\u724C\u4E0A\u9650\u3002`, suggestion: "\u5C06\u4EFB\u52A1\u76F8\u5173\u5185\u5BB9\u62C6\u5230\u4F5C\u7528\u57DF\u89C4\u5219\u3001\u6280\u80FD\u6587\u4EF6\u6216\u5F15\u7528\u6587\u6863\u4E2D\u3002" };
      break;
    }
    case "efficiency/claude-line-count":
      zh = { title: "CLAUDE.md \u8D85\u51FA\u5EFA\u8BAE\u5DE5\u4F5C\u957F\u5EA6", message: "\u59CB\u7EC8\u52A0\u8F7D\u7684\u6307\u4EE4\u6587\u4EF6\u8FC7\u957F\u4F1A\u5360\u7528\u4E0A\u4E0B\u6587\uFF0C\u5E76\u53EF\u80FD\u964D\u4F4E\u89C4\u5219\u9075\u5FAA\u7387\u3002", suggestion: "\u5C3D\u91CF\u63A7\u5236\u5728 200 \u884C\u4EE5\u5185\uFF0C\u5E76\u5C06\u4E13\u9898\u5185\u5BB9\u79FB\u5165 .claude/rules/\u3002" };
      break;
    case "validity/frontmatter-unclosed":
      zh = { title: "YAML \u6587\u4EF6\u5934\u5143\u6570\u636E\u672A\u95ED\u5408", message: "\u6587\u4EF6\u4EE5 --- \u5F00\u59CB\uFF0C\u4F46\u6CA1\u6709\u627E\u5230\u5BF9\u5E94\u7684\u7ED3\u675F ---\u3002", suggestion: "\u5728 Markdown \u6307\u4EE4\u524D\u6DFB\u52A0\u7ED3\u675F\u7684 --- \u884C\u3002" };
      break;
    case "coverage/cursor-legacy-format":
      zh = { title: "\u68C0\u6D4B\u5230\u65E7\u7248 .cursorrules \u683C\u5F0F", message: "Cursor \u4ECD\u517C\u5BB9\u8BE5\u6587\u4EF6\uFF0C\u4F46 .cursor/rules \u4E2D\u7684\u9879\u76EE\u89C4\u5219\u652F\u6301\u66F4\u597D\u7684\u4F5C\u7528\u57DF\u548C\u5143\u6570\u636E\u3002", suggestion: "\u5C06\u5185\u5BB9\u8FC1\u79FB\u4E3A\u4E00\u4E2A\u6216\u591A\u4E2A .cursor/rules/*.mdc \u6587\u4EF6\u3002" };
      break;
    case "coverage/windsurf-legacy-format":
      zh = { title: "\u68C0\u6D4B\u5230\u65E7\u7248 Windsurf \u89C4\u5219\u6587\u4EF6", message: ".windsurf/rules/ \u4E2D\u7684\u5DE5\u4F5C\u533A\u89C4\u5219\u66F4\u5BB9\u6613\u8BBE\u7F6E\u4F5C\u7528\u57DF\u548C\u7EF4\u62A4\u3002", suggestion: "\u5C06\u5185\u5BB9\u62C6\u5206\u5230 .windsurf/rules/*.md \u6587\u4EF6\u3002" };
      break;
    case "validity/cursor-frontmatter":
      zh = { title: "Cursor MDC \u89C4\u5219\u7F3A\u5C11\u6587\u4EF6\u5934\u5143\u6570\u636E", message: "Cursor \u9879\u76EE\u89C4\u5219\u4F7F\u7528 YAML \u6587\u4EF6\u5934\u5143\u6570\u636E\u63A7\u5236\u63CF\u8FF0\u3001\u8DEF\u5F84\u5339\u914D\u8303\u56F4\u548C\u6FC0\u6D3B\u65B9\u5F0F\u3002", suggestion: "\u6839\u636E\u9700\u8981\u6DFB\u52A0 description\u3001globs \u548C alwaysApply \u5B57\u6BB5\u3002" };
      break;
    case "validity/cursor-always-apply":
      zh = { title: "Cursor alwaysApply \u5FC5\u987B\u4E3A true \u6216 false", message: `\u5F53\u524D\u503C\u4E3A\u201C${quoted(input.message)}\u201D\u3002`, suggestion: "\u5C06 alwaysApply \u8BBE\u7F6E\u4E3A true \u6216 false\u3002" };
      break;
    case "coverage/cursor-activation":
      zh = { title: "Cursor \u89C4\u5219\u6CA1\u6709\u660E\u786E\u6FC0\u6D3B\u65B9\u5F0F", message: "\u8BE5\u89C4\u5219\u6CA1\u6709 description\u3001globs\uFF0C\u4E5F\u6CA1\u6709 alwaysApply: true\u3002", suggestion: "\u5B9A\u4E49\u89C4\u5219\u4F55\u65F6\u9644\u52A0\uFF0C\u907F\u514D\u5B83\u88AB\u9759\u9ED8\u5FFD\u7565\u3002" };
      break;
    case "validity/copilot-apply-to":
      zh = { title: "Copilot \u8DEF\u5F84\u6307\u4EE4\u7F3A\u5C11 applyTo", message: "GitHub \u8DEF\u5F84\u7EA7\u6307\u4EE4\u6587\u4EF6\u9700\u8981\u5728 YAML \u6587\u4EF6\u5934\u5143\u6570\u636E\u4E2D\u8BBE\u7F6E applyTo \u8DEF\u5F84\u5339\u914D\u8303\u56F4\u3002", suggestion: '\u6DFB\u52A0\u4F8B\u5982 applyTo: "src/**/*.ts" \u7684\u6587\u4EF6\u5934\u5143\u6570\u636E\u3002' };
      break;
    case "validity/copilot-agent-description":
      zh = { title: "Copilot \u81EA\u5B9A\u4E49\u52A9\u624B\u7F3A\u5C11\u63CF\u8FF0", message: "\u81EA\u5B9A\u4E49\u52A9\u624B\u914D\u7F6E\u4F7F\u7528 YAML \u6587\u4EF6\u5934\u5143\u6570\u636E\uFF0C\u5E76\u9700\u8981\u901A\u8FC7 description \u8BF4\u660E\u7528\u9014\u3002", suggestion: "\u5728\u6587\u4EF6\u5934\u5143\u6570\u636E\u4E2D\u6DFB\u52A0\u7B80\u6D01\u7684 description\u3002" };
      break;
    case "coverage/no-test-guidance":
      zh = { title: "\u7F3A\u5C11\u6D4B\u8BD5\u8BF4\u660E", message: "\u4ED3\u5E93\u63D0\u4F9B\u4E86\u6D4B\u8BD5\u76F8\u5173\u811A\u672C\uFF0C\u4F46\u7F16\u7A0B\u52A9\u624B\u6307\u4EE4\u4E2D\u6CA1\u6709\u8BF4\u660E\u3002", suggestion: "\u5199\u660E\u6700\u5FEB\u7684\u76F8\u5173\u6D4B\u8BD5\u547D\u4EE4\uFF0C\u4EE5\u53CA\u4F55\u65F6\u5FC5\u987B\u8FD0\u884C\u5B8C\u6574\u6D4B\u8BD5\u3002" };
      break;
    case "coverage/no-build-guidance":
      zh = { title: "\u7F3A\u5C11\u6784\u5EFA\u6216\u7C7B\u578B\u68C0\u67E5\u8BF4\u660E", message: "\u4ED3\u5E93\u63D0\u4F9B\u4E86\u6784\u5EFA\u6216\u7C7B\u578B\u68C0\u67E5\u811A\u672C\uFF0C\u4F46 Agent \u6307\u4EE4\u4E2D\u6CA1\u6709\u8BF4\u660E\u3002", suggestion: "\u544A\u8BC9\u7F16\u7A0B\u52A9\u624B\u5982\u4F55\u9A8C\u8BC1\u9879\u76EE\u80FD\u591F\u6210\u529F\u6784\u5EFA\u6216\u901A\u8FC7\u7C7B\u578B\u68C0\u67E5\u3002" };
      break;
    case "coverage/no-lint-guidance":
      zh = { title: "\u7F3A\u5C11\u4EE3\u7801\u68C0\u67E5\u6216\u683C\u5F0F\u5316\u8BF4\u660E", message: "\u4ED3\u5E93\u63D0\u4F9B\u4E86 lint \u6216\u683C\u5F0F\u5316\u811A\u672C\uFF0C\u4F46 Agent \u6307\u4EE4\u4E2D\u6CA1\u6709\u8BF4\u660E\u3002", suggestion: "\u5199\u660E\u9879\u76EE\u7684\u4EE3\u7801\u68C0\u67E5\u6216\u683C\u5F0F\u5316\u547D\u4EE4\uFF0C\u4FDD\u8BC1\u751F\u6210\u7684\u6539\u52A8\u7B26\u5408\u4ED3\u5E93\u89C4\u8303\u3002" };
      break;
    case "efficiency/duplicate-instruction": {
      const count = input.message.match(/appears (\d+) times/)?.[1] ?? "\u591A";
      const locations = input.message.split(": ").slice(1).join(": ");
      zh = { title: "\u591A\u4E2A\u7F16\u7A0B\u52A9\u624B\u6587\u4EF6\u4E2D\u5B58\u5728\u5B8C\u5168\u91CD\u590D\u7684\u6307\u4EE4", message: `\u540C\u4E00\u6761\u6307\u4EE4\u51FA\u73B0\u4E86 ${count} \u6B21\uFF1A${locations}`, suggestion: "\u4FDD\u7559\u4E00\u4EFD\u6743\u5A01\u89C4\u5219\uFF0C\u5E76\u5728\u652F\u6301\u65F6\u5BFC\u5165\u6216\u751F\u6210\u4E0D\u540C\u5DE5\u5177\u7684\u7248\u672C\u3002" };
      break;
    }
    case "efficiency/near-duplicate-instruction": {
      const pct = input.message.match(/(\d+)%/)?.[1] ?? "\u9AD8\u5EA6";
      const locations = input.message.split(": ").slice(1).join(": ");
      zh = { title: "\u9AD8\u5EA6\u76F8\u4F3C\u7684\u6307\u4EE4\u53EF\u80FD\u6D6A\u8D39\u4E0A\u4E0B\u6587", message: `\u8FD9\u4E9B\u89C4\u5219\u76F8\u4F3C\u5EA6\u4E3A ${pct}%\uFF1A${locations}`, suggestion: "\u5408\u5E76\u516C\u5171\u90E8\u5206\uFF0C\u53EA\u4FDD\u7559\u5DE5\u5177\u6216\u4F5C\u7528\u57DF\u7279\u6709\u7684\u5DEE\u5F02\u3002" };
      break;
    }
    case "consistency/contradictory-instructions": {
      const subject = input.title.replace(/^Conflicting guidance about /, "");
      zh = { title: `\u5173\u4E8E ${subject} \u7684\u89C4\u5219\u4E92\u76F8\u51B2\u7A81`, message: `\u4E00\u6761\u6307\u4EE4\u8981\u6C42\u6216\u63A8\u8350 ${subject}\uFF0C\u53E6\u4E00\u6761\u5374\u8981\u6C42\u7F16\u7A0B\u52A9\u624B\u907F\u514D\u5B83\u3002`, suggestion: "\u9009\u62E9\u7EDF\u4E00\u7684\u4ED3\u5E93\u7B56\u7565\uFF0C\u6216\u5C06\u89C4\u5219\u9650\u5236\u5230\u5404\u81EA\u9002\u7528\u7684\u76EE\u5F55\u3002" };
      break;
    }
    case "consistency/multiple-package-managers": {
      const managers = input.message.match(/artifacts for (.+)\.$/)?.[1] ?? "\u591A\u4E2A\u5305\u7BA1\u7406\u5668";
      const root = input.message.startsWith("The repository root") ? "\u4ED3\u5E93\u6839\u76EE\u5F55" : input.message.split(" declares")[0];
      zh = { title: "\u540C\u4E00\u4F5C\u7528\u57DF\u68C0\u6D4B\u5230\u591A\u4E2A\u5305\u7BA1\u7406\u5668", message: `${root} \u540C\u65F6\u5B58\u5728 ${managers} \u7684\u76F8\u5173\u6587\u4EF6\u6216\u58F0\u660E\u3002`, suggestion: "\u53EA\u4FDD\u7559\u4E00\u4E2A\u6743\u5A01 packageManager \u5B57\u6BB5\u548C\u9501\u6587\u4EF6\uFF0C\u6216\u660E\u786E\u8BF4\u660E\u5D4C\u5957\u5DE5\u4F5C\u533A\u4F8B\u5916\u3002" };
      break;
    }
    case "consistency/package-manager": {
      const match = input.message.match(/uses (\w+).+indicates (\w+)/);
      zh = { title: "\u5305\u7BA1\u7406\u5668\u6307\u4EE4\u4E0E\u4ED3\u5E93\u5143\u6570\u636E\u51B2\u7A81", message: `\u8BE5\u6307\u4EE4\u4F7F\u7528 ${match?.[1] ?? "\u53E6\u4E00\u79CD\u5305\u7BA1\u7406\u5668"}\uFF0C\u4F46\u6700\u8FD1\u7684\u9501\u6587\u4EF6\u6216 packageManager \u5B57\u6BB5\u8868\u660E\u5E94\u4F7F\u7528 ${match?.[2] ?? "\u4ED3\u5E93\u6307\u5B9A\u7684\u5305\u7BA1\u7406\u5668"}\u3002`, suggestion: `\u6539\u7528 ${match?.[2] ?? "\u6B63\u786E\u5305\u7BA1\u7406\u5668"} \u7684\u7B49\u4EF7\u547D\u4EE4\uFF0C\u6216\u8BF4\u660E\u8BE5\u4F5C\u7528\u57DF\u4E3A\u4F55\u4E0D\u540C\u3002` };
      break;
    }
    case "validity/script-out-of-scope": {
      const command = quoted(input.title);
      zh = { title: `\u811A\u672C\u201C${command}\u201D\u53EA\u5B58\u5728\u4E8E\u5176\u4ED6\u5305`, message: "\u6700\u8FD1\u7684 package.json \u4E2D\u6CA1\u6709\u5B9A\u4E49\u8BE5\u547D\u4EE4\u3002", suggestion: "\u660E\u786E\u5199\u51FA\u5DE5\u4F5C\u533A\u6216\u5305\u76EE\u5F55\uFF0C\u6216\u8005\u4F7F\u7528\u6B63\u786E\u7684 workspace \u547D\u4EE4\u3002" };
      break;
    }
    case "validity/missing-script": {
      const command = quoted(input.title);
      zh = { title: `\u811A\u672C\u201C${command}\u201D\u4E0D\u5B58\u5728`, message: "\u6307\u4EE4\u8981\u6C42\u7F16\u7A0B\u52A9\u624B\u8FD0\u884C\u4E00\u4E2A\u5728\u6240\u6709\u5DF2\u626B\u63CF package.json \u4E2D\u90FD\u4E0D\u5B58\u5728\u7684\u811A\u672C\u3002", suggestion: `\u6DFB\u52A0\u201C${command}\u201D\u811A\u672C\uFF0C\u6216\u5C06\u6307\u4EE4\u6539\u4E3A\u73B0\u6709\u547D\u4EE4\u3002` };
      break;
    }
    case "validity/missing-task-target": {
      const target = quoted(input.title);
      zh = { title: `\u4EFB\u52A1\u76EE\u6807\u201C${target}\u201D\u4E0D\u5B58\u5728`, message: "\u6307\u4EE4\u5F15\u7528\u4E86\u4E00\u4E2A\u5728\u5BF9\u5E94\u4EFB\u52A1\u6587\u4EF6\u4E2D\u6CA1\u6709\u5B9A\u4E49\u7684\u76EE\u6807\u3002", suggestion: "\u6DFB\u52A0\u8BE5\u76EE\u6807\uFF0C\u6216\u628A\u6307\u4EE4\u6539\u6210\u73B0\u6709\u4EFB\u52A1\u3002" };
      break;
    }
    case "validity/missing-path": {
      const ref = quoted(input.title);
      zh = { title: `\u5F15\u7528\u7684\u8DEF\u5F84\u201C${ref}\u201D\u4E0D\u5B58\u5728`, message: "\u6307\u4EE4\u5F15\u7528\u7684\u6587\u4EF6\u6216\u76EE\u5F55\u6CA1\u6709\u51FA\u73B0\u5728\u4ED3\u5E93\u6811\u4E2D\u3002", suggestion: "\u66F4\u65B0\u8DEF\u5F84\u3001\u6062\u590D\u88AB\u5F15\u7528\u7684\u6587\u4EF6\uFF0C\u6216\u5220\u9664\u8FC7\u671F\u6307\u4EE4\u3002" };
      break;
    }
    case "validity/config-invalid":
      zh = { title: "AgentLint \u914D\u7F6E\u65E0\u6548", message: translateConfigDetails(input.message), suggestion: "\u4FEE\u590D .agentlint.json\uFF0C\u6216\u5220\u9664\u65E0\u6548\u914D\u7F6E\u9879\u3002" };
      break;
    case "security/force-push":
      zh = { title: "\u5371\u9669\u7684\u5F3A\u5236\u63A8\u9001\u6307\u4EE4", message: "\u8BE5\u6307\u4EE4\u5141\u8BB8\u4F7F\u7528\u65E0\u6761\u4EF6\u5F3A\u63A8\u6539\u5199\u8FDC\u7A0B Git \u5386\u53F2\u3002", suggestion: "\u8981\u6C42\u7528\u6237\u660E\u786E\u786E\u8BA4\uFF0C\u5E76\u4F18\u5148\u5728\u975E\u4FDD\u62A4\u5206\u652F\u4F7F\u7528 --force-with-lease\u3002" };
      break;
    case "security/force-with-lease":
      zh = { title: "\u6539\u5199\u8FDC\u7A0B\u5386\u53F2\u524D\u5E94\u8981\u6C42\u786E\u8BA4", message: "\u5373\u4F7F\u4F7F\u7528 --force-with-lease\uFF0C\u4E5F\u4F1A\u6539\u5199\u8FDC\u7A0B\u5386\u53F2\uFF0C\u4E0D\u5E94\u9759\u9ED8\u6267\u884C\u3002", suggestion: "\u660E\u786E\u89C4\u5B9A\u6539\u5199\u8FDC\u7A0B\u5206\u652F\u524D\u5FC5\u987B\u8BE2\u95EE\u7528\u6237\u3002" };
      break;
    case "security/destructive-shell":
      zh = { title: "\u5371\u9669\u7684\u9012\u5F52\u5220\u9664\u6307\u4EE4", message: "\u8BE5\u6307\u4EE4\u5305\u542B\u8303\u56F4\u8FC7\u5927\u7684\u9012\u5F52\u5220\u9664\u547D\u4EE4\u3002", suggestion: "\u4EC5\u5220\u9664\u660E\u786E\u547D\u540D\u7684\u4E34\u65F6\u76EE\u5F55\uFF0C\u5E76\u8981\u6C42\u7528\u6237\u786E\u8BA4\u3002" };
      break;
    case "security/pipe-to-shell":
      zh = { title: "\u8FDC\u7A0B\u811A\u672C\u88AB\u76F4\u63A5\u4F20\u7ED9 Shell \u6267\u884C", message: "\u672A\u7ECF\u5BA1\u67E5\u5C31\u6267\u884C\u4E0B\u8F7D\u5185\u5BB9\u4F1A\u5E26\u6765\u4F9B\u5E94\u94FE\u98CE\u9669\u3002", suggestion: "\u5148\u4E0B\u8F7D\u5230\u6587\u4EF6\uFF0C\u9A8C\u8BC1\u6765\u6E90\u6216\u6821\u9A8C\u503C\u5E76\u68C0\u67E5\u5185\u5BB9\uFF0C\u518D\u660E\u786E\u6267\u884C\u3002" };
      break;
    case "security/hard-reset":
      zh = { title: "\u786C\u91CD\u7F6E\u53EF\u80FD\u4E22\u5931\u5DE5\u4F5C\u5185\u5BB9", message: "\u8BE5\u6307\u4EE4\u53EF\u80FD\u6C38\u4E45\u4E22\u5F03\u5C1A\u672A\u63D0\u4EA4\u7684\u4FEE\u6539\u3002", suggestion: "\u5148\u521B\u5EFA\u5907\u4EFD\u5206\u652F\u6216 stash\uFF0C\u5E76\u5728\u91CD\u7F6E\u524D\u8BE2\u95EE\u7528\u6237\u3002" };
      break;
    case "security/no-verify":
      zh = { title: "\u7ED5\u8FC7\u4E86\u9A8C\u8BC1\u94A9\u5B50", message: "\u8BE5\u6307\u4EE4\u4F1A\u8DF3\u8FC7\u4ED3\u5E93\u7684\u5B89\u5168\u6216\u8D28\u91CF\u94A9\u5B50\u3002", suggestion: "\u4FEE\u590D\u94A9\u5B50\u5931\u8D25\u539F\u56E0\uFF0C\u4E0D\u8981\u5173\u95ED\u9A8C\u8BC1\uFF1B\u7D27\u6025\u4F8B\u5916\u5FC5\u987B\u9650\u5236\u8303\u56F4\u5E76\u8BB0\u5F55\u539F\u56E0\u3002" };
      break;
    case "security/chmod-777":
      zh = { title: "\u8BF7\u6C42\u4E86\u6240\u6709\u4EBA\u53EF\u5199\u6743\u9650", message: "chmod 777 \u4F1A\u5411\u672C\u673A\u6240\u6709\u7528\u6237\u548C\u8FDB\u7A0B\u6388\u4E88\u5199\u6743\u9650\u3002", suggestion: "\u4F7F\u7528\u6EE1\u8DB3\u9700\u6C42\u7684\u6700\u5C0F\u5C5E\u4E3B/\u7528\u6237\u7EC4\u6743\u9650\uFF0C\u4F8B\u5982 755 \u6216 750\u3002" };
      break;
    case "security/tls-disabled":
      zh = { title: "TLS \u8BC1\u4E66\u9A8C\u8BC1\u88AB\u5173\u95ED", message: "\u5173\u95ED\u8BC1\u4E66\u9A8C\u8BC1\u4F1A\u4F7F\u4E0B\u8F7D\u548C\u63A5\u53E3\u6D41\u91CF\u5BB9\u6613\u88AB\u4E2D\u95F4\u4EBA\u62E6\u622A\u3002", suggestion: "\u5B89\u88C5\u6B63\u786E\u7684 CA \u8BC1\u4E66\uFF0C\u6216\u914D\u7F6E\u53D7\u4FE1\u4EFB\u7684\u5F00\u53D1\u4EE3\u7406\u3002" };
      break;
    case "security/broad-sudo":
      zh = { title: "\u8FC7\u4E8E\u5BBD\u6CDB\u7684\u63D0\u6743\u6267\u884C\u6307\u4EE4", message: "\u8BE5\u89C4\u5219\u9F13\u52B1\u4F7F\u7528\u64CD\u4F5C\u7CFB\u7EDF\u9AD8\u6743\u9650\u6267\u884C\u547D\u4EE4\u3002", suggestion: "\u5199\u660E\u51C6\u786E\u7684\u63D0\u6743\u64CD\u4F5C\u548C\u539F\u56E0\uFF0C\u5E76\u8981\u6C42\u7528\u6237\u786E\u8BA4\u3002" };
      break;
    case "security/no-confirmation":
      zh = { title: "\u6307\u4EE4\u7981\u6B62\u8BE2\u95EE\u7528\u6237\u786E\u8BA4", message: "\u5BF9\u4E8E\u7834\u574F\u6027\u64CD\u4F5C\u6216\u5916\u90E8\u64CD\u4F5C\uFF0C\u65E0\u786E\u8BA4\u7684\u81EA\u4E3B\u6267\u884C\u98CE\u9669\u5F88\u9AD8\u3002", suggestion: "\u4EC5\u5141\u8BB8\u53EF\u9006\u7684\u672C\u5730\u64CD\u4F5C\u9759\u9ED8\u6267\u884C\uFF0C\u5176\u4ED6\u60C5\u51B5\u5FC5\u987B\u786E\u8BA4\u3002" };
      break;
    case "security/production-data":
      zh = { title: "\u5141\u8BB8\u4FEE\u6539\u751F\u4EA7\u6570\u636E", message: "\u8BE5\u6307\u4EE4\u4F3C\u4E4E\u6388\u6743\u4FEE\u6539\u751F\u4EA7\u73AF\u5883\u6570\u636E\u3002", suggestion: "\u9ED8\u8BA4\u7981\u6B62\u751F\u4EA7\u5199\u5165\uFF0C\u5E76\u8981\u6C42\u4F7F\u7528\u72EC\u7ACB\u3001\u53EF\u5BA1\u8BA1\u7684\u6D41\u7A0B\u3002" };
      break;
    case "security/secret-exposure":
      zh = { title: "\u6307\u4EE4\u53EF\u80FD\u6CC4\u9732\u5BC6\u94A5", message: "\u8BE5\u89C4\u5219\u4F3C\u4E4E\u5141\u8BB8\u6253\u5370\u3001\u63D0\u4EA4\u6216\u4F20\u8F93\u5BC6\u94A5\u7B49\u654F\u611F\u5185\u5BB9\u3002", suggestion: "\u4E0D\u8981\u628A\u5BC6\u94A5\u5199\u5165\u65E5\u5FD7\u6216\u7248\u672C\u5E93\uFF0C\u4F7F\u7528\u8131\u654F\u548C\u5BC6\u94A5\u7BA1\u7406\u670D\u52A1\u3002" };
      break;
    case "security/skip-validation":
      zh = { title: "\u660E\u786E\u8DF3\u8FC7\u4E86\u8D28\u91CF\u9A8C\u8BC1", message: "\u8DF3\u8FC7\u6D4B\u8BD5\u3001lint \u6216\u7C7B\u578B\u68C0\u67E5\u53EF\u80FD\u9690\u85CF\u56DE\u5F52\u95EE\u9898\u3002", suggestion: "\u5199\u660E\u6700\u5FEB\u7684\u76F8\u5173\u9A8C\u8BC1\u547D\u4EE4\uFF0C\u800C\u4E0D\u662F\u5173\u95ED\u9A8C\u8BC1\u3002" };
      break;
  }
  return { "en-US": en, "zh-CN": zh };
}
function translateConfigDetails(details) {
  if (details.includes("maxInstructionTokens")) return "maxInstructionTokens \u5FC5\u987B\u662F\u4E00\u4E2A\u4E0D\u5C0F\u4E8E 200 \u7684\u6570\u5B57\u3002";
  if (details.includes("duplicateSimilarity")) return "duplicateSimilarity \u5FC5\u987B\u4F4D\u4E8E 0.5 \u5230 1 \u4E4B\u95F4\u3002";
  if (details.includes("rules must")) return "rules \u5FC5\u987B\u662F\u5C06\u89C4\u5219 ID \u6620\u5C04\u5230 error\u3001warning\u3001info \u6216 off \u7684\u5BF9\u8C61\u3002";
  return `\u914D\u7F6E JSON \u65E0\u6548\uFF1A${details}`;
}
function describeScope(file, locale) {
  const kind = detectInstructionKind(file.path);
  const frontmatter = parseFrontmatter(file.content);
  if (!frontmatter.hasFrontmatter || !frontmatter.closed) return null;
  if (kind === "copilot") return scalar(frontmatter.data.applyTo) ?? null;
  if (kind === "claude-rule") {
    const paths = frontmatter.data.paths;
    return Array.isArray(paths) ? paths.join(", ") : scalar(paths) ?? (locale === "zh-CN" ? "\u6574\u4E2A\u4ED3\u5E93" : "repository");
  }
  if (kind === "cursor") {
    const globs = scalar(frontmatter.data.globs);
    if (globs) return globs;
    if (scalar(frontmatter.data.alwaysApply) === "true") return locale === "zh-CN" ? "\u59CB\u7EC8\u751F\u6548" : "always";
    return scalar(frontmatter.data.description) ? locale === "zh-CN" ? "\u7531\u7F16\u7A0B\u52A9\u624B\u6309\u63CF\u8FF0\u9009\u62E9" : "agent-selected" : null;
  }
  if (kind === "cline" || kind === "windsurf") {
    return scalar(frontmatter.data.globs) ?? scalar(frontmatter.data.trigger) ?? null;
  }
  return null;
}
function scalar(value) {
  if (Array.isArray(value)) return value.join(", ") || null;
  return value?.trim() || null;
}
function collectPackageScripts(files) {
  return new Set(collectPackageManifests(files).flatMap((manifest) => [...manifest.scripts]));
}
function collectPackageManifests(files) {
  const manifests = [];
  for (const file of files.filter((item) => /(^|\/)package\.json$/i.test(item.path))) {
    try {
      const parsed = JSON.parse(file.content);
      manifests.push({ directory: directoryOf(file.path), scripts: new Set(Object.keys(parsed.scripts ?? {})) });
    } catch {
    }
  }
  return manifests;
}
function nearestPackageManifest(file, manifests) {
  return manifests.filter((manifest) => isAncestor(manifest.directory, directoryOf(file))).sort((a, b) => b.directory.length - a.directory.length)[0];
}
function collectManagerSources(files) {
  const output = [];
  for (const file of files) {
    const base = basename(file.path);
    for (const [manager, lockfiles] of Object.entries(managerLockfiles)) {
      if (lockfiles.includes(base)) output.push({ directory: directoryOf(file.path), manager });
    }
    if (base !== "package.json" || !file.content) continue;
    try {
      const parsed = JSON.parse(file.content);
      const manager = parsed.packageManager?.match(/^(npm|pnpm|yarn|bun)@/i)?.[1]?.toLowerCase();
      if (manager) output.push({ directory: directoryOf(file.path), manager });
    } catch {
    }
  }
  return output;
}
function nearestManagerForFile(file, sources) {
  const directory = directoryOf(file);
  const candidates = sources.filter((source) => isAncestor(source.directory, directory));
  if (!candidates.length) return null;
  const nearestLength = Math.max(...candidates.map((source) => source.directory.length));
  const managers = new Set(candidates.filter((source) => source.directory.length === nearestLength).map((source) => source.manager));
  return managers.size === 1 ? [...managers][0] ?? null : null;
}
function detectManagerCommand(text) {
  const match = text.match(/(?:^|[`\s;&|])(npm|pnpm|yarn|bun)(?=\s|`|$)/i);
  return match?.[1]?.toLowerCase() ?? null;
}
function replaceManager(raw, from, to) {
  return raw.replace(new RegExp(`\\b${escapeRegExp(from)}\\b`, "gi"), to);
}
function extractScriptCommands(text) {
  const commands = /* @__PURE__ */ new Set();
  const builtins = /* @__PURE__ */ new Set(["add", "install", "remove", "uninstall", "update", "upgrade", "exec", "dlx", "x", "run", "init", "create", "publish", "pack"]);
  const inspect = (candidate, allowShorthand) => {
    for (const match of candidate.matchAll(/\bnpm\s+run\s+([\w:-]+)/gi)) if (match[1]) commands.add(match[1]);
    for (const match of candidate.matchAll(/\bnpm\s+(test|start|stop|restart)\b/gi)) if (match[1]) commands.add(match[1].toLowerCase());
    if (!allowShorthand) return;
    for (const match of candidate.matchAll(/\b(pnpm|yarn|bun)\s+(?:run\s+)?([\w:-]+)/gi)) {
      const command = match[2]?.toLowerCase();
      if (command && !builtins.has(command)) commands.add(command);
    }
  };
  for (const match of text.matchAll(/`([^`]+)`/g)) if (match[1]) inspect(match[1], true);
  inspect(text.replace(/`[^`]+`/g, ""), false);
  for (const match of text.matchAll(/\b(?:run|execute|运行|执行)\s+((?:pnpm|yarn|bun)\s+(?:run\s+)?[\w:-]+)/gi)) {
    if (match[1]) inspect(match[1], true);
  }
  return [...commands];
}
function extractTaskTargets(text, command) {
  const targets = /* @__PURE__ */ new Set();
  for (const match of text.matchAll(new RegExp(`(?:^|[\\s\`])${command}\\s+([A-Za-z0-9_.-]+)`, "gi"))) {
    if (match[1] && !["-f", "--file", "--help"].includes(match[1])) targets.add(match[1]);
  }
  return [...targets];
}
function missingTaskFinding(command, target, line) {
  return makeFinding("validity/missing-task-target", "error", "validity", {
    discriminator: `${line.file}:${line.line}:${command}:${target}`,
    title: `${command} target \u201C${target}\u201D does not exist`,
    message: `The instruction references a ${command} target that was not found in the repository's task file.`,
    file: line.file,
    line: line.line,
    evidence: line.text,
    suggestion: `Add the target or update the instruction to a valid ${command} command.`
  });
}
function instructionPolarity(text, subject) {
  const escaped = escapeRegExp(subject);
  const negative = new RegExp(`(?:do not|don't|never|must not|avoid|\u7981\u6B62|\u4E0D\u8981|\u4E0D\u5F97|\u907F\u514D).{0,35}${escaped}|${escaped}.{0,20}(?:is forbidden|\u7981\u6B62\u4F7F\u7528)`, "i");
  if (negative.test(text)) return "negative";
  const positive = new RegExp(`(?:use|prefer|must use|always use|adopt|\u4F7F\u7528|\u91C7\u7528|\u4F18\u5148).{0,35}${escaped}|${escaped}.{0,20}(?:is required|\u5FC5\u9700|\u5FC5\u987B)`, "i");
  return positive.test(text) ? "positive" : null;
}
function isExplicitProhibition(text, subject) {
  const match = subject.exec(text);
  if (!match || match.index < 0) return false;
  const prefix = text.slice(Math.max(0, match.index - 60), match.index);
  return /(?:do not|don't|never|must not|forbid|prohibit|禁止|不要|不得|严禁|不可)\s*$/i.test(prefix) || /(?:do not|don't|never|must not|forbid|prohibit|禁止|不要|不得|严禁|不可).{0,45}$/i.test(prefix);
}
function calculateMetrics(findings, instructionFileCount) {
  const categories = ["coverage", "consistency", "validity", "security", "efficiency"];
  const metrics = {};
  for (const category of categories) {
    const base = category === "coverage" && instructionFileCount === 0 ? 35 : 100;
    const categoryFindings = findings.filter((finding) => finding.category === category);
    const penalty = categoryFindings.reduce((sum, finding) => sum + (finding.severity === "error" ? 22 : finding.severity === "warning" ? 10 : 4), 0);
    metrics[category] = Math.max(0, Math.min(100, base - penalty));
  }
  return metrics;
}
function countDuplicateLines(lines) {
  const counts = /* @__PURE__ */ new Map();
  for (const line of lines) {
    if (line.normalized.length < 16) continue;
    counts.set(line.normalized, (counts.get(line.normalized) ?? 0) + 1);
  }
  return [...counts.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
}
function estimateAvoidableTokens(lines) {
  const seen = /* @__PURE__ */ new Set();
  let characters = 0;
  for (const line of lines) {
    if (line.normalized.length < 16) continue;
    if (seen.has(line.normalized)) characters += line.text.length;
    seen.add(line.normalized);
  }
  return Math.ceil(characters / 4);
}
function compareFindings(a, b) {
  const rank = { error: 0, warning: 1, info: 2 };
  return rank[a.severity] - rank[b.severity] || a.category.localeCompare(b.category) || (a.file ?? "").localeCompare(b.file ?? "") || (a.line ?? 0) - (b.line ?? 0);
}
function directoryOf(file) {
  const directory = dirname(file);
  return directory === "." ? "." : directory;
}
function isAncestor(ancestor, directory) {
  return ancestor === "." || directory === ancestor || directory.startsWith(`${ancestor}/`);
}
function validNumber(value, minimum, maximum) {
  return typeof value === "number" && Number.isFinite(value) && value >= minimum && value <= maximum;
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function stableHash(value) {
  let hash2 = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash2 ^= value.charCodeAt(index);
    hash2 = Math.imul(hash2, 16777619);
  }
  return (hash2 >>> 0).toString(36);
}
function compareReports(current, baseline) {
  const currentById = new Map(current.findings.map((finding) => [finding.id, finding]));
  const baselineById = new Map(baseline.findings.map((finding) => [finding.id, finding]));
  return {
    scoreDelta: current.score - baseline.score,
    added: current.findings.filter((finding) => !baselineById.has(finding.id)),
    resolved: baseline.findings.filter((finding) => !currentById.has(finding.id)),
    unchanged: current.findings.filter((finding) => baselineById.has(finding.id))
  };
}
async function analyzeRepositoryWithPlugins(files, options = {}, plugins = []) {
  let report = analyzeRepository(files, options);
  if (!plugins.length) return report;
  const pluginFindings = [];
  for (const plugin of plugins) {
    const findings2 = await plugin.analyze({ files, report, locale: report.locale });
    for (const finding of findings2) {
      pluginFindings.push({
        ...finding,
        id: finding.id || `plugin/${plugin.name}/${finding.ruleId}/${pluginFindings.length}`,
        ruleId: finding.ruleId.startsWith("plugin/") ? finding.ruleId : `plugin/${plugin.name}/${finding.ruleId}`
      });
    }
  }
  if (!pluginFindings.length) return report;
  const findings = [...report.findings, ...pluginFindings];
  const errors = findings.filter((finding) => finding.severity === "error").length;
  const warnings = findings.filter((finding) => finding.severity === "warning").length;
  const suggestions = findings.filter((finding) => finding.severity === "info").length;
  const penalty = pluginFindings.reduce((sum, finding) => sum + (finding.severity === "error" ? 8 : finding.severity === "warning" ? 4 : 1), 0);
  const score = Math.max(0, report.score - penalty);
  const gradeKey = score >= 90 ? "excellent" : score >= 75 ? "good" : score >= 50 ? "needs-work" : "critical";
  const grade = report.locale === "zh-CN" ? { excellent: "\u4F18\u79C0", good: "\u826F\u597D", "needs-work": "\u9700\u8981\u6539\u8FDB", critical: "\u95EE\u9898\u4E25\u91CD" }[gradeKey] : { excellent: "Excellent", good: "Good", "needs-work": "Needs work", critical: "Critical" }[gradeKey];
  report = {
    ...report,
    score,
    gradeKey,
    grade,
    findings,
    summary: { ...report.summary, errors, warnings, suggestions }
  };
  return report;
}
function renderMarkdownReport(report, locale = report.locale) {
  const zh = locale === "zh-CN";
  const localized = localizeReportView(report, locale);
  const title = report.repositoryName ? `${zh ? "AgentLint \u62A5\u544A" : "AgentLint report"} \u2014 ${report.repositoryName}` : zh ? "AgentLint \u62A5\u544A" : "AgentLint report";
  const labels = metricLabels(locale);
  const rows = Object.entries(report.metrics).map(([name, score]) => `| ${labels[name] ?? name} | ${score} |`).join("\n");
  const findings = localized.findings.length ? localized.findings.map((finding) => renderFindingMarkdown(finding, locale)).join("\n\n") : zh ? "\u6CA1\u6709\u53D1\u73B0\u95EE\u9898\u3002\u6240\u6709\u5DF2\u542F\u7528\u7684\u786E\u5B9A\u6027\u68C0\u67E5\u5747\u5DF2\u901A\u8FC7\u3002" : "No findings. All enabled deterministic checks passed.";
  return `# ${title}

**${zh ? "\u8BC4\u5206" : "Score"}\uFF1A** ${report.score}/100 \u2014 ${localized.grade}

**${zh ? "\u6458\u8981" : "Summary"}\uFF1A** ${report.summary.errors} ${zh ? "\u4E2A\u9519\u8BEF" : "errors"}\uFF0C${report.summary.warnings} ${zh ? "\u4E2A\u8B66\u544A" : "warnings"}\uFF0C${report.summary.suggestions} ${zh ? "\u6761\u5EFA\u8BAE\uFF0C\u5171\u626B\u63CF" : "suggestions across"} ${report.summary.instructionFiles} ${zh ? "\u4E2A\u89C4\u5219\u6587\u4EF6\u3002" : "instruction files."}

| ${zh ? "\u6307\u6807" : "Metric"} | ${zh ? "\u5F97\u5206" : "Score"} |
|---|---:|
${rows}

## ${zh ? "\u95EE\u9898\u6E05\u5355" : "Findings"}

${findings}

## ${zh ? "\u4E0A\u4E0B\u6587\u4F30\u7B97" : "Context estimate"}

- ${zh ? "\u89C4\u5219\u9884\u8BA1\u4EE4\u724C\u6570" : "Estimated instruction tokens"}\uFF1A${report.summary.estimatedTokens}
- ${zh ? "\u5B8C\u5168\u91CD\u590D\u6307\u4EE4" : "Exact duplicate instructions"}\uFF1A${report.summary.duplicateInstructions}
- ${zh ? "\u9884\u8BA1\u53EF\u51CF\u5C11\u4EE4\u724C\u6570" : "Estimated avoidable tokens"}\uFF1A${report.summary.avoidableTokens}
- ${zh ? "\u5B89\u5168\u81EA\u52A8\u4FEE\u590D" : "Safe automatic fixes"}\uFF1A${report.summary.fixable}
- ${zh ? "\u5DF2\u6291\u5236\u95EE\u9898" : "Suppressed findings"}\uFF1A${report.summary.suppressed}

_${zh ? "\u751F\u6210\u65F6\u95F4" : "Generated by AgentLint at"}\uFF1A${report.generatedAt}\u3002_
`;
}
function renderPrettyReport(report, locale = report.locale) {
  const zh = locale === "zh-CN";
  const localized = localizeReportView(report, locale);
  const lines = [
    "",
    `AgentLint  ${report.score}/100 (${localized.grade})${report.repositoryName ? `  ${report.repositoryName}` : ""}`,
    "",
    zh ? `${report.summary.errors} \u4E2A\u9519\u8BEF \xB7 ${report.summary.warnings} \u4E2A\u8B66\u544A \xB7 ${report.summary.suggestions} \u6761\u5EFA\u8BAE` : `${report.summary.errors} errors \xB7 ${report.summary.warnings} warnings \xB7 ${report.summary.suggestions} suggestions`,
    zh ? `${report.summary.instructionFiles} \u4E2A\u89C4\u5219\u6587\u4EF6 \xB7 \u7EA6 ${report.summary.estimatedTokens} \u4E2A\u4EE4\u724C \xB7 ${report.summary.fixable} \u4E2A\u5B89\u5168\u4FEE\u590D` : `${report.summary.instructionFiles} instruction files \xB7 ~${report.summary.estimatedTokens} tokens \xB7 ${report.summary.fixable} safe fixes`,
    ""
  ];
  if (localized.findings.length === 0) {
    lines.push(zh ? "\u901A\u8FC7   \u672A\u53D1\u73B0\u5DF2\u542F\u7528\u7684\u786E\u5B9A\u6027\u95EE\u9898\u3002" : "PASS   No enabled deterministic issues found.");
  } else {
    for (const finding of localized.findings) {
      const label = finding.severity === "error" ? zh ? "\u9519\u8BEF " : "ERROR" : finding.severity === "warning" ? zh ? "\u8B66\u544A " : "WARN " : zh ? "\u5EFA\u8BAE " : "INFO ";
      lines.push(`${label}  ${finding.title}  [${finding.ruleId}]`);
      if (finding.file) lines.push(`       ${finding.file}${finding.line ? `:${finding.line}` : ""}${finding.evidence ? ` \u2014 ${finding.evidence.replaceAll("\n", " | ")}` : ""}`);
      if (finding.suggestion) lines.push(`       ${zh ? "\u4FEE\u590D" : "Fix"}: ${finding.suggestion}`);
      if (finding.fix?.safe) lines.push(zh ? "       \u53EF\u4F7F\u7528 --fix \u81EA\u52A8\u4FEE\u590D" : "       Auto-fix available with --fix");
      lines.push("");
    }
  }
  return lines.join("\n");
}
function renderGitHubAnnotations(report, locale = report.locale) {
  const localized = localizeReportView(report, locale);
  return localized.findings.map((finding) => {
    const command = finding.severity === "error" ? "error" : finding.severity === "warning" ? "warning" : "notice";
    const properties = [
      finding.file ? `file=${escapeProperty(finding.file)}` : "",
      finding.line ? `line=${finding.line}` : "",
      `title=${escapeProperty(`AgentLint ${finding.ruleId}`)}`
    ].filter(Boolean).join(",");
    return `::${command} ${properties}::${escapeMessage(`${finding.title}: ${finding.message}`)}`;
  }).join("\n");
}
function renderSarifReport(report, locale = report.locale) {
  const localized = localizeReportView(report, locale);
  const ruleMap = /* @__PURE__ */ new Map();
  for (const finding of localized.findings) if (!ruleMap.has(finding.ruleId)) ruleMap.set(finding.ruleId, finding);
  const sarif = {
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    version: "2.1.0",
    runs: [{
      tool: {
        driver: {
          name: "AgentLint",
          informationUri: "https://github.com/valseeee/agentlint",
          semanticVersion: "0.4.0",
          rules: [...ruleMap.entries()].map(([id, finding]) => ({
            id,
            name: id.replaceAll("/", "_"),
            shortDescription: { text: finding.title },
            helpUri: finding.docs,
            defaultConfiguration: { level: sarifLevel(finding.severity) }
          }))
        }
      },
      results: localized.findings.map((finding) => ({
        ruleId: finding.ruleId,
        level: sarifLevel(finding.severity),
        message: { text: `${finding.title}: ${finding.message}` },
        locations: finding.file ? [{
          physicalLocation: {
            artifactLocation: { uri: finding.file },
            region: finding.line ? { startLine: finding.line } : void 0
          }
        }] : void 0
      }))
    }]
  };
  return JSON.stringify(sarif, null, 2);
}
function renderDiffMarkdown(diff, locale = "en-US") {
  const zh = locale === "zh-CN";
  const section = (title, findings) => findings.length ? `## ${title}

${findings.map((finding) => `- **${finding.title}** \`${finding.ruleId}\`${finding.file ? ` \u2014 \`${finding.file}${finding.line ? `:${finding.line}` : ""}\`` : ""}`).join("\n")}` : `## ${title}

${zh ? "\u65E0\u3002" : "None."}`;
  return `# ${zh ? "AgentLint \u57FA\u7EBF\u5DEE\u5F02" : "AgentLint baseline diff"}

**${zh ? "\u8BC4\u5206\u53D8\u5316" : "Score delta"}\uFF1A** ${diff.scoreDelta >= 0 ? "+" : ""}${diff.scoreDelta}

${section(zh ? `\u65B0\u589E\u95EE\u9898\uFF08${diff.added.length}\uFF09` : `Added findings (${diff.added.length})`, diff.added)}

${section(zh ? `\u5DF2\u89E3\u51B3\u95EE\u9898\uFF08${diff.resolved.length}\uFF09` : `Resolved findings (${diff.resolved.length})`, diff.resolved)}
`;
}
function localizeReportView(report, locale) {
  const findings = report.findings.map((finding) => {
    const text = finding.translations?.[locale];
    return text ? {
      ...finding,
      title: text.title,
      message: text.message,
      suggestion: text.suggestion,
      fix: finding.fix ? { ...finding.fix, description: finding.fix.translations?.[locale] ?? finding.fix.description } : void 0
    } : finding;
  });
  const grade = locale === "zh-CN" ? { excellent: "\u4F18\u79C0", good: "\u826F\u597D", "needs-work": "\u9700\u8981\u6539\u8FDB", critical: "\u95EE\u9898\u4E25\u91CD" }[report.gradeKey] : { excellent: "Excellent", good: "Good", "needs-work": "Needs work", critical: "Critical" }[report.gradeKey];
  const instructionFiles = report.instructionFiles.map((file) => ({
    ...file,
    label: instructionLabel(file.kind, locale),
    scope: localizeScope(file.scope, locale)
  }));
  const scopeGraph = {
    ...report.scopeGraph,
    nodes: report.scopeGraph.nodes.map((node) => ({
      ...node,
      label: instructionLabel(node.kind, locale),
      scope: localizeScope(node.scope, locale)
    }))
  };
  return { ...report, locale, grade, findings, instructionFiles, scopeGraph };
}
function localizeScope(scope, locale) {
  const pairs = {
    repository: ["repository", "\u6574\u4E2A\u4ED3\u5E93"],
    "\u6574\u4E2A\u4ED3\u5E93": ["repository", "\u6574\u4E2A\u4ED3\u5E93"],
    "frontmatter paths or repository": ["frontmatter paths or repository", "\u6587\u4EF6\u5934\u8DEF\u5F84\u6216\u6574\u4E2A\u4ED3\u5E93"],
    "\u6587\u4EF6\u5934\u8DEF\u5F84\u6216\u6574\u4E2A\u4ED3\u5E93": ["frontmatter paths or repository", "\u6587\u4EF6\u5934\u8DEF\u5F84\u6216\u6574\u4E2A\u4ED3\u5E93"],
    "rule metadata": ["rule metadata", "\u89C4\u5219\u5143\u6570\u636E\u5B9A\u4E49"],
    "\u89C4\u5219\u5143\u6570\u636E\u5B9A\u4E49": ["rule metadata", "\u89C4\u5219\u5143\u6570\u636E\u5B9A\u4E49"],
    "applyTo glob": ["applyTo glob", "applyTo \u5339\u914D\u8303\u56F4"],
    "applyTo \u5339\u914D\u8303\u56F4": ["applyTo glob", "applyTo \u5339\u914D\u8303\u56F4"],
    "custom agent": ["custom agent", "\u81EA\u5B9A\u4E49\u52A9\u624B"],
    "\u81EA\u5B9A\u4E49\u52A9\u624B": ["custom agent", "\u81EA\u5B9A\u4E49\u52A9\u624B"],
    always: ["always", "\u59CB\u7EC8\u751F\u6548"],
    "\u59CB\u7EC8\u751F\u6548": ["always", "\u59CB\u7EC8\u751F\u6548"],
    "agent-selected": ["agent-selected", "\u7531\u7F16\u7A0B\u52A9\u624B\u6309\u63CF\u8FF0\u9009\u62E9"],
    "\u7531\u7F16\u7A0B\u52A9\u624B\u6309\u63CF\u8FF0\u9009\u62E9": ["agent-selected", "\u7531\u7F16\u7A0B\u52A9\u624B\u6309\u63CF\u8FF0\u9009\u62E9"]
  };
  const pair = pairs[scope];
  return pair ? pair[locale === "zh-CN" ? 1 : 0] : scope;
}
function renderFindingMarkdown(finding, locale) {
  const zh = locale === "zh-CN";
  const icon = finding.severity === "error" ? "\u274C" : finding.severity === "warning" ? "\u26A0\uFE0F" : "\u2139\uFE0F";
  const location = finding.file ? `

**${zh ? "\u4F4D\u7F6E" : "Location"}\uFF1A** \`${finding.file}${finding.line ? `:${finding.line}` : ""}\`` : "";
  const evidence = finding.evidence ? `

> ${finding.evidence.replaceAll("\n", "  \n> ")}` : "";
  const suggestion = finding.suggestion ? `

**${zh ? "\u5EFA\u8BAE\u4FEE\u590D" : "Suggested fix"}\uFF1A** ${finding.suggestion}` : "";
  const automatic = finding.fix?.safe ? `

**${zh ? "\u81EA\u52A8\u4FEE\u590D" : "Automatic fix"}\uFF1A** ${zh ? "\u53EF\u4F7F\u7528" : "Available with"} \`agentlint check . --fix\`.` : "";
  return `### ${icon} ${finding.title}

\`${finding.ruleId}\`${location}

${finding.message}${evidence}${suggestion}${automatic}`;
}
function metricLabels(locale) {
  return locale === "zh-CN" ? { coverage: "\u914D\u7F6E\u8986\u76D6", consistency: "\u4E00\u81F4\u6027", validity: "\u6709\u6548\u6027", security: "\u5B89\u5168\u6027", efficiency: "\u4E0A\u4E0B\u6587\u6548\u7387" } : { coverage: "Coverage", consistency: "Consistency", validity: "Validity", security: "Security", efficiency: "Context efficiency" };
}
function sarifLevel(severity) {
  return severity === "info" ? "note" : severity;
}
function escapeProperty(value) {
  return value.replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A").replaceAll(":", "%3A").replaceAll(",", "%2C");
}
function escapeMessage(value) {
  return value.replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A");
}

// ../core/dist/index.js
var import_promises = require("fs/promises");
var import_path = __toESM(require("path"), 1);
var import_fast_glob = __toESM(require_out4(), 1);
var entries = [
  ["coverage/no-instruction-files", "coverage", "warning", "\u672A\u53D1\u73B0\u89C4\u5219\u6587\u4EF6", "No instruction files found", "\u4ED3\u5E93\u4E2D\u6CA1\u6709\u53D7\u652F\u6301\u7684 AI \u7F16\u7A0B\u52A9\u624B\u89C4\u5219\u6587\u4EF6\u3002", "No supported AI coding-agent instruction file was found."],
  ["coverage/empty-instruction-file", "coverage", "warning", "\u89C4\u5219\u6587\u4EF6\u4E3A\u7A7A", "Empty instruction file", "\u89C4\u5219\u6587\u4EF6\u5B58\u5728\uFF0C\u4F46\u6CA1\u6709\u63D0\u53D6\u5230\u6709\u6548\u6307\u4EE4\u3002", "An instruction file exists but contains no usable instructions."],
  ["coverage/no-test-guidance", "coverage", "info", "\u7F3A\u5C11\u6D4B\u8BD5\u8BF4\u660E", "Missing test guidance", "\u4ED3\u5E93\u6709\u6D4B\u8BD5\u547D\u4EE4\uFF0C\u4F46\u89C4\u5219\u6CA1\u6709\u8BF4\u660E\u4F55\u65F6\u8FD0\u884C\u6D4B\u8BD5\u3002", "The repository has tests, but instructions do not explain when to run them."],
  ["coverage/no-build-guidance", "coverage", "info", "\u7F3A\u5C11\u6784\u5EFA\u8BF4\u660E", "Missing build guidance", "\u4ED3\u5E93\u6709\u6784\u5EFA\u6216\u7C7B\u578B\u68C0\u67E5\u547D\u4EE4\uFF0C\u4F46\u89C4\u5219\u6CA1\u6709\u76F8\u5E94\u8BF4\u660E\u3002", "The repository has build or type-check commands without matching guidance."],
  ["coverage/no-lint-guidance", "coverage", "info", "\u7F3A\u5C11\u4EE3\u7801\u68C0\u67E5\u8BF4\u660E", "Missing lint guidance", "\u4ED3\u5E93\u6709 lint \u6216\u683C\u5F0F\u5316\u547D\u4EE4\uFF0C\u4F46\u89C4\u5219\u6CA1\u6709\u76F8\u5E94\u8BF4\u660E\u3002", "The repository has lint or format commands without matching guidance."],
  ["coverage/cursor-legacy-format", "coverage", "info", "\u4F7F\u7528\u65E7\u7248 Cursor \u89C4\u5219\u683C\u5F0F", "Legacy Cursor rule format", "\u5EFA\u8BAE\u4ECE .cursorrules \u8FC1\u79FB\u5230 .cursor/rules/*.mdc\u3002", "Consider migrating .cursorrules to .cursor/rules/*.mdc."],
  ["coverage/windsurf-legacy-format", "coverage", "info", "\u4F7F\u7528\u65E7\u7248 Windsurf \u89C4\u5219\u683C\u5F0F", "Legacy Windsurf rule format", "\u5EFA\u8BAE\u8FC1\u79FB\u5230 Windsurf \u7684\u76EE\u5F55\u5316\u89C4\u5219\u683C\u5F0F\u3002", "Consider migrating to Windsurf's directory-based rule format."],
  ["coverage/cursor-activation", "coverage", "warning", "Cursor \u89C4\u5219\u7F3A\u5C11\u6FC0\u6D3B\u65B9\u5F0F", "Cursor rule lacks activation", "Cursor \u89C4\u5219\u6CA1\u6709\u6E05\u6670\u7684 alwaysApply \u6216 glob \u4F5C\u7528\u57DF\u3002", "The Cursor rule has no clear alwaysApply or glob activation scope."],
  ["consistency/multiple-package-managers", "consistency", "warning", "\u68C0\u6D4B\u5230\u591A\u4E2A\u5305\u7BA1\u7406\u5668", "Multiple package managers detected", "\u540C\u4E00\u4F5C\u7528\u57DF\u5B58\u5728\u591A\u4E2A\u5305\u7BA1\u7406\u5668\u9501\u6587\u4EF6\u3002", "Multiple package-manager lockfiles exist in the same scope."],
  ["consistency/package-manager", "consistency", "warning", "\u5305\u7BA1\u7406\u5668\u8BF4\u660E\u4E0E\u4ED3\u5E93\u4E0D\u4E00\u81F4", "Package manager mismatch", "\u89C4\u5219\u4E2D\u7684\u5305\u7BA1\u7406\u5668\u4E0E\u9501\u6587\u4EF6\u6216 packageManager \u5B57\u6BB5\u4E0D\u4E00\u81F4\u3002", "The instructed package manager conflicts with lockfiles or packageManager metadata."],
  ["consistency/contradictory-instructions", "consistency", "warning", "\u89C4\u5219\u76F8\u4E92\u77DB\u76FE", "Contradictory instructions", "\u76F8\u540C\u4F5C\u7528\u57DF\u4E2D\u51FA\u73B0\u4E86\u660E\u786E\u76F8\u53CD\u7684\u8981\u6C42\u3002", "Clearly opposing requirements exist in the same effective scope."],
  ["validity/config-invalid", "validity", "error", "AgentLint \u914D\u7F6E\u65E0\u6548", "Invalid AgentLint configuration", ".agentlint.json \u65E0\u6CD5\u89E3\u6790\u6216\u5B57\u6BB5\u65E0\u6548\u3002", ".agentlint.json cannot be parsed or contains invalid fields."],
  ["validity/frontmatter-unclosed", "validity", "error", "Frontmatter \u672A\u95ED\u5408", "Unclosed frontmatter", "\u89C4\u5219\u6587\u4EF6\u7684 YAML frontmatter \u7F3A\u5C11\u7ED3\u675F\u5206\u9694\u7B26\u3002", "The instruction file's YAML frontmatter has no closing delimiter."],
  ["validity/cursor-frontmatter", "validity", "warning", "Cursor \u89C4\u5219\u7F3A\u5C11 Frontmatter", "Cursor rule lacks frontmatter", "MDC \u89C4\u5219\u7F3A\u5C11\u63A8\u8350\u7684\u5143\u6570\u636E\u533A\u3002", "The MDC rule is missing recommended metadata."],
  ["validity/cursor-always-apply", "validity", "error", "Cursor alwaysApply \u503C\u65E0\u6548", "Invalid Cursor alwaysApply value", "alwaysApply \u5FC5\u987B\u662F true \u6216 false\u3002", "alwaysApply must be true or false."],
  ["validity/copilot-apply-to", "validity", "warning", "Copilot applyTo \u65E0\u6548\u6216\u7F3A\u5931", "Invalid or missing Copilot applyTo", "\u8DEF\u5F84\u7EA7 Copilot \u6307\u4EE4\u9700\u8981\u6709\u6548\u7684 applyTo glob\u3002", "Path-specific Copilot instructions need a valid applyTo glob."],
  ["validity/copilot-agent-description", "validity", "warning", "Copilot \u81EA\u5B9A\u4E49\u52A9\u624B\u7F3A\u5C11\u8BF4\u660E", "Copilot custom agent lacks description", "\u81EA\u5B9A\u4E49\u52A9\u624B\u5EFA\u8BAE\u63D0\u4F9B\u6E05\u6670 description\u3002", "A custom agent should provide a clear description."],
  ["validity/missing-script", "validity", "error", "\u89C4\u5219\u5F15\u7528\u7684\u811A\u672C\u4E0D\u5B58\u5728", "Referenced script does not exist", "\u89C4\u5219\u8981\u6C42\u8FD0\u884C package.json \u4E2D\u4E0D\u5B58\u5728\u7684\u811A\u672C\u3002", "The instructions require a package.json script that does not exist."],
  ["validity/script-out-of-scope", "validity", "warning", "\u811A\u672C\u4E0D\u5728\u5F53\u524D\u5DE5\u4F5C\u533A", "Script is outside the current workspace", "\u811A\u672C\u53EA\u5B58\u5728\u4E8E\u5176\u4ED6\u5DE5\u4F5C\u533A\uFF0C\u5F53\u524D\u4F5C\u7528\u57DF\u65E0\u6CD5\u76F4\u63A5\u8FD0\u884C\u3002", "The script exists only in another workspace and is not directly runnable here."],
  ["validity/missing-task-target", "validity", "error", "\u4EFB\u52A1\u76EE\u6807\u4E0D\u5B58\u5728", "Task target does not exist", "\u89C4\u5219\u5F15\u7528\u4E86\u4E0D\u5B58\u5728\u7684 Makefile \u6216 Justfile \u76EE\u6807\u3002", "The instructions reference a missing Makefile or Justfile target."],
  ["validity/missing-path", "validity", "warning", "\u89C4\u5219\u5F15\u7528\u7684\u8DEF\u5F84\u4E0D\u5B58\u5728", "Referenced path does not exist", "\u89C4\u5219\u4E2D\u7684\u4ED3\u5E93\u6587\u4EF6\u6216\u76EE\u5F55\u8DEF\u5F84\u5DF2\u7ECF\u5931\u6548\u3002", "A repository file or directory referenced by the instructions is missing."],
  ["security/force-push", "security", "error", "\u5371\u9669\u7684\u5F3A\u5236\u63A8\u9001\u8BF4\u660E", "Dangerous force-push instruction", "\u89C4\u5219\u5141\u8BB8\u65E0\u6761\u4EF6\u6539\u5199\u8FDC\u7A0B Git \u5386\u53F2\u3002", "The instructions allow unconditional rewriting of remote Git history."],
  ["security/force-with-lease", "security", "warning", "\u6539\u5199\u5386\u53F2\u5E94\u8981\u6C42\u786E\u8BA4", "History rewrite should require confirmation", "\u5373\u4F7F\u4F7F\u7528 --force-with-lease\uFF0C\u4E5F\u5E94\u5148\u83B7\u5F97\u7528\u6237\u786E\u8BA4\u3002", "Even --force-with-lease should require user confirmation."],
  ["security/destructive-shell", "security", "error", "\u5371\u9669\u7684\u9012\u5F52\u5220\u9664\u547D\u4EE4", "Destructive shell instruction", "\u89C4\u5219\u5305\u542B\u8303\u56F4\u8FC7\u5927\u7684\u9012\u5F52\u5220\u9664\u64CD\u4F5C\u3002", "The instructions contain a broad recursive-delete operation."],
  ["security/pipe-to-shell", "security", "error", "\u8FDC\u7A0B\u811A\u672C\u76F4\u63A5\u4EA4\u7ED9 Shell \u6267\u884C", "Remote script piped directly to a shell", "\u672A\u7ECF\u68C0\u67E5\u76F4\u63A5\u6267\u884C\u4E0B\u8F7D\u5185\u5BB9\u5B58\u5728\u4F9B\u5E94\u94FE\u98CE\u9669\u3002", "Executing downloaded content without review creates supply-chain risk."],
  ["security/hard-reset", "security", "warning", "\u786C\u91CD\u7F6E\u53EF\u80FD\u4E22\u5931\u5DE5\u4F5C", "Hard reset can discard work", "git reset --hard \u53EF\u80FD\u6C38\u4E45\u4E22\u5F03\u672A\u63D0\u4EA4\u4FEE\u6539\u3002", "git reset --hard may permanently discard uncommitted changes."],
  ["security/no-verify", "security", "warning", "\u7ED5\u8FC7\u9A8C\u8BC1\u94A9\u5B50", "Verification hooks are bypassed", "\u89C4\u5219\u5141\u8BB8\u8DF3\u8FC7\u4ED3\u5E93\u5B89\u5168\u4E0E\u8D28\u91CF\u68C0\u67E5\u3002", "The instructions allow repository safety and quality hooks to be skipped."],
  ["security/chmod-777", "security", "warning", "\u8BF7\u6C42\u5168\u5458\u53EF\u5199\u6743\u9650", "World-writable permissions requested", "chmod 777 \u7ED9\u4E88\u6240\u6709\u672C\u5730\u7528\u6237\u548C\u8FDB\u7A0B\u5199\u6743\u9650\u3002", "chmod 777 grants write access to every local user and process."],
  ["security/tls-disabled", "security", "warning", "\u5173\u95ED TLS \u8BC1\u4E66\u6821\u9A8C", "TLS verification is disabled", "\u5173\u95ED\u8BC1\u4E66\u6821\u9A8C\u4F1A\u589E\u52A0\u7F51\u7EDC\u52AB\u6301\u98CE\u9669\u3002", "Disabling certificate verification increases interception risk."],
  ["security/broad-sudo", "security", "warning", "\u8FC7\u5BBD\u7684\u7BA1\u7406\u5458\u6743\u9650\u8BF4\u660E", "Broad privileged execution instruction", "\u89C4\u5219\u9F13\u52B1\u4F7F\u7528\u672A\u9650\u5B9A\u8303\u56F4\u7684 sudo\u3002", "The instructions encourage insufficiently scoped sudo usage."],
  ["security/no-confirmation", "security", "warning", "\u89C4\u5219\u7981\u6B62\u7528\u6237\u786E\u8BA4", "Instruction suppresses user confirmation", "\u7834\u574F\u6027\u6216\u5916\u90E8\u64CD\u4F5C\u4E0D\u5E94\u9ED8\u8BA4\u9759\u9ED8\u6267\u884C\u3002", "Destructive or external actions should not run silently by default."],
  ["security/production-data", "security", "error", "\u5141\u8BB8\u4FEE\u6539\u751F\u4EA7\u6570\u636E", "Production-data modification instruction", "\u89C4\u5219\u770B\u8D77\u6765\u6388\u6743\u76F4\u63A5\u4FEE\u6539\u751F\u4EA7\u73AF\u5883\u6570\u636E\u3002", "The instructions appear to authorize direct production-data changes."],
  ["security/secret-exposure", "security", "error", "\u89C4\u5219\u53EF\u80FD\u5BFC\u81F4\u5BC6\u94A5\u6CC4\u9732", "Instruction may expose secrets", "\u89C4\u5219\u53EF\u80FD\u5141\u8BB8\u6253\u5370\u3001\u63D0\u4EA4\u6216\u4F20\u8F93\u5BC6\u94A5\u3002", "The instructions may allow secrets to be printed, committed or transmitted."],
  ["security/skip-validation", "security", "warning", "\u5141\u8BB8\u8DF3\u8FC7\u6D4B\u8BD5\u6216\u7C7B\u578B\u68C0\u67E5", "Validation may be skipped", "\u89C4\u5219\u5141\u8BB8\u5FFD\u7565\u6D4B\u8BD5\u3001\u7C7B\u578B\u68C0\u67E5\u6216 lint \u5931\u8D25\u3002", "The instructions allow test, type-check or lint failures to be ignored."],
  ["efficiency/duplicate-instruction", "efficiency", "warning", "\u5B58\u5728\u5B8C\u5168\u91CD\u590D\u7684\u89C4\u5219", "Duplicate instruction", "\u76F8\u540C\u89C4\u5219\u5728\u591A\u4E2A\u4F4D\u7F6E\u91CD\u590D\u52A0\u8F7D\u3002", "The same instruction is loaded from multiple locations."],
  ["efficiency/near-duplicate-instruction", "efficiency", "info", "\u5B58\u5728\u8FD1\u4F3C\u91CD\u590D\u7684\u89C4\u5219", "Near-duplicate instruction", "\u8BED\u4E49\u9AD8\u5EA6\u76F8\u4F3C\u7684\u89C4\u5219\u53EF\u80FD\u6D6A\u8D39\u4E0A\u4E0B\u6587\u3002", "Highly similar instructions may waste context."],
  ["efficiency/file-too-large", "efficiency", "warning", "\u89C4\u5219\u6587\u4EF6\u8FC7\u5927", "Instruction file is too large", "\u89C4\u5219\u6587\u4EF6\u8D85\u8FC7\u914D\u7F6E\u7684\u4E0A\u4E0B\u6587\u9884\u7B97\u3002", "The instruction file exceeds the configured context budget."],
  ["efficiency/claude-line-count", "efficiency", "info", "CLAUDE.md \u884C\u6570\u8FC7\u591A", "CLAUDE.md is very long", "\u5EFA\u8BAE\u628A\u76EE\u5F55\u4E13\u7528\u8BF4\u660E\u62C6\u5206\u5230 .claude/rules\u3002", "Consider splitting directory-specific guidance into .claude/rules."]
];
var RULE_CATALOG = entries.map(([id, category, defaultSeverity, zhTitle, enTitle, zhDescription, enDescription]) => ({
  id,
  category,
  defaultSeverity,
  title: { "zh-CN": zhTitle, "en-US": enTitle },
  description: { "zh-CN": zhDescription, "en-US": enDescription }
}));
function getRuleCatalog(locale = "en-US") {
  return RULE_CATALOG.map((entry) => ({
    id: entry.id,
    category: entry.category,
    defaultSeverity: entry.defaultSeverity,
    title: entry.title[locale],
    description: entry.description[locale]
  }));
}
function getRuleDetails(ruleId, locale = "en-US") {
  const entry = RULE_CATALOG.find((item) => item.id === ruleId);
  if (!entry) return null;
  return {
    id: entry.id,
    category: entry.category,
    defaultSeverity: entry.defaultSeverity,
    title: entry.title[locale],
    description: entry.description[locale]
  };
}
var ignored = [
  "**/.git/**",
  "**/node_modules/**",
  "**/.next/**",
  "**/dist/**",
  "**/coverage/**",
  "**/.turbo/**",
  "**/vendor/**",
  "**/.venv/**",
  "**/target/**"
];
async function scanLocalRepository(rootDirectory, additionalIgnores = []) {
  const absoluteRoot = import_path.default.resolve(rootDirectory);
  const projectIgnores = await readIgnoreFiles(absoluteRoot);
  const paths = await (0, import_fast_glob.default)("**/*", {
    cwd: absoluteRoot,
    onlyFiles: true,
    dot: true,
    unique: true,
    followSymbolicLinks: false,
    ignore: [...ignored, ...projectIgnores, ...additionalIgnores]
  });
  return Promise.all(
    paths.map(async (relativePath) => {
      const normalized = relativePath.replaceAll("\\", "/");
      if (!shouldReadRepositoryFile(normalized)) return { path: normalized, content: "" };
      try {
        const content = await (0, import_promises.readFile)(import_path.default.join(absoluteRoot, relativePath), "utf8");
        return { path: normalized, content, size: Buffer.byteLength(content) };
      } catch {
        return { path: normalized, content: "" };
      }
    })
  );
}
async function readConfigFile(filePath) {
  const content = await (0, import_promises.readFile)(import_path.default.resolve(filePath), "utf8");
  return JSON.parse(content);
}
async function readIgnoreFiles(rootDirectory) {
  const patterns = /* @__PURE__ */ new Set();
  for (const filename of [".agentlintignore"]) {
    try {
      const content = await (0, import_promises.readFile)(import_path.default.join(rootDirectory, filename), "utf8");
      for (const line of content.split(/\r?\n/)) {
        const value = line.trim();
        if (value && !value.startsWith("#")) patterns.add(value);
      }
    } catch {
    }
  }
  try {
    const config = JSON.parse(await (0, import_promises.readFile)(import_path.default.join(rootDirectory, ".agentlint.json"), "utf8"));
    for (const value of config.ignore ?? []) if (value.trim()) patterns.add(value.trim());
  } catch {
  }
  return [...patterns];
}

// src/index.ts
var defaultLocale = /^(zh|cn)/i.test(import_node_process2.default.env.AGENTLINT_LANG ?? import_node_process2.default.env.LANG ?? "") ? "zh-CN" : "en-US";
var program2 = new Command();
program2.name("agentlint").description("Lint AI coding-agent instruction files / \u68C0\u67E5 AI \u7F16\u7A0B\u52A9\u624B\u6307\u4EE4\u6587\u4EF6").version("0.4.0");
program2.command("check [directory]", { isDefault: true }).description("analyze a repository / \u5206\u6790\u4ED3\u5E93").option("-f, --format <format>", "pretty, json, markdown, sarif or github", "pretty").option("-o, --output <file>", "write output to a file / \u5199\u5165\u6587\u4EF6").option("--lang <locale>", "zh-CN or en-US", defaultLocale).option("--fail-on <level>", "error, warning or never", "error").option("--max-warnings <count>", "fail when warnings exceed this count", parseInteger).option("--config <file>", "merge an additional JSON configuration file").option("--rule <rule=severity>", "override a rule; repeatable", collect, []).option("--plugin <module>", "load an optional analysis plugin; repeatable", collect, []).option("--baseline <file>", "compare against a previous JSON report").option("--save-baseline <file>", "write the current JSON report as a baseline").option("--diff-output <file>", "write baseline differences as Markdown").option("--pr-comment", "create or update a Pull Request summary comment", false).option("--fix", "apply deterministic safe fixes before reporting", false).action(async (directory = ".", options) => {
  const locale = normalizeLocale(options.lang);
  try {
    const absolute = import_node_path2.default.resolve(directory);
    let overrideConfig = options.config ? await readConfigFile(options.config) : {};
    overrideConfig = mergeCliRules(overrideConfig, options.rule, locale);
    const plugins = await loadPlugins(options.plugin);
    let files = await scanLocalRepository(absolute, overrideConfig.ignore ?? []);
    let report = await analyzeRepositoryWithPlugins(files, { repositoryName: import_node_path2.default.basename(absolute), config: overrideConfig, locale }, plugins);
    if (options.fix) {
      const applied = await applySafeFixes(absolute, report);
      import_node_process2.default.stderr.write(applied > 0 ? locale === "zh-CN" ? `AgentLint \u5DF2\u5E94\u7528 ${applied} \u4E2A\u5B89\u5168\u4FEE\u590D\u3002
` : `AgentLint applied ${applied} safe fix${applied === 1 ? "" : "es"}.
` : locale === "zh-CN" ? "AgentLint \u6CA1\u6709\u53D1\u73B0\u53EF\u5B89\u5168\u81EA\u52A8\u4FEE\u590D\u7684\u95EE\u9898\u3002\n" : "AgentLint found no safe automatic fixes to apply.\n");
      if (applied > 0) {
        files = await scanLocalRepository(absolute, overrideConfig.ignore ?? []);
        report = await analyzeRepositoryWithPlugins(files, { repositoryName: import_node_path2.default.basename(absolute), config: overrideConfig, locale }, plugins);
      }
    }
    const output = formatReport(options.format, report, locale);
    if (options.output) {
      const outputPath = import_node_path2.default.resolve(options.output);
      await (0, import_promises2.mkdir)(import_node_path2.default.dirname(outputPath), { recursive: true });
      await (0, import_promises2.writeFile)(outputPath, output.endsWith("\n") ? output : `${output}
`, "utf8");
      import_node_process2.default.stdout.write(locale === "zh-CN" ? `AgentLint \u62A5\u544A\u5DF2\u5199\u5165 ${outputPath}
` : `AgentLint report written to ${outputPath}
`);
    } else if (output) import_node_process2.default.stdout.write(output.endsWith("\n") ? output : `${output}
`);
    let diffMarkdown = "";
    if (options.baseline) {
      const baseline = JSON.parse(await (0, import_promises2.readFile)(import_node_path2.default.resolve(options.baseline), "utf8"));
      const diff = compareReports(report, baseline);
      diffMarkdown = renderDiffMarkdown(diff, locale);
      if (options.diffOutput) {
        const diffPath = import_node_path2.default.resolve(options.diffOutput);
        await (0, import_promises2.mkdir)(import_node_path2.default.dirname(diffPath), { recursive: true });
        await (0, import_promises2.writeFile)(diffPath, diffMarkdown, "utf8");
      } else import_node_process2.default.stderr.write(`
${diffMarkdown}
`);
    }
    if (options.saveBaseline) {
      const baselinePath = import_node_path2.default.resolve(options.saveBaseline);
      await (0, import_promises2.mkdir)(import_node_path2.default.dirname(baselinePath), { recursive: true });
      await (0, import_promises2.writeFile)(baselinePath, `${JSON.stringify(report, null, 2)}
`, "utf8");
    }
    if (options.format === "github" || import_node_process2.default.env.GITHUB_ACTIONS === "true") await writeGitHubMetadata(report, locale);
    if (options.prComment) await upsertPullRequestComment(report, diffMarkdown, locale);
    import_node_process2.default.exitCode = shouldFail(options.failOn, report, options.maxWarnings, locale) ? 1 : 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    import_node_process2.default.stderr.write(locale === "zh-CN" ? `AgentLint \u6267\u884C\u5931\u8D25\uFF1A${message}
` : `AgentLint failed: ${message}
`);
    import_node_process2.default.exitCode = 2;
  }
});
program2.command("init [directory]").description("create starter files / \u521B\u5EFA\u8D77\u59CB\u6587\u4EF6").option("--lang <locale>", "zh-CN or en-US", defaultLocale).option("--force", "overwrite existing starter files", false).action(async (directory = ".", options) => {
  const locale = normalizeLocale(options.lang);
  try {
    const absolute = import_node_path2.default.resolve(directory);
    await (0, import_promises2.mkdir)(absolute, { recursive: true });
    const created = [];
    created.push(...await createIfMissing(import_node_path2.default.join(absolute, ".agentlint.json"), starterConfig(locale), options.force));
    created.push(...await createIfMissing(import_node_path2.default.join(absolute, "AGENTS.md"), starterAgents(locale), options.force));
    if (created.length) import_node_process2.default.stdout.write(`${locale === "zh-CN" ? "\u5DF2\u521B\u5EFA" : "Created"}:
${created.map((file) => `  ${file}`).join("\n")}
`);
    else import_node_process2.default.stdout.write(locale === "zh-CN" ? "\u6CA1\u6709\u4FEE\u6539\uFF1A\u8D77\u59CB\u6587\u4EF6\u5DF2\u5B58\u5728\uFF1B\u4F7F\u7528 --force \u53EF\u8986\u76D6\u3002\n" : "Nothing changed. Starter files already exist; use --force to overwrite them.\n");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    import_node_process2.default.stderr.write(locale === "zh-CN" ? `AgentLint \u521D\u59CB\u5316\u5931\u8D25\uFF1A${message}
` : `AgentLint init failed: ${message}
`);
    import_node_process2.default.exitCode = 2;
  }
});
program2.command("rules [query]").description("list built-in rules / \u5217\u51FA\u5185\u7F6E\u89C4\u5219").option("--lang <locale>", "zh-CN or en-US", defaultLocale).option("--json", "output JSON / \u8F93\u51FA JSON", false).action((query = "", options) => {
  const locale = normalizeLocale(options.lang);
  const keyword = query.trim().toLowerCase();
  const rules = getRuleCatalog(locale).filter((rule) => !keyword || [rule.id, rule.title, rule.description, rule.category].some((value) => value.toLowerCase().includes(keyword)));
  if (options.json) {
    import_node_process2.default.stdout.write(`${JSON.stringify(rules, null, 2)}
`);
    return;
  }
  if (!rules.length) {
    import_node_process2.default.stdout.write(locale === "zh-CN" ? "\u6CA1\u6709\u627E\u5230\u5339\u914D\u7684\u89C4\u5219\u3002\n" : "No matching rules found.\n");
    return;
  }
  for (const rule of rules) {
    import_node_process2.default.stdout.write(`${rule.id}
  ${rule.title}
  ${locale === "zh-CN" ? "\u9ED8\u8BA4\u7EA7\u522B" : "Default"}: ${rule.defaultSeverity} \xB7 ${locale === "zh-CN" ? "\u7C7B\u522B" : "Category"}: ${rule.category}
  ${rule.description}

`);
  }
});
program2.command("explain <ruleId>").description("explain one rule / \u89E3\u91CA\u5355\u6761\u89C4\u5219").option("--lang <locale>", "zh-CN or en-US", defaultLocale).action((ruleId, options) => {
  const locale = normalizeLocale(options.lang);
  const rule = getRuleDetails(ruleId, locale);
  if (!rule) {
    import_node_process2.default.stderr.write(locale === "zh-CN" ? `\u672A\u77E5\u89C4\u5219\uFF1A${ruleId}
\u53EF\u8FD0\u884C agentlint rules \u67E5\u770B\u5B8C\u6574\u5217\u8868\u3002
` : `Unknown rule: ${ruleId}
Run agentlint rules to see the full catalog.
`);
    import_node_process2.default.exitCode = 1;
    return;
  }
  import_node_process2.default.stdout.write(`${rule.id}
${"=".repeat(rule.id.length)}
${rule.title}

${rule.description}

${locale === "zh-CN" ? "\u9ED8\u8BA4\u7EA7\u522B" : "Default severity"}: ${rule.defaultSeverity}
${locale === "zh-CN" ? "\u7C7B\u522B" : "Category"}: ${rule.category}
${locale === "zh-CN" ? "\u6587\u6863" : "Docs"}: docs/RULES.md#${rule.id.replace("/", "")}
`);
});
program2.command("doctor [directory]").description("check the local environment / \u68C0\u67E5\u672C\u5730\u8FD0\u884C\u73AF\u5883").option("--lang <locale>", "zh-CN or en-US", defaultLocale).option("--network", "also test GitHub connectivity / \u540C\u65F6\u68C0\u6D4B GitHub \u7F51\u7EDC", false).action(async (directory = ".", options) => {
  const locale = normalizeLocale(options.lang);
  const root = import_node_path2.default.resolve(directory);
  const results = [];
  const nodeMajor = Number(import_node_process2.default.versions.node.split(".")[0]);
  results.push({ ok: nodeMajor >= 20, label: locale === "zh-CN" ? "Node.js \u7248\u672C" : "Node.js version", details: import_node_process2.default.versions.node });
  try {
    await (0, import_promises2.access)(import_node_path2.default.join(root, "package.json"));
    results.push({ ok: true, label: locale === "zh-CN" ? "\u9879\u76EE\u76EE\u5F55" : "Project directory", details: root });
  } catch {
    results.push({ ok: false, label: locale === "zh-CN" ? "\u9879\u76EE\u76EE\u5F55" : "Project directory", details: locale === "zh-CN" ? "\u6CA1\u6709\u627E\u5230 package.json\uFF08\u5206\u6790\u666E\u901A\u4ED3\u5E93\u65F6\u4E0D\u4E00\u5B9A\u9700\u8981\uFF09" : "package.json not found (not required for every repository)" });
  }
  try {
    const files = await scanLocalRepository(root, []);
    results.push({ ok: files.length > 0, label: locale === "zh-CN" ? "\u4ED3\u5E93\u8BFB\u53D6" : "Repository scan", details: locale === "zh-CN" ? `\u53D1\u73B0 ${files.length} \u4E2A\u6587\u4EF6\u6761\u76EE` : `${files.length} file entries found` });
  } catch (error) {
    results.push({ ok: false, label: locale === "zh-CN" ? "\u4ED3\u5E93\u8BFB\u53D6" : "Repository scan", details: error instanceof Error ? error.message : String(error) });
  }
  const envPath = import_node_path2.default.join(root, "apps", "web", ".env.local");
  try {
    const env = await (0, import_promises2.readFile)(envPath, "utf8");
    const configured = /^GITHUB_TOKEN=\S+/m.test(env) && !/replace_me|你的/.test(env);
    results.push({ ok: configured, label: locale === "zh-CN" ? "GitHub \u8BBF\u95EE\u4EE4\u724C" : "GitHub token", details: configured ? locale === "zh-CN" ? "\u5DF2\u914D\u7F6E\uFF08\u5185\u5BB9\u4E0D\u4F1A\u663E\u793A\uFF09" : "Configured (value hidden)" : locale === "zh-CN" ? "\u672A\u914D\u7F6E\uFF1B\u516C\u5F00\u4ED3\u5E93\u548C\u672C\u5730\u5206\u6790\u4ECD\u53EF\u4F7F\u7528" : "Not configured; public and local analysis still work" });
  } catch {
    results.push({ ok: true, label: locale === "zh-CN" ? "GitHub \u8BBF\u95EE\u4EE4\u724C" : "GitHub token", details: locale === "zh-CN" ? "\u672A\u914D\u7F6E\uFF1B\u8FD9\u662F\u53EF\u9009\u9879" : "Not configured; this is optional" });
  }
  if (options.network) {
    try {
      const response = await fetch("https://github.com", { method: "HEAD", signal: AbortSignal.timeout(8e3) });
      results.push({ ok: response.ok || response.status < 500, label: locale === "zh-CN" ? "GitHub \u7F51\u7EDC" : "GitHub network", details: `HTTP ${response.status}` });
    } catch (error) {
      results.push({ ok: false, label: locale === "zh-CN" ? "GitHub \u7F51\u7EDC" : "GitHub network", details: error instanceof Error ? error.message : String(error) });
    }
  }
  import_node_process2.default.stdout.write(`${locale === "zh-CN" ? "AgentLint \u73AF\u5883\u68C0\u67E5" : "AgentLint doctor"}
${"=".repeat(28)}
`);
  for (const result of results) import_node_process2.default.stdout.write(`${result.ok ? "\u2713" : "\u2717"} ${result.label}: ${result.details}
`);
  if (results.some((result) => !result.ok && !result.label.includes("\u4EE4\u724C") && !result.label.includes("token"))) import_node_process2.default.exitCode = 1;
});
void program2.parseAsync(import_node_process2.default.argv).catch((error) => {
  import_node_process2.default.stderr.write(`AgentLint failed: ${error instanceof Error ? error.message : String(error)}
`);
  import_node_process2.default.exitCode = 2;
});
function normalizeLocale(value) {
  return /^zh/i.test(value) ? "zh-CN" : "en-US";
}
function formatReport(format, report, locale) {
  if (format === "json") return JSON.stringify(report, null, 2);
  if (format === "markdown" || format === "md") return renderMarkdownReport(report, locale);
  if (format === "sarif") return renderSarifReport(report, locale);
  if (format === "github") return renderGitHubAnnotations(report, locale);
  if (format !== "pretty") throw new Error(locale === "zh-CN" ? `\u672A\u77E5\u683C\u5F0F\u201C${format}\u201D\u3002\u53EF\u7528 pretty\u3001json\u3001markdown\u3001sarif \u6216 github\u3002` : `Unknown format \u201C${format}\u201D. Use pretty, json, markdown, sarif or github.`);
  return renderPrettyReport(report, locale);
}
function shouldFail(level, report, maxWarnings, locale) {
  if (maxWarnings !== void 0 && report.summary.warnings > maxWarnings) return true;
  const severities = report.findings.map((finding) => finding.severity);
  if (level === "never") return false;
  if (level === "warning") return severities.some((severity) => severity === "error" || severity === "warning");
  if (level === "error") return severities.includes("error");
  throw new Error(locale === "zh-CN" ? `\u672A\u77E5 --fail-on \u7EA7\u522B\u201C${level}\u201D\u3002\u53EF\u7528 error\u3001warning \u6216 never\u3002` : `Unknown --fail-on level \u201C${level}\u201D. Use error, warning or never.`);
}
function collect(value, previous) {
  return [...previous, value];
}
function parseInteger(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error("--max-warnings must be a non-negative integer.");
  return parsed;
}
function mergeCliRules(config, values, locale) {
  const rules = { ...config.rules ?? {} };
  for (const value of values) {
    const separator = value.lastIndexOf("=");
    if (separator <= 0) throw new Error(locale === "zh-CN" ? `\u65E0\u6548 --rule\u201C${value}\u201D\uFF0C\u8BF7\u4F7F\u7528 rule-id=error|warning|info|off\u3002` : `Invalid --rule \u201C${value}\u201D.`);
    const ruleId = value.slice(0, separator);
    const severity = value.slice(separator + 1);
    if (!["error", "warning", "info", "off"].includes(severity)) throw new Error(`Invalid severity \u201C${severity}\u201D for ${ruleId}.`);
    rules[ruleId] = severity;
  }
  return { ...config, rules, locale };
}
async function loadPlugins(modules) {
  const plugins = [];
  for (const modulePath of modules) {
    const resolved = modulePath.startsWith(".") || modulePath.startsWith("/") ? (0, import_node_url.pathToFileURL)(import_node_path2.default.resolve(modulePath)).href : modulePath;
    const imported = await import(resolved);
    const plugin = imported.default ?? imported.plugin;
    if (!plugin?.name || typeof plugin.analyze !== "function") throw new Error(`Invalid AgentLint plugin: ${modulePath}`);
    plugins.push(plugin);
  }
  return plugins;
}
async function applySafeFixes(root, report) {
  const edits = report.findings.flatMap((finding) => finding.fix?.safe ? finding.fix.edits : []);
  const grouped = /* @__PURE__ */ new Map();
  for (const edit of edits) {
    const existing = grouped.get(edit.file) ?? [];
    if (!existing.some((item) => item.line === edit.line && item.replacement === edit.replacement)) existing.push(edit);
    grouped.set(edit.file, existing);
  }
  let applied = 0;
  for (const [relativeFile, fileEdits] of grouped) {
    const absoluteFile = import_node_path2.default.resolve(root, relativeFile);
    if (!absoluteFile.startsWith(`${import_node_path2.default.resolve(root)}${import_node_path2.default.sep}`) && absoluteFile !== import_node_path2.default.resolve(root)) continue;
    const content = await (0, import_promises2.readFile)(absoluteFile, "utf8");
    const newline = content.includes("\r\n") ? "\r\n" : "\n";
    const lines = content.split(/\r?\n/);
    for (const edit of [...fileEdits].sort((a, b) => b.line - a.line)) {
      if (edit.line < 1 || edit.line > lines.length || lines[edit.line - 1] === edit.replacement) continue;
      lines[edit.line - 1] = edit.replacement;
      applied += 1;
    }
    await (0, import_promises2.writeFile)(absoluteFile, lines.join(newline), "utf8");
  }
  return applied;
}
async function writeGitHubMetadata(report, locale) {
  if (import_node_process2.default.env.GITHUB_STEP_SUMMARY) await (0, import_promises2.writeFile)(import_node_process2.default.env.GITHUB_STEP_SUMMARY, renderMarkdownReport(report, locale), { encoding: "utf8", flag: "a" });
  if (import_node_process2.default.env.GITHUB_OUTPUT) await (0, import_promises2.writeFile)(import_node_process2.default.env.GITHUB_OUTPUT, [`score=${report.score}`, `grade=${report.grade}`, `errors=${report.summary.errors}`, `warnings=${report.summary.warnings}`, `suggestions=${report.summary.suggestions}`, `fixable=${report.summary.fixable}`].join("\n") + "\n", { encoding: "utf8", flag: "a" });
}
async function upsertPullRequestComment(report, diffMarkdown, locale) {
  const token = import_node_process2.default.env.GITHUB_TOKEN;
  const repository = import_node_process2.default.env.GITHUB_REPOSITORY;
  const eventPath = import_node_process2.default.env.GITHUB_EVENT_PATH;
  if (!token || !repository || !eventPath) throw new Error(locale === "zh-CN" ? "PR \u8BC4\u8BBA\u9700\u8981 GITHUB_TOKEN\u3001GITHUB_REPOSITORY \u548C GITHUB_EVENT_PATH\u3002" : "PR comments require GITHUB_TOKEN, GITHUB_REPOSITORY and GITHUB_EVENT_PATH.");
  const event = JSON.parse(await (0, import_promises2.readFile)(eventPath, "utf8"));
  const number = event.pull_request?.number;
  if (!number) return;
  const marker = "<!-- agentlint-report -->";
  const body = `${marker}
${renderMarkdownReport(report, locale)}${diffMarkdown ? `
${diffMarkdown}` : ""}`.slice(0, 6e4);
  const headers = { accept: "application/vnd.github+json", authorization: `Bearer ${token}`, "content-type": "application/json", "user-agent": "agentlint-action/0.4", "x-github-api-version": "2022-11-28" };
  const list = await fetch(`https://api.github.com/repos/${repository}/issues/${number}/comments?per_page=100`, { headers });
  if (!list.ok) throw new Error(`GitHub comments API returned ${list.status}`);
  const comments = await list.json();
  const existing = comments.find((comment) => comment.body?.includes(marker));
  const url = existing ? `https://api.github.com/repos/${repository}/issues/comments/${existing.id}` : `https://api.github.com/repos/${repository}/issues/${number}/comments`;
  const response = await fetch(url, { method: existing ? "PATCH" : "POST", headers, body: JSON.stringify({ body }) });
  if (!response.ok) throw new Error(`GitHub comment write returned ${response.status}`);
}
async function createIfMissing(filePath, content, force) {
  if (!force) {
    try {
      await (0, import_promises2.access)(filePath);
      return [];
    } catch {
    }
  }
  await (0, import_promises2.writeFile)(filePath, content, "utf8");
  return [filePath];
}
function starterConfig(locale) {
  return `${JSON.stringify({ $schema: "https://raw.githubusercontent.com/valseeee/agentlint/main/docs/agentlint.schema.json", locale, maxInstructionTokens: 4e3, duplicateSimilarity: 0.88, ignore: ["fixtures/**"], rules: { "security/*": "error", "efficiency/near-duplicate-instruction": "info" } }, null, 2)}
`;
}
function starterAgents(locale) {
  return locale === "zh-CN" ? `# \u4ED3\u5E93\u6307\u4EE4

## \u5B89\u88C5

- \u4F7F\u7528\u4ED3\u5E93\u9501\u6587\u4EF6\u6307\u5B9A\u7684\u5305\u7BA1\u7406\u5668\u5B89\u88C5\u4F9D\u8D56\u3002

## \u9A8C\u8BC1

- \u63D0\u4EA4\u4FEE\u6539\u524D\u8FD0\u884C\u4ED3\u5E93\u7684 lint\u3001\u6D4B\u8BD5\u548C\u6784\u5EFA\u547D\u4EE4\u3002
- \u4F18\u5148\u8FD0\u884C\u6700\u5C0F\u76F8\u5173\u6D4B\u8BD5\uFF1B\u4FEE\u6539\u5171\u4EAB\u6216\u9AD8\u98CE\u9669\u4EE3\u7801\u540E\u518D\u8FD0\u884C\u5B8C\u6574\u6D4B\u8BD5\u3002

## \u534F\u4F5C\u7EA6\u5B9A

- \u4FDD\u6301\u4FEE\u6539\u805A\u7126\uFF0C\u5E76\u9075\u5FAA\u73B0\u6709\u67B6\u6784\u4E0E\u547D\u540D\u89C4\u8303\u3002
- \u672A\u7ECF\u660E\u786E\u786E\u8BA4\uFF0C\u4E0D\u5F97\u6CC4\u9732\u5BC6\u94A5\u3001\u4FEE\u6539\u751F\u4EA7\u6570\u636E\u3001\u6539\u5199\u8FDC\u7A0B Git \u5386\u53F2\u6216\u6267\u884C\u7834\u574F\u6027\u64CD\u4F5C\u3002
- \u884C\u4E3A\u6216\u516C\u5171 API \u53D1\u751F\u53D8\u5316\u65F6\u66F4\u65B0\u6587\u6863\u3002
` : `# Repository instructions

## Setup

- Install dependencies with the package manager indicated by the repository lockfile.

## Validation

- Run the repository's lint, test and build commands before submitting changes.
- Prefer the smallest relevant test first, then run the full suite for shared or high-risk code.

## Working agreements

- Keep changes focused and follow the existing architecture and naming conventions.
- Never expose secrets, modify production data, rewrite remote Git history or perform destructive operations without explicit confirmation.
- Update documentation when behavior or public APIs change.
`;
}
/*! Bundled license information:

is-extglob/index.js:
  (*!
   * is-extglob <https://github.com/jonschlinkert/is-extglob>
   *
   * Copyright (c) 2014-2016, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

is-glob/index.js:
  (*!
   * is-glob <https://github.com/jonschlinkert/is-glob>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   *)

is-number/index.js:
  (*!
   * is-number <https://github.com/jonschlinkert/is-number>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Released under the MIT License.
   *)

to-regex-range/index.js:
  (*!
   * to-regex-range <https://github.com/micromatch/to-regex-range>
   *
   * Copyright (c) 2015-present, Jon Schlinkert.
   * Released under the MIT License.
   *)

fill-range/index.js:
  (*!
   * fill-range <https://github.com/jonschlinkert/fill-range>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

queue-microtask/index.js:
  (*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)

run-parallel/index.js:
  (*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
*/
