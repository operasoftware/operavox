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

cvox.PageSelection = function (a) {
    this.sel_ = a.clone();
    this.sel_.select();
    this.wasBegin_ = !0
};
cvox.PageSelection.prototype.getDescription = function (a, b, c) {
    var d = [];
    this.sel_.isReversed() != c.isReversed() ? (d = a.getDescription(c, b), d[0].annotation = cvox.ChromeVox.msgs.getMsg("describe_unselected"), d[0].pushEarcon(cvox.AbstractEarcons.SELECTION_REVERSE)) : (d = a.getDescription(b, c), d[0].annotation = cvox.ChromeVox.msgs.getMsg("describe_selected"), d[0].pushEarcon(cvox.AbstractEarcons.SELECTION), !this.wasBegin_ && this.sel_.absEquals(c.clone().normalize()) && (a = a.getDescription(c, b), a[0].annotation = cvox.ChromeVox.msgs.getMsg("describe_unselected"),
        a[0].pushEarcon(cvox.AbstractEarcons.SELECTION_REVERSE), a[0].pushEarcon(cvox.AbstractEarcons.WRAP), d = a.concat(d)));
    return d
};
cvox.PageSelection.prototype.getFullDescription = function () {
    return [new cvox.NavDescription({
        text: window.getSelection().toString(),
        context: cvox.ChromeVox.msgs.getMsg("selection_is")
    })]
};
cvox.PageSelection.prototype.extend = function (a) {
    this.sel_.directedBefore(a) ? this.sel_.end = this.sel_.isReversed() == a.isReversed() ? a.end.clone() : a.start.clone() : this.sel_ = a.clone();
    this.sel_.select();
    this.wasBegin_ = !1;
    return !this.sel_.absEquals(a)
};
