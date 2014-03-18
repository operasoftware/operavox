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

goog.i18n.currency = {};
goog.i18n.currency.PRECISION_MASK_ = 7;
goog.i18n.currency.POSITION_FLAG_ = 16;
goog.i18n.currency.SPACE_FLAG_ = 32;
goog.i18n.currency.tier2Enabled_ = !1;
goog.i18n.currency.addTier2Support = function () {
    if (!goog.i18n.currency.tier2Enabled_) {
        for (var a in goog.i18n.currency.CurrencyInfoTier2) {
            goog.i18n.currency.CurrencyInfo[a] = goog.i18n.currency.CurrencyInfoTier2[a]
        }
        goog.i18n.currency.tier2Enabled_ = !0
    }
};
goog.i18n.currency.getGlobalCurrencyPattern = function (a) {
    var b = goog.i18n.currency.CurrencyInfo[a],
        c = b[0];
    return a == b[1] ? goog.i18n.currency.getCurrencyPattern_(c, b[1]) : a + " " + goog.i18n.currency.getCurrencyPattern_(c, b[1])
};
goog.i18n.currency.getGlobalCurrencySign = function (a) {
    var b = goog.i18n.currency.CurrencyInfo[a];
    return a == b[1] ? a : a + " " + b[1]
};
goog.i18n.currency.getLocalCurrencyPattern = function (a) {
    a = goog.i18n.currency.CurrencyInfo[a];
    return goog.i18n.currency.getCurrencyPattern_(a[0], a[1])
};
goog.i18n.currency.getLocalCurrencySign = function (a) {
    return goog.i18n.currency.CurrencyInfo[a][1]
};
goog.i18n.currency.getPortableCurrencyPattern = function (a) {
    a = goog.i18n.currency.CurrencyInfo[a];
    return goog.i18n.currency.getCurrencyPattern_(a[0], a[2])
};
goog.i18n.currency.getPortableCurrencySign = function (a) {
    return goog.i18n.currency.CurrencyInfo[a][2]
};
goog.i18n.currency.isPrefixSignPosition = function (a) {
    return 0 == (goog.i18n.currency.CurrencyInfo[a][0] & goog.i18n.currency.POSITION_FLAG_)
};
goog.i18n.currency.getCurrencyPattern_ = function (a, b) {
    var c = ["#,##0"],
        d = a & goog.i18n.currency.PRECISION_MASK_;
    if (0 < d) {
        c.push(".");
        for (var e = 0; e < d; e++) {
            c.push("0")
        }
    }
    0 == (a & goog.i18n.currency.POSITION_FLAG_) ? (c.unshift(a & goog.i18n.currency.SPACE_FLAG_ ? "' " : "'"), c.unshift(b), c.unshift("'")) : c.push(a & goog.i18n.currency.SPACE_FLAG_ ? " '" : "'", b, "'");
    return c.join("")
};
goog.i18n.currency.adjustPrecision = function (a, b) {
    var c = ["0"],
        d = goog.i18n.currency.CurrencyInfo[b][0] & goog.i18n.currency.PRECISION_MASK_;
    if (0 < d) {
        c.push(".");
        for (var e = 0; e < d; e++) {
            c.push("0")
        }
    }
    return a.replace(/0.00/g, c.join(""))
};
goog.i18n.currency.CurrencyInfo = {
    AED: [2, "dh", "\u062f.\u0625.", "DH"],
    ALL: [0, "Lek", "Lek"],
    AUD: [2, "$", "AU$"],
    BDT: [2, "\u09f3", "Tk"],
    BGN: [2, "lev", "lev"],
    BRL: [2, "R$", "R$"],
    CAD: [2, "$", "C$"],
    CDF: [2, "FrCD", "CDF"],
    CHF: [2, "CHF", "CHF"],
    CLP: [0, "$", "CL$"],
    CNY: [2, "\u00a5", "RMB\u00a5"],
    COP: [0, "$", "COL$"],
    CRC: [0, "\u20a1", "CR\u20a1"],
    CZK: [50, "K\u010d", "K\u010d"],
    DKK: [18, "kr", "kr"],
    DOP: [2, "$", "RD$"],
    EGP: [2, "\u00a3", "LE"],
    ETB: [2, "Birr", "Birr"],
    EUR: [2, "\u20ac",
"\u20ac"],
    GBP: [2, "\u00a3", "GB\u00a3"],
    HKD: [2, "$", "HK$"],
    HRK: [2, "kn", "kn"],
    HUF: [0, "Ft", "Ft"],
    IDR: [0, "Rp", "Rp"],
    ILS: [2, "\u20aa", "IL\u20aa"],
    INR: [2, "\u20b9", "Rs"],
    IRR: [0, "Rial", "IRR"],
    ISK: [0, "kr", "kr"],
    JMD: [2, "$", "JA$"],
    JPY: [0, "\u00a5", "JP\u00a5"],
    KRW: [0, "\u20a9", "KR\u20a9"],
    LKR: [2, "Rs", "SLRs"],
    LTL: [2, "Lt", "Lt"],
    LVL: [2, "Ls", "Ls"],
    MNT: [0, "\u20ae", "MN\u20ae"],
    MXN: [2, "$", "Mex$"],
    MYR: [2, "RM", "RM"],
    NOK: [50, "kr", "NOkr"],
    PAB: [2, "B/.", "B/."],
    PEN: [2,
"S/.", "S/."],
    PHP: [2, "\u20b1", "Php"],
    PKR: [0, "Rs", "PKRs."],
    PLN: [50, "z\u0142", "z\u0142"],
    RON: [2, "RON", "RON"],
    RSD: [0, "din", "RSD"],
    RUB: [50, "\u0440\u0443\u0431.", "\u0440\u0443\u0431."],
    SAR: [2, "Rial", "Rial"],
    SEK: [2, "kr", "kr"],
    SGD: [2, "$", "S$"],
    THB: [2, "\u0e3f", "THB"],
    TRY: [2, "TL", "YTL"],
    TWD: [2, "NT$", "NT$"],
    TZS: [0, "TSh", "TSh"],
    UAH: [2, "\u20b4", "UAH"],
    USD: [2, "$", "US$"],
    UYU: [2, "$", "$U"],
    VND: [0, "\u20ab", "VN\u20ab"],
    YER: [0, "Rial", "Rial"],
    ZAR: [2, "R", "ZAR"]
};
goog.i18n.currency.CurrencyInfoTier2 = {
    AFN: [48, "Af.", "AFN"],
    AMD: [0, "Dram", "dram"],
    AOA: [2, "Kz", "Kz"],
    ARS: [2, "$", "AR$"],
    AWG: [2, "Afl.", "Afl."],
    AZN: [2, "man.", "man."],
    BAM: [2, "KM", "KM"],
    BBD: [2, "$", "Bds$"],
    BHD: [3, "din", "din"],
    BIF: [0, "FBu", "FBu"],
    BMD: [2, "$", "BD$"],
    BND: [2, "$", "B$"],
    BOB: [2, "Bs", "Bs"],
    BSD: [2, "$", "BS$"],
    BTN: [2, "Nu.", "Nu."],
    BWP: [2, "P", "pula"],
    BYR: [0, "BYR", "BYR"],
    BZD: [2, "$", "BZ$"],
    CUC: [1, "$", "CUC$"],
    CUP: [2, "$", "CU$"],
    CVE: [2, "CVE", "Esc"],
    DJF: [0, "Fdj", "Fdj"],
    DZD: [2, "din", "din"],
    ERN: [2, "Nfk", "Nfk"],
    FJD: [2, "$", "FJ$"],
    FKP: [2, "\u00a3", "FK\u00a3"],
    GEL: [2, "GEL", "GEL"],
    GHS: [2, "GHS", "GHS"],
    GIP: [2, "\u00a3", "GI\u00a3"],
    GMD: [2, "GMD", "GMD"],
    GNF: [0, "FG", "FG"],
    GTQ: [2, "Q", "GTQ"],
    GYD: [0, "$", "GY$"],
    HNL: [2, "L", "HNL"],
    HTG: [2, "HTG", "HTG"],
    IQD: [0, "din", "IQD"],
    JOD: [3, "din", "JOD"],
    KES: [2, "Ksh", "Ksh"],
    KGS: [2, "KGS", "KGS"],
    KHR: [2, "Riel", "KHR"],
    KMF: [0, "CF", "KMF"],
    KPW: [0, "\u20a9KP", "KPW"],
    KWD: [3,
"din", "KWD"],
    KYD: [2, "$", "KY$"],
    KZT: [2, "\u20b8", "KZT"],
    LAK: [0, "\u20ad", "\u20ad"],
    LBP: [0, "L\u00a3", "LBP"],
    LRD: [2, "$", "L$"],
    LSL: [2, "LSL", "LSL"],
    LYD: [3, "din", "LD"],
    MAD: [2, "dh", "MAD"],
    MDL: [2, "MDL", "MDL"],
    MGA: [0, "Ar", "MGA"],
    MKD: [2, "din", "MKD"],
    MMK: [0, "K", "MMK"],
    MOP: [2, "MOP", "MOP$"],
    MRO: [0, "MRO", "MRO"],
    MUR: [0, "MURs", "MURs"],
    MWK: [2, "MWK", "MWK"],
    MZN: [2, "MTn", "MTn"],
    NAD: [2, "$", "N$"],
    NGN: [2, "\u20a6", "NG\u20a6"],
    NIO: [2, "C$", "C$"],
    NPR: [2, "Rs", "NPRs"],
    NZD: [2, "$", "NZ$"],
    OMR: [3, "Rial", "OMR"],
    PGK: [2, "PGK", "PGK"],
    PYG: [0, "Gs", "PYG"],
    QAR: [2, "Rial", "QR"],
    RWF: [0, "RF", "RF"],
    SBD: [2, "$", "SI$"],
    SCR: [2, "SCR", "SCR"],
    SDG: [2, "SDG", "SDG"],
    SHP: [2, "\u00a3", "SH\u00a3"],
    SLL: [0, "SLL", "SLL"],
    SOS: [0, "SOS", "SOS"],
    SRD: [2, "$", "SR$"],
    STD: [0, "Db", "Db"],
    SYP: [0, "\u00a3", "SY\u00a3"],
    SZL: [2, "SZL", "SZL"],
    TJS: [2, "Som", "TJS"],
    TND: [3, "din", "DT"],
    TOP: [2, "T$", "T$"],
    TTD: [2, "$", "TT$"],
    UGX: [0, "UGX", "UGX"],
    UZS: [0, "so\u02bcm",
"UZS"],
    VEF: [2, "Bs", "Bs"],
    VUV: [0, "VUV", "VUV"],
    WST: [2, "WST", "WST"],
    XAF: [0, "FCFA", "FCFA"],
    XCD: [2, "$", "EC$"],
    XOF: [0, "CFA", "CFA"],
    XPF: [0, "FCFP", "FCFP"],
    ZMK: [0, "ZMK", "ZMK"]
};
