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

cvox.DescriptionUtil = {};
cvox.DescriptionUtil.COLLECTION_NODE_TYPE = {
    H1: !0,
    H2: !0,
    H3: !0,
    H4: !0,
    H5: !0,
    H6: !0
};
cvox.DescriptionUtil.getControlDescription = function (a, b) {
    var c = [a];
    if (b && 0 < b.length) {
        c = b
    } else {
        var d = cvox.DomUtil.getSurroundingControl(a);
        d && (c = [d, a])
    }
    c = cvox.DescriptionUtil.getDescriptionFromAncestors(c, !0, cvox.VERBOSITY_VERBOSE);
    if (d) {
        var e = cvox.DomUtil.getName(d);
        0 == e.length && (e = cvox.DomUtil.getControlLabelHeuristics(d), 0 < e.length && (c.context = e + " " + c.context))
    } else {
        e = cvox.DomUtil.getName(a), 0 == e.length && (e = cvox.DomUtil.getControlLabelHeuristics(a), 0 < e.length && (c.text = cvox.DomUtil.collapseWhitespace(e))), d = cvox.DomUtil.getValue(a), 0 < d.length && (c.userValue = cvox.DomUtil.collapseWhitespace(d))
    }
    return c
};
cvox.DescriptionUtil.getDescriptionFromAncestors = function (a, b, c) {
    "undefined" === typeof b && (b = !0);
    var d = a.length,
        e = "",
        f = "",
        g = "",
        h = "",
        k = [],
        l = null;
    0 < d && (f = cvox.DomUtil.getName(a[d - 1], b), g = cvox.DomUtil.getValue(a[d - 1]));
    for (b = d - 1; 0 <= b; b--) {
        var m = a[b],
            p = m.getAttribute ? m.getAttribute("role") : null;
        if ("dialog" != p && "alertdialog" != p) {
            p = cvox.DomUtil.getRole(m, c);
            l || (l = cvox.AuralStyleUtil.getStyleForNode(m));
            if (b < d - 1 && m.hasAttribute("role")) {
                var q = cvox.DomUtil.getName(m, !1);
                q && (p = q + " " + p)
            }
            0 < p.length && (0 < e.length || 0 < h.length && 1 < m.childElementCount ? e = p + " " + cvox.DomUtil.getState(m, !1) + " " + e : h = 0 < h.length ? h + (" " + p + " " + cvox.DomUtil.getState(m, !0)) : p + " " + cvox.DomUtil.getState(m, !0));
            m = cvox.EarconUtil.getEarcon(m);
            null != m && -1 == k.indexOf(m) && k.push(m)
        }
    }
    return new cvox.NavDescription({
        context: cvox.DomUtil.collapseWhitespace(e),
        text: cvox.DomUtil.collapseWhitespace(f),
        userValue: cvox.DomUtil.collapseWhitespace(g),
        annotation: cvox.DomUtil.collapseWhitespace(h),
        earcons: k,
        personality: l
    })
};
cvox.DescriptionUtil.getDescriptionFromNavigation = function (a, b, c, d) {
    if (!a || !b) {
        return []
    }
    if (cvox.DomUtil.isMath(b) && !cvox.AriaUtil.isMath(b)) {
        return cvox.DescriptionUtil.getMathDescription(b)
    }
    if (cvox.DescriptionUtil.COLLECTION_NODE_TYPE[b.tagName]) {
        return cvox.DescriptionUtil.getCollectionDescription(cvox.CursorSelection.fromNode(a), cvox.CursorSelection.fromNode(b))
    }
    var e = cvox.DomUtil.getUniqueAncestors(a, b, !0),
        e = cvox.DescriptionUtil.getDescriptionFromAncestors(e, c, d);
    a = cvox.DomUtil.getUniqueAncestors(b, a);
    cvox.DescriptionUtil.shouldDescribeExit_(a) && (c = cvox.DescriptionUtil.getDescriptionFromAncestors(a, c, d), c.context && !e.context && (e.context = cvox.ChromeVox.msgs.getMsg("exited_container", [c.context])));
    return [e]
};
cvox.DescriptionUtil.getCollectionDescription = function (a, b) {
    var c = cvox.DescriptionUtil.getRawDescriptions_(a, b);
    cvox.DescriptionUtil.insertCollectionDescription_(c);
    return c
};
cvox.DescriptionUtil.subWalker_ = new cvox.BareObjectWalker;
cvox.DescriptionUtil.getRawDescriptions_ = function (a, b) {
    var c = [];
    b = b.clone().setReversed(!1);
    var d = cvox.DescriptionUtil.subWalker_.sync(b).start.node,
        e = a.end.node,
        f = cvox.CursorSelection.fromNode(d);
    if (!f) {
        return []
    }
    for (; cvox.DomUtil.isDescendantOfNode(d, b.start.node);) {
        e = cvox.DomUtil.getUniqueAncestors(e, d);
        cvox.DomUtil.isMath(d) && !cvox.AriaUtil.isMath(d) ? c = c.concat(cvox.DescriptionUtil.getMathDescription(d)) : (e = cvox.DescriptionUtil.getDescriptionFromAncestors(e, !0, cvox.ChromeVox.verbosity), c.push(e));
        f = cvox.DescriptionUtil.subWalker_.next(f);
        if (!f) {
            break
        }
        e = d;
        d = f.start.node
    }
    return c
};
cvox.DescriptionUtil.getFullDescriptionsFromChildren = function (a, b) {
    var c = [];
    if (!b) {
        return c
    }
    var d;
    if (cvox.DomUtil.isLeafNode(b)) {
        return a ? d = cvox.DomUtil.getUniqueAncestors(a, b) : (d = [], d.push(b)), d = cvox.DescriptionUtil.getDescriptionFromAncestors(d, !0, cvox.ChromeVox.verbosity), c.push(d), c
    }
    d = b;
    var e = cvox.CursorSelection.fromNode(b);
    if (!e) {
        return c
    }
    b = cvox.DescriptionUtil.subWalker_.sync(e).start.node;
    e = cvox.CursorSelection.fromNode(b);
    if (!e) {
        return c
    }
    for (; cvox.DomUtil.isDescendantOfNode(b, d);) {
        c = c.concat(cvox.DescriptionUtil.getFullDescriptionsFromChildren(a, b));
        e = cvox.DescriptionUtil.subWalker_.next(e);
        if (!e) {
            break
        }
        a = b;
        b = e.start.node
    }
    return c
};
cvox.DescriptionUtil.insertCollectionDescription_ = function (a) {
    var b = cvox.DescriptionUtil.getAnnotations_(a);
    if (3 <= a.length && 0 == a[0].context.length && 1 == b.length && 0 < b[0].length && cvox.DescriptionUtil.isAnnotationCollection_(b[0])) {
        var b = b[0],
            c = a[0].context;
        a[0].context = "";
        for (var d = 0; d < a.length; d++) {
            a[d].annotation = ""
        }
        a.splice(0, 0, new cvox.NavDescription({
            context: c,
            text: "",
            annotation: cvox.ChromeVox.msgs.getMsg("collection", [b, cvox.ChromeVox.msgs.getNumber(a.length)])
        }))
    }
};
cvox.DescriptionUtil.getAnnotations_ = function (a) {
    for (var b = [], c = 0; c < a.length; ++c) {
        var d = a[c];
        if (-1 == b.indexOf(d.annotation)) {
            var e = cvox.ChromeVox.msgs.getMsg("tag_link"); - 1 != d.annotation.toLowerCase().indexOf(e.toLowerCase()) ? -1 == b.indexOf(e) && b.push(e) : b.push(d.annotation)
        }
    }
    return b
};
cvox.DescriptionUtil.isAnnotationCollection_ = function (a) {
    return a == cvox.ChromeVox.msgs.getMsg("tag_link")
};
cvox.DescriptionUtil.shouldDescribeExit_ = function (a) {
    return a.some(function (a) {
        switch (a.tagName) {
        case "TABLE":
            ;
        case "MATH":
            return !0
        }
        return cvox.AriaUtil.isLandmark(a)
    })
};
cvox.DescriptionUtil.getMathDescription = function (a) {
    var b = cvox.SpeechRuleEngine.getInstance(),
        c = cvox.TraverseMath.getInstance();
    b.parameterize(cvox.MathmlStore.getInstance());
    c.initialize(a);
    a = b.evaluateNode(c.activeNode);
    if (a == []) {
        return [new cvox.NavDescription({
            text: "empty math"
        })]
    }
    cvox.ChromeVox.verbosity == cvox.VERBOSITY_VERBOSE && (a[a.length - 1].annotation = "math");
    a[0].pushEarcon(cvox.AbstractEarcons.SPECIAL_CONTENT);
    return a
};
