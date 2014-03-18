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

cvox.ActiveIndicator = function () {
    this.lastMoveTime_ = 0;
    this.zoom_ = 1;
    this.updateIndicatorTimeoutId_ = this.lastClientRects_ = this.lastSyncTarget_ = this.rects_ = this.container_ = null;
    this.blurred_ = !1;
    window.addEventListener("focus", goog.bind(function () {
        this.blurred_ = !1;
        this.container_ && this.container_.classList.remove("cvox_indicator_window_not_focused")
    }, this), !1);
    window.addEventListener("blur", goog.bind(function () {
        this.blurred_ = !0;
        this.container_ && this.container_.classList.add("cvox_indicator_window_not_focused")
    }, this), !1)
};
cvox.ActiveIndicator.STYLE = ".cvox_indicator_container {  position: absolute !important;  left: 0 !important;  top: 0 !important;  z-index: 2147483647 !important;  pointer-events: none !important;}.cvox_indicator_window_not_focused {  visibility: hidden !important;}.cvox_indicator_pulsing {  -webkit-animation:       cvox_indicator_pulsing_animation 0s 2 alternate !important;  -webkit-animation-timing-function: ease-in-out !important;}.cvox_indicator_region {  opacity: 0 !important;  -webkit-transition: opacity 1s !important;}.cvox_indicator_visible {  opacity: 1 !important;}.cvox_indicator_container .cvox_indicator_region * {  position:absolute !important;  box-shadow: 0 0 4px 4px #f7983a !important;  border-radius: 6px !important;  -webkit-transition: none !important;}.cvox_indicator_animate_normal .cvox_indicator_region * {  -webkit-transition: all 0.3s !important;}.cvox_indicator_animate_quick .cvox_indicator_region * {  -webkit-transition: all 0.1s !important;}.cvox_indicator_top {  border-radius: inherit inherit 0 0 !important;}.cvox_indicator_middle_nw {  border-radius: inherit 0 0 0 !important;}.cvox_indicator_middle_ne {  border-radius: 0 inherit 0 0 !important;}.cvox_indicator_middle_se {  border-radius: 0 0 inherit 0 !important;}.cvox_indicator_middle_sw {  border-radius: 0 0 0 inherit !important;}.cvox_indicator_bottom {  border-radius: 0 0 inherit inherit !important;}@-webkit-keyframes cvox_indicator_pulsing_animation {   0% {opacity: 1.0}  50% {opacity: 0.5} 100% {opacity: 1.0}}";
cvox.ActiveIndicator.QUICK_ANIM_DELAY_MS = 100;
cvox.ActiveIndicator.NORMAL_ANIM_DELAY_MS = 300;
cvox.ActiveIndicator.MARGIN = 8;
cvox.ActiveIndicator.prototype.removeFromDom = function () {
    this.container_ && this.container_.parentElement && this.container_.parentElement.removeChild(this.container_)
};
cvox.ActiveIndicator.prototype.syncToNode = function (a) {
    a && (a == document.body ? this.removeFromDom() : this.syncToNodes([a]))
};
cvox.ActiveIndicator.prototype.syncToNodes = function (a) {
    var b = this.clientRectsFromNodes_(a);
    this.moveIndicator_(b, cvox.ActiveIndicator.MARGIN);
    this.lastSyncTarget_ = a;
    this.lastClientRects_ = b;
    null != this.updateIndicatorTimeoutId_ && (window.clearTimeout(this.updateIndicatorTimeoutId_), this.updateIndicatorTimeoutId_ = null)
};
cvox.ActiveIndicator.prototype.syncToRange = function (a) {
    var b = cvox.ActiveIndicator.MARGIN;
    a.startContainer == a.endContainer && a.startOffset + 1 == a.endOffset && (b = 1);
    var c = a.getClientRects();
    this.moveIndicator_(c, b);
    this.lastSyncTarget_ = a;
    this.lastClientRects_ = c;
    null != this.updateIndicatorTimeoutId_ && (window.clearTimeout(this.updateIndicatorTimeoutId_), this.updateIndicatorTimeoutId_ = null)
};
cvox.ActiveIndicator.prototype.syncToCursorSelection = function (a) {
    if (a.start.node == a.end.node && a.start.index == a.end.index) {
        this.syncToNode(a.start.node)
    } else {
        var b = document.createRange();
        b.setStart(a.start.node, a.start.index);
        b.setEnd(a.end.node, a.end.index);
        this.syncToRange(b)
    }
};
cvox.ActiveIndicator.prototype.updateIndicatorIfChanged = function () {
    this.updateIndicatorTimeoutId_ || (this.updateIndicatorTimeoutId_ = window.setTimeout(goog.bind(function () {
        this.handleUpdateIndicatorIfChanged_()
    }, this), 100))
};
cvox.ActiveIndicator.prototype.handleUpdateIndicatorIfChanged_ = function () {
    this.updateIndicatorTimeoutId_ = null;
    if (this.lastSyncTarget_) {
        var a;
        if ((a = this.lastSyncTarget_ instanceof Array ? this.clientRectsFromNodes_(this.lastSyncTarget_) : this.lastSyncTarget_.getClientRects()) && 0 != a.length) {
            var b = !1;
            if (a.length != this.lastClientRects_.length) {
                b = !0
            } else {
                for (var c = 0; c < this.lastClientRects_.length; ++c) {
                    var d = this.lastClientRects_[c],
                        e = a[c];
                    if (d.top != e.top || d.right != e.right || d.bottom != e.bottom || d.left != d.left) {
                        b = !0;
                        break
                    }
                }
            }
            b && (this.moveIndicator_(a, cvox.ActiveIndicator.MARGIN), this.lastClientRects_ = a)
        } else {
            this.syncToNode(document.body)
        }
    }
};
cvox.ActiveIndicator.prototype.clientRectsFromNodes_ = function (a) {
    for (var b = [], c = 0; c < a.length; ++c) {
        var d = a[c];
        if (d.constructor == Text) {
            var e = document.createRange();
            e.selectNode(d);
            e = e.getClientRects()
        } else {
            for (; !d.getClientRects;) {
                d = d.parentElement
            }
            e = d.getClientRects()
        }
        for (d = 0; d < e.length; ++d) {
            b.push(e[d])
        }
    }
    return b
};
cvox.ActiveIndicator.prototype.moveIndicator_ = function (a, b) {
    if (document.body.isContentEditable) {
        this.removeFromDom()
    } else {
        var c = a.length;
        if (0 != c) {
            var d, e;
            "static" != window.getComputedStyle(document.body, null).position ? (d = -document.body.getBoundingClientRect().left, e = -document.body.getBoundingClientRect().top) : "static" != window.getComputedStyle(document.documentElement, null).position ? (d = -document.documentElement.getBoundingClientRect().left, e = -document.documentElement.getBoundingClientRect().top) : (d = window.pageXOffset, e = window.pageYOffset);
            for (var f = [], g = 0; g < c; g++) {
                f.push(this.inset_(a[g], d, e, -d, -e))
            }
            if (!this.container_ || !this.container_.parentElement) {
                g = document.getElementsByClassName("cvox_indicator_container");
                for (c = 0; d = g[c]; c++) {
                    d.parentNode && d.parentNode.removeChild(d)
                }
                this.container_ = this.createDiv_(document.body, "cvox_indicator_container", document.body.firstChild)
            }
            g = document.createElement("style");
            g.id = "cvox_indicator_style";
            g.innerHTML = cvox.ActiveIndicator.STYLE;
            cvox.DomUtil.addNodeToHead(g, g.id);
            g = (new Date).getTime();
            c = g - this.lastMoveTime_;
            this.container_.className = "cvox_indicator_container";
            document.hasFocus() && !this.blurred_ || this.container_.classList.add("cvox_indicator_window_not_focused");
            c > cvox.ActiveIndicator.NORMAL_ANIM_DELAY_MS ? this.container_.classList.add("cvox_indicator_animate_normal") : c > cvox.ActiveIndicator.QUICK_ANIM_DELAY_MS && this.container_.classList.add("cvox_indicator_animate_quick");
            this.lastMoveTime_ = g;
            this.computeZoomLevel_();
            for (window.setTimeout(goog.bind(function () {
                this.container_.classList.add("cvox_indicator_pulsing")
            }, this), 0); 1 < this.container_.childElementCount;) {
                this.container_.removeChild(this.container_.lastElementChild)
            }
            d = [[f[0]]];
            e = [f[0]];
            for (g = 1; g < f.length; g++) {
                for (var h = !1, c = 0; c < d.length && !h; c++) {
                    this.intersects_(f[g], e[c]) && (d[c].push(f[g]), e[c] = this.union_(e[c], f[g]), h = !0)
                }
                h || (d.push([f[g]]), e.push(f[g]))
            }
            do {
                for (f = !1, g = 0; g < d.length - 1 && !f; g++) {
                    for (c = g + 1; c < d.length && !f; c++) {
                        this.intersects_(e[g], e[c]) && (d[g] = d[g].concat(d[c]), e[g] = this.union_(e[g], e[c]), d.splice(c, 1), e.splice(c, 1), f = !0)
                    }
                }
            } while (f);
            for (g = 0; g < d.length; g++) {
                d[g].sort(function (a, b) {
                    return a.top != b.top ? a.top - b.top : a.left - b.left
                })
            }
            for (g = 0; g < d.length; g++) {
                f = null, 0 == g && 1 == this.container_.childElementCount && 6 == this.container_.children[0].childElementCount && (f = this.container_.children[0]), this.updateIndicatorRegion_(d[g], f, b)
            }
        }
    }
};
cvox.ActiveIndicator.prototype.updateIndicatorRegion_ = function (a, b, c) {
    if (b) {
        var d = b.children[0],
            e = b.children[1],
            f = b.children[2],
            g = b.children[3],
            h = b.children[4],
            k = b.children[5]
    } else {
        b = this.createDiv_(this.container_, "cvox_indicator_region"), window.setTimeout(function () {
            b.classList.add("cvox_indicator_visible")
        }, 0), d = this.createDiv_(b, "cvox_indicator_top"), e = this.createDiv_(b, "cvox_indicator_middle_nw"), f = this.createDiv_(b, "cvox_indicator_middle_ne"), g = this.createDiv_(b, "cvox_indicator_middle_sw"), h = this.createDiv_(b, "cvox_indicator_middle_se"), k = this.createDiv_(b, "cvox_indicator_bottom")
    }
    for (var l = a[0], m = Math.floor((l.top + l.bottom) / 2), p = 1, q = a.length; p < q && a[p].top < m;) {
        l = this.union_(l, a[p]), m = Math.floor((l.top + l.bottom) / 2), p++
    }
    if (p == q) {
        l = this.inset_(l, -c, -c, -c, -c), a = Math.floor((3 * l.top + 1 * l.bottom) / 4), c = Math.floor((2 * l.top + 2 * l.bottom) / 4), m = Math.floor((1 * l.top + 3 * l.bottom) / 4), this.setElementCoords_(d, l.left, l.top, l.right, a, !0, !0, !0, !1), this.setElementCoords_(e, l.left, a, l.left, c, !0, !0, !1, !1), this.setElementCoords_(g, l.left, c, l.left, m, !0, !1, !1, !0), this.setElementCoords_(f, l.right, a, l.right, c, !1, !0, !0, !1), this.setElementCoords_(h, l.right, c, l.right, m, !1, !1, !0, !0), this.setElementCoords_(k, l.left, m, l.right, l.bottom, !0, !1, !0, !0)
    } else {
        for (var m = a[q - 1], n = Math.floor((m.top + m.bottom) / 2), q = q - 2; 0 <= q && a[q].bottom > n;) {
            m = this.union_(m, a[q]), n = Math.floor((m.top + m.bottom) / 2), q--
        }
        l = this.inset_(l, -c, -c, -c, c);
        m = this.inset_(m, -c, c, -c, -c);
        if (p > q) {
            n = this.union_(l, m), n.top = l.bottom, n.bottom = m.top, n.height = Math.floor((n.top + n.bottom) / 2)
        } else {
            n = a[p];
            for (p += 1; p <= q;) {
                n = this.union_(n, a[p]), p++
            }
            n = this.inset_(n, -c, -c, -c, -c);
            n.left = Math.min(n.left, l.left, m.left);
            n.right = Math.max(n.right, l.right, m.right);
            n.width = n.right - n.left
        }
        l.right > n.right - 40 && (l.right = n.right, l.width = l.right - l.left);
        l.left < n.left + 40 && (l.left = n.left, l.width = l.right - l.left);
        m.right > n.right - 40 && (m.right = n.right, m.width = m.right - m.left);
        m.left < n.left + 40 && (m.left = n.left, m.width = m.right - m.left);
        a = Math.floor((n.top + n.bottom) / 2);
        this.setElementRect_(d, l, !0, !0, !0, !1);
        this.setElementRect_(k, m, !0, !1, !0, !0);
        this.setElementCoords_(e, n.left, l.bottom, l.left, a, !0, !0, !1, !1);
        this.setElementCoords_(f, l.right, l.bottom, n.right, a, !1, !0, !0, !1);
        this.setElementCoords_(g, n.left, a, m.left, m.top, !0, !1, !1, !0);
        this.setElementCoords_(h, m.right, a, n.right, m.top, !1, !1, !0, !0)
    }
};
cvox.ActiveIndicator.prototype.intersects_ = function (a, b) {
    var c = 2 * cvox.ActiveIndicator.MARGIN;
    return b.left <= a.right + c && b.right >= a.left - c && b.top <= a.bottom + c && b.bottom >= a.top - c
};
cvox.ActiveIndicator.prototype.union_ = function (a, b) {
    var c = {
        left: Math.min(a.left, b.left),
        top: Math.min(a.top, b.top),
        right: Math.max(a.right, b.right),
        bottom: Math.max(a.bottom, b.bottom)
    };
    c.width = c.right - c.left;
    c.height = c.bottom - c.top;
    return c
};
cvox.ActiveIndicator.prototype.inset_ = function (a, b, c, d, e) {
    a = {
        left: a.left + b,
        top: a.top + c,
        right: a.right - d,
        bottom: a.bottom - e
    };
    a.width = a.right - a.left;
    a.height = a.bottom - a.top;
    return a
};
cvox.ActiveIndicator.prototype.createDiv_ = function (a, b, c) {
    var d = document.createElement("div");
    d.className = b;
    c ? a.insertBefore(d, c) : a.appendChild(d);
    return d
};
cvox.ActiveIndicator.prototype.fixZoom_ = function (a) {
    return (Math.round(a * this.zoom_) + 0.1) / this.zoom_
};
cvox.ActiveIndicator.prototype.fixZoomSum_ = function (a, b) {
    var c = Math.round(a * this.zoom_);
    return (Math.round((a + b) * this.zoom_) - c + 0.1) / this.zoom_
};
cvox.ActiveIndicator.prototype.setElementCoords_ = function (a, b, c, d, e, f, g, h, k) {
    var l = d - b,
        m = e - c;
    d -= b;
    e -= c;
    var p = f ? -20 : 0,
        q = g ? -20 : 0,
        n = h ? 20 : 0,
        s = k ? 20 : 0;
    0 == d && (h ? (b -= 5, d += 5) : f && (d += 10), s = q = 10, c -= 10, e += 20);
    k || (e += 5);
    g || (c -= 5, e += 5, q += 5, s += 5);
    n = 0 == n && 0 == l ? 1 : this.fixZoomSum_(b, n + l);
    s = this.fixZoomSum_(c, s + m);
    a.style.left = this.fixZoom_(b) + "px";
    a.style.top = this.fixZoom_(c) + "px";
    a.style.width = this.fixZoomSum_(b, d) + "px";
    a.style.height = this.fixZoomSum_(c, e) + "px";
    a.style.clip = "rect(" + [q, n, s, p].join("px ") + "px)"
};
cvox.ActiveIndicator.prototype.setElementRect_ = function (a, b, c, d, e, f) {
    this.setElementCoords_(a, b.left, b.top, b.right, b.bottom, c, d, e, f)
};
cvox.ActiveIndicator.prototype.computeZoomLevel_ = function () {
    if (window.innerHeight !== this.innerHeight_ || window.innerWidth !== this.innerWidth_) {
        this.innerHeight_ = window.innerHeight;
        this.innerWidth_ = window.innerWidth;
        var a = document.createElement("div");
        a.innerHTML = "X";
        a.setAttribute("style", "font: 5000px/1em sans-serif !important; -webkit-text-size-adjust:none !important; visibility:hidden !important; left: -10000px !important; top: -10000px !important; position:absolute !important;");
        document.body.appendChild(a);
        var b = Math.round(500 * (5E3 / a.clientHeight)) / 500;
        0.1 < b && 10 > b && (this.zoom_ = b);
        a.parentNode.removeChild(a)
    }
};
