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

goog.string = {};
goog.string.Unicode = {
    NBSP: "\u00a0"
};
goog.string.startsWith = function (a, b) {
    return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function (a, b) {
    var c = a.length - b.length;
    return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function (a, b) {
    return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function (a, b) {
    return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.caseInsensitiveEquals = function (a, b) {
    return a.toLowerCase() == b.toLowerCase()
};
goog.string.subs = function (a, b) {
    for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;) {
        d += c.shift() + e.shift()
    }
    return d + c.join("%s")
};
goog.string.collapseWhitespace = function (a) {
    return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function (a) {
    return /^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function (a) {
    return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function (a) {
    return !/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function (a) {
    return !/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function (a) {
    return !/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function (a) {
    return !/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function (a) {
    return " " == a
};
goog.string.isUnicodeChar = function (a) {
    return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function (a) {
    return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function (a) {
    return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function (a) {
    return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function (a) {
    return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function (a) {
    return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function (a) {
    return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function (a) {
    return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function (a) {
    return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function (a, b) {
    var c = String(a).toLowerCase(),
        d = String(b).toLowerCase();
    return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function (a, b) {
    if (a == b) {
        return 0
    }
    if (!a) {
        return -1
    }
    if (!b) {
        return 1
    }
    for (var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0; f < e; f++) {
        var g = c[f],
            h = d[f];
        if (g != h) {
            return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1
        }
    }
    return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.urlEncode = function (a) {
    return encodeURIComponent(String(a))
};
goog.string.urlDecode = function (a) {
    return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function (a, b) {
    return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function (a, b) {
    if (b) {
        return a.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
    }
    if (!goog.string.allRe_.test(a)) {
        return a
    } - 1 != a.indexOf("&") && (a = a.replace(goog.string.amperRe_, "&amp;")); - 1 != a.indexOf("<") && (a = a.replace(goog.string.ltRe_, "&lt;")); - 1 != a.indexOf(">") && (a = a.replace(goog.string.gtRe_, "&gt;")); - 1 != a.indexOf('"') && (a = a.replace(goog.string.quotRe_, "&quot;"));
    return a
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function (a) {
    return goog.string.contains(a, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesUsingDom_ = function (a) {
    var b = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"'
    }, c = document.createElement("div");
    return a.replace(goog.string.HTML_ENTITY_PATTERN_, function (a, e) {
        var f = b[a];
        if (f) {
            return f
        }
        if ("#" == e.charAt(0)) {
            var g = Number("0" + e.substr(1));
            isNaN(g) || (f = String.fromCharCode(g))
        }
        f || (c.innerHTML = a + " ", f = c.firstChild.nodeValue.slice(0, -1));
        return b[a] = f
    })
};
goog.string.unescapePureXmlEntities_ = function (a) {
    return a.replace(/&([^;]+);/g, function (a, c) {
        switch (c) {
        case "amp":
            return "&";
        case "lt":
            return "<";
        case "gt":
            return ">";
        case "quot":
            return '"';
        default:
            if ("#" == c.charAt(0)) {
                var d = Number("0" + c.substr(1));
                if (!isNaN(d)) {
                    return String.fromCharCode(d)
                }
            }
            return a
        }
    })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function (a, b) {
    return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.stripQuotes = function (a, b) {
    for (var c = b.length, d = 0; d < c; d++) {
        var e = 1 == c ? b : b.charAt(d);
        if (a.charAt(0) == e && a.charAt(a.length - 1) == e) {
            return a.substring(1, a.length - 1)
        }
    }
    return a
};
goog.string.truncate = function (a, b, c) {
    c && (a = goog.string.unescapeEntities(a));
    a.length > b && (a = a.substring(0, b - 3) + "...");
    c && (a = goog.string.htmlEscape(a));
    return a
};
goog.string.truncateMiddle = function (a, b, c, d) {
    c && (a = goog.string.unescapeEntities(a));
    if (d && a.length > b) {
        d > b && (d = b);
        var e = a.length - d;
        a = a.substring(0, b - d) + "..." + a.substring(e)
    } else {
        a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e))
    }
    c && (a = goog.string.htmlEscape(a));
    return a
};
goog.string.specialEscapeChars_ = {
    "\x00": "\\0",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "\t": "\\t",
    "\x0B": "\\x0B",
    '"': '\\"',
    "\\": "\\\\"
};
goog.string.jsEscapeCache_ = {
    "'": "\\'"
};
goog.string.quote = function (a) {
    a = String(a);
    if (a.quote) {
        return a.quote()
    }
    for (var b = ['"'], c = 0; c < a.length; c++) {
        var d = a.charAt(c),
            e = d.charCodeAt(0);
        b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d))
    }
    b.push('"');
    return b.join("")
};
goog.string.escapeString = function (a) {
    for (var b = [], c = 0; c < a.length; c++) {
        b[c] = goog.string.escapeChar(a.charAt(c))
    }
    return b.join("")
};
goog.string.escapeChar = function (a) {
    if (a in goog.string.jsEscapeCache_) {
        return goog.string.jsEscapeCache_[a]
    }
    if (a in goog.string.specialEscapeChars_) {
        return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a]
    }
    var b = a,
        c = a.charCodeAt(0);
    if (31 < c && 127 > c) {
        b = a
    } else {
        if (256 > c) {
            if (b = "\\x", 16 > c || 256 < c) {
                b += "0"
            }
        } else {
            b = "\\u", 4096 > c && (b += "0")
        }
        b += c.toString(16).toUpperCase()
    }
    return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function (a) {
    for (var b = {}, c = 0; c < a.length; c++) {
        b[a.charAt(c)] = !0
    }
    return b
};
goog.string.contains = function (a, b) {
    return -1 != a.indexOf(b)
};
goog.string.countOf = function (a, b) {
    return a && b ? a.split(b).length - 1 : 0
};
goog.string.removeAt = function (a, b, c) {
    var d = a;
    0 <= b && b < a.length && 0 < c && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
    return d
};
goog.string.remove = function (a, b) {
    var c = RegExp(goog.string.regExpEscape(b), "");
    return a.replace(c, "")
};
goog.string.removeAll = function (a, b) {
    var c = RegExp(goog.string.regExpEscape(b), "g");
    return a.replace(c, "")
};
goog.string.regExpEscape = function (a) {
    return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function (a, b) {
    return Array(b + 1).join(a)
};
goog.string.padNumber = function (a, b, c) {
    a = goog.isDef(c) ? a.toFixed(c) : String(a);
    c = a.indexOf("."); - 1 == c && (c = a.length);
    return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function (a) {
    return null == a ? "" : String(a)
};
goog.string.buildString = function (a) {
    return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function () {
    return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function (a, b) {
    for (var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0; 0 == c && g < f; g++) {
        var h = d[g] || "",
            k = e[g] || "",
            l = RegExp("(\\d*)(\\D*)", "g"),
            m = RegExp("(\\d*)(\\D*)", "g");
        do {
            var p = l.exec(h) || ["", "", ""],
                q = m.exec(k) || ["", "", ""];
            if (0 == p[0].length && 0 == q[0].length) {
                break
            }
            var c = 0 == p[1].length ? 0 : parseInt(p[1], 10),
                n = 0 == q[1].length ? 0 : parseInt(q[1], 10),
                c = goog.string.compareElements_(c, n) || goog.string.compareElements_(0 == p[2].length, 0 == q[2].length) || goog.string.compareElements_(p[2], q[2])
        } while (0 == c)
    }
    return c
};
goog.string.compareElements_ = function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function (a) {
    for (var b = 0, c = 0; c < a.length; ++c) {
        b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_
    }
    return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function () {
    return "goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function (a) {
    var b = Number(a);
    return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.isLowerCamelCase = function (a) {
    return /^[a-z]+([A-Z][a-z]*)*$/.test(a)
};
goog.string.isUpperCamelCase = function (a) {
    return /^([A-Z][a-z]*)+$/.test(a)
};
goog.string.toCamelCase = function (a) {
    return String(a).replace(/\-([a-z])/g, function (a, c) {
        return c.toUpperCase()
    })
};
goog.string.toSelectorCase = function (a) {
    return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function (a, b) {
    var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
    return a.replace(RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function (a, b, c) {
        return b + c.toUpperCase()
    })
};
goog.string.parseInt = function (a) {
    isFinite(a) && (a = String(a));
    return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
};
goog.string.splitLimit = function (a, b, c) {
    a = a.split(b);
    for (var d = []; 0 < c && a.length;) {
        d.push(a.shift()), c--
    }
    a.length && d.push(a.join(b));
    return d
};
