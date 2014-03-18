// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function (a, b) {
    b.unshift(a);
    goog.debug.Error.call(this, goog.string.subs.apply(null, b));
    b.shift();
    this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function (a, b, c, d) {
    var e = "Assertion failed";
    if (c) {
        var e = e + (": " + c),
            f = d
    } else {
        a && (e += ": " + a, f = b)
    }
    throw new goog.asserts.AssertionError("" + e, f || []);
};
goog.asserts.assert = function (a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.fail = function (a, b) {
    if (goog.asserts.ENABLE_ASSERTS) {
        throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
    }
};
goog.asserts.assertNumber = function (a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertString = function (a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertFunction = function (a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertObject = function (a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertArray = function (a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertBoolean = function (a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertElement = function (a, b, c) {
    !goog.asserts.ENABLE_ASSERTS || goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT || goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertInstanceof = function (a, b, c, d) {
    !goog.asserts.ENABLE_ASSERTS || a instanceof b || goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
    return a
};
goog.asserts.assertObjectPrototypeIsIntact = function () {
    for (var a in Object.prototype) {
        goog.asserts.fail(a + " should not be enumerable in Object.prototype.")
    }
};
