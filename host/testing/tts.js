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

cvox.TestTts = function () {
    cvox.AbstractTts.call(this);
    this.utterances_ = []
};
goog.inherits(cvox.TestTts, cvox.AbstractTts);
cvox.TestTts.prototype.sentinelText_ = "@@@STOP@@@";
cvox.TestTts.prototype.speak = function (a, b, c) {
    this.utterances_.push({
        text: a,
        queueMode: b
    });
    c && void 0 != c.endCallback && this.utterances_[this.utterances_.length - 1].text != this.sentinelText_ && c.endCallback()
};
cvox.TestTts.prototype.createSentinel = function () {
    var a = document.createElement("div");
    a.textContent = this.sentinelText_;
    return a
};
cvox.TestTts.prototype.clearUtterances = function () {
    this.utterances_.length = 0
};
cvox.TestTts.prototype.getUtterancesAsString = function () {
    return cvox.DomUtil.collapseWhitespace(this.getUtteranceList().join(" "))
};
cvox.TestTts.prototype.getUtteranceList = function () {
    for (var a = [], b = 0; b < this.utterances_.length; b++) {
        a.push(this.utterances_[b].text)
    }
    return a
};
cvox.TestTts.prototype.getUtteranceInfoList = function () {
    return this.utterances_
};
cvox.HostFactory.ttsConstructor = cvox.TestTts;
