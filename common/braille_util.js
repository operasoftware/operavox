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

cvox.BrailleUtil = {};
cvox.BrailleUtil.ITEM_SEPARATOR = " ";
cvox.BrailleUtil.CONTAINER = "tag_h1_brl tag_h2_brl tag_h3_brl tag_h4_brl tag_h5_brl tag_h6_brl".split(" ");
cvox.BrailleUtil.TEMPLATE = {
    base: "c n v r s",
    aria_role_button: "[n]",
    aria_role_textbox: "n: v r",
    input_type_button: "[n]",
    input_type_checkbox: "n (s)",
    input_type_email: "n: v r",
    input_type_number: "n: v r",
    input_type_password: "n: v r",
    input_type_search: "n: v r",
    input_type_submit: "[n]",
    input_type_text: "n: v r",
    input_type_tel: "n: v r",
    input_type_url: "n: v r",
    tag_button: "[n]",
    tag_textarea: "n: v r"
};
cvox.BrailleUtil.ValueSpan = function (a) {
    this.offset = a
};
cvox.BrailleUtil.ValueSelectionSpan = function () {};
cvox.BrailleUtil.getName = function (a) {
    return a ? cvox.DomUtil.getName(a).trim() : ""
};
cvox.BrailleUtil.getRoleMsg = function (a) {
    if (!a) {
        return ""
    }
    (a = cvox.DomUtil.getRoleMsg(a, cvox.VERBOSITY_VERBOSE)) && (a = cvox.DomUtil.collapseWhitespace(a));
    a && 0 < a.length && cvox.ChromeVox.msgs.getMsg(a + "_brl") && (a += "_brl");
    return a
};
cvox.BrailleUtil.getRole = function (a) {
    return a ? (a = cvox.BrailleUtil.getRoleMsg(a)) ? cvox.ChromeVox.msgs.getMsg(a) : "" : ""
};
cvox.BrailleUtil.getState = function (a) {
    return a ? cvox.NodeStateUtil.expand(cvox.DomUtil.getStateMsgs(a, !0).map(function (a) {
        cvox.ChromeVox.msgs.getMsg(a[0] + "_brl") && (a[0] += "_brl");
        return a
    })) : ""
};
cvox.BrailleUtil.getContainer = function (a, b) {
    if (!a || !b) {
        return ""
    }
    for (var c = cvox.DomUtil.getUniqueAncestors(a, b), d = 0, e; e = c[d]; d++) {
        if ((e = cvox.BrailleUtil.getRoleMsg(e)) && -1 != cvox.BrailleUtil.CONTAINER.indexOf(e)) {
            return cvox.ChromeVox.msgs.getMsg(e)
        }
    }
    return ""
};
cvox.BrailleUtil.getValue = function (a) {
    if (!a) {
        return new cvox.Spannable
    }
    var b = new cvox.BrailleUtil.ValueSpan(0);
    if (cvox.DomUtil.isInputTypeText(a)) {
        var c = a.value;
        "password" === a.type && (c = c.replace(/./g, "*"));
        b = new cvox.Spannable(c, b);
        a === document.activeElement && b.setSpan(new cvox.BrailleUtil.ValueSelectionSpan, a.selectionStart, a.selectionEnd);
        return b
    }
    if (a instanceof HTMLTextAreaElement) {
        var d = new cvox.EditableTextAreaShadow;
        d.update(a);
        var e = d.getLineIndex(a.selectionEnd),
            c = d.getLineStart(e),
            d = d.getLineEnd(e),
            d = a.value.substring(c, d);
        b.offset = c;
        b = new cvox.Spannable(d, b);
        a === document.activeElement && (d = Math.max(a.selectionStart - c, 0), a = Math.min(a.selectionEnd - c, b.getLength()), b.setSpan(new cvox.BrailleUtil.ValueSelectionSpan, d, a));
        return b
    }
    return new cvox.Spannable(cvox.DomUtil.getValue(a), b)
};
cvox.BrailleUtil.getTemplated = function (a, b, c) {
    c = c ? c : {};
    for (var d = c.roleMsg || (b ? cvox.DomUtil.getRoleMsg(b, cvox.VERBOSITY_VERBOSE) : ""), d = cvox.BrailleUtil.TEMPLATE[d] || cvox.BrailleUtil.TEMPLATE.base, e = new cvox.Spannable, f = function (d) {
            switch (d) {
            case "n":
                return c.name || cvox.BrailleUtil.getName(b);
            case "r":
                return c.role || cvox.BrailleUtil.getRole(b);
            case "s":
                return c.state || cvox.BrailleUtil.getState(b);
            case "c":
                return c.container || cvox.BrailleUtil.getContainer(a, b);
            case "v":
                return c.value ? new cvox.Spannable(c.value, new cvox.BrailleUtil.ValueSpan(0)) : cvox.BrailleUtil.getValue(b);
            default:
                return d
            }
        }, g = 0; g < d.length; g++) {
        var h = f(d[g]);
        e.append(h);
        h.toString() || " " != d[g + 1] || g++
    }
    return e.trim()
};
