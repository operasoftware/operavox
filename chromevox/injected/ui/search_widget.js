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

cvox.SearchWidget = function () {
    this.txtNode_ = this.containerNode_ = null;
    this.PROMPT_ = "Search:";
    this.hasMatch_ = this.caseSensitive_ = !1;
    cvox.Widget.call(this)
};
goog.inherits(cvox.SearchWidget, cvox.Widget);
goog.addSingletonGetter(cvox.SearchWidget);
cvox.SearchWidget.prototype.show = function () {
    cvox.SearchWidget.superClass_.show.call(this);
    this.active = !0;
    this.hasMatch_ = !1;
    cvox.ChromeVox.navigationManager.setGranularity(cvox.NavigationShifter.GRANULARITIES.OBJECT, !0, !1);
    cvox.ChromeVox.navigationManager.setReversed(!1);
    this.focusRecovery_ = cvox.ChromeVox.navigationManager.getFocusRecovery();
    cvox.ChromeVox.navigationManager.setFocusRecovery(!1);
    var a = this.createContainerNode_();
    this.containerNode_ = a;
    var b = this.createOverlayNode_();
    a.appendChild(b);
    var c = document.createElement("span");
    c.innerHTML = this.PROMPT_;
    b.appendChild(c);
    this.txtNode_ = this.createTextAreaNode_();
    b.appendChild(this.txtNode_);
    document.body.appendChild(a);
    this.txtNode_.focus();
    window.setTimeout(function () {
        a.style.opacity = "1.0"
    }, 0)
};
cvox.SearchWidget.prototype.hide = function (a) {
    if (this.isActive()) {
        var b = this.containerNode_;
        b.style.opacity = "0.0";
        window.setTimeout(function () {
            document.body.removeChild(b)
        }, 1E3);
        this.txtNode_ = null;
        cvox.SearchWidget.containerNode = null;
        cvox.ChromeVox.navigationManager.setFocusRecovery(this.focusRecovery_);
        this.active = !1
    }
    cvox.$m("choice_widget_exited").andPause().andMessage(this.getNameMsg()).speakFlush();
    this.hasMatch_ && a || cvox.ChromeVox.navigationManager.updateSelToArbitraryNode(this.initialNode);
    cvox.ChromeVoxEventSuspender.withSuspendedEvents(goog.bind(cvox.ChromeVox.navigationManager.syncAll, cvox.ChromeVox.navigationManager))(!0);
    cvox.ChromeVox.navigationManager.speakDescriptionArray(cvox.ChromeVox.navigationManager.getDescription(), cvox.AbstractTts.QUEUE_MODE_QUEUE, null, cvox.AbstractTts.PERSONALITY_ANNOUNCEMENT);
    a = this.textFromCurrentDescription_();
    cvox.ChromeVox.braille.write(new cvox.NavBraille({
        text: a,
        startIndex: 0,
        endIndex: 0
    }));
    cvox.SearchWidget.superClass_.hide.call(this, !0)
};
cvox.SearchWidget.prototype.getNameMsg = function () {
    return ["search_widget_intro"]
};
cvox.SearchWidget.prototype.getHelpMsg = function () {
    return "search_widget_intro_help"
};
cvox.SearchWidget.prototype.onKeyDown = function (a) {
    if (!this.isActive()) {
        return !1
    }
    var b = this.txtNode_.value;
    if (8 == a.keyCode) {
        0 < b.length ? (b = b.substring(0, b.length - 1), this.txtNode_.value = b, this.beginSearch_(b)) : (cvox.ChromeVox.navigationManager.updateSelToArbitraryNode(this.initialNode), cvox.ChromeVox.navigationManager.syncAll())
    } else {
        if (40 == a.keyCode) {
            this.next_(b, !1)
        } else {
            if (38 == a.keyCode) {
                this.next_(b, !0)
            } else {
                if (13 == a.keyCode) {
                    this.hide(!0)
                } else {
                    if (27 == a.keyCode) {
                        this.hide(!1)
                    } else {
                        if (a.ctrlKey && 67 == a.keyCode) {
                            this.toggleCaseSensitivity_()
                        } else {
                            return cvox.SearchWidget.superClass_.onKeyDown.call(this, a)
                        }
                    }
                }
            }
        }
    }
    a.preventDefault();
    a.stopPropagation();
    return !0
};
cvox.SearchWidget.prototype.onKeyPress = function (a) {
    if (!this.isActive()) {
        return !1
    }
    this.txtNode_.value += String.fromCharCode(a.charCode);
    this.beginSearch_(this.txtNode_.value);
    a.preventDefault();
    a.stopPropagation();
    return !0
};
cvox.SearchWidget.prototype.onNavigate = function () {};
cvox.SearchWidget.prototype.getPredicate = function () {
    return null
};
cvox.SearchWidget.prototype.nextResult = function (a) {
    return this.isActive() ? this.next_(this.txtNode_.value, a) : null
};
cvox.SearchWidget.prototype.createContainerNode_ = function () {
    var a = document.createElement("div");
    a.id = "cvox-search";
    a.style.position = "fixed";
    a.style.top = "50%";
    a.style.left = "50%";
    a.style["-webkit-transition"] = "all 0.3s ease-in";
    a.style.opacity = "0.0";
    a.style["z-index"] = "2147483647";
    a.setAttribute("aria-hidden", "true");
    return a
};
cvox.SearchWidget.prototype.createOverlayNode_ = function () {
    var a = document.createElement("div");
    a.style.position = "relative";
    a.style.left = "-50%";
    a.style.top = "-40px";
    a.style["line-height"] = "1.2em";
    a.style["font-size"] = "20px";
    a.style.padding = "30px";
    a.style["min-width"] = "150px";
    a.style.color = "#fff";
    a.style["background-color"] = "rgba(0, 0, 0, 0.7)";
    a.style["border-radius"] = "10px";
    return a
};
cvox.SearchWidget.prototype.createTextAreaNode_ = function () {
    var a = document.createElement("textarea");
    a.setAttribute("aria-hidden", "true");
    a.setAttribute("rows", "1");
    a.style.color = "#fff";
    a.style["background-color"] = "rgba(0, 0, 0, 0.7)";
    a.style["vertical-align"] = "middle";
    a.addEventListener("textInput", this.handleSearchChanged_, !1);
    return a
};
cvox.SearchWidget.prototype.toggleCaseSensitivity_ = function () {
    this.caseSensitive_ ? (cvox.SearchWidget.caseSensitive_ = !1, cvox.ChromeVox.tts.speak("Ignoring case.", 0, null)) : (this.caseSensitive_ = !0, cvox.ChromeVox.tts.speak("Case sensitive.", 0, null))
};
cvox.SearchWidget.prototype.getNextResult_ = function (a) {
    var b = cvox.ChromeVox.navigationManager.isReversed();
    this.caseSensitive_ || (a = a.toLowerCase());
    cvox.ChromeVox.navigationManager.setGranularity(cvox.NavigationShifter.GRANULARITIES.OBJECT, !0, !1);
    do {
        if (!this.getPredicate() || this.getPredicate()(cvox.DomUtil.getAncestors(cvox.ChromeVox.navigationManager.getCurrentNode()))) {
            for (var c = cvox.ChromeVox.navigationManager.getDescription(), d = 0; d < c.length; d++) {
                var e = this.caseSensitive_ ? c[d].text : c[d].text.toLowerCase(),
                    f = e.indexOf(a); - 1 != f && e.length > a.length && (c[d].text = cvox.DomUtil.collapseWhitespace(e.substring(0, f)) + ", " + a + ", " + e.substring(f + a.length), c[d].text = cvox.DomUtil.collapseWhitespace(c[d].text));
                if (-1 != f) {
                    return c
                }
            }
            cvox.ChromeVox.navigationManager.setReversed(b)
        }
    } while (cvox.ChromeVox.navigationManager.navigate(!0, cvox.NavigationShifter.GRANULARITIES.OBJECT))
};
cvox.SearchWidget.prototype.beginSearch_ = function (a) {
    var b = this.getNextResult_(a);
    this.outputSearchResult_(b, a);
    this.onNavigate()
};
cvox.SearchWidget.prototype.next_ = function (a, b) {
    cvox.ChromeVox.navigationManager.setReversed( !! b);
    var c = !1;
    this.getPredicate() ? (c = cvox.ChromeVox.navigationManager.findNext(this.getPredicate()), cvox.ChromeVox.navigationManager.setReversed( !! b), c || (cvox.ChromeVox.navigationManager.syncToBeginning(), cvox.ChromeVox.earcons.playEarcon(cvox.AbstractEarcons.WRAP), c = !0)) : c = cvox.ChromeVox.navigationManager.navigate(!0);
    c = c ? this.getNextResult_(a) : null;
    this.outputSearchResult_(c, a);
    this.onNavigate();
    return c
};
cvox.SearchWidget.prototype.outputSearchResult_ = function (a, b) {
    cvox.ChromeVox.tts.stop();
    a ? (this.hasMatch_ = !0, cvox.ChromeVoxEventSuspender.withSuspendedEvents(goog.bind(cvox.ChromeVox.navigationManager.syncAll, cvox.ChromeVox.navigationManager))(!0), cvox.ChromeVox.navigationManager.speakDescriptionArray(a, cvox.AbstractTts.QUEUE_MODE_FLUSH, null, cvox.AbstractTts.PERSONALITY_ANNOUNCEMENT), cvox.ChromeVox.tts.speak(cvox.ChromeVox.msgs.getMsg("search_help_item"), cvox.AbstractTts.QUEUE_MODE_QUEUE, cvox.AbstractTts.PERSONALITY_ANNOTATION), this.outputSearchResultToBraille_(b)) :
        (cvox.ChromeVox.earcons.playEarcon(cvox.AbstractEarcons.WRAP), this.hasMatch_ = !1)
};
cvox.SearchWidget.prototype.outputSearchResultToBraille_ = function (a) {
    if (cvox.ChromeVox.braille) {
        var b = this.textFromCurrentDescription_(),
            c = this.caseSensitive_ ? b : b.toLowerCase();
        a = this.caseSensitive_ ? a : a.toLowerCase();
        c = c.indexOf(a);
        if (-1 == c) {
            console.log("Search string not in result when preparing for Braille.")
        } else {
            var d = b.length,
                b = cvox.ChromeVox.msgs.getMsg("mark_as_search_result_brl", [b]),
                c = c + (b.length - d);
            cvox.ChromeVox.braille.write(new cvox.NavBraille({
                text: b,
                startIndex: c + a.length,
                endIndex: c + a.length
            }))
        }
    }
};
cvox.SearchWidget.prototype.textFromCurrentDescription_ = function () {
    for (var a = cvox.ChromeVox.navigationManager.getDescription(), b = "", c = 0; c < a.length; c++) {
        b += a[c].text + " "
    }
    return b
};
cvox.SearchWidget.prototype.handleSearchChanged_ = function (a) {
    cvox.SearchWidget.prototype.beginSearch_(a.target.value + a.data)
};
