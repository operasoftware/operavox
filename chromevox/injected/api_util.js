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

"undefined" != typeof goog && goog.provide && (cvox.ApiUtil = {});
window.cvox || (window.cvox = {});
cvox.ApiUtils = function () {};
cvox.ApiUtils.nextCvoxId_ = 1;
cvox.ApiUtils.makeNodeReference = function (a) {
    if (a.id && document.getElementById(a.id) == a) {
        return {
            id: a.id
        }
    }
    if (a instanceof HTMLElement) {
        var b = cvox.ApiUtils.nextCvoxId_;
        a.setAttribute("cvoxid", b);
        cvox.ApiUtils.nextCvoxId_ = (cvox.ApiUtils.nextCvoxId_ + 1) % 100;
        return {
            cvoxid: b
        }
    }
    if (a.parentElement) {
        for (var c = a.parentElement, d = -1, b = 0; b < c.childNodes.length; b++) {
            if (c.childNodes[b] == a) {
                d = b;
                break
            }
        }
        if (0 <= d) {
            return b = cvox.ApiUtils.nextCvoxId_, c.setAttribute("cvoxid", b), cvox.ApiUtils.nextCvoxId_ = (cvox.ApiUtils.nextCvoxId_ + 1) % 100, {
                cvoxid: b,
                childIndex: d
            }
        }
    }
    throw "Cannot reference node: " + a;
};
cvox.ApiUtils.getNodeFromRef = function (a) {
    if (a.id) {
        return document.getElementById(a.id)
    }
    if (a.cvoxid) {
        var b = document.querySelector('*[cvoxid="' + a.cvoxid + '"]');
        b && b.removeAttribute && b.removeAttribute("cvoxid");
        return null != a.childIndex ? b.childNodes[a.childIndex] : b
    }
    throw "Bad node reference: " + cvox.ChromeVoxJSON.stringify(a);
};
