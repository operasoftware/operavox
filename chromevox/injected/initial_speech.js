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

cvox.InitialSpeech = {};
window.INJECTED_AFTER_LOAD || (window.INJECTED_AFTER_LOAD = !1);
cvox.InitialSpeech.speak = function () {
    var a = window.INJECTED_AFTER_LOAD;
    if (!cvox.ChromeVox.isActive || document.webkitHidden) {
        a = !0
    }
    window.top == window && document.title && !a && cvox.ChromeVox.tts.speak(document.title, cvox.AbstractTts.QUEUE_MODE_FLUSH);
    cvox.LiveRegions.init(new Date, cvox.AbstractTts.QUEUE_MODE_QUEUE, a);
    document.hasFocus() && document.activeElement == document.body && cvox.ChromeVox.navigationManager.syncToBeginning();
    if (cvox.ChromeVox.position[document.location.href]) {
        var b = cvox.ChromeVox.position[document.location.href];
        cvox.ChromeVox.navigationManager.updateSelToArbitraryNode(document.elementFromPoint(b.x, b.y))
    }
    document.hasFocus() && (a || cvox.ChromeVoxEventSuspender.withSuspendedEvents(function () {
        cvox.ChromeVox.navigationManager.finishNavCommand("", !0, cvox.AbstractTts.QUEUE_MODE_QUEUE)
    })())
};
