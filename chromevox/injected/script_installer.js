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

cvox.ScriptInstaller = {};
cvox.ScriptInstaller.installScript = function (a, b, c, d) {
    if (document.querySelector("script[" + b + "]") || !a) {
        return !1
    }
    for (var e = 0, f; f = a[e]; e++) {
        var g = new XMLHttpRequest,
            h = f + "?" + (new Date).getTime();
        g.onreadystatechange = function () {
            if (4 == g.readyState) {
                var a = g.responseText,
                    a = a + ("\n//# sourceURL=" + f + "\n"),
                    c = document.createElement("script");
                c.type = "text/javascript";
                c.setAttribute(b, "1");
                c.textContent = a;
                d && c.setAttribute("chromevoxScriptBase", d);
                cvox.DomUtil.addNodeToHead(c)
            }
        };
        try {
            g.open("GET", h, !1), g.send(null)
        } catch (k) {
            return window.console.log("Warning: ChromeVox external script loading for " + document.location + " stopped after failing to install " + f), !1
        }
    }
    c && c();
    return !0
};
