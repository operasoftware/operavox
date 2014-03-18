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

cvox.SpokenMessages = {};
cvox.SpokenMessages.messages = [];
cvox.SpokenMessages.speakFlush = function () {
    cvox.SpokenMessages.speak(cvox.AbstractTts.QUEUE_MODE_FLUSH)
};
cvox.SpokenMessages.speakQueued = function () {
    cvox.SpokenMessages.speak(cvox.AbstractTts.QUEUE_MODE_QUEUE)
};
cvox.SpokenMessages.speak = function (a) {
    for (var b = 0; b < cvox.SpokenMessages.messages.length; ++b) {
        var c = cvox.SpokenMessages.messages[b];
        if (!c || !c.id && !c.raw) {
            throw "Invalid message received.";
        }
        var d = "";
        if (null != c.count) {
            if (0 >= c.count) {
                try {
                    d += cvox.ChromeVox.msgs.getMsg(c.id[0] + "_optional_default")
                } catch (e) {
                    continue
                }
            } else {
                d = 1 == c.count ? d + cvox.ChromeVox.msgs.getMsg(c.id[0] + "_singular") : d + cvox.ChromeVox.msgs.getMsg(c.id[0] + "_plural", [c.count])
            }
        } else {
            d = c.raw ? d + c.raw : d + cvox.ChromeVox.msgs.getMsg.apply(cvox.ChromeVox.msgs, c.id)
        }
        cvox.ChromeVox.tts.speak(d, a, cvox.AbstractTts.PERSONALITY_ANNOUNCEMENT);
        a = cvox.AbstractTts.QUEUE_MODE_QUEUE
    }
    cvox.SpokenMessages.messages = []
};
cvox.SpokenMessages.currentMessage = function () {
    if (0 == cvox.SpokenMessages.messages.length) {
        throw "Invalid usage of SpokenMessages; start the chain using $m()";
    }
    return cvox.SpokenMessages.messages[cvox.SpokenMessages.messages.length - 1]
};
cvox.SpokenMessages.withCount = function (a) {
    cvox.SpokenMessages.currentMessage().count = a;
    return cvox.SpokenMessages
};
cvox.SpokenMessages.andIndexTotal = function (a, b) {
    var c = new cvox.SpokenMessage;
    c.raw = cvox.ChromeVox.msgs.getMsg("index_total", [a, b]);
    cvox.SpokenMessages.messages.push(c);
    return cvox.SpokenMessages
};
cvox.SpokenMessages.andEnd = function () {
    return cvox.SpokenMessages.andMessage("end")
};
cvox.SpokenMessages.andMessage = function (a) {
    var b = new cvox.SpokenMessage;
    b.id = "string" == typeof a ? [a] : a;
    cvox.SpokenMessages.messages.push(b);
    return cvox.SpokenMessages
};
cvox.SpokenMessages.andRawMessage = function (a) {
    var b = new cvox.SpokenMessage;
    b.raw = a;
    cvox.SpokenMessages.messages.push(b);
    return cvox.SpokenMessages
};
cvox.SpokenMessages.andPause = function () {
    return cvox.SpokenMessages.andMessage("pause")
};
cvox.$m = cvox.SpokenMessages.andMessage;
