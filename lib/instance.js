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