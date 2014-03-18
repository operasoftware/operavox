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

cvox.InitGlobals = function () {};
cvox.InitGlobals.initGlobals = function () {
    cvox.ChromeVox.host || (cvox.ChromeVox.host = cvox.HostFactory.getHost());
    cvox.ChromeVox.tts = (new cvox.CompositeTts).add(cvox.HostFactory.getTts()).add(cvox.History.getInstance()).add(cvox.ConsoleTts.getInstance());
    cvox.ChromeVox.braille || (cvox.ChromeVox.braille = cvox.HostFactory.getBraille());
    cvox.ChromeVox.mathJax = cvox.HostFactory.getMathJax();
    cvox.ChromeVox.earcons = cvox.HostFactory.getEarcons();
    cvox.ChromeVox.msgs = cvox.HostFactory.getMsgs();
    cvox.ChromeVox.isActive = !0;
    cvox.ChromeVox.navigationManager = new cvox.NavigationManager;
    cvox.ChromeVox.navigationManager.updateIndicator();
    cvox.ChromeVox.syncToNode = cvox.ApiImplementation.syncToNode;
    cvox.ChromeVox.speakNode = cvox.ApiImplementation.speakNode;
    cvox.ChromeVox.serializer = new cvox.Serializer;
    cvox.ChromeVox.host.init();
    cvox.ChromeVoxEventWatcher.init(window);
    cvox.ChromeVox.executeUserCommand = function (a) {
        cvox.ChromeVoxUserCommands.commands[a]()
    };
    cvox.ChromeVox.host.onPageLoad()
};
