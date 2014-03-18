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

cvox.TableShifter = function () {
    this.rowWalker_ = new cvox.RowWalker;
    this.columnWalker_ = new cvox.ColumnWalker;
    this.currentWalker_ = this.rowWalker_;
    this.bumpedEdge_ = !1;
    this.begin_ = !0;
    cvox.AbstractShifter.call(this)
};
goog.inherits(cvox.TableShifter, cvox.AbstractShifter);
cvox.TableShifter.prototype.next = function (a) {
    var b = this.currentWalker_.next(a);
    return b ? b : (this.bumpedEdge_ = !0, a)
};
cvox.TableShifter.prototype.sync = function (a) {
    return "TABLE" == a.start.node.tagName ? a.isReversed() ? this.currentWalker_.goToLastCell(a) : this.currentWalker_.goToFirstCell(a) : this.currentWalker_.sync(a)
};
cvox.TableShifter.prototype.getName = function () {
    return cvox.ChromeVox.msgs.getMsg("table_shifter")
};
cvox.TableShifter.prototype.getDescription = function (a, b) {
    var c = this.currentWalker_.getDescription(a, b);
    if (0 < c.length && (this.bumpedEdge_ && (c[0].pushEarcon(cvox.AbstractEarcons.WRAP_EDGE), this.bumpedEdge_ = !1), this.begin_)) {
        var d = this.currentWalker_.tt.summaryText(),
            e = this.currentWalker_.getLocationInfo(b);
        null != e && c.push(new cvox.NavDescription({
            context: cvox.ChromeVox.msgs.getMsg("table_location", e),
            text: "",
            annotation: d ? d + " " : ""
        }));
        this.currentWalker_.tt.isSpanned() && c.push(new cvox.NavDescription({
            text: "",
            annotation: cvox.ChromeVox.msgs.getMsg("spanned")
        }));
        this.begin_ = !1
    }
    return c
};
cvox.TableShifter.prototype.getBraille = function (a, b) {
    return this.currentWalker_.getBraille(a, b)
};
cvox.TableShifter.prototype.getGranularityMsg = function () {
    return this.currentWalker_.getGranularityMsg()
};
cvox.TableShifter.prototype.makeLessGranular = function () {
    cvox.TableShifter.superClass_.makeLessGranular.call(this);
    this.currentWalker_ = this.rowWalker_
};
cvox.TableShifter.prototype.makeMoreGranular = function () {
    cvox.TableShifter.superClass_.makeMoreGranular.call(this);
    this.currentWalker_ = this.columnWalker_
};
cvox.TableShifter.create = function (a) {
    a = cvox.DomUtil.getAncestors(a.start.node);
    return cvox.DomPredicates.tablePredicate(a) && !cvox.DomPredicates.captionPredicate(a) ? new cvox.TableShifter : null
};
