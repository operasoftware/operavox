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

cvox.AndroidHost = function () {
    cvox.AbstractHost.call(this)
};
goog.inherits(cvox.AndroidHost, cvox.AbstractHost);
cvox.AndroidHost.prototype.init = function () {
    cvox.ChromeVox.version = "AndroidVox";
    var a = cvox.AndroidKeyMap.getStringifiedKeyMap();
    cvox.ChromeVoxKbHandler.loadKeyToFunctionsTable(a);
    cvox.ApiImplementation.siteSpecificScriptLoader = "";
    cvox.ApiImplementation.siteSpecificScriptBase = "";
    cvox.ApiImplementation.init();
    cvox.ChromeVox.earcons.earconsAvailable() && (cvox.ChromeVox.verbosity = cvox.VERBOSITY_BRIEF);
    this.mathMap = new cvox.AndroidMathMap;
    cvox.InitialSpeech.speak()
};
cvox.AndroidHost.prototype.reinit = function () {};
cvox.AndroidHost.prototype.onPageLoad = function () {
    cvox.ChromeVoxEventWatcher.focusFollowsMouse = !0;
    cvox.ChromeVoxEventWatcher.mouseoverDelayMs = 0
};
cvox.AndroidHost.prototype.ttsLoaded = function () {
    return "undefined" != typeof accessibility
};
cvox.AndroidHost.prototype.getApiSrc = function () {
    return ""
};
cvox.AndroidHost.prototype.hasTtsCallback = function () {
    return !1
};
cvox.AndroidHost.prototype.mustRedispatchClickEvent = function () {
    return !0
};
cvox.AndroidHost.prototype.activateOrDeactivateChromeVox = function (a) {
    cvox.ChromeVox.tts.stop();
    cvox.AndroidHost.superClass_.activateOrDeactivateChromeVox.call(this, a);
    this.onPageLoad()
};
cvox.HostFactory.hostConstructor = cvox.AndroidHost;
