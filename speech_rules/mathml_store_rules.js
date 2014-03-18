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

cvox.MathmlStoreRules = function () {
    cvox.MathmlStoreRules.initCustomFunctions_();
    cvox.MathmlStoreRules.initDefaultRules_();
    cvox.MathmlStoreRules.initMathjaxRules_();
    cvox.MathmlStoreRules.initAliases_();
    cvox.MathmlStoreRules.initSpecializationRules_();
    cvox.MathmlStoreRules.initSemanticRules_()
};
goog.addSingletonGetter(cvox.MathmlStoreRules);
cvox.MathmlStoreRules.mathStore = cvox.MathmlStore.getInstance();
cvox.MathmlStoreRules.mathStore.initialize = cvox.MathmlStoreRules.getInstance;
cvox.MathmlStoreRules.defineDefaultMathmlRule_ = goog.bind(cvox.MathmlStoreRules.mathStore.defineDefaultMathmlRule, cvox.MathmlStoreRules.mathStore);
cvox.MathmlStoreRules.defineRule_ = goog.bind(cvox.MathmlStoreRules.mathStore.defineRule, cvox.MathmlStoreRules.mathStore);
cvox.MathmlStoreRules.defineRuleAlias_ = goog.bind(cvox.MathmlStoreRules.mathStore.defineRuleAlias, cvox.MathmlStoreRules.mathStore);
cvox.MathmlStoreRules.addContextFunction_ = goog.bind(cvox.MathmlStoreRules.mathStore.contextFunctions.add, cvox.MathmlStoreRules.mathStore.contextFunctions);
cvox.MathmlStoreRules.addCustomQuery_ = goog.bind(cvox.MathmlStoreRules.mathStore.customQueries.add, cvox.MathmlStoreRules.mathStore.customQueries);
cvox.MathmlStoreRules.initCustomFunctions_ = function () {
    (0, cvox.MathmlStoreRules.addContextFunction_)("CTXFnodeCounter", cvox.StoreUtil.nodeCounter);
    (0, cvox.MathmlStoreRules.addContextFunction_)("CTXFmfSeparators", cvox.MathmlStoreUtil.mfencedSeparators);
    (0, cvox.MathmlStoreRules.addContextFunction_)("CTXFcontentIterator", cvox.MathmlStoreUtil.contentIterator);
    (0, cvox.MathmlStoreRules.addCustomQuery_)("CQFextender", cvox.MathmlStoreUtil.retrieveMathjaxExtender);
    (0, cvox.MathmlStoreRules.addCustomQuery_)("CQFmathmlmunder", cvox.MathmlStoreUtil.checkMathjaxMunder);
    (0, cvox.MathmlStoreRules.addCustomQuery_)("CQFmathmlmover", cvox.MathmlStoreUtil.checkMathjaxMover);
    (0, cvox.MathmlStoreRules.addCustomQuery_)("CQFmathmlmsub", cvox.MathmlStoreUtil.checkMathjaxMsub);
    (0, cvox.MathmlStoreRules.addCustomQuery_)("CQFmathmlmsup", cvox.MathmlStoreUtil.checkMathjaxMsup);
    (0, cvox.MathmlStoreRules.addCustomQuery_)("CQFlookupleaf", cvox.MathmlStoreUtil.retrieveMathjaxLeaf)
};
cvox.MathmlStoreRules.initDefaultRules_ = function () {
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("math", "[m] ./*");
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("mspace", "[p] (pause:250)");
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("mstyle", "[m] ./*");
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("mpadded", "[m] ./*");
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("merror", "[m] ./*");
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("mphantom", "[m] ./*");
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("mtext", "[t] text(); [p] (pause:200)");
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("mi", "[n] text()");
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("mo", "[n] text() (rate:-0.1)");
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("mn", "[n] text()");
    (0, cvox.MathmlStoreRules.defineRule_)("mtext-variant", "default.default", '[t] "begin"; [t] @mathvariant (pause:150);[t] text() (pause:150); [t] "end"; [t] @mathvariant (pause:200)', "self::mathml:mtext", "@mathvariant", '@mathvariant!="normal"');
    (0, cvox.MathmlStoreRules.defineRule_)("mi-variant", "default.default", "[t] @mathvariant; [n] text()", "self::mathml:mi", "@mathvariant", '@mathvariant!="normal"');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mi-variant", "self::mathml:mn", "@mathvariant", '@mathvariant!="normal"');
    (0, cvox.MathmlStoreRules.defineRule_)("mo-variant", "default.default", "[t] @mathvariant; [n] text() (rate:-0.1)", "self::mathml:mo", "@mathvariant", '@mathvariant!="normal"');
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("ms", '[t] "string" (pitch:0.5, rate:0.5); [t] text()');
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("msup", '[n] ./*[1]; [t] "super";[n] ./*[2] (pitch:0.35); [p] (pause:300)');
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("msubsup", '[n] ./*[1]; [t] "sub"; [n] ./*[2] (pitch:-0.35); [p] (pause:200);[t] "super"; [n] ./*[3] (pitch:0.35); [p] (pause:300)');
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("msub", '[n] ./*[1]; [t] "sub"; [n] ./*[2] (pitch:-0.35); [p] (pause:300)');
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("mover", '[n] ./*[2] (pitch:0.35); [p] (pause:200); [t] "over"; [n] ./*[1]; [p] (pause:400)');
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("munder", '[n] ./*[2] (pitch:-0.35); [t] "under"; [n] ./*[1]; [p] (pause:400)');
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("munderover", '[n] ./*[2] (pitch:-0.35); [t] "under and"; [n] ./*[3] (pitch:0.35); [t] "over"; [n] ./*[1]; [p] (pause:400)');
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("mrow", "[m] ./*");
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("msqrt", '[t] "Square root of"; [m] ./* (rate:0.2); [p] (pause:400)');
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("mroot", '[t] "root of order"; [n] ./*[2]; [t] "of";[n] ./*[1] (rate:0.2); [p] (pause:400)');
    (0, cvox.MathmlStoreRules.defineDefaultMathmlRule_)("mfrac", ' [p] (pause:400); [n] ./*[1] (pitch:0.3); [t] "divided by"; [n] ./*[2] (pitch:-0.3); [p] (pause:400)');
    (0, cvox.MathmlStoreRules.defineRule_)("mfenced-single", "default.default", '[t] @open (context:"opening"); [m] ./* (separator:@separators);[t] @close (context:"closing")', "self::mathml:mfenced", "string-length(string(@separators))=1");
    (0, cvox.MathmlStoreRules.defineRule_)("mfenced-empty", "default.default", '[t] @open (context:"opening"); [m] ./*;[t] @close (context:"closing")', "self::mathml:mfenced", "string-length(string(@separators))=1", 'string(@separators)=" "');
    (0, cvox.MathmlStoreRules.defineRule_)("mfenced-comma", "default.default", '[t] @open (context:"opening"); [m] ./* (separator:"comma");[t] @close (context:"closing")', "self::mathml:mfenced");
    (0, cvox.MathmlStoreRules.defineRule_)("mfenced-multi", "default.default", '[t] @open (context:"opening"); [m] ./* (sepFunc:CTXFmfSeparators,separator:@separators); [t] @close (context:"closing")', "self::mathml:mfenced", "string-length(string(@separators))>1");
    (0, cvox.MathmlStoreRules.defineRule_)("mtable", "default.default", '[t] "matrix"; [m] ./* (ctxtFunc:CTXFnodeCounter,context:"row",pause:100)', "self::mathml:mtable");
    (0, cvox.MathmlStoreRules.defineRule_)("mtr", "default.default", '[m] ./* (ctxtFunc:CTXFnodeCounter,context:"column",pause:100)', "self::mathml:mtr");
    (0, cvox.MathmlStoreRules.defineRule_)("mtd", "default.default", "[m] ./*", "self::mathml:mtd");
    (0, cvox.MathmlStoreRules.defineRule_)("mtable", "default.superbrief", '[t] count(child::mathml:mtr);  [t] "by";[t] count(child::mathml:mtr[1]/mathml:mtd); [t] "matrix";', "self::mathml:mtable");
    (0, cvox.MathmlStoreRules.defineRule_)("mtable", "default.short", '[t] "matrix"; [m] ./*', "self::mathml:mtable");
    (0, cvox.MathmlStoreRules.defineRule_)("mtr", "default.short", "[m] ./*", "self::mathml:mtr");
    (0, cvox.MathmlStoreRules.defineRule_)("mtd", "default.short", '[t] "Element"; [t] count(./preceding-sibling::mathml:mtd)+1;[t] count(./parent::mathml:mtr/preceding-sibling::mathml:mtr)+1;[p] (pause:500); [m] ./*', "self::mathml:mtd");
    (0, cvox.MathmlStoreRules.defineRule_)("mmultiscripts-4", "default.default", '[n] ./*[1]; [p] (pause:200);[t] "left sub"; [n] ./*[5] (pitch:-0.35); [p] (pause:200);[t] "left super"; [n] ./*[6] (pitch:0.35); [p] (pause:200);[t] "right sub"; [n] ./*[2] (pitch:-0.35); [p] (pause:200);[t] "right super"; [n] ./*[3] (pitch:0.35); [p] (pause:300);', "self::mathml:mmultiscripts");
    (0, cvox.MathmlStoreRules.defineRule_)("mmultiscripts-3-1", "default.default", '[n] ./*[1]; [p] (pause:200);[t] "left sub"; [n] ./*[5] (pitch:-0.35); [p] (pause:200);[t] "left super"; [n] ./*[6] (pitch:0.35); [p] (pause:200);[t] "right super"; [n] ./*[3] (pitch:0.35); [p] (pause:300);', "self::mathml:mmultiscripts", "./mathml:none=./*[2]", "./mathml:mprescripts=./*[4]");
    (0, cvox.MathmlStoreRules.defineRule_)("mmultiscripts-3-2", "default.default", '[n] ./*[1]; [p] (pause:200);[t] "left sub"; [n] ./*[5] (pitch:-0.35); [p] (pause:200);[t] "left super"; [n] ./*[6] (pitch:0.35); [p] (pause:200);[t] "right sub"; [n] ./*[2] (pitch:-0.35); [p] (pause:200);', "self::mathml:mmultiscripts", "./mathml:none=./*[3]", "./mathml:mprescripts=./*[4]");
    (0, cvox.MathmlStoreRules.defineRule_)("mmultiscripts-3-3", "default.default", '[n] ./*[1]; [p] (pause:200);[t] "left super"; [n] ./*[6] (pitch:0.35); [p] (pause:200);[t] "right sub"; [n] ./*[2] (pitch:-0.35); [p] (pause:200);[t] "right super"; [n] ./*[3] (pitch:0.35); [p] (pause:300);', "self::mathml:mmultiscripts", "./mathml:none=./*[5]", "./mathml:mprescripts=./*[4]");
    (0, cvox.MathmlStoreRules.defineRule_)("mmultiscripts-3-4", "default.default", '[n] ./*[1]; [p] (pause:200);[t] "left sub"; [n] ./*[5] (pitch:-0.35); [p] (pause:200);[t] "right sub"; [n] ./*[2] (pitch:-0.35); [p] (pause:200);[t] "right super"; [n] ./*[3] (pitch:0.35); [p] (pause:300);', "self::mathml:mmultiscripts", "./mathml:none=./*[6]", "./mathml:mprescripts=./*[4]");
    (0, cvox.MathmlStoreRules.defineRule_)("mmultiscripts-2-1", "default.default", '[n] ./*[1]; [p] (pause:200);[t] "left sub"; [n] ./*[5] (pitch:-0.35); [p] (pause:200);[t] "left super"; [n] ./*[6] (pitch:0.35); [p] (pause:300);', "self::mathml:mmultiscripts", "./mathml:none=./*[2]", "./mathml:none=./*[3]", "./mathml:mprescripts=./*[4]");
    (0, cvox.MathmlStoreRules.defineRule_)("mmultiscripts-1-1", "default.default", '[n] ./*[1]; [p] (pause:200);[t] "left super"; [n] ./*[6] (pitch:0.35); [p] (pause:300);', "self::mathml:mmultiscripts", "./mathml:none=./*[2]", "./mathml:none=./*[3]", "./mathml:mprescripts=./*[4]", "./mathml:none=./*[5]");
    (0, cvox.MathmlStoreRules.defineRule_)("mmultiscripts-1-2", "default.default", '[n] ./*[1]; [p] (pause:200);[t] "left sub"; [n] ./*[5] (pitch:-0.35); [p] (pause:200);', "self::mathml:mmultiscripts", "./mathml:none=./*[2]", "./mathml:none=./*[3]", "./mathml:mprescripts=./*[4]", "./mathml:none=./*[6]")
};
cvox.MathmlStoreRules.initMathjaxRules_ = function () {
    (0, cvox.MathmlStoreRules.defineRule_)("mj-math", "default.default", "[n] ./*[1]/*[1]/*[1]", 'self::span[@class="math"]');
    (0, cvox.MathmlStoreRules.defineRule_)("mj-leaf", "default.default", "[n] CQFlookupleaf", 'self::span[@class="mi"]');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-leaf", 'self::span[@class="mo"]');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-leaf", 'self::span[@class="mn"]');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-leaf", 'self::span[@class="mtext"]');
    (0, cvox.MathmlStoreRules.defineRule_)("mj-mo-ext", "default.default", "[n] CQFextender", 'self::span[@class="mo"]', "./*[1]/*[1]/text()", "./*[1]/*[2]/text()");
    (0, cvox.MathmlStoreRules.defineRule_)("mj-texatom", "default.default", "[n] ./*[1]", 'self::span[@class="texatom"]');
    (0, cvox.MathmlStoreRules.defineRule_)("mj-msubsup", "default.default", '[n] ./*[1]/*[1]/*[1]; [t] "sub"; [n] ./*[1]/*[3]/*[1] (pitch:-0.35);[p] (pause:200); [t] "super"; [n] ./*[1]/*[2]/*[1] (pitch:0.35);[p] (pause:300)', 'self::span[@class="msubsup"]');
    (0, cvox.MathmlStoreRules.defineRule_)("mj-msub", "default.default", '[n] ./*[1]/*[1]/*[1]; [t] "sub";[n] ./*[1]/*[2]/*[1] (pitch:-0.35); [p] (pause:300)', 'self::span[@class="msub"]');
    (0, cvox.MathmlStoreRules.defineRule_)("mj-msup", "default.default", '[n] ./*[1]/*[1]/*[1]; [t] "super";[n] ./*[1]/*[2]/*[1] (pitch:0.35); [p] (pause:300)', 'self::span[@class="msup"]');
    (0, cvox.MathmlStoreRules.defineRule_)("mj-munderover", "default.default", '[n] ./*[1]/*[2]/*[1] (pitch:0.35); [t] "under and";[n] ./*[1]/*[3]/*[1] (pitch:-0.35); [t] "over";[n] ./*[1]/*[1]/*[1]; [p] (pause:400)', 'self::span[@class="munderover"]');
    (0, cvox.MathmlStoreRules.defineRule_)("mj-munder", "default.default", '[n] ./*[1]/*[2]/*[1] (pitch:0.35); [t] "under";[n] ./*[1]/*[1]/*[1]; [p] (pause:400)', 'self::span[@class="munder"]');
    (0, cvox.MathmlStoreRules.defineRule_)("mj-mover", "default.default", '[n] ./*[1]/*[2]/*[1] (pitch:0.35); [t] "over";[n] ./*[1]/*[1]/*[1]; [p] (pause:400)', 'self::span[@class="mover"]');
    (0, cvox.MathmlStoreRules.defineRule_)("mj-mfrac", "default.default", '[p] (pause:250); [n] ./*[1]/*[1]/*[1] (pitch:0.3); [p] (pause:250); [t] "divided by"; [n] ./*[1]/*[2]/*[1] (pitch:-0.3);[p] (pause:400)', 'self::span[@class="mfrac"]');
    (0, cvox.MathmlStoreRules.defineRule_)("mj-msqrt", "default.default", '[t] "Square root of";[n] ./*[1]/*[1]/*[1] (rate:0.2); [p] (pause:400)', 'self::span[@class="msqrt"]');
    (0, cvox.MathmlStoreRules.defineRule_)("mj-mroot", "default.default", '[t] "root of order"; [n] ./*[1]/*[4]/*[1]; [t] "of";[n] ./*[1]/*[1]/*[1] (rate:0.2); [p] (pause:400)', 'self::span[@class="mroot"]');
    (0, cvox.MathmlStoreRules.defineRule_)("mj-mfenced", "default.default", '[t] "opening"; [n] ./*[1]; [m] ./*[position()>1 and position()<last()]; [t] "closing"; [n] ./*[last()]', 'self::span[@class="mfenced"]');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-leaf", 'self::span[@class="mtable"]');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-leaf", 'self::span[@class="mmultiscripts"]')
};
cvox.MathmlStoreRules.initAliases_ = function () {
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mspace", 'self::span[@class="mspace"]');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mstyle", 'self::span[@class="mstyle"]');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mpadded", 'self::span[@class="mpadded"]');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("merror", 'self::span[@class="merror"]');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mphantom", 'self::span[@class="mphantom"]');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("ms", 'self::span[@class="ms"]');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mrow", 'self::span[@class="mrow"]');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-msub", 'self::span[@class="msubsup"]', "CQFmathmlmsub");
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-msup", 'self::span[@class="msubsup"]', "CQFmathmlmsup");
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-munder", 'self::span[@class="munderover"]', "CQFmathmlmunder");
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-mover", 'self::span[@class="munderover"]', "CQFmathmlmover")
};
cvox.MathmlStoreRules.initSpecializationRules_ = function () {
    (0, cvox.MathmlStoreRules.defineRule_)("square", "default.default", '[n] ./*[1]; [t] "square" (pitch:0.35); [p] (pause:300)', "self::mathml:msup", "./*[2][text()=2]");
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("square", "self::mathml:msup", "./mathml:mrow=./*[2]", "count(./*[2]/*)=1", "./*[2]/*[1][text()=2]");
    (0, cvox.MathmlStoreRules.defineRule_)("cube", "default.default", '[n] ./*[1]; [t] "cube" (pitch:0.35); [p] (pause:300)', "self::mathml:msup", "./*[2][text()=3]");
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("cube", "self::mathml:msup", "./mathml:mrow=./*[2]", "count(./*[2]/*)=1", "./*[2]/*[1][text()=3]");
    (0, cvox.MathmlStoreRules.defineRule_)("square-sub", "default.default", '[n] ./*[1]; [t] "sub"; [n] ./*[2] (pitch:-0.35);[p] (pause:300); [t] "square" (pitch:0.35); [p] (pause:400)', "self::mathml:msubsup", "./*[3][text()=2]");
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("square-sub", "self::mathml:msubsup", "./mathml:mrow=./*[3]", "count(./*[3]/*)=1", "./*[3]/*[1][text()=2]");
    (0, cvox.MathmlStoreRules.defineRule_)("cube-sub", "default.default", '[n] ./*[1]; [t] "sub"; [n] ./*[2] (pitch:-0.35);[p] (pause:300); [t] "cube" (pitch:0.35); [p] (pause:400)', "self::mathml:msubsup", "./*[3][text()=3]");
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("cube-sub", "self::mathml:msubsup", "./mathml:mrow=./*[3]", "count(./*[3]/*)=1", "./*[3]/*[1][text()=3]");
    (0, cvox.MathmlStoreRules.defineRule_)("mj-square", "default.default", '[n] ./*[1]/*[1]/*[1]; [t] "square" (pitch:0.35); [p] (pause:300)', 'self::span[@class="msup"]', "./*[1]/*[2]/*[1][text()=2]");
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-square", 'self::span[@class="msup"]', './*[1]/*[2]/*[1]=./*[1]/*[2]/span[@class="mrow"]', "count(./*[1]/*[2]/*[1]/*)=1", "./*[1]/*[2]/*[1]/*[1][text()=2]");
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-square", 'self::span[@class="msubsup"]', "CQFmathmlmsup", "./*[1]/*[2]/*[1][text()=2]");
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-square", 'self::span[@class="msubsup"]', "CQFmathmlmsup", './*[1]/*[2]/*[1]=./*[1]/*[2]/span[@class="mrow"]', "count(./*[1]/*[2]/*[1]/*)=1", "./*[1]/*[2]/*[1]/*[1][text()=2]");
    (0, cvox.MathmlStoreRules.defineRule_)("mj-cube", "default.default", '[n] ./*[1]/*[1]/*[1]; [t] "cube" (pitch:0.35); [p] (pause:300)', 'self::span[@class="msup"]', "./*[1]/*[2]/*[1][text()=3]");
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-cube", 'self::span[@class="msup"]', './*[1]/*[2]/*[1]=./*[1]/*[2]/span[@class="mrow"]', "count(./*[1]/*[2]/*[1]/*)=1", "./*[1]/*[2]/*[1]/*[1][text()=3]");
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-cube", 'self::span[@class="msubsup"]', "CQFmathmlmsup", "./*[1]/*[2]/*[1][text()=3]");
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-cube", 'self::span[@class="msubsup"]', "CQFmathmlmsup", './*[1]/*[2]/*[1]=./*[1]/*[2]/span[@class="mrow"]', "count(./*[1]/*[2]/*[1]/*)=1", "./*[1]/*[2]/*[1]/*[1][text()=3]");
    (0, cvox.MathmlStoreRules.defineRule_)("mj-square-sub", "default.default", '[n] ./*[1]/*[1]/*[1]; [t] "sub"; [n] ./*[1]/*[3]/*[1] (pitch:-0.35); [p] (pause:300); [t] "square" (pitch:0.35); [p] (pause:400)', 'self::span[@class="msubsup"]', "./*[1]/*[2]/*[1][text()=2]");
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-square-sub", 'self::span[@class="msubsup"]', './*[1]/*[2]/*[1]=./*[1]/*[2]/span[@class="mrow"]', "count(./*[1]/*[2]/*[1]/*)=1", "./*[1]/*[2]/*[1]/*[1][text()=2]");
    (0, cvox.MathmlStoreRules.defineRule_)("mj-cube-sub", "default.default", '[n] ./*[1]/*[1]/*[1]; [t] "sub"; [n] ./*[1]/*[3]/*[1] (pitch:-0.35); [p] (pause:300); [t] "cube" (pitch:0.35); [p] (pause:400)', 'self::span[@class="msubsup"]', "./*[1]/*[2]/*[1][text()=3]");
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("mj-cube-sub", 'self::span[@class="msubsup"]', './*[1]/*[2]/*[1]=./*[1]/*[2]/span[@class="mrow"]', "count(./*[1]/*[2]/*[1]/*)=1", "./*[1]/*[2]/*[1]/*[1][text()=3]")
};
cvox.MathmlStoreRules.initSemanticRules_ = function () {
    (0, cvox.MathmlStoreRules.defineRule_)("stree", "default.default", "[n] ./*[1]", "self::stree");
    (0, cvox.MathmlStoreRules.defineRule_)("multrel", "default.default", '[t] "multirelation"; [m] children/* (sepFunc:CTXFcontentIterator)', "self::multirel");
    (0, cvox.MathmlStoreRules.defineRule_)("variable-equality", "default.default", '[t] "equation sequence"; [m] ./children/* (context:"part",ctxtFunc:CTXFnodeCounter,separator:./text())', 'self::relseq[@role="equality"]', "count(./children/*)>2", './children/punct[@role="ellipsis"]');
    (0, cvox.MathmlStoreRules.defineRule_)("multi-equality", "default.default", '[t] "equation sequence"; [m] ./children/* (context:"part",ctxtFunc:CTXFnodeCounter,separator:./text())', 'self::relseq[@role="equality"]', "count(./children/*)>2");
    (0, cvox.MathmlStoreRules.defineRule_)("multi-equality", "default.short", '[t] "equation sequence"; [m] ./children/* (separator:./text())', 'self::relseq[@role="equality"]', "count(./children/*)>2");
    (0, cvox.MathmlStoreRules.defineRule_)("equality", "default.default", '[t] "equation"; [t] "left hand side"; [n] children/*[1];[p] (pause:200); [n] text() (pause:200);[t] "right hand side"; [n] children/*[2]', 'self::relseq[@role="equality"]', "count(./children/*)=2");
    (0, cvox.MathmlStoreRules.defineRule_)("simple-equality", "default.default", "[n] children/*[1]; [p] (pause:200); [n] text() (pause:200);[n] children/*[2]", 'self::relseq[@role="equality"]', "count(./children/*)=2", "./children/identifier or ./children/number");
    (0, cvox.MathmlStoreRules.defineRule_)("simple-equality2", "default.default", "[n] children/*[1]; [p] (pause:200); [n] text() (pause:200);[n] children/*[2]", 'self::relseq[@role="equality"]', "count(./children/*)=2", "./children/function or ./children/appl");
    (0, cvox.MathmlStoreRules.defineRule_)("multrel", "default.default", "[m] children/* (separator:./text())", "self::relseq");
    (0, cvox.MathmlStoreRules.defineRule_)("binary-operation", "default.default", "[m] children/* (separator:text());", "self::infixop");
    (0, cvox.MathmlStoreRules.defineRule_)("variable-addition", "default.default", '[t] "sum with variable number of summands";[p] (pause:400); [m] children/* (separator:./text())', 'self::infixop[@role="addition"]', "count(children/*)>2", 'children/punct[@role="ellipsis"]');
    (0, cvox.MathmlStoreRules.defineRule_)("multi-addition", "default.default", '[t] "sum with,"; [t] count(./children/*); [t] ", summands";[p] (pause:400); [m] ./children/* (separator:./text())', 'self::infixop[@role="addition"]', "count(./children/*)>2");
    (0, cvox.MathmlStoreRules.defineRule_)("prefix", "default.default", '[t] "prefix"; [n] text(); [t] "of" (pause 150);[n] children/*[1]', "self::prefixop");
    (0, cvox.MathmlStoreRules.defineRule_)("negative", "default.default", '[t] "negative"; [n] children/*[1]', "self::prefixop", 'self::prefixop[@role="negative"]');
    (0, cvox.MathmlStoreRules.defineRule_)("postfix", "default.default", '[n] children/*[1]; [t] "postfix"; [n] text() (pause 300)', "self::postfixop");
    (0, cvox.MathmlStoreRules.defineRule_)("identifier", "default.default", "[n] text()", "self::identifier");
    (0, cvox.MathmlStoreRules.defineRule_)("number", "default.default", "[n] text()", "self::number");
    (0, cvox.MathmlStoreRules.defineRule_)("fraction", "default.default", '[p] (pause:250); [n] children/*[1] (pitch:0.3); [p] (pause:250); [t] "divided by"; [n] children/*[2] (pitch:-0.3); [p] (pause:400)', "self::fraction");
    (0, cvox.MathmlStoreRules.defineRule_)("superscript", "default.default", '[n] children/*[1]; [t] "super"; [n] children/*[2] (pitch:0.35);[p] (pause:300)', "self::superscript");
    (0, cvox.MathmlStoreRules.defineRule_)("subscript", "default.default", '[n] children/*[1]; [t] "sub"; [n] children/*[2] (pitch:-0.35);[p] (pause:300)', "self::subscript");
    (0, cvox.MathmlStoreRules.defineRule_)("ellipsis", "default.default", '[p] (pause:200); [t] "dot dot dot"; [p] (pause:300)', "self::punct", 'self::punct[@role="ellipsis"]');
    (0, cvox.MathmlStoreRules.defineRule_)("fence-single", "default.default", "[n] text()", "self::punct", 'self::punct[@role="openfence"]');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("fence-single", "self::punct", 'self::punct[@role="closefence"]');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("fence-single", "self::punct", 'self::punct[@role="vbar"]');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("fence-single", "self::punct", 'self::punct[@role="application"]');
    (0, cvox.MathmlStoreRules.defineRule_)("omit-punct", "default.default", "[p] (pause:200);", "self::punct");
    (0, cvox.MathmlStoreRules.defineRule_)("omit-empty", "default.default", "", "self::empty");
    (0, cvox.MathmlStoreRules.defineRule_)("fences-open-close", "default.default", '[p] (pause:100); [t] "open"; [n] children/*[1]; [p] (pause:200);[t] "close"', 'self::fenced[@role="leftright"]');
    (0, cvox.MathmlStoreRules.defineRule_)("fences-open-close-in-appl", "default.default", "[p] (pause:100); [n] children/*[1]; [p] (pause:200);", 'self::fenced[@role="leftright"]', "./parent::children/parent::appl");
    (0, cvox.MathmlStoreRules.defineRule_)("fences-neutral", "default.default", '[p] (pause:100); [t] "absolute value of"; [n] children/*[1];[p] (pause:350);', "self::fenced", 'self::fenced[@role="neutral"]');
    (0, cvox.MathmlStoreRules.defineRule_)("omit-fences", "default.default", "[p] (pause:500); [n] children/*[1]; [p] (pause:200);", "self::fenced");
    (0, cvox.MathmlStoreRules.defineRule_)("matrix", "default.default", '[t] "matrix"; [m] children/* (ctxtFunc:CTXFnodeCounter,context:"row",pause:100)', "self::matrix");
    (0, cvox.MathmlStoreRules.defineRule_)("matrix-row", "default.default", '[m] children/* (ctxtFunc:CTXFnodeCounter,context:"column",pause:100)', 'self::row[@role="matrix"]');
    (0, cvox.MathmlStoreRules.defineRule_)("matrix-cell", "default.default", "[n] children/*[1]", 'self::cell[@role="matrix"]');
    (0, cvox.MathmlStoreRules.defineRule_)("vector", "default.default", '[t] "vector"; [m] children/* (ctxtFunc:CTXFnodeCounter,context:"element",pause:100)', "self::vector");
    (0, cvox.MathmlStoreRules.defineRule_)("cases", "default.default", '[t] "case statement"; [m] children/* (ctxtFunc:CTXFnodeCounter,context:"case",pause:100)', "self::cases");
    (0, cvox.MathmlStoreRules.defineRule_)("cases-row", "default.default", "[m] children/*", 'self::row[@role="cases"]');
    (0, cvox.MathmlStoreRules.defineRule_)("cases-cell", "default.default", "[n] children/*[1]", 'self::cell[@role="cases"]');
    (0, cvox.MathmlStoreRules.defineRule_)("row", "default.default", '[m] ./* (ctxtFunc:CTXFnodeCounter,context:"column",pause:100)', 'self::row"');
    (0, cvox.MathmlStoreRules.defineRule_)("cases-end", "default.default", '[t] "case statement"; [m] children/* (ctxtFunc:CTXFnodeCounter,context:"case",pause:100);[t] "end cases"', "self::cases", "following-sibling::*");
    (0, cvox.MathmlStoreRules.defineRule_)("multiline", "default.default", '[t] "multiline equation";[m] children/* (ctxtFunc:CTXFnodeCounter,context:"line",pause:100)', "self::multiline");
    (0, cvox.MathmlStoreRules.defineRule_)("line", "default.default", "[m] children/*", "self::line");
    (0, cvox.MathmlStoreRules.defineRule_)("table", "default.default", '[t] "multiline equation";[m] children/* (ctxtFunc:CTXFnodeCounter,context:"row",pause:200)', "self::table");
    (0, cvox.MathmlStoreRules.defineRule_)("table-row", "default.default", "[m] children/* (pause:100)", 'self::row[@role="table"]');
    (0, cvox.MathmlStoreRules.defineRuleAlias_)("cases-cell", 'self::cell[@role="table"]');
    (0, cvox.MathmlStoreRules.defineRule_)("end-punct", "default.default", "[m] children/*; [p] (pause:300)", "self::punctuated", '@role="endpunct"');
    (0, cvox.MathmlStoreRules.defineRule_)("start-punct", "default.default", "[n] content/*[1]; [p] (pause:200); [m] children/*", "self::punctuated", '@role="startpunct"');
    (0, cvox.MathmlStoreRules.defineRule_)("integral-punct", "default.default", "[n] children/*[1] (rate:0.2); [n] children/*[3] (rate:0.2)", "self::punctuated", '@role="integral"');
    (0, cvox.MathmlStoreRules.defineRule_)("punctuated", "default.default", "[m] children/* (pause:100)", "self::punctuated");
    (0, cvox.MathmlStoreRules.defineRule_)("function", "default.default", "[n] text()", "self::function");
    (0, cvox.MathmlStoreRules.defineRule_)("appl", "default.default", "[n] children/*[1]; [n] content/*[1]; [n] children/*[2]", "self::appl");
    (0, cvox.MathmlStoreRules.defineRule_)("limboth", "default.default", '[n] children/*[1]; [t] "from"; [n] children/*[2]; [t] "to";[n] children/*[3]', "self::limboth");
    (0, cvox.MathmlStoreRules.defineRule_)("sum-only", "default.default", '[n] children/*[1]; [p] (pause 100); [t] "over"; [n] children/*[2];[p] (pause 250);', "self::limboth", 'self::limboth[@role="sum"]');
    (0, cvox.MathmlStoreRules.defineRule_)("limlower", "default.default", '[n] children/*[1]; [t] "over"; [n] children/*[2];', "self::limlower");
    (0, cvox.MathmlStoreRules.defineRule_)("limupper", "default.default", '[n] children/*[1]; [t] "under"; [n] children/*[2];', "self::limupper");
    (0, cvox.MathmlStoreRules.defineRule_)("largeop", "default.default", "[n] text()", "self::largeop");
    (0, cvox.MathmlStoreRules.defineRule_)("bigop", "default.default", '[n] children/*[1]; [p] (pause 100); [t] "over"; [n] children/*[2];[p] (pause 250);', "self::bigop");
    (0, cvox.MathmlStoreRules.defineRule_)("integral", "default.default", "[n] children/*[1]; [p] (pause 100); [n] children/*[2]; [p] (pause 200);[n] children/*[3] (rate:0.35);", "self::integral");
    (0, cvox.MathmlStoreRules.defineRule_)("sqrt", "default.default", '[t] "Square root of"; [n] children/*[1] (rate:0.2); [p] (pause:400)', "self::sqrt");
    (0, cvox.MathmlStoreRules.defineRule_)("square", "default.default", '[n] children/*[1]; [t] "square" (pitch:0.35); [p] (pause:300)', "self::superscript", "children/*[2][text()=2]");
    (0, cvox.MathmlStoreRules.defineRule_)("text-no-mult", "default.default", "[n] children/*[1]; [p] (pause:200); [n] children/*[2]", "self::infixop", "children/text")
};
