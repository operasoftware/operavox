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

cvox.AbstractSelectionWalker = function () {
    cvox.AbstractWalker.call(this);
    this.objWalker_ = new cvox.BareObjectWalker;
    this.tc_ = cvox.TraverseContent.getInstance();
    this.grain = ""
};
goog.inherits(cvox.AbstractSelectionWalker, cvox.AbstractWalker);
cvox.AbstractSelectionWalker.prototype.next = function (a) {
    var b = a.isReversed();
    this.tc_.syncToCursorSelection(a.clone().setReversed(!1));
    if (null == (b ? this.tc_.prevElement(this.grain) : this.tc_.nextElement(this.grain))) {
        return this.objWalker_.next(a)
    }
    var c = this.tc_.getCurrentCursorSelection().setReversed(b),
        d = this.objWalker_.next(a),
        d = d ? d.setReversed(b) : null;
    return !d || "Text" == c.end.node.constructor.name && "Text" == d.end.node.constructor.name || cvox.DomUtil.isDescendantOfNode(c.end.node, a.end.node) || cvox.DomUtil.isDescendantOfNode(c.end.node, d.end.node) ? c : d
};
cvox.AbstractSelectionWalker.prototype.sync = function (a) {
    var b = a.isReversed(),
        c = null;
    if (a.start.equals(a.end) && "Text" != a.start.node.constructor.name) {
        for (c = a.start.node; c && cvox.DomUtil.directedFirstChild(c, b) && !cvox.TraverseUtil.treatAsLeafNode(c);) {
            for (var d = cvox.DomUtil.directedFirstChild(c, b); d;) {
                if (cvox.DomUtil.isVisible(d, {
                    checkAncestors: !1,
                    checkDescendants: !1
                })) {
                    c = d;
                    break
                } else {
                    d = cvox.DomUtil.directedNextSibling(d, b)
                }
            }
            if (!d) {
                break
            }
        }
        c = cvox.CursorSelection.fromNode(c)
    } else {
        c = a.clone(), b ? c.start = c.end : c.end = c.start
    }
    c = this.next(c.setReversed(!1));
    d = (d = this.objWalker_.sync(a)) ? d.setReversed(b) : null;
    if (!c) {
        return d
    }
    c.setReversed(b);
    return !d || "Text" == c.end.node.constructor.name && "Text" == d.end.node.constructor.name || cvox.DomUtil.isDescendantOfNode(c.end.node, a.end.node) || cvox.DomUtil.isDescendantOfNode(c.end.node, d.end.node) ? c : d
};
cvox.AbstractSelectionWalker.prototype.getDescription = function (a, b) {
    var c = cvox.DescriptionUtil.getDescriptionFromAncestors(cvox.DomUtil.getUniqueAncestors(a.end.node, b.start.node), !0, cvox.ChromeVox.verbosity);
    c.text = b.getText() || c.text;
    return [c]
};
cvox.AbstractSelectionWalker.prototype.getBraille = function (a, b) {
    var c = b.absStart().node,
        d = cvox.TraverseUtil.getNodeText(c),
        e = new cvox.Spannable(d);
    e.setSpan(c, 0, d.length);
    return new cvox.NavBraille({
        text: e,
        startIndex: b.absStart().index,
        endIndex: b.absEnd().index
    })
};
