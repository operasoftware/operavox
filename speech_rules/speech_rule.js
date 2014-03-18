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

cvox.SpeechRule = function (a, b, c, d) {
    this.name = a;
    this.dynamicCstr = b;
    this.precondition = c;
    this.action = d
};
cvox.SpeechRule.prototype.toString = function () {
    var a = [],
        b;
    for (b in this.dynamicCstr) {
        a.push(this.dynamicCstr[b])
    }
    return this.name + " | " + a.join(".") + " | " + this.precondition.toString() + " ==> " + this.action.toString()
};
cvox.SpeechRule.Type = {
    NODE: "NODE",
    MULTI: "MULTI",
    TEXT: "TEXT",
    PERSONALITY: "PERSONALITY"
};
cvox.SpeechRule.Type.fromString = function (a) {
    switch (a) {
    case "[n]":
        return cvox.SpeechRule.Type.NODE;
    case "[m]":
        return cvox.SpeechRule.Type.MULTI;
    case "[t]":
        return cvox.SpeechRule.Type.TEXT;
    case "[p]":
        return cvox.SpeechRule.Type.PERSONALITY;
    default:
        throw "Parse error: " + a;
    }
};
cvox.SpeechRule.Type.toString = function (a) {
    switch (a) {
    case cvox.SpeechRule.Type.NODE:
        return "[n]";
    case cvox.SpeechRule.Type.MULTI:
        return "[m]";
    case cvox.SpeechRule.Type.TEXT:
        return "[t]";
    case cvox.SpeechRule.Type.PERSONALITY:
        return "[p]";
    default:
        throw "Unknown type error: " + a;
    }
};
cvox.SpeechRule.Component = function (a) {
    this.type = a.type;
    this.content = a.content
};
cvox.SpeechRule.Component.fromString = function (a) {
    var b = {};
    b.type = cvox.SpeechRule.Type.fromString(a.substring(0, 3));
    a = a.slice(3).trimLeft();
    if (!a) {
        throw new cvox.SpeechRule.OutputError("Missing content.");
    }
    switch (b.type) {
    case cvox.SpeechRule.Type.TEXT:
        if ('"' == a[0]) {
            var c = cvox.SpeechRule.splitString_(a, "\\(")[0].trim();
            if ('"' != c.slice(-1)) {
                throw new cvox.SpeechRule.OutputError("Invalid string syntax.");
            }
            b.content = c;
            a = a.slice(c.length).trim(); - 1 == a.indexOf("(") && (a = "");
            break
        };
    case cvox.SpeechRule.Type.NODE:
        ;
    case cvox.SpeechRule.Type.MULTI:
        c = a.indexOf(" (");
        if (-1 == c) {
            b.content = a.trim();
            a = "";
            break
        }
        b.content = a.substring(0, c).trim();
        a = a.slice(c).trimLeft()
    }
    b = new cvox.SpeechRule.Component(b);
    a && b.addAttributes(a);
    return b
};
cvox.SpeechRule.Component.prototype.toString = function () {
    var a;
    a = "" + cvox.SpeechRule.Type.toString(this.type);
    a += this.content ? " " + this.content : "";
    var b = this.getAttributes();
    0 < b.length && (a += " (" + b.join(", ") + ")");
    return a
};
cvox.SpeechRule.Component.prototype.addAttribute = function (a) {
    var b = a.indexOf(":"); - 1 == b ? this[a.trim()] = "true" : this[a.substring(0, b).trim()] = a.slice(b + 1).trim()
};
cvox.SpeechRule.Component.prototype.addAttributes = function (a) {
    if ("(" != a[0] || ")" != a.slice(-1)) {
        throw new cvox.SpeechRule.OutputError("Invalid attribute expression: " + a);
    }
    a = cvox.SpeechRule.splitString_(a.slice(1, -1), ",");
    for (var b = 0; b < a.length; b++) {
        this.addAttribute(a[b])
    }
};
cvox.SpeechRule.Component.prototype.getAttributes = function () {
    var a = [],
        b;
    for (b in this) {
        "content" != b && "type" != b && "function" != typeof this[b] && a.push(b + ":" + this[b])
    }
    return a
};
cvox.SpeechRule.Action = function (a) {
    this.components = a
};
cvox.SpeechRule.Action.fromString = function (a) {
    a = cvox.SpeechRule.splitString_(a, ";").filter(function (a) {
        return a.match(/\S/)
    }).map(function (a) {
        return a.trim()
    });
    for (var b = [], c = 0; c < a.length; c++) {
        var d = cvox.SpeechRule.Component.fromString(a[c]);
        d && b.push(d)
    }
    return new cvox.SpeechRule.Action(b)
};
cvox.SpeechRule.Action.prototype.toString = function () {
    return this.components.map(function (a) {
        return a.toString()
    }).join("; ")
};
cvox.SpeechRule.Precondition = function (a, b) {
    this.query = a;
    this.constraints = b || []
};
cvox.SpeechRule.Precondition.prototype.toString = function () {
    var a = this.constraints.join(", ");
    return this.query + ", " + a
};
cvox.SpeechRule.splitString_ = function (a, b) {
    for (var c = [], d = "";
        "" != a;) {
        var e = a.search(b);
        if (-1 == e) {
            if (0 != (a.match(/"/g) || []).length % 2) {
                throw new cvox.SpeechRule.OutputError("Invalid string in expression: " + a);
            }
            c.push(d + a);
            a = d = ""
        } else {
            if (0 == (a.substring(0, e).match(/"/g) || []).length % 2) {
                c.push(d + a.substring(0, e)), d = "", a = a.substring(e + 1)
            } else {
                var f = a.substring(e).search('"');
                if (-1 == f) {
                    throw new cvox.SpeechRule.OutputError("Invalid string in expression: " + a);
                }
                d += a.substring(0, e + f + 1);
                a = a.substring(e + f + 1)
            }
        }
    }
    d && c.push(d);
    return c
};
cvox.SpeechRule.DynamicCstrAttrib = {
    STYLE: "style"
};
cvox.SpeechRule.OutputError = function (a) {
    this.name = "RuleError";
    this.message = a || ""
};
goog.inherits(cvox.SpeechRule.OutputError, Error);
