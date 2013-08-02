;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("mitsubishi/lib/main.js", function(exports, require, module){
if (typeof require !== 'undefined') {
	var mixinInstance = require('./instance.js');
	var mixinProto = require('./proto.js');
}

var checkIsArray = function (arr) {
	return (arr instanceof Array);
};

/**
 * Mix in PROTOTYPE properties from parent INSTANTIATED class(es) to child class.
 *
 * @method protoPropsFromInstantiated
 *
 * @param  {Class} child class that will be decorated
 * @param  {Class|Array} parent class(es) (can be static or dynamic) that will be giving their properties to the new static class
 *
 * @return {Object}             decorated child static class
 */
var protoPropsFromInstantiated = function(childClass, parents) {
	return (checkIsArray(parents)) ? mixinProto.propsMulti(childClass, parents) : mixinProto.propsSingle(childClass, parents);
};


/**
 * Mix in PROTOTYPE properties from parent UNinstantiated class(es) to child class.
 *
 * @method protoPropsFromInstantiated
 *
 * @param  {Class} child class that will be decorated
 * @param  {Class|Array} parent class(es) (can be static or dynamic) that will be giving their properties to the new static class
 *
 * @return {Object}             decorated child static class
 */
var protoPropsFromUninstantiated = function(childClass, parents) {
	return (checkIsArray(parents)) ? mixinProto.propsUninstantiatedMulti(childClass, parents) : mixinProto.propsUninstantiatedSingle(childClass, parents);
};



/**
 * Mix in INSTANCE properties from parent class(es) to child class.
 *
 * @method instancePropsFromInstantiated
 *
 * @param  {Class} child class that will be decorated
 * @param  {Class|Array} parent class(es) (can be static or dynamic) that will be giving their properties to the new static class
 *
 * @return {Object}             decorated child static class
 */
var instancePropsFromInstantiated = function(childClass, parents) {
	return (checkIsArray(parents)) ? mixinInstance.instanceMulti(childClass, parents) : mixinInstance.instanceSingle(childClass, parents);
};


/**
 * mix in instance or prototype methods from classes
 *
 * @class mitsubishi
 * @static
 */
var mitsubishi = {
	"instancePropsFromInstantiated": instancePropsFromInstantiated,
	"protoPropsFromInstantiated": protoPropsFromInstantiated,
	"protoPropsFromUninstantiated": protoPropsFromUninstantiated
};

// console.error('mitsubishi', mitsubishi);

if (typeof module !== 'undefined' && module.exports) {
	module.exports = mitsubishi;
}
});
require.register("mitsubishi/lib/instance.js", function(exports, require, module){
/**
 * Check class is static (ie object literal vs constructor fn obj)
 *
 * @method validObjectLiteral
 *
 * @param  {Object} item the class/js object to check
 *
 * @return {Object}      boolean
 */
var validObjectLiteral = function (item) {
	return (item && item.constructor === Object.prototype.constructor);
};

/**
 * copy hasOwn properties from one class to another
 *
 * @method hasOwnPropsMixin
 *
 * @param  {Object} child  the object that you want to gain the extra properties
 * @param  {Object} parent the object that has the properties to give
 *
 * @return {Object}        the decorated child
 */
var hasOwnPropsMixin = function (child, parent) {
	var __hasProp = {}.hasOwnProperty;
	// copy instance properties from parent to child
	for (var key in parent) {
		if (__hasProp.call(parent, key)) {
			child[key] = parent[key];
		}
	}
	return child;
};

/**
 * Mix in INSTANCE properties from one class to another class (accepts both dynamic and static classes). Will mix in prototype properties if a dynamic class is passed in.
 *
 * @method instanceSingle
 *
 * @param  {Class} childClass   the child class (dynamic or static) to be decorated
 * @param  {Class} parentClass  the parent class (dynamic or static) that has the properties to be mixed in to the child
 *
 * @return {Class}             the decorated child class
 */
var instanceSingle = function (childClass, parentClass) {
	return hasOwnPropsMixin(childClass, parentClass);
	// childClass = hasOwnPropsMixin(childClass, parentClass);
	// return validObjectLiteral(staticProps) ? hasOwnPropsMixin(childClass, staticProps) : childClass;
};

/**
 * Mix in INSTANCE properties from array of parent classes to a child class. Basically just a for loop around mitsubshi.instanceSingle().
 *
 * @method instanceMulti
 *
 * @param  {Class} child class that will be decorated
 * @param  {Array} arrayParents array of parent classes (can be static or dynamic) that will be giving their properties to the new static class
 *
 * @return {Object}             decorated child static class
 */
var instanceMulti = function(childClass, arrayParents) {
	for (var i = arrayParents.length - 1; i >= 0; i--) {
		instanceSingle(childClass, arrayParents[i]);
	}
	return childClass;
};

/**
 * mix in instance properties from classes
 *
 * @class mixinInstance
 * @static
 */
var mixinInstance = {
	"validObjectLiteral": validObjectLiteral,
	"hasOwnPropsMixin": hasOwnPropsMixin,
	"instanceSingle": instanceSingle,
	"instanceMulti": instanceMulti
};

if (typeof module !== 'undefined' && module.exports) {
	module.exports = mixinInstance;
}
});
require.register("mitsubishi/lib/proto.js", function(exports, require, module){
/**
 * Check whether an class is static or dynamic (ie object literal vs constructor fn obj)
 *
 * @method returnPrototypeIfDynamicClass
 *
 * @param  {Object} item the class/js object to check
 *
 * @return {Object}      if a contructor then return its prototpe else return the obj literal unmodified
 */
var returnPrototypeIfDynamicClass = function (item) {
	var objLiteral = (item.constructor === Object.prototype.constructor);
	return objLiteral ? item : item.constructor.prototype;
};

 /**
  * Mix in PROTOTYPE properties from one class to another class (accepts both dynamic and static classes). Will mix in static properties if a static class is passed in, otherwise mixes in prototype methods.
  *
  * @method propsSingle
  *
  * @param  {Class} childClass   the child class (dynamic or static) to be decorated
  * @param  {Class} parentClass  the parent class (dynamic or static) that has the properties to be mixed in to the child
  * @param  {[Object]} staticProps extra properties to mix in
  *
  * @return {Class}             the decorated child class
  */
var propsSingle = function(childClass, parentClass) {

	var objClass = returnPrototypeIfDynamicClass(parentClass);

	for (var key in objClass) {
		childClass[key] = objClass[key];
	}

	return childClass;
};


/**
 * Mix in PROTOTYPE properties from array of INSTANTIATED parent classes to a child class. Basically just a for loop around mitsubshi.propsSingle().
 *
 * @method propsMulti
 *
 * @param  {Class} child class that will be decorated
 * @param  {Array} arrayParents array of parent classes (can be static or dynamic) that will be giving their properties to the new static class
 *
 * @return {Object}             decorated child static class
 */
var propsMulti = function(childClass, arrayParents) {
	for (var i = arrayParents.length - 1; i >= 0; i--) {
		propsSingle(childClass, arrayParents[i]);
	}
	return childClass;
};

/*--------------------------------------
Uninsantiated Dynamic Classes (ie not Obj Literals)
---------------------------------------*/
var returnPrototypeIfUninstantiated = function (item) {
	var objLiteral = item && (item.constructor === Object.prototype.constructor);

	return objLiteral ? item : item.prototype;
};

var propsUninstantiatedSingle = function(childClass, parentClass) {
	var objClass = returnPrototypeIfUninstantiated(parentClass);
	for (var key in objClass) {
		childClass[key] = objClass[key];
	}
	return childClass;
};


/**
 * Mix in PROTOTYPE properties from array of UNinstantiated parent classes to a child class. Basically just a for loop around mitsubshi.propsSingle().
 *
 * @method propsUninstantiatedMulti
 *
 * @param  {Class} child class that will be decorated
 * @param  {Array} arrayParents array of parent classes (can be static or dynamic) that will be giving their properties to the new static class
 *
 * @return {Object}             decorated child static class
 */
var propsUninstantiatedMulti = function(childClass, arrayParents) {
	for (var i = arrayParents.length - 1; i >= 0; i--) {
		propsUninstantiatedSingle(childClass, arrayParents[i]);
	}
	return childClass;
};



/**
 * mix in proto props
 *
 * @class mixinProto
 * @static
 */
var mixinProto = {
	"returnPrototypeIfDynamicClass": returnPrototypeIfDynamicClass,
	"propsSingle": propsSingle,
	"propsMulti": propsMulti,
	"propsUninstantiatedSingle": propsUninstantiatedSingle,
	"propsUninstantiatedMulti": propsUninstantiatedMulti
};

if (typeof module !== 'undefined' && module.exports) {
	module.exports = mixinProto;
}
});
require.alias("mitsubishi/lib/main.js", "mitsubishi/index.js");if (typeof exports == "object") {
  module.exports = require("mitsubishi");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("mitsubishi"); });
} else {
  this["mitsubishi"] = require("mitsubishi");
}})();