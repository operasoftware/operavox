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

goog.math = {};
goog.math.randomInt = function (a) {
    return Math.floor(Math.random() * a)
};
goog.math.uniformRandom = function (a, b) {
    return a + Math.random() * (b - a)
};
goog.math.clamp = function (a, b, c) {
    return Math.min(Math.max(a, b), c)
};
goog.math.modulo = function (a, b) {
    var c = a % b;
    return 0 > c * b ? c + b : c
};
goog.math.lerp = function (a, b, c) {
    return a + c * (b - a)
};
goog.math.nearlyEquals = function (a, b, c) {
    return Math.abs(a - b) <= (c || 1E-6)
};
goog.math.standardAngle = function (a) {
    return goog.math.modulo(a, 360)
};
goog.math.toRadians = function (a) {
    return a * Math.PI / 180
};
goog.math.toDegrees = function (a) {
    return 180 * a / Math.PI
};
goog.math.angleDx = function (a, b) {
    return b * Math.cos(goog.math.toRadians(a))
};
goog.math.angleDy = function (a, b) {
    return b * Math.sin(goog.math.toRadians(a))
};
goog.math.angle = function (a, b, c, d) {
    return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(d - b, c - a)))
};
goog.math.angleDifference = function (a, b) {
    var c = goog.math.standardAngle(b) - goog.math.standardAngle(a);
    180 < c ? c -= 360 : -180 >= c && (c = 360 + c);
    return c
};
goog.math.sign = function (a) {
    return 0 == a ? 0 : 0 > a ? -1 : 1
};
goog.math.longestCommonSubsequence = function (a, b, c, d) {
    c = c || function (a, b) {
        return a == b
    };
    d = d || function (b, c) {
        return a[b]
    };
    for (var e = a.length, f = b.length, g = [], h = 0; h < e + 1; h++) {
        g[h] = [], g[h][0] = 0
    }
    for (var k = 0; k < f + 1; k++) {
        g[0][k] = 0
    }
    for (h = 1; h <= e; h++) {
        for (k = 1; k <= f; k++) {
            c(a[h - 1], b[k - 1]) ? g[h][k] = g[h - 1][k - 1] + 1 : g[h][k] = Math.max(g[h - 1][k], g[h][k - 1])
        }
    }
    for (var l = [], h = e, k = f; 0 < h && 0 < k;) {
        c(a[h - 1], b[k - 1]) ? (l.unshift(d(h - 1, k - 1)), h--, k--) : g[h - 1][k] > g[h][k - 1] ? h-- : k--
    }
    return l
};
goog.math.sum = function (a) {
    return goog.array.reduce(arguments, function (a, c) {
        return a + c
    }, 0)
};
goog.math.average = function (a) {
    return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.sampleVariance = function (a) {
    var b = arguments.length;
    if (2 > b) {
        return 0
    }
    var c = goog.math.average.apply(null, arguments);
    return goog.math.sum.apply(null, goog.array.map(arguments, function (a) {
        return Math.pow(a - c, 2)
    })) / (b - 1)
};
goog.math.standardDeviation = function (a) {
    return Math.sqrt(goog.math.sampleVariance.apply(null, arguments))
};
goog.math.isInt = function (a) {
    return isFinite(a) && 0 == a % 1
};
goog.math.isFiniteNumber = function (a) {
    return isFinite(a) && !isNaN(a)
};
goog.math.safeFloor = function (a, b) {
    goog.asserts.assert(!goog.isDef(b) || 0 < b);
    return Math.floor(a + (b || 2E-15))
};
goog.math.safeCeil = function (a, b) {
    goog.asserts.assert(!goog.isDef(b) || 0 < b);
    return Math.ceil(a - (b || 2E-15))
};
