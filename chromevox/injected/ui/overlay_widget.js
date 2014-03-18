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

cvox.OverlayWidget = function (a) {
    cvox.SearchWidget.call(this);
    this.snippet_ = a
};
goog.inherits(cvox.OverlayWidget, cvox.SearchWidget);
cvox.OverlayWidget.prototype.show = function () {
    cvox.OverlayWidget.superClass_.show.call(this);
    var a = document.createElement("DIV");
    a.innerHTML = this.snippet_;
    var b = cvox.DomUtil.elementToPoint(cvox.ChromeVox.navigationManager.getCurrentNode());
    a.style.position = "absolute";
    a.style.left = b.x;
    a.style.top = b.y;
    document.body.appendChild(a);
    cvox.ChromeVox.navigationManager.updateSelToArbitraryNode(a);
    this.host_ = a
};
cvox.OverlayWidget.prototype.hide = function (a) {
    this.host_.remove();
    cvox.OverlayWidget.superClass_.hide.call(this)
};
cvox.OverlayWidget.prototype.onKeyDown = function (a) {
    cvox.OverlayWidget.superClass_.onKeyDown.call(this, a);
    if (13 == a.keyCode || 27 == a.keyCode) {
        return !0
    }
    a = cvox.ChromeVox.navigationManager.isReversed();
    cvox.DomUtil.isDescendantOfNode(cvox.ChromeVox.navigationManager.getCurrentNode(), this.host_) || (a ? cvox.ChromeVox.navigationManager.syncToBeginning() : cvox.ChromeVox.navigationManager.updateSelToArbitraryNode(this.host_), this.onNavigate(), cvox.ChromeVox.navigationManager.speakDescriptionArray(cvox.ChromeVox.navigationManager.getDescription(), 0, null))
};
