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

cvox.ChromeVoxUserCommands = {};
cvox.ChromeVoxUserCommands.init_ = function () {
    if (!cvox.ChromeVoxUserCommands.commands) {
        cvox.ChromeVoxUserCommands.commands = {};
        for (var a in cvox.CommandStore.CMD_WHITELIST) {
            cvox.ChromeVoxUserCommands.commands[a] = cvox.ChromeVoxUserCommands.createCommand_(a)
        }
    }
};
cvox.ChromeVoxUserCommands.wasMouseClicked = !1;
cvox.ChromeVoxUserCommands.enableCommandDispatchingToPage = !0;
cvox.ChromeVoxUserCommands.handleTabAction_ = function () {
    cvox.ChromeVox.tts.stop();
    if (!cvox.ChromeVox.navigationManager.resolve(cvox.DomUtil.isFocusable)) {
        return cvox.ChromeVox.navigationManager.setFocus(), !1
    }
    if (cvox.ChromeVoxUserCommands.isFocusedOnLinkControl_()) {
        return !0
    }
    var a = null,
        b = null,
        b = window.getSelection();
    cvox.ChromeVoxUserCommands.wasMouseClicked ? cvox.ChromeVoxUserCommands.wasMouseClicked = !1 : b = null;
    null == b || null == b.anchorNode || null == b.focusNode ? (a = cvox.ChromeVox.navigationManager.getCurrentNode(), b = cvox.ChromeVox.navigationManager.getCurrentNode()) : (a = b.anchorNode, b = b.focusNode);
    if (null == a || null == b) {
        return !0
    }
    if (cvox.DomUtil.isFocusable(a)) {
        return a.focus(), !0
    }
    if (cvox.DomUtil.isFocusable(b)) {
        return b.focus(), !0
    }
    if (cvox.DomUtil.isFocusable(a.parentNode)) {
        return a.parentNode.focus(), !0
    }
    if (cvox.DomUtil.isFocusable(b.parentNode)) {
        return b.parentNode.focus(), !0
    }
    b = cvox.ChromeVoxUserCommands.createTabDummySpan_();
    a.parentNode.insertBefore(b, a);
    b.focus();
    return !0
};
cvox.ChromeVoxUserCommands.isFocusedOnLinkControl_ = function () {
    return "A" == document.activeElement.tagName || cvox.DomUtil.isControl(document.activeElement) ? !0 : !1
};
cvox.ChromeVoxUserCommands.removeTabDummySpan = function () {
    var a = document.getElementById("ChromeVoxTabDummySpan");
    a && document.activeElement != a && a.parentNode.removeChild(a)
};
cvox.ChromeVoxUserCommands.createTabDummySpan_ = function () {
    var a = document.createElement("span");
    a.id = "ChromeVoxTabDummySpan";
    a.tabIndex = -1;
    return a
};
cvox.ChromeVoxUserCommands.createCommand_ = function (a) {
    return goog.bind(function (b) {
        b = cvox.ChromeVoxUserCommands.lookupCommand_(a, b);
        return cvox.ChromeVoxUserCommands.dispatchCommand_(b)
    }, cvox.ChromeVoxUserCommands)
};
cvox.ChromeVoxUserCommands.dispatchCommand_ = function (a) {
    if (cvox.Widget.isActive() || !cvox.PlatformUtil.matchesPlatform(a.platformFilter) || a.skipInput && cvox.FocusUtil.isFocusInTextInputField()) {
        return !0
    }
    if (cvox.ChromeVoxUserCommands.enableCommandDispatchingToPage && -1 != cvox.UserEventDetail.JUMP_COMMANDS.indexOf(a.command)) {
        a = (new cvox.UserEventDetail({
            command: a.command
        })).createEventObject();
        var b = cvox.ChromeVox.navigationManager.getCurrentNode();
        b || (b = document.body);
        b.dispatchEvent(a);
        return !1
    }
    return cvox.ChromeVoxUserCommands.doCommand_(a)
};
cvox.ChromeVoxUserCommands.doCommand_ = function (a) {
    if (cvox.Widget.isActive() || !cvox.PlatformUtil.matchesPlatform(a.platformFilter) || a.skipInput && cvox.FocusUtil.isFocusInTextInputField() || !a.allowOOBE && document.URL.match(/^chrome:\/\/oobe/i)) {
        return !0
    }
    var b = a.command;
    a.allowEvents || cvox.ChromeVoxEventSuspender.enterSuspendEvents();
    a.disallowContinuation && cvox.ChromeVox.navigationManager.stopReading(!0);
    a.forward ? cvox.ChromeVox.navigationManager.setReversed(!1) : a.backward && cvox.ChromeVox.navigationManager.setReversed(!0);
    a.findNext && (b = "find", a.announce = !0);
    var c = "",
        d = "",
        e = !1;
    switch (b) {
    case "handleTab":
        ;
    case "handleTabPrev":
        e = cvox.ChromeVoxUserCommands.handleTabAction_();
        break;
    case "forward":
        ;
    case "backward":
        e = !cvox.ChromeVox.navigationManager.navigate();
        break;
    case "right":
        ;
    case "left":
        cvox.ChromeVox.navigationManager.subnavigate();
        break;
    case "find":
        if (!a.findNext) {
            throw "Invalid find command.";
        }
        var f = cvox.CommandStore.NODE_INFO_MAP[a.findNext],
            g = f.predicate,
            h = cvox.DomPredicates[g],
            k = "",
            l = "";
        a.forward ? (l = cvox.ChromeVox.msgs.getMsg("wrapped_to_top"), k = cvox.ChromeVox.msgs.getMsg(f.forwardError)) : a.backward && (l = cvox.ChromeVox.msgs.getMsg("wrapped_to_bottom"), k = cvox.ChromeVox.msgs.getMsg(f.backwardError));
        var f = null,
            m = a.resultNode || null;
        switch (a.status || cvox.UserEventDetail.Status.PENDING) {
        case cvox.UserEventDetail.Status.SUCCESS:
            m && cvox.ChromeVox.navigationManager.updateSelToArbitraryNode(m, !0);
            break;
        case cvox.UserEventDetail.Status.FAILURE:
            d = k;
            break;
        default:
            f = cvox.ChromeVox.navigationManager.findNext(h, g), f || (cvox.ChromeVox.navigationManager.saveSel(), d = l, cvox.ChromeVox.navigationManager.syncToBeginning(), cvox.ChromeVox.earcons.playEarcon(cvox.AbstractEarcons.WRAP), f = cvox.ChromeVox.navigationManager.findNext(h, g, !0), f || (d = k, cvox.ChromeVox.navigationManager.restoreSel()))
        }
        f && "IFRAME" == f.start.node.tagName && (a.announce = !1);
        break;
    case "previousGranularity":
        cvox.ChromeVox.navigationManager.makeLessGranular(!0);
        d = cvox.ChromeVox.navigationManager.getGranularityMsg();
        break;
    case "nextGranularity":
        cvox.ChromeVox.navigationManager.makeMoreGranular(!0);
        d = cvox.ChromeVox.navigationManager.getGranularityMsg();
        break;
    case "previousCharacter":
        cvox.ChromeVox.navigationManager.navigate(!1, cvox.NavigationShifter.GRANULARITIES.CHARACTER);
        break;
    case "nextCharacter":
        cvox.ChromeVox.navigationManager.navigate(!1, cvox.NavigationShifter.GRANULARITIES.CHARACTER);
        break;
    case "previousWord":
        cvox.ChromeVox.navigationManager.navigate(!1, cvox.NavigationShifter.GRANULARITIES.WORD);
        break;
    case "nextWord":
        cvox.ChromeVox.navigationManager.navigate(!1, cvox.NavigationShifter.GRANULARITIES.WORD);
        break;
    case "previousSentence":
        cvox.ChromeVox.navigationManager.navigate(!1, cvox.NavigationShifter.GRANULARITIES.SENTENCE);
        break;
    case "nextSentence":
        cvox.ChromeVox.navigationManager.navigate(!1, cvox.NavigationShifter.GRANULARITIES.SENTENCE);
        break;
    case "previousLine":
        cvox.ChromeVox.navigationManager.navigate(!1, cvox.NavigationShifter.GRANULARITIES.LINE);
        break;
    case "nextLine":
        cvox.ChromeVox.navigationManager.navigate(!1, cvox.NavigationShifter.GRANULARITIES.LINE);
        break;
    case "previousObject":
        cvox.ChromeVox.navigationManager.navigate(!1, cvox.NavigationShifter.GRANULARITIES.OBJECT);
        break;
    case "nextObject":
        cvox.ChromeVox.navigationManager.navigate(!1, cvox.NavigationShifter.GRANULARITIES.OBJECT);
        break;
    case "previousGroup":
        cvox.ChromeVox.navigationManager.navigate(!1, cvox.NavigationShifter.GRANULARITIES.GROUP);
        break;
    case "nextGroup":
        cvox.ChromeVox.navigationManager.navigate(!1, cvox.NavigationShifter.GRANULARITIES.GROUP);
        break;
    case "previousRow":
        ;
    case "previousCol":
        b = "previousRow" == b ? "nextRow" : "nextCol";
    case "nextRow":
        ;
    case "nextCol":
        cvox.ChromeVox.navigationManager.performAction("enterShifterSilently");
        cvox.ChromeVox.navigationManager.performAction(b);
        break;
    case "moveToStartOfLine":
        ;
    case "moveToEndOfLine":
        cvox.ChromeVox.navigationManager.setGranularity(cvox.NavigationShifter.GRANULARITIES.LINE);
        cvox.ChromeVox.navigationManager.sync();
        cvox.ChromeVox.navigationManager.collapseSelection();
        break;
    case "readFromHere":
        cvox.ChromeVox.navigationManager.setGranularity(cvox.NavigationShifter.GRANULARITIES.OBJECT, !0, !0);
        cvox.ChromeVox.navigationManager.startReading(cvox.AbstractTts.QUEUE_MODE_FLUSH);
        break;
    case "cycleTypingEcho":
        cvox.ChromeVox.host.sendToBackgroundPage({
            target: "Prefs",
            action: "setPref",
            pref: "typingEcho",
            value: cvox.TypingEcho.cycle(cvox.ChromeVox.typingEcho),
            announce: !0
        });
        break;
    case "jumpToTop":
        ;
    case cvox.BrailleKeyCommand.TOP:
        cvox.ChromeVox.navigationManager.syncToBeginning();
        break;
    case "jumpToBottom":
        ;
    case cvox.BrailleKeyCommand.BOTTOM:
        cvox.ChromeVox.navigationManager.syncToBeginning();
        break;
    case "stopSpeech":
        cvox.ChromeVox.navigationManager.stopReading(!0);
        break;
    case "toggleKeyboardHelp":
        cvox.KeyboardHelpWidget.getInstance().toggle();
        break;
    case "help":
        cvox.ChromeVox.tts.stop();
        cvox.ChromeVox.host.sendToBackgroundPage({
            target: "HelpDocs",
            action: "open"
        });
        break;
    case "contextMenu":
        g = cvox.ChromeVox.navigationManager.getCurrentNode();
        "SELECT" != g.tagName || g.multiple ? (new cvox.ContextMenuWidget).toggle() : (new cvox.SelectWidget(g)).show();
        break;
    case "showBookmarkManager":
        cvox.ChromeVox.host.sendToBackgroundPage({
            target: "BookmarkManager",
            action: "open"
        });
        break;
    case "showOptionsPage":
        cvox.ChromeVox.tts.stop();
        cvox.ChromeVox.host.sendToBackgroundPage({
            target: "Options",
            action: "open"
        });
        break;
    case "showKbExplorerPage":
        cvox.ChromeVox.tts.stop();
        cvox.ChromeVox.host.sendToBackgroundPage({
            target: "KbExplorer",
            action: "open"
        });
        break;
    case "readLinkURL":
        g = document.activeElement;
        h = window.getSelection().anchorNode;
        k = "";
        "A" == g.tagName ? k = cvox.DomUtil.getLinkURL(g) : h && (k = cvox.DomUtil.getLinkURL(h.parentNode));
        "" != k ? cvox.ChromeVox.tts.speak(k) : cvox.ChromeVox.tts.speak(cvox.ChromeVox.msgs.getMsg("no_url_found"));
        break;
    case "readCurrentTitle":
        cvox.ChromeVox.tts.speak(document.title);
        break;
    case "readCurrentURL":
        cvox.ChromeVox.tts.speak(document.URL);
        break;
    case "performDefaultAction":
        cvox.DomPredicates.linkPredicate([document.activeElement]) && (a.announce = !0, cvox.DomUtil.isInternalLink(document.activeElement) && (cvox.DomUtil.syncInternalLink(document.activeElement), cvox.ChromeVox.navigationManager.sync()));
        break;
    case "forceClickOnCurrentItem":
        d = cvox.ChromeVox.msgs.getMsg("element_clicked");
        g = cvox.ChromeVox.navigationManager.getCurrentNode();
        cvox.DomUtil.clickElem(g, !1, !1);
        break;
    case "forceDoubleClickOnCurrentItem":
        d = cvox.ChromeVox.msgs.getMsg("element_double_clicked");
        g = cvox.ChromeVox.navigationManager.getCurrentNode();
        cvox.DomUtil.clickElem(g, !1, !1, !0);
        break;
    case "toggleChromeVox":
        cvox.ChromeVox.host.sendToBackgroundPage({
            target: "Prefs",
            action: "setPref",
            pref: "active",
            value: !cvox.ChromeVox.isActive
        });
        break;
    case "fullyDescribe":
        g = cvox.ChromeVox.navigationManager.getFullDescription();
        cvox.ChromeVox.navigationManager.speakDescriptionArray(g, cvox.AbstractTts.QUEUE_MODE_FLUSH, null);
        break;
    case "speakTimeAndDate":
        g = new Date;
        cvox.ChromeVox.tts.speak(g.toLocaleTimeString() + ", " + g.toLocaleDateString());
        break;
    case "toggleSelection":
        d = cvox.ChromeVox.navigationManager.togglePageSel();
        d = cvox.ChromeVox.msgs.getMsg(d ? "begin_selection" : "end_selection");
        break;
    case "startHistoryRecording":
        cvox.History.getInstance().startRecording();
        break;
    case "stopHistoryRecording":
        cvox.History.getInstance().stopRecording();
        break;
    case "enableConsoleTts":
        cvox.ConsoleTts.getInstance().setEnabled(!0);
        break;
    case "goToFirstCell":
        ;
    case "goToLastCell":
        ;
    case "goToRowFirstCell":
        ;
    case "goToRowLastCell":
        ;
    case "goToColFirstCell":
        ;
    case "goToColLastCell":
        ;
    case "announceHeaders":
        ;
    case "speakTableLocation":
        ;
    case "exitShifterContent":
        cvox.DomPredicates.tablePredicate(cvox.DomUtil.getAncestors(cvox.ChromeVox.navigationManager.getCurrentNode())) && cvox.ChromeVox.navigationManager.performAction(b) || (c = "not_inside_table");
        break;
    case "enterShifter":
        ;
    case "exitShifter":
        cvox.ChromeVox.navigationManager.performAction(b);
        break;
    case "decreaseTtsRate":
        cvox.ChromeVox.tts.increaseOrDecreaseProperty(cvox.AbstractTts.RATE, !1);
        break;
    case "increaseTtsRate":
        cvox.ChromeVox.tts.increaseOrDecreaseProperty(cvox.AbstractTts.RATE, !0);
        break;
    case "decreaseTtsPitch":
        cvox.ChromeVox.tts.increaseOrDecreaseProperty(cvox.AbstractTts.PITCH, !1);
        break;
    case "increaseTtsPitch":
        cvox.ChromeVox.tts.increaseOrDecreaseProperty(cvox.AbstractTts.PITCH, !0);
        break;
    case "decreaseTtsVolume":
        cvox.ChromeVox.tts.increaseOrDecreaseProperty(cvox.AbstractTts.VOLUME, !1);
        break;
    case "increaseTtsVolume":
        cvox.ChromeVox.tts.increaseOrDecreaseProperty(cvox.AbstractTts.VOLUME, !0);
        break;
    case "cyclePunctuationEcho":
        cvox.ChromeVox.host.sendToBackgroundPage({
            target: "TTS",
            action: "cyclePunctuationEcho"
        });
        break;
    case "toggleStickyMode":
        cvox.ChromeVox.host.sendToBackgroundPage({
            target: "Prefs",
            action: "setPref",
            pref: "sticky",
            value: !cvox.ChromeVox.isStickyOn,
            announce: !0
        });
        break;
    case "toggleKeyPrefix":
        cvox.ChromeVox.keyPrefixOn = !cvox.ChromeVox.keyPrefixOn;
        break;
    case "toggleSearchWidget":
        cvox.SearchWidget.getInstance().toggle();
        break;
    case "toggleEarcons":
        d = cvox.ChromeVox.earcons.toggle() ? cvox.ChromeVox.msgs.getMsg("earcons_on") : cvox.ChromeVox.msgs.getMsg("earcons_off");
        break;
    case "showHeadingsList":
        ;
    case "showLinksList":
        ;
    case "showFormsList":
        ;
    case "showTablesList":
        ;
    case "showLandmarksList":
        if (!a.nodeList) {
            break
        }
        g = cvox.CommandStore.NODE_INFO_MAP[a.nodeList];
        cvox.NodeSearchWidget.create(g.typeMsg, cvox.DomPredicates[g.predicate]).show();
        break;
    case "openLongDesc":
        g = cvox.ChromeVox.navigationManager.getCurrentNode();
        cvox.DomUtil.hasLongDesc(g) ? cvox.ChromeVox.host.sendToBackgroundPage({
            target: "OpenTab",
            url: g.longDesc
        }) : cvox.ChromeVox.tts.speak(cvox.ChromeVox.msgs.getMsg("no_long_desc"), cvox.AbstractTts.QUEUE_MODE_FLUSH, cvox.AbstractTts.PERSONALITY_ANNOTATION);
        break;
    case "pauseAllMedia":
        k = document.getElementsByTagName("VIDEO");
        for (g = 0; h = k[g]; g++) {
            h.pause()
        }
        k = document.getElementsByTagName("AUDIO");
        for (g = 0; h = k[g]; g++) {
            h.pause()
        }
        break;
    case "toggleSemantics":
        cvox.TraverseMath.toggleSemantic() ? cvox.ChromeVox.tts.speak(cvox.ChromeVox.msgs.getMsg("semantics_on")) : cvox.ChromeVox.tts.speak(cvox.ChromeVox.msgs.getMsg("semantics_off"));
        break;
    case cvox.BrailleKeyCommand.ROUTING:
        g = cvox.ChromeVox.navigationManager.getBraille().text.getSpans(a.displayPosition || 0).filter(function (a) {
            return a instanceof Node
        })[0];
        cvox.DomUtil.clickElem(g || cvox.ChromeVox.navigationManager.getCurrentNode(), !1, !0);
        break;
    case cvox.BrailleKeyCommand.PAN_LEFT:
        ;
    case cvox.BrailleKeyCommand.LINE_UP:
        ;
    case cvox.BrailleKeyCommand.PAN_RIGHT:
        ;
    case cvox.BrailleKeyCommand.LINE_DOWN:
        cvox.ChromeVox.navigationManager.navigate(!1, cvox.NavigationShifter.GRANULARITIES.LINE);
        break;
    case "debug":
        break;
    case "nop":
        break;
    default:
        throw "Command behavior not defined: " + b;
    }
    "" != c ? cvox.ChromeVox.tts.speak(cvox.ChromeVox.msgs.getMsg(c), cvox.AbstractTts.QUEUE_MODE_FLUSH, cvox.AbstractTts.PERSONALITY_ANNOTATION) : cvox.ChromeVox.navigationManager.isReading() ? a.disallowContinuation ? cvox.ChromeVox.navigationManager.stopReading(!0) : "readFromHere" != b && cvox.ChromeVox.navigationManager.skip() : a.announce && cvox.ChromeVox.navigationManager.finishNavCommand(d);
    a.allowEvents || cvox.ChromeVoxEventSuspender.exitSuspendEvents();
    return !!a.doDefault || e
};
cvox.ChromeVoxUserCommands.handleChromeVoxUserEvent = function (a) {
    a = new cvox.UserEventDetail(a.detail);
    a.command && cvox.ChromeVoxUserCommands.doCommand_(cvox.ChromeVoxUserCommands.lookupCommand_(a.command, a))
};
cvox.ChromeVoxUserCommands.lookupCommand_ = function (a, b) {
    var c = cvox.CommandStore.CMD_WHITELIST[a];
    if (!c) {
        throw "Invalid command: " + a;
    }
    c = goog.object.clone(c);
    c.command = a;
    b && goog.object.extend(c, b);
    return c
};
cvox.ChromeVoxUserCommands.init_();
