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

cvox.LiveRegions = function () {};
cvox.LiveRegions.pageLoadTime = null;
cvox.LiveRegions.INITIAL_SILENCE_MS = 2E3;
cvox.LiveRegions.lastAnnouncedMap = {};
cvox.LiveRegions.MAX_DISCARD_DUPS_MS = 2E3;
cvox.LiveRegions.lastAnnouncedTime = null;
cvox.LiveRegions.nodesAlreadyHandled = [];
cvox.LiveRegions.init = function (a, b, c) {
    void 0 == b && (b = cvox.AbstractTts.QUEUE_MODE_FLUSH);
    cvox.LiveRegions.pageLoadTime = a;
    if (c || !document.hasFocus()) {
        return !1
    }
    var d = !1;
    a = cvox.AriaUtil.getLiveRegions(document.body);
    for (c = 0; c < a.length; c++) {
        cvox.LiveRegions.handleOneChangedNode(a[c], a[c], !1, !1, function (a, c) {
            a || b != cvox.AbstractTts.QUEUE_MODE_FLUSH || (b = cvox.AbstractTts.QUEUE_MODE_QUEUE);
            (new cvox.NavigationSpeaker).speakDescriptionArray(c, b, null);
            d = !0
        })
    }
    cvox.Interframe.addListener(function (a) {
        if ("speakLiveRegion" == a.command) {
            for (var b = document.getElementsByTagName("iframe"), c = 0, d; d = b[c]; c++) {
                if (d.src == a.src) {
                    if (!cvox.DomUtil.isVisible(d)) {
                        break
                    }
                    d = JSON.parse(a.content);
                    for (var k = [], l = 0, m; m = d[l]; l++) {
                        k.push(new cvox.NavDescription(m))
                    }
                    (new cvox.NavigationSpeaker).speakDescriptionArray(k, a.queueMode, null)
                }
            }
        }
    });
    return d
};
cvox.LiveRegions.processMutations = function (a, b) {
    cvox.LiveRegions.nodesAlreadyHandled = [];
    a.forEach(function (a) {
        if (!a.target.hasAttribute || !a.target.hasAttribute("cvoxIgnore")) {
            if (a.addedNodes) {
                for (var d = 0; d < a.addedNodes.length; d++) {
                    a.addedNodes[d].hasAttribute && a.addedNodes[d].hasAttribute("cvoxIgnore") || cvox.LiveRegions.handleOneChangedNode(a.addedNodes[d], a.target, !1, !0, b)
                }
            }
            if (a.removedNodes) {
                for (d = 0; d < a.removedNodes.length; d++) {
                    a.removedNodes[d].hasAttribute && a.removedNodes[d].hasAttribute("cvoxIgnore") || cvox.LiveRegions.handleOneChangedNode(a.removedNodes[d], a.target, !0, !1, b)
                }
            }
            "characterData" == a.type && cvox.LiveRegions.handleOneChangedNode(a.target, a.target, !1, !1, b);
            if ("class" == a.attributeName || "style" == a.attributeName || "hidden" == a.attributeName) {
                var e = a.attributeName,
                    d = a.target,
                    f = !cvox.DomUtil.isVisible(d),
                    g = document.createElement("div");
                g.setAttribute("cvoxIgnore", "1");
                g.setAttribute("class", d.getAttribute("class"));
                g.setAttribute("style", d.getAttribute("style"));
                g.setAttribute("hidden", d.getAttribute("hidden"));
                g.setAttribute(e, a.oldValue);
                e = !0;
                d.parentElement ? (d.parentElement.appendChild(g), e = !cvox.DomUtil.isVisible(g), d.parentElement.removeChild(g)) : e = !cvox.DomUtil.isVisible(g);
                !0 === e && !1 === f ? cvox.LiveRegions.handleOneChangedNode(a.target, a.target, !1, !0, b) : !1 === e && !0 === f && cvox.LiveRegions.handleOneChangedNode(a.target, a.target, !0, !1, b)
            }
        }
    });
    cvox.LiveRegions.nodesAlreadyHandled.length = 0
};
cvox.LiveRegions.handleOneChangedNode = function (a, b, c, d, e) {
    var f = c ? b : a;
    f instanceof Element || (f = f.parentElement);
    for (; f && !cvox.AriaUtil.getAriaLive(f);) {
        f = f.parentElement
    }
    if (!f) {
        if (d && a != document.body) {
            for (a = cvox.AriaUtil.getLiveRegions(a), d = 0; d < a.length; d++) {
                cvox.LiveRegions.handleOneChangedNode(a[d], b, c, !1, e)
            }
        }
    } else {
        if (!(0 <= cvox.LiveRegions.nodesAlreadyHandled.indexOf(a) || (cvox.LiveRegions.nodesAlreadyHandled.push(a), cvox.AriaUtil.getAriaBusy(f)))) {
            if (c) {
                if (!cvox.AriaUtil.getAriaRelevant(f, "removals")) {
                    return
                }
            } else {
                if (!cvox.AriaUtil.getAriaRelevant(f, "additions")) {
                    return
                }
            }
            cvox.LiveRegions.announceChange(a, f, c, e)
        }
    }
};
cvox.LiveRegions.announceChange = function (a, b, c, d) {
    var e = new Date - cvox.LiveRegions.pageLoadTime;
    if (!("alert" != cvox.AriaUtil.getRoleAttribute(b) && e < cvox.LiveRegions.INITIAL_SILENCE_MS) && cvox.DomUtil.isVisible(b)) {
        if (a != b) {
            for (var f = a.parentElement; f;) {
                (cvox.AriaUtil.getAriaAtomic(f) || cvox.AriaUtil.isLeafElement(f) || cvox.AriaUtil.isControlWidget(f)) && !cvox.AriaUtil.isCompositeControl(f) && (a = f);
                if (f == b) {
                    break
                }
                f = f.parentElement
            }
        }
        a = cvox.LiveRegions.getNavDescriptionsRecursive(a);
        if (0 != a.length) {
            c && (a = [new cvox.NavDescription({
                context: cvox.ChromeVox.msgs.getMsg("live_regions_removed"),
                text: ""
            })].concat(a));
            if ("alert" == cvox.AriaUtil.getRoleAttribute(b) && e < cvox.LiveRegions.INITIAL_SILENCE_MS) {
                c = "";
                for (e = 0; e < a.length; e++) {
                    c += a[e].text, c += a[e].userValue
                }
                if ("" == cvox.DomUtil.collapseWhitespace(c)) {
                    return
                }
            }
            c = new Date;
            for (var g in cvox.LiveRegions.lastAnnouncedMap) {
                c - cvox.LiveRegions.lastAnnouncedMap[g] > cvox.LiveRegions.MAX_DISCARD_DUPS_MS && delete cvox.LiveRegions.lastAnnouncedMap[g]
            }
            g = a.reduce(function (a, b) {
                return a + "|" + b.text
            }, "");
            cvox.LiveRegions.lastAnnouncedMap[g] || (cvox.LiveRegions.lastAnnouncedMap[g] = c, b = "assertive" == cvox.AriaUtil.getAriaLive(b), cvox.Interframe.isIframe() && !document.hasFocus() ? cvox.Interframe.sendMessageToParentWindow({
                command: "speakLiveRegion",
                content: JSON.stringify(a),
                queueMode: b ? 0 : 1,
                src: window.location.href
            }) : d(b, a))
        }
    }
};
cvox.LiveRegions.getNavDescriptionsRecursive = function (a) {
    return cvox.AriaUtil.getAriaAtomic(a) || cvox.DomUtil.isLeafNode(a) ? (a = cvox.DescriptionUtil.getDescriptionFromAncestors([a], !0, cvox.ChromeVox.verbosity), a.isEmpty() ? [] : [a]) : cvox.DescriptionUtil.getFullDescriptionsFromChildren(null, a)
};
