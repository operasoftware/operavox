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

cvox.AbstractHost = function () {};
cvox.AbstractHost.State = {
    ACTIVE: 0,
    INACTIVE: 1,
    KILLED: 2
};
cvox.AbstractHost.prototype.init = function () {};
cvox.AbstractHost.prototype.reinit = function () {};
cvox.AbstractHost.prototype.onPageLoad = function () {};
cvox.AbstractHost.prototype.sendToBackgroundPage = function (a) {};
cvox.AbstractHost.prototype.getApiSrc = function () {
    return ""
};
cvox.AbstractHost.prototype.getFileSrc = function (a) {
    return ""
};
cvox.AbstractHost.prototype.hasTtsCallback = function () {
    return !0
};
cvox.AbstractHost.prototype.ttsLoaded = function () {
    return !0
};
cvox.AbstractHost.prototype.mustRedispatchClickEvent = function () {
    return !1
};
cvox.AbstractHost.prototype.activateOrDeactivateChromeVox = function (a) {
    this.onStateChanged_(a ? cvox.AbstractHost.State.ACTIVE : cvox.AbstractHost.State.INACTIVE)
};
cvox.AbstractHost.prototype.killChromeVox = function () {
    this.onStateChanged_(cvox.AbstractHost.State.KILLED)
};
cvox.AbstractHost.prototype.onStateChanged_ = function (a) {
    if (a == cvox.AbstractHost.State.ACTIVE != cvox.ChromeVox.isActive) {
        switch (cvox.ChromeVoxEventWatcher.cleanup(window), a) {
        case cvox.AbstractHost.State.ACTIVE:
            cvox.ChromeVox.isActive = !0;
            cvox.ChromeVox.navigationManager.showOrHideIndicator(!0);
            cvox.ChromeVoxEventWatcher.init(window);
            document.activeElement ? (a = document.hasFocus() && !document.webkitHidden, cvox.ApiImplementation.syncToNode(document.activeElement, a)) : cvox.ChromeVox.navigationManager.updateIndicator();
            break;
        case cvox.AbstractHost.State.INACTIVE:
            cvox.ChromeVox.isActive = !1;
            cvox.ChromeVox.navigationManager.showOrHideIndicator(!1);
            cvox.ChromeVoxEventWatcher.init(window);
            break;
        case cvox.AbstractHost.State.KILLED:
            cvox.ChromeVox.isActive = !1, cvox.ChromeVox.navigationManager.showOrHideIndicator(!1)
        }
    }
};
