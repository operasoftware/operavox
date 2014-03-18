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

cvox.SpeechRuleEngine = function () {
    this.activeStore_ = null;
    this.dynamicCstr = {};
    this.dynamicCstr[cvox.SpeechRule.DynamicCstrAttrib.STYLE] = "short"
};
goog.addSingletonGetter(cvox.SpeechRuleEngine);
cvox.SpeechRuleEngine.prototype.parameterize = function (a) {
    try {
        a.initialize()
    } catch (b) {
        if ("StoreError" == b.name) {
            console.log("Store Error:", b.message)
        } else {
            throw b;
        }
    }
    this.activeStore_ = a
};
cvox.SpeechRuleEngine.prototype.setDynamicConstraint = function (a) {
    a && (this.dynamicCstr = a)
};
cvox.SpeechRuleEngine.prototype.constructString = function (a, b) {
    if (!b) {
        return ""
    }
    if ('"' == b.charAt(0)) {
        return b.slice(1, -1)
    }
    var c = this.activeStore_.customStrings.lookup(b);
    return c ? c(a) : cvox.XpathUtil.evaluateString(b, a)
};
cvox.SpeechRuleEngine.prototype.evaluateNode = function (a) {
    return a ? this.evaluateTree_(a) : []
};
cvox.SpeechRuleEngine.prototype.evaluateTree_ = function (a) {
    var b = this.activeStore_.lookupRule(a, this.dynamicCstr);
    if (!b) {
        return this.activeStore_.evaluateDefault(a)
    }
    for (var b = b.action.components, c = [], d = 0, e; e = b[d]; d++) {
        var f = [],
            g = e.content || "";
        switch (e.type) {
        case cvox.SpeechRule.Type.NODE:
            (g = this.activeStore_.applyQuery(a, g)) && (f = this.evaluateTree_(g));
            break;
        case cvox.SpeechRule.Type.MULTI:
            g = this.activeStore_.applySelector(a, g);
            0 < g.length && (f = this.evaluateNodeList_(g, e.sepFunc, this.constructString(a, e.separator), e.ctxtFunc, this.constructString(a, e.context)));
            break;
        case cvox.SpeechRule.Type.TEXT:
            (g = this.constructString(a, g)) && (f = [new cvox.NavDescription({
                text: g
            })]);
            break;
        default:
            f = [new cvox.NavDescription({
                text: g
            })]
        }
        f[0] && e.context && e.type != cvox.SpeechRule.Type.MULTI && (f[0].context = this.constructString(a, e.context) + (f[0].context || ""));
        c = c.concat(this.addPersonality_(f, e))
    }
    return c
};
cvox.SpeechRuleEngine.prototype.evaluateNodeList_ = function (a, b, c, d, e) {
    if (a == []) {
        return []
    }
    var f = c || "",
        g = e || "";
    c = (c = this.activeStore_.contextFunctions.lookup(d)) ? c(a, g) : function () {
        return g
    };
    b = (b = this.activeStore_.contextFunctions.lookup(b)) ? b(a, f) : function () {
        return f
    };
    d = [];
    e = 0;
    for (var h; h = a[e]; e++) {
        h = this.evaluateTree_(h), 0 < h.length && (h[0].context = c() + (h[0].context || ""), d = d.concat(h), e < a.length - 1 && (h = b()) && d.push(new cvox.NavDescription({
            text: h
        })))
    }
    return d
};
cvox.SpeechRuleEngine.propMap = {
    pitch: cvox.AbstractTts.RELATIVE_PITCH,
    rate: cvox.AbstractTts.RELATIVE_RATE,
    volume: cvox.AbstractTts.RELATIVE_VOLUME,
    pause: cvox.AbstractTts.PAUSE
};
cvox.SpeechRuleEngine.prototype.addPersonality_ = function (a, b) {
    var c = {}, d;
    for (d in cvox.SpeechRuleEngine.propMap) {
        var e = parseFloat(b[d]);
        isNaN(e) || (c[cvox.SpeechRuleEngine.propMap[d]] = e)
    }
    a.forEach(goog.bind(function (a) {
        this.addRelativePersonality_(a, c);
        this.resetPersonality_(a)
    }, this));
    return a
};
cvox.SpeechRuleEngine.prototype.addRelativePersonality_ = function (a, b) {
    if (!a.personality) {
        return a.personality = b, a
    }
    var c = a.personality,
        d;
    for (d in b) {
        c[d] = c[d] && "number" == typeof c[d] ? c[d] + b[d] : b[d]
    }
    return a
};
cvox.SpeechRuleEngine.prototype.resetPersonality_ = function (a) {
    if (this.activeStore_.defaultTtsProps) {
        for (var b = 0, c; c = this.activeStore_.defaultTtsProps[b]; b++) {
            a.personality[c] = cvox.ChromeVox.tts.getDefaultProperty(c)
        }
    }
};
cvox.SpeechRuleEngine.debugMode = !1;
cvox.SpeechRuleEngine.outputDebug = function (a) {
    if (cvox.SpeechRuleEngine.debugMode) {
        var b = Array.prototype.slice.call(arguments, 0);
        console.log.apply(console, ["Speech Rule Engine Debugger:"].concat(b))
    }
};
cvox.SpeechRuleEngine.prototype.toString = function () {
    return this.activeStore_.findAllRules(function (a) {
        return !0
    }).map(function (a) {
        return a.toString()
    }).join("\n")
};
cvox.SpeechRuleEngine.debugSpeechRule = function (a, b) {
    var c = cvox.SpeechRuleEngine.getInstance().activeStore_;
    if (c) {
        var d = a.precondition;
        cvox.SpeechRuleEngine.outputDebug(d.query, c.applyQuery(b, d.query));
        d.constraints.forEach(function (a) {
            cvox.SpeechRuleEngine.outputDebug(a, c.applyConstraint(b, a))
        })
    }
};
cvox.SpeechRuleEngine.debugNamedSpeechRule = function (a, b) {
    for (var c = cvox.SpeechRuleEngine.getInstance().activeStore_.findAllRules(function (b) {
        return b.name == a
    }), d = 0, e; e = c[d]; d++) {
        cvox.SpeechRuleEngine.outputDebug("Rule", a, "number", d), cvox.SpeechRuleEngine.debugSpeechRule(e, b)
    }
};
