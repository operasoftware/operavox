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

cvox.MathStore = function () {
    cvox.BaseRuleStore.call(this);
    this.dynamicCstrAttribs = [cvox.SpeechRule.DynamicCstrAttrib.DOMAIN, cvox.SpeechRule.DynamicCstrAttrib.STYLE];
    this.defaultTtsProps = [cvox.AbstractTts.PITCH, cvox.AbstractTts.RATE]
};
goog.inherits(cvox.MathStore, cvox.BaseRuleStore);
cvox.SpeechRule.DynamicCstrAttrib.DOMAIN = "domain";
cvox.MathStore.prototype.defineRule = function (a, b, c, d, e) {
    var f = this.parseDynamicConstraint(b),
        g = Array.prototype.slice.call(arguments, 4),
        g = cvox.MathStore.superClass_.defineRule.apply(this, [a, f[cvox.SpeechRule.DynamicCstrAttrib.STYLE], c, d].concat(g));
    g.dynamicCstr = f;
    this.removeDuplicates(g);
    return g
};
cvox.MathStore.prototype.parseDynamicConstraint = function (a) {
    var b = a.split(".");
    if (!b[0] || !b[1]) {
        throw new cvox.SpeechRule.OutputError("Invalid domain assignment:" + a);
    }
    return cvox.MathStore.createDynamicConstraint(b[0], b[1])
};
cvox.MathStore.createDynamicConstraint = function (a, b) {
    var c = {};
    c[cvox.SpeechRule.DynamicCstrAttrib.DOMAIN] = a;
    c[cvox.SpeechRule.DynamicCstrAttrib.STYLE] = b;
    return c
};
cvox.MathStore.prototype.defineUniqueRuleAlias = function (a, b, c, d) {
    var e = this.parseDynamicConstraint(b),
        f = this.findRule(goog.bind(function (b) {
            return b.name == a && this.testDynamicConstraints(e, b)
        }, this));
    if (!f) {
        throw new cvox.SpeechRule.OutputError("Rule named " + a + " with style " + b + " does not exist.");
    }
    this.addAlias_(f, c, Array.prototype.slice.call(arguments, 3))
};
cvox.MathStore.prototype.defineRuleAlias = function (a, b, c) {
    var d = this.findRule(function (b) {
        return b.name == a
    });
    if (!d) {
        throw new cvox.SpeechRule.OutputError("Rule with named " + a + " does not exist.");
    }
    this.addAlias_(d, b, Array.prototype.slice.call(arguments, 2))
};
cvox.MathStore.prototype.defineRulesAlias = function (a, b, c) {
    var d = this.findAllRules(function (b) {
        return b.name == a
    });
    if (0 == d.length) {
        throw new cvox.SpeechRule.OutputError("Rule with name " + a + " does not exist.");
    }
    var e = Array.prototype.slice.call(arguments, 2);
    d.forEach(goog.bind(function (a) {
        this.addAlias_(a, b, e)
    }, this))
};
cvox.MathStore.prototype.addAlias_ = function (a, b, c) {
    b = new cvox.SpeechRule.Precondition(b, c);
    b = new cvox.SpeechRule(a.name, a.dynamicCstr, b, a.action);
    b.name = a.name;
    this.addRule(b)
};
cvox.MathStore.prototype.evaluateDefault = function (a) {
    return this.evaluateString_(a.textContent)
};
cvox.MathStore.prototype.evaluateString_ = function (a) {
    var b = [];
    if (a.match(/^\s+$/)) {
        return b
    }
    a = cvox.MathStore.removeEmpty_(a.replace(/\s/g, " ").split(" "));
    for (var c = 0, d; d = a[c]; c++) {
        if (1 == d.length) {
            b.push(this.evaluate_(d))
        } else {
            if (d.match(/^[a-zA-Z]+$/)) {
                b.push(this.evaluate_(d))
            } else {
                for (; d;) {
                    var e = d.match(/^\d+/),
                        f = d.match(/^[a-zA-Z]+/);
                    e ? (b.push(this.evaluate_(e[0])), d = d.substring(e[0].length)) : f ? (b.push(this.evaluate_(f[0])), d = d.substring(f[0].length)) : (e = d[0].charCodeAt(0), 55296 <= e && 56319 >= e && 1 < d.length && !isNaN(d.charCodeAt(1)) ? (b.push(this.evaluate_(d.slice(0, 2))), d = d.substring(2)) : (b.push(this.evaluate_(d[0])), d = d.substring(1)))
                }
            }
        }
    }
    return b
};
cvox.MathStore.prototype.evaluate_ = function (a) {
    return cvox.ChromeVox.host.mathMap ? cvox.ChromeVox.host.mathMap.evaluate(a, cvox.TraverseMath.getInstance().domain, cvox.TraverseMath.getInstance().style) : new cvox.NavMathDescription({
        text: a,
        domain: cvox.TraverseMath.getInstance().domain,
        style: cvox.TraverseMath.getInstance().style
    })
};
cvox.MathStore.removeEmpty_ = function (a) {
    return a.filter(function (a) {
        return a
    })
};
