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

cvox.DomPredicates = {};
cvox.DomPredicates.checkboxPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if (a[b].getAttribute && "checkbox" == a[b].getAttribute("role") || "INPUT" == a[b].tagName && "checkbox" == a[b].type) {
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.radioPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if (a[b].getAttribute && "radio" == a[b].getAttribute("role") || "INPUT" == a[b].tagName && "radio" == a[b].type) {
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.sliderPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if (a[b].getAttribute && "slider" == a[b].getAttribute("role") || "INPUT" == a[b].tagName && "range" == a[b].type) {
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.graphicPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if ("IMG" == a[b].tagName || "INPUT" == a[b].tagName && "img" == a[b].type) {
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.buttonPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if (a[b].getAttribute && "button" == a[b].getAttribute("role") || "BUTTON" == a[b].tagName || "INPUT" == a[b].tagName && "submit" == a[b].type || "INPUT" == a[b].tagName && "button" == a[b].type || "INPUT" == a[b].tagName && "reset" == a[b].type) {
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.comboBoxPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if (a[b].getAttribute && "combobox" == a[b].getAttribute("role") || "SELECT" == a[b].tagName) {
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.editTextPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if (a[b].getAttribute && "textbox" == a[b].getAttribute("role") || "TEXTAREA" == a[b].tagName || a[b].isContentEditable || "INPUT" == a[b].tagName && cvox.DomUtil.isInputTypeText(a[b])) {
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.headingPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if (a[b].getAttribute && "heading" == a[b].getAttribute("role")) {
            return a[b]
        }
        switch (a[b].tagName) {
        case "H1":
            ;
        case "H2":
            ;
        case "H3":
            ;
        case "H4":
            ;
        case "H5":
            ;
        case "H6":
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.heading1Predicate = function (a) {
    return cvox.DomPredicates.containsTagName_(a, "H1")
};
cvox.DomPredicates.heading2Predicate = function (a) {
    return cvox.DomPredicates.containsTagName_(a, "H2")
};
cvox.DomPredicates.heading3Predicate = function (a) {
    return cvox.DomPredicates.containsTagName_(a, "H3")
};
cvox.DomPredicates.heading4Predicate = function (a) {
    return cvox.DomPredicates.containsTagName_(a, "H4")
};
cvox.DomPredicates.heading5Predicate = function (a) {
    return cvox.DomPredicates.containsTagName_(a, "H5")
};
cvox.DomPredicates.heading6Predicate = function (a) {
    return cvox.DomPredicates.containsTagName_(a, "H6")
};
cvox.DomPredicates.linkPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if (a[b].getAttribute && "link" == a[b].getAttribute("role") || "A" == a[b].tagName && a[b].href) {
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.tablePredicate = function (a) {
    return (a = cvox.DomUtil.findTableNodeInList(a, {
        allowCaptions: !0
    })) && !cvox.DomUtil.isLayoutTable(a) ? a : null
};
cvox.DomPredicates.cellPredicate = function (a) {
    for (var b = a.length - 1; 0 <= b; --b) {
        var c = a[b];
        if ("TD" == c.tagName || "TH" == c.tagName || c.getAttribute && "gridcell" == c.getAttribute("role")) {
            return c
        }
    }
    return null
};
cvox.DomPredicates.visitedLinkPredicate = function (a) {
    for (var b = a.length - 1; 0 <= b; --b) {
        if (cvox.DomPredicates.linkPredicate([a[b]]) && cvox.ChromeVox.visitedUrls[a[b].href]) {
            return a[b]
        }
    }
};
cvox.DomPredicates.listPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if (a[b].getAttribute && "list" == a[b].getAttribute("role") || "UL" == a[b].tagName || "OL" == a[b].tagName) {
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.listItemPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if (a[b].getAttribute && "listitem" == a[b].getAttribute("role") || "LI" == a[b].tagName) {
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.blockquotePredicate = function (a) {
    return cvox.DomPredicates.containsTagName_(a, "BLOCKQUOTE")
};
cvox.DomPredicates.formFieldPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if (cvox.DomUtil.isControl(a[b])) {
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.landmarkPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if (cvox.AriaUtil.isLandmark(a[b])) {
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.containsTagName_ = function (a, b) {
    for (var c = a.length; c--;) {
        if (a[c].tagName == b) {
            return a[c]
        }
    }
    return null
};
cvox.DomPredicates.mathPredicate = function (a) {
    return cvox.DomUtil.findMathNodeInList(a)
};
cvox.DomPredicates.sectionPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if (cvox.DomUtil.isSemanticElt(a[b]) || cvox.AriaUtil.isLandmark(a[b]) || a[b].getAttribute && "heading" == a[b].getAttribute("role")) {
            return a[b]
        }
        switch (a[b].tagName) {
        case "H1":
            ;
        case "H2":
            ;
        case "H3":
            ;
        case "H4":
            ;
        case "H5":
            ;
        case "H6":
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.controlPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if (cvox.DomUtil.isControl(a[b]) || a[b].getAttribute && "link" == a[b].getAttribute("role") || "A" == a[b].tagName && a[b].href) {
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.captionPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if ("CAPTION" == a[b].tagName) {
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.articlePredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if (a[b].getAttribute && "article" == a[b].getAttribute("role") || "ARTICLE" == a[b].tagName) {
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.mediaPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if ("AUDIO" == a[b].tagName || "VIDEO" == a[b].tagName) {
            return a[b]
        }
    }
    return null
};
cvox.DomPredicates.orderedListPredicate = function (a) {
    for (var b = 0; b < a.length; b++) {
        if ("OL" == a[b].tagName) {
            return a[b]
        }
    }
    return null
};
