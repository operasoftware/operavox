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

cvox.Focuser = {};
cvox.Focuser.setFocus = function (a, b) {
    var c = window.getSelection(),
        d;
    0 < c.rangeCount && (d = c.getRangeAt(0));
    document.activeElement && !cvox.DomUtil.isDescendantOfNode(a, document.activeElement) && document.activeElement.blur();
    a && a.constructor == HTMLVideoElement && (cvox.DomUtil.isFocusable(a) || a.setAttribute("tabIndex", 0));
    if (b && !cvox.DomUtil.isFocusable(a)) {
        var e = cvox.DomUtil.findFocusableDescendant(a);
        e && (a = e)
    } else {
        for (; a && !cvox.DomUtil.isFocusable(a);) {
            a = a.parentNode
        }
    }
    cvox.DomUtil.isFocusable(a) ? "IFRAME" != a.tagName && (cvox.ChromeVoxEventSuspender.areEventsSuspended() ? (cvox.Focuser.shouldEnterSuspendEvents_(a) && cvox.ChromeVoxEventSuspender.enterSuspendEvents(), window.setTimeout(function () {
        a.focus();
        cvox.ChromeVoxEventSuspender.exitSuspendEvents()
    }, 0)) : window.setTimeout(function () {
        a.focus()
    }, 0)) : document.activeElement && "BODY" != document.activeElement.tagName && document.activeElement.blur();
    cvox.DomUtil.isInputTypeText(a) ? a.select() : d && (c.removeAllRanges(), c.addRange(d))
};
cvox.Focuser.shouldEnterSuspendEvents_ = function (a) {
    if (a.constructor && a.constructor == HTMLVideoElement) {
        return !1
    }
    if (a.hasAttribute) {
        switch (a.getAttribute("type")) {
        case "time":
            ;
        case "date":
            ;
        case "week":
            ;
        case "month":
            return !1
        }
    }
    return !0
};
