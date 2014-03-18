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

cvox.TextChangeEvent = function (a, b, c, d) {
    this.value = a;
    this.start = b;
    this.end = c;
    this.triggeredByUser = d;
    this.start > this.end && (a = this.end, this.end = this.start, this.start = a)
};
cvox.TypingEcho = {
    CHARACTER: 0,
    WORD: 1,
    CHARACTER_AND_WORD: 2,
    NONE: 3,
    COUNT: 4
};
cvox.TypingEcho.cycle = function (a) {
    return (a + 1) % cvox.TypingEcho.COUNT
};
cvox.TypingEcho.shouldSpeakChar = function (a) {
    return a == cvox.TypingEcho.CHARACTER_AND_WORD || a == cvox.TypingEcho.CHARACTER
};
cvox.TextHandlerInterface = function () {};
cvox.TextHandlerInterface.prototype.changed = function (a) {};
cvox.ChromeVoxEditableTextBase = function (a, b, c, d, e) {
    this.value = a;
    this.start = b;
    this.end = c;
    this.isPassword = d;
    this.tts = e;
    this.multiline = !1;
    this.brailleHandler_ = cvox.ChromeVox.braille ? new cvox.BrailleTextHandler(cvox.ChromeVox.braille) : void 0
};
cvox.ChromeVoxEditableTextBase.useIBeamCursor = cvox.ChromeVox.isMac;
cvox.ChromeVoxEditableTextBase.eventTypingEcho = !1;
cvox.ChromeVoxEditableTextBase.prototype.maxShortPhraseLen = 60;
cvox.ChromeVoxEditableTextBase.prototype.isPassword = !1;
cvox.ChromeVoxEditableTextBase.prototype.lastChangeDescribed = !1;
cvox.ChromeVoxEditableTextBase.prototype.getValue = function () {
    var a = "";
    if (this.multiline) {
        if (a += "multiline editable text. ", this.start == this.end) {
            var b = this.getLine(this.getLineIndex(this.start)),
                a = b ? a + b : a + "blank"
        }
    } else {
        a = this.node ? a + cvox.DomUtil.getValue(this.node) : a + this.value, a = a <= this.maxShortPhraseLen ? a + ", editable text" : a.substring(0, this.maxShortPhraseLen) + ", editable text"
    }
    return a
};
cvox.ChromeVoxEditableTextBase.prototype.getLineIndex = function (a) {
    return 0
};
cvox.ChromeVoxEditableTextBase.prototype.getLineStart = function (a) {
    return 0
};
cvox.ChromeVoxEditableTextBase.prototype.getLineEnd = function (a) {
    return this.value.length
};
cvox.ChromeVoxEditableTextBase.prototype.getLine = function (a) {
    var b = this.getLineStart(a);
    a = this.getLineEnd(a);
    return this.value.substr(b, a - b).replace(/^\s+|\s+$/g, "")
};
cvox.ChromeVoxEditableTextBase.prototype.isWhitespaceChar = function (a) {
    return " " == a || "\n" == a || "\r" == a || "\t" == a
};
cvox.ChromeVoxEditableTextBase.prototype.isWordBreakChar = function (a) {
    return !!a.match(/^\W$/)
};
cvox.ChromeVoxEditableTextBase.prototype.isLastChar = function (a) {
    return void 0 == this.getLineIndex(a.start + 1)
};
cvox.ChromeVoxEditableTextBase.prototype.speak = function (a, b, c) {
    if (!this.node || document.activeElement == this.node) {
        var d = cvox.AbstractTts.QUEUE_MODE_QUEUE;
        !0 === b && (d = cvox.AbstractTts.QUEUE_MODE_FLUSH);
        this.tts.speak(a, d, c || {})
    }
};
cvox.ChromeVoxEditableTextBase.prototype.changed = function (a) {
    if (a.value != this.value || a.start != this.start || a.end != this.end || this.isLastChar(a)) {
        if (a.value == this.value ? this.describeSelectionChanged(a) : this.describeTextChanged(a), this.lastChangeDescribed = !0, this.value = a.value, this.start = a.start, this.end = a.end, this.brailleHandler_) {
            var b = this.getLine(this.getLineIndex(a.start)),
                c = this.getLineStart(this.getLineIndex(a.start));
            this.brailleHandler_.changed(b, a.start - c, a.end - c, this.multiline)
        }
    } else {
        this.lastChangeDescribed = !1
    }
};
cvox.ChromeVoxEditableTextBase.prototype.describeSelectionChanged = function (a) {
    if (this.isPassword) {
        this.speak((new goog.i18n.MessageFormat(cvox.ChromeVox.msgs.getMsg("dot"))).format({
            COUNT: 1
        }), a.triggeredByUser)
    } else {
        if (a.start == a.end) {
            if (this.start != this.end) {
                this.speak(cvox.ChromeVox.msgs.getMsg("Unselected"), a.triggeredByUser)
            } else {
                if (this.getLineIndex(this.start) != this.getLineIndex(a.start)) {
                    var b = this.getLine(this.getLineIndex(a.start));
                    "" == b && (b = cvox.ChromeVox.msgs.getMsg("text_box_blank"));
                    this.speak(b, a.triggeredByUser)
                } else {
                    this.start == a.start + 1 || this.start == a.start - 1 ? cvox.ChromeVoxEditableTextBase.useIBeamCursor ? this.speak(this.value.substr(Math.min(this.start, a.start), 1), a.triggeredByUser, {
                        phoneticCharacters: a.triggeredByUser
                    }) : a.start == this.value.length ? this.speak(cvox.ChromeVox.msgs.getMsg("end"), a.triggeredByUser) : this.speak(this.value.substr(a.start, 1), a.triggeredByUser, {
                        phoneticCharacters: a.triggeredByUser
                    }) : this.speak(this.value.substr(Math.min(this.start, a.start),
                        Math.abs(this.start - a.start)), a.triggeredByUser)
                }
            }
        } else {
            this.start + 1 == a.start && this.end == this.value.length && a.end == this.value.length ? (this.speak(this.value.substr(this.start, 1), a.triggeredByUser), this.speak(this.value.substr(a.start))) : this.start == this.end ? (this.speak(this.value.substr(a.start, a.end - a.start), a.triggeredByUser), this.speak(cvox.ChromeVox.msgs.getMsg("selected"))) : this.start == a.start && this.end < a.end ? (this.speak(this.value.substr(this.end, a.end - this.end), a.triggeredByUser), this.speak(cvox.ChromeVox.msgs.getMsg("added_to_selection"))) :
                this.start == a.start && this.end > a.end ? (this.speak(this.value.substr(a.end, this.end - a.end), a.triggeredByUser), this.speak(cvox.ChromeVox.msgs.getMsg("removed_from_selection"))) : this.end == a.end && this.start > a.start ? (this.speak(this.value.substr(a.start, this.start - a.start), a.triggeredByUser), this.speak(cvox.ChromeVox.msgs.getMsg("added_to_selection"))) : this.end == a.end && this.start < a.start ? (this.speak(this.value.substr(this.start, a.start - this.start), a.triggeredByUser),
                    this.speak(cvox.ChromeVox.msgs.getMsg("removed_from_selection"))) : (this.speak(this.value.substr(a.start, a.end - a.start), a.triggeredByUser), this.speak(cvox.ChromeVox.msgs.getMsg("selected")))
        }
    }
};
cvox.ChromeVoxEditableTextBase.prototype.describeTextChanged = function (a) {
    var b = {};
    a.value.length < this.value.length && (b = cvox.AbstractTts.PERSONALITY_DELETED);
    if (this.isPassword) {
        this.speak((new goog.i18n.MessageFormat(cvox.ChromeVox.msgs.getMsg("dot"))).format({
            COUNT: 1
        }), a.triggeredByUser, b)
    } else {
        var c = this.value,
            d = c.length,
            e = a.value.length,
            f = "",
            g = a.value,
            h = a.end;
        a.start < h && h == e && (f = g.substr(a.start), g = g.substr(0, a.start), h = a.start);
        var k = this.start,
            l = d - this.end;
        if (e >= k + l + (h - a.start) && g.substr(0, k) == c.substr(0, k) && g.substr(e - l) == c.substr(this.end)) {
            this instanceof cvox.ChromeVoxEditableContentEditable && !(e < d || this.isWordBreakChar(a.value[e - 1] || "")) || this.describeTextChangedHelper(a, k, l, f, b)
        } else {
            if (k = a.start, l = e - h, this.start == this.end && a.start == h && g.substr(0, k) == c.substr(0, k) && g.substr(e - l) == c.substr(d - l)) {
                this.describeTextChangedHelper(a, k, l, f, b)
            } else {
                g += f;
                if (g.length == c.length + 1 || g.length + 1 == c.length) {
                    if (g.length > c.length) {
                        if (0 == g.indexOf(c)) {
                            this.speak(g[g.length - 1], a.triggeredByUser, b);
                            return
                        }
                        if (1 == g.indexOf(c)) {
                            this.speak(g[0], a.triggeredByUser, b);
                            return
                        }
                    }
                    if (g.length < c.length) {
                        if (0 == c.indexOf(g)) {
                            this.speak(c[c.length - 1], a.triggeredByUser, b);
                            return
                        }
                        if (1 == c.indexOf(g)) {
                            this.speak(c[0], a.triggeredByUser, b);
                            return
                        }
                    }
                }
                if (this.multiline) {
                    a.value.length < this.value.length && this.speak(cvox.ChromeVox.msgs.getMsg("text_deleted"), a.triggeredByUser, b)
                } else {
                    if (e <= this.maxShortPhraseLen) {
                        this.describeTextChangedHelper(a, 0, 0, "", b)
                    } else {
                        for (k = 0; k < d && k < e && c[k] == g[k];) {
                            k++
                        }
                        for (; 0 < k && !this.isWordBreakChar(c[k - 1]);) {
                            k--
                        }
                        for (l = 0; l < d - k && l < e - k && c[d - l - 1] == g[e - l - 1];) {
                            l++
                        }
                        for (; 0 < l && !this.isWordBreakChar(c[d - l]);) {
                            l--
                        }
                        this.describeTextChangedHelper(a, k, l, "", b)
                    }
                }
            }
        }
    }
};
cvox.ChromeVoxEditableTextBase.prototype.describeTextChangedHelper = function (a, b, c, d, e) {
    var f = a.value.length,
        g = this.value.length - b - c,
        h = this.value.substr(b, g),
        k = f - b - c;
    c = a.value.substr(b, k);
    var l = "",
        f = a.triggeredByUser;
    if (1 < k) {
        l = c
    } else {
        if (1 == k) {
            if ((cvox.ChromeVox.typingEcho == cvox.TypingEcho.WORD || cvox.ChromeVox.typingEcho == cvox.TypingEcho.CHARACTER_AND_WORD) && this.isWordBreakChar(c) && 0 < b && !this.isWordBreakChar(a.value.substr(b - 1, 1))) {
                for (g = b; 0 < g && !this.isWordBreakChar(a.value[g - 1]);) {
                    g--
                }
                g < b ? l = a.value.substr(g, b + 1 - g) : (l = c, f = !1)
            } else {
                if (cvox.ChromeVox.typingEcho == cvox.TypingEcho.CHARACTER || cvox.ChromeVox.typingEcho == cvox.TypingEcho.CHARACTER_AND_WORD) {
                    l = cvox.ChromeVoxEditableTextBase.eventTypingEcho ? "" : c
                }
            }
        } else {
            1 < g && !d ? l = h + ", deleted" : 1 == g && (l = h)
        }
    }
    d && l ? l += ", " + d : d && (l = d);
    l && this.speak(l, f, e)
};
cvox.ChromeVoxEditableTextBase.prototype.moveCursorToNextCharacter = function () {
    return !1
};
cvox.ChromeVoxEditableTextBase.prototype.moveCursorToPreviousCharacter = function () {
    return !1
};
cvox.ChromeVoxEditableTextBase.prototype.moveCursorToNextWord = function () {
    return !1
};
cvox.ChromeVoxEditableTextBase.prototype.moveCursorToPreviousWord = function () {
    return !1
};
cvox.ChromeVoxEditableTextBase.prototype.moveCursorToNextLine = function () {
    return !1
};
cvox.ChromeVoxEditableTextBase.prototype.moveCursorToPreviousLine = function () {
    return !1
};
cvox.ChromeVoxEditableTextBase.prototype.moveCursorToNextParagraph = function () {
    return !1
};
cvox.ChromeVoxEditableTextBase.prototype.moveCursorToPreviousParagraph = function () {
    return !1
};
cvox.ChromeVoxEditableElement = function (a, b, c, d, e, f) {
    cvox.ChromeVoxEditableTextBase.call(this, b, c, d, e, f);
    this.node = a;
    this.justSpokeDescription_ = !1
};
goog.inherits(cvox.ChromeVoxEditableElement, cvox.ChromeVoxEditableTextBase);
cvox.ChromeVoxEditableElement.prototype.changed = function (a) {
    this.justSpokeDescription_ && this.value == a.value && (this.value = a.value, this.start = a.start, this.end = a.end, this.justSpokeDescription_ = !1);
    cvox.ChromeVoxEditableElement.superClass_.changed.call(this, a)
};
cvox.ChromeVoxEditableElement.prototype.getValue = function () {
    this.justSpokeDescription_ = !0;
    return cvox.ChromeVoxEditableElement.superClass_.getValue.call(this)
};
cvox.ChromeVoxEditableElement.prototype.moveCursorToNextCharacter = function () {
    var a = this.node;
    a.selectionEnd++;
    a.selectionStart = a.selectionEnd;
    cvox.ChromeVoxEventWatcher.handleTextChanged(!0);
    return !0
};
cvox.ChromeVoxEditableElement.prototype.moveCursorToPreviousCharacter = function () {
    var a = this.node;
    a.selectionStart--;
    a.selectionEnd = a.selectionStart;
    cvox.ChromeVoxEventWatcher.handleTextChanged(!0);
    return !0
};
cvox.ChromeVoxEditableElement.prototype.moveCursorToNextWord = function () {
    var a = this.node,
        b = a.value.length,
        c = /\W+/gm,
        d = a.value.substring(a.selectionEnd),
        e = c.exec(d);
    null !== e && 0 == e.index && (e = c.exec(d));
    a.selectionStart = a.selectionEnd = null === e ? b : e.index + a.selectionEnd;
    cvox.ChromeVoxEventWatcher.handleTextChanged(!0);
    return !0
};
cvox.ChromeVoxEditableElement.prototype.moveCursorToPreviousWord = function () {
    for (var a = this.node, b = /\W+/gm, c = a.value.substring(0, a.selectionStart), d = 0; null !== b.exec(c);) {
        b.lastIndex < a.selectionStart && (d = b.lastIndex)
    }
    a.selectionStart = a.selectionEnd = d;
    cvox.ChromeVoxEventWatcher.handleTextChanged(!0);
    return !0
};
cvox.ChromeVoxEditableElement.prototype.moveCursorToNextParagraph = function () {
    var a = this.node,
        b = a.value.length,
        c = a.selectionEnd >= b ? b : a.value.indexOf("\n", a.selectionEnd);
    0 > c && (c = b);
    a.selectionStart = a.selectionEnd = c + 1;
    cvox.ChromeVoxEventWatcher.handleTextChanged(!0);
    return !0
};
cvox.ChromeVoxEditableElement.prototype.moveCursorToPreviousParagraph = function () {
    var a = this.node,
        b = 0 >= a.selectionStart ? 0 : a.value.lastIndexOf("\n", a.selectionStart - 2) + 1;
    0 > b && (b = 0);
    a.selectionStart = a.selectionEnd = b;
    cvox.ChromeVoxEventWatcher.handleTextChanged(!0);
    return !0
};
cvox.ChromeVoxEditableHTMLInput = function (a, b) {
    cvox.ChromeVoxEditableElement.call(this, a, a.value, a.selectionStart, a.selectionEnd, "password" === a.type, b)
};
goog.inherits(cvox.ChromeVoxEditableHTMLInput, cvox.ChromeVoxEditableElement);
cvox.ChromeVoxEditableHTMLInput.prototype.update = function (a) {
    a = new cvox.TextChangeEvent(this.node.value, this.node.selectionStart, this.node.selectionEnd, a);
    this.changed(a)
};
cvox.ChromeVoxEditableTextArea = function (a, b) {
    cvox.ChromeVoxEditableElement.call(this, a, a.value, a.selectionStart, a.selectionEnd, !1, b);
    this.multiline = !0;
    this.shadowIsCurrent_ = !1
};
goog.inherits(cvox.ChromeVoxEditableTextArea, cvox.ChromeVoxEditableElement);
cvox.ChromeVoxEditableTextArea.prototype.update = function (a) {
    this.node.value != this.value && (this.shadowIsCurrent_ = !1);
    a = new cvox.TextChangeEvent(this.node.value, this.node.selectionStart, this.node.selectionEnd, a);
    this.changed(a)
};
cvox.ChromeVoxEditableTextArea.prototype.getLineIndex = function (a) {
    return this.getShadow().getLineIndex(a)
};
cvox.ChromeVoxEditableTextArea.prototype.getLineStart = function (a) {
    return this.getShadow().getLineStart(a)
};
cvox.ChromeVoxEditableTextArea.prototype.getLineEnd = function (a) {
    return this.getShadow().getLineEnd(a)
};
cvox.ChromeVoxEditableTextArea.prototype.getShadow = function () {
    var a = cvox.ChromeVoxEditableTextArea.shadow_;
    a || (a = cvox.ChromeVoxEditableTextArea.shadow_ = new cvox.EditableTextAreaShadow);
    this.shadowIsCurrent_ || (a.update(this.node), this.shadowIsCurrent_ = !0);
    return a
};
cvox.ChromeVoxEditableTextArea.prototype.moveCursorToNextLine = function () {
    var a = this.node,
        b = a.value.length;
    if (a.selectionEnd >= b) {
        return !1
    }
    var c = this.getShadow(),
        d = c.getLineIndex(a.selectionEnd),
        e = c.getLineStart(d),
        e = a.selectionEnd - e,
        f = 0 == b ? 0 : c.getLineIndex(b - 1),
        b = d >= f ? b : Math.min(c.getLineStart(d + 1) + e, c.getLineEnd(d + 1));
    a.selectionStart = a.selectionEnd = b;
    cvox.ChromeVoxEventWatcher.handleTextChanged(!0);
    return !0
};
cvox.ChromeVoxEditableTextArea.prototype.moveCursorToPreviousLine = function () {
    var a = this.node;
    if (0 >= a.selectionStart) {
        return !1
    }
    var b = this.getShadow(),
        c = b.getLineIndex(a.selectionStart),
        d = b.getLineStart(c),
        d = a.selectionStart - d,
        b = 0 >= c ? 0 : Math.min(b.getLineStart(c - 1) + d, b.getLineEnd(c - 1));
    a.selectionStart = a.selectionEnd = b;
    cvox.ChromeVoxEventWatcher.handleTextChanged(!0);
    return !0
};
cvox.ChromeVoxEditableContentEditable = function (a, b) {
    cvox.ChromeVoxEditableElement.call(this, a, "", 0, 0, !1, b);
    this.extractorIsCurrent_ = !1;
    var c = this.getExtractor();
    this.value = c.getText();
    this.start = c.getStartIndex();
    this.end = c.getEndIndex();
    this.multiline = !0
};
goog.inherits(cvox.ChromeVoxEditableContentEditable, cvox.ChromeVoxEditableElement);
cvox.ChromeVoxEditableContentEditable.prototype.update = function (a) {
    this.extractorIsCurrent_ = !1;
    a = new cvox.TextChangeEvent(this.getExtractor().getText(), this.getExtractor().getStartIndex(), this.getExtractor().getEndIndex(), a);
    this.changed(a)
};
cvox.ChromeVoxEditableContentEditable.prototype.getLineIndex = function (a) {
    return this.getExtractor().getLineIndex(a)
};
cvox.ChromeVoxEditableContentEditable.prototype.getLineStart = function (a) {
    return this.getExtractor().getLineStart(a)
};
cvox.ChromeVoxEditableContentEditable.prototype.getLineEnd = function (a) {
    return this.getExtractor().getLineEnd(a)
};
cvox.ChromeVoxEditableContentEditable.prototype.getExtractor = function () {
    var a = cvox.ChromeVoxEditableContentEditable.extractor_;
    a || (a = cvox.ChromeVoxEditableContentEditable.extractor_ = new cvox.ContentEditableExtractor);
    this.extractorIsCurrent_ || (a.update(this.node), this.extractorIsCurrent_ = !0);
    return a
};
cvox.ChromeVoxEditableContentEditable.prototype.describeSelectionChanged = function (a) {
    a.triggeredByUser && (this.start == this.end && a.start == a.end && 1 != Math.abs(this.start - a.start) && this.isLastChar(a) ? this.speak(cvox.ChromeVox.msgs.getMsg("text_box_blank"), !0) : cvox.ChromeVoxEditableContentEditable.superClass_.describeSelectionChanged.call(this, a))
};
cvox.ChromeVoxEditableContentEditable.prototype.moveCursorToNextCharacter = function () {
    window.getSelection().modify("move", "forward", "character");
    cvox.ChromeVoxEventWatcher.handleTextChanged(!0);
    return !0
};
cvox.ChromeVoxEditableContentEditable.prototype.moveCursorToPreviousCharacter = function () {
    window.getSelection().modify("move", "backward", "character");
    cvox.ChromeVoxEventWatcher.handleTextChanged(!0);
    return !0
};
cvox.ChromeVoxEditableContentEditable.prototype.moveCursorToNextParagraph = function () {
    window.getSelection().modify("move", "forward", "paragraph");
    cvox.ChromeVoxEventWatcher.handleTextChanged(!0);
    return !0
};
cvox.ChromeVoxEditableContentEditable.prototype.moveCursorToPreviousParagraph = function () {
    window.getSelection().modify("move", "backward", "paragraph");
    cvox.ChromeVoxEventWatcher.handleTextChanged(!0);
    return !0
};
