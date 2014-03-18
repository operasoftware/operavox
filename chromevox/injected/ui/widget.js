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

cvox.Widget = function () {
    this.active = !1;
    this.initialNode = this.initialFocus = null;
    cvox.Widget.ref_ && cvox.Widget.ref_.isActive() || (cvox.Widget.ref_ = this)
};
cvox.Widget.prototype.isActive = function () {
    return this.active
};
cvox.Widget.prototype.show = function () {
    this.isActive() && this.hide(!0);
    this.onKeyDown = goog.bind(this.onKeyDown, this);
    this.onKeyPress = goog.bind(this.onKeyPress, this);
    window.addEventListener("keydown", this.onKeyDown, !0);
    window.addEventListener("keypress", this.onKeyPress, !0);
    this.initialNode = cvox.ChromeVox.navigationManager.getCurrentNode();
    this.initialFocus = document.activeElement;
    this.isStickyOn = cvox.ChromeVox.isStickyOn;
    cvox.ChromeVox.host.sendToBackgroundPage({
        target: "Prefs",
        action: "setPref",
        pref: "sticky",
        value: !1,
        announce: !1
    });
    this.getNameMsg() && this.getHelpMsg() && cvox.$m(this.getNameMsg()).andPause().andMessage(this.getHelpMsg()).speakFlush();
    cvox.ChromeVox.earcons.playEarcon(cvox.AbstractEarcons.OBJECT_OPEN);
    this.active = !0
};
cvox.Widget.prototype.hide = function (a) {
    window.removeEventListener("keypress", this.onKeyPress, !0);
    window.removeEventListener("keydown", this.onKeyDown, !0);
    cvox.ChromeVox.host.sendToBackgroundPage({
        target: "Prefs",
        action: "setPref",
        pref: "sticky",
        value: this.isStickyOn,
        announce: !1
    });
    cvox.ChromeVox.earcons.playEarcon(cvox.AbstractEarcons.OBJECT_CLOSE);
    a || (this.initialNode = 1 == this.initialNode.nodeType ? this.initialNode : this.initialNode.parentNode, cvox.ApiImplementation.syncToNode(this.initialNode, !0, cvox.AbstractTts.QUEUE_MODE_QUEUE));
    this.active = !1
};
cvox.Widget.prototype.toggle = function () {
    this.isActive() ? this.hide() : this.show()
};
cvox.Widget.prototype.onKeyDown = function (a) {
    if (27 == a.keyCode) {
        return this.hide(), a.preventDefault(), !0
    }
    if (9 == a.keyCode) {
        return this.hide(), !0
    }
    17 == a.keyCode && cvox.ChromeVox.tts.stop();
    a.stopPropagation();
    return !0
};
cvox.Widget.prototype.onKeyPress = function (a) {
    return !1
};
cvox.Widget.isActive = function () {
    return cvox.Widget.ref_ && cvox.Widget.ref_.isActive() || !1
};
