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

cvox.ChromeVoxKbHandler = {};
cvox.ChromeVoxKbHandler.loadKeyToFunctionsTable = function (a) {
    window.JSON && (cvox.ChromeVoxKbHandler.handlerKeyMap = cvox.KeyMap.fromJSON(a))
};
cvox.ChromeVoxKbHandler.sortKeyToFunctionsTable_ = function (a) {
    var b = [],
        c;
    for (c in a) {
        b.push([c, a[c]])
    }
    b.sort(function (a, b) {
        return a[0].length < b[0].length ? -1 : b[0].length < a[0].length ? 1 : a[0].localeCompare(b[0])
    });
    return b
};
cvox.ChromeVoxKbHandler.basicKeyDownActionsListener = function (a) {
    var b = cvox.KeyUtil.keyEventToKeySequence(a);
    a = void 0 != cvox.ChromeVoxKbHandler.handlerKeyMap ? cvox.ChromeVoxKbHandler.handlerKeyMap.commandForKey(b) : null;
    if (!a) {
        return !cvox.KeyUtil.sequencing
    }
    if (!cvox.ChromeVox.isActive && "toggleChromeVox" != a) {
        return !0
    }
    var c = !0,
        d = cvox.ChromeVoxUserCommands.commands[a];
    d ? (b = cvox.History.getInstance(), b.enterUserCommand(a), c = d(), b.exitUserCommand(a)) : b.cvoxModifier && (c = !1);
    cvox.ChromeVox.entireDocumentIsHidden && (c = !0);
    return c
};
