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

goog.i18n.MessageFormat = function (a) {
    this.literals_ = [];
    this.parsedPattern_ = [];
    this.numberFormatter_ = new goog.i18n.NumberFormat(goog.i18n.NumberFormat.Format.DECIMAL);
    this.parsePattern_(a)
};
goog.i18n.MessageFormat.LITERAL_PLACEHOLDER_ = "\ufddf_";
goog.i18n.MessageFormat.Element_ = {
    STRING: 0,
    BLOCK: 1
};
goog.i18n.MessageFormat.BlockType_ = {
    PLURAL: 0,
    ORDINAL: 1,
    SELECT: 2,
    SIMPLE: 3,
    STRING: 4,
    UNKNOWN: 5
};
goog.i18n.MessageFormat.OTHER_ = "other";
goog.i18n.MessageFormat.REGEX_LITERAL_ = RegExp("'([{}#].*?)'", "g");
goog.i18n.MessageFormat.REGEX_DOUBLE_APOSTROPHE_ = RegExp("''", "g");
goog.i18n.MessageFormat.prototype.format = function (a) {
    return this.format_(a, !1)
};
goog.i18n.MessageFormat.prototype.formatIgnoringPound = function (a) {
    return this.format_(a, !0)
};
goog.i18n.MessageFormat.prototype.format_ = function (a, b) {
    if (0 == this.parsedPattern_.length) {
        return ""
    }
    var c = [];
    this.formatBlock_(this.parsedPattern_, a, b, c);
    c = c.join("");
    for (b || goog.asserts.assert(-1 == c.search("#"), "Not all # were replaced."); 0 < this.literals_.length;) {
        c = c.replace(this.buildPlaceholder_(this.literals_), this.literals_.pop())
    }
    return c
};
goog.i18n.MessageFormat.prototype.formatBlock_ = function (a, b, c, d) {
    for (var e = 0; e < a.length; e++) {
        switch (a[e].type) {
        case goog.i18n.MessageFormat.BlockType_.STRING:
            d.push(a[e].value);
            break;
        case goog.i18n.MessageFormat.BlockType_.SIMPLE:
            var f = a[e].value;
            this.formatSimplePlaceholder_(f, b, d);
            break;
        case goog.i18n.MessageFormat.BlockType_.SELECT:
            f = a[e].value;
            this.formatSelectBlock_(f, b, c, d);
            break;
        case goog.i18n.MessageFormat.BlockType_.PLURAL:
            f = a[e].value;
            this.formatPluralOrdinalBlock_(f, b, goog.i18n.pluralRules.select, c, d);
            break;
        case goog.i18n.MessageFormat.BlockType_.ORDINAL:
            f = a[e].value;
            this.formatPluralOrdinalBlock_(f, b, goog.i18n.ordinalRules.select, c, d);
            break;
        default:
            goog.asserts.fail("Unrecognized block type.")
        }
    }
};
goog.i18n.MessageFormat.prototype.formatSimplePlaceholder_ = function (a, b, c) {
    b = b[a];
    goog.isDef(b) ? (this.literals_.push(b), c.push(this.buildPlaceholder_(this.literals_))) : c.push("Undefined parameter - " + a)
};
goog.i18n.MessageFormat.prototype.formatSelectBlock_ = function (a, b, c, d) {
    var e = a.argumentIndex;
    goog.isDef(b[e]) ? (e = a[b[e]], goog.isDef(e) || (e = a[goog.i18n.MessageFormat.OTHER_], goog.asserts.assertArray(e, "Invalid option or missing other option for select block.")), this.formatBlock_(e, b, c, d)) : d.push("Undefined parameter - " + e)
};
goog.i18n.MessageFormat.prototype.formatPluralOrdinalBlock_ = function (a, b, c, d, e) {
    var f = a.argumentIndex,
        g = a.argumentOffset,
        h = +b[f];
    isNaN(h) ? e.push("Undefined or invalid parameter - " + f) : (g = h - g, f = a[b[f]], goog.isDef(f) || (goog.asserts.assert(0 <= g, "Argument index smaller than offset."), c = c(g), goog.asserts.assertString(c, "Invalid plural key."), f = a[c], goog.isDef(f) || (f = a[goog.i18n.MessageFormat.OTHER_]), goog.asserts.assertArray(f, "Invalid option or missing other option for plural block.")), a = [], this.formatBlock_(f, b, d, a), b = a.join(""), goog.asserts.assertString(b, "Empty block in plural."),
        d ? e.push(b) : (d = this.numberFormatter_.format(g), e.push(b.replace(/#/g, d))))
};
goog.i18n.MessageFormat.prototype.parsePattern_ = function (a) {
    a && (a = this.insertPlaceholders_(a), this.parsedPattern_ = this.parseBlock_(a))
};
goog.i18n.MessageFormat.prototype.insertPlaceholders_ = function (a) {
    var b = this.literals_,
        c = goog.bind(this.buildPlaceholder_, this);
    a = a.replace(goog.i18n.MessageFormat.REGEX_DOUBLE_APOSTROPHE_, function () {
        b.push("'");
        return c(b)
    });
    return a = a.replace(goog.i18n.MessageFormat.REGEX_LITERAL_, function (a, e) {
        b.push(e);
        return c(b)
    })
};
goog.i18n.MessageFormat.prototype.extractParts_ = function (a) {
    var b = 0,
        c = [],
        d = [],
        e = /[{}]/g;
    e.lastIndex = 0;
    for (var f; f = e.exec(a);) {
        var g = f.index;
        "}" == f[0] ? (f = c.pop(), goog.asserts.assert(goog.isDef(f) && "{" == f, "No matching { for }."), 0 == c.length && (f = {}, f.type = goog.i18n.MessageFormat.Element_.BLOCK, f.value = a.substring(b, g), d.push(f), b = g + 1)) : (0 == c.length && (b = a.substring(b, g), "" != b && d.push({
            type: goog.i18n.MessageFormat.Element_.STRING,
            value: b
        }), b = g + 1), c.push("{"))
    }
    goog.asserts.assert(0 == c.length, "There are mismatched { or } in the pattern.");
    b = a.substring(b);
    "" != b && d.push({
        type: goog.i18n.MessageFormat.Element_.STRING,
        value: b
    });
    return d
};
goog.i18n.MessageFormat.PLURAL_BLOCK_RE_ = /^\s*(\w+)\s*,\s*plural\s*,(?:\s*offset:(\d+))?/;
goog.i18n.MessageFormat.ORDINAL_BLOCK_RE_ = /^\s*(\w+)\s*,\s*selectordinal\s*,/;
goog.i18n.MessageFormat.SELECT_BLOCK_RE_ = /^\s*(\w+)\s*,\s*select\s*,/;
goog.i18n.MessageFormat.prototype.parseBlockType_ = function (a) {
    return goog.i18n.MessageFormat.PLURAL_BLOCK_RE_.test(a) ? goog.i18n.MessageFormat.BlockType_.PLURAL : goog.i18n.MessageFormat.ORDINAL_BLOCK_RE_.test(a) ? goog.i18n.MessageFormat.BlockType_.ORDINAL : goog.i18n.MessageFormat.SELECT_BLOCK_RE_.test(a) ? goog.i18n.MessageFormat.BlockType_.SELECT : /^\s*\w+\s*/.test(a) ? goog.i18n.MessageFormat.BlockType_.SIMPLE : goog.i18n.MessageFormat.BlockType_.UNKNOWN
};
goog.i18n.MessageFormat.prototype.parseBlock_ = function (a) {
    var b = [];
    a = this.extractParts_(a);
    for (var c = 0; c < a.length; c++) {
        var d = {};
        if (goog.i18n.MessageFormat.Element_.STRING == a[c].type) {
            d.type = goog.i18n.MessageFormat.BlockType_.STRING, d.value = a[c].value
        } else {
            if (goog.i18n.MessageFormat.Element_.BLOCK == a[c].type) {
                switch (this.parseBlockType_(a[c].value)) {
                case goog.i18n.MessageFormat.BlockType_.SELECT:
                    d.type = goog.i18n.MessageFormat.BlockType_.SELECT;
                    d.value = this.parseSelectBlock_(a[c].value);
                    break;
                case goog.i18n.MessageFormat.BlockType_.PLURAL:
                    d.type = goog.i18n.MessageFormat.BlockType_.PLURAL;
                    d.value = this.parsePluralBlock_(a[c].value);
                    break;
                case goog.i18n.MessageFormat.BlockType_.ORDINAL:
                    d.type = goog.i18n.MessageFormat.BlockType_.ORDINAL;
                    d.value = this.parseOrdinalBlock_(a[c].value);
                    break;
                case goog.i18n.MessageFormat.BlockType_.SIMPLE:
                    d.type = goog.i18n.MessageFormat.BlockType_.SIMPLE;
                    d.value = a[c].value;
                    break;
                default:
                    goog.asserts.fail("Unknown block type.")
                }
            } else {
                goog.asserts.fail("Unknown part of the pattern.")
            }
        }
        b.push(d)
    }
    return b
};
goog.i18n.MessageFormat.prototype.parseSelectBlock_ = function (a) {
    var b = "";
    a = a.replace(goog.i18n.MessageFormat.SELECT_BLOCK_RE_, function (a, c) {
        b = c;
        return ""
    });
    var c = {};
    c.argumentIndex = b;
    a = this.extractParts_(a);
    for (var d = 0; d < a.length;) {
        var e = a[d].value;
        goog.asserts.assertString(e, "Missing select key element.");
        d++;
        goog.asserts.assert(d < a.length, "Missing or invalid select value element.");
        if (goog.i18n.MessageFormat.Element_.BLOCK == a[d].type) {
            var f = this.parseBlock_(a[d].value)
        } else {
            goog.asserts.fail("Expected block type.")
        }
        c[e.replace(/\s/g, "")] = f;
        d++
    }
    goog.asserts.assertArray(c[goog.i18n.MessageFormat.OTHER_], "Missing other key in select statement.");
    return c
};
goog.i18n.MessageFormat.prototype.parsePluralBlock_ = function (a) {
    var b = "",
        c = 0;
    a = a.replace(goog.i18n.MessageFormat.PLURAL_BLOCK_RE_, function (a, d, e) {
        b = d;
        e && (c = parseInt(e, 10));
        return ""
    });
    var d = {};
    d.argumentIndex = b;
    d.argumentOffset = c;
    a = this.extractParts_(a);
    for (var e = 0; e < a.length;) {
        var f = a[e].value;
        goog.asserts.assertString(f, "Missing plural key element.");
        e++;
        goog.asserts.assert(e < a.length, "Missing or invalid plural value element.");
        if (goog.i18n.MessageFormat.Element_.BLOCK == a[e].type) {
            var g = this.parseBlock_(a[e].value)
        } else {
            goog.asserts.fail("Expected block type.")
        }
        d[f.replace(/\s*(?:=)?(\w+)\s*/, "$1")] = g;
        e++
    }
    goog.asserts.assertArray(d[goog.i18n.MessageFormat.OTHER_], "Missing other key in plural statement.");
    return d
};
goog.i18n.MessageFormat.prototype.parseOrdinalBlock_ = function (a) {
    var b = "";
    a = a.replace(goog.i18n.MessageFormat.ORDINAL_BLOCK_RE_, function (a, c) {
        b = c;
        return ""
    });
    var c = {};
    c.argumentIndex = b;
    c.argumentOffset = 0;
    a = this.extractParts_(a);
    for (var d = 0; d < a.length;) {
        var e = a[d].value;
        goog.asserts.assertString(e, "Missing ordinal key element.");
        d++;
        goog.asserts.assert(d < a.length, "Missing or invalid ordinal value element.");
        if (goog.i18n.MessageFormat.Element_.BLOCK == a[d].type) {
            var f = this.parseBlock_(a[d].value)
        } else {
            goog.asserts.fail("Expected block type.")
        }
        c[e.replace(/\s*(?:=)?(\w+)\s*/, "$1")] = f;
        d++
    }
    goog.asserts.assertArray(c[goog.i18n.MessageFormat.OTHER_], "Missing other key in selectordinal statement.");
    return c
};
goog.i18n.MessageFormat.prototype.buildPlaceholder_ = function (a) {
    goog.asserts.assert(0 < a.length, "Literal array is empty.");
    a = (a.length - 1).toString(10);
    return goog.i18n.MessageFormat.LITERAL_PLACEHOLDER_ + a + "_"
};
