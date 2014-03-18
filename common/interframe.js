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

cvox.Interframe = function () {};
cvox.Interframe.IF_MSG_PREFIX = "cvox.INTERFRAME:";
cvox.Interframe.SET_ID = "cvox.INTERFRAME_SET_ID";
cvox.Interframe.listeners = [];
cvox.Interframe.allowAccessToIframeContentWindow = !0;
cvox.Interframe.init = function () {
    cvox.Interframe.messageListener = function (a) {
        if ("string" === typeof a.data && 0 == a.data.indexOf(cvox.Interframe.IF_MSG_PREFIX)) {
            a = a.data.substr(cvox.Interframe.IF_MSG_PREFIX.length);
            a = cvox.ChromeVoxJSON.parse(a);
            a.command == cvox.Interframe.SET_ID && (cvox.Interframe.id = a.id);
            for (var b = 0, c; c = cvox.Interframe.listeners[b]; b++) {
                c(a)
            }
        }
        return !1
    };
    window.addEventListener("message", cvox.Interframe.messageListener, !0)
};
cvox.Interframe.shutdown = function () {
    window.removeEventListener("message", cvox.Interframe.messageListener, !0)
};
cvox.Interframe.addListener = function (a) {
    cvox.Interframe.listeners.push(a)
};
cvox.Interframe.sendMessageToWindow = function (a, b) {
    var c = cvox.Interframe.IF_MSG_PREFIX + cvox.ChromeVoxJSON.stringify(a, null, null);
    b.postMessage(c, "*")
};
cvox.Interframe.sendMessageToIFrame = function (a, b) {
    if (cvox.Interframe.allowAccessToIframeContentWindow && b.contentWindow) {
        cvox.Interframe.sendMessageToWindow(a, b.contentWindow)
    } else {
        var c = cvox.Interframe.IF_MSG_PREFIX + cvox.ChromeVoxJSON.stringify(a, null, null),
            d = document.createElement("script");
        d.type = "text/javascript";
        if (b.hasAttribute("id") && document.getElementById(b.id) == b) {
            d.innerHTML = "document.getElementById(decodeURI('" + encodeURI(b.id) + "')).contentWindow.postMessage(decodeURI('" + encodeURI(c) + "'), '*');"
        } else {
            var e = "cvox_iframe" + a.id;
            "" === b.className ? b.className = e : -1 == b.className.indexOf(e) && (b.className += " " + e);
            d.innerHTML = "document.getElementsByClassName(decodeURI('" + encodeURI(e) + "'))[0].contentWindow.postMessage(decodeURI('" + encodeURI(c) + "'), '*');"
        }
        document.head.appendChild(d);
        window.setTimeout(function () {
            document.head.removeChild(d)
        }, 1E3)
    }
};
cvox.Interframe.sendMessageToParentWindow = function (a) {
    cvox.Interframe.isIframe() && (a.sourceId = cvox.Interframe.id, window.parent ? cvox.Interframe.sendMessageToWindow(a, window.parent) : (a = cvox.Interframe.IF_MSG_PREFIX + cvox.ChromeVoxJSON.stringify(a, null, null), window.location.href = "javascript:window.parent.postMessage('" + encodeURI(a) + "', '*');"))
};
cvox.Interframe.sendIdToIFrame = function (a, b) {
    cvox.Interframe.sendMessageToIFrame({
        command: cvox.Interframe.SET_ID,
        id: a
    }, b)
};
cvox.Interframe.isIframe = function () {
    return window != window.parent
};
cvox.Interframe.init();
