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

cvox.AbstractEarcons = function () {
    this.enabled = !0
};
cvox.AbstractEarcons.prototype.playEarcon = function (a) {};
cvox.AbstractEarcons.prototype.playEarconByName = function (a) {
    this.playEarcon(this.getEarconId(a))
};
cvox.AbstractEarcons.prototype.earconsAvailable = function () {
    return !0
};
cvox.AbstractEarcons.prototype.getEarconName = function (a) {
    this.earconNames || (this.earconNames = [], this.earconNames.push("ALERT_MODAL"), this.earconNames.push("ALERT_NONMODAL"), this.earconNames.push("BULLET"), this.earconNames.push("BUSY_PROGRESS_LOOP"), this.earconNames.push("BUSY_WORKING_LOOP"), this.earconNames.push("BUTTON"), this.earconNames.push("CHECK_OFF"), this.earconNames.push("CHECK_ON"), this.earconNames.push("COLLAPSED"), this.earconNames.push("EDITABLE_TEXT"), this.earconNames.push("ELLIPSIS"), this.earconNames.push("EXPANDED"), this.earconNames.push("FONT_CHANGE"),
        this.earconNames.push("INVALID_KEYPRESS"), this.earconNames.push("LINK"), this.earconNames.push("LISTBOX"), this.earconNames.push("LIST_ITEM"), this.earconNames.push("LONG_DESC"), this.earconNames.push("NEW_MAIL"), this.earconNames.push("OBJECT_CLOSE"), this.earconNames.push("OBJECT_DELETE"), this.earconNames.push("OBJECT_DESELECT"), this.earconNames.push("OBJECT_ENTER"), this.earconNames.push("OBJECT_EXIT"), this.earconNames.push("OBJECT_OPEN"), this.earconNames.push("OBJECT_SELECT"), this.earconNames.push("PARAGRAPH_BREAK"),
        this.earconNames.push("SEARCH_HIT"), this.earconNames.push("SEARCH_MISS"), this.earconNames.push("SECTION"), this.earconNames.push("SELECTION"), this.earconNames.push("SELECTION_REVERSE"), this.earconNames.push("SPECIAL_CONTENT"), this.earconNames.push("TASK_SUCCESS"), this.earconNames.push("WRAP"), this.earconNames.push("WRAP_EDGE"));
    return this.earconNames[a]
};
cvox.AbstractEarcons.prototype.getEarconId = function (a) {
    this.earconNamesToIds || (this.earconNamesToIds = {}, this.earconNamesToIds.ALERT_MODAL = cvox.AbstractEarcons.ALERT_MODAL, this.earconNamesToIds.ALERT_NONMODAL = cvox.AbstractEarcons.ALERT_NONMODAL, this.earconNamesToIds.BULLET = cvox.AbstractEarcons.BULLET, this.earconNamesToIds.BUSY_PROGRESS_LOOP = cvox.AbstractEarcons.BUSY_PROGRESS_LOOP, this.earconNamesToIds.BUSY_WORKING_LOOP = cvox.AbstractEarcons.BUSY_WORKING_LOOP, this.earconNamesToIds.BUTTON = cvox.AbstractEarcons.BUTTON, this.earconNamesToIds.CHECK_OFF =
        cvox.AbstractEarcons.CHECK_OFF, this.earconNamesToIds.CHECK_ON = cvox.AbstractEarcons.CHECK_ON, this.earconNamesToIds.COLLAPSED = cvox.AbstractEarcons.COLLAPSED, this.earconNamesToIds.EDITABLE_TEXT = cvox.AbstractEarcons.EDITABLE_TEXT, this.earconNamesToIds.ELLIPSIS = cvox.AbstractEarcons.ELLIPSIS, this.earconNamesToIds.EXPANDED = cvox.AbstractEarcons.EXPANDED, this.earconNamesToIds.FONT_CHANGE = cvox.AbstractEarcons.FONT_CHANGE, this.earconNamesToIds.INVALID_KEYPRESS = cvox.AbstractEarcons.INVALID_KEYPRESS,
        this.earconNamesToIds.LINK = cvox.AbstractEarcons.LINK, this.earconNamesToIds.LISTBOX = cvox.AbstractEarcons.LISTBOX, this.earconNamesToIds.LIST_ITEM = cvox.AbstractEarcons.LIST_ITEM, this.earconNamesToIds.LONG_DESC = cvox.AbstractEarcons.LONG_DESC, this.earconNamesToIds.NEW_MAIL = cvox.AbstractEarcons.NEW_MAIL, this.earconNamesToIds.OBJECT_CLOSE = cvox.AbstractEarcons.OBJECT_CLOSE, this.earconNamesToIds.OBJECT_DELETE = cvox.AbstractEarcons.OBJECT_DELETE, this.earconNamesToIds.OBJECT_DESELECT =
        cvox.AbstractEarcons.OBJECT_DESELECT, this.earconNamesToIds.OBJECT_ENTER = cvox.AbstractEarcons.OBJECT_ENTER, this.earconNamesToIds.OBJECT_EXIT = cvox.AbstractEarcons.OBJECT_EXIT, this.earconNamesToIds.OBJECT_OPEN = cvox.AbstractEarcons.OBJECT_OPEN, this.earconNamesToIds.OBJECT_SELECT = cvox.AbstractEarcons.OBJECT_SELECT, this.earconNamesToIds.PARAGRAPH_BREAK = cvox.AbstractEarcons.PARAGRAPH_BREAK, this.earconNamesToIds.SEARCH_HIT = cvox.AbstractEarcons.SEARCH_HIT, this.earconNamesToIds.SEARCH_MISS =
        cvox.AbstractEarcons.SEARCH_MISS, this.earconNamesToIds.SECTION = cvox.AbstractEarcons.SECTION, this.earconNamesToIds.SELECTION = cvox.AbstractEarcons.SELECTION, this.earconNamesToIds.SELECTION_REVERSE = cvox.AbstractEarcons.SELECTION_REVERSE, this.earconNamesToIds.SPECIAL_CONTENT = cvox.AbstractEarcons.SPECIAL_CONTENT, this.earconNamesToIds.TASK_SUCCESS = cvox.AbstractEarcons.TASK_SUCCESS, this.earconNamesToIds.WRAP = cvox.AbstractEarcons.WRAP, this.earconNamesToIds.WRAP_EDGE = cvox.AbstractEarcons.WRAP_EDGE);
    return this.earconNamesToIds[a]
};
cvox.AbstractEarcons.prototype.getEarconFilename = function (a) {
    return cvox.AbstractEarcons.earconMap[a]
};
cvox.AbstractEarcons.prototype.toggle = function () {
    return this.enabled = !this.enabled
};
cvox.AbstractEarcons.ALERT_MODAL = 0;
cvox.AbstractEarcons.ALERT_NONMODAL = 1;
cvox.AbstractEarcons.BULLET = 2;
cvox.AbstractEarcons.BUSY_PROGRESS_LOOP = 3;
cvox.AbstractEarcons.BUSY_WORKING_LOOP = 4;
cvox.AbstractEarcons.BUTTON = 5;
cvox.AbstractEarcons.CHECK_OFF = 6;
cvox.AbstractEarcons.CHECK_ON = 7;
cvox.AbstractEarcons.COLLAPSED = 8;
cvox.AbstractEarcons.EDITABLE_TEXT = 9;
cvox.AbstractEarcons.ELLIPSIS = 10;
cvox.AbstractEarcons.EXPANDED = 11;
cvox.AbstractEarcons.FONT_CHANGE = 12;
cvox.AbstractEarcons.INVALID_KEYPRESS = 13;
cvox.AbstractEarcons.LINK = 14;
cvox.AbstractEarcons.LISTBOX = 15;
cvox.AbstractEarcons.LIST_ITEM = 16;
cvox.AbstractEarcons.LONG_DESC = 17;
cvox.AbstractEarcons.NEW_MAIL = 18;
cvox.AbstractEarcons.OBJECT_CLOSE = 19;
cvox.AbstractEarcons.OBJECT_DELETE = 20;
cvox.AbstractEarcons.OBJECT_DESELECT = 21;
cvox.AbstractEarcons.OBJECT_ENTER = 22;
cvox.AbstractEarcons.OBJECT_EXIT = 23;
cvox.AbstractEarcons.OBJECT_OPEN = 24;
cvox.AbstractEarcons.OBJECT_SELECT = 25;
cvox.AbstractEarcons.PARAGRAPH_BREAK = 26;
cvox.AbstractEarcons.SEARCH_HIT = 27;
cvox.AbstractEarcons.SEARCH_MISS = 28;
cvox.AbstractEarcons.SECTION = 29;
cvox.AbstractEarcons.SELECTION = 30;
cvox.AbstractEarcons.SELECTION_REVERSE = 31;
cvox.AbstractEarcons.SPECIAL_CONTENT = 32;
cvox.AbstractEarcons.TASK_SUCCESS = 33;
cvox.AbstractEarcons.WRAP = 34;
cvox.AbstractEarcons.WRAP_EDGE = 35;
cvox.AbstractEarcons.earconMap = {};
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.ALERT_MODAL] = "alert_modal.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.ALERT_NONMODAL] = "alert_nonmodal.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.BULLET] = "bullet.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.BUSY_PROGRESS_LOOP] = "busy_progress_loop.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.BUSY_WORKING_LOOP] = "busy_working_loop.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.BUTTON] = "button.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.CHECK_OFF] = "check_off.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.CHECK_ON] = "check_on.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.COLLAPSED] = "collapsed.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.EDITABLE_TEXT] = "editable_text.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.ELLIPSIS] = "ellipsis.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.EXPANDED] = "expanded.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.FONT_CHANGE] = "font_change.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.INVALID_KEYPRESS] = "invalid_keypress.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.LINK] = "link.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.LISTBOX] = "listbox.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.LIST_ITEM] = "bullet.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.LONG_DESC] = "long_desc.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.NEW_MAIL] = "new_mail.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.OBJECT_CLOSE] = "object_close.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.OBJECT_DELETE] = "object_delete.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.OBJECT_DESELECT] = "object_deselect.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.OBJECT_ENTER] = "object_enter.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.OBJECT_EXIT] = "object_exit.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.OBJECT_OPEN] = "object_open.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.OBJECT_SELECT] = "object_select.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.PARAGRAPH_BREAK] = "paragraph_break.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.SEARCH_HIT] = "search_hit.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.SEARCH_MISS] = "search_miss.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.SECTION] = "section.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.SELECTION] = "selection.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.SELECTION_REVERSE] = "selection_reverse.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.SPECIAL_CONTENT] = "special_content.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.TASK_SUCCESS] = "task_success.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.WRAP] = "wrap.ogg";
cvox.AbstractEarcons.earconMap[cvox.AbstractEarcons.WRAP_EDGE] = "wrap_edge.ogg";
