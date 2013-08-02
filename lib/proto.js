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