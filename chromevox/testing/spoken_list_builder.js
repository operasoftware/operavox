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

cvox.SpokenListBuilder = function () {
    this.list_ = []
};
cvox.SpokenListBuilder.prototype.flush = function (a) {
    this.list_.push([a, cvox.AbstractTts.QUEUE_MODE_FLUSH]);
    return this
};
cvox.SpokenListBuilder.prototype.queue = function (a) {
    this.list_.push([a, cvox.AbstractTts.QUEUE_MODE_QUEUE]);
    return this
};
cvox.SpokenListBuilder.prototype.build = function () {
    return this.list_
};
