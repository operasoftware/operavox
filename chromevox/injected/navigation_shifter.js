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

cvox.NavigationShifter = function () {
    this.reset_();
    cvox.AbstractShifter.call(this)
};
goog.inherits(cvox.NavigationShifter, cvox.AbstractShifter);
cvox.NavigationShifter.GRANULARITIES = {
    CHARACTER: 0,
    WORD: 1,
    LINE: 2,
    SENTENCE: 3,
    OBJECT: 4,
    GROUP: 5
};
cvox.NavigationShifter.prototype.storeOn = function (a) {
    a.granularity = this.getGranularity()
};
cvox.NavigationShifter.prototype.readFrom = function (a) {
    this.setGranularity(a.granularity)
};
cvox.NavigationShifter.prototype.next = function (a) {
    a = this.currentWalker_.next(a);
    this.currentWalkerIndex_ <= cvox.NavigationShifter.GRANULARITIES.LINE && a && (cvox.TraverseContent.getInstance().syncToCursorSelection(a.clone().setReversed(!1)), cvox.TraverseContent.getInstance().updateSelection());
    return a
};
cvox.NavigationShifter.prototype.sync = function (a) {
    return this.currentWalker_.sync(a)
};
cvox.NavigationShifter.prototype.getName = function () {
    return cvox.ChromeVox.msgs.getMsg("navigation_shifter")
};
cvox.NavigationShifter.prototype.getDescription = function (a, b) {
    return this.currentWalker_.getDescription(a, b)
};
cvox.NavigationShifter.prototype.getBraille = function (a, b) {
    return this.lineWalker_.getBraille(a, b)
};
cvox.NavigationShifter.prototype.getGranularityMsg = function () {
    return this.currentWalker_.getGranularityMsg()
};
cvox.NavigationShifter.prototype.makeMoreGranular = function () {
    cvox.NavigationShifter.superClass_.makeMoreGranular.call(this);
    this.currentWalkerIndex_ = Math.max(this.currentWalkerIndex_ - 1, 0);
    cvox.NavigationShifter.allowSentence || this.currentWalkerIndex_ != cvox.NavigationShifter.GRANULARITIES.SENTENCE || this.currentWalkerIndex_--;
    this.currentWalker_ = this.walkers_[this.currentWalkerIndex_]
};
cvox.NavigationShifter.prototype.makeLessGranular = function () {
    cvox.NavigationShifter.superClass_.makeLessGranular.call(this);
    this.currentWalkerIndex_ = Math.min(this.currentWalkerIndex_ + 1, this.walkers_.length - 1);
    cvox.NavigationShifter.allowSentence || this.currentWalkerIndex_ != cvox.NavigationShifter.GRANULARITIES.SENTENCE || this.currentWalkerIndex_++;
    this.currentWalker_ = this.walkers_[this.currentWalkerIndex_]
};
cvox.NavigationShifter.prototype.setGranularity = function (a) {
    this.ensureNotSubnavigating();
    this.currentWalkerIndex_ = a;
    this.currentWalker_ = this.walkers_[this.currentWalkerIndex_]
};
cvox.NavigationShifter.prototype.getGranularity = function () {
    var a = this.isSubnavigating();
    this.ensureNotSubnavigating();
    var b = this.currentWalkerIndex_;
    a && this.ensureSubnavigating();
    return b
};
cvox.NavigationShifter.prototype.hasAction = function (a) {
    return "toggleLineType" == a ? !0 : cvox.NavigationShifter.superClass_.hasAction.call(this, a)
};
cvox.NavigationShifter.create = function (a) {
    return new cvox.NavigationShifter
};
cvox.NavigationShifter.prototype.reset_ = function () {
    this.groupWalker_ = new cvox.GroupWalker;
    this.objectWalker_ = new cvox.ObjectWalker;
    this.sentenceWalker_ = new cvox.SentenceWalker;
    this.lineWalker_ = new cvox.LayoutLineWalker;
    this.wordWalker_ = new cvox.WordWalker;
    this.characterWalker_ = new cvox.CharacterWalker;
    this.walkers_ = [this.characterWalker_, this.wordWalker_, this.lineWalker_, this.sentenceWalker_, this.objectWalker_, this.groupWalker_];
    this.currentWalkerIndex_ = this.walkers_.indexOf(this.groupWalker_);
    this.currentWalker_ = this.walkers_[this.currentWalkerIndex_]
};
cvox.NavigationShifter.allowSentence = !1;
