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

cvox.Spannable = function (a, b) {
    this.string_ = a || "";
    this.spans_ = [];
    goog.isDef(b) && this.spans_.push({
        value: b,
        start: 0,
        end: this.string_.length
    })
};
cvox.Spannable.prototype.toString = function () {
    return this.string_
};
cvox.Spannable.prototype.getLength = function () {
    return this.string_.length
};
cvox.Spannable.prototype.setSpan = function (a, b, c) {
    this.removeSpan(a);
    if (0 <= b && b <= c && c <= this.string_.length) {
        this.spans_.push({
            value: a,
            start: b,
            end: c
        })
    } else {
        throw new RangeError("span out of range");
    }
};
cvox.Spannable.prototype.removeSpan = function (a) {
    for (var b = this.spans_.length - 1; 0 <= b; b--) {
        this.spans_[b].value === a && this.spans_.splice(b, 1)
    }
};
cvox.Spannable.prototype.append = function (a) {
    if (a instanceof cvox.Spannable) {
        var b = this.getLength();
        this.string_ += a.string_;
        a.spans_.forEach(goog.bind(function (a) {
            this.setSpan(a.value, a.start + b, a.end + b)
        }, this))
    } else {
        "string" === typeof a && (this.string_ += a)
    }
};
cvox.Spannable.prototype.getSpan = function (a) {
    for (var b = 0; b < this.spans_.length; b++) {
        var c = this.spans_[b];
        if (c.start <= a && a < c.end) {
            return c.value
        }
    }
};
cvox.Spannable.prototype.getSpanInstanceOf = function (a) {
    for (var b = 0; b < this.spans_.length; b++) {
        var c = this.spans_[b];
        if (c.value instanceof a) {
            return c.value
        }
    }
};
cvox.Spannable.prototype.getSpans = function (a) {
    for (var b = [], c = 0; c < this.spans_.length; c++) {
        var d = this.spans_[c];
        d.start <= a && a < d.end && b.push(d.value)
    }
    return b
};
cvox.Spannable.prototype.getSpanStart = function (a) {
    for (var b = 0; b < this.spans_.length; b++) {
        var c = this.spans_[b];
        if (c.value === a) {
            return c.start
        }
    }
    return null
};
cvox.Spannable.prototype.getSpanEnd = function (a) {
    for (var b = 0; b < this.spans_.length; b++) {
        var c = this.spans_[b];
        if (c.value === a) {
            return c.end
        }
    }
    return null
};
cvox.Spannable.prototype.substring = function (a, b) {
    var c = goog.isDef(b) ? b : this.string_.length;
    if (0 > a || c > this.string_.length || a > c) {
        throw new RangeError("substring indices out of range");
    }
    for (var d = new cvox.Spannable(this.string_.substring(a, c)), e = 0; e < this.spans_.length; e++) {
        var f = this.spans_[e];
        if (f.start <= c && f.end >= a) {
            var g = Math.max(0, f.start - a),
                h = Math.min(c - a, f.end - a);
            d.spans_.push({
                value: f.value,
                start: g,
                end: h
            })
        }
    }
    return d
};
cvox.Spannable.prototype.trim = function () {
    if (/^\s*$/.test(this.string_)) {
        return this.substring(0, 0)
    }
    var a = this.string_.match(/^\s*/)[0].length,
        b = this.string_.match(/\s*$/).index;
    return this.substring(a, b)
};
