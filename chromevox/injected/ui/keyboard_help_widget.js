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

cvox.KeyboardHelpWidget = function () {
    cvox.OverlayWidget.call(this, "");
    this.container_ = document.createElement("div");
    cvox.ChromeVoxKbHandler.handlerKeyMap.bindings().forEach(goog.bind(function (a) {
        var b = a.command;
        a = a.sequence;
        var c = b;
        try {
            var d = cvox.CommandStore.messageForCommand(b);
            if (!d) {
                return
            }
            c = cvox.ChromeVox.msgs.getMsg(d)
        } catch (e) {}
        d = document.createElement("p");
        d.id = b;
        d.setAttribute("role", "menuitem");
        d.textContent = c + " - " + cvox.KeyUtil.keySequenceToString(a, !0);
        this.container_.appendChild(d)
    }, this))
};
goog.inherits(cvox.KeyboardHelpWidget, cvox.OverlayWidget);
goog.addSingletonGetter(cvox.KeyboardHelpWidget);
cvox.KeyboardHelpWidget.prototype.show = function () {
    cvox.KeyboardHelpWidget.superClass_.show.call(this);
    this.host_.appendChild(this.container_)
};
cvox.KeyboardHelpWidget.prototype.getNameMsg = function () {
    return ["keyboard_help_intro"]
};
cvox.KeyboardHelpWidget.prototype.onKeyDown = function (a) {
    if (13 == a.keyCode) {
        var b = cvox.ChromeVox.navigationManager.getCurrentNode().parentNode.id;
        this.hide();
        cvox.ChromeVoxEventSuspender.withSuspendedEvents(cvox.ChromeVoxUserCommands.commands[b])();
        a.preventDefault();
        a.stopPropagation();
        return !0
    }
    return cvox.KeyboardHelpWidget.superClass_.onKeyDown.call(this, a)
};
