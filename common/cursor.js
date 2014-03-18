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

cvox.Cursor = function (a, b, c) {
    this.node = a;
    this.index = b;
    this.text = c
};
cvox.Cursor.prototype.clone = function () {
    return new cvox.Cursor(this.node, this.index, this.text)
};
cvox.Cursor.prototype.copyFrom = function (a) {
    this.node = a.node;
    this.index = a.index;
    this.text = a.text
};
cvox.Cursor.prototype.equals = function (a) {
    return this.node == a.node && this.index == a.index && this.text == a.text
};
