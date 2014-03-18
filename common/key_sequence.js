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

cvox.KeySequence = function (a, b, c, d) {
    this.doubleTap = !! d;
    this.cvoxModifier = void 0 == b ? this.isCVoxModifierActive(a) : b;
    this.stickyMode = !! a.stickyMode;
    this.prefixKey = !! a.keyPrefix;
    this.skipStripping = !! c;
    if (this.stickyMode && this.prefixKey) {
        throw "Prefix key and sticky mode cannot both be enabled: " + a;
    }
    a = this.resolveChromeOSSpecialKeys_(a);
    this.keys = {
        ctrlKey: [],
        searchKeyHeld: [],
        altKey: [],
        altGraphKey: [],
        shiftKey: [],
        metaKey: [],
        keyCode: []
    };
    this.extractKey_(a)
};
cvox.KeySequence.KEY_PRESS_CODE = {
    39: 222,
    44: 188,
    45: 189,
    46: 190,
    47: 191,
    59: 186,
    91: 219,
    92: 220,
    93: 221
};
cvox.KeySequence.doubleTapCache = [];
cvox.KeySequence.prototype.addKeyEvent = function (a) {
    if (1 < this.keys.keyCode.length) {
        return !1
    }
    this.extractKey_(a);
    return !0
};
cvox.KeySequence.prototype.equals = function (a) {
    if (!this.checkKeyEquality_(a) || this.doubleTap != a.doubleTap) {
        return !1
    }
    if (this.cvoxModifier === a.cvoxModifier) {
        return !0
    }
    a = this.cvoxModifier ? a : this;
    return a.stickyMode || a.prefixKey
};
cvox.KeySequence.prototype.extractKey_ = function (a) {
    for (var b in this.keys) {
        if ("keyCode" == b) {
            var c;
            "keypress" == a.type && 97 <= a[b] && 122 >= a[b] ? c = a[b] - 32 : "keypress" == a.type && (c = cvox.KeySequence.KEY_PRESS_CODE[a[b]]);
            this.keys[b].push(c || a[b])
        } else {
            this.isKeyModifierActive(a, b) ? this.keys[b].push(!0) : this.keys[b].push(!1)
        }
    }
    this.cvoxModifier && this.rationalizeKeys_()
};
cvox.KeySequence.prototype.rationalizeKeys_ = function () {
    if (!this.skipStripping) {
        var a = cvox.ChromeVox.modKeyStr.split(/\+/g),
            b = this.keys.keyCode.length - 1; - 1 != a.indexOf("Ctrl") && (this.keys.ctrlKey[b] = !1); - 1 != a.indexOf("Alt") && (this.keys.altKey[b] = !1); - 1 != a.indexOf("Shift") && (this.keys.shiftKey[b] = !1);
        var c = this.getMetaKeyName_();
        if (-1 != a.indexOf(c)) {
            if ("Search" == c) {
                this.keys.searchKeyHeld[b] = !1
            } else {
                if ("Cmd" == c || "Win" == c) {
                    this.keys.metaKey[b] = !1
                }
            }
        }
    }
};
cvox.KeySequence.prototype.getMetaKeyName_ = function () {
    return cvox.ChromeVox.isChromeOS ? "Search" : cvox.ChromeVox.isMac ? "Cmd" : "Win"
};
cvox.KeySequence.prototype.checkKeyEquality_ = function (a) {
    for (var b in this.keys) {
        for (var c = this.keys[b].length; c--;) {
            if (this.keys[b][c] !== a.keys[b][c]) {
                return !1
            }
        }
    }
    return !0
};
cvox.KeySequence.prototype.getFirstKeyCode = function () {
    return this.keys.keyCode[0]
};
cvox.KeySequence.prototype.length = function () {
    return this.keys.keyCode.length
};
cvox.KeySequence.prototype.isModifierKey = function (a) {
    return 16 == a || 17 == a || 18 == a || 91 == a || 93 == a
};
cvox.KeySequence.prototype.isCVoxModifierActive = function (a) {
    var b = cvox.ChromeVox.modKeyStr.split(/\+/g);
    this.isKeyModifierActive(a, "ctrlKey") && (b = b.filter(function (a) {
        return "Ctrl" != a
    }));
    this.isKeyModifierActive(a, "altKey") && (b = b.filter(function (a) {
        return "Alt" != a
    }));
    this.isKeyModifierActive(a, "shiftKey") && (b = b.filter(function (a) {
        return "Shift" != a
    }));
    if (this.isKeyModifierActive(a, "metaKey") || this.isKeyModifierActive(a, "searchKeyHeld")) {
        var c = this.getMetaKeyName_(),
            b = b.filter(function (a) {
                return a != c
            })
    }
    return 0 == b.length
};
cvox.KeySequence.prototype.isKeyModifierActive = function (a, b) {
    switch (b) {
    case "ctrlKey":
        return a.ctrlKey || 17 == a.keyCode;
    case "altKey":
        return a.altKey || 18 == a.keyCode;
    case "shiftKey":
        return a.shiftKey || 16 == a.keyCode;
    case "metaKey":
        return a.metaKey || !cvox.ChromeVox.isChromeOS && 91 == a.keyCode;
    case "searchKeyHeld":
        return cvox.ChromeVox.isChromeOS && 91 == a.keyCode || a.searchKeyHeld
    }
    return !1
};
cvox.KeySequence.prototype.isAnyModifierActive = function () {
    for (var a in this.keys) {
        for (var b = 0; b < this.length(); b++) {
            if (this.keys[a][b] && "keyCode" != a) {
                return !0
            }
        }
    }
    return !1
};
cvox.KeySequence.deserialize = function (a) {
    var b = {};
    b.stickyMode = void 0 == a.stickyMode ? !1 : a.stickyMode;
    b.prefixKey = void 0 == a.prefixKey ? !1 : a.prefixKey;
    var c = 1 < a.keys.keyCode.length,
        d = {}, e;
    for (e in a.keys) {
        b[e] = a.keys[e][0], c && (d[e] = a.keys[e][1])
    }
    e = new cvox.KeySequence(b, a.cvoxModifier, !0, a.doubleTap);
    c && (cvox.ChromeVox.sequenceSwitchKeyCodes.push(new cvox.KeySequence(b, a.cvoxModifier)), e.addKeyEvent(d));
    a.doubleTap && cvox.KeySequence.doubleTapCache.push(e);
    return e
};
cvox.KeySequence.fromStr = function (a) {
    var b = {}, c = {}, d;
    d = -1 == a.indexOf(">") ? !1 : !0;
    var e = !1;
    b.stickyMode = !1;
    b.prefixKey = !1;
    a = a.split("+");
    for (var f = 0; f < a.length; f++) {
        for (var g = a[f].split(">"), h = 0; h < g.length; h++) {
            if ("#" == g[h].charAt(0)) {
                var k = parseInt(g[h].substr(1), 10);
                0 < h ? c.keyCode = k : b.keyCode = k
            }
            k = g[h];
            1 == g[h].length ? 0 < h ? c.keyCode = g[h].charCodeAt(0) : b.keyCode = g[h].charCodeAt(0) : (0 < h ? cvox.KeySequence.setModifiersOnEvent_(k, c) : cvox.KeySequence.setModifiersOnEvent_(k, b), "Cvox" == k && (e = !0))
        }
    }
    b = new cvox.KeySequence(b, e);
    d && b.addKeyEvent(c);
    return b
};
cvox.KeySequence.setModifiersOnEvent_ = function (a, b) {
    "Ctrl" == a ? (b.ctrlKey = !0, b.keyCode = 17) : "Alt" == a ? (b.altKey = !0, b.keyCode = 18) : "Shift" == a ? (b.shiftKey = !0, b.keyCode = 16) : "Search" == a ? (b.searchKeyHeld = !0, b.keyCode = 91) : "Cmd" == a ? (b.metaKey = !0, b.keyCode = 91) : "Win" == a ? (b.metaKey = !0, b.keyCode = 91) : "Insert" == a && (b.keyCode = 45)
};
cvox.KeySequence.prototype.resolveChromeOSSpecialKeys_ = function (a) {
    if (!this.cvoxModifier || this.stickyMode || this.prefixKey || !cvox.ChromeVox.isChromeOS) {
        return a
    }
    var b = {}, c;
    for (c in a) {
        b[c] = a[c]
    }
    switch (b.keyCode) {
    case 33:
        b.keyCode = 38;
        break;
    case 34:
        b.keyCode = 40;
        break;
    case 35:
        b.keyCode = 39;
        break;
    case 36:
        b.keyCode = 37;
        break;
    case 45:
        b.keyCode = 190;
        break;
    case 46:
        b.keyCode = 8;
        break;
    case 112:
        b.keyCode = 49;
        break;
    case 113:
        b.keyCode = 50;
        break;
    case 114:
        b.keyCode = 51;
        break;
    case 115:
        b.keyCode = 52;
        break;
    case 116:
        b.keyCode = 53;
        break;
    case 117:
        b.keyCode = 54;
        break;
    case 118:
        b.keyCode = 55;
        break;
    case 119:
        b.keyCode = 56;
        break;
    case 120:
        b.keyCode = 57;
        break;
    case 121:
        b.keyCode = 48;
        break;
    case 122:
        b.keyCode = 189;
        break;
    case 123:
        b.keyCode = 187
    }
    return b
};
