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

cvox.CompositeTts = function () {
    this.ttsEngines_ = []
};
cvox.CompositeTts.prototype.add = function (a) {
    this.ttsEngines_.push(a);
    return this
};
cvox.CompositeTts.prototype.speak = function (a, b, c) {
    this.ttsEngines_.forEach(function (d) {
        d.speak(a, b, c)
    })
};
cvox.CompositeTts.prototype.isSpeaking = function () {
    return this.ttsEngines_.some(function (a) {
        return a.isSpeaking()
    })
};
cvox.CompositeTts.prototype.stop = function () {
    this.ttsEngines_.forEach(function (a) {
        a.stop()
    })
};
cvox.CompositeTts.prototype.addCapturingEventListener = function (a) {
    this.ttsEngines_.forEach(function (b) {
        b.addCapturingEventListener(a)
    })
};
cvox.CompositeTts.prototype.increaseOrDecreaseProperty = function (a, b) {
    this.ttsEngines_.forEach(function (c) {
        c.increaseOrDecreaseProperty(a, b)
    })
};
cvox.CompositeTts.prototype.getDefaultProperty = function (a) {
    for (var b = 0, c; c = this.ttsEngines_[b]; b++) {
        if (c = c.getDefaultProperty(a)) {
            return c
        }
    }
};
