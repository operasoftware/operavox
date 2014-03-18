// Copyright (c) 2010-2013 Google Inc.
// Copyright (c) 2014 Opera Software ASA.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

cvox.SemanticUtil = function () {};
cvox.SemanticUtil.objectsToKeys = function (a) {
    a = Array.prototype.slice.call(arguments, 0);
    var b = [];
    return b.concat.apply(b, a.map(Object.keys))
};
cvox.SemanticUtil.objectsToValues = function (a) {
    a = Array.prototype.slice.call(arguments, 0);
    var b = [];
    a.forEach(function (a) {
        for (var d in a) {
            b.push(a[d])
        }
    });
    return b
};
cvox.SemanticUtil.unicodeToNumber = function (a) {
    if (!a || 2 < a.length) {
        return null
    }
    if (2 == a.length) {
        var b = a.charCodeAt(0);
        a = a.charCodeAt(1);
        return 55296 <= b && 56319 >= b && !isNaN(a) ? 1024 * (b - 55296) + (a - 56320) + 65536 : null
    }
    return a.charCodeAt(0)
};
cvox.SemanticUtil.numberToUnicode = function (a) {
    return 65536 <= a ? String.fromCharCode((a - 65536) / 1024 + 55296, (a - 65536) % 1024 + 56320) : String.fromCharCode(a)
};
cvox.SemanticUtil.tagName = function (a) {
    return a.tagName.toUpperCase()
};
cvox.SemanticUtil.IGNORETAGS = "MERROR MPHANTOM MSPACE MACTION MALIGNGROUP MALIGNMARK MACTION".split(" ");
cvox.SemanticUtil.EMPTYTAGS = ["MATH", "MROW", "MPADDED", "MSTYLE"];
cvox.SemanticUtil.purgeNodes = function (a) {
    for (var b = [], c = 0, d; d = a[c]; c++) {
        var e = cvox.SemanticUtil.tagName(d); - 1 == cvox.SemanticUtil.IGNORETAGS.indexOf(e) && (-1 != cvox.SemanticUtil.EMPTYTAGS.indexOf(e) && 0 == d.childNodes.length || b.push(d))
    }
    return b
};
