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

cvox.EditableTextAreaShadow = function () {
    this.shadowElement_ = document.createElement("div");
    this.lines_ = {};
    this.characterToLineMap_ = []
};
cvox.EditableTextAreaShadow.prototype.update = function (a) {
    for (document.body.appendChild(this.shadowElement_); this.shadowElement_.childNodes.length;) {
        this.shadowElement_.removeChild(this.shadowElement_.childNodes[0])
    }
    this.shadowElement_.style.cssText = window.getComputedStyle(a, null).cssText;
    this.shadowElement_.style.position = "absolute";
    this.shadowElement_.style.top = -9999;
    this.shadowElement_.style.left = -9999;
    this.shadowElement_.setAttribute("aria-hidden", "true");
    var b = a.value,
        c = document.createTextNode(b + ".");
    this.shadowElement_.appendChild(c);
    a = {
        0: {
            startIndex: 0,
            endIndex: 0
        }
    };
    for (var d = document.createRange(), e = 0, f = 0, g = 0, h = null, k = !1, l; e <= b.length;) {
        d.setStart(c, e);
        if (e + 8 > b.length || 0 <= b.substr(e, 8).indexOf("\n")) {
            k = !0
        }
        k ? (e++, d.setEnd(c, e), l = d.getBoundingClientRect()) : (d.setEnd(c, e + 8), l = d.getBoundingClientRect(), l.bottom == h ? e += 8 : (l && null !== h && (k = !0), e++, d.setEnd(c, e), l = d.getBoundingClientRect()));
        0 < e && "\n" == b[e - 1] ? (a[g].endIndex = e - 1, g++, a[g] = {
            startIndex: e,
            endIndex: e
        }, h = null, k = !1, f = e) : l && null === h ? h = l.bottom : l && l.bottom != h && (a[g].endIndex = f, g++, a[g] = {
            startIndex: f,
            endIndex: f
        }, h = l ? l.bottom : null, k = !1);
        l && (f = e)
    }
    a[g].endIndex = b.length;
    b = [];
    for (c = 0; c <= g; c++) {
        for (d = a[c].startIndex; d <= a[c].endIndex; d++) {
            b[d] = c
        }
    }
    this.characterToLineMap_ = b;
    this.lines_ = a;
    document.body.removeChild(this.shadowElement_)
};
cvox.EditableTextAreaShadow.prototype.getLineIndex = function (a) {
    return this.characterToLineMap_[a]
};
cvox.EditableTextAreaShadow.prototype.getLineStart = function (a) {
    return this.lines_[a].startIndex
};
cvox.EditableTextAreaShadow.prototype.getLineEnd = function (a) {
    return this.lines_[a].endIndex
};
