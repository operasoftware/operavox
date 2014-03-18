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

cvox.MathUtil = {};
cvox.MathUtil.isMathmlNodeOfClass_ = function (a, b) {
    return -1 != b.indexOf(a.tagName.toUpperCase())
};
cvox.MathUtil.isMathjaxNodeOfClass_ = function (a, b) {
    return "SPAN" == a.tagName ? a.className.split(" ").some(function (a) {
        return -1 != b.indexOf(a.toUpperCase())
    }) : !1
};
cvox.MathUtil.isMathNodeOfClass_ = function (a, b) {
    return a.nodeType == Node.ELEMENT_NODE && (cvox.MathUtil.isMathmlNodeOfClass_(a, b) || cvox.MathUtil.isMathjaxNodeOfClass_(a, b))
};
cvox.MathUtil.TOKEN_LIST = "MI MN MO MTEXT MSPACE MS".split(" ");
cvox.MathUtil.isToken = function (a) {
    return cvox.MathUtil.isMathNodeOfClass_(a, cvox.MathUtil.TOKEN_LIST)
};
cvox.MathUtil.LAYOUT_LIST = "MROW MFRAC MSQRT MROOT MSTYLE MERROR MPADDED MPHANTOM MFENCED MENCLOSE".split(" ");
cvox.MathUtil.isLayout = function (a) {
    return cvox.MathUtil.isMathNodeOfClass_(a, cvox.MathUtil.LAYOUT_LIST)
};
cvox.MathUtil.SCRIPT_LIST = "MSUB MSUP MSUBSUP MUNDER MOVER MUNDEROVER MMULTISCRIPTS MPRESCRIPTS".split(" ");
cvox.MathUtil.isScript = function (a) {
    return cvox.MathUtil.isMathNodeOfClass_(a, cvox.MathUtil.SCRIPT_LIST)
};
cvox.MathUtil.TABLES_LIST = "MTABLE MLABELEDTR MTR MTD MALIGNGROUP MALIGNMARK".split(" ");
cvox.MathUtil.isTables = function (a) {
    return cvox.MathUtil.isMathNodeOfClass_(a, cvox.MathUtil.TABLES_LIST)
};
cvox.MathUtil.ELEMENTARY_LIST = "MSTACK MLONGDIV MSGROUP MSROW MSCARRIES MSCARRY MSLINE".split(" ");
cvox.MathUtil.isElementary = function (a) {
    return cvox.MathUtil.isMathNodeOfClass_(a, cvox.MathUtil.ELEMENTARY_LIST)
};
cvox.MathUtil.MATHML_TAG_LIST = [cvox.MathUtil.TOKEN_LIST, cvox.MathUtil.LAYOUT_LIST, cvox.MathUtil.SCRIPT_LIST, cvox.MathUtil.TABLES_LIST, cvox.MathUtil.ELEMENTARY_LIST].reduce(function (a, b) {
    return a.concat(b)
});
cvox.MathUtil.isMathmlTag = function (a) {
    return cvox.MathUtil.isMathNodeOfClass_(a, cvox.MathUtil.MATHML_TAG_LIST)
};
cvox.MathUtil.WHITESPACE_LIST = ["MSROW", "MROW", "MSPACE", "MPHANTOM", "MPADDED"];
cvox.MathUtil.isWhitespace = function (a) {
    return cvox.MathUtil.isMathNodeOfClass_(a, cvox.MathUtil.WHITESPACE_LIST)
};
cvox.MathUtil.isNotWhitespace = function (a) {
    return cvox.MathUtil.isMathmlTag(a) && !cvox.MathUtil.isWhitespace(a)
};
cvox.MathUtil.union = function (a, b) {
    return a.concat(b.filter(function (b) {
        return 0 > a.indexOf(b)
    }))
};
