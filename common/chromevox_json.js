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

cvox.ChromeVoxJSON || (cvox.ChromeVoxJSON = {});
window.JSON && "[object JSON]" == window.JSON.toString() ? cvox.ChromeVoxJSON = window.JSON : function () {
    function a(a) {
        return 10 > a ? "0" + a : a
    }

    function b(a) {
        e.lastIndex = 0;
        return e.test(a) ? '"' + a.replace(e, function (a) {
            var b = h[a];
            return "string" === typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + a + '"'
    }

    function c(a, d) {
        var e, h, n, s, u = f,
            t, r = d[a];
        r && "object" === typeof r && "function" === typeof r.toJSON && (r = r.toJSON(a));
        "function" === typeof k && (r = k.call(d, a, r));
        switch (typeof r) {
        case "string":
            return b(r);
        case "number":
            return isFinite(r) ? String(r) : "null";
        case "boolean":
            ;
        case "null":
            return String(r);
        case "object":
            if (!r) {
                return "null"
            }
            f += g;
            t = [];
            if ("[object Array]" === Object.prototype.toString.apply(r)) {
                s = r.length;
                for (e = 0; e < s; e += 1) {
                    t[e] = c(e, r) || "null"
                }
                n = 0 === t.length ? "[]" : f ? "[\n" + f + t.join(",\n" + f) + "\n" + u + "]" : "[" + t.join(",") + "]";
                f = u;
                return n
            }
            if (k && "object" === typeof k) {
                for (s = k.length, e = 0; e < s; e += 1) {
                    h = k[e], "string" === typeof h && (n = c(h, r)) && t.push(b(h) + (f ? ": " : ":") + n)
                }
            } else {
                for (h in r) {
                    Object.hasOwnProperty.call(r, h) && (n = c(h, r)) && t.push(b(h) + (f ? ": " : ":") + n)
                }
            }
            n = 0 === t.length ? "{}" : f ? "{\n" + f + t.join(",\n" + f) + "\n" + u + "}" : "{" + t.join(",") + "}";
            f = u;
            return n
        }
    }
    "function" !== typeof Date.prototype.toJSON && (Date.prototype.toJSON = function (b) {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + a(this.getUTCMonth() + 1) + "-" + a(this.getUTCDate()) + "T" + a(this.getUTCHours()) + ":" + a(this.getUTCMinutes()) + ":" + a(this.getUTCSeconds()) + "Z" : "null"
    }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (a) {
        return this.valueOf()
    });
    var d = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        e = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        f, g, h = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        }, k;
    "function" !== typeof cvox.ChromeVoxJSON.stringify && (cvox.ChromeVoxJSON.stringify = function (a, b, d) {
        var e;
        g = f = "";
        if ("number" === typeof d) {
            for (e = 0; e < d; e += 1) {
                g += " "
            }
        } else {
            "string" === typeof d && (g = d)
        }
        if ((k = b) && "function" !== typeof b && ("object" !== typeof b || "number" !== typeof b.length)) {
            throw Error("JSON.stringify");
        }
        return c("", {
            "": a
        })
    });
    "function" !== typeof cvox.ChromeVoxJSON.parse && (cvox.ChromeVoxJSON.parse = function (a, b) {
        function c(a, d) {
            var e, f, g = a[d];
            if (g && "object" === typeof g) {
                for (e in g) {
                    Object.hasOwnProperty.call(g, e) && (f = c(g, e), void 0 !== f ? g[e] = f : delete g[e])
                }
            }
            return b.call(a, d, g)
        }
        var e;
        a = String(a);
        d.lastIndex = 0;
        d.test(a) && (a = a.replace(d, function (a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
            return e = eval("(" + a + ")"), "function" === typeof b ? c({
                "": e
            }, "") : e
        }
        throw new SyntaxError("JSON.parse");
    })
}();
