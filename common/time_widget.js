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

cvox.ChromeVoxHTMLTimeWidget = function (a, b) {
    var c = this;
    this.timeElem_ = a;
    this.timeTts_ = b;
    this.pMinutes_ = this.pHours_ = -1;
    this.pMilliseconds_ = this.pSeconds_ = 0;
    this.pAmpm_ = "";
    this.pos_ = 0;
    this.maxPos_ = 2;
    this.keyListener_ = function (a) {
        c.eventHandler_(a)
    };
    this.blurListener_ = function (a) {
        c.shutdown()
    };
    if (this.timeElem_.hasAttribute("step")) {
        var d = this.timeElem_.getAttribute("step");
        0 < d && (this.maxPos_ = 1 <= d ? 3 : 4)
    }
    0 == this.timeElem_.value.length && this.forceInitTime_();
    for (d = 0; d < this.maxPos_; d++) {
        var e = document.createEvent("KeyboardEvent");
        e.initKeyboardEvent("keydown", !0, !0, window, "Left", 0, !1, !1, !1, !1);
        this.timeElem_.dispatchEvent(e);
        e = document.createEvent("KeyboardEvent");
        e.initKeyboardEvent("keyup", !0, !0, window, "Left", 0, !1, !1, !1, !1);
        this.timeElem_.dispatchEvent(e)
    }
    this.timeElem_.addEventListener("keydown", this.keyListener_, !1);
    this.timeElem_.addEventListener("keyup", this.keyListener_, !1);
    this.timeElem_.addEventListener("blur", this.blurListener_, !1);
    this.update_(!0)
};
cvox.ChromeVoxHTMLTimeWidget.prototype.shutdown = function () {
    this.timeElem_.removeEventListener("blur", this.blurListener_, !1);
    this.timeElem_.removeEventListener("keydown", this.keyListener_, !1);
    this.timeElem_.removeEventListener("keyup", this.keyListener_, !1)
};
cvox.ChromeVoxHTMLTimeWidget.prototype.forceInitTime_ = function () {
    this.timeElem_.setAttribute("value", "12:00")
};
cvox.ChromeVoxHTMLTimeWidget.prototype.handlePosChange_ = function () {
    0 > this.pos_ && (this.pos_ = 0);
    this.pos_ > this.maxPos_ && (this.pos_ = this.maxPos_);
    if (this.pos_ == this.maxPos_) {
        this.pAmpm_ = ""
    } else {
        switch (this.pos_) {
        case 0:
            this.pHours_ = -1;
            break;
        case 1:
            this.pMinutes_ = -1;
            break;
        case 2:
            this.pSeconds_ = -1;
            break;
        case 3:
            this.pMilliseconds_ = -1
        }
    }
};
cvox.ChromeVoxHTMLTimeWidget.prototype.update_ = function (a) {
    var b = this.timeElem_.value.split(":");
    if (1 > b.length) {
        this.forceInitTime_()
    } else {
        var c = b[0],
            d = -1,
            e = 0,
            f = 0,
            g = cvox.ChromeVox.msgs.getMsg("timewidget_am");
        1 < b.length && (d = b[1]);
        2 < b.length && (b = b[2].split("."), e = b[0], 1 < b.length && (f = b[1]));
        12 < c && (c -= 12, g = cvox.ChromeVox.msgs.getMsg("timewidget_pm"));
        12 == c && (g = cvox.ChromeVox.msgs.getMsg("timewidget_pm"));
        0 == c && (c = 12, g = cvox.ChromeVox.msgs.getMsg("timewidget_am"));
        b = "";
        a && (b = cvox.DomUtil.getName(this.timeElem_, !0, !0) + "\n");
        c != this.pHours_ && (b = b + c + " " + cvox.ChromeVox.msgs.getMsg("timewidget_hours") + "\n", this.pHours_ = c);
        d != this.pMinutes_ && (b = b + d + " " + cvox.ChromeVox.msgs.getMsg("timewidget_minutes") + "\n", this.pMinutes_ = d);
        e != this.pSeconds_ && (b = b + e + " " + cvox.ChromeVox.msgs.getMsg("timewidget_seconds") + "\n", this.pSeconds_ = e);
        f != this.pMilliseconds_ && (b = b + f + " " + cvox.ChromeVox.msgs.getMsg("timewidget_milliseconds") + "\n", this.pMilliseconds_ = f);
        g != this.pAmpm_ && (b += g, this.pAmpm_ = g);
        0 < b.length && this.timeTts_.speak(b, 0, null)
    }
};
cvox.ChromeVoxHTMLTimeWidget.prototype.eventHandler_ = function (a) {
    var b = !1;
    if ("keydown" == a.type) {
        if (9 == a.keyCode && !a.shiftKey || 39 == a.keyCode) {
            this.pos_++, this.handlePosChange_(), b = !0
        }
        if (9 == a.keyCode && a.shiftKey || 37 == a.keyCode) {
            this.pos_--, this.handlePosChange_(), b = !0
        }
    }
    this.update_(b)
};
