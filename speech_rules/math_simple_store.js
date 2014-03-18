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

cvox.MathSimpleStore = function () {
    cvox.MathStore.call(this)
};
goog.inherits(cvox.MathSimpleStore, cvox.MathStore);
cvox.MathSimpleStore.prototype.defineRulesFromMappings = function (a, b, c) {
    for (var d in c) {
        for (var e in c[d]) {
            this.defineRule(a, d + "." + e, '[t] "' + c[d][e] + '"', "self::text()", 'self::text() = "' + b + '"')
        }
    }
};
cvox.MathCompoundStore = function () {
    this.subStores_ = {}
};
goog.addSingletonGetter(cvox.MathCompoundStore);
cvox.MathCompoundStore.prototype.defineRules = function (a, b, c) {
    var d = new cvox.MathSimpleStore;
    d.defineRulesFromMappings(a, b, c);
    this.subStores_[b] = d
};
cvox.MathCompoundStore.prototype.addSymbolRules = function (a) {
    var b = cvox.MathSimpleStore.parseUnicode_(a.key);
    this.defineRules(a.key, b, a.mappings)
};
cvox.MathCompoundStore.prototype.addFunctionRules = function (a) {
    var b = a.names;
    a = a.mappings;
    for (var c = 0, d; d = b[c]; c++) {
        this.defineRules(d, d, a)
    }
};
cvox.MathCompoundStore.prototype.lookupRule = function (a, b) {
    var c = this.subStores_[a.textContent];
    if (c) {
        return c.lookupRule(a, b)
    }
};
cvox.MathCompoundStore.prototype.lookupString = function (a, b) {
    var c = document.createTextNode(a);
    return (c = this.lookupRule(c, b)) ? c.action.components.map(function (a) {
        return a.content.slice(1, -1)
    }).join(" ") : ""
};
cvox.MathCompoundStore.prototype.getDynamicConstraintValues = function () {
    var a = {}, b;
    for (b in this.subStores_) {
        var c = this.subStores_[b].getDynamicConstraintValues(),
            d;
        for (d in c) {
            var e = a[d];
            a[d] = e ? cvox.MathUtil.union(e, c[d]) : c[d]
        }
    }
    return a
};
cvox.MathSimpleStore.parseUnicode_ = function (a) {
    a = parseInt(a, 16);
    if (65536 > a) {
        return String.fromCharCode(a)
    }
    a -= 65536;
    return String.fromCharCode((a >> 10) + 55296, (a & 1023) + 56320)
};
