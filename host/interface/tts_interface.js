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

cvox.TtsCapturingEventListener = function () {};
cvox.TtsCapturingEventListener.prototype.onTtsStart = function () {};
cvox.TtsCapturingEventListener.prototype.onTtsEnd = function () {};
cvox.TtsInterface = function () {};
cvox.TtsInterface.prototype.speak = function (a, b, c) {};
cvox.TtsInterface.prototype.isSpeaking = function () {};
cvox.TtsInterface.prototype.stop = function () {};
cvox.TtsInterface.prototype.addCapturingEventListener = function (a) {};
cvox.TtsInterface.prototype.increaseOrDecreaseProperty = function (a, b) {};
cvox.TtsInterface.prototype.getDefaultProperty = function (a) {};
