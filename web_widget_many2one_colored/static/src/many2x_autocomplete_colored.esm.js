/** @odoo-module */

import {AutoCompleteColored} from "./autocomplete_colored.esm";
import {Many2XAutocomplete} from "@web/views/fields/relational_utils";

export class Many2XAutocompleteColored extends Many2XAutocomplete {
    static props = {
        ...Many2XAutocomplete.props,
        colorField: {type: String, optional: true},
        color: {type: Number, optional: true},
    };

    // Use our custom template
    get optionsSource() {
        const src = Object.create(super.optionsSource);
        src.optionTemplate = "web_widget_many2one_colored.AutoCompleteColoredOption";
        return src;
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

    // Called when the dropdown needs to load its options
    async loadOptionsSource(request) {
        const result = await super.loadOptionsSource(request);
        const ids = [];
        const idToIndex = {};
        // Get the ids for items in the dropdown
        for (let i = 0; i < result.length; ++i) {
            const option = result[i];
            // If the current option's value is undefined,
            // we are past the end of the data, and the row
            // is a "Create..." or similar row, we are done.
            if (option.value === undefined) break;
            ids.push(option.value);
            idToIndex[option.value] = i;
        }
        if (ids.length) {
            // Read colors in one ORM call
            const records = await this.orm.read(this.props.resModel, ids, [
                this.props.colorField,
            ]);
            for (const rec of records) {
                const idx = idToIndex[rec.id];
                if (idx !== undefined) {
                    result[idx].color = rec[this.props.colorField] || 0;
                }
            }
        }
        return result;
    }
}

Many2XAutocompleteColored.template =
    "web_widget_many2one_colored.Many2XAutocompleteColored";
Many2XAutocompleteColored.components = {AutoCompleteColored};
