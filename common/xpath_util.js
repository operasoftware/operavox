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

cvox.XpathUtil = function () {};
cvox.XpathUtil.nameSpaces_ = {
    xhtml: "http://www.w3.org/1999/xhtml",
    mathml: "http://www.w3.org/1998/Math/MathML"
};
cvox.XpathUtil.resolveNameSpace = function (a) {
    return cvox.XpathUtil.nameSpaces_[a] || null
};
cvox.XpathUtil.evalXPath = function (a, b) {
    try {
        var c = b.ownerDocument.evaluate(a, b, cvox.XpathUtil.resolveNameSpace, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)
    } catch (d) {
        return []
    }
    for (var e = [], f = c.iterateNext(); f; f = c.iterateNext()) {
        e.push(f)
    }
    return e
};
cvox.XpathUtil.getLeafNodes = function (a) {
    try {
        var b = a.ownerDocument.evaluate(".//*[count(*)=0]", a, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)
    } catch (c) {
        return []
    }
    a = [];
    for (var d = b.iterateNext(); d; d = b.iterateNext()) {
        a.push(d)
    }
    return a
};
cvox.XpathUtil.xpathSupported = function () {
    return "undefined" == typeof XPathResult ? !1 : !0
};
cvox.XpathUtil.evaluateBoolean = function (a, b) {
    try {
        var c = b.ownerDocument.evaluate(a, b, cvox.XpathUtil.resolveNameSpace, XPathResult.BOOLEAN_TYPE, null)
    } catch (d) {
        return !1
    }
    return c.booleanValue
};
cvox.XpathUtil.evaluateString = function (a, b) {
    try {
        var c = b.ownerDocument.evaluate(a, b, cvox.XpathUtil.resolveNameSpace, XPathResult.STRING_TYPE, null)
    } catch (d) {
        return ""
    }
    return c.stringValue
};
