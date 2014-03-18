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

cvox.AndroidTts = function () {
    cvox.AbstractTts.call(this);
    this.ttsProperties.rate = 0.5;
    this.ttsProperties.pitch = 0.5;
    this.ttsProperties.volume = 1
};
goog.inherits(cvox.AndroidTts, cvox.AbstractTts);
cvox.AndroidTts.prototype.speak = function (a, b, c) {
    cvox.AndroidTts.superClass_.speak.call(this, a, b, c);
    c = this.mergeProperties(c);
    accessibility.speak(a, b, c);
    return this
};
cvox.AndroidTts.prototype.isSpeaking = function () {
    cvox.AndroidTts.superClass_.isSpeaking.call(this);
    return accessibility.isSpeaking()
};
cvox.AndroidTts.prototype.stop = function () {
    cvox.AndroidTts.superClass_.stop.call(this);
    accessibility.stop()
};
cvox.HostFactory.ttsConstructor = cvox.AndroidTts;
