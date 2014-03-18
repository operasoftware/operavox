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

cvox.CursorSelection = function (a, b, c) {
    this.start = a.clone();
    this.end = b.clone();
    void 0 == c && (c = !1);
    if ((this.isReversed_ = c) && this.start.node.compareDocumentPosition(this.end.node) == cvox.CursorSelection.BEFORE || !this.isReversed_ && this.end.node.compareDocumentPosition(this.start.node) == cvox.CursorSelection.BEFORE) {
        a = this.start, this.start = this.end, this.end = a
    }
};
cvox.CursorSelection.BEFORE = 4;
cvox.CursorSelection.prototype.setReversed = function (a) {
    if (a == this.isReversed_) {
        return this
    }
    var b = this.start;
    this.start = this.end;
    this.end = b;
    this.isReversed_ = a;
    return this
};
cvox.CursorSelection.prototype.isReversed = function () {
    return this.isReversed_
};
cvox.CursorSelection.prototype.absStart = function () {
    return this.isReversed_ ? this.end : this.start
};
cvox.CursorSelection.prototype.absEnd = function () {
    return this.isReversed_ ? this.start : this.end
};
cvox.CursorSelection.prototype.clone = function () {
    return new cvox.CursorSelection(this.start, this.end, this.isReversed_)
};
cvox.CursorSelection.prototype.select = function () {
    var a = window.getSelection();
    a.removeAllRanges();
    this.normalize();
    a.addRange(this.getRange())
};
cvox.CursorSelection.fromNode = function (a) {
    if (!a) {
        return null
    }
    var b = cvox.TraverseUtil.getNodeText(a);
    return new cvox.CursorSelection(new cvox.Cursor(a, 0, b), new cvox.Cursor(a, 0, b))
};
cvox.CursorSelection.fromBody = function () {
    return cvox.CursorSelection.fromNode(document.body)
};
cvox.CursorSelection.prototype.getText = function () {
    return this.start.equals(this.end) ? cvox.TraverseUtil.getNodeText(this.start.node) : cvox.SelectionUtil.getRangeText(this.getRange())
};
cvox.CursorSelection.prototype.getRange = function () {
    var a = document.createRange();
    this.isReversed_ ? (a.setStart(this.end.node, this.end.index), a.setEnd(this.start.node, this.start.index)) : (a.setStart(this.start.node, this.start.index), a.setEnd(this.end.node, this.end.index));
    return a
};
cvox.CursorSelection.prototype.equals = function (a) {
    return this.start.equals(a.start) && this.end.equals(a.end)
};
cvox.CursorSelection.prototype.absEquals = function (a) {
    return this.start.equals(a.start) && this.end.equals(a.end) || this.end.equals(a.start) && this.start.equals(a.end)
};
cvox.CursorSelection.prototype.directedBefore = function (a) {
    var b = this.start.node.compareDocumentPosition(a.start.node) == cvox.CursorSelection.BEFORE;
    return this.start.node == a.start.node || (this.isReversed() ? !b : b)
};
cvox.CursorSelection.prototype.normalize = function () {
    if (0 == this.absEnd().index && this.absEnd().node) {
        var a = this.absEnd().node,
            b = document.createRange();
        b.selectNodeContents(a);
        this.absEnd().index = b.endOffset
    }
    return this
};
cvox.CursorSelection.prototype.collapse = function () {
    if (this.start.equals(this.end)) {
        return this
    }
    this.end.copyFrom(this.start);
    if (0 == this.start.text.length) {
        return this
    }
    this.isReversed() ? 0 < this.end.index && this.end.index-- : this.end.index < this.end.text.length && this.end.index++;
    return this
};
