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

cvox.AndroidVox = function () {
    cvox.ChromeVox.navigationManager.ignoreIframesNoMatterWhat()
};
goog.exportSymbol("cvox.AndroidVox", cvox.AndroidVox);
cvox.AndroidVox.performAction = function (a) {
    var b = JSON.parse(a);
    a = b.action;
    var c = b.granularity,
        b = b.element,
        d = cvox.SearchWidget.getInstance().isActive();
    16 == c && 512 == a && (cvox.ChromeVox.navigationManager.setReversed(!1), cvox.ChromeVox.navigationManager.syncToBeginning(), cvox.ChromeVox.navigationManager.updateIndicator());
    if (16 == c) {
        return cvox.ChromeVoxUserCommands.commands.readFromHere(), !0
    }
    cvox.ChromeVoxUserCommands.commands.stopSpeech();
    if (256 == a || 512 == a) {
        d || cvox.ChromeVoxEventWatcher.setUpTextHandler()
    }
    var e = cvox.ChromeVoxEventWatcher.currentTextHandler;
    e || document.activeElement == document.body || console.log("no text handler, but there is an active element", document.activeElement);
    if (e && 1 == c) {
        if (256 == a) {
            return e.moveCursorToNextCharacter()
        }
        if (512 == a) {
            return e.moveCursorToPreviousCharacter()
        }
    } else {
        if (e && 2 == c) {
            if (256 == a) {
                return e.moveCursorToNextWord()
            }
            if (512 == a) {
                return e.moveCursorToPreviousWord()
            }
        } else {
            if (e && 8 == c) {
                if (256 == a) {
                    return e.moveCursorToNextParagraph()
                }
                if (512 == a) {
                    return e.moveCursorToPreviousParagraph()
                }
            } else {
                if (e && 4 == c) {
                    var f = !1;
                    256 == a ? f = e.moveCursorToNextLine() : 512 == a && (f = e.moveCursorToPreviousLine());
                    if (f) {
                        return !0
                    }
                }
            }
        }
    }
    switch (c) {
    case -1:
        return cvox.ChromeVox.navigationManager.finishNavCommand(""), !0;
    case -2:
        return cvox.ChromeVoxUserCommands.commands.readCurrentTitle(), !0;
    case -3:
        return !0;
    case -4:
        return 512 == a ? cvox.ChromeVoxUserCommands.commands.exitShifter() : cvox.ChromeVoxUserCommands.commands.enterShifter(), !0;
    case -5:
        return cvox.SearchWidget.getInstance().toggle(), !0
    }
    if (-275999999 <= c && -275E6 >= c) {
        cvox.ChromeVox.tts.speak(cvox.ChromeVox.msgs.getMsg("element_clicked"), cvox.AbstractTts.QUEUE_MODE_FLUSH, cvox.AbstractTts.PERSONALITY_ANNOTATION);
        a = cvox.ChromeVox.navigationManager.getBraille();
        b = -275E6 - c;
        if (c = a.text.getSpan(b)) {
            a = b - a.text.getSpanStart(c), cvox.AndroidVox.performClickAction(c, a)
        }
        return !0
    }
    if (0 > c) {
        return !1
    }
    e = [];
    e[8] = cvox.NavigationShifter.GRANULARITIES.GROUP;
    e[4] = cvox.NavigationShifter.GRANULARITIES.LINE;
    e[2] = cvox.NavigationShifter.GRANULARITIES.WORD;
    e[1] = cvox.NavigationShifter.GRANULARITIES.CHARACTER;
    d || cvox.ChromeVox.navigationManager.setGranularity(c ? e[c] : cvox.NavigationShifter.GRANULARITIES.OBJECT);
    c = !1;
    switch (a) {
    case 16:
        if (d) {
            break
        }
        cvox.ChromeVox.tts.speak(cvox.ChromeVox.msgs.getMsg("element_clicked"), cvox.AbstractTts.QUEUE_MODE_FLUSH, cvox.AbstractTts.PERSONALITY_ANNOTATION);
        (c = cvox.ChromeVox.navigationManager.getCurrentNode()) && cvox.AndroidVox.performClickAction(c);
        c = !0;
        break;
    case 1024:
        switch (b) {
        case "SECTION":
            c = !cvox.ChromeVoxUserCommands.commands.nextSection();
            break;
        case "LIST":
            c = !cvox.ChromeVoxUserCommands.commands.nextList();
            break;
        case "CONTROL":
            c = !cvox.ChromeVoxUserCommands.commands.nextControl()
        }
        if (c) {
            break
        };
    case 256:
        d ? (cvox.SearchWidget.getInstance().nextResult(!1), c = !0) : c = !cvox.ChromeVoxUserCommands.commands.forward();
        break;
    case 2048:
        switch (b) {
        case "SECTION":
            c = !cvox.ChromeVoxUserCommands.commands.previousSection();
            break;
        case "LIST":
            c = !cvox.ChromeVoxUserCommands.commands.previousList();
            break;
        case "CONTROL":
            c = !cvox.ChromeVoxUserCommands.commands.previousControl()
        }
        if (c) {
            break
        };
    case 512:
        d ? (cvox.SearchWidget.getInstance().nextResult(!0), c = !0) : c = !cvox.ChromeVoxUserCommands.commands.backward()
    }
    return c
};
goog.exportSymbol("cvox.AndroidVox.performAction", cvox.AndroidVox.performAction);
cvox.AndroidVox.performClickAction = function (a, b) {
    cvox.ChromeVox.navigationManager.getCurrentNode() != a && cvox.ApiImplementation.syncToNode(a, !1);
    cvox.Focuser.setFocus(a);
    var c = cvox.DomUtil.isInputTypeText(a) || a instanceof HTMLTextAreaElement;
    if (goog.isDef(b) && c) {
        var d = cvox.BrailleUtil.getTemplated(null, a),
            c = d.getSpanInstanceOf(cvox.BrailleUtil.ValueSpan),
            e = d.getSpanStart(c),
            d = d.getSpanEnd(c);
        e <= b && b <= d && (a.selectionStart = a.selectionEnd = b - e + c.offset, cvox.ChromeVoxEventWatcher.handleTextChanged(!0))
    }
    cvox.DomUtil.clickElem(a, !1, !0)
};
