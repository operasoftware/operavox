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

cvox.AndroidEarcons = function () {
    cvox.AbstractEarcons.call(this);
    this.audioMap = {}
};
goog.inherits(cvox.AndroidEarcons, cvox.AbstractEarcons);
cvox.AndroidEarcons.BASE_URL = "https://ssl.gstatic.com/accessibility/javascript/android/earcons/";
cvox.AndroidEarcons.prototype.playEarcon = function (a) {
    if (this.earconsAvailable()) {
        cvox.AndroidEarcons.superClass_.playEarcon.call(this, a);
        this.currentAudio = this.audioMap[a];
        this.currentAudio || (this.currentAudio = new Audio(cvox.AndroidEarcons.BASE_URL + this.getEarconFilename(a)), this.audioMap[a] = this.currentAudio);
        try {
            this.currentAudio.currentTime = 0
        } catch (b) {}
        this.currentAudio.paused && this.currentAudio.play()
    }
};
cvox.AndroidEarcons.prototype.earconsAvailable = function () {
    return -1 == navigator.userAgent.indexOf("Chrome") ? !1 : !0
};
cvox.HostFactory.earconsConstructor = cvox.AndroidEarcons;
