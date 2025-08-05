/** @odoo-module */

import {AutoCompleteColored} from "./autocomplete_colored.esm";
import {Many2XAutocomplete} from "@web/views/fields/relational_utils";

export class Many2XAutocompleteColored extends Many2XAutocomplete {
    static props = {
        ...Many2XAutocomplete.props,
        colorField: {type: String, optional: true},
        color: {type: Number, optional: true},
    };

    get optionsSource() {
        return {
            ...super.optionsSource,
            optionTemplate: "web_widget_many2one_colored.AutoCompleteColoredOption",
        };
    }

    setup() {
        super.setup();
        this._color = this.props.color;
    }

    get inputClass() {
        return `o-autocomplete--input o_input o_many2one_colored_item_color_${
            this._color || 0
        }`;
    }

    onInput(value) {
        this._color = 0;
        return super.onInput(value);
    }

    onSelect(option, params) {
        this._color = option.color;
        return super.onSelect(option, params);
    }

    async loadOptionsSource(request) {
        const result = await super.loadOptionsSource(request);
        const ids = [];
        const idToIndex = {};
        for (let i = 0; i < result.length; ++i) {
            const option = result[i];
            if (option.value === undefined) {
                break;
            }
            ids.push(option.value);
            idToIndex[option.value] = i;
        }
        if (ids.length) {
            const records = await this.orm.read(this.props.resModel, ids, [
                this.props.colorField,
            ]);
            for (const record of records) {
                if (idToIndex[record.id] !== undefined) {
                    result[idToIndex[record.id]].color = record[this.props.colorField] || 0;
                }
            }
        }
        return result;
    }
}

Many2XAutocompleteColored.template =
    "web_widget_many2one_colored.Many2XAutocompleteColored";
Many2XAutocompleteColored.components = {
    AutoCompleteColored,
};
