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

cvox.SemanticTree = function (a) {
    this.idCounter_ = 0;
    this.mathml = a;
    this.root = this.parseMathml_(a)
};
cvox.SemanticTree.Node = function (a) {
    this.id = a;
    this.mathml = [];
    this.parent = null;
    this.type = cvox.SemanticAttr.Type.UNKNOWN;
    this.role = cvox.SemanticAttr.Role.UNKNOWN;
    this.font = cvox.SemanticAttr.Font.UNKNOWN;
    this.childNodes = [];
    this.textContent = "";
    this.contentNodes = []
};
cvox.SemanticTree.Node.prototype.querySelectorAll = function (a) {
    for (var b = [], c = 0, d; d = this.childNodes[c]; c++) {
        b = b.concat(d.querySelectorAll(a))
    }
    a(this) && b.unshift(this);
    return b
};
cvox.SemanticTree.prototype.xml = function (a) {
    var b = (new DOMParser).parseFromString("<stree></stree>", "text/xml");
    a = this.root.xml(b, a);
    b.childNodes[0].appendChild(a);
    return b.childNodes[0]
};
cvox.SemanticTree.Node.prototype.xml = function (a, b) {
    var c = function (c, d) {
        for (var g = d.map(function (c) {
            return c.xml(a, b)
        }), h = a.createElement(c), k = 0, l; l = g[k]; k++) {
            h.appendChild(l)
        }
        return h
    }, d = a.createElement(this.type);
    b || this.xmlAttributes_(d);
    d.textContent = this.textContent;
    0 < this.contentNodes.length && d.appendChild(c("content", this.contentNodes));
    0 < this.childNodes.length && d.appendChild(c("children", this.childNodes));
    return d
};
cvox.SemanticTree.prototype.toString = function (a) {
    return (new XMLSerializer).serializeToString(this.xml(a))
};
cvox.SemanticTree.prototype.formatXml = function (a) {
    a = this.toString(a);
    return cvox.SemanticTree.formatXml(a)
};
cvox.SemanticTree.formatXml = function (a) {
    var b = /(>)(<)(\/*)/g;
    a = a.replace(b, "$1\r\n$2$3");
    b = /(>)(.+)(<c)/g;
    a = a.replace(b, "$1\r\n$2\r\n$3");
    var c = "",
        d = "";
    a.split("\r\n").forEach(function (a) {
        a.match(/.+<\/\w[^>]*>$/) ? c += d + a + "\r\n" : a.match(/^<\/\w/) ? d && (d = d.slice(2), c += d + a + "\r\n") : a.match(/^<\w[^>]*[^\/]>.*$/) ? (c += d + a + "\r\n", d += "  ") : c += d + a + "\r\n"
    });
    return c
};
cvox.SemanticTree.Node.prototype.toString = function (a) {
    var b = new XMLSerializer,
        c = (new DOMParser).parseFromString("", "text/xml");
    return b.serializeToString(this.xml(c, a))
};
cvox.SemanticTree.Node.prototype.xmlAttributes_ = function (a) {
    a.setAttribute("role", this.role);
    this.font != cvox.SemanticAttr.Font.UNKNOWN && a.setAttribute("font", this.font);
    a.setAttribute("id", this.id)
};
cvox.SemanticTree.prototype.createNode_ = function () {
    return new cvox.SemanticTree.Node(this.idCounter_++)
};
cvox.SemanticTree.prototype.replaceNode_ = function (a, b) {
    var c = a.parent;
    c ? c.replaceChild_(a, b) : this.root = b
};
cvox.SemanticTree.Node.prototype.updateContent_ = function (a) {
    a = a.trim();
    if (this.textContent != a) {
        var b = cvox.SemanticAttr.lookupMeaning(a);
        this.textContent = a;
        this.role = b.role;
        this.type = b.type;
        this.font = b.font
    }
};
cvox.SemanticTree.Node.prototype.addMathmlNodes_ = function (a) {
    for (var b = 0, c; c = a[b]; b++) {
        -1 == this.mathml.indexOf(c) && this.mathml.push(c)
    }
};
cvox.SemanticTree.Node.prototype.removeMathmlNodes_ = function (a) {
    for (var b = this.mathml, c = 0, d; d = a[c]; c++) {
        d = b.indexOf(d), -1 != d && goog.array.removeAt(b, d)
    }
    this.mathml = b
};
cvox.SemanticTree.Node.prototype.appendChild_ = function (a) {
    this.childNodes.push(a);
    this.addMathmlNodes_(a.mathml);
    a.parent = this
};
cvox.SemanticTree.Node.prototype.replaceChild_ = function (a, b) {
    var c = this.childNodes.indexOf(a);
    if (-1 != c) {
        b.parent = this;
        a.parent = null;
        this.childNodes[c] = b;
        var c = a.mathml.filter(function (a) {
            return -1 == b.mathml.indexOf(a)
        }),
            d = b.mathml.filter(function (b) {
                return -1 == a.mathml.indexOf(b)
            });
        this.removeMathmlNodes_(c);
        this.addMathmlNodes_(d)
    }
};
cvox.SemanticTree.Node.prototype.appendContentNode_ = function (a) {
    a && (this.contentNodes.push(a), this.addMathmlNodes_(a.mathml), a.parent = this)
};
cvox.SemanticTree.Node.prototype.removeContentNode_ = function (a) {
    a && (a = this.contentNodes.indexOf(a), -1 != a && goog.array.removeAt(this.contentNodes, a))
};
cvox.SemanticTree.prototype.parseMathml_ = function (a) {
    var b = cvox.DomUtil.toArray(a.children);
    switch (cvox.SemanticUtil.tagName(a)) {
    case "MATH":
        ;
    case "MROW":
        ;
    case "MPADDED":
        ;
    case "MSTYLE":
        return b = cvox.SemanticUtil.purgeNodes(b), 1 == b.length ? this.parseMathml_(b[0]) : this.processRow_(this.parseMathmlChildren_(b));
    case "MFRAC":
        return a = this.makeBranchNode_(cvox.SemanticAttr.Type.FRACTION, [this.parseMathml_(b[0]), this.parseMathml_(b[1])], []), a.role = cvox.SemanticAttr.Role.DIVISION, a;
    case "MSUB":
        ;
    case "MSUP":
        ;
    case "MSUBSUP":
        ;
    case "MOVER":
        ;
    case "MUNDER":
        ;
    case "MUNDEROVER":
        return this.makeLimitNode_(cvox.SemanticUtil.tagName(a), this.parseMathmlChildren_(b));
    case "MROOT":
        return this.makeBranchNode_(cvox.SemanticAttr.Type.ROOT, [this.parseMathml_(b[0]), this.parseMathml_(b[1])], []);
    case "MSQRT":
        return b = this.parseMathmlChildren_(cvox.SemanticUtil.purgeNodes(b)), this.makeBranchNode_(cvox.SemanticAttr.Type.SQRT, [this.processRow_(b)], []);
    case "MTABLE":
        return a = this.makeBranchNode_(cvox.SemanticAttr.Type.TABLE, this.parseMathmlChildren_(b), []), cvox.SemanticTree.tableIsMultiline_(a) && this.tableToMultiline_(a), a;
    case "MTR":
        return a = this.makeBranchNode_(cvox.SemanticAttr.Type.ROW, this.parseMathmlChildren_(b), []), a.role = cvox.SemanticAttr.Role.TABLE, a;
    case "MTD":
        return b = this.parseMathmlChildren_(cvox.SemanticUtil.purgeNodes(b)), a = this.makeBranchNode_(cvox.SemanticAttr.Type.CELL, [this.processRow_(b)], []), a.role = cvox.SemanticAttr.Role.TABLE, a;
    case "MTEXT":
        return a = this.makeLeafNode_(a), a.type = cvox.SemanticAttr.Type.TEXT, a;
    case "MI":
        return a = this.makeLeafNode_(a), a.type == cvox.SemanticAttr.Type.UNKNOWN && (a.type = cvox.SemanticAttr.Type.IDENTIFIER), a;
    case "MN":
        return a = this.makeLeafNode_(a), a.type == cvox.SemanticAttr.Type.UNKNOWN && (a.type = cvox.SemanticAttr.Type.NUMBER), a;
    case "MO":
        return a = this.makeLeafNode_(a), a.type == cvox.SemanticAttr.Type.UNKNOWN && (a.type = cvox.SemanticAttr.Type.OPERATOR), a;
    default:
        return this.makeUnprocessed_(a)
    }
};
cvox.SemanticTree.prototype.parseMathmlChildren_ = function (a) {
    for (var b = [], c = 0, d; d = a[c]; c++) {
        b.push(this.parseMathml_(d))
    }
    return b
};
cvox.SemanticTree.prototype.makeUnprocessed_ = function (a) {
    var b = this.createNode_();
    b.mathml = [a];
    return b
};
cvox.SemanticTree.prototype.makeEmptyNode_ = function () {
    var a = this.createNode_();
    a.type = cvox.SemanticAttr.Type.EMPTY;
    return a
};
cvox.SemanticTree.prototype.makeLeafNode_ = function (a) {
    var b = this.createNode_();
    b.mathml = [a];
    b.updateContent_(a.textContent);
    b.font = a.getAttribute("mathvariant") || b.font;
    return b
};
cvox.SemanticTree.prototype.makeBranchNode_ = function (a, b, c, d) {
    var e = this.createNode_();
    d && e.updateContent_(d);
    e.type = a;
    e.childNodes = b;
    e.contentNodes = c;
    b.concat(c).forEach(function (a) {
        a.parent = e;
        e.addMathmlNodes_(a.mathml)
    });
    return e
};
cvox.SemanticTree.prototype.makeImplicitNode_ = function (a) {
    if (1 == a.length) {
        return a[0]
    }
    var b = this.createNode_();
    b.updateContent_(cvox.SemanticAttr.invisibleTimes());
    a = this.makeInfixNode_(a, b);
    a.role = cvox.SemanticAttr.Role.IMPLICIT;
    return a
};
cvox.SemanticTree.prototype.makeInfixNode_ = function (a, b) {
    return this.makeBranchNode_(cvox.SemanticAttr.Type.INFIXOP, a, [b], b.textContent)
};
cvox.SemanticTree.prototype.makeConcatNode_ = function (a, b, c) {
    if (0 == b.length) {
        return a
    }
    var d = b.map(function (a) {
        return a.textContent
    }).join(" ");
    a = this.makeBranchNode_(c, [a], b, d);
    0 < b.length && (a.role = cvox.SemanticAttr.Role.MULTIOP);
    return a
};
cvox.SemanticTree.prototype.makePrefixNode_ = function (a, b) {
    for (var c = cvox.SemanticTree.partitionNodes_(b, cvox.SemanticTree.attrPred_("role", "SUBTRACTION")), d = this.makeConcatNode_(a, c.comp.pop(), cvox.SemanticAttr.Type.PREFIXOP); 0 < c.rel.length;) {
        d = this.makeConcatNode_(d, [c.rel.pop()], cvox.SemanticAttr.Type.PREFIXOP), d.role = cvox.SemanticAttr.Role.NEGATIVE, d = this.makeConcatNode_(d, c.comp.pop(), cvox.SemanticAttr.Type.PREFIXOP)
    }
    return d
};
cvox.SemanticTree.prototype.makePostfixNode_ = function (a, b) {
    return this.makeConcatNode_(a, b, cvox.SemanticAttr.Type.POSTFIXOP)
};
cvox.SemanticTree.prototype.processRow_ = function (a) {
    if (0 == a.length) {
        return this.makeEmptyNode_()
    }
    a = this.getFencesInRow_(a);
    a = this.processTablesInRow_(a);
    a = this.getPunctuationInRow_(a);
    a = this.getFunctionsInRow_(a);
    return this.processRelationsInRow_(a)
};
cvox.SemanticTree.prototype.processRelationsInRow_ = function (a) {
    var b = cvox.SemanticTree.partitionNodes_(a, cvox.SemanticTree.attrPred_("type", "RELATION")),
        c = b.rel[0];
    if (!c) {
        return this.processOperationsInRow_(a)
    }
    if (1 == a.length) {
        return a[0]
    }
    a = b.comp.map(goog.bind(this.processOperationsInRow_, this));
    return b.rel.every(function (a) {
        return a.textContent == c.textContent
    }) ? this.makeBranchNode_(cvox.SemanticAttr.Type.RELSEQ, a, b.rel, c.textContent) : this.makeBranchNode_(cvox.SemanticAttr.Type.MULTIREL, a, b.rel)
};
cvox.SemanticTree.prototype.processOperationsInRow_ = function (a) {
    if (0 == a.length) {
        return this.makeEmptyNode_()
    }
    if (1 == a.length) {
        return a[0]
    }
    for (var b = []; 0 < a.length && a[0].type == cvox.SemanticAttr.Type.OPERATOR;) {
        b.push(a.shift())
    }
    if (0 == a.length) {
        return this.makePrefixNode_(b.pop(), b)
    }
    if (1 == a.length) {
        return this.makePrefixNode_(a[0], b)
    }
    a = cvox.SemanticTree.sliceNodes_(a, cvox.SemanticTree.attrPred_("type", "OPERATOR"));
    b = this.makePrefixNode_(this.makeImplicitNode_(a.head), b);
    return a.div ? this.makeOperationsTree_(a.tail, b, a.div) : b
};
cvox.SemanticTree.prototype.makeOperationsTree_ = function (a, b, c, d) {
    d = d || [];
    if (0 == a.length) {
        return d.unshift(c), b.type == cvox.SemanticAttr.Type.INFIXOP ? (d = this.makePostfixNode_(b.childNodes.pop(), d), b.appendChild_(d), b) : this.makePostfixNode_(b, d)
    }
    a = cvox.SemanticTree.sliceNodes_(a, cvox.SemanticTree.attrPred_("type", "OPERATOR"));
    if (0 == a.head.length) {
        return d.push(a.div), this.makeOperationsTree_(a.tail, b, c, d)
    }
    d = this.makePrefixNode_(this.makeImplicitNode_(a.head), d);
    b = this.appendOperand_(b, c, d);
    return a.div ? this.makeOperationsTree_(a.tail, b, a.div, []) : b
};
cvox.SemanticTree.prototype.appendOperand_ = function (a, b, c) {
    return a.type != cvox.SemanticAttr.Type.INFIXOP ? this.makeInfixNode_([a, c], b) : this.appendExistingOperator_(a, b, c) ? a : b.role == cvox.SemanticAttr.Role.MULTIPLICATION ? this.appendMultiplicativeOp_(a, b, c) : this.appendAdditiveOp_(a, b, c)
};
cvox.SemanticTree.prototype.appendMultiplicativeOp_ = function (a, b, c) {
    for (var d = a, e = a.childNodes[a.childNodes.length - 1]; e && e.type == cvox.SemanticAttr.Type.INFIXOP;) {
        d = e, e = d.childNodes[a.childNodes.length - 1]
    }
    b = this.makeInfixNode_([d.childNodes.pop(), c], b);
    d.appendChild_(b);
    return a
};
cvox.SemanticTree.prototype.appendAdditiveOp_ = function (a, b, c) {
    return this.makeInfixNode_([a, c], b)
};
cvox.SemanticTree.prototype.appendExistingOperator_ = function (a, b, c) {
    if (!a || a.type != cvox.SemanticAttr.Type.INFIXOP) {
        return !1
    }
    if (a.textContent == b.textContent) {
        return a.appendContentNode_(b), a.appendChild_(c), !0
    }
    this.appendExistingOperator_(a.childNodes[a.childNodes.length - 1], b, c)
};
cvox.SemanticTree.prototype.getFencesInRow_ = function (a) {
    a = cvox.SemanticTree.partitionNodes_(a, cvox.SemanticTree.attrPred_("type", "FENCE"));
    var b = a.comp.shift();
    return this.processFences_(a.rel, a.comp, [], [b])
};
cvox.SemanticTree.prototype.processFences_ = function (a, b, c, d) {
    if (0 == a.length && 0 == c.length) {
        return d[0]
    }
    var e = cvox.SemanticTree.attrPred_("role", "OPEN");
    if (0 == a.length) {
        for (a = d.shift(); 0 < c.length;) {
            if (e(c[0])) {
                b = c.shift(), cvox.SemanticTree.fenceToPunct_(b), a.push(b)
            } else {
                c = cvox.SemanticTree.sliceNodes_(c, e);
                var f = c.head.length - 1,
                    g = this.processNeutralFences_(c.head, d.slice(0, f));
                d = d.slice(f);
                a.push.apply(a, g);
                c.div && c.tail.unshift(c.div);
                c = c.tail
            }
            a.push.apply(a, d.shift())
        }
        return a
    }
    f = c[c.length - 1];
    g = a[0].role;
    if (g == cvox.SemanticAttr.Role.OPEN || g == cvox.SemanticAttr.Role.NEUTRAL && (!f || a[0].textContent != f.textContent)) {
        return c.push(a.shift()), d.push(b.shift()), this.processFences_(a, b, c, d)
    }
    if (f && (g == cvox.SemanticAttr.Role.CLOSE && f.role == cvox.SemanticAttr.Role.OPEN || g == cvox.SemanticAttr.Role.NEUTRAL && a[0].textContent == f.textContent)) {
        return e = this.makeHorizontalFencedNode_(c.pop(), a.shift(), d.pop()), d.push(d.pop().concat([e], b.shift())), this.processFences_(a, b, c, d)
    }
    if (f && g == cvox.SemanticAttr.Role.CLOSE && f.role == cvox.SemanticAttr.Role.NEUTRAL && c.some(e)) {
        return c = cvox.SemanticTree.sliceNodes_(c, e, !0), e = d.pop(), f = d.length - c.tail.length + 1, g = this.processNeutralFences_(c.tail, d.slice(f)), d = d.slice(0, f), e = this.makeHorizontalFencedNode_(c.div, a.shift(), d.pop().concat(g, e)), d.push(d.pop().concat([e], b.shift())), this.processFences_(a, b, c.head, d)
    }
    e = a.shift();
    cvox.SemanticTree.fenceToPunct_(e);
    d.push(d.pop().concat([e], b.shift()));
    return this.processFences_(a, b, c, d)
};
cvox.SemanticTree.prototype.processNeutralFences_ = function (a, b) {
    if (0 == a.length) {
        return a
    }
    if (1 == a.length) {
        return cvox.SemanticTree.fenceToPunct_(a[0]), a
    }
    var c = a.shift(),
        d = cvox.SemanticTree.sliceNodes_(a, function (a) {
            return a.textContent == c.textContent
        });
    if (!d.div) {
        cvox.SemanticTree.fenceToPunct_(c);
        var e = b.shift();
        e.unshift(c);
        return e.concat(this.processNeutralFences_(a, b))
    }
    var f = this.combineFencedContent_(c, d.div, d.head, b);
    return 0 < d.tail.length ? (e = f.shift(), d = this.processNeutralFences_(d.tail, f), e.concat(d)) : f[0]
};
cvox.SemanticTree.prototype.combineFencedContent_ = function (a, b, c, d) {
    if (0 == c.length) {
        return a = this.makeHorizontalFencedNode_(a, b, d.shift()), d.unshift(a), d
    }
    var e = d.shift(),
        f = c.length - 1,
        g = d.slice(0, f);
    d = d.slice(f);
    f = d.shift();
    c = this.processNeutralFences_(c, g);
    e.push.apply(e, c);
    e.push.apply(e, f);
    a = this.makeHorizontalFencedNode_(a, b, e);
    0 < d.length ? d[0].unshift(a) : d = [[a]];
    return d
};
cvox.SemanticTree.fenceToPunct_ = function (a) {
    a.type = cvox.SemanticAttr.Type.PUNCTUATION;
    switch (a.role) {
    case cvox.SemanticAttr.Role.NEUTRAL:
        a.role = cvox.SemanticAttr.Role.VBAR;
        break;
    case cvox.SemanticAttr.Role.OPEN:
        a.role = cvox.SemanticAttr.Role.OPENFENCE;
        break;
    case cvox.SemanticAttr.Role.CLOSE:
        a.role = cvox.SemanticAttr.Role.CLOSEFENCE
    }
};
cvox.SemanticTree.prototype.makeHorizontalFencedNode_ = function (a, b, c) {
    c = this.processRow_(c);
    b = this.makeBranchNode_(cvox.SemanticAttr.Type.FENCED, [c], [a, b]);
    b.role = a.role == cvox.SemanticAttr.Role.OPEN ? cvox.SemanticAttr.Role.LEFTRIGHT : a.role;
    return b
};
cvox.SemanticTree.prototype.getPunctuationInRow_ = function (a) {
    var b = cvox.SemanticTree.partitionNodes_(a, function (a) {
        return cvox.SemanticTree.attrPred_("type", "PUNCTUATION")(a) && !cvox.SemanticTree.attrPred_("role", "ELLIPSIS")(a)
    });
    if (0 == b.rel.length) {
        return a
    }
    a = [];
    var c = b.comp.shift();
    0 < c.length && a.push(this.processRow_(c));
    for (var d = 0; 0 < b.comp.length;) {
        a.push(b.rel[d++]), c = b.comp.shift(), 0 < c.length && a.push(this.processRow_(c))
    }
    return [this.makePunctuatedNode_(a, b.rel)]
};
cvox.SemanticTree.prototype.makePunctuatedNode_ = function (a, b) {
    var c = this.makeBranchNode_(cvox.SemanticAttr.Type.PUNCTUATED, a, b);
    c.role = 1 == b.length && a[0].type == cvox.SemanticAttr.Type.PUNCTUATION ? cvox.SemanticAttr.Role.STARTPUNCT : 1 == b.length && a[a.length - 1].type == cvox.SemanticAttr.Type.PUNCTUATION ? cvox.SemanticAttr.Role.ENDPUNCT : cvox.SemanticAttr.Role.SEQUENCE;
    return c
};
cvox.SemanticTree.prototype.makeLimitNode_ = function (a, b) {
    var c = b[0],
        d = cvox.SemanticTree.attrPred_("type", "FUNCTION")(c),
        d = cvox.SemanticTree.attrPred_("type", "LARGEOP")(c) || cvox.SemanticTree.attrPred_("type", "LIMBOTH")(c) || cvox.SemanticTree.attrPred_("type", "LIMLOWER")(c) || cvox.SemanticTree.attrPred_("type", "LIMUPPER")(c) || d && cvox.SemanticTree.attrPred_("role", "LIMFUNC")(c),
        e = cvox.SemanticAttr.Type.UNKNOWN;
    if (d) {
        switch (a) {
        case "MSUB":
            ;
        case "MUNDER":
            e = cvox.SemanticAttr.Type.LIMLOWER;
            break;
        case "MSUP":
            ;
        case "MOVER":
            e = cvox.SemanticAttr.Type.LIMUPPER;
            break;
        case "MSUBSUP":
            ;
        case "MUNDEROVER":
            e = cvox.SemanticAttr.Type.LIMBOTH
        }
    } else {
        switch (a) {
        case "MSUB":
            e = cvox.SemanticAttr.Type.SUBSCRIPT;
            break;
        case "MSUP":
            e = cvox.SemanticAttr.Type.SUPERSCRIPT;
            break;
        case "MSUBSUP":
            d = this.makeBranchNode_(cvox.SemanticAttr.Type.SUBSCRIPT, [c, b[1]], []);
            d.role = c.role;
            b = [d, b[2]];
            e = cvox.SemanticAttr.Type.SUPERSCRIPT;
            break;
        case "MOVER":
            e = cvox.SemanticAttr.Type.OVERSCORE;
            break;
        case "MUNDER":
            e = cvox.SemanticAttr.Type.UNDERSCORE;
            break;
        default:
            d = this.makeBranchNode_(cvox.SemanticAttr.Type.UNDERSCORE, [c, b[1]], []), d.role = c.role, b = [d, b[2]], e = cvox.SemanticAttr.Type.OVERSCORE
        }
    }
    d = this.makeBranchNode_(e, b, []);
    d.role = c.role;
    return d
};
cvox.SemanticTree.prototype.getFunctionsInRow_ = function (a, b) {
    b = b || [];
    if (0 == a.length) {
        return b
    }
    var c = a.shift(),
        d = cvox.SemanticTree.classifyFunction_(c, a);
    if (!d) {
        return b.push(c), this.getFunctionsInRow_(a, b)
    }
    var e = this.getFunctionsInRow_(a, []),
        c = this.getFunctionArgs_(c, e, d);
    return b.concat(c)
};
cvox.SemanticTree.classifyFunction_ = function (a, b) {
    if (a.type == cvox.SemanticAttr.Type.APPL || a.type == cvox.SemanticAttr.Type.BIGOP || a.type == cvox.SemanticAttr.Type.INTEGRAL) {
        return ""
    }
    if (b[0] && b[0].textContent == cvox.SemanticAttr.functionApplication()) {
        return b.shift(), cvox.SemanticTree.propagatePrefixFunc_(a), "prefix"
    }
    switch (a.role) {
    case cvox.SemanticAttr.Role.INTEGRAL:
        return "integral";
    case cvox.SemanticAttr.Role.SUM:
        return "bigop";
    case cvox.SemanticAttr.Role.PREFIXFUNC:
        ;
    case cvox.SemanticAttr.Role.LIMFUNC:
        return "prefix";
    default:
        if (a.type == cvox.SemanticAttr.Type.IDENTIFIER) {
            return "simple"
        }
    }
    return ""
};
cvox.SemanticTree.propagatePrefixFunc_ = function (a) {
    a && (a.role = cvox.SemanticAttr.Role.PREFIXFUNC, cvox.SemanticTree.propagatePrefixFunc_(a.childNodes[0]))
};
cvox.SemanticTree.prototype.getFunctionArgs_ = function (a, b, c) {
    switch (c) {
    case "integral":
        return b = this.getIntegralArgs_(b), c = this.processRow_(b.integrand), a = this.makeIntegralNode_(a, c, b.intvar), b.rest.unshift(a), b.rest;
    case "prefix":
        if (b[0] && b[0].type == cvox.SemanticAttr.Type.FENCED) {
            return a = this.makeFunctionNode_(a, b.shift()), b.unshift(a), b
        };
    case "bigop":
        b = cvox.SemanticTree.sliceNodes_(b, cvox.SemanticTree.prefixFunctionBoundary_);
        var d = this.processRow_(b.head);
        a = "prefix" == c ? this.makeFunctionNode_(a, d) : this.makeBigOpNode_(a, d);
        b.div && b.tail.unshift(b.div);
        b.tail.unshift(a);
        return b.tail;
    case "simple":
        if (0 == b.length) {
            return [a]
        }
        c = b[0];
        if (c.type == cvox.SemanticAttr.Type.FENCED && c.role != cvox.SemanticAttr.Role.NEUTRAL && this.simpleFunctionHeuristic_(c)) {
            return a = this.makeFunctionNode_(a, b.shift()), b.unshift(a), b
        }
        b.unshift(a);
        return b
    }
};
cvox.SemanticTree.prototype.getIntegralArgs_ = function (a, b) {
    b = b || [];
    if (0 == a.length) {
        return {
            integrand: b,
            intvar: null,
            rest: a
        }
    }
    var c = a[0];
    if (cvox.SemanticTree.generalFunctionBoundary_(c)) {
        return {
            integrand: b,
            intvar: null,
            rest: a
        }
    }
    if (cvox.SemanticTree.integralDxBoundarySingle_(c)) {
        return {
            integrand: b,
            intvar: c,
            rest: a.slice(1)
        }
    }
    if (a[1] && cvox.SemanticTree.integralDxBoundary_(c, a[1])) {
        var d = this.createNode_();
        d.updateContent_(cvox.SemanticAttr.invisibleComma());
        c = this.makePunctuatedNode_([c, d, a[1]], [d]);
        c.role = cvox.SemanticAttr.Role.INTEGRAL;
        return {
            integrand: b,
            intvar: c,
            rest: a.slice(2)
        }
    }
    b.push(a.shift());
    return this.getIntegralArgs_(a, b)
};
cvox.SemanticTree.prototype.makeFunctionNode_ = function (a, b) {
    var c = this.createNode_();
    c.updateContent_(cvox.SemanticAttr.functionApplication());
    c.type = cvox.SemanticAttr.Type.PUNCTUATION;
    c.role = cvox.SemanticAttr.Role.APPLICATION;
    c = this.makeBranchNode_(cvox.SemanticAttr.Type.APPL, [a, b], [c]);
    c.role = a.role;
    return c
};
cvox.SemanticTree.prototype.makeBigOpNode_ = function (a, b) {
    var c = this.makeBranchNode_(cvox.SemanticAttr.Type.BIGOP, [a, b], []);
    c.role = a.role;
    return c
};
cvox.SemanticTree.prototype.makeIntegralNode_ = function (a, b, c) {
    b = b || this.makeEmptyNode_();
    c = c || this.makeEmptyNode_();
    b = this.makeBranchNode_(cvox.SemanticAttr.Type.INTEGRAL, [a, b, c], []);
    b.role = a.role;
    return b
};
cvox.SemanticTree.prototype.simpleFunctionHeuristic_ = function (a) {
    a = a.childNodes;
    if (0 == a.length) {
        return !0
    }
    if (1 < a.length) {
        return !1
    }
    a = a[0];
    return a.type != cvox.SemanticAttr.Type.INFIXOP || a.role == cvox.SemanticAttr.Role.IMPLICIT && !a.childNodes.some(cvox.SemanticTree.attrPred_("type", "INFIXOP")) ? !0 : !1
};
cvox.SemanticTree.prefixFunctionBoundary_ = function (a) {
    return cvox.SemanticTree.attrPred_("type", "OPERATOR")(a) || cvox.SemanticTree.generalFunctionBoundary_(a)
};
cvox.SemanticTree.integralDxBoundary_ = function (a, b) {
    return !!b && cvox.SemanticTree.attrPred_("type", "IDENTIFIER")(b) && cvox.SemanticAttr.isCharacterD(a.textContent)
};
cvox.SemanticTree.integralDxBoundarySingle_ = function (a) {
    if (cvox.SemanticTree.attrPred_("type", "IDENTIFIER")(a)) {
        var b = a.textContent[0];
        return b && a.textContent[1] && cvox.SemanticAttr.isCharacterD(b)
    }
    return !1
};
cvox.SemanticTree.generalFunctionBoundary_ = function (a) {
    return cvox.SemanticTree.attrPred_("type", "RELATION")(a) || cvox.SemanticTree.attrPred_("type", "PUNCTUATION")(a)
};
cvox.SemanticTree.prototype.processTablesInRow_ = function (a) {
    a = cvox.SemanticTree.partitionNodes_(a, cvox.SemanticTree.tableIsMatrixOrVector_);
    for (var b = [], c = 0, d; d = a.rel[c]; c++) {
        b = b.concat(a.comp.shift()), b.push(this.tableToMatrixOrVector_(d))
    }
    b = b.concat(a.comp.shift());
    a = cvox.SemanticTree.partitionNodes_(b, cvox.SemanticTree.isTableOrMultiline_);
    b = [];
    for (c = 0; d = a.rel[c]; c++) {
        var e = a.comp.shift();
        cvox.SemanticTree.tableIsCases_(d, e) && this.tableToCases_(d, e.pop());
        b = b.concat(e);
        b.push(d)
    }
    return b.concat(a.comp.shift())
};
cvox.SemanticTree.isTableOrMultiline_ = function (a) {
    return !!a && (cvox.SemanticTree.attrPred_("type", "TABLE")(a) || cvox.SemanticTree.attrPred_("type", "MULTILINE")(a))
};
cvox.SemanticTree.tableIsMatrixOrVector_ = function (a) {
    return !!a && cvox.SemanticTree.attrPred_("type", "FENCED")(a) && cvox.SemanticTree.attrPred_("role", "LEFTRIGHT")(a) && 1 == a.childNodes.length && cvox.SemanticTree.isTableOrMultiline_(a.childNodes[0])
};
cvox.SemanticTree.prototype.tableToMatrixOrVector_ = function (a) {
    var b = a.childNodes[0],
        c = cvox.SemanticTree.attrPred_("type", "MULTILINE")(b) ? "VECTOR" : "MATRIX";
    b.type = cvox.SemanticAttr.Type[c];
    a.contentNodes.forEach(goog.bind(b.appendContentNode_, b));
    a = 0;
    for (var d; d = b.childNodes[a]; a++) {
        cvox.SemanticTree.assignRoleToRow_(d, cvox.SemanticAttr.Role[c])
    }
    return b
};
cvox.SemanticTree.tableIsCases_ = function (a, b) {
    return 0 < b.length && cvox.SemanticTree.attrPred_("role", "OPENFENCE")(b[b.length - 1])
};
cvox.SemanticTree.prototype.tableToCases_ = function (a, b) {
    for (var c = 0, d; d = a.childNodes[c]; c++) {
        cvox.SemanticTree.assignRoleToRow_(d, cvox.SemanticAttr.Role.CASES)
    }
    a.type = cvox.SemanticAttr.Type.CASES;
    a.appendContentNode_(b);
    return a
};
cvox.SemanticTree.tableIsMultiline_ = function (a) {
    return a.childNodes.every(function (a) {
        return 1 >= a.childNodes.length
    })
};
cvox.SemanticTree.prototype.tableToMultiline_ = function (a) {
    a.type = cvox.SemanticAttr.Type.MULTILINE;
    for (var b = 0, c; c = a.childNodes[b]; b++) {
        cvox.SemanticTree.rowToLine_(c, cvox.SemanticAttr.Role.MULTILINE)
    }
};
cvox.SemanticTree.rowToLine_ = function (a, b) {
    b = b || cvox.SemanticAttr.Role.UNKNOWN;
    cvox.SemanticTree.attrPred_("type", "ROW")(a) && 1 == a.childNodes.length && cvox.SemanticTree.attrPred_("type", "CELL")(a.childNodes[0]) && (a.type = cvox.SemanticAttr.Type.LINE, a.role = b, a.childNodes = a.childNodes[0].childNodes)
};
cvox.SemanticTree.assignRoleToRow_ = function (a, b) {
    if (cvox.SemanticTree.attrPred_("type", "LINE")(a)) {
        a.role = b
    } else {
        if (cvox.SemanticTree.attrPred_("type", "ROW")(a)) {
            a.role = b;
            var c = cvox.SemanticTree.attrPred_("type", "CELL");
            a.childNodes.forEach(function (a) {
                c(a) && (a.role = b)
            })
        }
    }
};
cvox.SemanticTree.sliceNodes_ = function (a, b, c) {
    c && a.reverse();
    for (var d = [], e = 0, f; f = a[e]; e++) {
        if (b(f)) {
            return c ? {
                head: a.slice(e + 1).reverse(),
                div: f,
                tail: d.reverse()
            } : {
                head: d,
                div: f,
                tail: a.slice(e + 1)
            }
        }
        d.push(f)
    }
    return c ? {
        head: [],
        div: null,
        tail: d.reverse()
    } : {
        head: d,
        div: null,
        tail: []
    }
};
cvox.SemanticTree.partitionNodes_ = function (a, b) {
    var c = a,
        d = [],
        e = [];
    do {
        var f = cvox.SemanticTree.sliceNodes_(c, b);
        e.push(f.head);
        d.push(f.div);
        c = f.tail
    } while (f.div);
    d.pop();
    return {
        rel: d,
        comp: e
    }
};
cvox.SemanticTree.attrPred_ = function (a, b) {
    return function (c) {
        c = c[a];
        var d;
        a: {
            switch (a) {
            case "type":
                d = cvox.SemanticAttr.Type[b];
                break a;
            case "role":
                d = cvox.SemanticAttr.Role[b];
                break a;
            case "font":
                d = cvox.SemanticAttr.Font[b];
                break a
            }
            d = void 0
        }
        return c == d
    }
};
