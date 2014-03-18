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

cvox.MathShifter = function (a) {
    cvox.AbstractShifter.call(this);
    this.level_ = 0;
    this.bumped_ = this.direction_ = !1;
    cvox.TraverseMath.getInstance().initialize(a.start.node)
};
goog.inherits(cvox.MathShifter, cvox.AbstractShifter);
cvox.MathShifter.prototype.next = function (a) {
    var b = a.isReversed();
    this.bumped_ = !cvox.TraverseMath.getInstance().nextSibling(b);
    return (b = cvox.TraverseMath.getInstance().getAttachedActiveNode()) ? cvox.CursorSelection.fromNode(b) : a
};
cvox.MathShifter.prototype.sync = function (a) {
    var b = cvox.TraverseMath.getInstance().getAttachedActiveNode();
    return b ? cvox.CursorSelection.fromNode(b) : a
};
cvox.MathShifter.prototype.getName = function () {
    return cvox.ChromeVox.msgs.getMsg("math_shifter")
};
cvox.MathShifter.prototype.getDescription = function (a, b) {
    var c = cvox.SpeechRuleEngine.getInstance().evaluateNode(cvox.TraverseMath.getInstance().activeNode);
    this.bumped_ && 0 < c.length && c[0].pushEarcon(cvox.AbstractEarcons.WRAP_EDGE);
    return c
};
cvox.MathShifter.prototype.getBraille = function (a, b) {
    return new cvox.NavBraille({
        text: cvox.BrailleUtil.getTemplated(a.start.node, b.start.node)
    })
};
cvox.MathShifter.prototype.getGranularityMsg = function () {
    return this.direction_ ? "up to level " + this.level_ : "down to level " + this.level_
};
cvox.MathShifter.prototype.makeLessGranular = function () {
    this.level_ = 0 < this.level_ ? this.level_ - 1 : 0;
    this.direction_ = !0;
    this.bumped_ = !cvox.TraverseMath.getInstance().nextParentChild(!0)
};
cvox.MathShifter.prototype.makeMoreGranular = function () {
    this.direction_ = !1;
    (this.bumped_ = !cvox.TraverseMath.getInstance().nextParentChild(!1)) || this.level_++
};
cvox.MathShifter.create = function (a) {
    if (cvox.DomPredicates.mathPredicate(cvox.DomUtil.getAncestors(a.start.node))) {
        var b = cvox.DomUtil.getContainingMath(a.end.node);
        cvox.TraverseMath.getInstance().initialize(b);
        cvox.SpeechRuleEngine.getInstance().parameterize(cvox.MathmlStore.getInstance());
        b = cvox.MathStore.createDynamicConstraint(cvox.TraverseMath.getInstance().domain, cvox.TraverseMath.getInstance().style);
        cvox.SpeechRuleEngine.getInstance().setDynamicConstraint(b);
        return new cvox.MathShifter(a)
    }
    return null
};
cvox.MathShifter.prototype.getDomainMsg = function () {
    return cvox.TraverseMath.getInstance().domain
};
