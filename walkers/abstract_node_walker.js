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

cvox.AbstractNodeWalker = function () {
    cvox.AbstractWalker.call(this);
    this.wasBegin_ = !1
};
goog.inherits(cvox.AbstractNodeWalker, cvox.AbstractWalker);
cvox.AbstractNodeWalker.prototype.next = function (a) {
    var b = a.isReversed();
    a = a.end.node || document.body;
    do {
        if (a = cvox.DomUtil.directedNextLeafLikeNode(a, b, goog.bind(this.stopNodeDescent, this)), !a) {
            return null
        }
    } while (a && !cvox.DomUtil.hasContent(a));
    return cvox.CursorSelection.fromNode(a).setReversed(b)
};
cvox.AbstractNodeWalker.prototype.sync = function (a) {
    a = this.privateSync_(a);
    this.wasBegin_ = !1;
    return a
};
cvox.AbstractNodeWalker.prototype.privateSync_ = function (a) {
    var b = a.isReversed();
    if (a.equals(cvox.CursorSelection.fromBody())) {
        if (this.wasBegin_) {
            return cvox.CursorSelection.fromBody().setReversed(b)
        }
        this.wasBegin_ = !0
    }
    for (a = a.start.node; a != document.body && a.parentNode && this.stopNodeDescent(a.parentNode);) {
        a = a.parentNode
    }
    for (; !this.stopNodeDescent(a);) {
        a = cvox.DomUtil.directedFirstChild(a, b)
    }
    var c = cvox.CursorSelection.fromNode(a);
    cvox.DomUtil.hasContent(a) || (c = this.next(cvox.CursorSelection.fromNode(a).setReversed(b)));
    return c ? c.setReversed(b) : this.begin({
        reversed: b
    })
};
