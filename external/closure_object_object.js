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

goog.object = {};
goog.object.forEach = function (a, b, c) {
    for (var d in a) {
        b.call(c, a[d], d, a)
    }
};
goog.object.filter = function (a, b, c) {
    var d = {}, e;
    for (e in a) {
        b.call(c, a[e], e, a) && (d[e] = a[e])
    }
    return d
};
goog.object.map = function (a, b, c) {
    var d = {}, e;
    for (e in a) {
        d[e] = b.call(c, a[e], e, a)
    }
    return d
};
goog.object.some = function (a, b, c) {
    for (var d in a) {
        if (b.call(c, a[d], d, a)) {
            return !0
        }
    }
    return !1
};
goog.object.every = function (a, b, c) {
    for (var d in a) {
        if (!b.call(c, a[d], d, a)) {
            return !1
        }
    }
    return !0
};
goog.object.getCount = function (a) {
    var b = 0,
        c;
    for (c in a) {
        b++
    }
    return b
};
goog.object.getAnyKey = function (a) {
    for (var b in a) {
        return b
    }
};
goog.object.getAnyValue = function (a) {
    for (var b in a) {
        return a[b]
    }
};
goog.object.contains = function (a, b) {
    return goog.object.containsValue(a, b)
};
goog.object.getValues = function (a) {
    var b = [],
        c = 0,
        d;
    for (d in a) {
        b[c++] = a[d]
    }
    return b
};
goog.object.getKeys = function (a) {
    var b = [],
        c = 0,
        d;
    for (d in a) {
        b[c++] = d
    }
    return b
};
goog.object.getValueByKeys = function (a, b) {
    for (var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1; c < d.length && (a = a[d[c]], goog.isDef(a)); c++) {}
    return a
};
goog.object.containsKey = function (a, b) {
    return b in a
};
goog.object.containsValue = function (a, b) {
    for (var c in a) {
        if (a[c] == b) {
            return !0
        }
    }
    return !1
};
goog.object.findKey = function (a, b, c) {
    for (var d in a) {
        if (b.call(c, a[d], d, a)) {
            return d
        }
    }
};
goog.object.findValue = function (a, b, c) {
    return (b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function (a) {
    for (var b in a) {
        return !1
    }
    return !0
};
goog.object.clear = function (a) {
    for (var b in a) {
        delete a[b]
    }
};
goog.object.remove = function (a, b) {
    var c;
    (c = b in a) && delete a[b];
    return c
};
goog.object.add = function (a, b, c) {
    if (b in a) {
        throw Error('The object already contains the key "' + b + '"');
    }
    goog.object.set(a, b, c)
};
goog.object.get = function (a, b, c) {
    return b in a ? a[b] : c
};
goog.object.set = function (a, b, c) {
    a[b] = c
};
goog.object.setIfUndefined = function (a, b, c) {
    return b in a ? a[b] : a[b] = c
};
goog.object.clone = function (a) {
    var b = {}, c;
    for (c in a) {
        b[c] = a[c]
    }
    return b
};
goog.object.unsafeClone = function (a) {
    var b = goog.typeOf(a);
    if ("object" == b || "array" == b) {
        if (a.clone) {
            return a.clone()
        }
        var b = "array" == b ? [] : {}, c;
        for (c in a) {
            b[c] = goog.object.unsafeClone(a[c])
        }
        return b
    }
    return a
};
goog.object.transpose = function (a) {
    var b = {}, c;
    for (c in a) {
        b[a[c]] = c
    }
    return b
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function (a, b) {
    for (var c, d, e = 1; e < arguments.length; e++) {
        d = arguments[e];
        for (c in d) {
            a[c] = d[c]
        }
        for (var f = 0; f < goog.object.PROTOTYPE_FIELDS_.length; f++) {
            c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
        }
    }
};
goog.object.create = function (a) {
    var b = arguments.length;
    if (1 == b && goog.isArray(arguments[0])) {
        return goog.object.create.apply(null, arguments[0])
    }
    if (b % 2) {
        throw Error("Uneven number of arguments");
    }
    for (var c = {}, d = 0; d < b; d += 2) {
        c[arguments[d]] = arguments[d + 1]
    }
    return c
};
goog.object.createSet = function (a) {
    var b = arguments.length;
    if (1 == b && goog.isArray(arguments[0])) {
        return goog.object.createSet.apply(null, arguments[0])
    }
    for (var c = {}, d = 0; d < b; d++) {
        c[arguments[d]] = !0
    }
    return c
};
goog.object.createImmutableView = function (a) {
    var b = a;
    Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
    return b
};
goog.object.isImmutableView = function (a) {
    return !!Object.isFrozen && Object.isFrozen(a)
};
