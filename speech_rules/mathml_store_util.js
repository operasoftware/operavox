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

cvox.MathmlStoreUtil = {};
cvox.MathmlStoreUtil.matchMathjaxToMathml = function (a) {
    return cvox.TraverseMath.getInstance().activeMathmlHost.querySelector("#" + a.id)
};
cvox.MathmlStoreUtil.retrieveMathjaxExtender = function (a) {
    return (a = cvox.MathmlStoreUtil.matchMathjaxToMathml(a)) ? [a] : []
};
cvox.MathmlStoreUtil.retrieveMathjaxLeaf = function (a) {
    return (a = cvox.MathmlStoreUtil.matchMathjaxToMathml(a)) ? [a] : []
};
cvox.MathmlStoreUtil.checkMathjaxTag = function (a, b) {
    var c = cvox.MathmlStoreUtil.matchMathjaxToMathml(a);
    return c && c.tagName.toUpperCase() == b ? [c] : []
};
cvox.MathmlStoreUtil.checkMathjaxMunder = function (a) {
    return cvox.MathmlStoreUtil.checkMathjaxTag(a, "MUNDER")
};
cvox.MathmlStoreUtil.checkMathjaxMover = function (a) {
    return cvox.MathmlStoreUtil.checkMathjaxTag(a, "MOVER")
};
cvox.MathmlStoreUtil.checkMathjaxMsub = function (a) {
    return cvox.MathmlStoreUtil.checkMathjaxTag(a, "MSUB")
};
cvox.MathmlStoreUtil.checkMathjaxMsup = function (a) {
    return cvox.MathmlStoreUtil.checkMathjaxTag(a, "MSUP")
};
cvox.MathmlStoreUtil.nextSeparatorFunction = function (a) {
    if (a) {
        if (a.match(/^\s+$/)) {
            return null
        }
        var b = a.replace(/\s/g, "").split("").filter(function (a) {
            return a
        })
    } else {
        b = [","]
    }
    return function () {
        return 1 < b.length ? b.shift() : b[0]
    }
};
cvox.MathmlStoreUtil.mfencedSeparators = function (a, b) {
    var c = cvox.MathmlStoreUtil.nextSeparatorFunction(b);
    return function () {
        return c ? c() : ""
    }
};
cvox.MathmlStoreUtil.contentIterator = function (a, b) {
    var c = 0 < a.length ? cvox.XpathUtil.evalXPath("../../content/*", a[0]) : [];
    return function () {
        var a = c.shift();
        return b + (a ? a.textContent : "")
    }
};
