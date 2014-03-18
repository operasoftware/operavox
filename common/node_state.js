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

cvox.NodeStateUtil = {};
cvox.NodeStateUtil.expand = function (a) {
    try {
        return a.map(function (a) {
            if (1 > a.length) {
                throw Error("cvox.NodeState must have at least one entry");
            }
            var b = a.slice(1).map(function (a) {
                return "number" == typeof a ? cvox.ChromeVox.msgs.getNumber(a) : a
            });
            return cvox.ChromeVox.msgs.getMsg(a[0], b)
        }).join(" ")
    } catch (b) {
        throw Error("error: " + b + " state: " + a);
    }
};
