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

cvox.FocusUtil = function () {};
cvox.FocusUtil.INPUT_TYPE_ACCEPTS_SELECTION_TABLE = {
    hidden: !1,
    text: !0,
    search: !0,
    tel: !0,
    url: !0,
    email: !0,
    password: !0,
    datetime: !1,
    date: !1,
    month: !1,
    week: !1,
    time: !1,
    "datetime-local": !1,
    number: !1,
    range: !1,
    color: !1,
    checkbox: !1,
    radio: !1,
    file: !1,
    submit: !1,
    image: !1,
    reset: !1,
    button: !1
};
cvox.FocusUtil.isFocusInTextInputField = function () {
    var a = document.activeElement;
    return a ? a.isContentEditable || "textbox" == a.getAttribute("role") ? !0 : "true" == a.getAttribute("readOnly") ? !1 : "TEXTAREA" === a.tagName || "SELECT" === a.tagName ? !0 : "INPUT" === a.tagName ? a.hasAttribute("type") ? (a = a.getAttribute("type").toLowerCase(), cvox.FocusUtil.INPUT_TYPE_ACCEPTS_SELECTION_TABLE[a]) : !0 : !1 : !1
};
