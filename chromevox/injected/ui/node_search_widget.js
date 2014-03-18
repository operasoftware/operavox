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

cvox.NodeSearchWidget = function (a, b) {
    this.typeMsg_ = a;
    this.predicate_ = b;
    cvox.SearchWidget.call(this)
};
goog.inherits(cvox.NodeSearchWidget, cvox.SearchWidget);
cvox.NodeSearchWidget.prototype.getNameMsg = function () {
    return ["choice_widget_name", [cvox.ChromeVox.msgs.getMsg(this.typeMsg_)]]
};
cvox.NodeSearchWidget.prototype.getHelpMsg = function () {
    return "choice_widget_help"
};
cvox.NodeSearchWidget.prototype.getPredicate = function () {
    return this.predicate_
};
cvox.NodeSearchWidget.create = function (a, b) {
    return new cvox.NodeSearchWidget(a, b)
};
