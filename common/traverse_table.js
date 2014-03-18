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

function ShadowTableNode() {}
ShadowTableNode.prototype.rowHeaderCells = [];
ShadowTableNode.prototype.colHeaderCells = [];
cvox.TraverseTable = function (a) {
    this.activeTable_ = null;
    this.shadowTable_ = [];
    this.candidateHeaders_ = [];
    this.idToShadowNode_ = [];
    this.initialize(a)
};
cvox.TraverseTable.prototype.colCount = null;
cvox.TraverseTable.prototype.rowCount = null;
cvox.TraverseTable.prototype.tableRowHeaders = null;
cvox.TraverseTable.prototype.tableColHeaders = null;
cvox.TraverseTable.prototype.initialize = function (a) {
    a && a != this.activeTable_ && (this.activeTable_ = a, this.currentCellCursor = null, this.tableRowHeaders = [], this.tableColHeaders = [], this.buildShadowTable_(), this.colCount = this.shadowColCount_(), this.rowCount = this.countRows_(), this.findHeaderCells_(), this.activeTable_.addEventListener("DOMSubtreeModified", goog.bind(function () {
        this.buildShadowTable_();
        this.colCount = this.shadowColCount_();
        this.rowCount = this.countRows_();
        this.tableRowHeaders = [];
        this.tableColHeaders = [];
        this.findHeaderCells_();
        0 == this.colCount && 0 == this.rowCount || null != this.getCell() || this.attachCursorToNearestCell_()
    }, this), !1))
};
cvox.TraverseTable.prototype.findNearestCursor = function (a) {
    for (; a.firstElementChild && "TABLE" != a.firstElementChild.tagName && !cvox.AriaUtil.isGrid(a.firstElementChild);) {
        a = a.firstElementChild
    }
    for (; !cvox.DomPredicates.cellPredicate(cvox.DomUtil.getAncestors(a));) {
        if (a = cvox.DomUtil.directedNextLeafNode(a), !cvox.DomUtil.getContainingTable(a, {
            allowCaptions: !0
        })) {
            return null
        }
    }
    for (var b = 0; b < this.rowCount; ++b) {
        for (var c = 0; c < this.colCount; ++c) {
            if (this.shadowTable_[b][c] && cvox.DomUtil.isDescendantOfNode(a, this.shadowTable_[b][c].activeCell)) {
                return [b, c]
            }
        }
    }
    return null
};
cvox.TraverseTable.prototype.attachCursorToNearestCell_ = function () {
    if (this.currentCellCursor) {
        var a = this.currentCellCursor,
            b = this.shadowTable_[a[0]];
        b ? this.currentCellCursor = [a[0], b.length - 1] : (b = this.shadowTable_.length, 0 == b ? this.currentCellCursor = null : this.shadowTable_[b - 1][a[1]] ? this.currentCellCursor = [b - 1, a[1]] : this.goToLastCell())
    } else {
        this.goToLastCell()
    }
};
cvox.TraverseTable.prototype.buildShadowTable_ = function () {
    this.shadowTable_ = [];
    for (var a = cvox.TableUtil.getChildRows(this.activeTable_), b = null, c = null, d = cvox.TableUtil.getColGroups(this.activeTable_), d = cvox.TableUtil.determineColGroups(d), e = 0; e < a.length; e++) {
        this.shadowTable_.push([])
    }
    for (e = 0; e < a.length; e++) {
        for (var f = cvox.TableUtil.getChildCells(a[e]), g = 0, h = 0; g < f.length;) {
            if (null == this.shadowTable_[e][h]) {
                var k = f[g],
                    l = 1,
                    m = 1;
                k.hasAttribute("colspan") && (l = parseInt(k.getAttribute("colspan"), 10), isNaN(l) || 0 >= l) && (l = 1);
                k.hasAttribute("rowspan") && (m = parseInt(k.getAttribute("rowspan"), 10), isNaN(m) || 0 >= m) && (m = 1);
                for (var p = 0; p < m; p++) {
                    for (var q = 0; q < l; q++) {
                        var n = new ShadowTableNode;
                        0 == p && 0 == q ? (n.spanned = !1, n.rowSpan = !1, n.colSpan = !1) : (n.spanned = !0, n.rowSpan = 1 < m, n.colSpan = 1 < l);
                        n.i = e;
                        n.j = h;
                        n.activeCell = k;
                        n.rowHeaderCells = [];
                        n.colHeaderCells = [];
                        n.isRowHeader = !1;
                        n.isColHeader = !1;
                        cvox.TableUtil.checkIfHeader(n.activeCell) ? this.candidateHeaders_.push(n) : n.activeCell.hasAttribute("headers") && this.candidateHeaders_.push(n);
                        null == b ? (b = a[e].parentNode, c = 0) : a[e].parentNode != b && (b = a[e].parentNode, c += 1);
                        n.rowGroup = c;
                        n.colGroup = 0 < d.length ? d[h] : 0;
                        n.spanned || null != k.id && (this.idToShadowNode_[k.id] = n);
                        this.shadowTable_[e + p][h + q] = n
                    }
                }
                h += l;
                g++
            } else {
                h += 1
            }
        }
    }
    return this.shadowTable_
};
cvox.TraverseTable.prototype.findHeaderCells_ = function () {
    for (var a = 0; a < this.candidateHeaders_.length; a++) {
        var b = this.candidateHeaders_[a],
            c = b.activeCell,
            d = null,
            e = null;
        if (!b.spanned) {
            "TH" != c.tagName || c.hasAttribute("scope") ? c.hasAttribute("scope") ? e = c.getAttribute("scope") : c.hasAttribute("role") && "rowheader" == c.getAttribute("role") ? e = "row" : c.hasAttribute("role") && "columnheader" == c.getAttribute("role") && (e = "col") : (0 < b.j ? "TH" == this.shadowTable_[b.i][b.j - 1].activeCell.tagName && (d = "col") : b.j < this.shadowTable_[b.i].length - 1 ? "TH" == this.shadowTable_[b.i][b.j + 1].activeCell.tagName && (d = "col") : d = "col", null == d && (0 <
                b.i ? "TH" == this.shadowTable_[b.i - 1][b.j].activeCell.tagName && (d = "row") : b.i < this.shadowTable_.length - 1 ? "TH" == this.shadowTable_[b.i + 1][b.j].activeCell.tagName && (d = "row") : d = "row"));
            if ("row" == e || "row" == d) {
                b.isRowHeader = !0;
                for (d = b.j; d < this.shadowTable_[b.i].length; d++) {
                    var e = this.shadowTable_[b.i][d],
                        f = e.activeCell;
                    "TH" == f.tagName || f.hasAttribute("scope");
                    e.rowHeaderCells.push(c)
                }
                this.tableRowHeaders.push(c)
            } else {
                if ("col" == e || "col" == d) {
                    b.isColHeader = !0;
                    for (e = b.i; e < this.shadowTable_.length; e++) {
                        d = this.shadowTable_[e][b.j];
                        if (null == d) {
                            break
                        }
                        f = d.activeCell;
                        "TH" == f.tagName || f.hasAttribute("scope");
                        d.colHeaderCells.push(c)
                    }
                    this.tableColHeaders.push(c)
                } else {
                    if ("rowgroup" == e) {
                        b.isRowHeader = !0;
                        f = b.rowGroup;
                        for (d = b.j + 1; d < this.shadowTable_[b.i].length; d++) {
                            this.shadowTable_[b.i][d].rowHeaderCells.push(c)
                        }
                        for (e = b.i + 1; e < this.shadowTable_.length && this.shadowTable_[e][0].rowGroup == f; e++) {
                            for (d = 0; d < this.shadowTable_[e].length; d++) {
                                this.shadowTable_[e][d].rowHeaderCells.push(c)
                            }
                        }
                        this.tableRowHeaders.push(c)
                    } else {
                        if ("colgroup" == e) {
                            b.isColHeader = !0;
                            f = b.colGroup;
                            for (d = b.j + 1; d < this.shadowTable_[b.i].length; d++) {
                                this.shadowTable_[b.i][d].colGroup == f && this.shadowTable_[b.i][d].colHeaderCells.push(c)
                            }
                            for (e = b.i + 1; e < this.shadowTable_.length; e++) {
                                for (d = 0; d < this.shadowTable_[e].length; d++) {
                                    this.shadowTable_[e][d].colGroup == f && this.shadowTable_[e][d].colHeaderCells.push(c)
                                }
                            }
                            this.tableColHeaders.push(c)
                        }
                    }
                }
            }
            c.hasAttribute("headers") && this.findAttrbHeaders_(b);
            c.hasAttribute("aria-describedby") && this.findAttrbDescribedBy_(b)
        }
    }
};
cvox.TraverseTable.prototype.findAttrbHeaders_ = function (a) {
    for (var b = a.activeCell, c = b.getAttribute("headers").split(" "), d = 0; d < c.length; d++) {
        for (var e = cvox.TableUtil.getCellWithID(this.activeTable_, c[d]), f = 0; f < e.length && e[f].id != b.id; f++) {
            var g = this.idToShadowNode_[e[f].id];
            if (!cvox.TableUtil.checkIfHeader(g.activeCell)) {
                var h = Math.abs(g.i - a.i),
                    k = Math.abs(g.j - a.j);
                0 == h || h < k ? (cvox.TableUtil.pushIfNotContained(a.rowHeaderCells, g.activeCell), cvox.TableUtil.pushIfNotContained(this.tableRowHeaders, g.activeCell)) : (cvox.TableUtil.pushIfNotContained(a.colHeaderCells, g.activeCell), cvox.TableUtil.pushIfNotContained(this.tableColHeaders, g.activeCell))
            }
        }
    }
};
cvox.TraverseTable.prototype.findAttrbDescribedBy_ = function (a) {
    for (var b = a.activeCell, c = b.getAttribute("aria-describedby").split(" "), d = 0; d < c.length; d++) {
        for (var e = cvox.TableUtil.getCellWithID(this.activeTable_, c[d]), f = 0; f < e.length && e[f].id != b.id; f++) {
            var g = this.idToShadowNode_[e[f].id];
            cvox.TableUtil.checkIfHeader(g.activeCell) || (g.activeCell.hasAttribute("role") && "rowheader" == g.activeCell.getAttribute("role") ? (cvox.TableUtil.pushIfNotContained(a.rowHeaderCells, g.activeCell), cvox.TableUtil.pushIfNotContained(this.tableRowHeaders, g.activeCell)) : g.activeCell.hasAttribute("role") && "columnheader" == g.activeCell.getAttribute("role") && (cvox.TableUtil.pushIfNotContained(a.colHeaderCells, g.activeCell), cvox.TableUtil.pushIfNotContained(this.tableColHeaders, g.activeCell)))
        }
    }
};
cvox.TraverseTable.prototype.getCell = function () {
    if (!this.currentCellCursor || !this.shadowTable_) {
        return null
    }
    var a = this.shadowTable_[this.currentCellCursor[0]][this.currentCellCursor[1]];
    return a && a.activeCell
};
cvox.TraverseTable.prototype.getCellAt = function (a) {
    return a[0] < this.rowCount && 0 <= a[0] && a[1] < this.colCount && 0 <= a[1] && (a = this.shadowTable_[a[0]][a[1]], null != a) ? a.activeCell : null
};
cvox.TraverseTable.prototype.getCellRowHeaders = function () {
    return this.shadowTable_[this.currentCellCursor[0]][this.currentCellCursor[1]].rowHeaderCells
};
cvox.TraverseTable.prototype.getCellColHeaders = function () {
    return this.shadowTable_[this.currentCellCursor[0]][this.currentCellCursor[1]].colHeaderCells
};
cvox.TraverseTable.prototype.isSpanned = function () {
    return this.shadowTable_[this.currentCellCursor[0]][this.currentCellCursor[1]].spanned
};
cvox.TraverseTable.prototype.isRowHeader = function () {
    return this.shadowTable_[this.currentCellCursor[0]][this.currentCellCursor[1]].isRowHeader
};
cvox.TraverseTable.prototype.isColHeader = function () {
    return this.shadowTable_[this.currentCellCursor[0]][this.currentCellCursor[1]].isColHeader
};
cvox.TraverseTable.prototype.getCol = function () {
    for (var a = [], b = 0; b < this.shadowTable_.length; b++) {
        if (this.shadowTable_[b][this.currentCellCursor[1]]) {
            var c = this.shadowTable_[b][this.currentCellCursor[1]];
            c.colSpan && c.rowSpan ? a[a.length - 1] != c.activeCell && a.push(c.activeCell) : !c.colSpan && c.rowSpan || a.push(c.activeCell)
        }
    }
    return a
};
cvox.TraverseTable.prototype.getRow = function () {
    return cvox.TableUtil.getChildRows(this.activeTable_)[this.currentCellCursor[0]]
};
cvox.TraverseTable.prototype.summaryText = function () {
    return this.activeTable_.hasAttribute("summary") ? this.activeTable_.getAttribute("summary") : null
};
cvox.TraverseTable.prototype.captionText = function () {
    var a = cvox.XpathUtil.evalXPath("caption[1]", this.activeTable_);
    return 0 < a.length ? a[0].innerHTML : null
};
cvox.TraverseTable.prototype.shadowColCount_ = function () {
    for (var a = 0, b = 0; b < this.shadowTable_.length; b++) {
        this.shadowTable_[b].length > a && (a = this.shadowTable_[b].length)
    }
    return a
};
cvox.TraverseTable.prototype.countRows_ = function () {
    return cvox.TableUtil.getChildRows(this.activeTable_).length
};
cvox.TraverseTable.prototype.getW3CColCount_ = function () {
    var a = cvox.XpathUtil.evalXPath("child::colgroup", this.activeTable_),
        b = cvox.XpathUtil.evalXPath("child::col", this.activeTable_);
    if (0 == a.length && 0 == b.length) {
        for (var a = 0, b = cvox.TableUtil.getChildRows(this.activeTable_), c = 0; c < b.length; c++) {
            var d = cvox.TableUtil.getChildCells(b[c]);
            d.length > a && (a = d.length)
        }
        return a
    }
    for (c = d = 0; c < b.length; c++) {
        d = b[c].hasAttribute("span") ? d + b[c].getAttribute("span") : d + 1
    }
    for (c = 0; c < a.length; c++) {
        0 == cvox.XpathUtil.evalXPath("child::col", a[c]).length && (d = a[c].hasAttribute("span") ? d + a[c].getAttribute("span") : d + 1)
    }
    return d
};
cvox.TraverseTable.prototype.nextRow = function () {
    return this.currentCellCursor ? this.goToRow(this.currentCellCursor[0] + 1) : this.goToRow(0)
};
cvox.TraverseTable.prototype.prevRow = function () {
    return this.currentCellCursor ? this.goToRow(this.currentCellCursor[0] - 1) : this.goToRow(this.rowCount - 1)
};
cvox.TraverseTable.prototype.nextCol = function () {
    return this.currentCellCursor ? this.goToCol(this.currentCellCursor[1] + 1) : this.goToCol(0)
};
cvox.TraverseTable.prototype.prevCol = function () {
    return this.currentCellCursor ? this.goToCol(this.currentCellCursor[1] - 1) : this.goToCol(this.shadowColCount_() - 1)
};
cvox.TraverseTable.prototype.goToRow = function (a) {
    return null != this.shadowTable_[a] ? (this.currentCellCursor = null == this.currentCellCursor ? [a, 0] : [a, this.currentCellCursor[1]], !0) : !1
};
cvox.TraverseTable.prototype.goToCol = function (a) {
    if (0 > a || a >= this.colCount) {
        return !1
    }
    this.currentCellCursor = null == this.currentCellCursor ? [0, a] : [this.currentCellCursor[0], a];
    return !0
};
cvox.TraverseTable.prototype.goToCell = function (a) {
    return a[0] < this.rowCount && 0 <= a[0] && a[1] < this.colCount && 0 <= a[1] && null != this.shadowTable_[a[0]][a[1]] ? (this.currentCellCursor = a, !0) : !1
};
cvox.TraverseTable.prototype.goToLastCell = function () {
    var a = this.shadowTable_.length;
    if (0 == a) {
        return !1
    }
    a = [a - 1, this.shadowTable_[a - 1].length - 1];
    return null != this.shadowTable_[a[0]][a[1]] ? (this.currentCellCursor = a, !0) : !1
};
cvox.TraverseTable.prototype.goToRowLastCell = function () {
    var a = this.currentCellCursor[0],
        a = [a, this.shadowTable_[a].length - 1];
    return null != this.shadowTable_[a[0]][a[1]] ? (this.currentCellCursor = a, !0) : !1
};
cvox.TraverseTable.prototype.goToColLastCell = function () {
    var a = [this.getCol().length - 1, this.currentCellCursor[1]];
    return null != this.shadowTable_[a[0]][a[1]] ? (this.currentCellCursor = a, !0) : !1
};
cvox.TraverseTable.prototype.resetCursor = function () {
    this.currentCellCursor = null
};
