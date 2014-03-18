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

cvox.AutoRunner = function () {
    this.actualCallbacks_ = this.expectedCallbacks_ = 0;
    this.testTts_ = new cvox.TestTts;
    this.oldTts_ = cvox.ChromeVox.tts;
    this.testsQueue_ = [];
    this.results_ = [];
    this.currentTestSummary = null
};
cvox.AutoRunner.TestSummary = function (a, b, c, d) {
    this.tag = a;
    this.func = b;
    this.status = c;
    this.scope = d
};
cvox.AutoRunner.PASS = "pass";
cvox.AutoRunner.FAIL = "fail";
cvox.AutoRunner.prototype.maybeDone_ = function () {
    this.actualCallbacks_ == this.expectedCallbacks_ && (cvox.ChromeVox.tts = this.oldTts_, window.console.log(this.currentTestSummary.tag + " test ended with status: " + this.status), this.currentTestSummary.status = this.status, this.results_.push(this.currentTestSummary), this.currentTestSummary = null, this.runTests())
};
cvox.AutoRunner.prototype.assertTrue = function (a) {
    if (!a) {
        throw this.status = cvox.AutoRunner.FAIL, Error("assertTrue");
    }
};
cvox.AutoRunner.prototype.assertFalse = function (a) {
    this.assertTrue(!a)
};
cvox.AutoRunner.prototype.assertEquals = function (a, b) {
    this.assertTrue(a == b)
};
cvox.AutoRunner.prototype.toHtml = function (a, b) {
    var c = b.createDocumentFragment(),
        d = b.createElement("div");
    for (d.innerHTML = a; d.firstChild;) {
        c.appendChild(d.firstChild)
    }
    return 1 < c.childNodes.length ? c : c.firstChild
};
cvox.AutoRunner.prototype.appendHtml = function (a) {
    a = this.toHtml(a, window.document);
    window.document.body.appendChild(a)
};
cvox.AutoRunner.prototype.assertSpoken = function (a) {
    var b = this.testTts_.getUtterancesAsString();
    window.console.log("assertSpoken: Expected: " + a + " Actual: " + b);
    this.assertEquals(a, b);
    this.testTts_.clearUtterances();
    return this
};
cvox.AutoRunner.prototype.assertSpokenList = function (a) {
    a instanceof cvox.SpokenListBuilder && (a = a.build());
    for (var b = this.testTts_.getUtteranceInfoList(), c = 0; c < a.length; c++) {
        this.assertSingleUtterance_(a[c][0], a[c][1], b[c].text, b[c].queueMode)
    }
    this.testTts_.clearUtterances();
    return this
};
cvox.AutoRunner.prototype.assertSingleUtterance_ = function (a, b, c, d) {
    this.assertEquals(b, d);
    this.assertEquals(a, c)
};
cvox.AutoRunner.prototype.waitForCalm = function (a, b) {
    if (!a) {
        throw Error("waitForCalm needs a valid function");
    }
    this.expectedCallbacks_++;
    var c = Array.prototype.slice.call(arguments, 1);
    cvox.ChromeVoxEventWatcher.addReadyCallback(goog.bind(function () {
        var b = this.currentTestSummary ? this.currentTestSummary.scope : this;
        try {
            a.apply(b, c)
        } catch (e) {
            window.console.log(e, e.stack), this.status = cvox.AutoRunner.FAIL
        } finally {
            this.actualCallbacks_++, this.maybeDone_()
        }
    }, this));
    return this
};
cvox.AutoRunner.prototype.setFocus = function (a) {
    document.getElementById(a).focus();
    return this
};
cvox.AutoRunner.prototype.userCommand = function (a) {
    var b = cvox.History.getInstance();
    b.enterUserCommand(a);
    cvox.ChromeVoxUserCommands.commands[a]();
    b.exitUserCommand(a);
    return this
};
cvox.AutoRunner.prototype.runTest_ = function (a) {
    this.status = cvox.AutoRunner.PASS;
    cvox.ChromeVox.tts = (new cvox.CompositeTts).add(this.oldTts_).add(this.testTts_);
    cvox.ChromeVox.navigationManager.reset();
    window.console.log("AutoRunner test start");
    var b = this.currentTestSummary ? this.currentTestSummary.scope : this;
    try {
        a.apply(b)
    } catch (c) {
        window.console.log(c, c.stack), this.status = cvox.AutoRunner.FAIL
    } finally {
        this.maybeDone_()
    }
};
cvox.AutoRunner.prototype.addTest = function (a, b, c) {
    a = new cvox.AutoRunner.TestSummary(a, b, "", c);
    this.testsQueue_.push(a)
};
cvox.AutoRunner.prototype.runTests = function () {
    this.actualCallbacks_ == this.expectedCallbacks_ && (1 > this.testsQueue_.length ? this.displayResults() : (this.testTts_.clearUtterances(), document.body.innerHTML = "", this.currentTestSummary = this.testsQueue_.shift(), this.runTest_(this.currentTestSummary.func)))
};
cvox.AutoRunner.prototype.displayResults = function () {
    document.body.innerHTML = "<h1>Tests Done</h1><br>";
    for (var a = 0, b; b = this.results_[a]; a++) {
        var c = document.body,
            d = document.body.innerHTML + b.tag + ": ";
        a: {
            switch (b = b.status, b) {
            case cvox.AutoRunner.FAIL:
                b = '<font color="red">fail</font>';
                break a;
            case cvox.AutoRunner.PASS:
                b = '<font color="green">pass</font>';
                break a
            }
        }
        c.innerHTML = d + b + "<br>"
    }
};
cvox.AutoRunner.prototype.runTestCase = function (a) {
    this.mixOurselfIn_(a);
    for (var b in a) {
        0 == b.search("test") && this.addTest(b, a[b], a)
    }
    a.setUpTest();
    this.runTests()
};
cvox.AutoRunner.prototype.mixOurselfIn_ = function (a) {
    for (var b in cvox.RunnerInterface.prototype) {
        a[b] = goog.bind(this[b], this)
    }
};
var runNextGranularity = function () {
    this.appendHtml("<div><a href='#' id='next-granularity-start'>First sentence.</a><a href='#' id='ng-second'>Second sentence.</a></div>");
    this.setFocus("next-granularity-start").waitForCalm(this.assertSpoken, "First sentence. Internal link");
    this.waitForCalm(this.userCommand, "nextGranularity").waitForCalm(this.assertSpoken, "Sentence First sentence. Internal link").waitForCalm(this.userCommand, "nextGranularity").waitForCalm(this.assertSpoken, "Word First Internal link")
}, runRadioButtonAnnouncements = function () {
        function a(a) {
            var c = document.createEvent("KeyboardEvent");
            c.initKeyboardEvent("keydown", !0, !0, window, a, 0, !1, !1, !1, !1);
            document.activeElement.dispatchEvent(c)
        }
        this.appendHtml("<input id='radio1' type='radio' aria-label='green' tabindex=0><input id='radio2' type='radio' aria-label='blue' tabindex=0>");
        this.setFocus("radio1");
        this.waitForCalm(this.assertSpoken, "green Radio button unselected").waitForCalm(a, "Right").waitForCalm(this.assertSpoken, "blue Radio button selected").waitForCalm(a, "Right").waitForCalm(this.assertSpoken, "");
        this.waitForCalm(a, "Left").waitForCalm(this.assertSpoken, "green Radio button selected").waitForCalm(a, "Left").waitForCalm(this.assertSpoken, "")
    }, runBackForwardTest = function () {
        this.waitForCalm(this.userCommand, "forward");
        var a, b, c, d, e = function () {
                a = cvox.NodeBreadcrumb.getCurrentNodeTag();
                this.assertTrue(-1 != a);
                this.waitForCalm(this.userCommand, "forward").waitForCalm(function () {
                    b = cvox.NodeBreadcrumb.getCurrentNodeTag();
                    this.assertTrue(-1 != b)
                }).waitForCalm(this.userCommand, "backward").waitForCalm(function () {
                    c = cvox.NodeBreadcrumb.getCurrentNodeTag();
                    this.assertTrue(-1 != c)
                }).waitForCalm(this.userCommand, "forward").waitForCalm(function () {
                    d = cvox.NodeBreadcrumb.getCurrentNodeTag();
                    this.assertTrue(-1 != d)
                }).waitForCalm(function () {
                    window.console.log("A: " + a + " B: " + b + " C: " + c + " D: " + d);
                    this.assertEquals(a, c);
                    this.assertEquals(b, d);
                    var f;
                    for (f = cvox.ChromeVox.navigationManager.getCurrentNode(); f && !f.hasAttribute;) {
                        f = f.parentNode
                    }
                    f = f && f.hasAttribute("class") ? "cvoxHistoryEvent" == f.getAttribute("class") : !1;
                    f || e.apply(this)
                })
            };
        this.waitForCalm(e)
    };
