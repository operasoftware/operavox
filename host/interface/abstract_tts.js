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

cvox.AbstractTts = function () {
    this.ttsProperties = {};
    this.propertyDefault = {
        rate: 0.5,
        pitch: 0.5,
        volume: 0.5
    };
    this.propertyMin = {
        rate: 0,
        pitch: 0,
        volume: 0
    };
    this.propertyMax = {
        rate: 1,
        pitch: 1,
        volume: 1
    };
    this.propertyStep = {
        rate: 0.1,
        pitch: 0.1,
        volume: 0.1
    };
    if (void 0 == cvox.AbstractTts.pronunciationDictionaryRegexp_) {
        var a = [],
            b;
        for (b in cvox.AbstractTts.PRONUNCIATION_DICTIONARY) {
            a.push(b)
        }
        a = "\\b(" + a.join("|") + ")\\b";
        cvox.AbstractTts.pronunciationDictionaryRegexp_ = RegExp(a, "ig")
    }
    if (void 0 == cvox.AbstractTts.substitutionDictionaryRegexp_) {
        var a = [],
            c;
        for (c in cvox.AbstractTts.SUBSTITUTION_DICTIONARY) {
            a.push(c)
        }
        a = "(" + a.join("|") + ")";
        cvox.AbstractTts.substitutionDictionaryRegexp_ = RegExp(a, "ig")
    }
};
cvox.AbstractTts.prototype.speak = function (a, b, c) {
    return this
};
cvox.AbstractTts.prototype.isSpeaking = function () {
    return !1
};
cvox.AbstractTts.prototype.stop = function () {};
cvox.AbstractTts.prototype.addCapturingEventListener = function (a) {};
cvox.AbstractTts.prototype.increaseOrDecreaseProperty = function (a, b) {
    var c = this.propertyMin[a],
        d = this.propertyMax[a],
        e = this.propertyStep[a],
        f = this.ttsProperties[a];
    this.ttsProperties[a] = Math.max(Math.min(b ? f + e : f - e, d), c)
};
cvox.AbstractTts.prototype.mergeProperties = function (a) {
    var b = {}, c;
    if (this.ttsProperties) {
        for (c in this.ttsProperties) {
            b[c] = this.ttsProperties[c]
        }
    }
    if (a) {
        c = cvox.AbstractTts;
        "number" == typeof a[c.VOLUME] && (b[c.VOLUME] = a[c.VOLUME]);
        "number" == typeof a[c.PITCH] && (b[c.PITCH] = a[c.PITCH]);
        "number" == typeof a[c.RATE] && (b[c.RATE] = a[c.RATE]);
        "string" == typeof a[c.LANG] && (b[c.LANG] = a[c.LANG]);
        var d = this,
            e = function (c, e) {
                if ("number" == typeof a[e] && "number" == typeof b[c]) {
                    b[c] += a[e];
                    var h = d.propertyMin[c],
                        k = d.propertyMax[c];
                    b[c] > k ? b[c] = k : b[c] < h && (b[c] = h)
                }
            };
        e(c.VOLUME, c.RELATIVE_VOLUME);
        e(c.PITCH, c.RELATIVE_PITCH);
        e(c.RATE, c.RELATIVE_RATE)
    }
    return b
};
cvox.AbstractTts.prototype.preprocess = function (a, b) {
    if (1 == a.length && "A" <= a && "Z" >= a) {
        for (var c in cvox.AbstractTts.PERSONALITY_CAPITAL) {
            b[c] = cvox.AbstractTts.PERSONALITY_CAPITAL[c]
        }
    }
    a = a.replace(cvox.AbstractTts.substitutionDictionaryRegexp_, function (a) {
        return " " + cvox.AbstractTts.SUBSTITUTION_DICTIONARY[a] + " "
    });
    if (1 == a.length) {
        return cvox.AbstractTts.CHARACTER_DICTIONARY[a] ? (new goog.i18n.MessageFormat(cvox.ChromeVox.msgs.getMsg(cvox.AbstractTts.CHARACTER_DICTIONARY[a]))).format({
            COUNT: 1
        }) : a.toUpperCase()
    }
    a = a.replace(cvox.AbstractTts.pronunciationDictionaryRegexp_, function (a) {
        return cvox.AbstractTts.PRONUNCIATION_DICTIONARY[a.toLowerCase()]
    });
    a = a.replace(/google\+/ig, "google plus");
    a = a.replace(cvox.AbstractTts.repetitionRegexp_, cvox.AbstractTts.repetitionReplace_);
    var d = !1;
    a.match(/[a-z]+/) || a.indexOf(" ") == a.lastIndexOf(" ") || (d = !0);
    return a = a.replace(/[A-Z]+/g, function (a) {
        return 3 < a.length && a.match(/([AEIOUY])/g) ? a.toLowerCase() : d ? a : " " + a.split("").join(" ")
    })
};
cvox.AbstractTts.RATE = "rate";
cvox.AbstractTts.PITCH = "pitch";
cvox.AbstractTts.VOLUME = "volume";
cvox.AbstractTts.LANG = "lang";
cvox.AbstractTts.RELATIVE_RATE = "relativeRate";
cvox.AbstractTts.RELATIVE_PITCH = "relativePitch";
cvox.AbstractTts.RELATIVE_VOLUME = "relativeVolume";
cvox.AbstractTts.COLOR = "color";
cvox.AbstractTts.FONT_WEIGHT = "fontWeight";
cvox.AbstractTts.PUNCTUATION_ECHO = "punctuationEcho";
cvox.AbstractTts.PAUSE = "pause";
cvox.AbstractTts.PERSONALITY_ANNOTATION = {
    relativePitch: -0.25,
    color: "yellow",
    punctuationEcho: "none"
};
cvox.AbstractTts.PERSONALITY_ANNOUNCEMENT = {
    punctuationEcho: "none"
};
cvox.AbstractTts.PERSONALITY_ASIDE = {
    relativePitch: -0.1,
    color: "#669"
};
cvox.AbstractTts.PERSONALITY_CAPITAL = {
    relativePitch: 0.6
};
cvox.AbstractTts.PERSONALITY_DELETED = {
    punctuationEcho: "none",
    relativePitch: -0.6
};
cvox.AbstractTts.PERSONALITY_QUOTE = {
    relativePitch: 0.1,
    color: "#b6b",
    fontWeight: "bold"
};
cvox.AbstractTts.PERSONALITY_STRONG = {
    relativePitch: 0.1,
    color: "#b66",
    fontWeight: "bold"
};
cvox.AbstractTts.PERSONALITY_EMPHASIS = {
    relativeVolume: 0.1,
    relativeRate: -0.1,
    color: "#6bb",
    fontWeight: "bold"
};
cvox.AbstractTts.DEBUG = !0;
cvox.AbstractTts.QUEUE_MODE_FLUSH = 0;
cvox.AbstractTts.QUEUE_MODE_QUEUE = 1;
cvox.AbstractTts.CHARACTER_DICTIONARY = {
    " ": "space",
    "`": "backtick",
    "~": "tilde",
    "!": "exclamation",
    "@": "at",
    "#": "pound",
    $: "dollar",
    "%": "percent",
    "^": "caret",
    "&": "ampersand",
    "*": "asterisk",
    "(": "open_paren",
    ")": "close_paren",
    "-": "dash",
    _: "underscore",
    "=": "equals",
    "+": "plus",
    "[": "left_bracket",
    "]": "right_bracket",
    "{": "left_brace",
    "}": "right_brace",
    "|": "pipe",
    ";": "semicolon",
    ":": "colon",
    ",": "comma",
    ".": "dot",
    "<": "less_than",
    ">": "greater_than",
    "/": "slash",
    "?": "question_mark",
    '"': "quote",
    "'": "apostrophe",
    "\t": "tab",
    "\r": "return",
    "\n": "new line",
    "\\": "backslash"
};
cvox.AbstractTts.PRONUNCIATION_DICTIONARY = {
    admob: "ad-mob",
    adsense: "ad-sense",
    adwords: "ad-words",
    angularjs: "angular j s",
    bcc: "B C C",
    cc: "C C",
    chromevox: "chrome vox",
    cr48: "C R 48",
    ctrl: "control",
    doubleclick: "double-click",
    gmail: "gee mail",
    gtalk: "gee talk",
    http: "H T T P",
    https: "H T T P S",
    igoogle: "eye google",
    pagerank: "page-rank",
    username: "user-name",
    www: "W W W",
    youtube: "you tube"
};
cvox.AbstractTts.SUBSTITUTION_DICTIONARY = {
    "://": "colon slash slash",
    "\u00bc": "one fourth",
    "\u00bd": "one half",
    "\u200e": "left to right mark",
    "\u2190": "left arrow",
    "\u2191": "up arrow",
    "\u2192": "right arrow",
    "\u2193": "down arrow",
    "\u21d0": "left double arrow",
    "\u21d1": "up double arrow",
    "\u21d2": "right double  arrow",
    "\u21d3": "down double arrow",
    "\u21e6": "left arrow",
    "\u21e7": "up arrow",
    "\u21e8": "right arrow",
    "\u21e9": "down arrow",
    "\u2303": "control",
    "\u2318": "command",
    "\u2325": "option",
    "\u25b2": "up triangle",
    "\u25b3": "up triangle",
    "\u25b4": "up triangle",
    "\u25b5": "up triangle",
    "\u25b6": "right triangle",
    "\u25b7": "right triangle",
    "\u25b8": "right triangle",
    "\u25b9": "right triangle",
    "\u25ba": "right pointer",
    "\u25bb": "right pointer",
    "\u25bc": "down triangle",
    "\u25bd": "down triangle",
    "\u25be": "down triangle",
    "\u25bf": "down triangle",
    "\u25c0": "left triangle",
    "\u25c1": "left triangle",
    "\u25c2": "left triangle",
    "\u25c3": "left triangle",
    "\u25c4": "left pointer",
    "\u25c5": "left pointer",
    "\uf8ff": "apple"
};
cvox.AbstractTts.repetitionRegexp_ = /([-\/\\|!@#$%^&*\(\)=_+\[\]\{\}.?;'":<>])\1{2,}/g;
cvox.AbstractTts.repetitionReplace_ = function (a) {
    var b = a.length;
    return " " + (new goog.i18n.MessageFormat(cvox.ChromeVox.msgs.getMsg(cvox.AbstractTts.CHARACTER_DICTIONARY[a[0]]))).format({
        COUNT: b
    }) + " "
};
cvox.AbstractTts.prototype.getDefaultProperty = function (a) {
    return this.propertyDefault[a]
};
