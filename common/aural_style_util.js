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

cvox.AuralStyleConverter = {};
cvox.AuralStyleUtil = {};
cvox.AuralProperty = {
    VOLUME: "VOLUME",
    SPEAK: "SPEAK",
    PAUSE_BEFORE: "PAUSE_BEFORE",
    PAUSE_AFTER: "PAUSE_AFTER",
    PAUSE: "PAUSE",
    CUE_BEFORE: "CUE_BEFORE",
    CUE_AFTER: "CUE_AFTER",
    CUE: "CUE",
    PLAY_DURING: "PLAY_DURING",
    AZIMUTH: "AZIMUTH",
    ELEVATION: "ELEVATION",
    SPEECH_RATE: "SPEECH_RATE",
    VOICE_FAMILY: "VOICE_FAMILY",
    PITCH: "PITCH",
    PITCH_RANGE: "PITCH_RANGE",
    STRESS: "STRESS",
    RICHNESS: "RICHNESS",
    SPEAK_PUNCTUATION: "SPEAK_PUNCTUATION",
    SPEAK_NUMERIAL: "SPEAK_NUMERIAL",
    SPEAK_HEADER: "SPEAK_HEADER",
    NONE: "NONE"
};
cvox.AuralStyleConverter.identity = function (a) {
    return a
};
cvox.AuralStyleConverter.propertyTable = {
    VOLUME: "volume",
    SPEAK: "no-op",
    PAUSE_BEFORE: "no-op",
    PAUSE_AFTER: "no-op",
    PAUSE: "no-op",
    CUE_BEFORE: "no-op",
    CUE_AFTER: "no-op",
    CUE: "no-op",
    PLAY_DURING: "no-op",
    AZIMUTH: "no-op",
    ELEVATION: "no-op",
    SPEECH_RATE: "relativeRate",
    VOICE_FAMILY: "no-op",
    PITCH: "relativePitch",
    PITCH_RANGE: "no-op",
    STRESS: "no-op",
    RICHNESS: "no-op",
    SPEAK_PUNCTUATION: "no-op",
    SPEAK_NUMERIAL: "no-op",
    SPEAK_HEADER: "no-op",
    NONE: "no-op"
};
cvox.AuralStyleConverter.valueTable = {
    VOLUME: cvox.AuralStyleConverter.identity,
    SPEAK: cvox.AuralStyleConverter.identity,
    PAUSE_BEFORE: cvox.AuralStyleConverter.identity,
    PAUSE_AFTER: cvox.AuralStyleConverter.identity,
    PAUSE: cvox.AuralStyleConverter.identity,
    CUE_BEFORE: cvox.AuralStyleConverter.identity,
    CUE_AFTER: cvox.AuralStyleConverter.identity,
    CUE: cvox.AuralStyleConverter.identity,
    PLAY_DURING: cvox.AuralStyleConverter.identity,
    AZIMUTH: cvox.AuralStyleConverter.identity,
    ELEVATION: cvox.AuralStyleConverter.identity,
    SPEECH_RATE: cvox.AuralStyleConverter.identity,
    VOICE_FAMILY: cvox.AuralStyleConverter.identity,
    PITCH: cvox.AuralStyleConverter.identity,
    PITCH_RANGE: cvox.AuralStyleConverter.identity,
    STRESS: cvox.AuralStyleConverter.identity,
    RICHNESS: cvox.AuralStyleConverter.identity,
    SPEAK_PUNCTUATION: cvox.AuralStyleConverter.identity,
    SPEAK_NUMERIAL: cvox.AuralStyleConverter.identity,
    SPEAK_HEADER: cvox.AuralStyleConverter.identity,
    NONE: cvox.AuralStyleConverter.identity
};
cvox.AuralStyleConverter.convertRule = function (a, b) {
    return {
        property: cvox.AuralStyleConverter.propertyTable[a],
        value: cvox.AuralStyleConverter.valueTable[a](b)
    }
};
cvox.AuralStyleConverter.convertStyle = function (a) {
    var b = {}, c;
    for (c in a) {
        var d = cvox.AuralStyleConverter.convertRule(c, a[c]);
        b[d.property] = d.value
    }
    return b
};
cvox.AuralStyleUtil.getStyleForNode = function (a) {
    return (a = cvox.AuralStyleUtil.defaultStyles[a.tagName]) ? cvox.AuralStyleConverter.convertStyle(a) : null
};
cvox.AuralStyleUtil.defaultStyles = {
    ARTICLE: {
        PITCH: -0.1
    },
    ASIDE: {
        PITCH: -0.1
    },
    FOOTER: {
        PITCH: -0.1
    },
    H1: {
        PITCH: -0.3
    },
    H2: {
        PITCH: -0.25
    },
    H3: {
        PITCH: -0.2
    },
    H4: {
        PITCH: -0.15
    },
    H5: {
        PITCH: -0.1
    },
    H6: {
        PITCH: -0.05
    },
    HEADER: {
        PITCH: -0.1
    },
    HGROUP: {
        PITCH: -0.1
    },
    MARK: {
        PITCH: -0.1
    },
    NAV: {
        PITCH: -0.1
    },
    SECTION: {
        PITCH: -0.1
    },
    TIME: {
        PITCH: -0.1
    }
};
