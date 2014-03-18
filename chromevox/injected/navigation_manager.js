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

cvox.NavigationManager = function () {
    this.addInterframeListener_();
    this.reset()
};
cvox.NavigationManager.prototype.storeOn = function (a) {
    a.reversed = this.isReversed();
    a.keepReading = this.keepReading_;
    a.findNext = this.predicate_;
    this.shifter_.storeOn(a)
};
cvox.NavigationManager.prototype.readFrom = function (a) {
    this.curSel_.setReversed(a.reversed);
    this.shifter_.readFrom(a);
    a.keepReading && this.startReading(cvox.AbstractTts.QUEUE_MODE_FLUSH)
};
cvox.NavigationManager.prototype.reset = function () {
    this.navSpeaker_ = new cvox.NavigationSpeaker;
    this.shifterTypes_ = [cvox.NavigationShifter, cvox.TableShifter, cvox.MathShifter];
    this.shifterStack_ = [];
    this.shifter_ = new cvox.NavigationShifter;
    this.curSel_ = document.activeElement != document.body ? cvox.CursorSelection.fromNode(document.activeElement) : this.shifter_.begin(this.curSel_, {
        reversed: !1
    });
    this.prevSel_ = this.curSel_.clone();
    this.ignoreIframesNoMatterWhat_ = this.exitedShifter_ = this.enteredShifter_ = this.pageEndAnnounced_ = this.pageEnd_ = this.keepReading_ = this.recovered_ = this.skipped_ = !1;
    this.pageSel_ = null;
    this.predicate_ = "";
    this.saveSel_ = null;
    this.activeIndicator && this.activeIndicator.removeFromDom();
    this.activeIndicator = new cvox.ActiveIndicator;
    this.navigationHistory_ = new cvox.NavigationHistory;
    this.focusRecovery_ = "chrome:" != window.location.protocol;
    this.iframeIdMap = {};
    this.nextIframeId = 1;
    document.activeElement != document.body && this.sync();
    cvox.TraverseMath.getInstance()
};
cvox.NavigationManager.prototype.resolve = function (a) {
    if (!this.getFocusRecovery()) {
        return !0
    }
    var b = this.getCurrentNode();
    if (!this.navigationHistory_.becomeInvalid(b) || this.hasNext_()) {
        return !0
    }
    b = this.navigationHistory_.revert(a);
    if (!b.current) {
        return !0
    }
    a = cvox.CursorSelection.fromNode(b.current);
    b = cvox.CursorSelection.fromNode(b.previous);
    a = a || cvox.CursorSelection.fromBody();
    b = b || cvox.CursorSelection.fromBody();
    a.setReversed(this.isReversed());
    this.updateSel(a, b);
    this.recovered_ = !0;
    return !1
};
cvox.NavigationManager.prototype.getFocusRecovery = function () {
    return this.focusRecovery_
};
cvox.NavigationManager.prototype.setFocusRecovery = function (a) {
    this.focusRecovery_ = a
};
cvox.NavigationManager.prototype.next_ = function (a) {
    return this.tryBoundaries_(this.shifter_.next(this.curSel_), a) ? (this.pageSel_ && this.pageSel_.extend(this.curSel_), !0) : !1
};
cvox.NavigationManager.prototype.hasNext_ = function () {
    if (0 < this.shifterStack_.length) {
        return !0
    }
    var a = this.curSel_.clone(),
        b = !1,
        c = new cvox.NavigationShifter;
    c.setGranularity(this.shifter_.getGranularity());
    c.sync(a);
    c.next(a) && (b = !0);
    return b
};
cvox.NavigationManager.prototype.findNext = function (a, b, c) {
    this.predicate_ = b || "";
    this.resolve();
    this.shifter_ = this.shifterStack_[0] || this.shifter_;
    this.shifterStack_ = [];
    a = cvox.FindUtil.findNext(this.curSel_, a, c);
    this.ignoreIframesNoMatterWhat_ || this.tryIframe_(a && a.start.node);
    a && this.updateSelToArbitraryNode(a.start.node);
    this.predicate_ = "";
    return a
};
cvox.NavigationManager.prototype.sync = function () {
    this.resolve();
    var a = this.shifter_.sync(this.curSel_);
    a && (this.curSel_ = a)
};
cvox.NavigationManager.prototype.syncAll = function (a) {
    this.sync();
    this.setFocus(a);
    this.updateIndicator()
};
cvox.NavigationManager.prototype.clearPageSel = function (a) {
    var b = !! this.pageSel_;
    b && a && (a = cvox.ChromeVox.msgs.getMsg("clear_page_selection"), cvox.ChromeVox.tts.speak(a, cvox.AbstractTts.QUEUE_MODE_FLUSH, cvox.AbstractTts.PERSONALITY_ANNOTATION));
    this.pageSel_ = null;
    return b
};
cvox.NavigationManager.prototype.togglePageSel = function () {
    this.pageSel_ = this.pageSel_ ? null : new cvox.PageSelection(this.curSel_.setReversed(!1));
    return !!this.pageSel_
};
cvox.NavigationManager.prototype.getDescription = function () {
    if (this.getCurrentNode().hasAttribute && this.getCurrentNode().hasAttribute("cvoxnodedesc")) {
        for (var a = cvox.ChromeVoxJSON.parse(this.getCurrentNode().getAttribute("cvoxnodedesc")), b = [], c = 0; c < a.length; ++c) {
            var d = a[c];
            b.push(new cvox.NavDescription({
                context: d.context,
                text: d.text,
                userValue: d.userValue,
                annotation: d.annotation
            }))
        }
        return b
    }
    var e = this.pageSel_ ? this.pageSel_.getDescription(this.shifter_, this.prevSel_, this.curSel_) : this.shifter_.getDescription(this.prevSel_, this.curSel_),
        a = [];
    this.skipped_ && (a.push(cvox.AbstractEarcons.PARAGRAPH_BREAK), this.skipped_ = !1);
    this.recovered_ && (a.push(cvox.AbstractEarcons.FONT_CHANGE), this.recovered_ = !1);
    this.pageEnd_ && (a.push(cvox.AbstractEarcons.WRAP), this.pageEnd_ = !1);
    this.enteredShifter_ && (a.push(cvox.AbstractEarcons.OBJECT_ENTER), this.enteredShifter_ = !1);
    this.exitedShifter_ && (a.push(cvox.AbstractEarcons.OBJECT_EXIT), this.exitedShifter_ = !1);
    0 < a.length && 0 < e.length && a.forEach(function (a) {
        e[0].pushEarcon(a)
    });
    return e
};
cvox.NavigationManager.prototype.getBraille = function () {
    return cvox.PlatformUtil.matchesPlatform(cvox.PlatformFilter.ANDROID | cvox.PlatformFilter.CHROMEOS) ? this.shifter_.getBraille(this.prevSel_, this.curSel_) : new cvox.NavBraille({})
};
cvox.NavigationManager.prototype.performAction = function (a) {
    switch (a) {
    case "enterShifter":
        ;
    case "enterShifterSilently":
        for (var b = this.shifterTypes_.length - 1, c; c = this.shifterTypes_[b]; b--) {
            if ((c = c.create(this.curSel_)) && c.getName() != this.shifter_.getName()) {
                this.shifterStack_.push(this.shifter_);
                this.shifter_ = c;
                this.sync();
                this.enteredShifter_ = "enterShifterSilently" != a;
                break
            } else {
                if (c && this.shifter_.getName() == c.getName()) {
                    break
                }
            }
        }
        break;
    case "exitShifter":
        if (0 == this.shifterStack_.length) {
            return !1
        }
        this.shifter_ = this.shifterStack_.pop();
        this.sync();
        this.exitedShifter_ = !0;
        break;
    case "exitShifterContent":
        if (0 == this.shifterStack_.length) {
            return !1
        }
        this.updateSel(this.shifter_.performAction(a, this.curSel_));
        this.shifter_ = this.shifterStack_.pop() || this.shifter_;
        this.sync();
        this.exitedShifter_ = !0;
        break;
    default:
        return this.shifter_.hasAction(a) ? this.updateSel(this.shifter_.performAction(a, this.curSel_)) : !1
    }
    return !0
};
cvox.NavigationManager.prototype.getGranularityMsg = function () {
    return this.shifter_.getGranularityMsg()
};
cvox.NavigationManager.prototype.makeMoreGranular = function (a) {
    this.shifter_.makeMoreGranular();
    this.sync();
    this.persistGranularity_(a)
};
cvox.NavigationManager.prototype.makeLessGranular = function (a) {
    this.shifter_.makeLessGranular();
    this.sync();
    this.persistGranularity_(a)
};
cvox.NavigationManager.prototype.setGranularity = function (a, b, c) {
    !b && 0 < this.shifterStack_.length || (this.shifter_ = this.shifterStack_.shift() || this.shifter_, this.shifters_ = [], this.shifter_.setGranularity(a), this.persistGranularity_(c))
};
cvox.NavigationManager.prototype.getGranularity = function () {
    return (this.shifterStack_[0] || this.shifter_).getGranularity()
};
cvox.NavigationManager.prototype.ensureSubnavigating = function () {
    this.shifter_.isSubnavigating() || (this.shifter_.ensureSubnavigating(), this.sync())
};
cvox.NavigationManager.prototype.ensureNotSubnavigating = function () {
    this.shifter_.isSubnavigating() && (this.shifter_.ensureNotSubnavigating(), this.sync())
};
cvox.NavigationManager.prototype.speakDescriptionArray = function (a, b, c, d) {
    d && a.every(function (a) {
        a.personality || (a.personality = d)
    });
    this.navSpeaker_.speakDescriptionArray(a, b, c)
};
cvox.NavigationManager.prototype.updatePosition = function (a) {
    var b = cvox.ChromeVox.position;
    b[document.location.href] = cvox.DomUtil.elementToPoint(a);
    cvox.ChromeVox.host.sendToBackgroundPage({
        target: "Prefs",
        action: "setPref",
        pref: "position",
        value: JSON.stringify(b)
    })
};
cvox.NavigationManager.prototype.finishNavCommand = function (a, b, c, d) {
    if (this.pageEnd_ && !this.pageEndAnnounced_) {
        this.pageEndAnnounced_ = !0, cvox.ChromeVox.tts.stop(), cvox.ChromeVox.earcons.playEarcon(cvox.AbstractEarcons.WRAP), cvox.ChromeVox.verbosity === cvox.VERBOSITY_VERBOSE && (a = cvox.ChromeVox.msgs.getMsg("wrapped_to_top"), this.isReversed() && (a = cvox.ChromeVox.msgs.getMsg("wrapped_to_bottom")), cvox.ChromeVox.tts.speak(a, cvox.AbstractTts.QUEUE_MODE_QUEUE, cvox.AbstractTts.PERSONALITY_ANNOTATION))
    } else {
        if (this.enteredShifter_ || this.exitedShifter_) {
            a = cvox.ChromeVox.msgs.getMsg("enter_content_say", [this.shifter_.getName()])
        }
        var e = cvox.ChromeVox.navigationManager.getDescription();
        (void 0 === b || b) && this.setFocus();
        this.updateIndicator();
        b = c || cvox.AbstractTts.QUEUE_MODE_FLUSH;
        a && (cvox.ChromeVox.tts.speak(a, b, cvox.AbstractTts.PERSONALITY_ANNOTATION), b = cvox.AbstractTts.QUEUE_MODE_QUEUE);
        this.speakDescriptionArray(e, b, d || null);
        this.getBraille().write();
        this.updatePosition(this.getCurrentNode())
    }
};
cvox.NavigationManager.prototype.navigate = function (a, b) {
    this.pageEndAnnounced_ = !1;
    if (this.pageEnd_) {
        return this.pageEnd_ = !1, this.syncToBeginning(a), !0
    }
    if (!this.resolve()) {
        return !1
    }
    this.ensureNotSubnavigating();
    void 0 !== b && (b !== this.getGranularity() || 0 < this.shifterStack_.length) && (this.setGranularity(b, !0), this.sync());
    return this.next_(!a)
};
cvox.NavigationManager.prototype.subnavigate = function () {
    this.pageEndAnnounced_ = !1;
    this.resolve() && (this.ensureSubnavigating(), this.next_(!0))
};
cvox.NavigationManager.prototype.skip = function () {
    if (!this.keepReading_) {
        return !1
    }
    cvox.ChromeVox.host.hasTtsCallback() && (this.skipped_ = !0, this.setReversed(!1), this.startCallbackReading_(cvox.AbstractTts.QUEUE_MODE_FLUSH));
    return !0
};
cvox.NavigationManager.prototype.startReading = function (a) {
    this.keepReading_ = !0;
    cvox.ChromeVox.host.hasTtsCallback() ? this.startCallbackReading_(a) : this.startNonCallbackReading_(a);
    this.prevStickyState_ = cvox.ChromeVox.isStickyOn;
    cvox.ChromeVox.host.sendToBackgroundPage({
        target: "Prefs",
        action: "setPref",
        pref: "sticky",
        value: !0,
        announce: !1
    })
};
cvox.NavigationManager.prototype.stopReading = function (a) {
    this.keepReading_ = !1;
    this.navSpeaker_.stopReading = !0;
    a && cvox.ChromeVox.tts.stop();
    void 0 != this.prevStickyState_ && (cvox.ChromeVox.host.sendToBackgroundPage({
        target: "Prefs",
        action: "setPref",
        pref: "sticky",
        value: this.prevStickyState_,
        announce: !1
    }), this.prevStickyState_ = void 0)
};
cvox.NavigationManager.prototype.isReading = function () {
    return this.keepReading_
};
cvox.NavigationManager.prototype.startCallbackReading_ = cvox.ChromeVoxEventSuspender.withSuspendedEvents(function (a) {
    this.finishNavCommand("", !0, a, goog.bind(function () {
        this.next_(!0) && this.keepReading_ && this.startCallbackReading_(cvox.AbstractTts.QUEUE_MODE_QUEUE)
    }, this))
});
cvox.NavigationManager.prototype.startNonCallbackReading_ = cvox.ChromeVoxEventSuspender.withSuspendedEvents(function (a) {
    this.keepReading_ && (cvox.ChromeVox.tts.isSpeaking() || (this.finishNavCommand("", !0, a, null), this.next_(!0) || (this.keepReading_ = !1)), window.setTimeout(goog.bind(this.startNonCallbackReading_, this), 1E3))
});
cvox.NavigationManager.prototype.getFullDescription = function () {
    return this.pageSel_ ? this.pageSel_.getFullDescription() : [cvox.DescriptionUtil.getDescriptionFromAncestors(cvox.DomUtil.getAncestors(this.curSel_.start.node), !0, cvox.ChromeVox.verbosity)]
};
cvox.NavigationManager.prototype.setFocus = function (a) {
    this.pageSel_ || a && this.curSel_.start.node.constructor == Text || cvox.Focuser.setFocus(this.curSel_.start.node)
};
cvox.NavigationManager.prototype.getCurrentNode = function () {
    return this.curSel_.absStart().node
};
cvox.NavigationManager.prototype.addInterframeListener_ = function () {
    var a = this;
    cvox.Interframe.addListener(function (b) {
        if ("enterIframe" == b.command || "exitIframe" == b.command) {
            cvox.ChromeVox.serializer.readFrom(b), a.keepReading_ || cvox.ChromeVoxEventSuspender.withSuspendedEvents(function () {
                window.focus();
                if (b.findNext) {
                    var c = b.findNext,
                        d = cvox.DomPredicates[c],
                        c = a.findNext(d, c, !0);
                    if (d && (!c || "IFRAME" == c.start.node.tagName)) {
                        return
                    }
                } else {
                    if ("exitIframe" == b.command) {
                        d = a.iframeIdMap[b.sourceId], c = b.reversed, d && a.updateSel(cvox.CursorSelection.fromNode(d)), a.setReversed(c), a.sync(), a.navigate()
                    } else {
                        if (a.syncToBeginning(), !cvox.DomUtil.hasContent(document.body)) {
                            a.tryIframe_(null);
                            return
                        }
                    }
                }
                a.finishNavCommand("", !0)
            })()
        }
    })
};
cvox.NavigationManager.prototype.updateIndicator = function () {
    this.activeIndicator.syncToCursorSelection(this.curSel_)
};
cvox.NavigationManager.prototype.updateIndicatorIfChanged = function () {
    this.activeIndicator.updateIndicatorIfChanged()
};
cvox.NavigationManager.prototype.showOrHideIndicator = function (a) {
    a || this.activeIndicator.removeFromDom()
};
cvox.NavigationManager.prototype.collapseSelection = function () {
    this.curSel_.collapse()
};
cvox.NavigationManager.prototype.updateSelToArbitraryNode = function (a, b) {
    a ? (this.setGranularity(cvox.NavigationShifter.GRANULARITIES.OBJECT, !0), this.updateSel(cvox.CursorSelection.fromNode(a)), b || this.sync()) : this.syncToBeginning()
};
cvox.NavigationManager.prototype.updateSel = function (a, b) {
    a && (this.prevSel_ = b || this.curSel_, this.curSel_ = a);
    var c = this.getCurrentNode();
    this.navigationHistory_.update(c);
    return !!a
};
cvox.NavigationManager.prototype.setReversed = function (a) {
    this.curSel_.setReversed(a)
};
cvox.NavigationManager.prototype.isReversed = function () {
    return this.curSel_.isReversed()
};
cvox.NavigationManager.prototype.tryBoundaries_ = function (a, b) {
    b = !! b && !this.ignoreIframesNoMatterWhat_ || !1;
    this.pageEnd_ = !1;
    if (b && this.tryIframe_(a && a.start.node)) {
        return !0
    }
    if (a) {
        return this.updateSel(a), !0
    }
    if (0 < this.shifterStack_.length) {
        return !0
    }
    this.syncToBeginning(!b);
    this.clearPageSel(!0);
    this.stopReading(!0);
    this.pageEnd_ = !0;
    return !1
};
cvox.NavigationManager.prototype.tryIframe_ = function (a) {
    if (null == a && cvox.Interframe.isIframe()) {
        var b = {
            command: "exitIframe",
            reversed: this.isReversed(),
            granularity: this.getGranularity()
        };
        cvox.ChromeVox.serializer.storeOn(b);
        cvox.Interframe.sendMessageToParentWindow(b);
        return !0
    }
    if (null == a || "IFRAME" != a.tagName || !a.src) {
        return !1
    }
    var b = void 0,
        c;
    for (c in this.iframeIdMap) {
        if (this.iframeIdMap[c] == a) {
            b = c;
            break
        }
    }
    void 0 == b && (b = this.nextIframeId, this.nextIframeId++, this.iframeIdMap[b] = a, cvox.Interframe.sendIdToIFrame(b, a));
    b = {
        command: "enterIframe",
        id: b
    };
    cvox.ChromeVox.serializer.storeOn(b);
    cvox.Interframe.sendMessageToIFrame(b, a);
    return !0
};
cvox.NavigationManager.prototype.syncToBeginning = function (a) {
    var b = this.shifter_.begin(this.curSel_, {
        reversed: this.curSel_.isReversed()
    });
    !a && this.tryIframe_(b && b.start.node) || this.updateSel(b)
};
cvox.NavigationManager.prototype.ignoreIframesNoMatterWhat = function () {
    this.ignoreIframesNoMatterWhat_ = !0
};
cvox.NavigationManager.prototype.saveSel = function () {
    this.saveSel_ = this.curSel_
};
cvox.NavigationManager.prototype.restoreSel = function () {
    this.curSel_ = this.saveSel_ || this.curSel_
};
cvox.NavigationManager.prototype.persistGranularity_ = function (a) {
    (void 0 === a ? 0 : a) && cvox.ChromeVox.host.sendToBackgroundPage({
        target: "Prefs",
        action: "setPref",
        pref: "granularity",
        value: this.getGranularity()
    })
};
