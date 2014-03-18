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

cvox.SelectWidget = function (a) {
    cvox.OverlayWidget.call(this, "");
    this.selectNode_ = a
};
goog.inherits(cvox.SelectWidget, cvox.OverlayWidget);
cvox.SelectWidget.prototype.show = function () {
    cvox.SelectWidget.superClass_.show.call(this);
    var a = document.createElement("div");
    a.setAttribute("role", "menu");
    for (var b = 0, c = null; c = this.selectNode_.options[b]; b++) {
        var d = document.createElement("p");
        d.innerHTML = c.innerHTML;
        d.id = b;
        d.setAttribute("role", "menuitem");
        a.appendChild(d)
    }
    this.host_.appendChild(a);
    b = this.selectNode_.selectedIndex;
    "number" == typeof b && cvox.ChromeVox.syncToNode(a.children[b], !0)
};
cvox.SelectWidget.prototype.hide = function (a) {
    a = document.createEvent("Event");
    a.initEvent("change", !1, !1);
    this.selectNode_.dispatchEvent(a);
    cvox.SelectWidget.superClass_.hide.call(this, !0)
};
cvox.SelectWidget.prototype.onNavigate = function () {
    var a = this;
    cvox.ChromeVoxEventSuspender.withSuspendedEvents(function () {
        var b = cvox.ChromeVox.navigationManager.getCurrentNode().parentNode.id;
        a.selectNode_.selectedIndex = b
    })()
};
cvox.SelectWidget.prototype.getNameMsg = function () {
    return ["aria_role_menu"]
};
