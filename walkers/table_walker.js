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

cvox.TableWalker = function () {
    cvox.AbstractWalker.call(this);
    this.tt = new cvox.TraverseTable(null)
};
goog.inherits(cvox.TableWalker, cvox.AbstractWalker);
cvox.TableWalker.prototype.next = function (a) {
    return this.nextRow(a)
};
cvox.TableWalker.prototype.sync = function (a) {
    return this.goTo_(a, goog.bind(function (a) {
        return this.tt.goToCell(a)
    }, this))
};
cvox.TableWalker.prototype.getDescription = function (a, b) {
    var c = this.syncPosition_(b);
    if (!c) {
        return []
    }
    this.tt.goToCell(c);
    c = cvox.DescriptionUtil.getCollectionDescription(a, b);
    0 == c.length && c.push(new cvox.NavDescription({
        annotation: cvox.ChromeVox.msgs.getMsg("empty_cell")
    }));
    return c
};
cvox.TableWalker.prototype.getBraille = function (a, b) {
    new cvox.NavBraille({});
    var c = this.syncPosition_(b);
    if (c) {
        var d = cvox.BrailleUtil.getTemplated(a.start.node, b.start.node);
        d.append(" " + ++c[0] + "/" + ++c[1])
    }
    return new cvox.NavBraille({
        text: d
    })
};
cvox.TableWalker.prototype.goToFirstCell = function (a) {
    return this.goTo_(a, goog.bind(function (a) {
        return this.tt.goToCell([0, 0])
    }, this))
};
cvox.TableWalker.prototype.goToLastCell = function (a) {
    return this.goTo_(a, goog.bind(function (a) {
        return this.tt.goToLastCell()
    }, this))
};
cvox.TableWalker.prototype.goToRowFirstCell = function (a) {
    return this.goTo_(a, goog.bind(function (a) {
        return this.tt.goToCell([a[0], 0])
    }, this))
};
cvox.TableWalker.prototype.goToRowLastCell = function (a) {
    return this.goTo_(a, goog.bind(function (a) {
        return this.tt.goToRowLastCell()
    }, this))
};
cvox.TableWalker.prototype.goToColFirstCell = function (a) {
    return this.goTo_(a, goog.bind(function (a) {
        return this.tt.goToCell([0, a[1]])
    }, this))
};
cvox.TableWalker.prototype.goToColLastCell = function (a) {
    return this.goTo_(a, goog.bind(function (a) {
        return this.tt.goToColLastCell()
    }, this))
};
cvox.TableWalker.prototype.nextRow = function (a) {
    return this.goTo_(a, goog.bind(function (b) {
        return this.tt.goToCell([b[0] + (a.isReversed() ? -1 : 1), b[1]])
    }, this))
};
cvox.TableWalker.prototype.nextCol = function (a) {
    return this.goTo_(a, goog.bind(function (b) {
        return this.tt.goToCell([b[0], b[1] + (a.isReversed() ? -1 : 1)])
    }, this))
};
cvox.TableWalker.prototype.announceHeaders = function (a) {
    cvox.ChromeVox.tts.speak(this.getHeaderText_(a), cvox.AbstractTts.QUEUE_MODE_FLUSH, cvox.AbstractTts.PERSONALITY_ANNOTATION);
    return a
};
cvox.TableWalker.prototype.speakTableLocation = function (a) {
    cvox.ChromeVox.navigationManager.speakDescriptionArray(this.getLocationDescription_(a), cvox.AbstractTts.QUEUE_MODE_FLUSH, null);
    return a
};
cvox.TableWalker.prototype.exitShifterContent = function (a) {
    a = this.getTableNode_(a);
    if (!a) {
        return null
    }
    a = cvox.DomUtil.directedNextLeafNode(a, !1);
    return cvox.CursorSelection.fromNode(a)
};
cvox.TableWalker.prototype.getHeaderText_ = function (a) {
    this.tt.initialize(this.getTableNode_(a));
    return (a = this.tt.findNearestCursor(a.start.node)) && this.tt.goToCell(a) ? this.getRowHeaderText_(a) + " " + this.getColHeaderText_(a) : cvox.ChromeVox.msgs.getMsg("not_inside_table")
};
cvox.TableWalker.prototype.getLocationDescription_ = function (a) {
    a = this.getLocationInfo(a);
    return null == a ? null : [new cvox.NavDescription({
        text: cvox.ChromeVox.msgs.getMsg("table_location", a)
    })]
};
cvox.TableWalker.prototype.getRowHeaderText_ = function (a) {
    var b = "",
        c = this.tt.getCellRowHeaders();
    if (0 == c.length) {
        return c = this.tt.getCellAt([a[0], 0]), b += cvox.DomUtil.collapseWhitespace(cvox.DomUtil.getValue(c) + " " + cvox.DomUtil.getName(c)), cvox.ChromeVox.msgs.getMsg("row_header") + b
    }
    for (a = 0; a < c.length; ++a) {
        b += cvox.DomUtil.collapseWhitespace(cvox.DomUtil.getValue(c[a]) + " " + cvox.DomUtil.getName(c[a]))
    }
    return "" == b ? cvox.ChromeVox.msgs.getMsg("empty_row_header") : cvox.ChromeVox.msgs.getMsg("row_header") + b
};
cvox.TableWalker.prototype.getColHeaderText_ = function (a) {
    var b = "",
        c = this.tt.getCellColHeaders();
    if (0 == c.length) {
        return c = this.tt.getCellAt([0, a[1]]), b += cvox.DomUtil.collapseWhitespace(cvox.DomUtil.getValue(c) + " " + cvox.DomUtil.getName(c)), cvox.ChromeVox.msgs.getMsg("column_header") + b
    }
    for (a = 0; a < c.length; ++a) {
        b += cvox.DomUtil.collapseWhitespace(cvox.DomUtil.getValue(c[a]) + " " + cvox.DomUtil.getName(c[a]))
    }
    return "" == b ? cvox.ChromeVox.msgs.getMsg("empty_row_header") : cvox.ChromeVox.msgs.getMsg("column_header") + b
};
cvox.TableWalker.prototype.getLocationInfo = function (a) {
    this.tt.initialize(this.getTableNode_(a));
    return (a = this.tt.findNearestCursor(a.start.node)) ? [a[0] + 1, this.tt.rowCount, a[1] + 1, this.tt.colCount].map(function (a) {
        return cvox.ChromeVox.msgs.getNumber(a)
    }) : null
};
cvox.TableWalker.prototype.isInTable = function (a) {
    return null != this.getTableNode_(a)
};
cvox.TableWalker.prototype.goTo_ = function (a, b) {
    this.tt.initialize(this.getTableNode_(a));
    var c = this.tt.findNearestCursor(a.end.node);
    if (!c) {
        return null
    }
    this.tt.goToCell(c);
    return b(c) ? cvox.CursorSelection.fromNode(this.tt.getCell()).setReversed(a.isReversed()) : null
};
cvox.TableWalker.prototype.getTableNode_ = function (a) {
    return cvox.DomUtil.getContainingTable(a.end.node)
};
cvox.TableWalker.prototype.syncPosition_ = function (a) {
    var b = this.getTableNode_(a);
    this.tt.initialize(b);
    return this.tt.findNearestCursor(a.end.node)
};
