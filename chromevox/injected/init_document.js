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

cvox.ChromeVoxInit = {};
cvox.ChromeVox.initTimeout_ = 100;
cvox.ChromeVox.recallInit_ = function (a) {
    window.console.log(a + " Will try again in " + cvox.ChromeVox.initTimeout_ + "ms");
    window.setTimeout(cvox.ChromeVox.initDocument, cvox.ChromeVox.initTimeout_);
    cvox.ChromeVox.initTimeout_ *= 2
};
cvox.ChromeVox.initDocument = function () {
    document.body ? (cvox.ChromeVox.host = cvox.HostFactory.getHost(), cvox.ChromeVox.host.ttsLoaded() ? (window.console.log("Starting ChromeVox."), cvox.InitGlobals.initGlobals(), window.disableChromeVox = function () {
        cvox.ChromeVox.host.killChromeVox()
    }) : cvox.ChromeVox.recallInit_("ChromeVox not starting; waiting for TTS. " + document.location.href + ".")) : cvox.ChromeVox.recallInit_("ChromeVox not starting on unloaded page: " + document.location.href + ".")
};
cvox.ChromeVox.reinit = function () {
    cvox.ChromeVox.host.reinit();
    cvox.ChromeVox.initDocument()
};
COMPILED || cvox.ChromeVox.initDocument();
