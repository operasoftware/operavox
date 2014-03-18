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

cvox.TraverseContent = function (a) {
    this.currentDomObj = null != a ? a : document.body;
    var b = document.createRange();
    try {
        b.selectNode(this.currentDomObj), this.startCursor_ = new cvox.Cursor(b.startContainer, b.startOffset, cvox.TraverseUtil.getNodeText(b.startContainer)), this.endCursor_ = new cvox.Cursor(b.endContainer, b.endOffset, cvox.TraverseUtil.getNodeText(b.endContainer))
    } catch (c) {
        window.console.log("Error: Unselectable node:"), window.console.log(a)
    }
};
goog.addSingletonGetter(cvox.TraverseContent);
cvox.TraverseContent.prototype.lastSelectionWasWhitespace = !1;
cvox.TraverseContent.prototype.skipWhitespace = !1;
cvox.TraverseContent.prototype.skipInvalidSelections = !0;
cvox.TraverseContent.prototype.breakAtLinks = !0;
cvox.TraverseContent.kCharacter = "character";
cvox.TraverseContent.kWord = "word";
cvox.TraverseContent.kSentence = "sentence";
cvox.TraverseContent.kLine = "line";
cvox.TraverseContent.kParagraph = "paragraph";
cvox.TraverseContent.kAllGrains = [cvox.TraverseContent.kParagraph, cvox.TraverseContent.kSentence, cvox.TraverseContent.kLine, cvox.TraverseContent.kWord, cvox.TraverseContent.kCharacter];
cvox.TraverseContent.prototype.syncToSelection = function () {
    this.normalizeSelection();
    var a = window.getSelection();
    a && a.anchorNode && a.focusNode && (this.startCursor_ = new cvox.Cursor(a.anchorNode, a.anchorOffset, cvox.TraverseUtil.getNodeText(a.anchorNode)), this.endCursor_ = new cvox.Cursor(a.focusNode, a.focusOffset, cvox.TraverseUtil.getNodeText(a.focusNode)))
};
cvox.TraverseContent.prototype.syncToCursorSelection = function (a) {
    this.startCursor_ = a.start.clone();
    this.endCursor_ = a.end.clone()
};
cvox.TraverseContent.prototype.getCurrentCursorSelection = function () {
    return new cvox.CursorSelection(this.startCursor_, this.endCursor_)
};
cvox.TraverseContent.prototype.updateSelection = function () {
    cvox.TraverseUtil.setSelection(this.startCursor_, this.endCursor_);
    cvox.SelectionUtil.scrollToSelection(window.getSelection())
};
cvox.TraverseContent.prototype.getCurrentRange = function () {
    var a = document.createRange();
    try {
        a.setStart(this.startCursor_.node, this.startCursor_.index), a.setEnd(this.endCursor_.node, this.endCursor_.index)
    } catch (b) {
        console.log("Invalid range ")
    }
    return a
};
cvox.TraverseContent.prototype.getCurrentText = function () {
    return cvox.SelectionUtil.getRangeText(this.getCurrentRange())
};
cvox.TraverseContent.prototype.collapseToEnd = function () {
    this.startCursor_ = this.endCursor_.clone()
};
cvox.TraverseContent.prototype.collapseToStart = function () {
    this.endCursor_ = this.startCursor_.clone()
};
cvox.TraverseContent.prototype.moveNext = function (a) {
    var b = this.getBreakTags(),
        c = this.skipWhitespace,
        d = this.getCurrentRange();
    cvox.SelectionUtil.isRangeValid(d) || (c = !0);
    var e = [],
        f = [];
    do {
        a === cvox.TraverseContent.kSentence ? d = cvox.TraverseUtil.getNextSentence(this.startCursor_, this.endCursor_, e, f, b) : a === cvox.TraverseContent.kWord ? d = cvox.TraverseUtil.getNextWord(this.startCursor_, this.endCursor_, e, f) : a === cvox.TraverseContent.kCharacter ? d = cvox.TraverseUtil.getNextChar(this.startCursor_, this.endCursor_, e, f, c) : a === cvox.TraverseContent.kParagraph ? d = cvox.TraverseUtil.getNextParagraph(this.startCursor_, this.endCursor_, e, f) : a === cvox.TraverseContent.kLine ?
            d = cvox.TraverseUtil.getNextLine(this.startCursor_, this.endCursor_, e, f, b) : (window.console.log('Invalid selection granularity: "' + a + '"'), a = cvox.TraverseContent.kSentence, d = cvox.TraverseUtil.getNextSentence(this.startCursor_, this.endCursor_, e, f, b));
        if (null == d) {
            return null
        }
        var d = this.getCurrentRange(),
            g = !d.getBoundingClientRect()
    } while (this.skipInvalidSelections && g);
    if (cvox.SelectionUtil.isRangeValid(d)) {
        this.lastSelectionWasWhitespace = !1
    } else {
        if (this.lastSelectionWasWhitespace || a != cvox.TraverseContent.kCharacter) {
            for (; !cvox.SelectionUtil.isRangeValid(this.getCurrentRange()) && null != this.moveNext(a);) {}
        } else {
            this.lastSelectionWasWhitespace = !0
        }
    }
    return this.getCurrentText()
};
cvox.TraverseContent.prototype.movePrev = function (a) {
    var b = this.getBreakTags(),
        c = this.skipWhitespace,
        d = this.getCurrentRange();
    cvox.SelectionUtil.isRangeValid(d) || (c = !0);
    var e = [],
        f = [];
    do {
        a === cvox.TraverseContent.kSentence ? d = cvox.TraverseUtil.getPreviousSentence(this.startCursor_, this.endCursor_, e, f, b) : a === cvox.TraverseContent.kWord ? d = cvox.TraverseUtil.getPreviousWord(this.startCursor_, this.endCursor_, e, f) : a === cvox.TraverseContent.kCharacter ? d = cvox.TraverseUtil.getPreviousChar(this.startCursor_, this.endCursor_, e, f, c) : a === cvox.TraverseContent.kParagraph ? d = cvox.TraverseUtil.getPreviousParagraph(this.startCursor_, this.endCursor_, e, f) :
            a === cvox.TraverseContent.kLine ? d = cvox.TraverseUtil.getPreviousLine(this.startCursor_, this.endCursor_, e, f, b) : (window.console.log('Invalid selection granularity: "' + a + '"'), a = cvox.TraverseContent.kSentence, d = cvox.TraverseUtil.getPreviousSentence(this.startCursor_, this.endCursor_, e, f, b));
        if (null == d) {
            return null
        }
        var d = this.getCurrentRange(),
            g = !d.getBoundingClientRect()
    } while (this.skipInvalidSelections && g);
    if (cvox.SelectionUtil.isRangeValid(d)) {
        this.lastSelectionWasWhitespace = !1
    } else {
        if (this.lastSelectionWasWhitespace || a != cvox.TraverseContent.kCharacter) {
            for (; !cvox.SelectionUtil.isRangeValid(this.getCurrentRange()) && null != this.movePrev(a);) {}
        } else {
            this.lastSelectionWasWhitespace = !0
        }
    }
    return this.getCurrentText()
};
cvox.TraverseContent.prototype.getBreakTags = function () {
    return {
        A: this.breakAtLinks,
        BR: !0,
        HR: !0
    }
};
cvox.TraverseContent.prototype.nextElement = function (a, b) {
    null != b && (this.currentDomObj = b);
    var c = this.moveNext(a);
    return null == c || cvox.DomUtil.isDescendantOfNode(this.startCursor_.node, this.currentDomObj) && cvox.DomUtil.isDescendantOfNode(this.endCursor_.node, this.currentDomObj) ? c : null
};
cvox.TraverseContent.prototype.prevElement = function (a, b) {
    null != b && (this.currentDomObj = b);
    var c = this.movePrev(a);
    return null == c || cvox.DomUtil.isDescendantOfNode(this.startCursor_.node, this.currentDomObj) && cvox.DomUtil.isDescendantOfNode(this.endCursor_.node, this.currentDomObj) ? c : null
};
cvox.TraverseContent.prototype.normalizeSelection = function () {
    var a = window.getSelection();
    if (1 > a.rangeCount) {
        var b = document.createRange();
        b.setStart(this.currentDomObj, 0);
        b.setEnd(this.currentDomObj, 0);
        a.removeAllRanges();
        a.addRange(b)
    } else {
        if (1 < a.rangeCount) {
            for (b = 0; b < a.rangeCount - 1; b++) {
                a.removeRange(a.getRangeAt(b))
            }
        }
    }
};
cvox.TraverseContent.prototype.reset = function (a) {
    window.getSelection().removeAllRanges()
};
