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

cvox.GroupUtil = {};
cvox.GroupUtil.MAX_CHARCOUNT_ = 1500;
cvox.GroupUtil.BREAKOUT_SELECTOR_ = 'blockquote,button,code,form,frame,h1,h2,h3,h4,h5,h6,hr,iframe,input,object,ol,p,pre,select,table,tr,ul,math,span.math,[role~="alert alertdialog button checkbox combobox dialog log marquee menubar progressbar radio radiogroup scrollbar slider spinbutton status tab tabpanel textbox toolbar tooltip treeitem article document group heading img list math region row separator"]';
cvox.GroupUtil.isLeafNode = function (a) {
    if ("LABEL" == a.tagName) {
        return cvox.DomUtil.isLeafNode(a)
    }
    if (cvox.DomUtil.isLeafNode(a)) {
        return !0
    }
    if (!cvox.DomUtil.isSemanticElt(a)) {
        for (var b = a.querySelectorAll(cvox.GroupUtil.BREAKOUT_SELECTOR_), c = 0; c < b.length; ++c) {
            if (cvox.DomUtil.hasContent(b[c])) {
                return !1
            }
        }
    }
    if (cvox.AriaUtil.isCompositeControl(a) && !cvox.DomUtil.isFocusable(a)) {
        return !1
    }
    a = cvox.DomUtil.collapseWhitespace(cvox.DomUtil.getValue(a) + " " + cvox.DomUtil.getName(a));
    return a.length > cvox.GroupUtil.MAX_CHARCOUNT_ || "" === a.replace(/\s/g, "") ? !1 : !0
};
