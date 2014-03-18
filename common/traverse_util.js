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

cvox.TraverseUtil = function () {};
cvox.TraverseUtil.getNodeText = function (a) {
    return a.constructor == Text ? a.data : ""
};
cvox.TraverseUtil.treatAsLeafNode = function (a) {
    return 0 == a.childNodes.length || "SELECT" == a.nodeName || "listbox" == a.getAttribute("role") || "OBJECT" == a.nodeName
};
cvox.TraverseUtil.isWhitespace = function (a) {
    return " " == a || "\n" == a || "\r" == a || "\t" == a
};
cvox.TraverseUtil.setSelection = function (a, b) {
    var c = window.getSelection();
    c.removeAllRanges();
    var d = document.createRange();
    d.setStart(a.node, a.index);
    d.setEnd(b.node, b.index);
    c.addRange(d);
    return c
};
cvox.TraverseUtil.isHidden = function (a) {
    if (a instanceof HTMLElement && "true" == a.getAttribute("aria-hidden")) {
        return !0
    }
    switch (a.tagName) {
    case "SCRIPT":
        ;
    case "NOSCRIPT":
        return !0
    }
    return !1
};
cvox.TraverseUtil.forwardsChar = function (a, b, c) {
    for (;;) {
        var d = null;
        if (!cvox.TraverseUtil.treatAsLeafNode(a.node)) {
            for (var e = a.index; e < a.node.childNodes.length; e++) {
                var f = a.node.childNodes[e];
                if (cvox.TraverseUtil.isHidden(f)) {
                    f instanceof HTMLElement && b.push(f)
                } else {
                    if (cvox.DomUtil.isVisible(f, {
                        checkAncestors: !1
                    })) {
                        d = f;
                        break
                    }
                }
            }
        }
        if (d) {
            a.node = d, a.index = 0, a.text = cvox.TraverseUtil.getNodeText(a.node), a.node instanceof HTMLElement && b.push(a.node)
        } else {
            if (a.index < a.text.length) {
                return a.text[a.index++]
            }
            for (; null != a.node;) {
                d = null;
                for (f = a.node.nextSibling; null != f; f = f.nextSibling) {
                    if (cvox.TraverseUtil.isHidden(f)) {
                        f instanceof HTMLElement && b.push(f)
                    } else {
                        if (cvox.DomUtil.isVisible(f, {
                            checkAncestors: !1
                        })) {
                            d = f;
                            break
                        }
                    }
                }
                if (d) {
                    a.node instanceof HTMLElement && c.push(a.node);
                    a.node = d;
                    a.text = cvox.TraverseUtil.getNodeText(d);
                    a.index = 0;
                    a.node instanceof HTMLElement && b.push(a.node);
                    break
                }
                if (a.node.parentNode && a.node.parentNode.constructor != HTMLBodyElement) {
                    a.node instanceof HTMLElement && c.push(a.node), a.node = a.node.parentNode, a.text = null, a.index = 0
                } else {
                    return null
                }
            }
        }
    }
};
cvox.TraverseUtil.backwardsChar = function (a, b, c) {
    for (;;) {
        var d = null;
        if (!cvox.TraverseUtil.treatAsLeafNode(a.node)) {
            for (var e = a.index - 1; 0 <= e; e--) {
                var f = a.node.childNodes[e];
                if (cvox.TraverseUtil.isHidden(f)) {
                    f instanceof HTMLElement && b.push(f)
                } else {
                    if (cvox.DomUtil.isVisible(f, {
                        checkAncestors: !1
                    })) {
                        d = f;
                        break
                    }
                }
            }
        }
        if (d) {
            a.node = d, a.text = cvox.TraverseUtil.getNodeText(a.node), a.index = a.text.length ? a.text.length : a.node.childNodes.length, a.node instanceof HTMLElement && b.push(a.node)
        } else {
            if (0 < a.text.length && 0 < a.index) {
                return a.text[--a.index]
            }
            for (;;) {
                d = null;
                for (f = a.node.previousSibling; null != f; f = f.previousSibling) {
                    if (cvox.TraverseUtil.isHidden(f)) {
                        f instanceof HTMLElement && b.push(f)
                    } else {
                        if (cvox.DomUtil.isVisible(f, {
                            checkAncestors: !1
                        })) {
                            d = f;
                            break
                        }
                    }
                }
                if (d) {
                    a.node instanceof HTMLElement && c.push(a.node);
                    a.node = d;
                    a.text = cvox.TraverseUtil.getNodeText(d);
                    a.index = a.text.length ? a.text.length : a.node.childNodes.length;
                    a.node instanceof HTMLElement && b.push(a.node);
                    break
                }
                if (a.node.parentNode && a.node.parentNode.constructor != HTMLBodyElement) {
                    a.node instanceof HTMLElement && c.push(a.node), a.node = a.node.parentNode, a.text = null, a.index = 0
                } else {
                    return null
                }
            }
        }
    }
};
cvox.TraverseUtil.getNextChar = function (a, b, c, d, e) {
    a.copyFrom(b);
    var f = cvox.TraverseUtil.forwardsChar(b, c, d);
    if (null == f) {
        return null
    }
    for (var g = cvox.TraverseUtil.isWhitespace(f); cvox.TraverseUtil.isWhitespace(f) || cvox.TraverseUtil.isHidden(b.node);) {
        if (f = cvox.TraverseUtil.forwardsChar(b, c, d), null == f) {
            return null
        }
    }
    if (e || !g) {
        return a.copyFrom(b), a.index--, f
    }
    for (d = 0; d < c.length; d++) {
        if (cvox.TraverseUtil.isHidden(c[d])) {
            return b.index--, a.copyFrom(b), a.index--, " "
        }
    }
    b.index--;
    return " "
};
cvox.TraverseUtil.getPreviousChar = function (a, b, c, d, e) {
    b.copyFrom(a);
    var f = cvox.TraverseUtil.backwardsChar(a, c, d);
    if (null == f) {
        return null
    }
    for (var g = cvox.TraverseUtil.isWhitespace(f); cvox.TraverseUtil.isWhitespace(f) || cvox.TraverseUtil.isHidden(a.node);) {
        if (f = cvox.TraverseUtil.backwardsChar(a, c, d), null == f) {
            return null
        }
    }
    if (e || !g) {
        return b.copyFrom(a), b.index++, f
    }
    for (d = 0; d < c.length; d++) {
        if (cvox.TraverseUtil.isHidden(c[d])) {
            return a.index++, b.copyFrom(a), b.index++, " "
        }
    }
    a.index++;
    return " "
};
cvox.TraverseUtil.getNextWord = function (a, b, c, d) {
    var e = b.clone(),
        f = cvox.TraverseUtil.forwardsChar(e, c, d);
    if (null == f) {
        return null
    }
    for (; cvox.TraverseUtil.isWhitespace(f) || cvox.TraverseUtil.isHidden(e.node);) {
        if (f = cvox.TraverseUtil.forwardsChar(e, c, d), null == f) {
            return null
        }
    }
    a.copyFrom(e);
    a.index--;
    b.copyFrom(e);
    a = f;
    c = [];
    d = [];
    f = cvox.TraverseUtil.forwardsChar(e, c, d);
    if (null == f) {
        return a
    }
    for (; !cvox.TraverseUtil.isWhitespace(f) && 0 == c.length && 0 == d && (a += f, b.copyFrom(e), f = cvox.TraverseUtil.forwardsChar(e, c, d), null != f);) {}
    return a
};
cvox.TraverseUtil.getPreviousWord = function (a, b, c, d) {
    var e = a.clone(),
        f = cvox.TraverseUtil.backwardsChar(e, c, d);
    if (null == f) {
        return null
    }
    for (; cvox.TraverseUtil.isWhitespace(f) || cvox.TraverseUtil.isHidden(e.node);) {
        if (f = cvox.TraverseUtil.backwardsChar(e, c, d), null == f) {
            return null
        }
    }
    b.copyFrom(e);
    b.index++;
    a.copyFrom(e);
    b = f;
    c = [];
    d = [];
    f = cvox.TraverseUtil.backwardsChar(e, c, d);
    if (null == f) {
        return b
    }
    for (; !cvox.TraverseUtil.isWhitespace(f) && 0 == c.length && 0 == d.length && (b = f + b, a.copyFrom(e), f = cvox.TraverseUtil.backwardsChar(e, c, d), null != f);) {}
    return b
};
cvox.TraverseUtil.includesBreakTagOrSkippedNode = function (a, b, c) {
    for (var d = 0; d < a.length; d++) {
        if (cvox.TraverseUtil.isHidden(a[d])) {
            return !0
        }
        var e = window.getComputedStyle(a[d], null);
        if (e && "inline" != e.display || c[a[d].tagName]) {
            return !0
        }
    }
    for (d = 0; d < b.length; d++) {
        if ((e = window.getComputedStyle(b[d], null)) && "inline" != e.display || c[b[d].tagName]) {
            return !0
        }
    }
    return !1
};
cvox.TraverseUtil.getNextSentence = function (a, b, c, d, e) {
    return cvox.TraverseUtil.getNextString(a, b, c, d, function (a, b, c, d) {
        return "." == a.substr(-1) ? !0 : cvox.TraverseUtil.includesBreakTagOrSkippedNode(c, d, e)
    })
};
cvox.TraverseUtil.getPreviousSentence = function (a, b, c, d, e) {
    return cvox.TraverseUtil.getPreviousString(a, b, c, d, function (a, b, c, d) {
        return "." == b.substr(-1) ? !0 : cvox.TraverseUtil.includesBreakTagOrSkippedNode(c, d, e)
    })
};
cvox.TraverseUtil.getNextLine = function (a, b, c, d, e) {
    var f = document.createRange(),
        g = null,
        h = b.clone();
    return cvox.TraverseUtil.getNextString(a, b, c, d, function (c, d, m, p) {
        f.setStart(a.node, a.index);
        f.setEnd(b.node, b.index);
        c = f.getBoundingClientRect();
        g || (g = c);
        if (c.bottom != g.bottom && !cvox.DomPredicates.linkPredicate(cvox.DomUtil.getAncestors(b.node))) {
            return b.copyFrom(h), !0
        }
        g = c;
        h.copyFrom(b);
        return cvox.TraverseUtil.includesBreakTagOrSkippedNode(m, p, e)
    })
};
cvox.TraverseUtil.getPreviousLine = function (a, b, c, d, e) {
    var f = document.createRange(),
        g = null,
        h = a.clone();
    return cvox.TraverseUtil.getPreviousString(a, b, c, d, function (c, d, m, p) {
        f.setStart(a.node, a.index);
        f.setEnd(b.node, b.index);
        c = f.getBoundingClientRect();
        g || (g = c);
        if (c.top != g.top && !cvox.DomPredicates.linkPredicate(cvox.DomUtil.getAncestors(a.node))) {
            return a.copyFrom(h), !0
        }
        g = c;
        h.copyFrom(a);
        return cvox.TraverseUtil.includesBreakTagOrSkippedNode(m, p, e)
    })
};
cvox.TraverseUtil.getNextParagraph = function (a, b, c, d) {
    return cvox.TraverseUtil.getNextString(a, b, c, d, function (a, b, c, d) {
        for (a = 0; a < c.length; a++) {
            if (cvox.TraverseUtil.isHidden(c[a]) || (b = window.getComputedStyle(c[a], null)) && "inline" != b.display) {
                return !0
            }
        }
        for (a = 0; a < d.length; a++) {
            if ((b = window.getComputedStyle(d[a], null)) && "inline" != b.display) {
                return !0
            }
        }
        return !1
    })
};
cvox.TraverseUtil.getPreviousParagraph = function (a, b, c, d) {
    return cvox.TraverseUtil.getPreviousString(a, b, c, d, function (a, b, c, d) {
        for (a = 0; a < c.length; a++) {
            if (cvox.TraverseUtil.isHidden(c[a]) || (b = window.getComputedStyle(c[a], null)) && "inline" != b.display) {
                return !0
            }
        }
        for (a = 0; a < d.length; a++) {
            if ((b = window.getComputedStyle(d[a], null)) && "inline" != b.display) {
                return !0
            }
        }
        return !1
    })
};
cvox.TraverseUtil.getNextString = function (a, b, c, d, e) {
    var f = b.clone(),
        g = b.clone(),
        h = [],
        k = [],
        l = "",
        m = cvox.TraverseUtil.getNextWord(f, g, h, k);
    if (null == m) {
        return null
    }
    for (a.copyFrom(f); !(l && e(l, m, h, k) || (l && (l += " "), l += m, c = c.concat(h), d = d.concat(k), b.copyFrom(g), h = [], k = [], m = cvox.TraverseUtil.getNextWord(f, g, h, k), null == m));) {}
    return l
};
cvox.TraverseUtil.getPreviousString = function (a, b, c, d, e) {
    var f = a.clone(),
        g = a.clone(),
        h = [],
        k = [],
        l = "",
        m = cvox.TraverseUtil.getPreviousWord(f, g, h, k);
    if (null == m) {
        return null
    }
    for (b.copyFrom(g); !(l && e(l, m, h, k) || (l && (l = " " + l), l = m + l, c = c.concat(h), d = d.concat(k), a.copyFrom(f), h = [], k = [], m = cvox.TraverseUtil.getPreviousWord(f, g, h, k), null == m));) {}
    return l
};
