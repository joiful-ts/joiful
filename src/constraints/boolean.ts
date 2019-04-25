import {BooleanSchema, Schema} from "joi";
import {constraintDecorator, StringOrSymbolKey, typeConstraintDecorator, TypedPropertyDecorator} from "../core";

type AllowedPropertyTypes = boolean;

export function BooleanSchema<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return typeConstraintDecorator<AllowedPropertyTypes, TClass, TKey>((Joi) => {
        return Joi.boolean();
    });
}

export function Truthy<TClass, TKey extends StringOrSymbolKey<TClass>>(value : string | number, ...values : Array<string | number>) : TypedPropertyDecorator<TClass, TKey> {
    values = [value].concat(values);
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as BooleanSchema).truthy(...values);
    });
}

export function Falsy<TClass, TKey extends StringOrSymbolKey<TClass>>(value : string | number, ...values : Array<string | number>) : TypedPropertyDecorator<TClass, TKey> {
    values = [value].concat(values);
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as BooleanSchema).falsy(...values);
    });
}

export function Insensitive<TClass, TKey extends StringOrSymbolKey<TClass>>(enabled : boolean = true) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as BooleanSchema).insensitive(enabled);
    });
}
