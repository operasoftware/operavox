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

cvox.UserEventDetail = function (a) {
    this.command = this.category = ""; - 1 != cvox.UserEventDetail.JUMP_COMMANDS.indexOf(a.command) && (this.command = a.command, this.category = cvox.UserEventDetail.Category.JUMP);
    this.customCommand = "";
    a.customCommand && (this.customCommand = a.customCommand, this.category = cvox.UserEventDetail.Category.CUSTOM);
    this.status = cvox.UserEventDetail.Status.PENDING;
    switch (a.status) {
    case cvox.UserEventDetail.Status.SUCCESS:
        this.status = cvox.UserEventDetail.Status.SUCCESS;
        break;
    case cvox.UserEventDetail.Status.FAILURE:
        this.status = cvox.UserEventDetail.Status.FAILURE
    }
    this.resultNode = null;
    a.resultNode && cvox.DomUtil.isAttachedToDocument(a.resultNode) && (this.resultNode = a.resultNode)
};
cvox.UserEventDetail.Category = {
    JUMP: "ATJumpEvent",
    CUSTOM: "ATCustomEvent"
};
cvox.UserEventDetail.Status = {
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE"
};
cvox.UserEventDetail.JUMP_COMMANDS = "nextCheckbox previousCheckbox nextRadio previousRadio nextSlider previousSlider nextGraphic previousGraphic nextButton previousButton nextComboBox previousComboBox nextEditText previousEditText nextHeading previousHeading nextHeading1 previousHeading1 nextHeading2 previousHeading2 nextHeading3 previousHeading3 nextHeading4 previousHeading4 nextHeading5 previousHeading5 nextHeading6 previousHeading6 nextLink previousLink nextMath previousMath nextTable previousTable nextList previousList nextListItem previousListItem nextFormField previousFormField nextLandmark previousLandmark nextSection previousSection nextControl previousControl".split(" ");
cvox.UserEventDetail.prototype.createEventObject = function () {
    var a = document.createEvent("CustomEvent");
    a.initCustomEvent(this.category, !0, !0, this);
    return a
};
