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

goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.peek = function (a) {
    return a[a.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function (a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function (a, b, c) {
    c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
    if (goog.isString(a)) {
        return goog.isString(b) && 1 == b.length ? a.indexOf(b, c) : -1
    }
    for (; c < a.length; c++) {
        if (c in a && a[c] === b) {
            return c
        }
    }
    return -1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function (a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c)
} : function (a, b, c) {
    c = null == c ? a.length - 1 : c;
    0 > c && (c = Math.max(0, a.length + c));
    if (goog.isString(a)) {
        return goog.isString(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1
    }
    for (; 0 <= c; c--) {
        if (c in a && a[c] === b) {
            return c
        }
    }
    return -1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function (a, b, c) {
    goog.asserts.assert(null != a.length);
    goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function (a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) {
        f in e && b.call(c, e[f], f, a)
    }
};
goog.array.forEachRight = function (a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1; 0 <= d; --d) {
        d in e && b.call(c, e[d], d, a)
    }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function (a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function (a, b, c) {
    for (var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0; h < d; h++) {
        if (h in g) {
            var k = g[h];
            b.call(c, k, h, a) && (e[f++] = k)
        }
    }
    return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function (a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function (a, b, c) {
    for (var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0; g < d; g++) {
        g in f && (e[g] = b.call(c, f[g], g, a))
    }
    return e
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.reduce ? function (a, b, c, d) {
    goog.asserts.assert(null != a.length);
    d && (b = goog.bind(b, d));
    return goog.array.ARRAY_PROTOTYPE_.reduce.call(a, b, c)
} : function (a, b, c, d) {
    var e = c;
    goog.array.forEach(a, function (c, g) {
        e = b.call(d, e, c, g, a)
    });
    return e
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.reduceRight ? function (a, b, c, d) {
    goog.asserts.assert(null != a.length);
    d && (b = goog.bind(b, d));
    return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(a, b, c)
} : function (a, b, c, d) {
    var e = c;
    goog.array.forEachRight(a, function (c, g) {
        e = b.call(d, e, c, g, a)
    });
    return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function (a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function (a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) {
        if (f in e && b.call(c, e[f], f, a)) {
            return !0
        }
    }
    return !1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function (a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function (a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) {
        if (f in e && !b.call(c, e[f], f, a)) {
            return !1
        }
    }
    return !0
};
goog.array.count = function (a, b, c) {
    var d = 0;
    goog.array.forEach(a, function (a, f, g) {
        b.call(c, a, f, g) && ++d
    }, c);
    return d
};
goog.array.find = function (a, b, c) {
    b = goog.array.findIndex(a, b, c);
    return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function (a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) {
        if (f in e && b.call(c, e[f], f, a)) {
            return f
        }
    }
    return -1
};
goog.array.findRight = function (a, b, c) {
    b = goog.array.findIndexRight(a, b, c);
    return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function (a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1; 0 <= d; d--) {
        if (d in e && b.call(c, e[d], d, a)) {
            return d
        }
    }
    return -1
};
goog.array.contains = function (a, b) {
    return 0 <= goog.array.indexOf(a, b)
};
goog.array.isEmpty = function (a) {
    return 0 == a.length
};
goog.array.clear = function (a) {
    if (!goog.isArray(a)) {
        for (var b = a.length - 1; 0 <= b; b--) {
            delete a[b]
        }
    }
    a.length = 0
};
goog.array.insert = function (a, b) {
    goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function (a, b, c) {
    goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function (a, b, c) {
    goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function (a, b, c) {
    var d;
    2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function (a, b) {
    var c = goog.array.indexOf(a, b),
        d;
    (d = 0 <= c) && goog.array.removeAt(a, c);
    return d
};
goog.array.removeAt = function (a, b) {
    goog.asserts.assert(null != a.length);
    return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length
};
goog.array.removeIf = function (a, b, c) {
    b = goog.array.findIndex(a, b, c);
    return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1
};
goog.array.concat = function (a) {
    return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function (a) {
    var b = a.length;
    if (0 < b) {
        for (var c = Array(b), d = 0; d < b; d++) {
            c[d] = a[d]
        }
        return c
    }
    return []
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function (a, b) {
    for (var c = 1; c < arguments.length; c++) {
        var d = arguments[c],
            e;
        if (goog.isArray(d) || (e = goog.isArrayLike(d)) && Object.prototype.hasOwnProperty.call(d, "callee")) {
            a.push.apply(a, d)
        } else {
            if (e) {
                for (var f = a.length, g = d.length, h = 0; h < g; h++) {
                    a[f + h] = d[h]
                }
            } else {
                a.push(d)
            }
        }
    }
};
goog.array.splice = function (a, b, c, d) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function (a, b, c) {
    goog.asserts.assert(null != a.length);
    return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function (a, b, c) {
    b = b || a;
    var d = function (a) {
        return goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g
    };
    c = c || d;
    for (var d = {}, e = 0, f = 0; f < a.length;) {
        var g = a[f++],
            h = c(g);
        Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, b[e++] = g)
    }
    b.length = e
};
goog.array.binarySearch = function (a, b, c) {
    return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function (a, b, c) {
    return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function (a, b, c, d, e) {
    for (var f = 0, g = a.length, h; f < g;) {
        var k = f + g >> 1,
            l;
        l = c ? b.call(e, a[k], k, a) : b(d, a[k]);
        0 < l ? f = k + 1 : (g = k, h = !l)
    }
    return h ? f : ~f
};
goog.array.sort = function (a, b) {
    goog.asserts.assert(null != a.length);
    goog.array.ARRAY_PROTOTYPE_.sort.call(a, b || goog.array.defaultCompare)
};
goog.array.stableSort = function (a, b) {
    for (var c = 0; c < a.length; c++) {
        a[c] = {
            index: c,
            value: a[c]
        }
    }
    var d = b || goog.array.defaultCompare;
    goog.array.sort(a, function (a, b) {
        return d(a.value, b.value) || a.index - b.index
    });
    for (c = 0; c < a.length; c++) {
        a[c] = a[c].value
    }
};
goog.array.sortObjectsByKey = function (a, b, c) {
    var d = c || goog.array.defaultCompare;
    goog.array.sort(a, function (a, c) {
        return d(a[b], c[b])
    })
};
goog.array.isSorted = function (a, b, c) {
    b = b || goog.array.defaultCompare;
    for (var d = 1; d < a.length; d++) {
        var e = b(a[d - 1], a[d]);
        if (0 < e || 0 == e && c) {
            return !1
        }
    }
    return !0
};
goog.array.equals = function (a, b, c) {
    if (!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
        return !1
    }
    var d = a.length;
    c = c || goog.array.defaultCompareEquality;
    for (var e = 0; e < d; e++) {
        if (!c(a[e], b[e])) {
            return !1
        }
    }
    return !0
};
goog.array.compare = function (a, b, c) {
    return goog.array.equals(a, b, c)
};
goog.array.compare3 = function (a, b, c) {
    c = c || goog.array.defaultCompare;
    for (var d = Math.min(a.length, b.length), e = 0; e < d; e++) {
        var f = c(a[e], b[e]);
        if (0 != f) {
            return f
        }
    }
    return goog.array.defaultCompare(a.length, b.length)
};
goog.array.defaultCompare = function (a, b) {
    return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function (a, b) {
    return a === b
};
goog.array.binaryInsert = function (a, b, c) {
    c = goog.array.binarySearch(a, b, c);
    return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1
};
goog.array.binaryRemove = function (a, b, c) {
    b = goog.array.binarySearch(a, b, c);
    return 0 <= b ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function (a, b, c) {
    for (var d = {}, e = 0; e < a.length; e++) {
        var f = a[e],
            g = b.call(c, f, e, a);
        goog.isDef(g) && (d[g] || (d[g] = [])).push(f)
    }
    return d
};
goog.array.toObject = function (a, b, c) {
    var d = {};
    goog.array.forEach(a, function (e, f) {
        d[b.call(c, e, f, a)] = e
    });
    return d
};
goog.array.range = function (a, b, c) {
    var d = [],
        e = 0,
        f = a;
    c = c || 1;
    void 0 !== b && (e = a, f = b);
    if (0 > c * (f - e)) {
        return []
    }
    if (0 < c) {
        for (a = e; a < f; a += c) {
            d.push(a)
        }
    } else {
        for (a = e; a > f; a += c) {
            d.push(a)
        }
    }
    return d
};
goog.array.repeat = function (a, b) {
    for (var c = [], d = 0; d < b; d++) {
        c[d] = a
    }
    return c
};
goog.array.flatten = function (a) {
    for (var b = [], c = 0; c < arguments.length; c++) {
        var d = arguments[c];
        goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
    }
    return b
};
goog.array.rotate = function (a, b) {
    goog.asserts.assert(null != a.length);
    a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
    return a
};
goog.array.moveItem = function (a, b, c) {
    goog.asserts.assert(0 <= b && b < a.length);
    goog.asserts.assert(0 <= c && c < a.length);
    b = goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1);
    goog.array.ARRAY_PROTOTYPE_.splice.call(a, c, 0, b[0])
};
goog.array.zip = function (a) {
    if (!arguments.length) {
        return []
    }
    for (var b = [], c = 0;; c++) {
        for (var d = [], e = 0; e < arguments.length; e++) {
            var f = arguments[e];
            if (c >= f.length) {
                return b
            }
            d.push(f[c])
        }
        b.push(d)
    }
};
goog.array.shuffle = function (a, b) {
    for (var c = b || Math.random, d = a.length - 1; 0 < d; d--) {
        var e = Math.floor(c() * (d + 1)),
            f = a[d];
        a[d] = a[e];
        a[e] = f
    }
};
