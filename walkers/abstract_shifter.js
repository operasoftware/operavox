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

cvox.AbstractShifter = function () {
    this.isSubnavigating_ = !1
};
cvox.AbstractShifter.prototype.begin = function (a, b) {
    return this.currentWalker_.begin(b)
};
cvox.AbstractShifter.prototype.makeLessGranular = function () {
    this.ensureNotSubnavigating()
};
cvox.AbstractShifter.prototype.makeMoreGranular = function () {
    this.ensureNotSubnavigating()
};
cvox.AbstractShifter.prototype.ensureSubnavigating = function () {
    !1 == this.isSubnavigating_ && (this.makeMoreGranular(), this.isSubnavigating_ = !0)
};
cvox.AbstractShifter.prototype.ensureNotSubnavigating = function () {
    !0 == this.isSubnavigating_ && (this.isSubnavigating_ = !1, this.makeLessGranular())
};
cvox.AbstractShifter.prototype.isSubnavigating = function () {
    return this.isSubnavigating_
};
cvox.AbstractShifter.prototype.hasAction = function (a) {
    return this.currentWalker_.hasAction(a)
};
cvox.AbstractShifter.prototype.performAction = function (a, b) {
    return this.currentWalker_.performAction(a, b)
};
