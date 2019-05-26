import { constraintDecorator, typeConstraintDecorator, TypedPropertyDecorator } from '../core';
import { FunctionSchema, Schema } from 'joi';

type AllowedPropertyTypes = Function;

export function Arity(n: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as FunctionSchema).arity(n);
    });
}

export function FuncSchema(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return typeConstraintDecorator<AllowedPropertyTypes>((Joi) => {
        return Joi.func();
    });
}

export function MaxArity(n: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as FunctionSchema).maxArity(n);
    });
}

export function MinArity(n: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as FunctionSchema).minArity(n);
    });
}
