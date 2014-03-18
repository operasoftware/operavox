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

var cvox = {
    VERBOSITY_VERBOSE: 0,
    VERBOSITY_BRIEF: 1,
    ChromeVox: function () {}
};
cvox.ChromeVox.host = null;
cvox.ChromeVox.msgs = null;
cvox.ChromeVox.isActive = !0;
cvox.ChromeVox.version = null;
cvox.ChromeVox.earcons = null;
cvox.ChromeVox.navigationManager = null;
cvox.ChromeVox.serializer = null;
cvox.ChromeVox.isStickyOn = !1;
cvox.ChromeVox.keyPrefixOn = !1;
cvox.ChromeVox.verbosity = cvox.VERBOSITY_VERBOSE;
cvox.ChromeVox.typingEcho = 0;
cvox.ChromeVox.keyEcho = {};
cvox.ChromeVox.position = {};
cvox.ChromeVox.isChromeOS = -1 != navigator.userAgent.indexOf("CrOS");
cvox.ChromeVox.isMac = -1 != navigator.platform.indexOf("Mac");
cvox.ChromeVox.modKeyStr = cvox.ChromeVox.isChromeOS ? "Shift+Search" : cvox.ChromeVox.isMac ? "Ctrl+Cmd" : "Ctrl+Alt";
cvox.ChromeVox.sequenceSwitchKeyCodes = [];
cvox.ChromeVox.visitedUrls = {};
cvox.ChromeVox.markInUserCommand = function () {};
cvox.ChromeVox.syncToNode = function (a, b, c) {};
cvox.ChromeVox.speakNode = function (a, b, c) {};
cvox.ChromeVox.executeUserCommand = function (a) {};
cvox.ChromeVox.entireDocumentIsHidden = !1;
cvox.ChromeVox.storeOn = function (a) {
    a.isStickyOn = cvox.ChromeVox.isStickyOn;
    cvox.ChromeVox.navigationManager.storeOn(a)
};
cvox.ChromeVox.readFrom = function (a) {
    cvox.ChromeVox.isStickyOn = a.isStickyOn;
    cvox.ChromeVox.navigationManager.readFrom(a)
};
