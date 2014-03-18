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

cvox.SelectionUtil = function () {};
cvox.SelectionUtil.cleanUpParagraphForward = function (a) {
    for (; 3 == a.focusNode.nodeType;) {
        var b = a.focusNode,
            c = a.focusOffset;
        a.modify("extend", "forward", "sentence");
        if (b == a.focusNode && c == a.focusOffset) {
            return !1
        }
    }
    return !0
};
cvox.SelectionUtil.cleanUpParagraphBack = function (a) {
    for (var b, c; 3 == a.focusNode.nodeType && (b = a.focusNode, c = a.focusOffset, a.modify("extend", "backward", "sentence"), b != a.focusNode || c != a.focusOffset);) {}
    return !0
};
cvox.SelectionUtil.cleanUpSentence = function (a) {
    for (;;) {
        if (3 == a.focusNode.nodeType) {
            var b = a.focusNode,
                c = a.focusOffset;
            if (0 < a.rangeCount && 0 < a.getRangeAt(0).endOffset) {
                if ("." == b.substringData(a.getRangeAt(0).endOffset - 1, 1)) {
                    break
                } else {
                    if (" " == b.substringData(a.getRangeAt(0).endOffset - 1, 1)) {
                        break
                    } else {
                        if (a.modify("extend", "forward", "sentence"), b == a.focusNode && c == a.focusOffset) {
                            return !1
                        }
                    }
                }
            } else {
                break
            }
        } else {
            break
        }
    }
    return !0
};
cvox.SelectionUtil.findSelPosition = function (a) {
    return 0 == a.rangeCount ? [0, 0] : (a = a.getRangeAt(0).getBoundingClientRect()) ? [window.pageYOffset + a.top, window.pageXOffset + a.left] : [0, 0]
};
cvox.SelectionUtil.findTopLeftPosition = function (a) {
    var b = 0,
        c = 0;
    if (a.offsetParent) {
        for (b = a.offsetLeft, c = a.offsetTop, a = a.offsetParent; null !== a;) {
            b += a.offsetLeft, c += a.offsetTop, a = a.offsetParent
        }
    }
    return [c, b]
};
cvox.SelectionUtil.isSelectionValid = function (a) {
    return !(RegExp(/^\s+$/).test(a.toString()) || "" == a.toString())
};
cvox.SelectionUtil.isRangeValid = function (a) {
    a = a.cloneContents().textContent;
    return !(RegExp(/^\s+$/).test(a) || "" == a)
};
cvox.SelectionUtil.findPos_ = function (a) {
    var b = 0,
        c = 0;
    if (a.offsetParent) {
        do {
            b += a.offsetLeft, c += a.offsetTop
        } while (a = a.offsetParent)
    }
    return [b, c]
};
cvox.SelectionUtil.scrollElementsToView = function (a) {
    for (; a && !a.getBoundingClientRect;) {
        a = a.parentElement
    }
    if (a) {
        for (var b = a, c = b.parentElement; b != document.body && c;) {
            b.scrollTop = b.offsetTop, b.scrollLeft = b.offsetLeft, b = c, c = b.parentElement
        }
        a = cvox.SelectionUtil.findPos_(a);
        window.scrollTo(a[0] - window.innerWidth / 2, a[1] - window.innerHeight / 2)
    }
};
cvox.SelectionUtil.scrollToSelection = function (a) {
    if (0 != a.rangeCount) {
        cvox.SelectionUtil.scrollElementsToView(a.focusNode);
        var b = cvox.SelectionUtil.findSelPosition(a);
        a = b[0];
        var b = b[1],
            c = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
            d = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        b < (window.innerWidth || document.documentElement.innerWidth || document.body.clientWidth) && (b = 0);
        c + d < a ? window.scroll(b, a - d + 100) : a < c && window.scroll(b, a - 100)
    }
};
cvox.SelectionUtil.isAllWs = function (a) {
    return !/[^\t\n\r ]/.test(a.data)
};
cvox.SelectionUtil.isIgnorable = function (a) {
    return 8 == a.nodeType || 3 == a.nodeType && cvox.SelectionUtil.isAllWs(a)
};
cvox.SelectionUtil.nodeBefore = function (a) {
    for (; a = a.previousSibling;) {
        if (!cvox.SelectionUtil.isIgnorable(a)) {
            return a
        }
    }
    return null
};
cvox.SelectionUtil.nodeAfter = function (a) {
    for (; a = a.nextSibling;) {
        if (!cvox.SelectionUtil.isIgnorable(a)) {
            return a
        }
    }
    return null
};
cvox.SelectionUtil.lastChildNode = function (a) {
    for (a = a.lastChild; a;) {
        if (!cvox.SelectionUtil.isIgnorable(a)) {
            return a
        }
        a = a.previousSibling
    }
    return null
};
cvox.SelectionUtil.firstChildNode = function (a) {
    for (a = a.firstChild; a;) {
        if (!cvox.SelectionUtil.isIgnorable(a)) {
            return a
        }
        a = a.nextSibling
    }
    return null
};
cvox.SelectionUtil.dataOf = function (a) {
    a = a.data;
    a = a.replace(/[\t\n\r ]+/g, " ");
    " " == a.charAt(0) && (a = a.substring(1, a.length));
    " " == a.charAt(a.length - 1) && (a = a.substring(0, a.length - 1));
    return a
};
cvox.SelectionUtil.hasContentWithTag = function (a, b) {
    if (!a || !a.anchorNode || !a.focusNode) {
        return !1
    }
    if (a.anchorNode.tagName && a.anchorNode.tagName == b || a.focusNode.tagName && a.focusNode.tagName == b || a.anchorNode.parentNode.tagName && a.anchorNode.parentNode.tagName == b || a.focusNode.parentNode.tagName && a.focusNode.parentNode.tagName == b) {
        return !0
    }
    var c = a.getRangeAt(0).cloneContents(),
        d = document.createElement("span");
    d.appendChild(c);
    return 0 < d.getElementsByTagName(b).length
};
cvox.SelectionUtil.selectText = function (a, b, c) {
    var d = document.createRange();
    d.setStart(a, b);
    d.setEnd(a, c);
    a = window.getSelection();
    a.removeAllRanges();
    a.addRange(d)
};
cvox.SelectionUtil.selectAllTextInNode = function (a) {
    var b = document.createRange();
    b.setStart(a, 0);
    b.setEndAfter(a);
    a = window.getSelection();
    a.removeAllRanges();
    a.addRange(b)
};
cvox.SelectionUtil.collapseToStart = function (a) {
    var b = window.getSelection(),
        c = b.anchorNode,
        d = b.anchorOffset;
    null == c && (c = a, d = 0);
    a = document.createRange();
    a.setStart(c, d);
    a.setEnd(c, d);
    b.removeAllRanges();
    b.addRange(a)
};
cvox.SelectionUtil.collapseToEnd = function (a) {
    var b = window.getSelection(),
        c = b.focusNode,
        d = b.focusOffset;
    null == c && (c = a, d = 0);
    a = document.createRange();
    a.setStart(c, d);
    a.setEnd(c, d);
    b.removeAllRanges();
    b.addRange(a)
};
cvox.SelectionUtil.getText = function () {
    var a = window.getSelection();
    if (cvox.SelectionUtil.hasContentWithTag(a, "IMG")) {
        var b = "",
            a = a.getRangeAt(0).cloneContents(),
            c = document.createElement("span");
        c.appendChild(a);
        for (var a = cvox.XpathUtil.getLeafNodes(c), c = 0, d; d = a[c]; c++) {
            b = b + " " + cvox.DomUtil.getName(d)
        }
        return b
    }
    return this.getSelectionText_()
};
cvox.SelectionUtil.getSelectionText_ = function () {
    return "" + window.getSelection()
};
cvox.SelectionUtil.getRangeText = function (a) {
    return a ? a.cloneContents().textContent.replace(/\s+/g, " ") : ""
};
