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

cvox.ChromeVoxHTMLDateWidget = function (a, b) {
    var c = this;
    this.pos_ = 0;
    var d = 2;
    if ("month" == a.type || "week" == a.type) {
        d = 1
    }
    this.maxPos_ = d;
    this.dateElem_ = a;
    this.dateTts_ = b;
    this.pDay_ = this.pWeek_ = this.pMonth_ = this.pYear_ = -1;
    this.keyListener_ = function (a) {
        c.eventHandler_(a)
    };
    this.blurListener_ = function (a) {
        c.shutdown()
    };
    0 == this.dateElem_.value.length && this.forceInitTime_();
    for (d = 0; d < this.maxPos_; d++) {
        var e = document.createEvent("KeyboardEvent");
        e.initKeyboardEvent("keydown", !0, !0, window, "Left", 0, !1, !1, !1, !1);
        this.dateElem_.dispatchEvent(e);
        e = document.createEvent("KeyboardEvent");
        e.initKeyboardEvent("keyup", !0, !0, window, "Left", 0, !1, !1, !1, !1);
        this.dateElem_.dispatchEvent(e)
    }
    this.dateElem_.addEventListener("keydown", this.keyListener_, !1);
    this.dateElem_.addEventListener("keyup", this.keyListener_, !1);
    this.dateElem_.addEventListener("blur", this.blurListener_, !1);
    this.update_(!0)
};
cvox.ChromeVoxHTMLDateWidget.prototype.shutdown = function () {
    this.dateElem_.removeEventListener("blur", this.blurListener_, !1);
    this.dateElem_.removeEventListener("keydown", this.keyListener_, !1);
    this.dateElem_.removeEventListener("keyup", this.keyListener_, !1)
};
cvox.ChromeVoxHTMLDateWidget.prototype.forceInitTime_ = function () {
    var a = new Date,
        b = "",
        b = a.getFullYear() + "",
        c = a.getMonth() + 1 + "";
    2 > c.length && (c = "0" + c);
    var d = a.getDate() + "";
    switch (this.dateElem_.type) {
    case "month":
        b = b + "-" + c;
        break;
    case "week":
        a.setHours(0, 0, 0);
        a.setDate(a.getDate() + 4 - (a.getDay() || 7));
        c = new Date(a.getFullYear(), 0, 1);
        a = Math.ceil(((a - c) / 864E5 + 1) / 7) + "";
        2 > a.length && (a = "0" + a);
        b = b + "-" + ("W" + a);
        break;
    default:
        b = b + "-" + c + "-" + d
    }
    this.dateElem_.setAttribute("value", b)
};
cvox.ChromeVoxHTMLDateWidget.prototype.handlePosChange_ = function () {
    this.pos_ = Math.max(this.pos_, 0);
    this.pos_ = Math.min(this.pos_, this.maxPos_);
    switch (this.pos_) {
    case 0:
        "week" == this.dateElem_.type ? this.pWeek_ = -1 : this.pMonth_ = -1;
        break;
    case 1:
        "date" == this.dateElem_.type ? this.pDay_ = -1 : this.pYear_ = -1;
        break;
    case 2:
        this.pYear_ = -1
    }
};
cvox.ChromeVoxHTMLDateWidget.prototype.update_ = function (a) {
    var b = this.dateElem_.value.split("-");
    if (1 > b.length) {
        this.forceInitTime_()
    } else {
        var c = -1,
            d = -1,
            e = -1,
            f = -1,
            c = parseInt(b[0], 10);
        "week" == this.dateElem_.type ? e = parseInt(b[1].replace("W", ""), 10) : "date" == this.dateElem_.type ? (d = parseInt(b[1], 10), f = parseInt(b[2], 10)) : d = parseInt(b[1], 10);
        b = "";
        a && (b = cvox.DomUtil.getName(this.dateElem_, !0, !0) + "\n");
        e != this.pWeek_ && (b = b + cvox.ChromeVox.msgs.getMsg("datewidget_week") + e + "\n", this.pWeek_ = e);
        if (d != this.pMonth_) {
            a = "";
            switch (d) {
            case 1:
                a = cvox.ChromeVox.msgs.getMsg("datewidget_january");
                break;
            case 2:
                a = cvox.ChromeVox.msgs.getMsg("datewidget_february");
                break;
            case 3:
                a = cvox.ChromeVox.msgs.getMsg("datewidget_march");
                break;
            case 4:
                a = cvox.ChromeVox.msgs.getMsg("datewidget_april");
                break;
            case 5:
                a = cvox.ChromeVox.msgs.getMsg("datewidget_may");
                break;
            case 6:
                a = cvox.ChromeVox.msgs.getMsg("datewidget_june");
                break;
            case 7:
                a = cvox.ChromeVox.msgs.getMsg("datewidget_july");
                break;
            case 8:
                a = cvox.ChromeVox.msgs.getMsg("datewidget_august");
                break;
            case 9:
                a = cvox.ChromeVox.msgs.getMsg("datewidget_september");
                break;
            case 10:
                a = cvox.ChromeVox.msgs.getMsg("datewidget_october");
                break;
            case 11:
                a = cvox.ChromeVox.msgs.getMsg("datewidget_november");
                break;
            case 12:
                a = cvox.ChromeVox.msgs.getMsg("datewidget_december")
            }
            b = b + a + "\n";
            this.pMonth_ = d
        }
        f != this.pDay_ && (b = b + f + "\n", this.pDay_ = f);
        c != this.pYear_ && (b = b + c + "\n", this.pYear_ = c);
        0 < b.length && this.dateTts_.speak(b, 0, null)
    }
};
cvox.ChromeVoxHTMLDateWidget.prototype.eventHandler_ = function (a) {
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
