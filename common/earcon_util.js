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

cvox.EarconUtil = {};
cvox.EarconUtil.getEarcon = function (a) {
    var b = cvox.AriaUtil.getEarcon(a);
    if (null != b) {
        return b
    }
    switch (a.tagName) {
    case "BUTTON":
        return cvox.AbstractEarcons.BUTTON;
    case "A":
        if (a.hasAttribute("href")) {
            return cvox.AbstractEarcons.LINK
        }
        break;
    case "IMG":
        if (cvox.DomUtil.hasLongDesc(a)) {
            return cvox.AbstractEarcons.LONG_DESC
        }
        break;
    case "LI":
        return cvox.AbstractEarcons.LIST_ITEM;
    case "SELECT":
        return cvox.AbstractEarcons.LISTBOX;
    case "TEXTAREA":
        return cvox.AbstractEarcons.EDITABLE_TEXT;
    case "INPUT":
        switch (a.type) {
        case "button":
            ;
        case "submit":
            ;
        case "reset":
            return cvox.AbstractEarcons.BUTTON;
        case "checkbox":
            ;
        case "radio":
            return a.checked ? cvox.AbstractEarcons.CHECK_ON : cvox.AbstractEarcons.CHECK_OFF;
        default:
            if (cvox.DomUtil.isInputTypeText(a)) {
                return cvox.AbstractEarcons.EDITABLE_TEXT
            }
        }
    }
    return null
};
