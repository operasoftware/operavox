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

cvox.NodeBreadcrumb = function () {
    this.cvTagCounter_ = 0
};
goog.addSingletonGetter(cvox.NodeBreadcrumb);
cvox.NodeBreadcrumb.TOUCHED_TAG = "chromevoxtag";
cvox.NodeBreadcrumb.NEEDED_TAG_ = "chromevoxneeded";
cvox.NodeBreadcrumb.prototype.tagCurrentNode = function () {
    for (var a, b = cvox.ChromeVox.navigationManager.getCurrentNode(); b && !b.hasAttribute;) {
        b = b.parentNode
    }
    b ? b.hasAttribute(cvox.NodeBreadcrumb.TOUCHED_TAG) ? a = b.getAttribute(cvox.NodeBreadcrumb.TOUCHED_TAG) : (a = this.cvTagCounter_, b.setAttribute(cvox.NodeBreadcrumb.TOUCHED_TAG, a), this.cvTagCounter_++) : a = -1;
    return a
};
cvox.NodeBreadcrumb.prototype.smartStart_ = function (a) {
    for (var b = 0; b < a.children.length; ++b) {
        var c = a.children[b];
        this.smartStart_(c);
        c.getAttribute && !goog.isNull(c.getAttribute(cvox.NodeBreadcrumb.TOUCHED_TAG)) && this.setNeeded_(c)
    }
};
cvox.NodeBreadcrumb.prototype.setNeeded_ = function (a) {
    a && a.getAttribute && goog.isNull(a.getAttribute(cvox.NodeBreadcrumb.NEEDED_TAG_)) && (a.setAttribute(cvox.NodeBreadcrumb.NEEDED_TAG_, !0), "body" !== a.nodeName && this.setNeeded_(a.parentElement))
};
cvox.NodeBreadcrumb.prototype.smartClone_ = function (a) {
    var b = {};
    b[cvox.NodeBreadcrumb.TOUCHED_TAG] = !0;
    b[cvox.NodeBreadcrumb.NEEDED_TAG_] = !0;
    if (a.getAttribute && a.getAttribute(cvox.NodeBreadcrumb.TOUCHED_TAG)) {
        return cvox.DomUtil.deepClone(a, b)
    }
    for (var b = cvox.DomUtil.shallowChildlessClone(a, b), c = 0; c < a.childNodes.length; ++c) {
        var d = a.childNodes[c];
        d.getAttribute && !goog.isNull(d.getAttribute(cvox.NodeBreadcrumb.NEEDED_TAG_)) && b.appendChild(this.smartClone_(d))
    }
    return b
};
cvox.NodeBreadcrumb.prototype.dumpWalkedDom = function () {
    this.smartStart_(document.body);
    return this.smartClone_(document.body)
};
cvox.NodeBreadcrumb.getCurrentNodeTag = function () {
    for (var a = cvox.ChromeVox.navigationManager.getCurrentNode(); a && !a.hasAttribute;) {
        a = a.parentNode
    }
    return a && a.hasAttribute(cvox.NodeBreadcrumb.TOUCHED_TAG) ? a.getAttribute(cvox.NodeBreadcrumb.TOUCHED_TAG) : -1
};
