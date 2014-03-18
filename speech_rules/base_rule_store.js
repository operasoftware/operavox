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

cvox.BaseRuleStore = function () {
    this.customQueries = new cvox.SpeechRuleFunctions.CustomQueries;
    this.customStrings = new cvox.SpeechRuleFunctions.CustomStrings;
    this.contextFunctions = new cvox.SpeechRuleFunctions.ContextFunctions;
    this.speechRules_ = [];
    this.dynamicCstrAttribs = [cvox.SpeechRule.DynamicCstrAttrib.STYLE];
    this.defaultTtsProps = []
};
cvox.BaseRuleStore.prototype.lookupRule = function (a, b) {
    if (!a || a.nodeType != Node.ELEMENT_NODE && a.nodeType != Node.TEXT_NODE) {
        return null
    }
    var c = this.speechRules_.filter(goog.bind(function (c) {
        return this.testDynamicConstraints(b, c) && this.testPrecondition_(a, c)
    }, this));
    return 0 < c.length ? this.pickMostConstraint_(b, c) : null
};
cvox.BaseRuleStore.prototype.defineRule = function (a, b, c, d, e) {
    try {
        var f = cvox.SpeechRule.Action.fromString(c),
            g = Array.prototype.slice.call(arguments, 4),
            h = new cvox.SpeechRule.Precondition(d, g),
            g = {};
        g[cvox.SpeechRule.DynamicCstrAttrib.STYLE] = b;
        var k = new cvox.SpeechRule(a, g, h, f)
    } catch (l) {
        if ("RuleError" == l.name) {
            return console.log("Rule Error ", d, "(" + b + "):", l.message), null
        }
        throw l;
    }
    this.addRule(k);
    return k
};
cvox.BaseRuleStore.prototype.addRule = function (a) {
    this.speechRules_.unshift(a)
};
cvox.BaseRuleStore.prototype.deleteRule = function (a) {
    a = this.speechRules_.indexOf(a); - 1 != a && this.speechRules_.splice(a, 1)
};
cvox.BaseRuleStore.prototype.findRule = function (a) {
    for (var b = 0, c; c = this.speechRules_[b]; b++) {
        if (a(c)) {
            return c
        }
    }
    return null
};
cvox.BaseRuleStore.prototype.findAllRules = function (a) {
    return this.speechRules_.filter(a)
};
cvox.BaseRuleStore.prototype.evaluateDefault = function (a) {
    return [new cvox.NavDescription({
        text: a.textContent
    })]
};
cvox.BaseRuleStore.prototype.removeDuplicates = function (a) {
    for (var b = this.speechRules_.length - 1, c; c = this.speechRules_[b]; b--) {
        c != a && cvox.BaseRuleStore.compareDynamicConstraints_(c.dynamicCstr, a.dynamicCstr) && cvox.BaseRuleStore.comparePreconditions_(c, a) && this.speechRules_.splice(b, 1)
    }
};
cvox.BaseRuleStore.prototype.applyCustomQuery = function (a, b) {
    var c = this.customQueries.lookup(b);
    return c ? c(a) : null
};
cvox.BaseRuleStore.prototype.applySelector = function (a, b) {
    return this.applyCustomQuery(a, b) || cvox.XpathUtil.evalXPath(b, a)
};
cvox.BaseRuleStore.prototype.applyQuery = function (a, b) {
    var c = this.applySelector(a, b);
    return 0 < c.length ? c[0] : null
};
cvox.BaseRuleStore.prototype.applyConstraint = function (a, b) {
    return !!this.applyQuery(a, b) || cvox.XpathUtil.evaluateBoolean(b, a)
};
cvox.BaseRuleStore.prototype.testDynamicConstraints = function (a, b) {
    return Object.keys(a).every(function (c) {
        return a[c] == b.dynamicCstr[c] || "default" == b.dynamicCstr[c]
    })
};
cvox.BaseRuleStore.prototype.getDynamicConstraintValues = function () {
    for (var a = {}, b = 0, c; c = this.speechRules_[b]; b++) {
        for (var d in c.dynamicCstr) {
            var e = [c.dynamicCstr[d]];
            a[d] = a[d] ? cvox.MathUtil.union(a[d], e) : e
        }
    }
    return a
};
cvox.BaseRuleStore.prototype.countMatchingDynamicConstraintValues_ = function (a, b) {
    for (var c = 0, d = 0, e; e = this.dynamicCstrAttribs[d]; d++) {
        if (a[e] == b.dynamicCstr[e]) {
            c++
        } else {
            break
        }
    }
    return c
};
cvox.BaseRuleStore.prototype.pickMostConstraint_ = function (a, b) {
    b.sort(goog.bind(function (b, d) {
        var e = this.countMatchingDynamicConstraintValues_(a, b),
            f = this.countMatchingDynamicConstraintValues_(a, d);
        return e > f ? -1 : f > e ? 1 : d.precondition.constraints.length - b.precondition.constraints.length
    }, this));
    return b[0]
};
cvox.BaseRuleStore.prototype.testPrecondition_ = function (a, b) {
    var c = b.precondition;
    return this.applyQuery(a, c.query) === a && c.constraints.every(goog.bind(function (b) {
        return this.applyConstraint(a, b)
    }, this))
};
cvox.BaseRuleStore.compareDynamicConstraints_ = function (a, b) {
    if (Object.keys(a).length != Object.keys(b).length) {
        return !1
    }
    for (var c in a) {
        if (!b[c] || a[c] !== b[c]) {
            return !1
        }
    }
    return !0
};
cvox.BaseRuleStore.compareStaticConstraints_ = function (a, b) {
    if (a.length != b.length) {
        return !1
    }
    for (var c = 0, d; d = a[c]; c++) {
        if (-1 == b.indexOf(d)) {
            return !1
        }
    }
    return !0
};
cvox.BaseRuleStore.comparePreconditions_ = function (a, b) {
    var c = a.precondition,
        d = b.precondition;
    return c.query != d.query ? !1 : cvox.BaseRuleStore.compareStaticConstraints_(c.constraints, d.constraints)
};
