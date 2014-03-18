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

"undefined" != typeof goog && goog.provide && (cvox.Api = {}, cvox.Api.Math = {});
(function () {
    function a() {
        d && (d.port1.close(), d.port2.close(), d = null);
        d = new MessageChannel;
        window.postMessage("cvox.PortSetup", [d.port2], "*");
        d.port1.onmessage = function (a) {
            "cvox.Disconnect" == a.data && (d = null);
            try {
                var b = JSON.parse(a.data);
                b.id && g[b.id] && (g[b.id](b), delete g[b.id])
            } catch (c) {}
        }
    }

    function b(a, b) {
        var c = f;
        f++;
        void 0 === a.args && (a.args = []);
        a.args = [c].concat(a.args);
        g[c] = b;
        d.port1.postMessage(JSON.stringify(a))
    }

    function c(a, c) {
        var d = null;
        c && c.endCallback && (d = c.endCallback);
        b(a, d)
    }
    var d, e = !1,
        f = 1,
        g = {};
    window.cvox || (window.cvox = {});
    var h = window.cvox,
        k = null;
    "undefined" != typeof h.ApiImplementation && (k = h.ApiImplementation);
    h.Api = function () {};
    h.Api.internalEnable = function () {
        e = !0;
        k || a();
        var b = document.createEvent("UIEvents");
        b.initEvent("chromeVoxLoaded", !0, !1);
        document.dispatchEvent(b)
    };
    h.Api.internalDisable = function () {
        e = !1;
        d = null;
        var a = document.createEvent("UIEvents");
        a.initEvent("chromeVoxUnloaded", !0, !1);
        document.dispatchEvent(a)
    };
    h.Api.isChromeVoxActive = function () {
        return k ? e : !! d
    };
    h.Api.speak = function (a, b, d) {
        h.Api.isChromeVoxActive() && (k ? k.speak(a, b, d) : c({
            cmd: "speak",
            args: [a, b, d]
        }, d))
    };
    h.Api.speakNode = function (a, b, d) {
        h.Api.isChromeVoxActive() && (k ? k.speak(h.DomUtil.getName(a), b, d) : (a = {
            cmd: "speakNodeRef",
            args: [h.ApiUtils.makeNodeReference(a), b, d]
        }, c(a, d)))
    };
    h.Api.stop = function () {
        h.Api.isChromeVoxActive() && (k ? k.stop() : d.port1.postMessage(JSON.stringify({
            cmd: "stop"
        })))
    };
    h.Api.playEarcon = function (a) {
        h.Api.isChromeVoxActive() && (k ? k.playEarcon(a) : d.port1.postMessage(JSON.stringify({
            cmd: "playEarcon",
            args: [a]
        })))
    };
    h.Api.syncToNode = function (a, b) {
        if (h.Api.isChromeVoxActive() && a) {
            if (k) {
                k.syncToNode(a, b)
            } else {
                var c = {
                    cmd: "syncToNodeRef",
                    args: [h.ApiUtils.makeNodeReference(a), b]
                };
                d.port1.postMessage(JSON.stringify(c))
            }
        }
    };
    h.Api.getCurrentNode = function (a) {
        h.Api.isChromeVoxActive() && a && (k ? a(h.ChromeVox.navigationManager.getCurrentNode()) : b({
            cmd: "getCurrentNode"
        }, function (b) {
            a(h.ApiUtils.getNodeFromRef(b.currentNode))
        }))
    };
    h.Api.setSpeechForNode = function (a, b) {
        h.Api.isChromeVoxActive() && a && b && a.setAttribute("cvoxnodedesc", JSON.stringify(b))
    };
    h.Api.click = function (a, b) {
        if (h.Api.isChromeVoxActive() && a) {
            if (k) {
                h.DomUtil.clickElem(a, b, !0)
            } else {
                var c = {
                    cmd: "clickNodeRef",
                    args: [h.ApiUtils.makeNodeReference(a), b]
                };
                d.port1.postMessage(JSON.stringify(c))
            }
        }
    };
    h.Api.getBuild = function (a) {
        h.Api.isChromeVoxActive() && a && (k ? a(h.BuildInfo.build) : b({
            cmd: "getBuild"
        }, function (b) {
            a(b.build)
        }))
    };
    h.Api.getVersion = function (a) {
        h.Api.isChromeVoxActive() && a && (k ? a(h.ChromeVox.version + "") : b({
            cmd: "getVersion"
        }, function (b) {
            a(b.version)
        }))
    };
    h.Api.getCvoxModifierKeys = function (a) {
        h.Api.isChromeVoxActive() && a && (k ? a(h.KeyUtil.cvoxModKeyCodes()) : b({
            cmd: "getCvoxModKeys"
        }, function (b) {
            a(b.keyCodes)
        }))
    };
    h.Api.isKeyShortcut = function (a, c) {
        if (c) {
            if (h.Api.isChromeVoxActive()) {
                if (![37, 39].indexOf(a.keyCode) || a.altKey || a.shiftKey || a.ctrlKey || a.metaKey) {
                    if (k) {
                        var d = h.KeyUtil.keyEventToKeySequence(a);
                        c(h.ChromeVoxKbHandler.handlerKeyMap.hasKey(d))
                    } else {
                        var d = {}, e = ["target", "srcElement", "currentTarget", "view"],
                            f;
                        for (f in a) {
                            -1 === e.indexOf(f) && (d[f] = a[f])
                        }
                        b({
                            cmd: "isKeyShortcut",
                            args: [d]
                        }, function (a) {
                            c(a.isHandled)
                        })
                    }
                } else {
                    c(!1)
                }
            } else {
                c(!1)
            }
        }
    };
    h.Api.setKeyEcho = function (a) {
        h.Api.isChromeVoxActive() && (k ? k.setKeyEcho(a) : d.port1.postMessage(JSON.stringify({
            cmd: "setKeyEcho",
            args: [a]
        })))
    };
    h.Api.Math = function () {};
    h.Api.Math.defineRule = function (a, b, c, e, f) {
        if (h.Api.isChromeVoxActive()) {
            var g = Array.prototype.slice.call(arguments, 4),
                g = [a, b, c, e].concat(g);
            k ? k.Math.defineRule.apply(k.Math, g) : d.port1.postMessage(JSON.stringify({
                cmd: "Math.defineRule",
                args: g
            }))
        }
    };
    h.Api.internalEnable();
    h.NodeDescription = function (a, b, c, d) {
        this.context = a ? a : "";
        this.text = b ? b : "";
        this.userValue = c ? c : "";
        this.annotation = d ? d : ""
    }
})();
