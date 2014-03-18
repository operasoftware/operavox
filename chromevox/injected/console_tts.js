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

cvox.ConsoleTts = function () {
    this.enabled_ = !1
};
goog.addSingletonGetter(cvox.ConsoleTts);
cvox.ConsoleTts.prototype.speak = function (a, b, c) {
    if (this.enabled_ && window.console) {
        var d = "Speak",
            d = b == cvox.AbstractTts.QUEUE_MODE_FLUSH ? d + " (I)" : d + " (Q)";
        window.console.log(d + (' "' + a + '"'));
        c && void 0 != c.startCallback && window.console.log("  using startCallback");
        c && void 0 != c.endCallback && window.console.log("  using endCallback")
    }
    return this
};
cvox.ConsoleTts.prototype.isSpeaking = function () {
    return !1
};
cvox.ConsoleTts.prototype.stop = function () {
    this.enabled_ && window.console.log("Stop")
};
cvox.ConsoleTts.prototype.addCapturingEventListener = function (a) {};
cvox.ConsoleTts.prototype.increaseOrDecreaseProperty = function () {};
cvox.ConsoleTts.prototype.setEnabled = function (a) {
    this.enabled_ = a
};
cvox.ConsoleTts.prototype.getDefaultProperty = function (a) {};
