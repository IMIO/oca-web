/** @odoo-module */

import {onWillStart, onWillUpdateProps, useState} from "@odoo/owl";

import {many2oneField, Many2OneField} from "@web/views/fields/many2one/many2one_field";
import {Many2XAutocompleteColored} from "./many2x_autocomplete_colored.esm";
import {registry} from "@web/core/registry";
import {useService} from "@web/core/utils/hooks";

const DEFAULT_COLOR_FIELD = "color";
const COLOR_FIELD_OPTION_NAME = "color_field";
const NO_COLOR = 0;

function resIDFromProps(props) {
    const value = "value" in props ? props.value : props.record.data[props.name];
    if (!value) {
        return null;
    }
    return value[0];
}

export class Many2OneColoredField extends Many2OneField {
    static template = "web_widget_many2one_colored.Many2OneColoredField";
    static components = {
        Many2XAutocompleteColored,
    };
    setup() {
        super.setup();
        this.orm = useService("orm");
        this._colorField = this.props.colorField || DEFAULT_COLOR_FIELD;
        this.state.color = NO_COLOR;
        this._currentID = null;

        onWillStart(() => {
            return this.loadColor(resIDFromProps(this.props));
        });

        onWillUpdateProps((nextProps) => {
            return this.loadColor(resIDFromProps(nextProps));
        });
    }

    get Many2XAutocompleteProps() {
        const props = super.Many2XAutocompleteProps;
        Object.assign(props, {
            colorField: this._colorField,
            color: this._color,
        });
        return props;
    }

    async loadColor(resID) {
        if (resID === this._currentID) {
            return;
        }
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

export const many2oneColoredField = {
    ...many2oneField,
    component: Many2OneColoredField,
    extractProps: Many2OneColoredField.extractProps,
};
// This needs to be dynamic, because other modules like web_m2x_options modify
// Many2OneField.props after this.
Object.defineProperty(Many2OneColoredField, "props", {
    get: () => {
        return {
            ...Many2OneField.props,
            colorField: {type: String, optional: true},
        };
    },
});
Many2OneColoredField.extractProps = ({attrs, field}) => {
    return {
        ...Many2OneField.extractProps({attrs, field}),
        colorField: attrs.options[COLOR_FIELD_OPTION_NAME],
    };
};

registry.category("fields").add("many2one_colored", many2oneColoredField);
