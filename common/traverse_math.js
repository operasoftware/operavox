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

cvox.TraverseMath = function () {
    this.activeNode = this.activeMath = null;
    this.allTexs_ = {};
    this.allMathjaxs_ = {};
    this.todoMathjaxs_ = {};
    this.activeSemanticHost = this.activeMathmlHost = null;
    this.allDomains = [];
    this.allStyles = [];
    this.domain = "default";
    this.style = "short";
    cvox.ChromeVox.mathJax && (this.initializeMathjaxs(), this.initializeAltMaths())
};
goog.addSingletonGetter(cvox.TraverseMath);
cvox.TraverseMath.setSemantic_ = !1;
cvox.TraverseMath.toggleSemantic = function () {
    return cvox.TraverseMath.setSemantic_ = !cvox.TraverseMath.setSemantic_
};
cvox.TraverseMath.prototype.initialize = function (a) {
    if (cvox.DomUtil.isMathImg(a)) {
        if (!a.hasAttribute("cvoxid")) {
            return
        }
        a = a.getAttribute("cvoxid");
        a = this.allTexs_[a]
    }
    cvox.DomUtil.isMathJax(a) && (this.activeMathmlHost = this.allMathjaxs_[a.getAttribute("id")]);
    this.activeMath = this.activeMathmlHost || a;
    (this.activeNode = this.activeMathmlHost || a) && cvox.TraverseMath.setSemantic_ && this.activeNode.nodeType == Node.ELEMENT_NODE && (this.activeNode = (new cvox.SemanticTree(this.activeNode)).xml())
};
cvox.TraverseMath.prototype.addMathjax = function (a, b) {
    var c = cvox.DomUtil.getMathSpanId(b);
    c ? this.allMathjaxs_[c] = a : this.redoMathjaxs(a, b)
};
cvox.TraverseMath.prototype.redoMathjaxs = function (a, b) {
    var c = goog.bind(function () {
        this.addMathjax(a, b)
    }, this);
    setTimeout(c, 500)
};
cvox.TraverseMath.prototype.initializeMathjaxs = function () {
    var a = goog.bind(function (a, c) {
        this.addMathjax(a, c)
    }, this);
    cvox.ChromeVox.mathJax.isMathjaxActive(function (b) {
        b && (cvox.ChromeVox.mathJax.getAllJax(a), cvox.ChromeVox.mathJax.registerSignal(a, "New Math"))
    })
};
cvox.TraverseMath.prototype.initializeAltMaths = function () {
    if (document.querySelector(cvox.DomUtil.altMathQuerySelector("tex") + ", " + cvox.DomUtil.altMathQuerySelector("asciimath"))) {
        var a = goog.bind(function (a, c) {
            this.allTexs_[c] = a
        }, this);
        cvox.ChromeVox.mathJax.injectScripts();
        cvox.ChromeVox.mathJax.isMathjaxActive(function (b) {
            b && (cvox.ChromeVox.mathJax.configMediaWiki(), cvox.ChromeVox.mathJax.getAllTexs(a), cvox.ChromeVox.mathJax.getAllAsciiMaths(a))
        })
    }
};
cvox.TraverseMath.prototype.nextLeaf = function (a, b) {
    if (this.activeNode && this.activeMath) {
        var c = b(this.activeNode) ? cvox.DomUtil.directedFindNextNode(this.activeNode, this.activeMath, a, b) : cvox.DomUtil.directedFindFirstNode(this.activeNode, a, b);
        c && (this.activeNode = c)
    }
    return this.activeNode
};
cvox.TraverseMath.prototype.activeContent = function () {
    return this.activeNode.textContent
};
cvox.TraverseMath.prototype.nextSubtree = function (a, b) {
    if (!this.activeNode || !this.activeMath) {
        return null
    }
    if (a) {
        if (this.activeNode == this.activeMath && (c = cvox.DomUtil.directedFindDeepestNode(this.activeNode, a, b), c != this.activeNode)) {
            return this.activeNode = c
        }
        if (c = cvox.DomUtil.directedFindNextNode(this.activeNode, this.activeMath, a, b, !0, !0)) {
            this.activeNode = c
        }
    } else {
        var c = cvox.DomUtil.directedFindFirstNode(this.activeNode, a, b);
        if (c) {
            this.activeNode = c
        } else {
            if (c = cvox.DomUtil.directedFindNextNode(this.activeNode, this.activeMath, a, b)) {
                this.activeNode = c
            }
        }
    }
    return this.activeNode
};
cvox.TraverseMath.prototype.nextSibling = function (a) {
    if (!this.activeNode || !this.activeMath) {
        return null
    }
    var b = this.activeNode,
        b = a ? b.previousSibling : b.nextSibling;
    return b ? this.activeNode = b : null
};
cvox.TraverseMath.prototype.nextParentChild = function (a) {
    if (!this.activeNode || !this.activeMath || this.activeNode == this.activeMath && a) {
        return null
    }
    var b = this.activeNode,
        b = a ? b.parentNode : b.firstChild;
    return b ? this.activeNode = b : null
};
cvox.TraverseMath.prototype.addDomainsAndStyles = function (a, b) {
    this.allDomains.push.apply(this.allDomains, a.filter(goog.bind(function (a) {
        return 0 > this.allDomains.indexOf(a)
    }, this)));
    this.allStyles.push.apply(this.allStyles, b.filter(goog.bind(function (a) {
        return 0 > this.allStyles.indexOf(a)
    }, this)))
};
cvox.TraverseMath.prototype.initDomainsAndStyles = function () {
    cvox.ChromeVox.host.mathMap ? this.addDomainsAndStyles(cvox.ChromeVox.host.mathMap.allDomains, cvox.ChromeVox.host.mathMap.allStyles) : cvox.ChromeVox.host.sendToBackgroundPage({
        target: "Math",
        action: "getDomains"
    })
};
cvox.TraverseMath.prototype.cycleDomain = function () {
    this.initDomainsAndStyles();
    var a = this.allDomains.indexOf(this.domain);
    return -1 == a ? this.domain : this.domain = this.allDomains[++a % this.allDomains.length]
};
cvox.TraverseMath.prototype.cycleStyle = function () {
    this.initDomainsAndStyles();
    var a = this.allStyles.indexOf(this.style);
    return -1 == a ? this.domain : this.style = this.allStyles[++a % this.allStyles.length]
};
cvox.TraverseMath.prototype.setDomain_ = function (a) {
    -1 != this.allDomains.indexOf(a) ? this.domain = a : this.domain = "default"
};
cvox.TraverseMath.prototype.setStyle_ = function (a) {
    -1 != this.allStyles.indexOf(a) ? this.style = a : this.style = "default"
};
cvox.TraverseMath.prototype.getAttachedActiveNode = function () {
    var a = this.activeNode;
    if (!a || a.nodeType != Node.ELEMENT_NODE) {
        return null
    }
    a = a.getAttribute("spanID");
    return document.getElementById(a)
};
