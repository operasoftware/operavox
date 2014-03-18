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

cvox.ContentEditableExtractor = function () {
    this.text_ = "";
    this.end_ = this.start_ = 0;
    this.lines_ = {};
    this.characterToLineMap_ = []
};
cvox.ContentEditableExtractor.prototype.update = function (a) {
    var b = {
        0: {
            startIndex: 0,
            endIndex: 0
        }
    }, c = new cvox.Cursor(a, 0, ""),
        d = c.clone(),
        e = document.createRange(),
        f, g = 0,
        h = null,
        k = "",
        l = 0,
        m = -1,
        p = -1;
    f = window.getSelection();
    for (var q = new cvox.Cursor(f.baseNode, f.baseOffset, ""), n = new cvox.Cursor(f.extentNode, f.extentOffset, ""), s = !1, u = !1;;) {
        var t = [],
            r = cvox.TraverseUtil.forwardsChar(d, [], t),
            v = !1;
        r || (v = !0);
        for (f = 0; f < t.length && !v; f++) {
            t[f] == a && (v = !0)
        }
        if (v) {
            break
        }
        e.setStart(c.node, c.index);
        e.setEnd(d.node, d.index);
        if ((f = e.getBoundingClientRect()) && 0 != f.width && 0 != f.height) {
            null !== h && f.bottom != h && 0 < l && k.substr(-1).match(/\S/) && r.match(/\S/) && (k += "\n", l++);
            if (c.node != d.node && 0 < d.index && (e.setStart(d.node, d.index - 1), f = e.getBoundingClientRect(), !f || 0 == f.width || 0 == f.height)) {
                continue
            }!s && -1 == m && d.node == q.node && d.index >= q.index && (d.index > q.index ? m = l : s = !0);
            !u && -1 == p && d.node == n.node && d.index >= n.index && (d.index > n.index ? p = l : u = !0);
            null === h ? h = f.bottom : f.bottom != h && (b[g].endIndex = l, g++, b[g] = {
                startIndex: l,
                endIndex: l
            }, h = f.bottom);
            k += r;
            l++;
            c = d.clone();
            s && (m = l, s = !1);
            u && (p = l, u = !1)
        }
    }
    b[g].endIndex = l;
    a = [];
    for (f = 0; f <= g; f++) {
        for (c = b[f].startIndex; c <= b[f].endIndex; c++) {
            a[c] = f
        }
    }
    this.text_ = k;
    this.characterToLineMap_ = a;
    this.lines_ = b;
    this.start_ = 0 <= m ? m : k.length;
    this.end_ = 0 <= p ? p : k.length
};
cvox.ContentEditableExtractor.prototype.getText = function () {
    return this.text_
};
cvox.ContentEditableExtractor.prototype.getStartIndex = function () {
    return this.start_
};
cvox.ContentEditableExtractor.prototype.getEndIndex = function () {
    return this.end_
};
cvox.ContentEditableExtractor.prototype.getLineIndex = function (a) {
    return this.characterToLineMap_[a]
};
cvox.ContentEditableExtractor.prototype.getLineStart = function (a) {
    return this.lines_[a].startIndex
};
cvox.ContentEditableExtractor.prototype.getLineEnd = function (a) {
    return this.lines_[a].endIndex
};
