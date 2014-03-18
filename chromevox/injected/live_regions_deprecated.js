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

cvox.LiveRegionsDeprecated = function () {};
cvox.LiveRegionsDeprecated.trackedRegions = [];
cvox.LiveRegionsDeprecated.previousRegionValue = [];
cvox.LiveRegionsDeprecated.pageLoadTime = null;
cvox.LiveRegionsDeprecated.INITIAL_SILENCE_MS = 2E3;
cvox.LiveRegionsDeprecated.init = function (a, b, c) {
    void 0 == b && (b = cvox.AbstractTts.QUEUE_MODE_FLUSH);
    cvox.LiveRegionsDeprecated.pageLoadTime = a;
    a = !1;
    for (var d = cvox.AriaUtil.getLiveRegions(document.body), e = 0; e < d.length; e++) {
        cvox.LiveRegionsDeprecated.updateLiveRegion(d[e], b, c) && (a = !0, b = cvox.AbstractTts.QUEUE_MODE_QUEUE)
    }
    return a
};
cvox.LiveRegionsDeprecated.updateLiveRegion = function (a, b, c) {
    if (cvox.AriaUtil.getAriaBusy(a) || !cvox.DomUtil.isVisible(a)) {
        return !1
    }
    var d = cvox.LiveRegionsDeprecated.trackedRegions.indexOf(a),
        e;
    0 <= d ? e = cvox.LiveRegionsDeprecated.previousRegionValue[d] : (d = cvox.LiveRegionsDeprecated.trackedRegions.length, e = [], cvox.LiveRegionsDeprecated.trackedRegions.push(a), cvox.LiveRegionsDeprecated.previousRegionValue.push([]));
    var f = cvox.LiveRegionsDeprecated.buildCurrentLiveRegionValue(a),
        g = new Date - cvox.LiveRegionsDeprecated.pageLoadTime;
    if ("alert" != cvox.AriaUtil.getRoleAttribute(a) && g < cvox.LiveRegionsDeprecated.INITIAL_SILENCE_MS) {
        return cvox.LiveRegionsDeprecated.previousRegionValue[d] = f, !1
    }
    if ("alert" == cvox.AriaUtil.getRoleAttribute(a) && g < cvox.LiveRegionsDeprecated.INITIAL_SILENCE_MS) {
        for (var h = "", g = 0; g < f.length; g++) {
            h += f[g].text, h += f[g].userValue
        }
        if ("" == cvox.DomUtil.collapseWhitespace(h)) {
            return cvox.LiveRegionsDeprecated.previousRegionValue[d] = f, !1
        }
    }
    for (var k = {}, g = 0; g < e.length; g++) {
        k[e[g].toString()] = !0
    }
    for (var l = {}, g = 0; g < f.length; g++) {
        l[f[g].toString()] = !0
    }
    h = [];
    if (cvox.AriaUtil.getAriaRelevant(a, "additions")) {
        for (g = 0; g < f.length; g++) {
            k[f[g].toString()] || h.push(f[g])
        }
    }
    k = [];
    if (cvox.AriaUtil.getAriaRelevant(a, "removals")) {
        for (g = 0; g < e.length; g++) {
            l[e[g].toString()] || k.push(e[g])
        }
    }
    e = [];
    e = 0 == h.length && 0 < k.length ? [new cvox.NavDescription({
        context: cvox.ChromeVox.msgs.getMsg("live_regions_removed"),
        text: ""
    })].concat(k) : h;
    cvox.LiveRegionsDeprecated.previousRegionValue[d] = f;
    if (c || 0 == e.length) {
        return !1
    }
    "polite" == cvox.AriaUtil.getAriaLive(a) && (b = cvox.AbstractTts.QUEUE_MODE_QUEUE);
    for (g = 0; g < e.length; g++) {
        e[g].speak(b), b = cvox.AbstractTts.QUEUE_MODE_QUEUE
    }
    return !0
};
cvox.LiveRegionsDeprecated.buildCurrentLiveRegionValue = function (a) {
    if (cvox.AriaUtil.getAriaAtomic(a) || cvox.DomUtil.isLeafNode(a)) {
        var b = cvox.DescriptionUtil.getDescriptionFromAncestors([a], !0, cvox.ChromeVox.verbosity);
        return b.isEmpty() ? [] : [b]
    }
    var c = [],
        b = cvox.DescriptionUtil.getDescriptionFromAncestors([a], !1, cvox.ChromeVox.verbosity);
    b.isEmpty() || c.push(b);
    for (b = 0; b < a.childNodes.length; b++) {
        var d = a.childNodes[b];
        cvox.DomUtil.isVisible(d, {
            checkAncestors: !1
        }) && !cvox.AriaUtil.isHidden(d) && (d = cvox.LiveRegionsDeprecated.buildCurrentLiveRegionValue(d), c = c.concat(d))
    }
    return c
};
