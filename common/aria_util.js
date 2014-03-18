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

cvox.AriaUtil = function () {};
cvox.AriaUtil.NO_ROLE_NAME = " ";
cvox.AriaUtil.WIDGET_ROLE_TO_NAME = {
    alert: "aria_role_alert",
    alertdialog: "aria_role_alertdialog",
    button: "aria_role_button",
    checkbox: "aria_role_checkbox",
    columnheader: "aria_role_columnheader",
    combobox: "aria_role_combobox",
    dialog: "aria_role_dialog",
    grid: "aria_role_grid",
    gridcell: "aria_role_gridcell",
    link: "aria_role_link",
    listbox: "aria_role_listbox",
    log: "aria_role_log",
    marquee: "aria_role_marquee",
    menu: "aria_role_menu",
    menubar: "aria_role_menubar",
    menuitem: "aria_role_menuitem",
    menuitemcheckbox: "aria_role_menuitemcheckbox",
    menuitemradio: "aria_role_menuitemradio",
    option: cvox.AriaUtil.NO_ROLE_NAME,
    progressbar: "aria_role_progressbar",
    radio: "aria_role_radio",
    radiogroup: "aria_role_radiogroup",
    rowheader: "aria_role_rowheader",
    scrollbar: "aria_role_scrollbar",
    slider: "aria_role_slider",
    spinbutton: "aria_role_spinbutton",
    status: "aria_role_status",
    tab: "aria_role_tab",
    tabpanel: "aria_role_tabpanel",
    textbox: "aria_role_textbox",
    timer: "aria_role_timer",
    toolbar: "aria_role_toolbar",
    tooltip: "aria_role_tooltip",
    treeitem: "aria_role_treeitem"
};
cvox.AriaUtil.STRUCTURE_ROLE_TO_NAME = {
    article: "aria_role_article",
    application: "aria_role_application",
    banner: "aria_role_banner",
    columnheader: "aria_role_columnheader",
    complementary: "aria_role_complementary",
    contentinfo: "aria_role_contentinfo",
    definition: "aria_role_definition",
    directory: "aria_role_directory",
    document: "aria_role_document",
    form: "aria_role_form",
    group: "aria_role_group",
    heading: "aria_role_heading",
    img: "aria_role_img",
    list: "aria_role_list",
    listitem: "aria_role_listitem",
    main: "aria_role_main",
    math: "aria_role_math",
    navigation: "aria_role_navigation",
    note: "aria_role_note",
    region: "aria_role_region",
    rowheader: "aria_role_rowheader",
    search: "aria_role_search",
    separator: "aria_role_separator"
};
cvox.AriaUtil.ATTRIBUTE_VALUE_TO_STATUS = [{
    name: "aria-autocomplete",
    values: {
        inline: "aria_autocomplete_inline",
        list: "aria_autocomplete_list",
        both: "aria_autocomplete_both"
    }
}, {
    name: "aria-checked",
    values: {
        "true": "aria_checked_true",
        "false": "aria_checked_false",
        mixed: "aria_checked_mixed"
    }
}, {
    name: "aria-disabled",
    values: {
        "true": "aria_disabled_true"
    }
}, {
    name: "aria-expanded",
    values: {
        "true": "aria_expanded_true",
        "false": "aria_expanded_false"
    }
}, {
    name: "aria-invalid",
    values: {
        "true": "aria_invalid_true",
        grammar: "aria_invalid_grammar",
        spelling: "aria_invalid_spelling"
    }
}, {
    name: "aria-multiline",
    values: {
        "true": "aria_multiline_true"
    }
}, {
    name: "aria-multiselectable",
    values: {
        "true": "aria_multiselectable_true"
    }
}, {
    name: "aria-pressed",
    values: {
        "true": "aria_pressed_true",
        "false": "aria_pressed_false",
        mixed: "aria_pressed_mixed"
    }
}, {
    name: "aria-readonly",
    values: {
        "true": "aria_readonly_true"
    }
}, {
    name: "aria-required",
    values: {
        "true": "aria_required_true"
    }
}, {
    name: "aria-selected",
    values: {
        "true": "aria_selected_true",
        "false": "aria_selected_false"
    }
}];
cvox.AriaUtil.isHiddenRecursive = function (a) {
    if (cvox.AriaUtil.isHidden(a)) {
        return !0
    }
    for (a = a.parentElement; a;) {
        if ("true" == a.getAttribute("aria-hidden") && "true" != a.getAttribute("chromevoxignoreariahidden")) {
            return !0
        }
        a = a.parentElement
    }
    return !1
};
cvox.AriaUtil.isHidden = function (a) {
    return !a || a.getAttribute && "true" == a.getAttribute("aria-hidden") && "true" != a.getAttribute("chromevoxignoreariahidden") ? !0 : !1
};
cvox.AriaUtil.isForcedVisibleRecursive = function (a) {
    for (; a;) {
        if (a.getAttribute && a.hasAttribute("aria-hidden") && "true" != a.getAttribute("chromevoxignoreariahidden")) {
            return "false" == a.getAttribute("aria-hidden")
        }
        a = a.parentElement
    }
    return !1
};
cvox.AriaUtil.isLeafElement = function (a) {
    var b = a.getAttribute("role");
    a = a.hasAttribute("aria-label") && 0 < a.getAttribute("aria-label").length;
    return "img" == b || "progressbar" == b || a
};
cvox.AriaUtil.isDescendantOfRole = function (a, b) {
    for (; a;) {
        if (b && a && a.getAttribute("role") == b) {
            return !0
        }
        a = a.parentNode
    }
    return !1
};
cvox.AriaUtil.getRoleNameMsgForRole_ = function (a) {
    return (a = cvox.AriaUtil.WIDGET_ROLE_TO_NAME[a]) ? a == cvox.AriaUtil.NO_ROLE_NAME ? " " : a : null
};
cvox.AriaUtil.isButton = function (a) {
    return "button" == cvox.AriaUtil.getRoleAttribute(a) || "BUTTON" == a.tagName ? !0 : "INPUT" == a.tagName ? "submit" == a.type || "reset" == a.type || "button" == a.type : !1
};
cvox.AriaUtil.getRoleNameMsg = function (a) {
    var b;
    if (a && a.getAttribute) {
        var c = cvox.AriaUtil.getRoleAttribute(a);
        if ("true" == a.getAttribute("aria-haspopup") && cvox.AriaUtil.isButton(a)) {
            return "aria_role_popup_button"
        }
        c && ((b = cvox.AriaUtil.getRoleNameMsgForRole_(c)) || (b = cvox.AriaUtil.STRUCTURE_ROLE_TO_NAME[c]));
        if ("menuitem" == c) {
            for (a = a.parentElement; a && (!a.getAttribute || "menu" != cvox.AriaUtil.getRoleAttribute(a) && "menubar" != cvox.AriaUtil.getRoleAttribute(a));) {
                a = a.parentElement
            }
            a && "menubar" == cvox.AriaUtil.getRoleAttribute(a) && (b = cvox.AriaUtil.getRoleNameMsgForRole_("menu"))
        }
    }
    b || (b = "");
    return b
};
cvox.AriaUtil.getRoleName = function (a) {
    var b = cvox.AriaUtil.getRoleNameMsg(a),
        b = cvox.ChromeVox.msgs.getMsg(b);
    "heading" == cvox.AriaUtil.getRoleAttribute(a) && a.hasAttribute("aria-level") && (b += " " + a.getAttribute("aria-level"));
    return b ? b : ""
};
cvox.AriaUtil.getStateMsgs = function (a, b) {
    var c = [];
    if (!a || !a.getAttribute) {
        return c
    }
    for (var d = 0, e; e = cvox.AriaUtil.ATTRIBUTE_VALUE_TO_STATUS[d]; d++) {
        var f = a.getAttribute(e.name);
        (e = e.values[f]) && c.push([e])
    }
    if ("grid" == a.getAttribute("role")) {
        return cvox.AriaUtil.getGridState_(a, a)
    }
    d = cvox.AriaUtil.getRoleAttribute(a);
    "true" == a.getAttribute("aria-haspopup") && ("menuitem" == d ? c.push(["has_submenu"]) : cvox.AriaUtil.isButton(a) || c.push(["has_popup"]));
    if (e = a.getAttribute("aria-valuetext")) {
        return c.push([e]), c
    }
    e = a.getAttribute("aria-valuenow");
    var f = a.getAttribute("aria-valuemin"),
        g = a.getAttribute("aria-valuemax");
    if (null != e && null != f && null != g && ("scrollbar" == d || "progressbar" == d)) {
        var h = Math.round(100 * (e / (g - f)));
        c.push(["state_percent", h]);
        return c
    }
    null != e && c.push(["aria_value_now", e]);
    null != f && c.push(["aria_value_min", f]);
    null != g && c.push(["aria_value_max", g]);
    f = a;
    e = null;
    if (cvox.AriaUtil.isCompositeControl(f) && b) {
        e = cvox.AriaUtil.getActiveDescendant(f)
    } else {
        if (d = cvox.AriaUtil.getRoleAttribute(a), "option" == d || "menuitem" == d || "menuitemcheckbox" == d || "menuitemradio" == d || "radio" == d || "tab" == d || "treeitem" == d) {
            for (e = a, f = a.parentElement; f && !cvox.AriaUtil.isCompositeControl(f) && (!(f = f.parentElement) || "treeitem" != cvox.AriaUtil.getRoleAttribute(f));) {}
        }
    }
    if (f && (cvox.AriaUtil.isCompositeControl(f) || "treeitem" == cvox.AriaUtil.getRoleAttribute(f)) && e) {
        var k;
        switch (cvox.AriaUtil.getRoleAttribute(f)) {
        case "combobox":
            ;
        case "listbox":
            k = ["option"];
            break;
        case "menu":
            k = ["menuitem", "menuitemcheck", "menuitemradio"];
            break;
        case "radiogroup":
            k = ["radio"];
            break;
        case "tablist":
            k = ["tab"];
            break;
        case "tree":
            ;
        case "treegrid":
            ;
        case "treeitem":
            k = ["treeitem"]
        }
        if (k) {
            var l, d = parseInt(e.getAttribute("aria-setsize"), 10);
            isNaN(d) || (h = d);
            d = parseInt(e.getAttribute("aria-posinset"), 10);
            isNaN(d) || (l = d);
            if (void 0 == h || void 0 == l) {
                if (k = cvox.AriaUtil.getNextLevel(f, k), void 0 == h && (h = k.length), void 0 == l) {
                    for (d = 0; d < k.length; d++) {
                        k[d] == e && (l = d + 1)
                    }
                }
            }
            l && h && c.push(["list_position", l, h])
        }
    }
    return c
};
cvox.AriaUtil.getGridState_ = function (a, b) {
    var c = cvox.AriaUtil.getActiveDescendant(b);
    if (c) {
        for (var d = b.querySelectorAll('*[role~="row"]'), e = 0; e < d.length; e++) {
            for (var f = d[e].querySelectorAll('*[role~="gridcell"]'), g = 0; g < f.length; g++) {
                if (f[g] == c) {
                    return [["aria_role_gridcell_pos", e + 1, g + 1]]
                }
            }
        }
    }
    return []
};
cvox.AriaUtil.getActiveDescendantId_ = function (a) {
    return a.getAttribute ? (a = a.getAttribute("aria-activedescendant")) ? a : null : null
};
cvox.AriaUtil.getNextLevel = function (a, b) {
    for (var c = [], d = a.childNodes, e = 0; e < d.length; e++) {
        if (!cvox.AriaUtil.isHidden(d[e]) && cvox.DomUtil.isVisible(d[e])) {
            var f = cvox.AriaUtil.getNextLevelItems(d[e], b);
            0 < f.length && (c = c.concat(f))
        }
    }
    return c
};
cvox.AriaUtil.getNextLevelItems = function (a, b) {
    if (1 != a.nodeType) {
        return []
    }
    if (-1 != b.indexOf(cvox.AriaUtil.getRoleAttribute(a))) {
        return [a]
    }
    var c = a.childNodes,
        d = c.length;
    if (0 == d) {
        return []
    }
    for (var e = [], f = 0; f < d; f++) {
        var g = cvox.AriaUtil.getNextLevelItems(c[f], b);
        0 < g.length && (e = e.concat(g))
    }
    return e
};
cvox.AriaUtil.getActiveDescendant = function (a) {
    for (var b = {}, c = a; c;) {
        var d = cvox.AriaUtil.getActiveDescendantId_(c);
        if (!d) {
            break
        }
        if (d in b) {
            return null
        }
        b[d] = !0;
        c = document.getElementById(d)
    }
    return c == a ? null : c
};
cvox.AriaUtil.isControlWidget = function (a) {
    if (a && a.getAttribute) {
        switch (cvox.AriaUtil.getRoleAttribute(a)) {
        case "button":
            ;
        case "checkbox":
            ;
        case "combobox":
            ;
        case "listbox":
            ;
        case "menu":
            ;
        case "menuitemcheckbox":
            ;
        case "menuitemradio":
            ;
        case "radio":
            ;
        case "slider":
            ;
        case "progressbar":
            ;
        case "scrollbar":
            ;
        case "spinbutton":
            ;
        case "tab":
            ;
        case "tablist":
            ;
        case "textbox":
            return !0
        }
    }
    return !1
};
cvox.AriaUtil.isCompositeControl = function (a) {
    if (a && a.getAttribute) {
        switch (cvox.AriaUtil.getRoleAttribute(a)) {
        case "combobox":
            ;
        case "grid":
            ;
        case "listbox":
            ;
        case "menu":
            ;
        case "menubar":
            ;
        case "radiogroup":
            ;
        case "tablist":
            ;
        case "tree":
            ;
        case "treegrid":
            return !0
        }
    }
    return !1
};
cvox.AriaUtil.getAriaLive = function (a) {
    if (!a.hasAttribute) {
        return null
    }
    var b = a.getAttribute("aria-live");
    if ("off" == b) {
        return null
    }
    if (b) {
        return b
    }
    switch (cvox.AriaUtil.getRoleAttribute(a)) {
    case "alert":
        return "assertive";
    case "log":
        ;
    case "status":
        return "polite";
    default:
        return null
    }
};
cvox.AriaUtil.getAriaAtomic = function (a) {
    if (!a.hasAttribute) {
        return !1
    }
    var b = a.getAttribute("aria-atomic");
    return b ? "true" === b : "alert" == cvox.AriaUtil.getRoleAttribute(a) ? !0 : !1
};
cvox.AriaUtil.getAriaBusy = function (a) {
    return a.hasAttribute ? (a = a.getAttribute("aria-busy")) ? "true" === a : !1 : !1
};
cvox.AriaUtil.getAriaRelevant = function (a, b) {
    if (!a.hasAttribute) {
        return !1
    }
    var c;
    c = a.hasAttribute("aria-relevant") ? a.getAttribute("aria-relevant") : "additions text";
    "all" == c && (c = "additions removals text");
    c = c.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "").split(" ");
    return "all" == b ? 0 <= c.indexOf("additions") && 0 <= c.indexOf("text") && 0 <= c.indexOf("removals") : 0 <= c.indexOf(b)
};
cvox.AriaUtil.getLiveRegions = function (a) {
    var b = [];
    if (a.querySelectorAll) {
        var c = a.querySelectorAll('[role="alert"], [role="log"],  [role="marquee"], [role="status"], [role="timer"],  [aria-live]');
        if (c) {
            for (var d = 0; d < c.length; d++) {
                b.push(c[d])
            }
        }
    }
    for (; a;) {
        if (cvox.AriaUtil.getAriaLive(a)) {
            b.push(a);
            break
        }
        a = a.parentElement
    }
    return b
};
cvox.AriaUtil.isLandmark = function (a) {
    if (!a || !a.getAttribute) {
        return !1
    }
    switch (cvox.AriaUtil.getRoleAttribute(a)) {
    case "application":
        ;
    case "banner":
        ;
    case "complementary":
        ;
    case "contentinfo":
        ;
    case "form":
        ;
    case "main":
        ;
    case "navigation":
        ;
    case "search":
        return !0
    }
    return !1
};
cvox.AriaUtil.isGrid = function (a) {
    if (!a || !a.getAttribute) {
        return !1
    }
    switch (cvox.AriaUtil.getRoleAttribute(a)) {
    case "grid":
        ;
    case "treegrid":
        return !0
    }
    return !1
};
cvox.AriaUtil.getEarcon = function (a) {
    if (!a || !a.getAttribute) {
        return null
    }
    switch (cvox.AriaUtil.getRoleAttribute(a)) {
    case "button":
        return cvox.AbstractEarcons.BUTTON;
    case "checkbox":
        ;
    case "radio":
        ;
    case "menuitemcheckbox":
        ;
    case "menuitemradio":
        return "true" == a.getAttribute("aria-checked") ? cvox.AbstractEarcons.CHECK_ON : cvox.AbstractEarcons.CHECK_OFF;
    case "combobox":
        ;
    case "listbox":
        return cvox.AbstractEarcons.LISTBOX;
    case "textbox":
        return cvox.AbstractEarcons.EDITABLE_TEXT;
    case "listitem":
        return cvox.AbstractEarcons.BULLET;
    case "link":
        return cvox.AbstractEarcons.LINK
    }
    return null
};
cvox.AriaUtil.getRoleAttribute = function (a) {
    if (!a.getAttribute) {
        return ""
    }
    var b = a.getAttribute("role");
    a.hasAttribute("chromevoxoriginalrole") && (b = a.getAttribute("chromevoxoriginalrole"));
    return b
};
cvox.AriaUtil.isMath = function (a) {
    return a && a.getAttribute ? "math" == cvox.AriaUtil.getRoleAttribute(a) : !1
};
