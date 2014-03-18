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

cvox.TestMsgs = function () {
    cvox.AbstractMsgs.call(this)
};
goog.inherits(cvox.TestMsgs, cvox.AbstractMsgs);
cvox.TestMsgs.prototype.getLocale = function () {
    return "testing"
};
cvox.TestMsgs.prototype.getMsg = function (a, b) {
    if (!a) {
        var c = Error();
        c.message = "Message id required";
        throw c;
    }
    c = cvox.TestMessages["chromevox_" + a];
    if (void 0 == c) {
        throw c = Error(), c.message = "missing-msg: " + a, c;
    }
    var d = c.message;
    if (b) {
        for (var e = 0; e < b.length; e++) {
            if (!c.placeholders[e + 1]) {
                throw c = Error(), c.message = "Bad placeholder " + e + " for message id " + a, c;
            }
            d = d.replace(c.placeholders[e + 1].content, b[e])
        }
    }
    return d
};
cvox.TestMsgs.prototype.getNumber = function (a) {
    return "" + a
};
cvox.HostFactory.msgsConstructor = cvox.TestMsgs;
