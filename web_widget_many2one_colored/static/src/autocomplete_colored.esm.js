/** @odoo-module */

import {AutoComplete} from "@web/core/autocomplete/autocomplete";

const NO_COLOR = 0;

export class AutoCompleteColored extends AutoComplete {
    
}

AutoCompleteColored.template = "web_widget_many2one_colored.AutoCompleteColored";
AutoCompleteColored.props = {
    ...AutoComplete.props,
    color: {type: Number},
    inputClass: {type: String, optional: true},
};
