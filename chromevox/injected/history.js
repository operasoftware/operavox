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

cvox.HistoryEvent = function (a) {
    this.spoken_ = [];
    this.replayed_ = !1;
    a ? (this.replayed_ = !0, this.userCommand_ = a.cmd) : this.startTime_ = (new Date).getTime()
};
cvox.HistoryEvent.prototype.withUserCommand = function (a) {
    if (this.userCommand_) {
        return window.console.error("Two user commands on " + a, this), this
    }
    this.userCommand_ = a;
    return this
};
cvox.HistoryEvent.prototype.speak = function (a) {
    this.spoken_.push(a);
    return this
};
cvox.HistoryEvent.prototype.done = function () {
    this.endTime_ = (new Date).getTime();
    this.cvTag_ = cvox.NodeBreadcrumb.getInstance().tagCurrentNode();
    window.console.log("User command done.", this);
    return this
};
cvox.HistoryEvent.prototype.outputObject = function () {
    return {
        start: this.startTime_,
        end: this.endTime_,
        cmd: this.userCommand_,
        spoken: this.spoken_
    }
};
cvox.HistoryEvent.prototype.outputHTML = function () {
    var a = document.createElement("div");
    a.className = "cvoxHistoryEvent";
    a.innerHTML = this.userCommand_ + " (" + (this.endTime_ - this.startTime_) + "ms)";
    for (var b = 0; b < this.spoken_.length; b++) {
        var c = document.createElement("div");
        c.className = "cvoxHistoryEventSpoken";
        c.innerHTML = this.spoken_[b].substr(0, 20);
        20 < this.spoken_[b].length && (c.innerHTML += "...");
        a.appendChild(c)
    }
    return a
};
cvox.HistoryEvent.prototype.outputJs = function () {
    var a = "this.waitForCalm(this.userCommand, '" + this.userCommand_ + "')";
    return a = 0 < this.spoken_.length ? a + ("\n  .waitForCalm(this.assertSpoken, '" + cvox.DomUtil.collapseWhitespace(this.spoken_.join(" ")) + "');\n") : a + ";\n"
};
cvox.History = function () {
    this.recording_ = !1;
    this.events_ = [];
    this.markers_ = {};
    this.bigBoxDiv_ = this.styleDiv_ = this.listDiv_ = this.mainDiv_ = this.currentEvent_ = null;
    this.nodeBreadcrumb_ = cvox.NodeBreadcrumb.getInstance()
};
goog.addSingletonGetter(cvox.History);
cvox.History.prototype.addListDiv_ = function () {
    this.mainDiv_ = document.createElement("div");
    this.mainDiv_.style.position = "fixed";
    this.mainDiv_.style.bottom = "0";
    this.mainDiv_.style.right = "0";
    this.mainDiv_.style.zIndex = "999";
    this.listDiv_ = document.createElement("div");
    this.listDiv_.id = "cvoxEventList";
    this.mainDiv_.appendChild(this.listDiv_);
    var a = document.createElement("div"),
        b = document.createElement("button");
    b.onclick = cvox.History.sendToFeedback;
    b.innerHTML = "Create bug";
    a.appendChild(b);
    this.mainDiv_.appendChild(a);
    a = document.createElement("div");
    b = document.createElement("button");
    b.onclick = cvox.History.dumpJs;
    b.innerHTML = "Dump test case";
    a.appendChild(b);
    this.mainDiv_.appendChild(a);
    document.body.appendChild(this.mainDiv_);
    this.styleDiv_ = document.createElement("style");
    this.styleDiv_.innerHTML = ".cvoxHistoryEventSpoken { color: gray; font-size: 75% }";
    document.body.appendChild(this.styleDiv_)
};
cvox.History.prototype.removeListDiv_ = function () {
    document.body.removeChild(this.mainDiv_);
    document.body.removeChild(this.styleDiv_);
    this.styleDiv_ = this.listDiv_ = this.mainDiv_ = null
};
cvox.History.prototype.addBigTextBox_ = function () {
    function a(a, b) {
        var c = document.createElement("button");
        c.onclick = b;
        c.innerHTML = a;
        d.appendChild(c)
    }
    var b = document.createElement("div");
    b.style.position = "fixed";
    b.style.top = "0";
    b.style.left = "0";
    b.style.zIndex = "999";
    var c = document.createElement("textarea");
    c.style.width = "500px";
    c.style.height = "500px";
    c.innerHTML = this.dumpJsOutput_();
    b.appendChild(c);
    var d = document.createElement("div");
    b.appendChild(d);
    a("Close dialog", function () {
        document.body.removeChild(b)
    });
    a("Remove fluff", goog.bind(function () {
        c.innerHTML = this.dumpJsOutput_(["stopSpeech", "toggleKeyPrefix"])
    }, this));
    document.body.appendChild(b)
};
cvox.History.prototype.startRecording = function () {
    this.recording_ = !0;
    this.addListDiv_()
};
cvox.History.prototype.stopRecording = function () {
    this.recording_ = !1;
    this.removeListDiv_();
    this.events_ = [];
    this.currentEvent_ = null
};
cvox.History.prototype.enterUserCommand = function (a) {
    this.recording_ && (this.currentEvent_ && window.console.error("User command " + a + " overlaps current event", this.currentEvent_), this.currentEvent_ = (new cvox.HistoryEvent).withUserCommand(a), this.events_.push(this.currentEvent_))
};
cvox.History.prototype.exitUserCommand = function (a) {
    this.recording_ && this.currentEvent_ && (this.currentEvent_.done(), this.listDiv_.appendChild(this.currentEvent_.outputHTML()), this.currentEvent_ = null)
};
cvox.History.prototype.speak = function (a, b, c) {
    if (!this.recording_) {
        return this
    }
    if (!this.currentEvent_) {
        return window.console.error("Speak called outside of a user command."), this
    }
    this.currentEvent_.speak(a);
    return this
};
cvox.History.prototype.isSpeaking = function () {
    return !1
};
cvox.History.prototype.stop = function () {};
cvox.History.prototype.addCapturingEventListener = function (a) {};
cvox.History.prototype.increaseOrDecreaseProperty = function (a, b) {};
cvox.History.prototype.getDefaultProperty = function (a) {};
cvox.History.dumpJs = function () {
    var a = cvox.History.getInstance();
    a.addBigTextBox_();
    window.console.log(a.dumpJsOutput_())
};
cvox.History.prototype.dumpJsOutput_ = function (a) {
    var b = {};
    a && a.forEach(function (a) {
        b[a] = 1
    });
    return ["/*DOC: += ", this.nodeBreadcrumb_.dumpWalkedDom().innerHTML, "*/\n"].concat(this.events_.filter(function (a) {
        return !(a.userCommand_ in b)
    }).map(function (a) {
        return a.outputJs()
    })).join("")
};
cvox.History.sendToFeedback = function () {
    var a = cvox.History.getInstance().events_.map(function (a) {
        return a.outputObject()
    }),
        b = document.createElement("script");
    b.type = "text/javascript";
    b.src = "https://www.gstatic.com/feedback/api.js";
    var c = document.createElement("script");
    c.type = "text/javascript";
    c.innerHTML = "userfeedback.api.startFeedback({ productId: '76092' }, { cvoxHistory: " + cvox.ChromeVoxJSON.stringify(cvox.ChromeVoxJSON.stringify(a)) + " });";
    b.onload = function () {
        document.body.appendChild(c)
    };
    document.body.appendChild(b)
};
