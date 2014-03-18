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

cvox.PlatformUtil = {};
cvox.PlatformUtil.CHROME_DEV_VERSION = 26;
cvox.PlatformFilter = {
    NONE: 0,
    WINDOWS: 1,
    MAC: 2,
    LINUX: 4,
    WML: 7,
    CHROMEOS: 8,
    ANDROID: 16,
    ANDROID_DEV: 32
};
cvox.PlatformUtil.matchesPlatform = function (a) {
    var b = navigator.userAgent;
    return void 0 == a ? !0 : -1 != b.indexOf("Android") ? (b = /Chrome\/(\d+)\./.exec(b)) && b[1] >= cvox.PlatformUtil.CHROME_DEV_VERSION ? 0 != (a & cvox.PlatformFilter.ANDROID_DEV) : 0 != (a & cvox.PlatformFilter.ANDROID) : -1 != b.indexOf("Win") ? 0 != (a & cvox.PlatformFilter.WINDOWS) : -1 != b.indexOf("Mac") ? 0 != (a & cvox.PlatformFilter.MAC) : -1 != b.indexOf("Linux") ? 0 != (a & cvox.PlatformFilter.LINUX) : -1 != b.indexOf("CrOS") ? 0 != (a & cvox.PlatformFilter.CHROMEOS) : !1
};
