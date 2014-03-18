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

cvox.SpeechRuleFunctions = function () {};
cvox.SpeechRuleFunctions.Store_ = function (a, b) {
    this.prefix_ = a;
    this.store_ = b
};
cvox.SpeechRuleFunctions.Store_.prototype.add = function (a, b) {
    this.checkCustomFunctionSyntax_(a) && (this.store_[a] = b)
};
cvox.SpeechRuleFunctions.Store_.prototype.lookup = function (a) {
    return this.store_[a]
};
cvox.SpeechRuleFunctions.CustomQueries = function () {
    cvox.SpeechRuleFunctions.Store_.call(this, "CQF", {})
};
goog.inherits(cvox.SpeechRuleFunctions.CustomQueries, cvox.SpeechRuleFunctions.Store_);
cvox.SpeechRuleFunctions.CustomStrings = function () {
    cvox.SpeechRuleFunctions.Store_.call(this, "CSF", {})
};
goog.inherits(cvox.SpeechRuleFunctions.CustomStrings, cvox.SpeechRuleFunctions.Store_);
cvox.SpeechRuleFunctions.ContextFunctions = function () {
    cvox.SpeechRuleFunctions.Store_.call(this, "CTXF", {})
};
goog.inherits(cvox.SpeechRuleFunctions.ContextFunctions, cvox.SpeechRuleFunctions.Store_);
cvox.SpeechRuleFunctions.Store_.prototype.checkCustomFunctionSyntax_ = function (a) {
    return a.match(RegExp("^" + this.prefix_)) ? !0 : (console.log("FunctionError: Invalid function name. Expected prefix" + this.prefix_), !1)
};
