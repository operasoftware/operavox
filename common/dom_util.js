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

cvox.DomUtil = function () {};
cvox.DomUtil.INPUT_TYPE_TO_INFORMATION_TABLE_MSG = {
    button: "input_type_button",
    checkbox: "input_type_checkbox",
    color: "input_type_color",
    datetime: "input_type_datetime",
    "datetime-local": "input_type_datetime_local",
    date: "input_type_date",
    email: "input_type_email",
    file: "input_type_file",
    image: "input_type_image",
    month: "input_type_month",
    number: "input_type_number",
    password: "input_type_password",
    radio: "input_type_radio",
    range: "input_type_range",
    reset: "input_type_reset",
    search: "input_type_search",
    submit: "input_type_submit",
    tel: "input_type_tel",
    text: "input_type_text",
    url: "input_type_url",
    week: "input_type_week"
};
cvox.DomUtil.TAG_TO_INFORMATION_TABLE_VERBOSE_MSG = {
    A: "tag_link",
    ARTICLE: "tag_article",
    ASIDE: "tag_aside",
    AUDIO: "tag_audio",
    BUTTON: "tag_button",
    FOOTER: "tag_footer",
    H1: "tag_h1",
    H2: "tag_h2",
    H3: "tag_h3",
    H4: "tag_h4",
    H5: "tag_h5",
    H6: "tag_h6",
    HEADER: "tag_header",
    HGROUP: "tag_hgroup",
    LI: "tag_li",
    MARK: "tag_mark",
    NAV: "tag_nav",
    OL: "tag_ol",
    SECTION: "tag_section",
    SELECT: "tag_select",
    TABLE: "tag_table",
    TEXTAREA: "tag_textarea",
    TIME: "tag_time",
    UL: "tag_ul",
    VIDEO: "tag_video"
};
cvox.DomUtil.TAG_TO_INFORMATION_TABLE_BRIEF_MSG = {
    AUDIO: "tag_audio",
    BUTTON: "tag_button",
    SELECT: "tag_select",
    TABLE: "tag_table",
    TEXTAREA: "tag_textarea",
    VIDEO: "tag_video"
};
cvox.DomUtil.FORMATTING_TAGS = "B BIG CITE CODE DFN EM I KBD SAMP SMALL SPAN STRIKE STRONG SUB SUP U VAR".split(" ");
cvox.DomUtil.isVisible = function (a, b) {
    b = b || {};
    "undefined" === typeof b.checkAncestors && (b.checkAncestors = !0);
    "undefined" === typeof b.checkDescendants && (b.checkDescendants = !0);
    return "IFRAME" != a.tagName || a.src ? cvox.AriaUtil.isForcedVisibleRecursive(a) ? !0 : b.checkAncestors && cvox.DomUtil.hasInvisibleAncestor_(a) ? !1 : cvox.DomUtil.hasVisibleNodeSubtree_(a, b.checkDescendants) ? !0 : !1 : !1
};
cvox.DomUtil.hasInvisibleAncestor_ = function (a) {
    for (; a = a.parentElement;) {
        var b = document.defaultView.getComputedStyle(a, null);
        if (cvox.DomUtil.isInvisibleStyle(b, !0)) {
            return !0
        }
    }
    return !1
};
cvox.DomUtil.hasVisibleNodeSubtree_ = function (a, b) {
    if (!(a instanceof Element)) {
        var c = document.defaultView.getComputedStyle(a.parentElement, null);
        return !cvox.DomUtil.isInvisibleStyle(c)
    }
    c = document.defaultView.getComputedStyle(a, null);
    if (!cvox.DomUtil.isInvisibleStyle(c)) {
        return !0
    }
    c = cvox.DomUtil.isInvisibleStyle(c, !0);
    if (!b || c) {
        return !1
    }
    for (var c = a.childNodes, d = 0; d < c.length; d++) {
        if (cvox.DomUtil.hasVisibleNodeSubtree_(c[d], b)) {
            return !0
        }
    }
    return !1
};
cvox.DomUtil.isInvisibleStyle = function (a, b) {
    return a ? "none" != a.display && 0 != parseFloat(a.opacity) && (b || "hidden" != a.visibility && "collapse" != a.visibility) ? !1 : !0 : !1
};
cvox.DomUtil.isDisabled = function (a) {
    if (a.disabled) {
        return !0
    }
    for (; a = a.parentElement;) {
        if ("FIELDSET" == a.tagName && a.disabled) {
            return !0
        }
    }
    return !1
};
cvox.DomUtil.isSemanticElt = function (a) {
    return a.tagName && (a = a.tagName, "SECTION" == a || "NAV" == a || "ARTICLE" == a || "ASIDE" == a || "HGROUP" == a || "HEADER" == a || "FOOTER" == a || "TIME" == a || "MARK" == a) ? !0 : !1
};
cvox.DomUtil.isLeafNode = function (a, b) {
    if (!(a instanceof Element)) {
        return null == a.firstChild
    }
    if (!b && !cvox.DomUtil.isVisible(a, {
        checkAncestors: !1
    }) || !b && cvox.AriaUtil.isHidden(a) || cvox.AriaUtil.isLeafElement(a)) {
        return !0
    }
    switch (a.tagName) {
    case "OBJECT":
        ;
    case "EMBED":
        ;
    case "VIDEO":
        ;
    case "AUDIO":
        ;
    case "IFRAME":
        ;
    case "FRAME":
        return !0
    }
    return cvox.DomPredicates.linkPredicate([a]) ? !cvox.DomUtil.findNode(a, function (a) {
        return !!cvox.DomPredicates.headingPredicate([a])
    }) : cvox.DomUtil.isLeafLevelControl(a) || !a.firstChild || cvox.DomUtil.isMath(a) ? !0 : cvox.DomPredicates.headingPredicate([a]) ? !cvox.DomUtil.findNode(a, function (a) {
        return !!cvox.DomPredicates.controlPredicate([a])
    }) : !1
};
cvox.DomUtil.isDescendantOf = function (a, b, c) {
    for (; a;) {
        if (b && c && a.tagName && a.tagName == b && a.className && a.className == c || b && !c && a.tagName && a.tagName == b || !b && c && a.className && a.className == c) {
            return !0
        }
        a = a.parentNode
    }
    return !1
};
cvox.DomUtil.isDescendantOfNode = function (a, b) {
    for (; a && b;) {
        if (a.isSameNode(b)) {
            return !0
        }
        a = a.parentNode
    }
    return !1
};
cvox.DomUtil.collapseWhitespace = function (a) {
    return a.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "")
};
cvox.DomUtil.getBaseLabel_ = function (a, b, c) {
    var d = "";
    if (a.hasAttribute) {
        if (a.hasAttribute("aria-labelledby")) {
            for (var e = a.getAttribute("aria-labelledby").split(" "), f, g = 0; f = e[g]; g++) {
                (f = document.getElementById(f)) && (d += " " + cvox.DomUtil.getName(f, !0, c, !0))
            }
        } else {
            if (a.hasAttribute("aria-label")) {
                d = a.getAttribute("aria-label")
            } else {
                if (a.constructor == HTMLImageElement) {
                    d = cvox.DomUtil.getImageTitle(a)
                } else {
                    if ("FIELDSET" == a.tagName) {
                        for (e = a.getElementsByTagName("LEGEND"), d = "", g = 0; f = e[g]; g++) {
                            d += " " + cvox.DomUtil.getName(f, !0, c)
                        }
                    }
                }
            }
        }
        0 == d.length && a && a.id && (a = document.querySelector('label[for="' + a.id + '"]')) && (d = cvox.DomUtil.getName(a, b, c))
    }
    return cvox.DomUtil.collapseWhitespace(d)
};
cvox.DomUtil.getNearestAncestorLabel_ = function (a) {
    for (var b = ""; a && "LABEL" != a.tagName;) {
        a = a.parentElement
    }
    a && !a.hasAttribute("for") && (b = cvox.DomUtil.getName(a, !0, !1));
    return b
};
cvox.DomUtil.getInputName_ = function (a) {
    var b = "";
    "image" == a.type ? b = cvox.DomUtil.getImageTitle(a) : "submit" == a.type ? b = a.hasAttribute("value") ? a.getAttribute("value") : "Submit" : "reset" == a.type ? b = a.hasAttribute("value") ? a.getAttribute("value") : "Reset" : "button" == a.type && a.hasAttribute("value") && (b = a.getAttribute("value"));
    return b
};
cvox.DomUtil.getName = function (a, b, c, d) {
    if (!a || !0 == a.cvoxGetNameMarked) {
        return ""
    }
    a.cvoxGetNameMarked = !0;
    b = cvox.DomUtil.getName_(a, b, c, d);
    a.cvoxGetNameMarked = !1;
    return cvox.DomUtil.getPrefixText(a) + b
};
cvox.DomUtil.hasChildrenBasedName_ = function (a, b) {
    return cvox.DomPredicates.linkPredicate([a]) || cvox.DomPredicates.headingPredicate([a]) || "BUTTON" == a.tagName || cvox.AriaUtil.isControlWidget(a) || !cvox.DomUtil.isLeafNode(a, b) ? !0 : !1
};
cvox.DomUtil.getName_ = function (a, b, c, d) {
    "undefined" === typeof b && (b = !0);
    "undefined" === typeof c && (c = !0);
    if (a.constructor == Text) {
        return a.data
    }
    var e = cvox.DomUtil.getBaseLabel_(a, b, c);
    0 == e.length && cvox.DomUtil.isControl(a) && (e = cvox.DomUtil.getNearestAncestorLabel_(a));
    0 == e.length && a.constructor == HTMLInputElement && (e = cvox.DomUtil.getInputName_(a));
    return cvox.DomUtil.isInputTypeText(a) && a.hasAttribute("placeholder") ? (b = a.getAttribute("placeholder"), 0 < e.length ? 0 < cvox.DomUtil.getValue(a).length ? e : e + " with hint " + b : b) : 0 < e.length ? e : 0 == a.textContent.length && a.hasAttribute && a.hasAttribute("title") ? a.getAttribute("title") : !b || cvox.AriaUtil.isCompositeControl(a) ? "" : cvox.DomUtil.hasChildrenBasedName_(a, d) ? cvox.DomUtil.getNameFromChildren(a, c, d) : ""
};
cvox.DomUtil.getNameFromChildren = function (a, b, c) {
    void 0 == b && (b = !0);
    for (var d = "", e = "", f = 0; f < a.childNodes.length; f++) {
        var g = a.childNodes[f],
            e = a.childNodes[f - 1] || g;
        if (b || !cvox.DomUtil.isControl(g)) {
            var h = cvox.DomUtil.isVisible(g, {
                checkAncestors: !1
            });
            if (c || h && !cvox.AriaUtil.isHidden(g)) {
                e = "SPAN" == e.tagName || "SPAN" == g.tagName || "SPAN" == g.parentNode.tagName ? "" : " ", d += e + cvox.DomUtil.getName(g, !0, b)
            }
        }
    }
    return d
};
cvox.DomUtil.getPrefixText = function (a, b) {
    b = b || 0;
    for (var c = cvox.DomUtil.getAncestors(a), d = "", e = c = cvox.DomPredicates.listItemPredicate(c); e && e.firstChild;) {
        e = e.firstChild
    }
    c && c.parentNode && 0 == b && "OL" == c.parentNode.tagName && a == e && "none" != document.defaultView.getComputedStyle(c.parentNode).listStyleType && (d = cvox.DomUtil.toArray(c.parentNode.children).filter(function (a) {
        return "LI" == a.tagName
    }).indexOf(c) + 1, -1 != document.defaultView.getComputedStyle(c.parentNode).listStyleType.indexOf("latin") && (d--, d = String.fromCharCode(65 + d % 26)), d += ". ");
    return d
};
cvox.DomUtil.getControlLabelHeuristics = function (a) {
    if (a.hasAttribute && (a.hasAttribute("aria-label") && "" == a.getAttribute("aria-label") || a.hasAttribute("aria-title") && "" == a.getAttribute("aria-title"))) {
        return ""
    }
    for (var b = cvox.DomUtil.previousLeafNode(a), c = 0; b && (!cvox.DomUtil.hasContent(b) || cvox.DomUtil.isControl(b));) {
        b = cvox.DomUtil.previousLeafNode(b), c++
    }
    for (var c = cvox.DomUtil.directedNextLeafNode(a), d = 0; c && (!cvox.DomUtil.hasContent(c) || cvox.DomUtil.isControl(c));) {
        c = cvox.DomUtil.directedNextLeafNode(c), d++
    }
    if (b && c) {
        for (var d = a, e = 0; d && !cvox.DomUtil.isDescendantOfNode(b, d);) {
            d = d.parentNode, e++
        }
        d = a;
        for (a = 0; d && !cvox.DomUtil.isDescendantOfNode(c, d);) {
            d = d.parentNode, a++
        }
        b = a < e ? c : b
    } else {
        b = b || c
    }
    return b ? cvox.DomUtil.collapseWhitespace(cvox.DomUtil.getValue(b) + " " + cvox.DomUtil.getName(b)) : ""
};
cvox.DomUtil.getValue = function (a) {
    var b = cvox.AriaUtil.getActiveDescendant(a);
    if (b) {
        return cvox.DomUtil.collapseWhitespace(cvox.DomUtil.getValue(b) + " " + cvox.DomUtil.getName(b))
    }
    if (a.constructor == HTMLSelectElement) {
        var b = "",
            c = a.selectedOptions ? a.selectedOptions[0] : null;
        a = a.selectedOptions ? a.selectedOptions[a.selectedOptions.length - 1] : null;
        c && a && c != a ? b = cvox.ChromeVox.msgs.getMsg("selected_options_value", [c.text, a.text]) : c && (b = c.text + "");
        return b
    }
    if (a.constructor == HTMLTextAreaElement) {
        return a.value
    }
    if (a.constructor == HTMLInputElement) {
        switch (a.type) {
        case "hidden":
            ;
        case "image":
            ;
        case "submit":
            ;
        case "reset":
            ;
        case "button":
            ;
        case "checkbox":
            ;
        case "radio":
            return "";
        case "password":
            return a.value.replace(/./g, "dot ");
        default:
            return a.value
        }
    }
    return a.isContentEditable ? cvox.DomUtil.getNameFromChildren(a, !0) : ""
};
cvox.DomUtil.getImageTitle = function (a) {
    a.hasAttribute("alt") ? a = a.alt : a.hasAttribute("title") ? a = a.title : (a = a.src, "data" != a.substring(0, 4) ? (a = a.substring(a.lastIndexOf("/") + 1, a.lastIndexOf(".")), a = 1 <= a.length && 16 >= a.length ? a + " Image" : "Image") : a = "Image");
    return a
};
cvox.DomUtil.hasContent = function (a) {
    if (8 == a.nodeType || cvox.DomUtil.isDescendantOf(a, "HEAD") || cvox.DomUtil.isDescendantOf(a, "SCRIPT") || cvox.DomUtil.isDescendantOf(a, "NOSCRIPT") || cvox.DomUtil.isDescendantOf(a, "NOEMBED") || cvox.DomUtil.isDescendantOf(a, "STYLE") || !cvox.DomUtil.isVisible(a) || cvox.AriaUtil.isHidden(a)) {
        return !1
    }
    if (cvox.DomUtil.isControl(a) || cvox.DomUtil.isDescendantOf(a, "VIDEO") || cvox.DomUtil.isDescendantOf(a, "AUDIO") || "IFRAME" == a.tagName && a.src && 0 != a.src.indexOf("javascript:")) {
        return !0
    }
    for (var b = a.parentElement; b && "LABEL" != b.tagName;) {
        b = b.parentElement
    }
    if (b) {
        var c = b.querySelector("button,input,select,textarea");
        if (b.hasAttribute("for")) {
            if (b = b.getAttribute("for"), (b = document.getElementById(b)) && cvox.DomUtil.isControl(b) && !c) {
                return !1
            }
        } else {
            if (c) {
                return !1
            }
        }
    }
    for (c = a.parentElement; c && "LEGEND" != c.tagName;) {
        c = c.parentElement
    }
    if (c) {
        for (b = c.parentElement; b && "FIELDSET" != b.tagName;) {
            b = b.parentElement
        }
        c = b && b.querySelector("button,input,select,textarea");
        if (b && !c) {
            return !1
        }
    }
    if (cvox.DomPredicates.linkPredicate([a]) || "TABLE" == a.tagName || cvox.DomUtil.isMath(a) || cvox.DomPredicates.headingPredicate([a])) {
        return !0
    }
    c = cvox.DomUtil.getValue(a) + " " + cvox.DomUtil.getName(a);
    a = cvox.DomUtil.getState(a, !0);
    return c.match(/^\s+$/) && "" === a ? !1 : !0
};
cvox.DomUtil.getAncestors = function (a) {
    for (var b = []; a;) {
        b.push(a), a = a.parentNode
    }
    for (b.reverse(); b.length && !b[0].tagName && !b[0].nodeValue;) {
        b.shift()
    }
    return b
};
cvox.DomUtil.compareAncestors = function (a, b) {
    for (var c = 0; a[c] && b[c] && a[c] == b[c];) {
        c++
    }
    a[c] || b[c] || (c = -1);
    return c
};
cvox.DomUtil.getUniqueAncestors = function (a, b, c) {
    a = cvox.DomUtil.getAncestors(a);
    b = cvox.DomUtil.getAncestors(b);
    a = cvox.DomUtil.compareAncestors(a, b);
    a = b.slice(a);
    return 0 == a.length && c ? b : a
};
cvox.DomUtil.getRoleMsg = function (a, b) {
    var c;
    c = cvox.AriaUtil.getRoleNameMsg(a);
    c || ("INPUT" == a.tagName ? c = cvox.DomUtil.INPUT_TYPE_TO_INFORMATION_TABLE_MSG[a.type] : "A" == a.tagName && cvox.DomUtil.isInternalLink(a) ? c = "internal_link" : "A" == a.tagName && a.getAttribute("name") ? c = "" : a.isContentEditable ? c = "input_type_text" : cvox.DomUtil.isMath(a) ? c = "math_expr" : "TABLE" == a.tagName && cvox.DomUtil.isLayoutTable(a) ? c = "" : b == cvox.VERBOSITY_BRIEF ? c = cvox.DomUtil.TAG_TO_INFORMATION_TABLE_BRIEF_MSG[a.tagName] : (c = cvox.DomUtil.TAG_TO_INFORMATION_TABLE_VERBOSE_MSG[a.tagName],
        cvox.DomUtil.hasLongDesc(a) && (c = "image_with_long_desc"), !c && a.onclick && (c = "clickable")));
    return c
};
cvox.DomUtil.getRole = function (a, b) {
    var c = cvox.DomUtil.getRoleMsg(a, b) || "",
        d = c && " " != c ? cvox.ChromeVox.msgs.getMsg(c) : "";
    return d ? d : c
};
cvox.DomUtil.getListLength = function (a) {
    var b = 0;
    for (a = a.firstChild; a; a = a.nextSibling) {
        if ("LI" == a.tagName || a.getAttribute && "listitem" == a.getAttribute("role")) {
            if (a.hasAttribute("aria-setsize")) {
                var c = parseInt(a.getAttribute("aria-setsize"), 10);
                if (!isNaN(c)) {
                    return c
                }
            }
            b++
        }
    }
    return b
};
cvox.DomUtil.getStateMsgs = function (a, b) {
    var c = cvox.AriaUtil.getActiveDescendant(a);
    if (c) {
        return cvox.DomUtil.getStateMsgs(c, b)
    }
    var c = [],
        d = a.getAttribute ? a.getAttribute("role") : "";
    (c = cvox.AriaUtil.getStateMsgs(a, b)) || (c = []);
    "INPUT" == a.tagName ? a.hasAttribute("aria-checked") || (d = {
        "checkbox-true": "checkbox_checked_state",
        "checkbox-false": "checkbox_unchecked_state",
        "radio-true": "radio_selected_state",
        "radio-false": "radio_unselected_state"
    }[a.type + "-" + !! a.checked]) && c.push([d]) : "SELECT" == a.tagName ? a.selectedOptions && 1 >= a.selectedOptions.length ? c.push(["list_position", cvox.ChromeVox.msgs.getNumber(a.selectedIndex + 1), cvox.ChromeVox.msgs.getNumber(a.options.length)]) : c.push(["selected_options_state",
  cvox.ChromeVox.msgs.getNumber(a.selectedOptions.length)]) : "UL" != a.tagName && "OL" != a.tagName && "list" != d || c.push(["list_with_items", cvox.ChromeVox.msgs.getNumber(cvox.DomUtil.getListLength(a))]);
    cvox.DomUtil.isDisabled(a) && c.push(["aria_disabled_true"]);
    cvox.DomPredicates.linkPredicate([a]) && cvox.ChromeVox.visitedUrls[a.href] && c.push(["visited_url"]);
    a.accessKey && c.push(["access_key", a.accessKey]);
    return c
};
cvox.DomUtil.getState = function (a, b) {
    return cvox.NodeStateUtil.expand(cvox.DomUtil.getStateMsgs(a, b))
};
cvox.DomUtil.isFocusable = function (a) {
    return a && "number" == typeof a.tabIndex && ("A" != a.tagName || a.hasAttribute("href") || a.hasAttribute("tabindex")) ? 0 <= a.tabIndex || a.hasAttribute && a.hasAttribute("tabindex") && "-1" == a.getAttribute("tabindex") ? !0 : !1 : !1
};
cvox.DomUtil.findFocusableDescendant = function (a) {
    return a && (a = cvox.DomUtil.findNode(a, cvox.DomUtil.isFocusable)) ? a : null
};
cvox.DomUtil.countFocusableDescendants = function (a) {
    return a ? cvox.DomUtil.countNodes(a, cvox.DomUtil.isFocusable) : 0
};
cvox.DomUtil.isAttachedToDocument = function (a) {
    for (; a;) {
        if (a.tagName && "HTML" == a.tagName) {
            return !0
        }
        a = a.parentNode
    }
    return !1
};
cvox.DomUtil.clickElem = function (a, b, c, d) {
    var e = cvox.AriaUtil.getActiveDescendant(a);
    e && (a = e);
    if (c) {
        c = null;
        a.onclick && (c = a.onclick);
        !c && 1 != a.nodeType && a.parentNode && a.parentNode.onclick && (c = a.parentNode.onclick);
        e = !0;
        if (c) {
            try {
                e = c()
            } catch (f) {}
        }
        if (!e) {
            return
        }
    }
    c = document.createEvent("MouseEvents");
    c.initMouseEvent(d ? "dblclick" : "mousedown", !0, !0, document.defaultView, 1, 0, 0, 0, 0, !1, !1, b, !1, 0, null);
    c.fromCvox = !0;
    try {
        a.dispatchEvent(c)
    } catch (g) {}
    c = document.createEvent("MouseEvents");
    c.initMouseEvent("mouseup", !0, !0, document.defaultView, 1, 0, 0, 0, 0, !1, !1, b, !1, 0, null);
    c.fromCvox = !0;
    try {
        a.dispatchEvent(c)
    } catch (h) {}
    c = document.createEvent("MouseEvents");
    c.initMouseEvent("click", !0, !0, document.defaultView, 1, 0, 0, 0, 0, !1, !1, b, !1, 0, null);
    c.fromCvox = !0;
    try {
        a.dispatchEvent(c)
    } catch (k) {}
    cvox.DomUtil.isInternalLink(a) && cvox.DomUtil.syncInternalLink(a)
};
cvox.DomUtil.syncInternalLink = function (a) {
    var b = a.href.split("#")[1];
    a = document.getElementById(b);
    a || (b = document.getElementsByName(b), 0 < b.length && (a = b[0]));
    if (a) {
        var b = a.parentNode,
            c = document.createElement("div");
        c.setAttribute("tabindex", "-1");
        b.insertBefore(c, a);
        c.setAttribute("chromevoxignoreariahidden", 1);
        c.focus();
        cvox.ChromeVox.syncToNode(a, !0)
    }
};
cvox.DomUtil.isInputTypeText = function (a) {
    if (!a || a.constructor != HTMLInputElement) {
        return !1
    }
    switch (a.type) {
    case "email":
        ;
    case "number":
        ;
    case "password":
        ;
    case "search":
        ;
    case "text":
        ;
    case "tel":
        ;
    case "url":
        ;
    case "":
        return !0;
    default:
        return !1
    }
};
cvox.DomUtil.isControl = function (a) {
    if (cvox.AriaUtil.isControlWidget(a) && cvox.DomUtil.isFocusable(a)) {
        return !0
    }
    if (a.tagName) {
        switch (a.tagName) {
        case "BUTTON":
            ;
        case "TEXTAREA":
            ;
        case "SELECT":
            return !0;
        case "INPUT":
            return "hidden" != a.type
        }
    }
    return a.isContentEditable ? !0 : !1
};
cvox.DomUtil.isLeafLevelControl = function (a) {
    return cvox.DomUtil.isControl(a) ? !(cvox.AriaUtil.isCompositeControl(a) && cvox.DomUtil.findFocusableDescendant(a)) : !1
};
cvox.DomUtil.getSurroundingControl = function (a) {
    var b = null;
    if (!cvox.DomUtil.isControl(a) && a.hasAttribute && a.hasAttribute("role")) {
        for (b = a.parentElement; b && !cvox.AriaUtil.isCompositeControl(b);) {
            b = b.parentElement
        }
    }
    return b
};
cvox.DomUtil.directedNextLeafLikeNode = function (a, b, c) {
    if (a != document.body) {
        for (; !cvox.DomUtil.directedNextSibling(a, b);) {
            if (!a) {
                return null
            }
            a = a.parentNode;
            if (a == document.body) {
                return null
            }
        }
        cvox.DomUtil.directedNextSibling(a, b) && (a = cvox.DomUtil.directedNextSibling(a, b))
    }
    for (; cvox.DomUtil.directedFirstChild(a, b) && !c(a);) {
        a = cvox.DomUtil.directedFirstChild(a, b)
    }
    return a == document.body ? null : a
};
cvox.DomUtil.directedNextLeafNode = function (a, b) {
    return cvox.DomUtil.directedNextLeafLikeNode(a, !! b, cvox.DomUtil.isLeafNode)
};
cvox.DomUtil.previousLeafNode = function (a) {
    return cvox.DomUtil.directedNextLeafNode(a, !0)
};
cvox.DomUtil.directedFindFirstNode = function (a, b, c) {
    for (a = cvox.DomUtil.directedFirstChild(a, b); a;) {
        if (c(a)) {
            return a
        }
        var d = cvox.DomUtil.directedFindFirstNode(a, b, c);
        if (d) {
            return d
        }
        a = cvox.DomUtil.directedNextSibling(a, b)
    }
    return null
};
cvox.DomUtil.directedFindDeepestNode = function (a, b, c) {
    var d = cvox.DomUtil.directedFindFirstNode(a, b, c);
    return d ? cvox.DomUtil.directedFindDeepestNode(d, b, c) : c(a) ? a : null
};
cvox.DomUtil.directedFindNextNode = function (a, b, c, d, e, f) {
    e = !! e;
    f = !! f;
    if (!cvox.DomUtil.isDescendantOfNode(a, b) || a == b) {
        return null
    }
    for (var g = cvox.DomUtil.directedNextSibling(a, c); g;) {
        if (!f && d(g)) {
            return g
        }
        var h = (f ? cvox.DomUtil.directedFindDeepestNode : cvox.DomUtil.directedFindFirstNode)(g, c, d);
        if (h) {
            return h
        }
        if (f && d(g)) {
            return g
        }
        g = cvox.DomUtil.directedNextSibling(g, c)
    }
    a = a.parentNode;
    return e && d(a) ? a : cvox.DomUtil.directedFindNextNode(a, b, c, d, e, f)
};
cvox.DomUtil.getControlValueAndStateString = function (a) {
    return cvox.DomUtil.getSurroundingControl(a) ? cvox.DomUtil.collapseWhitespace(cvox.DomUtil.getValue(a) + " " + cvox.DomUtil.getName(a) + " " + cvox.DomUtil.getState(a, !0)) : cvox.DomUtil.collapseWhitespace(cvox.DomUtil.getValue(a) + " " + cvox.DomUtil.getState(a, !0))
};
cvox.DomUtil.isInternalLink = function (a) {
    return 1 == a.nodeType && (a = a.getAttribute("href")) && -1 != a.indexOf("#") ? (a = a.split("#")[0], "" == a || a == window.location.pathname) : !1
};
cvox.DomUtil.getLinkURL = function (a) {
    if ("A" == a.tagName) {
        if (a.getAttribute("href")) {
            return cvox.DomUtil.isInternalLink(a) ? cvox.ChromeVox.msgs.getMsg("internal_link") : a.getAttribute("href")
        }
    } else {
        if (cvox.AriaUtil.getRoleName(a) == cvox.ChromeVox.msgs.getMsg("aria_role_link")) {
            return cvox.ChromeVox.msgs.getMsg("unknown_link")
        }
    }
    return ""
};
cvox.DomUtil.getContainingTable = function (a, b) {
    var c = cvox.DomUtil.getAncestors(a);
    return cvox.DomUtil.findTableNodeInList(c, b)
};
cvox.DomUtil.findTableNodeInList = function (a, b) {
    b = b || {
        allowCaptions: !1
    };
    for (var c = a.length - 1, d; d = a[c]; c--) {
        if (d.constructor != Text) {
            if (!b.allowCaptions && "CAPTION" == d.tagName) {
                break
            }
            if ("TABLE" == d.tagName || cvox.AriaUtil.isGrid(d)) {
                return d
            }
        }
    }
    return null
};
cvox.DomUtil.isLayoutTable = function (a) {
    if (a.rows && (1 == a.rows.length || 1 == a.rows[0].childElementCount)) {
        return !0
    }
    if (cvox.AriaUtil.isGrid(a) || cvox.AriaUtil.isLandmark(a) || a.caption || a.summary || 0 < cvox.XpathUtil.evalXPath("tbody/tr/th", a).length && 0 < cvox.XpathUtil.evalXPath("tbody/tr/td", a).length || 0 < cvox.XpathUtil.evalXPath("colgroup", a).length || 0 < cvox.XpathUtil.evalXPath("thead", a).length || 0 < cvox.XpathUtil.evalXPath("tfoot", a).length) {
        return !1
    }
    if (0 < cvox.XpathUtil.evalXPath("tbody/tr/td/embed", a).length || 0 < cvox.XpathUtil.evalXPath("tbody/tr/td/object", a).length || 0 < cvox.XpathUtil.evalXPath("tbody/tr/td/iframe", a).length || 0 < cvox.XpathUtil.evalXPath("tbody/tr/td/applet", a).length) {
        return !0
    }
    var b = 0;
    cvox.DomUtil.hasBorder(a) || b++;
    6 >= a.rows.length && b++;
    12 >= cvox.DomUtil.countPreviousTags(a) && b++;
    0 < cvox.XpathUtil.evalXPath("tbody/tr/td/table", a).length && b++;
    return 3 <= b
};
cvox.DomUtil.countPreviousTags = function (a) {
    return cvox.DomUtil.getAncestors(a).length + cvox.DomUtil.countPreviousSiblings(a)
};
cvox.DomUtil.countPreviousSiblings = function (a) {
    var b = 0;
    for (a = a.previousSibling; null != a;) {
        a.constructor != Text && b++, a = a.previousSibling
    }
    return b
};
cvox.DomUtil.hasBorder = function (a) {
    return a.frame ? -1 == a.frame.indexOf("void") : a.border ? 1 == a.border.length ? "0" != a.border : 0 != a.border.slice(0, -2) : a.style.borderStyle && "none" == a.style.borderStyle ? !1 : a.style.borderWidth ? 0 != a.style.borderWidth.slice(0, -2) : a.style.borderColor ? !0 : !1
};
cvox.DomUtil.getFirstLeafNode = function () {
    for (var a = document.body; a && a.firstChild;) {
        a = a.firstChild
    }
    for (; a && !cvox.DomUtil.hasContent(a);) {
        a = cvox.DomUtil.directedNextLeafNode(a)
    }
    return a
};
cvox.DomUtil.findNode = function (a, b) {
    var c = [];
    return cvox.DomUtil.findNodes_(a, b, c, !0, 1E4) ? c[0] : void 0
};
cvox.DomUtil.countNodes = function (a, b) {
    var c = [];
    cvox.DomUtil.findNodes_(a, b, c, !1, 1E4);
    return c.length
};
cvox.DomUtil.findNodes_ = function (a, b, c, d, e) {
    if (null != a || 0 == e) {
        for (a = a.firstChild; a;) {
            if (b(a) && (c.push(a), d)) {
                return !0
            }
            e -= 1;
            if (cvox.DomUtil.findNodes_(a, b, c, d, e)) {
                return !0
            }
            a = a.nextSibling
        }
    }
    return !1
};
cvox.DomUtil.toArray = function (a) {
    for (var b = [], c = 0; c < a.length; c++) {
        b.push(a[c])
    }
    return b
};
cvox.DomUtil.shallowChildlessClone = function (a, b) {
    if ("#text" == a.nodeName) {
        return document.createTextNode(a.nodeValue)
    }
    if ("#comment" == a.nodeName) {
        return document.createComment(a.nodeValue)
    }
    for (var c = document.createElement(a.nodeName), d = 0; d < a.attributes.length; ++d) {
        var e = a.attributes[d];
        b && b[e.nodeName] || c.setAttribute(e.nodeName, e.nodeValue)
    }
    return c
};
cvox.DomUtil.deepClone = function (a, b) {
    for (var c = cvox.DomUtil.shallowChildlessClone(a, b), d = 0; d < a.childNodes.length; ++d) {
        c.appendChild(cvox.DomUtil.deepClone(a.childNodes[d], b))
    }
    return c
};
cvox.DomUtil.directedFirstChild = function (a, b) {
    return b ? a.lastChild : a.firstChild
};
cvox.DomUtil.directedNextSibling = function (a, b) {
    return a ? b ? a.previousSibling : a.nextSibling : null
};
cvox.DomUtil.createSimpleClickFunction = function (a) {
    var b = a.cloneNode(!0);
    return function () {
        cvox.DomUtil.clickElem(b, !1, !1)
    }
};
cvox.DomUtil.addNodeToHead = function (a, b) {
    b && document.getElementById(b) || (document.head || document.body).appendChild(a)
};
cvox.DomUtil.getContainingMath = function (a) {
    a = cvox.DomUtil.getAncestors(a);
    return cvox.DomUtil.findMathNodeInList(a)
};
cvox.DomUtil.findMathNodeInList = function (a) {
    for (var b = 0, c; c = a[b]; b++) {
        if (cvox.DomUtil.isMath(c)) {
            return c
        }
    }
    return null
};
cvox.DomUtil.isMath = function (a) {
    return cvox.DomUtil.isMathml(a) || cvox.DomUtil.isMathJax(a) || cvox.DomUtil.isMathImg(a) || cvox.AriaUtil.isMath(a)
};
cvox.DomUtil.ALT_MATH_CLASSES = {
    tex: ["tex", "latex"],
    asciimath: ["numberedequation", "inlineformula", "displayformula"]
};
cvox.DomUtil.altMathQuerySelector = function (a) {
    return (a = cvox.DomUtil.ALT_MATH_CLASSES[a]) ? a.map(function (a) {
        return "img." + a
    }).join(", ") : ""
};
cvox.DomUtil.isMathImg = function (a) {
    if (!a || !a.tagName || !a.className || "IMG" != a.tagName) {
        return !1
    }
    a = a.className.toLowerCase();
    return -1 != cvox.DomUtil.ALT_MATH_CLASSES.tex.indexOf(a) || -1 != cvox.DomUtil.ALT_MATH_CLASSES.asciimath.indexOf(a)
};
cvox.DomUtil.isMathml = function (a) {
    return a && a.tagName ? "math" == a.tagName.toLowerCase() : !1
};
cvox.DomUtil.isMathJax = function (a) {
    function b(a, b) {
        return "SPAN" == a.tagName && a.className.split(" ").some(function (a) {
            return a.toLowerCase() == b
        })
    }
    return a && a.tagName && a.className ? b(a, "math") ? cvox.DomUtil.getAncestors(a).some(function (a) {
        return b(a, "mathjax")
    }) : !1 : !1
};
cvox.DomUtil.getMathSpanId = function (a) {
    if (a = document.getElementById(a + "-Frame")) {
        if (a = a.querySelector("span.math")) {
            return a.id
        }
    }
};
cvox.DomUtil.hasLongDesc = function (a) {
    return a && a.longDesc ? !0 : !1
};
cvox.DomUtil.getNodeTagName = function (a) {
    return a.nodeType == Node.ELEMENT_NODE ? a.tagName : ""
};
cvox.DomUtil.purgeNodes = function (a) {
    return cvox.DomUtil.toArray(a).filter(function (a) {
        return a.nodeType != Node.TEXT_NODE || !a.textContent.match(/^\s+$/)
    })
};
cvox.DomUtil.elementToPoint = function (a) {
    if (!a) {
        return {
            x: 0,
            y: 0
        }
    }
    a.constructor == Text && (a = a.parentNode);
    a = a.getBoundingClientRect();
    return {
        x: a.left + a.width / 2,
        y: a.top + a.height / 2
    }
};
