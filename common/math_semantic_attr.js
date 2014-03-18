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

cvox.SemanticAttr = function () {
    this.generalPunctuations = "!\"#%&'*,:;?@\\\u00a1\u00a7\u00b6\u00b7\u00bf\u2017\u2020\u2021\u2022\u2023\u2024\u2025\u2027\u2030\u2031\u2038\u203b\u203c\u203d\u203e\u2041\u2042\u2043\u2047\u2048\u2049\u204b\u204c\u204d\u204e\u204f\u2050\u2051\u2053\u2055\u2056\u2058\u2059\u205a\u205b\u205c\u205d\u205e\ufe10\ufe13\ufe14\ufe15\ufe16\ufe30\ufe45\ufe46\ufe49\ufe4a\ufe4b\ufe4c\ufe50\ufe54\ufe55\ufe56\ufe57\ufe5f\ufe60\ufe61\ufe68\ufe6a\ufe6b\uff01\uff02\uff03\uff05\uff06\uff07\uff0a\uff0c\uff0f\uff1a\uff1b\uff1f\uff20\uff3c".split("");
    this.invisibleComma_ = cvox.SemanticUtil.numberToUnicode(8291);
    this.generalPunctuations.push(this.invisibleComma_);
    this.ellipses = "\u2026\u22ee\u22ef\u22f0\u22f1\ufe19".split("");
    this.fullStops = [".", "\ufe52", "\uff0e"];
    this.dashes = "\u2012\u2013\u2014\u2015\u301c\ufe31\ufe32\ufe58".split("");
    this.primes = "\u2032\u2033\u2034\u2035\u2036\u2037\u2057".split("");
    this.openClosePairs = {
        "(": ")",
        "[": "]",
        "{": "}",
        "\u2045": "\u2046",
        "\u2329": "\u232a",
        "\u2768": "\u2769",
        "\u276a": "\u276b",
        "\u276c": "\u276d",
        "\u276e": "\u276f",
        "\u2770": "\u2771",
        "\u2772": "\u2773",
        "\u2774": "\u2775",
        "\u27c5": "\u27c6",
        "\u27e6": "\u27e7",
        "\u27e8": "\u27e9",
        "\u27ea": "\u27eb",
        "\u27ec": "\u27ed",
        "\u27ee": "\u27ef",
        "\u2983": "\u2984",
        "\u2985": "\u2986",
        "\u2987": "\u2988",
        "\u2989": "\u298a",
        "\u298b": "\u298c",
        "\u298d": "\u298e",
        "\u298f": "\u2990",
        "\u2991": "\u2992",
        "\u2993": "\u2994",
        "\u2995": "\u2996",
        "\u2997": "\u2998",
        "\u29d8": "\u29d9",
        "\u29da": "\u29db",
        "\u29fc": "\u29fd",
        "\u2e22": "\u2e23",
        "\u2e24": "\u2e25",
        "\u2e26": "\u2e27",
        "\u2e28": "\u2e29",
        "\u3008": "\u3009",
        "\u300a": "\u300b",
        "\u300c": "\u300d",
        "\u300e": "\u300f",
        "\u3010": "\u3011",
        "\u3014": "\u3015",
        "\u3016": "\u3017",
        "\u3018": "\u3019",
        "\u301a": "\u301b",
        "\u301d": "\u301e",
        "\ufd3e": "\ufd3f",
        "\ufe17": "\ufe18",
        "\ufe59": "\ufe5a",
        "\ufe5b": "\ufe5c",
        "\ufe5d": "\ufe5e",
        "\uff08": "\uff09",
        "\uff3b": "\uff3d",
        "\uff5b": "\uff5d",
        "\uff5f": "\uff60",
        "\uff62": "\uff63",
        "\u2308": "\u2309",
        "\u230a": "\u230b",
        "\u230c": "\u230d",
        "\u230e": "\u230f",
        "\u231c": "\u231d",
        "\u231e": "\u231f",
        "\u239b": "\u239e",
        "\u239c": "\u239f",
        "\u239d": "\u23a0",
        "\u23a1": "\u23a4",
        "\u23a2": "\u23a5",
        "\u23a3": "\u23a6",
        "\u23a7": "\u23ab",
        "\u23a8": "\u23ac",
        "\u23a9": "\u23ad",
        "\u23b0": "\u23b1",
        "\u23b8": "\u23b9"
    };
    this.topBottomPairs = {
        "\u23b4": "\u23b5",
        "\u23dc": "\u23dd",
        "\u23de": "\u23df",
        "\u23e0": "\u23e1",
        "\ufe35": "\ufe36",
        "\ufe37": "\ufe38",
        "\ufe39": "\ufe3a",
        "\ufe3b": "\ufe3c",
        "\ufe3d": "\ufe3e",
        "\ufe3f": "\ufe40",
        "\ufe41": "\ufe42",
        "\ufe43": "\ufe44",
        "\ufe47": "\ufe48"
    };
    this.leftFences = cvox.SemanticUtil.objectsToKeys(this.openClosePairs);
    this.rightFences = cvox.SemanticUtil.objectsToValues(this.openClosePairs);
    this.rightFences.push("\u301f");
    this.topFences = cvox.SemanticUtil.objectsToKeys(this.topBottomPairs);
    this.bottomFences = cvox.SemanticUtil.objectsToValues(this.topBottomPairs);
    this.neutralFences = "|\u00a6\u2016\u2758\u2980\u2af4\uffe4\uff5c".split("");
    this.fences = this.neutralFences.concat(this.leftFences, this.rightFences, this.topFences, this.bottomFences);
    this.capitalLatin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    this.smallLatin = "abcdefghijklmnopqrstuvwxyz\u0131\u0237".split("");
    this.capitalLatinFullWidth = "\uff21\uff22\uff23\uff24\uff25\uff26\uff27\uff28\uff29\uff2a\uff2b\uff2c\uff2d\uff2e\uff2f\uff30\uff31\uff32\uff33\uff34\uff35\uff36\uff37\uff38\uff39\uff3a".split("");
    this.smallLatinFullWidth = "\uff41\uff42\uff43\uff44\uff45\uff46\uff47\uff48\uff49\uff4a\uff4b\uff4c\uff4d\uff4e\uff4f\uff50\uff51\uff52\uff53\uff54\uff55\uff56\uff57\uff58\uff59\uff5a".split("");
    this.capitalLatinBold = "\ud835\udc00 \ud835\udc01 \ud835\udc02 \ud835\udc03 \ud835\udc04 \ud835\udc05 \ud835\udc06 \ud835\udc07 \ud835\udc08 \ud835\udc09 \ud835\udc0a \ud835\udc0b \ud835\udc0c \ud835\udc0d \ud835\udc0e \ud835\udc0f \ud835\udc10 \ud835\udc11 \ud835\udc12 \ud835\udc13 \ud835\udc14 \ud835\udc15 \ud835\udc16 \ud835\udc17 \ud835\udc18 \ud835\udc19".split(" ");
    this.smallLatinBold = "\ud835\udc1a \ud835\udc1b \ud835\udc1c \ud835\udc1d \ud835\udc1e \ud835\udc1f \ud835\udc20 \ud835\udc21 \ud835\udc22 \ud835\udc23 \ud835\udc24 \ud835\udc25 \ud835\udc26 \ud835\udc27 \ud835\udc28 \ud835\udc29 \ud835\udc2a \ud835\udc2b \ud835\udc2c \ud835\udc2d \ud835\udc2e \ud835\udc2f \ud835\udc30 \ud835\udc31 \ud835\udc32 \ud835\udc33".split(" ");
    this.capitalLatinItalic = "\ud835\udc34 \ud835\udc35 \ud835\udc36 \ud835\udc37 \ud835\udc38 \ud835\udc39 \ud835\udc3a \ud835\udc3b \ud835\udc3c \ud835\udc3d \ud835\udc3e \ud835\udc3f \ud835\udc40 \ud835\udc41 \ud835\udc42 \ud835\udc43 \ud835\udc44 \ud835\udc45 \ud835\udc46 \ud835\udc47 \ud835\udc48 \ud835\udc49 \ud835\udc4a \ud835\udc4b \ud835\udc4c \ud835\udc4d".split(" ");
    this.smallLatinItalic = "\ud835\udc4e \ud835\udc4f \ud835\udc50 \ud835\udc51 \ud835\udc52 \ud835\udc53 \ud835\udc54 \u210e \ud835\udc56 \ud835\udc57 \ud835\udc58 \ud835\udc59 \ud835\udc5a \ud835\udc5b \ud835\udc5c \ud835\udc5d \ud835\udc5e \ud835\udc5f \ud835\udc60 \ud835\udc61 \ud835\udc62 \ud835\udc63 \ud835\udc64 \ud835\udc65 \ud835\udc66 \ud835\udc67 \ud835\udea4 \ud835\udea5".split(" ");
    this.capitalLatinScript = "\ud835\udc9c \u212c \ud835\udc9e \ud835\udc9f \u2130 \u2131 \ud835\udca2 \u210b \u2110 \ud835\udca5 \ud835\udca6 \u2112 \u2133 \ud835\udca9 \ud835\udcaa \ud835\udcab \ud835\udcac \u211b \ud835\udcae \ud835\udcaf \ud835\udcb0 \ud835\udcb1 \ud835\udcb2 \ud835\udcb3 \ud835\udcb4 \ud835\udcb5 \u2118".split(" ");
    this.smallLatinScript = "\ud835\udcb6 \ud835\udcb7 \ud835\udcb8 \ud835\udcb9 \u212f \ud835\udcbb \u210a \ud835\udcbd \ud835\udcbe \ud835\udcbf \ud835\udcc0 \ud835\udcc1 \ud835\udcc2 \ud835\udcc3 \u2134 \ud835\udcc5 \ud835\udcc6 \ud835\udcc7 \ud835\udcc8 \ud835\udcc9 \ud835\udcca \ud835\udccb \ud835\udccc \ud835\udccd \ud835\udcce \ud835\udccf \u2113".split(" ");
    this.capitalLatinBoldScript = "\ud835\udcd0 \ud835\udcd1 \ud835\udcd2 \ud835\udcd3 \ud835\udcd4 \ud835\udcd5 \ud835\udcd6 \ud835\udcd7 \ud835\udcd8 \ud835\udcd9 \ud835\udcda \ud835\udcdb \ud835\udcdc \ud835\udcdd \ud835\udcde \ud835\udcdf \ud835\udce0 \ud835\udce1 \ud835\udce2 \ud835\udce3 \ud835\udce4 \ud835\udce5 \ud835\udce6 \ud835\udce7 \ud835\udce8 \ud835\udce9".split(" ");
    this.smallLatinBoldScript = "\ud835\udcea \ud835\udceb \ud835\udcec \ud835\udced \ud835\udcee \ud835\udcef \ud835\udcf0 \ud835\udcf1 \ud835\udcf2 \ud835\udcf3 \ud835\udcf4 \ud835\udcf5 \ud835\udcf6 \ud835\udcf7 \ud835\udcf8 \ud835\udcf9 \ud835\udcfa \ud835\udcfb \ud835\udcfc \ud835\udcfd \ud835\udcfe \ud835\udcff \ud835\udd00 \ud835\udd01 \ud835\udd02 \ud835\udd03".split(" ");
    this.capitalLatinFraktur = "\ud835\udd04 \ud835\udd05 \u212d \ud835\udd07 \ud835\udd08 \ud835\udd09 \ud835\udd0a \u210c \u2111 \ud835\udd0d \ud835\udd0e \ud835\udd0f \ud835\udd10 \ud835\udd11 \ud835\udd12 \ud835\udd13 \ud835\udd14 \u211c \ud835\udd16 \ud835\udd17 \ud835\udd18 \ud835\udd19 \ud835\udd1a \ud835\udd1b \ud835\udd1c \u2128".split(" ");
    this.smallLatinFraktur = "\ud835\udd1e \ud835\udd1f \ud835\udd20 \ud835\udd21 \ud835\udd22 \ud835\udd23 \ud835\udd24 \ud835\udd25 \ud835\udd26 \ud835\udd27 \ud835\udd28 \ud835\udd29 \ud835\udd2a \ud835\udd2b \ud835\udd2c \ud835\udd2d \ud835\udd2e \ud835\udd2f \ud835\udd30 \ud835\udd31 \ud835\udd32 \ud835\udd33 \ud835\udd34 \ud835\udd35 \ud835\udd36 \ud835\udd37".split(" ");
    this.capitalLatinDoubleStruck = "\ud835\udd38 \ud835\udd39 \u2102 \ud835\udd3b \ud835\udd3c \ud835\udd3d \ud835\udd3e \u210d \ud835\udd40 \ud835\udd41 \ud835\udd42 \ud835\udd43 \ud835\udd44 \u2115 \ud835\udd46 \u2119 \u211a \u211d \ud835\udd4a \ud835\udd4b \ud835\udd4c \ud835\udd4d \ud835\udd4e \ud835\udd4f \ud835\udd50 \u2124".split(" ");
    this.smallLatinDoubleStruck = "\ud835\udd52 \ud835\udd53 \ud835\udd54 \ud835\udd55 \ud835\udd56 \ud835\udd57 \ud835\udd58 \ud835\udd59 \ud835\udd5a \ud835\udd5b \ud835\udd5c \ud835\udd5d \ud835\udd5e \ud835\udd5f \ud835\udd60 \ud835\udd61 \ud835\udd62 \ud835\udd63 \ud835\udd64 \ud835\udd65 \ud835\udd66 \ud835\udd67 \ud835\udd68 \ud835\udd69 \ud835\udd6a \ud835\udd6b".split(" ");
    this.capitalLatinBoldFraktur = "\ud835\udd6c \ud835\udd6d \ud835\udd6e \ud835\udd6f \ud835\udd70 \ud835\udd71 \ud835\udd72 \ud835\udd73 \ud835\udd74 \ud835\udd75 \ud835\udd76 \ud835\udd77 \ud835\udd78 \ud835\udd79 \ud835\udd7a \ud835\udd7b \ud835\udd7c \ud835\udd7d \ud835\udd7e \ud835\udd7f \ud835\udd80 \ud835\udd81 \ud835\udd82 \ud835\udd83 \ud835\udd84 \ud835\udd85".split(" ");
    this.smallLatinBoldFraktur = "\ud835\udd86 \ud835\udd87 \ud835\udd88 \ud835\udd89 \ud835\udd8a \ud835\udd8b \ud835\udd8c \ud835\udd8d \ud835\udd8e \ud835\udd8f \ud835\udd90 \ud835\udd91 \ud835\udd92 \ud835\udd93 \ud835\udd94 \ud835\udd95 \ud835\udd96 \ud835\udd97 \ud835\udd98 \ud835\udd99 \ud835\udd9a \ud835\udd9b \ud835\udd9c \ud835\udd9d \ud835\udd9e \ud835\udd9f".split(" ");
    this.capitalLatinSansSerif = "\ud835\udda0 \ud835\udda1 \ud835\udda2 \ud835\udda3 \ud835\udda4 \ud835\udda5 \ud835\udda6 \ud835\udda7 \ud835\udda8 \ud835\udda9 \ud835\uddaa \ud835\uddab \ud835\uddac \ud835\uddad \ud835\uddae \ud835\uddaf \ud835\uddb0 \ud835\uddb1 \ud835\uddb2 \ud835\uddb3 \ud835\uddb4 \ud835\uddb5 \ud835\uddb6 \ud835\uddb7 \ud835\uddb8 \ud835\uddb9".split(" ");
    this.smallLatinSansSerif = "\ud835\uddba \ud835\uddbb \ud835\uddbc \ud835\uddbd \ud835\uddbe \ud835\uddbf \ud835\uddc0 \ud835\uddc1 \ud835\uddc2 \ud835\uddc3 \ud835\uddc4 \ud835\uddc5 \ud835\uddc6 \ud835\uddc7 \ud835\uddc8 \ud835\uddc9 \ud835\uddca \ud835\uddcb \ud835\uddcc \ud835\uddcd \ud835\uddce \ud835\uddcf \ud835\uddd0 \ud835\uddd1 \ud835\uddd2 \ud835\uddd3".split(" ");
    this.capitalLatinSansSerifBold = "\ud835\uddd4 \ud835\uddd5 \ud835\uddd6 \ud835\uddd7 \ud835\uddd8 \ud835\uddd9 \ud835\uddda \ud835\udddb \ud835\udddc \ud835\udddd \ud835\uddde \ud835\udddf \ud835\udde0 \ud835\udde1 \ud835\udde2 \ud835\udde3 \ud835\udde4 \ud835\udde5 \ud835\udde6 \ud835\udde7 \ud835\udde8 \ud835\udde9 \ud835\uddea \ud835\uddeb \ud835\uddec \ud835\udded".split(" ");
    this.smallLatinSansSerifBold = "\ud835\uddee \ud835\uddef \ud835\uddf0 \ud835\uddf1 \ud835\uddf2 \ud835\uddf3 \ud835\uddf4 \ud835\uddf5 \ud835\uddf6 \ud835\uddf7 \ud835\uddf8 \ud835\uddf9 \ud835\uddfa \ud835\uddfb \ud835\uddfc \ud835\uddfd \ud835\uddfe \ud835\uddff \ud835\ude00 \ud835\ude01 \ud835\ude02 \ud835\ude03 \ud835\ude04 \ud835\ude05 \ud835\ude06 \ud835\ude07".split(" ");
    this.capitalLatinSansSerifItalic = "\ud835\ude08 \ud835\ude09 \ud835\ude0a \ud835\ude0b \ud835\ude0c \ud835\ude0d \ud835\ude0e \ud835\ude0f \ud835\ude10 \ud835\ude11 \ud835\ude12 \ud835\ude13 \ud835\ude14 \ud835\ude15 \ud835\ude16 \ud835\ude17 \ud835\ude18 \ud835\ude19 \ud835\ude1a \ud835\ude1b \ud835\ude1c \ud835\ude1d \ud835\ude1e \ud835\ude1f \ud835\ude20 \ud835\ude21".split(" ");
    this.smallLatinSansSerifItalic = "\ud835\ude22 \ud835\ude23 \ud835\ude24 \ud835\ude25 \ud835\ude26 \ud835\ude27 \ud835\ude28 \ud835\ude29 \ud835\ude2a \ud835\ude2b \ud835\ude2c \ud835\ude2d \ud835\ude2e \ud835\ude2f \ud835\ude30 \ud835\ude31 \ud835\ude32 \ud835\ude33 \ud835\ude34 \ud835\ude35 \ud835\ude36 \ud835\ude37 \ud835\ude38 \ud835\ude39 \ud835\ude3a \ud835\ude3b".split(" ");
    this.capitalLatinMonospace = "\ud835\ude70 \ud835\ude71 \ud835\ude72 \ud835\ude73 \ud835\ude74 \ud835\ude75 \ud835\ude76 \ud835\ude77 \ud835\ude78 \ud835\ude79 \ud835\ude7a \ud835\ude7b \ud835\ude7c \ud835\ude7d \ud835\ude7e \ud835\ude7f \ud835\ude80 \ud835\ude81 \ud835\ude82 \ud835\ude83 \ud835\ude84 \ud835\ude85 \ud835\ude86 \ud835\ude87 \ud835\ude88 \ud835\ude89".split(" ");
    this.smallLatinMonospace = "\ud835\ude8a \ud835\ude8b \ud835\ude8c \ud835\ude8d \ud835\ude8e \ud835\ude8f \ud835\ude90 \ud835\ude91 \ud835\ude92 \ud835\ude93 \ud835\ude94 \ud835\ude95 \ud835\ude96 \ud835\ude97 \ud835\ude98 \ud835\ude99 \ud835\ude9a \ud835\ude9b \ud835\ude9c \ud835\ude9d \ud835\ude9e \ud835\ude9f \ud835\udea0 \ud835\udea1 \ud835\udea2 \ud835\udea3".split(" ");
    this.latinDoubleStruckItalic = ["\u2145", "\u2146", "\u2147", "\u2148", "\u2149"];
    this.capitalGreek = "\u0391\u0392\u0393\u0394\u0395\u0396\u0397\u0398\u0399\u039a\u039b\u039c\u039d\u039e\u039f\u03a0\u03a1\u03a3\u03a4\u03a5\u03a6\u03a7\u03a8\u03a9".split("");
    this.smallGreek = "\u03b1\u03b2\u03b3\u03b4\u03b5\u03b6\u03b7\u03b8\u03b9\u03ba\u03bb\u03bc\u03bd\u03be\u03bf\u03c0\u03c1\u03c2\u03c3\u03c4\u03c5\u03c6\u03c7\u03c8\u03c9".split("");
    this.capitalGreekBold = "\ud835\udea8 \ud835\udea9 \ud835\udeaa \ud835\udeab \ud835\udeac \ud835\udead \ud835\udeae \ud835\udeaf \ud835\udeb0 \ud835\udeb1 \ud835\udeb2 \ud835\udeb3 \ud835\udeb4 \ud835\udeb5 \ud835\udeb6 \ud835\udeb7 \ud835\udeb8 \ud835\udeba \ud835\udebb \ud835\udebc \ud835\udebd \ud835\udebe \ud835\udebf \ud835\udec0".split(" ");
    this.smallGreekBold = "\ud835\udec2 \ud835\udec3 \ud835\udec4 \ud835\udec5 \ud835\udec6 \ud835\udec7 \ud835\udec8 \ud835\udec9 \ud835\udeca \ud835\udecb \ud835\udecc \ud835\udecd \ud835\udece \ud835\udecf \ud835\uded0 \ud835\uded1 \ud835\uded2 \ud835\uded3 \ud835\uded4 \ud835\uded5 \ud835\uded6 \ud835\uded7 \ud835\uded8 \ud835\uded9 \ud835\udeda".split(" ");
    this.capitalGreekItalic = "\ud835\udee2 \ud835\udee3 \ud835\udee4 \ud835\udee5 \ud835\udee6 \ud835\udee7 \ud835\udee8 \ud835\udee9 \ud835\udeea \ud835\udeeb \ud835\udeec \ud835\udeed \ud835\udeee \ud835\udeef \ud835\udef0 \ud835\udef1 \ud835\udef2 \ud835\udef4 \ud835\udef5 \ud835\udef6 \ud835\udef7 \ud835\udef8 \ud835\udef9 \ud835\udefa".split(" ");
    this.smallGreekItalic = "\ud835\udefc \ud835\udefd \ud835\udefe \ud835\udeff \ud835\udf00 \ud835\udf01 \ud835\udf02 \ud835\udf03 \ud835\udf04 \ud835\udf05 \ud835\udf06 \ud835\udf07 \ud835\udf08 \ud835\udf09 \ud835\udf0a \ud835\udf0b \ud835\udf0c \ud835\udf0d \ud835\udf0e \ud835\udf0f \ud835\udf10 \ud835\udf11 \ud835\udf12 \ud835\udf13 \ud835\udf14".split(" ");
    this.capitalGreekSansSerifBold = "\ud835\udf56 \ud835\udf57 \ud835\udf58 \ud835\udf59 \ud835\udf5a \ud835\udf5b \ud835\udf5c \ud835\udf5d \ud835\udf5e \ud835\udf5f \ud835\udf60 \ud835\udf61 \ud835\udf62 \ud835\udf63 \ud835\udf64 \ud835\udf65 \ud835\udf66 \ud835\udf68 \ud835\udf69 \ud835\udf6a \ud835\udf6b \ud835\udf6c \ud835\udf6d \ud835\udf6e".split(" ");
    this.smallGreekSansSerifBold = "\ud835\udf70 \ud835\udf71 \ud835\udf72 \ud835\udf73 \ud835\udf74 \ud835\udf75 \ud835\udf76 \ud835\udf77 \ud835\udf78 \ud835\udf79 \ud835\udf7a \ud835\udf7b \ud835\udf7c \ud835\udf7d \ud835\udf7e \ud835\udf7f \ud835\udf80 \ud835\udf81 \ud835\udf82 \ud835\udf83 \ud835\udf84 \ud835\udf85 \ud835\udf86 \ud835\udf87 \ud835\udf88".split(" ");
    this.greekDoubleStruck = ["\u213c", "\u213d", "\u213e", "\u213f"];
    this.hebrewLetters = ["\u2135", "\u2136", "\u2137", "\u2138"];
    this.additions = "+\u00b1\u2213\u2214\u2227\u2228\u2229\u222a\u228c\u2293\u2294\u229d\u229e\u22a4\u22a5\u22ba\u22bb\u22bc\u22c4\u22ce\u22cf\u22d2\u22d3\u25b3\u25b7\u25bd\u25c1\u2a5e\u2295".split("");
    this.invisiblePlus_ = cvox.SemanticUtil.numberToUnicode(8292);
    this.additions.push(this.invisiblePlus_);
    this.multiplications = "\u2020\u2021\u2210\u2217\u2218\u2219\u2240\u229a\u229b\u22a0\u22a1\u22c5\u22c6\u22c7\u22c9\u22ca\u22cb\u22cc\u25cb".split("");
    this.invisibleTimes_ = cvox.SemanticUtil.numberToUnicode(8290);
    this.multiplications.push(this.invisibleTimes_);
    this.subtractions = "-\u2052\u207b\u208b\u2212\u2216\u2238\u2242\u2296\u229f\u2796\u2a29\u2a2a\u2a2b\u2a2c\u2a3a\u2a41\u2a6c\ufe63\uff0d\u2010\u2011".split("");
    this.divisions = "/\u00f7\u2044\u2215\u2298\u27cc\u29bc\u2a38".split("");
    this.functionApplication_ = cvox.SemanticUtil.numberToUnicode(8289);
    this.equalities = "=~\u207c\u208c\u223c\u223d\u2243\u2245\u2248\u224a\u224b\u224c\u224d\u224e\u2251\u2252\u2253\u2254\u2255\u2256\u2257\u2258\u2259\u225a\u225b\u225c\u225d\u225e\u225f\u2261\u2263\u29e4\u2a66\u2a6e\u2a6f\u2a70\u2a71\u2a72\u2a73\u2a74\u2a75\u2a76\u2a77\u2a78\u22d5\u2a6d\u2a6a\u2a6b\u2a6c\ufe66\uff1d".split("");
    this.inequalities = "<>\u2241\u2242\u2244\u2246\u2247\u2249\u224f\u2250\u2260\u2262\u2264\u2265\u2266\u2267\u2268\u2269\u226a\u226b\u226c\u226d\u226e\u226f\u2270\u2271\u2272\u2273\u2274\u2275\u2276\u2277\u2278\u2279\u227a\u227b\u227c\u227d\u227e\u227f\u2280\u2281\u22d6\u22d7\u22d8\u22d9\u22da\u22db\u22dc\u22dd\u22de\u22df\u22e0\u22e1\u22e2\u22e3\u22e4\u22e5\u22e6\u22e7\u22e8\u22e9\u2a79\u2a7a\u2a7b\u2a7c\u2a7d\u2a7e\u2a7f\u2a80\u2a81\u2a82\u2a83\u2a84\u2a85\u2a86\u2a87\u2a88\u2a89\u2a8a\u2a8b\u2a8c\u2a8d\u2a8e\u2a8f\u2a90\u2a91\u2a92\u2a93\u2a94\u2a95\u2a96\u2a97\u2a98\u2a99\u2a9a\u2a9b\u2a9c\u2a9d\u2a9e\u2a9f\u2aa0\u2aa1\u2aa2\u2aa3\u2aa4\u2aa5\u2aa6\u2aa7\u2aa8\u2aa9\u2aaa\u2aab\u2aac\u2aad\u2aae\u2aaf\u2ab0\u2ab1\u2ab2\u2ab3\u2ab4\u2ab5\u2ab6\u2ab7\u2ab8\u2ab9\u2aba\u2abb\u2abc\u2af7\u2af8\u2af9\u2afa\u29c0\u29c1\ufe64\ufe65\uff1c\uff1e".split("");
    this.relations = [];
    this.arrows = "\u2190\u2191\u2192\u2193\u2194\u2195\u2196\u2197\u2198\u2199\u219a\u219b\u219c\u219d\u219e\u219f\u21a0\u21a1\u21a2\u21a3\u21a4\u21a5\u21a6\u21a7\u21a8\u21a9\u21aa\u21ab\u21ac\u21ad\u21ae\u21af\u21b0\u21b1\u21b2\u21b3\u21b4\u21b5\u21b6\u21b7\u21b8\u21b9\u21ba\u21bb\u21c4\u21c5\u21c6\u21c7\u21c8\u21c9\u21ca\u21cd\u21ce\u21cf\u21d0\u21d1\u21d2\u21d3\u21d4\u21d5\u21d6\u21d7\u21d8\u21d9\u21da\u21db\u21dc\u21dd\u21de\u21df\u21e0\u21e1\u21e2\u21e3\u21e4\u21e5\u21e6\u21e7\u21e8\u21e9\u21ea\u21eb\u21ec\u21ed\u21ee\u21ef\u21f0\u21f1\u21f2\u21f3\u21f4\u21f5\u21f6\u21f7\u21f8\u21f9\u21fa\u21fb\u21fc\u21fd\u21fe\u21ff\u2301\u2303\u2304\u2324\u238b\u2794\u2798\u2799\u279a\u279b\u279c\u279d\u279e\u279f\u27a0\u27a1\u27a2\u27a3\u27a4\u27a5\u27a6\u27a7\u27a8\u27a9\u27aa\u27ab\u27ac\u27ad\u27ae\u27af\u27b1\u27b2\u27b3\u27b4\u27b5\u27b6\u27b7\u27b8\u27b9\u27ba\u27bb\u27bc\u27bd\u27be\u27f0\u27f1\u27f2\u27f3\u27f4\u27f5\u27f6\u27f7\u27f8\u27f9\u27fa\u27fb\u27fc\u27fd\u27fe\u27ff\u2900\u2901\u2902\u2903\u2904\u2905\u2906\u2907\u2908\u2909\u290a\u290b\u290c\u290d\u290e\u290f\u2910\u2911\u2912\u2913\u2914\u2915\u2916\u2917\u2918\u2919\u291a\u291b\u291c\u291d\u291e\u291f\u2920\u2921\u2922\u2923\u2924\u2925\u2926\u2927\u2928\u2929\u292a\u292d\u292e\u292f\u2930\u2931\u2932\u2933\u2934\u2935\u2936\u2937\u2938\u2939\u293a\u293b\u293c\u293d\u293e\u293f\u2940\u2941\u2942\u2943\u2944\u2945\u2946\u2947\u2948\u2949\u2970\u2971\u2972\u2973\u2974\u2975\u2976\u2977\u2978\u2979\u297a\u297b\u29b3\u29b4\u29bd\u29ea\u29ec\u29ed\u2a17\u2b00\u2b01\u2b02\u2b03\u2b04\u2b05\u2b06\u2b07\u2b08\u2b09\u2b0a\u2b0b\u2b0c\u2b0d\u2b0e\u2b0f\u2b10\u2b11\u2b30\u2b31\u2b32\u2b33\u2b34\u2b35\u2b36\u2b37\u2b38\u2b39\u2b3a\u2b3b\u2b3c\u2b3d\u2b3e\u2b3f\u2b40\u2b41\u2b42\u2b43\u2b44\u2b45\u2b46\u2b47\u2b48\u2b49\u2b4a\u2b4b\u2b4c\uffe9\uffea\uffeb\uffec\u21bc\u21bd\u21be\u21bf\u21c0\u21c1\u21c2\u21c3\u21cb\u21cc\u294a\u294b\u294c\u294d\u294e\u294f\u2950\u2951\u2952\u2953\u2954\u2955\u2956\u2957\u2958\u2959\u295a\u295b\u295c\u295d\u295e\u295f\u2960\u2961\u2962\u2963\u2964\u2965\u2966\u2967\u2968\u2969\u296a\u296b\u296c\u296d\u296e\u296f\u297c\u297d\u297e\u297f".split("");
    this.sumOps = "\u2140\u220f\u2210\u2211\u22c0\u22c1\u22c2\u22c3\u2a00\u2a01\u2a02\u2a03\u2a04\u2a05\u2a06\u2a07\u2a08\u2a09\u2a0a\u2a0b\u2afc\u2aff".split("");
    this.intOps = "\u222b\u222c\u222d\u222e\u222f\u2230\u2231\u2232\u2233\u2a0c\u2a0d\u2a0e\u2a0f\u2a10\u2a11\u2a12\u2a13\u2a14\u2a15\u2a16\u2a17\u2a18\u2a19\u2a1a\u2a1b\u2a1c".split("");
    this.prefixOps = ["\u2200", "\u2203"];
    this.operatorBits = "\u2320\u2321\u23b6\u23aa\u23ae\u23af\u23b2\u23b3\u23b7".split("");
    this.digitsNormal = "0123456789".split("");
    this.digitsFullWidth = "\uff10\uff11\uff12\uff13\uff14\uff15\uff16\uff17\uff18\uff19".split("");
    this.digitsBold = "\ud835\udfce \ud835\udfcf \ud835\udfd0 \ud835\udfd1 \ud835\udfd2 \ud835\udfd3 \ud835\udfd4 \ud835\udfd5 \ud835\udfd6 \ud835\udfd7".split(" ");
    this.digitsDoubleStruck = "\ud835\udfd8 \ud835\udfd9 \ud835\udfda \ud835\udfdb \ud835\udfdc \ud835\udfdd \ud835\udfde \ud835\udfdf \ud835\udfe0 \ud835\udfe1".split(" ");
    this.digitsSansSerif = "\ud835\udfe2 \ud835\udfe3 \ud835\udfe4 \ud835\udfe5 \ud835\udfe6 \ud835\udfe7 \ud835\udfe8 \ud835\udfe9 \ud835\udfea \ud835\udfeb".split(" ");
    this.digitsSansSerifBold = "\ud835\udfec \ud835\udfed \ud835\udfee \ud835\udfef \ud835\udff0 \ud835\udff1 \ud835\udff2 \ud835\udff3 \ud835\udff4 \ud835\udff5".split(" ");
    this.digitsMonospace = "\ud835\udff6 \ud835\udff7 \ud835\udff8 \ud835\udff9 \ud835\udffa \ud835\udffb \ud835\udffc \ud835\udffd \ud835\udffe \ud835\udfff".split(" ");
    this.digitsSuperscript = "\u00b2\u00b3\u00b9\u2070\u2074\u2075\u2076\u2077\u2078\u2079".split("");
    this.digitsSubscript = "\u2080\u2081\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089".split("");
    this.fractions = "\u00bc\u00bd\u00be\u2150\u2151\u2152\u2153\u2154\u2155\u2156\u2157\u2158\u2159\u215a\u215b\u215c\u215d\u215e\u215f\u2189".split("");
    this.enclosedNumbers = "\u2460\u2461\u2462\u2463\u2464\u2465\u2466\u2467\u2468\u2469\u246a\u246b\u246c\u246d\u246e\u246f\u2470\u2471\u2472\u2473\u24ea\u24eb\u24ec\u24ed\u24ee\u24ef\u24f0\u24f1\u24f2\u24f3\u24f4\u24f5\u24f6\u24f7\u24f8\u24f9\u24fa\u24fb\u24fc\u24fd\u24fe\u24ff\u2776\u2777\u2778\u2779\u277a\u277b\u277c\u277d\u277e\u277f\u2780\u2781\u2782\u2783\u2784\u2785\u2786\u2787\u2788\u2789\u278a\u278b\u278c\u278d\u278e\u278f\u2790\u2791\u2792\u2793\u3248\u3249\u324a\u324b\u324c\u324d\u324e\u324f\u3251\u3252\u3253\u3254\u3255\u3256\u3257\u3258\u3259\u325a\u325b\u325c\u325d\u325e\u325f\u32b1\u32b2\u32b3\u32b4\u32b5\u32b6\u32b7\u32b8\u32b9\u32ba\u32bb\u32bc\u32bd\u32be\u32bf".split("");
    this.fencedNumbers = "\u2474\u2475\u2476\u2477\u2478\u2479\u247a\u247b\u247c\u247d\u247e\u247f\u2480\u2481\u2482\u2483\u2484\u2485\u2486\u2487".split("");
    this.punctuatedNumbers = "\u2488 \u2489 \u248a \u248b \u248c \u248d \u248e \u248f \u2490 \u2491 \u2492 \u2493 \u2494 \u2495 \u2496 \u2497 \u2498 \u2499 \u249a \u249b \ud83c\udd00 \ud83c\udd01 \ud83c\udd02 \ud83c\udd03 \ud83c\udd04 \ud83c\udd05 \ud83c\udd06 \ud83c\udd07 \ud83c\udd08 \ud83c\udd09 \ud83c\udd0a".split(" ");
    this.digits = this.digitsNormal.concat(this.digitsFullWidth, this.digitsBold, this.digitsDoubleStruck, this.digitsSansSerif, this.digitsSansSerifBold, this.digitsMonospace);
    this.numbers = this.fractions.concat(this.digitsSuperscript, this.digitsSubscript, this.enclosedNumbers, this.fencedNumbers, this.punctuatedNumbers);
    this.allNumbers = this.digits.concat(this.numbers);
    this.trigonometricFunctions = "cos cot csc sec sin tan arccos arccot arccsc arcsec arcsin arctan".split(" ");
    this.hyperbolicFunctions = "cosh coth csch sech sinh tanh arcosh arcoth arcsch arsech arsinh artanh arccosh arccoth arccsch arcsech arcsinh arctanh".split(" ");
    this.algebraicFunctions = "deg det dim hom ker Tr tr".split(" ");
    this.elementaryFunctions = "log ln lg exp expt gcd gcd arg im re Pr".split(" ");
    this.prefixFunctions = this.trigonometricFunctions.concat(this.hyperbolicFunctions, this.algebraicFunctions, this.elementaryFunctions);
    this.limitFunctions = "inf lim liminf limsup max min sup injlim projlim".split(" ");
    this.infixFunctions = ["mod", "rem"];
    this.symbolSetToSemantic_ = [{
            set: this.generalPunctuations,
            type: cvox.SemanticAttr.Type.PUNCTUATION,
            role: cvox.SemanticAttr.Role.UNKNOWN
        }, {
            set: this.ellipses,
            type: cvox.SemanticAttr.Type.PUNCTUATION,
            role: cvox.SemanticAttr.Role.ELLIPSIS
        }, {
            set: this.fullStops,
            type: cvox.SemanticAttr.Type.PUNCTUATION,
            role: cvox.SemanticAttr.Role.FULLSTOP
        }, {
            set: this.dashes,
            type: cvox.SemanticAttr.Type.PUNCTUATION,
            role: cvox.SemanticAttr.Role.DASH
        }, {
            set: this.primes,
            type: cvox.SemanticAttr.Type.PUNCTUATION,
            role: cvox.SemanticAttr.Role.PRIME
        },
        {
            set: this.leftFences,
            type: cvox.SemanticAttr.Type.FENCE,
            role: cvox.SemanticAttr.Role.OPEN
        }, {
            set: this.rightFences,
            type: cvox.SemanticAttr.Type.FENCE,
            role: cvox.SemanticAttr.Role.CLOSE
        }, {
            set: this.topFences,
            type: cvox.SemanticAttr.Type.FENCE,
            role: cvox.SemanticAttr.Role.TOP
        }, {
            set: this.bottomFences,
            type: cvox.SemanticAttr.Type.FENCE,
            role: cvox.SemanticAttr.Role.BOTTOM
        }, {
            set: this.neutralFences,
            type: cvox.SemanticAttr.Type.FENCE,
            role: cvox.SemanticAttr.Role.NEUTRAL
        }, {
            set: this.smallLatin,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.NORMAL
        }, {
            set: this.capitalLatin,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.NORMAL
        }, {
            set: this.smallLatinFullWidth,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.NORMAL
        }, {
            set: this.capitalLatinFullWidth,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.NORMAL
        },
        {
            set: this.smallLatinBold,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.BOLD
        }, {
            set: this.capitalLatinBold,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.BOLD
        }, {
            set: this.smallLatinItalic,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.ITALIC
        }, {
            set: this.capitalLatinItalic,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.ITALIC
        }, {
            set: this.smallLatinScript,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.SCRIPT
        }, {
            set: this.capitalLatinScript,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.SCRIPT
        }, {
            set: this.smallLatinBoldScript,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.BOLDSCRIPT
        },
        {
            set: this.capitalLatinBoldScript,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.BOLDSCRIPT
        }, {
            set: this.smallLatinFraktur,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.FRAKTUR
        }, {
            set: this.capitalLatinFraktur,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.FRAKTUR
        }, {
            set: this.smallLatinDoubleStruck,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.DOUBLESTRUCK
        }, {
            set: this.capitalLatinDoubleStruck,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.DOUBLESTRUCK
        }, {
            set: this.smallLatinBoldFraktur,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.BOLDFRAKTUR
        }, {
            set: this.capitalLatinBoldFraktur,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.BOLDFRAKTUR
        }, {
            set: this.smallLatinSansSerif,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.SANSSERIF
        }, {
            set: this.capitalLatinSansSerif,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.SANSSERIF
        }, {
            set: this.smallLatinSansSerifBold,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.SANSSERIFBOLD
        },
        {
            set: this.capitalLatinSansSerifBold,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.SANSSERIFBOLD
        }, {
            set: this.smallLatinSansSerifItalic,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.SANSSERIFITALIC
        }, {
            set: this.capitalLatinSansSerifItalic,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.SANSSERIFITALIC
        }, {
            set: this.smallLatinMonospace,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.MONOSPACE
        }, {
            set: this.capitalLatinMonospace,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.MONOSPACE
        }, {
            set: this.latinDoubleStruckItalic,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.LATINLETTER,
            font: cvox.SemanticAttr.Font.DOUBLESTRUCKITALIC
        }, {
            set: this.smallGreek,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.GREEKLETTER,
            font: cvox.SemanticAttr.Font.NORMAL
        }, {
            set: this.capitalGreek,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.GREEKLETTER,
            font: cvox.SemanticAttr.Font.NORMAL
        }, {
            set: this.smallGreekBold,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.GREEKLETTER,
            font: cvox.SemanticAttr.Font.BOLD
        }, {
            set: this.capitalGreekBold,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.GREEKLETTER,
            font: cvox.SemanticAttr.Font.BOLD
        },
        {
            set: this.smallGreekItalic,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.GREEKLETTER,
            font: cvox.SemanticAttr.Font.ITALIC
        }, {
            set: this.capitalGreekItalic,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.GREEKLETTER,
            font: cvox.SemanticAttr.Font.ITALIC
        }, {
            set: this.smallGreekSansSerifBold,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.GREEKLETTER,
            font: cvox.SemanticAttr.Font.SANSSERIFBOLD
        }, {
            set: this.capitalGreekSansSerifBold,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.GREEKLETTER,
            font: cvox.SemanticAttr.Font.SANSSERIFBOLD
        }, {
            set: this.greekDoubleStruck,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.GREEKLETTER,
            font: cvox.SemanticAttr.Font.DOUBLESTRUCK
        }, {
            set: this.hebrewLetters,
            type: cvox.SemanticAttr.Type.IDENTIFIER,
            role: cvox.SemanticAttr.Role.OTHERLETTER,
            font: cvox.SemanticAttr.Font.NORMAL
        }, {
            set: this.digitsNormal,
            type: cvox.SemanticAttr.Type.NUMBER,
            role: cvox.SemanticAttr.Role.INTEGER,
            font: cvox.SemanticAttr.Font.NORMAL
        },
        {
            set: this.digitsFullWidth,
            type: cvox.SemanticAttr.Type.NUMBER,
            role: cvox.SemanticAttr.Role.INTEGER,
            font: cvox.SemanticAttr.Font.NORMAL
        }, {
            set: this.digitsBold,
            type: cvox.SemanticAttr.Type.NUMBER,
            role: cvox.SemanticAttr.Role.INTEGER,
            font: cvox.SemanticAttr.Font.BOLD
        }, {
            set: this.digitsDoubleStruck,
            type: cvox.SemanticAttr.Type.NUMBER,
            role: cvox.SemanticAttr.Role.INTEGER,
            font: cvox.SemanticAttr.Font.DOUBLESTRUCK
        }, {
            set: this.digitsSansSerif,
            type: cvox.SemanticAttr.Type.NUMBER,
            role: cvox.SemanticAttr.Role.INTEGER,
            font: cvox.SemanticAttr.Font.SANSSERIF
        }, {
            set: this.digitsSansSerifBold,
            type: cvox.SemanticAttr.Type.NUMBER,
            role: cvox.SemanticAttr.Role.INTEGER,
            font: cvox.SemanticAttr.Font.SANSSERIFBOLD
        }, {
            set: this.digitsMonospace,
            type: cvox.SemanticAttr.Type.NUMBER,
            role: cvox.SemanticAttr.Role.INTEGER,
            font: cvox.SemanticAttr.Font.MONOSPACE
        }, {
            set: this.numbers,
            type: cvox.SemanticAttr.Type.NUMBER,
            role: cvox.SemanticAttr.Role.INTEGER
        }, {
            set: this.additions,
            type: cvox.SemanticAttr.Type.OPERATOR,
            role: cvox.SemanticAttr.Role.ADDITION
        },
        {
            set: this.multiplications,
            type: cvox.SemanticAttr.Type.OPERATOR,
            role: cvox.SemanticAttr.Role.MULTIPLICATION
        }, {
            set: this.subtractions,
            type: cvox.SemanticAttr.Type.OPERATOR,
            role: cvox.SemanticAttr.Role.SUBTRACTION
        }, {
            set: this.divisions,
            type: cvox.SemanticAttr.Type.OPERATOR,
            role: cvox.SemanticAttr.Role.DIVISION
        }, {
            set: this.prefixOps,
            type: cvox.SemanticAttr.Type.PREFIXOP,
            role: cvox.SemanticAttr.Role.PREFIXFUNC
        }, {
            set: this.equalities,
            type: cvox.SemanticAttr.Type.RELATION,
            role: cvox.SemanticAttr.Role.EQUALITY
        },
        {
            set: this.inequalities,
            type: cvox.SemanticAttr.Type.RELATION,
            role: cvox.SemanticAttr.Role.INEQUALITY
        }, {
            set: this.relations,
            type: cvox.SemanticAttr.Type.RELATION,
            role: cvox.SemanticAttr.Role.UNKNOWN
        }, {
            set: this.arrows,
            type: cvox.SemanticAttr.Type.RELATION,
            role: cvox.SemanticAttr.Role.ARROW
        }, {
            set: this.sumOps,
            type: cvox.SemanticAttr.Type.LARGEOP,
            role: cvox.SemanticAttr.Role.SUM
        }, {
            set: this.intOps,
            type: cvox.SemanticAttr.Type.LARGEOP,
            role: cvox.SemanticAttr.Role.INTEGRAL
        }, {
            set: this.limitFunctions,
            type: cvox.SemanticAttr.Type.FUNCTION,
            role: cvox.SemanticAttr.Role.LIMFUNC
        }, {
            set: this.prefixFunctions,
            type: cvox.SemanticAttr.Type.FUNCTION,
            role: cvox.SemanticAttr.Role.PREFIXFUNC
        }, {
            set: this.infixFunctions,
            type: cvox.SemanticAttr.Type.OPERATOR,
            role: cvox.SemanticAttr.Role.MULTIPLICATION
        }]
};
goog.addSingletonGetter(cvox.SemanticAttr);
cvox.SemanticAttr.Type = {
    PUNCTUATION: "punctuation",
    FENCE: "fence",
    NUMBER: "number",
    IDENTIFIER: "identifier",
    TEXT: "text",
    OPERATOR: "operator",
    RELATION: "relation",
    LARGEOP: "largeop",
    FUNCTION: "function",
    ACCENT: "accent",
    FENCED: "fenced",
    FRACTION: "fraction",
    PUNCTUATED: "punctuated",
    RELSEQ: "relseq",
    MULTIREL: "multirel",
    INFIXOP: "infixop",
    PREFIXOP: "prefixop",
    POSTFIXOP: "postfixop",
    APPL: "appl",
    INTEGRAL: "integral",
    BIGOP: "bigop",
    SQRT: "sqrt",
    ROOT: "root",
    LIMUPPER: "limupper",
    LIMLOWER: "limlower",
    LIMBOTH: "limboth",
    SUBSCRIPT: "subscript",
    SUPERSCRIPT: "superscript",
    UNDERSCORE: "underscore",
    OVERSCORE: "overscore",
    TABLE: "table",
    MULTILINE: "multiline",
    MATRIX: "matrix",
    VECTOR: "vector",
    CASES: "cases",
    ROW: "row",
    LINE: "line",
    CELL: "cell",
    UNKNOWN: "unknown",
    EMPTY: "empty"
};
cvox.SemanticAttr.Role = {
    ELLIPSIS: "ellipsis",
    FULLSTOP: "fullstop",
    DASH: "dash",
    PRIME: "prime",
    VBAR: "vbar",
    OPENFENCE: "openfence",
    CLOSEFENCE: "closefence",
    APPLICATION: "application",
    OPEN: "open",
    CLOSE: "close",
    TOP: "top",
    BOTTOM: "bottom",
    NEUTRAL: "neutral",
    LATINLETTER: "latinletter",
    GREEKLETTER: "greekletter",
    OTHERLETTER: "otherletter",
    INTEGER: "integer",
    FLOAT: "float",
    OTHERNUMBER: "othernumber",
    MULTIACCENT: "multiaccent",
    OVERACCENT: "overaccent",
    UNDERACCENT: "underaccent",
    LEFTRIGHT: "leftright",
    ABOVEBELOW: "abovebelow",
    SEQUENCE: "sequence",
    ENDPUNCT: "endpunct",
    STARTPUNCT: "startpunct",
    NEGATIVE: "negative",
    NEGATION: "negation",
    MULTIOP: "multiop",
    LIMFUNC: "limit function",
    INFIXFUNC: "infix function",
    PREFIXFUNC: "prefix function",
    POSTFIXFUNC: "postfix function",
    SUM: "sum",
    INTEGRAL: "integral",
    ADDITION: "addition",
    MULTIPLICATION: "multiplication",
    DIVISION: "division",
    SUBTRACTION: "subtraction",
    IMPLICIT: "implicit",
    EQUALITY: "equality",
    INEQUALITY: "inequality",
    ELEMENT: "element",
    BINREL: "binrel",
    ARROW: "arrow",
    MULTILINE: "multiline",
    MATRIX: "matrix",
    VECTOR: "vector",
    CASES: "cases",
    TABLE: "table",
    UNKNOWN: "unknown"
};
cvox.SemanticAttr.Font = {
    BOLD: "bold",
    BOLDFRAKTUR: "bold-fraktur",
    BOLDITALIC: "bold-italic",
    BOLDSCRIPT: "bold-script",
    DOUBLESTRUCK: "double-struck",
    DOUBLESTRUCKITALIC: "double-struck-italic",
    FRAKTUR: "fraktur",
    ITALIC: "italic",
    MONOSPACE: "monospace",
    NORMAL: "normal",
    SCRIPT: "script",
    SANSSERIF: "sans-serif",
    SANSSERIFITALIC: "sans-serif-italic",
    SANSSERIFBOLD: "sans-serif-bold",
    SANSSERIFBOLDITALIC: "sans-serif-bold-italic",
    UNKNOWN: "unknown"
};
cvox.SemanticAttr.prototype.lookupType = function (a) {
    return cvox.SemanticAttr.Type.UNKNOWN
};
cvox.SemanticAttr.prototype.lookupRole = function (a) {
    return cvox.SemanticAttr.Role.UNKNOWN
};
cvox.SemanticAttr.lookupMeaning = function (a) {
    return cvox.SemanticAttr.getInstance().lookupMeaning_(a)
};
cvox.SemanticAttr.invisibleTimes = function () {
    return cvox.SemanticAttr.getInstance().invisibleTimes_
};
cvox.SemanticAttr.invisibleComma = function () {
    return cvox.SemanticAttr.getInstance().invisibleComma_
};
cvox.SemanticAttr.functionApplication = function () {
    return cvox.SemanticAttr.getInstance().functionApplication_
};
cvox.SemanticAttr.isMatchingFenceRole = function (a, b) {
    return a == cvox.SemanticAttr.Role.OPEN && b == cvox.SemanticAttr.Role.CLOSE || a == cvox.SemanticAttr.Role.NEUTRAL && b == cvox.SemanticAttr.Role.NEUTRAL || a == cvox.SemanticAttr.Role.TOP && b == cvox.SemanticAttr.Role.BOTTOM
};
cvox.SemanticAttr.isMatchingFence = function (a, b) {
    return cvox.SemanticAttr.getInstance().isMatchingFence_(a, b)
};
cvox.SemanticAttr.isOpeningFence = function (a) {
    return a == cvox.SemanticAttr.Role.OPEN || a == cvox.SemanticAttr.Role.NEUTRAL
};
cvox.SemanticAttr.isClosingFence = function (a) {
    return a == cvox.SemanticAttr.Role.CLOSE || a == cvox.SemanticAttr.Role.NEUTRAL
};
cvox.SemanticAttr.isCharacterD = function (a) {
    return -1 != "d \u2146 \uff44 \ud835\udc1d \ud835\udc51 \ud835\udcb9 \ud835\udced \ud835\udd21 \ud835\udd55 \ud835\udd89 \ud835\uddbd \ud835\uddf1 \ud835\ude25 \ud835\ude8d".split(" ").indexOf(a)
};
cvox.SemanticAttr.prototype.isMatchingFence_ = function (a, b) {
    return -1 != this.neutralFences.indexOf(a) ? a == b : this.openClosePairs[a] == b || this.topBottomPairs[a] == b
};
cvox.SemanticAttr.prototype.lookupMeaning_ = function (a) {
    for (var b = 0, c; c = this.symbolSetToSemantic_[b]; b++) {
        if (-1 != c.set.indexOf(a)) {
            return {
                role: c.role || cvox.SemanticAttr.Role.UNKNOWN,
                type: c.type || cvox.SemanticAttr.Type.UNKNOWN,
                font: c.font || cvox.SemanticAttr.Font.UNKNOWN
            }
        }
    }
    return {
        role: cvox.SemanticAttr.Role.UNKNOWN,
        type: cvox.SemanticAttr.Type.UNKNOWN,
        font: cvox.SemanticAttr.Font.UNKNOWN
    }
};
