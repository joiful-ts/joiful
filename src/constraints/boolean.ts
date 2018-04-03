import {BooleanSchema, Schema} from "joi";
import {constraintDecorator, typeConstraintDecorator} from "../core";

export function BooleanSchema() : PropertyDecorator {
    return typeConstraintDecorator([Boolean], (Joi) => {
        return Joi.boolean();
    });
}

export function Truthy(value : string | number, ...values : Array<string | number>) {
    values = [value].concat(values);
    return constraintDecorator([Boolean], (schema : Schema) => {
        return (schema as BooleanSchema).truthy(...values);
    });
}

export function Falsy(value : string | number, ...values : Array<string | number>) {
    values = [value].concat(values);
    return constraintDecorator([Boolean], (schema : Schema) => {
        return (schema as BooleanSchema).falsy(...values);
    });
}

export function Insensitive(enabled : boolean = true) {
    return constraintDecorator([Boolean], (schema : Schema) => {
        return (schema as BooleanSchema).insensitive(enabled);
    });
}
