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

cvox.NavDescription = function (a) {
    this.context = a.context ? a.context : "";
    this.text = a.text ? a.text : "";
    this.userValue = a.userValue ? a.userValue : "";
    this.annotation = a.annotation ? a.annotation : "";
    this.earcons = a.earcons ? a.earcons : [];
    this.personality = a.personality
};
cvox.NavDescription.prototype.isEmpty = function () {
    return 0 == this.context.length && 0 == this.earcons.length && 0 == this.text.length && 0 == this.userValue.length && 0 == this.annotation.length
};
cvox.NavDescription.prototype.toString = function () {
    return 'NavDescription(context="' + this.context + '"  text="' + this.text + '"  userValue="' + this.userValue + '"  annotation="' + this.annotation + '")'
};
cvox.NavDescription.prototype.pushEarcon = function (a) {
    this.earcons.push(a)
};
cvox.NavDescription.prototype.speak = function (a, b, c) {
    function d() {
        var a = {}, b = cvox.AbstractTts.PERSONALITY_ANNOTATION,
            c;
        for (c in b) {
            a[c] = b[c]
        }
        return a
    }
    var e = [];
    this.context && (e.push([this.context, a, d()]), a = 1);
    e.push([this.text, a, this.personality ? this.personality : {}]);
    a = 1;
    this.userValue && e.push([this.userValue, a, {}]);
    this.annotation && e.push([this.annotation, a, d()]);
    a = e.length;
    for (var f = 0; f < a; f++) {
        0 == f && b && (e[f][2].startCallback = b), f == a - 1 && c && (e[f][2].endCallback = c), cvox.ChromeVox.tts.speak.apply(cvox.ChromeVox.tts, e[f])
    }
};
cvox.NavDescription.prototype.equals = function (a) {
    return this.context == a.context && this.text == a.text && this.userValue == a.userValue && this.annotation == a.annotation
};
