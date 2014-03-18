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

cvox.FindUtil = {};
cvox.FindUtil.objectWalker_ = new cvox.BareObjectWalker;
cvox.FindUtil.findNext = function (a, b, c) {
    var d = a.isReversed();
    a = (new cvox.CursorSelection(a.absStart(), a.absStart())).setReversed(d);
    var e;
    if (e = b(cvox.DomUtil.getAncestors(a.start.node))) {
        if (a = cvox.CursorSelection.fromNode(e).setReversed(d), c) {
            return a
        }
    }
    for (; a;) {
        a = cvox.FindUtil.objectWalker_.next(a);
        c = null;
        if (!a || (c = b(cvox.DomUtil.getAncestors(a.start.node)))) {
            return c ? cvox.CursorSelection.fromNode(c) : null
        }
        if ("IFRAME" == a.start.node.tagName) {
            return a
        }
    }
    return null
};
