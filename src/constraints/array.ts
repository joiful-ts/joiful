import {ArraySchema, Schema} from "joi";
import {typeConstraintDecorator, constraintDecorator, TypedPropertyDecorator, StringOrSymbolKey} from "../core";

type AllowedPropertyTypes = Array<unknown>;

export function ArraySchema<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return typeConstraintDecorator<AllowedPropertyTypes, TClass, TKey>((Joi) => {
        return Joi.array();
    });
}

/**
 * List the types allowed for the array values.
 */
export function Items<TClass, TKey extends StringOrSymbolKey<TClass>>(type : Schema, ...types : Schema[]) : TypedPropertyDecorator<TClass, TKey> {
    types = [type].concat(types);
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as ArraySchema).items(types);
    });
}

export function Length<TClass, TKey extends StringOrSymbolKey<TClass>>(limit : number) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as ArraySchema).length(limit);
    });
}

export function Max<TClass, TKey extends StringOrSymbolKey<TClass>>(limit : number) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as ArraySchema).max(limit);
    });
}

export function Min<TClass, TKey extends StringOrSymbolKey<TClass>>(limit : number) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as ArraySchema).min(limit);
    });
}

/**
 * List the types in sequence order for the array values..
 */
export function Ordered<TClass, TKey extends StringOrSymbolKey<TClass>>(...types : Schema[]) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as ArraySchema).ordered(types);
    });
}

/**
 * Allow single values to be checked against rules as if it were provided as an array.
 * enabled can be used with a falsy value to go back to the default behavior.
 */
export function Single<TClass, TKey extends StringOrSymbolKey<TClass>>(enabled? : boolean | any) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as ArraySchema).single(enabled);
    });
}

/**
 * Allow this array to be sparse. enabled can be used with a falsy value to go back to the default behavior.
 */
export function Sparse<TClass, TKey extends StringOrSymbolKey<TClass>>(enabled? : boolean | any) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as ArraySchema).sparse(enabled);
    });
}

/**
 * Requires the array values to be unique.
 */
export function Unique<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as ArraySchema).unique();
    });
}
