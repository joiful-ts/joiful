import {BooleanSchema, Schema} from "joi";
import {constraintDecorator, typeConstraintDecorator, TypedPropertyDecorator} from "../core";

type AllowedPropertyTypes = boolean;

export function BooleanSchema() : TypedPropertyDecorator<AllowedPropertyTypes> {
    return typeConstraintDecorator<AllowedPropertyTypes>((Joi) => {
        return Joi.boolean();
    });
}

export function Truthy(value : string | number, ...values : Array<string | number>) : TypedPropertyDecorator<AllowedPropertyTypes> {
    values = [value].concat(values);
    return constraintDecorator<AllowedPropertyTypes>((schema : Schema) => {
        return (schema as BooleanSchema).truthy(...values);
    });
}

export function Falsy(value : string | number, ...values : Array<string | number>) : TypedPropertyDecorator<AllowedPropertyTypes> {
    values = [value].concat(values);
    return constraintDecorator<AllowedPropertyTypes>((schema : Schema) => {
        return (schema as BooleanSchema).falsy(...values);
    });
}

export function Insensitive(enabled : boolean = true): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema : Schema) => {
            return (schema as BooleanSchema).insensitive(enabled)
    });
}
