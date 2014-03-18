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

cvox.KeyUtil = function () {};
cvox.KeyUtil.modeKeyPressTime = 0;
cvox.KeyUtil.sequencing = !1;
cvox.KeyUtil.prevKeySequence = null;
cvox.KeyUtil.stickyKeySequence = null;
cvox.KeyUtil.maxSeqLength = 2;
cvox.KeyUtil.keyEventToKeySequence = function (a) {
    var b = cvox.KeyUtil;
    b.prevKeySequence && b.maxSeqLength == b.prevKeySequence.length() && (b.sequencing = !1, b.prevKeySequence = null);
    var c = b.sequencing || a.keyPrefix || a.stickyMode,
        d = new cvox.KeySequence(a),
        e = d.cvoxModifier;
    if (c || e) {
        if (!b.sequencing && b.isSequenceSwitchKeyCode(d)) {
            return b.sequencing = !0, b.prevKeySequence = d
        }
        if (b.sequencing) {
            if (b.prevKeySequence.addKeyEvent(a)) {
                return d = b.prevKeySequence, b.prevKeySequence = null, b.sequencing = !1, d
            }
            throw "Think sequencing is enabled, yet util.prevKeySequence alreadyhas two key codes" + b.prevKeySequence;
        }
    } else {
        b.sequencing = !1
    }
    c = (new Date).getTime();
    if (cvox.KeyUtil.isDoubleTapKey(d) && b.prevKeySequence && d.equals(b.prevKeySequence) && (e = b.modeKeyPressTime, 0 < e && 300 > c - e)) {
        return d = b.prevKeySequence, d.doubleTap = !0, b.prevKeySequence = null, b.sequencing = !1, cvox.ChromeVox.isChromeOS && a.keyCode == cvox.KeyUtil.getStickyKeyCode() && (cvox.ChromeVox.searchKeyHeld = !1), d
    }
    b.prevKeySequence = d;
    b.modeKeyPressTime = c;
    return d
};
cvox.KeyUtil.keyCodeToString = function (a) {
    return 17 == a ? "Ctrl" : 18 == a ? "Alt" : 16 == a ? "Shift" : 91 == a || 93 == a ? cvox.ChromeVox.isChromeOS ? "Search" : cvox.ChromeVox.isMac ? "Cmd" : "Win" : 45 == a ? "Insert" : 65 <= a && 90 >= a ? String.fromCharCode(a) : 48 <= a && 57 >= a ? String.fromCharCode(a) : "#" + a
};
cvox.KeyUtil.modStringToKeyCode = function (a) {
    switch (a) {
    case "Ctrl":
        return 17;
    case "Alt":
        return 18;
    case "Shift":
        return 16;
    case "Cmd":
        ;
    case "Win":
        return 91
    }
    return -1
};
cvox.KeyUtil.cvoxModKeyCodes = function () {
    return cvox.ChromeVox.modKeyStr.split(/\+/g).map(function (a) {
        return cvox.KeyUtil.modStringToKeyCode(a)
    })
};
cvox.KeyUtil.isSequenceSwitchKeyCode = function (a) {
    for (var b = 0; b < cvox.ChromeVox.sequenceSwitchKeyCodes.length; b++) {
        if (cvox.ChromeVox.sequenceSwitchKeyCodes[b].equals(a)) {
            return !0
        }
    }
    return !1
};
cvox.KeyUtil.getReadableNameForKeyCode = function (a) {
    if (0 == a) {
        return "Power button"
    }
    if (17 == a) {
        return "Control"
    }
    if (18 == a) {
        return "Alt"
    }
    if (16 == a) {
        return "Shift"
    }
    if (9 == a) {
        return "Tab"
    }
    if (91 == a || 93 == a) {
        return cvox.ChromeVox.isChromeOS ? "Search" : cvox.ChromeVox.isMac ? "Cmd" : "Win"
    }
    if (8 == a) {
        return "Backspace"
    }
    if (32 == a) {
        return "Space"
    }
    if (35 == a) {
        return "end"
    }
    if (36 == a) {
        return "home"
    }
    if (37 == a) {
        return "Left arrow"
    }
    if (38 == a) {
        return "Up arrow"
    }
    if (39 == a) {
        return "Right arrow"
    }
    if (40 == a) {
        return "Down arrow"
    }
    if (45 == a) {
        return "Insert"
    }
    if (13 == a) {
        return "Enter"
    }
    if (27 == a) {
        return "Escape"
    }
    if (112 == a) {
        return cvox.ChromeVox.isChromeOS ? "Back" : "F1"
    }
    if (113 == a) {
        return cvox.ChromeVox.isChromeOS ? "Forward" : "F2"
    }
    if (114 == a) {
        return cvox.ChromeVox.isChromeOS ? "Refresh" : "F3"
    }
    if (115 == a) {
        return cvox.ChromeVox.isChromeOS ? "Toggle full screen" : "F4"
    }
    if (116 == a) {
        return "F5"
    }
    if (117 == a) {
        return "F6"
    }
    if (118 == a) {
        return "F7"
    }
    if (119 == a) {
        return "F8"
    }
    if (120 == a) {
        return "F9"
    }
    if (121 == a) {
        return "F10"
    }
    if (122 == a) {
        return "F11"
    }
    if (123 == a) {
        return "F12"
    }
    if (186 == a) {
        return "Semicolon"
    }
    if (187 == a) {
        return "Equal sign"
    }
    if (188 == a) {
        return "Comma"
    }
    if (189 == a) {
        return "Dash"
    }
    if (190 == a) {
        return "Period"
    }
    if (191 == a) {
        return "Forward slash"
    }
    if (192 == a) {
        return "Grave accent"
    }
    if (219 == a) {
        return "Open bracket"
    }
    if (220 == a) {
        return "Back slash"
    }
    if (221 == a) {
        return "Close bracket"
    }
    if (222 == a) {
        return "Single quote"
    }
    if (115 == a) {
        return "Toggle full screen"
    }
    if (48 <= a && 90 >= a) {
        return String.fromCharCode(a)
    }
};
cvox.KeyUtil.getStickyKeyCode = function () {
    var a = 45;
    if (cvox.ChromeVox.isChromeOS || cvox.ChromeVox.isMac) {
        a = 91
    }
    return a
};
cvox.KeyUtil.getStickyKeySequence = function () {
    if (null == cvox.KeyUtil.stickyKeySequence) {
        var a = {
            keyCode: cvox.KeyUtil.getStickyKeyCode(),
            stickyMode: !0
        }, b = new cvox.KeySequence(a);
        b.addKeyEvent(a);
        cvox.KeyUtil.stickyKeySequence = b
    }
    return cvox.KeyUtil.stickyKeySequence
};
cvox.KeyUtil.getReadableNameForStr = function (a) {
    return null
};
cvox.KeyUtil.keySequenceToString = function (a, b, c) {
    for (var d = "", e = a.length(), f = 0; f < e; f++) {
        "" == d || c ? "" != d && (d += "+") : d += ">";
        var g = "",
            h;
        for (h in a.keys) {
            if (a.keys[h][f]) {
                var k = "";
                switch (h) {
                case "ctrlKey":
                    k = "Ctrl";
                    break;
                case "searchKeyHeld":
                    k = cvox.KeyUtil.getReadableNameForKeyCode(91);
                    break;
                case "altKey":
                    k = "Alt";
                    break;
                case "altGraphKey":
                    k = "AltGraph";
                    break;
                case "shiftKey":
                    k = "Shift";
                    break;
                case "metaKey":
                    k = cvox.KeyUtil.getReadableNameForKeyCode(91);
                    break;
                case "keyCode":
                    var l = a.keys[h][f];
                    a.isModifierKey(l) || c || (g = b ? g + cvox.KeyUtil.getReadableNameForKeyCode(l) : g + cvox.KeyUtil.keyCodeToString(l))
                } - 1 == d.indexOf(k) && (g += k + "+")
            }
        }
        d += g;
        "+" == d[d.length - 1] && (d = d.slice(0, -1))
    }
    a.cvoxModifier || a.prefixKey ? d = "" != d ? "Cvox+" + d : "Cvox" : a.stickyMode && (">" == d[d.length - 1] && (d = d.slice(0, -1)), d = d + "+" + d);
    return d
};
cvox.KeyUtil.isDoubleTapKey = function (a) {
    var b = !1,
        c = a.doubleTap;
    a.doubleTap = !0;
    for (var d = 0, e; e = cvox.KeySequence.doubleTapCache[d]; d++) {
        if (e.equals(a)) {
            b = !0;
            break
        }
    }
    a.doubleTap = c;
    return b
};
