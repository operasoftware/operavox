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

cvox.AbstractWalker = function () {};
cvox.AbstractWalker.prototype.begin = function (a) {
    a = a || {
        reversed: !1
    };
    return this.sync(cvox.CursorSelection.fromBody().setReversed(a.reversed))
};
cvox.AbstractWalker.prototype.hasAction = function (a) {
    return "function" == typeof this[a]
};
cvox.AbstractWalker.prototype.performAction = function (a, b) {
    return this.hasAction(a) ? this[a](b) : null
};
