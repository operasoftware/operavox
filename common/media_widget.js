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

cvox.ChromeVoxHTMLMediaWidget = function (a, b) {
    var c = this;
    this.mediaElem_ = a;
    this.mediaTts_ = b;
    this.keyListener_ = function (a) {
        c.eventHandler_(a)
    };
    this.blurListener_ = function (a) {
        c.shutdown()
    };
    this.mediaElem_.addEventListener("keydown", this.keyListener_, !1);
    this.mediaElem_.addEventListener("keyup", this.keyListener_, !1);
    this.mediaElem_.addEventListener("blur", this.blurListener_, !1)
};
cvox.ChromeVoxHTMLMediaWidget.prototype.shutdown = function () {
    this.mediaElem_.removeEventListener("blur", this.blurListener_, !1);
    this.mediaElem_.removeEventListener("keydown", this.keyListener_, !1);
    this.mediaElem_.removeEventListener("keyup", this.keyListener_, !1)
};
cvox.ChromeVoxHTMLMediaWidget.prototype.jumpToTime_ = function (a) {
    0 > a && (a = 0);
    a > this.mediaElem_.duration && (a = this.mediaElem_.duration);
    this.mediaElem_.currentTime = a
};
cvox.ChromeVoxHTMLMediaWidget.prototype.setVolume_ = function (a) {
    0 > a && (a = 0);
    1 < a && (a = 1);
    this.mediaElem_.volume = a
};
cvox.ChromeVoxHTMLMediaWidget.prototype.eventHandler_ = function (a) {
    "keydown" == a.type && (13 == a.keyCode || 32 == a.keyCode ? this.mediaElem_.paused ? this.mediaElem_.play() : this.mediaElem_.pause() : 39 == a.keyCode ? this.jumpToTime_(this.mediaElem_.currentTime + this.mediaElem_.duration / 10) : 37 == a.keyCode ? this.jumpToTime_(this.mediaElem_.currentTime - this.mediaElem_.duration / 10) : 38 == a.keyCode ? this.setVolume_(this.mediaElem_.volume + 0.1) : 40 == a.keyCode && this.setVolume_(this.mediaElem_.volume - 0.1))
};
