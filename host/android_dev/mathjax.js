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

cvox.AndroidMathJax = function () {
    cvox.AbstractMathJax.call(this);
    this.altMathNodeId_ = 0
};
goog.inherits(cvox.AndroidMathJax, cvox.AbstractMathJax);
cvox.AndroidMathJax.prototype.getMathmlToDomCallback_ = function (a) {
    return goog.bind(function (b, c) {
        return this.convertMarkupToDom(a, b, c)
    }, this)
};
cvox.AndroidMathJax.prototype.isMathjaxActive = function (a) {
    var b = 0,
        c = function () {
            b++;
            cvox.MathJaxExternalUtil.isActive() ? a(!0) : 5 > b && setTimeout(c, 1E3)
        };
    c()
};
cvox.AndroidMathJax.prototype.getAllJax = function (a) {
    cvox.MathJaxExternalUtil.getAllJax(this.getMathmlToDomCallback_(a))
};
cvox.AndroidMathJax.prototype.registerSignal = function (a, b) {
    cvox.MathJaxExternalUtil.registerSignal(this.getMathmlToDomCallback_(a), b)
};
cvox.AndroidMathJax.prototype.injectScripts = function () {
    cvox.MathJaxExternalUtil.injectConfigScript();
    cvox.MathJaxExternalUtil.injectLoadScript()
};
cvox.AndroidMathJax.prototype.configMediaWiki = function () {
    cvox.MathJaxExternalUtil.configMediaWiki()
};
cvox.AndroidMathJax.prototype.getTex = function (a, b) {
    var c = b.alt || b.title;
    if (c) {
        var d = "cvoxId-" + this.altMathNodeId_++;
        b.setAttribute("cvoxId", d);
        cvox.MathJaxExternalUtil.texToMml(goog.bind(function (b) {
            this.convertMarkupToDom(a, b, d)
        }, this), c)
    }
};
cvox.AndroidMathJax.prototype.getAsciiMath = function (a, b) {
    var c = b.alt || b.title;
    if (c) {
        var d = "cvoxId-" + this.altMathNodeId_++;
        b.setAttribute("cvoxId", d);
        cvox.MathJaxExternalUtil.asciiMathToMml(goog.bind(function (b) {
            this.convertMarkupToDom(a, b, d)
        }, this), c)
    }
};
cvox.HostFactory.mathJaxConstructor = cvox.AndroidMathJax;
