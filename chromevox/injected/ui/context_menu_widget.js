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

var CONTEXT_MENU_ATTR = "contextMenuActions",
    extractMenuList_ = function (a) {
        for (; a !== document;) {
            var b = a.getAttribute(CONTEXT_MENU_ATTR);
            if (b) {
                return JSON.parse(b)
            }
            a = a.parentNode
        }
        return null
    }, getCurrentElement_ = function () {
        for (var a = cvox.ChromeVox.navigationManager.getCurrentNode(); a.nodeType !== Node.ELEMENT_NODE;) {
            a = a.parentNode
        }
        return a
    };
cvox.ContextMenuWidget = function () {
    cvox.OverlayWidget.call(this, "");
    this.container_ = document.createElement("div");
    this.triggerElement_ = getCurrentElement_();
    (this.menuList = extractMenuList_(this.triggerElement_)) ? this.menuList.forEach(goog.bind(function (a) {
        if (a.desc || a.cmd) {
            var b = a.desc;
            a = a.cmd;
            var c = document.createElement("p");
            c.id = a;
            c.textContent = b;
            c.setAttribute("role", "menuitem");
            this.container_.appendChild(c)
        }
    }, this)) : console.log("No context menu found.")
};
goog.inherits(cvox.ContextMenuWidget, cvox.OverlayWidget);
cvox.ContextMenuWidget.prototype.show = function () {
    this.menuList && (cvox.ContextMenuWidget.superClass_.show.call(this), this.host_.appendChild(this.container_))
};
cvox.ContextMenuWidget.prototype.getNameMsg = function () {
    return ["context_menu_intro"]
};
cvox.ContextMenuWidget.prototype.onKeyDown = function (a) {
    if (13 == a.keyCode) {
        var b = cvox.ChromeVox.navigationManager.getCurrentNode().parentNode.id,
            b = (new cvox.UserEventDetail({
                customCommand: b
            })).createEventObject();
        this.triggerElement_.dispatchEvent(b);
        this.hide();
        a.preventDefault();
        a.stopPropagation();
        return !0
    }
    return cvox.ContextMenuWidget.superClass_.onKeyDown.call(this, a)
};
