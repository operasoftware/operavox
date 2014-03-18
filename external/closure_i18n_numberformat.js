// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.i18n.NumberFormat = function (a, b, c) {
    this.intlCurrencyCode_ = b || goog.i18n.NumberFormatSymbols.DEF_CURRENCY_CODE;
    this.currencyStyle_ = c || goog.i18n.NumberFormat.CurrencyStyle.LOCAL;
    this.maximumIntegerDigits_ = 40;
    this.minimumIntegerDigits_ = 1;
    this.significantDigits_ = 0;
    this.maximumFractionDigits_ = 3;
    this.minExponentDigits_ = this.minimumFractionDigits_ = 0;
    this.showTrailingZeros_ = this.useSignForPositiveExponent_ = !1;
    this.positiveSuffix_ = this.positivePrefix_ = "";
    this.negativePrefix_ = "-";
    this.negativeSuffix_ = "";
    this.multiplier_ = 1;
    this.groupingSize_ = 3;
    this.useExponentialNotation_ = this.decimalSeparatorAlwaysShown_ = !1;
    this.compactStyle_ = goog.i18n.NumberFormat.CompactStyle.NONE;
    this.baseFormattingNumber_ = null;
    "number" == typeof a ? this.applyStandardPattern_(a) : this.applyPattern_(a)
};
goog.i18n.NumberFormat.Format = {
    DECIMAL: 1,
    SCIENTIFIC: 2,
    PERCENT: 3,
    CURRENCY: 4,
    COMPACT_SHORT: 5,
    COMPACT_LONG: 6
};
goog.i18n.NumberFormat.CurrencyStyle = {
    LOCAL: 0,
    PORTABLE: 1,
    GLOBAL: 2
};
goog.i18n.NumberFormat.CompactStyle = {
    NONE: 0,
    SHORT: 1,
    LONG: 2
};
goog.i18n.NumberFormat.enforceAsciiDigits_ = !1;
goog.i18n.NumberFormat.setEnforceAsciiDigits = function (a) {
    goog.i18n.NumberFormat.enforceAsciiDigits_ = a
};
goog.i18n.NumberFormat.isEnforceAsciiDigits = function () {
    return goog.i18n.NumberFormat.enforceAsciiDigits_
};
goog.i18n.NumberFormat.prototype.setMinimumFractionDigits = function (a) {
    if (a > this.maximumFractionDigits_) {
        throw Error("Min value must be less than max value");
    }
    if (0 < this.significantDigits_ && 0 < a) {
        throw Error("Can't combine significant digits and minimum fraction digits");
    }
    this.minimumFractionDigits_ = a
};
goog.i18n.NumberFormat.prototype.setMaximumFractionDigits = function (a) {
    if (this.minimumFractionDigits_ > a) {
        throw Error("Min value must be less than max value");
    }
    this.maximumFractionDigits_ = a
};
goog.i18n.NumberFormat.prototype.setSignificantDigits = function (a) {
    if (0 < this.minimumFractionDigits_ && 0 <= a) {
        throw Error("Can't combine significant digits and minimum fraction digits");
    }
    this.significantDigits_ = a
};
goog.i18n.NumberFormat.prototype.getSignificantDigits = function () {
    return this.significantDigits_
};
goog.i18n.NumberFormat.prototype.setShowTrailingZeros = function (a) {
    this.showTrailingZeros_ = a
};
goog.i18n.NumberFormat.prototype.setBaseFormatting = function (a) {
    goog.asserts.assert(goog.isNull(a) || isFinite(a));
    this.baseFormattingNumber_ = a
};
goog.i18n.NumberFormat.prototype.applyPattern_ = function (a) {
    this.pattern_ = a.replace(/ /g, "\u00a0");
    var b = [0];
    this.positivePrefix_ = this.parseAffix_(a, b);
    var c = b[0];
    this.parseTrunk_(a, b);
    c = b[0] - c;
    this.positiveSuffix_ = this.parseAffix_(a, b);
    b[0] < a.length && a.charAt(b[0]) == goog.i18n.NumberFormat.PATTERN_SEPARATOR_ ? (b[0]++, this.negativePrefix_ = this.parseAffix_(a, b), b[0] += c, this.negativeSuffix_ = this.parseAffix_(a, b)) : (this.negativePrefix_ = this.positivePrefix_ + this.negativePrefix_, this.negativeSuffix_ += this.positiveSuffix_)
};
goog.i18n.NumberFormat.prototype.applyStandardPattern_ = function (a) {
    switch (a) {
    case goog.i18n.NumberFormat.Format.DECIMAL:
        this.applyPattern_(goog.i18n.NumberFormatSymbols.DECIMAL_PATTERN);
        break;
    case goog.i18n.NumberFormat.Format.SCIENTIFIC:
        this.applyPattern_(goog.i18n.NumberFormatSymbols.SCIENTIFIC_PATTERN);
        break;
    case goog.i18n.NumberFormat.Format.PERCENT:
        this.applyPattern_(goog.i18n.NumberFormatSymbols.PERCENT_PATTERN);
        break;
    case goog.i18n.NumberFormat.Format.CURRENCY:
        this.applyPattern_(goog.i18n.currency.adjustPrecision(goog.i18n.NumberFormatSymbols.CURRENCY_PATTERN, this.intlCurrencyCode_));
        break;
    case goog.i18n.NumberFormat.Format.COMPACT_SHORT:
        this.applyCompactStyle_(goog.i18n.NumberFormat.CompactStyle.SHORT);
        break;
    case goog.i18n.NumberFormat.Format.COMPACT_LONG:
        this.applyCompactStyle_(goog.i18n.NumberFormat.CompactStyle.LONG);
        break;
    default:
        throw Error("Unsupported pattern type.");
    }
};
goog.i18n.NumberFormat.prototype.applyCompactStyle_ = function (a) {
    this.compactStyle_ = a;
    this.applyPattern_(goog.i18n.NumberFormatSymbols.DECIMAL_PATTERN);
    this.setMinimumFractionDigits(0);
    this.setMaximumFractionDigits(2);
    this.setSignificantDigits(2)
};
goog.i18n.NumberFormat.prototype.parse = function (a, b) {
    var c = b || [0];
    if (this.compactStyle_ != goog.i18n.NumberFormat.CompactStyle.NONE) {
        throw Error("Parsing of compact numbers is unimplemented");
    }
    var d = NaN;
    a = a.replace(/ /g, "\u00a0");
    var e = a.indexOf(this.positivePrefix_, c[0]) == c[0],
        f = a.indexOf(this.negativePrefix_, c[0]) == c[0];
    e && f && (this.positivePrefix_.length > this.negativePrefix_.length ? f = !1 : this.positivePrefix_.length < this.negativePrefix_.length && (e = !1));
    e ? c[0] += this.positivePrefix_.length : f && (c[0] += this.negativePrefix_.length);
    a.indexOf(goog.i18n.NumberFormatSymbols.INFINITY, c[0]) == c[0] ? (c[0] += goog.i18n.NumberFormatSymbols.INFINITY.length, d = Infinity) : d = this.parseNumber_(a, c);
    if (e) {
        if (a.indexOf(this.positiveSuffix_, c[0]) != c[0]) {
            return NaN
        }
        c[0] += this.positiveSuffix_.length
    } else {
        if (f) {
            if (a.indexOf(this.negativeSuffix_, c[0]) != c[0]) {
                return NaN
            }
            c[0] += this.negativeSuffix_.length
        }
    }
    return f ? -d : d
};
goog.i18n.NumberFormat.prototype.parseNumber_ = function (a, b) {
    var c = !1,
        d = !1,
        e = !1,
        f = 1,
        g = goog.i18n.NumberFormatSymbols.DECIMAL_SEP,
        h = goog.i18n.NumberFormatSymbols.GROUP_SEP,
        k = goog.i18n.NumberFormatSymbols.EXP_SYMBOL;
    if (this.compactStyle_ != goog.i18n.NumberFormat.CompactStyle.NONE) {
        throw Error("Parsing of compact style numbers is not implemented");
    }
    for (var l = ""; b[0] < a.length; b[0]++) {
        var m = a.charAt(b[0]),
            p = this.getDigit_(m);
        if (0 <= p && 9 >= p) {
            l += p, e = !0
        } else {
            if (m == g.charAt(0)) {
                if (c || d) {
                    break
                }
                l += ".";
                c = !0
            } else {
                if (m == h.charAt(0) && ("\u00a0" != h.charAt(0) || b[0] + 1 < a.length && 0 <= this.getDigit_(a.charAt(b[0] + 1)))) {
                    if (c || d) {
                        break
                    }
                } else {
                    if (m == k.charAt(0)) {
                        if (d) {
                            break
                        }
                        l += "E";
                        d = !0
                    } else {
                        if ("+" == m || "-" == m) {
                            l += m
                        } else {
                            if (m == goog.i18n.NumberFormatSymbols.PERCENT.charAt(0)) {
                                if (1 != f) {
                                    break
                                }
                                f = 100;
                                if (e) {
                                    b[0]++;
                                    break
                                }
                            } else {
                                if (m == goog.i18n.NumberFormatSymbols.PERMILL.charAt(0)) {
                                    if (1 != f) {
                                        break
                                    }
                                    f = 1E3;
                                    if (e) {
                                        b[0]++;
                                        break
                                    }
                                } else {
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return parseFloat(l) / f
};
goog.i18n.NumberFormat.prototype.format = function (a) {
    if (isNaN(a)) {
        return goog.i18n.NumberFormatSymbols.NAN
    }
    var b = [],
        c = goog.isNull(this.baseFormattingNumber_) ? a : this.baseFormattingNumber_,
        c = this.getUnitAfterRounding_(c, a);
    a /= Math.pow(10, c.divisorBase);
    b.push(c.prefix);
    var d = 0 > a || 0 == a && 0 > 1 / a;
    b.push(d ? this.negativePrefix_ : this.positivePrefix_);
    isFinite(a) ? (a = a * (d ? -1 : 1) * this.multiplier_, this.useExponentialNotation_ ? this.subformatExponential_(a, b) : this.subformatFixed_(a, this.minimumIntegerDigits_, b)) : b.push(goog.i18n.NumberFormatSymbols.INFINITY);
    b.push(d ? this.negativeSuffix_ : this.positiveSuffix_);
    b.push(c.suffix);
    return b.join("")
};
goog.i18n.NumberFormat.prototype.roundNumber_ = function (a) {
    var b = Math.pow(10, this.maximumFractionDigits_),
        c = 0 >= this.significantDigits_ ? Math.round(a * b) : Math.floor(this.roundToSignificantDigits_(a * b, this.significantDigits_, this.maximumFractionDigits_));
    isFinite(c) ? (a = Math.floor(c / b), b = Math.floor(c - a * b)) : b = 0;
    return {
        intValue: a,
        fracValue: b
    }
};
goog.i18n.NumberFormat.prototype.subformatFixed_ = function (a, b, c) {
    a = this.roundNumber_(a);
    var d = Math.pow(10, this.maximumFractionDigits_),
        e = a.intValue,
        f = a.fracValue,
        g = 0 == e ? 0 : this.intLog10_(e) + 1,
        h = 0 < this.minimumFractionDigits_ || 0 < f || this.showTrailingZeros_ && g < this.significantDigits_;
    a = this.minimumFractionDigits_;
    h && (a = this.showTrailingZeros_ && 0 < this.significantDigits_ ? this.significantDigits_ - g : this.minimumFractionDigits_);
    for (var k = "", g = e; 1E20 < g;) {
        k = "0" + k, g = Math.round(g / 10)
    }
    var k = g + k,
        l = goog.i18n.NumberFormatSymbols.DECIMAL_SEP,
        m = goog.i18n.NumberFormatSymbols.GROUP_SEP,
        g = goog.i18n.NumberFormat.enforceAsciiDigits_ ? 48 : goog.i18n.NumberFormatSymbols.ZERO_DIGIT.charCodeAt(0),
        p = k.length;
    if (0 < e || 0 < b) {
        for (e = p; e < b; e++) {
            c.push(String.fromCharCode(g))
        }
        for (e = 0; e < p; e++) {
            c.push(String.fromCharCode(g + 1 * k.charAt(e))), 1 < p - e && 0 < this.groupingSize_ && 1 == (p - e) % this.groupingSize_ && c.push(m)
        }
    } else {
        h || c.push(String.fromCharCode(g))
    }
    (this.decimalSeparatorAlwaysShown_ || h) && c.push(l);
    b = "" + (f + d);
    for (d = b.length;
        "0" == b.charAt(d - 1) && d > a + 1;) {
        d--
    }
    for (e = 1; e < d; e++) {
        c.push(String.fromCharCode(g + 1 * b.charAt(e)))
    }
};
goog.i18n.NumberFormat.prototype.addExponentPart_ = function (a, b) {
    b.push(goog.i18n.NumberFormatSymbols.EXP_SYMBOL);
    0 > a ? (a = -a, b.push(goog.i18n.NumberFormatSymbols.MINUS_SIGN)) : this.useSignForPositiveExponent_ && b.push(goog.i18n.NumberFormatSymbols.PLUS_SIGN);
    for (var c = "" + a, d = goog.i18n.NumberFormat.enforceAsciiDigits_ ? "0" : goog.i18n.NumberFormatSymbols.ZERO_DIGIT, e = c.length; e < this.minExponentDigits_; e++) {
        b.push(d)
    }
    b.push(c)
};
goog.i18n.NumberFormat.prototype.subformatExponential_ = function (a, b) {
    if (0 == a) {
        this.subformatFixed_(a, this.minimumIntegerDigits_, b), this.addExponentPart_(0, b)
    } else {
        var c = goog.math.safeFloor(Math.log(a) / Math.log(10));
        a /= Math.pow(10, c);
        var d = this.minimumIntegerDigits_;
        if (1 < this.maximumIntegerDigits_ && this.maximumIntegerDigits_ > this.minimumIntegerDigits_) {
            for (; 0 != c % this.maximumIntegerDigits_;) {
                a *= 10, c--
            }
            d = 1
        } else {
            1 > this.minimumIntegerDigits_ ? (c++, a /= 10) : (c -= this.minimumIntegerDigits_ - 1, a *= Math.pow(10, this.minimumIntegerDigits_ - 1))
        }
        this.subformatFixed_(a, d, b);
        this.addExponentPart_(c, b)
    }
};
goog.i18n.NumberFormat.prototype.getDigit_ = function (a) {
    a = a.charCodeAt(0);
    if (48 <= a && 58 > a) {
        return a - 48
    }
    var b = goog.i18n.NumberFormatSymbols.ZERO_DIGIT.charCodeAt(0);
    return b <= a && a < b + 10 ? a - b : -1
};
goog.i18n.NumberFormat.PATTERN_ZERO_DIGIT_ = "0";
goog.i18n.NumberFormat.PATTERN_GROUPING_SEPARATOR_ = ",";
goog.i18n.NumberFormat.PATTERN_DECIMAL_SEPARATOR_ = ".";
goog.i18n.NumberFormat.PATTERN_PER_MILLE_ = "\u2030";
goog.i18n.NumberFormat.PATTERN_PERCENT_ = "%";
goog.i18n.NumberFormat.PATTERN_DIGIT_ = "#";
goog.i18n.NumberFormat.PATTERN_SEPARATOR_ = ";";
goog.i18n.NumberFormat.PATTERN_EXPONENT_ = "E";
goog.i18n.NumberFormat.PATTERN_PLUS_ = "+";
goog.i18n.NumberFormat.PATTERN_MINUS_ = "-";
goog.i18n.NumberFormat.PATTERN_CURRENCY_SIGN_ = "\u00a4";
goog.i18n.NumberFormat.QUOTE_ = "'";
goog.i18n.NumberFormat.prototype.parseAffix_ = function (a, b) {
    for (var c = "", d = !1, e = a.length; b[0] < e; b[0]++) {
        var f = a.charAt(b[0]);
        if (f == goog.i18n.NumberFormat.QUOTE_) {
            b[0] + 1 < e && a.charAt(b[0] + 1) == goog.i18n.NumberFormat.QUOTE_ ? (b[0]++, c += "'") : d = !d
        } else {
            if (d) {
                c += f
            } else {
                switch (f) {
                case goog.i18n.NumberFormat.PATTERN_DIGIT_:
                    ;
                case goog.i18n.NumberFormat.PATTERN_ZERO_DIGIT_:
                    ;
                case goog.i18n.NumberFormat.PATTERN_GROUPING_SEPARATOR_:
                    ;
                case goog.i18n.NumberFormat.PATTERN_DECIMAL_SEPARATOR_:
                    ;
                case goog.i18n.NumberFormat.PATTERN_SEPARATOR_:
                    return c;
                case goog.i18n.NumberFormat.PATTERN_CURRENCY_SIGN_:
                    if (b[0] + 1 < e && a.charAt(b[0] + 1) == goog.i18n.NumberFormat.PATTERN_CURRENCY_SIGN_) {
                        b[0]++, c += this.intlCurrencyCode_
                    } else {
                        switch (this.currencyStyle_) {
                        case goog.i18n.NumberFormat.CurrencyStyle.LOCAL:
                            c += goog.i18n.currency.getLocalCurrencySign(this.intlCurrencyCode_);
                            break;
                        case goog.i18n.NumberFormat.CurrencyStyle.GLOBAL:
                            c += goog.i18n.currency.getGlobalCurrencySign(this.intlCurrencyCode_);
                            break;
                        case goog.i18n.NumberFormat.CurrencyStyle.PORTABLE:
                            c += goog.i18n.currency.getPortableCurrencySign(this.intlCurrencyCode_)
                        }
                    }
                    break;
                case goog.i18n.NumberFormat.PATTERN_PERCENT_:
                    if (1 != this.multiplier_) {
                        throw Error("Too many percent/permill");
                    }
                    this.multiplier_ = 100;
                    c += goog.i18n.NumberFormatSymbols.PERCENT;
                    break;
                case goog.i18n.NumberFormat.PATTERN_PER_MILLE_:
                    if (1 != this.multiplier_) {
                        throw Error("Too many percent/permill");
                    }
                    this.multiplier_ = 1E3;
                    c += goog.i18n.NumberFormatSymbols.PERMILL;
                    break;
                default:
                    c += f
                }
            }
        }
    }
    return c
};
goog.i18n.NumberFormat.prototype.parseTrunk_ = function (a, b) {
    for (var c = -1, d = 0, e = 0, f = 0, g = -1, h = a.length, k = !0; b[0] < h && k; b[0]++) {
        switch (a.charAt(b[0])) {
        case goog.i18n.NumberFormat.PATTERN_DIGIT_:
            0 < e ? f++ : d++;
            0 <= g && 0 > c && g++;
            break;
        case goog.i18n.NumberFormat.PATTERN_ZERO_DIGIT_:
            if (0 < f) {
                throw Error('Unexpected "0" in pattern "' + a + '"');
            }
            e++;
            0 <= g && 0 > c && g++;
            break;
        case goog.i18n.NumberFormat.PATTERN_GROUPING_SEPARATOR_:
            g = 0;
            break;
        case goog.i18n.NumberFormat.PATTERN_DECIMAL_SEPARATOR_:
            if (0 <= c) {
                throw Error('Multiple decimal separators in pattern "' + a + '"');
            }
            c = d + e + f;
            break;
        case goog.i18n.NumberFormat.PATTERN_EXPONENT_:
            if (this.useExponentialNotation_) {
                throw Error('Multiple exponential symbols in pattern "' + a + '"');
            }
            this.useExponentialNotation_ = !0;
            this.minExponentDigits_ = 0;
            b[0] + 1 < h && a.charAt(b[0] + 1) == goog.i18n.NumberFormat.PATTERN_PLUS_ && (b[0]++, this.useSignForPositiveExponent_ = !0);
            for (; b[0] + 1 < h && a.charAt(b[0] + 1) == goog.i18n.NumberFormat.PATTERN_ZERO_DIGIT_;) {
                b[0]++, this.minExponentDigits_++
            }
            if (1 > d + e || 1 > this.minExponentDigits_) {
                throw Error('Malformed exponential pattern "' + a + '"');
            }
            k = !1;
            break;
        default:
            b[0]--, k = !1
        }
    }
    0 == e && 0 < d && 0 <= c && (e = c, 0 == e && e++, f = d - e, d = e - 1, e = 1);
    if (0 > c && 0 < f || 0 <= c && (c < d || c > d + e) || 0 == g) {
        throw Error('Malformed pattern "' + a + '"');
    }
    f = d + e + f;
    this.maximumFractionDigits_ = 0 <= c ? f - c : 0;
    0 <= c && (this.minimumFractionDigits_ = d + e - c, 0 > this.minimumFractionDigits_ && (this.minimumFractionDigits_ = 0));
    this.minimumIntegerDigits_ = (0 <= c ? c : f) - d;
    this.useExponentialNotation_ && (this.maximumIntegerDigits_ = d + this.minimumIntegerDigits_, 0 == this.maximumFractionDigits_ && 0 == this.minimumIntegerDigits_ && (this.minimumIntegerDigits_ = 1));
    this.groupingSize_ = Math.max(0, g);
    this.decimalSeparatorAlwaysShown_ = 0 == c || c == f
};
goog.i18n.NumberFormat.NULL_UNIT_ = {
    prefix: "",
    suffix: "",
    divisorBase: 0
};
goog.i18n.NumberFormat.prototype.getUnitFor_ = function (a, b) {
    var c = this.compactStyle_ == goog.i18n.NumberFormat.CompactStyle.SHORT ? goog.i18n.CompactNumberFormatSymbols.COMPACT_DECIMAL_SHORT_PATTERN : goog.i18n.CompactNumberFormatSymbols.COMPACT_DECIMAL_LONG_PATTERN;
    if (3 > a) {
        return goog.i18n.NumberFormat.NULL_UNIT_
    }
    a = Math.min(14, a);
    c = c[Math.pow(10, a)];
    if (!c) {
        return goog.i18n.NumberFormat.NULL_UNIT_
    }
    c = c[b];
    return c && "0" != c ? (c = /([^0]*)(0+)(.*)/.exec(c)) ? {
        prefix: c[1],
        suffix: c[3],
        divisorBase: a - (c[2].length - 1)
    } : goog.i18n.NumberFormat.NULL_UNIT_ : goog.i18n.NumberFormat.NULL_UNIT_
};
goog.i18n.NumberFormat.prototype.getUnitAfterRounding_ = function (a, b) {
    if (this.compactStyle_ == goog.i18n.NumberFormat.CompactStyle.NONE) {
        return goog.i18n.NumberFormat.NULL_UNIT_
    }
    a = Math.abs(a);
    b = Math.abs(b);
    var c = this.pluralForm_(a),
        d = 1 >= a ? 0 : this.intLog10_(a),
        c = this.getUnitFor_(d, c).divisorBase,
        d = b / Math.pow(10, c),
        d = this.roundNumber_(d),
        e = a / Math.pow(10, c),
        e = this.roundNumber_(e),
        d = this.pluralForm_(d.intValue + d.fracValue);
    return this.getUnitFor_(c + this.intLog10_(e.intValue), d)
};
goog.i18n.NumberFormat.prototype.intLog10_ = function (a) {
    for (var b = 0; 1 <= (a /= 10);) {
        b++
    }
    return b
};
goog.i18n.NumberFormat.prototype.roundToSignificantDigits_ = function (a, b, c) {
    if (!a) {
        return a
    }
    var d = this.intLog10_(a);
    b = b - d - 1;
    if (b < -c) {
        return c = Math.pow(10, c), Math.round(a / c) * c
    }
    c = Math.pow(10, b);
    return Math.round(a * c) / c
};
goog.i18n.NumberFormat.prototype.pluralForm_ = function (a) {
    return "other"
};
goog.i18n.NumberFormat.prototype.isCurrencyCodeBeforeValue = function () {
    var a = this.pattern_.indexOf("\u00a4"),
        b = this.pattern_.indexOf("#"),
        c = this.pattern_.indexOf("0"),
        d = Number.MAX_VALUE;
    0 <= b && b < d && (d = b);
    0 <= c && c < d && (d = c);
    return a < d
};
goog.i18n.ordinalRules = {};
goog.i18n.ordinalRules.Keyword = {
    ZERO: "zero",
    ONE: "one",
    TWO: "two",
    FEW: "few",
    MANY: "many",
    OTHER: "other"
};
goog.i18n.ordinalRules.defaultSelect_ = function (a) {
    return goog.i18n.ordinalRules.Keyword.OTHER
};
goog.i18n.ordinalRules.frSelect_ = function (a) {
    return 1 == a ? goog.i18n.ordinalRules.Keyword.ONE : goog.i18n.ordinalRules.Keyword.OTHER
};
goog.i18n.ordinalRules.huSelect_ = function (a) {
    return 1 == a || 5 == a ? goog.i18n.ordinalRules.Keyword.ONE : goog.i18n.ordinalRules.Keyword.OTHER
};
goog.i18n.ordinalRules.svSelect_ = function (a) {
    return 1 != a % 10 && 2 != a % 10 || 11 == a % 100 || 12 == a % 100 ? goog.i18n.ordinalRules.Keyword.OTHER : goog.i18n.ordinalRules.Keyword.ONE
};
goog.i18n.ordinalRules.enSelect_ = function (a) {
    return 1 == a % 10 && 11 != a % 100 ? goog.i18n.ordinalRules.Keyword.ONE : 2 == a % 10 && 12 != a % 100 ? goog.i18n.ordinalRules.Keyword.TWO : 3 == a % 10 && 13 != a % 100 ? goog.i18n.ordinalRules.Keyword.FEW : goog.i18n.ordinalRules.Keyword.OTHER
};
goog.i18n.ordinalRules.itSelect_ = function (a) {
    return 11 == a || 8 == a || 80 == a || 800 == a ? goog.i18n.ordinalRules.Keyword.MANY : goog.i18n.ordinalRules.Keyword.OTHER
};
goog.i18n.ordinalRules.caSelect_ = function (a) {
    return 1 == a || 3 == a ? goog.i18n.ordinalRules.Keyword.ONE : 2 == a ? goog.i18n.ordinalRules.Keyword.TWO : 4 == a ? goog.i18n.ordinalRules.Keyword.FEW : goog.i18n.ordinalRules.Keyword.OTHER
};
goog.i18n.ordinalRules.mrSelect_ = function (a) {
    return 1 == a ? goog.i18n.ordinalRules.Keyword.ONE : 2 == a || 3 == a ? goog.i18n.ordinalRules.Keyword.TWO : 4 == a ? goog.i18n.ordinalRules.Keyword.FEW : goog.i18n.ordinalRules.Keyword.OTHER
};
goog.i18n.ordinalRules.guSelect_ = function (a) {
    return 1 == a ? goog.i18n.ordinalRules.Keyword.ONE : 2 == a || 3 == a ? goog.i18n.ordinalRules.Keyword.TWO : 4 == a ? goog.i18n.ordinalRules.Keyword.FEW : 6 == a ? goog.i18n.ordinalRules.Keyword.MANY : goog.i18n.ordinalRules.Keyword.OTHER
};
goog.i18n.ordinalRules.bnSelect_ = function (a) {
    return 1 == a || 5 == a || 7 == a || 8 == a || 9 == a || 10 == a ? goog.i18n.ordinalRules.Keyword.ONE : 2 == a || 3 == a ? goog.i18n.ordinalRules.Keyword.TWO : 4 == a ? goog.i18n.ordinalRules.Keyword.FEW : 6 == a ? goog.i18n.ordinalRules.Keyword.MANY : goog.i18n.ordinalRules.Keyword.OTHER
};
goog.i18n.ordinalRules.zuSelect_ = function (a) {
    return 1 == a ? goog.i18n.ordinalRules.Keyword.ONE : a == (a | 0) && 2 <= a && 9 >= a ? goog.i18n.ordinalRules.Keyword.FEW : a == (a | 0) && (10 <= a && 19 >= a || 100 <= a && 199 >= a || 1E3 <= a && 1999 >= a) ? goog.i18n.ordinalRules.Keyword.MANY : goog.i18n.ordinalRules.Keyword.OTHER
};
goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.enSelect_;
"af" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"am" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"ar" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"bg" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"bn" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.bnSelect_);
"br" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"ca" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.caSelect_);
"chr" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"cs" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"cy" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"da" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"de" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
if ("de_AT" == goog.LOCALE || "de-AT" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_
}
if ("de_CH" == goog.LOCALE || "de-CH" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_
}
"el" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"en" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.enSelect_);
if ("en_AU" == goog.LOCALE || "en-AU" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.enSelect_
}
if ("en_GB" == goog.LOCALE || "en-GB" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.enSelect_
}
if ("en_IE" == goog.LOCALE || "en-IE" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.enSelect_
}
if ("en_IN" == goog.LOCALE || "en-IN" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.enSelect_
}
if ("en_SG" == goog.LOCALE || "en-SG" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.enSelect_
}
if ("en_US" == goog.LOCALE || "en-US" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.enSelect_
}
if ("en_ZA" == goog.LOCALE || "en-ZA" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.enSelect_
}
"es" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
if ("es_419" == goog.LOCALE || "es-419" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_
}
if ("es_ES" == goog.LOCALE || "es-ES" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_
}
"et" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"eu" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"fa" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"fi" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"fil" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.frSelect_);
"fr" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.frSelect_);
if ("fr_CA" == goog.LOCALE || "fr-CA" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.frSelect_
}
"gl" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"gsw" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"gu" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.guSelect_);
"haw" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"he" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"hi" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.guSelect_);
"hr" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"hu" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.huSelect_);
"id" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"in" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"is" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"it" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.itSelect_);
"iw" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"ja" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"kn" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"ko" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"ln" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"lt" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"lv" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"ml" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"mr" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.mrSelect_);
"ms" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.frSelect_);
"mt" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"nb" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"nl" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"no" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"or" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"pl" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"pt" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
if ("pt_BR" == goog.LOCALE || "pt-BR" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_
}
if ("pt_PT" == goog.LOCALE || "pt-PT" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_
}
"ro" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.frSelect_);
"ru" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"sk" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"sl" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"sq" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"sr" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"sv" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.svSelect_);
"sw" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"ta" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"te" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"th" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"tl" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"tr" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"uk" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"ur" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
"vi" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.frSelect_);
"zh" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_);
if ("zh_CN" == goog.LOCALE || "zh-CN" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_
}
if ("zh_HK" == goog.LOCALE || "zh-HK" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_
}
if ("zh_TW" == goog.LOCALE || "zh-TW" == goog.LOCALE) {
    goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.defaultSelect_
}
"zu" == goog.LOCALE && (goog.i18n.ordinalRules.select = goog.i18n.ordinalRules.zuSelect_);
goog.i18n.pluralRules = {};
goog.i18n.pluralRules.Keyword = {
    ZERO: "zero",
    ONE: "one",
    TWO: "two",
    FEW: "few",
    MANY: "many",
    OTHER: "other"
};
goog.i18n.pluralRules.defaultSelect_ = function (a) {
    return goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.arSelect_ = function (a) {
    return 0 == a ? goog.i18n.pluralRules.Keyword.ZERO : 1 == a ? goog.i18n.pluralRules.Keyword.ONE : 2 == a ? goog.i18n.pluralRules.Keyword.TWO : a == (a | 0) && 3 <= a % 100 && 10 >= a % 100 ? goog.i18n.pluralRules.Keyword.FEW : a == (a | 0) && 11 <= a % 100 && 99 >= a % 100 ? goog.i18n.pluralRules.Keyword.MANY : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.heSelect_ = function (a) {
    return 1 == a ? goog.i18n.pluralRules.Keyword.ONE : 2 == a ? goog.i18n.pluralRules.Keyword.TWO : 0 != a && 0 == a % 10 ? goog.i18n.pluralRules.Keyword.MANY : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.enSelect_ = function (a) {
    return 1 == a ? goog.i18n.pluralRules.Keyword.ONE : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.filSelect_ = function (a) {
    return 0 == a || 1 == a ? goog.i18n.pluralRules.Keyword.ONE : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.frSelect_ = function (a) {
    return 0 <= a && 2 >= a && 2 != a ? goog.i18n.pluralRules.Keyword.ONE : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.lvSelect_ = function (a) {
    return 0 == a ? goog.i18n.pluralRules.Keyword.ZERO : 1 == a % 10 && 11 != a % 100 ? goog.i18n.pluralRules.Keyword.ONE : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.iuSelect_ = function (a) {
    return 1 == a ? goog.i18n.pluralRules.Keyword.ONE : 2 == a ? goog.i18n.pluralRules.Keyword.TWO : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.gaSelect_ = function (a) {
    return 1 == a ? goog.i18n.pluralRules.Keyword.ONE : 2 == a ? goog.i18n.pluralRules.Keyword.TWO : a == (a | 0) && 3 <= a && 6 >= a ? goog.i18n.pluralRules.Keyword.FEW : a == (a | 0) && 7 <= a && 10 >= a ? goog.i18n.pluralRules.Keyword.MANY : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.roSelect_ = function (a) {
    return 1 == a ? goog.i18n.pluralRules.Keyword.ONE : 0 == a || 1 != a && a == (a | 0) && 1 <= a % 100 && 19 >= a % 100 ? goog.i18n.pluralRules.Keyword.FEW : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.ltSelect_ = function (a) {
    return 1 == a % 10 && (11 > a % 100 || 19 < a % 100) ? goog.i18n.pluralRules.Keyword.ONE : a == (a | 0) && 2 <= a % 10 && 9 >= a % 10 && (11 > a % 100 || 19 < a % 100) ? goog.i18n.pluralRules.Keyword.FEW : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.beSelect_ = function (a) {
    return 1 == a % 10 && 11 != a % 100 ? goog.i18n.pluralRules.Keyword.ONE : a == (a | 0) && 2 <= a % 10 && 4 >= a % 10 && (12 > a % 100 || 14 < a % 100) ? goog.i18n.pluralRules.Keyword.FEW : 0 == a % 10 || a == (a | 0) && 5 <= a % 10 && 9 >= a % 10 || a == (a | 0) && 11 <= a % 100 && 14 >= a % 100 ? goog.i18n.pluralRules.Keyword.MANY : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.csSelect_ = function (a) {
    return 1 == a ? goog.i18n.pluralRules.Keyword.ONE : a == (a | 0) && 2 <= a && 4 >= a ? goog.i18n.pluralRules.Keyword.FEW : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.plSelect_ = function (a) {
    return 1 == a ? goog.i18n.pluralRules.Keyword.ONE : a == (a | 0) && 2 <= a % 10 && 4 >= a % 10 && (12 > a % 100 || 14 < a % 100) ? goog.i18n.pluralRules.Keyword.FEW : 1 != a && (0 == a % 10 || 1 == a % 10) || a == (a | 0) && 5 <= a % 10 && 9 >= a % 10 || a == (a | 0) && 12 <= a % 100 && 14 >= a % 100 ? goog.i18n.pluralRules.Keyword.MANY : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.slSelect_ = function (a) {
    return 1 == a % 100 ? goog.i18n.pluralRules.Keyword.ONE : 2 == a % 100 ? goog.i18n.pluralRules.Keyword.TWO : 3 == a % 100 || 4 == a % 100 ? goog.i18n.pluralRules.Keyword.FEW : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.mtSelect_ = function (a) {
    return 1 == a ? goog.i18n.pluralRules.Keyword.ONE : 0 == a || a == (a | 0) && 2 <= a % 100 && 10 >= a % 100 ? goog.i18n.pluralRules.Keyword.FEW : a == (a | 0) && 11 <= a % 100 && 19 >= a % 100 ? goog.i18n.pluralRules.Keyword.MANY : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.mkSelect_ = function (a) {
    return 1 == a % 10 && 11 != a ? goog.i18n.pluralRules.Keyword.ONE : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.cySelect_ = function (a) {
    return 0 == a ? goog.i18n.pluralRules.Keyword.ZERO : 1 == a ? goog.i18n.pluralRules.Keyword.ONE : 2 == a ? goog.i18n.pluralRules.Keyword.TWO : 3 == a ? goog.i18n.pluralRules.Keyword.FEW : 6 == a ? goog.i18n.pluralRules.Keyword.MANY : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.lagSelect_ = function (a) {
    return 0 == a ? goog.i18n.pluralRules.Keyword.ZERO : 0 <= a && 2 >= a && 0 != a && 2 != a ? goog.i18n.pluralRules.Keyword.ONE : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.shiSelect_ = function (a) {
    return 0 <= a && 1 >= a ? goog.i18n.pluralRules.Keyword.ONE : a == (a | 0) && 2 <= a && 10 >= a ? goog.i18n.pluralRules.Keyword.FEW : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.brSelect_ = function (a) {
    return 1 == a % 10 && 11 != a % 100 && 71 != a % 100 && 91 != a % 100 ? goog.i18n.pluralRules.Keyword.ONE : 2 == a % 10 && 12 != a % 100 && 72 != a % 100 && 92 != a % 100 ? goog.i18n.pluralRules.Keyword.TWO : (3 == a % 10 || 4 == a % 10 || 9 == a % 10) && (10 > a % 100 || 19 < a % 100) && (70 > a % 100 || 79 < a % 100) && (90 > a % 100 || 99 < a % 100) ? goog.i18n.pluralRules.Keyword.FEW : 0 != a && 0 == a % 1E6 ? goog.i18n.pluralRules.Keyword.MANY : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.kshSelect_ = function (a) {
    return 0 == a ? goog.i18n.pluralRules.Keyword.ZERO : 1 == a ? goog.i18n.pluralRules.Keyword.ONE : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.tzmSelect_ = function (a) {
    return 0 == a || 1 == a || a == (a | 0) && 11 <= a && 99 >= a ? goog.i18n.pluralRules.Keyword.ONE : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.gvSelect_ = function (a) {
    return 1 == a % 10 || 2 == a % 10 || 0 == a % 20 ? goog.i18n.pluralRules.Keyword.ONE : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.gdSelect_ = function (a) {
    return 1 == a || 11 == a ? goog.i18n.pluralRules.Keyword.ONE : 2 == a || 12 == a ? goog.i18n.pluralRules.Keyword.TWO : a == (a | 0) && (3 <= a && 10 >= a || 13 <= a && 19 >= a) ? goog.i18n.pluralRules.Keyword.FEW : goog.i18n.pluralRules.Keyword.OTHER
};
goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_;
"af" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"am" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.filSelect_);
"ar" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.arSelect_);
"bg" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"bn" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"br" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.brSelect_);
"ca" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"chr" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"cs" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.csSelect_);
"cy" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.cySelect_);
"da" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"de" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
if ("de_AT" == goog.LOCALE || "de-AT" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_
}
if ("de_CH" == goog.LOCALE || "de-CH" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_
}
"el" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"en" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
if ("en_AU" == goog.LOCALE || "en-AU" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_
}
if ("en_GB" == goog.LOCALE || "en-GB" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_
}
if ("en_IE" == goog.LOCALE || "en-IE" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_
}
if ("en_IN" == goog.LOCALE || "en-IN" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_
}
if ("en_SG" == goog.LOCALE || "en-SG" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_
}
if ("en_US" == goog.LOCALE || "en-US" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_
}
if ("en_ZA" == goog.LOCALE || "en-ZA" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_
}
"es" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
if ("es_419" == goog.LOCALE || "es-419" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_
}
if ("es_ES" == goog.LOCALE || "es-ES" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_
}
"et" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"eu" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"fa" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.defaultSelect_);
"fi" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"fil" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.filSelect_);
"fr" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.frSelect_);
if ("fr_CA" == goog.LOCALE || "fr-CA" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.frSelect_
}
"gl" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"gsw" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"gu" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"haw" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"he" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.heSelect_);
"hi" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.filSelect_);
"hr" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.beSelect_);
"hu" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.defaultSelect_);
"id" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.defaultSelect_);
"in" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.defaultSelect_);
"is" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"it" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"iw" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.heSelect_);
"ja" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.defaultSelect_);
"kn" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.defaultSelect_);
"ko" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.defaultSelect_);
"ln" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.filSelect_);
"lt" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.ltSelect_);
"lv" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.lvSelect_);
"ml" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"mr" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"ms" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.defaultSelect_);
"mt" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.mtSelect_);
"nb" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"nl" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"no" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"or" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"pl" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.plSelect_);
"pt" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
if ("pt_BR" == goog.LOCALE || "pt-BR" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_
}
if ("pt_PT" == goog.LOCALE || "pt-PT" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_
}
"ro" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.roSelect_);
"ru" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.beSelect_);
"sk" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.csSelect_);
"sl" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.slSelect_);
"sq" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"sr" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.beSelect_);
"sv" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"sw" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"ta" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"te" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"th" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.defaultSelect_);
"tl" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.filSelect_);
"tr" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.defaultSelect_);
"uk" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.beSelect_);
"ur" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
"vi" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.defaultSelect_);
"zh" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.defaultSelect_);
if ("zh_CN" == goog.LOCALE || "zh-CN" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.defaultSelect_
}
if ("zh_HK" == goog.LOCALE || "zh-HK" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.defaultSelect_
}
if ("zh_TW" == goog.LOCALE || "zh-TW" == goog.LOCALE) {
    goog.i18n.pluralRules.select = goog.i18n.pluralRules.defaultSelect_
}
"zu" == goog.LOCALE && (goog.i18n.pluralRules.select = goog.i18n.pluralRules.enSelect_);
