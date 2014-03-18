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

cvox.TableUtil = {};
cvox.TableUtil.checkIfHeader = function (a) {
    return "TH" == a.tagName || a.hasAttribute("scope") || a.hasAttribute("role") && ("rowheader" == a.getAttribute("role") || "columnheader" == a.getAttribute("role"))
};
cvox.TableUtil.determineColGroups = function (a) {
    var b = [];
    if (0 == a.length) {
        return b
    }
    for (var c = 0; c < a.length; c++) {
        var d = a[c],
            e = cvox.TableUtil.getColNodes(d);
        if (0 < e.length) {
            for (d = 0; d < e.length; d++) {
                var f = e[d];
                if (f.hasAttribute("span")) {
                    for (var f = parseInt(f.getAttribute("span"), 10), g = 0; g < f; g++) {
                        b.push(c)
                    }
                } else {
                    b.push(c)
                }
            }
        } else {
            if (d.hasAttribute("span")) {
                for (f = parseInt(d.getAttribute("span"), 10), g = 0; g < f; g++) {
                    b.push(c)
                }
            } else {
                b.push(c)
            }
        }
    }
    return b
};
cvox.TableUtil.pushIfNotContained = function (a, b) {
    -1 == a.indexOf(b) && a.push(b)
};
cvox.TableUtil.getChildRows = function (a) {
    return cvox.XpathUtil.evalXPath('child::tbody/tr | child::thead/tr | child::*[attribute::role="row"]', a)
};
cvox.TableUtil.getChildCells = function (a) {
    return cvox.XpathUtil.evalXPath('child::td | child::th | child::*[attribute::role="gridcell"] |child::*[attribute::role="rowheader"] |child::*[attribute::role="columnheader"]', a)
};
cvox.TableUtil.getCellWithID = function (a, b) {
    return cvox.XpathUtil.evalXPath("id('" + b + "')", a)
};
cvox.TableUtil.getColGroups = function (a) {
    return cvox.XpathUtil.evalXPath("child::colgroup", a)
};
cvox.TableUtil.getColNodes = function (a) {
    return cvox.XpathUtil.evalXPath("child::col", a)
};
