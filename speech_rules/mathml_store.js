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

cvox.MathmlStore = function () {
    cvox.MathStore.call(this)
};
goog.inherits(cvox.MathmlStore, cvox.MathStore);
goog.addSingletonGetter(cvox.MathmlStore);
cvox.MathmlStore.prototype.defineMathmlRule = function (a, b, c) {
    this.defineRule(a, b, c, "self::mathml:" + a)
};
cvox.MathmlStore.prototype.defineDefaultMathmlRule = function (a, b) {
    this.defineRule(a, "default.default", b, "self::mathml:" + a)
};
