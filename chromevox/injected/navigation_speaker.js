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

cvox.NavigationSpeaker = function () {
    this.stopReading = !1;
    this.id_ = 1
};
cvox.NavigationSpeaker.prototype.speakDescriptionArray = function (a, b, c) {
    a = this.reorderAnnotations(a);
    this.stopReading = !1;
    this.id_ = (this.id_ + 1) % 1E4;
    var d = this,
        e = function (b, g, h) {
            var k = a[b];
            if (k && !d.stopReading && d.id_ == h) {
                var l = function () {
                    for (var a = 0; a < k.earcons.length; a++) {
                        cvox.ChromeVox.earcons.playEarcon(k.earcons[a])
                    }
                }, m = function () {
                        e(b + 1, cvox.AbstractTts.QUEUE_MODE_QUEUE, h)
                    }, p = function () {
                        k.personality && k.personality[cvox.AbstractTts.PAUSE] && "number" == typeof k.personality[cvox.AbstractTts.PAUSE] ? setTimeout(m, k.personality[cvox.AbstractTts.PAUSE]) : m();
                        b == a.length - 1 && c && c()
                    };
                k.isEmpty() ? (l(), p()) : (k.speak(g, l, p), cvox.ChromeVox.host.hasTtsCallback() || (l(), p()))
            }
        };
    e(0, b, this.id_);
    0 == a.length && c && c()
};
cvox.NavigationSpeaker.structuredElement = function (a) {
    switch (a) {
    case "table":
        ;
    case "Math":
        return !0
    }
    return !1
};
cvox.NavigationSpeaker.prototype.reorderAnnotations = function (a) {
    for (var b = [], c = 0; c < a.length; c++) {
        var d = a[c];
        cvox.NavigationSpeaker.structuredElement(d.annotation) && (b.push(new cvox.NavDescription({
            text: "",
            annotation: d.annotation
        })), d.annotation = "");
        b.push(d)
    }
    return b
};
