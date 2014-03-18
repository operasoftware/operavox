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

cvox.LayoutLineWalker = function () {
    this.subWalker_ = new cvox.StructuralLineWalker
};
goog.inherits(cvox.LayoutLineWalker, cvox.AbstractWalker);
cvox.LayoutLineWalker.prototype.next = function (a) {
    var b = new cvox.CursorSelection(a.end, a.end, a.isReversed());
    if (!this.subWalker_.sync(b)) {
        return null
    }
    b = this.subWalker_.next(b);
    if (!b) {
        return null
    }
    b.setReversed(a.isReversed());
    return this.extend_(b).setReversed(!1)
};
cvox.LayoutLineWalker.prototype.sync = function (a) {
    var b = this.subWalker_.sync(a);
    if (!b) {
        return null
    }
    var c = this.extend_(b),
        b = this.extend_(b.setReversed(!b.isReversed()));
    return new cvox.CursorSelection(b.end, c.end, a.isReversed())
};
cvox.LayoutLineWalker.prototype.getDescription = function (a, b) {
    var c = [],
        d = a,
        e = b.clone().setReversed(!1),
        f = new cvox.CursorSelection(e.start, e.start),
        f = this.subWalker_.sync(f);
    if (!f) {
        return []
    }
    if (e.start.node == e.end.node) {
        return this.subWalker_.getDescription(a, b)
    }
    for (; f && !f.end.equals(e.end);) {
        c.push.apply(c, this.subWalker_.getDescription(d, f)), d = f, f = this.subWalker_.next(f)
    }
    f && c.push.apply(c, this.subWalker_.getDescription(d, f));
    return c
};
cvox.LayoutLineWalker.prototype.getBraille = function (a, b) {
    var c = new cvox.NavBraille({}),
        d = this.subWalker_.sync(b.clone().setReversed(!1)),
        e = this.sync(b).setReversed(!1);
    if (!e || !d) {
        return c
    }
    var f = new cvox.CursorSelection(e.start, e.start),
        f = this.subWalker_.sync(f);
    if (!f) {
        return c
    }
    for (; f && !f.end.equals(e.end);) {
        this.appendBraille_(a, d, f, c), a = f, f = this.subWalker_.next(f)
    }
    f && this.appendBraille_(a, d, f, c);
    return c
};
cvox.LayoutLineWalker.prototype.getGranularityMsg = function () {
    return cvox.ChromeVox.msgs.getMsg("layout_line")
};
cvox.LayoutLineWalker.prototype.isVisualLineBreak_ = function (a, b) {
    if (this.wantsOwnLine_(a.end.node) || this.wantsOwnLine_(b.start.node)) {
        return !0
    }
    var c = a.getRange().getBoundingClientRect(),
        d = b.getRange().getBoundingClientRect();
    0 == c.width && 0 == c.height && a.end.node.nodeType == Node.ELEMENT_NODE && (c = a.end.node.getBoundingClientRect());
    0 == d.width && 0 == d.height && b.start.node.nodeType == Node.ELEMENT_NODE && (d = b.start.node.getBoundingClientRect());
    return c.bottom != d.bottom
};
cvox.LayoutLineWalker.prototype.wantsOwnLine_ = function (a) {
    return a instanceof HTMLTextAreaElement || a.parentNode instanceof HTMLTextAreaElement
};
cvox.LayoutLineWalker.prototype.extend_ = function (a) {
    var b = a,
        c = a;
    do {
        b = c, c = this.subWalker_.next(b)
    } while (c && !this.isVisualLineBreak_(b, c));
    return new cvox.CursorSelection(a.start, b.end, a.isReversed())
};
cvox.LayoutLineWalker.prototype.appendBraille_ = function (a, b, c, d) {
    a = this.subWalker_.getBraille(a, c).text;
    var e = a.getSpanInstanceOf(cvox.BrailleUtil.ValueSelectionSpan);
    0 < d.text.getLength() && d.text.append(cvox.BrailleUtil.ITEM_SEPARATOR);
    for (var f = c.start.node; f.parentNode && cvox.DomUtil.isLeafNode(f.parentNode);) {
        f = f.parentNode
    }
    var g = d.text.getLength(),
        h = g + a.getLength();
    d.text.append(a.toString());
    d.text.setSpan(f, g, h);
    b && c.absEquals(b) && (e ? (d.startIndex = g + a.getSpanStart(e), d.endIndex = g + a.getSpanEnd(e)) : (d.startIndex = g, d.endIndex = g + 1))
};
