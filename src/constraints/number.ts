import {Reference, NumberSchema, Schema} from "joi";
import {constraintDecorator, StringOrSymbolKey, typeConstraintDecorator, TypedPropertyDecorator} from "../core";

export function Greater<TClass, TKey extends StringOrSymbolKey<TClass>>(limit : number | Reference) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as NumberSchema).greater(<any>limit);
    });
}

export function Integer<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as NumberSchema).integer();
    });
}

export function Less<TClass, TKey extends StringOrSymbolKey<TClass>>(limit : number | Reference) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as NumberSchema).less(<any>limit);
    });
}

export function Max<TClass, TKey extends StringOrSymbolKey<TClass>>(limit : number | Reference) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as NumberSchema).max(<any>limit);
    });
}

export function Min<TClass, TKey extends StringOrSymbolKey<TClass>>(limit : number | Reference) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as NumberSchema).min(<any>limit);
    });
}

export function Multiple<TClass, TKey extends StringOrSymbolKey<TClass>>(base : number) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as NumberSchema).multiple(base);
    });
}

export function Negative<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as NumberSchema).negative();
    });
}

export function NumberSchema<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return typeConstraintDecorator((Joi) => {
        return Joi.number();
    });
}

export function Positive<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as NumberSchema).positive();
    });
}

export function Precision<TClass, TKey extends StringOrSymbolKey<TClass>>(limit : number) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as NumberSchema).precision(limit);
    });
}
