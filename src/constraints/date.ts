import {DateSchema, Reference, Schema} from "joi";
import {typeConstraintDecorator, constraintDecorator, TypedPropertyDecorator, StringOrSymbolKey} from "../core";

type AllowedPropertyTypes = Date | string;

export function DateSchema<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return typeConstraintDecorator<AllowedPropertyTypes, TClass, TKey>((Joi) => {
        return Joi.date();
    });
}

export function Iso<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as DateSchema).iso();
    });
}

export function Max<TClass, TKey extends StringOrSymbolKey<TClass>>(limit : number | 'now' | string | Date | Reference) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as DateSchema).max(<any>limit);
    });
}

export function Min<TClass, TKey extends StringOrSymbolKey<TClass>>(limit : number | 'now' | string | Date | Reference) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as DateSchema).min(<any>limit);
    });
}

export function Timestamp<TClass, TKey extends StringOrSymbolKey<TClass>>(type? : 'unix' | 'javascript') : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as DateSchema).timestamp(type);
    });
}
