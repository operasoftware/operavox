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

cvox.StructuralLineWalker = function () {
    cvox.AbstractSelectionWalker.call(this);
    this.grain = cvox.TraverseContent.kLine
};
goog.inherits(cvox.StructuralLineWalker, cvox.AbstractSelectionWalker);
cvox.StructuralLineWalker.prototype.getGranularityMsg = function () {
    return cvox.ChromeVox.msgs.getMsg("structural_line")
};
cvox.StructuralLineWalker.prototype.getDescription = function (a, b) {
    var c = cvox.StructuralLineWalker.superClass_.getDescription.call(this, a, b);
    c[0].text = cvox.DomUtil.getPrefixText(b.absStart().node, b.absStart().index) + c[0].text;
    return c
};
cvox.StructuralLineWalker.prototype.getBraille = function (a, b) {
    var c = cvox.StructuralLineWalker.superClass_.getBraille.call(this, a, b),
        d = this.objWalker_.sync(b).absStart().node;
    b.absStart();
    var e = a.absEnd().node,
        f = void 0;
    b.start.equals(b.end) || cvox.DomPredicates.editTextPredicate([d]) || (f = cvox.DomUtil.getPrefixText(b.absStart().node, b.absStart().index) + b.getText());
    e = cvox.BrailleUtil.getTemplated(e, d, {
        name: f
    });
    e.setSpan(d, 0, e.getLength());
    c.text = e;
    c.startIndex = 0;
    c.endIndex = 0;
    return c
};
