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

cvox.NavBraille = function (a) {
    this.text = a.text instanceof cvox.Spannable ? a.text : new cvox.Spannable(a.text);
    this.startIndex = a.startIndex ? a.startIndex : 0;
    this.endIndex = a.endIndex ? a.endIndex : 0
};
cvox.NavBraille.fromText = function (a) {
    return new cvox.NavBraille({
        text: a
    })
};
cvox.NavBraille.prototype.isEmpty = function () {
    return 0 == this.text.getLength()
};
cvox.NavBraille.prototype.toString = function () {
    return 'NavBraille(text="' + this.text.toString() + '"  startIndex="' + this.startIndex + '"  endIndex="' + this.endIndex + '")'
};
cvox.NavBraille.prototype.toJson = function () {
    return {
        text: this.text.toString(),
        startIndex: this.startIndex,
        endIndex: this.endIndex
    }
};
cvox.NavBraille.prototype.write = function () {
    cvox.PlatformUtil.matchesPlatform(cvox.PlatformFilter.CHROMEOS | cvox.PlatformFilter.ANDROID) && cvox.ChromeVox.braille.write(this)
};
