/** @odoo-module */

import {onWillStart, onWillUpdateProps} from "@odoo/owl";
import {Many2OneField} from "@web/views/fields/many2one/many2one_field";
import {Many2XAutocompleteColored} from "./many2x_autocomplete_colored.esm";
import {registry} from "@web/core/registry";
import {useService} from "@web/core/utils/hooks";

const DEFAULT_COLOR_FIELD = "color";
const COLOR_FIELD_OPTION_NAME = "color_field";
const NO_COLOR = 0;

function resIDFromProps(props) {
    const value = "value" in props ? props.value : props.record.data[props.name];
    return value ? value[0] : null;
}

export class Many2OneColoredField extends Many2OneField {
    static template = "web_widget_many2one_colored.Many2OneColoredField";
    static components = {Many2XAutocompleteColored};

    // Keep dynamic so late patches to Many2OneField.props are seen
    static get props() {
        return {
            ...Many2OneField.props,
            colorField: {type: String, optional: true},
        };
    }

    static extractProps(params, dynamicInfo) {
        const base = super.extractProps(params, dynamicInfo);
        const opts = params.options ?? params.attrs?.options;
        return {
            ...base,
            colorField: opts[COLOR_FIELD_OPTION_NAME] ?? DEFAULT_COLOR_FIELD,
        };
    }

    setup() {
        super.setup();
        this.orm = useService("orm");
        this._colorField = this.props.colorField || DEFAULT_COLOR_FIELD;
        this.state.color = NO_COLOR;
        this._currentID = null;

        onWillStart(() => this.loadColor(resIDFromProps(this.props)));
        onWillUpdateProps((nextProps) => this.loadColor(resIDFromProps(nextProps)));
    }

    get Many2XAutocompleteProps() {
        const base = super.Many2XAutocompleteProps;
        return {
            ...base,
            colorField: this._colorField,
            color: this._color,
        };
    }

    async loadColor(resID) {
        if (resID === this._currentID) return;
        this._currentID = resID;

        if (resID === null) {
            this.state.color = NO_COLOR;
            return;
        }
        const records = await this.orm.read(this.relation, [resID], [this._colorField]);
        this.state.color = records[0][this._colorField];
    }

    get _color() {
        return this.state.color;
    }
}

// Copy the live base entry from the registry to keep supportedTypes/isEmptyValue/etc.
const baseMany2oneEntry = registry.category("fields").get("many2one");

registry.category("fields").add("many2one_colored", {
    ...baseMany2oneEntry,
    component: Many2OneColoredField,
});
