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

cvox.GroupWalker = function () {
    cvox.AbstractNodeWalker.call(this)
};
goog.inherits(cvox.GroupWalker, cvox.AbstractNodeWalker);
cvox.GroupWalker.prototype.getDescription = function (a, b) {
    return cvox.DescriptionUtil.getCollectionDescription(a, b)
};
cvox.GroupWalker.prototype.getBraille = function (a, b) {
    throw "getBraille is unsupported";
};
cvox.GroupWalker.prototype.getGranularityMsg = function () {
    return cvox.ChromeVox.msgs.getMsg("group_strategy")
};
cvox.GroupWalker.prototype.stopNodeDescent = function (a) {
    return cvox.GroupUtil.isLeafNode(a)
};
