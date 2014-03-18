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

cvox.CommandStore = {};
cvox.CommandStore.categories = function () {
    var a = {}, b;
    for (b in cvox.CommandStore.CMD_WHITELIST) {
        var c = cvox.CommandStore.CMD_WHITELIST[b];
        c.category && (a[c.category] = !0)
    }
    b = [];
    for (var d in a) {
        b.push(d)
    }
    return b
};
cvox.CommandStore.messageForCommand = function (a) {
    return (cvox.CommandStore.CMD_WHITELIST[a] || {}).msgId
};
cvox.CommandStore.categoryForCommand = function (a) {
    return (cvox.CommandStore.CMD_WHITELIST[a] || {}).category
};
cvox.CommandStore.commandsForCategory = function (a) {
    var b = [],
        c;
    for (c in cvox.CommandStore.CMD_WHITELIST) {
        a == cvox.CommandStore.CMD_WHITELIST[c].category && b.push(c)
    }
    return b
};
cvox.CommandStore.CMD_WHITELIST = {
    toggleStickyMode: {
        announce: !1,
        msgId: "toggle_sticky_mode",
        category: "modifier_keys"
    },
    toggleKeyPrefix: {
        announce: !1,
        msgId: "prefix_key",
        category: "modifier_keys"
    },
    stopSpeech: {
        announce: !1,
        disallowContinuation: !0,
        doDefault: !0,
        msgId: "stop_speech_key",
        category: "controlling_speech"
    },
    toggleChromeVox: {
        announce: !1,
        platformFilter: cvox.PlatformFilter.WML,
        msgId: "toggle_chromevox_active",
        category: "controlling_speech"
    },
    decreaseTtsRate: {
        announce: !1,
        msgId: "decrease_tts_rate",
        category: "controlling_speech"
    },
    increaseTtsRate: {
        announce: !1,
        msgId: "increase_tts_rate",
        category: "controlling_speech"
    },
    decreaseTtsPitch: {
        announce: !1,
        msgId: "decrease_tts_pitch",
        category: "controlling_speech"
    },
    increaseTtsPitch: {
        announce: !1,
        msgId: "increase_tts_pitch",
        category: "controlling_speech"
    },
    decreaseTtsVolume: {
        announce: !1,
        msgId: "decrease_tts_volume",
        category: "controlling_speech"
    },
    increaseTtsVolume: {
        announce: !1,
        msgId: "increase_tts_volume",
        category: "controlling_speech"
    },
    cyclePunctuationEcho: {
        announce: !1,
        msgId: "cycle_punctuation_echo",
        category: "controlling_speech"
    },
    cycleTypingEcho: {
        announce: !1,
        msgId: "cycle_typing_echo",
        category: "controlling_speech"
    },
    toggleEarcons: {
        announce: !0,
        msgId: "toggle_earcons",
        category: "controlling_speech"
    },
    handleTab: {
        allowEvents: !0,
        msgId: "handle_tab_next",
        disallowContinuation: !0,
        category: "navigation"
    },
    handleTabPrev: {
        allowEvents: !0,
        msgId: "handle_tab_prev",
        disallowContinuation: !0,
        category: "navigation"
    },
    forward: {
        forward: !0,
        announce: !0,
        msgId: "forward",
        allowOOBE: !0,
        category: "navigation"
    },
    backward: {
        backward: !0,
        announce: !0,
        msgId: "backward",
        allowOOBE: !0,
        category: "navigation"
    },
    right: {
        forward: !0,
        announce: !0,
        msgId: "right",
        allowOOBE: !0,
        category: "navigation"
    },
    left: {
        backward: !0,
        announce: !0,
        msgId: "left",
        allowOOBE: !0,
        category: "navigation"
    },
    previousGranularity: {
        announce: !0,
        msgId: "previous_granularity",
        allowOOBE: !0,
        category: "navigation"
    },
    nextGranularity: {
        announce: !0,
        msgId: "next_granularity",
        allowOOBE: !0,
        category: "navigation"
    },
    previousCharacter: {
        backward: !0,
        announce: !0,
        msgId: "previous_character",
        skipInput: !0,
        category: "navigation"
    },
    nextCharacter: {
        forward: !0,
        announce: !0,
        msgId: "next_character",
        skipInput: !0,
        category: "navigation"
    },
    previousWord: {
        backward: !0,
        announce: !0,
        msgId: "previous_word",
        skipInput: !0,
        category: "navigation"
    },
    nextWord: {
        forward: !0,
        announce: !0,
        msgId: "next_word",
        skipInput: !0,
        category: "navigation"
    },
    previousLine: {
        backward: !0,
        announce: !0,
        msgId: "previous_line",
        category: "navigation"
    },
    nextLine: {
        forward: !0,
        announce: !0,
        msgId: "next_line",
        category: "navigation"
    },
    previousSentence: {
        backward: !0,
        announce: !0,
        msgId: "previous_sentence",
        skipInput: !0,
        category: "navigation"
    },
    nextSentence: {
        forward: !0,
        announce: !0,
        msgId: "next_sentence",
        skipInput: !0,
        category: "navigation"
    },
    previousObject: {
        backward: !0,
        announce: !0,
        msgId: "previous_object",
        skipInput: !0,
        category: "navigation"
    },
    nextObject: {
        forward: !0,
        announce: !0,
        msgId: "next_object",
        skipInput: !0,
        category: "navigation"
    },
    previousGroup: {
        backward: !0,
        announce: !0,
        msgId: "previous_group",
        skipInput: !0,
        category: "navigation"
    },
    nextGroup: {
        forward: !0,
        announce: !0,
        msgId: "next_group",
        skipInput: !0,
        category: "navigation"
    },
    jumpToTop: {
        forward: !0,
        announce: !0,
        msgId: "jump_to_top",
        category: "navigation"
    },
    jumpToBottom: {
        backward: !0,
        announce: !0,
        msgId: "jump_to_bottom",
        category: "navigation"
    },
    moveToStartOfLine: {
        forward: !0,
        announce: !0
    },
    moveToEndOfLine: {
        backward: !0,
        announce: !0
    },
    readFromHere: {
        forward: !0,
        announce: !1,
        msgId: "read_from_here",
        category: "navigation"
    },
    performDefaultAction: {
        disallowContinuation: !0,
        msgId: "perform_default_action",
        doDefault: !0,
        skipInput: !0,
        category: "navigation"
    },
    forceClickOnCurrentItem: {
        announce: !0,
        disallowContinuation: !0,
        allowEvents: !0,
        msgId: "force_click_on_current_item",
        category: "navigation"
    },
    forceDoubleClickOnCurrentItem: {
        announce: !0,
        allowEvents: !0,
        disallowContinuation: !0
    },
    readLinkURL: {
        announce: !1,
        msgId: "read_link_url",
        category: "information"
    },
    readCurrentTitle: {
        announce: !1,
        msgId: "read_current_title",
        category: "information"
    },
    readCurrentURL: {
        announce: !1,
        msgId: "read_current_url",
        category: "information"
    },
    fullyDescribe: {
        announce: !1,
        msgId: "fully_describe",
        category: "information"
    },
    speakTimeAndDate: {
        announce: !1,
        msgId: "speak_time_and_date",
        category: "information"
    },
    toggleSelection: {
        announce: !0,
        msgId: "toggle_selection",
        category: "information"
    },
    toggleSearchWidget: {
        announce: !1,
        disallowContinuation: !0,
        msgId: "toggle_search_widget",
        allowOOBE: !0,
        category: "information"
    },
    toggleKeyboardHelp: {
        announce: !1,
        disallowContinuation: !0,
        msgId: "show_power_key",
        allowOOBE: !0,
        category: "help_commands"
    },
    help: {
        announce: !1,
        msgId: "help",
        disallowContinuation: !0,
        category: "help_commands"
    },
    contextMenu: {
        announce: !1,
        disallowContinuation: !0
    },
    showOptionsPage: {
        announce: !1,
        disallowContinuation: !0,
        msgId: "show_options_page",
        category: "help_commands"
    },
    showKbExplorerPage: {
        announce: !1,
        disallowContinuation: !0,
        msgId: "show_kb_explorer_page",
        category: "help_commands"
    },
    showFormsList: {
        announce: !1,
        disallowContinuation: !0,
        nodeList: "formField",
        msgId: "show_forms_list",
        category: "overview"
    },
    showHeadingsList: {
        announce: !1,
        nodeList: "heading",
        disallowContinuation: !0,
        msgId: "show_headings_list",
        category: "overview"
    },
    showLandmarksList: {
        announce: !1,
        nodeList: "landmark",
        disallowContinuation: !0,
        msgId: "show_landmarks_list",
        category: "overview"
    },
    showLinksList: {
        announce: !1,
        nodeList: "link",
        disallowContinuation: !0,
        msgId: "show_links_list",
        category: "overview"
    },
    showTablesList: {
        announce: !1,
        nodeList: "table",
        disallowContinuation: !0,
        msgId: "show_tables_list",
        category: "overview"
    },
    startHistoryRecording: {
        announce: !1
    },
    stopHistoryRecording: {
        announce: !1
    },
    enableConsoleTts: {
        announce: !1
    },
    autorunner: {
        announce: !1
    },
    nextArticle: {
        forward: !0,
        findNext: "article"
    },
    nextButton: {
        forward: !0,
        findNext: "button",
        msgId: "next_button",
        category: "jump_commands"
    },
    nextCheckbox: {
        forward: !0,
        findNext: "checkbox",
        msgId: "next_checkbox",
        category: "jump_commands"
    },
    nextComboBox: {
        forward: !0,
        findNext: "combobox",
        msgId: "next_combo_box",
        category: "jump_commands"
    },
    nextControl: {
        forward: !0,
        findNext: "control"
    },
    nextEditText: {
        forward: !0,
        findNext: "editText",
        msgId: "next_edit_text",
        category: "jump_commands"
    },
    nextFormField: {
        forward: !0,
        findNext: "formField",
        msgId: "next_form_field",
        category: "jump_commands"
    },
    nextGraphic: {
        forward: !0,
        findNext: "graphic",
        msgId: "next_graphic",
        category: "jump_commands"
    },
    nextHeading: {
        forward: !0,
        findNext: "heading",
        msgId: "next_heading",
        category: "jump_commands"
    },
    nextHeading1: {
        forward: !0,
        findNext: "heading1",
        msgId: "next_heading1",
        category: "jump_commands"
    },
    nextHeading2: {
        forward: !0,
        findNext: "heading2",
        msgId: "next_heading2",
        category: "jump_commands"
    },
    nextHeading3: {
        forward: !0,
        findNext: "heading3",
        msgId: "next_heading3",
        category: "jump_commands"
    },
    nextHeading4: {
        forward: !0,
        findNext: "heading4",
        msgId: "next_heading4",
        category: "jump_commands"
    },
    nextHeading5: {
        forward: !0,
        findNext: "heading5",
        msgId: "next_heading5",
        category: "jump_commands"
    },
    nextHeading6: {
        forward: !0,
        findNext: "heading6",
        msgId: "next_heading6",
        category: "jump_commands"
    },
    nextLandmark: {
        forward: !0,
        findNext: "landmark",
        msgId: "next_landmark",
        category: "jump_commands"
    },
    nextLink: {
        forward: !0,
        findNext: "link",
        msgId: "next_link",
        category: "jump_commands"
    },
    nextList: {
        forward: !0,
        findNext: "list",
        msgId: "next_list",
        category: "jump_commands"
    },
    nextListItem: {
        forward: !0,
        findNext: "listItem",
        msgId: "next_list_item",
        category: "jump_commands"
    },
    nextMath: {
        forward: !0,
        findNext: "math",
        msgId: "next_math",
        category: "jump_commands"
    },
    nextMedia: {
        forward: !0,
        findNext: "media",
        msgId: "next_media",
        category: "jump_commands"
    },
    nextRadio: {
        forward: !0,
        findNext: "radio",
        msgId: "next_radio",
        category: "jump_commands"
    },
    nextSection: {
        forward: !0,
        findNext: "section"
    },
    nextSlider: {
        forward: !0,
        findNext: "slider"
    },
    nextTable: {
        forward: !0,
        findNext: "table",
        msgId: "next_table",
        category: "jump_commands"
    },
    nextVisitedLink: {
        forward: !0,
        findNext: "visitedLink",
        msgId: "next_visited_link",
        category: "jump_commands"
    },
    previousArticle: {
        backward: !0,
        findNext: "article"
    },
    previousButton: {
        backward: !0,
        findNext: "button",
        msgId: "previous_button",
        category: "jump_commands"
    },
    previousCheckbox: {
        backward: !0,
        findNext: "checkbox",
        msgId: "previous_checkbox",
        category: "jump_commands"
    },
    previousComboBox: {
        backward: !0,
        findNext: "combobox",
        msgId: "previous_combo_box",
        category: "jump_commands"
    },
    previousControl: {
        backward: !0,
        findNext: "control"
    },
    previousEditText: {
        backward: !0,
        findNext: "editText",
        msgId: "previous_edit_text",
        category: "jump_commands"
    },
    previousFormField: {
        backward: !0,
        findNext: "formField",
        msgId: "previous_form_field",
        category: "jump_commands"
    },
    previousGraphic: {
        backward: !0,
        findNext: "graphic",
        msgId: "previous_graphic",
        category: "jump_commands"
    },
    previousHeading: {
        backward: !0,
        findNext: "heading",
        msgId: "previous_heading",
        category: "jump_commands"
    },
    previousHeading1: {
        backward: !0,
        findNext: "heading1",
        msgId: "previous_heading1",
        category: "jump_commands"
    },
    previousHeading2: {
        backward: !0,
        findNext: "heading2",
        msgId: "previous_heading2",
        category: "jump_commands"
    },
    previousHeading3: {
        backward: !0,
        findNext: "heading3",
        msgId: "previous_heading3",
        category: "jump_commands"
    },
    previousHeading4: {
        backward: !0,
        findNext: "heading4",
        msgId: "previous_heading4",
        category: "jump_commands"
    },
    previousHeading5: {
        backward: !0,
        findNext: "heading5",
        msgId: "previous_heading5",
        category: "jump_commands"
    },
    previousHeading6: {
        backward: !0,
        findNext: "heading6",
        msgId: "previous_heading6",
        category: "jump_commands"
    },
    previousLandmark: {
        backward: !0,
        findNext: "landmark",
        msgId: "previous_landmark",
        category: "jump_commands"
    },
    previousLink: {
        backward: !0,
        findNext: "link",
        msgId: "previous_link",
        category: "jump_commands"
    },
    previousList: {
        backward: !0,
        findNext: "list",
        msgId: "previous_list",
        category: "jump_commands"
    },
    previousListItem: {
        backward: !0,
        findNext: "listItem",
        msgId: "previous_list_item",
        category: "jump_commands"
    },
    previousMath: {
        backward: !0,
        findNext: "math",
        msgId: "previous_math",
        category: "jump_commands"
    },
    previousMedia: {
        backward: !0,
        findNext: "media",
        msgId: "previous_media",
        category: "jump_commands"
    },
    previousRadio: {
        backward: !0,
        findNext: "radio",
        msgId: "previous_radio",
        category: "jump_commands"
    },
    previousSection: {
        backward: !0,
        findNext: "section"
    },
    previousSlider: {
        backward: !0,
        findNext: "slider"
    },
    previousTable: {
        backward: !0,
        findNext: "table",
        msgId: "previous_table",
        category: "jump_commands"
    },
    previousVisitedLink: {
        backward: !0,
        findNext: "visitedLink",
        msgId: "previous_visited_link",
        category: "jump_commands"
    },
    announceHeaders: {
        announce: !1,
        msgId: "announce_headers",
        category: "tables"
    },
    speakTableLocation: {
        announce: !1,
        msgId: "speak_table_location",
        category: "tables"
    },
    goToFirstCell: {
        announce: !0,
        msgId: "skip_to_beginning",
        category: "tables"
    },
    goToLastCell: {
        announce: !0,
        msgId: "skip_to_end",
        category: "tables"
    },
    goToRowFirstCell: {
        announce: !0,
        msgId: "skip_to_row_beginning",
        category: "tables"
    },
    goToRowLastCell: {
        announce: !0,
        msgId: "skip_to_row_end",
        category: "tables"
    },
    goToColFirstCell: {
        announce: !0,
        msgId: "skip_to_col_beginning",
        category: "tables"
    },
    goToColLastCell: {
        announce: !0,
        msgId: "skip_to_col_end",
        category: "tables"
    },
    previousRow: {
        backward: !0,
        announce: !0,
        skipInput: !0
    },
    previousCol: {
        backward: !0,
        announce: !0,
        skipInput: !0
    },
    nextRow: {
        forward: !0,
        announce: !0,
        skipInput: !0
    },
    nextCol: {
        forward: !0,
        announce: !0,
        skipInput: !0
    },
    enterShifter: {
        announce: !0,
        msgId: "enter_content",
        category: "navigation"
    },
    exitShifter: {
        announce: !0,
        msgId: "exit_content",
        category: "navigation"
    },
    exitShifterContent: {
        announce: !0
    },
    openLongDesc: {
        announce: !1,
        msgId: "open_long_desc",
        category: "information"
    },
    pauseAllMedia: {
        announce: !1,
        msgId: "pause_all_media",
        category: "information"
    },
    toggleSemantics: {
        announce: !1,
        msgId: "toggle_semantics",
        category: "information"
    },
    routing: {
        announce: !0,
        msgId: "braille_routing",
        category: "braille"
    },
    pan_left: {
        backward: !0,
        announce: !0,
        msgId: "braille_pan_left",
        category: "braille"
    },
    pan_right: {
        forward: !0,
        announce: !0,
        msgId: "braille_pan_right",
        category: "braille"
    },
    line_up: {
        backward: !0,
        announce: !0,
        msgId: "braille_line_up",
        category: "braille"
    },
    line_down: {
        forward: !0,
        announce: !0,
        msgId: "braille_line_down",
        category: "braille"
    },
    top: {
        backward: !0,
        announce: !0,
        msgId: "braille_top",
        category: "braille"
    },
    bottom: {
        forward: !0,
        announce: !0,
        msgId: "braille_bottom",
        category: "braille"
    },
    debug: {
        announce: !1
    },
    nop: {
        announce: !1
    }
};
cvox.CommandStore.NODE_INFO_MAP = {
    checkbox: {
        predicate: "checkboxPredicate",
        forwardError: "no_next_checkbox",
        backwardError: "no_previous_checkbox",
        typeMsg: "aria_role_checkbox"
    },
    radio: {
        predicate: "radioPredicate",
        forwardError: "no_next_radio_button",
        backwardError: "no_previous_radio_button",
        typeMsg: "aria_role_radio"
    },
    slider: {
        predicate: "sliderPredicate",
        forwardError: "no_next_slider",
        backwardError: "no_previous_slider",
        typeMsg: "aria_role_slider"
    },
    graphic: {
        predicate: "graphicPredicate",
        forwardError: "no_next_graphic",
        backwardError: "no_previous_graphic",
        typeMsg: "UNUSED"
    },
    article: {
        predicate: "articlePredicate",
        forwardError: "no_next_ARTICLE",
        backwardError: "no_previous_ARTICLE",
        typeMsg: "TAG_ARTICLE"
    },
    button: {
        predicate: "buttonPredicate",
        forwardError: "no_next_button",
        backwardError: "no_previous_button",
        typeMsg: "aria_role_button"
    },
    combobox: {
        predicate: "comboBoxPredicate",
        forwardError: "no_next_combo_box",
        backwardError: "no_previous_combo_box",
        typeMsg: "aria_role_combobox"
    },
    editText: {
        predicate: "editTextPredicate",
        forwardError: "no_next_edit_text",
        backwardError: "no_previous_edit_text",
        typeMsg: "input_type_text"
    },
    heading: {
        predicate: "headingPredicate",
        forwardError: "no_next_heading",
        backwardError: "no_previous_heading",
        typeMsg: "aria_role_heading"
    },
    heading1: {
        predicate: "heading1Predicate",
        forwardError: "no_next_heading_1",
        backwardError: "no_previous_heading_1"
    },
    heading2: {
        predicate: "heading2Predicate",
        forwardError: "no_next_heading_2",
        backwardError: "no_previous_heading_2"
    },
    heading3: {
        predicate: "heading3Predicate",
        forwardError: "no_next_heading_3",
        backwardError: "no_previous_heading_3"
    },
    heading4: {
        predicate: "heading4Predicate",
        forwardError: "no_next_heading_4",
        backwardError: "no_previous_heading_4"
    },
    heading5: {
        predicate: "heading5Predicate",
        forwardError: "no_next_heading_5",
        backwardError: "no_previous_heading_5"
    },
    heading6: {
        predicate: "heading6Predicate",
        forwardError: "no_next_heading_6",
        backwardError: "no_previous_heading_6"
    },
    link: {
        predicate: "linkPredicate",
        forwardError: "no_next_link",
        backwardError: "no_previous_link",
        typeMsg: "aria_role_link"
    },
    table: {
        predicate: "tablePredicate",
        forwardError: "no_next_table",
        backwardError: "no_previous_table",
        typeMsg: "table_strategy"
    },
    visitedLink: {
        predicate: "visitedLinkPredicate",
        forwardError: "no_next_visited_link",
        backwardError: "no_previous_visited_link",
        typeMsg: "tag_link"
    },
    list: {
        predicate: "listPredicate",
        forwardError: "no_next_list",
        backwardError: "no_previous_list",
        typeMsg: "aria_role_list"
    },
    listItem: {
        predicate: "listItemPredicate",
        forwardError: "no_next_list_item",
        backwardError: "no_previous_list_item",
        typeMsg: "aria_role_listitem"
    },
    formField: {
        predicate: "formFieldPredicate",
        forwardError: "no_next_form_field",
        backwardError: "no_previous_form_field",
        typeMsg: "aria_role_form"
    },
    landmark: {
        predicate: "landmarkPredicate",
        forwardError: "no_next_landmark",
        backwardError: "no_previous_landmark",
        typeMsg: "role_landmark"
    },
    math: {
        predicate: "mathPredicate",
        forwardError: "no_next_math",
        backwardError: "no_previous_math",
        typeMsg: "math_expr"
    },
    media: {
        predicate: "mediaPredicate",
        forwardError: "no_next_media_widget",
        backwardError: "no_previous_media_widget"
    },
    section: {
        predicate: "sectionPredicate",
        forwardError: "no_next_section",
        backwardError: "no_previous_section"
    },
    control: {
        predicate: "controlPredicate",
        forwardError: "no_next_control",
        backwardError: "no_previous_control"
    }
};
