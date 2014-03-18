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

cvox.KeyMap = function (a) {
    this.bindings_ = a;
    this.commandToKey_ = {};
    this.buildCommandToKey_()
};
cvox.KeyMap.KEYMAP_PATH = "chromevox/background/keymaps/";
cvox.KeyMap.AVAILABLE_MAP_INFO = {
    keymap_classic: {
        file: "classic_keymap.json"
    },
    keymap_flat: {
        file: "flat_keymap.json"
    },
    keymap_experimental: {
        file: "experimental.json"
    }
};
cvox.KeyMap.DEFAULT_KEYMAP = 0;
cvox.KeyMap.prototype.length = function () {
    return this.bindings_.length
};
cvox.KeyMap.prototype.keys = function () {
    return this.bindings_.map(function (a) {
        return a.sequence
    })
};
cvox.KeyMap.prototype.bindings = function () {
    return this.bindings_
};
cvox.KeyMap.prototype.toJSON = function () {
    return JSON.stringify({
        bindings: this.bindings_
    })
};
cvox.KeyMap.prototype.toLocalStorage = function () {
    localStorage.keyBindings = this.toJSON()
};
cvox.KeyMap.prototype.hasBinding = function (a, b) {
    if (null != this.commandToKey_) {
        return this.commandToKey_[a] == b
    }
    for (var c = 0; c < this.bindings_.length; c++) {
        var d = this.bindings_[c];
        if (d.command == a && d.sequence == b) {
            return !0
        }
    }
    return !1
};
cvox.KeyMap.prototype.hasCommand = function (a) {
    if (null != this.commandToKey_) {
        return void 0 != this.commandToKey_[a]
    }
    for (var b = 0; b < this.bindings_.length; b++) {
        if (this.bindings_[b].command == a) {
            return !0
        }
    }
    return !1
};
cvox.KeyMap.prototype.hasKey = function (a) {
    for (var b = 0; b < this.bindings_.length; b++) {
        if (this.bindings_[b].sequence.equals(a)) {
            return !0
        }
    }
    return !1
};
cvox.KeyMap.prototype.commandForKey = function (a) {
    if (null != a) {
        for (var b = 0; b < this.bindings_.length; b++) {
            var c = this.bindings_[b];
            if (c.sequence.equals(a)) {
                return c.command
            }
        }
    }
    return null
};
cvox.KeyMap.prototype.keyForCommand = function (a) {
    if (null != this.commandToKey_) {
        return [this.commandToKey_[a]]
    }
    for (var b = [], c = 0; c < this.bindings_.length; c++) {
        var d = this.bindings_[c];
        d.command == a && b.push(d.sequence)
    }
    return 0 < b.length ? b : []
};
cvox.KeyMap.prototype.merge = function (a) {
    for (var b = a.keys(), c = !0, d = 0; d < b.length; ++d) {
        var e = b[d],
            f = a.commandForKey(e);
        "toggleStickyMode" != f && (e && f && !this.hasKey(e) && !this.hasCommand(f) ? this.bind_(f, e) : c = !1)
    }
    return c
};
cvox.KeyMap.prototype.rebind = function (a, b) {
    return this.hasCommand(a) && !this.hasKey(b) ? (this.bind_(a, b), !0) : !1
};
cvox.KeyMap.prototype.bind_ = function (a, b) {
    for (var c = !1, d = 0; d < this.bindings_.length; d++) {
        var e = this.bindings_[d];
        e.command == a && (delete e.sequence, e.sequence = b, null != this.commandToKey_ && (this.commandToKey_[e.command] = b), c = !0)
    }
    c || (e = {
        command: a,
        sequence: b
    }, this.bindings_.push(e), this.commandToKey_[e.command] = e.sequence)
};
cvox.KeyMap.fromDefaults = function () {
    return cvox.KeyMap.fromPath(cvox.KeyMap.KEYMAP_PATH + cvox.KeyMap.AVAILABLE_MAP_INFO.keymap_classic.file)
};
cvox.KeyMap.fromJSON = function (a) {
    try {
        var b = JSON.parse(a).bindings,
            b = b.filter(function (a) {
                return void 0 === a.sequence.platformFilter || cvox.PlatformUtil.matchesPlatform(a.sequence.platformFilter)
            })
    } catch (c) {
        return null
    }
    if ("object" != typeof b) {
        return null
    }
    for (a = 0; a < b.length; a++) {
        if (void 0 == b[a].command || void 0 == b[a].sequence) {
            return null
        }
        b[a].sequence = cvox.KeySequence.deserialize(b[a].sequence)
    }
    return new cvox.KeyMap(b)
};
cvox.KeyMap.fromLocalStorage = function () {
    return localStorage.keyBindings ? cvox.KeyMap.fromJSON(localStorage.keyBindings) : null
};
cvox.KeyMap.fromPath = function (a) {
    return cvox.KeyMap.fromJSON(cvox.KeyMap.readJSON_(a))
};
cvox.KeyMap.fromCurrentKeyMap = function () {
    var a = localStorage.currentKeyMap;
    return a && cvox.KeyMap.AVAILABLE_MAP_INFO[a] ? cvox.KeyMap.fromPath(cvox.KeyMap.KEYMAP_PATH + cvox.KeyMap.AVAILABLE_MAP_INFO[a].file) : cvox.KeyMap.fromDefaults()
};
cvox.KeyMap.readJSON_ = function (a) {
    var b = chrome.extension.getURL(a);
    if (!b) {
        throw "Invalid path: " + a;
    }
    a = new XMLHttpRequest;
    a.open("GET", b, !1);
    a.send();
    return a.responseText
};
cvox.KeyMap.prototype.resetModifier = function () {
    localStorage.cvoxKey = cvox.ChromeVox.isChromeOS ? "Shift+Search" : cvox.ChromeVox.isMac ? "Ctrl+Cmd" : "Ctrl+Alt"
};
cvox.KeyMap.prototype.buildCommandToKey_ = function () {
    for (var a = 0; a < this.bindings_.length; a++) {
        var b = this.bindings_[a];
        void 0 == this.commandToKey_[b.command] && (this.commandToKey_[b.command] = b.sequence)
    }
};
