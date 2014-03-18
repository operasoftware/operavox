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

cvox.ChromeVoxEventWatcherUtil = {};
cvox.ChromeVoxEventWatcher = function () {};
cvox.ChromeVoxEventWatcher.MAX_WAIT_TIME_MS_ = 50;
cvox.ChromeVoxEventWatcher.WAIT_TIME_MS_ = 10;
cvox.ChromeVoxEventWatcher.SUBTREE_MODIFIED_BURST_DURATION_ = 1E3;
cvox.ChromeVoxEventWatcher.SUBTREE_MODIFIED_BURST_COUNT_LIMIT_ = 3;
cvox.ChromeVoxEventWatcher.MAX_LIVE_REGIONS_ = 5;
cvox.ChromeVoxEventWatcher.shouldEchoKeys = !0;
cvox.ChromeVoxEventWatcher.processing_ = !1;
cvox.ChromeVoxEventWatcher.init = function (a) {
    cvox.ChromeVoxEventWatcher.lastFocusedNode = null;
    cvox.ChromeVoxEventWatcher.announcedMouseOverNode = null;
    cvox.ChromeVoxEventWatcher.pendingMouseOverNode = null;
    cvox.ChromeVoxEventWatcher.mouseOverTimeoutId = null;
    cvox.ChromeVoxEventWatcher.lastFocusedNodeValue = null;
    cvox.ChromeVoxEventWatcher.eventToEat = null;
    cvox.ChromeVoxEventWatcher.currentTextControl = null;
    cvox.ChromeVoxEventWatcher.currentTextHandler = null;
    cvox.ChromeVoxEventWatcher.lastKeypressTime = 0;
    cvox.ChromeVoxEventWatcher.listeners_ = [];
    cvox.ChromeVoxEventWatcher.mutationObserver_ = null;
    cvox.ChromeVoxEventWatcher.focusFollowsMouse = !1;
    cvox.ChromeVoxEventWatcher.mouseoverDelayMs = 500;
    cvox.ChromeVoxEventWatcher.events_ = [];
    cvox.ChromeVoxEventWatcher.lastEventTime = 0;
    cvox.ChromeVoxEventWatcher.firstUnprocessedEventTime = -1;
    cvox.ChromeVoxEventWatcher.queueProcessingScheduled_ = !1;
    cvox.ChromeVoxEventWatcher.readyCallbacks_ = [];
    cvox.ChromeVox.searchKeyHeld = !1;
    cvox.ChromeVoxEventWatcher.textMutationObserver_ = null;
    cvox.ChromeVoxEventWatcher.addEventListeners_(a);
    cvox.ChromeVoxEventWatcher.lastSubtreeModifiedEventBurstTime_ = 0;
    cvox.ChromeVoxEventWatcher.subtreeModifiedEventsCount_ = 0
};
cvox.ChromeVoxEventWatcher.storeOn = function (a) {
    a.searchKeyHeld = cvox.ChromeVox.searchKeyHeld
};
cvox.ChromeVoxEventWatcher.readFrom = function (a) {
    cvox.ChromeVox.searchKeyHeld = a.searchKeyHeld
};
cvox.ChromeVoxEventWatcher.addEvent = function (a) {
    if (!cvox.ChromeVox.isActive || document.webkitHidden) {
        return !1
    }
    cvox.ChromeVoxEventWatcher.events_.push(a);
    cvox.ChromeVoxEventWatcher.lastEventTime = (new Date).getTime(); - 1 == cvox.ChromeVoxEventWatcher.firstUnprocessedEventTime && (cvox.ChromeVoxEventWatcher.firstUnprocessedEventTime = (new Date).getTime());
    cvox.ChromeVoxEventWatcher.queueProcessingScheduled_ || (cvox.ChromeVoxEventWatcher.queueProcessingScheduled_ = !0, window.setTimeout(cvox.ChromeVoxEventWatcher.processQueue_, cvox.ChromeVoxEventWatcher.WAIT_TIME_MS_))
};
cvox.ChromeVoxEventWatcher.addReadyCallback = function (a) {
    cvox.ChromeVoxEventWatcher.readyCallbacks_.push(a);
    cvox.ChromeVoxEventWatcher.maybeCallReadyCallbacks_()
};
cvox.ChromeVoxEventWatcher.hasPendingEvents_ = function () {
    return -1 != cvox.ChromeVoxEventWatcher.firstUnprocessedEventTime || cvox.ChromeVoxEventWatcher.queueProcessingScheduled_
};
cvox.ChromeVoxEventWatcher.readyCallbackRunning_ = !1;
cvox.ChromeVoxEventWatcher.maybeCallReadyCallbacks_ = function () {
    cvox.ChromeVoxEventWatcher.readyCallbackRunning_ || (cvox.ChromeVoxEventWatcher.readyCallbackRunning_ = !0, window.setTimeout(function () {
        cvox.ChromeVoxEventWatcher.readyCallbackRunning_ = !1;
        !cvox.ChromeVoxEventWatcher.hasPendingEvents_() && !cvox.ChromeVoxEventWatcher.queueProcessingScheduled_ && 0 < cvox.ChromeVoxEventWatcher.readyCallbacks_.length && (cvox.ChromeVoxEventWatcher.readyCallbacks_.shift()(), cvox.ChromeVoxEventWatcher.maybeCallReadyCallbacks_())
    }, 5))
};
cvox.ChromeVoxEventWatcher.addEventListeners_ = function (a) {
    cvox.ChromeVoxEventWatcher.addEventListener_(a, "keydown", cvox.ChromeVoxEventWatcher.keyDownEventWatcher, !0);
    if (cvox.ChromeVox.isActive && !cvox.ChromeVox.entireDocumentIsHidden) {
        if (cvox.ChromeVoxEventWatcher.addEventListener_(a, "keypress", cvox.ChromeVoxEventWatcher.keyPressEventWatcher, !0), cvox.ChromeVoxEventWatcher.addEventListener_(a, "keyup", cvox.ChromeVoxEventWatcher.keyUpEventWatcher, !0), cvox.ChromeVoxEventWatcher.addEventListener_(a, cvox.UserEventDetail.Category.JUMP, cvox.ChromeVoxUserCommands.handleChromeVoxUserEvent, !1), cvox.ChromeVoxEventWatcher.addEventListener_(a, "focus", cvox.ChromeVoxEventWatcher.focusEventWatcher, !0), cvox.ChromeVoxEventWatcher.addEventListener_(a,
                "blur", cvox.ChromeVoxEventWatcher.blurEventWatcher, !0), cvox.ChromeVoxEventWatcher.addEventListener_(a, "change", cvox.ChromeVoxEventWatcher.changeEventWatcher, !0), cvox.ChromeVoxEventWatcher.addEventListener_(a, "copy", cvox.ChromeVoxEventWatcher.clipboardEventWatcher, !0), cvox.ChromeVoxEventWatcher.addEventListener_(a, "cut", cvox.ChromeVoxEventWatcher.clipboardEventWatcher, !0), cvox.ChromeVoxEventWatcher.addEventListener_(a, "paste", cvox.ChromeVoxEventWatcher.clipboardEventWatcher, !0),
            cvox.ChromeVoxEventWatcher.addEventListener_(a, "select", cvox.ChromeVoxEventWatcher.selectEventWatcher, !0), cvox.ChromeVoxEventWatcher.addEventListener_(a, "webkitvisibilitychange", cvox.ChromeVoxEventWatcher.visibilityChangeWatcher, !0), cvox.ChromeVoxEventWatcher.events_ = [], cvox.ChromeVoxEventWatcher.queueProcessingScheduled_ = !1, cvox.ChromeVoxEventWatcher.addEventListener_(a, "mouseover", cvox.ChromeVoxEventWatcher.mouseOverEventWatcher, !0), cvox.ChromeVoxEventWatcher.addEventListener_(a,
                "mouseout", cvox.ChromeVoxEventWatcher.mouseOutEventWatcher, !0), cvox.ChromeVoxEventWatcher.addEventListener_(a, "click", cvox.ChromeVoxEventWatcher.mouseClickEventWatcher, !0), "undefined" != typeof WebKitMutationObserver) {
            cvox.ChromeVoxEventWatcher.mutationObserver_ = new WebKitMutationObserver(cvox.ChromeVoxEventWatcher.mutationHandler);
            var b = null;
            a.documentElement ? b = a.documentElement : a.document && a.document.documentElement && (b = a.document.documentElement);
            b && cvox.ChromeVoxEventWatcher.mutationObserver_.observe(b, {
                childList: !0,
                attributes: !0,
                characterData: !0,
                subtree: !0,
                attributeOldValue: !0,
                characterDataOldValue: !0
            })
        } else {
            cvox.ChromeVoxEventWatcher.addEventListener_(a, "DOMSubtreeModified", cvox.ChromeVoxEventWatcher.subtreeModifiedEventWatcher, !0)
        }
    }
};
cvox.ChromeVoxEventWatcher.cleanup = function (a) {
    for (var b = 0; b < cvox.ChromeVoxEventWatcher.listeners_.length; b++) {
        var c = cvox.ChromeVoxEventWatcher.listeners_[b];
        a.removeEventListener(c.type, c.listener, c.useCapture)
    }
    cvox.ChromeVoxEventWatcher.listeners_ = [];
    cvox.ChromeVoxEventWatcher.currentDateHandler && cvox.ChromeVoxEventWatcher.currentDateHandler.shutdown();
    cvox.ChromeVoxEventWatcher.currentTimeHandler && cvox.ChromeVoxEventWatcher.currentTimeHandler.shutdown();
    cvox.ChromeVoxEventWatcher.currentMediaHandler && cvox.ChromeVoxEventWatcher.currentMediaHandler.shutdown();
    cvox.ChromeVoxEventWatcher.mutationObserver_ && cvox.ChromeVoxEventWatcher.mutationObserver_.disconnect();
    cvox.ChromeVoxEventWatcher.mutationObserver_ = null
};
cvox.ChromeVoxEventWatcher.addEventListener_ = function (a, b, c, d) {
    cvox.ChromeVoxEventWatcher.listeners_.push({
        type: b,
        listener: c,
        useCapture: d
    });
    a.addEventListener(b, c, d)
};
cvox.ChromeVoxEventWatcher.getLastFocusedNode = function () {
    return cvox.ChromeVoxEventWatcher.lastFocusedNode
};
cvox.ChromeVoxEventWatcher.setLastFocusedNode_ = function (a) {
    cvox.ChromeVoxEventWatcher.lastFocusedNode = a;
    cvox.ChromeVoxEventWatcher.lastFocusedNodeValue = a ? cvox.DomUtil.getControlValueAndStateString(a) : null
};
cvox.ChromeVoxEventWatcher.mutationHandler = function (a) {
    if (cvox.ChromeVoxEventSuspender.areEventsSuspended()) {
        return !0
    }
    cvox.ChromeVox.navigationManager.updateIndicatorIfChanged();
    cvox.LiveRegions.processMutations(a, function (a, c) {
        var d = new window.Event("LiveRegion");
        d.navDescriptions = c;
        d.assertive = a;
        cvox.ChromeVoxEventWatcher.addEvent(d);
        return !0
    })
};
cvox.ChromeVoxEventWatcher.mouseClickEventWatcher = function (a) {
    cvox.PlatformUtil.matchesPlatform(cvox.PlatformFilter.WML) && !a.fromCvox && cvox.ApiImplementation.syncToNode(a.target, !0);
    return cvox.ChromeVox.host.mustRedispatchClickEvent() && !a.fromCvox ? (cvox.ChromeVoxUserCommands.wasMouseClicked = !0, a.stopPropagation(), a.preventDefault(), cvox.Focuser.setFocus(cvox.ChromeVox.navigationManager.getCurrentNode()), cvox.ChromeVox.tts.speak(cvox.ChromeVox.msgs.getMsg("element_clicked"), cvox.AbstractTts.QUEUE_MODE_FLUSH, cvox.AbstractTts.PERSONALITY_ANNOTATION), a = cvox.ChromeVox.navigationManager.getCurrentNode(), cvox.DomUtil.clickElem(a, !1, !0), !1) : cvox.ChromeVoxUserCommands.wasMouseClicked = !0
};
cvox.ChromeVoxEventWatcher.mouseOverEventWatcher = function (a) {
    if (!cvox.ChromeVoxEventWatcher.focusFollowsMouse || cvox.DomUtil.isDescendantOfNode(cvox.ChromeVoxEventWatcher.announcedMouseOverNode, a.target) || a.target == cvox.ChromeVoxEventWatcher.pendingMouseOverNode) {
        return !0
    }
    cvox.ChromeVoxEventWatcher.pendingMouseOverNode = a.target;
    cvox.ChromeVoxEventWatcher.mouseOverTimeoutId && (window.clearTimeout(cvox.ChromeVoxEventWatcher.mouseOverTimeoutId), cvox.ChromeVoxEventWatcher.mouseOverTimeoutId = null);
    if (a.target.tagName && "BODY" == a.target.tagName) {
        return cvox.ChromeVoxEventWatcher.pendingMouseOverNode = null, cvox.ChromeVoxEventWatcher.announcedMouseOverNode = null, !0
    }
    cvox.ChromeVoxEventWatcher.mouseOverTimeoutId = window.setTimeout(function () {
        cvox.ChromeVoxEventWatcher.mouseOverTimeoutId = null;
        if (a.target == cvox.ChromeVoxEventWatcher.pendingMouseOverNode) {
            cvox.ChromeVox.navigationManager.stopReading(!0);
            var b = a.target;
            cvox.Focuser.setFocus(b);
            cvox.ApiImplementation.syncToNode(b, !0, cvox.AbstractTts.QUEUE_MODE_FLUSH);
            cvox.ChromeVoxEventWatcher.announcedMouseOverNode = b
        }
    }, cvox.ChromeVoxEventWatcher.mouseoverDelayMs);
    return !0
};
cvox.ChromeVoxEventWatcher.mouseOutEventWatcher = function (a) {
    a.target == cvox.ChromeVoxEventWatcher.pendingMouseOverNode && (cvox.ChromeVoxEventWatcher.pendingMouseOverNode = null, cvox.ChromeVoxEventWatcher.mouseOverTimeoutId && (window.clearTimeout(cvox.ChromeVoxEventWatcher.mouseOverTimeoutId), cvox.ChromeVoxEventWatcher.mouseOverTimeoutId = null));
    return !0
};
cvox.ChromeVoxEventWatcher.focusEventWatcher = function (a) {
    cvox.ChromeVoxUserCommands.removeTabDummySpan();
    cvox.ChromeVoxEventSuspender.areEventsSuspended() ? a.target && a.target.nodeType == Node.ELEMENT_NODE && cvox.ChromeVoxEventWatcher.setLastFocusedNode_(a.target) : cvox.ChromeVoxEventWatcher.addEvent(a);
    return !0
};
cvox.ChromeVoxEventWatcher.focusHandler = function (a) {
    if (a.target && a.target.hasAttribute && "true" == a.target.getAttribute("aria-hidden") && "true" != a.target.getAttribute("chromevoxignoreariahidden")) {
        cvox.ChromeVoxEventWatcher.setLastFocusedNode_(null), cvox.ChromeVoxEventWatcher.setUpTextHandler()
    } else {
        if (a.target && a.target != window) {
            var b = a.target,
                c = cvox.DomUtil.getSurroundingControl(b);
            if (c && c == cvox.ChromeVoxEventWatcher.lastFocusedNode) {
                cvox.ChromeVoxEventWatcher.handleControlChanged(b)
            } else {
                c ? cvox.ChromeVoxEventWatcher.setLastFocusedNode_(c) : cvox.ChromeVoxEventWatcher.setLastFocusedNode_(b);
                c = cvox.ChromeVoxEventWatcher.queueMode_();
                if (cvox.ChromeVoxEventWatcher.getInitialVisibility() || cvox.ChromeVoxEventWatcher.handleDialogFocus(b)) {
                    c = cvox.AbstractTts.QUEUE_MODE_QUEUE
                }
                cvox.ChromeVox.navigationManager.clearPageSel(!0) && (c = cvox.AbstractTts.QUEUE_MODE_QUEUE);
                cvox.ApiImplementation.syncToNode(b, !document.webkitHidden, c);
                if (a.target.constructor == HTMLVideoElement || a.target.constructor == HTMLAudioElement) {
                    cvox.ChromeVoxEventWatcher.setUpMediaHandler_()
                } else {
                    if (a.target.hasAttribute) {
                        switch (a.target.getAttribute("type")) {
                        case "time":
                            cvox.ChromeVoxEventWatcher.setUpTimeHandler_();
                            return;
                        case "date":
                            ;
                        case "month":
                            ;
                        case "week":
                            cvox.ChromeVoxEventWatcher.setUpDateHandler_();
                            return
                        }
                    }
                    cvox.ChromeVoxEventWatcher.setUpTextHandler()
                }
            }
        } else {
            cvox.ChromeVoxEventWatcher.setLastFocusedNode_(null)
        }
    }
};
cvox.ChromeVoxEventWatcher.blurEventWatcher = function (a) {
    window.setTimeout(function () {
        document.activeElement || (cvox.ChromeVoxEventWatcher.setLastFocusedNode_(null), cvox.ChromeVoxEventWatcher.addEvent(a))
    }, 0);
    return !0
};
cvox.ChromeVoxEventWatcher.keyDownEventWatcher = function (a) {
    cvox.ChromeVox.isChromeOS && 91 == a.keyCode && (cvox.ChromeVox.searchKeyHeld = !0);
    a.searchKeyHeld = cvox.ChromeVox.searchKeyHeld && cvox.ChromeVox.isActive;
    a.stickyMode = cvox.ChromeVox.isStickyOn && cvox.ChromeVox.isActive;
    a.keyPrefix = cvox.ChromeVox.keyPrefixOn && cvox.ChromeVox.isActive;
    cvox.ChromeVox.keyPrefixOn = !1;
    cvox.ChromeVoxEventWatcher.eventToEat = null;
    if (!cvox.ChromeVoxKbHandler.basicKeyDownActionsListener(a) || cvox.ChromeVoxEventWatcher.handleControlAction(a)) {
        return a.preventDefault(), a.stopPropagation(), cvox.ChromeVoxEventWatcher.eventToEat = a, !1
    }
    cvox.ChromeVoxEventWatcher.addEvent(a);
    return !0
};
cvox.ChromeVoxEventWatcher.keyUpEventWatcher = function (a) {
    91 == a.keyCode && (cvox.ChromeVox.searchKeyHeld = !1);
    return cvox.ChromeVoxEventWatcher.eventToEat && a.keyCode == cvox.ChromeVoxEventWatcher.eventToEat.keyCode ? (a.stopPropagation(), a.preventDefault(), !1) : !0
};
cvox.ChromeVoxEventWatcher.keyPressEventWatcher = function (a) {
    var b = document.location.href,
        c = cvox.TypingEcho.shouldSpeakChar(cvox.ChromeVox.typingEcho);
    "undefined" !== typeof cvox.ChromeVox.keyEcho[b] && (c = cvox.ChromeVox.keyEcho[b]);
    cvox.ChromeVoxEditableTextBase.eventTypingEcho && c && cvox.DomPredicates.editTextPredicate([document.activeElement]) && "password" !== document.activeElement.type && (b = (new Date).getTime(), 150 < b - cvox.ChromeVoxEventWatcher.lastKeypressTime && cvox.ChromeVox.tts.stop(), cvox.ChromeVoxEventWatcher.lastKeypressTime = b, cvox.ChromeVox.tts.speak(String.fromCharCode(a.charCode), 1, {
        relativeRate: 2
    }));
    cvox.ChromeVoxEventWatcher.addEvent(a);
    return cvox.ChromeVoxEventWatcher.eventToEat && a.keyCode == cvox.ChromeVoxEventWatcher.eventToEat.keyCode ? (a.preventDefault(), a.stopPropagation(), !1) : !0
};
cvox.ChromeVoxEventWatcher.changeEventWatcher = function (a) {
    cvox.ChromeVoxEventWatcher.addEvent(a);
    return !0
};
cvox.ChromeVoxEventWatcher.clipboardEventWatcher = function (a) {
    cvox.ChromeVox.tts.speak(cvox.ChromeVox.msgs.getMsg(a.type).toLowerCase());
    var b = "";
    switch (a.type) {
    case "paste":
        b = a.clipboardData.getData("text");
        break;
    case "copy":
        ;
    case "cut":
        b = window.getSelection().toString()
    }
    cvox.ChromeVox.tts.speak(b, cvox.AbstractTts.QUEUE_MODE_QUEUE);
    cvox.ChromeVox.navigationManager.clearPageSel();
    return !0
};
cvox.ChromeVoxEventWatcher.changeHandler = function (a) {
    cvox.ChromeVoxEventWatcher.setUpTextHandler() || document.activeElement == a.target && cvox.ChromeVoxEventWatcher.handleControlChanged(document.activeElement)
};
cvox.ChromeVoxEventWatcher.selectEventWatcher = function (a) {
    cvox.ChromeVoxEventWatcher.addEvent(a);
    return !0
};
cvox.ChromeVoxEventWatcher.subtreeModifiedEventWatcher = function (a) {
    if (!a || !a.target) {
        return !0
    }
    cvox.ChromeVoxEventWatcher.addEvent(a);
    return !0
};
cvox.ChromeVoxEventWatcher.visibilityChangeWatcher = function () {
    cvox.ChromeVoxEventWatcher.initialVisibility = !document.webkitHidden;
    document.webkitHidden && cvox.ChromeVox.navigationManager.stopReading(!0)
};
cvox.ChromeVoxEventWatcher.getInitialVisibility = function () {
    var a = cvox.ChromeVoxEventWatcher.initialVisibility;
    cvox.ChromeVoxEventWatcher.initialVisibility = !1;
    return a
};
cvox.ChromeVoxEventWatcher.speakLiveRegion_ = function (a, b) {
    var c = cvox.ChromeVoxEventWatcher.queueMode_();
    a || c != cvox.AbstractTts.QUEUE_MODE_FLUSH || (c = cvox.AbstractTts.QUEUE_MODE_QUEUE);
    (new cvox.NavigationSpeaker).speakDescriptionArray(b, c, null)
};
cvox.ChromeVoxEventWatcher.subtreeModifiedHandler = function (a) {
    var b = (new Date).getTime();
    if (cvox.ChromeVoxEventWatcher.lastSubtreeModifiedEventBurstTime_ + cvox.ChromeVoxEventWatcher.SUBTREE_MODIFIED_BURST_DURATION_ > b) {
        if (cvox.ChromeVoxEventWatcher.subtreeModifiedEventsCount_++, cvox.ChromeVoxEventWatcher.subtreeModifiedEventsCount_ > cvox.ChromeVoxEventWatcher.SUBTREE_MODIFIED_BURST_COUNT_LIMIT_) {
            return
        }
    } else {
        cvox.ChromeVoxEventWatcher.lastSubtreeModifiedEventBurstTime_ = b, cvox.ChromeVoxEventWatcher.subtreeModifiedEventsCount_ = 1
    }
    if (a && a.target) {
        for (a = cvox.AriaUtil.getLiveRegions(a.target), b = 0; b < a.length && b < cvox.ChromeVoxEventWatcher.MAX_LIVE_REGIONS_; b++) {
            cvox.LiveRegionsDeprecated.updateLiveRegion(a[b], cvox.ChromeVoxEventWatcher.queueMode_(), !1)
        }
    }
};
cvox.ChromeVoxEventWatcher.setUpTextHandler = function () {
    var a = document.activeElement;
    a && a.hasAttribute && "true" == a.getAttribute("aria-hidden") && "true" != a.getAttribute("chromevoxignoreariahidden") && (a = null);
    if (a != cvox.ChromeVoxEventWatcher.currentTextControl) {
        cvox.ChromeVoxEventWatcher.currentTextControl && (cvox.ChromeVoxEventWatcher.currentTextControl.removeEventListener("input", cvox.ChromeVoxEventWatcher.changeEventWatcher, !1), cvox.ChromeVoxEventWatcher.currentTextControl.removeEventListener("click", cvox.ChromeVoxEventWatcher.changeEventWatcher, !1), cvox.ChromeVoxEventWatcher.textMutationObserver_ && (cvox.ChromeVoxEventWatcher.textMutationObserver_.disconnect(), cvox.ChromeVoxEventWatcher.textMutationObserver_ = null));
        cvox.ChromeVoxEventWatcher.currentTextControl = null;
        cvox.ChromeVoxEventWatcher.currentTextHandler = null;
        if (null == a) {
            return !1
        }
        if (a.constructor == HTMLInputElement && cvox.DomUtil.isInputTypeText(a) && cvox.ChromeVoxEventWatcher.shouldEchoKeys) {
            cvox.ChromeVoxEventWatcher.currentTextControl = a, cvox.ChromeVoxEventWatcher.currentTextHandler = new cvox.ChromeVoxEditableHTMLInput(a, cvox.ChromeVox.tts)
        } else {
            if (a.constructor == HTMLTextAreaElement && cvox.ChromeVoxEventWatcher.shouldEchoKeys) {
                cvox.ChromeVoxEventWatcher.currentTextControl = a, cvox.ChromeVoxEventWatcher.currentTextHandler = new cvox.ChromeVoxEditableTextArea(a, cvox.ChromeVox.tts)
            } else {
                if (a.isContentEditable || "textbox" == a.getAttribute("role")) {
                    cvox.ChromeVoxEventWatcher.currentTextControl = a, cvox.ChromeVoxEventWatcher.currentTextHandler = new cvox.ChromeVoxEditableContentEditable(a, cvox.ChromeVox.tts)
                }
            }
        }
        cvox.ChromeVoxEventWatcher.currentTextControl && (cvox.ChromeVoxEventWatcher.currentTextControl.addEventListener("input", cvox.ChromeVoxEventWatcher.changeEventWatcher, !1), cvox.ChromeVoxEventWatcher.currentTextControl.addEventListener("click", cvox.ChromeVoxEventWatcher.changeEventWatcher, !1), window.WebKitMutationObserver && (cvox.ChromeVoxEventWatcher.textMutationObserver_ = new WebKitMutationObserver(cvox.ChromeVoxEventWatcher.onTextMutation), cvox.ChromeVoxEventWatcher.textMutationObserver_.observe(cvox.ChromeVoxEventWatcher.currentTextControl, {
            childList: !0,
            attributes: !0,
            subtree: !0,
            attributeOldValue: !1,
            characterDataOldValue: !1
        })), cvox.ChromeVoxEventSuspender.areEventsSuspended() || cvox.ChromeVox.navigationManager.updateSel(cvox.CursorSelection.fromNode(cvox.ChromeVoxEventWatcher.currentTextControl)));
        return null != cvox.ChromeVoxEventWatcher.currentTextHandler
    }
};
cvox.ChromeVoxEventWatcher.handleTextChanged = function (a) {
    return cvox.ChromeVoxEventWatcher.currentTextHandler ? (cvox.ChromeVoxEventWatcher.currentTextHandler.update(a), !0) : !1
};
cvox.ChromeVoxEventWatcher.onTextMutation = function () {
    cvox.ChromeVoxEventWatcher.currentTextHandler && window.setTimeout(function () {
        cvox.ChromeVoxEventWatcher.handleTextChanged(!1)
    }, cvox.ChromeVoxEventWatcher.MAX_WAIT_TIME_MS_)
};
cvox.ChromeVoxEventWatcher.handleControlChanged = function (a) {
    var b = cvox.DomUtil.getControlValueAndStateString(a),
        c = cvox.DomUtil.getSurroundingControl(a),
        d = !1;
    if (a != cvox.ChromeVoxEventWatcher.lastFocusedNode && (null == c || c != cvox.ChromeVoxEventWatcher.lastFocusedNode)) {
        cvox.ChromeVoxEventWatcher.setLastFocusedNode_(a)
    } else {
        if (b == cvox.ChromeVoxEventWatcher.lastFocusedNodeValue) {
            return
        }
    }
    cvox.ChromeVoxEventWatcher.lastFocusedNodeValue = b;
    if (cvox.DomPredicates.checkboxPredicate([a]) || cvox.DomPredicates.radioPredicate([a])) {
        d = !0, a.checked ? cvox.ChromeVox.earcons.playEarcon(cvox.AbstractEarcons.CHECK_ON) : cvox.ChromeVox.earcons.playEarcon(cvox.AbstractEarcons.CHECK_OFF)
    }
    "SELECT" == a.tagName && (d = !0);
    if ("INPUT" == a.tagName) {
        switch (a.type) {
        case "color":
            ;
        case "datetime":
            ;
        case "datetime-local":
            ;
        case "range":
            d = !0
        }
    }
    a.hasAttribute && a.hasAttribute("role") && (d = !0);
    c && c != a && document.activeElement == a ? (cvox.ApiImplementation.syncToNode(a, !0, cvox.AbstractTts.QUEUE_MODE_FLUSH), d = !1) : cvox.AriaUtil.getActiveDescendant(a) && (cvox.ChromeVox.navigationManager.updateSelToArbitraryNode(cvox.AriaUtil.getActiveDescendant(a), !0), d = !0);
    d && !cvox.ChromeVoxEventSuspender.areEventsSuspended() && (cvox.ChromeVox.tts.speak(b, cvox.ChromeVoxEventWatcher.queueMode_(), null), cvox.NavBraille.fromText(b).write())
};
cvox.ChromeVoxEventWatcher.handleControlAction = function (a) {
    if (!cvox.ChromeVox.isActive) {
        return !1
    }
    var b = a.target;
    if ("SELECT" == b.tagName && 1 >= b.size && (13 == a.keyCode || 32 == a.keyCode)) {
        return a.preventDefault(), a.stopPropagation(), !0
    }
    if ("INPUT" == b.tagName && "range" == b.type) {
        var c = parseFloat(b.value),
            d;
        b.step && 0 < b.step ? d = b.step : b.min && b.max ? (d = b.max - b.min, d = 2 < d && 31 > d ? 1 : (b.max - b.min) / 10) : d = 1;
        if (37 == a.keyCode || 38 == a.keyCode) {
            c -= d
        } else {
            if (39 == a.keyCode || 40 == a.keyCode) {
                c += d
            }
        }
        b.max && c > b.max && (c = b.max);
        b.min && c < b.min && (c = b.min);
        b.value = c
    }
    return !1
};
cvox.ChromeVoxEventWatcher.handleDialogFocus = function (a) {
    for (; a;) {
        if (a.hasAttribute) {
            var b = a.getAttribute("role");
            if ("dialog" == b || "alertdialog" == b) {
                break
            }
        }
        a = a.parentElement
    }
    if (a == cvox.ChromeVox.navigationManager.currentDialog) {
        return !1
    }
    if (cvox.ChromeVox.navigationManager.currentDialog && !a) {
        if (!cvox.DomUtil.isDescendantOfNode(document.activeElement, cvox.ChromeVox.navigationManager.currentDialog)) {
            return cvox.ChromeVox.navigationManager.currentDialog = null, cvox.ChromeVox.tts.speak(cvox.ChromeVox.msgs.getMsg("exiting_dialog"), cvox.AbstractTts.QUEUE_MODE_FLUSH, cvox.AbstractTts.PERSONALITY_ANNOTATION), !0
        }
    } else {
        if (a) {
            return cvox.ChromeVox.navigationManager.currentDialog = a, cvox.ChromeVox.tts.speak(cvox.ChromeVox.msgs.getMsg("entering_dialog"), cvox.AbstractTts.QUEUE_MODE_FLUSH, cvox.AbstractTts.PERSONALITY_ANNOTATION), a = cvox.DescriptionUtil.getFullDescriptionsFromChildren(null, a), (new cvox.NavigationSpeaker).speakDescriptionArray(a, cvox.AbstractTts.QUEUE_MODE_QUEUE, null), !0
        }
    }
    return !1
};
cvox.ChromeVoxEventWatcherUtil.shouldWaitToProcess = function (a, b, c) {
    return c - a < cvox.ChromeVoxEventWatcher.WAIT_TIME_MS_ && c - b < cvox.ChromeVoxEventWatcher.MAX_WAIT_TIME_MS_
};
cvox.ChromeVoxEventWatcher.queueMode_ = function () {
    return cvox.ChromeVoxEventWatcher.processing_ ? cvox.AbstractTts.QUEUE_MODE_QUEUE : cvox.AbstractTts.QUEUE_MODE_FLUSH
};
cvox.ChromeVoxEventWatcher.processQueue_ = function () {
    if (0 != cvox.ChromeVoxEventWatcher.events_.length) {
        var a = cvox.ChromeVoxEventWatcher.events_,
            b = -1,
            c = 0,
            d, e;
        for (e = 0; d = a[e]; e++) {
            "focus" == d.type && (b = e, c = d.timeStamp)
        }
        cvox.ChromeVoxEventWatcher.events_ = [];
        for (e = 0; d = a[e]; e++) {
            var f = a[e - 1] || {};
            !(e >= b || "LiveRegion" == d.type || "DOMSubtreeModified" == d.type) || "focus" == f.type && "change" == d.type || cvox.ChromeVoxEventWatcher.events_.push(d)
        }
        cvox.ChromeVoxEventWatcher.events_.sort(function (a, b) {
            return "LiveRegion" != b.type && "LiveRegion" == a.type || "DOMSubtreeModified" != b.type && "DOMSubtreeModified" == a.type ? 1 : -1
        });
        a = (new Date).getTime();
        if (0 <= b && cvox.ChromeVoxEventWatcherUtil.shouldWaitToProcess(c, cvox.ChromeVoxEventWatcher.firstUnprocessedEventTime, a)) {
            window.setTimeout(cvox.ChromeVoxEventWatcher.processQueue_, cvox.ChromeVoxEventWatcher.WAIT_TIME_MS_)
        } else {
            for (e = 0; d = cvox.ChromeVoxEventWatcher.events_[e]; e++) {
                cvox.ChromeVoxEventWatcher.handleEvent_(d), cvox.ChromeVoxEventWatcher.processing_ = !0
            }
            cvox.ChromeVoxEventWatcher.processing_ = !1;
            cvox.ChromeVoxEventWatcher.events_ = [];
            cvox.ChromeVoxEventWatcher.firstUnprocessedEventTime = -1;
            cvox.ChromeVoxEventWatcher.queueProcessingScheduled_ = !1;
            cvox.ChromeVoxEventWatcher.maybeCallReadyCallbacks_()
        }
    }
};
cvox.ChromeVoxEventWatcher.handleEvent_ = function (a) {
    switch (a.type) {
    case "keydown":
        cvox.ChromeVoxEventWatcher.setUpTextHandler();
        if (cvox.ChromeVoxEventWatcher.currentTextControl && (cvox.ChromeVoxEventWatcher.handleTextChanged(!0), (a = cvox.ChromeVoxEventWatcher.currentTextHandler) && a.lastChangeDescribed)) {
            break
        }
        cvox.ChromeVoxEventWatcher.handleControlChanged(document.activeElement);
        break;
    case "keypress":
        cvox.ChromeVoxEventWatcher.setUpTextHandler();
        break;
    case "focus":
        cvox.ChromeVoxEventWatcher.focusHandler(a);
        break;
    case "blur":
        cvox.ChromeVoxEventWatcher.setUpTextHandler();
        break;
    case "change":
        cvox.ChromeVoxEventWatcher.changeHandler(a);
        break;
    case "select":
        cvox.ChromeVoxEventWatcher.setUpTextHandler();
        break;
    case "LiveRegion":
        cvox.ChromeVoxEventWatcher.speakLiveRegion_(a.assertive, a.navDescriptions);
        break;
    case "DOMSubtreeModified":
        cvox.ChromeVoxEventWatcher.subtreeModifiedHandler(a)
    }
};
cvox.ChromeVoxEventWatcher.setUpTimeHandler_ = function () {
    var a = document.activeElement;
    a && a.hasAttribute && "true" == a.getAttribute("aria-hidden") && "true" != a.getAttribute("chromevoxignoreariahidden") && (a = null);
    cvox.ChromeVoxEventWatcher.currentTimeHandler = a.constructor == HTMLInputElement && a.type && "time" == a.type ? new cvox.ChromeVoxHTMLTimeWidget(a, cvox.ChromeVox.tts) : null;
    return null != cvox.ChromeVoxEventWatcher.currentTimeHandler
};
cvox.ChromeVoxEventWatcher.setUpMediaHandler_ = function () {
    var a = document.activeElement;
    a && a.hasAttribute && "true" == a.getAttribute("aria-hidden") && "true" != a.getAttribute("chromevoxignoreariahidden") && (a = null);
    cvox.ChromeVoxEventWatcher.currentMediaHandler = a.constructor == HTMLVideoElement || a.constructor == HTMLAudioElement ? new cvox.ChromeVoxHTMLMediaWidget(a, cvox.ChromeVox.tts) : null;
    return null != cvox.ChromeVoxEventWatcher.currentMediaHandler
};
cvox.ChromeVoxEventWatcher.setUpDateHandler_ = function () {
    var a = document.activeElement;
    a && a.hasAttribute && "true" == a.getAttribute("aria-hidden") && "true" != a.getAttribute("chromevoxignoreariahidden") && (a = null);
    cvox.ChromeVoxEventWatcher.currentDateHandler = a.constructor != HTMLInputElement || !a.type || "date" != a.type && "month" != a.type && "week" != a.type ? null : new cvox.ChromeVoxHTMLDateWidget(a, cvox.ChromeVox.tts);
    return null != cvox.ChromeVoxEventWatcher.currentDateHandler
};
