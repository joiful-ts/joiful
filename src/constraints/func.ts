import {typeConstraintDecorator, constraintDecorator, StringOrSymbolKey, TypedPropertyDecorator} from "../core";
import {FunctionSchema, Schema} from "joi";

type AllowedPropertyTypes = Function;

export function Arity<TClass, TKey extends StringOrSymbolKey<TClass>>(n : number) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as FunctionSchema).arity(n);
    });
}

export function FuncSchema<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return typeConstraintDecorator<AllowedPropertyTypes, TClass, TKey>((Joi) => {
        return Joi.func();
    });
}

export function MaxArity<TClass, TKey extends StringOrSymbolKey<TClass>>(n : number) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as FunctionSchema).maxArity(n);
    });
}

export function MinArity<TClass, TKey extends StringOrSymbolKey<TClass>>(n : number) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as FunctionSchema).minArity(n);
    });
}
