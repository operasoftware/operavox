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

cvox.RunnerInterface = function () {};
cvox.RunnerInterface.prototype.assertTrue = function (a) {};
cvox.RunnerInterface.prototype.assertFalse = function (a) {};
cvox.RunnerInterface.prototype.assertEquals = function (a, b) {};
cvox.RunnerInterface.prototype.assertSpoken = function (a) {};
cvox.RunnerInterface.prototype.assertSpokenList = function (a) {};
cvox.RunnerInterface.prototype.appendHtml = function (a) {};
cvox.RunnerInterface.prototype.waitForCalm = function (a, b) {};
cvox.RunnerInterface.prototype.setFocus = function (a) {};
cvox.RunnerInterface.prototype.userCommand = function (a) {};
