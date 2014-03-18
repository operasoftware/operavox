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

cvox.ApiImplementation = function () {};
cvox.ApiImplementation.init = function (a) {
    window.addEventListener("message", cvox.ApiImplementation.portSetup, !0);
    var b = [];
    b.push(cvox.ChromeVox.host.getFileSrc("chromevox/injected/api_util.js"));
    b.push(cvox.ChromeVox.host.getApiSrc());
    b.push(cvox.ApiImplementation.siteSpecificScriptLoader);
    cvox.ScriptInstaller.installScript(b, "cvoxapi", a, cvox.ApiImplementation.siteSpecificScriptBase) || (window.location.href = "javascript:cvox.Api.internalEnable();")
};
cvox.ApiImplementation.portSetup = function (a) {
    return "cvox.PortSetup" == a.data ? (cvox.ApiImplementation.port = a.ports[0], cvox.ApiImplementation.port.onmessage = function (a) {
        cvox.ApiImplementation.dispatchApiMessage(cvox.ChromeVoxJSON.parse(a.data))
    }, a.stopPropagation(), !1) : !0
};
cvox.ApiImplementation.dispatchApiMessage = function (a) {
    var b;
    switch (a.cmd) {
    case "speak":
        b = cvox.ApiImplementation.speak;
        break;
    case "speakNodeRef":
        b = cvox.ApiImplementation.speakNodeRef;
        break;
    case "stop":
        b = cvox.ApiImplementation.stop;
        break;
    case "playEarcon":
        b = cvox.ApiImplementation.playEarcon;
        break;
    case "syncToNodeRef":
        b = cvox.ApiImplementation.syncToNodeRef;
        break;
    case "clickNodeRef":
        b = cvox.ApiImplementation.clickNodeRef;
        break;
    case "getBuild":
        b = cvox.ApiImplementation.getBuild;
        break;
    case "getVersion":
        b = cvox.ApiImplementation.getVersion;
        break;
    case "getCurrentNode":
        b = cvox.ApiImplementation.getCurrentNode;
        break;
    case "getCvoxModKeys":
        b = cvox.ApiImplementation.getCvoxModKeys;
        break;
    case "isKeyShortcut":
        b = cvox.ApiImplementation.isKeyShortcut;
        break;
    case "setKeyEcho":
        b = cvox.ApiImplementation.setKeyEcho;
        break;
    case "Math.defineRule":
        b = cvox.ApiImplementation.Math.defineRule
    }
    if (!b) {
        throw "Unknown API call: " + a.cmd;
    }
    b.apply(cvox.ApiImplementation, a.args)
};

function setupEndCallback_(a, b) {
    a && (a.endCallback = function () {
        cvox.ApiImplementation.port.postMessage(cvox.ChromeVoxJSON.stringify({
            id: b
        }))
    })
}
cvox.ApiImplementation.speak = function (a, b, c, d) {
    cvox.ChromeVox.isActive && (d || (d = {}), setupEndCallback_(d, a), cvox.ChromeVox.tts.speak(b, c, d))
};
cvox.ApiImplementation.speakNode = function (a, b, c) {
    cvox.ChromeVox.isActive && cvox.ChromeVox.tts.speak(cvox.DomUtil.getName(a), b, c)
};
cvox.ApiImplementation.speakNodeRef = function (a, b, c, d) {
    b = cvox.ApiUtils.getNodeFromRef(b);
    d || (d = {});
    setupEndCallback_(d, a);
    cvox.ApiImplementation.speakNode(b, c, d)
};
cvox.ApiImplementation.stop = function () {
    cvox.ChromeVox.isActive && cvox.ChromeVox.tts.stop()
};
cvox.ApiImplementation.playEarcon = function (a) {
    cvox.ChromeVox.isActive && cvox.ChromeVox.earcons.playEarconByName(a)
};
cvox.ApiImplementation.syncToNodeRef = function (a, b) {
    var c = cvox.ApiUtils.getNodeFromRef(a);
    cvox.ApiImplementation.syncToNode(c, b)
};
cvox.ApiImplementation.syncToNode = function (a, b, c) {
    cvox.ChromeVox.isActive && (void 0 == c && (c = cvox.AbstractTts.QUEUE_MODE_FLUSH), cvox.ChromeVox.navigationManager.updateSelToArbitraryNode(a, !0), cvox.ChromeVox.navigationManager.updateIndicator(), void 0 == b && (b = !1), cvox.AriaUtil.isHiddenRecursive(a) && (b = !1), b && (cvox.ChromeVox.navigationManager.speakDescriptionArray(cvox.ApiImplementation.getDesc_(a), c, null), cvox.ChromeVox.navigationManager.getBraille().write()), cvox.ChromeVox.navigationManager.updatePosition(a))
};
cvox.ApiImplementation.getCurrentNode = function (a) {
    var b = cvox.ChromeVox.navigationManager.getCurrentNode();
    cvox.ApiImplementation.port.postMessage(cvox.ChromeVoxJSON.stringify({
        id: a,
        currentNode: cvox.ApiUtils.makeNodeReference(b)
    }))
};
cvox.ApiImplementation.getDesc_ = function (a) {
    if (!a.hasAttribute("cvoxnodedesc")) {
        return cvox.ChromeVox.navigationManager.getDescription()
    }
    a = cvox.ChromeVoxJSON.parse(a.getAttribute("cvoxnodedesc"));
    for (var b = [], c = 0; c < a.length; ++c) {
        var d = a[c];
        b.push(new cvox.NavDescription({
            context: d.context,
            text: d.text,
            userValue: d.userValue,
            annotation: d.annotation
        }))
    }
    return b
};
cvox.ApiImplementation.clickNodeRef = function (a, b) {
    cvox.DomUtil.clickElem(cvox.ApiUtils.getNodeFromRef(a), b, !1)
};
cvox.ApiImplementation.getBuild = function (a) {
    cvox.ApiImplementation.port.postMessage(cvox.ChromeVoxJSON.stringify({
        id: a,
        build: cvox.BuildInfo.build
    }))
};
cvox.ApiImplementation.getVersion = function (a) {
    var b = cvox.ChromeVox.version;
    null == b ? window.setTimeout(function () {
        cvox.ApiImplementation.getVersion(a)
    }, 1E3) : cvox.ApiImplementation.port.postMessage(cvox.ChromeVoxJSON.stringify({
        id: a,
        version: b
    }))
};
cvox.ApiImplementation.getCvoxModKeys = function (a) {
    cvox.ApiImplementation.port.postMessage(cvox.ChromeVoxJSON.stringify({
        id: a,
        keyCodes: cvox.KeyUtil.cvoxModKeyCodes()
    }))
};
cvox.ApiImplementation.isKeyShortcut = function (a, b) {
    var c = cvox.KeyUtil.keyEventToKeySequence(b);
    cvox.ApiImplementation.port.postMessage(cvox.ChromeVoxJSON.stringify({
        id: a,
        isHandled: cvox.ChromeVoxKbHandler.handlerKeyMap.hasKey(c)
    }))
};
cvox.ApiImplementation.setKeyEcho = function (a) {
    var b = cvox.ChromeVox.keyEcho;
    b[document.location.href] = a;
    cvox.ChromeVox.host.sendToBackgroundPage({
        target: "Prefs",
        action: "setPref",
        pref: "keyEcho",
        value: JSON.stringify(b)
    })
};
cvox.ApiImplementation.Math = function () {};
cvox.ApiImplementation.Math.defineRule = function (a, b, c, d, e) {
    var f = cvox.MathmlStore.getInstance(),
        g = Array.prototype.slice.call(arguments, 4),
        g = [a, b, c, d].concat(g);
    f.defineRule.apply(f, g)
};
