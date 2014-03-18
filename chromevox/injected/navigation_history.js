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

cvox.NavigationHistory = function () {
    this.reset_()
};
cvox.NavigationHistory.MAX_HISTORY_LEN_ = 30;
cvox.NavigationHistory.prototype.reset_ = function () {
    this.history_ = [document.body];
    this.arrivedValid_ = !0
};
cvox.NavigationHistory.prototype.update = function (a) {
    var b = this.history_[0];
    a && a != b && this.history_.unshift(a);
    this.history_.length > cvox.NavigationHistory.MAX_HISTORY_LEN_ && this.history_.pop();
    this.arrivedValid_ = this.isValidNode_(a)
};
cvox.NavigationHistory.prototype.becomeInvalid = function (a) {
    this.clean_();
    return this.arrivedValid_ ? !this.isValidNode_(a) : (this.arrivedValid_ = !0, !1)
};
cvox.NavigationHistory.prototype.revert = function (a) {
    var b = document.activeElement;
    b != document.body && this.isValidNode_(b) && this.update(b);
    if (a) {
        for (; 0 < this.history_.length && !a(this.history_[0]);) {
            this.history_.shift()
        }
    }
    return {
        current: this.history_[0],
        previous: this.history_[1]
    }
};
cvox.NavigationHistory.prototype.clean_ = function () {
    for (var a = !1, b = this.history_.length - 1; 0 <= b; b--) {
        this.isValidNode_(this.history_[b]) || (this.history_.splice(b, 1), a = !0)
    }
    return a
};
cvox.NavigationHistory.prototype.isValidNode_ = function (a) {
    return cvox.DomUtil.isAttachedToDocument(a) && cvox.DomUtil.isVisible(a) ? !0 : !1
};
