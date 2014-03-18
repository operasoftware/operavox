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

cvox.AbstractMathJax = function () {};
cvox.AbstractMathJax.prototype.getAllTexs = function (a) {
    for (var b = document.querySelectorAll(cvox.DomUtil.altMathQuerySelector("tex")), c = 0, d; d = b[c]; c++) {
        this.getTex(a, d)
    }
};
cvox.AbstractMathJax.prototype.getAllAsciiMaths = function (a) {
    for (var b = document.querySelectorAll(cvox.DomUtil.altMathQuerySelector("asciimath")), c = 0, d; d = b[c]; c++) {
        this.getAsciiMath(a, d)
    }
};
cvox.AbstractMathJax.prototype.convertMarkupToDom = function (a, b, c) {
    if (b) {
        var d = new DOMParser;
        b = b.replace(/>\s+</g, "><");
        a(d.parseFromString(b, "text/xml").firstChild, c)
    }
};
